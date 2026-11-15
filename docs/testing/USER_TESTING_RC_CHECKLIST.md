# User-testing release candidate checklist

| Item | Status |
|---|---|
| Stable URL | ⏳ Merge branch → Vercel preview URL; promote to production after review |
| Typecheck, unit (38), E2E (17), a11y (11 screens), build all green in CI | ✅ locally; CI workflow added (`.github/workflows/ci.yml`) |
| No primary navigation destination dead | ✅ header Search/Profile/Notifications, tabs, See-all wired or removed |
| No fake success states | ✅ demo checkout test-card only; funding "applied" requires the checklist and an open intake; funding listings are real and link to funders |
| Controlled test accounts | ✅ seeded per browser (below) |
| Seed data deterministic and honest | ✅ creators/collections derived from catalogue; funding listings real and sourced; no partner claims |
| Reset instructions | ✅ below |
| Privacy-safe analytics | ✅ allow-listed events, identifying keys stripped; no vendor connected |
| Feedback channel + issue template | ✅ `.github/ISSUE_TEMPLATE/user-testing-feedback.md` |
| Error reference ids visible to testers | ✅ error screen shows reference |
| Cross-tenant exposure | n/a — no shared backend yet (data is per-browser) |
| Manual keyboard + screen-reader pass | ⏳ run before session 1 |

## Test accounts (demo mode, per browser)

Created automatically in each browser's local storage. Password for all: `SeenDemo2026!`
(these are not server accounts; disable with `VITE_DEMO_ACCOUNTS=false`).

| Role | Email |
|---|---|
| Viewer | viewer@seen.demo |
| Creator | creator@seen.demo |
| Moderator | moderator@seen.demo |
| Admin | admin@seen.demo |

Sign in from onboarding: tap through to the account step → "Already have an account? Sign in".

## Reset

Clear the site's storage (DevTools → Application → Clear site data) or use a
new private window. To exercise failure states add `?simulate=offline`,
`?simulate=error` or `?simulate=slow` to the URL (sticks for the tab; `?simulate=none` to clear).
