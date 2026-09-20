// src/components/sections/ProjectsSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { projects, formatDuration, monthsSince } from '@/src/data/portfolioData';
import GeometricShape from '@/src/components/ui/GeometricShape';

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
        >
          <p className="section-label">Selected Work</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#F5F0E8] mt-3">
            Projects That Delivered Results
          </h2>
          <p className="text-[#A09882] mt-4 max-w-2xl leading-relaxed">
            Four systems in production. Every figure below is measured, not estimated.
          </p>
        </motion.div>

        <div className="space-y-8 mt-16">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            const isActive = project.status === 'active';

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-[#0E0E0E] rounded-2xl overflow-hidden border transition-all duration-500 group ${
                  isActive
                    ? 'border-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.04)]'
                    : 'border-transparent hover:border-[#D4AF37]/10'
                }`}
              >
                <div className="lg:grid lg:grid-cols-2">
                  {/* Media */}
                  <div
                    className={`relative aspect-video lg:aspect-auto lg:min-h-[400px] overflow-hidden ${
                      !isEven ? 'lg:order-2' : ''
                    }`}
                  >
                    {project.mediaType === 'video' ? (
                      <video
                        src={project.mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-label={`${project.title} preview`}
                        className="w-full h-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src={project.mediaSrc}
                        alt={`${project.title} — ${project.category}`}
                        fill
                        priority={index === 0}
                        className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#D4AF37]">
                        {project.category}
                      </span>
                      {isActive && project.startedAt && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#4ADE80]">
                          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60 motion-safe:animate-ping" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                          </span>
                          Active · {formatDuration(monthsSince(project.startedAt))}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-2xl md:text-3xl font-semibold text-[#F5F0E8] mt-2">
                      {project.title}
                    </h3>

                    <p className="text-sm text-[#A09882] mt-4 leading-relaxed line-clamp-5">
                      {project.description}
                    </p>

                    {/* Impact pill */}
                    <div className="mt-5">
                      <span className="inline-flex items-center gap-2 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 text-sm text-[#D4AF37]">
                        <TrendingUp size={14} strokeWidth={1.5} />
                        {project.impact}
                      </span>
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap items-center gap-1 mt-4">
                      {project.tech.map((t, i) => (
                        <span key={t} className="text-xs text-[#6B6355]">
                          {t}{i < project.tech.length - 1 && <span className="mx-1.5 text-[#3a3530]">&middot;</span>}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6">
                      {project.live && project.live !== '' && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[#D4AF37] hover:text-[#E8D48B] transition-colors"
                          aria-label={`Open the live ${project.title} demo in a new tab`}
                        >
                          Live Demo
                          <ExternalLink size={14} strokeWidth={1.5} />
                        </a>
                      )}
                      <Link
                        href={project.detailsUrl}
                        className="inline-flex items-center gap-1.5 text-sm text-[#A09882] hover:text-[#F5F0E8] transition-colors"
                      >
                        View Details
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}