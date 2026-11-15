# SEEN standalone product and December 2026 beta: roadmap

Written 2026-10-19 after reviewing the code base and the research. Direction from the owner: SEEN is a standalone CREOVA-owned digital storytelling product. It links back to creova.one but has its own identity, domain, deployment and roadmap. Priority is the product and the December 2026 beta path.

Status labels: **VERIFIED** (read in the repo or measured), **REPORTED** (stated in a review or audit document, not re-run here), **UNVERIFIED** (could not be established), **DECISION** (needs the owner).

## 1. What was reviewed

| Source | Where | Used for |
|---|---|---|
| Code base and docs | this repo at `main` (e6874fd); `origin/dev` (f34678b) and `origin/staging` (73418ec) compared | Current state |
| First-beta engineering review (decisions D1 to D21, status matrix, milestones) | `.context/eng-review/SEEN-first-beta-eng-review.md` in the `buenos-aires` workspace | Beta scope and sequence |
| First-beta design review (11 approved decisions) | `.context/eng-review/SEEN-first-beta-design-review.md` in the same workspace | Guest mode, nav, hero, labels |
| Research kit (51 artifacts: interview guide, worksheets, user-testing database, CMF reference card) | `.context/research/seen-research/` in the same workspace | Evidence base |
| BIPOC interview scenarios | `~/Downloads/SEEN_BIPOC_Customer_Interview_Scenarios.md` | Rights, consent and safety gates |
| Web app audit (Aug 2026) | `~/Desktop/frameworks/SEEN_Web_App_Audit.docx` | Older snapshot; superseded where it conflicts with this repo |

Not read in full: the individual research PDFs and the user-testing spreadsheet (only listed). Read them before the interview round in section 6.

## 2. Where the product stands

- **Production** is `main`, at https://seen-sigma-eight.vercel.app. Every `*.vercel.app` deployment is a Vercel default hostname, not a CREOVA-owned domain. (VERIFIED: `docs/operations/REPOSITORY_MAP.md`, `vercel.json`)
- **The beta work is not on `main`.** `dev` is 6 commits ahead (restored protected onboarding screens, entry-screen fixes, installable web app manifest and icons, Expo shell). `staging` is 2 ahead. Both are 1 behind `main` (the promote commit). The live manifest returns 404 because it only exists on `dev`. (VERIFIED: `git rev-list`; REPORTED: live 404 in the eng review.) **Any code change for the beta should branch from `dev`, not from `main`.** This workspace is on a `main`-based branch.
- **Data is per-browser.** Accounts, follows, saves and moderation use the demo adapter and localStorage. Two testers never see each other's actions. This was acceptable for moderated testing and is not acceptable for a beta. (VERIFIED: `docs/architecture/SYSTEM_ARCHITECTURE.md`)
- **Gates the repo already documents** (VERIFIED: `docs/release/RELEASE_READINESS.md`, `KNOWN_DEFERRED_ITEMS.md`): Supabase adapter and Auth (D1), server-side roles and tenancy (D2), consent copy, terms and privacy pages, native FR/ES review, paid Supabase tier with backups, a named person reviewing reports, CSP enforcing (D9).
- **The engineering review adds** (REPORTED): profiles are world-readable; any signed-in user can insert a story with `status = published` (no review gate); the legacy signup server (`supabase/functions/server`, 6,723 lines) is not called by the app, but whether a copy is deployed is UNVERIFIED and only the owner can check; the beta needs seven new services and five migrations.
- **Standalone identity is mostly missing.** (VERIFIED)
  - No reference to `creova.one` anywhere in the repo.
  - `index.html` has only a title: no description, Open Graph tags, canonical URL or favicon link.
  - `package.json` name is `@figma/my-make-file`.
  - The credit is scattered: "SEEN by CREOVA" appears on onboarding and several screens, a "Made with ❤️ by CREOVA" line on Profile, and an About paragraph. None links out.
  - `mobile/app.json` and the manifest exist on `dev` only.
- **The Aug 2026 audit is stale on several points** (VERIFIED against this repo): it describes Replit hosting, 109 components, an Expo-first stack and "no test suite". The repo now has Vercel, a typed services layer, Vitest and Playwright with axe scans, and a documented release process.

## 3. What the research says the beta must do first

From the interview scenarios (all personas are **synthetic rehearsals**, not field findings; do not cite them as evidence):

