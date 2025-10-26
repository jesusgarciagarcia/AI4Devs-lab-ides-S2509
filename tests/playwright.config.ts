import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for Full-Stack E2E Tests
 * Tests complete user flows: Frontend → Backend → Database
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.test.ts",
  testIgnore: ["**/node_modules/**"],

  // Run tests sequentially to avoid DB conflicts
  fullyParallel: false,
  workers: 1,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  // Timeout for each test
  timeout: 60000,

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Video on failure
    video: "retain-on-failure",

    // Maximum time for each action (click, fill, etc.)
    actionTimeout: 15000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Run local dev servers before starting the tests
  webServer: [
    {
      command: "cd backend && npm run dev",
      url: "http://localhost:3010/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "cd frontend && npm start",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],
});
