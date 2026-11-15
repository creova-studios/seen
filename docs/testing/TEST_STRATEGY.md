# Test strategy

| Layer | Tool | Location | Runs | Count today |
|---|---|---|---|---|
| Unit (rules, routes, permissions, telemetry sanitising, payments) | Vitest | `src/app/__tests__/*.test.ts` | `npm test`, CI | 38 tests total with component |
| Integration (service adapter + persistence + failure simulation) | Vitest | `services.test.ts` | same | incl. above |
| Component (screens with real adapter, states, optimistic flows) | Vitest + Testing Library + jsdom | `screens.test.tsx`, `auth.test.tsx` | same | incl. above |
| End-to-end journeys (mobile Chromium, Pixel 7 profile) | Playwright | `e2e/core-journeys.spec.ts` | `npm run test:e2e`, CI | 17 |
| Accessibility (WCAG 2.2 A/AA automated) | axe-core via Playwright | `e2e/a11y.spec.ts` | same | 11 screens |
| Responsive (no horizontal overflow) | Playwright | in core journeys | same | 6 widths × 9 routes |
| Visual regression | — | — | — | **Gap** (see below) |

Run locally: `npm run check` (typecheck + unit + build) and `npm run test:e2e`.
In the Claude Code sandbox set `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`.

## Principles

- Tests use the real demo adapter (no mocks of our own code) with latency 0; failures are injected through the same `?simulate=` switch testers use.
- A feature is not done until its critical path has an automated test or a written reason below.
- A fix for a bug found in testing lands with a test that fails without it.

## Known gaps (owner: engineering)

| Gap | Why not yet | Plan |
|---|---|---|
| Reader journey (preview → chapter → chapter index → resume from Library) | Reader screens predate this pass and use heavy motion; needs stable test ids | Add `data-testid`s and one E2E |
| Creator publish wizard E2E | 5-step wizard, file inputs | Add after Supabase Storage lands |
| Visual regression | Needs committed baselines and a stable font/image environment (covers are remote) | Playwright `toHaveScreenshot` on the 4 tabs + funding detail once covers are self-hosted |
| Manual screen-reader pass (VoiceOver iOS, TalkBack) | Needs devices | Before each user-testing round; checklist in USER_TESTING_RC_CHECKLIST |
| RLS / tenancy tests | No backend yet | pgTAP or two-tenant Edge-function tests with the Supabase adapter |