1. **Rights and safety before engagement.** The pack's own rule: fix rights and safety blockers before optimizing engagement or grants discovery. Beta gate: practical handling for creator permissions, credit challenges, accessibility, privacy, and report/removal.
2. **Consent per language and per asset.** Translations need creator review; reuse and licensing are asset-specific.
3. **Safe defaults for visibility.** Identity masking and a takedown path for sensitive stories; be honest that withdrawal cannot recall copied content.
4. **Community-held cultural material.** Indigenous governance takes priority over a generic individual checkbox. Beta position: do not claim blanket permission is sufficient; say what the beta does not cover.
5. **Institutions are not proven demand.** Keep institutional collections read-only and partner-led (existing decision 4). Never name a real organisation as a partner without a signed agreement.
6. **Real research still has to happen.** 12 to 16 consent-cleared interviews are planned; none are recorded here.

## 4. Standalone product: what "its own" means

**Two surfaces, decided 2026-10-19.** (1) The **SEEN website**: the customer-facing site where visitors learn what SEEN is, navigate, and get to the product; built from this workspace (branch `creova-gif/website-discussion`). (2) The **SEEN product app**: the React app in this repo, which lives on a different site and is reached from the website. Each has its own deployment. Both belong to SEEN, both link back to creova.one, and neither shares auth, cookies or analytics with creova.one.

**creova.one today** (VERIFIED by fetching and screenshotting the page, 2026-10-26; it changed since 2026-10-19): the site is a light-header, maroon-and-photography design in Quasimoda (an Adobe Fonts typeface), EN/FR only, with nav Work, Services, Resources, Community, Our Brands (`/ventures`), About, and a "Start a project" button. SEEN appears in the footer "Our Brands" list as "SEEN · in development" (`/ventures#seen`) and in a body section that says "SEEN is in development toward a **December 2026 beta target**"; its button goes to `/ventures`, not to SEEN. No external SEEN domain is linked. DNS for creova.one is on Cloudflare; the site itself is served by GitHub Pages from the public repo `creova-gif/creova` (custom domain `www.creova.one`; the apex redirects to www).

| Area | Today | Target | Owner needed? |
|---|---|---|---|
| Name and brand | "SEEN by CREOVA" in scattered strings | One endorsement pattern: SEEN is the product, "by CREOVA" is the studio line, one link to creova.one from About, the footer line on Profile, and the sign-up/terms pages | Copy approval |
| Domain | `seen-sigma-eight.vercel.app` | Website: **`seen.verse.one`** (`https://seen.verse.one`). App testing channel: hosted via Vercel at `https://seen-sigma-eight.vercel.app` | Yes: DNS record in Cloudflare |
| Link to creova.one | none | Outbound link only (`rel="noopener"`), plus a link from creova.one to SEEN. No shared auth, cookies or analytics between the two | Yes: edit on the creova.one side |
| Deployment | The app is one Vercel project `seen`. The website has no deployment yet | App keeps its own deployment. **Website: GitHub Pages**, published from a small public repo (owner chose GitHub, 2026-10-26; the SEEN repo is private and Pages on a private repo needs a paid plan). DNS stays on Cloudflare | Yes: create the public repo, Pages settings, DNS record |
| Backend | Demo adapter | Own Supabase project(s): staging and production, paid tier, backups | Yes: billing |
| Page metadata | title only | Description, Open Graph/Twitter cards, canonical, favicon, theme-color, `lang` per language | No |
| Package identity | `@figma/my-make-file` | `seen` (private) | No |
| Roadmap | scattered docs | This file, plus a single beta milestone list (section 5) | No |
| Privacy/terms | not published | Published on the SEEN domain, naming the data controller | Yes: legal review |

Principle: SEEN must not depend on creova.one being up, and creova.one must not depend on SEEN's data. The link is navigational only.

## 5. December 2026 beta path

Estimates come from the engineering review (human / with Claude Code). Today is 2026-10-19, so there are about 6 weeks to 1 December. **Decided 2026-10-19: protect the scope, move the date.** The full plan is about 7 weeks of work after Phase 0 at human pace (1.5 + 2.5 + 2 + 1), so the earliest finish is roughly mid-December if Phase 0 lands by about 26 October and nothing slips. With Claude Code the build is about 3.5 weeks, but the owner actions, staging soak and real-device pass do not compress. **Proposed commitment: Beta 1 in mid-January 2027, with December used for the staging soak.** The owner confirms the date. Until then, nothing public should promise "December 2026" (see section 7, item 3).

| Phase | Work | Estimate | Blocked on |
|---|---|---|---|
| 0. Owner actions (week 1) | Supabase paid project and restore; check Supabase for a deployed legacy function and undeploy it; choose the domain; decide the story-review and transcript policy (D15/D16); narration provider and budget; line up native FR and ES reviewers | about 1 week | Owner |
| 1. Client work on `dev` | Regression foundation (audio fixture, playback continuity E2E, fix the 8 failing E2E on clean `dev`); limited guest mode; role-aware Create tab; feed density; language and filter fixes; identity work from section 4 | 1.5 weeks / 3 days | Phase 0 for the domain only |
| 2. Backend core | Migrations, library, follows, accounts, profile privacy, metrics; staging cutover; RLS and contract suites with two-user tests | 2.5 weeks / 1 week | Paid Supabase project |
| 3. Creator pipeline | Stories with a review gate, media bucket, editable labelled transcripts, narration clips | 2 weeks / 4 days | Phase 2; provider choice |
| 4. Soak and real-device pass | iPhone and Android, owner checklist, release | 1 week | Phase 3 |

