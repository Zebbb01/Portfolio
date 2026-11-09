// Draws every n8n workflow export as a picture for the automation library, and writes
// src/data/workflows.json. To add a workflow, add a line to CATALOG and run this again.
//
// It needs a throwaway n8n in preview mode, with its own empty data folder and ports:
//   N8N_USER_FOLDER=<temp> N8N_PORT=5699 N8N_PREVIEW_MODE=true N8N_RUNNERS_BROKER_PORT=5691 \
//   NODES_EXCLUDE="[]" n8n start
// Then: node scripts/render-workflows.mjs "<Automation>/n8n" [--only=slug,slug]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { findSensitive, sanitizeWorkflow, visibleText } from './workflow-sanitize.mjs';

const N8N = process.env.N8N_PREVIEW_URL ?? 'http://127.0.0.1:5699';
const OUT_DIR = 'public/project/Automation/workflows';
const DATA_FILE = 'src/data/workflows.json';
const WIDTH = 1500;
const SCALE = 2;

// source, slug, title, category, summary, and the tools the node types cannot name.
const CATALOG = [
  ['Job Hunt/Job Hunt - Find and Score.json', 'job-hunt-find-and-score', 'Job Hunt · Find and score', 'job-search',
    'Reads eight job feeds a day, checks each new posting against my CV, and turns the fits into Trello cards with a tailored CV and cover note.', ['Gemini', 'Python']],
  ['Job Hunt/Job Hunt - Replies.json', 'job-hunt-replies', 'Job Hunt · Replies', 'job-search',
    'Matches employer emails to their cards, moves each card, puts meeting times in Philippine time, and writes the interview prep.', ['Gemini', 'Google Calendar', 'Python']],
  ['Job Hunt/Job Hunt - Read Job Alerts.json', 'job-hunt-read-alerts', 'Job Hunt · Read job alerts', 'job-search',
    'Watches the inbox for Seek, Indeed and LinkedIn alert emails and queues every job in them for scoring.', ['Gmail', 'Gemini']],
  ['Job Hunt/Job Hunt - Facebook Groups.json', 'job-hunt-facebook-groups', 'Job Hunt · Facebook groups', 'job-search',
    'Twice a day, reads the newest posts in public groups, including their photos, and queues the real job posts.', ['Apify', 'Gemini']],
  ['Job Hunt/Job Hunt - CVs for Open Cards.json', 'job-hunt-cvs', 'Job Hunt · CVs for open cards', 'job-search',
    'Run by hand: gives every open card that has no CV one tailored to that job.', ['Python']],
  ['Job Hunt/Job Hunt - Gemini fallback.json', 'job-hunt-gemini-fallback', 'Job Hunt · Gemini fallback', 'job-search',
    'A webhook that lets a local AI tool reach Gemini when its own model fails, so the key stays inside n8n.', ['Gemini']],
  ['Job Search/AI Job Tracker - Tailor Resume.json', 'ai-job-tracker', 'AI job tracker · Tailor resume', 'job-search',
    'When a job row is marked Prepare, writes a tailored resume and cover letter as Google Docs and updates the tracker.', []],
  ['Job Search/Job Search Collector.json', 'job-search-collector', 'Job search collector', 'job-search',
    'Runs a LinkedIn jobs search, keeps the relevant new postings, and adds them to a tracking sheet.', []],

  ['Scrapers/Google Maps Lead Scraper with Capability Assessment.json', 'google-maps-leads', 'Google Maps lead scraper', 'leads',
    'Finds local businesses by trade, audits each one online with AI, writes outreach scripts, and files the leads by industry.', ['OpenAI']],
  ['Scrapers/Instagram Following - Scraping & Mapping.json', 'instagram-following', 'Instagram following scraper', 'leads',
    'Saves new accounts daily, enriches each profile, reads text from images, and maps the result into a lead database.', ['OCR.space']],
  ['Scrapers/Instagram Followers - Scraping & Mapping.json', 'instagram-followers', 'Instagram followers scraper', 'leads',
    'Collects new followers every 12 hours, then enriches each profile and places it by country with AI.', []],
  ['Scrapers/Facebook Following Scraper & Mapping.json', 'facebook-following', 'Facebook following scraper', 'leads',
    'Collects new accounts daily, separates people from pages, and maps each into a lead sheet.', []],
  ['Scrapers/Twitter Following Scraper & Mapping.json', 'twitter-following', 'Twitter following scraper', 'leads',
    'Collects new accounts daily, removes those already saved, and maps each profile into a lead sheet.', []],
  ['Scrapers/Apify Puppeteer Scraper.json', 'apify-puppeteer', 'Apify Puppeteer scraper', 'leads',
    'Starts a scrape on a schedule, polls until it finishes, then cleans the results into a sheet.', ['Apify']],
  ['Scrapers/Trademe Scraper v2.json', 'trademe-scraper', 'TradeMe property scraper', 'leads',
    'Takes property searches by form or email, removes duplicate listings, and saves what a trader needs to Airtable.', ['FireCrawl']],
  ['Scrapers/Trademe Listing Filter & Analysis.json', 'trademe-filter', 'TradeMe listing filter and analysis', 'leads',
    'Pages through a property search, and has AI pull out what makes each listing a good deal, into a sheet.', ['FireCrawl']],

  ['Lead Follow-up/Instagram Following - 3 Days Follow-up & Tracker.json', 'instagram-follow-up', 'Three-day follow-up and lead tracker', 'follow-up',
    'Tracks every new lead, checks the inbox for replies, drafts messages with AI, and sends a reminder when a follow-up is due.', ['Instagram', 'OpenAI']],
  ['Lead Follow-up/AI Call Agent (Retell).json', 'ai-call-agent', 'AI call agent', 'follow-up',
    'Places an AI voice call to each lead in a sheet and records the outcome from the call webhook.', ['Retell AI']],
  ['Lead Follow-up/AI Remarks for Leads.json', 'ai-remarks-leads', 'AI audits for trade leads', 'follow-up',
    'Audits the online presence of each HVAC, plumbing and roofing lead, in a detailed and a simplified version.', ['OpenAI']],
  ['Lead Follow-up/AI Remarks Provider.json', 'ai-remarks-provider', 'AI audits for social leads', 'follow-up',
    'Reviews the website and social presence of Instagram and Facebook leads, and writes the gaps back to the sheet.', ['OpenAI']],

  ['LinkedIn/ProfitView LinkedIn Autopost.json', 'trusum-autopost', 'Trusum LinkedIn autopost', 'content',
    'Publishes the next draft with its screenshot at a weekday lunch or dinner slot, at most once a day.', ['LinkedIn', 'Playwright']],
  ['LinkedIn/ProfitView LinkedIn Editor.json', 'trusum-editor', 'Trusum LinkedIn editor', 'content',
    'Has AI review the next draft against the playbook and leaves suggestions on a Trello card. It never posts.', ['Gemini']],
  ['LinkedIn/ProfitView Alerts.json', 'trusum-alerts', 'Trusum automation alerts', 'content',
    'When a marketing workflow fails, opens one Trello card naming the failure instead of failing silently.', []],
  ['LinkedIn/YouTube to LinkedIn Posts.json', 'youtube-to-linkedin', 'YouTube to social posts', 'content',
    'Turns a YouTube transcript into posts for LinkedIn, Facebook and TikTok, from a form.', ['RapidAPI']],
  ['LinkedIn/LinkedIn Content Parasite.json', 'linkedin-research-rewrite', 'LinkedIn content research and rewrite', 'content',
    'Finds posts that perform well, researches each topic, writes a new version with AI, and publishes on a schedule.', ['Apify']],
  ['Facebook/Facebook Blog Post (multi-images).json', 'facebook-multi-image', 'Facebook multi-image posts', 'content',
    'Turns a Drive folder of photos into AI-captioned album posts, three times a week.', ['OpenAI']],
  ['Facebook/Facebook Blog Post (1 image).json', 'facebook-single-image', 'Facebook single-image posts', 'content',
    'Brands each new image, writes a caption with AI, and posts it to the page on schedule.', ['OpenAI']],
  ['Facebook/Facebook Content Creation (AI).json', 'facebook-content-ai', 'Facebook content creation', 'content',
    'Drafts posts from a form, then rewrites them from revision notes in a sheet and improves its own prompt.', []],
  ['WordPress/WordPress HVAC Blog Automation.json', 'wordpress-blog', 'WordPress blog writer', 'content',
    'Writes an SEO blog post for a home-services company from a topic and publishes it to WordPress.', ['OpenAI']],

  ['Gmail/Gmail Email Manager - Auto Filter & Draft Reply.json', 'gmail-email-manager', 'Gmail manager and reply drafts', 'inbox',
    'Sorts every new email into labels and leaves a reply draft in the thread when one is needed.', []],
  ['Gmail/Gmail Automation (AI Agent).json', 'email-brief-to-images', 'Email brief to image concepts', 'inbox',
    'Reads a client brief from email, plans three design concepts with AI, generates the images, and logs them in a sheet.', []],
  ['Slack/Slack Task Management.json', 'slack-task-management', 'Slack task management', 'inbox',
    'Turns Slack mentions into tasks in Notion and a sheet, and sends a reminder three days before each is due.', []],
  ['Slack/Daily Schedule Automation.json', 'slack-mentions-to-tasks', 'Slack mentions to tasks', 'inbox',
    'Turns each Slack mention into a task with a description and a due date, and posts it back to the channel.', ['OpenAI']],
].map(([source, slug, title, category, summary, extraTools]) => ({ source, slug, title, category, summary, extraTools }));

