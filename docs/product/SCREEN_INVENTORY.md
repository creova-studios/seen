# Screen inventory

Every screen the app can show, its URL, who can open it, and its component source.

| Screen | URL | Roles | Source | Notes |
|---|---|---|---|---|
| Onboarding (language → invocation → purpose → role → intent → account → accessibility → presence → threshold) | `/` (no hash) | anonymous | `components/OnboardingSystem.tsx` | Resumable via `onboarding_step` |
| For You | `#/for-you` | all | `components/ForYouScreen.tsx` | Tab |
| Explore (Stories / Creators / Collections) | `#/explore`, `#/explore/creators`, `#/explore/collections` | all | `components/ExploreScreen.tsx`, `screens/CreatorsPanel.tsx`, `screens/CollectionsPanel.tsx` | Tab |
| Library | `#/library` | all | `components/LibraryScreen.tsx` | Tab |
| Profile | `#/profile` | all | `components/ProfileScreen.tsx` | Tab |
| Search | `#/search` | all | `screens/SearchScreen.tsx` | Overlay |
| Notifications | `#/notifications` | all | `screens/NotificationsScreen.tsx` | |
| Creator profile | `#/creator/:id` | all | `screens/CreatorProfileScreen.tsx` | |
| Collections index | `#/collections` | all | `screens/CollectionsScreen.tsx` | |
| Collection detail | `#/collection/:id` | all | `screens/CollectionDetailScreen.tsx` | |
| Funding | `#/funding` | all | `screens/FundingScreen.tsx` | |
| Opportunity detail | `#/opportunity/:id` | all | `screens/OpportunityDetailScreen.tsx` | |
| Story preview | `#/story/:id` | all | `components/FeaturedStoryPreview.tsx` | |
| Chapter reader | `#/story-chapter` | all | `components/StoryChapterScreen.tsx` | Needs current story in state; not deep-linkable |
| Chapter index | `#/chapter-index` | all | `components/ChapterIndexScreen.tsx` | Not deep-linkable |
| Settings | `#/settings` | all | `components/ProfilePreferencesScreen.tsx` | |
| About | `#/about` | all | `components/AboutScreen.tsx` | |
| Creator publish wizard | `#/creator-publish` | all (publishing upgrades viewer → creator) | `components/CreatorPublishFlow.tsx` | Lazy |
| Creator monetization | `#/creator-monetization` | creator, admin | `components/CreatorMonetizationScreen.tsx` | Lazy, guarded |
| Creator earnings | `#/creator-earnings` | creator, admin | `components/CreatorEarningsScreen.tsx` | Lazy, guarded |
| Subscription management | `#/subscription-management` | all | `components/SubscriptionManagementScreen.tsx` | Lazy |
| Moderation | `#/moderation-governance` | moderator, admin | `components/ModerationGovernanceSystem.tsx` | Lazy, guarded |
| Admin dashboard | `#/admin-dashboard` | admin | `components/AdminDashboardScreen.tsx` | Lazy, guarded |
| Restricted | (any guarded URL) | — | `App.tsx` + `StateTemplate kind="denied"` | Shown instead of guarded screens |
| Error | (any crash) | — | `components/ErrorBoundary.tsx` | Reference id shown |
