# Security Policy (`SECURITY.md`)

## Supported Versions

| Version / Branch | Supported |
| --- | --- |
| `main` (`1.x`) | Yes |
| `staging` / `dev` | Pre-release verification |

## Security Architecture & Boundaries

Detailed threat models, role matrices, and retention contracts live in [`docs/security/`](docs/security/):
- [`docs/security/THREAT_MODEL.md`](docs/security/THREAT_MODEL.md)
- [`docs/security/AUTHORIZATION_MATRIX.md`](docs/security/AUTHORIZATION_MATRIX.md)
- [`docs/security/AUTH_MATRIX.md`](docs/security/AUTH_MATRIX.md)
- [`docs/security/DATA_RETENTION_MATRIX.md`](docs/security/DATA_RETENTION_MATRIX.md)
- [`docs/security/DEMO_INVITE_GATE.md`](docs/security/DEMO_INVITE_GATE.md)
- [`docs/security/SECURITY_AUDIT.md`](docs/security/SECURITY_AUDIT.md)

### Core Controls

1. **PostgreSQL 16 Row-Level Security (`RLS`) & Security-Definer RPCs:**
   - Every table in `supabase/migrations/0001_core_schema.sql` through `0006_artist_intake_and_moderation.sql` enforces strict `RLS`.
   - Clients can never self-assign `moderator` or `admin` roles (`profiles.role` is protected against client writes) or directly set `stories.status = 'published'`.
   - Single-use, expiring SHA-256 hashed artist invitations (`invitations`), append-only creator rights grants (`rights_grants`), and editorial review transitions (`submit_story_for_review`, `review_story_submission`) are enforced inside PostgreSQL RPCs and verified on every push by `supabase/tests/rls.test.sql` (`npm run test:db`).
2. **Zero Hardcoded Secrets or Legacy Edge Functions:**
   - The application reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exclusively from environment variables (`.env.example`).
   - Automated CI secret scanning (`scripts/secret-scan.sh`) and production dependency auditing (`npm audit --omit=dev --audit-level=high`) run on every PR and push.
3. **Edge Demo Invite Gate (`middleware.ts` & `src/gate/inviteGate.ts`):**
   - Protects preview deployments when `DEMO_INVITE_CODES` is configured without requiring third-party runtime dependencies.

## Reporting a Vulnerability

Do **not** open a public GitHub issue for security vulnerabilities. Report vulnerabilities via GitHub Private Vulnerability Reporting on `creova-studios/seen` or email **`security@creova.one`**.

We acknowledge reports within **48 hours** and provide remediation timelines within **7 days**.
