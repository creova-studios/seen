# Archived Supabase code

`functions/server/` is the legacy Hono Edge Function (KV store, CMF and governance modules). The web app never called it, and it is not deployable from here: the Supabase CLI deploys from `supabase/functions/`, which no longer holds it (ADR-001, archive instead of delete).

Do not import from this folder or move it back without a decision. Before real signups, make sure no copy is still deployed in the Supabase dashboard (Edge Functions list); if one is, undeploy it.

Known problems in this code, kept for the record: the signup route logged the request body (including the password), and signup accepted a client-chosen role. The current database enforces roles itself (`supabase/migrations/0001_core_schema.sql`).

`../utils/supabase/info.tsx` is an unused copy of the project id and public anon key; the app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` instead.
