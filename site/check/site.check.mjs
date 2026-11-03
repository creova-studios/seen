// Run with: npm run check (inside site/). Uses only node:test, so no install step is needed.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { LANGS, copy } from "../src/content.mjs";
import { PAGES, pathFor } from "../src/render.mjs";
import { build } from "../build.mjs";
import { invite, withInvite } from "../src/invite.mjs";

const cfg = { siteUrl: "https://example.test", appUrl: "https://app.example.test", creovaUrl: "https://creova.one", inviteEmail: "invite@example.test" };

/** Flatten an object to "a.b.0.c" -> value. */
function flatten(o, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(o)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

test("every language has exactly the same keys and no empty strings", () => {
  const en = flatten(copy.en);
  for (const lang of LANGS) {
    const flat = flatten(copy[lang]);
    assert.deepEqual(Object.keys(flat).sort(), Object.keys(en).sort(), `${lang} keys differ from en`);
    for (const [k, v] of Object.entries(flat)) assert.ok(String(v).trim().length > 0, `${lang}.${k} is empty`);
  }
});

test("French and Spanish copy is translated, not copied from English", () => {
  const en = flatten(copy.en);
  // "Contact" and "Collections" are the same word in French; language names are written in their own language; the rest are codes or ISO dates.
  const sameAllowed = new Set(["htmlLang", "langName", "legal.updated", "legal.contactH2", "marquee.2", "marquee.4", "marquee.5", "marquee.6", "make.langs.0", "make.langs.1", "make.langs.2", "make.forms.2"]);
  for (const lang of ["fr", "es"]) {
    for (const [k, v] of Object.entries(flatten(copy[lang]))) {
      if (sameAllowed.has(k)) continue;
      assert.notEqual(v, en[k], `${lang}.${k} is identical to English`);
    }
  }
});

const out = build(cfg, mkdtempSync(join(tmpdir(), "seen-site-")));
const file = (lang, page) => join(out, pathFor(lang, page), "index.html");
const read = (lang, page) => readFileSync(file(lang, page), "utf8");

for (const lang of LANGS) {
  for (const page of PAGES) {
    test(`${lang}/${page}: structure, links and accessibility basics`, () => {
      const html = read(lang, page);
      assert.match(html, new RegExp(`<html lang="${copy[lang].htmlLang}">`));
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, "exactly one h1");
      assert.ok(html.includes('id="main"'), "skip link target exists");
      assert.ok(!/undefined|\[object|\bTODO\b|\bTBD\b|\bXXX\b|[Ll]orem ipsum|\{\{/.test(html), "no leaked placeholders");

      // every in-page anchor points at an element that exists
      for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
        if (id === "main") continue;
        assert.ok(html.includes(`id="${id}"`), `anchor #${id} has a target`);
      }
      // the link back to creova.one is on every page; the demo link is on the home page
      assert.ok(html.includes(`href="${cfg.creovaUrl}"`), "links back to creova.one");
      // default mode is invite-only: calls to action ask for an invitation and the demo URL is not on the page
      assert.ok(html.includes(`href="mailto:invite@example.test?subject=`), "asks for an invite");
      assert.ok(!html.includes(cfg.appUrl), "the demo URL is not published in invite mode");
      // footer links to terms and privacy on every page
      assert.ok(html.includes("terms/"), "footer links to terms");
      assert.ok(html.includes("privacy/"), "footer links to privacy");
      // external links carry rel="noopener"
      for (const [tag] of html.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)) {
        assert.ok(tag.includes('rel="noopener"'), `external link missing rel: ${tag}`);
      }
      // canonical and every language alternate of this same page when SITE_URL is set
      assert.ok(html.includes('rel="canonical"'));
      for (const l of LANGS) {
        assert.ok(html.includes(`hreflang="${l}" href="${cfg.siteUrl}${pathFor(l, page)}"`), `hreflang ${l}`);
      }
      assert.ok(html.includes('hreflang="x-default"'));
      // the policy that holds on hosts that cannot set headers
      assert.ok(html.includes("Content-Security-Policy"), "meta CSP present");
    });
  }
}

test("every relative link and stylesheet resolves to a file in the build", () => {
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const from = file(lang, page);
      const html = readFileSync(from, "utf8");
      for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        if (/^(https?:|mailto:|data:|#)/.test(href)) continue;
        const clean = href.split("#")[0];
        if (!clean) continue;
        let target = resolve(dirname(from), clean);
        if (!/\.[a-z0-9]+$/.test(target)) target = join(target, "index.html");
        assert.ok(existsSync(target) && statSync(target).isFile(), `${lang}/${page}: ${href} does not resolve`);
      }
    }
  }
});

