# SEEN Features

Each file in this directory documents one user-facing feature of SEEN so an agent can navigate to it, drive it end-to-end with `control-seen`, and know its gotchas without re-discovering the app.

## Features

| Feature | File | Surface | Primary Route / Entry |
|---|---|---|---|
| Onboarding, Auth & Session Persistence | [onboarding-and-auth.md](file:///Users/justinmafie/seen-v1/.agents/skills/verify-seen/features/onboarding-and-auth.md) | `app`, `vercel-export` | `/` (`/#/for-you` when cleared) |
| Search, Explore & Collections | [search-and-explore.md](file:///Users/justinmafie/seen-v1/.agents/skills/verify-seen/features/search-and-explore.md) | `app`, `vercel-export` | `/#/for-you`, `/#/explore`, `/#/search`, `/#/collections` |
| Story Preview, Chapter Reader & i18n | [story-reader-and-i18n.md](file:///Users/justinmafie/seen-v1/.agents/skills/verify-seen/features/story-reader-and-i18n.md) | `app`, `vercel-export` | `/#/story/midnight-resonance`, `/#/settings` |
| Library, Progress & Creator Follow | [library-progress.md](file:///Users/justinmafie/seen-v1/.agents/skills/verify-seen/features/library-progress.md) | `app`, `vercel-export` | `/#/library`, `/#/creator/kira-chen` |
| Profile, Creator Publish & Funding | [profile-and-creator-publish.md](file:///Users/justinmafie/seen-v1/.agents/skills/verify-seen/features/profile-and-creator-publish.md) | `app`, `vercel-export` | `/#/profile`, `/#/creator-stories`, `/#/creator-publish`, `/#/funding` |
| Public Website (`seen.verse.one`) | [website-seen-verse-one.md](file:///Users/justinmafie/seen-v1/.agents/skills/verify-seen/features/website-seen-verse-one.md) | `website` | `/`, `/fr/`, `/es/`, `/terms/`, `/privacy/` |

## Adding or Updating a Feature File

Every feature file (`features/<slug>.md`, except `README.md`) must include these four H2 sections:
1. `## Sub-features`
2. `## How to get to it (user POV)`
3. `## Driving it with control-seen`
4. `## Gotchas`
