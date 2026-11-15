# 05 — SEEN user journey audit

**SEEN — a Creova product.** Walked against `main@a35a8f1` (code + E2E suite) and the Figma `13 — PROTOTYPE FLOWS` board. ✅ = covered by an automated E2E test today.

## 1. Visitor: Landing → Understand → Explore → Story → Creator → Signup

| | |
|---|---|
| Entry | Shared link or the production URL |
| Goal | Decide whether SEEN is for them |
| Steps today | Splash ("S . E . E . N") → Continue → onboarding → **must create an account** before any story |
| Friction | No explanation of SEEN; no way to look before committing (FB-01, FB-12). Deep links to a story land on onboarding first |
| Missing screens | Introduction ("what / who / why / not social media"), guest mode, sign-up prompt on save |
| Failure path | None designed for "not convinced": visitor leaves |
| Success event | `guest_story_opened` → `signup_completed` |
| Measure | Visitor → first story opened %; visitor → sign-up % |
| Verdict | **Broken for visitors.** P1 |

## 2. Audience: Signup → Minimal onboarding → Explore → Story → Save/Connect → Return

| | |
|---|---|
| Steps today | Language → purpose → role → intent → account → accessibility → presence → threshold → For You ✅ → Story ✅ → Save ✅ → Library ✅ |
| Friction | ~9 screens before value; role asked of people who only want to listen; accessibility asked before they've heard anything |
| Missing | Continue rail on For You; "why this" labels; completion moment |
| Failure paths | Sign-up error inline ✅; offline/error states with retry ✅ |
| Success event | `story_completed`, `story_saved`, return visit within 7 days |
| Verdict | Works, too long. P1 (FB-12) |

## 3. Creator: Signup → Creator setup → Profile → Create → Preview → Publish → Discovery → Opportunity/Support

| | |
|---|---|
| Steps today | Pick Creator at sign-up → Profile → Creator dashboard → 5-step wizard (autosaved single draft) → "Published" (local only) |
| Friction | No creator intro/setup; no Edit Profile on `main`; free-text tags; no review status; the published story is visible only in that browser (no backend) |
| Missing | Become a Creator intro (B), Edit Profile (D), multiple drafts, validation/processing/in-review/failed states (Figma), persistent create entry (D-05) |
| Failure path | Draft autosave ✅; no upload failure handling (no uploads yet) |
| E2E | ❌ no publish E2E (D7) |
| Success event | `story_published` (after review), second story within 60 days |
| Verdict | **Partial, demo-only.** P1, with backend P0 for real creators |

## 4. Returning user: Login → Continue → Discover → Saved → New stories

| | |
|---|---|
| Steps today | Sign in ✅ → For You (no Continue) → Library › In progress → story ✅ |
| Friction | Continue sits 2 taps away; accounts exist only in one browser |
| Missing | Continue rail; cross-device sync (backend) |
| Verdict | Works on one device. P1 |

## 5. Supporter / funder / partner: Discover → Story/Creator → Validate → Opportunity → Contact/Support/Fund

| | |
|---|---|
| Steps today | No supporter role. Creators can browse **real** funding opportunities ✅ and track applications ✅ |
| Missing | Supporter discovery, contact, project funding — all need D-07 |
| Verdict | **Not built by design.** Defer |

## 6. Moderation (Figma journey 7): Story → Report → Confirmation → Review → Decision → Notify → Appeal

| | |
|---|---|
| Today | No Report entry on `main` (exists on D); moderator queue local-only; no appeals |
| Verdict | **P0 before any public launch:** report entry + confirmation + at least an email/queue destination |

## Cross-journey findings

1. Every journey starts with an account wall. Introduce guest mode.
2. Story → creator connection is weak on cards (FB-10).
3. No journey has analytics funnels defined. Measurement framework events added.
4. Reader journey lacks E2E stability ids (known gap D7).
