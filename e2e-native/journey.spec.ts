import { expect, test, type Page } from "@playwright/test";

/** First run as a guest, up to the story page. The same screens Expo Go shows. */
async function enterAsGuest(page: Page) {
  await page.goto("/");
  await page.getByText("English", { exact: true }).first().click();
  await page.getByRole("button", { name: "S.E.E.N" }).click();
  await page.getByRole("button", { name: /^continue$/i }).click();
  await page.getByRole("button", { name: /explore without an account/i }).click();
  await expect(page.getByText("For You", { exact: true }).first()).toBeVisible();
}

test("the entry screens come first, in order, with the guest link on the purpose step", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/choose your language/i)).toBeVisible();
  await page.getByText("English", { exact: true }).first().click();
  await expect(page.getByText(/you are entering seen/i)).toBeVisible();
  await expect(page.getByText(/explore without an account/i)).toHaveCount(0);
  await page.getByRole("button", { name: "S.E.E.N" }).click();
  await expect(page.getByText(/this is not/i)).toBeVisible();
  await page.getByRole("button", { name: /^continue$/i }).click();
  await expect(page.getByText(/what brings you to seen/i)).toBeVisible();
  await expect(page.getByText(/explore without an account/i)).toBeVisible();
});

test("a guest lands on For You, opens a story and reaches chapter 1", async ({ page }) => {
  await enterAsGuest(page);
  await expect(page.getByText(/exploring as a guest/i)).toBeVisible();
  await page.getByRole("button", { name: /midnight resonance|voices of migration/i }).first().click();
  await expect(page.getByRole("button", { name: /start reading/i })).toBeVisible();
  await page.getByRole("button", { name: /start reading/i }).click();
  await expect(page.getByText(/chapter 1 of/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /^play$/i })).toBeVisible();
});

test("a guest is asked to sign in to save, and the account form creates an account that finishes the save", async ({ page }) => {
  await enterAsGuest(page);
  await page.getByRole("button", { name: /midnight resonance|voices of migration/i }).first().click();
  await page.getByRole("button", { name: /save to library/i }).click();
  await expect(page.getByText("Keep this story")).toBeVisible();
  await page.getByRole("button", { name: "Create free account" }).click();
  await page.getByLabel("Name").fill("Maya");
  await page.getByLabel("Email").fill(`maya-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("Password123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("button", { name: /remove from library/i })).toBeVisible();
});

test("the app is installable on a phone: manifest, icons and the tags a phone reads", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).toBe("/manifest.webmanifest");
  const manifest = await (await request.get(href!)).json();
  expect(manifest).toMatchObject({ short_name: "SEEN", display: "standalone", background_color: "#000000" });
  expect(manifest.orientation).toBe("any");
  for (const icon of manifest.icons) expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
  expect((await request.get("/icons/apple-touch-icon.png")).ok()).toBe(true);
  await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute("content", "yes");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#000000");
  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport).toContain("viewport-fit=cover");
  expect(viewport).not.toMatch(/user-scalable=no|maximum-scale/); // pinch zoom stays on
});

test("it feels like an app on a touch screen: no text selection on the screens, no bounce", async ({ page }) => {
  await page.goto("/");
  const b = await page.evaluate(() => ({ select: getComputedStyle(document.body).userSelect, overscroll: getComputedStyle(document.documentElement).overscrollBehaviorY }));
  expect(b.select).toBe("none");
  expect(b.overscroll).toBe("none");
});
