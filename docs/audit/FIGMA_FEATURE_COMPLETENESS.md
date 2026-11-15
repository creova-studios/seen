# Figma feature completeness (2026-10-06)

Source: Figma file `8WMBpUhanDkUjodZYolyDT`. The API lists one top-level page (`06 — COMPONENTS`); the screens live on the canvas `280:15` (338 frames), and the prototype wiring is the frame `352:2` "13 — Prototype Flows" (7 journeys, each with failure, back, cancel, retry, empty and loading branches). This document walks each journey and compares it with production at commit `9e3ceed`. The per-frame matrix is `SCREEN_COVERAGE_MATRIX.md`; the feature-level view is `FEATURE_IMPLEMENTATION_MATRIX.md`.

Reading guide. Status: IMPLEMENTED, PARTIAL, MISSING, DESIGNED ONLY, BACKEND BLOCKED, OBSOLETE. "Intentionally changed" means production deliberately differs from Figma and the production behaviour wins.

## Journey 1: Viewer, first listen
Figma path: Splash, Language, Introduction, Intent, Role, Personalization, Accessibility, Sign up, Completion, For You, Story World, Chapter 1 player, Save, Library.

| Step or branch | Production | Status |
|---|---|---|
| Splash, Introduction, Intent, Role, Personalization, Accessibility, Completion | Merged on purpose into "What brings you to SEEN?" and "What are you interested in?". Accessibility settings moved to Settings. Completion removed (sign-up goes straight to For You) | Intentionally changed (onboarding 9 to 4 screens) |
| Language, Sign up | Language screen, Account step | IMPLEMENTED |
| Back on every onboarding step | Back plus "Step n of 3" | IMPLEMENTED |
| Sign-up error, email exists, offline sign-in message | Inline errors, "sign in instead" prompt, offline banner | IMPLEMENTED |
| OTP wrong or expired, resend | Needs Supabase Auth | BACKEND BLOCKED |
| "Skip" at Language to guest For You; "Continue as guest" anywhere | An account is required; there is no guest mode | PRODUCT DECISION (guest browsing) |
| For You skeleton, player buffering, Library empty ("Nothing saved yet") | `ResourceView` skeletons, buffering alert, Library empty states | IMPLEMENTED |
| Library sync banner | Library is device-local; there is no sync | BACKEND BLOCKED |
| Player back keeps position | Progress is saved per chapter | IMPLEMENTED |

## Journey 2: Discovery, find and follow
| Step or branch | Production | Status |
|---|---|---|
| Explore, filter chips, culture browse, story grid | Explore (Stories, Creators, Collections tabs); topic/category rails; Search has a Filters sheet (language, length, theme) | IMPLEMENTED (filters live in Search, not as chips on Explore) |
| Story World, Follow creator, Creator profile | Story preview, creator profile with Follow, Library Following | IMPLEMENTED |
| "For You (updated)" after following | Following is stored and shown in Library; For You is not re-ranked by follows | PARTIAL |
| Search fails, zero results with suggestion and "Browse all", offline cached search | Zero-results state, suggestions, error and retry. No cached/offline search | PARTIAL (offline search needs a client-side cache: DEFER) |
| Back restores scroll on Explore | App scrolls to top on route change; scroll position is not restored | MISSING (small) |

## Journey 3: Creator, publish a story
| Step or branch | Production | Status |
|---|---|---|
| Profile, Creator Studio, New Story | Profile creator card, Your stories, New story | IMPLEMENTED |
| Steps 1 to 5 (Intent, Structure, Media, Context and Accessibility, Preview) | Five-step wizard with "Next: X", autosave to a draft, one resumable draft | IMPLEMENTED |
| Media upload with chunk resume; upload progress | Media is attached by pasting a URL | BACKEND BLOCKED (needs storage) |
| Validate, Submit, Processing, In Review (2 to 3 days), Changes requested, Published | Publishing is immediate and local. No review queue for creator stories, no processing, no "changes requested" | BACKEND BLOCKED, PRODUCT DECISION (do creators publish directly or via review?) |
| Close (X) saves a draft; "Continue a draft" | Draft kept and listed under Your stories, Drafts | IMPLEMENTED |
| Accessibility metadata | Image description (required or decorative), captions and transcripts confirmation, content notes | IMPLEMENTED (this phase) |

