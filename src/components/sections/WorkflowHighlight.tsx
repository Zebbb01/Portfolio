'use client';

// The workflow picked as the one that saves the most time, with its video and its logged results.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { ImageGallery } from '@/src/components/ui/ImageGallery';
import workflows from '@/src/data/workflows.json';
import { projects } from '@/src/data/portfolioData';

const MEDIA = '/project/Automation/workflows/job-hunt-find-and-score';
const results = projects.find((p) => p.slug === 'job-hunt-automation')?.outcomes?.slice(0, 3) ?? [];
const pictures = workflows
  .filter((w) => w.category === 'job-search')
  .map((w) => ({ src: w.image, caption: `${w.title}: ${w.summary}` }));

export default function WorkflowHighlight() {
  const video = useRef<HTMLVideoElement>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    // Plays by itself only for people who have not asked their system to reduce motion.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.current?.play().catch(() => {});
  }, []);

  return (
    <section aria-labelledby="highlight" className="mt-10 grid gap-8 rounded-2xl border border-[#D4AF37]/25 bg-[#0E0E0E] p-4 sm:p-5 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-7 overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#060606]">
        <video
          ref={video}
          src={`${MEDIA}.mp4`}
          poster={`${MEDIA}-poster.webp`}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          aria-label="A walkthrough of the Find and score workflow, step by step."
          className="block aspect-video w-full object-cover"
        />
      </div>

      <div className="lg:col-span-5 lg:pr-4">
        <p className="section-label">Most time saved</p>
        <h2 id="highlight" className="font-heading text-2xl md:text-3xl font-semibold text-[#F5F0E8] mt-2 tracking-[-0.01em]">
          Job Hunt · Find and score
        </h2>
        <p className="text-sm text-[#A09882] mt-3 leading-relaxed">
          It reads every new posting each day, so I open only the ones that fit.
        </p>

        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#1F1F1F]">
          {results.map((result) => (
            <div key={result.label} className="bg-[#0E0E0E] p-3">
              <dd className="font-heading text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight tabular-nums">{result.value}</dd>
              <dt className="text-[10px] uppercase tracking-[0.12em] text-[#A09882] mt-1 leading-snug">{result.label}</dt>
            </div>
          ))}
        </dl>
        <p className="text-xs text-[#6B6355] mt-2">From its own log, 13 Oct to 9 Nov 2026.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/projects/job-hunt-automation" className="btn-primary group">
            Read the case study
            <ArrowRight size={15} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => setGalleryOpen(true)} className="btn-secondary">
            <Maximize2 size={15} strokeWidth={1.5} aria-hidden="true" />
            View the workflows
          </button>
        </div>
      </div>

      <ImageGallery images={pictures} isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} title="Job search workflows" />
    </section>
  );
}
