// src/components/sections/HeroSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { currentFocus, formatDuration, monthsSince, trustMetrics } from '@/src/data/portfolioData';
import AnimatedBackground from '@/src/components/ui/AnimatedBackground';
import CountUp from '@/src/components/ui/CountUp';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------
export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#060606]"
    >
      {/* ── Background image ───────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* Left-to-right gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/80 to-[#060606]/40" />
        {/* Top and bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-[#060606]/70" />
      </div>

      {/* ── Animated Background ─────────────────────────────────── */}
      <AnimatedBackground />

      {/* ── Subtle grid overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Vertical accent line ────────────────────────────────── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-[38%] top-0 w-px h-[55vh] bg-gradient-to-b from-[#D4AF37]/15 via-[#D4AF37]/5 to-transparent origin-top hidden lg:block z-[1]"
      />

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-16 pt-28 pb-20 sm:pt-32 sm:pb-24 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left: Text ──────────────────────────────────────── */}
          <div className="lg:col-span-7">
            {/* Label */}
            <motion.div {...fadeUp(0.1)} className="flex flex-wrap items-center gap-3 mb-4">
              <p className="section-label">
                Software Engineer &#183; Full-Stack Web &amp; Mobile
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#4ADE80]">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                </span>
                Open to work
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              {...fadeUp(0.2)}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F0E8] leading-[1.08] tracking-[-0.02em]"
            >
              I Build
              <br />
              <span className="relative inline-block">
                <span className="text-[#D4AF37]">Systems</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-1 left-0 right-0 h-[3px] bg-[#D4AF37]/30 origin-left rounded-full"
                />
              </span>
              {' '}That
              <br />
              Scale Businesses.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.35)}
              className="text-base md:text-lg text-[#A09882] max-w-lg mt-5 leading-relaxed"
            >
              Specializing in enterprise platforms, SaaS products, and
              automation systems that drive measurable business outcomes.
            </motion.p>

            {/* CTA */}
            <motion.div
              {...fadeUp(0.45)}
              className="flex flex-col sm:flex-row items-start gap-4 mt-8"
            >
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-primary group inline-flex items-center gap-2"
              >
                View My Work
                <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="btn-secondary"
              >
                Let&apos;s Talk
              </button>
            </motion.div>

            {/* Trust metrics */}
            <motion.dl
              {...fadeUp(0.55)}
              className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-5 sm:gap-8 mt-10 pt-6 border-t border-[#1F1F1F]"
            >
              {trustMetrics.map((metric, i) => (
                <React.Fragment key={metric.label}>
                  {i > 0 && (
                    <div className="hidden sm:block w-px h-10 bg-[#1F1F1F]" aria-hidden="true" />
                  )}
                  <div className="flex flex-col">
                    <dd className="text-xl md:text-2xl font-bold text-[#F5F0E8] font-heading tracking-tight">
                      <CountUp value={metric.value} />
                    </dd>
                    <dt className="text-[10px] text-[#6B6355] uppercase tracking-[0.1em] mt-1">
                      {metric.label}
                    </dt>
                  </div>
                </React.Fragment>
              ))}
            </motion.dl>
          </div>

          {/* ── Right: Code card ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-5 items-center justify-center relative"
          >
            <div className="relative w-full max-w-sm">
              {/* Glow */}
              <div className="absolute -inset-8 bg-[#D4AF37]/[0.03] rounded-3xl blur-3xl" />

              {/* Card */}
              <div className="relative bg-[#0A0A0A]/80 border border-[#1A1A1A] rounded-2xl p-6 backdrop-blur-md">
                {/* Window dots */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/60" />
                  <span className="ml-3 text-[10px] text-[#6B6355] font-mono tracking-wide">systems.ts</span>
                </div>

                {/* Code */}
                <div className="font-mono text-[13px] leading-[1.8] space-y-0.5">
                  <p>
                    <span className="text-[#D4AF37]/60">const</span>{' '}
                    <span className="text-[#F5F0E8]">engineer</span>{' '}
                    <span className="text-[#6B6355]">=</span>{' '}
                    <span className="text-[#6B6355]">{'{'}</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-[#A09882]">name</span>
                    <span className="text-[#6B6355]">:</span>{' '}
                    <span className="text-[#D4AF37]/80">&quot;Gerald Villaceran&quot;</span>
                    <span className="text-[#6B6355]">,</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-[#A09882]">role</span>
                    <span className="text-[#6B6355]">:</span>{' '}
                    <span className="text-[#D4AF37]/80">&quot;Software Engineer&quot;</span>
                    <span className="text-[#6B6355]">,</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-[#A09882]">stack</span>
                    <span className="text-[#6B6355]">:</span>{' '}
                    <span className="text-[#6B6355]">[</span>
                    <span className="text-[#D4AF37]/80">&quot;Next.js&quot;</span>
                    <span className="text-[#6B6355]">,</span>{' '}
                    <span className="text-[#D4AF37]/80">&quot;React&quot;</span>
                    <span className="text-[#6B6355]">,</span>{' '}
                    <span className="text-[#D4AF37]/80">&quot;TS&quot;</span>
                    <span className="text-[#6B6355]">],</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-[#A09882]">building</span>
                    <span className="text-[#6B6355]">:</span>{' '}
                    <span className="text-[#D4AF37]/80">&quot;scalable systems&quot;</span>
                  </p>
                  <p>
                    <span className="text-[#6B6355]">{'}'}</span>
                    <span className="text-[#6B6355]">;</span>
                  </p>
                </div>

                {/* Cursor */}
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-[#D4AF37]/40 font-mono text-xs">{'>'}</span>
                  <div className="w-2 h-4 bg-[#D4AF37]/50 animate-pulse" />
                </div>
              </div>

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-[#0E0E0E]/90 border border-[#1F1F1F] rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-sm"
              >
                <p className="text-[10px] text-[#6B6355] uppercase tracking-wider mb-0.5">Shipping now</p>
                <p className="text-lg font-bold text-[#F5F0E8] font-heading">
                  {formatDuration(monthsSince(currentFocus.startedAt))}
                </p>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-[#0E0E0E]/90 border border-[#D4AF37]/15 rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-sm"
              >
                <p className="text-[10px] text-[#6B6355] uppercase tracking-wider mb-0.5">Test suites</p>
                <p className="text-lg font-bold text-[#D4AF37] font-heading">92</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll Indicator ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] text-[#6B6355] uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-[#D4AF37]/70" />
        </motion.div>
      </motion.div>

    </section>
  );
}