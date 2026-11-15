// Makes the native app's web export installable on a phone: manifest, icons and the tags a phone reads.
// The web export is a testing channel (same app as Expo Go); the store apps are the product.
// Usage: node scripts/pwa-postbuild.mjs [distDir]
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve(process.argv[2] ?? "mobile/dist");
const root = resolve(import.meta.dirname, "..");

await mkdir(resolve(dist, "icons"), { recursive: true });
await cp(resolve(root, "public/icons"), resolve(dist, "icons"), { recursive: true });

const manifest = JSON.parse(await readFile(resolve(root, "public/manifest.webmanifest"), "utf8"));
manifest.orientation = "any"; // foldables and tablets rotate
await writeFile(resolve(dist, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));

let html = await readFile(resolve(dist, "index.html"), "utf8");
html = html
  // Zoom stays enabled on purpose (WCAG 1.4.4); viewport-fit=cover lets the app use the notch area.
  .replace(/<meta name="viewport"[^>]*>/, '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />')
  .replace(
    "</head>",
    `  <meta name="description" content="SEEN by CREOVA: multilingual community story worlds." />
  <meta name="theme-color" content="#000000" />
  <meta name="color-scheme" content="dark" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="SEEN" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="format-detection" content="telephone=no" />
  <style id="seen-app-feel">
    html, body { background: #000; overscroll-behavior: none; -webkit-tap-highlight-color: transparent; -webkit-text-size-adjust: 100%; }
    body { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; touch-action: manipulation; }
    input, textarea, [contenteditable], [data-selectable], [data-selectable] * { -webkit-user-select: text; user-select: text; }
    * { scrollbar-width: none; } *::-webkit-scrollbar { display: none; }
  </style>
</head>`,
  );
await writeFile(resolve(dist, "index.html"), html);
console.log("installable web export ready in", dist);
