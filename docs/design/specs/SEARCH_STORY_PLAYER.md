# Figma specs: Search + Story / Player (file 8WMBpUhanDkUjodZYolyDT)

Extracted via get_design_context (390x844 mobile frames unless noted). All frames share: canvas `--seen-canvas-base` (#0b0b0c), a 2% white "grain" overlay, a status bar ("9:41", Inter Medium 13, 24px left) and a Back Button (JetBrains Mono, "←" 16 + "Back" 14, color #a1a1aa, left 16, top 46). Status bar and Back text are Figma chrome, not app UI (the app uses TopBar / ScreenFrame).

Type styles (Figma name = size/weight/family): Display 48 Fraunces Light, lh 1.08, ls -1; Heading 1 34 Fraunces Reg, lh 1.16, ls -0.5; Heading 2 26 Fraunces, lh 1.22, ls -0.3; Heading 3 20 Inter SemiBold, lh 1.3; Body Large 18 Inter, lh 1.55; Body 16 Inter, lh 1.55; Subheading 16 Inter SemiBold, lh 1.35; Body Small 13 Inter, lh 1.5, ls 0.1; Label 13 Inter Medium, lh 1.2, ls 0.2; Button 13 Inter SemiBold, lh 1, ls 1.6 (uppercase); Caption 12 Inter, lh 1.4, ls 0.2; Metadata 11 Geist Mono, lh 1.3, ls 0.8 (uppercase eyebrow); Nav Label 11 Inter Medium. Fraunces uses `font-variation-settings: "SOFT" 0, "WONK" 1`.

Tokens seen: `--seen-canvas-base` #0b0b0c, `--seen-canvas-true` black, `--seen-surface-base` #121214, `--seen-surface-elevated` #1a1a1d, `--seen-surface-scrim` black, `--seen-border-default` #222226, `--seen-border-strong` #2e2e33, `--seen-text-primary` white, `--seen-text-secondary` #a1a1aa, `--seen-text-muted` #8b8b94, `--seen-text-on-brand` #0b0b0c, `--seen-brand-primary` white, `--seen-brand-on-primary` black, `--seen-brand-accent` #c084fc, radii `--seen-radius-sm/md/xl/pill` = 8/12/24/999, spacing `--seen-space-2..8` = 4/8/12(4)/16(5)/20(6)/32(8) (space-3=8, space-4=12, space-5=16, space-6=20, space-8=32).

Common gutter: 24px (search/player frames), 16-20 px for sheets. Most listing frames use ellipse placeholders for icons (PLACEHOLDER glyphs: replace with lucide icons).

---------------------------------------------------------------------------
## 1. Search Landing (322:2)
Purpose: search entry state, pre-typing: recent queries + suggestions.
Sections:
- Search field (top 64): 342x44, pill radius, bg surface-base, 2px border-strong (focused look), px 12, 16px leading magnifier icon (placeholder ellipse), placeholder "Search stories, creators, cultures" (Body 16, text-muted).
- Label "RECENT" (Label 13, text-muted, ls 0.2) at top 128.
- 3 recent rows (342 wide, py 12, bottom 1px border-default, icon 18 + Body 16 primary text): "Nova Scotian documentary", "Sylvia Hamilton", "migration stories".
- Label "SUGGESTED FOR YOU".
- 3 suggestion rows, two-line (Body 16 + Caption 12 muted): "Sound-driven storytelling" / "12 stories"; "Africville Museum" / "Institution · 8 collections"; "Songs of the Bedford Basin" / "Collection".
- Text link "Clear recent searches" (Label 13, brand-primary).
States: recents empty (hide section), suggestions loading. Interactions: tap recent/suggestion = run that query; "Clear recent searches" wipes local recents (confirm not required, toast optional); clear/back leaves search.
Data: per-device recent query list (localStorage, never sent to analytics per CLAUDE.md), suggestions needing counts: stories by theme, creators, collections, institutions. PLACEHOLDER: the counts "12 stories", "8 collections" are mock.

## 2. Search Results (322:39)
Purpose: results for a typed query ("documentary"), grouped by entity type.
Sections:
- Filled search field (1px border-default, text primary "documentary").
- Filter chips row (top 124, gap 8): Top (selected: bg brand-primary, text brand-on-primary), Stories, Creators, Collections, Institutions (unselected: 1px border-default, text-secondary). Chip: pill, px 12, py 8, Label 13. Height 36 visually (Figma), app needs >=44 hit target.
- Meta row: "24 results" (Caption, muted) left; "Filters · Sort" (Label, brand-primary) right.
- Group eyebrow "STORIES" (Metadata 11 Geist Mono, muted). 2-col grid, card 164 wide, gap 20/14: gradient art 164x110 radius md; title Subheading 16 SemiBold ("Crossing Lines", "The Long Return", "Between Worlds", "Night Market"); caption "Documentary · 2024".
- Group eyebrow "CREATORS": list rows with avatar 18 (placeholder), name Body 16 + caption: "Daniel Wolfe" / "Documentarian · 9 stories"; "National Film Board of Canada" / "Institution".
- Bottom nav 64px, border-top default, bg surface-base: FOR YOU, EXPLORE (active, brand-primary), LIBRARY, PROFILE (Nav Label 11).
Interactions: chip = filter result type; "Filters · Sort" opens Filters Sheet (frame 4); card taps open story; creator row opens creator profile.
Data: ranked mixed results with type, story title/format/year, creator title (role) and story count. PLACEHOLDER: all names above are demo copy ("Daniel Wolfe", "Crossing Lines" etc. are not catalogue facts); "Documentary · 2024" implies format+year fields that StoryWorld lacks (releaseDate exists).

## 3. Search Zero Results (322:103)
Purpose: no match, offers a spelling correction.
- Field shows typo "documenttary".
- Centered block at top 200, width 320, gap 10: "No results for" (Body Small 13, muted); “documenttary” (Heading 3 20 SemiBold, primary); "Did you mean documentary? We couldn't find an exact match. Try fewer or different words." (Body Small, secondary, centered); primary Button (bg brand-primary, text on-brand, px 16, py 8, radius md, Button style) "SEARCH “DOCUMENTARY”".
- Text link "BROWSE ALL STORIES" (Label 13, secondary) at top 430.
Interactions: primary re-runs search with suggestion; link goes to Explore/all stories.
Data: a did-you-mean suggestion (Fuse close match / vocabulary), only shown when one exists.

## 4. Search Filters Sheet (322:117)
Purpose: bottom sheet of filters over dimmed results (scrim rgba(0,0,0,0.5)).
- Sheet 390x560 at top 284, bg surface-base, 1px border-default, top radius xl (24), px 20, pt 12, pb 32, gap 18. Grabber 36x4 border-strong.
- Header: "Filters" (Heading 3 20) + "Reset" (Label 13, brand-primary).
- FORMAT (Label 13, secondary eyebrow): chips Audio (selected), Film, Written, Photography.
- LANGUAGE: English (selected), Mi'kmaw (selected), French, Michif. (Multi-select: two selected.)
- LENGTH: Under 15 min, 15–45 min (selected), 45 min+.
- Chip: pill, h 36, px 12, py 8, gap 8 wrap; selected = bg brand-primary + on-primary text; unselected = 1px border-default + text-secondary.
- CTA full width 342x52, radius md, bg brand-primary: "SHOW 14 RESULTS" (Button style).
Interactions: toggle chips (multi for Format/Language, single for Length), Reset clears, CTA applies and closes; count is live.
Data: facets per field with counts. PLACEHOLDER/mismatch: Mi'kmaw and Michif languages and Film/Photography formats are not in the app (only en/fr/es; stories have no format/length facet beyond `totalDuration` string and `estimatedDuration` minutes per chapter). Do not ship unsupported options.

## 5. Search Keyboard Active (420:3)
Purpose: typing state with live suggestions above the iOS keyboard.
- Input 300x44 radius 22, bg surface-elevated, 2px border-strong, magnifier 14, text "africv" (Body Small 13) with caret (2x20 brand-primary), "Cancel" (Caption 12, brand-primary) right of field at x 332.
- Eyebrow "SUGGESTIONS" (Metadata 11). Rows (Body Small 13, 44 px pitch, 14px icon): "Remember Africville", "Africville Museum", "Africville relocation, 1964", "Seaview United Baptist Church".
- Helper copy: "Results update as you type. Enter runs a full search; Cancel dismisses the keyboard and returns to recents." (Caption 12, muted) - this is a design annotation (PLACEHOLDER, do not ship as UI copy).
- iOS keyboard mock 291px with "search" return key (brand-primary, on-primary text, 78x42).
Interactions: typeahead suggestions, Enter = full search, Cancel = blur + show landing.
Data: typeahead entries mixing stories, institutions, topic phrases, places.

---------------------------------------------------------------------------
## 6. Story Audio Player / Playing (323:88)
Purpose: full-screen chapter player (audio).
- Background gradient 114.8deg #291f0f to #0d0d0f; bottom scrim gradient (500px from transparent to #050508).
- Chevron-down (placeholder vector) top-left to close/minimise.
- Eyebrow "REMEMBER AFRICVILLE" (Metadata 11, text-secondary) at top 470; title "Chapter 2 - The church comes down" (Heading 1 34 Fraunces, 342 wide).
- Waveform (top 588): 3x(6..36) bars, gap 3, pill; played = brand-primary, remaining = border-strong. Static decorative art.
- Times: "6:12" left, "-5:28" right (Metadata 11, secondary).
- Transport row (72 high, 342 wide): "<< 15" (56 box, Label 13), previous-track icon 20 (56 box), play/pause 64 circle bg brand-primary with "❚❚" glyph, next-track icon (56), "15 >>" (56). Glyphs are placeholders for rotate/skip icons.
- Utility row (top 778): "CC Captions" (muted, tappable), "Transcript" (secondary, tappable), "1.0×", "Sleep timer" (secondary).
Interactions: play/pause, seek +/-15s, previous/next chapter, scrub, speed cycle, sleep timer, toggle captions, open transcript.
Data: chapter title, story title, narration audio url + duration, elapsed/remaining, chapter list for prev/next. Sleep timer and speed are device features needing no data.

## 7. Captions Active (324:2)
Same as Playing but bg gradient ends #050508, no waveform. Caption panel at top 610: bg surface-scrim, radius md, px 16, py 12, gap 6. Speaker line "SYLVIA HAMILTON → EN" (Metadata 11, brand-primary) + quote “The river doesn't forget. It only changes how it carries a thing.” (Body Large 18, primary). Transport shows four 52px glyph buttons + 64px pause. Utility row: "CC  Captions on" (brand-primary) left; "EN · KIN · FR" (Label, secondary) right = caption language selector.
Data: timed caption cues (start/end, speaker, language). PLACEHOLDER: "KIN" (Kinyarwanda) is not an app language; speaker name and quote are demo copy.

## 8. Buffering (324:31)
Same chrome. Centre: 40px spinner (placeholder ellipse) at top 580; "Buffering - 42%" (Body Small 13, secondary); 4px progress track (surface-elevated, pill) with 144px fill brand-primary at top 676. Transport 64 high, justify-between: rotate-ccw 15, skip-back, play 64 (bg surface-elevated, play icon 24), skip-forward, rotate-cw 15. Bottom row (top 790): "Connection is slow." (Caption, muted) + outlined pill button (1px brand-primary, bg surface-elevated, px 10, py 6) "Switch to low-bandwidth audio?".
Interactions: low-bandwidth button swaps to a lower-bitrate source. Data: buffered percent, a second low-bitrate asset (not in data). Ship the spinner and honest "Loading..." only; hide the low-bandwidth link unless an alternate asset exists.

## 9. Playback Failed (324:58)
Same chrome. Alert icon 48 at top 578 (placeholder ellipse). Heading "Playback stopped" (Heading 3 20 SemiBold). Body "We lost the audio stream. Your place is saved at 6:12 — try again, or download this chapter to listen offline." (Body Small 13, secondary, centered, 320 wide). Primary pill Button "TRY AGAIN" (bg brand-primary, px 20, py 12, radius 999, ls 1.4). Secondary outline 342x48 radius md "DOWNLOAD CHAPTER" (1px border-strong, Button style) at top 794.
Interactions: retry reloads the track at saved position; download saves for offline. Data: saved position, offline download support (not implemented).

## 10. Transcript (324:72)
Purpose: scrollable timestamped transcript, current line highlighted, with mini player.
- Chevron-down at (28,57). Eyebrow "TRANSCRIPT · CHAPTER 2" (Metadata, brand-primary) top 96; title "The river remembers" (Heading 2 26 Fraunces, 300 wide).
- Cue rows (342 wide, py 12, gap 14): timestamp column (Metadata 11, muted; current = brand-primary) + text column 280 wide: speaker caption (Caption 12 muted, "NARRATION" / "SYLVIA") then text Body 16 secondary; current cue uses Body Large 18 primary. Cues: 0:00 NARRATION "The church had been her grandmother's, and her grandmother's before that."; 0:42 SYLVIA “We were baptised in that water. Every child in Africville was.”; 1:30 NARRATION "Every pew held a family — names the Basin would not let the city forget."; 3:05 (current) SYLVIA “The river doesn't forget. It only changes how it carries a thing.”
- Mini bar (top 780, bg surface-base, border-top default, px 16): 36 circle cover, title "The river remembers" (Label) + "3:05 / 11:40" (Caption muted), "CC" (Label, brand-primary).
Interactions: tap a cue seeks to its timestamp; auto-scroll follows playback; CC toggles captions.
Data: per-chapter timed transcript with speaker labels. PLACEHOLDER: all cue text/speakers are demo; note the transcript title differs from the chapter title ("The river remembers" vs "The church comes down").

## 11. Story Completion (329:16)
Purpose: end-of-story celebration + next actions. Bg `--seen-canvas-true` (black), 560px radial glow ellipse behind text.
- Eyebrow "YOU FINISHED" (Metadata, brand-primary) top 300; title "Remember Africville" (Display 48 Fraunces Light); "3 chapters · 42 minutes · your 14th story on SEEN" (Body Large, secondary).
- Pull-quote card (342 wide, bg surface-base, 1px border-default, radius md, p 16): “The river doesn't forget. It only changes how it carries a thing.” (Body 16 primary) + "— Aaron Carvery, Chapter 2" (Caption muted). NB: speaker differs from other frames (Sylvia Hamilton): PLACEHOLDER.
- Primary pill "SUPPORT THIS WORK" (top 676), outline 326x52 "SEE RELATED STORIES" (radius md, 1px border-strong), text link "Back to library" (Label 13, muted).
Data: chapter count, total minutes, user's finished-story count (derivable from StoryStateContext progress), a real quote from chapter text with true attribution, creator support/funding link (only if creator has funding set up), related stories.

## 12. Context Card Modal (329:2)
Bottom sheet over 55% black scrim: 390x600 at top 244, surface-base, 1px border-default, top radius 24, px 20, pt 12, pb 32, gap 16, grabber 36x4.
- Art block 342x150 radius md (gradient 156deg #4d381f to #0d0d0f) - image slot.
- Eyebrow "CULTURAL CONTEXT · VERIFIED WITH THE AFRICVILLE MUSEUM" (Metadata, brand-primary).
- Title "Seaview Church" (Heading 2 26 Fraunces).
- Body (Body 16, secondary): "The Seaview African United Baptist Church stood at the centre of Africville from 1849. Congregants were baptised in the waters of the Bedford Basin. The City demolished it overnight in 1967, during the relocation — an act the 2010 municipal apology named specifically."
- Source (Caption muted): "Source: Africville Museum · Africville Genealogy Society".
- Outline button 326x52 "VIEW THE COLLECTION".
Rule: "VERIFIED WITH THE AFRICVILLE MUSEUM" and named sources are claims about real organisations; ship only if there is a signed agreement/verification record (CLAUDE.md). Data: contextCard type, title, content, image, verifier + sources, linked collection.

## 13. Story World (323:2)
Purpose: story detail / landing before playing; scrolls (1512px).
- Hero 390x560: gradient art 124.9deg #4d381f to #0d0d0f, bottom fade to canvas-base from y 220. Circular back (36, x16,y52) and a second 36 circle at right (x338) for share/more (placeholder).
- Eyebrow "STORY · AUDIO · ENGLISH + FR" (Metadata brand-primary) top 360; title "Remember Africville" (Display 48); byline "Sylvia Hamilton  ·  Halifax, NS  ·  3 chapters  ·  42 min" (Body Small secondary).
- Actions row (top 540, gap 10): primary 180x48 radius md "▶  BEGIN CHAPTER 1"; three 48x48 icon buttons (placeholder: save, download, share).
- Description (Body Large secondary): "In 1964 the City of Halifax began razing Africville, the Black community on the shore of the Bedford Basin. Across three chapters, the people who lived there tell it in their own voices."
- Creator row (top 756): avatar 44, "Sylvia Hamilton" (Subheading 16), "Storyteller · 6 stories · 1.2K followers" (Caption), "Follow" pill (1px border-strong, px 12, py 4, Label 13).
- Context card (top 832, surface-base, 1px border-default, radius md, p 16): "CULTURAL CONTEXT" (Metadata brand-primary), "Seaview United Baptist Church was the heart of Africville — worship, meeting, and baptism in the Basin. The City demolished it overnight in 1967. SEEN verified this account with the Africville Museum, built on the church's original site." (Body Small secondary), link "Learn more about Seaview Church" (Label brand-primary).
- "Chapters" (Heading 3) with rows (26 status icon + Subheading + Caption): "1 · The Basin" / "Completed"; "2 · The church comes down" / "Continue · 6 min left" (brand-primary); "3 · What the Basin keeps" / "Unlocks after chapter 2" (whole row muted = locked).
- "Related stories" (Heading 3): 3 cards 150 wide, art 110 high, title Subheading: "Salt & Cedar", "Night Market", "Between Worlds".
Data: all from StoryWorld + progress; "1.2K followers", "Unlocks after chapter 2", "SEEN verified" are not backed by data.

## 14. Chapter Index (323:63)
- Chevron-back (28,57). Title "Remember Africville" (Heading 1 34, 300 wide).
- Progress: 4px track (surface-elevated, pill, 342 wide) with fill 114px (33%) brand-primary; caption "3 chapters · 42 min · 33% complete" (Caption muted).
- Rows 342x72, radius md, px 12, gap 14, 32px status icon (placeholder): "1 · The Basin" / "Completed · 11 min"; current row has bg surface-base + 2px `--seen-brand-accent` border: "2 · The church comes down" / "6 min left" (brand-primary); "3 · What the Basin keeps" / "17 min" (muted, locked).
- Outline button 342x48 "DOWNLOAD ALL · 86 MB" (1px border-strong, Button style).
Data: chapters, durations, progress, download size (needs asset sizes + offline support).

## 15. Video Player Landscape (329:31) - 844x390
- Video surface gradient 155deg #1a2429 to #050508; top scrim 90px (0.8 to 0), bottom scrim 140px (0 to 0.85).
- Top: title "Crossing Lines — Part 2" (Label 13, x24,y22); close "X" 12px at x802.
- Centre play: 64 circle (placeholder) + "▶" glyph (Fraunces 26).
- Caption pill (top 250, centered 520 wide, bg surface-scrim, radius sm 8, px 16, py 8): “We drew the line ourselves. Now we live on both sides of it.” (Body 16).
- Scrubber (x72,y330, 700x4, track white, fill brand-primary 280px = 40%).
- Control row (y348, gap 16): "❚❚", "12:04 / 28:30" (Label primary), spacer, "CC", "1.0×", "⤢" (Label secondary).
Data: video url + duration (ChapterMedia.video exists), captions cues. Landscape needs orientation handling / fullscreen API.
---------------------------------------------------------------------------

# App mapping (read from code)

## What exists
- `src/app/screens/SearchScreen.tsx`: full-screen overlay (not a route) with `SearchBar` (autoFocus), 300 ms debounced Fuse search (`searchStories`, `getSearchSuggestions` in `data/searchService.ts`, over title/description/creator/themes of `STORY_WORLDS`), `StoryCard` results, "No stories found" bare text, footer result count, `track("search_performed",{results})`. Suggestions are computed but never rendered. No recents, no type chips, no filters, no did-you-mean, no hit-target grouping of creators/collections/institutions.
- `StoryChapterScreen.tsx`: reader/player hybrid. Chapter text is shown as scrollable prose; `usePlayback()` (src/app/playback/PlaybackProvider.tsx) loads narration `src` or falls back to device speech (Web Speech) using `chapter.text`. Status = idle | loading | playing | paused | ended | unavailable; elapsed/duration/progress, seek(f), skip(±s), toggle, stop exist. Bottom `ExpandedPlayer compact` (seen/MediaPlayerBar.tsx) already shows "Recorded narration" vs "Device voice", "Loading…" and "Narration isn't available for this chapter on this device." Context cards open `ContextCardModal` via an Info button; Prev/Next chapter; `ChapterIndexScreen` via List button; community responses; branching.
- `ContextCardModal.tsx`: floating card (not a sheet): type label (cultural/historical/institutional), title, content, optional image/externalLink/tags. No "verified with X" line, no sources field, no CTA.
- `ChapterIndexScreen.tsx`: already built on `ChapterRow` (Available/Playing/Completed/Locked), `LinearProgress`, resume/start `Button`; shows total minutes, chapters count, locked state via monetization. Missing vs Figma: "% complete" caption, per-row "N min left", "Download all · size".
- `FeaturedStoryPreview.tsx` is the Story World screen (cover, save/share, paywall, report, note). Chapters list is on the Chapter Index screen.
- Primitives available: `Sheet` (bottom sheet, radix, grabber, title, close, footer slot, max-h 85vh), `Banner` (info/success/warning/error), `StateTemplate` (empty/error/offline/...), `Button`, `IconButton`, `Chip` (selectable pill), `SegmentedTabs`, `Toggle`, `Checkbox`, `RadioGroup`, `SearchBar`, `Skeleton`, `ChapterRow`, `LinearProgress`, `useResource`/`ResourceView`.
- Data: `Chapter` = {id, order, title, description, text, media{narration{url,duration}, ambient, music, images[], video{url,duration}}, estimatedDuration (min), contextCards[{id,type,title,content}], branchChoices}. `StoryWorld` = {title, description, creator (name string), coverImage, releaseDate, languagesAvailable (en/fr/es), culturalThemes[], totalDuration, chapterCount, chapters, visibility, featured/new/trending, institutionalPartner}. Only ~9 chapters in storyDatabase.ts and ~22 in generateMissingChapters.ts reference narration URLs (those urls like /media/narration/*.mp3 may not exist as files). `captionsEnabled` exists only as a boolean accessibility preference (StoryStateContext, ProfileScreen) and is not consumed by any player.

## What is missing
- Transcript cues (timestamps, speakers) and caption cues: none. Only unsegmented `chapter.text`. No caption language list, no speaker data.
- Search: recents store, type grouping (creators/collections/institutions entities), facets (format, length, Mi'kmaw/Michif languages), did-you-mean, typeahead rendering.
- Player: playback speed, sleep timer, 15 s skip UI in compact player (skip(±s) exists in API), buffering percent/low-bandwidth source, retry action, offline download, cover waveform, story-completion screen, user-level "Nth story" count, support/funding hook from completion.
- Context card: verifier/sources fields; Story World: follower counts, creator story counts, locked-until-previous-chapter logic.
- Landscape video player: `media.video` exists in the type but no video player component.

## Recommended minimal, truthful implementation (reuse first)
1. **Search Landing/Zero/Keyboard**: in `SearchScreen`, add (a) recents from localStorage (try/catch, max 5, "Clear recent searches" only when non-empty, no analytics), (b) render the already-computed `suggestions` as ListItem-style rows (44 px) under the field, (c) zero-results via `StateTemplate kind="empty"` with title `No results for “{q}”`, message "Try fewer or different words.", and a "Search “{suggestion}”" `Button` only when a Fuse near-match exists; "Browse all stories" only if wired to Explore. Remove the "Start typing" dead copy for recents.
2. **Results**: `SegmentedTabs`/`Chip` row limited to types the data supports now: Top (all) and Stories; add Creators only when derived from `creator` strings (group by name, count stories); skip Collections/Institutions unless real data (institutionalPartner exists on a few stories only). Keep `StoryCard` as the single tap target; result count "N results" from the real array. Do not use "Documentary · 2024" strings; use `typeLabel`/`badge` slots with real language/duration/year from `releaseDate`.
3. **Filters Sheet**: use `Sheet` + `Chip`s, only real facets: Language (EN/FR/ES via `languagesAvailable`), Length (derive from `chapters` sum of `estimatedDuration`; buckets under 15, 15-45, 45+), optional theme from `culturalThemes`. Footer `Button` "Show {n} results" with live count; "Reset" ghost button. Hide "Filters · Sort" until wired. Omit Format and Mi'kmaw/Michif.
4. **Audio player states**: keep `ExpandedPlayer`/PlaybackProvider. Map Figma states onto existing statuses: loading -> spinner + "Loading…" (no fake percent); unavailable -> `StateTemplate kind="error"` "Playback stopped" with a real "Try again" (calls `playback.load` again) and no "Download chapter" button (not implemented). Show `Banner tone="warning"` for offline (`navigator.onLine`). Add 15 s back/forward `IconButton`s using `skip(±15)` (exists); speed cycle only if audio element `playbackRate` is wired (recording source only); skip Sleep timer unless built. Keep honest "Device voice" label.
5. **Captions/Transcript**: no timed data exists, so do NOT ship fake cues. Truthful option: a "Transcript" toggle in the reader that shows the existing `chapter.text` (already visible) as paragraphs without timestamps, with the current device-voice progress optionally highlighting by character fraction (progress known for voice source). Captions (CC) only for the device-voice source, derived from `track.text` sentences; hide CC for recordings until cues are authored. Keep `captionsEnabled` as the default for this toggle. Extend `Chapter` later with `transcript?: {start:number; speaker?:string; text:MultilingualText}[]` when real content exists.
6. **Story completion**: new small screen/sheet when `status === "ended"` on the last chapter: "You finished" + real title, real counts (`chapters.length`, sum of `estimatedDuration`), no "14th story" unless computed from progress, no invented quote (use a pull-quote only if a context/quote field is added). Buttons: "See related stories" (only if a related list exists, e.g. shared `culturalThemes`), "Back to library" (route exists), "Support this work" only when the creator has a funding listing / monetization hook.
7. **Context card**: convert `ContextCardModal` to `Sheet` (grabber, 24 px top radius) with type label as Metadata eyebrow, title (Fraunces), content, and image slot if `imageUrl`. Add `verifiedBy?: string; sources?: string[]` fields to `ContextCard` and render "Verified with X"/"Source:" only when present AND backed by a signed agreement. Do not render "VIEW THE COLLECTION" without a link target.
8. **Story World**: `FeaturedStoryPreview` already covers hero/actions; add the Chapters list section (reuse `ChapterRow`) and Related stories rail using real data; keep Follow/followers out unless the creator service provides them; "Unlocks after chapter 2" lock only if gating logic exists.
9. **Chapter Index**: add "{n}% complete" and per-row "{m} min left" from progress; "Download all" omitted until offline downloads exist. Current row accent border: `--seen-brand-accent`.
10. **Video landscape**: defer until a story with `media.video` exists; implement with native `<video controls>` first (a11y, fullscreen free), then custom chrome.
Cross-cutting: use `useResource` + `ResourceView` for search/index data; secondary text `text-white/55`/`text-seen-muted`; touch targets >= 44 px (Figma chips are 36 px high, enlarge hit area); icons from lucide (not glyph placeholders); EN/FR/ES copy for every new string; analytics only allow-listed events with ids/enums.
