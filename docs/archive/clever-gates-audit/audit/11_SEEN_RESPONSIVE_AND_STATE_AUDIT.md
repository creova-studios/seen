# 11 — SEEN responsive & state audit

**SEEN — a Creova product.**

## Responsive

Automated: Playwright checks for no horizontal overflow at **320, 360, 390, 430, 768, 1280 px** across 9 routes (passes on CI).

| Width class | Finding | Priority |
|---|---|---|
| Small mobile (320) | No overflow; onboarding cinematic text tight but readable | — |
| Standard / large mobile (360–430) | Designed target; Figma frames are 390 | — |
| Tablet (768) | Same 428 px column centred; wasted space; no two-column layouts | P2 |
| Laptop / desktop (1280+) | Phone-width column on a black page; bottom nav at desktop width feels mobile-only; no hover-rich layouts; **no designs exist** | P2 (design first) |
| Orientation | Landscape phone: mini player + bottom nav eat ~40% of height | P2 |
| Fixed elements | Mini player reserves space via `data-player` padding rule | ✅ |
| Modals | Radix sheets/dialogs scroll; drawer fits 320 | ✅ |

**Mobile is intentionally designed. Desktop is not designed anywhere.** It needs a design pass (Figma) before code.

## State matrix (main features)

✅ implemented · 🟡 partial · ❌ missing · — n/a

| Feature | Loading | Empty | Error+retry | Offline | Unauth | Forbidden | Validation | Success | Disabled | Processing |
|---|---|---|---|---|---|---|---|---|---|---|
| For You | ✅ | ✅ | 🟡 | 🟡 | ❌ guest | — | — | — | — | — |
| Explore / Creators / Collections | ✅ | ✅ | ✅ | ✅ | ❌ guest | — | — | — | — | — |
| Search | ✅ | ✅ | 🟡 | ❌ | ❌ | — | — | — | — | — |
| Story World / reader | 🟡 | — | 🟡 | ❌ | ❌ | 🟡 paywall | — | — | — | — |
| Player | 🟡 | — | ✅ unavailable | ❌ | — | — | — | — | ✅ | 🟡 no buffering UI |
| Library | ✅ | ✅ per tab | 🟡 | 🟡 | ❌ | — | — | ✅ toast | — | — |
| Creator profile + follow | ✅ | ✅ | ✅ | ✅ | ❌ | — | — | ✅ optimistic + rollback | ✅ busy | ✅ |
| Funding list / detail / tracker | ✅ | ✅ | ✅ | ✅ | ❌ | — | — | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ❌ | — | — | ✅ | — | — |
| Sign up / in | ✅ button | — | ✅ | ❌ offline auth | — | — | ✅ | ✅ | ✅ | ✅ |
| Publish wizard | 🟡 | — | 🟡 | ❌ | — | ✅ role guard | 🟡 | 🟡 | 🟡 | ❌ (Figma processing/in review/failed) |
| Settings | — | — | — | — | — | — | — | ✅ | ✅ | — |
| Restricted screens | — | — | — | — | — | ✅ | — | — | — | — |

Missing-state requirements carried into the backlog: guest/unauthenticated states (P1), player buffering + offline (P1), publish processing/in review/failed (P1), offline auth + session expired (P2), search offline (P2).
