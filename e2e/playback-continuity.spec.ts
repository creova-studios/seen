import { expect, signInAs, test, type Page } from "./fixtures";

/**
 * Regression contract for tester feedback #2 ("audio isn't seamless"): once narration is playing,
 * moving between tabs and scrolling must not restart it, stop it, or create a second audio element.
 *
 * Real audio, not a mock: the chapter already asks for /media/narration/maria-interview.mp3 (the repo ships no
 * audio files, so it would 404 and fall back to the device voice). The test serves a generated tone at that URL
 * and the app's own <audio> element plays it. The tone is built here, so nothing is committed and it is original.
 * It proves playback continuity in Chromium only; it says nothing about narration quality, and nothing about iOS
 * lock-screen or background playback (that needs a real iPhone).
 */

/** Mono 16-bit 8 kHz WAV of a quiet 440 Hz tone. */
function toneWav(seconds: number, rate = 8000): Buffer {
  const samples = seconds * rate;
  const data = Buffer.alloc(samples * 2);
  for (let i = 0; i < samples; i++) data.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 440 * i) / rate) * 3000), i * 2);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); // PCM
  h.writeUInt16LE(1, 22); // mono
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

type AudioState = { count: number; paused: boolean; time: number; src: string };

/** Observes which media elements the app asked to play; it does not replace or fake any of them. */
async function observeAudio(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __seenAudio: Set<HTMLMediaElement> };
    w.__seenAudio = new Set();
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      w.__seenAudio.add(this);
      return play.call(this);
    };
  });
}

async function audioState(page: Page): Promise<AudioState> {
  return page.evaluate(() => {
    const els = [...(window as unknown as { __seenAudio: Set<HTMLMediaElement> }).__seenAudio];
    const e = els[0];
    return { count: els.length, paused: e ? e.paused : true, time: e ? e.currentTime : 0, src: e ? e.currentSrc : "" };
  });
}

test("narration keeps playing as one audio element across tabs, scrolling and Back", async ({ page }) => {
  await observeAudio(page);
  await page.route("**/media/narration/maria-interview.mp3", route =>
    route.fulfill({ status: 200, contentType: "audio/wav", headers: { "Accept-Ranges": "bytes" }, body: toneWav(60) }),
  );

  await signInAs(page, "viewer");
  await page.goto("/#/story/voices-of-migration");
  await page.getByRole("button", { name: /start reading/i }).click();
  await page.getByRole("button", { name: "Play", exact: true }).first().click();

  // Real playback started: the clock advances on the recorded file (not the device voice).
  await expect.poll(async () => (await audioState(page)).time, { timeout: 15_000 }).toBeGreaterThan(1);
  const started = await audioState(page);
  expect(started.src).toContain("maria-interview");
  expect(started.count).toBe(1);

  // Leave the reader, then move around the app.
  await page.getByRole("button", { name: "Close", exact: true }).first().click();
  let last = started.time;
  const check = async (where: string) => {
    const s = await audioState(page);
    expect(s.count, `${where}: still one audio element`).toBe(1);
    expect(s.paused, `${where}: still playing`).toBe(false);
    expect(s.time, `${where}: position never goes backwards`).toBeGreaterThanOrEqual(last);
    last = s.time;
    await expect(page.getByRole("button", { name: /open player/i }), `${where}: mini-player visible`).toBeVisible();
  };

  for (const tab of ["For You", "Explore", "Library", "Profile", "For You"]) {
    await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: tab, exact: true }).click();
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(500);
    await check(`${tab} after scrolling`);
  }

  await page.goBack();
  await page.waitForTimeout(500);
  await check("after browser Back");

  // And it really kept going the whole time.
  await expect.poll(async () => (await audioState(page)).time, { timeout: 15_000 }).toBeGreaterThan(started.time + 2);
  expect((await audioState(page)).count).toBe(1);
});

test("at the end of a chapter, Next chapter is offered and nothing advances by itself", async ({ page }) => {
  await page.route("**/media/narration/maria-interview.mp3", route =>
    route.fulfill({ status: 200, contentType: "audio/wav", headers: { "Accept-Ranges": "bytes" }, body: toneWav(2) }),
  );
  await signInAs(page, "viewer");
  await page.goto("/#/story/voices-of-migration");
  await page.getByRole("button", { name: /start reading/i }).click();
  const prev = page.getByRole("button", { name: /^prev/i });
  await expect(prev).toBeDisabled(); // chapter 1
  await page.getByRole("button", { name: "Play", exact: true }).first().click();

  const next = page.getByRole("button", { name: "Next chapter", exact: true });
  await expect(next).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  await expect(prev).toBeDisabled(); // still chapter 1: it did not advance on its own

  await next.click();
  await expect(prev).toBeEnabled();
  await expect(next).toHaveCount(0);
});

test("while narration plays, the spoken sentence is lit and followed; scrolling away pauses following until asked", async ({ page }) => {
  await page.route("**/media/narration/maria-interview.mp3", route =>
    route.fulfill({ status: 200, contentType: "audio/wav", headers: { "Accept-Ranges": "bytes" }, body: toneWav(12) }),
  );
  await signInAs(page, "viewer");
  await page.setViewportSize({ width: 390, height: 640 });
  await page.goto("/#/story/voices-of-migration");
  await page.getByRole("button", { name: /start reading/i }).click();
  const lit = page.locator("[data-current=true]");
  await expect(lit).toHaveCount(0); // nothing is lit before playback

  await page.getByRole("button", { name: "Play", exact: true }).first().click();
  await expect(lit).toHaveCount(1, { timeout: 15_000 });
  const first = await lit.textContent();
  await expect.poll(async () => lit.textContent(), { timeout: 20_000 }).not.toBe(first); // it moves on as the audio plays

  // The lit sentence stays inside the visible text area.
  const inView = await page.evaluate(() => {
    const el = document.querySelector("[data-current=true]")!.getBoundingClientRect();
    return el.top >= 0 && el.bottom <= window.innerHeight;
  });
  expect(inView).toBe(true);

  // Scrolling away hands control to the reader, with a way back.
  await page.mouse.move(200, 250);
  await page.mouse.wheel(0, -400);
  const resume = page.getByRole("button", { name: "Follow along" });
  await expect(resume).toBeVisible();
  await resume.click();
  await expect(resume).toHaveCount(0);
});
