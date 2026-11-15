# SEEN — consolidation plan

**SEEN — a Creova product.** Canonical base: **A (`main`)**. Nothing in this plan has been executed. Steps marked 🔒 need approval (D-08 and others) because they change branches or remove code.

## Sequence

| # | Step | Gate | Reversible? |
|---|---|---|---|
| 1 🔒 | **Backups:** tag `backup/2026-10-05/<branch>` on `main`, `dev`, `staging`, `claude/dead-code-typecheck-fixes`, `claude/platform-audit-OKLXV`, `cursor/fix-live-audit-bugs-5bb3`, `chore/creova-ai-toolchain`, `chore/add-pipeline-infra` | — | Yes (tags only) |
| 2 | Preserve active work: no open PRs; branch list recorded in `00_…BASELINE.md` | done | — |
| 3 | Canonical implementation = A | approval of this plan | — |
| 4 🔒 | **Establish `dev`:** fast-forward `dev` to `main` (`dev` is a strict ancestor, so no history is lost); protect `main`/`dev`; PRs target `dev` | D-08 | Yes (tag) |
| 5 | Add missing safety tests first (reader E2E ids, publish E2E) | test gate | Yes |
| 6 | **Migrate components/screens from D** (one `feature/*` PR each, restyled on `components/seen`, wired to contracts, with tests): Report Content (P0-03) → Terms & Privacy (P0-04) → Guest prompt (P1-02) → Edit Profile (P1-11) → Story Completion (P1-07) → Change Password (P1-10) → Media Playback Error (P1-06) → Session Expired (P2-03) → Notification Settings (P2-04) → Share Sheet (P2-06) → Logout confirmation → `useDialogA11y` (compare with Radix first) | each PR's tests | Yes |
| 7 | Migrate business logic: legacy `data/*Service.ts` behind `SeenApi` (P1-15) | unit tests | Yes |
| 8 | Migrate missing screens from B: creator intro (P1-12), creator insights (merge with dashboard) | E2E | Yes |
| 9 | Reconcile data models into one schema (`SEEN_ARCHITECTURE.md`) → Supabase migration (P0-01) | D-09 | Yes (migrations) |
| 10 | Consolidate tokens: radii, borders 3:1, typeface per D-04 | visual check + axe | Yes |
| 11 | Consolidate shared components: one story-card family (P1-05); then remove `ContentCard`/`StoryRow` after parity | parity checklist | Yes |
| 12 | Implement accepted feedback (groups in Gate 3 below) | AC per item | Yes |
| 13 | Implement missing states (`11_…STATE_AUDIT.md`) | tests | Yes |
| 14–18 | Validate tests, responsive, a11y, security, build, deployment | release checklist | — |
| 19 | Compare against deployment and Figma; update Figma for B-gaps (`03_…` §B) | design review | — |
| 20 🔒 | **Archive superseded implementations only after parity:** close D, `platform-audit-OKLXV`, duplicates (tags keep history); remove unused `components/ui`; move edge function to `archive/supabase/` once the new backend is live | parity verified per ledger | Yes (tags) |

## Feedback remediation groups (Gate 3)

1. **Product clarity:** P1-01, About wording, principles in UI.
2. **Discovery:** P1-04, P1-08.
3. **Story consumption:** P1-05, P1-06, P1-07, P1-09.
4. **Creator experience:** P1-11, P1-12, P1-13, D-05.
5. **Onboarding:** P1-03, P1-10.
6. **Accessibility:** P1-14.
7. **Opportunity/support:** keep funding verified monthly; support link on profiles (P1-11).

Each group runs: implement → test → visual check → accessibility check → regression check → document.

## Migration ledger

| ID | Feature | Source | Destination | Reason | Dependencies | Tests | Verification | Status |
|---|---|---|---|---|---|---|---|---|
| MIG-01 | Report content | D `ReportContentScreen` | `screens/ReportSheet` + `api.reports` | P0-03 | contracts | component + E2E | — | Planned |
| MIG-02 | Terms & privacy | D `TermsPrivacyScreen` | `screens/LegalScreen` | P0-04 | D-11 text | E2E | — | Planned |
| MIG-03 | Guest signup prompt | D `GuestSignupPromptModal` | `components/seen` Sheet | P1-02 | guest mode | E2E | — | Planned |
| MIG-04 | Edit profile | D `EditProfileScreen` | `screens/EditProfileScreen` | P1-11 | profile contract fields | component + E2E | — | Planned |
| MIG-05 | Story completion | D `StoryCompletionScreen` | reader end state | P1-07 | — | E2E | — | Planned |
| MIG-06 | Change password | D `ChangePasswordScreen` | Settings › Account | P1-10 | P0-01 for real effect | component | — | Planned |
| MIG-07 | Media playback error | D `MediaPlaybackErrorScreen` | player state | P1-06 | — | component | — | Planned |
| MIG-08 | Session expired | D `SessionExpiredScreen` | auth state | P2-03 | P0-01 | E2E | — | Planned |
| MIG-09 | Notification settings | D `NotificationSettingsScreen` | Settings | P2-04 | — | component | — | Planned |
| MIG-10 | Share sheet | D `ShareSheet` | fallback when Web Share absent | P2-06 | — | component | — | Planned |
| MIG-11 | Creator intro | B `CreatorOnboardingFlow` | creator entry | P1-12 | — | E2E | — | Planned |
| MIG-12 | Multi-select roles | Figma | `AuthContext`/profile | Figma notes | P0-01 | unit | — | Planned |
| MIG-13 | Logout confirmation | D | Profile | Figma | — | component | — | Planned |
| MIG-14 | Cursor branch fixes | `cursor/fix-live-audit-bugs-5bb3` | — | avoid lost fixes | — | existing E2E | Checked 2026-10-05: sign-in error colour, header Search/Profile, institutional crash, recovery copy and Library profile are all already fixed on `main` by other means. Only idea not on `main`: a **per-screen** `ScreenErrorBoundary` (main has one global boundary). Consider as P2 | Superseded; close after tagging |
| MIG-15 | AI toolchain config | `chore/creova-ai-toolchain` | repo root / `.ai/` | tooling | review | — | — | Needs review |

Never delete first and discover later that a missing feature lived only in the deleted version.
