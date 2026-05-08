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
    description: "A sophisticated web-based accounting and finance operations platform. Features multi-tenant isolation, real-time invoicing, expense capture with OCR data extraction, banking reconciliation, and AI-driven financial proactive alerts.",
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
    description: "Custom-built marketing websites and funnels using GoHighLevel. Implemented advanced CSS animations, CRM integrations, and SEO-optimized structures to maximize lead conversion and user engagement.",
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
    description: "End-to-end automation systems that reduce manual accounting work and streamline operations. Leveraged n8n, Make, and Google Sheets to improve business response times by over 70%.",
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