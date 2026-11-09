import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AI_NOT_CONFIGURED, AI_UNAVAILABLE, generateAiReply, type ChatTurn } from './aiReply';

const history: ChatTurn[] = [
  { role: 'assistant', content: 'Welcome!' },
  { role: 'user', content: 'Hi' },
  { role: 'user', content: 'Which projects use n8n?' },
];

const reply = (text: string) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status: 200 });

const fetchMock = vi.fn<typeof fetch>();
const sentBody = (call = 0) => JSON.parse(String(fetchMock.mock.calls[call][1]?.body));

/** Runs the reply through its retry wait without really waiting. */
async function run() {
  const pending = generateAiReply('Be brief.', history);
  await vi.runAllTimersAsync();
  return pending;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('GEMINI_API_KEY', 'test-key');
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('generateAiReply', () => {
  it('sends the conversation in the shape Gemini expects and returns its text', async () => {
    fetchMock.mockResolvedValueOnce(reply('  LeadLoom and Job Hunt.  '));

    expect(await run()).toBe('LeadLoom and Job Hunt.');

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('models/gemini-flash-lite-latest:generateContent');
    expect((init?.headers as Record<string, string>)['x-goog-api-key']).toBe('test-key');
    expect(sentBody().systemInstruction.parts[0].text).toBe('Be brief.');
    // The welcome is dropped, and the visitor's two messages become one turn.
    expect(sentBody().contents).toEqual([{ role: 'user', parts: [{ text: 'Hi' }, { text: 'Which projects use n8n?' }] }]);
  });

  it('retries once when the model is busy', async () => {
    fetchMock.mockResolvedValueOnce(new Response('overloaded', { status: 503 })).mockResolvedValueOnce(reply('Back now.'));

    expect(await run()).toBe('Back now.');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries once after a network failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('socket hang up')).mockResolvedValueOnce(reply('Recovered.'));

    expect(await run()).toBe('Recovered.');
  });

  it('does not retry a request the provider rejected, and shows the visitor no raw error', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{"error":{"message":"API key not valid"}}', { status: 400 }));

    expect(await run()).toBe(AI_UNAVAILABLE);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('gives the canned reply when the model stays down or answers with nothing', async () => {
    fetchMock.mockImplementation(async () => new Response('down', { status: 500 }));
    expect(await run()).toBe(AI_UNAVAILABLE);

    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ candidates: [] }), { status: 200 }));
    expect(await run()).toBe(AI_UNAVAILABLE);
  });

  it('does not call the provider without a key', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');

    expect(await run()).toBe(AI_NOT_CONFIGURED);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
