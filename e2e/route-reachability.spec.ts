import { expect, signInAs, test } from "./fixtures";
import { NOT_DEEP_LINKABLE, SCREENS, toHash, type AppScreen } from "../src/app/navigation/routes";

/** Every screen in the route table must open from its URL, render content and log no console errors. */
const SAMPLE_ID: Partial<Record<AppScreen, string>> = {
  "creator-profile": "kira-chen",
  "collection-detail": "col-1",
  opportunity: "cmf-research-creation",
  "story-preview": "midnight-resonance",
  "reset-password": "sample-token",
};

test("every routable screen opens from its URL without console errors", async ({ page }) => {
  test.setTimeout(300000);
  await signInAs(page, "admin");
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(`pageerror: ${e.message}`));
  page.on("console", m => {
    if (m.type() === "error" && !/Failed to load resource|favicon/.test(m.text())) errors.push(m.text());
  });
  const bad: string[] = [];
  for (const screen of SCREENS) {
    if (NOT_DEEP_LINKABLE.includes(screen) || screen === "onboarding") continue;
    const hash = toHash(screen, SAMPLE_ID[screen] ? { id: SAMPLE_ID[screen] } : {});
    await page.goto(`/${hash}`);
    await page.waitForTimeout(500);
    const text = (await page.locator("body").innerText({ timeout: 5000 }).catch(() => "")).trim();
    if (text.length < 5) bad.push(`${screen}: empty main`);
    const h = await page.evaluate(() => location.hash);
    if (SAMPLE_ID[screen] === undefined && h !== hash) bad.push(`${screen}: redirected to ${h}`);
  }
  expect(bad).toEqual([]);
  expect(errors).toEqual([]);
});
