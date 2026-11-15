# User journeys

Each journey lists the steps, the peak/end moment we deliberately polish, and the automated check that proves it works.

## J1 — First visit to activation (Explorer)
Splash → language → purpose → role → intent → create account → accessibility → presence → **Enter** → For You.
- Goal-gradient: one decision per screen; progress resumes if the tab is closed.
- End moment: "Welcome. Your space is forming." on first For You.
- Proof: `e2e/core-journeys.spec.ts › onboarding → account → For You`.

## J2 — Discover → read → return
For You or Explore › Stories → story preview → chapter → leave → Library › In progress → resume.
- Proof: search→story E2E; reader journey manual (see TEST_STRATEGY gaps).

## J3 — Find a creator and follow
Explore › Creators → creator profile → Follow (instant, optimistic) → Profile › Your SEEN shows Following 1.
- Proof: `explore creators → follow → shows in Profile`.

## J4 — Collections
Explore › Collections (filter thematic/institutional) → collection → Save → stories list.
- Proof: `collections → detail → save`.

## J5 — Funding (Creator)
Notification "Funding closing soon" *or* Profile › Funding tracker → Open list (filter by type) → opportunity → eligibility → **Save & track** → tick checklist (instant) → **Mark as applied** (enabled only when complete) → My tracker shows Applied.
- Peak/end: progress bar fills; "Marked as applied" confirmation.
- Proof: `funding → save → checklist → applied`, component test, closed-call test.

## J6 — Notifications
Bell badge (unread count) → list → open item (marks read, deep-links to target) → Mark all read → badge clears.
- Proof: `notifications: badge, open, mark all read`.

## J7 — Recover from a network interruption
Any data screen → offline → offline template with Try again → reconnect → content; if data was already loaded, stale content stays with a warning banner.
- Proof: `offline and error states are recoverable`, component tests.

## J8 — Role-protected tools
Viewer opens `#/admin-dashboard` → Restricted state. Admin demo account opens it normally. Choosing Moderator at sign-up yields a viewer + pending request.
- Proof: guard E2Es, auth unit tests.
