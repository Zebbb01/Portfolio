// src/app/projects/[slug]/page.tsx
"use client";

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink, Github, Globe, Maximize2, Monitor } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDuration, monthsSince, projects, projectScreenshots } from '../../../data/portfolioData';
import workflows from '../../../data/workflows.json';
import AutoVideo from '../../../components/ui/AutoVideo';
import CollaborationCTA from '../../../components/ui/CollaborationCTA';
import { ImageGallery } from '../../../components/ui/ImageGallery';
import type { Screenshot } from '../../../types';

const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

const imageFit = (shot: Screenshot) => (shot.fit === 'contain' ? 'object-contain p-3' : 'object-cover object-top');

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="section-label">{label}</p>
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5F0E8] mt-2 tracking-[-0.01em]">{title}</h2>
    </div>
  );
}

// Same order on every project: what it did and what it looks like come first, the reasoning after.
const ProjectCaseStudy = () => {
  const { slug } = useParams();
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

  // A project's own video leads when it has one, otherwise its first screenshot.
  const fromMedia: Screenshot = { src: project.mediaSrc, caption: '' };
  const lead = project.mediaType === 'video' ? shots.find((s) => s.src === project.mediaSrc) ?? fromMedia : shots[0] ?? fromMedia;
  const leadIndex = shots.indexOf(lead);
  const others = shots.filter((shot) => shot !== lead);

  const status = isActive && project.startedAt ? `Active · ${formatDuration(monthsSince(project.startedAt))}` : 'Shipped';
  const meta = [project.role ?? 'Software Engineer', project.timeline, status].filter(Boolean).join(' · ');

  const leadImage = (
    <Image
      src={lead.src}
      alt={lead.caption || project.title}
      fill
      priority
      sizes="(max-width: 1024px) 100vw, 660px"
      className={`transition-transform duration-500 motion-safe:group-hover:scale-[1.02] ${imageFit(lead)}`}
    />
  );

  return (
    <div className="bg-[#060606] min-h-screen text-[#F5F0E8]">
      <Link
        href="/#projects"
        className="fixed top-5 left-5 md:top-6 md:left-6 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#060606]/70 backdrop-blur-xl border border-[#1F1F1F] text-[#A09882] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide">Back to Portfolio</span>
      </Link>

      <main className="max-w-6xl mx-auto px-6 pt-24 md:pt-24 pb-12">
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

        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5F0E8] mt-3 tracking-[-0.02em]">{project.title}</h1>
        <p className="text-[#A09882] mt-3 max-w-3xl leading-relaxed">{project.problem}</p>
        <p className="text-sm text-[#A09882] mt-1.5">{meta}</p>

        {/* ── The value: the product and its results on the first screen ── */}
        <section
          aria-label="Results"
          className="mt-5 grid gap-6 rounded-2xl border border-[#D4AF37]/25 bg-[#0E0E0E] p-4 sm:p-5 lg:grid-cols-12 lg:items-center lg:gap-10"
        >
          <div className="lg:col-span-7 overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#060606]">
            {isVideo(lead.src) ? (
              <AutoVideo src={lead.src} controls aria-label={`A video of ${project.title}.`} className="block aspect-video w-full object-cover" />
            ) : leadIndex >= 0 ? (
              <button
                type="button"
                onClick={() => setGalleryIndex(leadIndex)}
                aria-label={`Open screenshot ${leadIndex + 1} of ${shots.length}`}
                className="group relative block aspect-video w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D4AF37]"
              >
                {leadImage}
              </button>
            ) : (
              <div className="relative aspect-video w-full">{leadImage}</div>
            )}
          </div>

          <div className="lg:col-span-5 lg:pr-4">
            <p className="section-label">Results</p>
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5F0E8] mt-2 tracking-[-0.01em] leading-snug">{project.impact}</h2>

            {project.outcomes && project.outcomes.length > 0 && (
              <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#1F1F1F]">
                {project.outcomes.map((outcome) => (
                  <div key={outcome.label} className="bg-[#0E0E0E] p-3 [&:last-child:nth-child(odd)]:col-span-2">
                    <dd className="font-heading text-xl font-bold text-[#D4AF37] tracking-tight tabular-nums">{outcome.value}</dd>
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-[#A09882] mt-1 leading-snug">{outcome.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {hasLive && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-primary group !px-5">
                  <Globe size={16} strokeWidth={1.5} aria-hidden="true" />
                  Launch live demo
                  <ExternalLink size={13} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              )}
              {shots.length > 0 && (
                <button type="button" onClick={() => setGalleryIndex(0)} className={`${hasLive ? 'btn-secondary' : 'btn-primary'} !px-5`}>
                  <Monitor size={16} strokeWidth={1.5} aria-hidden="true" />
                  {shots.length} screenshots
                </button>
              )}
              {hasRepo && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-5">
                  <Github size={16} strokeWidth={1.5} aria-hidden="true" />
                  Repository
                </a>
              )}
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section aria-labelledby="inside" className="mt-10">
            <h2 id="inside" className="font-heading text-xl md:text-2xl font-semibold text-[#F5F0E8] tracking-[-0.01em]">
              Inside the product
            </h2>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((shot) => {
                const shotIndex = shots.indexOf(shot);
                return (
                  <li key={shot.src}>
                    <figure>
                      <button
                        type="button"
                        onClick={() => setGalleryIndex(shotIndex)}
                        aria-label={`Open screenshot ${shotIndex + 1} of ${shots.length}`}
                        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#0E0E0E] transition-colors hover:border-[#D4AF37]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                      >
                        {isVideo(shot.src) ? (
                          <AutoVideo src={shot.src} aria-hidden="true" className="h-full w-full object-cover" />
                        ) : (
                          <Image
                            src={shot.src}
                            alt={shot.caption}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                            className={`transition-transform duration-500 motion-safe:group-hover:scale-[1.03] ${imageFit(shot)}`}
                          />
                        )}
                        <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#1F1F1F] bg-[#060606]/70 text-[#A09882] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          <Maximize2 size={14} strokeWidth={1.5} aria-hidden="true" />
                        </span>
                      </button>
                      <figcaption className="text-xs text-[#A09882] mt-2.5 leading-relaxed">{shot.caption}</figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {project.linksLibrary && (
          <Link
            href="/automations"
            className="group mt-10 flex items-center justify-between gap-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] px-5 py-4 transition-colors hover:border-[#D4AF37]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            <span>
              <span className="block font-heading text-lg font-semibold text-[#F5F0E8]">See all {workflows.length} n8n workflows</span>
              <span className="block text-xs text-[#A09882] mt-0.5">Search by tool, category or what starts them</span>
            </span>
            <ArrowRight size={20} strokeWidth={1.5} className="shrink-0 text-[#D4AF37] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        )}
      </main>

      {/* ── The reasoning, for those who want it ─────────────────────── */}
      <section className="border-t border-[#1F1F1F] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {project.context && (
              <div>
                <SectionHeading label="The Context" title="Why this exists" />
                <p className="text-[#A09882] leading-relaxed">{project.context}</p>
              </div>
            )}
            <div>
              <SectionHeading label="What I Built" title="The system" />
              <p className="text-[#A09882] leading-relaxed">{project.description}</p>
            </div>
          </div>

          {project.approach && project.approach.length > 0 && (
            <div className="mt-10">
              <SectionHeading label="Engineering Decisions" title="How I approached it" />
              <div className="border-b border-[#1F1F1F]">
                {project.approach.map((item) => (
                  <details key={item.title} className="group border-t border-[#1F1F1F]">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 font-heading text-base font-semibold text-[#F5F0E8] transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-[#D4AF37] [&::-webkit-details-marker]:hidden">
                      {item.title}
                      <ChevronDown size={18} strokeWidth={1.5} className="shrink-0 text-[#A09882] transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="max-w-3xl pb-4 text-sm leading-relaxed text-[#A09882]">{item.detail}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <SectionHeading label="Stack" title="Built with" />
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="px-3 py-1.5 bg-[#0E0E0E] rounded-full text-sm text-[#A09882] border border-[#1F1F1F]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CollaborationCTA subject={project.title} />

      <section className="relative border-t border-[#1F1F1F]">
        <Link href={nextProject.opensAt ?? nextProject.detailsUrl} className="group block max-w-6xl mx-auto px-6 py-8 md:py-10">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#A09882]">Next project</p>
          <div className="flex items-center justify-between gap-6 mt-2">
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors tracking-[-0.01em]">
                {nextProject.title}
              </h2>
              <p className="text-sm text-[#A09882] mt-1">{nextProject.category}</p>
            </div>
            <ArrowRight
              size={24}
              strokeWidth={1.5}
              className="text-[#6B6355] shrink-0 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all"
              aria-hidden="true"
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
