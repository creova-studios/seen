import { defineConfig, devices } from "@playwright/test";

// Browser tests of the native app (Expo, exported for the web). The same app Vercel serves and Expo Go runs.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "./e2e-native",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never", outputFolder: "playwright-report-native" }]] : "list",
  use: { baseURL: "http://localhost:4174", trace: "retain-on-failure", screenshot: "only-on-failure", launchOptions: { executablePath } },
  projects: [{ name: "native-web-phone", use: { ...devices["Pixel 7"], browserName: "chromium", launchOptions: { executablePath } } }],
  webServer: {
    command: "cd mobile && npx expo export --platform web --output-dir dist && cd .. && node scripts/pwa-postbuild.mjs mobile/dist && node scripts/serve-static.mjs mobile/dist 4174",
    url: "http://localhost:4174",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
