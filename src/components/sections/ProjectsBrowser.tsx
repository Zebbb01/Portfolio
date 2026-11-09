'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { projects } from '@/src/data/portfolioData';
import workflows from '@/src/data/workflows.json';
import { PROJECT_TYPES, countByType, filterProjects, isProjectType } from '@/src/lib/projectFilters';
import FilterChip from '@/src/components/ui/FilterChip';
import ProjectTile from '@/src/components/ui/ProjectTile';
import type { ProjectType } from '@/src/types';

const counts = countByType(projects);

export default function ProjectsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const raw = useSearchParams().get('type');
  const type = isProjectType(raw) ? raw : null;
  const shown = filterProjects(projects, type);

  const choose = (next: ProjectType | null) =>
    router.replace(next ? `${pathname}?type=${next}` : pathname, { scroll: false });

  return (
    <>
      <div role="group" aria-label="Filter projects by type" className="mt-10 flex flex-wrap gap-2">
        <FilterChip label="All" count={projects.length} active={!type} onClick={() => choose(null)} />
        {PROJECT_TYPES.map((t) => (
          <FilterChip key={t.id} label={t.label} count={counts[t.id]} active={type === t.id} onClick={() => choose(t.id)} />
        ))}
      </div>

      <p className="mt-4 text-sm text-[#6B6355]" aria-live="polite">
        {type ? `Showing ${shown.length} of ${projects.length} projects` : `Showing all ${projects.length} projects`}
      </p>

      {(!type || type === 'automation') && (
        <Link
          href="/automations"
          className="group mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] px-5 py-4 transition-colors hover:border-[#D4AF37]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <span>
            <span className="block text-sm font-medium text-[#F5F0E8]">Browse all {workflows.length} n8n workflows</span>
            <span className="block text-xs text-[#A09882] mt-0.5">Search by tool, category or what starts them</span>
          </span>
          <ArrowRight size={18} strokeWidth={1.5} className="shrink-0 text-[#D4AF37] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}

      {shown.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[#1F1F1F] p-10 text-center">
          <p className="text-[#F5F0E8]">No projects of this kind yet.</p>
          <button
            type="button"
            onClick={() => choose(null)}
            className="mt-3 text-sm text-[#D4AF37] hover:text-[#E8D48B] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            Show all projects
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((project, i) => (
            <li key={project.slug}>
              <ProjectTile project={project} detailed heading="h2" priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
