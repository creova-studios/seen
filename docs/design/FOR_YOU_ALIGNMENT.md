# For You: Figma ↔ production alignment (frame 316:2)

Method: Figma frame read through the Figma API (internal sizes, not canvas coordinates); production behaviour kept; local build measured with Playwright at 390 px. The deployed site could not be opened from the build sandbox, so "production" below means the repository state at `be09706` (what Vercel deploys from `main`). Fonts from Google could not load in the sandbox, so pixel comparison used fallback fonts; metrics are exact, glyph shapes are not.

## Discrepancy table (before → after)

| Element | Figma 316:2 | Code before | After |
|---|---|---|---|
| Page gutter | 24 px | 20 px (`px-5` everywhere) | `--seen-gutter` token: 20 px below 360 px, 24 px from 360 px; applied to header, Page, TopBar and the four tabs |
| Top of screen | 520 px full-bleed hero, status bar over it | "For You" title, presence rows, then a Featured card | Hero added on top (`FeaturedHero`); title, tagline, presence rows kept below (no live feature removed) |
| Hero eyebrow | Geist Mono 11, tracking 0.8, brand colour | none | same, uppercase |
| Hero title | Fraunces 34 / 1.16 / -0.5 | Inter 36 light | Fraunces 34 / 1.16 / -0.5 (`font-seen-display`) |
| Hero CTA | 160×44, radius 12, white, "▶ EXPERIENCE" | none | `Button shape="rounded"`, 160×44 |
| Section titles | Inter SemiBold 20 / 1.3, caption 12 muted | Inter 20 weight 500, tracking -0.5 | SemiBold, tracking 0, caption `text-seen-muted` (SectionHeader, SectionTitle) |
| Tab titles | Fraunces 34 | `text-2xl font-bold` / 36 light | `PageTitle` on For You, Explore, Library, Profile |
| Rail cards | 240×140 (continue), 150×200 | 220 wide, 3:4 | `RailCard` (240×140) used for Continue experiencing; existing `StoryCard` rails unchanged |
| Bottom nav | 64 px, 4 equal columns, 11 px Inter Medium labels, tracking 0.2, 20 px icon, gap 4, solid #121214 + #222226 border | 58 px, `justify-around`, 10 px light labels tracking 1 px, glow, translucent black | 64 px total, equal columns, 11 px medium, no glow, `bg-seen-surface/95`, `border-seen-border` |
| Voices to discover | 64 px avatars, 120 px columns | none | `VoicesToDiscover` from the real creator list |
| Continue experiencing | rail of in-progress | none (only in Library) | shown only when the viewer has progress |

## Root causes

- **Container hierarchy / hard-coded values:** `px-5` copied into about 60 places; the 4 px gutter gap could only be fixed at the shared containers, so a token was introduced (`--seen-gutter`) and the shared containers use it.
- **Chrome inside each screen:** header and bottom nav were rendered by every tab screen inside its own fade, so they blinked on each tab switch. They now render once in `App.tsx` and only content fades.
- **Reusable-component drift:** three title styles, two section-header weights, a pill-only Button.
- **Motion:** 0.4 s tab fades (0.8 s in/out), stagger delays to 0.6 s, smooth-scroll fighting the route change, card hover using the 0.4 s entrance transition and a 1.02 scale.
- **Viewport units:** `min-h-screen` (100vh) replaced by `min-h-dvh`; `viewport-fit=cover` added so safe-area insets work on notched phones.

## Motion changes

| Item | Before | After |
|---|---|---|
| Duration scale | 0.2 / 0.3 / 0.5 s ad hoc, many literals | fast 150 ms, base 250 ms, slow 400 ms (CSS tokens and `DURATION`) |
| Tab content fade | 0.4 s in and out | 0.2 s |
| For You stagger | delays up to 0.6 s, durations 0.8 s | durations 0.25 s, delays ≤ 0.2 s |
| Header/nav on tab switch | replayed entrance | fixed, never re-mounts |
| Card hover/tap | 0.4 s, delayed by stagger, scale 1.02, y -4 | 150 ms, y -2, tap 0.99 |
| Route scroll reset | smooth (fought the fade) | instant |
| In-app "Reduce motion" | did not cover `html` (smooth scroll stayed) | root included |

Full inventory and the remaining recommendations: `docs/design/audit/MOTION_AUDIT.md`. Other tabs: `docs/design/audit/TAB_SCREENS_DISCREPANCIES.md`.

## Responsive validation

`e2e/for-you-alignment.spec.ts`: widths 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 (no horizontal overflow, gutter 20/24, nav 64 px, four equal columns, 11 px labels, 600-weight section titles); heights 568, 667, 844, 1000 (nav flush to the bottom, last content clears the nav); hero is 520×, CTA 160 wide and ≥ 44 high, only one button, opens the story; reduced motion zeroes transitions; header does not replay on tab switch; first content of Explore, Library and Profile clears the fixed header. `e2e/audit/ux-audit.spec.ts` still guards tap targets and nav occlusion for all roles. Mobile landscape and real browser-chrome behaviour need a physical-device check.

## Independent review (read-only agent) and what was fixed

Fixed after review: safe-area top offset (new `--seen-header-offset` / `pt-header`, so notched phones do not hide the first content), bottom clearance includes the home-indicator inset (`pb-clearance`), hero moved inside `<main>` with its title as a paragraph (one h1, correct landmark and heading order), tab chrome hidden on role-denied screens, demo note also on empty states, profile title size conflict removed, `h-screen` in Search replaced. Not changed: hard-coded English in the new rails (the rest of For You is also English; translating the whole screen is a separate task) and the older header motion blocks in Explore, Library and Profile (listed in the motion audit).

## Remaining differences (not hidden)

- **No Figma-matching data yet, so not built:** "Because you listened to …" (needs recommendations), the regional feature card "Songs of the Basin" (needs curated regional data), "Trending conversations" (needs a conversations feature), and "A project seeking support" pill (E3, gated on the legal check on linking stories to real funders).
- **Kept from the deployed app although Figma's For You frame omits them:** the fixed app header (search, notifications, profile), the "For You" title and tagline, the three presence rows, Featured, Trending and New Releases rails, and the demo-mode note.
- Existing `StoryCard` rails are 220 px wide, Figma rail cards are 150 px; left to avoid reflowing three live screens at once.
- Page background is `#000`, Figma canvas is `#0b0b0c` (global change, needs a contrast pass).
- Explore, Library, Profile still differ from their Figma frames in card type (grid card), tabs and settings rows; see the tab audit for the ordered list.
- Fraunces' SOFT and WONK axes are not loaded (Google Fonts subset); glyph shapes can differ slightly from Figma.
- No pixel-diff tool is in the repo (fonts differ per machine, which makes baselines flaky); visual checks were manual screenshots plus the metric tests above.
