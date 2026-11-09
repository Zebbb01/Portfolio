import { test, expect, type Page } from '@playwright/test';

const OFFLINE = 'Live chat is offline';
const RAW = /\{"|error page|Service Unavailable|Internal Server/;

const openChat = (page: Page) => page.getByRole('button', { name: 'Open chat' }).click();
const panel = (page: Page) => page.getByRole('dialog', { name: 'Live chat' });

test('when the chat database is down, the widget says so and offers the contact form', async ({ page }) => {
  await page.route('**/api/chat/status', (route) => route.fulfill({ status: 503, json: { online: false } }));
  await page.goto('/');
  await openChat(page);

  await expect(panel(page).getByText(OFFLINE)).toBeVisible();
  await expect(panel(page).getByPlaceholder('Your Name', { exact: true })).toHaveCount(0);
  await expect(panel(page).getByRole('link', { name: 'Open the contact form' })).toHaveAttribute('href', '/#contact');
  await expect(panel(page)).not.toContainText(RAW);
});

test('the chat comes back when a retry finds it online', async ({ page }) => {
  let online = false;
  await page.route('**/api/chat/status', (route) =>
    online ? route.fulfill({ status: 200, json: { online: true } }) : route.fulfill({ status: 503, json: { online: false } }),
  );
  await page.goto('/');
  await openChat(page);
  await expect(panel(page).getByText(OFFLINE)).toBeVisible();

  online = true;
  await panel(page).getByRole('button', { name: 'Try the chat again' }).click();
  await expect(panel(page).getByPlaceholder('Your Name', { exact: true })).toBeVisible();
});

test('a failed start shows the friendly state, never the raw error page', async ({ page }) => {
  await page.route('**/api/chat/status', (route) => route.fulfill({ status: 200, json: { online: true } }));
  await page.route('**/api/chat/start', (route) =>
    route.fulfill({ status: 503, contentType: 'text/html', body: '<html><body>Service Unavailable</body></html>' }),
  );
  await page.goto('/');
  await openChat(page);

  await panel(page).getByPlaceholder('Your Name', { exact: true }).fill('Test Visitor');
  await panel(page).getByPlaceholder('Your Email', { exact: true }).fill('visitor@example.com');
  await panel(page).getByRole('button', { name: 'Start Conversation' }).click();

  await expect(panel(page).getByText(OFFLINE)).toBeVisible();
  await expect(panel(page)).not.toContainText(RAW);
});

test('the status route answers in plain JSON, whether or not the database is up', async ({ request }) => {
  const res = await request.get('/api/chat/status');

  expect(await res.json()).toEqual({ online: res.ok() });
});
