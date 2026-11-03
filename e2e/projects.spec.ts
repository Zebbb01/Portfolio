import { test, expect } from '@playwright/test';

test('the home page lists the watershed extractor and opens its case study', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Watershed Plan Extractor', level: 3 })).toBeVisible();

  await page.locator('a[href="/projects/watershed-extractor"]').first().click();
  await expect(page).toHaveURL(/\/projects\/watershed-extractor$/);
  await expect(page.getByRole('heading', { name: 'Watershed Plan Extractor', level: 1 })).toBeVisible();
});

test('the watershed case study shows its measured results and the live demo', async ({ page }) => {
  await page.goto('/projects/watershed-extractor');

  for (const label of ['F1, nine plans', 'F1, six held-out plans', 'Numbers exact', 'Names not in the PDF']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: /Launch live demo/ })).toHaveAttribute(
    'href',
    'https://watershed-extractor.netlify.app',
  );
  // The code belongs to ChowaCo, so the case study links no repository.
  await expect(page.getByRole('link', { name: 'Repository' })).toHaveCount(0);
});

test('the home page shows only the featured work as a bento grid, with a link to all projects', async ({ page }) => {
  await page.goto('/');
  const work = page.locator('#projects');
  const titles = await work.getByRole('heading', { level: 3 }).allTextContents();

  expect(titles[0]).toBe('Trusum Accounting');
  expect(titles).toContain('Watershed Plan Extractor');
  expect(titles).not.toContain('LedgerLens');

  await work.getByRole('link', { name: /View all \d+ projects/ }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole('heading', { name: 'All projects', level: 1 })).toBeVisible();
});

test('the projects page lists every project and filters them by type', async ({ page }) => {
  await page.goto('/projects');
  const cards = page.getByRole('main').getByRole('listitem').getByRole('heading', { level: 2 });
  await expect(cards).toHaveCount(7);

  await page.getByRole('button', { name: /^Automation/ }).click();
  await expect(page).toHaveURL(/\/projects\?type=automation$/);
  await expect(page.getByRole('button', { name: /^Automation/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveText(['N8N Business Automation', 'LedgerLens']);
  await expect(page.getByText('Showing 2 of 7 projects')).toBeVisible();

  await page.getByRole('button', { name: /^All/ }).click();
  await expect(cards).toHaveCount(7);
});

test('a link with a type opens the projects page already filtered', async ({ page }) => {
  await page.goto('/projects?type=websites');

  await expect(page.getByRole('button', { name: /^Websites/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('main').getByRole('listitem').getByRole('heading', { level: 2 })).toHaveText([
    'GHL Marketing Websites',
  ]);
});

test('the LedgerLens case study opens from the projects page and links the repository', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('a[href="/projects/ledgerlens"]').first().click();
  await expect(page).toHaveURL(/\/projects\/ledgerlens$/);
  await expect(page.getByRole('heading', { name: 'LedgerLens', level: 1 })).toBeVisible();
  for (const label of ['Checks in code', 'Fields read right, live service', 'Unit and end-to-end tests', 'Azure services, free tier']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Repository' })).toHaveAttribute(
    'href',
    'https://github.com/Zebbb01/ledgerlens',
  );
  await expect(page.getByRole('link', { name: /Launch live demo/ })).toHaveAttribute(
    'href',
    'https://ca-ledgerlens-iq777r.salmonriver-2ba7975b.southeastasia.azurecontainerapps.io',
  );
});

test('the Body Tracker case study shows real screenshots, measured results and both links', async ({ page }) => {
  await page.goto('/projects/body-tracker');
  await expect(page.getByRole('heading', { name: 'Body Tracker', level: 1 })).toBeVisible();
  for (const label of ['Lighthouse performance, mobile', 'Accessibility violations, 7 screens, 2 themes', 'Unit, RLS and browser tests in CI']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Repository' })).toHaveAttribute('href', 'https://github.com/Zebbb01/Workout-Tracker');
  await expect(page.getByRole('link', { name: /Launch live demo/ })).toHaveAttribute('href', 'https://body-tracker-iota.vercel.app/');
  for (const src of ['dashboard.webp', 'dashboard-phone.webp', 'workout.webp', 'progress.webp']) {
    expect((await page.request.get(`/project/BodyTracker/${src}`)).status(), src).toBe(200);
  }
});
