import { defineConfig } from "@playwright/test";

/**
 * Smoke tests for the money paths (ENGINEERING.md §11).
 * Requires a production build first: `npm run build`, then `npm run test:e2e`
 * (the web server here only runs `next start`).
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    // CI downloads Chromium; local runs use the preinstalled Edge.
    ...(process.env.CI ? {} : { channel: "msedge" as const }),
  },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
