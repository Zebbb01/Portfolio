// The sanitizer decides what reaches a public picture, so its failures must be loud.
import { describe, expect, it } from 'vitest';
import { findSensitive, sanitizeWorkflow, visibleText } from '../../scripts/workflow-sanitize.mjs';

const node = (name: string, type: string, parameters: object = {}, position = [0, 0]) => ({
  id: name,
  name,
  type,
  typeVersion: 1,
  position,
  parameters,
});

const SECRET = 'https://example-private.test/hook?key=abc123';

describe('sanitizeWorkflow', () => {
  it('drops parameters and credentials, keeping only what names the step', () => {
    const raw = {
      nodes: [{ ...node('Call', 'n8n-nodes-base.httpRequest', { url: SECRET, operation: 'get' }), credentials: { httpHeaderAuth: { id: 'x' } }, webhookId: 'w' }],
      connections: {},
      meta: { instanceId: 'private' },
      pinData: { Call: [{ json: { email: 'lead@example.com' } }] },
    };

    const out = sanitizeWorkflow(raw);

    expect(JSON.stringify(out)).not.toContain(SECRET);
    expect(JSON.stringify(out)).not.toContain('lead@example.com');
    expect(JSON.stringify(out)).not.toContain('instanceId');
    expect(out.nodes[0].parameters).toEqual({ operation: 'get' });
    expect(out.nodes[0].credentials).toBeUndefined();
  });

  it('keeps a one-line section label, removes n8n placeholder text and drops explanations', () => {
    const note = 'n8n-nodes-base.stickyNote';
    const out = sanitizeWorkflow({
      nodes: [
        node('Label', note, { content: '# Follow-up Scheduler\n**Double click** to edit me. [Guide](https://docs.n8n.io)' }),
        node('Explainer', note, { content: '## Notes\nReads C:/Users/someone/private.md and posts it.' }),
      ],
      connections: {},
    });

    expect(out.nodes.map((n: { name: string }) => n.name)).toEqual(['Label']);
    expect(out.nodes[0].parameters.content).toBe('## Follow-up Scheduler');
  });

  it('applies the public product name to nodes and to the links between them', () => {
    const type = 'n8n-nodes-base.code';
    const out = sanitizeWorkflow({
      nodes: [node('ProfitView start', type), node('End', type, {}, [300, 0])],
      connections: { 'ProfitView start': { main: [[{ node: 'End', type: 'main', index: 0 }]] } },
    });

    expect(out.nodes[0].name).toBe('Trusum start');
    expect(Object.keys(out.connections)).toEqual(['Trusum start']);
  });

  it('moves a node clear of one it was authored on top of', () => {
    const type = 'n8n-nodes-base.code';
    const out = sanitizeWorkflow({ nodes: [node('A', type, {}, [100, 100]), node('B', type, {}, [110, 120])], connections: {} });

    expect(out.nodes[1].position).toEqual([110, 240]);
  });
});

describe('findSensitive', () => {
  it.each([
    ['an email address', 'Send to jane.doe@company.com'],
    ['an API key or token', 'Bearer abcdef1234567890xyz'],
    ['an API key or token', 'apify_api_0123456789'],
    ['a phone number', 'Call +63 912 345 6789'],
  ])('reports %s', (kind, text) => {
    expect(findSensitive(text)).toBe(kind);
  });

  it('reports a private name it is given, ignoring case', () => {
    expect(findSensitive('ACME order sync', ['acme'])).toBe('a private name');
    expect(findSensitive('ACME order sync')).toBeNull();
  });

  it('passes ordinary step names', () => {
    expect(findSensitive('Ask Gemini\nCard for Gerald\nWrite seen.json')).toBeNull();
  });

  it('checks note text as well as node names', () => {
    const text = visibleText({ nodes: [{ name: 'Note', parameters: { content: 'mail me at a@b.co' } }] });

    expect(findSensitive(text)).toBe('an email address');
  });
});
