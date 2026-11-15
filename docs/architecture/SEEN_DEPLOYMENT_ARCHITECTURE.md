# SEEN — deployment architecture

**SEEN — a Creova product.**

| Environment | Source | URL | Data | Notes |
|---|---|---|---|---|
| Production | `main` | https://seen-sigma-eight.vercel.app | Demo adapter (per-browser) | Currently `a35a8f1` |
| Integration (proposed) | `dev` | Vercel branch preview for `dev` | Demo, later Supabase **staging** project | Needs D-08 |
| PR previews | any PR | `seen-git-<branch>-creovas-projects.vercel.app` | Demo | 36 recorded |
| Backend (target) | `supabase/` migrations | Supabase projects: `seen-staging`, `seen-prod` | Postgres + RLS | Not created |

Build: `vite build` → static `dist/` (hashed chunks, immutable caching). Headers in `vercel.json`: nosniff, referrer policy, frame DENY, permissions policy, CSP (Report-Only → enforce, SP-06).

CI (`.github/workflows/ci.yml`): install → typecheck → unit → build → `npm audit --omit=dev --audit-level=high`; second job runs Playwright E2E + axe. Planned: commit lockfile + `npm ci` (TD-04), lint step (TD-08), CI on `dev`.

Rollback: Vercel "Promote previous deployment" (instant) — see `docs/operations/ROLLBACK.md`. Environment variables: `VITE_DEMO_ACCOUNTS` today; Supabase URL + anon key to move from source into env (SP-07).
