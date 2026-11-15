# SEEN — measurement framework

**SEEN — a Creova product.** We measure whether people **finish, understand, return and support**. We do not measure how long we can keep them. Implementation: allow-listed `track()` in `src/app/observability.ts` with id/enum properties only (no names, emails or free text).

## North-star

**Stories completed per active explorer per month.** A story is "completed" at ≥ 90% of chapters or audio.

## By lens

| Lens | Metric | Event(s) | Why it matters |
|---|---|---|---|
| Product health | Visitor → first story opened | `guest_story_opened`, `story_opened` | Introduction + guest mode work |
| Product health | Onboarding completion and step count | `onboarding_step_viewed{step}`, `onboarding_completed{steps}` | FB-12 |
| Audience value | Story completion rate | `story_completed` / `story_opened` | Quality over volume |
| Audience value | Continue usage | `continue_opened` | Resume loop works |
| Audience value | Saves per completed story | `story_saved` | Usefulness (private signal) |
| Audience value | 7- and 30-day return | session start (anonymous id) | Real retention, not session length |
| Creator value | Creator profile views → follows | `creator_profile_viewed`, `creator_followed` | Discovery reaches people |
| Creator value | Stories published; second story within 60 days | `story_published` | Creators stay |
| Opportunity value | Opportunities viewed → saved → marked applied | `opportunity_viewed`, `opportunity_saved`, `opportunity_applied` | Funding layer helps |
| Support value | Support link clicks (later: contributions) | `support_link_opened` | Supporters reach creators |
| Trust | Reports submitted, time to decision | `report_submitted` | Safety |
| Technical health | JS errors, Web Vitals (LCP, INP, CLS), API error rate | error beacon, web-vitals | Reliability |

## Not success measures (tracked at most for diagnosis, never as goals)

Time on app, scroll depth, total plays, follower counts, likes.

## Guardrails

- Session length must not rise while completion falls. That pattern means we built a feed trap.
- Recommendation changes ship with a diversity check (share of "new voices" items).
