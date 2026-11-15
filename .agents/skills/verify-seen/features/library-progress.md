# Library, Progress & Creator Follow

Covers `/#/library` (`LibraryScreen.tsx`), including `Stories in progress`, `Journeys complete`, `Following` (followed creators), and `Saved collections`.

## Sub-features

- **Stories in progress** — Displays stories the user has started or saved (`seen_saved_stories_v1` / `seen_story_progress_v1`) with chapter resume links.
- **Journeys complete** — Lists stories where the user finished all chapters (after clicking `Finish` -> `Keep reading` in the chapter reader).
- **Following (`/#/creator/<id>` -> `Following` tab)** — Clicking `Follow` on a creator profile (e.g., `/#/creator/kira-chen`) adds that creator to the `Following` tab in `/#/library` with an `Unfollow <Name>` action.
- **Saved collections** — Displays saved editorial collections (`seen_saved_collections_v1`) and a `Browse collections` button (`/#/explore/collections`).

## How to get to it (user POV)

1. Click `Library` in the bottom navigation bar (`/#/library`).
2. Switch between the tabs (`Stories in progress`, `Journeys complete`, `Following`, `Saved collections`).
3. To follow a creator, open `/#/creator/kira-chen`, click `Follow` (changes to `Following`), then return to `/#/library` and click the `Following` tab.

## Driving it with control-seen

```bash
HARNESS=".agents/skills/verify-seen/bin/control-seen"

# 1. Seed a reader session and follow Kira Chen
$HARNESS seed-user --run-id "$RUN_ID" --role reader
URL=$($HARNESS url --run-id "$RUN_ID")
$HARNESS browse --run-id "$RUN_ID" goto "$URL/#/creator/kira-chen"
$HARNESS browse --run-id "$RUN_ID" wait 500
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Follow')"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" creator-followed

# 2. Verify Following tab in Library
$HARNESS browse --run-id "$RUN_ID" goto "$URL/#/library"
$HARNESS browse --run-id "$RUN_ID" wait 500
$HARNESS browse --run-id "$RUN_ID" click "[role='tab']:has-text('Following')"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" library-following
$HARNESS snapshot --run-id "$RUN_ID" library-following

# 3. Verify Saved collections empty state -> Browse collections
$HARNESS browse --run-id "$RUN_ID" click "[role='tab']:has-text('Saved collections')"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" library-saved-collections
```

## Gotchas

- **Empty states by default on a fresh user:** A freshly seeded user has no in-progress stories, completed journeys, followed creators, or saved collections until you either interact with a story/creator/collection or seed `seen_saved_stories_v1` / `seen_story_progress_v1`.
- **Unfollow button label:** Inside the `Following` tab on `/#/library`, the unfollow button has an accessible name `Unfollow Kira Chen` (`button[aria-label="Unfollow Kira Chen"]` or `button:has-text('Unfollow')`).
