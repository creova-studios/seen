# TEST_AND_CI_BASELINE.md — SEEN by CREOVA

**Audit Date:** 2026-11-15

---

## 1. CI Pipeline Architecture ([.github/workflows/ci.yml](file:///Users/justinmafie/seen-v1/.github/workflows/ci.yml))

The GitHub Actions workflow runs on every `push` to `main`, `staging`, `dev` and on every `pull_request` across four parallel/staged jobs:

1. **`verify` (`Typecheck · unit tests · build`):**
   - `npm run typecheck` (`tsc --noEmit`)
   - `npm test` (`vitest run`)
   - `npm run build` (`vite build`)
   - `npm audit --omit=dev --audit-level=high`
2. **`native` (`Native app · typecheck · tests · bundle`):**
   - `cd mobile && npm run typecheck`
   - `cd mobile && npx jest`
   - `cd mobile && npx expo export --platform ios --output-dir /tmp/export-ios && npx expo export --platform android --output-dir /tmp/export-android`
   - `npx playwright test -c playwright.native.config.ts`
3. **`database` (`Database RLS tests · secret scan`):**
   - Installs `postgresql-16` on `ubuntu-latest`
   - `npm run test:db` (`bash supabase/tests/run.sh`)
   - `bash scripts/secret-scan.sh`
4. **`e2e` (`End-to-end journeys`, depends on `verify`):**
   - `npm run test:e2e` (`playwright test` against [e2e/core-journeys.spec.ts](file:///Users/justinmafie/seen-v1/e2e/core-journeys.spec.ts))

---

## 2. Local Verification Results (2026-11-15)

| Suite | Files / Suites | Tests | Duration | Result |
|---|---|---|---|---|
| **Web Unit & Integration (`npm test`)** | `38` files | `240` tests | `~4.0s` | **PASS (`100%`)** |
| **Web Typecheck (`npm run typecheck`)** | Root TS project | All modules | `~1.8s` | **PASS (`0` errors)** |
| **Web Build (`npm run build`)** | Vite production | SPA bundle | `~2.1s` | **PASS** |
| **Site Verification (`cd site && npm run check`)** | `site.check.mjs` | `28` tests | `~0.4s` | **PASS (`100%`)** |
| **Mobile Typecheck (`cd mobile && npm run typecheck`)** | Mobile TS project | All native screens | `~2.0s` | **PASS (`0` errors)** |
| **Mobile Jest (`cd mobile && npx jest`)** | `6` suites | `25` tests | `~5.4s` | **PASS (`100%`)** |
| **Secret Scan (`bash scripts/secret-scan.sh`)** | Tracked git files | Regex + key checks | `<0.2s` | **PASS (`secret scan clean`)** |
| **Browser Verification Skill (`verify-seen`)** | `control-seen` | `--surface app` & `website` | `~25s` | **PASS (proof in `/tmp/seen-proof-*`)** |
| **Database RLS (`npm run test:db`)** | `supabase/tests/rls.test.sql` | Migrations `0001`–`0006` + 8 adversarial cases | `~1.5s` | **PASS (`ALL RLS TESTS PASSED` on PostgreSQL `16.16`)** |
