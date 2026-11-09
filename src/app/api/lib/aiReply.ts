// Writes the chat assistant's replies with Gemini's free API.
// GitHub Models, used before, was retired on 30 July 2026.
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export const AI_NOT_CONFIGURED =
  "Thanks for reaching out! I've saved your message. I'm currently offline, but I'll review this and get back to you as soon as possible!";
export const AI_UNAVAILABLE = "Thanks for your message! I'm processing it and Gerald will get back to you via email shortly.";

/** Gemini wants the visitor to speak first and the two roles to alternate. */
function toContents(history: ChatTurn[]) {
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const turn of history) {
    const role = turn.role === 'user' ? 'user' : 'model';
    if (contents.length === 0 && role === 'model') continue;
    const last = contents[contents.length - 1];
    if (last?.role === role) last.parts.push({ text: turn.content });
    else contents.push({ role, parts: [{ text: turn.content }] });
  }
  return contents;
}

/** Never throws: a visitor gets a polite canned reply when the model cannot answer. */
export async function generateAiReply(systemInstruction: string, history: ChatTurn[]): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn('GEMINI_API_KEY is not set. Using the canned reply.');
    return AI_NOT_CONFIGURED;
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: toContents(history),
          generationConfig: { temperature: 0.7, maxOutputTokens: 250 },
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
        console.error('Gemini returned no reply text');
      } else {
        console.error(`Gemini returned status ${res.status}:`, await res.text());
        if (res.status !== 429 && res.status < 500) break; // A retry cannot fix this.
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
    }
    if (attempt === 1) await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  return AI_UNAVAILABLE;
}
