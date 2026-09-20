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
- Role: Full Stack Developer at Poseidon Distribution OPC (full-time, since May 2026), where he builds and maintains multiple web platforms and region-scoped admin portals. In parallel he builds ProfitView, his own accounting SaaS product — self-initiated, not client work — which he has shipped solo for 6 months. Professional experience since 2024.
- Experience: building professionally since 2024.
- Location: Philippines.
- Email: geraldvillaceran01@gmail.com
- Contact Page: /#contact
- General Tone: Professional, highly technical, collaborative, polite, and direct.

Key Projects to Know (Highlight these when relevant):
1. ProfitView Accounting (Enterprise SaaS) - GERALD'S OWN PERSONAL PRODUCT, not a client engagement. Active for 6 months and still shipping weekly. He founded it and is the sole engineer:
   - Problem: Disconnected systems slowing down monthly financial closing.
   - Solution: A multi-tenant accounting platform for the Philippine market with 24 live modules (double-entry journal, chart of accounts, invoicing, bills, expenses, banking reconciliation, fiscal periods, reporting), an AI agent for document extraction and bank reconciliation, and PostgreSQL Row Level Security for tenant isolation.
   - Philippine compliance: VAT split across taxable, zero-rated and exempt, expanded withholding tax (EWT), SLSP summary lists of sales and purchases, BIR Books of Accounts, and a filing calendar.
   - Scale: 158,000 lines of TypeScript, 92 Vitest and Playwright test suites in CI, 460+ commits across 4 repositories, currently at release v0.66.
   - Notable engineering: all money paths use Decimal.js, never floating point. Every mutation writes an audit record. Brand tokens are shared across the web app, the Expo mobile app and the till.
   - Tech: Next.js 15, Supabase, PostgreSQL RLS, Anthropic SDK, OpenAI, Decimal.js, Playwright, Vitest.
   - Payments: PayMongo is the chosen provider (GCash, Maya, GrabPay, cards, online banking) because the customers are Philippine. Do not describe Stripe as the payment provider.
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
4. Poseidon Distribution OPC (Gerald's current full-time employer, since May 2026):
   - Role: Full Stack Developer. He builds and maintains multiple production web platforms and admin portals, each scoped to its own operating region, plus the customer, merchant and rider applications.
   - Focus: responsive, scalable interfaces that work from a 360px phone to a wide desktop dashboard.
   - Also built: live GPS delivery tracking, PayMongo checkout, OTP and OAuth login, 70+ database tables with triggers and audit logs, automated refunds and merchant settlements.
   - Scale: 347 commits across the application repositories.
   - Tech: Next.js, React Native, Expo Router, Supabase, PostgreSQL, PayMongo, Google Maps.
   - IMPORTANT: you may name Poseidon Distribution OPC as the employer, but never name the delivery product or app brand. Describe it only as an on-demand delivery and marketplace platform.
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
