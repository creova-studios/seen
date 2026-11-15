# Cognitive load audit

Date: 2026-10-06. Scope: the 15 screens named below, read from the JSX in `src/app/components` and `src/app/screens`. No source was changed.

How to read the counts. "Controls" are distinct tappable things in the screen body at first load (links, buttons, tabs, chips, rows, cards). "Sections" are visually separate blocks. Both are estimates from code with the demo catalogue (12 public stories, `fundingListings.ts` has 12 listings). Persistent chrome adds 3 header icons (`NavigationBar.tsx:27-40`: Search, Notifications, Profile) and 4 bottom-nav tabs (`seen/BottomNav.tsx:11-15`) on the four tab screens; those are listed separately as "+7 chrome". Priorities: P0 = small, safe, clearly supported by code or CLAUDE.md rules; P1 = worthwhile design change; P2 = later.

## Headline findings

1. For You is the heaviest screen: up to 10 sections and roughly 33 controls in the body plus 7 chrome (40 total) before any "Continue" rail. Only the hero fits in the first viewport (it is 520 px tall, `ForYouSections.tsx:33`).
2. Profile shows the same 4 preference rows pointing at one destination, and a dead-end "Intent" row. A creator sees "Creator Dashboard" three times and "Earnings" twice.
3. Three claims are not backed by code: "Content personalized for exploration" (For You), "Ambient soundscape playing" (Story preview), and "Search stories, creators, topics..." (Explore searches stories only).
4. Four near-duplicate surfaces recur: search (Explore search bar and the global Search overlay), "Following" (Profile row, Library tab, Explore Creators tab), "Featured" (For You hero, For You Featured, Explore Featured), and the profile icon in the header next to the Profile tab.
5. Library's five "tabs" are `div role="button"` stat rows, not tabs (`LibraryScreen.tsx:99-211`), and take roughly 280 px before content.

---

## 1. For You (`ForYouScreen.tsx`, `ForYouSections.tsx`)

1. Primary goal: find the next story to start (or resume one).
2. Primary CTA: "Experience" on the hero (`ForYouSections.tsx:47-49`). Everything else is a card tap.
3. Can wait: presence counts (`ForYouScreen.tsx:162`, `307-337`), Trending and New Releases rails (`228-287`), Voices to discover (`289`), the footer hint (`292-299`). Interests rail only matters if the person picked interests at sign-up.
4. Duplicated:
   - Hero "Editor's feature" (`ForYouSections.tsx:41`), then "Featured / Hand-picked for you" (`ForYouScreen.tsx:203-206`), then Explore's own "Featured" category (`storyService.ts:107-111`): three featured surfaces.
   - Presence row "Creators to follow" (`315`) and the Voices rail subtitle "Creators to follow" (`ForYouSections.tsx:89`).
   - Three "See all" buttons (`206`, `238`, `269`) all open Explore with no tab, so they are the same destination.
   - Page title "For You" (`155`) repeats the bottom-nav label.
   - Every card shows the literal type label "story" (`getContentTypeIcon(item.type)`, lines `218`, `250`, `281`) because every catalogue item is `type: 'story'` (`storyService.ts:39`).
5. Competes visually: the 520 px full-bleed hero with a white button, then an unlabelled-purpose block of three large counts (2xl numbers, `329`), then up to 5 rails of different card widths (240, 150, full-width, rail cards). Presence counts read as the most important text after the hero because they are the biggest type on the page.
6. First-load count: sections up to 10 (hero, welcome note on first visit, title + presence, continue, interests, featured, trending, new, voices, hint); controls about 33 for a new user with interests (1 hero + 3 presence + 8 interests + 3 featured + 4 trending + 4 new + 9 voices + 1 demo-notice dismiss), up to 39 with a Continue rail (+6). In the first viewport: 1 hero button plus chrome.
7. Recommendation:
   - P0: delete the footer hint "Content personalized for exploration/creators/contributors" (`ForYouScreen.tsx:291-299`). `getForYouFeed` destructures `intent` but never uses it (`storyService.ts:70`), so the claim is untrue.
   - P0: remove the `<Music>` icon on "New Releases" (`270`); nothing in the catalogue is music-typed.
   - P1: move "Continue experiencing" directly under the hero and drop or collapse the Presence block to one "Explore" link; the counts are already the Explore tab names.
   - P1: merge Featured, Trending and New into one rail with a small `badge` slot ("Trending", "New") instead of three sections; stop printing "story" on every card.
   - P2: give each "See all" its own destination, or remove them (CLAUDE.md: render only when wired).

