import AxeBuilder from "@axe-core/playwright";
import { expect, signInAs, test } from "./fixtures";

/**
 * Automated WCAG 2.2 A/AA scan of the main screens. Blocks on critical and
 * serious violations. Automated checks catch roughly a third of issues; the
 * manual keyboard/screen-reader pass is in docs/testing/TEST_STRATEGY.md.
 */
const ROUTES = ["for-you", "explore/stories", "explore/creators", "explore/collections", "library", "profile", "funding", "opportunity/cca-explore-create-research-creation", "notifications", "creator/kira-chen", "search"];

for (const route of ROUTES) {
  test(`a11y: ${route}`, async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto(`/#/${route}`);
    await page.waitForTimeout(1200);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const blocking = results.violations.filter(v => v.impact === "critical" || v.impact === "serious");
    const summary = blocking.map(v => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")}`).join("\n");
    expect(blocking, summary).toEqual([]);
  });
}
