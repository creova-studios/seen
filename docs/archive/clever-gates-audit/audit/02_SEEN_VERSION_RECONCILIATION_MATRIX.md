# 02 — SEEN version reconciliation matrix

**SEEN — a Creova product.** Sources: Figma `8WMBpUhanDkUjodZYolyDT` canvas `19 — PROTOTYPES` (read 2026-10-05), **A** = `main`/`src` (= production `a35a8f1`), **B** = `archive/` + `claude/platform-audit-OKLXV`, **C** = `mobile/`, **D** = `claude/dead-code-typecheck-fixes`, **FB** = stakeholder feedback themes (`04_…TRACEABILITY_MATRIX.md`).

Legend: ✅ works · 🟡 partial · ❌ absent · 🎨 designed in Figma · 💡 Figma concept only · — n/a.
Decisions: KEEP / MIGRATE / MERGE / REDESIGN / IMPLEMENT / DEFER / RETIRE / NEEDS FOUNDER DECISION.

Deployment = A, so A's column is also the deployment column.

## Entry, identity, account

| Capability | Figma | A (deployed) | B | C | D | FB | Decision | Migration source / reason |
|---|---|---|---|---|---|---|---|---|
| Landing / home explanation | 🎨 Splash → Introduction | 🟡 splash "S.E.E.N" button then onboarding; no "what is SEEN" before sign-up | `HomeScreen` (old) | invocation screen | — | FB-01, FB-02 | **REDESIGN** | A's splash + Figma Introduction; answer *what / who / why / next* in the first viewport; guest path to explore before sign-up |
| About / history | 🎨 PROFILE / About SEEN | ✅ `AboutScreen` (mission, CREOVA studio, EN/FR/ES) | — | — | — | FB-02 ("link to history") | **KEEP + REDESIGN** | Add link from splash/home; adopt "SEEN — a Creova product" wording |
| Language selection | 🎨 | ✅ | ✅ | ❌ | — | — | KEEP | A |
| Sign up | 🎨 + error states | ✅ (demo auth, inline errors, password rules) | — | ❌ | — | FB-08 | KEEP; backend later | A; real auth = Supabase (ADR-003) |
| Sign in | 🎨 + keyboard + error | ✅ demo | — | ❌ | — | — | KEEP | A |
| Password guidance | 🎨 | 🟡 length rule + show/hide | — | — | 🟡 Change Password | FB-08 | **MERGE** | A field + D `ChangePasswordScreen`; add autocomplete attrs audit, rule list |
| Password reset | 🎨 Forgot + Reset | 🟡 request only; honest "email not sent" copy | — | — | — | FB-08 | DEFER (needs email) | Backend |
| Email verification / OTP | 🎨 | ❌ (deliberately — needs server) | — | — | 🟡 `EmailVerificationScreen` | — | DEFER | D screen → wire with Supabase Auth |
| Session expired / auth failed / offline auth | 🎨 | 🟡 offline via ResourceView; no session-expiry screen | — | — | ✅ `SessionExpiredScreen` | — | **MIGRATE** | D |
| Guest mode | 🎨 "Continue as guest" | ❌ sign-up required | `guest-explore` frame | — | ✅ `GuestSignupPromptModal` | FB-01 | **IMPLEMENT** (+ MIGRATE modal) | D modal; guest = explore/read, sign-up to save |
| Onboarding | 🎨 10 steps (Splash→Language→Intro→Intent→Role→Personalization→A11y→Sign up→Verify→Completion) | ✅ ~9 screens (language, purpose, role, intent, account, accessibility, presence, threshold) | old Onboarding/Intent | 2 steps | — | FB-12 | **REDESIGN (reduce)** | Keep brand moment; cut to Language → Intro → Account → Enter; move role/intent/personalisation/a11y to progressive profiling |
| Role selection | 🎨 multi-select | ✅ single, moderator = request only | ✅ | ✅ | — | — | KEEP + REDESIGN | Multi-select per Figma notes; Admin never self-selected (already) |
| Interest selection / personalisation | 🎨 Personalization | ❌ (intent only) | — | ✅ intent | — | FB-12 | DEFER to progressive profiling | Ask after first story, not before |
| Creator onboarding | 🎨 Become a Creator · Intro | ❌ | ✅ `CreatorOnboardingFlow` | — | — | FB-11 | **MIGRATE** | B, restyled with `components/seen` |
| Audience onboarding | 🎨 | 🟡 same flow for all | — | — | — | FB-12 | REDESIGN | Shorter path for viewers |

## Discovery

