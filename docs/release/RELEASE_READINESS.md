# Release readiness — user-testing RC (branch `claude/clever-gates-cs9out`)

**Verdict:** ready for **moderated** real-user testing once merged and deployed to a preview/production URL. **Not ready for an open public beta** — accounts, follows, saves and moderation are per-browser until the Supabase adapter replaces the demo adapter (ADR-002/003).

## Measured

| Gate | Baseline (`707b179`) | Now |
|---|---|---|
| TypeScript errors | 74 | **0** |
| Automated tests runnable | 0 | **38 unit/component + 17 E2E + 11 axe scans, all passing** |
| CI | none | typecheck · tests · build · audit · E2E |
| Known crashes on reachable screens | 3 (About close, Institutional collections, branching overlay) | **0 known** + error boundary |
| Dead primary controls | header Search/Profile on 2 tabs, every "See all", 3 always-empty filters, search result bounce | **0 known** |
| Main JS chunk | 1,479 KB (gzip 320) | **254 KB (gzip 61)**; creator/admin screens lazy |
| axe serious/critical (11 screens) | contrast failures on every screen | **0** |
| Horizontal overflow 320–1280 px | untested | **0** on 9 routes × 6 widths |
| Self-grant of moderator role | possible | blocked |
| Browser back / deep links | none | working |

## Definition-of-done status (product level)

| Criterion | Status |
|---|---|
| Screens reconciled across Vercel / Figma / code | ✅ `MASTER_FEATURE_MATRIX.md` |
| Missing high-priority Figma features implemented | ✅ creators, collections, funding, notifications, state templates, segmented tabs |
| No dead primary navigation / fake CTAs | ✅ (social login buttons remain disabled + labelled "coming soon" — product decision) |
| Core journeys complete end to end | ✅ automated |
| Demo data stable and separable | ✅ creators/collections derived from the catalogue; funding listings are real and sourced |
| Backend adapter boundaries clean | ✅ contracts + one-line swap |
| Auth works | ✅ demo auth; 🔜 Supabase Auth |
| Tenant isolation designed / enforced where live | ✅ designed (ADR-003, DATA_MODEL); nothing live to enforce yet |
| Card alignment / responsive defects fixed | ✅ |
| Accessibility blockers resolved | ✅ automated; ⏳ manual SR pass |
| Error / loading / empty states | ✅ new surfaces; legacy synchronous screens have empty states |
| E2E pass, pipeline defined | ✅ locally; CI runs on the PR |
| Observability active | ✅ client capture; ⏳ sink endpoint |
| Rollback exists | ✅ `ROLLBACK.md` |
| Deferred items documented with owner/priority | ✅ `KNOWN_DEFERRED_ITEMS.md` |

## Release notes (for testers)

- New: **Creators** (browse, profiles, follow), **Collections** (thematic and institutional, save), **Funding** (12 real Canadian programs with official links, eligibility, application tracker), **Notifications** (bell with unread count).
- Fixed: header search and profile buttons, search result selection, About and Institutional screens no longer crash, "See all" works, back button and links work, broken images replaced with a clean placeholder, clearer text contrast, remove-from-library works on phones and asks to confirm.
- Removed: partner claims that weren't true (story "partners" and publish-wizard institution names).
- Changed: choosing *Moderator* when signing up now sends a request instead of granting access immediately. Test accounts listed in `docs/testing/USER_TESTING_RC_CHECKLIST.md`.


## Before real customers sign up (engineering review gates)

- [ ] Server-side account deletion tested (`npm run test:db`) and the retention matrix reviewed by legal (`docs/security/DATA_RETENTION_MATRIX.md`)
- [ ] Consent copy, retention statement, terms and privacy pages published
- [ ] FR and ES copy reviewed by a native speaker (drafts ship in `src/app/i18n/strings.ts`: notes, inbox, demo notice, sign-in errors) for consent, delete, export, report and note strings (`docs/design/COPY_DECK.md`; `copyDeck.test.ts` checks every row has all three languages and matching placeholders)
- [ ] Supabase paid tier (no auto-pause, backups); backup and restore drill done
- [ ] Staging project passes RLS suite, security advisors and the contract suite on both adapters
- [ ] Google OAuth consent screen, domain verification and privacy policy URL ready
- [ ] A named person reviews reports (needed before notes ship to real users)
- [ ] Error tracking with PII scrubbing; health check; secret scan green
- [ ] Keyboard-only journeys (report, delete, note) and axe journeys pass
