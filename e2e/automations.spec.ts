import { test, expect } from '@playwright/test';

const cards = (page: import('@playwright/test').Page) => page.getByRole('main').getByRole('listitem').getByRole('heading', { level: 3 });

test('the automation library highlights one workflow and lists all of them', async ({ page }) => {
  await page.goto('/automations');

  await expect(page.getByRole('heading', { name: 'n8n workflows', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Job Hunt · Find and score', level: 2 })).toBeVisible();
  await expect(page.getByText('Showing all 33 workflows')).toBeVisible();
  await expect(cards(page)).toHaveCount(33);

  const video = page.locator('video');
  await expect(video).toHaveAttribute('src', /job-hunt-find-and-score\.mp4$/);
  expect((await page.request.get('/project/Automation/workflows/job-hunt-find-and-score.mp4')).status()).toBe(200);
});

test('search and filters narrow the list and stay in the URL', async ({ page }) => {
  await page.goto('/automations');

  await page.getByRole('searchbox', { name: 'Search workflows' }).fill('retell');
  await expect(cards(page)).toHaveText(['AI call agent']);
  await expect(page.getByText('Showing 1 of 33 workflows')).toBeVisible();
  await expect(page).toHaveURL(/\?q=retell$/);

  await page.getByRole('button', { name: 'Clear the search' }).click();
  await page.getByRole('button', { name: /^Inbox and team/ }).click();
  await expect(cards(page)).toHaveCount(4);
  await expect(page).toHaveURL(/\?category=inbox$/);

  await page.getByRole('button', { name: /^On demand/ }).click();
  await expect(page).toHaveURL(/\?category=inbox&runs=manual$/);
});

test('a shared link opens the library already filtered', async ({ page }) => {
  await page.goto('/automations?q=trello&category=job-search');

  await expect(page.getByRole('searchbox', { name: 'Search workflows' })).toHaveValue('trello');
  await expect(page.getByRole('button', { name: /^Job search/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards(page).first()).toHaveText('Job Hunt · Find and score');
});

test('a search with no results says so and offers a way back', async ({ page }) => {
  await page.goto('/automations');

  await page.getByRole('searchbox', { name: 'Search workflows' }).fill('no such workflow');
  await expect(page.getByText('No workflow matches that search.')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(cards(page)).toHaveCount(33);
});

test('a workflow opens full size', async ({ page }) => {
  await page.goto('/automations?q=retell');

  await page.getByRole('button', { name: 'Open the AI call agent workflow full size' }).click();
  await expect(page.getByRole('button', { name: 'Close gallery' })).toBeVisible();
  await expect(page.getByText(/AI call agent: Places an AI voice call/)).toBeVisible();
});

test('the original n8n case study keeps its work and links to the library', async ({ page }) => {
  await page.goto('/projects/n8n-automation');

  await expect(page.getByRole('heading', { name: 'N8N Business Automation', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: '5 screenshots' })).toBeVisible();
  await expect(page.locator('section video').first()).toHaveAttribute('src', '/videos/automation.mp4');

  await page.getByRole('link', { name: /See all 33 n8n workflows/ }).click();
  await expect(page).toHaveURL(/\/automations$/);
});

test('the projects page leads to the library, and the highlight has a case study', async ({ page }) => {
  await page.goto('/projects?type=automation');
  await expect(page.getByRole('link', { name: /Browse all 33 n8n workflows/ })).toBeVisible();

  await page.goto('/projects/job-hunt-automation');
  await expect(page.getByRole('heading', { name: 'Job Hunt Automation', level: 1 })).toBeVisible();
  for (const label of ['Postings read', 'Checked by AI', 'Fits found', 'Filtered before I read one']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});
