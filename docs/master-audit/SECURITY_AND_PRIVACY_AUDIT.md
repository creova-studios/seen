# SECURITY_AND_PRIVACY_AUDIT.md — SEEN by CREOVA

**Audit Date:** 2026-11-15

---

## 1. Security Strengths Already Present

1. **Row-Level Security & Column-Level Grants ([0001_core_schema.sql](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql)):**
   - Every table in `public` has RLS enabled (`profiles`, `stories`, `chapters`, `blocks`, `notes`, `reports`, `audit_log`, `notification_prefs`).
   - Column-level `REVOKE`/`GRANT` prevents clients from writing `profiles.role` ([0001_core_schema.sql#L21-L23](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L21-L23)), reading `notes.sender_id` ([0003_adapter_columns.sql#L12-L13](file:///Users/justinmafie/seen-v1/supabase/migrations/0003_adapter_columns.sql#L12-L13)), or writing directly to `audit_log` ([0001_core_schema.sql#L166-L167](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L166-L167)).
2. **Database-Enforced Rate Limits & Input Constraints:**
   - `notes_before_insert()` enforces 1 note per `(sender_id, story_id, hour_bucket)`, max 20 notes/24h, control-character rejection, and block-list enforcement ([0003_adapter_columns.sql#L15-L31](file:///Users/justinmafie/seen-v1/supabase/migrations/0003_adapter_columns.sql#L15-L31)).
   - `reports_before_insert()` enforces max 20 reports/24h and one open report per `(reporter_id, target_type, target_id)` ([0001_core_schema.sql#L139-L154](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L139-L154)).
3. **GDPR / PIPEDA / Law 25 Account Deletion Cascade:**
   - `public.delete_my_account()` deletes the caller's `auth.users` row, cascading `profiles`, `stories`, `chapters`, `notes`, `blocks`, and `notification_prefs` while anonymizing `reports.reporter_id` and `audit_log.actor_id` via `ON DELETE SET NULL` ([0001_core_schema.sql#L194-L201](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L194-L201)).
4. **Constant-Time Edge Invite Gate ([inviteGate.ts](file:///Users/justinmafie/seen-v1/src/gate/inviteGate.ts)):**
   - Uses constant-time byte comparison and `HttpOnly; Secure; SameSite=Lax` cookies.

---

## 2. Security & Privacy Findings (Prioritized)

| ID | Severity | Finding | Evidence | Remediation |
|---|---|---|---|---|
| **SEC-01** | **CRITICAL** | **Unmoderated Direct Story Publication via PostgREST:** Authenticated users can insert or update `public.stories` with `status = 'published'` directly, bypassing editorial review and rights verification. | [0001_core_schema.sql#L46-L52](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L46-L52) | Restrict direct `stories` insert/update by authors to `status in ('draft', 'withdrawn')`; require `submit_story_for_review()` (which verifies a `rights_grants` row) and staff-only `review_story_submission()` to transition to `approved` / `published` (Migration `0006`). |
| **SEC-02** | **HIGH** | **Role Assignment Restricted to `'viewer'` Without Invitation Redemption:** `profiles_insert_self` locks all new users to `'viewer'` with no server-side path for invited artists to become `'creator'`. | [0001_core_schema.sql#L16-L23](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L16-L23) | Add `public.invitations` table (SHA-256 token hash, expiry, single-use) and `redeem_artist_invitation(raw_token text)` `security definer` RPC that promotes `profiles.role` to `'creator'` and logs to `audit_log` (Migration `0006`). |
| **SEC-03** | **HIGH** | **Missing Immutable Creator Rights Grant Record:** Stories can be created in DB without a server-verified record of copyright ownership, non-exclusive license grant, and AI/translation consent. | [0001_core_schema.sql#L30-L40](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql#L30-L40) | Add `public.rights_grants` table (append-only, linked to `story_id` and `author_id`) enforced by `submit_story_for_review()` before a story can leave `'draft'` (Migration `0006`). |
| **SEC-04** | **MEDIUM** | **Client-Side Demo Auth Uses Static Salt in `localStorage`:** `authService.ts` hashes passwords with `"seen_salt_v1"` in `localStorage`. Safe for offline demo, unsafe if mistaken for real auth. | [authService.ts](file:///Users/justinmafie/seen-v1/src/app/data/authService.ts) | Clearly label demo mode in UI (`Dismiss demo mode notice` banner is already present) and use Supabase Auth PKCE + `expo-secure-store` for real accounts. |
| **SEC-05** | **MEDIUM** | **Mobile Session Stored in Unencrypted `AsyncStorage`:** `seen.native.v1` and `seen.native.accounts.v1` use `AsyncStorage`. | [mobile/src/native/storage.tsx](file:///Users/justinmafie/seen-v1/mobile/src/native/storage.tsx#L30-L35) | Store Supabase Auth session tokens in `expo-secure-store` when wiring mobile to Supabase in Phase 4. |
| **SEC-06** | **LOW** | **CSP is `Report-Only` on Vercel Deployment:** `vercel.json` sets `Content-Security-Policy-Report-Only`. | Live probe of `https://seen-sigma-eight.vercel.app` | Promote to enforcing `Content-Security-Policy` after verifying zero violations across web and Expo web export. |
