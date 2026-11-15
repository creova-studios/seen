# Data retention and deletion matrix (ENG-E3)

Account deletion is `delete_my_account()` (idempotent, `supabase/migrations/0001_core_schema.sql`), tested in `supabase/tests/rls.test.sql`. Owner: founder with legal review (PIPEDA) before real customers sign up.

| Data | On account deletion | Why |
|---|---|---|
| auth user, profile | Deleted | Identity |
| Stories and chapters authored | Deleted (cascade) | Author's own content |
| Notes sent | Deleted (cascade) | Sender's personal data |
| Notes received | Deleted (cascade) | Creator account is gone |
| Blocks, notification preferences | Deleted (cascade) | Personal settings |
| Reports filed | Retained, reporter anonymised (`reporter_id` null) | Moderation evidence; no personal link remains |
| Reports about the account | Retained | Moderation record |
| Audit log rows | Retained, actor anonymised | Accountability of staff actions |
| Offline cache on other devices | Expires by TTL (14 days); cleared on sign-out; revalidated when online | The server cannot reach other devices |
| Demo-adapter local data | Cleared on this device by the in-app delete | Local only |

Open items for legal review: retention period statement, whether reports about a deleted creator are kept, and export format (JSON) wording.
