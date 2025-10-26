import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for E2E Tests
 * Tests the integration between frontend and backend API
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  testIgnore: ["**/node_modules/**", "../backend/**"],

  // Run tests in files in parallel
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporter: [["html"], ["list"]],

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
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Run your local dev server before starting the tests
  // Commented out because we're running services manually
  // webServer: [
  //   {
  //     command: "npm run start",
  //     url: "http://localhost:3000",
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 120 * 1000,
  //   },
  // ],
});