## Journey 4: Funding, apply to an opportunity
| Step or branch | Production | Status |
|---|---|---|
| Funding hub, Opportunity detail | Real researched listings, filters, My tracker, summary tiles | IMPLEMENTED |
| Eligibility check | Per-criterion Yes / Not sure / No with "the funder decides" | IMPLEMENTED |
| Save this opportunity | Save and track | IMPLEMENTED |
| Start application, Application workspace, Upload documents, Budget, Review and Submit | Funders take applications on their own sites. SEEN offers a checklist, private notes and "Mark as applied" | Intentionally changed (SEEN does not submit for the user) |
| Submitted, Under review, Shortlisted, Approved, Declined | User-recorded outcomes labelled "tracked by you" | Intentionally changed (SEEN receives no funder decisions) |
| Interview time, "Upload the consents", "Read the feedback" | Would need funder integration | OBSOLETE for SEEN, DEFER |

## Journey 5: Monetization
| Step or branch | Production | Status |
|---|---|---|
| Earnings, setup, accept terms, payment account, overview | Creator earnings, monetization and subscription screens exist on demo data; checkout accepts test cards only | PARTIAL, BACKEND BLOCKED (payment provider) |
| Payout, pending, complete, bank rejection, tax details | Not real | BACKEND BLOCKED |

## Journey 6: Institution, catalogue and publish
Institution workspace, collection management, metadata and rights, preservation, curator review: not built. Institutional collections are shown read-only. Decision D-12: needs signed partners. Status: DESIGNED ONLY, PRODUCT DECISION.

## Journey 7: Moderation, report to resolution
| Step or branch | Production | Status |
|---|---|---|
| Report, reason, confirmation | Report sheet, always confirms | IMPLEMENTED |
| Queue, content review, decision | Moderator queue and governance screens (demo data, role-guarded) | PARTIAL |
| Cultural sensitivity review, notify creator and reporter, appeal window, audit log, warnings 1/2/3, 30-day pause, suspension | Guidelines text mentions appeals by email; no appeal workflow or enforcement ladder | BACKEND BLOCKED |
| Restricted-content interstitial with reason | Unavailable-story screen exists; no reason-based interstitial | PARTIAL |

## Other Figma pages and components
- Components page `06 — COMPONENTS`: every component set implemented and used (`docs/design/FIGMA_INVENTORY.md`).
- Multilingual frames (`home-french`, `fr-settings`, `fr-signup`, `es-signup`, Explorer and Bibliotheque in French): EN, FR and ES strings exist for the app shell, settings, notes, reports and new screens. Many older components still show English only. PARTIAL.
- Loading, error, empty, offline states: implemented through `ResourceView` and `StateTemplate`.
- Concept screens (Cultural Resonance Quiz, Mood Mixer, Cultural Map, Wrapped, Smart Queue, Heatmap, Milestones, Impact and Content Health dashboards, Rate Limited, Suspended User): DESIGNED ONLY; excluded with reasons in the matrix.
- Downloads and offline listening (`offline-downloads`, `offline-mode`): the Account screen exports data; there are no offline downloads. DESIGNED ONLY, BACKEND BLOCKED (needs a service worker and media storage).

## Summary
| Bucket | Items |
|---|---|
| Implemented | Language, tap-only onboarding, For You, Story World, player (speed, captions, transcript), Save, Library (Saved, Continue, Following, Collections), Explore, Search with filters and zero results, creator profile and follow, Create Story wizard with drafts and accessibility metadata, Funding with eligibility and tracker, report flow, Settings, Account and privacy |
| Partial | For You not re-ranked by follows; offline search; moderation queue; multilingual coverage of older components; restricted-content interstitial |
| Missing (small) | Scroll restoration on Explore back |
| Designed only | Offline downloads, shared collections, concept screens, institution workspace |
| Backend blocked | OTP, library sync, media upload with resume, creator review pipeline, payouts, moderation appeals and enforcement |
| Obsolete or intentionally changed | Original 9-screen onboarding, in-app funding application workspace and funder statuses |
| Product decisions | Guest mode, creator publish-with-review, moderator access, institutions, News vs Media |
