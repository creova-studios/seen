# Changelog

All notable changes to **SEEN by CREOVA** are documented in this file.

## [1.1.0] - 2026-11-22

### Added
- **Artist Onboarding, Story Intake & Editorial Moderation (`0006_artist_intake_and_moderation.sql`):**
  - Single-use SHA-256 artist invitations (`create_artist_invitation`, `redeem_artist_invitation`), append-only creator rights/consent grants (`rights_grants`), and full editorial review state machine (`draft -> submitted -> in_review -> changes_requested -> approved -> published`).
  - Web and native mobile integration syncing published intake stories across surfaces (`src/app/data/storyService.ts`, `mobile/`).
- **Cloud Architecture ADR & Master Audit (`docs/adr/ADR-003-cloud-architecture-supabase-gcp.md`, `docs/master-audit/`):**
  - Evaluated Supabase vs. GCP vs. Hybrid architecture with 5 FinOps workload scenarios.
- **Public Customer Website (`site/` → `seen.verse.one`) & Demo Invite Gate (`src/gate/inviteGate.ts`):**
  - Zero-tracker multilingual (`EN`/`FR`/`ES`) static site with 28 automated verification checks and self-contained Edge invite middleware.
- **Governance & CI Hardening:**
  - Upgraded `.github/workflows/ci.yml` and `supabase/tests/run.sh` to run PostgreSQL 16 RLS tests against a deterministic `postgres:16-alpine` service container in CI.
  - Added root `SECURITY.md`, `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.github/dependabot.yml`, and removed legacy `archive/` code.

## [1.0.0] - 2026-10-15

### Added
- Multilingual (`EN` / `FR` / `ES`) Web Creator Studio (`src/`) and Native Mobile App (`mobile/` on Expo / React Native).
- Core PostgreSQL 16 schema and RLS test suite (`0001_core_schema.sql`–`0005_profile_bio.sql`), share preview cards (`api/`), and Playwright + `@axe-core/playwright` WCAG 2.2 AA E2E suite.
