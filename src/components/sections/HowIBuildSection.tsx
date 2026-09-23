// src/components/sections/HowIBuildSection.tsx
'use client';

import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { buildProcess, currentFocus, type ToolTier } from '@/src/data/portfolioData';
import BrandIcon from '@/src/components/ui/BrandIcon';
import CountUp from '@/src/components/ui/CountUp';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
const ease = [0.16, 1, 0.3, 1] as const;

const tierStyle: Record<ToolTier, string> = {
  Paid: 'border-[#D4AF37]/30 text-[#D4AF37]',
  'Free tier': 'border-[#4ADE80]/25 text-[#4ADE80]',
  'Open source': 'border-[#A09882]/25 text-[#A09882]',
};

function TierChip({ tier }: { tier: ToolTier }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${tierStyle[tier]}`}>
      {tier}
    </span>
  );
}

// Week n of the build and the milestone it fell under, derived from the
// Currently Building milestones so the two sections can never disagree.
const DAY = 864e5;
function weekInfo(week: number) {
  const date = new Date(new Date(currentFocus.startedAt).getTime() + (week - 1) * 7 * DAY);
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const milestone = currentFocus.milestones.find((m) => m.period.includes(month));
  return { month, year: date.getUTCFullYear(), milestone };
}

export default function HowIBuildSection() {
  const reduce = useReducedMotion();
  const { phases, release, velocity, tools, guarantees, intro } = buildProcess;

  const [phase, setPhase] = useState(phases.length - 1);
  const [week, setWeek] = useState(release.weeks);
  const [tool, setTool] = useState(0);

  const current = weekInfo(week);
  const activePhase = phases[phase];
  const activeTool = tools[tool];

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = (phase + (e.key === 'ArrowRight' ? 1 : -1) + phases.length) % phases.length;
    setPhase(next);
    document.getElementById(`phase-tab-${phases[next].id}`)?.focus();
  };

  // Hovering the strip scrubs it; the range input on top handles click,
  // drag, touch and keyboard natively.
  const onStripMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 0.9999);
    setWeek(Math.floor(ratio * release.weeks) + 1);
  };

  return (
    <section id="process" className="relative py-20 md:py-28 lg:py-32" aria-labelledby="process-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="section-label">How I Build</p>
          <h2
            id="process-heading"
            className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-[#F5F0E8] mt-4 leading-[1.1] tracking-[-0.02em]"
          >
            AI-native, held to a test suite.
          </h2>
          <p className="text-base text-[#A09882] mt-5 leading-relaxed">{intro}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
          {/* ── Phase switcher ───────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="lg:col-span-5 bg-[#0E0E0E] rounded-2xl border border-[#1F1F1F] p-6 md:p-8 flex flex-col"
          >
            <div
              role="tablist"
              aria-label="AI tooling over time"
              onKeyDown={onTabKey}
              className="grid grid-cols-2 gap-1 rounded-full bg-[#060606] p-1"
            >
              {phases.map((p, i) => (
                <button
                  key={p.id}
                  id={`phase-tab-${p.id}`}
                  role="tab"
                  type="button"
                  aria-selected={phase === i}
                  aria-controls="phase-panel"
                  tabIndex={phase === i ? 0 : -1}
                  onClick={() => setPhase(i)}
                  className={`relative rounded-full px-3 py-2.5 min-h-11 text-xs font-medium tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                    phase === i ? 'text-[#060606]' : 'text-[#A09882] hover:text-[#F5F0E8]'
                  }`}
                >
                  {phase === i && (
                    <motion.span
                      layoutId="phase-pill"
                      className="absolute inset-0 rounded-full bg-[#D4AF37]"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{p.label}</span>
                </button>
              ))}
            </div>

            <div
              id="phase-panel"
              role="tabpanel"
              aria-labelledby={`phase-tab-${activePhase.id}`}
              className="mt-8 flex-1"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activePhase.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="grid place-items-center h-12 w-12 rounded-xl bg-[#D4AF37]/[0.08] border border-[#D4AF37]/15 text-[#D4AF37]">
                      <BrandIcon slug={activePhase.slug} className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-heading text-xl font-semibold text-[#F5F0E8]">{activePhase.tool}</p>
                      <div className="mt-1">
                        <TierChip tier={activePhase.tier} />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#A09882] leading-relaxed mt-5">{activePhase.summary}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Release cadence strip ───────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="lg:col-span-7 bg-[#0E0E0E] rounded-2xl border border-[#1F1F1F] p-6 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-heading text-xl font-semibold text-[#F5F0E8]">
                {release.weeks} weeks. {release.weeks} releases.
              </h3>
              <span className="text-xs text-[#6B6355] uppercase tracking-[0.14em]">Now at {release.version}</span>
            </div>
            <p className="text-sm text-[#6B6355] mt-1">Hover or drag across the weeks.</p>

            <div
              onPointerMove={onStripMove}
              className="relative mt-6 h-24 rounded-lg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[#D4AF37]"
            >
              <motion.div
                className="absolute inset-0 flex items-end gap-[3px]"
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={{ visible: { transition: { staggerChildren: 0.025 } } }}
                aria-hidden="true"
              >
                {Array.from({ length: release.weeks }, (_, i) => {
                  const n = i + 1;
                  return (
                    <motion.span
                      key={n}
                      variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }}
                      transition={{ duration: 0.4, ease }}
                      className={`flex-1 origin-bottom rounded-sm transition-[height,background-color] duration-200 ${
                        n === week ? 'h-full bg-[#E8D48B]' : n < week ? 'h-3/5 bg-[#D4AF37]/60' : 'h-3/5 bg-[#D4AF37]/20'
                      }`}
                    />
                  );
                })}
              </motion.div>
              <input
                type="range"
                min={1}
                max={release.weeks}
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                aria-label="Release week"
                aria-valuetext={`Week ${week}, ${current.month} ${current.year}${current.milestone ? `, ${current.milestone.title}` : ''}`}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>

            <div className="mt-5 min-h-[4.5rem]" aria-live="polite">
              <p className="text-xs uppercase tracking-[0.14em] text-[#D4AF37]">
                Week {week} · {current.month} {current.year}
                {week === release.weeks && <span className="text-[#6B6355]"> · {release.version}</span>}
              </p>
              {current.milestone && (
                <p className="text-sm text-[#A09882] mt-2 leading-relaxed">
                  <span className="text-[#F5F0E8] font-medium">{current.milestone.title}.</span>{' '}
                  {current.milestone.detail}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Velocity ───────────────────────────────────────────── */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 mt-12 py-10 border-y border-[#1F1F1F]">
          {velocity.map((stat) => (
            <div key={stat.label}>
              <dd className="font-heading text-3xl md:text-4xl font-bold text-[#F5F0E8] tracking-tight">
                <CountUp value={stat.value} />
              </dd>
              <dt className="text-[10px] text-[#6B6355] uppercase tracking-[0.14em] mt-2">{stat.label}</dt>
            </div>
          ))}
        </dl>

        {/* ── Toolchain ──────────────────────────────────────────── */}
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-heading text-xl font-semibold text-[#F5F0E8]">The toolchain</h3>
            <div className="flex flex-wrap gap-2" aria-hidden="true">
              <TierChip tier="Paid" />
              <TierChip tier="Free tier" />
              <TierChip tier="Open source" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
            {tools.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-pressed={tool === i}
                onClick={() => setTool(i)}
                onMouseEnter={() => setTool(i)}
                onFocus={() => setTool(i)}
                className={`card-hover rounded-xl bg-[#0E0E0E] p-4 min-h-11 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                  tool === i ? '!border-[#D4AF37]/40' : ''
                }`}
              >
                <BrandIcon
                  slug={t.slug}
                  className={`h-6 w-6 transition-colors duration-200 ${tool === i ? 'text-[#D4AF37]' : 'text-[#A09882]'}`}
                />
                <p className="text-sm font-medium text-[#F5F0E8] mt-3">{t.name}</p>
                <div className="mt-2">
                  <TierChip tier={t.tier} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] px-5 py-4 min-h-[4.5rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeTool.name}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-[#A09882] leading-relaxed"
              >
                <span className="text-[#D4AF37] font-medium">{activeTool.name}</span> — {activeTool.use}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* ── What it means for a client ─────────────────────────── */}
        <div className="mt-16">
          <h3 className="font-heading text-xl font-semibold text-[#F5F0E8]">What that means for you</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {guarantees.map((g, i) => (
              <motion.div
                key={g.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                className="card-hover rounded-2xl bg-[#0E0E0E] p-6"
              >
                <p className="font-heading text-base font-semibold text-[#F5F0E8]">{g.title}</p>
                <p className="text-sm text-[#A09882] leading-relaxed mt-2">{g.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
