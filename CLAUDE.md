# SEEN — development guide

SEEN by CREOVA: a mobile-first web app for multilingual (EN/FR/ES) community story worlds — stories, creators, collections, funding for storytellers. Production: https://seen-sigma-eight.vercel.app (Vercel, deploys `main`).

**Source of truth:** this repository (`creova-gif/SEEN`), branch `main`. See `docs/operations/REPOSITORY_MAP.md`. Every other SEEN branch or project is an archive.

## Git workflow (read before touching anything)

- `main` = production and the testers' build. Never commit to it directly; it only changes by a reviewed merge from `staging` (or an urgent `fix/*`).
- `dev` = integration branch for ongoing work. `staging` = release candidate; only bug fixes land there.
- `feature/<name>` and `fix/<name>` branch from `dev` and merge back by PR. Flow: `feature/*` → `dev` → `staging` → `main`.
- Full rules, Vercel behaviour and the release/hotfix steps: `docs/operations/BRANCHING.md`.

## Commands

```bash
npm install
npm run dev          # Vite dev server
npm run typecheck    # must be 0 errors
npm test             # Vitest unit + component tests
npm run test:e2e     # Playwright journeys + axe (sandbox: PW_CHROMIUM_PATH=/opt/pw-browsers/chromium)
npm run check        # typecheck + test + build
```

## Where things are

- `src/app/App.tsx` — screen state, hash URL sync, role guards, providers. Screens/URLs/roles: `src/app/navigation/routes.ts`. Navigation from anywhere: `useAppNav()`.
- `src/app/services/` — feature data behind typed contracts (`contracts/`); `api` currently uses the demo adapter (`services/demo/`), Supabase adapter behind `backend.ts`. Never import an adapter directly.
- `src/app/components/seen/` — design-system primitives and Figma organisms; tokens in `src/styles/seen-tokens.css`.
- `src/app/data/storyDatabase.ts` — the story catalogue (single source of truth; chapters via `CHAPTERS_REGISTRY`).
- `archive/` — unreachable code kept for history/content. Not built, not type-checked; don't import from it.
- Phones: the app is installable (manifest, icons, iOS tags; see `docs/operations/MOBILE.md`). Never disable zoom in the viewport meta, and keep the manifest icons and tests in sync.
- Docs: `docs/` (start with `docs/release/RELEASE_READINESS.md`, `docs/product/MASTER_FEATURE_MATRIX.md`, `docs/design/FIGMA_COVERAGE_REPORT.md`). `docs/archive/` is historical and its "complete/ready" claims are not current.

## Rules

- Cards are the single tap target; use `typeLabel`/`badge` slots, never overlay badges or wrap cards in clickable divs.
- No dead buttons: render "See all"/actions only when wired.
- Every async surface uses `useResource` + `ResourceView` (loading, empty, error+retry, offline, stale).
- Mutations are optimistic with rollback and a toast; never show success before the write succeeds.
- Secondary text is `text-white/55` or `text-seen-muted` (AA contrast); touch targets ≥ 44 px.
- Demo data must be labelled (`isDemo`) and derived from real catalogue data where possible. Never name real organisations as partners without a signed agreement.
- Funding listings (`services/data/fundingListings.ts`) are real: store a deadline only if the funder published it, cite `sourceUrls`, update `verifiedAt` (process: `docs/product/FUNDING_LISTINGS.md`).
- The first onboarding screen (Invocation: the glowing S.E.E.N entry button, `InvocationLayer` in `OnboardingSystem.tsx`) and the manifesto screen after it ("This is not social media", `OnboardingPurpose.tsx`) are protected: never remove, merge or skip them. E2e tests guard them.
- Role checks in the UI are UX only; real enforcement belongs in the backend (see `docs/security/`).
- Analytics: only `track()` with allow-listed events and id/enum properties — no names, emails, free text.
- New user-visible strings go in `src/app/i18n/strings.ts` with EN/FR/ES.
- Screens added or removed must update `scripts/screen_matrix_data.py` and regenerate (`python3 scripts/gen_screen_matrix.py`); a vitest guards the matrix.

## gstack (REQUIRED — global install)

**Before doing ANY work, verify gstack is installed:**

```bash
_GS=""
for _D in "${GSTACK_ROOT:-}" "$HOME/.claude/skills/gstack" "$HOME/.codex/skills/gstack" "$HOME/.factory/skills/gstack" "$HOME/.kiro/skills/gstack" "$HOME/.config/opencode/skills/gstack" "$HOME/.slate/skills/gstack" "$HOME/.cursor/skills/gstack" "$HOME/.openclaw/skills/gstack" "$HOME/.hermes/skills/gstack" "$HOME/.gbrain/skills/gstack" "$HOME/.copilot/skills/gstack" "$HOME/.gstack/repos/gstack"; do
  [ -z "$_GS" ] && [ -n "$_D" ] && [ -d "$_D/bin" ] && _GS="$_D"
done
[ -n "$_GS" ] && echo "GSTACK_OK: $_GS" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING: STOP. Do not proceed. Tell the user:

> gstack is required for all AI-assisted work in this repo.
> Install it:
> ```bash
> git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
> cd ~/.claude/skills/gstack && ./setup --team
> ```
> Then restart your AI coding tool.

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: After install, skills like /qa, /ship, /review, /investigate,
and /browse are available. Use /browse for all web browsing (Aside first, the bundled gstack browser as fallback).
Use the resolved install path above for gstack file paths
(default: ~/.claude/skills/gstack).