## 2. Explore (`ExploreScreen.tsx`) and its tabs

### 2a. Explore shell and Stories tab
1. Primary goal: browse by theme to find something new.
2. Primary CTA: none by design. Closest is the search field (`142-148`, label "Search stories"). The segmented control (`124-133`) is the main control.
3. Can wait: the one-line subtitle "Discover cultural stories and creators" (`120`), categories after the first two.
4. Duplicated:
   - Two search surfaces: the inline bar (`142`) and the global Search overlay from the header icon. They search the same catalogue with different UI (the overlay has filters and recents, the inline one does not).
   - The placeholder says "Search stories, creators, topics..." (`145`) but `searchStories` returns stories only.
   - A story can appear under several theme rails (`storyService.ts:105-131`, substring theme match) and again under Featured.
   - Dead branch: `category.id === 'new-music'` (`ExploreScreen.tsx:201`) never matches; categories are `featured`, `music-sound`, `migration`, `indigenous`, `documentary`.
5. Competes: category headers use 20 px semibold (`SectionHeader.tsx:25`) at the same weight as the page title block; full-height 16:10 cards repeat, so the page is a long identical scroll.
6. First-load count: 3 tabs + 1 search + about 2 cards in the first viewport; about 4 to 5 category sections with 1 to 6 cards each (estimate 12 to 25 controls in the whole tab). Sections: header, tabs, search, up to 5 categories.
7. Recommendation:
   - P0: change the placeholder to "Search stories" (`145`) or make it true; keep to the string table (EN/FR/ES).
   - P1: replace the inline search bar with a single button that opens the global Search overlay, so there is one search surface.
   - P1: de-duplicate across categories (skip a story already shown above); drop the dead `new-music` branch.

### 2b. Creators tab (`CreatorsPanel.tsx`)
1. Goal: find a creator to follow. 2. CTA: tap a creator card (`CreatorCard`, `seen/cards.tsx:32`); "Following" appears as a badge. 3. Can wait: nothing; it is a plain grid. 4. Duplicated: the "Following" badge repeats Library's Following tab. 5. Competes: none; 2-column grid of equal cards. 6. Count: 1 section, about 8 cards (the creator list). 7. Recommendation: P2, add a count or sort; no change needed now.

### 2c. Collections tab (`CollectionsPanel.tsx`)
1. Goal: open a themed set of stories. 2. CTA: tap a collection card. 3. Can wait: nothing. 4. Duplicated: "Saved collections" appears in Profile (`ProfileScreen.tsx:547`) and Library (`LibraryScreen.tsx:196-211`). 5. Competes: none. 6. Count: 1 section, N cards (about 4 to 6). 7. Recommendation: P2, none.

## 3. Library (`LibraryScreen.tsx`)

1. Goal: resume or reopen something I started or saved.
2. Primary CTA: tap an in-progress card (no label). Empty states use "Explore Stories" (`233`, `282`) and "Start Exploring" (`320`).
3. Can wait: the "Completed", "Following" and "Saved collections" views; the subtitle.
4. Duplicated:
   - "Following" and "Saved collections" exist here and in Profile > Your SEEN (`ProfileScreen.tsx:546-547`), and Profile "Following" routes to Explore, not to this tab.
   - Each in-progress card has two targets: the card and a Remove (trash) button (`264-271`).
   - Subtitle "Your saved and in-progress content" (`88`) repeats the stat rows below it.
