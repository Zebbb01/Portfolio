import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { projects } from './portfolioData';

// A walkthrough that is listed but not in public/ would open its project page on an empty player.
describe('project walkthroughs', () => {
  const withVideo = projects.filter((project) => project.walkthrough);

  it('at least one project has one', () => {
    expect(withVideo.length).toBeGreaterThan(0);
  });

  for (const project of withVideo) {
    it(`${project.title}: the video and its poster are in public/videos`, () => {
      expect(project.walkthrough).toMatch(/^\/videos\/[\w-]+\.mp4$/);
      for (const file of [project.walkthrough!, project.walkthrough!.replace(/\.mp4$/, '.jpg')]) {
        expect(fs.existsSync(path.join('public', file)), file).toBe(true);
      }
    });
  }
});
