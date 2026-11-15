# 08 — SEEN accessibility audit

**SEEN — a Creova product.** Target WCAG 2.2 AA. Automated evidence: axe-core (WCAG 2.2 A/AA tags) in `e2e/a11y.spec.ts` passes on CI for the main routes. Manual review here is code review plus earlier keyboard testing; a screen-reader pass on real devices (VoiceOver, TalkBack) has **not** been done and is required before user testing (A-12).

| ID | Criterion | Finding | Status | Priority |
|---|---|---|---|---|
| A-01 | 1.4.3 Contrast (text) | Tokens pass; `text-white/50` (5.3:1) passes; legacy `white/30–45` removed | ✅ | — |
| A-02 | 1.4.11 Non-text contrast | Card/input borders `white/5–15` ≈ 1.2–1.6:1. Fails where the border is the only boundary cue (FB-07) | ❌ | P1 |
| A-03 | 2.4.7 / 2.4.11 Focus visible | Global `:focus-visible` outline; custom controls use `peer-focus-visible` | ✅ | — |
| A-04 | 2.5.8 Target size | 44 px rule in primitives; some legacy wizard controls smaller | 🟡 | P2 |
| A-05 | 1.3.1 Headings/landmarks | Screens have `h1`; `main` landmark present; legacy screens skip levels | 🟡 | P2 |
| A-06 | 3.3.1/3.3.3 Errors | Fields wire `aria-describedby` + `role=alert` | ✅ | — |
| A-07 | 4.1.3 Status messages | Toasts (sonner) announce; recovery message `role=status` | ✅ | — |
| A-08 | 1.2.x Media alternatives | Story text acts as transcript for device voice, but there is **no transcript view in the player**; no captions for future video | ❌ | P1 (FB-05) |
| A-09 | 2.3.3 / reduced motion | OS setting + app toggle apply app-wide (`data-motion`) | ✅ | — |
| A-10 | 1.4.1 Use of colour | Status uses text + colour | ✅ | — |
| A-11 | 2.1.1 Keyboard | Tabs, dialogs, drawers keyboard-operable; reader branch overlay needs checking | 🟡 | P2 |
| A-12 | Screen-reader behaviour | Not tested on devices | ❌ | P1 before testing |
| A-13 | 1.4.4 Resize text | Figma specifies a text-scale slider (0.85–1.5). Not built | ❌ | P2 |
| A-14 | 3.1.2 Language of parts | FR/ES content inside EN UI lacks `lang` attributes | ❌ | P2 |
| A-15 | Speaker icon clarity | Player buttons named ("Play", "Pause", "Back 15 seconds") | ✅ | — |

Automated tools are supporting evidence; A-02, A-08, A-12 need manual verification.
