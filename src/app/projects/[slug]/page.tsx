// src/app/projects/[slug]/page.tsx
"use client";

import React, { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { formatDuration, monthsSince, projects, projectScreenshots } from '../../../data/portfolioData';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Globe,
  Maximize2,
  Monitor,
  Target,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageGallery } from '../../../components/ui/ImageGallery';
import CollaborationCTA from '../../../components/ui/CollaborationCTA';
import GeometricShape from '../../../components/ui/GeometricShape';

const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

/** Gold label above a heading, repeated for every block on the page. */
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="section-label">{label}</p>
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-[#F5F0E8] mt-2 tracking-[-0.01em]">
        {title}
      </h2>
    </div>
  );
}

const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const index = projects.findIndex((p) => p.detailsUrl === `/projects/${slug}`);
  const project = projects[index];

  // Hand off to the real not-found route so the response carries a 404 status.
  if (!project) {
    notFound();
  }

  const shots = projectScreenshots[project.title] || [];
  const nextProject = projects[(index + 1) % projects.length];
  const isActive = project.status === 'active';
  const hasLive = Boolean(project.live && project.live !== '#');
  const hasRepo = Boolean(project.github && project.github !== '#');

  const facts = [
    { label: 'Role', value: project.role ?? 'Software Engineer' },
    { label: 'Timeline', value: project.timeline ?? '—' },
    {
      label: 'Status',
      value:
        isActive && project.startedAt
          ? `Active · ${formatDuration(monthsSince(project.startedAt))}`
          : 'Shipped',
    },
    { label: 'Category', value: project.category },
  ];

  return (
    <div className="bg-[#060606] min-h-screen text-[#F5F0E8]">
      {/* ── Back Button ─────────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/#projects')}
        className="fixed top-5 left-5 md:top-6 md:left-6 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#060606]/70 backdrop-blur-xl border border-[#1F1F1F] text-[#A09882] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wide">Back to Portfolio</span>
      </motion.button>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative flex items-end overflow-hidden min-h-[68vh] md:min-h-[72vh] pt-28 pb-12">
        <div className="absolute inset-0 z-0">
          {project.mediaType === 'video' ? (
            <video
              src={project.mediaSrc}
              className="w-full h-full object-cover opacity-25"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={project.mediaSrc}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top opacity-25"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/70 via-[#060606]/85 to-[#060606]" />
        </div>

        <GeometricShape variant="quarter-circle" position="top-right" size={400} opacity={0.05} />

        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#D4AF37]">
                {project.category}
              </span>
              {isActive && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#4ADE80]">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                  </span>
                  In active development
                </span>
              )}
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5F0E8] tracking-[-0.03em] leading-[1.02] mt-6">
              {project.title}
            </h1>

            <p className="text-[#A09882] text-base md:text-lg max-w-2xl mt-5 leading-relaxed">
              {project.problem}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              {hasLive && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                  <Globe size={16} strokeWidth={1.5} />
                  Launch live demo
                  <ExternalLink
                    size={13}
                    strokeWidth={1.5}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              )}
              {shots.length > 0 && (
                <button
                  onClick={() => setGalleryIndex(0)}
                  className={hasLive ? 'btn-secondary' : 'btn-primary'}
                >
                  <Monitor size={16} strokeWidth={1.5} />
                  {shots.length} screenshots
                </button>
              )}
              {hasRepo && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Github size={16} strokeWidth={1.5} />
                  Repository
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Facts bar ───────────────────────────────────────────────── */}
      <section className="relative border-y border-[#1F1F1F] bg-[#0A0A0A]">
        <dl className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`py-6 sm:px-6 first:pl-0 ${
                i % 2 === 1 ? 'pl-6 border-l border-[#1F1F1F]' : ''
              } ${i > 1 ? 'border-t lg:border-t-0 border-[#1F1F1F]' : ''} ${
                i === 2 ? 'lg:border-l lg:border-[#1F1F1F]' : ''
              }`}
            >
              <dt className="text-[10px] uppercase tracking-[0.16em] text-[#6B6355]">{fact.label}</dt>
              <dd className="text-sm text-[#F5F0E8] mt-2 leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Context + what was built ────────────────────────────────── */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16">
          {project.context && (
            <motion.div {...reveal}>
              <SectionHeading label="The Context" title="Why this exists" />
              <p className="text-[#A09882] leading-relaxed">{project.context}</p>
            </motion.div>
          )}

          <motion.div {...reveal}>
            <SectionHeading label="What I Built" title="The system" />
            <p className="text-[#A09882] leading-relaxed">{project.description}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Engineering decisions ───────────────────────────────────── */}
      {project.approach && project.approach.length > 0 && (
        <section className="relative py-20 md:py-24 bg-[#0A0A0A] border-y border-[#1F1F1F]">
          <GeometricShape variant="concentric-arcs" position="bottom-left" size={300} opacity={0.05} />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div {...reveal}>
              <SectionHeading label="Engineering Decisions" title="How I approached it" />
              <p className="text-[#A09882] leading-relaxed max-w-2xl -mt-2 mb-10">
                The choices worth defending, and the reasoning behind each one.
              </p>
            </motion.div>

            <ol>
              {project.approach.map((item, i) => (
                <motion.li
                  key={item.title}
                  {...reveal}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="grid sm:grid-cols-12 gap-3 sm:gap-8 py-7 border-t border-[#1F1F1F] last:border-b"
                >
                  <div className="sm:col-span-4 flex items-start gap-3">
                    <span className="font-mono text-xs text-[#D4AF37]/50 pt-1 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-heading text-base md:text-lg font-semibold text-[#F5F0E8] leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="sm:col-span-8 text-sm text-[#A09882] leading-relaxed">{item.detail}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Results ─────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...reveal}>
            <SectionHeading label="Results" title="What it delivered" />
          </motion.div>

          {project.outcomes && project.outcomes.length > 0 && (
            <motion.dl
              {...reveal}
              className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1F1F1F] border border-[#1F1F1F] rounded-2xl overflow-hidden mt-8"
            >
              {project.outcomes.map((outcome) => (
                <div key={outcome.label} className="bg-[#0E0E0E] p-6">
                  <dd className="font-heading text-2xl md:text-3xl font-bold text-[#D4AF37] tracking-tight">
                    {outcome.value}
                  </dd>
                  <dt className="text-[10px] text-[#6B6355] uppercase tracking-[0.14em] mt-2 leading-relaxed">
                    {outcome.label}
                  </dt>
                </div>
              ))}
            </motion.dl>
          )}

          <motion.div
            {...reveal}
            className="flex items-start gap-4 mt-8 p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04]"
          >
            <Target size={20} strokeWidth={1.5} className="text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37]">Headline outcome</p>
              <p className="font-heading text-xl md:text-2xl font-semibold text-[#F5F0E8] mt-2">
                {project.impact}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Walkthrough: screenshots inline, each captioned ─────────── */}
      {shots.length > 0 && (
        <section className="relative py-20 md:py-24 bg-[#0A0A0A] border-y border-[#1F1F1F]">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div {...reveal}>
              <SectionHeading label="Walkthrough" title="Inside the product" />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {shots.map((shot, i) => (
                <motion.figure
                  key={shot.src}
                  {...reveal}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={i === 0 ? 'sm:col-span-2' : undefined}
                >
                  <button
                    onClick={() => setGalleryIndex(i)}
                    aria-label={`Open screenshot ${i + 1} of ${shots.length}`}
                    className="group relative block w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#1F1F1F] hover:border-[#D4AF37]/25 transition-colors"
                  >
                    {isVideo(shot.src) ? (
                      <video
                        src={shot.src}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={shot.src}
                        alt={shot.caption}
                        fill
                        sizes={i === 0 ? '(max-width: 640px) 100vw, 900px' : '(max-width: 640px) 100vw, 450px'}
                        className="object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      />
                    )}
                    <span className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-[#060606]/70 backdrop-blur-sm border border-[#1F1F1F] text-[#A09882] opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={14} strokeWidth={1.5} />
                    </span>
                  </button>
                  <figcaption className="text-xs text-[#6B6355] mt-3 leading-relaxed">
                    {shot.caption}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stack ───────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...reveal}>
            <SectionHeading label="Stack" title="Built with" />
            <div className="flex flex-wrap gap-2 mt-8">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 bg-[#0E0E0E] rounded-full text-sm text-[#A09882] border border-[#1F1F1F]"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Collaboration invitation ────────────────────────────────── */}
      <CollaborationCTA subject={project.title} />

      {/* ── Next case study ─────────────────────────────────────────── */}
      <section className="relative border-t border-[#1F1F1F]">
        <Link href={nextProject.detailsUrl} className="group block max-w-5xl mx-auto px-6 py-12 md:py-16">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#6B6355]">Next case study</p>
          <div className="flex items-center justify-between gap-6 mt-3">
            <div>
              <h2 className="font-heading text-2xl md:text-4xl font-semibold text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors tracking-[-0.02em]">
                {nextProject.title}
              </h2>
              <p className="text-sm text-[#6B6355] mt-2">{nextProject.category}</p>
            </div>
            <ArrowRight
              size={28}
              strokeWidth={1.5}
              className="text-[#6B6355] shrink-0 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all"
            />
          </div>
        </Link>
      </section>

      <ImageGallery
        images={shots}
        isOpen={galleryIndex !== null}
        startIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
        title={project.title}
      />
    </div>
  );
};

export default ProjectCaseStudy;
