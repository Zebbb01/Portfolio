// src/data/portfolioData.ts
import {
  Code,
  Database,
  Server,
  Github,
  Linkedin,
  Mail,
  Cpu,
  Zap,
  Globe,
  Layout,
  ShieldCheck,
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
import type { Project, Service, Experience, TrustMetric, ExpertiseCategory } from '../types';

// ---------------------------------------------------------------------------
// Navigation Sections
// ---------------------------------------------------------------------------
export const sections = ['home', 'services', 'projects', 'experience', 'expertise', 'about', 'contact'];

// ---------------------------------------------------------------------------
// Hero / Trust Metrics
// ---------------------------------------------------------------------------
export const trustMetrics: TrustMetric[] = [
  { label: 'Years Experience', value: '3+' },
  { label: 'Projects Delivered', value: '15+' },
  { label: 'Production Apps', value: '5' },
  { label: 'Lines of Code', value: '100K+' },
];

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
// Projects (4 Featured)
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  {
    title: 'ProfitView Accounting',
    slug: 'profitview',
    category: 'Enterprise SaaS',
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: '/project/SaaS/Dashboard.webp',
    problem: 'Manual data entry and disconnected systems slowing financial reporting.',
    description:
      'A sophisticated web-based accounting and finance operations platform built for modern businesses. Features 22 modules including AI-powered data extraction, real-time invoicing, expense management, and multi-tenant isolation with PostgreSQL RLS.',
    impact: '40% faster month-end closing',
    tech: ['Next.js 15', 'Supabase', 'Stripe', 'AI Agent', 'PostgreSQL'],
    github: '#',
    live: 'https://profit-view-swart.vercel.app/',
    detailsUrl: '/projects/profitview',
  },
  {
    title: 'N8N Business Automation',
    slug: 'n8n-automation',
    category: 'Workflow Automation',
    isFeatured: true,
    mediaType: 'video',
    mediaSrc: '/videos/automation.mkv',
    problem: 'Repetitive manual business processes consuming valuable team hours and increasing error rates.',
    description:
      'Custom-built automation workflows using n8n and Make to streamline business operations. Designed multi-step pipelines integrating CRMs, email systems, payment gateways, and internal tools. Includes webhook-triggered flows, scheduled data syncs, and AI-powered document processing.',
    impact: '60% reduction in manual operations',
    tech: ['n8n', 'Make', 'Webhooks', 'API Integration', 'GoHighLevel'],
    github: '',
    live: '',
    detailsUrl: '/projects/n8n-automation',
  },
  {
    title: 'GHL Marketing Websites',
    slug: 'ghl-website',
    category: 'Sales Funnels',
    isFeatured: true,
    mediaType: 'video',
    mediaSrc: '/project/GHL/ghl-video (1).mkv',
    problem: 'Low conversion rates due to generic layouts and poor user engagement.',
    description:
      'Custom-built marketing websites and highly optimized sales funnels using GoHighLevel. Designed immersive micro-animations and integrated custom CRM follow-up sequences for automated lead nurturing.',
    impact: '35% increase in lead capture',
    tech: ['GoHighLevel', 'CSS Animations', 'CRM Integration', 'JavaScript'],
    github: '#',
    live: '',
    detailsUrl: '/projects/ghl-website',
  },
  {
    title: 'Rundzee PH',
    slug: 'rundzee',
    category: 'Super-App Platform',
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: '/project/Rundzee/home-screen.png',
    problem: 'Fragmented delivery and errand services in the Philippine market.',
    description:
      'A comprehensive on-demand delivery, errand, and marketplace super-app. Built and maintained 5 production applications (customer v2, merchant, rider, admin portal, and web platform) integrated with Supabase. Implemented critical systems including real-time order tracking with custom Map IDs, React Context customer support chat, secure OTP login flows, Facebook/Google OAuth with email permission fallbacks, database audit log triggers, and automated refunds.',
    impact: '5-app ecosystem in production',
    tech: ['React Native', 'Expo Router', 'Supabase', 'PostgreSQL', 'PayMongo', 'React Context', 'Reanimated', 'Map API'],
    github: '',
    live: '',
    detailsUrl: '/projects/rundzee',
  },
  {
    title: 'Body Tracker',
    slug: 'body-tracker',
    category: 'AI-Powered PWA',
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: '/project/BodyTracker/dashboard.png',
    problem: 'Generic fitness apps lack personalized nutrition intelligence.',
    description:
      'A comprehensive personal fitness tracker with AI-powered nutrition analysis from food photos, workout logging, TDEE calculator, and intermittent fasting widget. Progressive Web App with offline-first architecture using IndexedDB.',
    impact: 'AI-powered meal analysis from photos',
    tech: ['Next.js 16', 'Supabase', 'PWA', 'AI/ML', 'IndexedDB'],
    github: '',
    live: 'https://body-tracker-iota.vercel.app/',
    detailsUrl: '/projects/body-tracker',
  },
];

