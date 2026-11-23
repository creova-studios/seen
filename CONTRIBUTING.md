# Contributing to SEEN by CREOVA

SEEN is a proprietary multi-surface platform developed by **CREOVA Studios**. Authorized engineers and collaborators must follow the branch, verification, and security rules below.

## 1. Branching Model

See [`docs/operations/BRANCHING.md`](docs/operations/BRANCHING.md) for full details:
- `feature/*` and `fix/*` branches are created from `dev` and merged back via Pull Request.
- `dev` promotes to `staging`, which promotes to `main` after release verification.

## 2. Verification Gates (Definition of Done)

Before opening or merging a Pull Request, run the verification suite locally:

```bash
# 1. Web & Shared Core (TypeScript + Vitest 240 tests + Vite production build)
npm run check

# 2. PostgreSQL 16 migrations + adversarial RLS test suite + secret scan
npm run test:db
bash scripts/secret-scan.sh

# 3. Native Mobile App (Expo SDK / React Native typecheck + Jest suite)
cd mobile && npm run typecheck && npx jest && cd ..

# 4. Static Public Website (seen.verse.one — 28 node:test checks)
cd site && npm run check && cd ..
```

## 3. Security & Privacy Standards

- Never commit `.env` files, API keys, or hardcoded Supabase tokens (`scripts/secret-scan.sh` enforces this in CI).
- Any schema change under `supabase/migrations/` must include corresponding positive and adversarial RLS tests in `supabase/tests/rls.test.sql`.
- Maintain WCAG 2.2 AA accessibility compliance across all web and native screens (`SEEN_ACCESSIBILITY_STATUS.md`).
