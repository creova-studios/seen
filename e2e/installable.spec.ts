import { expect, test } from "@playwright/test";

test("the manifest and icons are served so phones can install the app", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).toBe("/manifest.webmanifest");
  const res = await request.get(href!);
  expect(res.ok()).toBe(true);
  const manifest = await res.json();
  for (const icon of manifest.icons as { src: string }[]) {
    const r = await request.get(icon.src);
    expect(r.ok(), icon.src).toBe(true);
    expect(r.headers()["content-type"]).toContain("image/png");
  }
  const apple = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect((await request.get(apple!)).ok()).toBe(true);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#000000");
});
