# SEEN — release checklist

**SEEN — a Creova product.** Run before declaring consolidation complete and before every production release. Record the command output; don't tick on assumption.

## Build & quality
- [ ] `npm ci` (lockfile committed)
- [ ] `npm run typecheck` — 0 errors
- [ ] Lint — 0 errors (once ESLint is added)
- [ ] `npm test` — all pass
- [ ] `npm run test:e2e` — all critical journeys pass (onboarding, guest, story + player, save/continue, creator publish, profile edit, funding, report, settings)
- [ ] `npm run build` — succeeds; no chunk > 250 kB gzip without a reason
- [ ] `npm audit --omit=dev --audit-level=high` — clean

## Runtime review (preview deployment)
- [ ] No console errors on each route
- [ ] No failed network requests (except intentional `?simulate=`)
- [ ] Responsive: 320, 360, 390, 430, 768, 1280 px
- [ ] axe clean; manual keyboard pass; VoiceOver + TalkBack pass logged
- [ ] Navigation: back button, deep links, malformed links
- [ ] Authentication: sign-up, sign-in, reset email, session expiry
- [ ] Story creation end-to-end; story consumption with audio + transcript
- [ ] Profiles: view + edit; creator identity on every story surface
- [ ] Save / Continue across devices
- [ ] Opportunities: listings verified within 31 days (`verifiedAt`), sources open
- [ ] Report content reaches the moderation queue

## Configuration & safety
- [ ] Deployment targets the intended branch/commit
- [ ] Metadata: title, description, OG tags; "SEEN — a Creova product" in About/legal
- [ ] No secrets in the bundle or repo (secret scan)
- [ ] CSP enforced (not Report-Only) and no violations on preview
- [ ] Deprecated implementations (`archive/`, `mobile/`, old edge function) are not runtime dependencies
- [ ] Rollback path confirmed (previous production deployment id noted)
- [ ] Documentation updated (feature inventory, backlog status, canonical baseline)
