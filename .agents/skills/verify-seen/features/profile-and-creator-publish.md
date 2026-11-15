# Profile, Creator Publish & Funding

Covers `/#/profile` (`ProfileScreen.tsx`), `/#/creator-stories` (`CreatorStoriesScreen.tsx`), `/#/creator-publish` (`CreatorPublishFlowScreen.tsx`), `/#/funding` (`FundingOpportunitiesScreen.tsx`), `/#/funding-readiness`, and the Sign Out modal flow.

## Sub-features

- **Profile (`/#/profile`)** — Shows user name, role badge, stats (`Published` for creators, reading stats for readers), links to `Your stories` (`/#/creator-stories`), `Edit Profile` (`/#/edit-profile`), `Settings` (`/#/settings`), and `Sign Out` (opens `role="dialog"` `Sign out?`).
- **Your Stories (`/#/creator-stories`)** — Creator dashboard with `Drafts` and `Published` tabs (`role="tab"`), plus a `New story` button (`/#/creator-publish`).
- **Creator Publish Wizard (`/#/creator-publish`)** — 5-step story creation flow (`Step 1` title/summary/format/audience chips like `Educators` -> `Step 2` chapters -> `Step 3` tags -> `Step 4` visibility & consent -> `Step 5` review & `Publish story` or `Save draft`).
- **Funding Directory & Tracker (`/#/funding` & `/#/funding-readiness`)** — Lists 12 real Canadian arts/culture/media funding programs (`[data-testid="opportunity-card"]`, e.g., `Research and Creation`), interactive eligibility self-check (`button` ending `: yes`), `Save & track`, `Mark as applied`, `My tracker` tab, and `Prepare your application` (`/#/funding-readiness`).

## How to get to it (user POV)

1. Click `Profile` in the bottom navigation bar (`/#/profile`).
2. Click `Your stories` to open `/#/creator-stories`, then click `New story` to launch `/#/creator-publish`.
3. For funding, navigate to `/#/funding` (or click the funding entry point from Creator tools / Explore) to browse programs, check eligibility, and track applications.
4. To sign out, scroll to the bottom of `/#/profile`, click `Sign Out`, and confirm `Sign out` inside the dialog.

## Driving it with control-seen

```bash
HARNESS=".agents/skills/verify-seen/bin/control-seen"

# 1. Seed a creator session and inspect Profile + Your stories
$HARNESS seed-user --run-id "$RUN_ID" --role creator --name "Test Creator"
URL=$($HARNESS url --run-id "$RUN_ID")
$HARNESS browse --run-id "$RUN_ID" goto "$URL/#/profile"
$HARNESS browse --run-id "$RUN_ID" wait 500
$HARNESS screenshot --run-id "$RUN_ID" creator-profile

$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Your stories')"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS screenshot --run-id "$RUN_ID" creator-stories

# 2. Open Creator Publish wizard and select an audience chip
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('New story')"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Educators')"
$HARNESS screenshot --run-id "$RUN_ID" creator-publish-step1

# 3. Verify Funding directory & tracker
$HARNESS browse --run-id "$RUN_ID" goto "$URL/#/funding"
$HARNESS browse --run-id "$RUN_ID" wait 500
$HARNESS screenshot --run-id "$RUN_ID" funding-directory
$HARNESS snapshot --run-id "$RUN_ID" funding-directory

# 4. Sign out confirmation dialog
$HARNESS browse --run-id "$RUN_ID" goto "$URL/#/profile"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Sign Out')"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" sign-out-dialog
$HARNESS browse --run-id "$RUN_ID" click "[role='dialog'] button:has-text('Sign out')"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS screenshot --run-id "$RUN_ID" signed-out-invocation
```

## Gotchas

- **Creator vs Reader profile actions:** `Published` count and creator-First stats appear on `/#/profile` when the user's `role` is `"creator"` (either via choosing `Share my story` / `Find readers and listeners` during onboarding, or via `control-seen seed-user --role creator`).
- **Sign Out requires two clicks:** Clicking `Sign Out` on `/#/profile` opens a confirmation `role="dialog"` (`Sign out?`); you must click `[role='dialog'] button:has-text('Sign out')` to complete sign-out and return to the `S . E . E . N` invocation screen.
