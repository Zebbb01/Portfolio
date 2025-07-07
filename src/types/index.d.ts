// src/types/index.d.ts
export interface Project {
    title: string;
    isFeatured: boolean;
    mediaType: 'image' | 'video';
    mediaSrc: string;
    description: string;
    tech: string[];
    github: string;
    live: string;
}

export interface TechItem {
    name: string;
    icon: JSX.Element;
}

export interface SocialLink {
    name: string;
    icon: JSX.Element;
    href: string;
}