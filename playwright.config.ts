import { defineConfig, devices } from '@playwright/test';

// E2E tests run against a production build, the same thing Vercel serves.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  // Parallel tests make the local server resize dozens of images at once.
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://127.0.0.1:3200',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run start -- -p 3200',
    url: 'http://127.0.0.1:3200',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
