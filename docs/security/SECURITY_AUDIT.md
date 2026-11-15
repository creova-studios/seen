# Security audit — 2026-09-23

Scope: web app on `claude/clever-gates-cs9out`, the unused Supabase Edge Function, dependencies, configuration. OWASP ASVS-oriented, adapted to a client-only demo.

## Findings and status

| # | Severity | Finding | Status |
|---|---|---|---|
| S1 | High | Any user could pick **Moderator** at onboarding and receive moderator tools | **Fixed** — pending request instead; unit + E2E tests |
| S2 | High | Signing in after tapping a role during onboarding overwrote the account's real role in app state | **Fixed** — stored role authoritative |
| S3 | Medium | `updateProfile` accepted `role`/`email` in updates | **Fixed** — stripped; unit test |
| S4 | Medium | No route guards: admin/moderation/creator-money screens reachable by any role via Profile | **Fixed (UI)** — `canAccess` allow-lists; E2E. Server enforcement still required |
| S5 | Medium | Demo checkout reported success for any card number (invites real card entry, fake success) | **Fixed** — test cards only; unit test |
| S6 | Info | Authorization and accounts are client-side (`localStorage`) — any user can edit their own role locally | **Accepted for moderated testing; blocks open beta** |
| S7 | Info | Passwords hashed with SHA-256 + static salt client-side (demo only; comment in code says so) | Replace with Supabase Auth |
| S8 | Low | Edge fn CSRF check trusts any request whose `Host` contains `supabase.co` | Open — remove bypass when wiring the backend |
| S9 | Low | No CSP / security headers on Vercel | **Partly fixed** — `vercel.json` adds nosniff, referrer, frame, permissions headers and a CSP in *Report-Only* mode. Promote to enforcing after one clean preview deploy |
| S10 | Info | Supabase **anon** key committed in `utils/supabase/info.tsx` | Acceptable (public by design) **if** RLS is enabled on every table; service-role key is not in the repo. **Update:** the file was unused and is now archived (`archive/utils/supabase/info.tsx`); the app reads `VITE_SUPABASE_*` only |

## Checks run

- Secret scan (regex for Stripe keys, AWS keys, private keys, service-role JWT assignments) across the repo: **no secrets found**.
- `npm audit --omit=dev`: **0 vulnerabilities** (also a CI gate).
- Analytics: identifying keys stripped before recording (unit-tested).
- No `dangerouslySetInnerHTML` in reachable app code except shadcn chart CSS.

## Not in scope / not verifiable here

Supabase project configuration (RLS state, auth settings) — no project access from this session; production Vercel settings beyond deployment metadata.
