import { NextResponse } from 'next/server';
import { supabase } from '@/src/app/api/lib/db';

async function generateAiReply(history: { role: string; content: string }[]) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('GITHUB_TOKEN environment variable is not set. Using fallback message.');
    return "Thanks for reaching out! I've saved your message. I'm currently offline, but I'll review this and get back to you as soon as possible!";
  }

  const systemInstruction = `You are the AI assistant representing Gerald Villaceran, a modern Full Stack Software Engineer and Web Developer.
Your goal is to converse with visitors on Gerald's portfolio site, answer questions about his career, projects, and skills, capture lead interest, and help them schedule a meeting or leave a message.

About Gerald Villaceran:
- Role: Senior Full Stack Developer / Automation Engineer with 3+ years of professional experience.
- Location: Philippines.
- Email: geraldvillaceran01@gmail.com
- Contact Page: /#contact
- General Tone: Professional, highly technical, collaborative, polite, and direct.

Key Projects to Know (Highlight these when relevant):
1. ProfitView Accounting (Enterprise SaaS):
   - Problem: Disconnected systems slowing down monthly financial closing.
   - Solution: A multi-tenant operations platform with 22 modules, AI-powered extraction, RLS database separation, Stripe billing.
   - Tech: Next.js 15, Supabase, PostgreSQL, Stripe, AI Agents.
   - Impact: 40% faster closing times.
2. N8N Business Automation (Workflow Automation):
   - Problem: Repetitive CRM task entry slowing teams down.
   - Solution: Custom automated pipelines using n8n and Make linking CRM, webhooks, follow-up messages.
   - Tech: n8n, Make, Webhooks, GoHighLevel APIs.
   - Impact: 60% reduction in manual operations.
3. GHL Marketing Websites (Sales Funnels):
   - Problem: Poor user engagement and low conversions on generic landing pages.
   - Solution: Immersive marketing sites built inside GoHighLevel with custom web animations and nurture sequences.
   - Impact: 35% increase in lead captures.
4. Rundzee PH (Logistics Super-App):
   - Problem: Fragmented courier deliveries in local markets.
   - Solution: 5-app ecosystem (customer, rider, merchant, admin panel, web platform). Features live tracking, PayMongo checkout, database triggers.
   - Tech: React Native, Expo, Supabase, PostgreSQL, PayMongo.
5. Body Tracker (AI Fitness PWA):
   - Problem: Normal apps lack personalized photo nutrition analysis.
   - Solution: PWA tracking workouts, TDEE, and extracting nutrition metrics from food photos. Offline support.
   - Tech: Next.js 16, Supabase, AI/ML, IndexedDB.

Conversation Guidelines:
- Answer questions directly and concisely.
- Never make up projects or certifications that are not listed here.
- If a client wants to hire Gerald or discuss a project, encourage them to fill out the contact form at /#contact or offer to have Gerald follow up via email.
- Do not use emojis in your response, or use them very sparingly.
- Keep your answers short (2-4 sentences max) to fit in chat bubbles.`;

  try {
    const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          ...history
        ],
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 250
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GitHub Models API error response:", errText);
      throw new Error(`GitHub Models API returned status ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("Invalid GitHub Models API response structure");

    return text.trim();
  } catch (err) {
    console.error("Error generating AI response:", err);
    return "Thanks for your message! I'm processing it and Gerald will get back to you via email shortly.";
  }
}

export async function POST(req: Request) {
  try {
    const { roomId, sender, content, mediaUrl, mediaType } = await req.json();

    if (!roomId || !sender) {
      return NextResponse.json({ error: 'Missing required message parameters.' }, { status: 400 });
    }

    if (!content && !mediaUrl) {
      return NextResponse.json({ error: 'Message content or media attachment is required.' }, { status: 400 });
    }

    if (sender !== 'guest') {
      return NextResponse.json({ error: 'Invalid message sender. Admin replies must be authenticated.' }, { status: 403 });
    }

    // Insert message into database using service role (bypassing RLS)
    const { data: msgData, error: msgError } = await supabase
      .from('portfolio_chat_messages')
      .insert([
        {
          room_id: roomId,
          sender: sender,
          content: content ? content.trim() : null,
          media_url: mediaUrl || null,
          media_type: mediaType || null,
        },
      ])
      .select()
      .single();

    if (msgError) {
      console.error('Error inserting chat message:', msgError);
      return NextResponse.json({ error: 'Failed to deliver message.' }, { status: 500 });
    }

    // Update room's last activity timestamp
    const { data: roomData, error: roomUpdateError } = await supabase
      .from('portfolio_chat_rooms')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', roomId)
      .select('ai_enabled')
      .single();

    if (roomUpdateError) {
      console.error('Error updating room activity timestamp:', roomUpdateError);
    }

    // Trigger AI Auto-Reply if enabled for this room
    if (roomData?.ai_enabled) {
      // Execute asynchronously in background to return quick response to visitor
      (async () => {
        try {
          // Delay briefly to make the "typing..." transition feel natural to the visitor
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Fetch recent conversation history
          const { data: historyData } = await supabase
            .from('portfolio_chat_messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true });

          if (historyData) {
            const history = historyData.map((m: any) => ({
              role: m.sender === 'guest' ? 'user' : 'assistant',
              content: m.content || `[Sent attachment: ${m.media_type || 'media'}]`
            }));

            const aiReply = await generateAiReply(history);

            // Insert generated response as admin message
            const { error: aiMsgError } = await supabase
              .from('portfolio_chat_messages')
              .insert([
                {
                  room_id: roomId,
                  sender: 'admin',
                  content: aiReply,
                },
              ]);

            if (aiMsgError) throw aiMsgError;

            // Sync room activity timestamp for AI message
            await supabase
              .from('portfolio_chat_rooms')
              .update({ last_message_at: new Date().toISOString() })
              .eq('id', roomId);
          }
        } catch (aiErr) {
          console.error('AI Auto-reply background error:', aiErr);
        }
      })();
    }

    return NextResponse.json({ success: true, message: msgData });
  } catch (err) {
    console.error('Server error in chat/message API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