5. Competes: five 24 px-number rows (`98-211`) take about 5 x 44 px plus gaps (about 280 px) and look like a dashboard; the actual content starts below the fold on a small phone. Rows 1 and 2 animate in with 0.3 s and 0.5 s delays and 0.8 s duration; rows 3 to 5 do not.
6. First-load count: 4 sections (header, five stat rows, active panel, footer dialog hidden); controls: 5 stat rows + N cards (each 2 targets). Empty user: 5 + 1 empty-state action = 6.
7. Recommendation:
   - P0: none that is purely safe. (Rows are `div role="button"` with keyboard handlers, so they work, but see P1.)
   - P1: replace the 5 rows with `SegmentedTabs` (already used on Explore and Funding) showing counts in the labels; default to the first non-empty view (today it always opens on "In progress" even when Saved has items, `48`).
   - P1: drop "Following" and "Saved collections" from Library or from Profile; keep one home for each.
   - P2: Library tab for "Notes".

## 4. Profile (`ProfileScreen.tsx`)

### 4a. Viewer role view
1. Goal: manage my account and preferences.
2. Primary CTA: "Edit Profile" (`179-185`) is the quiet, correct one, but the loudest element is the purple gradient card "Share Your Story / Start Creating" (`354-378`).
3. Can wait: stats grid (`189-199`), Recent Activity (`381-412`), Community block (`461-485`), version footer (`512-514`).
4. Duplicated:
   - Language, Intent, Accessibility and Settings rows (`423-451`) all call `onOpenSettings`: four rows, one destination.
   - "Community Guidelines" and "About SEEN" (`474-483`) both call `onOpenAbout`.
   - "Your Contributions" (`469-473`) opens Library, which has no contributions view; the label does not match the destination.
   - Sign Out here (`494-500`) and in Account and privacy (`AccountPrivacyScreen.tsx:173`).
   - Notifications row (`549`) and the header bell.
   - Profile row/icon in the header and the Profile tab.
5. Competes: purple Start Creating card, two big stat tiles, then 4 rows of Your SEEN (each with a count), all above Preferences. A viewer's own settings are about 700 px down.
6. First-load count: 9 sections (header, stats, Your SEEN, creator invitation, recent activity, preferences, community, sign out, version); controls about 16 to 21 (1 demo dismiss + Edit Profile + 4 Your SEEN + Start Creating + up to 5 activity rows + 5 preference rows + 3 community + Sign Out), plus 7 chrome.
7. Recommendation:
   - P0: remove the "Intent" row (`429-434`). It opens Settings, which has no intent control (`ProfilePreferencesScreen.tsx` has none), so it is a dead end.
   - P0: remove or relabel "Your Contributions" (`470`).
   - P1: collapse Language, Accessibility and Settings into one "Settings" row whose value reads "English · Default" (keep a Language row if you want it visible; see the separation doc).
   - P1: move stats and Recent Activity below Preferences, or behind "Your activity".
   - P2: i18n: almost all Profile strings are hard-coded English (CLAUDE.md rule: `strings.ts` with EN/FR/ES).

### 4b. Creator role view
1. Goal: manage my stories and see how they are doing.
2. Primary CTA: "New Story" (`303-309`), the purple button inside the Creator Dashboard card.
3. Can wait: Monetization and Earnings rows; the My Stories list beyond the first 3; Recent Activity.
4. Duplicated:
   - "Creator Dashboard" three times: moon icon by the name (`162`), the Creator Tools row (`232-237`), the card title (`291`).
   - "Creator Dashboard" row, "New Story" button: both call `onOpenCreatorDashboard` which opens the wizard (`creator-publish`), not a dashboard.
   - "Earnings" row (`244-249`) and "Analytics" button (`310-316`) both go to earnings.
   - "Your stories" button (`299`) and My Stories "See all" (`332`) both go to `creator-stories`.
   - "Notes" button (`300`) and Settings > "Notes from readers" (`ProfilePreferencesScreen.tsx:119`).
