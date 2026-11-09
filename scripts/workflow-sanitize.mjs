// Makes an n8n export safe to draw on a public page.
// Parameters hold URLs, sheet ids, prompts, addresses and keys, so none are kept. Only
// a node's name, type, position and links survive, and those are checked by findSensitive.

const SUBTITLE_PARAMETERS = ['resource', 'operation'];

// Community nodes that a clean n8n does not have would draw as a broken "?" icon.
const DRAWN_AS = { '@apify/n8n-nodes-apify.apify': 'n8n-nodes-base.httpRequest' };

// Display names only: the workflows themselves keep their own names.
const REWORDED = [
  [/ProfitView/g, 'Trusum'],
  [/Parasite Flow/g, 'Rewrite Flow'],
  [/ with Cookies/g, ''],
];

const reword = (text) => REWORDED.reduce((t, [from, to]) => t.replace(from, to), text);

const isNote = (node) => node.type === 'n8n-nodes-base.stickyNote';

/**
 * A section label is one short heading, optionally followed by the placeholder text n8n
 * fills new notes with. Anything longer is an explanation, which belongs in the summary.
 */
function sectionLabel(content = '') {
  const lines = content
    .split('\n')
    .map((line) => line.replace(/^#+\s*/, '').replace(/\*/g, '').trim())
    .filter((line) => line && !/double click/i.test(line));
  return lines.length === 1 && lines[0].length <= 60 ? lines[0] : '';
}

/** Two nodes authored on top of each other would hide a step, so the later one moves clear. */
function separateOverlaps(nodes) {
  const placed = [];
  for (const node of nodes.filter((n) => !isNote(n))) {
    const clash = placed.find((p) => Math.abs(p.position[0] - node.position[0]) < 90 && Math.abs(p.position[1] - node.position[1]) < 90);
    if (clash) node.position = [node.position[0], clash.position[1] + 140];
    placed.push(node);
  }
  return nodes;
}

export function sanitizeWorkflow(workflow) {
  const nodes = workflow.nodes
    .filter((node) => !isNote(node) || sectionLabel(node.parameters?.content))
    .map((node) => {
      if (isNote(node)) {
        const { width, height, color } = node.parameters ?? {};
        return {
          id: node.id,
          name: node.name,
          type: node.type,
          typeVersion: node.typeVersion,
          position: node.position,
          parameters: { content: `## ${reword(sectionLabel(node.parameters?.content))}`, width, height, color },
        };
      }
      const parameters = Object.fromEntries(
        SUBTITLE_PARAMETERS.filter((key) => typeof node.parameters?.[key] === 'string').map((key) => [key, node.parameters[key]]),
      );
      return {
        id: node.id,
        name: reword(node.name),
        type: DRAWN_AS[node.type] ?? node.type,
        typeVersion: DRAWN_AS[node.type] ? 4.2 : node.typeVersion,
        position: node.position,
        parameters,
      };
    });

  // Connections are keyed by node name, so a reworded name must be reworded here too.
  const connections = Object.fromEntries(
    Object.entries(workflow.connections ?? {}).map(([from, outputs]) => [
      reword(from),
      Object.fromEntries(
        Object.entries(outputs).map(([kind, lists]) => [
          kind,
          lists.map((list) => (list ?? []).map((link) => ({ node: reword(link.node), type: link.type, index: link.index }))),
        ]),
      ),
    ]),
  );

  return { name: 'Workflow', nodes: separateOverlaps(nodes), connections };
}

const SENSITIVE = [
  ['an email address', /[\w.+-]+@[\w-]+\.[\w.-]+/],
  ['an API key or token', /(Bearer\s+[\w.-]{12,}|apify_api_\w+|sk-[\w-]{16,}|AIza[\w-]{20,}|xox[abprs]-[\w-]+|eyJ[\w-]{10,}\.[\w-]{10,})/],
  ['a phone number', /\+\d[\d\s()-]{8,}\d/],
  ['a Google Sheets link', /docs\.google\.com\/spreadsheets/],
];

/** Everything a drawing can show. */
export const visibleText = (workflow) =>
  workflow.nodes.map((node) => `${node.name}\n${node.parameters?.content ?? ''}`).join('\n');

/**
 * What must never reach a public drawing, or null when the text is clean.
 * Private names are passed in, never written here: this repository is public.
 */
export function findSensitive(text, privateTerms = []) {
  const hit = SENSITIVE.find(([, pattern]) => pattern.test(text));
  if (hit) return hit[0];
  const lower = text.toLowerCase();
  return privateTerms.some((term) => lower.includes(term.toLowerCase())) ? 'a private name' : null;
}
