import { describe, expect, it } from 'vitest';
import { projects } from '@/src/data/portfolioData';
import { advanceTrail, placeName, previousPage } from './pageTrail';

describe('advanceTrail', () => {
  it('adds a page the visitor moves on to', () => {
    expect(advanceTrail(['/'], '/automations')).toEqual(['/', '/automations']);
  });

  it('does not repeat the page the visitor is already on', () => {
    expect(advanceTrail(['/', '/automations'], '/automations')).toEqual(['/', '/automations']);
  });

  it('steps back when the visitor returns to the page before', () => {
    expect(advanceTrail(['/', '/automations', '/projects/leadloom'], '/automations')).toEqual(['/', '/automations']);
  });
});

describe('previousPage', () => {
  it('finds nothing on a direct visit', () => {
    expect(previousPage([], '/automations')).toBeNull();
    expect(previousPage(['/automations'], '/automations')).toBeNull();
  });

  it('gives the same answer before and after the new page is recorded', () => {
    expect(previousPage(['/'], '/automations')).toBe('/');
    expect(previousPage(['/', '/automations'], '/automations')).toBe('/');
  });

  it('after stepping back, names the page before that one', () => {
    expect(previousPage(['/', '/automations', '/projects/leadloom'], '/automations')).toBe('/');
  });
});

describe('placeName', () => {
  it('names the fixed pages', () => {
    expect(placeName('/', projects)).toBe('Portfolio');
    expect(placeName('/projects', projects)).toBe('Projects');
    expect(placeName('/automations', projects)).toBe('Automations');
  });

  it('names a case study by its project', () => {
    expect(placeName('/projects/leadloom', projects)).toBe('LeadLoom');
  });

  it('has no name for anywhere else, so the link falls back to the portfolio', () => {
    expect(placeName('/privacy', projects)).toBeNull();
    expect(placeName('/projects/no-such-project', projects)).toBeNull();
  });
});
