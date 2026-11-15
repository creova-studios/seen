// Checks that a deployed SEEN app has NO telemetry endpoint compiled in.
//   node scripts/check-live-telemetry.mjs [https://seen-sigma-eight.vercel.app]
// Why it works: the app reads `import.meta.env.VITE_TELEMETRY_ENDPOINT` (src/app/observability.ts). Vite inlines
// VITE_* values at build time, so when the variable is set the deployed bundle contains the key with a string value
// (e.g. `VITE_TELEMETRY_ENDPOINT:"https://..."`). When it is unset the key never appears with a value.
// The website's privacy notice says the demo sends nothing to CREOVA, so run this after every production deploy.
// Exit code 0 = unset (good), 1 = set or unable to check.
const base = (process.argv[2] || "https://seen-sigma-eight.vercel.app").replace(/\/$/, "");

async function text(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

try {
  const html = await text(base + "/");
  const files = [...new Set([...html.matchAll(/(?:src|href)="(\/[^"]+\.js)"/g)].map((m) => m[1]))];
  if (!files.length) throw new Error("no JavaScript files found on the home page");
  let bundle = "";
  for (const f of files) bundle += "\n" + (await text(base + f));

  // Is the code that sends telemetry present? (It ships either way; what matters is the endpoint value.)
  const hasSender = /sendBeacon/.test(bundle);
  // A set variable is inlined as an object property with a string value.
  const set = /VITE_TELEMETRY_ENDPOINT["']?\s*:\s*["'`][^"'`]+["'`]/.exec(bundle);
  console.log(`checked ${files.length} files, ${(bundle.length / 1024).toFixed(0)} KB from ${base}`);
  console.log(`telemetry sender code present: ${hasSender ? "yes (expected; it stays idle without an endpoint)" : "no"}`);
  if (set) {
    console.error(`FAIL: an endpoint is compiled into the live app: ${set[0].slice(0, 120)}`);
    process.exit(1);
  }
  console.log("PASS: VITE_TELEMETRY_ENDPOINT is not set in the deployed build (the endpoint is undefined).");
} catch (e) {
  console.error("Could not check:", e.message);
  process.exit(1);
}
