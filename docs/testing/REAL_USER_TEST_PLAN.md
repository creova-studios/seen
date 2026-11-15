# Real-user test plan — round 1 (moderated, 5–8 participants)

**Goal:** validate the persona hypotheses and find the biggest usability failures in the core journeys before investing in the live backend.

**Participants:** 3 explorers (bilingual EN/FR or EN/ES welcome), 3 storytellers/creators, 1–2 institutional or community-organisation staff. Screen for assistive-technology users (at least one).

**Setup:** one browser profile per participant on the RC URL (data is per-browser); fresh profile each session; start at `/`. Moderator uses the script below, does not guide clicks, and records completion / time / errors / hesitations / backtracking / quotes.

## Tasks (scenario-based — never name the button)

| # | Scenario prompt | Success = | Journey |
|---|---|---|---|
| T1 | "You've just heard about SEEN from a friend. Get yourself set up." | Reaches For You | J1 |
| T2 | "Find a story about something you care about and start it." | Opens a chapter | J2 |
| T3 | "You loved it. Make sure you hear about more from the same person." | Follows creator | J3 |
| T4 | "Close the app. Come back and continue where you left off." | Resumes from Library | J2 |
| T5 | (creators) "You're looking for money to make your next project. What's available to you, and are you eligible?" | Opens an opportunity and states eligibility correctly | J5 |
| T6 | (creators) "Keep track of that application until it's submitted." | Saves; ticks steps; marks applied | J5 |
| T7 | "Find stories about migration that someone has gathered together." | Opens a collection | J4 |
| T8 | "Something new happened on your account. Find out what." | Opens notifications, opens one | J6 |
| T9 | Moderator switches the device to airplane mode during T7: "Carry on." | Understands offline message; recovers | J7 |
| T10 | "Change the language you read in." | Changes language in Settings | — |

## Measures

Task completion rate, time on task, error count, SEQ (1–7) after each task, SUS at the end, and 3 open questions: *What did you expect that didn't happen? What would you remove? Who would you share SEEN with?*

## Analysis

Log each issue with severity (blocker / major / minor), frequency, and the screen; triage into `KNOWN_DEFERRED_ITEMS.md` or a fix ticket within 48 hours.
