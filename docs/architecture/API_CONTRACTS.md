# API contracts

Source of truth: `src/app/services/contracts.ts`. All methods are async and
throw `ServiceError` with `code ∈ not_found | offline | unavailable | forbidden | invalid`.

| Domain | Method | Semantics |
|---|---|---|
| creators | `list()` | All creators with ≥1 public story, sorted by name |
| | `get(id)` | `not_found` if unknown |
| | `listFollowing()` / `setFollowing(id, bool)` | Idempotent; `not_found` for unknown creator |
| collections | `list(kind?)` / `get(id)` | Institutional first, then thematic by size |
| | `listSaved()` / `setSaved(id, bool)` | Idempotent |
| funding | `list()` / `get(id)` | Real listings with `applyUrl`, `sourceUrls`, `verifiedAt`; `availability` = deadline / rolling / upcoming / tba; `deadline` is null unless the funder published it |
| | `listApplications()` / `getApplication(id)` | Missing application ⇒ `status: "none"` |
| | `updateApplication(id, patch)` | `invalid` if `status: "applied"` while steps are incomplete or the intake is not open; steps de-duplicated and range-checked |
| notifications | `list()` | Newest first |
| | `markRead(id)` / `markAllRead()` / `unreadCount()` | — |

## Supabase adapter mapping (planned)

| Contract | Supabase call | RLS policy |
|---|---|---|
| `creators.setFollowing` | `upsert/delete follows` | `user_id = auth.uid()` |
| `collections.setSaved` | `upsert/delete saved_collections` | `user_id = auth.uid()` |
| `funding.updateApplication` | RPC `update_application(opportunity, status, steps)` (server re-validates the applied rule) | owner only |
| `notifications.*` | `select/update notifications` | `user_id = auth.uid()` |

Contract tests (`src/app/__tests__/services.test.ts`) must pass unchanged against the Supabase adapter before it replaces the demo adapter.
