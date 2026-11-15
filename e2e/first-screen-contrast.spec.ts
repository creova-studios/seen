import { expect, test } from "./fixtures";

/**
 * Worst case for the first screen: every cover is pure white. The text there must still keep 4.5:1
 * (3:1 for large text) against the lightest part of what is behind it, measured with the text hidden.
 */
test("first screen text keeps its contrast over a pure white photo", async ({ page }) => {
  await page.route(/images\.unsplash\.com/, route =>
    route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"><rect width="100%" height="100%" fill="#ffffff"/></svg>' }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByTestId("first-screen-backdrop").locator("img").first()).toBeVisible();
  await page.waitForTimeout(3000); // let every entrance animation finish

  const targets = await page.evaluate(() => {
    const out: { x: number; y: number; w: number; h: number; a: number; large: boolean; text: string }[] = [];
    document.querySelectorAll("h1, p, button, span").forEach(e => {
      const el = e as HTMLElement;
      if (![...el.childNodes].some(n => n.nodeType === 3 && (n.textContent ?? "").trim())) return;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8 || el.closest("[aria-hidden=true]")) return;
      const cs = getComputedStyle(el);
      const m = cs.color.match(/[\d.]+/g)!.map(Number); // rgb(a)
      const size = parseFloat(cs.fontSize);
      out.push({ x: r.left, y: r.top, w: r.width, h: r.height, a: m.length > 3 ? m[3] : 1, large: size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700), text: (el.innerText || "").slice(0, 28) });
    });
    return out;
  });
  expect(targets.length, "the first screen has text to measure").toBeGreaterThan(2);

  await page.addStyleTag({ content: "*{color:transparent !important;text-shadow:none !important;transition:none !important;animation:none !important}" });
  const shot = (await page.screenshot()).toString("base64");
  const worst = await page.evaluate(async ({ shot, targets }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + shot;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const k = img.width / window.innerWidth;
    const L = (r: number, g: number, b: number) => {
      const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    return targets.map(t => {
      const d = ctx.getImageData(Math.round(t.x * k), Math.round(t.y * k), Math.max(1, Math.round(t.w * k)), Math.max(1, Math.round(t.h * k))).data;
      const ls: number[] = [];
      for (let i = 0; i < d.length; i += 4) ls.push(L(d[i], d[i + 1], d[i + 2]));
      ls.sort((a, b) => a - b);
      const lightest = ls[Math.floor(ls.length * 0.95)] ?? ls[ls.length - 1];
      // White text at alpha a over a background of luminance `lightest` (grey, close enough for a scrim over white).
      const bg = lightest;
      const gray = Math.round(255 * Math.pow(bg, 1 / 2.2)); // approximate sRGB grey for that luminance
      const blend = Math.round(255 * t.a + gray * (1 - t.a));
      const lt = L(blend, blend, blend);
      return { text: t.text, large: t.large, ratio: (Math.max(lt, bg) + 0.05) / (Math.min(lt, bg) + 0.05) };
    });
  }, { shot, targets });
  const bad = worst.filter(w => w.ratio < (w.large ? 3 : 4.5)).map(w => `"${w.text}" ${w.ratio.toFixed(2)}:1`);
  expect(bad, bad.join("\n")).toEqual([]);
});
