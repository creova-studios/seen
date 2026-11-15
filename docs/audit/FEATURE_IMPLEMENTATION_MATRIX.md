# Feature implementation matrix (2026-10-06, production `9e3ceed` plus this branch)

Columns: Functional = works end to end in the demo data layer; Mobile = designed and tested for 320 to 430 px; Accessible = passes the automated and browser-driven checks in `SEEN_ACCESSIBILITY_STATUS.md` (not a screen-reader test).
Status: IMPLEMENTED, PARTIAL, MISSING, DESIGNED ONLY, BACKEND BLOCKED, OBSOLETE. Action: KEEP, FIX, COMPLETE, MERGE, DEFER, REMOVE, PRODUCT DECISION.

| Feature | Figma | Production | Functional | Mobile | Accessible | Status | Action |
|---|---|---|---|---|---|---|---|
| Language selection | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Onboarding (4 screens, tap-only, Back, step count) | 9 screens | 4 screens | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Guest mode | Yes | No (account required) | n/a | n/a | n/a | DESIGNED ONLY | PRODUCT DECISION |
| Email OTP | Yes | No | n/a | n/a | n/a | BACKEND BLOCKED | DEFER |
| Sign up, sign in, recovery, reset | Yes | Yes (demo auth; recovery text honest) | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| For You | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | FIX (copy; fewer sections) |
| Interests rail on For You | No | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Re-rank For You by follows | Yes | No | n/a | n/a | n/a | MISSING | DEFER |
| Explore (stories, creators, collections) | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Filters | Chips on Explore | Filters sheet in Search | Yes | Yes | Yes | PARTIAL | KEEP |
| Search, zero results | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Offline search | Yes | No | n/a | n/a | n/a | DESIGNED ONLY | DEFER |
| Scroll restoration on back | Yes | No | n/a | n/a | n/a | MISSING | COMPLETE (small) |
| Story World (preview) | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Player: play, seek, skip, speed, transcript, captions (device voice) | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Video captions, audio-description track | Yes | No video player | n/a | n/a | n/a | DESIGNED ONLY | DEFER |
| Save, Saved, Continue | Yes | Yes (device-local) | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Library sync, downloads, shared collections | Yes | No | n/a | n/a | n/a | BACKEND BLOCKED | DEFER |
| Library Following, Collections | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Creator profile, follow | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Create Story wizard (5 steps), drafts, autosave | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Image description and content notes | Yes (Context and A11y) | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Media upload (files) | Yes | URL paste via a browser prompt | Partial | Partial | Partial | BACKEND BLOCKED | COMPLETE when storage exists |
| Validate, Submit, Processing, In Review, Changes requested | Yes | Publishes immediately | n/a | n/a | n/a | BACKEND BLOCKED | PRODUCT DECISION |
| Funding list, detail, eligibility, tracker | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| In-app funding application, upload, budget, funder statuses | Yes | Checklist, notes, "tracked by you" | n/a | n/a | n/a | OBSOLETE | KEEP the current model |
| Monetization, earnings, payouts | Yes | Demo screens | Demo only | Yes | Partial | BACKEND BLOCKED | DEFER |
| Report content, confirmation | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Moderation queue and review | Yes | Role-guarded demo screens | Demo only | Yes | Partial | PARTIAL | DEFER |
| Appeals, enforcement ladder, suspension | Yes | Text only | n/a | n/a | n/a | BACKEND BLOCKED | DEFER |
| Moderator access request | Role choice | None (removed from first run) | n/a | n/a | n/a | MISSING | PRODUCT DECISION |
| Institution workspace | Yes | Read-only institutional collections | Partial | Yes | Yes | DESIGNED ONLY | PRODUCT DECISION (D-12) |
| Settings (language, high contrast, reduce motion, Larger text) | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Account and privacy (export, delete) | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Edit profile, change password, legal | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Notifications | Yes | Yes | Yes | Yes | Yes | IMPLEMENTED | KEEP |
| Notification settings | Yes | No | n/a | n/a | n/a | DESIGNED ONLY | DEFER (needs push) |
| News, Media sections | Not present | Not present | n/a | n/a | n/a | OBSOLETE | REMOVE from the question; see `NEWS_VS_MEDIA_AND_PROFILE_SEPARATION.md` |
| Concept screens (quiz, mood mixer, map, wrapped, etc.) | Concept | No | n/a | n/a | n/a | DESIGNED ONLY | DEFER |
| French and Spanish coverage | Yes | Shell and new screens; many older components English only | Partial | Yes | Partial | PARTIAL | COMPLETE (string move, P1-2) |
