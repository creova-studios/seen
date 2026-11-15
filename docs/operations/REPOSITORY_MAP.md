# Repository map: what is canonical

**Source of truth: `github.com/creova-gif/SEEN`, branch `main`**, deployed by the Vercel project `seen` (team CREOVA's projects) at https://seen-sigma-eight.vercel.app. Ongoing work happens on `dev`, pre-release checks on `staging`. See `BRANCHING.md`.

## Other SEEN branches in this repository (audited 2026-10-06)

All were compared against `main`. Nothing was deleted: every branch below still exists with its history. Branches marked "archived" are frozen; do not develop on them. (Creating `archive/*` tags was attempted but the push was refused with HTTP 403 from the tooling used; a repository owner can add them with `git tag archive/<name> origin/<branch> && git push origin --tags` if wanted.)

| Branch | State vs `main` | Verdict |
|---|---|---|
| `main` | canonical | keep |
| `dev` | integration branch (was 30 commits behind, no unique commits; brought up to `main`) | keep |
| `staging` | release-candidate branch (same history as `dev`; brought up to `main`) | keep |
| `claude/merge-platform-audit-into-main` | 0 unique commits | merged; safe to delete |
| `claude/upbeat-darwin-n7rwpb` | this work, merged into `main` | merged; safe to delete after release |
| `claude/clever-gates-cs9out` | audit docs (33 files) on an older code base | docs preserved under `docs/archive/clever-gates-audit/`; code obsolete; archived |
| `cursor/seen-reconciliation-docs-5bb3` | docs only; same set as `clever-gates` | covered by the above; archived |
| `claude/dead-code-typecheck-fixes` | older screens (search, notifications, edit profile, change password, report, completion, share sheet, session expired, guest prompt, email verification, content unavailable, logout confirmation) on an old base | mostly duplicates of screens now in `main`; two ideas ported (see below); archived |
| `claude/platform-audit-OKLXV` | older platform and creator screens | already preserved in `archive/`; archived |
| `chore/add-pipeline-infra`, `creova-gif-fix-ci-pnpm-workflow` | pnpm CI and a PR template | pnpm lockfile and workflow rejected (repo uses npm); PR template adopted; archived |
| `creova-gif-patch-1` | one `.claude/settings.json` edit | superseded by `main`'s settings; archived |
| `docs/add-claude-md` | README and CLAUDE.md rewrite | superseded; archived |

## Other repositories

The GitHub account holds many unrelated CREOVA projects (for example `creova`, `creova-os`, `kora-*`, `nexus-*`). None is identifiable as a SEEN code base from its name, and nothing outside `creova-gif/SEEN` was read. If another SEEN repository exists, name it and it will be audited the same way.

## Ported from older SEEN work

| Source | Idea | Result |
|---|---|---|
| `claude/dead-code-typecheck-fixes` `ContentUnavailableScreen` | a deep link, notification or search result pointing at a story that is missing or not public rendered a blank screen | adapted: story preview now shows an "unavailable" state with a way back |
| `claude/dead-code-typecheck-fixes` `LogoutConfirmationModal` | sign-out had no confirmation | adapted onto the shared `ConfirmDialog` |
| `chore/add-pipeline-infra` PR template | consistent PR descriptions | adapted to `.github/pull_request_template.md` |

Not ported, with reasons: session-expired and email-verification screens (need a live backend; revisit at Supabase restore), guest-mode prompt (product decision pending), share sheet (system share sheet chosen), app-update modal (no service worker), and every screen already present in `main`.
