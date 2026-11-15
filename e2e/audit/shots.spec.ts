import { signInAs, test } from "../fixtures";
const OUT = process.env.SHOTS_DIR ?? "test-results/shots";
const SETS: Record<string, string[]> = {
  viewer: ["for-you", "explore", "library", "funding", "story/midnight-resonance", "account"],
  creator: ["creator-monetization", "creator-earnings", "creator-publish", "notes"],
  moderator: ["moderation-governance"],
  admin: ["admin-dashboard"],
};
for (const [role, routes] of Object.entries(SETS)) {
  test(`screenshots ${role} 320`, async ({ page }) => {
    test.setTimeout(300000);
    await signInAs(page, role as "viewer");
    await page.setViewportSize({ width: 320, height: 640 });
    for (const r of routes) {
      await page.goto(`/#/${r}`);
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `${OUT}/${role}_${r.replace(/\//g, "_")}.png` });
    }
  });
}
