# SEEN — canonical implementation decision

**SEEN — a Creova product.** Status: **recommendation, awaiting approval** (D-01, D-03).

## Candidates

- **A** — `main` / `src/` web app (production)
- **B** — `archive/` + `claude/platform-audit-OKLXV` (earlier web screens)
- **C** — `mobile/` Expo app
- **D** — `claude/dead-code-typecheck-fixes` (parallel line of A, diverged 2026-09-01)
- **N** — a new fourth application. Listed only to reject it

## Weighted decision matrix (1 = poor, 5 = strong)

| Criterion | Weight | A | B | C | D | N |
|---|---|---|---|---|---|---|
| Closeness to preferred deployment | 15 | **5** (is the deployment) | 2 | 2 | 3 | 1 |
| Architecture (routing, contracts, separation) | 10 | **4** | 1 | 2 | 3 | ? |
| Maintainability | 10 | **4** | 1 | 3 | 3 | ? |
| Feature completeness | 10 | **4** | 2 | 1 | 3 | 0 |
| Accessibility | 10 | **4** (axe in CI, AA tokens) | 1 | 2 | 4 | ? |
| Testability / tests | 10 | **5** (64 unit + 33 E2E) | 1 (archived tests) | 1 (none) | 2 | 0 |
| Performance | 5 | 4 | 2 | 3 | 3 | ? |
| Security posture | 5 | 3 (demo auth, guards, headers) | 1 | 1 | 2 | ? |
| Migration cost (lower cost = higher score) | 10 | **5** (none) | 2 | 1 | 3 | 0 |
| Design-system quality | 5 | **5** (Figma-bound tokens) | 1 | 2 | 2 | ? |
| Deployment reliability | 5 | **5** | 1 | 2 | 3 | ? |
| Developer experience | 5 | 4 | 1 | 3 | 3 | ? |
| **Weighted score (/500)** | 100 | **440** | 140 | 185 | 290 | — |

## Recommendation

**A (`main`) is the canonical SEEN codebase.** It is the deployed direction, has the strongest architecture and test coverage, and costs nothing to adopt.

- **Do not migrate A's UI into another implementation.** Migrate the *missing functionality* into A.
- **D is a parts donor.** Its ~20 unique screens and `useDialogA11y` move into A one feature at a time. Each is restyled onto `components/seen`, connected to `useResource`/contracts, and tested. D is not merged wholesale, because App.tsx and routing diverged.
- **B is a reference library.** Creator onboarding, creator insights and the branch map are migrated when their backlog items come up. The real-institution screens (Brock) stay archived.
- **C (mobile)** stays a separate prototype, frozen until founder decision D-03. Options: (1) pause; (2) wrap the web app as a PWA / store wrapper; (3) continue native against the same Supabase backend later.
- **The edge function** stays as reference only. The new backend is Supabase + contracts (ADR-003).
- **No fourth application.**
