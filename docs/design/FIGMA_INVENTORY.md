# Figma inventory — `06 — COMPONENTS` page

Every component set on the page is now implemented **and used in the app**.
Legend — **Code**: implementation · **Used in**: where it is wired.

| Figma node | Component set | Variants | Code | Used in |
|---|---|---|---|---|
| 294:54 | Button | Primary/Secondary/Ghost/Destructive × Default/Hover/Focus/Pressed/Disabled/Loading | `seen/primitives › Button` | Follow, funding tracker, dialogs, drawer, chapter index |
| 302:32 | Icon Button | Ghost/Filled × 5 states | `IconButton` (44 px target, badge, forwards ref) | Header, top bars, mini player |
| 295:27 | Text Input | Default/Focus/Filled/Error/Disabled | `seen/forms › TextField` (label, hint, error with aria wiring) | Onboarding sign-up / sign-in / recovery |
| 363:132 | Password Field | Masked/Visible | `PasswordField` (show/hide) | Onboarding |
| 363:110 | OTP Field | Default/Filled/Error | — | **Not implemented on purpose**: OTP needs a server to send and verify codes. A code screen over local demo auth would be fake. Ships with Supabase Auth (ADR-003) |
| 298:137 | Search Bar | Empty/Focused/Filled | `SearchBar` (clear button, Esc clears, `role=search`) | Search overlay, Explore › Stories |
| 295:47 | Toggle | Off/On/Disabled | `Toggle` (`role=switch`) | Settings › High contrast, Reduce motion |
| 302:42 | Checkbox | Unchecked/Checked/Indeterminate/Disabled | `Checkbox` | Funding application checklist |
| 302:50 | Radio | Unselected/Selected/Disabled | `RadioGroup` (fieldset/legend) | Settings › Language, Funding filters drawer |
| 295:37 | Chip | Default/Selected/Disabled | `Chip` | Collections filter, active funding filters |
| 296:10 | Badge | Gold/Mint/Purple/Surface | `Badge` | Cards, detail screens |
| 296:20 | Avatar | S/M/L | `Avatar` | Creator cards and profiles |
| 296:30 | Progress | Linear/Circular | `seen/display › LinearProgress`, `CircularProgress` | Funding checklist, chapter index; Library in-progress cards |
| 296:43 | Skeleton | Line/Block/Card/Circle | `Skeleton`, `SkeletonList` | Every async screen |
| 298:82 | Bottom Navigation | Active=ForYou/Explore/Library/Profile | `seen/BottomNav` (single component, `aria-current`) | All four tabs (replaced 4 copies) |
| 298:118 | Top Bar | Default/Scrolled/WithBack | `NavigationBar`, `TopBar` | All screens |
| 298:162 | Segmented Tabs | Stories/Creators/Collections | `SegmentedTabs` | Explore, Funding |
| 300:17 | Story Card | Portrait/Landscape/Compact | `StoryCard`, `ContentCard`, `StoryRow` | Feeds, Library, creator/collection detail |
| 300:60 | Chapter Row | Available/Playing/Completed/Locked | `seen/display › ChapterRow` | Chapter index (locked = paid story without access) |
| 301:79 | State Template | Empty/Error/Offline | `StateTemplate` (+ Denied) | Every async screen, restricted screens |
| 302:75 | List Item | Default/Pressed/Selected | `ListItem` | Profile rows, Settings |
| 570:3 | Creator Card | — | `CreatorCard` | Explore › Creators |
| 570:5 | Collection Card | — | `CollectionCard` | Explore › Collections |
| 570:7 | Opportunity Card | — | `OpportunityCard` | Funding |
| 305:53 | Banner | Info/Success/Warning/Error | `Banner` | Funding, offline/stale states |
| 570:9 | Toast | — | `sonner` (bottom, above nav so it never covers header actions) | All mutations |
| 570:11 | Tooltip | — | `seen/overlays › Tooltip` (Radix) | Header icon buttons |
| 570:13 | Sheet | — | `Sheet` (bottom, Radix dialog) | Expanded media player |
| 570:15 | Dialog | — | `Dialog`, `ConfirmDialog` | Library remove, cancel subscription |
| 570:21 | Drawer | — | `Drawer` (side) | Funding filters |
| 570:17 | Metric Card | — | `MetricCard` | Creator earnings |
| 570:19 | Subscription Card | — | `SubscriptionCard` | Subscriptions & billing |
| 363:67 | Media Player Bar | Mini/Expanded | `MediaPlayerBar`, `ExpandedPlayer` + `playback/PlaybackProvider` | Docked above nav on every screen; expanded sheet; inside the reader |
| 363:160 | Notification Item | Story/Funding/Money/Moderation | `NotificationItem` | Notifications (all 4 types now fire from real events) |
| 248:67 / 248:68 / 248:71 | Divider / Back Button / Section Header | — | hairlines, `TopBar`, `SectionHeader` | Everywhere |
| 248:56 / 248:65 | Status Bar / Home Indicator | — | Device chrome, not drawn on web by design | n/a |

Automated coverage: `src/app/__tests__/figma-components.test.tsx` (every form atom, surface and display organism, BottomNav, playback engine) plus the Playwright journeys.
