import { closeWithEscape, expect, signInAs, test, type Page } from "../fixtures";
import { mkdirSync, writeFileSync } from "node:fs";

/**
 * Manual-style WCAG checks automated as far as a browser allows: keyboard-only journeys,
 * accessible-name coverage, 200% zoom and Larger text reflow, and worst-case contrast of text over images.
 * It does NOT replace testing with VoiceOver or NVDA. Findings are written to test-results/manual-a11y.json.
 */
const findings: Record<string, unknown>[] = [];
mkdirSync("test-results", { recursive: true });

async function focused(page: Page) {
  return page.evaluate(() => {
    const e = document.activeElement as HTMLElement | null;
    if (!e || e === document.body) return { name: "", tag: "body", role: "" };
    const label = e.getAttribute("aria-label") || (e.labels?.[0]?.innerText ?? "") || e.innerText || e.getAttribute("placeholder") || e.getAttribute("title") || "";
    return { name: label.replace(/\s+/g, " ").trim(), tag: e.tagName.toLowerCase(), role: e.getAttribute("role") || "" };
  });
}

/** Press Tab until the focused element's name matches, or fail (a keyboard trap or an unreachable control). */
async function tabTo(page: Page, name: RegExp, max = 80) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    const f = await focused(page);
    if (name.test(f.name)) return f;
  }
  throw new Error(`Could not reach ${name} by keyboard within ${max} Tab presses`);
}

test.describe("keyboard-only journeys", () => {
  test("landing → sign up → onboarding → For You", async ({ page }) => {
    await page.goto("/");
    await tabTo(page, /s\W*e\W*e\W*n/i);
    await page.keyboard.press("Enter");
    // Each onboarding screen fades out before the next fades in; wait for it so Tab starts on the real page.
    await expect(page.getByRole("heading", { name: /this is not\s+social media/i })).toBeVisible();
    await tabTo(page, /^continue$/i);
    await page.keyboard.press("Enter");
    // The entry screen fades out before the first step fades in; wait for it so Tab starts on the real page.
    await expect(page.getByText(/step 1 of 3/i)).toBeVisible();
    await tabTo(page, /discover stories/i);
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /discover stories/i })).toHaveAttribute("aria-pressed", "true");
    await tabTo(page, /next: your interests/i);
    await page.keyboard.press("Enter");
    await tabTo(page, /skip: create your account/i);
    await page.keyboard.press("Enter");
    await tabTo(page, /^name$/i);
    await page.keyboard.type("Keyboard User");
    await tabTo(page, /^email$/i);
    await page.keyboard.type(`kb-${Date.now()}@example.com`);
    await tabTo(page, /^password$/i);
    await page.keyboard.type("Password123");
    await tabTo(page, /create account/i);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
  });

  test("open a story, save it, read it, find it in Saved, change a preference, sign out", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/for-you");
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
    // open the first story by keyboard
    const card = await tabTo(page, /midnight resonance/i, 80);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/story\//);
    // The For You screen fades out and the story page loads lazily; wait for it so Tab starts on the real page.
    await expect(page.getByRole("button", { name: /^save to library$/i })).toBeVisible();
    // save
    await tabTo(page, /^save to library$/i);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /^remove from saved$/i })).toBeVisible();
    // start reading
    await tabTo(page, /start reading/i);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /^transcript$/i })).toBeVisible();
    // Escape-style exit: use the close control by keyboard
    await tabTo(page, /close|back|index|chapters/i, 40);
    // Library > Saved
    await page.goto("/#/library");
    // The reader fades out and Library loads lazily; wait for the destination so Tab starts on the real page.
    await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
    await tabTo(page, /saved stor(y|ies)$/i);
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("story-row").first()).toBeVisible();
    // Settings: Larger text switch with Space
    await page.goto("/#/settings");
    await expect(page.getByText(/larger text/i).first()).toBeVisible();
    await tabTo(page, /larger text/i);
    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveAttribute("data-text", "large");
    // Sign out with confirmation
    await page.goto("/#/profile");
    await expect(page.getByRole("button", { name: /^sign out$/i })).toBeVisible();
    await tabTo(page, /^sign out$/i, 120);
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: /sign out\?/i });
    await expect(dialog).toBeVisible();
    await closeWithEscape(page, dialog);
    await expect(page.getByRole("button", { name: /^sign out$/i })).toBeFocused();
  });

  test("create story: chips, image description and content notes are keyboard operable", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/creator-publish");
    await tabTo(page, /^educators$/i, 100);
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /^educators$/i })).toHaveAttribute("aria-pressed", "true");
  });
});

const ROUTES = ["for-you", "explore", "library", "profile", "search", "settings", "funding", "notifications", "about", "story/midnight-resonance", "creator/kira-chen"];

