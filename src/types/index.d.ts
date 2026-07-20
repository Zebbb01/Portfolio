// src/types/index.d.ts

export interface Project {
  title: string;
  slug: string;
  category: string;
  isFeatured: boolean;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  description: string;
  problem: string;
  impact: string;
  tech: string[];
  github: string;
  live: string;
  detailsUrl: string;
}

export interface TechItem {
  name: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

export interface SocialLink {
  name: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

export interface Experience {
  title: string;
  company: string;
  type: string;
  period: string;
  description: string;
  highlights: string[];
  tech: string[];
}

export interface TrustMetric {
  label: string;
  value: string;
}

export interface ExpertiseCategory {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  description: string;
  technologies: string[];
}