**Critical path:** Supabase paid project and restore, then migrations and RLS, then accounts and library, then staging cutover, then real-device QA.

**Scope is protected:** automatic transcription, recorded narration and the review gate all stay in Beta 1. If a later slip forces a cut, transcription and narration are the least tied to the rights-and-safety gate and the first candidates.

**Non-negotiable before real signups** (from section 3 and the engineering review): legacy server undeployed or removed; profile privacy; story review gate; RLS and two-user tests for every new table; email confirmation and signup rate limits; paid tier with backups; terms, privacy and consent published; a named person who reviews reports; CSP enforcing; a removal/takedown path that works end to end.

## 6. Research to run in parallel

- Run the 30-minute protocol from the interview pack with real, consent-cleared participants: 5 to 6 creators, 3 to 4 viewers on multilingual or low-bandwidth setups, 3 to 4 institutional decision-makers with an actual budget, and 1 to 2 operational roles.
- Keep synthetic scenarios separate from field records. Never mix them into the validation log or pitch material.
- Business gate: record an accountable budget owner, prior comparable spend, purchasing steps and a concrete follow-up before treating any institution as demand.

## 7. Decisions

| # | Question | Status |
|---|---|---|
| 1 | Link back to creova.one, own identity, domain, deployment and roadmap | **Decided.** Applies to both surfaces (section 4) |
| 2 | What this workspace is for | **Decided.** The customer-facing website: lets customers navigate and easily reach the product, which lives on a different site. Product app work still branches from `dev` |
| 3 | Date or scope | **Decided: protect scope, move the date. Beta 1 target: January 2027** (owner confirmed 2026-10-19; website says "date to be confirmed" until the Phase 0 owner actions land). creova.one still says "end of 2026" and must change with it |
| 4 | Legacy Supabase function | **Acknowledged by the owner.** Still an owner-only action: confirm in the dashboard whether a copy is deployed and undeploy it. Recorded as UNVERIFIED until then |
| 5 | Where to link from creova.one | **Recommendation, awaiting owner:** point the footer "SEEN · in development" item and the "Explore our brands" section at the SEEN website (and keep `/ventures#seen` as the summary), change "December 2026 beta target" to January 2027 once confirmed, and drop "in development" only when the beta opens. Edits are in the `creova-gif/creova` repo, outside this one |
| 6 | Story review and transcript policy | **Decided (owner agreed, 2026-10-19).** This is an app policy (what creators may publish); the website only describes it and says nothing about review yet. Review before public for first stories and for stories with content notes. Needs the backend review queue (decision 2 in `PRODUCT_DECISIONS_PENDING.md`) |
| 7 | Domain name | **Decided (owner): the website is `seen.verse.one`** (`https://seen.verse.one`), served via Cloudflare DNS. The app is hosted on Vercel (`https://seen-sigma-eight.vercel.app`) for testing |
| 8 | Where the website code lives and runs | **Decided: `site/` in this repo; hosted on GitHub Pages from a public publish repo; DNS on Cloudflare** (owner, 2026-10-26). Built and tested; setup steps in `site/README.md` |
| 9 | Terms and privacy pages | **Written 2026-10-26** for the website (EN/FR/ES, linked from every footer). Drafts: a lawyer must review them before the domain goes live. They cover the website only; the app's own terms and privacy notice are still needed before real signups |

## 8. First changes

Each as its own PR into `dev` unless noted: (a) back-merge `main` into `dev`; (b) ~~scaffold the SEEN website (`site/`)~~ **done**: EN/FR/ES pages, nav (What is SEEN, For creators, For viewers, Beta status, About CREOVA), a "Try the demo app" action, links back to creova.one; remaining: public publish repo, GitHub Pages settings, Cloudflare DNS record for `seen.verse.one`, lawyer review of terms and privacy, native FR/ES review; (c) standalone identity pass in the app: package name, page metadata, one creova.one link, consistent credit line, EN/FR/ES strings; (d) domain and environment wiring once decided; (e) then Phase 1 onward.

Website content rules (from the product's own rules): label demo content as demo; name no real organisation as a partner without a signed agreement; state the beta date only after the owner confirms it; say plainly what the beta does not cover (for example community-governed cultural material).
