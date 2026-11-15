# 10 — SEEN technical debt audit

**SEEN — a Creova product.** Ordered by impact on consolidation.

| ID | Debt | Evidence | Impact | Fix | Priority |
|---|---|---|---|---|---|
| TD-01 | Unmerged parallel line (Implementation D) | 9 commits, ~20 unique screens on `claude/dead-code-typecheck-fixes` | Features lost if the branch is deleted; merge conflicts grow daily | Migrate screen-by-screen onto `main` (not a branch merge, because the two lines diverged on App.tsx/routing) | P1 |
| TD-02 | Two data layers | `services/` contracts vs `data/*Service.ts` (localStorage) | Backend swap must touch both | Move legacy services behind `SeenApi` contracts | P1 |
| TD-03 | No backend | Demo adapter + local auth | Blocks public launch | Supabase adapter (ADR-002/003) | P0 for launch |
| TD-04 | Lockfile ignored; npm vs pnpm split | `.gitignore` lists `package-lock.json`; 2 branches use pnpm | Non-reproducible builds | Pick npm (current CI + Vercel), commit lockfile, `npm ci` | P1 |
| TD-05 | Three story-card components | `StoryCard`, `ContentCard`, `StoryRow` | Visual inconsistency (FB-15) | One card family | P1 |
| TD-06 | Unused shadcn kit + unused deps | 48 files, 0 imports; many Radix/recharts deps | Bundle/maintenance noise | Remove after parity confirmed | P2 |
| TD-07 | `strict: false` | tsconfig | Hidden null bugs (6 found by review in PR #22) | Enable per-folder, starting with `services/`, `navigation/`, `playback/` | P2 |
| TD-08 | No ESLint/Prettier | — | Style drift; no hooks rules | Add with CI gate | P2 |
| TD-09 | Large chunk | `CreatorEarningsScreen` 359 kB (recharts) | Slow for creators on mobile | Lazy-load chart, or use lighter charts | P2 |
| TD-10 | Mobile app duplicate | `mobile/` with its own data and theme | Drift | Decision D-03 | P2 |
| TD-11 | Edge function from CMF era | 36 routes, CMF naming, CSRF bypass | Misleading reference | Archive under `archive/supabase/` after the new backend lands | P3 |
| TD-12 | Stale branches | `dev`, `staging` 28 behind; 8 dependabot; 3 merged/duplicate branches | Confusion about the canonical line | Branching strategy + clean-up after backups | P1 |
| TD-13 | Hash routing | ADR-004 | Not crawlable; no SEO for public stories | Move to path routes when SEO matters (P2) | P2 |
| TD-14 | Legacy screens with heavy motion & bespoke styles | Publish wizard, moderation, admin | Inconsistent, harder to test | Restyle with `components/seen` | P2 |
| TD-15 | Hard-coded strings in new screens | EN only | FR/ES users see mixed languages | i18n extraction | P2 |
