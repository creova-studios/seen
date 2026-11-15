---
name: verify-seen
description: End-to-end browser verification skill for SEEN by CREOVA (seen-v1) across the web/mobile app, the Vercel testing export, and the seen.verse.one public website. Use whenever verifying user flows, reproducing UI regressions, or capturing visual and state proof.
---

# Verify SEEN (`seen-v1`)

End-to-end browser verification harness for **SEEN by CREOVA** across all three repository surfaces:
1. **`--surface app` (default):** The mobile-first React 18 + TypeScript + Vite 6 application (`src/app/`, `428x926` viewport, hash routes `#/for-you`, `#/explore`, `#/create`, `#/library`, `#/profile`, `#/funding`, etc.).
2. **`--surface website`:** The customer-facing static website for **`https://seen.verse.one`** (`site/`, `EN` / `FR` / `ES` pages, `/terms/`, `/privacy/`, and the `"Make a SEEN"` interactive seed toy).
3. **`--surface vercel-export`:** The installable Expo web export (`mobile/` + `scripts/pwa-postbuild.mjs`) built identically to the **Vercel testing channel** (`https://seen-sigma-eight.vercel.app`).

Every verification run uses `.agents/skills/verify-seen/bin/control-seen` with a unique `--run-id <id>` so concurrent agents have an isolated TCP port, detached server PID (`setsid`), isolated Playwright Chromium daemon (`BROWSE_STATE_FILE`), independent `localStorage` origin, and dedicated proof directory (`/tmp/seen-proof-<id>`).

## Launch

Start an isolated verification instance from `/Users/justinmafie/seen-v1`:

```bash
RUN_ID="verify-$(date +%s)"

# Primary surface: SEEN web app (Vite dev server, 428x926 mobile frame)
.agents/skills/verify-seen/bin/control-seen start --run-id "$RUN_ID" --surface app

# Or launch the seen.verse.one public website (site/ static build, 1280x840 viewport):
# .agents/skills/verify-seen/bin/control-seen start --run-id "$RUN_ID" --surface website

# Or launch the exact Vercel testing build (mobile/ Expo web export + PWA postbuild):
# .agents/skills/verify-seen/bin/control-seen start --run-id "$RUN_ID" --surface vercel-export
```

Ready indicator: `READY run_id=<id> surface=<app|website|vercel-export> url=http://127.0.0.1:<port> pid=<pid> git_sha=<sha> proof_dir=/tmp/seen-proof-<id>`.

## Doctor

Run a strictly **read-only** health check before driving UI flows or whenever state looks unexpected:

```bash
.agents/skills/verify-seen/bin/control-seen doctor --run-id "$RUN_ID"
```

`doctor` verifies:
- `/tmp/seen-verify-$RUN_ID/instance.json` exists and its recorded server PID is alive and owned by SEEN (`vite` or `serve-static.mjs`).
- `http://127.0.0.1:<port>` responds over HTTP.
- `git rev-parse --short HEAD` matches the running instance's `gitSha`.
- The isolated `gstack` Chromium daemon responds to `status` and reports current `location.href`, auth/guest state, and `CONSOLE_ERRORS none`.

## Drive

Drive the active browser session from the user's POV via `.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" <command>`:

```bash
# 1. Inspect interactive ARIA elements (@e1, @e2, ...)
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" snapshot -i

# 2. Navigate hash routes, click buttons, or fill inputs
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" click @e1
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" fill 'input[placeholder="Name"]' "Maya Lin"

# 3. Wait for a CSS selector or settle for N milliseconds (for Motion animations)
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" wait "button:has-text('Continue')"
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" wait 700

# 4. Precondition setup helpers (ONLY for setup before testing a post-onboarding feature):
#    - Clean first-visit state (for testing onboarding-and-auth):
.agents/skills/verify-seen/bin/control-seen reset --run-id "$RUN_ID"
#    - Pre-onboarded session on /#/for-you (for testing feed, reader, library, funding, or creator flows):
.agents/skills/verify-seen/bin/control-seen seed-session --run-id "$RUN_ID" --role creator --lang en --intent create
```

**Driving rule:** Never use `seed-session` or `browse js` to bypass or simulate the feature under test. Always drive the feature under test through real user interactions.

## Evidence

Save all proof artifacts to `/tmp/seen-proof-$RUN_ID/` (outside `/tmp/seen-verify-$RUN_ID/` so `Cleanup` never deletes evidence and git working tree stays clean):

```bash
PROOF_DIR="/tmp/seen-proof-$RUN_ID"

# Visual proof
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" screenshot "$PROOF_DIR/01-screen.png"

# Accessibility / interactive element snapshot
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" snapshot -i > "$PROOF_DIR/01-snapshot.txt"

# Persistence & route proof (reads href, hash, seenos_auth_session, seenos_story_state, seenos_user_stories)
.agents/skills/verify-seen/bin/control-seen state --run-id "$RUN_ID" > "$PROOF_DIR/01-state.json"

# Console error verification
.agents/skills/verify-seen/bin/control-seen browse --run-id "$RUN_ID" console --errors > "$PROOF_DIR/01-console-errors.txt"
```

## Cleanup

Stop the isolated browser daemon and terminate **only** the tracked server PID for `$RUN_ID`:

```bash
.agents/skills/verify-seen/bin/control-seen stop --run-id "$RUN_ID"
```

- Never kill processes by name (`pkill vite` / `killall node` are forbidden).
- `/tmp/seen-verify-$RUN_ID/` is removed while `/tmp/seen-proof-$RUN_ID/` survives teardown.

## Helpers

| Path | Purpose |
| --- | --- |
| `.agents/skills/verify-seen/bin/control-seen` | Single executable harness CLI (`start`, `doctor`, `reset`, `seed-session`, `state`, `browse`, `stop`) supporting `--surface app\|website\|vercel-export`. |
| `.agents/skills/verify-seen/features/README.md` | Feature map index, driving conventions, proof contract, and links to per-feature guides. |
| `.agents/skills/verify-seen/features/onboarding-and-auth.md` | 6-screen onboarding ritual, Guest Mode (`"Explore without an account"`), account creation/sign-in, and reload persistence. |
| `.agents/skills/verify-seen/features/search-and-explore.md` | 5-tab bar, `Explore` tabs (`Stories`, `Creators`, `Collections`), inline search, and full-screen `SearchScreen` (`/#/search`). |
| `.agents/skills/verify-seen/features/story-reader-and-i18n.md` | `FeaturedStoryPreview` (`/#/story/:id`), `StoryChapterScreen` (`Start reading`, `Transcript`, `Captions`, `Next`/`Finish`), and `EN`/`FR`/`ES` switching. |
| `.agents/skills/verify-seen/features/library-progress.md` | `LibraryScreen` (`/#/library`): `Stories in progress`, `Journeys complete`, `Following` creators, and `Saved collections`. |
| `.agents/skills/verify-seen/features/profile-and-creator-publish.md` | `ProfileScreen` (`/#/profile`), `Your stories` (`/#/creator-stories`), `Funding` (`/#/funding`), and 5-step `CreatorPublishFlow` (`/#/creator-publish`). |
| `.agents/skills/verify-seen/features/website-seen-verse-one.md` | Public website (`--surface website` for `https://seen.verse.one`): `EN`/`FR`/`ES` pages, `"Make a SEEN"` seed toy, `/terms/` & `/privacy/`, and Vercel testing link. |