test("language switcher keeps the reader on the same page", () => {
  assert.ok(read("en", "privacy").includes('href="../fr/privacy/"'));
  assert.ok(read("fr", "terms").includes('href="../../es/terms/"'));
  assert.ok(read("es", "home").includes('href="../"'));
});

test("legal pages say what the site actually does", () => {
  for (const lang of LANGS) {
    for (const page of ["terms", "privacy"]) {
      const sections = copy[lang].legal[page].sections;
      assert.ok(sections.length >= 8, `${lang}/${page} has its sections`);
    }
  }
  // the privacy notice must disclose the third parties the demo app contacts
  for (const lang of LANGS) {
    const text = JSON.stringify(copy[lang].legal.privacy);
    assert.ok(text.includes("Google Fonts") && text.includes("Unsplash"), `${lang} privacy names the demo's third parties`);
  }
});

test("without SITE_URL no canonical, hreflang or sitemap is written", () => {
  const dir = build({ ...cfg, siteUrl: "" }, mkdtempSync(join(tmpdir(), "seen-site-nourl-")));
  const html = readFileSync(join(dir, "index.html"), "utf8");
  assert.ok(!html.includes('rel="canonical"') && !html.includes('hreflang="x-default"'));
  assert.ok(!existsSync(join(dir, "sitemap.xml")));
});

test("GitHub Pages files: CNAME carries the site's host, .nojekyll present", () => {
  assert.equal(readFileSync(join(out, "CNAME"), "utf8"), "example.test\n");
  assert.ok(existsSync(join(out, ".nojekyll")));
  const dir = build({ ...cfg, siteUrl: "" }, mkdtempSync(join(tmpdir(), "seen-site-nocname-")));
  assert.ok(!existsSync(join(dir, "CNAME")), "no CNAME without SITE_URL");
});

test("build output contains every page, styles, robots and a sitemap listing them all", () => {
  for (const lang of LANGS) for (const page of PAGES) assert.ok(existsSync(file(lang, page)), `${lang}/${page}`);
  for (const f of ["styles.css", "robots.txt", "sitemap.xml"]) assert.ok(existsSync(join(out, f)), `${f} exists`);
  const sitemap = readFileSync(join(out, "sitemap.xml"), "utf8");
  for (const lang of LANGS) for (const page of PAGES) assert.ok(sitemap.includes(`${cfg.siteUrl}${pathFor(lang, page)}`));
});

