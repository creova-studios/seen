# 03 — Figma → product gap analysis

**SEEN — a Creova product.** Figma file `8WMBpUhanDkUjodZYolyDT`, read through the Figma API on 2026-10-05.

## Correction to the September audit

`docs/audit/FIGMA_AUDIT.md` (2026-09-23) said the file had "no screen or flow frames". **That is no longer true.** The node in the brief (`280:15`) is a canvas called **`19 — PROTOTYPES`** that now contains:

| Group | Frames | Notes |
|---|---|---|
| `13 — PROTOTYPE FLOWS` | 1 board | 7 journeys with failure/back/cancel/loading branches |
| `WALKTHROUGH / …` | 36 | A clickable happy-path copy of the canonical screens |
| Canonical sections (`ONBOARDING`, `DISCOVERY`, `STORY`, `LIBRARY`, `CREATOR`, `FUNDING`, `MONETIZATION`, `INSTITUTIONS`, `TRUST`, `PROFILE`) | ~150 | Each with a **PAGE NOTES** frame: data model, API, states, accessibility |
| Concepts (`… / Concept`, `13-01 … 13-16`) | ~25 | Mood Mixer, Cultural Map, Resonance Quiz, Smart Queue, Listening Wrapped, Impact dashboards… |
| Older generation (kebab-case names, e.g. `sign-up`, `edit-profile`, `cmf-step1`, `archive-home`) | ~110 | Earlier designs; many match Implementations B and D |
| Component masters | 6 | Button, Bottom Navigation, Input, Badge, Toggle, Avatar |

All frames are **mobile (390 px)**. There are **no desktop or tablet frames**.

The `06 — COMPONENTS` design-system page from September is still the token/component source (`docs/design/FIGMA_INVENTORY.md`).

## Design intent captured in the Figma page notes (now product evidence)

- **Onboarding** "establishes the brand, then gets out of the way". Guest path exists. Intent shapes the feed and is never a gate; Role unlocks tools; Admin is never self-selected. Selections save incrementally.
- **Discovery** is "editorial rhythm, not a wall of carousels": never more than two identical rails in a row; one creator row and one funding block; every module can say *why* ("Because you listened to X"). Search is global (from any top bar), not a tab.
- **Story** is "immersive, but never at the cost of control": position saved every 5 s; captions + transcript always available; cultural context is a first-class object with source and "verified by".
- **Library** has one library with six lenses: Saved, Continue, Following, Collections, Downloads and History. History is privacy-controlled.
- **Creator Studio** is about "cultural authorship, not content creation". It is its own stack, **never a consumer tab**. The 5-step wizard autosaves, and a review gate follows submission.
- **Funding**: "SEEN is not a crowdfunding site". It has opportunities plus project funding tied to a real story.
- **Monetization**: "money never surprises". The 8% platform fee is always shown.
- **Institutions** are "stewards, not bigger creators".
- **Trust**: reporting is reason-first, the reporter stays anonymous, every decision is logged, and the enforcement ladder is appealable.
- **Profile** is the 4th consumer tab; everything else is a settings stack.

## A. Figma → application gaps (designed, missing from A)

| Figma | Priority | Source available? | Classification |
|---|---|---|---|
| Report Content sheet + Report Confirmation | **P0** (public launch) | D `ReportContentScreen` | IMPLEMENT (migrate D) |
| Terms & Privacy | **P0** (public launch) | D `TermsPrivacyScreen` | IMPLEMENT (legal text needed) |
| Guest mode ("Continue as guest") + Guest Upgrade Prompt | P1 | D `GuestSignupPromptModal` | IMPLEMENT |
| Introduction screen (what SEEN is) | P1 | — | IMPLEMENT |
| Edit Profile / Profile Builder | P1 | D `EditProfileScreen` | IMPLEMENT |
| Story Completion | P1 | D | IMPLEMENT |
| Become a Creator · Intro | P1 | B `CreatorOnboardingFlow` | IMPLEMENT |
| Library lenses: Continue, Following, Collections | P1 | partial in A | IMPLEMENT |
| Search: scopes (creators/collections), recents, filters sheet, zero-results suggestions | P1 | D search recents | IMPLEMENT |
| Audio player: buffering, playback failed, captions, transcript | P1 | D `MediaPlaybackErrorScreen` | IMPLEMENT |
| Publish: validation errors, processing checklist, in review, failed, multiple drafts | P1 | — | IMPLEMENT |
| Session Expired, Authentication Failed, Offline Auth | P2 | D `SessionExpiredScreen` | IMPLEMENT |
| Settings hub groups, Notification Settings, Privacy & Security, Blocked accounts, Data controls & Delete account, Logout confirmation | P2 | D partial | IMPLEMENT (deletion needs backend) |
| Email verification (OTP), Forgot/Reset password | P2 | D partial | DEFER until real auth |
| Downloads (offline) | P3 | — | DEFER (needs service worker + storage) |
| Funding application workspace + 9 statuses, Funding Readiness Profile, Funding Dashboard | P3 | — | DEFER (needs funder integrations) |
| Project Funding (supporter contributions) | — | — | **NEEDS DECISION** (D-07) |
| Monetization (10 screens) | P3 | mock in A | DEFER (Stripe, legal) |
| Institutions workspace (8 screens) | P3 | B partial | DEFER (no signed partners) |
| Moderation: content review, sensitivity review, decision, appeal, enforcement, rights dispute, audit log | P2 | A queue (local) | DEFER (needs backend + policy) |
| Video player (landscape) | P3 | — | DEFER (no video content) |

