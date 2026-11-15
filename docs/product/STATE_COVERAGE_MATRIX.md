# State coverage matrix

Standard (docs/ux): initial · loading · loaded · empty · recoverable error · terminal/permission · offline · retrying · stale.
Implementation: `hooks/useResource.ts` + `components/seen/ResourceView.tsx` give every new async surface these states; `?simulate=offline|error|slow` exercises them.

| Surface | Loading | Empty | Error + retry | Offline | Not found / denied | Stale-on-refresh-fail | Optimistic + rollback | Verified by |
|---|---|---|---|---|---|---|---|---|
| Explore › Creators | ✅ skeleton grid | ✅ | ✅ | ✅ | — | ✅ | — | component + E2E |
| Explore › Collections | ✅ | ✅ (per filter) | ✅ | ✅ | — | ✅ | — | E2E |
| Creator profile | ✅ | — | ✅ | ✅ | ✅ not found | ✅ | ✅ follow | component |
| Collection detail | ✅ | — | ✅ | ✅ | ✅ not found | ✅ | ✅ save | E2E |
| Funding list | ✅ | ✅ tracker / filter | ✅ | ✅ | — | ✅ | — | E2E |
| Opportunity detail | ✅ | — | ✅ | ✅ | ✅ not found; closed call | ✅ | ✅ checklist, status | component + E2E |
| Notifications | ✅ | ✅ "all caught up" | ✅ | ✅ | — | ✅ | ✅ mark read | component + E2E |
| Profile › Your SEEN counts | ✅ "—" placeholder | ✅ 0 | 🟡 shows "—" | 🟡 | — | — | — | E2E |
| For You / Explore stories / Library | n/a (synchronous static catalogue) | ✅ | n/a | n/a | — | — | Library remove has confirm | a11y |
| Search | ✅ spinner | ✅ "No stories found" | n/a (local) | n/a | — | — | — | E2E |
| Guarded screens | — | — | — | — | ✅ Restricted state | — | — | E2E |
| Any render crash | — | — | ✅ ErrorBoundary + ref id | — | — | — | — | unit (telemetry) |
