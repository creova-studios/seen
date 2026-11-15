# SEEN accessibility status

**Conformance status: WCAG 2.2 AA remediation in progress. SEEN is not claimed to conform.** Automated checks pass and browser-driven manual-style checks pass for the routes listed; assistive-technology testing with people or real devices has not been done.

## 1. Automated verification (passing)
| Check | Evidence |
|---|---|
| axe-core scans on 9 routes | `e2e/a11y.spec.ts` |
| 44 px touch targets, nothing hidden under the bottom nav, no sideways overflow at 320, 360, 390, 768, 1280 px, for all four roles, on 15 viewer routes | `e2e/audit/ux-audit.spec.ts` |
| Every route opens from its URL without console errors | `e2e/route-reachability.spec.ts` |

## 2. Manual-style verification (browser-driven; see `docs/accessibility/MANUAL_VERIFICATION_REPORT.md`)
| Check | Result |
|---|---|
| Keyboard-only: onboarding and sign-up, For You, open and save a story, start reading, Library Saved, Settings, sign-out dialog (Escape returns focus) | PASS |
| Accessible name on every control on 11 routes | PASS |
| 200% zoom, 400% reflow (320 px) and Larger text on 8 routes | PASS |
| Text over photos against the worst-case (white) photo | PASS where text overlaps imagery on For You; limited coverage elsewhere |
| Reduced motion, Larger text, High contrast settings exist | PASS |

## 3. Not verified
VoiceOver, NVDA, TalkBack; real-device on-screen keyboard overlap; contrast over real photographs; the full Create Story wizard by keyboard; video captions (the reader has no video player); separate transcript files for recorded audio (the transcript sheet shows the narrated chapter text); drag-free alternatives for horizontal rails.

## 4. Improved in this phase
Onboarding cut from 9 to 4 screens with Back, step count and tap-only choices; story page play button named and wired; hero and header scrims for light photos; Create Story image descriptions (required, or marked decorative) and optional content notes shown before a story starts; Larger text setting; playback speed.

## 5. Known gaps
- Create Story attaches media by pasting a URL through a browser prompt. A file picker needs upload storage.
- Lint is not configured (`docs/operations/LINT_PLAN.md`).
