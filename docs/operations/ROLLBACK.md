# Rollback

**Web app (Vercel).** Every production deployment is immutable. To roll back: Vercel dashboard → project `seen` → Deployments → previous READY production deployment → *Promote* (or "Instant Rollback"). Current known-good prior deployments: `707b179` (`dpl_6vUmoRecASFYTXrFsKdjeYxdB1eB`) and `caf1af9`. Then revert the offending commit on `main` so the next deploy doesn't reintroduce it.

**Client data.** All state is under versioned `localStorage` keys (`seen.v1.*`, `seenos_*`). A breaking data change must bump the version prefix and migrate or ignore old keys — never throw on unexpected shapes (`readStore` already falls back to defaults).

**Security headers.** CSP ships as Report-Only; if promoting to enforcing breaks a page, revert `vercel.json` only.

**Backend (future).** Forward-only SQL migrations with a paired down-migration script reviewed in the same PR; take a Supabase backup before applying to production; feature-flag new write paths so they can be switched off without a deploy.
