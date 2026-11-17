import { defineConfig, devices } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Inherited by workers; artifacts never dirty the repository or overwrite another run.
process.env.E2E_ARTIFACT_DIR ??= mkdtempSync(join(tmpdir(), 'webmaster-e2e-'));
console.log(`E2E artifacts: ${process.env.E2E_ARTIFACT_DIR}`);

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.mjs',
  timeout: 30_000,
  globalTimeout: 600_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  outputDir: join(process.env.E2E_ARTIFACT_DIR, 'results'),
  reporter: [['list'], ['html', { outputFolder: join(process.env.E2E_ARTIFACT_DIR, 'report'), open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    navigationTimeout: 15_000,
    actionTimeout: 8_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/preview-site.mjs --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
