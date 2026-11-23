# Repository Engineering & AI Agent Contract (`AGENTS.md`)

## 1. Decision Hierarchy
1. Verified repository code, lockfiles (`package-lock.json`, `mobile/package-lock.json`), and passing tests
2. Accepted ADRs in `docs/adr/` (`ADR-001`, `ADR-002`, `ADR-003`)
3. Repository-specific constraints in this file, `CLAUDE.md`, and `.ai/project.yaml`
4. Shared Engineering Governance Standard (`v1.0`)

## 2. Hard Invariants for All Agents (Antigravity, Devin, Claude, Codex, GStack)
- **Epistemic Honesty:** Never claim a feature, model, compliance standard, or cloud integration is implemented if backed by mocks, timers, or stubs. Distinguish the default per-browser `demo` adapter (`src/app/services/demo/`) from the live PostgreSQL 16 `supabase` RLS adapter (`src/app/services/supabase/`) explicitly.
- **No Unapproved Dependencies:** Do not add runtime packages without explicit task approval and deterministic lockfile updates (`package-lock.json` / `mobile/package-lock.json`), verified via `npm ci`.
- **No Harness or Asset Pollution:** Never commit `gstack/`, `attached_assets/`, `mockup-sandbox/`, `archive/`, `dist/`, `site/dist/`, `mobile/dist/`, or `.env` files.
- **Security Fail-Closed:** Never introduce fallback secrets, hardcoded Supabase JWTs, unverified JWT decoding, wildcard credentialed CORS, or `USING (true)` tenant RLS policies. Role protection (`viewer`, `creator`, `moderator`, `admin`) and story moderation state transitions are enforced inside PostgreSQL 16 RLS and `security definer` RPCs (`supabase/migrations/0001..0006`).
- **PR & Verification Discipline:** Place imports at module top. Never commit directly to `main`. Every change must run typecheck, unit tests, and build locally and land via an atomic Conventional Commit pull request.

## 3. Verification Gates (Definition of Done)

```bash
# Web & Shared Core
npm ci
npm run check                # tsc --noEmit + Vitest + Vite build

# Public Website (site/)
npm --prefix site run check  # 28 node:test checks (EN/FR/ES parity, CSP, links, zero trackers)

# Native Mobile App (mobile/)
cd mobile && npm ci --legacy-peer-deps && npm run typecheck && npx jest && cd ..

# PostgreSQL 16 Migrations, Adversarial RLS & Secret Scan
npm run test:db
bash scripts/secret-scan.sh
```
