// Filters for the projects page. A project can carry several types, so it shows
// under each of them.
import type { Project, ProjectType } from '../types';

export const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
  { id: 'saas', label: 'SaaS' },
  { id: 'ai', label: 'AI' },
  { id: 'automation', label: 'Automation' },
  { id: 'websites', label: 'Websites' },
  { id: 'mobile', label: 'Mobile & PWA' },
];

export const isProjectType = (value: string | null | undefined): value is ProjectType =>
  PROJECT_TYPES.some((t) => t.id === value);

export const filterProjects = (list: Project[], type: ProjectType | null) =>
  type ? list.filter((p) => p.types.includes(type)) : list;

export const countByType = (list: Project[]) =>
  Object.fromEntries(PROJECT_TYPES.map(({ id }) => [id, filterProjects(list, id).length])) as Record<ProjectType, number>;
