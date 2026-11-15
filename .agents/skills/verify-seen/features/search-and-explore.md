# Search & Explore Feed

Lets users browse cultural storyworlds, creators, and collections across the personalized `For You` feed (`/#/for-you`) and the `Explore` discovery catalog (`/#/explore`), filter by topic/format chips, search inline on `Explore`, or open the full-screen `SearchScreen` (`/#/search`). Reads the curated catalogue (`STORY_WORLDS` in `storyDatabase.ts`) alongside creator-published stories (`localStorage.seenos_user_stories`).

## Sub-features

- Five-tab bottom navigation bar (`For You`, `Explore`, `Create`, `Library`, `Profile`) with hash URL synchronization (`/#/for-you`, `/#/explore`, `/#/create`, `/#/library`, `/#/profile`).
- `Explore` segmented tabs (`Stories`, `Creators`, `Collections`), format/topic filter chips, and inline search bar (`placeholder="Search stories, creators, topics..."`).
- Full-screen `SearchScreen` (`h2` `"Search Stories"`, `placeholder="Search by title, author, or theme..."`, `300ms` debounce, result count badge, and `button[aria-label="Close search"]`) reachable from the top-bar `Search` button on every primary tab.
- Clicking any search result or feed card to open `FeaturedStoryPreview`.

## How to get to it (user POV)

1. From an onboarded or guest session on `For You`, tap `Explore` in the bottom navigation bar to browse stories, creators, or collections, tap filter chips, or type into `"Search stories, creators, topics..."`.
2. To open the dedicated full-screen `SearchScreen`, tap the top-bar `Search` icon (`aria-label="Search"`) from any main tab (`For You`, `Explore`, `Library`, or `Profile`).
3. Type a title, creator, or cultural theme (e.g., `Midnight` or `Diaspora`), wait briefly for results to populate, and tap a story card to open its preview or tap `Close search` (`X`) / press `Escape` to return.

## Driving it with control-seen

```bash
CS=".agents/skills/verify-seen/bin/control-seen"
PROOF="/tmp/seen-proof-$RUN_ID"

# Precondition setup: start from an onboarded viewer session on For You
"$CS" seed-session --run-id "$RUN_ID" --role viewer --lang en --intent explore
"$CS" browse --run-id "$RUN_ID" wait 1000
"$CS" browse --run-id "$RUN_ID" screenshot "$PROOF/explore-01-for-you.png"

# 1. Navigate to Explore via bottom tab and test inline search (>2 chars required)
"$CS" browse --run-id "$RUN_ID" click "nav button:has-text('Explore')"
"$CS" browse --run-id "$RUN_ID" wait 800
"$CS" browse --run-id "$RUN_ID" fill 'input[placeholder="Search stories, creators, topics..."]' "Midnight"
"$CS" browse --run-id "$RUN_ID" wait 500
"$CS" browse --run-id "$RUN_ID" screenshot "$PROOF/explore-02-inline-search.png"
"$CS" browse --run-id "$RUN_ID" snapshot -i > "$PROOF/explore-02-inline-search.txt"

# 2. Open full-screen SearchScreen via the top NavigationBar Search button
"$CS" browse --run-id "$RUN_ID" click 'button[aria-label="Search"]'
"$CS" browse --run-id "$RUN_ID" wait 500

# 3. Query in SearchScreen (wait >=400ms for 300ms debounce) and open matching story preview
"$CS" browse --run-id "$RUN_ID" fill 'input[placeholder="Search by title, author, or theme..."]' "Resonance"
"$CS" browse --run-id "$RUN_ID" wait 500
"$CS" browse --run-id "$RUN_ID" screenshot "$PROOF/explore-03-modal-results.png"
"$CS" browse --run-id "$RUN_ID" snapshot -i > "$PROOF/explore-03-modal-results.txt"
"$CS" browse --run-id "$RUN_ID" click "button:has-text('Midnight Resonance')"
"$CS" browse --run-id "$RUN_ID" wait 800
"$CS" browse --run-id "$RUN_ID" screenshot "$PROOF/explore-04-story-preview.png"
```

## Gotchas

- **Inline `Explore` search threshold:** `ExploreScreen` filters inline results when `searchQuery.length > 2` (3+ characters). Short queries (`1`–`2` characters) leave the unfiltered catalogue visible.
- **`SearchScreen` `300ms` debounce:** Wait at least `400ms`–`500ms` after `fill` before snapshotting results in `SearchScreen`.
- **Single-tap card rule:** Story cards are single `<button>` tap targets (`CLAUDE.md` rule); click the card button directly by its visible title text.
