# 00 — SEEN environment & Git baseline

**SEEN — a Creova product.** Recorded 2026-10-05 (UTC). Every fact below was gathered from the repository, GitHub and the Figma API in this session; unknowns are labelled.

## Repository

| Item | Value |
|---|---|
| Remote | `origin` → `github.com/creova-gif/SEEN` (single remote) |
| Root | repository root holds the web app (`src/`), the Expo app (`mobile/`), an unwired backend (`supabase/`), archived code (`archive/`) and docs |
| Working branch for this audit | `claude/clever-gates-cs9out` (clean tree; contents equal to `main` after PR #22 was squash-merged) |
| Uncommitted / untracked work | None tracked. `dist/`, `test-results/`, `node_modules/` are build/test output and git-ignored |
| Tags | **None.** No release or backup tags exist |
| Tracked files | 424 (151 under `src/`) |

## Branch topology (remote)

`main` is production. Counts are commits ahead/behind `main` on 2026-10-05.

| Branch | Last commit | Ahead / behind `main` | What it holds | Status |
|---|---|---|---|---|
| `main` | 2026-10-05 `a35a8f1` | — | Canonical web app; deploys to production | **Production** |
| `dev` | 2026-08-14 `caf1af9` | 0 / 28 | Ancestor of `main`; nothing unique | **Stale** — the brief's continuation branch exists but is 28 commits behind |
| `staging` | 2026-08-14 `caf1af9` | 0 / 28 | Same commit as `dev` | Stale |
| `claude/dead-code-typecheck-fixes` | 2026-09-01 `980f91a` | **9 / 28** | Parallel refactor of the web app with **~20 screens that exist nowhere else** (Edit Profile, Change Password, Report Content, Terms & Privacy, Share Sheet, Story Completion, Session Expired, Email Verification, Permission Denied, Notification Settings, App Update, Logout confirmation, Guest signup prompt …) + `useDialogA11y` | **Unmerged, valuable** — must be migrated, not deleted |
| `cursor/fix-live-audit-bugs-5bb3` | 2026-10-02 `f2dd5b4` | 5 / 7 | Five fixes to legacy screens (recovery copy, institutional crash, header Search/Profile, sign-in error colour, Library profile) | Unmerged; most fixes superseded by #19/#22 — verify each before closing |
| `chore/creova-ai-toolchain` | 2026-10-04 `6d6b0ab` | 3 / 7 | `.ai/project.yaml`, `AGENTS.md`, Creova AI toolchain prompt, gstack ignore | Unmerged; tooling only |
| `chore/add-pipeline-infra` | 2026-09-01 `c5c1685` | 5 / 28 | PR template, local pipeline script, **pnpm** CI | Unmerged; conflicts with npm CI on `main` |
| `creova-gif-fix-ci-pnpm-workflow` | 2026-09-01 `1c8df18` | 4 / 28 | Subset of `chore/add-pipeline-infra` | Duplicate |
| `claude/platform-audit-OKLXV` | 2026-09-04 `12fec75` | 6 / 64 | Older restoration line (wires `SoundDrivenStoryView`, `SoftBranchingChoice`, `AccessibilityControlsScreen`, `CreatorOnboardingFlow`) | Unmerged; screens it restores live in `archive/` |
| `docs/add-claude-md` | 2026-08-25 `7ee5e6e` | 2 / 28 | Older CLAUDE.md / README | Superseded by `main` |
| `claude/merge-platform-audit-into-main` | 2026-09-01 | 0 / 8 | Fully merged | Can be deleted later |
| `creova-gif-patch-1` | 2026-10-05 | 1 / 7 | Broken settings edit (invalid JSON) | Superseded by `main@347e485` — delete |
| `dependabot/*` (8) | 2026-07-27 | — | Radix/Tailwind/react-day-picker bumps | Stale; rebase or close |

## Deployment

| Item | Value |
|---|---|
| Host | Vercel project `seen` (team `creovas-projects`) |
| Production | `https://seen-sigma-eight.vercel.app` ← **`main`**. GitHub deployment records show production at **`a35a8f1`** (2026-10-05 16:59 UTC). Before 2026-10-05 production sat at `707b179` (2026-09-02) |
| Previews | One per branch/PR (36 recorded) |
| Config | `vercel.json`: security headers, CSP in **Report-Only**, immutable caching for hashed chunks |
| Live check from this sandbox | The egress proxy blocks `seen-sigma-eight.vercel.app`, so the live site could not be fetched today. Because production deploys `main@a35a8f1`, the code on `main` is the deployed code. The September live-site audit is in `docs/audit/LIVE_APP_AUDIT.md` |

> ⚠ **Which "deployed version" does the founder prefer?** The brief's preferred direction could mean the look before 2026-10-05 (`707b179`) or the current one (`a35a8f1`, after PR #19 unified the UI). Recorded as **D-01** in `docs/planning/SEEN_DECISIONS_REQUIRED.md`.

## Toolchain & commands (verified by running them on 2026-10-05)

| Item | Value |
|---|---|
| Runtime | Node 22 (CI `node-version: 22`; sandbox v22.22.2), npm 10.9 |
| Framework | React 18.3.1 + TypeScript 5.7 + Vite 6.3.5 + Tailwind 4 |
| Package manager | **npm**, but `package-lock.json` is **git-ignored** → installs are not reproducible. Two unmerged branches switch CI to **pnpm**. Risk R-03 |
| `npm run typecheck` | ✅ passes (0 errors). `strict: false` |
| `npm test` (Vitest) | ✅ 64 / 64 |
| `npm run test:e2e` (Playwright + axe) | ✅ 33 / 33 on PR #22 CI (sandbox: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`) |
| `npm run build` | ✅ builds in ~7 s; largest chunk `CreatorEarningsScreen` 359 kB (101 kB gzip) |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| Lint / format | **None configured** (no ESLint, no Prettier) |
| CI | `.github/workflows/ci.yml`: install → typecheck → unit → build → prod audit; second job runs E2E |
| Mobile (`mobile/`) | Expo SDK 57 / React Native 0.86 / React 19; scripts `start`, `android`, `ios`, `web`; no tests, not in CI |

## Environment variables (names only — no values recorded)

| Name | Where | Purpose |
|---|---|---|
| `VITE_DEMO_ACCOUNTS` | web | Enables demo sign-in accounts |
| `projectId`, `publicAnonKey` | `utils/supabase/info.tsx` (committed) | Supabase project id + **public** anon key used by `StoryStateContext`. Anon keys are designed to be public, but they belong in env config, not source. Risk R-07 |

No `.env.example` exists.

## Risks found in Phase 0

| ID | Risk | Severity |
|---|---|---|
| R-01 | `dev` is 28 commits behind `main`; developing from it today would resurrect old code | High |
| R-02 | ~20 screens exist only on `claude/dead-code-typecheck-fixes`; deleting that branch loses them | High |
| R-03 | Lockfile ignored; npm vs pnpm split across branches | Medium |
| R-04 | No backup tags before consolidation | Medium (mitigation: tag before any merge) |
| R-05 | No lint/format gate | Low |
| R-06 | Figma file changed materially since the September audit (now ~300 screen frames) | High for planning accuracy |
| R-07 | Supabase identifiers committed in source | Low (public key) |
