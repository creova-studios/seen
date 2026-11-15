# SEEN — Current State + Reconciliation Report

**SEEN — a Creova product.** First-pass deliverable of the master audit brief. Date: 2026-10-05. Baseline: `main@a35a8f1`. **No code, branch or Figma changes were made in this pass**; only documentation was added. Supporting documents are linked per section.

**Since this pass.** `main` has moved on with #17 (live bug fixes) and #18 (CREOVA AI toolchain). Production still deploys `main`. The findings below were written against `a35a8f1` and were not re-audited. Implementation still waits on the decisions in section L.

## A. Executive summary

SEEN is in better shape than "three competing versions" suggests, but it is not one product yet.

- **The deployed web app on `main` is clearly the strongest foundation.** It builds, passes 64 unit and 33 end-to-end/accessibility tests, has a Figma-bound design system and holds 12 real funding listings.
- **It is still a demo.** Accounts and data live in each browser; roles are enforced only in the UI; there is no way to report content and no terms or privacy policy. These block any public launch.
- **Valuable work is stranded.** About 20 screens Figma expects exist only on an unmerged branch (`claude/dead-code-typecheck-fixes`).
- **Figma is now far richer than the code.** About 300 screen frames, 7 annotated journeys and data/API notes per area, most of it beyond MVP.
- **The stakeholder feedback is consistent with the Figma notes.** Explain SEEN up front, shorten onboarding, put creators and durations on cards, make audio first-class, give creators real profiles and a guided Create flow, and **don't become social media**.

## B. Implementation map → `docs/audit/01_…FORENSIC_AUDIT.md`

| | Where | Verdict |
|---|---|---|
| **A** | `main` / `src/` web app | Production; canonical |
| **B** | `archive/` + `claude/platform-audit-OKLXV` | Earlier web screens; reference library |
| **C** | `mobile/` Expo app | 5-screen native prototype, sample data |
| **D** | `claude/dead-code-typecheck-fixes` | Parallel line of A with ~20 unique screens |
| + | `supabase/functions/server` | CMF-era backend, not deployed; reference only |
| + | `components/ui` (48 files) | Unused shadcn kit |

So there are four code lines, not three. `dev` exists but is 28 commits behind `main`.

## C. Deployment mapping → `00_…BASELINE.md`

Production (`seen-sigma-eight.vercel.app`) deploys **`main`**, currently `a35a8f1`. Before today it ran `707b179` (Sep 2). **Decision D-01:** confirm which of those two is the "preferred direction".

## D. Figma comparison → `03_FIGMA_TO_PRODUCT_GAP_ANALYSIS.md`

- **Present in both:** core discovery, story world, reader/player, chapter index, funding hub/detail, notifications, settings basics.
- **Figma only:** Introduction, guest mode, report flow, story completion, edit profile, library lenses, search scopes, publish review states, application workspace, monetization, institutions, moderation/appeals, settings groups, data controls.
- **Code only:** real sourced funding listings, device-voice fallback, docked mini player.
- **Conflicting:** typeface (Fraunces vs Inter), onboarding length (both too long), Creator Studio as "never a tab" vs the feedback's "+ Create", real-institution frames (Brock, CMF checker), which must stay out without signed agreements.
- **Missing everywhere:** desktop layouts, help, SEO, playback speed, read-time for written stories, "not social media" explanation.

## E. Stakeholder feedback → `04_…TRACEABILITY_MATRIX.md`

17 items, all traced. **Accepted:** 13 (some with modification). **Needs founder decision:** FB-11 (Create entry). **Needs clarification** because the handwriting wasn't available: FB-02, FB-04, FB-10. **Merged:** 3. **Rejected as written:** "carousels everywhere" and "engagement-based suggestions", which conflict with the principles.

Feedback that **changes the product**:

- **FB-09 "not social media":** codified as 12 principles (no public counts, no infinite scroll, explained recommendations).
- **FB-12:** onboarding is cut to 4 steps or fewer.
- **FB-01:** add an introduction and guest mode.
- **FB-06:** creator profiles say what they seek and how to support them.

## F. Missing product surface → `02_…`, `11_…`

| Priority | Missing |
|---|---|
| P0 (public launch) | Real auth/data, server-side roles, report content, terms & privacy |
| P1 (core product) | Introduction, guest mode, short onboarding, Continue + reasons on For You, one card family with creator + duration, player speed/transcript/error states, story completion, library lenses, search scopes, edit profile, creator intro, guided publish, a11y hardening |
| States | Guest/unauthenticated, player buffering/offline, publish processing/review/failed, session expired, offline auth |

## G. Technical health → `07_…`–`10_…`

