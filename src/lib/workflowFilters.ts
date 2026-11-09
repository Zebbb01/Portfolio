// Search and filters for the automation library.
import type { Workflow, WorkflowCategory, WorkflowTrigger } from '../types';

export const WORKFLOW_CATEGORIES: { id: WorkflowCategory; label: string }[] = [
  { id: 'job-search', label: 'Job search' },
  { id: 'leads', label: 'Lead generation' },
  { id: 'follow-up', label: 'Lead follow-up' },
  { id: 'content', label: 'Content' },
  { id: 'inbox', label: 'Inbox and team' },
];

export const WORKFLOW_TRIGGERS: { id: WorkflowTrigger; label: string }[] = [
  { id: 'schedule', label: 'Scheduled' },
  { id: 'event', label: 'On an event' },
  { id: 'manual', label: 'On demand' },
];

export type WorkflowFilters = { query: string; category: WorkflowCategory | null; trigger: WorkflowTrigger | null };

export const isWorkflowCategory = (value: string | null): value is WorkflowCategory =>
  WORKFLOW_CATEGORIES.some((c) => c.id === value);

export const isWorkflowTrigger = (value: string | null): value is WorkflowTrigger =>
  WORKFLOW_TRIGGERS.some((t) => t.id === value);

const searchText = (w: Workflow) => [w.title, w.summary, ...w.tools].join(' ').toLowerCase();

/** Every word of the search must appear somewhere, so "gemini trello" narrows rather than widens. */
export function filterWorkflows(list: Workflow[], { query, category, trigger }: WorkflowFilters) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter(
    (w) =>
      (!category || w.category === category) &&
      (!trigger || w.triggers.includes(trigger)) &&
      words.every((word) => searchText(w).includes(word)),
  );
}