// ---------------------------------------------------------------------------
// Project Screenshots (for gallery)
// ---------------------------------------------------------------------------
export const projectScreenshots: Record<string, string[]> = {
  'ProfitView Accounting': [
    '/project/SaaS/Dashboard.webp',
    '/project/SaaS/Agent Activity Log.webp',
    '/project/SaaS/Banking Details.webp',
    '/project/SaaS/Bills Paid.webp',
    '/project/SaaS/Bills.webp',
    '/project/SaaS/Chart of Accounts.webp',
    '/project/SaaS/Contact Activity History.webp',
    '/project/SaaS/Contact Generated SOA.webp',
    '/project/SaaS/Invoices Paid.webp',
    '/project/SaaS/Landing.webp',
    '/project/SaaS/Reports Trial Balance.webp',
    '/project/SaaS/Settings Fiscal Periods.webp',
    '/project/SaaS/SignUp.webp',
  ],
  'GHL Marketing Websites': [
    '/project/GHL/ghl-video (1).mkv',
    '/project/GHL/ghl-video (2).mkv',
    '/project/GHL/ghl-video.mkv',
  ],
  'N8N Business Automation': [
    '/project/Automation/automate_image.webp',
    '/project/Automation/automate_image (1).webp',
    '/project/Automation/automate_image (2).webp',
    '/project/Automation/automate_image (3).webp',
    '/project/Automation/automate_image (4).webp',
  ],
  'Rundzee PH': [
    '/project/Rundzee/home-screen.png',
    '/project/Rundzee/delivery-tracking.png',
    '/project/Rundzee/marketplace.png',
  ],
  'Body Tracker': [
    '/project/BodyTracker/dashboard.png',
    '/project/BodyTracker/ai-scan.png',
    '/project/BodyTracker/workout.png',
  ],
};

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export const experiences: Experience[] = [
  {
    title: 'Full-Stack Developer',
    company: 'Poseidon Distribution Inc. (Rundzee PH)',
    type: 'Full-Time',
    period: 'May 2026 - Present',
    description:
      'Built and shipped 5 production applications for a Philippine super-app platform serving customers, merchants, and riders across food delivery, errands, and e-commerce.',
    highlights: [
      'Developed customer, merchant, and rider mobile apps with React Native, Expo Router, and Reanimated',
      'Implemented real-time delivery tracking with custom Map IDs, live GPS, and Supabase Realtime',
      'Integrated secure email/SMS OTP login flows and Google/Facebook OAuth with email permission fallbacks',
      'Designed and maintained 70+ database tables with complex triggers, RLS policies, and database audit logs',
      'Built admin portal and web platform featuring automated transaction refunds and merchant settlements',
    ],
    tech: ['React Native', 'Expo Router', 'Supabase', 'PayMongo', 'TypeScript', 'Google Maps', 'PostgreSQL'],
  },
  {
    title: 'Freelance Full-Stack Engineer',
    company: 'Independent',
    type: 'Freelance',
    period: '2023 - Present',
    description:
      'Delivering enterprise-grade platforms for clients across SaaS, civic tech, AI applications, and business automation.',
    highlights: [
      'Architected ProfitView - a 22-module SaaS accounting system with AI agent',
      'Built government civic tech platform (OSCA) for senior citizen affairs management',
      'Developed AI-powered fitness PWA with food photo nutrition analysis',
      'Created multi-provider AI chatbot supporting OpenAI, Anthropic, and Azure',
      'Designed marketing systems and automation workflows with GHL and n8n',
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
    technologies: ['Next.js', 'React', 'React Native', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'],
  },
  {
    title: 'Backend & Infrastructure',
    icon: Database as LucideIcon,
    description: 'Scalable systems that handle growth without breaking.',
    technologies: ['Supabase', 'PostgreSQL', 'Prisma', 'Node.js', 'Vercel', 'Edge Functions'],
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
    description: 'Secure payment processing with multiple provider support.',
    technologies: ['Stripe', 'PayMongo', 'GCash', 'Maya', 'Subscriptions', 'Multi-currency'],
  },
  {
    title: 'AI & Automation',
    icon: Bot as LucideIcon,
    description: 'Intelligent automation that reduces costs and accelerates decisions.',
    technologies: ['OpenAI', 'Anthropic', 'n8n', 'Make', 'OCR', 'Prompt Engineering'],
  },
  {
    title: 'Data & Real-time',
    icon: Radio as LucideIcon,
    description: 'Live data, secure multi-tenancy, and actionable business insights.',
    technologies: ['PostgreSQL RLS', 'Realtime', 'WebSockets', 'Recharts', 'Analytics'],
  },
];

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
export const aboutData = {
  title: 'The Engineer Behind the Code',
  bio: [
    "I'm Gerald Villaceran, a full-stack engineer based in the Philippines specializing in building production-grade platforms that solve real business problems.",
    'From architecting a 22-module SaaS accounting system to shipping a multi-sided super-app with real-time delivery tracking and payment processing, I focus on one thing: building systems that create measurable business value.',
    'Great software is invisible. It just works, scales, and delivers results. That principle drives every system I build.',
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
      href: 'https://www.linkedin.com/in/gerald-villaceran-798983325',
    },
    {
      name: 'Email',
      icon: Mail as LucideIcon,
      href: 'mailto:geraldvillaceran01@gmail.com',
    },
  ],
};