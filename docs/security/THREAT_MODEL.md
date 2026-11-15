# Threat model (STRIDE, current build + target)

**Assets:** accounts and roles; personal preferences; unpublished drafts; moderation decisions; funding application state; (future) payments and payouts; institutional collections.
**Trust boundary today:** everything runs in the user's browser; `localStorage` is fully user-controlled.

| Threat | Today | Mitigation now | Mitigation required before open beta |
|---|---|---|---|
| **S**poofing — impersonate another user | Accounts are per-browser; no shared server | n/a | Supabase Auth; email verification; rate-limited sign-in (Edge fn already has limiter) |
| **S** — self-assign privileged role | Was possible at onboarding (Moderator) | Fixed: privileged choices become pending requests; stored role wins at sign-in; profile updates can't change role | Roles only in server `role_grants`, changed by an admin RPC with audit |
| **T**ampering — edit localStorage to become admin | Possible (client-only) | UX guard only; documented | Server/RLS enforcement of every privileged read/write |
| **T** — forged funding "applied" | Adapter rejects incomplete checklists | Validation in adapter | Same rule in DB function |
| **R**epudiation — moderation actions deniable | Local only | — | Append-only `moderation_actions` + `audit_log` |
| **I**nformation disclosure — analytics leak PII | Allow-listed events; identifying keys stripped | `observability.ts` + unit test | Same + vendor DPA if a vendor is used |
| **I** — cross-tenant data exposure | No tenancy yet | — | RLS on `org_id`, two-tenant integration tests |
| **I** — card data exposure | Demo checkout collects card fields client-side, never transmitted; accepts test cards only | Test-card-only rule | Stripe Elements/Checkout only — card data must never touch SEEN code |
| **D**enial of service — signup/signin abuse | n/a client-side | — | Edge fn rate limits (present), Supabase Auth rate limits, Vercel firewall |
| **E**levation — call Edge fn admin routes | Edge fn has `requireRole` middleware and origin checks | — | Verify role from DB not token claims; remove `supabase.co` host bypass in CSRF check |
| XSS | React escaping; no `dangerouslySetInnerHTML` in reachable app code¹ | — | CSP header on Vercel (`vercel.json`) |
| Third-party content | Covers hot-linked from Unsplash | Fallback gradient, `loading=lazy` | Host covers in Supabase Storage |

¹ `components/ui/chart.tsx` (shadcn) uses it for generated CSS only.
