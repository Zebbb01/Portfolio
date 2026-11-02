'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { projects } from '@/src/data/portfolioData';
import { PROJECT_TYPES, countByType, filterProjects, isProjectType } from '@/src/lib/projectFilters';
import ProjectTile from '@/src/components/ui/ProjectTile';
import type { ProjectType } from '@/src/types';

const counts = countByType(projects);

function Chip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
        active
          ? 'border-[#D4AF37] bg-[#D4AF37]/[0.08] text-[#D4AF37]'
          : 'border-[#1F1F1F] text-[#A09882] hover:border-[#D4AF37]/30 hover:text-[#F5F0E8]'
      }`}
    >
      {label}
      <span className={`text-xs tabular-nums ${active ? 'text-[#D4AF37]/80' : 'text-[#6B6355]'}`}>{count}</span>
    </button>
  );
}

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
        <Chip label="All" count={projects.length} active={!type} onClick={() => choose(null)} />
        {PROJECT_TYPES.map((t) => (
          <Chip key={t.id} label={t.label} count={counts[t.id]} active={type === t.id} onClick={() => choose(t.id)} />
        ))}
      </div>

      <p className="mt-4 text-sm text-[#6B6355]" aria-live="polite">
        {type ? `Showing ${shown.length} of ${projects.length} projects` : `Showing all ${projects.length} projects`}
      </p>

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