| Capability | Figma | A | B | C | D | FB | Decision | Source / reason |
|---|---|---|---|---|---|---|---|---|
| Feed (For You) | 🎨 + loading | ✅ curated rails, real counts, See-all wired | `ForYouScreenCreator` | ✅ sample | — | FB-03, FB-14 | **REDESIGN** | Editorial rhythm per Figma notes (≤2 identical rails in a row; one creator row; one funding block); add "Continue" + "Because you…" reasons |
| Explore | 🎨 + empty filter | ✅ tabs Stories/Creators/Collections | `ExploreScreenCreator` | — | — | FB-03 | KEEP + REDESIGN | Culture/topic browse; fewer carousels |
| Search | 🎨 landing/results/zero/filters | ✅ stories only (Fuse.js) | — | — | ✅ `SearchScreen` | — | **MERGE** | A's screen + D's recents/origin handling; add creators/collections scopes |
| Recommendations | 🎨 module.reason | ❌ (static) | — | — | — | FB-03, FB-14 | IMPLEMENT (rules-based) | Recommendation philosophy first (`SEEN_PRODUCT_PRINCIPLES.md`) |
| Categories / tags | 🎨 | 🟡 categories + themes | `explore-cultural-tags` | — | — | FB-13 | KEEP; controlled vocabulary | — |
| Discovery concepts (Mood Mixer, Cultural Map, Resonance Quiz, QR entry) | 💡 | ❌ | 🟡 QR entry | — | — | — | DEFER | Concepts; not MVP |

## Stories

| Capability | Figma | A | B | C | D | FB | Decision | Source / reason |
|---|---|---|---|---|---|---|---|---|
| Story cards | 🎨 Portrait/Landscape/Compact | ✅ single tap target, typeLabel/badge slots | — | ✅ own card | — | FB-04, FB-10 | **REDESIGN (one card family)** | Creator name always visible; duration; save state; border contrast |
| Story detail (Story World) | 🎨 | ✅ `FeaturedStoryPreview` | `StoryWorldEntryScreen` | ✅ | — | FB-10 | KEEP | A |
| Reader / player | 🎨 player + buffering/failed/captions | ✅ scrollable reader, chapter rows, docked player | `SoundDrivenStoryView` | — | ✅ `MediaPlaybackErrorScreen` | FB-05 | MERGE | A + D error screen |
| Reading / listening duration | 🎨 | 🟡 card `duration` prop; "min" estimate | — | ✅ "45 min" | — | FB-04 | **IMPLEMENT** | Show "N min listen / read" from real chapter data; hide when unknown |
| Continue reading | 🎨 Library › Continue | 🟡 Library "In progress" tab | — | — | — | FB-03 | REDESIGN | Surface "Continue" rail on For You |
| Saved stories | 🎨 Library › Saved | ✅ | — | — | ✅ save toast | FB-03 | KEEP | A |
| Audio / read-aloud | 🎨 player, captions, transcript | 🟡 device voice fallback (labelled); **no recordings, no transcript, no speed control** | ✅ audio layers | — | — | FB-05 | IMPLEMENT (speed, transcript) / DEFER (recordings) | A engine |
| Transcript / captions | 🎨 | ❌ | — | — | — | FB-05, FB-07 | IMPLEMENT (text is the transcript for read-aloud) | — |
| Branching / choices | 🎨 | ✅ `BranchingChoiceOverlay` | ✅ Branch Map | — | — | — | KEEP; Branch Map DEFER | A; B for creator branch map |
| Story completion | 🎨 | ❌ | — | — | ✅ `StoryCompletionScreen` | — | **MIGRATE** | D |
| Share | 🎨 Share Reflection, share sheet | 🟡 Web Share API in reader | — | — | ✅ `ShareSheet` | — | MERGE | D sheet as fallback when Web Share unavailable |
| Report content | 🎨 sheet + confirmation | ❌ | — | — | ✅ `ReportContentScreen` | — | **MIGRATE** (P0 for public launch) | D |
| Community voices / responses | 🎨 | ✅ panel + submit (moderated) | — | — | — | FB-09 | KEEP | A |
| Context card | 🎨 | ✅ | ✅ | — | — | — | KEEP | A |
| Content unavailable | 🎨 | ❌ | — | — | ✅ | — | **MIGRATE** | D |

## Creators