test("headline accent, photos, fonts and licence are in place", () => {
  for (const lang of LANGS) {
    const c = copy[lang];
    assert.ok(c.hero.h1.includes(c.hero.accent), `${lang}: accent word is part of the headline`);
    const html = read(lang, "home");
    assert.ok(html.includes(`<em>${c.hero.accent}</em>`), `${lang}: accent rendered`);
    for (const k of ["hero", "creators", "viewers"]) {
      assert.ok(c.photos[k].length > 40, `${lang}: ${k} photo has a real description`);
      assert.ok(html.includes(`alt="${c.photos[k].replace(/"/g, "&quot;")}"`), `${lang}: ${k} alt text rendered`);
    }
    for (const [tag] of html.matchAll(/<img [^>]*>/g)) {
      assert.match(tag, /\swidth="\d+"/, `img has width: ${tag}`);
      assert.match(tag, /\sheight="\d+"/, `img has height: ${tag}`);
      assert.match(tag, /\salt="/, `img has alt: ${tag}`);
    }
  }
  for (const f of ["img/app-home.jpg", "img/app-explore.jpg", "img/app-creators.jpg", "fonts/instrument-serif-latin-400-normal.woff2", "fonts/instrument-serif-latin-400-italic.woff2", "fonts/OFL.txt", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "img/hero-portrait.jpg", "img/creators-laptop.jpg", "img/viewers-chess.jpg"]) {
    assert.ok(existsSync(join(out, f)), `${f} is in the build`);
  }
  const css = readFileSync(join(out, "styles.css"), "utf8");
  for (const [, u] of css.matchAll(/url\("([^"]+)"\)/g)) assert.ok(existsSync(join(out, u)), `css asset ${u} exists`);
});

test("Make a SEEN: 27 seeds in three languages, accessible controls, same-origin script, nothing stored", () => {
  for (const lang of LANGS) {
    const html = read(lang, "home");
    assert.equal((html.match(/data-seed="/g) || []).length, 27, `${lang}: 27 seeds`);
    for (const ol of LANGS) assert.equal((html.match(new RegExp(`data-seed="${ol}-`, "g")) || []).length, 9, `${lang}: 9 seeds in ${ol}`);
    assert.equal((html.match(/<fieldset>/g) || []).length, 3, `${lang}: three fieldsets`);
    assert.equal((html.match(/<legend/g) || []).length, 3, `${lang}: each fieldset has a legend`);
    assert.equal((html.match(/type="radio"[^>]*checked/g) || []).length, 3, `${lang}: one default choice per group`);
    assert.ok(html.includes('aria-live="polite"'), `${lang}: result is announced`);
    assert.ok(html.includes('data-controls hidden'), `${lang}: controls appear only when the script runs`);
    assert.ok(html.includes('<script src="site.js" defer></script>') || html.includes('<script src="../site.js" defer></script>'), `${lang}: script tag`);
  }
  const js = readFileSync(join(out, "site.js"), "utf8");
  assert.ok(!/localStorage|sessionStorage|document\.cookie|XMLHttpRequest|fetch\(|sendBeacon|WebSocket|https?:\/\//.test(js), "the script stores nothing and calls nothing");
  for (const lang of LANGS) assert.ok(read(lang, "privacy").includes("SEEN"), "privacy page present");
});

test("illustrations are decorative and the page has no text trapped in images", () => {
  for (const lang of LANGS) {
    const html = read(lang, "home");
    const svgs = [...html.matchAll(/<svg [^>]*>/g)].map((m) => m[0]);
    assert.ok(svgs.length >= 8, `${lang}: art is present`);
    for (const tag of svgs) assert.ok(tag.includes('aria-hidden="true"'), `${lang}: decorative svg is hidden from assistive tech: ${tag.slice(0, 60)}`);
    assert.ok(html.includes('class="marquee" aria-hidden="true"'), `${lang}: ticker is hidden from assistive tech`);
    for (const k of ["shotHome", "shotExplore", "shotCreators"]) {
      assert.ok(html.includes(`alt="${copy[lang].photos[k].replace(/"/g, "&quot;")}"`), `${lang}: ${k} alt text rendered`);
    }
    assert.equal((html.match(/class="bubble/g) || []).length, 4, `${lang}: four speech bubbles`);
    assert.ok(!/<h[1-6][^>]*>\s*<\/h/.test(html), `${lang}: no empty headings`);
  }
  const css = readFileSync(join(out, "styles.css"), "utf8");
  assert.ok(css.includes("prefers-reduced-motion: no-preference"), "animation is gated on reduced motion");
  // every animation must sit inside an @media (prefers-reduced-motion: no-preference) block
  let depth = 0, gatedAt = -1, ungated = [];
  for (const m of css.matchAll(/@media[^{]*\{|\{|\}|animation\s*:[^;}]*/g)) {
    const t = m[0];
    if (t.startsWith("@media")) { depth++; if (/no-preference/.test(t) && gatedAt < 0) gatedAt = depth; }
    else if (t === "{") depth++;
    else if (t === "}") { if (depth === gatedAt) gatedAt = -1; depth--; }
    else if (gatedAt < 0) ungated.push(t.trim());
  }
  assert.deepEqual(ungated, [], "animations outside the reduced-motion gate");
});

test("the website speaks the product's language: the tagline is the app's own, word for word", () => {
  const src = readFileSync(new URL("../../src/app/i18n/strings.ts", import.meta.url), "utf8");
  const get = (key) => {
    const m = src.match(new RegExp(`"${key}":\\s*\\{\\s*en:\\s*"([^"]*)",\\s*fr:\\s*"([^"]*)",\\s*es:\\s*"([^"]*)"`));
    assert.ok(m, `${key} found in the app's strings`);
    return { en: m[1], fr: m[2], es: m[3] };
  };
  const a = get("onboard.tagline1"), b = get("onboard.tagline2");
  for (const lang of LANGS) assert.equal(copy[lang].tagline, `${a[lang]} ${b[lang]}.`, `${lang}: tagline matches the app`);
});

test("nothing internal is published: no source paths, repos or roadmap detail", () => {
  const files = ["styles.css", ...LANGS.flatMap((l) => PAGES.map((p) => join(pathFor(l, p).slice(1), "index.html")))];
  const banned = [/creova-gif/i, /seen-tokens/i, /DESIGN\.md/, /strings\.ts/, /\bsrc\//, /\bdocs\//, /supabase/i, /\bRLS\b/, /TODO|FIXME/];
  for (const f of files) {
    const text = readFileSync(join(out, f), "utf8");
    for (const re of banned) assert.ok(!re.test(text), `${f} contains ${re}`);
  }
  // roadmap mechanics stay out of the marketing copy (the app demo shows what exists; the site does not map what is next)
  const roadmap = /guest|transcript|challenge a credit|application tracker|content notes|image descriptions|sin cuenta|sans compte|transcripci|transcription/i;
  for (const lang of LANGS) {
    const c = copy[lang];
    const marketing = JSON.stringify({ hero: c.hero, what: c.what, creators: c.creators, viewers: c.viewers, beta: c.beta, showcase: c.showcase, closer: c.closer });
    assert.ok(!roadmap.test(marketing), `${lang}: marketing copy names unreleased mechanics`);
  }
});

test("invite wording exists in every language and is translated", () => {
  const keys = Object.keys(invite.en).sort();
  for (const lang of LANGS) {
    assert.deepEqual(Object.keys(invite[lang]).sort(), keys, `${lang}: same invite keys`);
    const c = withInvite(copy[lang], lang);
    assert.notEqual(c.cta, copy[lang].cta, `${lang}: invite changes the call to action`);
    assert.ok(!/demo (app )?is open|démo est ouverte|demo está abierta/i.test(JSON.stringify(c.beta.today) + JSON.stringify(c.faq.items[0])), `${lang}: no "demo is open" claim in invite mode`);
    if (lang !== "en") for (const k of ["cta", "status0", "makeOpen", "closerP"]) assert.notEqual(invite[lang][k], invite.en[k], `${lang}.${k} translated`);
  }
});

test("open mode links straight to the demo; the privacy notice covers invite emails", () => {
  const dir = build({ ...cfg, demoAccess: "open" }, mkdtempSync(join(tmpdir(), "seen-site-open-")));
  for (const lang of LANGS) {
    const html = readFileSync(join(dir, pathFor(lang, "home"), "index.html"), "utf8");
    assert.ok(html.includes(`href="${cfg.appUrl}"`), `${lang}: demo link in open mode`);
    assert.ok(!html.includes("mailto:"), `${lang}: no mailto in open mode`);
    assert.ok(/invit/i.test(JSON.stringify(copy[lang].legal.privacy)), `${lang}: privacy notice mentions invitation emails`);
  }
});

test("PHOTOS=off builds without the three photographs and keeps every link and alt valid", () => {
  const dir = build({ ...cfg, photos: "off" }, mkdtempSync(join(tmpdir(), "seen-site-nophoto-")));
  for (const f of ["hero-portrait.jpg", "creators-laptop.jpg", "viewers-chess.jpg"]) assert.ok(!existsSync(join(dir, "img", f)), `${f} not shipped`);
  assert.ok(existsSync(join(dir, "img", "app-home.jpg")), "app screens still shipped");
  for (const lang of LANGS) {
    const html = readFileSync(join(dir, pathFor(lang, "home"), "index.html"), "utf8");
    assert.ok(!/hero-portrait|creators-laptop|viewers-chess/.test(html), `${lang}: no photo references`);
    assert.ok(!html.includes(copy[lang].photos.credit), `${lang}: no photo credit line`);
    for (const [tag] of html.matchAll(/<img [^>]*>/g)) assert.match(tag, /\salt="/, "images keep alt text");
    for (const [, src] of html.matchAll(/<img [^>]*src="([^"]+)"/g)) assert.ok(existsSync(resolve(dirname(join(dir, pathFor(lang, "home"), "index.html")), src)), `${lang}: ${src} exists`);
  }
});

test("Cloudflare's email obfuscation is switched off for the page, so mailto links stay real links", () => {
  // The site is served through Cloudflare, which otherwise rewrites mailto: links into /cdn-cgi/l/email-protection
  // and injects a decoder script. The documented marker below tells it to leave the page alone.
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const html = read(lang, page);
      const open = html.indexOf("<!--email_off-->"), close = html.indexOf("<!--/email_off-->");
      assert.ok(open > 0 && close > open, `${lang}/${page}: email_off markers wrap the body`);
      for (const m of html.matchAll(/href="mailto:/g)) assert.ok(m.index > open && m.index < close, `${lang}/${page}: every mailto link sits inside the marker`);
    }
  }
});

test("the site makes no third-party requests", () => {
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const html = read(lang, page);
      const scripts = [...html.matchAll(/<script[^>]*>/g)].map((m) => m[0]);
      for (const tag of scripts) assert.match(tag, /^<script src="[^":]*site\.js" defer>$/, `only the same-origin toy script is allowed: ${tag}`);
      assert.ok(!/<iframe|<img[^>]+src="https?:/.test(html), "no iframes or remote images");
    }
  }
  assert.ok(!/@import|url\(\s*["']?https?:/.test(readFileSync(join(out, "styles.css"), "utf8")));
});

test("the header carries the SEEN wordmark image, named by its link", () => {
  for (const lang of LANGS) {
    const html = read(lang, "home");
    assert.match(html, /<a class="wordmark"[^>]*aria-label="SEEN"><img [^>]*seen-wordmark\.png"[^>]*alt=""/, `${lang}: wordmark image in header`);
  }
  assert.ok(existsSync(join(out, "img/seen-wordmark.png")));
});
