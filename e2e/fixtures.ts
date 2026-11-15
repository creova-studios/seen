import { test as base, expect, type Locator, type Page } from "@playwright/test";

/**
 * Signs a seeded demo account in by writing the same localStorage records the
 * app's local auth store uses. Only for skipping the (separately tested)
 * onboarding animation; authorization still runs through the app's own guards.
 */
export async function signInAs(page: Page, role: "viewer" | "creator" | "moderator" | "admin", language: "en" | "fr" | "es" = "en") {
  await page.addInitScript(([r, lang]) => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    const id = `user_e2e_${r}`;
    const db = JSON.parse(localStorage.getItem("seenos_users_db") || "{}");
    db[id] = { id, email: `${r}@e2e.test`, name: `E2E ${r}`, role: r, language: lang, intent: "explore" };
    localStorage.setItem("seenos_users_db", JSON.stringify(db));
    localStorage.setItem("seenos_auth_session", JSON.stringify({ accessToken: "tok_e2e", userId: id }));
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("hasEnteredSEEN", "true");
  }, [role, language] as const);
}

/**
 * Presses Escape until the dialog closes. The dialog library only starts listening for Escape a few
 * milliseconds after a dialog opens, so a key pressed in that window can be ignored; pressing it again
 * is what a person would do. It still fails if Escape never closes the dialog.
 */
export async function closeWithEscape(page: Page, dialog: Locator) {
  await expect(async () => {
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 750 });
  }).toPass({ timeout: 10_000 });
}

export const test = base;
export { expect };
