/**
 * Vercel Routing Middleware: the invite gate for the public demo (see src/gate/inviteGate.ts and
 * docs/security/DEMO_INVITE_GATE.md). Runs on the server before any file is served.
 * Off unless the server-side environment variable DEMO_INVITE_CODES is set.
 */
import { continueResponse, decide, gatePageHtml, parseCodes } from "./src/gate/inviteGate";

// Everything except the paths that stay open for share cards and the browser's own icon/manifest requests.
export const config = {
  matcher: ["/((?!s/|api/share-preview|icons/|robots\\.txt|manifest\\.webmanifest|favicon).*)"],
};

export default async function middleware(request: Request): Promise<Response> {
  const codes = parseCodes(process.env.DEMO_INVITE_CODES);
  const decision = await decide({
    url: request.url,
    cookieHeader: request.headers.get("cookie"),
    acceptLanguage: request.headers.get("accept-language"),
    codes,
  });

  if (decision.action === "allow") return continueResponse();

  const common = { "cache-control": "no-store", "referrer-policy": "no-referrer" };
  if (decision.action === "set-cookie") {
    return new Response(null, { status: 302, headers: { ...common, location: decision.location, "set-cookie": decision.cookie } });
  }
  const email = process.env.INVITE_EMAIL || "support@creova.one";
  const site = process.env.INVITE_SITE_URL || "https://seen.creova.one";
  return new Response(gatePageHtml(decision.lang, decision.reason, email, site), {
    status: 403,
    headers: { ...common, "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow" },
  });
}
