import { defineConfig, devices } from '@playwright/test';

// The browser tests run against a production build (`npm run build` first), because that is
// what visitors get: dev mode hides hydration, CSP and bundling problems.
// Set E2E_BASE_URL to run the same tests against a deployed site, e.g. after a deploy:
//   E2E_BASE_URL=https://www.odaidh.dev npm run test:e2e
const PORT = 3210;
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.E2E_BASE_URL ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `npm run start -- -p ${PORT}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
