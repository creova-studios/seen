# Customer feedback traceability (2026-10-06)

Status is verified against the code on the consolidated baseline. DONE = shipped and tested; PARTIAL = part shipped; OPEN = not done, with the reason.

| Feedback | Status | Evidence / what changed | Remaining |
|---|---|---|---|
| Increase contrast, visible borders | DONE | Secondary text raised to `/55` everywhere (41 occurrences fixed in this pass); High contrast setting; axe scans on 9 routes pass | Manual contrast spot-check on real devices |
| Password and authentication guidance | DONE | Live rule checklist, show/hide, correct `autocomplete`, reset and change-password screens | none |
| Card title readability, card size | PARTIAL | Cards are single tap targets with typeLabel/badge slots; titles unchanged | Wider type-scale review needs design sign-off |
| Buttons more visible, 44 px targets | DONE | 44 px guard in the UX audit passes at 320 to 1280 px for all roles | none |
| Clarify names and labels / vague "Enter Story" | DONE | "Enter Story" is now "Start reading" (EN/FR/ES); bottom-nav labels localised | Onboarding final "Enter" and "Continue" labels (see matrix) |
| Read / Listen / Watch wording and duration | PARTIAL | Cards show read time or duration; no verb | Verb label per format needs a content-format field |
| Speaker / audio controls, sound management | DONE | Play/pause, seek, elapsed/duration, skip 15 s, transcript, captions (device voice), and now playback speed (0.75x to 1.5x, remembered) | Volume and mute rely on device volume; not added |
| Creator add/create control obvious, Create Story help | DONE | Helper text per step, "Next: X" labels, Your stories screen, creator overview card | none |
| Audience as tags, not typing | DONE | Audience chips (Youth, Educators, Families, Community members, Researchers, General public) plus optional own entry | none |
| "What happens next" clearer | DONE | Step counters and "Next: X" labels in Create Story and onboarding | none |
| Reduce onboarding screens | DONE | 9 screens cut to 4 (Language, Purpose, Interests (optional), Account) with Back and "Step n of 3"; `OnboardingSystem.tsx`, `OnboardingOrientation.tsx`; e2e `first visit` | Product to review copy and the removed Moderator choice |
| Continue reading, Saved stories | DONE | Continue rail on For You, In progress and Saved tabs in Library, real persistence | Server sync needs the backend |
| Horizontal discovery cards | DONE | Rails exist | Keyboard and button alternatives to dragging not audited in this pass |
| Industry/category suggestions on home | PARTIAL | Themes on Search landing and Explore | none planned |
| Clarify News vs Media | DONE (answered) | Neither exists as a section, tab, filter, content type or Figma frame; "media" only means chapter assets. Recommendation: do not add either. See `docs/audit/NEWS_VS_MEDIA_AND_PROFILE_SEPARATION.md` | Product to confirm the tester meant a concept that does not exist |
| Improve Profile | DONE | Edit profile, bio, change password, preferences, larger text, sign-out confirmation | none |
| Accessibility generally | PARTIAL | Alt text (required or decorative) and content notes added to Create Story; keyboard, semantics, zoom and image-contrast checks pass; see `SEEN_ACCESSIBILITY_STATUS.md` | Screen-reader and real-device passes; file upload for media (REQUIRES BACKEND) |
