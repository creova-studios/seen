# ADR-004 — Hash-based URLs over a router dependency

**Status:** Accepted (2026-09-23)

**Context.** The app had no URLs: back left the app, refresh lost place, nothing was shareable. Screens are driven by a single state variable in `App.tsx` with enter/exit animations via `AnimatePresence`.

**Decision.** Keep the state-driven shell, mirror it into `history.pushState` with hash URLs (`routes.ts`), and restore on `popstate`. No router library; no server rewrites needed on Vercel.

**Consequences.** Back button, refresh and deep links work with minimal churn and no new dependency. If SEO or server rendering becomes a goal, migrate to path URLs with a router and a Vercel rewrite; `toHash`/`fromHash` isolate that change.
