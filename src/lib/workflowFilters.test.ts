import { describe, expect, it } from 'vitest';
import workflows from '@/src/data/workflows.json';
import type { Workflow } from '../types';
import { WORKFLOW_CATEGORIES, filterWorkflows, isWorkflowCategory, isWorkflowTrigger } from './workflowFilters';

const list = workflows as Workflow[];
const noFilters = { query: '', category: null, trigger: null };
const slugs = (found: Workflow[]) => found.map((w) => w.slug);

describe('filterWorkflows', () => {
  it('returns every workflow when nothing is chosen', () => {
    expect(filterWorkflows(list, noFilters)).toEqual(list);
  });

  it('finds a workflow by a tool that is only in its tool list', () => {
    expect(slugs(filterWorkflows(list, { ...noFilters, query: 'retell' }))).toEqual(['ai-call-agent']);
  });

  it('ignores case and needs every word to match', () => {
    const found = filterWorkflows(list, { ...noFilters, query: 'TRELLO gemini' });

    expect(found.length).toBeGreaterThan(0);
    for (const w of found) expect(w.tools).toEqual(expect.arrayContaining(['Trello', 'Gemini']));
  });

  it('combines the search, the category and the trigger', () => {
    const found = filterWorkflows(list, { query: 'job', category: 'job-search', trigger: 'schedule' });

    expect(found.length).toBeGreaterThan(0);
    for (const w of found) {
      expect(w.category).toBe('job-search');
      expect(w.triggers).toContain('schedule');
    }
  });

  it('returns nothing for a search that matches nothing', () => {
    expect(filterWorkflows(list, { ...noFilters, query: 'no such workflow' })).toEqual([]);
  });
});

describe('URL values', () => {
  it('accepts only known filters, so a hand-typed link cannot empty the page', () => {
    expect(isWorkflowCategory('leads')).toBe(true);
    expect(isWorkflowCategory('crypto')).toBe(false);
    expect(isWorkflowTrigger('schedule')).toBe(true);
    expect(isWorkflowTrigger(null)).toBe(false);
  });
});

describe('workflow data', () => {
  it('has no category without workflows, and leads with the highlighted one', () => {
    for (const { id } of WORKFLOW_CATEGORIES) expect(list.filter((w) => w.category === id).length).toBeGreaterThan(0);
    expect(list[0].slug).toBe('job-hunt-find-and-score');
  });

  it('gives every workflow a unique slug and something that starts it', () => {
    expect(new Set(list.map((w) => w.slug)).size).toBe(list.length);
    expect(list.filter((w) => w.triggers.length === 0)).toEqual([]);
  });
});
