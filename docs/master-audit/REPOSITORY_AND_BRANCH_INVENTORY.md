# REPOSITORY_AND_BRANCH_INVENTORY.md — SEEN by CREOVA

**Audit Date:** 2026-11-15  
**Authoritative Remote:** `origin` → `https://github.com/creova-studios/seen.git`

---

## 1. Authoritative Repository & Naming Reconciliation

- **Canonical GitHub Organization & Repo:** `creova-studios/seen` (`https://github.com/creova-studios/seen.git`).
- **Local Directory Name:** `/Users/justinmafie/seen-v1` (historical local clone name).
- **Package Name:** Root [package.json](file:///Users/justinmafie/seen-v1/package.json) was historically named `"figma-make-export"` (`0.0.1`) from an early Figma Make export; normalized to `"seen"` (`1.0.0`).
- **Authoritative Branch:** `main` (`c7cd64e`).

---

## 2. Local & Remote Branch Inventory

| Branch | Commit / State | Purpose & Disposition |
|---|---|---|
| `main` (`origin/main`) | `c7cd64e` | **Authoritative trunk.** Had merge regressions from `a325ad9` and `9154331` (fixed on `feat/master-audit-and-artist-intake`). |
| `feat/master-audit-and-artist-intake` | Active working branch | **Current execution branch** containing repaired `main`, `site/`, `middleware.ts`, `verify-seen` skill, Phase 0–2 audits, and Phase 3 artist intake foundation. |
| `feature/seen-website` | `5d6f151` | Source of `site/` static website generator and `PHOTO_RELEASES.md` (ported into current branch). |
| `feature/demo-invite-gate` | `8759457` | Source of `middleware.ts`, `src/gate/inviteGate.ts`, and `DEMO_INVITE_GATE.md` (ported into current branch). |
| `feature/guest-mode-and-create-tab` | `2c462f8` | Merged into `main` at `2c462f8`. |
| `feature/beta-foundation` (`origin/feature/beta-foundation`) | Historical | Early Supabase schema & safety adapter branch (already merged into `main`). |
| `origin/staging`, `origin/dev` | Promotion branches | Target branches referenced in [.github/workflows/ci.yml](file:///Users/justinmafie/seen-v1/.github/workflows/ci.yml#L6) and [BRANCHING.md](file:///Users/justinmafie/seen-v1/docs/operations/BRANCHING.md). |
| `origin/claude/*`, `origin/cursor/*`, `origin/creova-gif*` | Historical agent branches | Preserved on remote per Operating Principle 10 (no remote deletions without explicit founder authorization). |

---

## 3. Tags

- `git tag -l` returns **no tags** (`0` release tags currently in repository).
- **Recommendation:** Tag milestones starting at `v0.1.0-m0` once `feat/master-audit-and-artist-intake` merges to `main`.
