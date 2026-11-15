# 06 — SEEN information architecture

**SEEN — a Creova product.** Supersedes `docs/ux/INFORMATION_ARCHITECTURE.md` (kept for history).

## Today (`main`)

Tabs: **For You · Explore · Library · Profile**. Header: Search · Notifications · Profile. Funding reached from Profile › Your SEEN and from notifications. Creator tools, moderation and admin live under Profile.

## Proposed IA

```
Introduction (visitors only) ── About · Our story
│
├── For You       Continue · picks with reasons · New voices · one creator row · one funding block (creators)
├── Explore       Stories · Creators · Collections  (+ topics / cultures)
├── Library       Continue · Saved · Following · Collections   (Downloads, History later)
└── Profile       own public profile · Edit profile · [Creator Studio] · Settings ⚙
     └── Settings  Account · Experience (language, a11y, notifications) · Privacy & safety · Money · Help · Legal · About
Global top bar:   Search · Notifications · [+ Create — creators only, pending D-05]
Creator Studio:   Overview · Stories (drafts, in review, published) · Funding (opportunities, tracker) · Earnings (later)
```

## Navigation items: justification

| Item | User need | Role | Frequency | Priority | Mobile | Desktop (proposed) |
|---|---|---|---|---|---|---|
| For You | Something good to experience now | All | Every visit | P1 | Tab 1 | Left rail |
| Explore | Browse deliberately | All | Weekly | P1 | Tab 2 | Left rail |
| Library | Resume / revisit | Explorer+ | Every visit | P1 | Tab 3 | Left rail |
| Profile | Identity + settings | Explorer+ | Occasional | P1 | Tab 4 | Avatar menu |
| Search | Find a known thing | All | Often | P1 | Top-bar icon | Top-bar field |
| Notifications | Updates that matter | Explorer+ | Occasional | P2 | Top-bar bell | Top-bar bell |
| Create | Start a story | Creator | Weekly for active creators | P1 | Top-bar "+" (D-05) | Button in left rail |
| Opportunities | Find funding | Creator | Weekly | P1 | Creator Studio + For You block | Creator Studio |
| Saved | Revisit | Explorer+ | Often | P1 | Library lens | Library |
| Settings | Control experience | All | Rare | P2 | Profile ⚙ | Avatar menu |
| About | Understand SEEN / Creova | Visitors | Once | P2 | Introduction + Settings | Footer |

Not tabs, deliberately: Funding (a creator need, not everyone's), Notifications (a header convention), Create (pending D-05; Figma says Creator Studio is never a consumer tab).

Depth rule: any primary task is reachable in ≤ 3 taps from a tab.
