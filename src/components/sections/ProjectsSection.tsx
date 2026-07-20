// src/components/sections/ProjectsSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/src/data/portfolioData';
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
        </motion.div>

        <div className="space-y-8 mt-16">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#0E0E0E] rounded-2xl overflow-hidden border border-transparent hover:border-[#D4AF37]/10 transition-all duration-500 group"
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
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src={project.mediaSrc}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#D4AF37]">
                      {project.category}
                    </span>

                    <h3 className="font-heading text-2xl md:text-3xl font-semibold text-[#F5F0E8] mt-2">
                      {project.title}
                    </h3>

                    <p className="text-sm text-[#A09882] mt-4 leading-relaxed line-clamp-4">
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
                    <div className="flex items-center gap-5 mt-6">
                      {project.live && project.live !== '' && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[#D4AF37] hover:text-[#E8D48B] transition-colors"
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