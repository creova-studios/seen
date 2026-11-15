# System architecture

## Today (user-testing release candidate)

```
Browser (React SPA on Vercel static hosting)
 ├── UI: screens + components/seen design system
 ├── App shell: routes.ts (hash URLs, role allow-lists) · AppNav context · ErrorBoundary
 ├── Feature data: services/contracts.ts ──▶ services/demo/adapter.ts
 │                                           ├─ derived from storyDatabase.ts (12 story worlds)
 │                                           └─ persisted to localStorage (seen.v1.*)
 ├── Legacy data: storyService / userDataService / userStoriesService (localStorage)
 ├── Auth: AuthContext (local demo accounts, hashed passwords in localStorage)
 └── Telemetry: observability.ts (ring buffer; optional sendBeacon endpoint)

Legacy Hono Edge Function — archived to archive/supabase/functions/server (ADR-001); never called by the web app,
no longer in supabase/functions, so it cannot be deployed from the active tree
```

Consequences to state plainly: data is per-browser; two testers never see each
other's follows or moderation actions; authorization is a UX guard, not
security. This is acceptable for moderated usability testing and **not** for
an open beta.

## Target (production)

```
Vercel (SPA) ──HTTPS──▶ Supabase
                         ├─ Auth (email/password, magic link/OTP, OAuth)
                         ├─ Postgres + RLS (org_id tenancy; role checks in policies)
                         ├─ Storage (covers, audio) with bucket policies
                         └─ Edge Functions: payments (Stripe webhooks), notifications fan-out,
                            role approval, moderation actions, search index refresh
```
Swapping in the live backend = implementing `SeenApi` with a Supabase adapter
and changing one line in `services/index.ts` (ADR-002). Decision record for
boundaries and tenancy: ADR-003.
