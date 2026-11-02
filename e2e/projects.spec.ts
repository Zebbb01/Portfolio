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

test('LedgerLens is listed after the featured work and its case study links the repository', async ({ page }) => {
  await page.goto('/');
  const titles = await page.getByRole('heading', { level: 3 }).allTextContents();
  expect(titles.indexOf('LedgerLens')).toBeGreaterThan(titles.indexOf('Watershed Plan Extractor'));

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
