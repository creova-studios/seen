# Component coverage

| Area | Built from SEEN components | Remaining bespoke styling |
|---|---|---|
| Header, bottom nav, top bars | ✅ | — |
| Feature screens (creators, collections, funding, notifications) | ✅ | — |
| Cards in all feeds, Library, Search | ✅ | — |
| Onboarding account form | ✅ TextField / PasswordField | Other onboarding steps keep their cinematic bespoke layout (intentional brand moment) |
| Settings | ✅ RadioGroup, Toggle, ListItem | — |
| Profile | ✅ ListItem rows | Header/stats/creator promo bespoke |
| Reader | ✅ ExpandedPlayer, SeenImage | Header icon buttons bespoke (same look) |
| Chapter index | ✅ ChapterRow, Progress, Button | — |
| Library | ✅ ContentCard, CircularProgress, ConfirmDialog, StoryRow | Tab indicators bespoke (accessible, AA) |
| Subscriptions, Earnings | ✅ SubscriptionCard, MetricCard, ConfirmDialog | Headers and history rows bespoke |
| Creator publish wizard, moderation, admin | ❌ | Bespoke; works; restyle when those flows are next revised |

Rule for new work: build from `components/seen/*`; if a component is missing, add it there with its Figma node id.