const TOOL_NAMES = {
  'n8n-nodes-base.googleSheets': 'Google Sheets',
  'n8n-nodes-base.googleSheetsTrigger': 'Google Sheets',
  'n8n-nodes-base.googleDrive': 'Google Drive',
  'n8n-nodes-base.googleDriveTrigger': 'Google Drive',
  'n8n-nodes-base.googleDocs': 'Google Docs',
  'n8n-nodes-base.gmail': 'Gmail',
  'n8n-nodes-base.gmailTrigger': 'Gmail',
  'n8n-nodes-base.emailReadImap': 'IMAP',
  'n8n-nodes-base.emailSend': 'SMTP',
  'n8n-nodes-base.trello': 'Trello',
  'n8n-nodes-base.slack': 'Slack',
  'n8n-nodes-base.slackTrigger': 'Slack',
  'n8n-nodes-base.notion': 'Notion',
  'n8n-nodes-base.airtable': 'Airtable',
  'n8n-nodes-base.wordpress': 'WordPress',
  'n8n-nodes-base.linkedIn': 'LinkedIn',
  'n8n-nodes-base.facebookGraphApi': 'Facebook',
  '@apify/n8n-nodes-apify.apify': 'Apify',
  '@n8n/n8n-nodes-langchain.lmChatOpenAi': 'OpenAI',
  '@n8n/n8n-nodes-langchain.openAi': 'OpenAI',
};

