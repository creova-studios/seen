# Master feature matrix

The execution control plane. **Vercel** = production at `707b179`; **Figma** = component library; **Code** = this branch.
Backend column: *Demo* = typed contract + local demo adapter (ADR-002); *None* = no server; *Edge fn* = endpoint existed in the legacy `supabase/functions/server`, now archived at `archive/supabase/functions/server` and not wired.

| ID | Feature | Screen / flow | Vercel (before) | Figma | Code (now) | Backend | State coverage | Tests | Decision | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| F01 | Onboarding + sign-up | Onboarding (7 steps) | EXISTS + WORKS | Inputs, Buttons | Works; moderator becomes a request | Demo auth (Edge fn exists) | ✅ validation, error | E2E ×2, unit | Keep; move to Supabase Auth | P0 |
| F02 | Sign in / password recovery | Onboarding account step | EXISTS + WORKS (demo) | Password, OTP | Works (demo token shown, no email) | Demo auth | 🟡 | unit | NEEDS BACKEND (email) | P1 |
| F03 | Social login | Onboarding | EXISTS + BROKEN (disabled "coming soon") | — | unchanged | None | — | — | NEEDS PRODUCT DECISION | P3 |
| F04 | OTP sign-in | — | MISSING | FIGMA ONLY | deferred | None | — | — | NEEDS BACKEND | P2 |
| F05 | For You feed | For You | EXISTS + UI INCONSISTENT | Story Card | Fixed cards, fake stats replaced by real counts, See-all wired | Static catalogue | ✅ empty | E2E, a11y | Done | P0 |
| F06 | Explore – stories | Explore › Stories | EXISTS + BROKEN (dead filters) | Segmented Tabs | Tabs replace dead filters | Static catalogue | ✅ | E2E, a11y | Done | P0 |
| F07 | Explore – creators | Explore › Creators | MISSING | FIGMA ONLY | Built | Demo | ✅ all | unit, component, E2E, a11y | Done | P0 |
| F08 | Creator profile + follow | `#/creator/:id` | MISSING | Creator Card, Avatar | Built | Demo | ✅ all + optimistic | component, E2E | Done | P0 |
| F09 | Collections (thematic + institutional) | Explore › Collections, `#/collections` | EXISTS + BROKEN (crash) | Collection Card | Built; crash removed | Demo (derived) | ✅ all | unit, E2E | Done | P0 |
| F10 | Collection detail + save | `#/collection/:id` | MISSING | Collection Card | Built | Demo | ✅ all | E2E | Done | P1 |
| F11 | Search | Header → Search | EXISTS + BROKEN (dead on 2 tabs, result bounce) | Search Bar | Fixed | Fuse.js local | ✅ empty/loading | E2E | Done; add creators/collections to results later | P0 |
| F12 | Story preview / reader / chapters | Story screens | EXISTS + BROKEN (text clipped, dead Share/Bookmark, chapter pick ignored, fake captions) | Chapter Row, Player Bar | Fixed; scrollable reader, Chapter Rows, Share, Save | Static catalogue | 🟡 | E2E | Done | P0 |
| F13 | Library (progress / completed) | Library | EXISTS + UI INCONSISTENT | — | Keyboard tabs, visible remove w/ confirm, fixed cards | localStorage | ✅ empty | a11y | Done; "Saved" tab deferred | P1 |
| F14 | Profile + Your SEEN | Profile | EXISTS + WORKS | List Item | Following / saved / tracker / notifications rows | Demo | ✅ | E2E | Done | P1 |
| F15 | Settings / preferences | Settings | EXISTS + WORKS | Toggle | unchanged | localStorage | 🟡 | — | Keep | P2 |
| F16 | Notifications | Bell → `#/notifications` | MISSING | Notification Item | Built (badge, read, mark all, deep targets) | Demo | ✅ all | component, E2E | Done | P1 |
| F17 | Funding opportunities | `#/funding` | MISSING | Opportunity Card | Built (open / tracker / closed, type filters) | Real listings (static, sourced) | ✅ all | unit, E2E, a11y | Done; needs monthly re-verification owner | P1 |
| F18 | Opportunity detail + tracker | `#/opportunity/:id` | MISSING | Opportunity Card, Checkbox, Progress | Built (save → checklist → applied, closed state) | Demo | ✅ all + optimistic | unit, component, E2E | Done | P1 |
| F19 | Creator publishing wizard | Profile › Creator Dashboard | EXISTS + WORKS | — | lazy-loaded | localStorage | 🟡 | — | Keep; E2E later | P1 |
| F20 | Creator monetization / earnings | Profile › Creator tools | EXISTS + WORKS (mock) | Metric Card, Subscription Card | role-guarded, lazy | Mock | 🟡 | guard E2E | Keep | P2 |
| F21 | Subscriptions / checkout | Paywall, Subscription mgmt | EXISTS + WORKS (mock) | Subscription Card | Test-card-only demo | Mock | 🟡 | unit | NEEDS BACKEND (Stripe) | P2 |
| F22 | Moderation | Profile › Moderation | EXISTS + WORKS (local) | Notification: Moderation | role-guarded | Edge fn exists | 🟡 | guard E2E | NEEDS BACKEND | P1 |
| F23 | Admin dashboard | Profile › Platform | EXISTS + WORKS (local) | Metric Card | role-guarded, lazy | Local | 🟡 | guard E2E | NEEDS BACKEND | P2 |
| F24 | Role elevation | Settings / sign-up | EXISTS (request log) | — | Sign-up uses it; no approval UI | Local | 🟡 | unit | Approval UI in admin | P1 |
| F25 | URLs / back button / deep links | all | MISSING | — | Built (hash routes) | — | ✅ | unit, E2E | Done | P0 |
| F26 | Error boundary / telemetry | global | MISSING | State Template | Built | beacon to optional endpoint | ✅ | unit | Done; choose sink | P1 |
| F27 | Media player (mini + expanded) | Global | EXISTS + BROKEN (no audio files; Play did nothing) | Media Player Bar | Built: persistent player, device-voice fallback, explicit unavailable state | — | ✅ | unit, E2E | Done; record real narration | P1 |
| F28 | Multilingual EN/FR/ES | all | EXISTS + WORKS (content) | — | new screens EN-only strings | — | — | — | Extract strings (i18n) | P2 |
| F29 | Mobile app (Expo) | `mobile/` | CODE ONLY | — | not changed | — | — | — | Separate audit | P3 |
| F30 | Home screen (legacy) | — | CODE ONLY, unreachable | — | archived | — | — | — | DEPRECATED | — |

| F31 | Settings | `#/settings` | EXISTS + BROKEN (dead buttons, unsaved controls) | Toggle, Radio, List Item | Rebuilt; contrast + motion apply app-wide | local | ✅ | E2E | Done | P1 |
| F32 | Library › Saved stories | Library | MISSING (subtitle promised it) | — | Built | localStorage | ✅ empty | E2E | Done | P1 |