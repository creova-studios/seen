import { signInAs, test } from "../fixtures";
const OUT = process.env.SHOTS_DIR ?? "test-results/shots";
test("moderation tabs 320", async ({ page }) => {
  await signInAs(page, "moderator");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/#/moderation-governance");
  await page.waitForTimeout(1500);
  for (const tab of ["Queue", "Reports", "Audit Log", "Guidelines"]) {
    await page.getByRole("button", { name: new RegExp(`^${tab}`, "i") }).click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/mod_${tab.replace(/ /g, "")}.png` });
  }
});