const TRIGGERS = {
  'n8n-nodes-base.scheduleTrigger': 'schedule',
  'n8n-nodes-base.manualTrigger': 'manual',
  'n8n-nodes-base.webhook': 'event',
  'n8n-nodes-base.formTrigger': 'event',
  'n8n-nodes-base.gmailTrigger': 'event',
  'n8n-nodes-base.googleSheetsTrigger': 'event',
  'n8n-nodes-base.googleDriveTrigger': 'event',
  'n8n-nodes-base.slackTrigger': 'event',
  'n8n-nodes-base.emailReadImap': 'event',
  'n8n-nodes-base.errorTrigger': 'event',
};

const unique = (list) => [...new Set(list)];

// Names under NDA stay on this machine; a run without them would skip that check silently.
const SETTINGS = path.join(os.homedir(), '.n8n-files/job-hunt/settings.json');
const privateTerms = JSON.parse(fs.readFileSync(SETTINGS, 'utf8')).cockpit?.ndaTerms;
if (!privateTerms?.length) throw new Error(`No private terms found in ${SETTINGS}.`);

// Everything around the graph is hidden, and the background matches the cards it sits on.
const CLEAN_CANVAS = `
  [data-test-id="canvas-controls"], [data-test-id="canvas-minimap"], [data-test-id="node-issues"],
  [data-test-id="canvas-node-toolbar"], [data-test-id="canvas-background-striped-pattern"],
  .vue-flow__minimap, .vue-flow__panel { display: none !important; }
  [data-test-id="canvas-wrapper"], [data-test-id="canvas"], .vue-flow, .vue-flow__viewport, body { background: #0E0E0E !important; }
  [data-test-id="canvas-background"] { opacity: 0 !important; }
`;

