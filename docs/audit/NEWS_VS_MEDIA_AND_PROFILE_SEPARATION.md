# News vs Media, and Profile / Creator separation

Date: 2026-10-06. Read-only audit of `/home/user/SEEN` (branch as checked out). Nothing in `src/` was changed. Priorities: P0 = small, safe, clearly supported; P1 = worth doing with a small design decision; P2 = later.

---

## Part A. "News" vs "Media"

### A1. What the product has today

Bottom nav is exactly four tabs: For You, Explore, Library, Profile (`src/app/components/seen/BottomNav.tsx:11-15`, `src/app/navigation/routes.ts:61`). `SCREENS` (`routes.ts:11-43`) has no news, media, press or article screen. The Explore tabs are Stories, Creators and Collections (`ExploreScreen.tsx:36`, `128-132`).

### A2. Evidence searched

| Where | Query | Result |
| --- | --- | --- |
| `src/**/*.ts(x)` (production) | `news`, `newsroom`, `journalis` | Only two hits, both URL strings inside a funding listing (`src/app/services/data/fundingListings.ts:175,177`, a funder's `/news-events/` page). No UI, type, route or string. |
| `src/**` | `media` | Always a data field or a file path: `ChapterMedia` (`storyDatabase.ts:32-45`: narration, ambient, music, images, video), `/media/...mp3` URLs, `mediaSource` (a cover image URL, `types.ts:41`), `MediaChaptersStep.tsx` (the Create Story step "Media & Chapters"), `seen/MediaPlayerBar.tsx` (the audio player). The creator named "Indigenous Media Collective" (`storyDatabase.ts:492`) and the funder "Canada Media Fund" (`fundingListings.ts`) are proper names. No Media section, tab or filter. |
| `ContentItem.type` values | `types.ts:12` | `'music' \| 'story' \| 'film' \| 'collection' \| 'archive'`. Only `'story'` is ever produced: `storyService.ts:39`, `searchService.ts:99` and `148`. The other four are never set by any catalogue code path; they only drive icons in `ForYouScreen.tsx:75-90`. |
| Search | `searchService.ts`, `searchFilters.ts` | Filters are language, length and cultural theme only. The header comment says "Figma's Format and Mi'kmaw/Michif options have no data behind them and are not offered" (`searchFilters.ts:1-4`). |
| Explore categories | `storyService.ts:105-132` | `featured`, `music-sound`, `migration`, `indigenous`, `documentary`, all derived from `culturalThemes`. These are the nearest things to "media" categories. |
| Figma-derived docs | `docs/design/screen-matrix.json`, `figma-frames.json`, `FIGMA_COVERAGE_REPORT.md`, `FIGMA_INVENTORY.md`, `SCREEN_COVERAGE_MATRIX.md`, `specs/*.md` | No frame, tab or label named News. "Media" occurs only as "Media Player Bar", "Media Buffering State", "Media playback error" and the wizard step "creator-wizard-media". `specs/SEARCH_STORY_PLAYER.md:48` shows a Figma search filter FORMAT with chips Audio, Film, Written, Photography (a format facet, not News or Media). `specs/PROFILE_LIBRARY_CREATOR.md:118` shows a notification toggle "Product news" (a notification category; not implemented in code). |
| Audit docs | `docs/audit/CUSTOMER_FEEDBACK_TRACEABILITY.md:21` | Row "Clarify News vs Media", status OPEN: "The app has no News or Media tabs; four tabs ... Only needed if those are product concepts". `CONSOLIDATION_REPORT.md:29` lists "News/Media concepts" under open product decisions. |
| `docs/archive/**` | `news`, `journalism` | Marketing and production text only: "cultural media platform" (`CMF_TECHNICAL_APPENDIX.md:33`), investigative journalism as a branching use case (`:207`), voice-actor tone notes ("NOT news anchor delivery", `VOICE-ACTOR-BRIEF-FRENCH.md:70`). None describes a News section. |
| `archive/src/**` (unbuilt) | `news` | `curatedFilmsRegistry.ts:671-678` records "CBC News" as a rights source for a film; no News feature. |

The exact words of the original tester comment are not in the repository; the only trace is the one-line traceability row above. This audit does not guess what the tester saw.

### A3. Determination

| Question | Answer, with evidence |
| --- | --- |
| Does News exist as a content type, category, filter, section or route? | No. There is no data field, enum value, theme, route or string. |
| Does Media exist as a section or tab? | No. "Media" is a technical word for chapter assets (audio, music, images; `video` is declared but no catalogue story uses it: `grep video: storyDatabase.ts` returns 0) and for the creator step "Media & Chapters". |
| Could Media be a content format? | Yes, in the sense of Listen / Read / Watch, but that is not modelled. `ContentType` has `music`, `film`, `archive` but nothing sets them, and `Chapter.media.narration` exists on 9 chapters in the catalogue (`grep -c "narration:" storyDatabase.ts`). The traceability row "Read / Listen / Watch wording" is PARTIAL for exactly this reason. |
| Could News be an editorial section? | Nothing supports it. SEEN's own copy puts journalism inside stories ("Investigative journalism where audience questions shape follow-up reporting", archive appendix), i.e. a theme, not a news feed. A News feed would need a publishing cadence, sourcing rules and moderation not present in the app (CLAUDE.md rules on real, sourced content apply). |
| Are they redundant? | If added as tabs they would duplicate Explore: "Media" would overlap the existing "Music & Sound" and "Documentary" categories (`storyService.ts:112-131`), and "News" would overlap "Documentary". They would also add a fifth top-level destination to a four-tab app that is already heavy (see `COGNITIVE_LOAD_AUDIT.md`). |
| Possible confusion source | For You vs Explore vs Library are the only content tabs, and the docs themselves must explain them ("Explore: curated, NO personalised content - different from For You", `ExploreScreen.tsx:5-6`). A tester asking "News vs Media" may be asking what differs between two content tabs. Unverified. |

### A4. Recommendation

1. Do not add News or Media as tabs, sections or filters. There is no product concept to implement and the code has nothing to organise.
2. Close the open row with a precise answer (P0, documentation only): "SEEN has For You (personal feed), Explore (browse by theme, creators, collections), Library (what you started or saved). News and Media are not sections; stories carry themes, and each story can include audio, music and images."
3. If the intent is "what kind of thing is this?", model Media as a format, not a tab (P1): derive `format` ("Listen", "Read", "Watch") from chapter media (`narration` present = Listen; `video` present = Watch; otherwise Read), show it as the verb on the card `typeLabel` slot instead of the literal "story" now printed on every card (`ForYouScreen.tsx:218,250,281`, `ExploreScreen.tsx:173,228`), and only then offer a Format filter in `SearchFiltersSheet` using real facets (matches `searchFilters.ts` rule and the Figma FORMAT row at `specs/SEARCH_STORY_PLAYER.md:48`).
4. If the intent is "current affairs", record it as a theme only when real stories exist (P2): add `News & Current Affairs` to `culturalThemes` of those stories, and it appears automatically in Search topics and interests (`interests.ts:7-11`). No new route.
5. Remove dead type values (P2): `ContentType` keeps `music | film | archive | collection` that nothing produces (`types.ts:12`) and one dead branch `category.id === 'new-music'` (`ExploreScreen.tsx:201`). Either use them (item 3) or drop them.
6. Do not implement the Figma "Product news" notification toggle until product news exists.

P0 for Part A: item 2 only (a documentation answer; no source change). Everything else is P1 or P2.

---

## Part B. Profile / Creator separation

### B1. How "creator" is decided today

- A role is stored per account: `viewer | creator | moderator | admin` (`StoryStateContext`, `routes.ts:1`). `creator` is self-assignable at sign-up (`AuthContext.tsx:35`, `SELF_ASSIGNABLE_ROLES = ['viewer','creator']`).
- Onboarding Purpose step picks the role: "share" or "audience" gives `creator`, otherwise `viewer` (`OnboardingOrientation.tsx:24-28`). So a person who ticked "share" on day one is a creator with zero stories and sees the full creator profile at once.
- A viewer who finishes the Create Story wizard stays a viewer: `onFirstContentPublished()` (`roleService.ts:74-83`) has no call site, and the comment at `ProfileScreen.tsx:368` ("This will trigger role upgrade when they publish") describes behaviour that is not wired.
- `creator-stories`, `creator-monetization`, `creator-earnings` and `notes` are role-guarded to creator and admin (`routes.ts:55-61`). A viewer who published a story therefore cannot open "Your stories".
- The wizard route `creator-publish` is open to every signed-in role (not in `SCREEN_ROLES`).

### B2. Exact current Profile sections (`src/app/components/ProfileScreen.tsx`)

Legend: V = plain viewer, C = creator, M = moderator, A = admin.

| # | Section | Lines | Sees it | Contents |
| --- | --- | --- | --- | --- |
| 1 | Demo notice | 143 | all | `DemoModeNotice` |
| 2 | Profile header | 145-186 | all | Avatar initial, name, moon icon if creator (`162-164`), email, "Member since", bio, **Edit Profile** button |
| 3 | Stats | 189-199 | all | "Stories Completed", "Minutes Listened" |
| 4 | Your SEEN | 202, `531-553` | all | Following, Saved collections, **Funding tracker**, Notifications |
| 5 | Dev role switch | 205-214 | none | Empty block under `NODE_ENV === 'development'` |
| 6 | Role tools | 217-278 | C, M, A | C: Creator Dashboard, Monetization, Earnings. M/A: Moderation Panel. A: Collections ("Browse"), Platform Dashboard |
| 7 | Creator dashboard card | 281-320 | C | Published and Drafts counts; Your stories; Notes; New Story; Analytics |
| 8 | My Stories | 323-351 | C with a story or draft | Up to N story rows (clickable `div`s), See all |
| 9 | Share Your Story | 354-378 | V | Gradient card, "Start Creating" |
| 10 | Recent Activity | 381-412 | all | Up to 5 started/completed items or empty state |
| 11 | Preferences | 415-458 | all | Language, Intent, Accessibility, Settings, Subscriptions & Billing |
| 12 | Community | 461-485 | all | Your Contributions, Community Guidelines, About SEEN |
| 13 | Sign Out | 488-509 | all | Button and confirm dialog |
| 14 | Version footer | 512-514 | all | "SEEN v1.0.0" |

What a viewer sees: sections 1, 2, 3, 4, 9, 10, 11, 12, 13, 14 (about 16 to 21 controls).
What a creator sees: sections 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14 (about 23 controls plus story rows).

Creator-related content a plain viewer already sees: "Funding tracker" row (`548`), the loud "Share Your Story / Start Creating" card (`354-378`), "Notifications" mixes funding deadlines with story updates (`NotificationsScreen.tsx:57`). Funding has no other entry point: the only `nav.go("funding")` is `ProfileScreen.tsx:548`.

Settings (`ProfilePreferencesScreen.tsx`): Language, Accessibility (3 toggles), Privacy text, Account and privacy, Notes from readers (creator/admin only, `118-120`), About. Account and privacy (`AccountPrivacyScreen.tsx`) holds notification toggles, blocked accounts, password, legal, data download, sign out and delete.

What does not exist anywhere: a screen to edit interests. `setInterests` is called only in onboarding (`OnboardingSystem.tsx:43`), yet For You depends on them (`ForYouScreen.tsx:54-55`). The "Intent" row on Profile (`429-434`) opens Settings, which has no intent control.

### B3. Target model

A viewer profile exposes only: identity and Edit Profile; preferences (language, accessibility); account (notifications, privacy, sign out); interests; saved choices (following, saved collections, Library shortcuts). Creator tooling is one disclosure: **Creator Studio** (new story or continue draft, your stories and review status, publishing, funding, earnings, creator profile), shown when relevant.

Relevance rule (single helper, no new data):

```
showStudio = role in {creator, admin}
          || listDraftsForCreator(userId).length > 0
          || listStoriesForCreator(userId).length > 0
```

- Viewer with none of those: one quiet row "Create a story" (not a gradient card) that opens the wizard.
- Viewer with a draft: "Continue your draft" row plus the studio disclosure.
- Creator with nothing yet: the same quiet row plus a collapsed "Creator Studio" row.
- Moderator and admin tooling stays a separate "Moderation" / "Admin" row group; it is role-only and not part of this change.

### B4. Concrete minimal change list

P0 (small, safe, supported by code and CLAUDE.md rules):
1. Remove the "Intent" row (`ProfileScreen.tsx:429-434`); it opens a screen with no intent control.
2. Remove "Your Contributions" (`469-473`), which opens Library, or rename it "Library".
3. Remove the duplicate creator entries: delete the "Creator Dashboard" row (`232-237`; it opens the wizard, not a dashboard) and the "Analytics" button (`310-316`; same destination as the Earnings row `244-249`). Keep one "New Story" and one "Earnings".
4. Replace clickable `div` rows in My Stories (`337-341`) with `button` or `StoryRow` (CLAUDE.md: no clickable `div`s).
5. Do not show the "Moon" glyph beside the name (`162-164`); it is decoration with no label and identifies the creator role to bystanders.

P1 (small design decision, same data):
6. Add `showStudio` (above) and wrap sections 7 and 8 plus the "Funding tracker" row into one collapsed "Creator Studio" `ListItem` group, closed by default for roles with no drafts or stories and open for creators with a story. Funding must stay reachable: it has no other entry (`ProfileScreen.tsx:548` is the only link), so keep a "Funding" row inside the studio group and, for viewers, link it from the quiet "Create a story" row ("Create a story, find funding").
7. Replace the viewer's gradient "Share Your Story" card (`354-378`) with the single quiet row from B3; keep the exact label "Start Creating" on the row's button or `description`.
8. Collapse Language, Accessibility and Settings rows (`423-451`, all open Settings) into: Language (value shown), Accessibility (value shown), and no separate "Settings" row, or one "Settings" row that shows both values. Keep Subscriptions & Billing in the Account group.
9. Move Stats (`189-199`) and Recent Activity (`381-412`) below Preferences, or into a "Your activity" disclosure.
10. Add an Interests row in Settings (reuse `InterestsStep` chips and `setInterests`), because For You uses interests but nothing lets people change them (`OnboardingSystem.tsx:43`).
11. Decide and wire role elevation: either call `onFirstContentPublished()` after `publishStory` in `CreatorPublishFlow.tsx` (the existing function is documented as the only path in production) or open `creator-stories` to anyone who owns a story. Today a viewer who publishes cannot open "Your stories". This needs a product decision because `AuthContext` documents elevation as an approval flow.

P2:
12. Move "Notes from readers" (`ProfilePreferencesScreen.tsx:118-120`), Monetization and Earnings into the studio only.
13. Add a Creator Studio screen (overview, drafts, review status) as in `specs/PROFILE_LIBRARY_CREATOR.md:103-106`; the Profile disclosure then becomes one row that opens it.
14. Move the Profile strings into `strings.ts` with EN/FR/ES (CLAUDE.md rule); most are hard-coded English now.
15. Rename moderator/admin row "Collections - Browse" (`262-267`), which opens the institutional collections screen.

### B5. Result after P0 + P1

- Viewer, no activity: header + Edit Profile, a quiet "Create a story" row, Your SEEN (Following, Saved collections, Notifications), Preferences (Language, Accessibility, Interests, Subscriptions & Billing), Community, Sign Out. About 6 sections, 12 to 14 controls (from 9 sections and 16 to 21).
- Creator with stories: the same plus one open "Creator Studio" group with New Story, Your stories, Funding, Earnings, Notes. The stat tiles and the three duplicated labels disappear.

---

## Summary

News and Media do not exist as sections, tabs, filters or types in code or in the Figma-derived docs; "media" is a technical term for chapter assets and "news" appears only in funder URLs and a Figma notification toggle. Adding either would duplicate Explore categories. The Profile screen shows viewers 10 sections and creators 12, with duplicated creator labels and a dead "Intent" row; creator tooling can be folded into one progressive-disclosure group driven by role, drafts and published stories.

P0 list: (1) answer the News/Media tester row in the docs (no source change); (2) remove the "Intent" row; (3) remove or rename "Your Contributions"; (4) remove the duplicate "Creator Dashboard" row and "Analytics" button; (5) make My Stories rows real buttons; (6) drop the unlabelled moon glyph by the name.
