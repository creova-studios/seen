# Story Preview, Chapter Reader & i18n

Covers the story preview screen (`/#/story/<id>`), private story notes, multi-chapter reading (`StoryChapterScreen`) with transcript dialog and captions toggle, completion modal (`You finished...`), and runtime EN/FR/ES language switching.

## Sub-features

- **Story Preview (`StoryPreviewScreen.tsx`)** — Displays story title, creator link (`/#/creator/<id>`), tags, chapter list, primary CTA (`Start reading` / `Continue reading`), `Save to Library`, and `Write a private note` (`textarea` + `Save note`).
- **Chapter Reader (`StoryChapterScreen.tsx`)** — Chapter reader with `Transcript` button (opens `role="dialog"` `Transcript` with `Close`), `Captions` toggle (`aria-pressed="false"|"true"`), and chapter navigation buttons (`Prev`, `Next`, and `Finish` on the final chapter).
- **Completion Dialog** — Clicking `Finish` on the final chapter opens a `role="dialog"` (`You finished...`) with `Add a reflection` and `Keep reading` (returns to `/#/library` with the story recorded in `Journeys complete`).
- **Language Switcher & Settings i18n (`src/i18n/index.ts`, `SettingsScreen.tsx`)** — Switches UI locale at runtime between `en` (`English`), `fr` (`Français`), and `es` (`Español`) via `/#/settings` radio buttons or `LanguageSwitcher`, persisting to `seen_locale`.

## How to get to it (user POV)

1. From `For You` (`/#/for-you`) or `Explore` (`/#/explore`), click a story card (e.g., `Letters Across the Border` at `/#/story/midnight-resonance`), or navigate directly to `/#/story/midnight-resonance`.
2. On the story preview screen, click `Start reading` (`Commencer la lecture` in FR / `Empezar a leer` in ES) to enter Chapter 1.
3. Inside the chapter reader, click `Transcript` to inspect the full text dialog (`Close` to dismiss), toggle `Captions`, and click `Next` through chapters until the final chapter shows `Finish`.
4. Click `Finish` to open the `You finished...` dialog, then click `Keep reading` to return to `Library`.
5. To switch language, open `/#/settings` and check `Français` or `Español` (or use `button[aria-label="Change language"]`).

## Driving it with control-seen

```bash
HARNESS=".agents/skills/verify-seen/bin/control-seen"

# 1. Seed a reader session and open Letters Across the Border
$HARNESS seed-user --run-id "$RUN_ID" --role reader
URL=$($HARNESS url --run-id "$RUN_ID")
$HARNESS browse --run-id "$RUN_ID" goto "$URL/#/story/midnight-resonance"
$HARNESS browse --run-id "$RUN_ID" wait 600
$HARNESS screenshot --run-id "$RUN_ID" story-preview

# 2. Start reading Chapter 1
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Start reading')"
$HARNESS browse --run-id "$RUN_ID" wait 500
$HARNESS screenshot --run-id "$RUN_ID" chapter-1-reader

# 3. Open Transcript dialog and toggle Captions
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Transcript')"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" chapter-transcript-dialog
$HARNESS browse --run-id "$RUN_ID" click "[role='dialog'] button:has-text('Close')"
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Captions')"

# 4. Advance chapters to Finish
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Next')"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Next')"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Finish')"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS screenshot --run-id "$RUN_ID" story-finished-dialog
$HARNESS browse --run-id "$RUN_ID" click "[role='dialog'] button:has-text('Keep reading')"
$HARNESS browse --run-id "$RUN_ID" wait 400

# 5. Switch language to Français via Settings
$HARNESS browse --run-id "$RUN_ID" goto "$URL/#/settings"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS browse --run-id "$RUN_ID" click "label:has-text('Français')"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS screenshot --run-id "$RUN_ID" settings-french
$HARNESS snapshot --run-id "$RUN_ID" settings-french
```

## Gotchas

- **CTA text changes after starting a story:** Once a story has progress in `seen_story_progress_v1`, the primary button on `/#/story/<id>` changes from `Start reading` to `Continue reading` (or `Read again` when completed).
- **`Finish` only appears on the last chapter:** `midnight-resonance` (`Letters Across the Border`) has 3 chapters (`Next` on Ch 1 -> Ch 2 -> `Finish` on Ch 3). Other stories may have different chapter counts.
- **Locale-dependent selectors:** After switching to `Français` or `Español`, button text and tab labels change (`For You` -> `Pour vous` / `Para ti`). Reset `seen_locale` to `"en"` or select `English` in `/#/settings` before running English text selectors.
