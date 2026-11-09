// Where a visitor has been inside the site, so a Back link can name the page it returns to.
// document.referrer cannot do this: it does not change on client-side navigation.
import type { Project } from '../types';

export type Trail = string[];

/** Adds the page, or steps back when the visitor returned to the page before this one. */
export function advanceTrail(trail: Trail, path: string): Trail {
  if (trail[trail.length - 1] === path) return trail;
  if (trail[trail.length - 2] === path) return trail.slice(0, -1);
  return [...trail, path];
}

/** The page this one was reached from, or null after a direct visit. */
export function previousPage(trail: Trail, path: string): string | null {
  const settled = advanceTrail(trail, path);
  return settled[settled.length - 2] ?? null;
}

const FIXED_PLACES: Record<string, string> = { '/': 'Portfolio', '/projects': 'Projects', '/automations': 'Automations' };

/** What a Back link calls a page, or null for a page it should not name. */
export function placeName(path: string, projects: Pick<Project, 'title' | 'detailsUrl'>[]): string | null {
  return FIXED_PLACES[path] ?? projects.find((p) => p.detailsUrl === path)?.title ?? null;
}

// ponytail: held in memory, so a page reload falls back to the portfolio link. Use sessionStorage if that ever matters.
let trail: Trail = [];

export const recordPage = (path: string) => {
  trail = advanceTrail(trail, path);
};

export const cameFrom = (path: string) => previousPage(trail, path);
