# Onboarding decision matrix

Previous flow: Language, Invocation, Purpose, Role, Intent, Account, Accessibility, Presence, Threshold = **9 screens**, no back control, no progress.
Current flow: Language, **Invocation (entry button, protected)**, **Manifesto "This is not social media" (protected)**, then "What brings you to SEEN?", "What are you interested in?" (optional), Account, with Back and "Step n of 3" on those last three, then straight into For You.

| Screen | Decision | Reason | Where its data went |
|---|---|---|---|
| Language | KEEP | Drives every string | `state.language` (unchanged) |
| Invocation (glowing S.E.E.N entry button) | KEEP (protected) | The owner's first screen and one brand moment. It was merged away by mistake in the first cut and restored | none |
| Purpose (manifesto, "This is not social media") | KEEP (protected) | States what SEEN is before any question is asked. Restored on the owner's instruction | none |
| What brings you to SEEN? | ADD | Replaces the old Role and Intent screens (see below) | `role` and `intent` via `roleAndIntentFor` |
| Role | MERGE into "What brings you here?" | Creator is implied by "Share my story" or "Build an audience"; viewer otherwise | `role` derived by `roleAndIntentFor`; account role stays authoritative |
| Intent | MERGE into "What brings you here?" | Same question | `intent` derived (create / contribute / explore) |
| What are you interested in? | ADD (optional, skippable) | Real topics from the catalogue; replaces typing | `state.interests`, used for the "Based on your interests" rail on For You |
| Account | KEEP | Needed to save progress | unchanged |
| Accessibility (3 toggles) | REMOVE from onboarding | The three toggles (immersive narratives, rich audio, dynamic motion) were stored but nothing read them. Real accessibility settings (High contrast, Reduce motion, Larger text) are in Settings | Settings |
| Presence | REMOVE | Interstitial, no data | none |
| Threshold | REMOVE | Interstitial; the final action is now "Create account" then For You | none |

## Decisions to review
- **Moderator**: the old Role screen offered "Moderator", which only logged a role-elevation request. That option is gone from first run. Moderators are appointed by an admin; no in-app request screen exists yet (`requestRoleElevation` is still in the auth layer and unit-tested). Product decision: add a "Request moderator access" item to Settings if wanted.
- **Experience preference (Read / Listen / Watch)** was not added: nothing in the app would consume it yet.
- **Creator questions** are not asked at sign-up; Create Story asks for what it needs when the user starts a story.
- Resuming a half-finished onboarding after a reload is only possible before the Account step, because choices live in memory.

## Protected first screen

The Invocation screen (glowing S.E.E.N entry button, "You are entering SEEN.") is the first thing a new visitor sees after choosing a language. It was merged away in the nine-to-four cut and restored on the owner's instruction. It is not counted in "Step n of 3" and must not be removed. Guarded by the e2e test "the first screen is the glowing S.E.E.N entry button".

## Protected manifesto screen

The screen after the entry button ("This is not social media": image, three short lines, Continue) is also protected. It was removed in the same cut and restored on the owner's instruction with a new background image (open books, from the catalogue). Flow: language, entry button, manifesto, then Step 1 of 3. Guarded by the e2e test "the first screen is the glowing S.E.E.N entry button", which also checks the manifesto heading.
