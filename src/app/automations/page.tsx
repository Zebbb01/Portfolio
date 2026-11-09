import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageShell from '@/src/components/ui/PageShell';
import WorkflowHighlight from '@/src/components/sections/WorkflowHighlight';
import WorkflowLibrary from '@/src/components/sections/WorkflowLibrary';
import workflows from '@/src/data/workflows.json';

const totalSteps = workflows.reduce((sum, workflow) => sum + workflow.steps, 0);

export const metadata: Metadata = {
  title: 'Automation library',
  description: `${workflows.length} n8n workflows by Gerald Villaceran, for job search, lead generation, content and team operations.`,
  alternates: { canonical: '/automations' },
};

export default function AutomationsPage() {
  return (
    <PageShell>
      <Link
        href="/projects?type=automation"
        className="fixed top-5 left-5 md:top-6 md:left-6 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#060606]/70 backdrop-blur-xl border border-[#1F1F1F] text-[#A09882] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide">Back to Projects</span>
      </Link>

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24 md:pt-32">
        <p className="section-label">Automation library</p>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5F0E8] mt-3 tracking-[-0.02em]">
          n8n workflows
        </h1>
        <p className="text-[#A09882] mt-4 max-w-2xl leading-relaxed">
          {workflows.length} workflows I built or adapted, {totalSteps} steps in all. Each picture is drawn from the real
          export, with keys and private details removed.
        </p>

        <WorkflowHighlight />

        <section aria-labelledby="browse" className="mt-16 md:mt-20">
          <h2 id="browse" className="font-heading text-2xl md:text-3xl font-semibold text-[#F5F0E8] tracking-[-0.01em]">
            Browse them all
          </h2>
          {/* Search and filters live in the URL, so the client reads it under Suspense. */}
          <Suspense fallback={<div className="mt-6 h-14" />}>
            <WorkflowLibrary />
          </Suspense>
        </section>

        <Link
          href="/projects/n8n-automation"
          className="group mt-16 flex items-center justify-between gap-6 border-t border-[#1F1F1F] pt-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <span>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-[#6B6355]">Earlier client work</span>
            <span className="block font-heading text-xl font-semibold text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors mt-1.5">
              N8N Business Automation
            </span>
          </span>
          <ArrowRight size={22} strokeWidth={1.5} className="shrink-0 text-[#6B6355] group-hover:text-[#D4AF37] transition-colors" aria-hidden="true" />
        </Link>
      </main>
    </PageShell>
  );
}
