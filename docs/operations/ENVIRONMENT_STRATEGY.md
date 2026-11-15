# Environment strategy

| Environment | Where | Data | Purpose |
|---|---|---|---|
| Local | `npm run dev` / `npm run preview` | Browser localStorage, demo accounts | Development |
| Preview | Vercel preview per PR (automatic with Git integration) | Same (per-browser demo) | Review, E2E against the deployed build, CSP report-only check |
| Staging | *To create:* Vercel "staging" custom environment + separate Supabase project | Seeded demo data (`is_demo`), resettable | Pre-release E2E with the live adapter |
| App Testing (Vercel) | `main` → https://seen-sigma-eight.vercel.app | Installable web export / per-browser demo | App testing channel for testers |
| Public Website | `site/` → https://seen.verse.one | Static EN/FR/ES marketing & legal pages | Customer-facing SEEN website |

## Environment variables

| Variable | Used by | Secret? | Notes |
|---|---|---|---|
| `VITE_DEMO_ACCOUNTS` | web | no | `false` disables seeded demo accounts (set in production once real auth exists) |
| `VITE_TELEMETRY_ENDPOINT` | web | no | Optional URL for `sendBeacon` telemetry |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Edge Function | **service-role key is secret** | Set only in Supabase function secrets, never in Vercel/web |
| `FRONTEND_URL` | Edge Function | no | Allowed origin for CSRF checks |
| `DEMO_INVITE_CODES` | Vercel middleware (server only) | **yes** | Invite codes for the Vercel testing deployment, comma or newline separated. Unset = gate off. Mark Sensitive; never `VITE_`. See `docs/security/DEMO_INVITE_GATE.md` |
| `INVITE_EMAIL`, `INVITE_SITE_URL` | Vercel middleware | no | Optional: where the gate page sends "ask for an invite" (default `support@creova.one`) and its "About SEEN" link (default `https://seen.verse.one`) |

`VITE_*` values are compiled into the public bundle — never put a secret in one.
The web app reads the Supabase URL and anon key only from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (see `src/app/services/backend.ts`), so staging and production can differ. The old hard-coded copy in `utils/supabase/info.tsx` was unused and is archived under `archive/utils/`.
