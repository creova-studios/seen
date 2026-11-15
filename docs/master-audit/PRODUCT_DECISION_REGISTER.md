# PRODUCT_DECISION_REGISTER.md — SEEN by CREOVA (Phase 1)

**Audit Date:** 2026-11-15

---

## 1. Brand & Product Guardrails (Protected Invariants)

Per Phase 1 operating principles, the following elements define SEEN's identity and **must be retained and protected**:

1. **The Invocation Entry (`S . E . E . N` over atmospheric backdrop)** and **Manifesto (`"This is not social media"` / `"Slow down. Listen deeply."`)** across Web and Native Mobile.
2. **Anti-Feed Editorial Posture:** No public follower counts, no public like counters, no algorithmic rage-bait, and no public comment threads. Reader-to-creator feedback uses rate-limited, private appreciation notes (`public.notes`).
3. **Trilingual First-Class Support (`EN` / `FR` / `ES`)** across onboarding, story metadata, reader chrome, and the public website.
4. **Canadian Creator Ecosystem Integration:** The 12-program Canadian arts/culture/media funding directory (`/#/funding`) and readiness checklist.

---

## 2. Product Change Proposal Matrix

| Change | Problem | Intended User Benefit | Affected Systems | Effort | Risk | Recommendation | Founder Approval Needed |
|---|---|---|---|---|---|---|---|
| **PC-01: Moderated Artist Story Intake (`DRAFT → SUBMITTED → IN_REVIEW → CHANGES_REQUESTED → APPROVED → PUBLISHED`)** | Current wizard publishes immediately (`status = 'published'`), risking unlicensed, incomplete, or unreviewed content appearing publicly. | Gives invited artists editorial support and protects CREOVA and readers with verified rights and quality review. | `supabase/migrations/0006`, `src/app/services/`, `CreatorPublishFlowScreen.tsx`, `CreatorStoriesScreen.tsx` | M | Low | **Implement now (Phase 3 P0)** | **Yes** (Confirm all beta submissions require moderator approval) |
| **PC-02: Mandatory Creator Rights & Consent Attestation (`rights_grants`)** | Creators currently toggle a boolean in `localStorage` with no server-side audit trail of copyright ownership, license scope, or AI/translation consent. | Protects artist copyright while giving CREOVA verifiable legal permission to host and display submitted works. | `supabase/migrations/0006`, `src/app/services/`, `CreatorPublishFlowScreen.tsx` | S | Low | **Implement now (Phase 3 P0)** | **Yes** (Approve legal wording for non-exclusive license & AI/translation opt-in) |
| **PC-03: Single-Use Artist Invitation Tokens (`invitations`)** | `middleware.ts` only checks shared demo gate tokens (`DEMO_INVITE_TOKENS`), and `profiles` locks new users to `'viewer'`. | Allows CREOVA to invite specific artists by email/code and automatically grant `'creator'` privileges upon redemption. | `supabase/migrations/0006`, `src/app/services/`, Web/Mobile Account & Profile screens | S | Low | **Implement now (Phase 3 P0)** | No (Explicitly required by Phase 3) |
| **PC-04: Web-First Artist Studio + Mobile Reader/Draft Companion for Beta v1** | Typing multi-chapter manuscripts and uploading high-res cover art on a phone screen has high friction for invited writers/artists. | Lets CREOVA recruit and onboard artists immediately via Web while iOS/Android closed beta focuses on an exceptional reading, listening, and lightweight draft experience. | `src/app/screens/CreatorPublishFlowScreen.tsx`, `mobile/src/native/screens/Create.tsx` | S | Low | **Retain mobile wizard for drafts, make Web the primary rich intake studio** | **Yes** (Confirm Web vs Mobile creator scope for Beta v1) |
| **PC-05: Defer Interactive Branching Story Authoring & Paid Subscriptions to Post-Beta (P3)** | `SeenOSContext.tsx` contains early `branchChoices` state, and docs mention future monetization, which are not wired end-to-end. | Keeps the closed beta focused on linear multi-chapter stories, audio narration, and collections without dead UI. | `src/app/`, `mobile/` | XS | Low | **Defer to Post-Beta (P3)** | **Yes** (Confirm deferral for Beta v1) |
| **PC-06: Dual-Domain Support (`seen.creova.one` + `seen.verse.one`)** | `https://seen.creova.one` is live today (`HTTP 200`), while `https://seen.verse.one` is configured in `site/` pending DNS resolution. | Ensures zero broken links during brand domain transition. | `site/build.mjs`, `README.md`, CORS config | XS | Low | **Support `SITE_URL` env override and redirect secondary domain to primary** | **Yes** (Confirm canonical production domain) |
