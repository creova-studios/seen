# Consolidation report (2026-10-06)

Goal: one canonical SEEN state, with `main`, `staging` and `dev` identical.

## Recovered into the canonical app
- Playback speed control (0.75x to 1.5x), remembered per device; applies to recorded narration and the device voice.
- Larger text accessibility setting.
- Create Story audience chips.
- "Enter Story" replaced by "Start reading", localised; bottom-nav labels localised.
- Story-completion dialog: Escape closes, focus moves in and returns, Tab stays inside.
- Earlier in the day: unavailable-story state, sign-out confirmation, PR template.
- Secondary text contrast sweep (`/50` to `/55`).

## Found but intentionally not brought forward
| Item | Where | Reason |
|---|---|---|
| Black Loyalists, Africville Destroyed, Black Canadian Renaissance, Sleeping Car Porters stories | `archive/src/app/data/` | Real historical content needs a human fact-check before publishing; mapping to the current story model is straightforward afterwards |
| Season 2 to 4 stories (Women's Archive, Montreal Music, Black Futures, etc.) | `archive/src/app/data/` | English only, with translation-pending markers; breaks the EN/FR/ES rule |
| Creator tutorial onboarding | `archive/.../CreatorOnboardingFlow.tsx` | Good copy, but a product decision on creator onboarding is open; reuse the step copy later |
| Story branch map, QR object entry, institutional collections catalogue, narration/film/music registries | `archive/` | Concept-only, need content or licensing, or name real organisations as partners |
| Session-expired, email-verification, guest-signup, app-update, notification settings, permission-denied screens | `claude/dead-code-typecheck-fixes` | Need a live backend, push, or a product decision |
| Duplicates of search, notifications, edit profile, change password, report, completion, share sheet, offline and loading states | various old branches | Already in the canonical app |
| Mobile Expo prototype | `mobile/` | Web app is canonical |
| `claude/platform-audit-OKLXV` | branch | Deletes about 32,000 lines; never merge wholesale |

All old branches still exist; nothing was deleted. See `docs/operations/REPOSITORY_MAP.md`.

## Open product decisions
Onboarding length (see the decision matrix), News/Media concepts, alt text and content warnings in Create Story, merging the fact-checked story content.
