# Service boundaries

A **modular monolith** on Supabase with microservice-ready seams (ADR-003).
Each context owns its tables, exposes a typed contract, and is testable alone.

| Context | Owns | Contract (today) | Live implementation plan |
|---|---|---|---|
| Identity | users, sessions, role grants, elevation requests | `AuthContext` | Supabase Auth + `role_grants` table; approval Edge Function |
| Profile | display name, language, intent, accessibility prefs | `AuthContext.updateProfile`, `StoryStateContext` | `profiles` table (RLS: owner) |
| Organization / facility | orgs, memberships | `orgId` field on Creator/Collection/Opportunity | `organizations`, `memberships(org_id, user_id, role)` |
| Story / content | story worlds, chapters, media refs | `storyDatabase.ts` / `storyService.ts` | `stories`, `chapters` (+ status, visibility, org_id) |
| Media | covers, audio, transcripts | URLs in story data | Supabase Storage, signed URLs, image transforms |
| Creator | creator directory, follows | `CreatorsApi` | view over stories + `follows(user_id, creator_id)` |
| Collection | curated sets, saves | `CollectionsApi` | `collections`, `collection_items`, `saved_collections` |
| Funding | opportunities, applications | `FundingApi` | `opportunities` (editorially managed), `applications(user_id, …)` |
| Notification | per-user inbox | `NotificationsApi` | `notifications` + triggers/Edge fan-out |
| Subscription / billing | plans, checkout, payouts | `paymentService` (mock) | Stripe via Edge Functions only; no card data touches our servers |
| Moderation | queue, decisions, audit | `ModerationGovernanceSystem` + adminService (local) | `moderation_items`, `moderation_actions` (append-only) |
| Search | query | `searchService` (Fuse.js, client) | Postgres full-text first; external index only if needed |
| Analytics | events | `observability.track` (allow-list) | `sendBeacon` → Edge Function → table or privacy-first vendor |
