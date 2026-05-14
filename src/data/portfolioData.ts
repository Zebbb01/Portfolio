// src/data/portfolioData.ts
import { 
  Code, 
  Database, 
  Cloud, 
  Server, 
  Github, 
  Linkedin, 
  Mail, 
  Cpu, 
  Zap, 
  Globe, 
  Layout, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { Project } from '../types';

export const sections = ['home', 'about', 'expertise', 'projects', 'contact'];

export const aboutData = {
  title: "Building Digital Excellence",
  statement: "I help businesses scale with high-performance web systems - from concept to revenue.",
  description: "As a senior software engineer, I bridge the gap between complex engineering and intuitive user experiences. My philosophy is rooted in clean architecture, automated workflows, and high-impact digital products.",
  stats: [
    { label: "Faster time-to-market", value: "40%", detail: "Accelerating product launches through optimized CI/CD and modular architecture" },
    { label: "Higher lead conversion", value: "35%", detail: "Turning visitors into customers with high-performance sales funnels" },
    { label: "Reduction in manual work", value: "70%", detail: "Automating repetitive tasks to free up teams for high-value operations" }
  ]
};


export const techStack = {
  frontend: [
    { name: 'Next.js', icon: Code },
    { name: 'React', icon: Layout },
    { name: 'TypeScript', icon: Code },
    { name: 'TailwindCSS', icon: Layout },
    { name: 'Framer Motion', icon: Zap }
  ],
  infrastructure: [
    { name: 'Supabase', icon: Database },
    { name: 'PostgreSQL', icon: Database },
    { name: 'API Integration', icon: Server },
    { name: 'Zod', icon: ShieldCheck },
    { name: 'Vercel', icon: Cloud }
  ],
  automation: [
    { name: 'n8n / Make', icon: Zap },
    { name: 'AI Prompt Engineering', icon: Bot },
    { name: 'GHL Systems', icon: Globe },
    { name: 'Automation Workflows', icon: Cpu }
  ]
};

export const projects: Project[] = [
  {
    title: "ProfitView Accounting",
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Dashboard.png", 
    description: "Case Study: ProfitView Accounting is a sophisticated web-based accounting and finance operations platform built for modern SaaS businesses.\n\nProblem: Manual data entry and disconnected systems slowed down financial reporting.\n\nSolution: Architected a multi-tenant isolation system with real-time invoicing and expense capture.\n\nArchitecture Highlights: Next.js 15, Supabase, PostgreSQL RLS, Stripe integration, and OCR data extraction.\n\nBusiness Impact: Cut month-end closing times by 40% and improved team efficiency.",
    impact: "Cut month-end closing times by 40% and improved team efficiency.",
    tech: ["Next.js 15", "Supabase", "Stripe", "AI Agent", "PostgreSQL"],
    github: "#",
    live: "https://profit-view-swart.vercel.app/",
    detailsUrl: "/projects/profitview"
  },
  {
    title: "GHL Customize Website w/ Animations",
    isFeatured: true,
    mediaType: 'video',
    mediaSrc: "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/GHL/ghl-video%20(1).mkv",
    description: "Case Study: Custom-built marketing websites and highly optimized sales funnels using GoHighLevel (GHL).\n\nProblem: Low conversion rates due to generic layouts and poor user engagement.\n\nSolution: Designed immersive micro-animations and integrated custom CRM follow-up sequences.\n\nArchitecture Highlights: Advanced CSS animations, GHL API, custom JavaScript, and SEO-optimized DOM.\n\nBusiness Impact: Increased lead capture by 35% within 3 months of deployment.",
    impact: "Increased lead capture by 35% within 3 months of deployment.",
    tech: ["GHL", "CSS Animations", "CRM Integration", "JavaScript"],
    github: "#",
    live: "",
    detailsUrl: "/projects/ghl-website"
  },
  {
    title: "Growth Systems & Workflow Automation",
    isFeatured: true,
    mediaType: 'video',
    mediaSrc: "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automation-video.mkv",
    description: "Case Study: End-to-end automation systems designed to eliminate manual data entry and connect software silos.\n\nProblem: Disconnected tools causing delays in client onboarding and financial updates.\n\nSolution: Constructed intelligent data pipelines that react to real-time events without human intervention.\n\nArchitecture Highlights: n8n, Make, REST APIs, and Google Sheets integration.\n\nBusiness Impact: Improved business response times by over 70%, freeing the core team for strategic growth.",
    impact: "Improved business response times by over 70% and eliminated manual entry.",
    tech: ["n8n", "Make", "API Integration", "Google Sheets"],
    github: "#",
    live: "",
    detailsUrl: "/projects/growth-systems"
  }
];

export const projectScreenshots: Record<string, string[]> = {
  "ProfitView Accounting": [
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Dashboard.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Agent%20Activity%20Log.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Banking%20Details.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Bills%20Paid.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Bills.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Chart%20of%20Accounts.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Contact%20Activity%20History.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Contact%20Generated%20SOA.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Invoices%20Paid.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Landing.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Reports%20Trial%20Balance.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/Settings%20Fiscal%20Periods.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/SaaS/SignUp.png"
  ],
  "GHL Customize Website w/ Animations": [
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/GHL/ghl-video%20(1).mkv",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/GHL/ghl-video%20(2).mkv",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/GHL/ghl-video.mkv"
  ],
  "Growth Systems & Workflow Automation": [
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automate_image%20(1).png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automate_image%20(2).png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automate_image%20(3).png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automate_image%20(4).png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automate_image.png",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automation-video%20(2).mkv",
    "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-projects/Automation/automation-video.mkv"
  ]
};

export const contactInfo = {
  email: "geraldvillaceran01@gmail.com",
  phone: "+63 909 211 2874",
  location: "Philippines",
  socials: [
    { name: "Github", icon: Github, href: "https://github.com/Zebbb01" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/gerald-villaceran-798983325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
    },
    { name: "Gmail", icon: Mail, href: "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=geraldvillaceran01@gmail.com" }
  ]
};