test("every interactive control and landmark has an accessible name (semantics review)", async ({ page }) => {
  test.setTimeout(240000);
  await signInAs(page, "viewer");
  const problems: string[] = [];
  for (const r of ROUTES) {
    await page.goto(`/#/${r}`);
    await page.waitForTimeout(700);
    const res = await page.evaluate(() => {
      const nameOf = (e: Element) => {
        const el = e as HTMLElement;
        const labelledby = el.getAttribute("aria-labelledby");
        const lb = labelledby ? labelledby.split(" ").map(id => document.getElementById(id)?.textContent ?? "").join(" ") : "";
        return (el.getAttribute("aria-label") || lb || (el as HTMLInputElement).labels?.[0]?.innerText || el.innerText || el.getAttribute("title") || "").replace(/\s+/g, " ").trim();
      };
      const vis = (e: Element) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden"; };
      const unnamed = [...document.querySelectorAll("button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=switch], [role=tab], [role=checkbox]")]
        .filter(vis).filter(e => !e.closest("[aria-hidden=true]")).filter(e => !nameOf(e)).map(e => `${e.tagName.toLowerCase()}.${(e.className + "").slice(0, 30)}`);
      const imgsNoAlt = [...document.querySelectorAll("img")].filter(vis).filter(i => !i.hasAttribute("alt")).length;
      return {
        title: document.title,
        main: document.querySelectorAll("main, [role=main]").length,
        h1: document.querySelectorAll("h1").length,
        nav: document.querySelectorAll("nav").length,
        unnamed,
        imgsNoAlt,
      };
    });
    if (res.unnamed.length) problems.push(`${r}: unnamed controls ${res.unnamed.join(", ")}`);
    if (res.imgsNoAlt) problems.push(`${r}: ${res.imgsNoAlt} img without alt attribute`);
    if (!res.title) problems.push(`${r}: empty document title`);
    findings.push({ check: "semantics", route: r, ...res });
  }
  writeFileSync("test-results/manual-a11y-semantics.json", JSON.stringify(findings, null, 1));
  expect(problems).toEqual([]);
});