## B. Application → Figma gaps (built in A, missing or outdated in Figma)

| In A | Figma status | Classification |
|---|---|---|
| Funding with **real, sourced listings** (verified date, source links, time zones) | Figma shows generic opportunities | UPDATE Figma |
| Device-voice narration fallback + "narration unavailable" state | Not designed | UPDATE Figma |
| Mini player docked above bottom nav (global) | Component exists; no screen shows it docked | UPDATE |
| Notifications centre with 4 live types | `notifications-screen` (old generation) only | UPDATE |
| Explore tabs Stories / Creators / Collections | Explore frame differs | MERGE |
| Funding filters drawer, tracker (save → checklist → applied) | Different tracker concept (13-11) | UPDATE |
| High contrast + reduced motion applied app-wide | Accessibility Settings frame | KEEP (aligned) |
| Moderator role becomes a **request** at sign-up | Notes say Admin server-only; moderator self-select unclear | UPDATE notes |

## C. Deployment ↔ Figma conflicts

| Topic | Figma | Deployed (A) | Better direction |
|---|---|---|---|
| Heading typeface | Fraunces | Inter light | **Founder decision D-04**. A follows the live direction until decided |
| Onboarding length | 10 steps incl. Personalization + Verify | ~9 steps | **Neither** — the feedback asks for fewer. Shorten both |
| Library tabs | 6 lenses | In progress / Completed / Saved | Figma (add Continue, Following, Collections; Downloads later) |
| For You composition | Editorial modules with reasons, funding block | Category rails | Figma |
| Creator Studio entry | Profile / role switcher, never a tab | Profile → dashboard | Figma, pending D-05 (feedback asks for "+ Create") |
| Search | Global from any top bar | Header icon on tab screens | Aligned |
| Real institution names (`06-22 Brock University Partnership`) and `CMF Eligibility Checker` | Present | Removed (no signed agreements) | **Deployed** — keep removed; mark these Figma frames HISTORICAL until agreements exist |
| Desktop | Not designed | Centred mobile column | Neither — design needed (Missing everywhere) |

## D. Missing everywhere (neither Figma nor code)

- **Desktop/tablet layouts** for any screen.
- **Help / support** screen and contact route.
- **Product explanation for visitors**: "What is SEEN / who it's for / why not social media". The Introduction frame exists but has no not-social-media message.
- **Creator "what I'm seeking / how to support me"** fields on profiles (feedback FB-06).
- **Reading time for written stories** (Figma shows listening time only).
- **Playback speed control** in the player.
- **Recommendation controls**, such as "show me less of this" or "why am I seeing this", beyond the module reason label.
- **SEO / Open Graph / share previews** for public stories and profiles.
- **Legal entity attribution** ("SEEN — a Creova product") in footer/legal surfaces.

## Figma artifact classification summary

| Group | Classification |
|---|---|
| Canonical sections (ONBOARDING … PROFILE) + PAGE NOTES | **KEEP**: current design source of truth for flows and states |
| `13 — PROTOTYPE FLOWS` | **KEEP**: becomes the E2E journey list |
| WALKTHROUGH copies | KEEP (prototype) |
| Concepts (`Concept`, `13-xx`) | **HISTORICAL / NEEDS DECISION**: not MVP |
| Older-generation kebab frames | **HISTORICAL**: superseded by canonical sections, except where they're the only design (e.g. `pipeda-data`, `data-export`, `11-20 Rate Limited`). Those are UPDATE |
| Real-org frames (Brock, CMF checker) | **OBSOLETE** until a signed agreement exists |
| `06 — COMPONENTS` page | KEEP (token + component source) |

Figma was not modified during this audit.
