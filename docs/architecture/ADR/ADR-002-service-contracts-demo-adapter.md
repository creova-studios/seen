# ADR-002 — Typed service contracts with a swappable demo adapter

**Status:** Accepted (2026-09-23)

**Context.** Figma introduced features with no backend (creators, collections, funding, notifications). The brief requires them to work for real-user testing without fake UI shells, and to switch to a live backend later without rewriting screens.

**Decision.** Screens depend only on `services/contracts.ts` via `api` from `services/index.ts`. The current implementation, `services/demo/adapter.ts`, derives creators/collections from the real story catalogue, seeds labelled demo funding listings, persists user state under `seen.v1.*`, and simulates latency plus `offline`/`error`/`slow` failure modes (`?simulate=`).

**Consequences.** Every state (loading, error, offline, stale, optimistic rollback) is exercised today. Data is per-browser until the Supabase adapter lands. The same contract tests gate the switch.