/** A viewport the shape of the graph, so fitting it leaves the nodes as large as they can be. */
function viewportHeight(workflow) {
  const placed = workflow.nodes.map((n) => n.position);
  const span = (axis) => Math.max(...placed.map((p) => p[axis])) - Math.min(...placed.map((p) => p[axis]));
  const ratio = (span(0) + 320) / (span(1) + 320);
  return Math.round(WIDTH / Math.min(Math.max(ratio, 1.2), 3.4));
}

async function draw(page, workflow, target) {
  await page.setViewportSize({ width: WIDTH, height: viewportHeight(workflow) });
  await page.goto(`${N8N}/workflows/demo?theme=dark`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__messages.some((m) => m.includes('n8nReady')), null, { timeout: 60_000 });
  await page.addStyleTag({ content: CLEAN_CANVAS });
  await page.evaluate((w) => window.postMessage(JSON.stringify({ command: 'openWorkflow', workflow: w, hideNodeIssues: true }), '*'), workflow);
  await page.waitForFunction((count) => document.querySelectorAll('.vue-flow__node').length >= count, workflow.nodes.length, { timeout: 30_000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.postMessage(JSON.stringify({ command: 'fitView' }), '*'));
  await page.waitForTimeout(1200);
  // Crop to the graph itself, since the fitted view leaves a wide empty margin.
  const clip = await page.evaluate((margin) => {
    // A node's label hangs below its box, so measure what is inside the nodes as well.
    const rects = [...document.querySelectorAll('.vue-flow__node, .vue-flow__node *, path.vue-flow__edge-path')]
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0);
    const x = Math.max(0, Math.min(...rects.map((r) => r.left)) - margin);
    const y = Math.max(0, Math.min(...rects.map((r) => r.top)) - margin);
    const width = Math.min(innerWidth, Math.max(...rects.map((r) => r.right)) + margin) - x;
    const height = Math.min(innerHeight, Math.max(...rects.map((r) => r.bottom)) + margin) - y;
    return { x, y, width, height };
  }, 32);
  await sharp(await page.screenshot({ clip })).webp({ quality: 82, effort: 6 }).toFile(target);
}

const [exportsDir, ...flags] = process.argv.slice(2);
if (!exportsDir) throw new Error('Pass the folder that holds the n8n exports.');
const only = flags.find((f) => f.startsWith('--only='))?.slice(7).split(',');

fs.mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: SCALE, colorScheme: 'dark' });
const page = await context.newPage();
await page.addInitScript(() => {
  localStorage.setItem('N8N_THEME', JSON.stringify('dark'));
  window.__messages = [];
  window.addEventListener('message', (event) => window.__messages.push(String(event.data).slice(0, 80)));
});

const library = [];
for (const entry of CATALOG) {
  const raw = JSON.parse(fs.readFileSync(path.join(exportsDir, entry.source), 'utf8'));
  const workflow = sanitizeWorkflow(raw);

  // A leak stops the whole run: nothing partial gets published.
  const leak = findSensitive(visibleText(workflow), privateTerms);
  if (leak) throw new Error(`${entry.slug} would show ${leak}. Rename the node, then run again.`);

  const image = `${entry.slug}.webp`;
  if (!only || only.includes(entry.slug)) {
    await draw(page, workflow, path.join(OUT_DIR, image));
    console.log('drew', entry.slug);
  }

  const steps = raw.nodes.filter((n) => n.type !== 'n8n-nodes-base.stickyNote');
  library.push({
    slug: entry.slug,
    title: entry.title,
    category: entry.category,
    summary: entry.summary,
    steps: steps.length,
    triggers: unique(steps.map((n) => TRIGGERS[n.type]).filter(Boolean)),
    tools: unique([...steps.map((n) => TOOL_NAMES[n.type]).filter(Boolean), ...entry.extraTools]),
    image: `/project/Automation/workflows/${image}`,
  });
}
await browser.close();

if (!only) fs.writeFileSync(DATA_FILE, `${JSON.stringify(library, null, 2)}\n`);
console.log(only ? 'partial run: data file left as it was' : `wrote ${DATA_FILE} with ${library.length} workflows`);
