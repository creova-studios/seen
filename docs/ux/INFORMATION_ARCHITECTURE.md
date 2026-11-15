# Information architecture

```
SEEN
├── For You            personalised entry: presence counts → featured → trending → new
├── Explore            discovery, same for everyone
│   ├── Stories        curated sections + inline story search
│   ├── Creators       directory → Creator profile (follow, stories)
│   └── Collections    thematic / institutional → Collection detail (save, stories)
├── Library            the user's own reading state: in progress, completed
├── Profile            identity + "Your SEEN" + role tools + preferences
│   ├── Your SEEN      Following · Saved collections · Funding tracker · Notifications
│   ├── Creator tools  Publish wizard · Monetization · Earnings            (creator)
│   ├── Moderation     Review queue                                        (moderator, admin)
│   ├── Admin          Platform dashboard · Institutional collections      (admin)
│   └── Preferences    Language · intent · accessibility · about · sign out
└── Global (header)    Search · Notifications · Profile
    Pushed screens     Story preview → Chapter → Chapter index · Funding → Opportunity
```

## Principles applied

- **Four tabs only** (3–5 rule; Hick's law). Funding and Notifications are *not* tabs: funding matters to a subset of users (creators) and is reached from Profile › Your SEEN and from funding notifications; notifications live in the header bell (Jakob's law).
- **Entity-first Explore.** The Figma segmented tabs replaced type filters that could never match anything.
- **Library = mine; Explore = everyone's.** Saved collections and followed creators surface in Profile for now; a Library "Saved" tab is the planned consolidation (`MISSING_FEATURES.md`).
- **Progressive disclosure by role.** Viewers never see empty creator/moderation sections; they see a single "Share your story" invitation.
