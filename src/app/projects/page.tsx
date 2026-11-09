import type { Metadata } from 'next';
import { Suspense } from 'react';
import BackLink from '@/src/components/ui/BackLink';
import PageShell from '@/src/components/ui/PageShell';
import ProjectsBrowser from '@/src/components/sections/ProjectsBrowser';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Every system Gerald Villaceran has shipped: SaaS platforms, AI tools, automations, websites and mobile apps.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <BackLink />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24 md:pt-36">
        <p className="section-label">Work</p>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5F0E8] mt-3 tracking-[-0.02em]">
          All projects
        </h1>
        <p className="text-[#A09882] mt-4 max-w-2xl leading-relaxed">
          Everything I have shipped, from SaaS platforms to AI tools and automations. Pick the kind of work you need;
          every figure is measured, not estimated.
        </p>
        {/* The filter lives in the URL (?type=ai), so the client reads it under Suspense. */}
        <Suspense fallback={<div className="mt-10 h-11" />}>
          <ProjectsBrowser />
        </Suspense>
      </main>
    </PageShell>
  );
}
