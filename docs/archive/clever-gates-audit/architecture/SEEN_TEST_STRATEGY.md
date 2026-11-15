# SEEN — test strategy

**SEEN — a Creova product.** Supersedes `docs/testing/TEST_STRATEGY.md` counts; principles there still apply.

## Coverage today (verified 2026-10-05)

| Layer | Tool | Count | Notes |
|---|---|---|---|
| Unit + integration | Vitest | 64 tests / 7 files | routes, permissions, services + failure simulation, funding rules, telemetry, payments, playback engine |
| Component | Testing Library + jsdom | in the 64 | screens with the real demo adapter, form atoms, overlays |
| E2E journeys | Playwright (mobile Chromium) | 33 | onboarding, role guard, search, follow, collections, funding tracker, notifications, reader + mini player, settings, filters, offline/error, Explore tab back, malformed link, 6 widths overflow |
| Accessibility | axe-core in Playwright | main routes | WCAG 2.2 A/AA tags |
| Visual regression | — | 0 | Gap (needs self-hosted covers) |
| API / RLS | — | 0 | Gap (no backend) |
| Mobile app | — | 0 | Not tested (D-03) |

## Required before consolidation steps (gate)

The consolidation plan may not migrate a feature until its journey has an automated test. Missing today:

1. **Reader journey with stable ids** (preview → chapter → index → resume from Library) — before card/player refactors.
2. **Creator publish E2E** — before restyling the wizard (P1-13).
3. **Guest → sign-up → back to story** — written with P1-02.
4. **Report content** — written with P0-03.
5. **RLS two-user tests** — written with P0-01/P0-02.

## Rules

- Tests run against the real demo adapter. Failures are injected with `?simulate=`.
- Every bug fix lands with a test that fails without it.
- Date-dependent logic takes `now` as a parameter; tests use fixed dates (lesson from PR #22).
- Commands: `npm run check`, `npm run test:e2e` (`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` in the Claude sandbox).
