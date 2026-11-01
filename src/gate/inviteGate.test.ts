import { webcrypto } from "node:crypto";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import middleware from "../../middleware";
import { COOKIE_NAME, MIN_CODE_LENGTH, continueResponse, decide, gatePageHtml, isOpenPath, parseCodes, pickLang, readCookie, safeEqual, sha256Hex } from "./inviteGate";

// The shared test setup runs in jsdom; the gate runs on the server, which has Node's Web Crypto.
beforeAll(() => { vi.stubGlobal("crypto", webcrypto); });

const CODE = "friends-oct-7QmX2";
const OTHER = "partner-abc-9Zk41";
const base = "https://demo.example.test";

describe("parseCodes", () => {
  it("splits on commas and newlines, trims, de-duplicates", () => {
    expect(parseCodes(` ${CODE} , ${OTHER}\n${CODE}`)).toEqual([CODE, OTHER]);
  });
  it("ignores codes shorter than the minimum so a typo cannot make a guessable gate", () => {
    expect(parseCodes(`abc, ${"x".repeat(MIN_CODE_LENGTH - 1)}, ${CODE}`)).toEqual([CODE]);
  });
  it("returns nothing for empty or missing values", () => {
    expect(parseCodes(undefined)).toEqual([]);
    expect(parseCodes("")).toEqual([]);
    expect(parseCodes(" , \n ")).toEqual([]);
  });
});

