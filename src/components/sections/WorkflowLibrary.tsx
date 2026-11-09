'use client';

import { useState } from 'react';
import { Maximize2, Search, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import FilterChip from '@/src/components/ui/FilterChip';
import { ImageGallery } from '@/src/components/ui/ImageGallery';
import data from '@/src/data/workflows.json';
import {
  WORKFLOW_CATEGORIES,
  WORKFLOW_TRIGGERS,
  filterWorkflows,
  isWorkflowCategory,
  isWorkflowTrigger,
  type WorkflowFilters,
} from '@/src/lib/workflowFilters';
import type { Workflow } from '@/src/types';

const workflows = data as Workflow[];
const HIGHLIGHT = workflows[0].slug;

const triggerLabel = (workflow: Workflow) =>
  WORKFLOW_TRIGGERS.filter((t) => workflow.triggers.includes(t.id))
    .map((t) => t.label)
    .join(' · ');

function WorkflowCard({ workflow, onOpen }: { workflow: Workflow; onOpen: () => void }) {
  const isHighlight = workflow.slug === HIGHLIGHT;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-[#0E0E0E] transition-colors hover:border-[#D4AF37]/30 ${
        isHighlight ? 'border-[#D4AF37]/40' : 'border-[#1F1F1F]'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open the ${workflow.title} workflow full size`}
        className="group relative block aspect-[2/1] w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D4AF37]"
      >
        <Image
          src={workflow.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-contain p-3 transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#1F1F1F] bg-[#060606]/70 text-[#A09882] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 size={14} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 border-t border-[#1F1F1F] p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#D4AF37]">
            {WORKFLOW_CATEGORIES.find((c) => c.id === workflow.category)?.label}
          </span>
          {isHighlight && (
            <span className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#060606]">
              Most time saved
            </span>
          )}
        </div>
        <h3 className="font-heading text-lg font-semibold leading-snug text-[#F5F0E8]">{workflow.title}</h3>
        <p className="text-sm leading-relaxed text-[#A09882]">{workflow.summary}</p>
        <p className="mt-auto pt-2 text-xs text-[#A09882]">
          {triggerLabel(workflow)} · {workflow.steps} steps
        </p>
        {workflow.tools.length > 0 && (
          <p className="text-xs text-[#6B6355]">
            {workflow.tools.slice(0, 4).join(' · ')}
            {workflow.tools.length > 4 && ` · +${workflow.tools.length - 4}`}
          </p>
        )}
      </div>
    </article>
  );
}

export default function WorkflowLibrary() {
  const pathname = usePathname();
  const params = useSearchParams();

  // Kept here and copied to the URL: an input driven by the URL itself can drop keystrokes.
  const [filters, setFilters] = useState<WorkflowFilters>(() => {
    const category = params.get('category');
    const trigger = params.get('runs');
    return {
      query: params.get('q') ?? '',
      category: isWorkflowCategory(category) ? category : null,
      trigger: isWorkflowTrigger(trigger) ? trigger : null,
    };
  });
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const update = (changes: Partial<WorkflowFilters>) => {
    const next = { ...filters, ...changes };
    setFilters(next);

    const search = new URLSearchParams();
    if (next.query) search.set('q', next.query);
    if (next.category) search.set('category', next.category);
    if (next.trigger) search.set('runs', next.trigger);
    const queryString = search.toString();
    window.history.replaceState(null, '', queryString ? `${pathname}?${queryString}` : pathname);
  };

  const shown = filterWorkflows(workflows, filters);
  const hasFilters = Boolean(filters.query || filters.category || filters.trigger);
  // Counts follow the other filters, so a chip never promises results it cannot show.
  const countCategory = (category: WorkflowFilters['category']) => filterWorkflows(workflows, { ...filters, category }).length;
  const countTrigger = (trigger: WorkflowFilters['trigger']) => filterWorkflows(workflows, { ...filters, trigger }).length;
  const clear = () => update({ query: '', category: null, trigger: null });

  return (
    <>
      <div className="relative mt-6 max-w-xl">
        <Search size={18} strokeWidth={1.5} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6355]" aria-hidden="true" />
        <input
          type="search"
          value={filters.query}
          onChange={(event) => update({ query: event.target.value })}
          placeholder="Search by name, tool or task"
          aria-label="Search workflows"
          className="input-luxe !pl-11 !pr-11 !text-base [&::-webkit-search-cancel-button]:hidden"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => update({ query: '' })}
            aria-label="Clear the search"
            className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#A09882] hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>

      <div role="group" aria-label="Filter by category" className="mt-5 flex flex-wrap gap-2">
        <FilterChip label="All" count={countCategory(null)} active={!filters.category} onClick={() => update({ category: null })} />
        {WORKFLOW_CATEGORIES.map((c) => (
          <FilterChip key={c.id} label={c.label} count={countCategory(c.id)} active={filters.category === c.id} onClick={() => update({ category: c.id })} />
        ))}
      </div>

      <div role="group" aria-label="Filter by what starts the workflow" className="mt-2 flex flex-wrap items-center gap-2">
        <span className="pr-1 text-xs uppercase tracking-[0.14em] text-[#6B6355]">Runs</span>
        <FilterChip label="Any time" count={countTrigger(null)} active={!filters.trigger} onClick={() => update({ trigger: null })} />
        {WORKFLOW_TRIGGERS.map((t) => (
          <FilterChip key={t.id} label={t.label} count={countTrigger(t.id)} active={filters.trigger === t.id} onClick={() => update({ trigger: t.id })} />
        ))}
      </div>

      <p className="mt-4 text-sm text-[#A09882]" aria-live="polite">
        {hasFilters ? `Showing ${shown.length} of ${workflows.length} workflows` : `Showing all ${workflows.length} workflows`}
      </p>

      {shown.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#1F1F1F] p-10 text-center">
          <p className="text-[#F5F0E8]">No workflow matches that search.</p>
          <button
            type="button"
            onClick={clear}
            className="mt-2 min-h-11 px-3 text-sm text-[#D4AF37] hover:text-[#E8D48B] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((workflow, i) => (
            <li key={workflow.slug}>
              <WorkflowCard workflow={workflow} onOpen={() => setGalleryIndex(i)} />
            </li>
          ))}
        </ul>
      )}

      <ImageGallery
        images={shown.map((w) => ({ src: w.image, caption: `${w.title}: ${w.summary}` }))}
        isOpen={galleryIndex !== null}
        startIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
        title="Automation library"
      />
    </>
  );
}
