# SEEN by CREOVA

Multilingual (`EN` / `FR` / `ES`) community story worlds — immersive cultural narratives, audio-led reading, creator publishing, curated collections, and verified funding resources for storytellers.

| Surface | URL / Location | Role |
| --- | --- | --- |
| **Website** | [https://seen.verse.one](https://seen.verse.one) ([`site/`](site/)) | Public customer-facing website (`EN` / `FR` / `ES`, zero third-party trackers) |
| **App Testing (Vercel)** | [https://seen-sigma-eight.vercel.app](https://seen-sigma-eight.vercel.app) ([`vercel.json`](vercel.json)) | Hosted on Vercel for testing the installable app export and web build |
| **Mobile App (iOS & Android)** | [`mobile/`](mobile/) (`com.creova.seen`) | Native Expo SDK 58 / React Native application for Expo Go, TestFlight, and Google Play |
| **Design System** | Figma `seen.io` (`8WMBpUhanDkUjodZYolyDT`) | Tokens ([`src/styles/seen-tokens.css`](src/styles/seen-tokens.css)) & primitives ([`src/app/components/seen/`](src/app/components/seen/)) |

---

## Repository Structure

```text
.
├── src/                  # Shared story catalogue, i18n (EN/FR/ES), service contracts, and web app
├── mobile/               # Native iOS & Android app (Expo SDK 58 / React Native) + web export
├── site/                 # Customer-facing static website for seen.verse.one (zero dependencies)
├── api/                  # Vercel serverless endpoints (share preview cards)
├── supabase/             # Database migrations, RLS test suite, and Edge Function contracts
├── e2e/ & e2e-native/    # Playwright end-to-end journeys, responsive audits, and axe WCAG 2.2 AA scans
└── docs/                 # Product requirements, architecture, design specs, security, and operations
```

---

## Quick Start

### 1. Web & Shared Core (`src/`)

```bash
npm install
npm run dev          # Start local Vite dev server (http://localhost:5173)
npm run check        # Run typecheck + Vitest unit/component suite + production build
npm run test:e2e     # Run Playwright journeys + axe accessibility scans
```

- **Demo test accounts** (per-browser demo store, password `SeenDemo2026!`):
  - `viewer@seen.demo` · `creator@seen.demo` · `moderator@seen.demo` · `admin@seen.demo`
- Append `?simulate=offline|error|slow` to any URL to test resilience and failure states.

### 2. Native Mobile App (`mobile/`)

```bash
cd mobile
npm install --legacy-peer-deps
npx expo start --lan         # Scan QR code in Expo Go (iOS Camera / Android Expo Go)
npm run typecheck            # Typecheck native React Native screens and audio player
npm test                     # Run Jest + React Native Testing Library suite
```

To build and verify the installable web export served on Vercel for testing:

```bash
cd mobile && npx expo export --platform web --output-dir dist && cd ..
node scripts/pwa-postbuild.mjs mobile/dist
npx playwright test -c playwright.native.config.ts
```

### 3. Public Website (`site/` → `seen.verse.one`)

```bash
cd site
npm run build        # Generates static EN/FR/ES pages, sitemap.xml, and CNAME (seen.verse.one) in site/dist/
npm run check        # Runs 28 node:test checks (translation parity, links, a11y, zero third-party requests)
```

---

## Branching & Deployment Workflow

- **`main`** — Canonical releasable branch deployed to the Vercel testing channel ([https://seen-sigma-eight.vercel.app](https://seen-sigma-eight.vercel.app)).
- **`staging`** — Release-candidate branch (`seen-git-staging-creovas-projects.vercel.app`).
- **`dev`** — Integration branch for ongoing engineering (`seen-git-dev-creovas-projects.vercel.app`).
- **`feature/*` & `fix/*`** — Branched from `dev` and merged back via pull request with required CI checks (`Typecheck · unit tests · build`, `Database RLS tests · secret scan`, `End-to-end journeys`).

Full workflow and release steps: [`docs/operations/BRANCHING.md`](docs/operations/BRANCHING.md) and [`docs/operations/REPOSITORY_MAP.md`](docs/operations/REPOSITORY_MAP.md).

---

## Documentation

- **Product & Roadmap:** [`docs/product/SEEN_PRODUCT_REQUIREMENTS.md`](docs/product/SEEN_PRODUCT_REQUIREMENTS.md) · [`docs/product/MASTER_FEATURE_MATRIX.md`](docs/product/MASTER_FEATURE_MATRIX.md) · [`docs/product/STANDALONE_BETA_ROADMAP.md`](docs/product/STANDALONE_BETA_ROADMAP.md)
- **Release & Mobile:** [`docs/release/RELEASE_READINESS.md`](docs/release/RELEASE_READINESS.md) · [`docs/operations/MOBILE.md`](docs/operations/MOBILE.md) · [`mobile/README.md`](mobile/README.md)
- **Website (`seen.verse.one`):** [`site/README.md`](site/README.md) · [`docs/security/DEMO_INVITE_GATE.md`](docs/security/DEMO_INVITE_GATE.md)
- **Engineering & Conventions:** [`CLAUDE.md`](CLAUDE.md) · [`AGENTS.md`](AGENTS.md)
