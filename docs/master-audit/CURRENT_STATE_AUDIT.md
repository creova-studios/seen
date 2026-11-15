# CURRENT_STATE_AUDIT.md — SEEN by CREOVA

**Audit Date:** 2026-11-15  
**Repository:** `https://github.com/creova-studios/seen.git`  
**Base Commit:** `c7cd64e` (`main`)  
**Audit Branch:** `feat/master-audit-and-artist-intake`

---

## 1. Executive Summary

SEEN by CREOVA is a multilingual (`EN` / `FR` / `ES`) storytelling platform with four code surfaces in one monorepo:

1. **Web Application ([src/](file:///Users/justinmafie/seen-v1/src))** — React 18 + Vite 6 SPA with 21 hash routes ([routes.ts](file:///Users/justinmafie/seen-v1/src/app/navigation/routes.ts)), 6-step onboarding, discovery (`For You`, `Explore`), story preview and multi-chapter reader, creator 5-step publish wizard, Canadian arts funding directory (12 real programs), and a service adapter layer ([src/app/services/index.ts](file:///Users/justinmafie/seen-v1/src/app/services/index.ts)).
2. **Native Mobile Application ([mobile/](file:///Users/justinmafie/seen-v1/mobile))** — Real React Native (`0.88.0`) + Expo (`^58.0.0`) application ([NativeApp.tsx](file:///Users/justinmafie/seen-v1/mobile/src/native/NativeApp.tsx)) with native stack and bottom-tab navigation (`@react-navigation/*`), native audio/TTS narration ([player.tsx](file:///Users/justinmafie/seen-v1/mobile/src/native/player.tsx)), and shared TypeScript data modules imported from `../src/app` via `@seen/*`.
3. **Public Marketing & Legal Website ([site/](file:///Users/justinmafie/seen-v1/site))** — Zero-dependency static site generator ([site/build.mjs](file:///Users/justinmafie/seen-v1/site/build.mjs)) producing trilingual HTML (`/`, `/fr/`, `/es/`, `/terms/`, `/privacy/`) and the `"Make a SEEN"` interactive card toy ([site/src/site.js](file:///Users/justinmafie/seen-v1/site/src/site.js)).
4. **PostgreSQL & RLS Backend ([supabase/](file:///Users/justinmafie/seen-v1/supabase))** — Five SQL migrations ([0001_core_schema.sql](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql) to [0005_profile_bio.sql](file:///Users/justinmafie/seen-v1/supabase/migrations/0005_profile_bio.sql)) plus an RLS test suite ([rls.test.sql](file:///Users/justinmafie/seen-v1/supabase/tests/rls.test.sql)).

---

## 2. Live Deployment Verification (Probed 2026-11-15)

| Endpoint | HTTP Status | Infrastructure | Observed State |
|---|---|---|---|
| `https://seen.creova.one` | `HTTP/2 200` | Cloudflare + GitHub Pages (`x-github-request-id`) | Live public website (`last-modified: Tue, 03 Nov 2026 08:01:21 GMT`). |
| `https://seen.verse.one` | DNS `NXDOMAIN` (`curl: (6)`) | Unresolved DNS | Configured in `site/build.mjs` for new brand domain, but DNS does not yet resolve. |
| `https://seen-sigma-eight.vercel.app` | `HTTP/2 200` | Vercel Edge | Serves the exported Expo/web testing build with `Content-Security-Policy-Report-Only`. |

---

## 3. Verification Command Baseline

| Check | Command | Status | Evidence |
|---|---|---|---|
| Web Typecheck | `npm run typecheck` | **PASS** | `0` compiler errors after fixing merge corruption in [OnboardingPurpose.tsx](file:///Users/justinmafie/seen-v1/src/app/components/OnboardingPurpose.tsx). |
| Web Unit/Contract Tests | `npm test` | **PASS** | `38/38` test files, `240/240` tests passing (`vitest`, including `intake.test.ts`). |
| Web Production Build | `npm run build` | **PASS** | Clean Vite bundle in `dist/`. |
| Public Site Check | `cd site && npm run check` | **PASS** | `28/28` static HTML, i18n, and SEO assertions passing. |
| Mobile Typecheck | `cd mobile && npm run typecheck` | **PASS** | `0` compiler errors across `mobile/src/**`. |
| Mobile Unit Tests | `cd mobile && npx jest` | **PASS** | `6/6` suites, `25/25` React Native component/unit tests passing. |
| Secret Scan | `bash scripts/secret-scan.sh` | **PASS** | `secret scan clean`. |
| Live Browser Harness | `.agents/skills/verify-seen/bin/control-seen` | **PASS** | End-to-end screenshots, snapshots, and `localStorage` state captured in `/tmp/seen-proof-proof-app/` and `/tmp/seen-proof-proof-site/`. |
| Database RLS SQL Suite | `npm run test:db` | **PASS** | Executed locally against throwaway PostgreSQL `16.16` (`ALL RLS TESTS PASSED` + `SIGNUP TRIGGER OK`, including Migration `0006` and all 8 Phase 5 adversarial cases). |

---

## 4. Top Findings Requiring Immediate Action

1. **Client-Side Auth & Publishing by Default:** Both web ([authService.ts](file:///Users/justinmafie/seen-v1/src/app/data/authService.ts), [userStoriesService.ts](file:///Users/justinmafie/seen-v1/src/app/data/userStoriesService.ts)) and mobile ([mobile/src/native/auth.ts](file:///Users/justinmafie/seen-v1/mobile/src/native/auth.ts), [mobile/src/native/create.ts](file:///Users/justinmafie/seen-v1/mobile/src/native/create.ts)) persist accounts, drafts, and published stories only to `localStorage` / `AsyncStorage`.
2. **Partial Supabase Wiring:** In [src/app/services/index.ts](file:///Users/justinmafie/seen-v1/src/app/services/index.ts#L17), `VITE_BACKEND=supabase` only routes `reports`, `blocks`, `notes`, and `preferences` to Supabase. Story intake, drafts, catalogue, and creator profiles still use `demoAdapter`.
3. **Direct Self-Publish RLS Loophole:** In [0001_core_schema.sql](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L46-L52), `stories_insert` and `stories_update_own` permit any authenticated user to write `status = 'published'`, bypassing editorial review.
4. **Missing Artist Intake Entities:** `invitations`, `rights_grants`, `story_submissions` / `story_reviews`, and editorial states (`submitted`, `in_review`, `changes_requested`, `approved`, `rejected`, `unpublished`, `withdrawn`) are not yet in `supabase/migrations/`.
