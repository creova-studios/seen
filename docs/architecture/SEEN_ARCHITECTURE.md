# SEEN — architecture

**SEEN — a Creova product.** Current and target architecture of the canonical implementation (A). Detail: `SYSTEM_ARCHITECTURE.md`, ADR-001…004.

## Today (`main`)

```
Browser — React 18 SPA (Vite, Tailwind 4) on Vercel static hosting
 ├─ App shell     App.tsx · navigation/routes.ts (hash URLs, role allow-lists) · AppNav · ErrorBoundary
 ├─ UI            components/seen (Figma-bound design system) · screens/ · legacy components/
 ├─ Playback      playback/PlaybackProvider (recorded audio → device voice → unavailable)
 ├─ Feature data  services/contracts.ts ─▶ services/demo/adapter.ts (localStorage seen.v1.*)
 │                services/data/fundingListings.ts (real, sourced listings)
 ├─ Legacy data   data/*Service.ts (localStorage)            ← to converge behind contracts
 ├─ Catalogue     data/storyDatabase.ts (14 story worlds, EN/FR/ES)
 ├─ Auth          contexts/AuthContext (demo, client-only)    ← replace
 └─ Telemetry     observability.ts (allow-listed events, error beacon)

Not connected: supabase/functions/server (CMF-era edge function) · mobile/ (Expo prototype)
```

## Target

```
Vercel SPA ──▶ Supabase
               ├─ Auth (email/password, reset, OTP later, OAuth later)
               ├─ Postgres + RLS (profiles, stories, chapters, saves, progress, follows,
               │                  notifications, reports, opportunities, applications)
               ├─ Storage (covers, audio, transcripts) — private buckets + signed URLs
               └─ Edge functions (moderation actions, notification fan-out, role approval;
                                  payments only after D-07)
```

The swap is one adapter: implement `SeenApi` against Supabase and change `services/index.ts` (ADR-002). Legacy `data/*Service.ts` modules move behind the same contracts first (TD-02).

## Canonical data model (reconciled from code, Figma notes and edge function)

| Entity | Key fields | Source of truth today |
|---|---|---|
| Story | id, creatorId, title{en,fr,es}, synopsis, cover, type (audio/written/film/mixed), languages[], themes[], audience, chapters[], culturalContext{body, source, verifiedBy}, rights{license, holder}, status (draft/submitted/in_review/changes_requested/published/unpublished), visibility | `storyDatabase.ts` (`StoryWorld`) |
| Chapter | id, n, title, durationSec, wordCount, mediaUrl?, transcriptUrl?, captionsUrl?, locked | `CHAPTERS_REGISTRY` |
| Creator profile | handle, displayName, avatar, bio, category, location?, links[], openTo[], supportUrl?, languages[] | derived in `services/demo/catalog.ts` |
| Progress | userId, storyId, chapterId, positionSec, completedAt | localStorage |
| Save / Follow | userId, targetId, createdAt (private) | demo adapter |
| Opportunity | id, funder, type, region, amount range, deadline (published only), deadlineTimeZone, sourceUrls[], verifiedAt | `fundingListings.ts` |
| Application (tracker) | userId, opportunityId, status, checklist | demo adapter |
| Report | id, targetType, targetId, reporterId (private), reason, note | not built |
| Notification | id, type (story/funding/money/moderation), target, read | demo adapter |

Incompatibilities to migrate: mobile `StoryPreview` (string durations), the edge function's KV shapes, and Figma's `type` and `chapters.locked` fields. One schema, written as the Supabase migration.
