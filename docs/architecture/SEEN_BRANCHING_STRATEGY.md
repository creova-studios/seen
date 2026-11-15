# SEEN — branching strategy

**SEEN — a Creova product.** Status: **proposed** (decision D-08).

## Target workflow

| Branch | Purpose | Deploys to | Rules |
|---|---|---|---|
| `main` | Stable production | Vercel Production | PR from `dev` only (or `fix/*` hotfix); CI green; review required |
| `dev` | Integration and continued development | Vercel Preview (stable URL, e.g. `seen-git-dev-…`) | All feature work merges here first; CI green |
| `feature/<name>` | Scoped feature | Preview per PR | Branch from `dev`, PR to `dev` |
| `fix/<name>` | Defect | Preview per PR | From `dev`; production hotfix from `main`, then back-merged to `dev` |
| `refactor/<name>` | Controlled refactor | Preview | From `dev` |
| `docs/<name>` | Documentation | — | From `dev` |

Agent/tool branches (`claude/*`, `cursor/*`) follow the same rule: branch from `dev`, PR to `dev`.

## Getting there safely (requires approval, none of it done yet)

1. **Backup tags** on every branch head that holds unique work: `backup/2026-10-05/<branch>` (non-destructive).
2. **Fast-forward `dev` to `main`**. `dev` is a strict ancestor of `main` (0 ahead / 28 behind), so this loses nothing and rewrites no history. `staging` likewise, or retire it.
3. Set GitHub default branch for PRs to `dev`; protect `main` and `dev` (no force-push, required CI).
4. Migrate unique work from `claude/dead-code-typecheck-fixes` onto `dev` as `feature/*` PRs (consolidation plan Phase 2).
5. Verify, then close superseded branches: `claude/merge-platform-audit-into-main` (merged), `creova-gif-patch-1` (superseded), `creova-gif-fix-ci-pnpm-workflow` (duplicate), `docs/add-claude-md` (superseded). Their tags keep the history.
6. Dependabot: retarget to `dev`; close stale PRs after lockfile decision (TD-04).

Never: force-push `main`/`dev`, delete a branch without a tag, merge a long-diverged line wholesale.
