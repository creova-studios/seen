# Invite gate for the public demo

**Status:** built and tested, **switched off** until `DEMO_INVITE_CODES` is set in Vercel. Decision (owner, 2026-10-29): the demo is shared by invitation.

## Why a server-side gate

The demo is a static single-page app. Anything checked in the browser (a code in the JavaScript, a prompt on the first screen) can be read or skipped by anyone who downloads the bundle, so it would not protect the product. This gate runs in **Vercel Routing Middleware** (`middleware.ts` at the repository root, logic in `src/gate/inviteGate.ts`), before any file is served. Without an invite a visitor gets a short "by invitation" page and nothing else: no HTML, no scripts, no styles.

## What it does

| Request | Result |
|---|---|
| `DEMO_INVITE_CODES` unset or empty | Gate **off**: everything is served as before |
| No invite cookie | `403`, a small page in the visitor's language (EN/FR/ES) with an "Ask for an invite" email link. `no-store`, `noindex` |
| `/?invite=<valid code>` | `302` to the same URL without the code, plus an `HttpOnly; Secure; SameSite=Lax` cookie for 30 days. The cookie holds only the SHA-256 of the code |
| `/?invite=<wrong code>` | `403` with "that invite did not work" (unless the visitor already has a valid cookie) |
| Valid cookie | Served normally |
| `/s/<id>`, `/api/share-preview`, `/robots.txt`, `/icons/*`, `/manifest.webmanifest`, `/favicon*` | Always open (share cards for curated stories; the browser's own icon requests) |

Revoking: remove a code from the variable and redeploy; everyone who came in with it is out on their next request.

## Turn it on (about ten minutes)

1. **Release this change.** The gate only exists on deployments that contain it, so it goes through the normal flow `dev` → `staging` → `main`. It is harmless until step 3.
2. **Make codes.** One per group so you can revoke a group alone. 16+ random characters (codes shorter than 8 are ignored on purpose):
   `openssl rand -base64 12 | tr -d '/+='`
3. **Set the variable.** Vercel → project `seen` → Settings → Environment Variables → add `DEMO_INVITE_CODES` for **Production** only, value = the codes separated by commas or new lines, mark it **Sensitive**. Optional: `INVITE_EMAIL` (default `support@creova.one`) and `INVITE_SITE_URL` (default `https://seen.creova.one`) for the gate page links. Never prefix it `VITE_`: that would compile it into the public bundle.
4. **Redeploy production** (environment variable changes apply to new deployments).
5. **Verify** (replace `APP` and `CODE`):
   - `curl -s -o /dev/null -w "%{http_code}\n" APP/` should print `403`
   - `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "APP/?invite=CODE"` should print `302 APP/`, and `-i` shows a `set-cookie: seen_invite=…`
   - `curl -s -o /dev/null -w "%{http_code}\n" -H "cookie: seen_invite=<the hash from set-cookie>" APP/` should print `200`
   - Open `APP/?invite=CODE` in a browser, confirm the app loads and the address bar no longer shows the code.
6. **Share** `APP/?invite=CODE` with invitees. Add a person's name next to the code in your own notes (not in the repo) so you know whom to revoke.

## Roll back

Remove `DEMO_INVITE_CODES` (or empty it) and redeploy, or promote the previous deployment in Vercel (`ROLLBACK.md`).

## Limits to know

- It is an invite, not an account system. Anyone holding a link can forward it, which is why codes are per group and revocable. There is no per-person tracking.
- There is no guess throttling in the middleware (it has no store). Long random codes make guessing infeasible; do not use short or memorable ones.
- Preview deployments on `*.vercel.app` stay behind Vercel's own protection (see `BRANCHING.md`); this gate is for production.
- The public website (`site/`) is separate. Keep it in `DEMO_ACCESS=invite` mode (the default) so its buttons ask for an invitation instead of linking to the demo.
- Playwright and CI run against a local server, which has no middleware, so the end-to-end tests are unaffected. To try the gate locally: `vercel dev` with `DEMO_INVITE_CODES` set.
