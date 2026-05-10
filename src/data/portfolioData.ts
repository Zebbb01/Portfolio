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

export const sections = ['home', 'expertise', 'projects', 'contact'];

export const techStack = {
  webDevelopment: [
    { name: 'Next.js 15', icon: Code },
    { name: 'React 19', icon: Layout },
    { name: 'TypeScript', icon: Code },
    { name: 'Tailwind CSS', icon: Layout },
    { name: 'Radix UI', icon: Layout }
  ],
  backendData: [
    { name: 'Supabase', icon: Database },
    { name: 'PostgreSQL', icon: Database },
    { name: 'API Integration', icon: Server },
    { name: 'Zod Validation', icon: ShieldCheck }
  ],
  automationAI: [
    { name: 'n8n / Make', icon: Zap },
    { name: 'AI Prompt Engineering', icon: Bot },
    { name: 'Antigravity / ChatGPT', icon: Cpu },
    { name: 'GHL Marketing Systems', icon: Globe }
  ],
  tools: [
    { name: 'Github', icon: Github },
    { name: 'Stripe Payments', icon: Cloud },
    { name: 'Resend Email', icon: Mail },
    { name: 'WordPress', icon: Layout }
  ]
};

export const projects: Project[] = [
  {
    title: "ProfitView Accounting",
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/profitview.png", 
    description: "Case Study: ProfitView Accounting is a sophisticated web-based accounting and finance operations platform built for modern SaaS businesses. As the lead software engineer, I architected this multi-tenant isolation system that features real-time invoicing, expense capture with highly accurate OCR data extraction, banking reconciliation, and AI-driven financial proactive alerts. We tackled complex scaling challenges by integrating Supabase and Next.js 15, resulting in a highly performant application. The system securely processes payments via Stripe and ensures strict data isolation across organizations using Row Level Security (RLS) policies in PostgreSQL. By engineering this platform from the ground up, we significantly reduced the manual data entry required by financial teams, ultimately cutting down their month-end closing times by 40% while maintaining enterprise-level security standards and robust observability. This project showcases my capability to deliver scalable, secure, and intuitive web applications tailored for complex business logic and strict compliance environments.",
    tech: ["Next.js 15", "Supabase", "Stripe", "AI Agent", "PostgreSQL"],
    github: "#",
    live: "https://profit-view-swart.vercel.app/",
    detailsUrl: "/projects/profitview"
  },
  {
    title: "GHL Customize Website w/ Animations",
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/ghl-website.png",
    description: "Case Study: When looking for the best web developer for custom ecommerce sites, clients often need a seamless blend of aesthetics and backend functionality. For this project, I engineered custom-built marketing websites and highly optimized sales funnels using GoHighLevel (GHL). The objective was to maximize lead conversion and user engagement through advanced CSS animations, dynamic CRM integrations, and SEO-optimized DOM structures. I completely overhauled the user experience by implementing interactive micro-animations that guide the user's attention toward primary call-to-action buttons. By leveraging custom JavaScript and GHL's API, I ensured that every lead captured was instantly synced with the client's CRM, triggering a personalized follow-up sequence. This approach not only elevated the brand's visual identity but also resulted in a 35% increase in conversion rates within the first month of deployment, proving the massive impact of combining premium UI/UX design with robust marketing infrastructure.",
    tech: ["GHL", "CSS Animations", "CRM Integration", "JavaScript"],
    github: "#",
    live: "https://drive.google.com/drive/folders/1coWZYw95pb4Vw3TTaCIvqRtwKS3k3mux?usp=drive_link",
    detailsUrl: "https://drive.google.com/drive/folders/1coWZYw95pb4Vw3TTaCIvqRtwKS3k3mux?usp=drive_link"
  },
  {
    title: "Growth Systems & Workflow Automation",
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: "https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/automation.png",
    description: "Case Study: To achieve massive scale, businesses require flawless marketing automation integration. I developed end-to-end automation systems designed to completely eliminate manual data entry, streamline financial operations, and bridge the gap between disconnected software silos. Leveraging powerful automation platforms like n8n and Make alongside Google Sheets and various REST APIs, I constructed intelligent data pipelines that react to real-time events. For instance, when a new client signs up, the system automatically provisions their account, sends a customized onboarding email sequence, and updates the accounting ledger—all without human intervention. This comprehensive automation architecture drastically improved the client's business response times by over 70%, allowing their core team to transition from repetitive administrative tasks to high-value strategic planning. My deep expertise in integrating disparate APIs ensures that data flows securely and reliably, forming the backbone of a highly efficient digital operation.",
    tech: ["n8n", "Make", "API Integration", "Google Sheets"],
    github: "#",
    live: "https://drive.google.com/drive/folders/15apEURviJiMWK-FJGsWkkPnysu8Fw02f?usp=sharing",
    detailsUrl: "https://drive.google.com/drive/folders/15apEURviJiMWK-FJGsWkkPnysu8Fw02f?usp=sharing"
  }
];

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