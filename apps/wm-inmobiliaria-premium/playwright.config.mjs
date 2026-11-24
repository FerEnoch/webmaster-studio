import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PREMIUM_E2E_PORT ?? 3033);
const artifactDir = process.env.E2E_ARTIFACT_DIR ?? fileURLToPath(new URL("./.test-artifacts", import.meta.url));

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.mjs",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: `${artifactDir}/results`,
  reporter: [["list"], ["html", { outputFolder: `${artifactDir}/report`, open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    viewport: { width: 1440, height: 1000 },
    navigationTimeout: 15_000,
    actionTimeout: 8_000,
    serviceWorkers: "block",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/static-server.mjs",
    url: `http://127.0.0.1:${port}/demos/inmobiliaria-premium/`,
    reuseExistingServer: false,
    timeout: 20_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
