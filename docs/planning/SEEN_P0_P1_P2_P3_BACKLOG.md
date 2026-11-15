# SEEN — P0 / P1 / P2 / P3 backlog

**SEEN — a Creova product.** P0 = release blocker for a public launch · P1 = core product · P2 = important improvement · P3 = enhancement. Status as of `main@a35a8f1`. "Src" = migration source (A/B/C/D, see `01_…FORENSIC_AUDIT.md`).

## P0 — public-launch blockers

| ID | Problem | Evidence | User impact | Screen | Depends on | Proposed solution | Acceptance | Test | Status |
|---|---|---|---|---|---|---|---|---|---|
| P0-01 | No real accounts; data per browser | SP-01, TD-03 | Progress lost across devices; insecure | Auth, all data | D-09 | Supabase Auth + Postgres adapter for `SeenApi` | AC P0-01 | E2E vs preview DB | Open |
| P0-02 | Roles enforced only in UI | SP-02 | Privilege escalation | Admin, moderation, creator money | P0-01 | RLS + server role assignment | AC P0-02 | RLS tests | Open |
| P0-03 | No way to report content | SP-03, Figma journey 7 | Harm can't be flagged | Story, profile | P0-01 for storage | Migrate D `ReportContentScreen` + confirmation | AC P0-03 | E2E | Open (Src D) |
| P0-04 | No terms / privacy | SP-04 | Legal exposure | Sign-up, Settings | D-11 | Migrate D `TermsPrivacyScreen` + reviewed text | AC P0-04 | E2E link | Open (Src D) |
| P0-05 | Backups before consolidation | R-04 | Losing unique branch work | Repo | D-08 | Tag every branch head with unique work | Tags exist on origin | `git ls-remote --tags` | Open |

## P1 — core product

| ID | Problem | Evidence | Screen | Solution | Src | Status |
|---|---|---|---|---|---|---|
| P1-01 | Visitors can't tell what SEEN is | FB-01/02/16 | Introduction | Introduction screen + "Our story" + "a Creova product" | Figma | Open |
| P1-02 | Account wall before any value | FB-01, journey 1 | Guest mode | Guest explore + sign-up sheet | D modal | Open |
| P1-03 | ~9 onboarding screens | FB-12 | Onboarding | ≤ 4 steps; progressive profiling | A | Open |
| P1-04 | No Continue / reasons on For You | FB-03/14 | For You | Feed composer with modules + reasons; mute topics | A | Open |
| P1-05 | Inconsistent cards, missing creator/duration | FB-04/10/15, TD-05 | All feeds | One card family | A | Open |
| P1-06 | Player lacks speed, transcript, buffering/failed | FB-05, A-08 | Player | Add controls + states | A + D | Open |
| P1-07 | No completion moment | Figma | Story completion | Migrate D screen | D | Open |
| P1-08 | Search stories-only | Figma | Search | Scopes + recents | A + D | Open |
| P1-09 | Library missing lenses | Figma | Library | Continue/Saved/Following/Collections | A | Open |
| P1-10 | Password UX gaps; no change password | FB-08 | Auth, Settings | Live rules, autocomplete, Change Password | D | Open |
| P1-11 | No Edit Profile; profiles lack seeking/support | FB-06 | Profile | Migrate D `EditProfileScreen` + new fields | D | Open |
| P1-12 | No creator intro | Figma | Become a Creator | Migrate B `CreatorOnboardingFlow` | B | Open |
| P1-13 | Publish flow free-text heavy | FB-13 | Wizard | Chips, audience, help, stepper, validation | A | Open |
| P1-14 | Border contrast; no text scale; no SR pass | FB-07, A-02/12/13 | All | 3:1 borders, text-scale setting, device SR pass | A | Open |
| P1-15 | Two data layers | TD-02 | Data | Legacy services behind contracts | A | Open |
| P1-16 | Lockfile / package manager | TD-04 | CI | Commit `package-lock.json`, `npm ci` | — | Open |
| P1-17 | Stale `dev` | R-01, TD-12 | Repo | Branching strategy (D-08) | — | Open |
| P1-18 | Reader + publish lack E2E | test gate | Tests | Add ids + E2E before refactors | A | Open |

## P2 — important improvements

P2-01 multiple drafts + review statuses (Figma) · P2-02 moderation backend, decisions log, appeals · P2-03 session expired / auth failed / offline auth (Src D) · P2-04 notification settings (Src D) · P2-05 Settings hub groups, privacy & security, data export, delete account (backend) · P2-06 share sheet fallback (Src D) · P2-07 Help screen · P2-08 desktop/tablet layout (design first) · P2-09 SEO, OG tags, path routing · P2-10 FR/ES UI strings · P2-11 restyle publish/moderation/admin with `components/seen` · P2-12 remove unused shadcn kit and deps · P2-13 ESLint + Prettier · P2-14 `strict` per folder · P2-15 lazy-load earnings charts · P2-16 enforce CSP · P2-17 move Supabase ids to env · P2-18 self-host covers · P2-19 `lang` attributes on FR/ES content

## P3 — enhancements

P3-01 recorded narration (content) · P3-02 downloads/offline · P3-03 in-app funding applications + eligibility · P3-04 project funding/payments (D-07) · P3-05 institutions workspace (D-12) · P3-06 discovery concepts (Mood Mixer, Cultural Map, Resonance Quiz, Smart Queue) · P3-07 Listening Wrapped / history timeline · P3-08 creator impact dashboard · P3-09 video player · P3-10 OTP / social sign-in · P3-11 visual regression · P3-12 mobile app per D-03
