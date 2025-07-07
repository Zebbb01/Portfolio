// src/data/portfolioData.ts
import { Code, Database, Cloud, Server, Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Project } from '../types';

export const sections = ['home', 'expertise', 'projects', 'contact'];

export const techStack = {
  frontend: [
    { name: 'JavaScript ES6+', icon: Code },
    { name: 'Next.js', icon: Code },
    { name: 'React', icon: Code }
  ],
  backend: [
    { name: 'Python', icon: Server },
    { name: 'Laravel', icon: Server },
    { name: 'PHP', icon: Server }
  ],
  database: [
    { name: 'MySQL', icon: Database },
    { name: 'PostgreSQL', icon: Database }
  ],
  cloud: [
    { name: 'Amazon AWS', icon: Cloud },
    { name: 'EC2', icon: Cloud },
    { name: 'Docker', icon: Cloud },
    { name: 'RDS', icon: Cloud },
    { name: 'Github', icon: Github }
  ]
};


export const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: "/images/test.jpg", // Path to your image
    description: "Full-stack e-commerce solution built with Next.js and Laravel API, featuring user authentication, payment integration, and an admin dashboard.",
    tech: ["Next.js", "Laravel", "MySQL", "AWS"],
    github: "#",
    live: "#"
  },
  {
    title: "OSCA MANAGEMENT INFORMATION SYSTEM",
    isFeatured: false, // Example of a non-featured project
    mediaType: 'video',
    mediaSrc: "/videos/vid-test.mkv", // Path to your video
    description: "A secure and efficient management information system for the Office of Senior Citizen Affairs (OSCA), streamlining record-keeping, benefit distribution, and financial tracking for enhanced service delivery.",
    tech: ["React", "Python", "PostgreSQL", "Docker"],
    github: "https://github.com/johnkristanf/__OSCA__",
    live: "#"
  },
  {
    title: "Portfolio Website",
    isFeatured: true,
    mediaType: 'image',
    mediaSrc: "/images/test.jpg",
    description: "Modern portfolio website with smooth animations and responsive design, showcasing projects and technical skills.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "#",
    live: "#"
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