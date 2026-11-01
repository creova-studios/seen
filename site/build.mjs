// Builds the SEEN website into site/dist. No dependencies.
//   SITE_URL    defaults to https://seen.creova.one. Set it to an empty string to build without canonical, hreflang,
//               sitemap or CNAME (for example for a local preview).
//   APP_URL     where "Try the demo app" points. Defaults to the current production demo.
//   CREOVA_URL  where the links back to CREOVA point.
//   DEMO_ACCESS invite (default) or open. INVITE_EMAIL where invite requests go. PHOTOS=off builds without photographs.
import { mkdirSync, rmSync, writeFileSync, copyFileSync, cpSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LANGS } from "./src/content.mjs";
import { renderPage, pathFor, PAGES } from "./src/render.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");

export const config = {
  siteUrl: process.env.SITE_URL ?? "https://seen.creova.one",
  appUrl: process.env.APP_URL || "https://seen-sigma-eight.vercel.app",
  creovaUrl: process.env.CREOVA_URL || "https://creova.one",
  // "invite" (default): calls to action ask for an invitation; "open": they go straight to appUrl
  demoAccess: process.env.DEMO_ACCESS === "open" ? "open" : "invite",
  inviteEmail: process.env.INVITE_EMAIL || "support@creova.one",
  // "off": build without the three photographs (illustrations instead), for when release forms are not in hand
  photos: process.env.PHOTOS === "off" ? "off" : "on",
};

export function build(cfg = config, outDir = dist) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const dir = join(outDir, pathFor(lang, page));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), renderPage(lang, cfg, page));
    }
  }
  // Source comments name internal files and repos; the published stylesheet carries none.
  const css = readFileSync(join(root, "src", "styles.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n{2,}/g, "\n").trim() + "\n";
  writeFileSync(join(outDir, "styles.css"), css);
  copyFileSync(join(root, "src", "creova-mark.png"), join(outDir, "creova-mark.png"));
  copyFileSync(join(root, "src", "site.js"), join(outDir, "site.js"));
  cpSync(join(root, "src", "fonts"), join(outDir, "fonts"), { recursive: true });
  cpSync(join(root, "src", "icons"), join(outDir, "icons"), { recursive: true });
  const photoFiles = ["hero-portrait.jpg", "creators-laptop.jpg", "viewers-chess.jpg"];
  cpSync(join(root, "src", "img"), join(outDir, "img"), { recursive: true, filter: (src) => cfg.photos !== "off" || !photoFiles.some((f) => src.endsWith(f)) });

  const site = cfg.siteUrl.replace(/\/$/, "");
  // GitHub Pages: keep the custom domain across deploys and skip Jekyll processing.
  writeFileSync(join(outDir, ".nojekyll"), "");
  if (site) writeFileSync(join(outDir, "CNAME"), new URL(site).hostname + "\n");
  writeFileSync(
    join(outDir, "robots.txt"),
    `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ""}`,
  );
  if (site) {
    const urls = LANGS.flatMap((l) => PAGES.map((p) => `  <url><loc>${site}${pathFor(l, p)}</loc></url>`)).join("\n");
    writeFileSync(
      join(outDir, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
  } else {
    console.warn("SITE_URL is not set: building without canonical, hreflang or sitemap.");
  }
  return outDir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Built ${build()}`);
}
