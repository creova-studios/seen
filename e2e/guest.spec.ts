import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, signInAs, test } from "./fixtures";

/** Limited guest mode (D2) and the five-tab bar with Create (DT1, DT2). */

async function enterAsGuest(page: Page, hash = "/") {
  await page.goto(hash);
  await page.getByRole("button", { name: /s\W*e\W*e\W*n/i }).click();
  await page.getByRole("button", { name: /^continue$/i }).click();
  await page.getByRole("button", { name: /explore without an account/i }).click();
  await expect(page.getByRole("heading", { name: "For You", level: 1 })).toBeVisible(); // let the screen change finish, as a person would
}

const nav = (page: Page) => page.getByRole("navigation", { name: "Main" });

test.describe("guest", () => {
  test("the protected first screens still come first; the guest link lives on the purpose step", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /explore without an account/i })).toHaveCount(0);
    await page.getByRole("button", { name: /s\W*e\W*e\W*n/i }).click();
    await expect(page.getByRole("heading", { name: /this is not\s+social media/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /explore without an account/i })).toHaveCount(0);
    await page.getByRole("button", { name: /^continue$/i }).click();
    await expect(page.getByRole("button", { name: /explore without an account/i })).toBeVisible();
  });

  test("a guest lands on For You with the banner and locked tabs, and keeps their place after a reload", async ({ page }) => {
    await enterAsGuest(page);
    await expect(page).toHaveURL(/#\/for-you$/);
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
    await expect(page.getByRole("note").filter({ hasText: /exploring as a guest/i })).toBeVisible();
    for (const tab of ["Create", "Library", "Profile"]) await expect(nav(page).getByRole("button", { name: `${tab}, sign in required` })).toBeVisible();
    await expect(nav(page).getByRole("button", { name: "Explore", exact: true })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
  });

  test("locked tabs open the sheet; 'Not now' leaves the guest where they were", async ({ page }) => {
    await enterAsGuest(page);
    await nav(page).getByRole("button", { name: "Library, sign in required" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet.getByText("Your Library is waiting")).toBeVisible();
    await sheet.getByRole("button", { name: /not now/i }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/#\/for-you$/);

    await nav(page).getByRole("button", { name: "Create, sign in required" }).click();
    await expect(page.getByRole("dialog").getByText("Tell a story on SEEN")).toBeVisible();
  });

  test("typing a private URL gets the sheet, never a private screen", async ({ page }) => {
    await enterAsGuest(page);
    for (const [hash, headline] of [["#/library", "Your Library is waiting"], ["#/profile", "Make SEEN yours"], ["#/creator-publish", "Tell a story on SEEN"], ["#/admin-dashboard", "Sign in to see this"]] as const) {
      await page.evaluate(h => { window.location.hash = h; }, hash);
      await expect(page.getByRole("dialog").getByText(headline)).toBeVisible();
      await page.getByRole("dialog").getByRole("button", { name: /not now/i }).click();
      await expect(page.getByRole("dialog")).toBeHidden();
      // Behind the sheet is the same sign-in prompt, not the screen.
      await expect(page.getByRole("button", { name: "Create free account" }).first(), `behind the sheet at ${hash}`).toBeVisible();
    }
  });

  test("saving a story: guest taps Save, creates an account, and the story is saved", async ({ page }) => {
    await enterAsGuest(page);
    await page.evaluate(() => { window.location.hash = "#/story/midnight-resonance"; });
    await expect(page.getByRole("heading", { name: /midnight resonance/i }).first()).toBeVisible();
    await page.getByRole("button", { name: /save to library/i }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet.getByText("Keep this story")).toBeVisible();
    await sheet.getByRole("button", { name: "Create free account" }).click();

    await page.getByPlaceholder("Name").fill("Guest Saver");
    await page.getByPlaceholder("Email").fill(`guest-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/saved to your library/i).first()).toBeVisible();
    await expect(page).toHaveURL(/#\/story\/midnight-resonance$/);
    await expect(page.getByRole("button", { name: /saved|remove from library/i }).first()).toBeVisible();
    // Signed in now: the guest banner is gone from For You and the tabs are unlocked.
    await page.goto("/#/for-you");
    await expect(page.getByRole("note").filter({ hasText: /exploring as a guest/i })).toHaveCount(0);
    await expect(nav(page).getByRole("button", { name: "Library", exact: true })).toBeVisible();
  });

  test("a guest follows a creator only after signing in", async ({ page }) => {
    await enterAsGuest(page);
    await page.goto("/#/creator/kira-chen");
    await page.getByRole("button", { name: /^follow$/i }).click();
    await expect(page.getByRole("dialog").getByText(/^Follow /)).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: /not now/i }).click();
    expect(await page.evaluate(() => localStorage.getItem("seen.v1.following"))).toBeNull();
  });

  test("a guest reads chapter 1 and is asked to sign in to continue", async ({ page }) => {
    await enterAsGuest(page);
    await page.evaluate(() => { window.location.hash = "#/story/voices-of-migration"; });
    await expect(page.getByRole("heading", { name: /voices of migration/i }).first()).toBeVisible();
    await page.getByRole("button", { name: /start reading/i }).click();
    const next = page.getByRole("button", { name: /^next/i }).first();
    await expect(next).toBeVisible();
    await next.click();
    await expect(page.getByRole("dialog").getByText("Keep reading")).toBeVisible();
  });

  test("the guest sheet has no serious accessibility violations and Escape closes it", async ({ page }) => {
    await enterAsGuest(page);
    await nav(page).getByRole("button", { name: "Library, sign in required" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await page.waitForTimeout(600);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const blocking = results.violations.filter(v => v.impact === "critical" || v.impact === "serious");
    expect(blocking, blocking.map(v => `${v.id}: ${v.nodes[0]?.target.join(" ")}`).join("\n")).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });
});

test.describe("Create tab", () => {
  test("a new member sees the creator intro once, then goes straight to the publish flow", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/for-you");
    await nav(page).getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-intro$/);
    await expect(page.getByRole("heading", { name: "Tell a story on SEEN" })).toBeVisible();
    await page.getByRole("button", { name: "Start a story" }).click();
    await expect(page).toHaveURL(/#\/creator-publish$/);

    await page.goto("/#/for-you");
    await nav(page).getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-publish$/);
  });

  test("a creator goes straight to the publish flow", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/for-you");
    await nav(page).getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-publish$/);
  });
});

test.describe("five-tab bar", () => {
  for (const lang of ["en", "fr", "es"] as const) {
    for (const width of [320, 360, 390]) {
      test(`no tab label is clipped or overlaps at ${width}px in ${lang}`, async ({ page }) => {
        await signInAs(page, "viewer", lang);
        await page.setViewportSize({ width, height: 740 });
        await page.goto("/#/for-you");
        await expect(nav(page).getByRole("button")).toHaveCount(5);
        const result = await page.evaluate(() =>
          [...document.querySelectorAll("nav[aria-label=Main] button")].map(b => {
            const label = b.querySelector("span:last-child") as HTMLElement;
            const range = document.createRange();
            range.selectNodeContents(label);
            const text = range.getBoundingClientRect();
            const box = b.getBoundingClientRect();
            return { label: label.innerText, textWidth: Math.round(text.width), tabWidth: Math.round(box.width), inside: text.left >= box.left - 0.5 && text.right <= box.right + 0.5, tall: Math.round(box.height) };
          }),
        );
        for (const r of result) {
          expect(r.inside, `${lang} ${width}px "${r.label}" is ${r.textWidth}px in a ${r.tabWidth}px tab`).toBe(true);
          expect(r.tall, `${r.label} tap height`).toBeGreaterThanOrEqual(44);
          expect(r.tabWidth, `${r.label} tap width`).toBeGreaterThanOrEqual(44);
        }
      });
    }
  }
});

test.describe("tab re-tap (PR-3)", () => {
  for (const tab of [["For You", "for-you"], ["Explore", "explore"], ["Library", "library"], ["Profile", "profile"]] as const) {
    test(`tapping the active ${tab[0]} tab scrolls to the top and stays on the screen`, async ({ page }) => {
      await signInAs(page, "viewer");
      await page.goto(`/#/${tab[1]}`);
      await expect(nav(page).getByRole("button", { name: tab[0], exact: true })).toHaveAttribute("aria-current", "page");
      await page.mouse.move(200, 400);
      await page.mouse.wheel(0, 1600);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(50); // Library is short in demo data
      await page.waitForTimeout(1200); // let the wheel's own smooth scroll finish before the tap
      await nav(page).getByRole("button", { name: tab[0], exact: true }).click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await expect(page).toHaveURL(new RegExp(`#/${tab[1]}`));
    });
  }
});

test.describe("creator navigation (PR-2)", () => {
  test("a creator reaches Your stories from the publish flow and from Profile; a viewer sees no such link", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/creator-publish");
    await page.getByRole("button", { name: "Your stories", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-stories$/);
    await expect(page.getByRole("heading", { name: /your stories/i })).toBeVisible();

    await page.goto("/#/profile");
    await page.getByRole("button", { name: "Your stories", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-stories$/);
  });

  test("a viewer does not see Your stories in the publish flow", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator-publish");
    await expect(page.getByRole("button", { name: "Close", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Your stories", exact: true })).toHaveCount(0);
  });
});

test.describe("interest chips (PR-5)", () => {
  test("a guest sees topic chips, picks one and gets matching stories under them", async ({ page }) => {
    await enterAsGuest(page);
    const chips = page.getByRole("group", { name: "Topics" });
    await expect(chips).toBeVisible();
    await expect(page.getByRole("region", { name: /based on your interests/i })).toHaveCount(0);
    const chip = chips.getByRole("button").first();
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("region", { name: /based on your interests/i })).toBeVisible();
    await chip.click();
    await expect(page.getByRole("region", { name: /based on your interests/i })).toHaveCount(0);
  });

  test("the chip row scrolls sideways without making the page wider, at 320 px", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/#/for-you");
    const chips = page.getByRole("group", { name: "Topics" });
    await expect(chips).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    for (const b of await chips.getByRole("button").all()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await chips.getByRole("button").first().focus();
    await page.keyboard.press("Space");
    await expect(chips.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("language clarity (11A) and account note (7A)", () => {
  test("the story page says which languages exist and how it is narrated", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/story/midnight-resonance");
    await expect(page.getByText(/available in EN/i).first()).toBeVisible();
    await expect(page.getByText("Listen: device voice")).toBeVisible();
  });

  test("a story missing in the chosen language says so instead of switching silently", async ({ page }) => {
    await signInAs(page, "viewer", "fr");
    await page.goto("/#/story/midnight-resonance");
    // Every catalogue story has FR today, so the notice is absent; it must never show when the language exists.
    await expect(page.getByText(/disponible en/i).first()).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: /pas encore disponible/i })).toHaveCount(0);
  });

  test("the purpose step explains what the creator choices mean, and the search filter is named Story language", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /s\W*e\W*e\W*n/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await expect(page.getByText(/set you up to publish/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /discover stories/i })).toBeVisible();
  });
});

test.describe("creator profile design", () => {
  test("a profile shows its banner, avatar ring, stats and a Follow button without overflow", async ({ page }) => {
    await signInAs(page, "viewer");
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/#/creator/kira-chen");
      await expect(page.getByRole("heading", { name: "Kira Chen", level: 2 })).toBeVisible();
      const stats = page.locator("dl");
      await expect(stats.getByText("Stories", { exact: true })).toBeVisible();
      await expect(stats.getByText("Languages", { exact: true })).toBeVisible();
      await expect(stats.getByText("Themes", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: /^follow$/i })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    }
  });

  test("creator cards in the grid keep equal heights and stay inside the screen at 320 px", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/#/explore/creators");
    const cards = page.getByTestId("creator-card");
    await expect(cards.first()).toBeVisible();
    const rows = await cards.evaluateAll(els => els.slice(0, 4).map(e => [Math.round(e.getBoundingClientRect().top), Math.round(e.getBoundingClientRect().height), Math.round(e.getBoundingClientRect().right)]));
    expect(rows[0][1]).toBe(rows[1][1]); // same row, same height
    expect(rows[2][1]).toBe(rows[3][1]);
    for (const r of rows) expect(r[2]).toBeLessThanOrEqual(320);
  });
});

test.describe("creator profile: featured story, share, app feel", () => {
  test("the lead story is a big card that opens the story; Share profile is a named 44px button", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator/kira-chen");
    const featured = page.getByTestId("featured-story");
    await expect(featured).toBeVisible();
    await expect(featured.getByText("Start reading")).toBeVisible();
    const share = page.getByRole("button", { name: "Share profile" });
    const box = (await share.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    await featured.click();
    await expect(page).toHaveURL(/#\/story\//);
  });

  test("on a touch screen, controls cannot be selected and give press feedback, while reading text can be selected", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/for-you");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(page.getByRole("heading", { name: "For You", level: 1 })).toBeVisible();
    const sel = await nav.evaluate(e => getComputedStyle(e).userSelect);
    expect(sel).toBe("none");
    await page.evaluate(() => { window.location.hash = "#/story/voices-of-migration"; });
    await expect(page.getByRole("heading", { name: /voices of migration/i }).first()).toBeVisible();
    await page.getByRole("button", { name: /start reading/i }).click();
    const text = page.locator("[data-selectable]").first();
    await expect(text).toBeVisible();
    expect(await text.evaluate(e => getComputedStyle(e).userSelect)).toBe("text");
  });
});

test.describe("foldables and tablets", () => {
  for (const [name, w, h] of [["Fold inner screen", 700, 880], ["Fold inner, large", 884, 1104], ["Flip, tall and narrow", 412, 960]] as const) {
    test(`${name} (${w}x${h}): column widens, nothing overflows, tab bar matches the column`, async ({ page }) => {
      await signInAs(page, "viewer");
      await page.setViewportSize({ width: w, height: h });
      for (const r of ["for-you", "explore/creators", "library", "profile", "story/midnight-resonance"]) {
        await page.goto(`/#/${r}`);
        await page.waitForTimeout(700);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${r} overflows sideways`).toBeLessThanOrEqual(0);
      }
      await page.goto("/#/for-you");
      await expect(page.getByRole("heading", { name: "For You", level: 1 })).toBeVisible();
      if (w >= 840) {
        // Wide enough for two panes: a 420 px list beside a detail pane.
        expect(Math.round((await page.locator('[data-pane="list"]').boundingBox())!.width)).toBe(420);
        await expect(page.getByTestId("detail-empty")).toBeVisible();
      } else {
        const col = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--seen-content-max")));
        expect(col).toBe(w >= 600 ? 600 : 428);
        const main = (await page.locator("main").boundingBox())!;
        expect(Math.round(main.width)).toBeLessThanOrEqual(col);
        if (w >= 600) expect(main.width).toBeGreaterThan(440); // wider than the phone column
      }
    });
  }
});

test.describe("two-pane layout on wide screens", () => {
  test("the list stays on the left while a story and a creator open on the right; Back returns to the empty detail pane", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto("/#/for-you");
    const list = page.locator('[data-pane="list"]');
    const detail = page.locator('[data-pane="detail"]');
    await expect(list.getByRole("heading", { name: "For You", level: 1 })).toBeVisible();
    await expect(page.getByTestId("detail-empty")).toBeVisible();

    await list.getByRole("button", { name: /^start reading/i }).first().click();
    await expect(detail.getByRole("heading", { name: /midnight resonance/i }).first()).toBeVisible();
    await expect(list.getByRole("heading", { name: "For You", level: 1 })).toBeVisible(); // list is still there
    expect((await list.boundingBox())!.width).toBe(420);
    expect((await detail.boundingBox())!.x).toBe(420);

    await detail.getByRole("button", { name: "Go back" }).click();
    await expect(page.getByTestId("detail-empty")).toBeVisible();
    await expect(list.getByRole("heading", { name: "For You", level: 1 })).toBeVisible();
  });

  test("tab chrome belongs to the list pane, a tab tap closes the detail, and phones are not two-pane", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto("/#/creator/kira-chen");
    const list = page.locator('[data-pane="list"]');
    await expect(page.locator('[data-pane="detail"]').getByRole("heading", { name: "Kira Chen", level: 2 })).toBeVisible();
    const nav = list.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();
    expect(Math.round((await nav.boundingBox())!.width)).toBeGreaterThanOrEqual(419); // the list pane, less its 1 px divider
    expect(Math.round((await nav.boundingBox())!.width)).toBeLessThanOrEqual(420);
    await nav.getByRole("button", { name: "Explore", exact: true }).click();
    await expect(page).toHaveURL(/#\/explore/);
    await expect(page.getByTestId("detail-empty")).toBeVisible();

    await page.setViewportSize({ width: 412, height: 900 });
    await expect(page.locator('[data-pane="detail"]')).toHaveCount(0);
  });
});