| Capability | Figma | A | B | C | D | FB | Decision | Source / reason |
|---|---|---|---|---|---|---|---|---|
| Public creator profile | 🎨 PROFILE / Public | ✅ `#/creator/:id` (bio, languages, stories, follow) | `ContributorProfileCard` | — | — | FB-06 | **REDESIGN** | Add "what they're seeking / how to support / collaborate" |
| Own profile | 🎨 | ✅ Profile + "Your SEEN" rows | `ProfileScreenCreator` | ✅ | — | FB-06 | REDESIGN | Profile Builder entry |
| Profile Builder / Edit profile | 🎨 `edit-profile` | ❌ | — | — | ✅ `EditProfileScreen` | FB-06 | **MIGRATE** | D |
| Follow / connect | 🎨 | ✅ follow (counts hidden) | — | — | — | FB-09 | KEEP (no public counts) | Principle: no vanity metrics |
| Create action | 🎨 Creator Studio (not a consumer tab) | 🟡 via Profile → Creator dashboard | — | — | — | FB-11 | **NEEDS FOUNDER DECISION** (D-05) | Figma says never a consumer tab; feedback asks for persistent "+ Create" |
| Create story wizard | 🎨 5 steps + validation/processing/review/failed | ✅ 5 steps, autosaved single draft | `StoryBuilderScreen` | — | — | FB-13 | **REDESIGN** | Help text, chips/controlled tags, audience, clear Next; review statuses |
| Drafts | 🎨 Continue a draft | 🟡 one draft per creator | — | — | — | FB-13 | IMPLEMENT | Multiple drafts |
| Creator dashboard / stories list | 🎨 | 🟡 dashboard | `CreatorInsightsScreen` | — | — | — | MERGE | A + B |

## Funding, money, institutions, trust

| Capability | Figma | A | B | C | D | FB | Decision | Source / reason |
|---|---|---|---|---|---|---|---|---|
| Opportunities hub + detail | 🎨 | ✅ 12 real, sourced listings; filters; detail | — | — | — | — | KEEP | A |
| Eligibility check / application workspace / statuses | 🎨 9 status screens | 🟡 save → checklist → applied (tracker) | — | — | — | — | DEFER (needs funder integrations) | External applications happen on funder sites; tracker is honest |
| Project funding (supporter contributions) | 🎨 | ❌ | — | — | — | — | **NEEDS FOUNDER DECISION** (D-07) | Financial/legal implications |
| Monetization / earnings / payouts | 🎨 10 screens | 🟡 mock earnings, test-card checkout | — | — | — | — | DEFER (Stripe) | Never show fake money as real |
| Subscriptions | 🎨 | 🟡 demo | — | — | — | — | DEFER | — |
| Institutions workspace | 🎨 8 screens | 🟡 institutional collections | ✅ institutional screens | — | — | — | DEFER | No signed partners (rule) |
| Report → moderation → appeal | 🎨 9 screens | 🟡 moderator queue (local), no report entry, no appeal | ✅ governance | — | ✅ report | — | MIGRATE report; DEFER appeals (backend) | D + A |
| Notifications | 🎨 + settings | ✅ centre, badge, deep links | — | — | ✅ settings screen | — | MERGE | A + D `NotificationSettingsScreen` |

## Settings, states, platform

| Capability | Figma | A | B | C | D | FB | Decision | Source / reason |
|---|---|---|---|---|---|---|---|---|
| Settings hub | 🎨 4 groups | ✅ language, a11y toggles, list rows | `AccessibilityControlsScreen` | — | — | — | REDESIGN to Figma groups | A |
| Privacy & security / data controls / delete account | 🎨 | ❌ | — | — | 🟡 Terms & Privacy | — | IMPLEMENT (copy) / DEFER (deletion needs backend) | D |
| Logout confirmation | 🎨 | 🟡 direct sign-out | — | ✅ | ✅ modal | — | MIGRATE | D |
| Help | — | ❌ | — | — | — | — | IMPLEMENT (simple) | Missing everywhere |
| Legal (terms, privacy) | 🎨 `terms-privacy` | ❌ | — | — | ✅ | — | **MIGRATE** (P0 before public launch) | D; text needs legal review |
| Empty / loading / error / offline | 🎨 | ✅ `ResourceView` + `StateTemplate` | — | — | ✅ network/offline components | — | MERGE | Keep A's pattern; reuse D copy |
| Permission denied | 🎨 | ✅ (Restricted state) | — | — | ✅ | — | KEEP A | — |
| App update | 🎨 | — | — | — | ✅ modal | — | RETIRE for web (native only) | — |
| Mobile navigation | 🎨 bottom nav 4 tabs | ✅ | ✅ | ✅ tab bar | — | FB-11 | KEEP | — |
| Desktop navigation | ❌ (mobile-only frames) | 🟡 centred mobile column | — | — | — | — | **IMPLEMENT** | Missing everywhere |
| Accessibility | 🎨 notes | ✅ AA tokens, axe in CI | — | ❓ | ✅ `useDialogA11y` | FB-07 | KEEP + MERGE | — |
| Analytics | — | ✅ allow-listed `track()` | — | — | — | — | KEEP; add measurement framework | — |
| SEO / share metadata | — | ❌ (`<title>SEEN</title>` only; hash routes not crawlable) | — | — | — | — | IMPLEMENT (P2) | — |
| Native mobile app | — | — | — | ✅ | — | — | **NEEDS FOUNDER DECISION** (D-03) | Keep separate, pause, or wrap web |
