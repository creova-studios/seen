# Route map

| Hash | Screen | Params | Guard |
|---|---|---|---|
| `#/for-you` | For You | — | signed in |
| `#/explore` · `#/explore/:tab` | Explore | `tab = stories \| creators \| collections` | signed in |
| `#/library` | Library | — | signed in |
| `#/profile` | Profile | — | signed in |
| `#/search` | Search | — | signed in |
| `#/notifications` | Notifications | — | signed in |
| `#/creator/:id` | Creator profile | creator slug | signed in |
| `#/collections` | Collections index | — | signed in |
| `#/collection/:id` | Collection detail | `theme-*` / `inst-*` | signed in |
| `#/funding` | Funding | — | signed in |
| `#/opportunity/:id` | Opportunity detail | `opp-*` | signed in |
| `#/story/:id` | Story preview | story id | signed in |
| `#/story-chapter`, `#/chapter-index` | Reader | (in-memory story) | signed in; not deep-linkable |
| `#/settings`, `#/about`, `#/subscription-management`, `#/creator-publish` | — | — | signed in |
| `#/creator-monetization`, `#/creator-earnings` | Creator money | — | creator, admin |
| `#/moderation-governance` | Moderation | — | moderator, admin |
| `#/admin-dashboard` | Admin | — | admin |
| no hash / not onboarded | Onboarding | — | — |

Source of truth: `src/app/navigation/routes.ts` (unit-tested round-trips in `__tests__/routes.test.ts`).
