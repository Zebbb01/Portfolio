import { describe, expect, it } from 'vitest';
import { projects } from '@/src/data/portfolioData';
import { PROJECT_TYPES, countByType, filterProjects, isProjectType } from './projectFilters';

const titles = (list: { title: string }[]) => list.map((p) => p.title);

describe('filterProjects', () => {
  it('returns every project when no type is chosen', () => {
    expect(filterProjects(projects, null)).toEqual(projects);
  });

  it('keeps only the projects of the chosen type, in their listed order', () => {
    expect(titles(filterProjects(projects, 'automation'))).toEqual(['N8N Business Automation', 'LedgerLens']);
  });

  it('lists a project under each of its types', () => {
    expect(titles(filterProjects(projects, 'ai'))).toContain('LedgerLens');
    expect(titles(filterProjects(projects, 'saas'))).toEqual(['Trusum Accounting']);
  });
});

describe('countByType', () => {
  it('counts the projects of each type, so no filter is ever empty', () => {
    const counts = countByType(projects);

    expect(counts.automation).toBe(2);
    for (const { id } of PROJECT_TYPES) expect(counts[id]).toBeGreaterThan(0);
  });
});

describe('isProjectType', () => {
  it('accepts the known types from a URL and refuses anything else', () => {
    expect(isProjectType('ai')).toBe(true);
    expect(isProjectType('crypto')).toBe(false);
    expect(isProjectType(null)).toBe(false);
  });
});

describe('project data', () => {
  it('gives every project at least one type', () => {
    expect(projects.filter((p) => p.types.length === 0)).toEqual([]);
  });
});
