# Showing SEEN now, restoring Supabase later

**Today:** the live app runs on the demo adapter (data stored in each visitor's browser). It needs no server, so a paused Supabase project does not affect it. Switch: `src/app/services/backend.ts` stays on demo unless `VITE_BACKEND=supabase` and the URL and anon key are set.

**The project:** `seen`, ref `cddipfbiqnxouvgsndly`, region ca-central-1 (Montreal), status paused. Resuming from the dashboard is free until 16 Jul 2027; data, backups and storage are kept. A free project pauses again after a week without activity. Pro (no auto-pause, daily backups) is only needed once real customers use it.

**When ready to restore (about 30 minutes, no code changes):**
1. Dashboard > project `seen` > Restore project. Wait for status Healthy.
2. Settings > API: copy the project URL and the anon (public) key. Never copy the service key into the repo or Vercel.
3. Apply every file in `supabase/migrations/` in order, 0001 to 0004 (SQL editor or `supabase db push`). Run `npm run test:db` locally first; it runs the same files against a throwaway Postgres.
4. Authentication > Providers > Google: add the OAuth client ID and secret. Add redirect URLs for production and Vercel previews. Google's consent screen review can take days, so start it early.
5. Vercel > Environment variables: `VITE_BACKEND=supabase`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GOOGLE_AUTH=true` (shows the Google button), and for share previews `SUPABASE_URL`, `SUPABASE_ANON_KEY`. In Authentication > URL configuration set the Site URL and add redirect URLs for production and Vercel previews. Redeploy.
6. Run the checklist in `docs/release/BACKEND_CUTOVER.md` (staging first, flag flip is reversible, demo data is discarded with a notice).

**What the switch covers (built and tested against a fake database and a local Postgres):** sign-in with email and password and Google (Supabase Auth, PKCE), profiles created by a database trigger, reports, blocks, private notes (sender hidden from the creator), notification preferences. The demo screens' creators, collections, funding and notifications still come from the static catalogue; they have no tables yet.

**Not exercised yet:** nothing has run against a live Supabase project (it is paused), so the first run after restoring is the real test. Expect to fix small things (redirect URLs, email confirmation setting: with confirmation on, sign-up shows "check your email" and the person signs in after confirming). Role requests (moderator, admin) are not available in this mode; staff roles are set by an admin in the dashboard.
