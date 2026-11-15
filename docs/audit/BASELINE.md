# Baseline — before the 2026-09 reconciliation

Recorded before any change, so every later claim can be compared against it.

| Item | Value |
|---|---|
| Repository | `creova-gif/SEEN` (GitHub) |
| Default / deployment branch | `main` |
| Deployed commit | `707b179` — "Merge pull request #15 … platform-audit-OKLXV" (Vercel production deployment `dpl_6vUmoRecASFYTXrFsKdjeYxdB1eB`, READY) |
| Deployed URL | https://seen-sigma-eight.vercel.app/ (Vercel project `seen`, team `creovas-projects`) |
| Previous production deploy | `caf1af9` (rollback candidate) |
| Working branch | `claude/clever-gates-cs9out` (created from `707b179`) |
| Other branches | `main` only on origin at the time |
| Framework | React 18.3.1 + TypeScript 5.7, Vite 6.3.5, Tailwind CSS 4.1, Motion 12 |
| Package manager | npm (no lockfile committed — `package-lock.json` is git-ignored) |
| Backend | None in use at runtime. A Supabase Edge Function (Hono, KV store) exists in `supabase/functions/server/` but the web app never calls it |
| Database | None live. Browser `localStorage` holds users, sessions, progress, drafts |
| Auth | Client-side demo auth (`AuthContext.tsx`): SHA-256 of password + static salt in `localStorage` |
| Storage | None. Story covers are hot-linked from `images.unsplash.com` |
| Payments | Mock gateway (`paymentService.ts`), clearly labelled demo mode |
| Deployment | Vercel Git integration, static SPA build (`vite build` → `dist/`) |
| Mobile | Separate Expo SDK 57 app in `mobile/` (not audited in depth this pass) |
| Environment variables | Web app reads none at baseline. Edge function expects `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`. `utils/supabase/info.tsx` contains the project id and the **public anon key** (designed to be public; not a secret) |

## Build / test status at baseline

| Check | Result |
|---|---|
| `npm run build` | ✅ passes; main chunk 1,479 KB (gzip 320 KB) with size warning |
| `npm run typecheck` | ❌ **74 errors** in 30 files |
| Tests | ❌ 4 Jest-style test files, but no Jest/Vitest installed — **no test could run** |
| CI | none |
| Lint | none configured |

## Regression reference

Screenshots of the baseline build (identical bundle hash to production, see
`LIVE_APP_AUDIT.md`) were captured at 390×844 during the audit. The sandbox
could not reach `seen-sigma-eight.vercel.app` directly (egress policy), so the
live page was fetched through the Vercel API and its asset hashes
(`index-DO0E18ZK.css`, `data-layer-DPMa2Dl1.js`) were matched to a local build
of `707b179`.

## Known blockers at baseline

1. No real backend: every account, follow, save and progress record lives in one browser.
2. Unsplash hot-links fail in restricted networks → broken images across all cards.
3. Several production crashes and dead controls (see `LIVE_APP_AUDIT.md`).
4. Any user could self-assign the Moderator role during onboarding.
