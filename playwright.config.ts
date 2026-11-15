import { defineConfig, devices } from "@playwright/test";

// In the Claude Code sandbox Chromium is preinstalled at /opt/pw-browsers;
// CI runs `npx playwright install chromium` and leaves PW_CHROMIUM_PATH unset.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath },
  },
  projects: [{ name: "mobile-chromium", use: { ...devices["Pixel 7"], browserName: "chromium", launchOptions: { executablePath } } }],
  webServer: {
    command: "npm run build && npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
