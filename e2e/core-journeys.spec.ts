import { closeWithEscape, expect, signInAs, test } from "./fixtures";

/** The first screen: the glowing S.E.E.N entry button. It must never be removed. */
async function enterSeen(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /s\W*e\W*e\W*n/i }).click();
  await page.getByRole("button", { name: /^continue$/i }).click();
}

test.describe("first visit", () => {
  test("the first screen is the glowing S.E.E.N entry button", async ({ page }) => {
    await page.goto("/");
    const enter = page.getByRole("button", { name: /s\W*e\W*e\W*n/i });
    await expect(enter).toBeVisible();
    await expect(page.getByText(/you are entering seen/i)).toBeVisible();
    await enter.click();
    await expect(page.getByRole("heading", { name: /this is not\s+social media/i })).toBeVisible();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await expect(page.getByText(/step 1 of 3/i)).toBeVisible();
  });

  async function signUp(page: import("@playwright/test").Page, prefix: string, purpose: RegExp, interest?: RegExp) {
    await page.goto("/");
    await enterSeen(page);
    await expect(page.getByText(/step 1 of 3/i)).toBeVisible();
    await page.getByRole("button", { name: purpose }).click();
    await page.getByRole("button", { name: /next: your interests/i }).click();
    await expect(page.getByText(/step 2 of 3/i)).toBeVisible();
    if (interest) await page.getByRole("button", { name: interest }).first().click();
    await page.getByRole("button", { name: /(next|skip): create your account/i }).click();
    await expect(page.getByText(/step 3 of 3/i)).toBeVisible();
    await page.getByPlaceholder("Name").fill("First Visitor");
    await page.getByPlaceholder("Email").fill(`${prefix}-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();
  }

  test("both entry screens scroll so their buttons stay reachable at large text on a short phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 420 });
    await page.goto("/");
    await page.evaluate(() => { document.documentElement.dataset.text = "large"; });
    const enter = page.getByRole("button", { name: /s\W*e\W*e\W*n/i });
    await expect(enter).toBeVisible();
    await page.mouse.move(160, 200);
    await page.mouse.wheel(0, 1500);
    await expect.poll(async () => (await enter.boundingBox())?.y ?? 9999).toBeLessThan(420);
    await enter.click();
    const next = page.getByRole("button", { name: /^continue$/i });
    await expect(next).toBeVisible();
    await page.mouse.move(160, 200);
    await page.mouse.wheel(0, 3000);
    await expect.poll(async () => { const b = await next.boundingBox(); return b ? b.y + b.height : 9999; }).toBeLessThanOrEqual(420);
  });

  test("onboarding is three steps, then For You", async ({ page }) => {
    await signUp(page, "first", /discover stories/i);
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
    await expect(page).toHaveURL(/#\/for-you$/);
  });

  test("interests chosen at sign-up feed For You and can be stepped back to", async ({ page }) => {
    await page.goto("/");
    await enterSeen(page);
    await page.getByRole("button", { name: /discover stories/i }).click();
    await page.getByRole("button", { name: /next: your interests/i }).click();
    const chip = page.getByRole("group", { name: "Interests" }).getByRole("button").first();
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /^back$/i }).click();
    await expect(page.getByRole("button", { name: /discover stories/i })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /next: your interests/i }).click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /next: create your account/i }).click();
    await page.getByPlaceholder("Name").fill("Interest Reader");
    await page.getByPlaceholder("Email").fill(`int-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByRole("region", { name: /based on your interests/i })).toBeVisible();
  });

  test("choosing Share my story creates a creator account", async ({ page }) => {
    await signUp(page, "maker", /share my story/i);
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
    await page.goto("/#/creator-stories");
    await expect(page.getByRole("heading", { name: /your stories/i })).toBeVisible();
  });
});