5. Competes: Creator Tools list, purple dashboard card, My Stories list, then the viewer-grade stats grid; a creator sees three stacked creator blocks before any personal preference.
6. First-load count: about 12 sections; about 23 controls plus N story rows (viewer 16 minus Start Creating, plus 3 tool rows, 4 dashboard buttons, See all, N story rows).
7. Recommendation:
   - P0: change "Creator Dashboard" row label to "Create a story" or delete the row (`232-237`); delete the "Analytics" button (`310-316`) because the Earnings row already exists.
   - P0: `My Stories` rows are clickable `div`s (`337-341`) with no button semantics; swap to the existing `StoryRow` or a `button` (CLAUDE.md: cards are the tap target, no clickable divs).
   - P1: one "Creator Studio" card with three counts and one primary button; fold Monetization and Earnings into it.
   - P2: moderator and admin rows: "Collections - Browse" (`262-267`) is mislabelled (it opens the institutional `collections` screen).

## 5. Story preview (`FeaturedStoryPreview.tsx`)

1. Goal: decide whether to start this story.
2. CTA: "Start reading" (`story.start`, `242`), or "Unlock story" when locked.
3. Can wait: Note and Report icons (`150-163`), release date (`221`), ambient notice (`248-259`).
4. Duplicated: two start controls: the 80 px centre play circle (`169-182`, hidden from AT) and the labelled button (`236-244`).
5. Competes: five 44 px icon buttons in the top bar (Back, Share, Save, Note, Report; `118-164`), a giant play circle, a pulsing green dot (`255`).
6. First-load count: 6 regions (top bar, play, badges, title and description, credits, content note when present, CTA, ambient notice); 7 controls (5 top bar, 1 play circle, 1 CTA).
7. Recommendation:
   - P0: delete the "Ambient soundscape playing" line and green pulsing dot (`248-259`). Nothing in this component, `PlaybackProvider`, or the player starts ambient audio; the string is a false live status.
   - P1: move Note and Report into a "More" overflow; keep Back, Share, Save.
   - P2: choose one start affordance (the big circle or the button).

## 6. Story reader / player (`StoryChapterScreen.tsx`, `StoryReaderExtras.tsx`, `seen/MediaPlayerBar.tsx`)

1. Goal: read or listen to this chapter and move on.
2. CTA: Play/Pause (`MediaPlayerBar.tsx` `aria-label` play/pause) and "Next" (`StoryChapterScreen.tsx:500-510`); last chapter label is `reader.finish`.
3. Can wait: language switcher, chapter index, Share, Info, Community Responses (`295-350`); speed; Captions and Transcript (`ReaderTools`).
4. Duplicated: Prev/Next appear as buttons and the chapter progress is shown twice (the "Chapter n of N" text and the dot bar, `364-380`); Save and Share also exist on the preview.
5. Competes: a top bar of 6 icon buttons that auto-hide (good) versus a bottom block that never hides: alert, caption bar, player, tools, Prev/Next (`466-518`).
6. First-load count: 3 sections (top bar, text, bottom controls); about 16 controls (top: Close, language, Index, Share, Save, Info, Responses = 7; bottom: seek, back 15, play, forward 15, speed, Captions, Transcript, Prev, Next = 9). Top bar hides after a short delay.
7. Recommendation:
   - P1: keep Close, Index, Save visible; move Share, Info, Community Responses into one "More" menu.
   - P1: group Captions and Transcript as one "Text" toggle.
   - P2: hide back/forward 15 s behind the seek bar for text-first chapters.

## 7. Search (`SearchScreen.tsx`)

1. Goal: find a story by title, author or theme.
2. CTA: none; the input is autofocused (`116`). "Filters" (`123-125`) appears only with results.
3. Can wait: recent searches (`177-192`), topic chips beyond the first few, the filter sheet.
4. Duplicated: the heading "Search Stories" (`104-106`), the input label and the placeholder repeat the same words; the result count appears twice: under the input (`119-121`) and again in the footer (`211-215`); a third appears in the filter sheet.
5. Competes: close X, heading, input, count and Filters stacked in the sticky header (about 130 px) leave less space for results than they should.
6. First-load count: 3 sections (header, recents, topics); about 11 controls with no recents (Close, input, 8 topic chips) plus recents and "Clear".
7. Recommendation:
   - P0: remove the footer count (`210-215`); the header already shows it with `role="status"`.
   - P1: drop the heading and let the input be the title.
   - P2: add creators and collections results or keep Explore's copy honest.

## 8. Funding list (`FundingScreen.tsx`)

