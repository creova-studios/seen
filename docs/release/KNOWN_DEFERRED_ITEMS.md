# Known deferred items

Owners are roles until named. P0 = blocks open beta · P1 = next sprint · P2 = soon · P3 = later.

| # | Item | Why deferred | Owner | Priority |
|---|---|---|---|---|
| D1 | Supabase adapter for `SeenApi` + Supabase Auth (replace local accounts) | Needs project access, migrations, RLS policies | Backend | P0 (open beta) |
| D2 | Server/RLS enforcement of roles and tenancy; two-tenant tests | Depends on D1 | Backend + Security | P0 |
| D3 | ~~Real-organisation partner claims~~ — **removed** 2026-09-24 (story data + publish wizard). Re-add institutional partners only from signed agreements | Done | — | — |
| D4 | Funding listings: **12 real listings added** 2026-09-24. Still needed: an owner who re-verifies monthly (docs/product/FUNDING_LISTINGS.md), then move listings to the database | Owner | Product | P1 |
| D5 | Role-request approval UI in Admin | Needs D1 for real effect | Frontend | P1 |
| D6 | Search across creators/collections; show saved collections and followed creators inside Library (stories already have a Saved tab) | Scope | Frontend | P1 |
| D7 | Reader E2E + test ids; creator publish E2E | Legacy screens | QA | P1 |
| D8 | Commit lockfile, switch CI to `npm ci`; add ESLint | Changes Vercel install path; separate PR | DevOps | P1 |
| D9 | Promote CSP from Report-Only to enforcing | Needs one clean preview run | Security | P1 |
| D10 | Self-host story covers (Supabase Storage) — Unsplash hot-links fail on restricted networks | Depends on storage | Backend | P1 |
| D11 | Telemetry sink + Web Vitals | Choose sink | DevOps | P2 |
| D12 | FR/ES strings for new screens (i18n extraction) | Content is multilingual; UI strings EN | Content | P2 |
| D13 | Restyle creator publish wizard, moderation and admin screens with the SEEN components | Visual consistency, not function | Design systems | P2 |
| D14 | `tsconfig` `strict: true` | Large legacy surface | Frontend | P2 |
| D15 | Visual regression baselines | Needs self-hosted covers (D10) | QA | P2 |
| D16 | OTP sign-in (Figma OTP Field) and social login | Needs D1; social login currently disabled with "coming soon" | Backend | P2 |
| D17 | Record real narration audio (player falls back to device voice until then) | Content production | Content | P1 |
| D18 | Fraunces headings (Figma) vs Inter (live) — test with users | Brand decision | Design | P3 |
| D19 | Expo mobile app audit and parity | Out of scope this pass | Mobile | P3 |
| D20 | Stripe integration for subscriptions/payouts | Needs D1 + business setup | Backend | P2 |
