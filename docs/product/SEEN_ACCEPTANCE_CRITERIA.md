# SEEN — acceptance criteria

**SEEN — a Creova product.** Observable criteria for MVP backlog items. "Verified by" names the test that proves it.

| Backlog | Criteria | Verified by |
|---|---|---|
| P0-01 Real auth | Sign-up creates a Supabase user; sign-in works on a second browser; password reset email arrives; sessions expire and refresh; local account store removed | E2E against a preview Supabase project; unit tests for adapter |
| P0-02 Server roles | A viewer cannot read or write creator-only, moderator or admin data through the API even with a modified client; role change only via admin | RLS tests (two users, two roles) |
| P0-03 Report content | Every story and creator profile has "Report" in its ⋯ menu; reason is required (chips); confirmation states what happens next; report is stored server-side; reporter is not shown to the creator | Component + E2E |
| P0-04 Terms & privacy | Reachable from sign-up and Settings; text reviewed; states "SEEN — a Creova product" and the data inventory | E2E link check; legal sign-off recorded |
| P1-01 Introduction | First viewport at 360×640 answers what/who/why with ≤ 2 sentences; primary CTA "Start exploring", secondary "I make stories"; "Our story" link to About | E2E + axe |
| P1-02 Guest mode | Guest can open For You, Explore, a Story World and Chapter 1; Save/Follow/Respond opens a sign-up sheet that returns to the same story after sign-up | E2E |
| P1-03 Short onboarding | ≤ 4 screens from first open to For You; role/intent/personalisation/a11y available later in Settings and via one contextual prompt each; `onboarding_completed` tracked with step count | E2E counts screens |
| P1-04 For You | Continue rail first when progress exists; every rail has a reason label; ≤ 2 same-type rails consecutively; empty rails hidden; mute topic in Settings removes matching stories | Unit (feed composer) + E2E |
| P1-05 Story card family | One `StoryCard` with portrait/landscape/compact; always shows creator name; shows "N min listen" or "N min read" only when data exists; save toggle is a separate ≥ 44 px target; border ≥ 3:1; whole card is one tap target; old card components removed after parity | Component tests + visual check + axe |
| P1-06 Player | Speed 0.75/1/1.25/1.5× persists; transcript toggle shows the text with the current paragraph highlighted; buffering and failed states shown with "Your place is saved at mm:ss" | Component + E2E |
| P1-07 Story completion | Finishing the last chapter shows completion with creator link, save, share and up to 3 related stories; no autoplay | E2E |
| P1-08 Search scopes | Results grouped Stories/Creators/Collections; recents per device, clearable; zero-results shows suggestions + Browse all | Component + E2E |
| P1-09 Library lenses | Tabs Continue · Saved · Following · Collections, each with its own empty state and CTA | E2E |
| P1-10 Password UX | Rules shown before typing, ticked live; `autocomplete` attributes correct; paste allowed; Change Password in Settings | Unit + E2E |
| P1-11 Creator profile | Edit Profile saves name, bio, category, optional location, links, "Open to", "Support link"; public profile renders them; Profile Builder prompt until bio + 1 link set | Component + E2E |
| P1-12 Creator intro | Choosing Creator (or "I make stories") shows a 1-screen intro on review, context and rights before the dashboard | E2E |
| P1-13 Guided publish | Stepper with 5 named steps; each step has a purpose line and example; audience + tags are chips from a controlled vocabulary with autocomplete; Next disabled with a stated reason until valid; validation errors jump to the step | Component + E2E |
| P1-14 Accessibility | axe clean on all routes; borders 3:1; text scale 0.85–1.5 in Settings; manual VoiceOver + TalkBack pass recorded | axe E2E + manual log |
