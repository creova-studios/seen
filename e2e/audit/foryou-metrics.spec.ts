import { signInAs, test } from "../fixtures";
import { writeFileSync } from "node:fs";
const OUT = process.env.SHOTS_DIR ?? "test-results/shots";
test("for-you metrics", async ({ page }) => {
  await signInAs(page, "viewer");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/for-you");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/fy_full.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/fy_a.png` });
  for (const [i, y] of [[1, 760], [2, 1500]] as const) {
    await page.evaluate(v => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, v); }, y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/fy_${i === 1 ? "b" : "c"}.png` });
  }
  const m = await page.evaluate(() => {
    const box = (e: Element | null) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
    const cs = (e: Element | null, ...p: string[]) => e ? Object.fromEntries(p.map(k => [k, getComputedStyle(e).getPropertyValue(k)])) : null;
    const h1 = document.querySelector("h1"); const header = document.querySelector("header"); const nav = document.querySelector("nav[aria-label=Main]");
    const h2 = document.querySelector("h2"); const card = document.querySelector("[data-testid=content-card]"); const sc = document.querySelector("[data-testid=story-card]");
    const navBtn = nav?.querySelector("button"); const navLabel = navBtn?.querySelector("span");
    return {
      vw: innerWidth, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth,
      header: box(header), h1: { ...box(h1), ...cs(h1, "font-size", "font-weight", "font-family", "line-height") },
      h2: { ...box(h2), ...cs(h2, "font-size", "font-weight", "letter-spacing") },
      contentCard: { ...box(card), ...cs(card, "border-radius") }, storyCard: { ...box(sc), ...cs(sc, "border-radius") },
      nav: box(nav), navBtn: box(navBtn ?? null), navLabel: cs(navLabel ?? null, "font-size", "letter-spacing", "text-transform"),
      main: box(document.querySelector("main")), mainPad: cs(document.querySelector("main"), "padding-left", "padding-right", "padding-top"),
      fonts: [...document.fonts].map(f => f.family + ":" + f.status).slice(0, 8),
    };
  });
  writeFileSync(`${OUT}/fy_metrics.json`, JSON.stringify(m, null, 1));
});
