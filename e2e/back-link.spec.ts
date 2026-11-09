import { test, expect, type Page } from '@playwright/test';

const back = (page: Page) => page.getByRole('link', { name: /^Back to/ });

test('from the home page, the library goes back to the home page', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projects a[href="/automations"]').first().click();
  await expect(page).toHaveURL(/\/automations$/);

  await expect(back(page)).toHaveText('Back to Portfolio');
  await back(page).click();

  await expect(page).toHaveURL(/:3200\/(#\w+)?$/);
  await expect(page.locator('#projects').getByRole('heading', { name: 'N8N Business Automation' })).toBeInViewport();
});

test('from a filtered list, the library goes back to that same list', async ({ page }) => {
  await page.goto('/projects?type=automation');
  await page.getByRole('link', { name: 'N8N Business Automation' }).click();
  await expect(page).toHaveURL(/\/automations$/);

  await expect(back(page)).toHaveText('Back to Projects');
  await back(page).click();

  await expect(page).toHaveURL(/\/projects\?type=automation$/);
  await expect(page.getByRole('button', { name: /^Automation/ })).toHaveAttribute('aria-pressed', 'true');
});

test('opened directly, a page offers the portfolio', async ({ page }) => {
  for (const path of ['/automations', '/projects', '/projects/leadloom']) {
    await page.goto(path);
    await expect(back(page)).toHaveText('Back to Portfolio');
    await expect(back(page)).toHaveAttribute('href', '/#projects');
  }
});

test('a case study names the page it was opened from, and going back retraces the route', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projects a[href="/automations"]').first().click();
  await expect(page).toHaveURL(/\/automations$/);

  await page.getByRole('link', { name: /Read the case study/ }).click();
  await expect(page).toHaveURL(/\/projects\/job-hunt-automation$/);
  await expect(back(page)).toHaveText('Back to Automations');

  await back(page).click();
  await expect(page).toHaveURL(/\/automations$/);
  await expect(back(page)).toHaveText('Back to Portfolio');
});

test('following Next project, the back link names the project just left', async ({ page }) => {
  await page.goto('/projects/leadloom');
  await page.getByRole('link', { name: /Next project/ }).click();

  await expect(page).toHaveURL(/\/projects\/trusum$/);
  await expect(back(page)).toHaveText('Back to LeadLoom');
});
