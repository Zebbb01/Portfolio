// src/types/index.d.ts

export interface Project {
  title: string;
  slug: string;
  category: string;
  isFeatured: boolean;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  /** Marks a project as still under active development. */
  status?: 'active';
  /** ISO date of the first commit; drives the live "N months" badge. */
  startedAt?: string;
  /** Case-study detail. All optional so a thin project still renders. */
  role?: string;
  timeline?: string;
  /** Who it is for and why it exists — the paragraph before the solution. */
  context?: string;
  /** The decisions worth defending, not a feature list. */
  approach?: { title: string; detail: string }[];
  /** Measured results, shown as a stat row. */
  outcomes?: { value: string; label: string }[];
  description: string;
  problem: string;
  impact: string;
  tech: string[];
  github: string;
  live: string;
  detailsUrl: string;
}

export interface Screenshot {
  src: string;
  caption: string;
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
  /** ISO dates; drive the computed duration badge. */
  startedAt?: string;
  endedAt?: string;
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