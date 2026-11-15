# Branching and release workflow

One repository is the source of truth: `creova-gif/SEEN`. See `REPOSITORY_MAP.md`.

Flow: `feature/*` or `fix/*` → `dev` → `staging` → `main`.

## Branches

| Branch | Purpose | Deploys to | Who uses it |
|---|---|---|---|
| `main` | Production and the testers' build. Always releasable. | https://seen-sigma-eight.vercel.app (Vercel production) | **Testers and the public** |
| `staging` | Release candidate. Receives merges from `dev` when a drop is ready; only bug fixes land here until it ships. | Vercel preview alias `seen-git-staging-creovas-projects.vercel.app` (Vercel login required) | Internal pre-release checks, the team's final smoke test |
| `dev` | Integration branch for ongoing work. May contain merged but unfinished features. | Vercel preview alias `seen-git-dev-creovas-projects.vercel.app` (Vercel login required) | **Developers** |
| `feature/<name>` | One feature, branched from `dev`. | Per-push Vercel preview | Author and reviewers |
| `fix/<name>` | One bug fix, branched from `dev` (or from `main` for a hotfix). | Per-push Vercel preview | Author and reviewers |

`develop` and `release/*` are not used; `dev` and `staging` play those roles.

## Why testers are not disturbed

Vercel deploys only the production branch (`main`) to the production domain. Every other push gets its own preview URL and never replaces the production deployment. `main` changes only when a reviewed merge lands on it, and branch protection (below) enforces that.

Testers always use https://seen-sigma-eight.vercel.app. Send a tester a preview URL only when you want them to try something unreleased. Previews sit behind Vercel SSO protection, so only team members can open them.

## Day-to-day

```bash
git fetch origin
git checkout dev && git pull
git checkout -b feature/search-filters          # or fix/reader-crash
# work, commit small
npm run check && npm run test:e2e               # before opening the PR
git push -u origin feature/search-filters
# open a PR into dev
```

Rules:
- PRs target `dev`, never `main` or `staging` (except hotfixes).
- Squash or merge-commit; do not force-push shared branches.
- One concern per PR. Update docs and the screen matrix in the same PR.
- CI must be green (typecheck, unit tests, build, audit, E2E with accessibility scans).

## Releasing to testers

1. `dev` is green and its preview looks right.
2. PR `dev` → `staging`. Merge. Check the staging preview against the smoke checklist in `docs/release/RELEASE_READINESS.md`. Fix bugs on `staging` only (via `fix/*` PRs into `staging`), then merge `staging` back into `dev`.
3. PR `staging` → `main` with CI green and one approval. Merge: Vercel promotes the build to production.
4. Tag the release: `git tag -a v1.2.0 -m "..." && git push origin v1.2.0`.
5. Keep all three aligned: after a release, `dev` and `staging` should contain everything on `main`.

## Hotfix (production is broken)

1. `git checkout -b fix/<name> main`, fix, add a test.
2. PR into `main`, merge after CI is green.
3. Merge `main` into `staging` and `dev` the same day.
4. To undo a bad release quickly: promote the previous deployment in Vercel (see `ROLLBACK.md`), then fix forward.

## Branch protection (settings to apply on GitHub)

Settings → Branches → rules for `main`, `staging` and `dev`:

- Require a pull request before merging (1 approval for `main` and `staging`).
- Require status checks: `Typecheck · unit tests · build`, `Database RLS tests · secret scan`, `End-to-end journeys`.
- Require branches to be up to date; block force pushes and deletion.
- Do not allow bypass for administrators on `main`.

Repository settings cannot be changed from the development tooling used here; an owner needs to apply them once.

## Branch protection status (checked 2026-10-06)

GitHub reports `main`, `staging` and `dev` as protected. The exact rules cannot be read from the tooling used here (only the protected flag). Observed: direct pushes by the repository owner's account were still accepted, so administrators can bypass the rules or "require a pull request" is not on. Recommended settings, to confirm in Settings, Branches: require a pull request with one approval on `main` and `staging`; require the three CI checks; require branches to be up to date; block force pushes and deletions; on `main`, do not allow administrators to bypass. Lesson recorded: promotions must wait for the GitHub CI run on the branch to pass, not only for local tests and the Vercel build (two promotions on 2026-10-06 went ahead while the end-to-end job was failing; the cause was a layout bug at 320 px with Larger text, fixed in `fix/larger-text-clipping`).

## Required checks before anything is merged into `main`

Required: typecheck, unit tests, production build, end-to-end suite (journeys, route sweep), automated accessibility scans (`e2e/a11y.spec.ts`), and the responsive audit (`e2e/audit/ux-audit.spec.ts`). The CI jobs `Typecheck · unit tests · build` and `End-to-end journeys` cover all of them. Lint becomes required only after the plan in `LINT_PLAN.md` is applied.

## Vercel mapping (verified 2026-10-06)

| Branch | Vercel | URL |
|---|---|---|
| `main` | Production, aliased | https://seen-sigma-eight.vercel.app |
| `staging` | Preview | `seen-git-staging-creovas-projects.vercel.app` (Vercel login) |
| `dev` | Preview | `seen-git-dev-creovas-projects.vercel.app` (Vercel login) |
| `feature/*`, `fix/*` | Preview per push | shown on the commit status |

Only `main` ever updates the production alias. The project has SSO protection on previews and the production domain is excluded from it.

## Naming

`feature/<kebab-name>`, `fix/<kebab-name>`. Tool-generated branches (for example `claude/*`) are fine for short-lived work but must be merged or deleted when done.