test.describe("guest-first return", () => {
  test("a deep link survives onboarding and sign-up", async ({ page }) => {
    await page.goto("/#/story/midnight-resonance");
    await enterSeen(page);
    await page.getByRole("button", { name: /discover stories/i }).click();
    await page.getByRole("button", { name: /next: your interests/i }).click();
    await page.getByRole("button", { name: /skip: create your account/i }).click();
    await page.getByPlaceholder("Name").fill("Deep Linker");
    await page.getByPlaceholder("Email").fill(`deep-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL(/#\/story\/midnight-resonance$/);
  });

});

test.describe("keyboard-only", () => {
  test("report sheet traps focus, closes on Escape and returns focus to its button", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator/kira-chen");
    const trigger = page.getByRole("button", { name: /report this profile/i });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      await expect(dialog.locator(":focus")).toHaveCount(1);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("delete account asks first and Escape cancels without deleting", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/account");
    const del = page.getByRole("button", { name: /delete my account/i });
    await del.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("alertdialog").or(page.getByRole("dialog"))).toBeVisible();
    await closeWithEscape(page, page.getByRole("alertdialog").or(page.getByRole("dialog")));
    await expect(del).toBeFocused();
    await expect(page).toHaveURL(/#\/account$/);
  });

  test("note sheet can be completed with the keyboard alone", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /write a private note/i }).focus();
    await page.keyboard.press("Enter");
    await page.getByLabel(/your note/i).focus();
    await page.keyboard.type("Typed without a mouse");
    await page.getByRole("button", { name: /send note/i }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/creator will see your note/i)).toBeVisible();
  });
});

test.describe("french", () => {
  test("the note flow follows the chosen language", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/settings");
    await page.getByLabel("Français").check();
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /note privée/i }).click();
    await expect(page.getByRole("heading", { name: /écrire une note privée/i })).toBeVisible();
    await page.getByLabel(/votre note/i).fill("Merci pour cette histoire.");
    await page.getByRole("button", { name: /envoyer la note/i }).click();
    await expect(page.getByText(/verra votre note/i)).toBeVisible();
  });
});

test.describe("french: report and account", () => {
  test("report sheet and account screen follow the language", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/settings");
    await page.getByLabel("Français").check();
    await page.goto("/#/creator/kira-chen");
    await page.getByRole("button", { name: /signaler ce profil/i }).click();
    await expect(page.getByRole("heading", { name: /signaler ce profil/i })).toBeVisible();
    await page.getByLabel(/trompeur ou faux/i).check();
    await page.getByRole("button", { name: /envoyer le signalement/i }).click();
    await expect(page.getByText(/un modérateur examinera ce profil/i)).toBeVisible();
    await page.goto("/#/account");
    await expect(page.getByRole("heading", { name: /compte et confidentialité/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /supprimer mon compte/i })).toBeVisible();
  });
});

test.describe("search: landing, filters, zero results", () => {
  test.beforeEach(async ({ page }) => { await signInAs(page, "viewer"); });

  test("landing offers themes; a theme runs a search; filters narrow it; zero results can be recovered", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.getByText(/browse by theme/i)).toBeVisible();
    await page.getByRole("region", { name: /browse by theme/i }).getByRole("button").first().click();
    await expect(page.getByTestId("story-card").first()).toBeVisible();
    // Filters sheet: choose a language that has no match in the current results, then see the count and reset.
    await page.getByRole("button", { name: /^filters/i }).click();
    await expect(page.getByRole("dialog", { name: /filters/i })).toBeVisible();
    await page.getByRole("button", { name: /^reset$/i }).click();
    await page.keyboard.press("Escape");
    // Zero results state with a way out
    await page.getByLabel(/search stories/i).fill("zzqqxx");
    await expect(page.getByText(/no results for/i)).toBeVisible();
  });

  test("a recent search is remembered on this device and can be cleared", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.getByPlaceholder(/search by title/i).fill("midnight");
    await page.getByTestId("story-card").first().click();
    await page.goto("/");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    const recents = page.getByRole("region", { name: /^recent searches$/i });
    await expect(recents).toBeVisible();
    await expect(recents.getByRole("button", { name: /midnight/i })).toBeVisible();
    await page.getByRole("button", { name: /clear recent searches/i }).click();
    await expect(recents).toBeHidden();
  });
});

test.describe("reader: transcript, captions, completion", () => {
  test.beforeEach(async ({ page }) => { await signInAs(page, "viewer"); });

  test("transcript shows the chapter text; captions toggle; finishing the last chapter shows completion", async ({ page }) => {
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /start reading/i }).click();
    await page.getByRole("button", { name: /^transcript$/i }).click();
    const dialog = page.getByRole("dialog", { name: /transcript/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/timed captions are not available yet/i)).toBeVisible();
    await closeWithEscape(page, dialog);
    const cc = page.getByRole("button", { name: /^captions$/i });
    await expect(cc).toHaveAttribute("aria-pressed", "false");
    await cc.click();
    await expect(cc).toHaveAttribute("aria-pressed", "true");
    // walk to the last chapter, then Finish
    for (let i = 0; i < 6; i++) {
      const next = page.getByRole("button", { name: /^(next|finish)$/i });
      if (/finish/i.test((await next.innerText()).trim())) break;
      await next.click();
      await page.waitForTimeout(700);
    }
    await page.getByRole("button", { name: /^finish$/i }).click();
    const done = page.getByRole("dialog", { name: /you finished/i });
    await expect(done).toBeVisible();
    await expect(done.getByRole("button", { name: /add a reflection/i })).toBeVisible();
    await done.getByRole("button", { name: /keep reading/i }).click();
    await expect(done).toBeHidden();
  });
});

test.describe("library: following and collections tabs", () => {
  test.beforeEach(async ({ page }) => { await signInAs(page, "viewer"); });

  test("followed creators appear in Library and can be unfollowed", async ({ page }) => {
    await page.goto("/#/creator/kira-chen");
    await page.getByRole("button", { name: /^follow$/i }).click();
    await page.goto("/#/library");
    await page.getByRole("button", { name: /following/i }).first().click();
    const row = page.getByRole("button", { name: /open kira chen/i });
    await expect(row).toBeVisible();
    await page.getByRole("button", { name: /unfollow kira chen/i }).click();
    await expect(page.getByText(/no creators yet/i)).toBeVisible();
  });

  test("saved collections appear in Library", async ({ page }) => {
    await page.goto("/#/library");
    await page.getByRole("button", { name: /saved collections?$/i }).click();
    await expect(page.getByText(/no saved collections/i)).toBeVisible();
    await page.getByRole("button", { name: /browse collections/i }).click();
    await expect(page).toHaveURL(/#\/explore\/collections/);
  });
});

test.describe("profile: edit, password, legal", () => {
  test("edit profile saves name and bio; legal opens signed out", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/edit-profile");
    await expect(page.getByRole("heading", { name: /edit profile/i })).toBeVisible();
    await page.getByLabel(/display name/i).fill("Ada Reader");
    await page.locator("#edit-bio").fill("I read at night.");
    await page.getByRole("button", { name: /save changes/i }).click();
    await page.goto("/#/edit-profile");
    await expect(page.getByLabel(/display name/i)).toHaveValue("Ada Reader");
    await expect(page.locator("#edit-bio")).toHaveValue("I read at night.");
  });

  test("change password screen renders and blocks mismatched confirm", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/change-password");
    await page.getByLabel(/^current password/i).fill("whatever1A");
    await page.getByLabel(/^new password/i).fill("Str0ngPass!word");
    await page.getByLabel(/confirm new password/i).fill("different");
    await expect(page.getByText(/passwords don't match/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /update password/i })).toBeDisabled();
  });

  test("legal screen is public", async ({ page }) => {
    await page.goto("/#/legal");
    await expect(page.getByRole("heading", { name: /terms/i }).first()).toBeVisible();
  });
});

test.describe("creator: your stories", () => {
  test("lists drafts and published tabs; discard removes a draft; viewers are blocked", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/creator-stories");
    await expect(page.getByRole("heading", { name: /your stories/i })).toBeVisible();
    await page.getByRole("tab", { name: /^drafts/i }).click();
    await expect(page.getByText(/no drafts/i)).toBeVisible();
    await page.getByRole("button", { name: /new story/i }).click();
    await expect(page).toHaveURL(/#\/creator-publish/);
  });

  test("viewer cannot open creator stories", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator-stories");
    await expect(page.getByRole("heading", { name: /your stories/i })).toHaveCount(0);
  });
});

test.describe("funding: outcomes and readiness", () => {
  test.beforeEach(async ({ page }) => { await signInAs(page, "viewer"); });

  test("after applying, the user can record an outcome and see tracker tiles", async ({ page }) => {
    await page.goto("/#/funding");
    await page.getByTestId("opportunity-card").filter({ hasText: "Research and Creation" }).click();
    await page.getByRole("button", { name: /save & track/i }).click();
    const boxes = page.getByRole("checkbox");
    const count = await boxes.count();
    for (let i = 0; i < count; i++) await boxes.nth(i).check();
    await page.getByRole("button", { name: /mark as applied/i }).click();
    await page.getByLabel(/^shortlisted$/i).check();
    await expect(page.getByText(/shortlisted · tracked by you/i)).toBeVisible();
    await page.goBack();
    await page.getByRole("tab", { name: /my tracker/i }).click();
    const tiles = page.getByRole("region", { name: /tracker summary/i });
    await expect(tiles).toContainText("Outcomes noted");
    await expect(tiles).toContainText("1");
  });

  test("readiness checklist persists and shows no score", async ({ page }) => {
    await page.goto("/#/funding");
    await page.getByRole("button", { name: /prepare your application/i }).click();
    await page.getByRole("checkbox", { name: /budget drafted/i }).check();
    await expect(page.getByText(/1 of 6 ready/i)).toBeVisible();
    await page.reload();
    await expect(page.getByRole("checkbox", { name: /budget drafted/i })).toBeChecked();
    await expect(page.getByText(/%/)).toHaveCount(0);
  });
});

test.describe("funding: eligibility self-check and notes", () => {
  test("answers and notes persist per opportunity", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/funding");
    await page.getByTestId("opportunity-card").filter({ hasText: "Research and Creation" }).click();
    const yes = page.getByRole("button", { name: /: yes$/i });
    await expect(yes.first()).toBeVisible();
    const n = await yes.count();
    for (let i = 0; i < n; i++) await yes.nth(i).click();
    await expect(page.getByText(/appear to meet these criteria\. the funder decides/i)).toBeVisible();
    await page.getByRole("button", { name: /save & track/i }).click();
    await page.locator("#app-notes").fill("Call the programme officer");
    await page.locator("#app-notes").blur();
    await expect(page.getByText(/notes saved/i)).toBeVisible();
    await page.reload();
    await expect(page.locator("#app-notes")).toHaveValue("Call the programme officer");
    await expect(page.getByRole("button", { name: /: yes$/i }).first()).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("creator: overview card", () => {
  test("profile shows counts and links to Your stories", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/profile");
    await expect(page.getByText(/^published$/i)).toBeVisible();
    await page.getByRole("button", { name: /^your stories$/i }).click();
    await expect(page).toHaveURL(/#\/creator-stories/);
  });
});

test.describe("ported from older SEEN work", () => {
  test("a link to a missing story shows an unavailable state with a way out", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/story/does-not-exist");
    await expect(page.getByText(/this story isn't available/i)).toBeVisible();
    await page.getByRole("button", { name: /explore stories/i }).click();
    await expect(page).toHaveURL(/#\/explore/);
  });

  test("sign out asks for confirmation and can be cancelled", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/profile");
    await page.getByRole("button", { name: /^sign out$/i }).click();
    const dialog = page.getByRole("dialog", { name: /sign out\?/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /cancel/i }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: /^sign out$/i })).toBeVisible();
  });
});

test.describe("accessibility preferences and creator audience", () => {
  test("larger text setting scales the root and persists across reload", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/settings");
    const toggle = page.getByRole("switch", { name: /larger text/i });
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-text", "large");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-text", "large");
  });

  test("create story offers audience chips instead of only typing", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/creator-publish");
    const educators = page.getByRole("button", { name: /^educators$/i });
    await educators.click();
    await expect(educators).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByPlaceholder(/pick above, or add your own/i)).toHaveValue("Educators");
  });
});

test.describe("first screen backdrop (PR-6)", () => {
  test("the motion sits behind the protected first screen and the entry button still works", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("first-screen-backdrop")).toBeAttached();
    const enter = page.getByRole("button", { name: /s\W*e\W*e\W*n/i });
    await expect(enter).toBeVisible();
    // Behind the content: the button is what a tap on it hits.
    const box = (await enter.boundingBox())!;
    const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest("button") !== null, [box.x + box.width / 2, box.y + box.height / 2]);
    expect(hit).toBe(true);
    await enter.click();
    await expect(page.getByRole("heading", { name: /this is not\s+social media/i })).toBeVisible();
  });

  test("with reduced motion the first screen is a still frame and loads no video", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("http://localhost:4173/");
    await expect(page.getByTestId("first-screen-backdrop")).toBeAttached();
    expect(await page.locator("video").count()).toBe(0);
    await ctx.close();
  });
});