| Area | Status |
|---|---|
| Healthy | Typecheck, tests, build, 0 prod vulnerabilities, security headers, AA tokens, axe in CI |
| Concerns | Two data layers · lockfile ignored, with npm and pnpm split across branches · `strict: false` · no lint · three story-card components · unused kit · 359 kB earnings chunk · CSP report-only · hash routing (no SEO) · Supabase ids in source |

## H. Canonical recommendation → `SEEN_CANONICAL_IMPLEMENTATION_DECISION.md`

**A (`main`) becomes the canonical codebase** (weighted score 440/500, versus 290 for D, 185 for C and 140 for B). Missing functionality migrates *into* A; A's UI is not moved anywhere. No fourth app.

## I. Migration map → `SEEN_CONSOLIDATION_PLAN.md` (ledger MIG-01…15)

| From | What moves into A |
|---|---|
| D | Report content, terms & privacy, guest prompt, edit profile, story completion, change password, playback error, session expired, notification settings, share sheet, logout confirmation (`useDialogA11y` compared with Radix first) |
| B | Creator onboarding intro; creator insights merged into the dashboard |
| Retired after parity | D branch, `platform-audit-OKLXV`, duplicate/merged branches (all tagged first), unused `components/ui`, CMF edge function (moved to `archive/`) |
| Mobile | Frozen pending D-03 |
| Cursor branch | Verified superseded |

## J. Priority backlog → `SEEN_P0_P1_P2_P3_BACKLOG.md`

5 × P0, 18 × P1, 19 × P2, 12 × P3, each with evidence, solution, acceptance criteria and test.

## K. Risks

| Risk | Mitigation |
|---|---|
| Deleting branch D loses ~20 screens | Tag first; migrate per ledger; delete last |
| Developing on stale `dev` resurrects old code | Fast-forward `dev` to `main` (strict ancestor, so nothing is lost) |
| Card/player refactors break the reader | Reader E2E with stable ids before refactor (test gate) |
| Backend swap touches two data layers | Converge legacy services behind contracts first |
| Shipping real-institution or CMF frames from Figma | Marked OBSOLETE until agreements exist |
| Unreproducible installs | Commit lockfile; `npm ci` |
| Feedback misread (no originals) | D-02: share photos; three items flagged |

## L. Decisions required → `SEEN_DECISIONS_REQUIRED.md`

**D-01** preferred deployed version · **D-02** feedback originals · **D-03** mobile app future · **D-04** typeface · **D-05** Create entry point · **D-06** approve product definition and principles · **D-07** payments/project funding scope · **D-08** branching strategy (tags + `dev` fast-forward) · **D-09** Supabase owner and region · **D-10** Creova casing and brand placement · **D-11** legal text · **D-12** institution agreements.

## M. Proposed implementation sequence → `SEEN_IMPLEMENTATION_ROADMAP.md`

0. **Safety:** tags, `dev`, lockfile.
1. **Test gate:** reader and publish E2E.
2. **Trust & legal:** report, terms/privacy, About wording.
3. **Clarity + onboarding:** introduction, guest mode, 4-step onboarding, password UX.
4. **Story consumption:** card family, player, completion, library.
5. **Discovery:** For You composer, search scopes.
6. **Creator experience:** profile, intro, guided publish, Create entry.
7. **Accessibility hardening.**
8. **Backend:** Supabase + RLS, run in parallel; required before public launch.
9. **Hardening:** P2 items.
10. **Later:** P3 items, per decisions.

## Answer to the brief's closing question

- **Canonical:** the deployed web app on `main` (`src/`). It is the preferred direction, the best-engineered and the best-tested; adopting it costs nothing.
- **Migrated into it:** about 20 stranded screens from `claude/dead-code-typecheck-fixes` (report, legal, guest prompt, edit profile, completion, password, session and playback states, share, settings) and the creator intro from `archive/`. Each is rebuilt on SEEN components and covered by tests.
- **Retired after parity, with backup tags:** the parallel branch, the old restoration branch, duplicate and merged branches, the unused shadcn kit and the CMF-era edge function. The Expo app is frozen pending your decision.
- **Missing:** real accounts and server-side roles, reporting, legal pages, an introduction and guest mode, a short onboarding, a consistent card with creator and duration, a complete player, creator profiles that say what creators seek, and desktop design.
- **Feedback that changes the product:** "this is not social media" (principles, no vanity metrics, explained recommendations), shorter onboarding, explain-SEEN-first with guest access, and creator-first cards and profiles.
- **Sequence to one production-ready app:** the 10-phase sequence in M, with the Supabase backend (Phase 8) as the hard gate before any public launch.

## Approval gate

Steps that change branches or remove code (backup tags, `dev` fast-forward, branch closures, deleting `components/ui`, archiving the edge function) are **not done** and need approval of D-08 plus this plan. Documentation was the only change in this pass.
