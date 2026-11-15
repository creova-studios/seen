# Environment strategy

| Environment | Where | Data | Purpose |
|---|---|---|---|
| Local | `npm run dev` / `npm run preview` | Browser localStorage, demo accounts | Development |
| Preview | Vercel preview per PR (automatic with Git integration) | Same (per-browser demo) | Review, E2E against the deployed build, CSP report-only check |
| Staging | *To create:* Vercel "staging" custom environment + separate Supabase project | Seeded demo data (`is_demo`), resettable | Pre-release E2E with the live adapter |
| Production | `main` → https://seen-sigma-eight.vercel.app | Real users | — |

## Environment variables

| Variable | Used by | Secret? | Notes |
|---|---|---|---|
| `VITE_DEMO_ACCOUNTS` | web | no | `false` disables seeded demo accounts (set in production once real auth exists) |
| `VITE_TELEMETRY_ENDPOINT` | web | no | Optional URL for `sendBeacon` telemetry |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Edge Function | **service-role key is secret** | Set only in Supabase function secrets, never in Vercel/web |
| `FRONTEND_URL` | Edge Function | no | Allowed origin for CSRF checks |

`VITE_*` values are compiled into the public bundle — never put a secret in one.
The web app reads the Supabase URL and anon key only from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (see `src/app/services/backend.ts`), so staging and production can differ. The old hard-coded copy in `utils/supabase/info.tsx` was unused and is archived under `archive/utils/`.
