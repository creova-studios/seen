import { expect, signInAs, test } from "./fixtures";

/** Figma 316:2 alignment as measurable rules (not canvas coordinates): gutter token, nav, hero, no overflow. */
const WIDTHS = [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440];

test.describe("for you: figma alignment", () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, "viewer");
  });

  for (const w of WIDTHS) {
    test(`layout rules hold at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto("/#/for-you");
      await expect(page.getByRole("heading", { name: "For You", level: 1 })).toBeVisible();
      await page.waitForTimeout(700);
      const m = await page.evaluate(() => {
        const main = document.querySelector("main")!;
        const cs = getComputedStyle(main);
        const nav = document.querySelector("nav[aria-label=Main]")!;
        const items = [...nav.querySelectorAll("button")].map(b => b.getBoundingClientRect());
        const label = nav.querySelector("button span:last-child") as HTMLElement;
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          padL: parseFloat(cs.paddingLeft),
          navH: nav.getBoundingClientRect().height,
          navBottom: nav.getBoundingClientRect().bottom,
          vh: innerHeight,
          widths: items.map(r => Math.round(r.width)),
          labelPx: parseFloat(getComputedStyle(label).fontSize),
          h2Weight: getComputedStyle(document.querySelector("main h2")!).fontWeight,
        };
      });
      expect(m.overflow).toBeLessThanOrEqual(0);
      expect(m.padL).toBe(w >= 360 ? 24 : 20);
      expect(m.navH).toBe(64);
      expect(Math.round(m.navBottom)).toBe(m.vh);
      expect(new Set(m.widths).size).toBe(1); // five equal columns
      expect(m.labelPx).toBe(w < 360 ? 10 : 11); // 10 px below 360 so "Bibliothèque" fits
      expect(m.h2Weight).toBe("600");
    });
  }

  test("hero: Figma sizes, one 44px action, opens the story", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/for-you");
    const hero = page.locator("section[aria-labelledby=hero-title]");
    await expect(hero).toBeVisible();
    const hb = await hero.boundingBox();
    expect(Math.round(hb!.height)).toBe(Math.round(Math.min(520, Math.max(300, (844 - 64) * 0.55)))); // 55% of the space above the tab bar
    const btn = hero.getByRole("button", { name: /^start reading/i });
    const bb = await btn.boundingBox();
    expect(Math.round(bb!.width)).toBe(160);
    expect(bb!.height).toBeGreaterThanOrEqual(44);
    await expect(hero.getByRole("button")).toHaveCount(1);
    await btn.click();
    await expect(page).toHaveURL(/#\/story\//);
  });

  for (const h of [568, 667, 844, 1000]) {
    test(`content peeks in below the hero at height ${h}px`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: h });
      await page.goto("/#/for-you");
      await page.waitForTimeout(700);
      const hero = await page.locator("section[aria-labelledby=hero-title]").boundingBox();
      expect(hero!.height).toBeLessThanOrEqual(520);
      const next = await page.getByRole("heading", { name: "For You", level: 1 }).boundingBox();
      expect(next!.y, "content starts below the hero and above the tab bar, so it is clear the page scrolls").toBeLessThan(h - 64 - 8);
    });

    test(`no clipping at height ${h}px`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: h });
      await page.goto("/#/for-you");
      await page.waitForTimeout(700);
      const nav = await page.locator("nav[aria-label=Main]").boundingBox();
      expect(Math.round(nav!.y + nav!.height)).toBe(h);
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, document.documentElement.scrollHeight); });
      await page.waitForTimeout(300);
      const clearance = await page.evaluate(() => {
        const last = document.querySelector("main")!.lastElementChild!.getBoundingClientRect();
        const navTop = document.querySelector("nav[aria-label=Main]")!.getBoundingClientRect().top;
        return navTop - last.bottom; // last content must clear the fixed nav
      });
      expect(clearance).toBeGreaterThanOrEqual(0);
    });
  }

  test("reduced motion zeroes transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#/for-you");
    const d = await page.locator("nav[aria-label=Main] button").first().evaluate(e => getComputedStyle(e).transitionDuration);
    expect(parseFloat(d)).toBeLessThan(0.001);
  });

  test("tab switch does not replay the header entrance", async ({ page }) => {
    await page.goto("/#/for-you");
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: /^explore$/i }).click();
    const op = await page.locator("header").first().evaluate(e => getComputedStyle(e).opacity);
    expect(op).toBe("1");
  });

  for (const route of ["explore", "library", "profile"]) {
    test(`${route}: first content clears the fixed header (demo notice included)`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/#/${route}`);
      await page.waitForTimeout(700);
      const gap = await page.evaluate(() => {
        const header = document.querySelector("header")!.getBoundingClientRect().bottom;
        const first = document.querySelector("main")!.firstElementChild!.getBoundingClientRect().top;
        return first - header;
      });
      expect(gap).toBeGreaterThanOrEqual(0);
    });
  }
});
