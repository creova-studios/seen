# Figma frame map (DS2)

File `8WMBpUhanDkUjodZYolyDT`, canvas `280:15` "19 — PROTOTYPES". The deployed UI is final; frames are added on top. Rule: a Figma element is adopted only if it adds without moving existing items; otherwise the founder decides.

| Ledger | Feature | Figma node (id) | Route / surface | Reused components | Status |
|---|---|---|---|---|---|
| E1 | Private note to the creator | STORY / Share Reflection / Modal `399:52` (adapted: private, one-way, 500 chars, "include my name" off by default) | End-of-story prompt + `NoteSheet`; creator inbox `#/notes` | Sheet, Button, Toggle, Banner, StateTemplate, ListItem | Built (demo adapter) |
| E2 | Language chip | ONBOARDING / Language Selection `310:14` | `typeLabel` slot on cards | cards.tsx | Slot defined |
| E3 | Seeking strip | FUNDING / Opportunity Detail `335:70` (data), no dedicated frame | Story preview, below summary | ListItem, Badge | Not built (gated: legal check) |
| E4 | Share preview | STORY / Share Reflection `399:52`, share-sheet `68:250` | `/s/<id>` (server), share sheet | Sheet | Server function built |
| E5 | Deadline reminder | FUNDING / Opportunities Hub `335:2`, 13-11 Funding Application Tracker `107:931` | Notifications list; preference toggle | Toggle, ListItem | Preference built |
| E6 | Offline reading | LIBRARY / Downloads · Offline `330:111`, offline-downloads `10:314` | Library tab; icon in action row | ListItem, StateTemplate | Cache rules built |
| G1 | Sign-in completion | ONBOARDING / Email Verification OTP `314:2`, Forgot `314:28`, Reset `314:44`, Auth Failed `314:66`, Session Expired `314:80`, Offline Auth `314:93`; AUTH / Sign In Keyboard Active `419:2` | Onboarding AccountStep; `#/reset-password` | Banner, Button | Partly built (OTP, Google need credentials) |
| G2 | Account and privacy | PROFILE / Privacy & Security `346:2`, Data Controls & Delete `346:90`, Blocked Accounts `346:134`, Logout Confirmation `346:154` | `#/account` | ListItem, Toggle, ConfirmDialog | Built (incl. blocked accounts via notes) |
| G3 | Funding application | FUNDING / Eligibility `336:2`, Workspace `336:34`, Review & Submit `336:97`, Submitted `336:129`, Under Review `337:2`, Shortlisted `337:27`, Info Requested `337:54`, Approved `337:81`, Declined `337:110`, Dashboard `337:139` | Not built | — | Gated: funder owner, legal |
| G4 | Moderation | STORY / Report Content Sheet `329:52`; TRUST / Report Confirmation `343:2`, Moderation Queue `343:13`, Decision `344:2`, Appeal Submitted `344:74` | Report sheet, moderator Reports tab | Sheet, Badge | Report and queue built; appeal gated |
| — | Not in scope | Cultural Resonance Quiz `348:2` (concept), Project Funding `335:160`, Monetization, Institutions | — | — | Excluded (D-07, D-12) |

Page notes frames: ONBOARDING `315:10`, DISCOVERY `322:161`, STORY `329:86`, LIBRARY `331:195`, CREATOR `334:71`, FUNDING `337:176`, MONETIZATION `339:169`, INSTITUTIONS `341:142`, TRUST `344:134`, PROFILE `346:166`.
