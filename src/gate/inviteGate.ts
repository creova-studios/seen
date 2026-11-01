/**
 * Invite gate for the public demo. Pure logic (no I/O) so it can be tested without a server; `middleware.ts` at the
 * repository root wires it into Vercel Routing Middleware, which runs on the server BEFORE any file is served. That is
 * what makes it a real gate: a code kept in the front-end bundle could be read by anyone who downloads the bundle.
 *
 * How it works
 *  - Codes live in the server-side environment variable DEMO_INVITE_CODES (comma or newline separated). It is not a
 *    VITE_ variable, so it is never compiled into the app.
 *  - An invitee opens  https://<app>/?invite=<code>.  A valid code sets an HttpOnly cookie holding only the SHA-256 of
 *    the code, then redirects to the same URL without the code, so it does not stay in the address bar or history.
 *  - Every other request needs that cookie. Without it the visitor sees a short "by invitation" page (HTTP 403).
 *  - Removing a code from the variable revokes everyone who used it on the next request.
 *  - If DEMO_INVITE_CODES is empty or unset the gate is OFF and everything is served as before. Turn it on by setting
 *    the variable in Vercel (Production) and redeploying; see docs/security/DEMO_INVITE_GATE.md.
 */

export type Lang = "en" | "fr" | "es";

export type GateDecision =
  | { action: "allow" }
  | { action: "set-cookie"; location: string; cookie: string }
  | { action: "deny"; reason: "no-invite" | "bad-invite"; lang: Lang };

export const COOKIE_NAME = "seen_invite";
export const COOKIE_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days
/** Codes shorter than this are ignored, so a typo in the variable cannot create a guessable gate. */
export const MIN_CODE_LENGTH = 8;

/** Left open on purpose: social share cards (curated public story previews) and static files the browser asks for before any page. */
const OPEN_PATHS: RegExp[] = [/^\/s\/[^/]+\/?$/, /^\/api\/share-preview\/?$/, /^\/robots\.txt$/, /^\/icons\//, /^\/manifest\.webmanifest$/, /^\/favicon/];

export function parseCodes(raw: string | undefined | null): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  for (const part of raw.split(/[,\n]/)) {
    const code = part.trim();
    if (code.length >= MIN_CODE_LENGTH) seen.add(code);
  }
  return [...seen];
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compares two equal-purpose hex strings without stopping at the first difference. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function pickLang(acceptLanguage: string | null | undefined): Lang {
  const first = (acceptLanguage ?? "").toLowerCase().split(",").map((p) => p.trim().slice(0, 2));
  for (const code of first) if (code === "fr" || code === "es" || code === "en") return code;
  return "en";
}

export function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export function isOpenPath(pathname: string): boolean {
  return OPEN_PATHS.some((re) => re.test(pathname));
}

export interface DecideInput {
  url: string;
  cookieHeader?: string | null;
  acceptLanguage?: string | null;
  codes: string[];
}

export async function decide({ url, cookieHeader, acceptLanguage, codes }: DecideInput): Promise<GateDecision> {
  if (codes.length === 0) return { action: "allow" }; // gate is off
  const u = new URL(url);
  if (isOpenPath(u.pathname)) return { action: "allow" };

  const hashes = await Promise.all(codes.map(sha256Hex));
  const matches = (h: string) => hashes.some((known) => safeEqual(known, h));

  const cookie = readCookie(cookieHeader, COOKIE_NAME);
  const hasValidCookie = cookie !== null && matches(cookie);

  const offered = u.searchParams.get("invite");
  if (offered !== null) {
    const h = await sha256Hex(offered.trim());
    if (matches(h)) {
      u.searchParams.delete("invite");
      return {
        action: "set-cookie",
        location: u.pathname + (u.search || ""),
        cookie: `${COOKIE_NAME}=${h}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE_S}`,
      };
    }
    if (!hasValidCookie) return { action: "deny", reason: "bad-invite", lang: pickLang(acceptLanguage) };
  }
  if (hasValidCookie) return { action: "allow" };
  return { action: "deny", reason: "no-invite", lang: pickLang(acceptLanguage) };
}

const COPY: Record<Lang, { title: string; body: string; bad: string; ask: string; subject: string; site: string }> = {
  en: { title: "SEEN is by invitation", body: "The demo is being shared with a small group while we build. If you have an invite link, open it again to come in.", bad: "That invite did not work. Check the link, or ask for a new one.", ask: "Ask for an invite", subject: "SEEN invite request", site: "About SEEN" },
  fr: { title: "SEEN est sur invitation", body: "La démo est partagée avec un petit groupe pendant que nous construisons. Si vous avez un lien d'invitation, ouvrez-le de nouveau pour entrer.", bad: "Cette invitation n'a pas fonctionné. Vérifiez le lien ou demandez-en un nouveau.", ask: "Demander une invitation", subject: "Demande d'invitation SEEN", site: "À propos de SEEN" },
  es: { title: "SEEN es por invitación", body: "La demo se comparte con un grupo pequeño mientras construimos. Si tienes un enlace de invitación, ábrelo de nuevo para entrar.", bad: "Esa invitación no funcionó. Revisa el enlace o pide uno nuevo.", ask: "Pedir una invitación", subject: "Solicitud de invitación a SEEN", site: "Sobre SEEN" },
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The page shown to anyone without an invite. Self-contained (no files are served to them) and not indexable. */
export function gatePageHtml(lang: Lang, reason: "no-invite" | "bad-invite", inviteEmail: string, siteUrl: string): string {
  const c = COPY[lang];
  const mail = `mailto:${inviteEmail}?subject=${encodeURIComponent(c.subject)}`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<meta name="referrer" content="no-referrer" />
<title>${esc(c.title)}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000;color:#fff;font-family:"Avenir Next","Century Gothic","Segoe UI",system-ui,sans-serif;line-height:1.55}
  main{max-width:30rem;padding:32px 24px}
  .brand{letter-spacing:.35em;font-weight:700;margin:0 0 28px}
  h1{font-weight:300;font-size:2.2rem;line-height:1.1;margin:0 0 16px;letter-spacing:-.03em}
  p{color:#a1a1aa;margin:0 0 20px}
  .bad{color:#fbbf24}
  a.btn{display:inline-flex;align-items:center;min-height:48px;padding:0 26px;border-radius:999px;background:#fff;color:#000;font-weight:600;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;text-decoration:none}
  a.link{color:#fff;margin-left:18px}
  a:focus-visible{outline:3px solid #fff;outline-offset:3px}
</style>
</head>
<body>
<main>
<p class="brand">SEEN</p>
<h1>${esc(c.title)}</h1>
${reason === "bad-invite" ? `<p class="bad" role="alert">${esc(c.bad)}</p>` : ""}
<p>${esc(c.body)}</p>
<p><a class="btn" href="${esc(mail)}">${esc(c.ask)}</a><a class="link" href="${esc(siteUrl)}">${esc(c.site)}</a></p>
</main>
</body>
</html>
`;
}