1. Goal: find an open funding opportunity that fits me.
2. CTA: tap a listing card; the only button with a label is "Prepare your application" (`98`), which sits above the list.
3. Can wait: the intro paragraph (`36-38`), the verification banner (`39-41`), the "Prepare your application" button, Filters.
4. Duplicated:
   - Verification wording appears in the list banner and in each detail footer (`OpportunityDetailScreen.tsx:233-247`).
   - The banner date "Sep 24, 2026" (`40`) is a hard-coded string, not derived from the listings' `verifiedAt`.
   - "Prepare your application" repeats the checklist inside each detail screen.
5. Competes: an info banner and a full-width secondary button push the first listing about 300 px down.
6. First-load count: 6 sections (intro, banner, tabs, filter row, CTA, list); controls about 18 (Back, 3 tabs, Filters, Prepare, up to 12 cards).
7. Recommendation:
   - P0: derive the banner date from the listings (latest `verifiedAt`) instead of the literal string (CLAUDE.md: update `verifiedAt`, cite sources).
   - P1: move "Prepare your application" below the list or into the tracker tab; collapse the intro and banner into one line with a "How we check" link.
   - P2: surface Funding for creators outside Profile (see the separation doc).

## 9. Opportunity detail (`OpportunityDetailScreen.tsx`)

1. Goal: decide whether to apply and keep track of it.
2. CTA: "Apply on funder's site" or "View on funder's site" (`97`); secondary "Save & track" (`155`).
3. Can wait: eligibility self-check (`102-145`), the checklist, notes and outcome (only after tracking, already progressive), source links (`237-246`).
4. Duplicated: dates appear in the Dates tile (`83`), the `deadlineNote` (`86`), and the warning banner (`148-150`); "Save & track" and "Stop tracking" duplicate the tracker tab; "Checked ... against these sources" repeats the list banner.
5. Competes: the white pill Apply link sits above the eligibility self-check, so people can apply before checking; the self-check is up to 3 criteria x 3 buttons.
6. First-load count: 8 sections (badges and title, amount/dates, summary, apply, eligibility, banner when closed, application, footer); about 15 to 20 controls (Back, Apply, 3 x criteria buttons, Save & track, source links).
7. Recommendation:
   - P0: none (this screen is already well constrained).
   - P1: show eligibility as a single "Check eligibility" disclosure that opens the 9 buttons; place it before the Apply link.
   - P2: show dates once.

## 10. Create Story steps (`CreatorPublishFlow.tsx`, `creator-flow/*`)

Common: a 5-step wizard with auto-saved drafts; each step has a "Step n of 5" label, a title and a bottom bar.

| Step | Goal | CTA (exact) | Sections / controls (est.) | Notes |
| --- | --- | --- | --- | --- |
| 1 `StoryIntentStep.tsx` | Name and ground the story | "Next: Structure" (`363`) | 6 sections / about 23 (title, description, 3 languages, 10 themes, 6 audiences + input, Close) | Header "Cultural Grounding" plus helper card (`318`) repeat the same reassurance; "Draft saved" is a static string (`347`) |
| 2 `StoryStructureStep.tsx` | Choose structure | "Next: Chapters" (`307`) | 3 sections / about 6 (3 options, count input, Back, Next) | Fine |
| 3 `MediaChaptersStep.tsx` | Add chapters and media | "Next: Context" (`463`) | per chapter 1 header + (expanded) title, description, text, Narration, Music, Images, Video, alt text, decorative checkbox, remove; plus Add chapter, Back, Next | Media buttons use `window.prompt` for URLs (`303`, `317`, ...) |
| 4 `ContextAccessibilityStep.tsx` | Context cards, content notes, accessibility, language notes | "Next: Preview" (`526`) | 4 sections / about 20 to 25 | The densest step (533 lines) |
| 5 `PreviewPublishStep.tsx` | Review and publish | "Publish Story" then "Confirm & Publish" | 5 sections / about 11 (3 preview modes, visibility options, 2 to 3 confirmations, Back, Publish) | Preview-mode buttons lead to "Interactive preview coming soon" (`176`) |

