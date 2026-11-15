import { expect, signInAs, test } from "../fixtures";
import { writeFileSync } from "node:fs";

/** Sweeps every route at phone widths and records overlapping controls, small tap targets and clipped text. Writes test-results/ux-audit.json. */
const ROLE_ROUTES: Record<string, string[]> = {
  creator: ["creator-monetization", "creator-earnings", "creator-publish", "creator-stories", "notes"],
  moderator: ["moderation-governance"],
  admin: ["admin-dashboard"],
};
const ROUTES = ["for-you", "explore", "explore/creators", "library", "profile", "search", "notifications", "story/midnight-resonance", "creator/kira-chen", "collections", "funding", "settings", "account", "about", "edit-profile", "change-password", "legal", "funding-readiness", "opportunity/cca-explore-create-research-creation"];
const WIDTHS = [320, 360, 390, 768, 1280];
const findings: Record<string, unknown>[] = [];

for (const role of ["viewer", "creator", "moderator", "admin"] as const) test(`ux audit ${role}`, async ({ page }) => {
  test.setTimeout(600000);
  await signInAs(page, role);
  const routes = role === "viewer" ? ROUTES : ROLE_ROUTES[role];
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 740 });
    for (const r of routes) {
      await page.goto(`/#/${r}`);
      await page.waitForTimeout(r === "creator-publish" ? 2200 : 900); // staggered entrance animations scale controls until they settle
      const res = await page.evaluate(() => {
        const vis = (e: Element) => {
          const r = e.getBoundingClientRect();
          const cs = getComputedStyle(e);
          return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0";
        };
        const label = (e: Element) => ((e.getAttribute("aria-label") || (e as HTMLElement).innerText || e.tagName) + "").trim().replace(/\s+/g, " ").slice(0, 40);
        const nav = document.querySelector("nav[aria-label=Main]");
        const ctrls = [...document.querySelectorAll("button, a[href], [role=button], input, select, textarea")].filter(vis).filter(e => !nav || !nav.contains(e));
        const small = ctrls.filter(e => { const r = e.getBoundingClientRect(); return (r.width < 44 || r.height < 44) && !(e as HTMLElement).closest("[aria-hidden=true]") && r.width * r.height > 0; })
          .map(e => { const r = e.getBoundingClientRect(); return `${label(e)} ${Math.round(r.width)}x${Math.round(r.height)}`; });
        const overlaps: string[] = [];
        for (let i = 0; i < ctrls.length; i++) for (let j = i + 1; j < ctrls.length; j++) {
          const a = ctrls[i], b = ctrls[j];
          if (a.contains(b) || b.contains(a)) continue;
          const A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
          const ox = Math.min(A.right, B.right) - Math.max(A.left, B.left);
          const oy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
          if (ox > 4 && oy > 4) overlaps.push(`${label(a)} × ${label(b)} (${Math.round(ox)}x${Math.round(oy)})`);
        }
        const clipped = [...document.querySelectorAll("h1,h2,h3,h4,p,span,button,a,label")].filter(vis)
          .filter(e => { const cs = getComputedStyle(e); return e.scrollWidth > e.clientWidth + 2 && cs.overflow !== "visible" && cs.textOverflow !== "ellipsis" && !cs.webkitLineClamp?.toString().match(/\d/) && e.clientWidth > 0; })
          .map(e => label(e));
        const off = [...document.querySelectorAll("*")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1) && !(e as HTMLElement).closest("[data-scroll], .overflow-x-auto, [class*=overflow-x], [class*=snap]"); }).slice(0, 5).map(e => `${e.tagName}.${(e.className + "").slice(0, 40)}`);
        return { small, overlaps, clipped, off };
      });
      // At the bottom of the page, nothing may sit under the fixed nav.
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, document.documentElement.scrollHeight); document.querySelectorAll("[data-scroll-root]").forEach(e => { (e as HTMLElement).style.scrollBehavior = "auto"; e.scrollTop = e.scrollHeight; }); });
      await page.waitForTimeout(500);
      const hidden = await page.evaluate(() => {
        const nav = document.querySelector("nav[aria-label=Main]");
        const nb = nav?.getBoundingClientRect();
        if (!nb) return [];
        return [...document.querySelectorAll("button, a[href], [role=button], input, select, textarea")]
          .filter(e => !nav!.contains(e)).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > nb.top + 4 && r.top < nb.bottom && r.right > nb.left + 1 && r.left < nb.right - 1; })
          .map(e => ((e.getAttribute("aria-label") || (e as HTMLElement).innerText || e.tagName) + "").trim().replace(/\s+/g, " ").slice(0, 40));
      });
      findings.push({ width: w, route: `${role}:${r}`, ...res, hidden });
    }
  }
  // Guard: no undersized targets (the 52x32 switch has a 44px hit area), no hidden-under-nav content, no sideways overflow.
  const bad = findings.filter(f => true).flatMap(f => [
    ...((f.small as string[]) ?? []).filter(x => !/52x32$/.test(x)).map(x => `small ${f.route} ${x}`),
    ...((f.hidden as string[]) ?? []).map(x => `hidden ${f.route} ${x}`),
    ...((f.off as string[]) ?? []).map(x => `overflow ${f.route} ${x}`),
  ]);
  writeFileSync(`test-results/ux-audit-${role}.json`, JSON.stringify(findings, null, 1));
  expect(bad, bad.slice(0, 10).join("\n")).toEqual([]);
});