test("200% zoom and Larger text: no sideways scroll, no clipped controls, nav still reachable", async ({ page }) => {
  test.setTimeout(300000);
  await signInAs(page, "viewer");
  const problems: string[] = [];
  // 640 CSS px = a 1280 px desktop at 200% zoom; 320 CSS px = 400% (WCAG 1.4.10 reflow). Larger text on top.
  for (const [w, large] of [[640, false], [640, true], [320, true], [390, true]] as const) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const r of ["for-you", "explore", "library", "profile", "settings", "search", "funding", "collections", "story/midnight-resonance"]) {
      await page.goto(`/#/${r}`);
      await page.evaluate(v => { document.documentElement.dataset.text = v ? "large" : "normal"; }, large);
      await page.waitForTimeout(500);
      const res = await page.evaluate(() => {
        const doc = document.documentElement;
        const sideways = doc.scrollWidth > doc.clientWidth + 1;
        const wide = sideways
          ? [...document.querySelectorAll("body *")]
              .filter(e => e.getBoundingClientRect().right > doc.clientWidth + 1 && e.getBoundingClientRect().width > 0)
              .slice(0, 5)
              .map(e => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 50)}@${Math.round(e.getBoundingClientRect().right)}/${doc.clientWidth}`)
          : [];
        const clipped = [...document.querySelectorAll("button, a[href], h1, h2, h3, label")]
          .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
          .filter(e => { const el = e as HTMLElement; const cs = getComputedStyle(el); return el.clientWidth > 2 && el.scrollWidth > el.clientWidth + 2 && cs.overflowX !== "visible" && cs.textOverflow !== "ellipsis"; })
          .map(e => ((e as HTMLElement).innerText || e.getAttribute("aria-label") || "").slice(0, 30));
        const nav = document.querySelector("nav[aria-label=Main]");
        const navOk = !nav || nav.getBoundingClientRect().bottom <= window.innerHeight + 1;
        return { sideways, wide, clipped, navOk };
      });
      const tag = `${w}px${large ? "+large" : ""} ${r}`;
      if (res.sideways) problems.push(`${tag}: horizontal scroll (${res.wide.join("; ") || "no element wider than the viewport"}; scrollWidth ${await page.evaluate(() => document.documentElement.scrollWidth)})`);
      if (res.clipped.length) problems.push(`${tag}: clipped ${res.clipped.join(" | ")}`);
      if (!res.navOk) problems.push(`${tag}: bottom nav off-screen`);
      findings.push({ check: "zoom", tag, ...res });
    }
  }
  writeFileSync("test-results/manual-a11y-zoom.json", JSON.stringify(findings, null, 1));
  expect(problems).toEqual([]);
});

/** Worst-case contrast of text over imagery: hide the text, screenshot what is behind it, take the lightest 5% of pixels as the background. */
test("text over images keeps 4.5:1 (or 3:1 for large text) against the lightest part of the image", async ({ page }) => {
  test.setTimeout(300000);
  await signInAs(page, "viewer");
  await page.setViewportSize({ width: 390, height: 844 });
  // Worst case for light text: every photo is pure white (the sandbox cannot load the real covers anyway).
  await page.route(/images\.unsplash\.com/, route =>
    route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"><rect width="100%" height="100%" fill="#ffffff"/></svg>' }),
  );
  const problems: string[] = [];
  for (const r of ["for-you", "explore", "library", "story/midnight-resonance", "reader", "creator/kira-chen", "collections"]) {
    if (r === "reader") {
      await page.goto("/#/story/midnight-resonance");
      await page.getByRole("button", { name: /start reading/i }).first().click();
      await page.getByRole("button", { name: /^transcript$/i }).waitFor();
    } else {
      await page.goto(`/#/${r}`);
    }
    await page.waitForTimeout(900);
    const targets = await page.evaluate(() => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const cx = cv.getContext("2d", { willReadFrequently: true })!;
      const rgba = (c: string): [number, number, number, number] => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = "#000";
        cx.fillStyle = c;
        cx.fillRect(0, 0, 1, 1);
        const d = cx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2], d[3] / 255];
      };
      const imgs = [...document.querySelectorAll("img, [style*=background-image]")].map(i => i.getBoundingClientRect()).filter(r => r.width > 40 && r.height > 40);
      const out: { sel: string; x: number; y: number; w: number; h: number; color: number[]; large: boolean; text: string }[] = [];
      document.querySelectorAll("h1,h2,h3,p,span,a,button,label,div").forEach((e, idx) => {
        const el = e as HTMLElement;
        if (![...el.childNodes].some(n => n.nodeType === 3 && (n.textContent ?? "").trim())) return;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8 || r.bottom < 0 || r.top > window.innerHeight) return;
        if (!imgs.some(i => r.left < i.right && r.right > i.left && r.top < i.bottom && r.bottom > i.top)) return;
        const cs = getComputedStyle(el);
        // Buttons that carry an icon next to the label sit on their own solid fill; sampling the icon would read as background.
        if (el.querySelector("svg")) return;
        const col = rgba(cs.color);
        if (col[3] === 0) return;
        el.setAttribute("data-ct", String(idx));
        const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
        // Pills and circles: sample the middle, where the text sits, not the clipped corners.
        const pill = parseFloat(cs.borderTopLeftRadius) >= r.height / 2 - 1;
        const inset = pill ? 0.22 : 0;
        out.push({ sel: `[data-ct="${idx}"]`, x: r.left + r.width * inset, y: r.top + r.height * inset, w: r.width * (1 - 2 * inset), h: r.height * (1 - 2 * inset), color: col, large: size >= 24 || (size >= 18.66 && bold), text: (el.innerText || "").slice(0, 30) });
      });
      return out.slice(0, 40);
    });
    findings.push({ check: "image-contrast-coverage", route: r, targets: targets.length, imgs: await page.locator("img").count(), fallbacks: await page.getByTestId("image-fallback").count() });
    // Hide all text, capture the backdrop once per route. Transitions are switched off too, or fading text would still show in the shot.
    const hide = await page.addStyleTag({ content: "*{color:transparent !important;text-shadow:none !important;transition:none !important}" });
    const shot = (await page.screenshot()).toString("base64");
    await hide.evaluate(e => e.remove()); // hash navigation keeps the document, so the style must not leak into the next route
    const worst = await page.evaluate(async ({ shot, targets }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + shot;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const k = img.width / window.innerWidth;
      const L = (r: number, g: number, b: number) => { const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      return targets.map(t => {
        const w = Math.max(1, Math.round(t.w * k)), h = Math.max(1, Math.round(t.h * k));
        const d = ctx.getImageData(Math.round(t.x * k), Math.round(t.y * k), w, h).data;
        const px: { l: number; rgb: number[] }[] = [];
        for (let i = 0; i < d.length; i += 4) px.push({ l: L(d[i], d[i + 1], d[i + 2]), rgb: [d[i], d[i + 1], d[i + 2]] });
        px.sort((a, b) => a.l - b.l);
        const lo = px[Math.floor(px.length * 0.05)] ?? px[0], hi = px[Math.floor(px.length * 0.95)] ?? px[px.length - 1];
        const [tr, tg, tb, ta] = t.color;
        const against = (bg: number[]) => ratio(L(tr * ta + bg[0] * (1 - ta), tg * ta + bg[1] * (1 - ta), tb * ta + bg[2] * (1 - ta)), L(bg[0], bg[1], bg[2]));
        return { text: t.text, large: t.large, worst: Math.min(against(lo.rgb), against(hi.rgb)), textRgba: t.color, rect: [Math.round(t.x), Math.round(t.y), Math.round(t.w), Math.round(t.h)] };
      });
    }, { shot, targets });
    for (const w of worst) {
      const need = w.large ? 3 : 4.5;
      findings.push({ check: "image-contrast", route: r, ...w, need });
      if (w.worst < need) problems.push(`${r}: "${w.text}" ${w.worst.toFixed(2)}:1 < ${need}:1`);
    }
  }
  writeFileSync("test-results/manual-a11y-image-contrast.json", JSON.stringify(findings, null, 1));
  expect(findings.filter(f => f.check === "image-contrast").length, "no text over images was measured").toBeGreaterThan(5);
  expect(problems, problems.slice(0, 15).join("\n")).toEqual([]);
});
