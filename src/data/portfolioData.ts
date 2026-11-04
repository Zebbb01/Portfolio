// src/data/portfolioData.ts
import {
  Database,
  Server,
  Github,
  Linkedin,
  Mail,
  Layout,
  Bot,
  Layers,
  Smartphone,
  Workflow,
  BarChart3,
  ShoppingBag,
  CreditCard,
  Radio,
  type LucideIcon,
} from 'lucide-react';
import type { Project, Screenshot, Service, Experience, TrustMetric, ExpertiseCategory } from '../types';
import type { BrandSlug } from '../components/ui/BrandIcon';

// ---------------------------------------------------------------------------
// Navigation Sections
// ---------------------------------------------------------------------------
export const sections = ['home', 'services', 'projects', 'process', 'experience', 'expertise', 'about', 'contact'];

// ---------------------------------------------------------------------------
// Duration helper — keeps "months active" accurate without manual edits
// ---------------------------------------------------------------------------
export function monthsSince(isoDate: string, until?: string): number {
  const start = new Date(isoDate);
  const end = until ? new Date(until) : new Date();
  // UTC throughout, so the server and the browser agree and hydration matches.
  const months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth());
  return Math.max(1, months);
}

export function formatDuration(months: number): string {
  if (months < 12) return `${months} mo${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `${years} yr${years === 1 ? '' : 's'}` : `${years} yr ${rest} mo`;
}

// ---------------------------------------------------------------------------
// Hero / Trust Metrics — figures traceable to shipped repositories
// ---------------------------------------------------------------------------
export const trustMetrics: TrustMetric[] = [
  { label: 'Years Engineering', value: '2+' },
  { label: 'Production Apps', value: '8' },
  { label: 'Commits in 2026', value: '900+' },
  { label: 'Modules Shipped', value: '24' },
];

// ---------------------------------------------------------------------------
// Currently Building — live status block, sourced from the active codebase
// ---------------------------------------------------------------------------
export const currentFocus = {
  label: 'Currently Building',
  project: 'Trusum Accounting',
  role: 'Personal product — sole engineer',
  startedAt: '2026-03-29',
  summary:
    'A multi-tenant accounting platform built for Philippine businesses — BIR-compliant VAT, withholding tax and Books of Accounts, in versioned releases. I own the architecture, the money-handling correctness, the AI agent layer and the test suite across a web app, a mobile app and a shared design system.',
  stats: [
    { label: 'Modules live', value: '24' },
    { label: 'Lines of code', value: '164K' },
    { label: 'Test suites', value: '106' },
    { label: 'Release', value: 'v0.69' },
  ],
  milestones: [
    {
      period: 'Mar 2026',
      title: 'Foundation',
      detail: 'Multi-tenant schema, Supabase RLS isolation, and the auth and onboarding flow.',
    },
    {
      period: 'Apr – May 2026',
      title: 'Core ledger',
      detail:
        'Double-entry journal, chart of accounts, invoices, bills and expenses — every money path on Decimal.js, no floats.',
    },
    {
      period: 'Jun – Jul 2026',
      title: 'Philippine compliance',
      detail:
        'VAT split across taxable, zero-rated and exempt, expanded withholding tax, SLSP summary lists, Books of Accounts and a filing calendar.',
    },
    {
      period: 'Aug 2026',
      title: 'Hardening',
      detail:
        '92 Vitest and Playwright suites in CI, fiscal period locks, an AI agent for document extraction, and an audit trail on every mutation.',
    },
    {
      period: 'Sep – Oct 2026',
      title: 'Design system and classroom',
      detail:
        'Brand tokens shared across the web app, the Expo mobile app and the till, with a live /kit page — plus a classroom mode where accounting students hand in exercises and see whether they are right.',
    },
  ],
};

// ---------------------------------------------------------------------------
// How I Build — toolchain, cost tier and delivery cadence
// ---------------------------------------------------------------------------
export type ToolTier = 'Paid' | 'Free tier' | 'Open source';

export const buildProcess = {
  intro:
    "Trusum started on Gemini's free tier. The build now runs on Claude Code, held to a test suite that has to pass before anything ships — and the rest of the toolchain starts free, so a production platform costs close to nothing until real usage says otherwise.",
  phases: [
    {
      id: 'before',
      label: 'Where it started',
      tool: 'Gemini',
      slug: 'googlegemini' as BrandSlug,
      tier: 'Free tier' as ToolTier,
      summary:
        'Scaffolding, research and throwaway prototypes. Good for getting a first version on screen — slower once the codebase outgrew what fits in a single conversation.',
    },
    {
      id: 'now',
      label: 'How it ships now',
      tool: 'Claude Code',
      slug: 'claude' as BrandSlug,
      tier: 'Paid' as ToolTier,
      summary:
        'An agent working inside the repository: it reads the codebase, writes the change against the test suite and runs it. Every release since the switch has shipped from this setup.',
    },
  ],
  release: { weeks: 28, count: 116, version: 'v0.69' },
  velocity: [
    { value: '116', label: 'Versioned releases' },
    { value: '630+', label: 'Commits across four repos' },
    { value: '164K', label: 'Lines of TypeScript' },
    { value: '106', label: 'Test suites in CI' },
    { value: '24', label: 'Modules live' },
  ],
  tools: [
    { name: 'Claude Code', slug: 'claude', tier: 'Paid', use: 'The agent in the repository. Reads the codebase, writes the change, runs the suites — where every release is built.' },
    { name: 'Gemini', slug: 'googlegemini', tier: 'Free tier', use: 'Where Trusum started: scaffolding, research and throwaway prototypes, before the build moved to Claude Code.' },
    { name: 'Next.js', slug: 'nextdotjs', tier: 'Open source', use: 'The web apps, the admin portals and this site — App Router, server components and route handlers.' },
    { name: 'Supabase', slug: 'supabase', tier: 'Free tier', use: 'Postgres, auth, storage and realtime. Tenant isolation lives here as Row Level Security, not in application code.' },
    { name: 'Expo', slug: 'expo', tier: 'Free tier', use: 'The Trusum mobile app — one React Native codebase for iOS and Android, on the same brand tokens as the web app.' },
    { name: 'Vitest & Playwright', slug: 'vitest', tier: 'Open source', use: '106 suites: unit tests for the ledger maths, browser tests for the flows a client actually clicks through.' },
    { name: 'GitHub Actions', slug: 'githubactions', tier: 'Free tier', use: 'Runs the suites on every push, against an isolated Supabase project rather than mocks.' },
    { name: 'Vercel', slug: 'vercel', tier: 'Free tier', use: 'A preview deployment for every branch, so changes are reviewed live before they reach production.' },
    { name: 'n8n', slug: 'n8n', tier: 'Open source', use: 'Client automation — CRMs, email, payments and internal tools wired together, with failures that alert instead of hiding.' },
    { name: 'Figma', slug: 'figma', tier: 'Free tier', use: 'Layouts and flows settled before code, so the build argues about implementation rather than direction.' },
  ] satisfies { name: string; slug: BrandSlug; tier: ToolTier; use: string }[],
  guarantees: [
    {
      title: 'Progress you can see every week',
      detail: 'A versioned release lands weekly, with a changelog you can read. No quiet month followed by a big reveal.',
    },
    {
      title: 'Correctness before speed',
      detail: 'Tests run on every push against a real database, and money is handled with exact decimal arithmetic — never floating point.',
    },
    {
      title: 'Costs that start near zero',
      detail: 'Supabase, Vercel and GitHub Actions all start on a free tier. You pay for infrastructure when real usage justifies it, not before.',
    },
    {
      title: 'Data isolated by the database',
      detail: "Each client's rows are locked by PostgreSQL Row Level Security, so a bug in one screen cannot expose another tenant's data.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const services: Service[] = [
  {
    title: 'SaaS Platforms',
    description: 'Multi-tenant applications with billing, authentication, and real-time collaboration.',
    icon: Layers as LucideIcon,
  },
  {
    title: 'Mobile Applications',
    description: 'Cross-platform iOS and Android apps with native performance and offline support.',
    icon: Smartphone as LucideIcon,
  },
  {
    title: 'Business Automation',
    description: 'Workflow systems that eliminate manual processes and reduce operational costs.',
    icon: Workflow as LucideIcon,
  },
  {
    title: 'Enterprise Dashboards',
    description: 'Admin panels with analytics, role-based access, and actionable business insights.',
    icon: BarChart3 as LucideIcon,
  },
  {
    title: 'Marketplaces',
    description: 'Multi-sided platforms connecting buyers, sellers, and service providers at scale.',
    icon: ShoppingBag as LucideIcon,
  },
  {
    title: 'System Architecture',
    description: 'Scalable backends with secure APIs, real-time data pipelines, and cloud infrastructure.',
    icon: Server as LucideIcon,
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  {
    title: 'Trusum Accounting',
    slug: 'trusum',
    types: ['saas', 'ai'],
    category: 'Enterprise SaaS',
    isFeatured: true,
    status: 'active',
    startedAt: '2026-03-29',
    mediaType: 'image',
    mediaSrc: '/project/SaaS/trusum-dashboard.webp',
    problem:
      'Philippine businesses run their books in spreadsheets, then rebuild everything by hand at filing time.',
    description:
      'A multi-tenant accounting platform for the Philippine market, shipped in versioned releases — 116 so far. 24 live modules covering double-entry journals, invoicing, bills, banking reconciliation, fiscal periods and reporting — plus the compliance layer the local market actually needs: VAT split across taxable, zero-rated and exempt, expanded withholding tax, SLSP summary lists and BIR Books of Accounts. Money paths run on Decimal.js rather than floats, tenant isolation is enforced by PostgreSQL RLS, and an AI agent handles document extraction and reconciliation. 164K lines of TypeScript behind 106 Vitest and Playwright suites in CI.',
    impact: '116 versioned releases in six months',
    role: 'Founder & sole engineer — personal product',
    timeline: 'March 2026 — Present',
    context:
      'Philippine SMBs keep their books in spreadsheets and rebuild everything by hand when BIR filing comes due. Off-the-shelf accounting software either ignores local tax rules or prices itself out of the market. Trusum is the attempt to serve that gap properly: a real double-entry ledger with the compliance layer built in rather than bolted on.',
    approach: [
      {
        title: 'Isolation at the database, not the app',
        detail:
          'Every tenant boundary is a PostgreSQL Row Level Security policy. An application bug cannot leak another organisation\u2019s ledger, because the query never returns those rows in the first place.',
      },
      {
        title: 'No floating point anywhere money moves',
        detail:
          'Every amount runs through Decimal.js from entry to report. A line worth less than half a centavo is refused with a sentence rather than a rounding error that silently unbalances the books.',
      },
      {
        title: 'Compliance modelled, not appended',
        detail:
          'VAT carries its treatment — taxable, zero-rated or exempt — on the tax rate itself, so the SLSP summary lists split correctly instead of guessing. Withholding tax, Books of Accounts and the filing calendar follow from the same model.',
      },
      {
        title: 'Versioned releases with a changelog',
        detail:
          'Each release ships with a changelog entry users actually see in-app. 116 releases in six months, now at v0.69.',
      },
      {
        title: 'Tests as the safety net for an audit trail',
        detail:
          '106 Vitest and Playwright suites run in CI against a real isolated Supabase project, because accounting logic that is only unit-tested against mocks proves nothing.',
      },
    ],
    outcomes: [
      { value: '24', label: 'Modules live' },
      { value: '164K', label: 'Lines of TypeScript' },
      { value: '106', label: 'Test suites in CI' },
      { value: 'v0.69', label: 'Current release' },
    ],
    tech: ['Next.js 15', 'Supabase', 'PostgreSQL RLS', 'Anthropic SDK', 'Decimal.js', 'Playwright', 'Vitest', 'PayMongo'],
    github: '',
    live: 'https://trusum.vercel.app/',
    detailsUrl: '/projects/trusum',
  },
  {
    title: 'TamangSahod',
    slug: 'tamang-sahod',
    types: ['ai'],
    category: 'AI Search · Python',
    isFeatured: true,
    status: 'active',
    startedAt: '2026-09-28',
    mediaType: 'image',
    mediaSrc: '/project/TamangSahod/holiday-v2.webp',
    problem:
      'Owners of 1–20-person businesses guess at holiday pay, 13th month and contributions, and a wrong guess underpays a worker.',
    description:
      'Payroll answers for Philippine micro-businesses. Five calculators — salary for the year, 13th month, holiday pay, final pay, and SSS, PhilHealth and Pag-IBIG — each return the peso amount with the official rule quoted word for word. Questions in English or Taglish run through hybrid search (multilingual embeddings plus full-text, rank-fused in LanceDB) over the DOLE and agency sources, and anything outside the five topics is refused rather than guessed. An optional LLM only pre-fills a form the owner checks; tested Python does the maths.',
    impact: '96% right rule in the top 3',
    role: 'Solo — research, data, evals and deployment',
    timeline: 'September 2026 — Present',
    context:
      'Small employers run payroll by hand or in Excel. What a worker is owed on a holiday, in 13th month pay, in final pay or in contributions is spread across DOLE advisories, a Presidential Decree and three agencies’ circulars that change every year — so owners guess, and a wrong guess underpays someone or ends in a DOLE complaint.',
    approach: [
      {
        title: 'The AI never does the maths',
        detail:
          'Language models read Taglish well and add badly, so the model only fills in a form. The owner confirms every field and tested Python computes the pesos. The model’s reply is treated as untrusted input: unknown topics, fields and out-of-range values are dropped.',
      },
      {
        title: 'Every amount cites its rule',
        detail:
          'Each result quotes the passage it follows, with the source and page, so an owner can check the answer instead of trusting it.',
      },
      {
        title: 'Rates are data with an expiry',
        detail:
          'Every rate carries its source and the date it was last verified. A pay date outside a verified period is refused — never computed with an old rate.',
      },
      {
        title: 'Refuse what it cannot answer',
        detail:
          'Questions outside the five topics get “not covered” and the DOLE hotline, never a guess. Nothing the owner types is stored, and amounts travel in POST bodies rather than URLs.',
      },
    ],
    outcomes: [
      { value: '5', label: 'Payroll calculators' },
      { value: '74', label: 'Tests vs official examples' },
      { value: '96%', label: 'Right rule in top 3' },
      { value: '20/20', label: 'Off-topic refused (seed set)' },
    ],
    tech: ['Python', 'FastAPI', 'LanceDB', 'fastembed', 'Groq', 'pytest', 'GitHub Actions', 'Modal'],
    github: 'https://github.com/Zebbb01/tamang-sahod',
    live: 'https://zebbb01--tamang-sahod-web.modal.run',
    detailsUrl: '/projects/tamang-sahod',
  },
  {
    title: 'Watershed Plan Extractor',
    slug: 'watershed-extractor',
    types: ['ai'],
    category: 'AI Document Extraction',
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: '/project/Watershed/overview.webp',
    problem:
      'Watershed plans bury their goals, practices and targets in hundreds of pages, laid out differently in every plan.',
    description:
      'Reads a watershed plan PDF, text or scanned, and returns its goals, best management practices, implementation activities, monitoring metrics, outreach and areas, each linked to the page and the exact words that support it. The browser reads the PDF and code rebuilds its layout; an LLM extracts a few pages at a time into a strict schema; then code checks every item against its page and fails closed. Built as a paid technical assessment for ChowaCo.',
    impact: '80.3% F1 against answer keys for nine plans',
    role: 'Solo — paid technical assessment for ChowaCo',
    timeline: 'October 2026',
    context:
      'Government watershed plans share a purpose but not a format: nine-key-element tables, narrative chapters written between 2004 and 2021, and scans. The task was to pull structured data out of them accurately enough to trust, behind a live demo anyone can test without signing up.',
    approach: [
      {
        title: 'Code and the model each do what they are reliable at',
        detail:
          'pdf.js reads the PDF in the browser, and code rebuilds headings, bullet levels and tables from text positions. The model only extracts, at most three pages per request into a Zod schema, so a long plan never changes what one request carries.',
      },
      {
        title: 'Every item is checked against its page',
        detail:
          'The quote must be on the cited page, and every name and amount must appear there verbatim. Whatever fails is listed with its reason under Quality and never shown as data.',
      },
      {
        title: 'Accuracy measured, not claimed',
        detail:
          'A scoring script compares each run with hand-built answer keys for nine Mississippi plans, three runs each. Six of the nine were held out from tuning: 78.6% F1 on those, 80.3% across all nine.',
      },
      {
        title: 'The smaller model, chosen on evidence',
        detail:
          'Claude Haiku is the default because a larger model did not buy accuracy: on the tuning plans Sonnet scored 1.2 points higher for 11 times the cost. Totals and the completion rate are computed in code, never by the model.',
      },
    ],
    outcomes: [
      { value: '80.3%', label: 'F1, nine plans' },
      { value: '78.6%', label: 'F1, six held-out plans' },
      { value: '83.7%', label: 'Numbers exact' },
      { value: '0', label: 'Names not in the PDF' },
    ],
    tech: ['Next.js 16', 'TypeScript', 'Anthropic SDK', 'Zod', 'pdf.js', 'Tesseract.js', 'Recharts', 'Vitest', 'Playwright', 'Netlify'],
    github: '',
    live: 'https://watershed-extractor.netlify.app',
    detailsUrl: '/projects/watershed-extractor',
  },
  {
    title: 'N8N Business Automation',
    slug: 'n8n-automation',
    types: ['automation'],
    category: 'Workflow Automation',
    isFeatured: true,
    mediaType: 'video',
    mediaSrc: '/videos/automation.mp4',
    problem: 'Repetitive manual business processes consuming valuable team hours and increasing error rates.',
    description:
      'Custom-built automation workflows using n8n and Make to streamline business operations. Designed multi-step pipelines integrating CRMs, email systems, payment gateways, and internal tools. Includes webhook-triggered flows, scheduled data syncs, and AI-powered document processing.',
    impact: '60% reduction in manual operations',
    role: 'Automation Engineer',
    timeline: '2024 — 2026',
    context:
      'Small teams lose whole days to copying data between a CRM, an inbox and a spreadsheet. The work is not hard, it is just constant — and every manual hop is a chance to mistype something that nobody catches until a client does.',
    approach: [
      {
        title: 'Map the handoffs before writing a node',
        detail:
          'Each workflow starts as a list of the points where data changes hands. Automating a bad process just makes the mistakes faster.',
      },
      {
        title: 'Event-driven over scheduled where it matters',
        detail:
          'Webhooks fire on the actual business event — a form submitted, a payment cleared — so follow-up lands in minutes rather than on the next hourly poll.',
      },
      {
        title: 'Failures are visible, not silent',
        detail:
          'Every pipeline has an error branch that notifies a human. An automation that fails quietly is worse than no automation.',
      },
      {
        title: 'AI only where rules cannot reach',
        detail:
          'OCR and language models handle invoice and receipt extraction — the genuinely fuzzy part. Everything deterministic stays deterministic.',
      },
    ],
    outcomes: [
      { value: '60%', label: 'Less manual work' },
      { value: '10+', label: 'Services connected' },
      { value: '24/7', label: 'Unattended running' },
    ],
    tech: ['n8n', 'Make', 'Webhooks', 'API Integration', 'GoHighLevel', 'OCR'],
    github: '',
    live: '',
    detailsUrl: '/projects/n8n-automation',
  },
  {
    title: 'GHL Marketing Websites',
    slug: 'ghl-website',
    types: ['websites'],
    category: 'Sales Funnels',
    isFeatured: true,
    mediaType: 'video',
    mediaSrc: '/project/GHL/ghl-1.mp4',
    problem: 'Low conversion rates due to generic layouts and poor user engagement.',
    description:
      'Custom-built marketing websites and highly optimized sales funnels using GoHighLevel. Designed immersive micro-animations and integrated custom CRM follow-up sequences for automated lead nurturing.',
    impact: '35% increase in lead capture',
    role: 'Web & Funnel Developer',
    timeline: '2024 — 2026',
    context:
      'Template funnels convert badly because they look like template funnels. The pages that work are the ones that answer a specific objection at the moment a visitor has it, then make the next step obvious.',
    approach: [
      {
        title: 'Structure the page around one decision',
        detail:
          'Each funnel step asks for exactly one thing. Competing calls to action split attention and cost conversions.',
      },
      {
        title: 'Motion that directs attention',
        detail:
          'Custom CSS micro-animations cue the eye toward the next action instead of decorating the page for its own sake.',
      },
      {
        title: 'Capture and nurture in one system',
        detail:
          'Forms write straight into GoHighLevel, which triggers the follow-up sequence. No export step, no lead sitting unworked in a spreadsheet.',
      },
      {
        title: 'Qualify before the sales call',
        detail:
          'Multi-step forms ask the disqualifying questions early, so the calls that get booked are worth taking.',
      },
    ],
    outcomes: [
      { value: '35%', label: 'More leads captured' },
      { value: '0', label: 'Manual lead handoffs' },
    ],
    tech: ['GoHighLevel', 'CSS Animations', 'CRM Integration', 'JavaScript'],
    github: '',
    live: '',
    detailsUrl: '/projects/ghl-website',
  },
  {
    title: 'Body Tracker',
    slug: 'body-tracker',
    types: ['mobile', 'ai'],
    category: 'Offline-first PWA · Supabase',
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: '/project/BodyTracker/dashboard.webp',
    problem: 'Fitness logging gets abandoned because it is slow, and gyms have no signal.',
    description:
      'A phone-first tracker for workouts, meals and body weight that keeps working with no signal. A visitor is in with one tap through a Supabase anonymous account they can save with Google later, logs a set in two taps, photographs a meal and confirms the numbers Gemini fills in, and sees weight and strength trends. Every entry is written to IndexedDB on the phone first and synced to Supabase Postgres, where Row Level Security limits each row to its owner. Installable as an app, with a hand-written service worker, and run entirely on free tiers.',
    impact: 'Try it in one tap, log with no signal',
    role: 'Solo — design, build, tests and deployment',
    timeline: 'February 2026 — November 2026',
    context:
      'Logging is the part of fitness tracking everyone abandons. Typing a meal takes longer than eating it, the gym has one bar of signal, and an app that asks for an account before showing anything loses a visitor in the first minute.',
    approach: [
      {
        title: 'Try it before signing up',
        detail:
          'Supabase anonymous sign-in puts a visitor in the app with one tap. Linking Google later keeps the same user id, so nothing logged is lost; try-it accounts are rate limited and removed after 30 days.',
      },
      {
        title: 'The phone first, the server second',
        detail:
          'Every write lands in a per-person IndexedDB database, marked unsynced. A small sync engine pushes those rows and pulls changes from other devices, with tombstones for deletes, and the app says plainly when entries are only on the phone.',
      },
      {
        title: 'Row Level Security is the only door',
        detail:
          'The browser talks to Supabase with a public key, so every table has an owner-only policy. A test signs in two people and proves neither can read, change, delete or forge the other’s rows.',
      },
      {
        title: 'AI fills the form, the person saves',
        detail:
          'The photo is shrunk on the phone, Gemini returns structured JSON that is validated and clamped, and each person has a daily allowance. Nothing reaches the diary until the numbers are checked.',
      },
    ],
    outcomes: [
      { value: '94', label: 'Lighthouse performance, mobile' },
      { value: '0', label: 'Accessibility violations, 7 screens, 2 themes' },
      { value: '56', label: 'Unit, RLS and browser tests in CI' },
    ],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase Auth', 'Postgres RLS', 'IndexedDB', 'Service Worker', 'Gemini API', 'Playwright'],
    github: 'https://github.com/Zebbb01/Workout-Tracker',
    live: 'https://body-tracker-iota.vercel.app/',
    detailsUrl: '/projects/body-tracker',
  },
  {
    title: 'LedgerLens',
    slug: 'ledgerlens',
    types: ['ai', 'automation'],
    category: 'AI Document Automation · Azure',
    isFeatured: false,
    mediaType: 'image',
    mediaSrc: '/project/LedgerLens/review-blocked.webp',
    problem: 'Supplier bills are keyed into the books by hand, and a misread total or a duplicate gets paid.',
    description:
      'Reads invoices and receipts with Azure AI Document Intelligence, then checks every number in code (totals, line items, 12% Philippine VAT, dates, the vendor TIN and duplicates) before a bill can be approved and exported. A failed check blocks approval until a person fixes the field. Runs entirely on Azure free tiers: a Next.js app and a KEDA-scaled queue worker on Container Apps, Blob and Queue Storage, and Cosmos DB for MongoDB, provisioned with Terraform and deployed by GitHub Actions over OpenID Connect.',
    impact: 'Six Azure services, all on free tiers',
    role: 'Solo — design, build, infrastructure and tests',
    timeline: 'October 2026 — Present',
    context:
      'Small finance teams retype supplier bills into their accounting software. AI extraction makes that faster, but a model that misreads one digit turns into an overpayment or a duplicate payment. Reading the bill is the easy part; knowing when not to trust the reading is the work.',
    approach: [
      {
        title: 'The model reads, code decides',
        detail:
          'Document Intelligence extracts the fields; nine checks in code decide whether the bill can be approved. A failed check blocks approval until a person corrects the field, and every correction is kept with the checks run again.',
      },
      {
        title: 'A queue between upload and analysis',
        detail:
          'The web app stores the file and queues its ID; a Container Apps job started by KEDA drains the queue and exits. Nothing runs while nobody uploads, which is what keeps it free.',
      },
      {
        title: 'The free tier as a design constraint',
        detail:
          'Analyses are reused by file hash, monthly and daily caps keep usage under the 500 free pages, data expires after 7 days, and logging has a daily cap. The bill stays at zero by construction.',
      },
      {
        title: 'No keys anywhere',
        detail:
          'The app reaches Storage and Document Intelligence with a managed identity, key access to Document Intelligence is switched off, and GitHub Actions deploys through OpenID Connect with no stored secret.',
      },
      {
        title: 'Tested on a real invoice',
        detail:
          'A real Shopee shipping invoice exposed what the samples had not: the model read the logo as the vendor and skipped VAT lines labelled the platform’s way. LedgerLens now reads the registered name, the BIR series number and those labels from the page, going from 8 to 11 of 11 fields, and a lookalike sample keeps the case in the demo without anyone’s personal details.',
      },
    ],
    outcomes: [
      { value: '9', label: 'Checks in code' },
      { value: '98.2%', label: 'Fields read right, live service' },
      { value: '111', label: 'Unit and end-to-end tests' },
      { value: '6', label: 'Azure services, free tier' },
    ],
    tech: [
      'Next.js 16',
      'TypeScript',
      'Azure Container Apps',
      'Azure AI Document Intelligence',
      'Cosmos DB for MongoDB',
      'Terraform',
      'GitHub Actions',
      'Playwright',
    ],
    github: 'https://github.com/Zebbb01/ledgerlens',
    live: 'https://ca-ledgerlens-iq777r.salmonriver-2ba7975b.southeastasia.azurecontainerapps.io',
    detailsUrl: '/projects/ledgerlens',
  },
  {
    title: 'ReplyPilot',
    slug: 'replypilot',
    types: ['ai', 'automation'],
    category: 'AI Support Agent · Shopify · Azure',
    isFeatured: false,
    mediaType: 'image',
    mediaSrc: '/project/ReplyPilot/review-blocked.webp',
    problem:
      'An AI that answers store support email on its own can show one customer another customer\'s order, or promise a refund nobody approved.',
    description:
      'An AI support agent for an online store, written as code rather than wired up in a no-code tool. Customer emails and Shopify delivery events become tickets; an agent looks up the order and the store policies with tools and drafts the reply; code checks the draft; and nothing is sent until a person approves it. Every model call and tool call is a durable step in PostgreSQL, so a failure retries and resumes instead of starting over, with an append-only audit log and the cost of every ticket. Runs on Azure free tiers with Terraform and GitHub Actions.',
    impact: 'No reply leaves without a person',
    role: 'Solo — design, build, infrastructure and tests',
    timeline: 'November 2026 — Present',
    context:
      'Most of a small store\'s support email is "where is my order", returns and damaged items. An agent can answer those, but only safely if it cannot see other customers\' orders, cannot invent amounts or policies, and cannot send anything a person has not read.',
    approach: [
      {
        title: 'Access is decided in code, not in the prompt',
        detail:
          'The order tools only return orders placed with the sender\'s email address. A stranger asking for someone else\'s tracking number, or a prompt injection, gets "belongs to another address" and no details.',
      },
      {
        title: 'The model drafts, code checks, a person sends',
        detail:
          'Six checks run on every draft and again on every edit: order numbers must be verified for this customer, money amounts must appear in the order data, and cited policies must have been looked up. A failed check locks Approve.',
      },
      {
        title: 'Durable steps instead of a workflow tool',
        detail:
          'Each model call, tool call and send is stored when it finishes, on a PostgreSQL job queue with SKIP LOCKED. A retry after a rate limit resumes at the step that failed, and a stored send is never sent twice.',
      },
      {
        title: 'Graded in code, costed per ticket',
        detail:
          'Twelve eval tickets, from order status to a chargeback threat, a prompt injection and a message in Spanish, are graded in code with no model judging another; all twelve pass on Gemini 3.5 Flash-Lite at about $0.001 a ticket at list price.',
      },
    ],
    outcomes: [
      { value: '6', label: 'Checks in code on every draft' },
      { value: '78', label: 'Unit and end-to-end tests' },
      { value: '12/12', label: 'Eval tickets passed on Gemini' },
      { value: '3', label: 'Azure services, free tier' },
    ],
    tech: [
      'Next.js 16',
      'TypeScript',
      'PostgreSQL',
      'Gemini API',
      'Shopify Admin API',
      'Azure Container Apps',
      'Terraform',
      'Playwright',
    ],
    github: 'https://github.com/Zebbb01/replypilot',
    live: '',
    detailsUrl: '/projects/replypilot',
  },
  {
    title: 'LeadLoom',
    slug: 'leadloom',
    types: ['ai', 'automation'],
    category: 'Lead Intake & CRM Automation · n8n · Python · Azure',
    isFeatured: false,
    mediaType: 'image',
    mediaSrc: '/project/LeadLoom/lead-synced.webp',
    problem:
      'Leads arrive from a website form, an inbox and a booking calendar, get typed into the CRM by hand, twice for the same person, and the hot ones wait in the queue with everything else.',
    description:
      'A lead-intake and CRM automation system built from a self-hosted n8n workflow and a Python (FastAPI) service. n8n receives every lead and orchestrates; the Python service does what n8n does badly: it checks who the lead already is, reads the company\'s website with robots.txt respected, and scores and routes the lead with an LLM whose answer is validated against a schema and can be overruled by rules in code. Results go to HubSpot as a contact, company, deal and a note explaining the score; hot leads post to Slack, and unsure ones wait on a review page for a person. Runs on Azure free tiers with Terraform and GitHub Actions.',
    impact: 'Every lead scored, deduplicated and in the CRM',
    role: 'Solo — design, build, infrastructure and tests',
    timeline: 'November 2026 — Present',
    context:
      'Automation roles ask for two things at once: n8n workflows that connect forms, inboxes and CRMs, and the code behind them that makes the result trustworthy. LeadLoom splits the work along that line, with the workflow committed as JSON and every step it calls tested in Python.',
    approach: [
      {
        title: 'n8n for the plumbing, Python for the judgement',
        detail:
          'Three webhooks, routing, a Wait node that holds a run until a person decides, and the Slack alert live in n8n. Signature checks, dedupe, enrichment, scoring and the HubSpot writes live in a FastAPI service that n8n calls.',
      },
      {
        title: 'The model scores, rules in code decide',
        detail:
          'The LLM returns fit, intent, a route and its confidence as a strict JSON schema, validated with Pydantic. Rules overrule it where the answer is known: a honeypot hit is spam, a booked meeting is a buying signal, a known customer is never spam, and low confidence or a prompt injection goes to a person.',
      },
      {
        title: 'Idempotent from the webhook to the CRM',
        detail:
          'A redelivered webhook maps to the same lead. Each model and HubSpot call is a durable step in PostgreSQL, so a retry after an outage resumes where it stopped, without a second deal or a second Slack alert.',
      },
      {
        title: 'Tested through the real workflow, graded in code',
        detail:
          'The end-to-end tests drive the exported n8n workflow itself, from a signed booking to an approval that resumes the waiting run, and a HubSpot outage that outlasts every retry. Twenty-four labeled leads, from an RFP to a prompt injection, are graded in code; all pass on Gemini 3.5 Flash-Lite at about $0.0005 a lead at list price.',
      },
    ],
    outcomes: [
      { value: '3', label: 'Lead sources through one n8n workflow' },
      { value: '84', label: 'Unit and end-to-end tests' },
      { value: '24/24', label: 'Eval leads passed on Gemini' },
      { value: '6', label: 'Rules in code over the model' },
    ],
    tech: [
      'n8n',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Gemini API',
      'HubSpot API',
      'Azure Container Apps',
      'Terraform',
      'Playwright',
    ],
    github: 'https://github.com/Zebbb01/leadloom',
    live: 'https://ca-leadloom-8s6bzq-api.salmonriver-2ba7975b.southeastasia.azurecontainerapps.io',
    detailsUrl: '/projects/leadloom',
  },
];

// ---------------------------------------------------------------------------
// Project Screenshots (for gallery)
// ---------------------------------------------------------------------------
export const projectScreenshots: Record<string, Screenshot[]> = {
  'Trusum Accounting': [
    {
      src: '/project/SaaS/trusum-dashboard.webp',
      caption:
        'Dashboard — cash position, receivables and payables, with the financial-health ratios explained in plain language underneath.',
    },
    {
      src: '/project/SaaS/trusum-sales.webp',
      caption:
        'Sales register — draft, posted, paid and overdue states, filtered by period and status, with balance due tracked per invoice.',
    },
    {
      src: '/project/SaaS/trusum-new-invoice.webp',
      caption:
        'New invoice — VAT-inclusive or exclusive amounts, expanded withholding tax, and a running summary as lines are added.',
    },
    {
      src: '/project/SaaS/trusum-slsp.webp',
      caption:
        'SLSP report — sales and purchases per counterparty split into taxable, zero-rated and exempt, refusing to file until the data is actually complete.',
    },
    {
      src: '/project/SaaS/trusum-general-ledger.webp',
      caption:
        'General ledger at tablet width — every posting traceable to its source document, with the layout reflowing rather than scrolling sideways.',
    },
    {
      src: '/project/SaaS/trusum-kit.webp',
      caption:
        'The /kit page — one live reference for table density, control heights and states, shared across the web, mobile and till apps.',
    },
  ],
  TamangSahod: [
    {
      src: '/project/TamangSahod/holiday-v2.webp',
      caption:
        'Holiday pay for Christmas Day — the amount, the 200% rule behind it, and links to the DOLE handbook, the labor advisory and the proclamation.',
    },
    {
      src: '/project/TamangSahod/ask-v2.webp',
      caption:
        'A Taglish question answered with the matching rules, quoted word for word with the source and page.',
    },
    {
      src: '/project/TamangSahod/home-v2.webp',
      caption: 'Ask in English or Taglish, or open one of the five calculators. No login, nothing stored.',
    },
  ],
  'Watershed Plan Extractor': [
    {
      src: '/project/Watershed/overview.webp',
      caption:
        'Report overview — items per category, the share of proposed items that passed the checks, and the plan at a glance from goals to monitoring.',
    },
    {
      src: '/project/Watershed/evidence-row.webp',
      caption:
        'Implementation tab — each activity with who carries it out and when, plus the quote and page it came from, here from a scanned 2004 plan.',
    },
    {
      src: '/project/Watershed/accuracy.webp',
      caption: 'Accuracy page — F1 per plan against hand-built answer keys, held-out plans in blue, the 75% bar marked.',
    },
  ],
  'GHL Marketing Websites': [
    { src: '/project/GHL/ghl-1.mp4', caption: 'Landing page with scroll-triggered micro-animations cueing the next action.' },
    { src: '/project/GHL/ghl-2.mp4', caption: 'Funnel step — one decision per screen, no competing calls to action.' },
    { src: '/project/GHL/ghl-3.mp4', caption: 'Multi-step qualification form feeding the CRM follow-up sequence.' },
  ],
  'N8N Business Automation': [
    { src: '/project/Automation/automate_image.webp', caption: 'Multi-step pipeline connecting CRM, mail and payment events.' },
    { src: '/project/Automation/automate_image (1).webp', caption: 'Webhook trigger branch with its error path routed to a human.' },
    { src: '/project/Automation/automate_image (2).webp', caption: 'Scheduled sync reconciling records between two systems.' },
    { src: '/project/Automation/automate_image (3).webp', caption: 'AI document step extracting fields from invoices and receipts.' },
    { src: '/project/Automation/automate_image (4).webp', caption: 'Follow-up sequence fired from a qualified form submission.' },
  ],
  'Body Tracker': [
    { src: '/project/BodyTracker/dashboard.webp', caption: 'Today on a desktop: calories and macros left, what was eaten, today’s sets and the weight trend.' },
    { src: '/project/BodyTracker/dashboard-phone.webp', caption: 'Today on a phone, above the bottom tabs: the whole day on one screen.' },
    { src: '/project/BodyTracker/workout.webp', caption: 'The workout log: the next set starts as a copy of the last one, so logging it is one more tap.' },
    { src: '/project/BodyTracker/progress.webp', caption: 'Progress: weight over 90 days, strength as the best estimated one-rep max, and weekly volume, each with a table view.' },
  ],
  LedgerLens: [
    {
      src: '/project/LedgerLens/review-blocked.webp',
      caption:
        'A bill whose printed total does not add up: the failed checks come first with a button to the field most likely misread, and Approve stays disabled until it is fixed.',
    },
    {
      src: '/project/LedgerLens/review-ready.webp',
      caption:
        'A Philippine VAT invoice that passes all nine checks, beside the original PDF, with the confidence of every field the model read.',
    },
    {
      src: '/project/LedgerLens/home.webp',
      caption: 'The home page: a real sample invoice with the check it fails, the read, check and approve steps, and sample documents to try.',
    },
  ],
  ReplyPilot: [
    {
      src: '/project/ReplyPilot/review-blocked.webp',
      caption:
        'A reviewer adds "$500" to a draft: no such amount is in the order data, so the check fails and Approve locks. The agent trace and the ticket\'s cost sit beside it.',
    },
    {
      src: '/project/ReplyPilot/sent.webp',
      caption:
        'An approved reply with the tool calls that produced it, the tokens of each model call, and the audit log from receipt to send.',
    },
    {
      src: '/project/ReplyPilot/home.webp',
      caption:
        'The demo inbox: sample customer emails, including a prompt injection and a request for someone else\'s order, with each ticket\'s status and cost.',
    },
  ],
  LeadLoom: [
    {
      src: '/project/LeadLoom/lead-synced.webp',
      caption:
        'A booked demo on the live Azure deployment: Gemini scored it hot and said why, the company website was read, and the HubSpot contact, company, deal and note were written as durable, timed steps.',
    },
    {
      src: '/project/LeadLoom/n8n-workflow.webp',
      caption:
        'The intake workflow in n8n: three webhooks, the calls to the Python service, the route on its decision, a Wait node that holds the run for a reviewer, and the Slack alert.',
    },
    {
      src: '/project/LeadLoom/lead-review.webp',
      caption:
        'A message that tries to set its own score waits for a person, who can change the route and score before approving it, which resumes the waiting n8n run.',
    },
    {
      src: '/project/LeadLoom/home.webp',
      caption:
        'The demo: sample leads, each sent through the real path in the format its sender uses, signed like Cal.com or authenticated like Postmark.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export const experiences: Experience[] = [
  {
    title: 'Full-Stack Developer',
    company: 'Poseidon Distribution OPC',
    type: 'Full-Time',
    period: 'May 2026 - Oct 2026',
    startedAt: '2026-05-18',
    endedAt: '2026-10-16',
    description:
      'Full-stack work on an on-demand delivery and marketplace platform: its customer, merchant and rider mobile apps and the web dashboards that run it. Specifics are under NDA.',
    highlights: [
      'Built and maintained the customer, merchant and rider mobile apps with React Native and Expo Router',
      'Built responsive web dashboards in Next.js that hold up from a 360px phone to a wide desktop',
      'Shipped features end to end across UI, APIs and PostgreSQL on Supabase',
      'Delivered phone OTP and social sign-in, live delivery tracking on Google Maps, and in-app checkout',
      'Worked with designers, project managers and QA through Git-based review and releases',
    ],
    tech: ['Next.js', 'React Native', 'Expo Router', 'Supabase', 'PostgreSQL', 'TypeScript', 'Google Maps', 'PayMongo'],
  },
  {
    title: 'Founder & Sole Engineer',
    company: 'Trusum — Self-Initiated Product',
    type: 'Personal Project',
    period: 'March 2026 - Present',
    startedAt: '2026-03-29',
    description:
      'My own product, built end to end. A multi-tenant accounting platform for the Philippine market, with 116 versioned releases in six months — architecture, compliance, AI layer and test suite all mine.',
    highlights: [
      'Architected 24 live modules: double-entry journal, chart of accounts, invoicing, bills, expenses, banking reconciliation, fiscal periods and reporting',
      'Built the Philippine compliance layer — VAT across taxable, zero-rated and exempt, expanded withholding tax, SLSP summary lists and BIR Books of Accounts',
      'Enforced tenant isolation with PostgreSQL Row Level Security and an audit trail on every write',
      'Held money correctness with Decimal.js across every ledger path — no floating-point arithmetic in the accounting core',
      'Built the AI agent layer on the Anthropic and OpenAI SDKs for document extraction and bank reconciliation',
      'Wrote and maintain 106 Vitest and Playwright suites running in CI, plus brand tokens shared across the web, mobile and till apps',
      'Shipped 630+ commits across four repositories and 116 versioned releases in six months',
    ],
    tech: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL RLS', 'Anthropic SDK', 'Decimal.js', 'Playwright', 'Vitest'],
  },
  {
    title: 'Freelance Full-Stack Engineer',
    company: 'Independent',
    type: 'Freelance',
    period: '2024 - 2026',
    startedAt: '2024-01-01',
    endedAt: '2026-05-01',
    description:
      'Delivered production platforms for clients across SaaS, civic tech, AI applications and business automation.',
    highlights: [
      'Built OSCA, the records and benefits system of a city Office of Senior Citizens Affairs: staff register each senior citizen with their documents, and the system sorts them into age groups (below 80, 80s, 90s and 100+) and keeps ages current on every birthday',
      'Its benefit flow takes applications for aid such as medical assistance, moves each from pending to approved or rejected, and records every release against the office’s government fund, with admin and staff roles and PDF reports (Next.js 15, Prisma, PostgreSQL)',
      'Developed an AI-powered fitness PWA with food-photo nutrition analysis and offline-first storage',
      'Created a multi-provider AI chatbot supporting OpenAI, Anthropic and Azure',
      'Designed marketing systems and automation workflows with GoHighLevel and n8n',
    ],
    tech: ['Next.js', 'React', 'Supabase', 'Stripe', 'AI Integration', 'PostgreSQL'],
  },
];

// ---------------------------------------------------------------------------
// Expertise Categories
// ---------------------------------------------------------------------------
export const expertiseCategories: ExpertiseCategory[] = [
  {
    title: 'Frontend Engineering',
    icon: Layout as LucideIcon,
    description: 'Fast, responsive interfaces that convert visitors into customers.',
    technologies: ['Next.js', 'React', 'React Native', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
  },
  {
    title: 'Backend & Infrastructure',
    icon: Database as LucideIcon,
    description: 'Scalable systems that handle growth without breaking.',
    technologies: ['Supabase', 'PostgreSQL', 'REST APIs', 'Webhooks', 'Node.js', 'Python', 'FastAPI', 'Prisma', 'Vercel', 'Edge Functions'],
  },
  {
    title: 'Mobile Development',
    icon: Smartphone as LucideIcon,
    description: 'Native-quality apps on every platform from a single codebase.',
    technologies: ['React Native', 'Expo', 'iOS', 'Android', 'PWA', 'Offline-first'],
  },
  {
    title: 'Payments & Commerce',
    icon: CreditCard as LucideIcon,
    description: 'Secure payment processing built for the market it serves.',
    technologies: ['PayMongo', 'GCash', 'Maya', 'GrabPay', 'Stripe', 'Subscriptions'],
  },
  {
    title: 'AI & Automation',
    icon: Bot as LucideIcon,
    description: 'Intelligent automation that reduces costs and accelerates decisions.',
    technologies: ['Anthropic SDK', 'OpenAI', 'Embeddings', 'LanceDB', 'Hybrid Search', 'n8n', 'Make', 'OCR', 'Prompt Engineering'],
  },
  {
    title: 'Testing & Reliability',
    icon: Radio as LucideIcon,
    description: 'Correctness held by tests, not by hope — especially where money moves.',
    technologies: ['Vitest', 'Playwright', 'pytest', 'Evals', 'PostgreSQL RLS', 'Decimal.js', 'Audit Logging', 'GitHub Actions'],
  },
];

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
export const aboutData = {
  title: 'The Engineer Behind the Code',
  bio: [
    "I'm Gerald Villaceran, a software engineer based in the Philippines. I build production-grade web and mobile platforms that solve real business problems.",
    'Right now I am six months into building my own BIR-compliant accounting SaaS end to end — 24 modules, 164K lines of TypeScript, 106 test suites and 116 versioned releases — and TamangSahod, a Python search tool that answers Philippine payroll questions with the rule behind every peso. Until October 2026 I worked full-time on the mobile apps and web dashboards of an on-demand delivery platform.',
    'Great software is invisible. It just works, scales, and delivers results. That principle drives every system I build.',
  ],
  stats: [
    { value: '24', label: 'Modules Live' },
    { value: '164K', label: 'Lines Shipped' },
    { value: '106', label: 'Test Suites' },
  ],
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
export const contactInfo = {
  email: 'geraldvillaceran01@gmail.com',
  phone: '+63 909 211 2874',
  location: 'Philippines, GMT+8',
  responseTime: 'Typically responds within 24 hours',
  socials: [
    { name: 'GitHub', icon: Github as LucideIcon, href: 'https://github.com/Zebbb01' },
    {
      name: 'LinkedIn',
      icon: Linkedin as LucideIcon,
      href: 'https://www.linkedin.com/in/gerald-villaceran/',
    },
    {
      name: 'Email',
      icon: Mail as LucideIcon,
      href: 'mailto:geraldvillaceran01@gmail.com',
    },
  ],
};
