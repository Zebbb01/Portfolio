// src/components/sections/CurrentlyBuildingSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, GitCommitHorizontal } from 'lucide-react';
import { currentFocus, formatDuration, monthsSince } from '@/src/data/portfolioData';
import GeometricShape from '@/src/components/ui/GeometricShape';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function CurrentlyBuildingSection() {
  const months = monthsSince(currentFocus.startedAt);

  return (
    <section
      id="current"
      className="relative overflow-hidden py-20 md:py-28 lg:py-32 bg-[#0A0A0A]"
      aria-labelledby="current-heading"
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-[#060606] rounded-b-[3rem]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#060606] rounded-t-[3rem]" />
      <GeometricShape variant="concentric-arcs" position="top-right" size={340} opacity={0.08} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* ── Left: status + stats ───────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
          >
            {/* Live status pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] pl-3 pr-4 py-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
                {currentFocus.label}
              </span>
            </div>

            <h2
              id="current-heading"
              className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-[#F5F0E8] mt-6 leading-[1.1] tracking-[-0.02em]"
            >
              {currentFocus.project}
            </h2>

            <p className="text-sm text-[#D4AF37] mt-3 font-medium">
              {currentFocus.role}
              <span className="text-[#6B6355] mx-2">·</span>
              <span className="text-[#A09882]">
                {formatDuration(months)} and counting
              </span>
            </p>

            <p className="text-base text-[#A09882] mt-5 leading-relaxed">
              {currentFocus.summary}
            </p>

            {/* Hard numbers */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 mt-8 pt-8 border-t border-[#1F1F1F]">
              {currentFocus.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-heading text-2xl md:text-[1.75rem] font-bold text-[#F5F0E8] tracking-tight">
                    {stat.value}
                  </dd>
                  <dt className="text-[10px] text-[#6B6355] uppercase tracking-[0.14em] mt-1">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            <Link
              href="/projects/profitview"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] hover:text-[#E8D48B] transition-colors mt-8"
            >
              Read the case study
              <ArrowRight
                size={15}
                strokeWidth={1.75}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* ── Right: milestone timeline ──────────────────────────── */}
          <div className="lg:col-span-7 mt-14 lg:mt-0">
            <p className="section-label mb-8">The Build Log</p>

            <ol className="relative">
              {/* Spine */}
              <div
                className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/15 to-transparent"
                aria-hidden="true"
              />

              {currentFocus.milestones.map((milestone, i) => {
                const isLatest = i === currentFocus.milestones.length - 1;

                return (
                  <motion.li
                    key={milestone.period}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative pl-8 pb-9 last:pb-0"
                  >
                    {/* Node */}
                    <span
                      className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-[#0A0A0A] ${
                        isLatest ? 'bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.5)]' : 'bg-[#4a4030]'
                      }`}
                      aria-hidden="true"
                    />

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6355]">
                        {milestone.period}
                      </span>
                      {isLatest && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/25 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#D4AF37]">
                          <GitCommitHorizontal size={11} strokeWidth={2} />
                          Now
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-lg font-semibold text-[#F5F0E8] mt-1.5">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-[#A09882] mt-1.5 leading-relaxed max-w-xl">
                      {milestone.detail}
                    </p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