1. Goal (overall): publish one story safely.
2. CTA: each step's "Next: X" label.
3. Can wait: Language Notes and Context Cards (optional) in step 4; audience entry in step 1; visibility "institutional" until used.
4. Duplicated: step 1's helper card; the "Step n of 5" label and the "Next: X" label both announce progress.
5. Competes: step 1 shows 10 theme chips at the same weight as the title field.
6. See table.
7. Recommendation:
   - P0: remove the Preview Modes buttons and the 9:16 placeholder (`PreviewPublishStep.tsx:135-180`) or hide them until the preview exists; they are controls that do nothing (CLAUDE.md: no dead buttons).
   - P1: in step 4 collapse Context Cards, Content notes, Accessibility and Language Notes into accordions (only Accessibility opens by default).
   - P1: replace `window.prompt` with an inline URL field.
   - P2: move Audience and the helper card to a later "optional details" panel.

## 11. Settings (`ProfilePreferencesScreen.tsx`)

1. Goal: set language and accessibility.
2. CTA: none (changes apply immediately).
3. Can wait: the privacy paragraph (`108-114`), "About".
4. Duplicated: Language appears again on Profile and in the reader language switcher; "Account and privacy" also holds a Sign out that Profile repeats.
5. Competes: nothing; 4 short sections.
6. First-load count: 4 sections; 8 to 9 controls (3 language radios, 3 toggles, Account and privacy, About, and Notes for creators).
7. Recommendation: P2, none. This is the model screen for low cognitive load.

## 12. Notifications (`NotificationsScreen.tsx`)

1. Goal: see what is new and open it.
2. CTA: "Mark all read" (`47-49`, only when unread).
3. Can wait: older read notifications.
4. Duplicated: the Notifications row on Profile (`ProfileScreen.tsx:549`) and the header bell.
5. Competes: none.
6. First-load count: 1 section; Back + Mark all + N rows (each a single tap).
7. Recommendation: P2, none. Optionally group by day.

## 13. Creator profile (`CreatorProfileScreen.tsx`)

1. Goal: decide to follow and open one of their stories.
2. CTA: "Follow" / "Following" (`134-143`).
3. Can wait: Themes badges (`147-154`), "Report profile" (`163-167`).
4. Duplicated: languages (hero badges, `130`) and themes (`149`) are two badge rows with different colours.
5. Competes: the Follow button is a primary-fill pill under the bio, the first story row follows immediately; low competition.
6. First-load count: 3 sections (hero, themes, stories) + report; controls: Back, Follow, N story rows, Report (about 4 + N).
7. Recommendation: P2, none.

---

## Summary of recommendations by priority

P0 (small, safe, clearly supported):
1. `ForYouScreen.tsx:291-299`: delete the "Content personalized for ..." footer; `intent` is unused in `getForYouFeed` (`storyService.ts:70`).
2. `ForYouScreen.tsx:270`: remove the Music icon from "New Releases".
3. `FeaturedStoryPreview.tsx:248-259`: delete "Ambient soundscape playing" and its pulsing dot.
4. `ProfileScreen.tsx:429-434`: remove the "Intent" row (dead end).
5. `ProfileScreen.tsx:470-473`: remove or relabel "Your Contributions".
6. `ProfileScreen.tsx:232-237` and `310-316`: remove the duplicate "Creator Dashboard" row and "Analytics" button for creators.
7. `ProfileScreen.tsx:337-341`: replace clickable `div` story rows with a button or `StoryRow`.
8. `ExploreScreen.tsx:145`: make the placeholder match what is searched.
9. `SearchScreen.tsx:210-215`: remove the duplicate result count in the footer.
10. `PreviewPublishStep.tsx:135-180`: remove the Preview Modes buttons and placeholder.
11. `FundingScreen.tsx:40`: derive the "checked on" date from data.

P1: For You consolidation (merge three rails, remove presence block, reorder Continue); Library `SegmentedTabs`; single search entry on Explore; Profile creator studio card; reader overflow menu; step 4 accordions; replace `window.prompt`.

P2: i18n of Profile strings, "See all" targets, notification grouping, one start affordance on the preview.
