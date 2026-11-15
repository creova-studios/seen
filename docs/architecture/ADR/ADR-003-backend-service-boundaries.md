# ADR-003 — Backend: modular monolith on Supabase, multi-tenant by org_id

**Status:** Accepted with amendment (founder, 6 Oct 2026). Supabase stays the backend; Google is added as a sign-in provider.

**Context.** SEEN will serve individuals, collectives, institutions ("facilities") and funders. The brief asks whether each facility needs its own server and whether to adopt microservices. The repo already contains a Supabase project reference and a Supabase Edge Function; the team is small; traffic is pre-launch.

**Decision.**
1. **One central multi-tenant platform.** Facilities/institutions are rows in `organizations`; tenant data carries `org_id`; isolation is enforced by Postgres Row Level Security, storage bucket policies, role checks inside policies, and an append-only `audit_log`. No per-facility infrastructure unless a specific legal, data-residency or contractual isolation requirement appears (then: a dedicated Supabase project for that tenant, same code).
2. **Modular monolith, not microservices.** Bounded contexts (SERVICE_BOUNDARIES.md) are separated in code and schema with typed contracts, deployed together on Supabase (Postgres + Auth + Storage + Edge Functions). Split a context into its own deployable only when it has a different scaling, reliability or team-ownership need (payments webhooks and search indexing are the likeliest first candidates).
3. **Vercel + Supabase** is the testing and launch stack (Option B). Cloudflare Workers only for a demonstrated edge need (rate limiting, caching).

4. **Google sign-in (amendment, 6 Oct 2026).** The founder chose to keep Supabase and add Google through Supabase Auth's Google OAuth provider, alongside email and password. A move of the database, storage or functions to Google Cloud or Firebase was considered and not chosen; revisit only with a new ADR if a requirement (for example data residency in Canada) cannot be met on Supabase.
5. **Region (D-09, 6 Oct 2026): AWS Canada (Central), `ca-central-1`, Montreal.** The founder asked for the region closest to Niagara Region, Ontario. Supabase offers no Toronto region; Canada (Central) is the nearest Canadian one and keeps personal data in Canada for PIPEDA. US East (N. Virginia) is similarly far from Niagara but would move data out of Canada, so it was not chosen. The region is fixed when the project is created, so create the project in `ca-central-1` from the start. Paid tier still applies once real customers use the beta (Free projects pause after a week idle).

**Free-tier fit for user testing.** Supabase Free (2 projects, 500 MB DB, 1 GB storage, 50k MAU, projects pause after a week idle) and Vercel Hobby are sufficient for moderated testing with tens of users. Upgrade triggers: >300 MB DB or >800 MB storage, any paying users (Hobby is non-commercial), need for daily backups/PITR, or project pausing interrupting a test window. Verify current limits on the vendors' pricing pages before relying on them.

**Consequences.** Lowest operational load; tenancy correctness lives in RLS policies, so they need automated tests (pgTAP or Edge-function integration tests with two tenants). Each context can later be extracted without changing the UI contract.
