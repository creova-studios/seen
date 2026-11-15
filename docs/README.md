# SEEN Documentation Index

Canonical documentation for **SEEN by CREOVA** across the public website ([`https://seen.verse.one`](https://seen.verse.one)), the Vercel app testing channel ([`https://seen-sigma-eight.vercel.app`](https://seen-sigma-eight.vercel.app)), and the native mobile app (`mobile/`, bundle ID `com.creova.seen`).

## Product & Roadmap (`docs/product/`)

| Document | Purpose |
| --- | --- |
| [SEEN_PRODUCT_REQUIREMENTS.md](product/SEEN_PRODUCT_REQUIREMENTS.md) | Approved product requirements (`PR-1`–`PR-12`), mobile-first direction, and delivery order |
| [MASTER_FEATURE_MATRIX.md](product/MASTER_FEATURE_MATRIX.md) | Screen and capability matrix across Web, Native, and Figma |
| [STANDALONE_BETA_ROADMAP.md](product/STANDALONE_BETA_ROADMAP.md) | Two-surface architecture (`seen.verse.one` website + app) and standalone beta roadmap |
| [ONBOARDING_DECISION_MATRIX.md](product/ONBOARDING_DECISION_MATRIX.md) | 6-screen onboarding flow and protected entry screens |
| [FUNDING_LISTINGS.md](product/FUNDING_LISTINGS.md) | Verification rules and source requirements for creator funding programs |
| [PHOTO_RELEASES.md](product/PHOTO_RELEASES.md) | Release-form policy and `PHOTOS=off` build switch for `site/` |
| [PRODUCT_DECISIONS_PENDING.md](product/PRODUCT_DECISIONS_PENDING.md) | Open product decisions awaiting owner sign-off |

## Operations & Deployment (`docs/operations/`)

| Document | Purpose |
| --- | --- |
| [REPOSITORY_MAP.md](operations/REPOSITORY_MAP.md) | Canonical repository, branch audit, and deployment topology |
| [BRANCHING.md](operations/BRANCHING.md) | Git flow (`feature/*` → `dev` → `staging` → `main`) and Vercel preview/testing rules |
| [MOBILE.md](operations/MOBILE.md) | Home-screen installability (PWA manifest/icons) and Expo/EAS store app builds |
| [ENVIRONMENT_STRATEGY.md](operations/ENVIRONMENT_STRATEGY.md) | Environment variables across local, Vercel testing, `seen.verse.one`, and Supabase |
| [CI_CD.md](operations/CI_CD.md) | GitHub Actions quality gates (`typecheck`, `vitest`, `playwright`, RLS, and native checks) |
| [OBSERVABILITY.md](operations/OBSERVABILITY.md) | PII-scrubbed telemetry and `scripts/check-live-telemetry.mjs` |

## Release, Security & Architecture

- **Release:** [RELEASE_READINESS.md](release/RELEASE_READINESS.md) · [BACKEND_CUTOVER.md](release/BACKEND_CUTOVER.md) · [RESTORE_SUPABASE.md](release/RESTORE_SUPABASE.md) · [ROLLBACK.md](release/ROLLBACK.md)
- **Security:** [DEMO_INVITE_GATE.md](security/DEMO_INVITE_GATE.md) · [AUTH_MATRIX.md](security/AUTH_MATRIX.md) · [DATA_RETENTION_MATRIX.md](security/DATA_RETENTION_MATRIX.md) · [SECURITY_AUDIT.md](security/SECURITY_AUDIT.md)
- **Architecture & ADRs:** [SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md) · [DATA_MODEL.md](architecture/DATA_MODEL.md) · [ADR/](architecture/ADR/) · [ADR-003: Cloud Architecture (Supabase vs. GCP)](adr/ADR-003-cloud-architecture-supabase-gcp.md)
- **Master Audit & Beta Execution (`docs/master-audit/`):** [CURRENT_STATE_AUDIT.md](master-audit/CURRENT_STATE_AUDIT.md) · [REPOSITORY_AND_BRANCH_INVENTORY.md](master-audit/REPOSITORY_AND_BRANCH_INVENTORY.md) · [ARCHITECTURE_AS_IS.md](master-audit/ARCHITECTURE_AS_IS.md) · [FEATURE_IMPLEMENTATION_MATRIX.md](master-audit/FEATURE_IMPLEMENTATION_MATRIX.md) · [SECURITY_AND_PRIVACY_AUDIT.md](master-audit/SECURITY_AND_PRIVACY_AUDIT.md) · [TECHNICAL_DEBT_REGISTER.md](master-audit/TECHNICAL_DEBT_REGISTER.md) · [TEST_AND_CI_BASELINE.md](master-audit/TEST_AND_CI_BASELINE.md) · [DEPLOYMENT_AND_INFRASTRUCTURE_AUDIT.md](master-audit/DEPLOYMENT_AND_INFRASTRUCTURE_AUDIT.md) · [PRODUCT_DECISION_REGISTER.md](master-audit/PRODUCT_DECISION_REGISTER.md) · [BETA_GAP_ANALYSIS.md](master-audit/BETA_GAP_ANALYSIS.md)
- **Design & Accessibility:** [FIGMA_COVERAGE_REPORT.md](design/FIGMA_COVERAGE_REPORT.md) · [COPY_DECK.md](design/COPY_DECK.md) · [MANUAL_VERIFICATION_REPORT.md](accessibility/MANUAL_VERIFICATION_REPORT.md)
- **Testing:** [TEST_STRATEGY.md](testing/TEST_STRATEGY.md) · [USER_TESTING_RC_CHECKLIST.md](testing/USER_TESTING_RC_CHECKLIST.md)

> **Historical archive:** Earlier reconciliation and forensic audits (`2026-10-05`) are preserved in [`docs/archive/clever-gates-audit/`](archive/clever-gates-audit/ARCHIVE_NOTE.md) for historical reference only.