describe("decide", () => {
  it("is OFF (allows everything) when no codes are configured", async () => {
    expect(await decide({ url: `${base}/`, codes: [] })).toEqual({ action: "allow" });
  });

  it("denies a visitor with no invite and no cookie, in their language", async () => {
    expect(await decide({ url: `${base}/`, codes: [CODE], acceptLanguage: "fr-CA,fr;q=0.9" })).toEqual({ action: "deny", reason: "no-invite", lang: "fr" });
    expect((await decide({ url: `${base}/`, codes: [CODE], acceptLanguage: "es-MX" }))).toMatchObject({ lang: "es" });
    expect((await decide({ url: `${base}/`, codes: [CODE], acceptLanguage: "de" }))).toMatchObject({ lang: "en" });
  });

  it("accepts a valid invite link: sets a cookie holding only the hash and strips the code from the URL", async () => {
    const d = await decide({ url: `${base}/?invite=${CODE}&utm=x#/explore`, codes: [CODE, OTHER] });
    expect(d.action).toBe("set-cookie");
    if (d.action !== "set-cookie") return;
    expect(d.location).toBe("/?utm=x");
    expect(d.location).not.toContain(CODE);
    expect(d.cookie).toContain(`${COOKIE_NAME}=${await sha256Hex(CODE)}`);
    expect(d.cookie).not.toContain(CODE);
    for (const attr of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/", "Max-Age=2592000"]) expect(d.cookie).toContain(attr);
  });

  it("trims whitespace around an offered code (pasted links)", async () => {
    expect((await decide({ url: `${base}/?invite=%20${CODE}%20`, codes: [CODE] })).action).toBe("set-cookie");
  });

  it("rejects a wrong or partial code", async () => {
    expect(await decide({ url: `${base}/?invite=${CODE.slice(0, -1)}`, codes: [CODE] })).toMatchObject({ action: "deny", reason: "bad-invite" });
    expect(await decide({ url: `${base}/?invite=`, codes: [CODE] })).toMatchObject({ action: "deny", reason: "bad-invite" });
  });

  it("lets a returning visitor in with the cookie, and a second code works too", async () => {
    const cookieHeader = `a=b; ${COOKIE_NAME}=${await sha256Hex(OTHER)}; c=d`;
    expect(await decide({ url: `${base}/#/library`, cookieHeader, codes: [CODE, OTHER] })).toEqual({ action: "allow" });
  });

  it("rejects a forged cookie, including the raw code and another visitor's guess", async () => {
    expect((await decide({ url: `${base}/`, cookieHeader: `${COOKIE_NAME}=${CODE}`, codes: [CODE] })).action).toBe("deny");
    expect((await decide({ url: `${base}/`, cookieHeader: `${COOKIE_NAME}=${"0".repeat(64)}`, codes: [CODE] })).action).toBe("deny");
  });

  it("revokes when a code is removed from the variable", async () => {
    const cookieHeader = `${COOKIE_NAME}=${await sha256Hex(CODE)}`;
    expect((await decide({ url: `${base}/`, cookieHeader, codes: [OTHER] })).action).toBe("deny");
  });

  it("a bad invite does not lock out someone who already has a valid cookie", async () => {
    const cookieHeader = `${COOKIE_NAME}=${await sha256Hex(CODE)}`;
    expect((await decide({ url: `${base}/?invite=nope-nope-nope`, cookieHeader, codes: [CODE] })).action).toBe("allow");
  });

  it("keeps share cards and browser icon requests open, and gates everything else including scripts", async () => {
    for (const p of ["/s/abc123", "/api/share-preview", "/robots.txt", "/icons/icon-192.png", "/manifest.webmanifest", "/favicon.ico"]) {
      expect((await decide({ url: `${base}${p}`, codes: [CODE] })).action, p).toBe("allow");
    }
    for (const p of ["/", "/index-abc.js", "/chunks/react-vendor.js", "/assets/x.css", "/api/other", "/s/", "/sx/abc", "/icons-secret"]) {
      expect((await decide({ url: `${base}${p}`, codes: [CODE] })).action, p).toBe("deny");
    }
    expect(isOpenPath("/s/abc/extra")).toBe(false);
  });
});

describe("helpers", () => {
  it("continueResponse is the pass-through signal Vercel expects", () => {
    const r = continueResponse();
    expect(r.status).toBe(200);
    expect(r.headers.get("x-middleware-next")).toBe("1");
    expect(r.body).toBeNull();
  });
  it("safeEqual compares whole strings", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
  it("readCookie finds the named cookie only", () => {
    expect(readCookie("a=1; seen_invite=xyz; b=2", "seen_invite")).toBe("xyz");
    expect(readCookie("xseen_invite=1", "seen_invite")).toBeNull();
    expect(readCookie(null, "seen_invite")).toBeNull();
  });
  it("pickLang defaults to English", () => {
    expect(pickLang(undefined)).toBe("en");
    expect(pickLang("fr-FR")).toBe("fr");
  });
  it("the gate page is noindex, escaped and offers a way to ask", () => {
    const html = gatePageHtml("fr", "bad-invite", 'a"b@x.test', "https://seen.example.test");
    expect(html).toContain('content="noindex, nofollow"');
    expect(html).toContain('lang="fr"');
    expect(html).toContain('role="alert"');
    expect(html).not.toContain('a"b@x.test');
    expect(html).toContain("mailto:");
  });
});

describe("middleware (end to end, the real exported function)", () => {
  const saved = { ...process.env };
  beforeEach(() => { process.env.DEMO_INVITE_CODES = `${CODE}\n${OTHER}`; });
  afterEach(() => { process.env = { ...saved }; });

  it("passes the request through when the gate is off", async () => {
    delete process.env.DEMO_INVITE_CODES;
    const res = await middleware(new Request(`${base}/`));
    expect(res.status).not.toBe(403);
    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("answers 403 with a no-store, noindex page to an uninvited visitor", async () => {
    const res = await middleware(new Request(`${base}/chunks/app.js`));
    expect(res.status).toBe(403);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
    expect(await res.text()).toContain("SEEN");
  });

  it("redirects a valid invite to the clean URL with the cookie", async () => {
    const res = await middleware(new Request(`${base}/?invite=${CODE}`));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/");
    expect(res.headers.get("set-cookie")).toContain(`${COOKIE_NAME}=`);
    expect(res.headers.get("set-cookie")).not.toContain(CODE);
    expect(res.headers.get("referrer-policy")).toBe("no-referrer");
  });

  it("lets the cookie holder through", async () => {
    const res = await middleware(new Request(`${base}/`, { headers: { cookie: `${COOKIE_NAME}=${await sha256Hex(CODE)}` } }));
    expect(res.status).not.toBe(403);
    expect(res.status).not.toBe(302);
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });
});
