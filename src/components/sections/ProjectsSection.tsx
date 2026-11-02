// src/components/sections/ProjectsSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/src/data/portfolioData';
import GeometricShape from '@/src/components/ui/GeometricShape';
import ProjectTile from '@/src/components/ui/ProjectTile';

// The featured work as a bento grid: the first project large, the rest around it.
// Everything else lives on the projects page.
const featured = projects.filter((p) => p.isFeatured);

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <GeometricShape variant="corner-accent" position="top-left" size={400} opacity={0.1} />
      <GeometricShape variant="diamond" position="bottom-right" size={280} opacity={0.08} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="section-label">Selected Work</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#F5F0E8] mt-3">
              Projects That Delivered Results
            </h2>
            <p className="text-[#A09882] mt-4 max-w-2xl leading-relaxed">
              Four systems in production. Every figure below is measured, not estimated.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D4AF37]/30 px-5 text-sm font-medium text-[#D4AF37] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            View all {projects.length} projects
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.06 }}
              className={index === 0 ? 'md:col-span-2 lg:row-span-2' : ''}
            >
              <ProjectTile project={project} large={index === 0} priority={index === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
