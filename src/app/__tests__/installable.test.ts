import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "../../..");
const read = (p: string) => readFileSync(resolve(root, p));

/** Width and height from a PNG's IHDR chunk. */
function pngSize(p: string) {
  const b = read(p);
  expect(b.subarray(1, 4).toString()).toBe("PNG");
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

describe("installable on a phone", () => {
  const manifest = JSON.parse(read("public/manifest.webmanifest").toString());

  it("has the manifest fields browsers need to offer Install / Add to Home Screen", () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBe("SEEN");
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toMatch(/^#/);
    expect(manifest.background_color).toMatch(/^#/);
  });

  it("lists real icons at the sizes it claims, including a maskable one", () => {
    const purposes = manifest.icons.map((i: { purpose: string }) => i.purpose);
    expect(purposes).toContain("maskable");
    expect(manifest.icons.some((i: { sizes: string; purpose: string }) => i.sizes === "512x512" && i.purpose === "any")).toBe(true);
    for (const icon of manifest.icons as { src: string; sizes: string }[]) {
      const [w, h] = icon.sizes.split("x").map(Number);
      expect(pngSize(`public${icon.src}`)).toEqual({ w, h });
    }
  });

  it("has an iOS home-screen icon of 180 x 180", () => {
    expect(pngSize("public/icons/apple-touch-icon.png")).toEqual({ w: 180, h: 180 });
  });

  it("links the manifest and sets the phone meta tags without disabling zoom", () => {
    const html = read("index.html").toString();
    expect(html).toContain('rel="manifest" href="/manifest.webmanifest"');
    expect(html).toContain('rel="apple-touch-icon"');
    expect(html).toContain('name="theme-color"');
    expect(html).toContain('name="apple-mobile-web-app-capable"');
    expect(html).toContain("viewport-fit=cover");
    expect(html).not.toMatch(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/);
  });
});
