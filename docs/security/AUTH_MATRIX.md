# Auth test matrix (ENG-E6)

| Case | Expected | Test |
|---|---|---|
| Sign in from a story, email and password | Returns to the same `#/story/<id>` | `safeReturn.test.ts` + journey (to add with auth adapter) |
| Google OAuth or email link | Return route stored before redirect, validated on return | `safeReturn.test.ts` |
| Return target is external, protocol-relative or contains `..` | Ignored, default screen | `safeReturn.test.ts` |
| Same email via password and Google | One user (Supabase account linking, verified emails only) | Staging check |
| Redirect allow-list | Production host and Vercel preview pattern; no wildcard on other hosts | Staging check |
| Session length | Demo adapter: 7 days. Supabase: JWT refresh governs once configured | Release checklist |
| Sign-out in one tab | Other tabs sign out (storage event) | Journey |
| OTP and reset limits | Configured explicitly in Supabase Auth (3 resends, 60 s) | Release checklist |
| Service key | Never in repo or client; secret scan in CI | `scripts/secret-scan.sh` |
