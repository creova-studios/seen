# 09 — SEEN security & privacy audit

**SEEN — a Creova product.** Builds on `docs/security/SECURITY_AUDIT.md` (2026-09-23, findings S1–S10) and re-checks `main@a35a8f1`. No secret values are recorded here.

## Must fix before an open/public launch (P0)

| ID | Area | Finding | Fix |
|---|---|---|---|
| SP-01 | Authentication | Accounts live in the browser (localStorage), passwords hashed client-side with SHA-256 + static salt | Supabase Auth (ADR-003); delete local account store |
| SP-02 | Authorization | Roles enforced only in the UI; a user can edit their own role in storage | RLS policies + server-side role assignment; two-tenant tests |
| SP-03 | Reporting / moderation | No way to report content on `main` | Migrate D `ReportContentScreen` + server queue |
| SP-04 | Legal / privacy | No privacy policy or terms in the app; analytics and storage disclosed nowhere | Migrate D `TermsPrivacyScreen` with reviewed text; data inventory below |
| SP-05 | Session handling | No expiry or refresh (demo token) | Supabase sessions + Session Expired screen (D) |

## Should fix before broader beta (P1/P2)

| ID | Finding | Priority |
|---|---|---|
| SP-06 | CSP in **Report-Only**; promote to enforcing after a clean preview | P1 |
| SP-07 | Supabase project id + anon key committed (`utils/supabase/info.tsx`); public by design but must sit behind RLS and env config | P2 |
| SP-08 | Edge function CSRF bypass trusts any `Host` containing `supabase.co` (S8) — fix before deploying that function, or don't deploy it | P1 if deployed |
| SP-09 | Rate limiting / abuse: none (no backend). Needed for sign-up, report and responses | P1 with backend |
| SP-10 | Uploads: publish wizard accepts no real files yet. When added: type/size limits, malware scan, private buckets + signed URLs | P1 with backend |
| SP-11 | Cover images hot-linked from Unsplash (privacy leak of IP to third party; reliability) | P2 |
| SP-12 | Lockfile not committed: dependency drift and supply-chain risk | P1 |

## Privacy data inventory (today)

| Data | Where | Personal? | Notes |
|---|---|---|---|
| Name, email, password hash, role, language, intent | localStorage | Yes | Moves to Supabase |
| Reading progress, saves, follows, funding tracker, notifications | localStorage `seen.v1.*` | Yes (behavioural) | Moves to Supabase; export/delete needed (Figma Data controls) |
| Analytics events | in-memory ring buffer; optional beacon | Pseudonymous ids/enums only | Allow-list enforced and unit-tested |
| Error reports | optional beacon | No PII by design | Sink not chosen |
| Cookies | none set by SEEN | — | Vercel may set its own |

**Canada:** PIPEDA applies (Figma has `pipeda-data` / `pipeda-delete-confirm` frames). Data export and delete-account flows are required once real accounts exist.

## Verified clean today

- Secret scan: no private keys or service-role keys.
- `npm audit --omit=dev`: 0 vulnerabilities.
- No `dangerouslySetInnerHTML` in app code.
- Demo data labelled.
- No unverified partner names on `main`.
