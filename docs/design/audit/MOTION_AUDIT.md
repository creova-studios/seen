# SEEN motion audit

Read-only audit of how screen motion works today, so the Figma re-alignment does not break it.

- Snapshot: working tree at 2026-10-06 11:49 UTC on top of HEAD `be09706`. The tree has uncommitted edits from another process (ForYouScreen, NavigationBar, BottomNav, ScreenFrame, `utils/motion.ts`, `seen-tokens.css`, new `ForYouSections.tsx`). Line numbers are for this snapshot and will drift. Where the committed (HEAD) value differs it is marked "HEAD".
- Method: static reading of the code plus grep. Nothing was run. Durations marked "(lib default)" come from motion/Tailwind defaults, not from a measurement. Spring settle times are estimates.
- Not audited in depth: `src/app/components/ui/*` (shadcn), `creator-flow/*`, `OnboardingSystem` internals, sonner toasts.
- Target scale used for findings: fast 100-180 ms (feedback), standard 180-300 ms (cards, tabs, content), large 250-450 ms (sheets, drawers, page-level).

## 0. How motion is wired (one paragraph per layer)

1. **Router.** `App.tsx` keeps `route` in React state and mirrors it to `history.pushState` hash URLs (`go`, App.tsx:87-97). `applyRoute` (App.tsx:78-85) calls `setRoute` and then `window.scrollTo({top:0})` in the same tick. `popstate` (App.tsx:107-115) goes through the same `applyRoute`. `back()` (App.tsx:100-105) uses `history.back()` only if this session pushed an entry (`depth.current > 0`), else it replaces to `for-you`.
2. **Screen transitions.** One `<AnimatePresence mode="wait">` (App.tsx:221-347) holds every screen, each with a `key`. `mode="wait"` means the old screen plays its `exit` to completion, and only then does the new screen mount and play `initial -> animate`. There is no shared layout and no direction awareness. Each screen owns its own wrapper motion element.
3. **Three wrapper families.**
   - Tab screens (For You, Explore, Library, Profile): full-screen `motion.div` fade, 0.4 s, no transform. Header and bottom nav live inside it.
   - Pushed screens (`ScreenFrame`, used by Notifications, Collections, Collection detail, Funding, Opportunity, Creator profile, Notes, Account, Reset password, Settings, Chapter index; verified by grep of `ScreenFrame` imports): fade + 24 px horizontal slide, 0.25 s.
   - Immersive fixed screens (story preview, story chapter): `fixed inset-0 z-50` motion layers (slide-up spring / fade).
4. **Persistent chrome.** Only `MediaPlayerBar` (App.tsx:349-358) and `Toaster` sit outside `AnimatePresence`, so they never remount on route change. `NavigationBar` and `BottomNav` do NOT: each tab screen renders its own copy inside its fading wrapper.
5. **Overlays.** Two stacks coexist. Radix-based `Dialog/Sheet/Drawer` in `seen/overlays.tsx` use tw-animate-css CSS keyframes (`animate-in`). Older components (Paywall, Checkout, ContextCard, SubmitResponse, BranchingChoice, LanguageSwitcher, chapter controls) use `AnimatePresence` + `motion`.
6. **Reduced motion.** Three independent mechanisms, see section 3.

## 1. Inventory

Duration column: seconds are motion/JS, ms are CSS. "(def)" = library default, unmeasured. Spring = physics, no fixed duration.

### 1.1 Route-level

| Surface | Trigger | Properties | Duration | Easing | Library | File:line |
|---|---|---|---|---|---|---|
| Tab screen wrapper (For You) | route = for-you | opacity 0 -> 1, exit 1 -> 0 | 0.4 | motion default | motion | ForYouScreen.tsx:116-120 |
| Tab screen wrapper (Explore) | route = explore (key includes `tab`) | opacity | 0.4 | default | motion | ExploreScreen.tsx:95-99; key App.tsx:283 |
| Tab screen wrapper (Library) | route = library | opacity | 0.4 | default | motion | LibraryScreen.tsx:67-71 |
| Tab screen wrapper (Profile) | route = profile | opacity | 0.4 | default | motion | ProfileScreen.tsx:125-129 |
| Pushed screen (`ScreenFrame`) | any ScreenFrame route | opacity + x 24 -> 0; exit x -> 24 (same side) | 0.25 | cubic-bezier(.2,0,0,1) | motion | ScreenFrame.tsx:8-14 |
| Story preview | route = story-preview | y 100% -> 0 + opacity; exit back down | spring (d30,k300) ~0.3-0.5 s est. | spring | motion | FeaturedStoryPreview.tsx:86-91 |
| Story chapter reader | route = story-chapter | opacity only | (def) 0.3 | default | motion | StoryChapterScreen.tsx:242-247 |
| Chapter index | route = chapter-index | ScreenFrame (see above) | 0.25 | standard | motion | ChapterIndexScreen.tsx via ScreenFrame |
| About | route = about | opacity wrapper, children delayed up to 1.4 s | (def) | default | motion | AboutScreen.tsx:99-253 |
| Onboarding | initial route | opacity 1.2 s, children delays up to 2.0 s | 0.8-1.5 | mixed | motion | OnboardingSystem.tsx:278-342 |
| Lazy-screen fallback | first load of 6 lazy chunks | skeleton, `animate-pulse` | 2 s loop (TW) | TW | CSS | App.tsx:214-220, primitives.tsx:199 |
| Scroll reset | every `applyRoute` | window scroll to top | smooth (CSS) | browser | CSS | App.tsx:82 + styles/index.css:17-19 |

### 1.2 In-screen entrance (tab screens)

| Surface | Trigger | Properties | Duration / delay | Library | File:line |
|---|---|---|---|---|---|
| For You: welcome note (first visit only) | mount | opacity, y 10 | 1.2 s, easeOut | motion | ForYouScreen.tsx:132-136 |
| For You: header + presence | mount | opacity, y 12 | 0.25 | motion | ForYouScreen.tsx:146-149 |
| For You: continue / featured / trending / new sections | mount | opacity, y 12 | 0.25, delay 0 / .05 / .10 / .15 | motion | ForYouScreen.tsx:168, 186-189, 218-221, 249-252 |
| For You: hint line | mount | opacity | 0.25, delay 0.2 | motion | ForYouScreen.tsx:281-284 |
| For You: presence rows | mount | opacity, y 8 | 0.25, delay 0.05 x i | motion | ForYouScreen.tsx:311 |
| `FeaturedHero` | mount | opacity | 0.25 (`TRANSITIONS.default`) | motion | ForYouSections.tsx:28-32 |
| `SectionHeader` | mount | opacity, y 8 | 0.25 | motion | SectionHeader.tsx:16-19 |
| `ContentCard` | mount | opacity, y 20, scale .98 | 0.4 (`reveal`) + 0.05 x index | motion | ContentCard.tsx:57-63 |
| `ContentCard` hover / tap | hover / press | y -4, scale 1.02, boxShadow / scale .98 | same transition prop: 0.4 + stagger delay | motion | ContentCard.tsx:61-63, motion.ts CARD_VARIANTS |
| Explore: search header | mount | opacity, y 20 | (def), delay 0.1 | motion | ExploreScreen.tsx:107-110 |
| Explore: category sections | mount | opacity, y 20 | (def), delay 0.3 + 0.1 x index | motion | ExploreScreen.tsx:182-186 |
| Explore: search results | query > 2 chars | opacity, y 20 | (def) | motion | ExploreScreen.tsx:147-149 |
| Library: header, tabs | mount | opacity, y 20 | (def), delay .1 / .2 | motion | LibraryScreen.tsx:79-93 |
| Library: filter rows | mount | opacity, x -20 | 0.8, delay .3 / .5 | motion | LibraryScreen.tsx:97-100, 128-131 |
| Library: in-progress / saved lists | inner tab change | opacity, y 20; `exit` y -20 | 0.3 | motion | LibraryScreen.tsx:202-207, 250-255 |
| Profile: 11 sections | mount | opacity, y 20 | (def), delays .1 .2 .2 .28 .3 .32 .3 .35 .4 .45 .5 | motion | ProfileScreen.tsx:138-472 |
| `EmptyState` | mount | opacity, y 20 | 0.4 | motion | EmptyState.tsx:39-41 |
| `StoryCard` | mount | opacity, scale .97 | 0.4 | motion | StoryCard.tsx:27-29 |

### 1.3 Chrome and feedback

| Surface | Trigger | Properties | Duration | Easing | Library | File:line |
|---|---|---|---|---|---|---|
| `NavigationBar` header | tab mount | `initial={false}`: no own animation, rides the screen fade | 0.4 (parent) | - | motion | NavigationBar.tsx:16-19 |
| `BottomNav` | tab mount | none of its own, rides the screen fade | 0.4 (parent) | - | - | BottomNav.tsx:18 |
| `BottomNav` tab colour | press / hover / active | color | 150 ms (`--seen-duration-fast`) | TW default | CSS | BottomNav.tsx:28 |
| `Button` | hover / active | colors | 150 ms | TW default | CSS | primitives.tsx:48 |
| `IconButton`, `Chip`, segmented control | hover | colors | 150 ms (TW default, no explicit duration) | TW default | CSS | primitives.tsx:83, 122, 310 |
| Mini player docking | route changes tab <-> non-tab | `bottom-[76px]` vs `bottom-3` class swap | none (instant jump) | - | - | MediaPlayerBar.tsx:~28 |
| Mini player progress | playback tick | width | 150 ms | TW default | CSS | MediaPlayerBar.tsx:35 |
| Card image zoom | hover | transform scale 1.05 | 700 ms | TW default | CSS | cards.tsx:67, StoryCard.tsx:38, ContentCard.tsx:72 |
| Rail card image zoom | hover | transform | 400 ms (`--seen-duration-slow`) | TW default | CSS | ForYouSections.tsx:66 |
| Progress bar | value change | width (`transition-all`) | 150 ms | TW default | CSS | display.tsx:16 |
| Toggle thumb | change | transform | 150 ms | TW default | CSS | forms.tsx:168 |
| Library filter rows | hover | colors 300 ms, glow opacity 500 ms | 300 / 500 | TW default | CSS | LibraryScreen.tsx:106, 115, 137, 146, 165 |
| Skeleton | loading | opacity pulse | 2 s loop | TW | CSS | primitives.tsx:199 |
| Button spinner | `loading` | rotate | 1 s loop | linear | CSS | primitives.tsx:58 |

### 1.4 Overlays

| Surface | Trigger | Properties | Duration | Easing | Library | File:line |
|---|---|---|---|---|---|---|
| Radix backdrop (all three) | open | opacity (enter only) | 150 ms (tw-animate default) | `ease` | Radix + CSS | overlays.tsx:12 |
| `Dialog` content | open | NONE (appears instantly over fading backdrop) | 0 | - | Radix | overlays.tsx:50 |
| `Sheet` (bottom) | open | translateY 100% -> 0 | 150 ms | `ease` | Radix + CSS | overlays.tsx:140 |
| `Drawer` (right) | open | translateX 100% -> 0 | 150 ms | `ease` | Radix + CSS | overlays.tsx:164 |
| Any Radix overlay | close | NONE (no `animate-out` / `data-[state=closed]`), unmounts at once | 0 | - | Radix | overlays.tsx:12, 50, 140, 164 |
| Tooltip | hover (400 ms delay) | none | 0 | - | Radix | overlays.tsx:174-198 |
| `PaywallModal` | open/close | backdrop opacity; card opacity + scale .95 | (def) 0.3 | default | motion | PaywallModal.tsx:75-85 |
| `CheckoutModal` | open/close | backdrop opacity; sheet y 100% | spring d30 k300 | spring | motion | CheckoutModal.tsx:74-85 |
| `ContextCardModal` | open/close | opacity, y 20, scale .95 | spring d25 k300 | spring | motion | ContextCardModal.tsx:47-60 |
| `SubmitResponseModal` | open/close | opacity, y 20, scale .95 | spring d25 k300 | spring | motion | SubmitResponseModal.tsx:92-105 |
| `BranchingChoiceOverlay` | branch reached | opacity; children delay .2 / .3 + .1 x i / .6 | (def) | default | motion | BranchingChoiceOverlay.tsx:45-126 |
| `LanguageSwitcher` | open | backdrop opacity; panel y -10, scale .95 | spring d25 k300 | spring | motion | LanguageSwitcher.tsx:47-59 |
| Chapter top controls | tap to toggle | opacity, y -20 | (def) | default | motion | StoryChapterScreen.tsx:262-267 |
| Chapter title / body | chapter change | opacity, y 20; delay .1 / .2 | (def) | default | motion | StoryChapterScreen.tsx:365-380 |
| Story preview internals | mount | back btn .2, meta .3, play (spring) .4, bottom .5, "ambient" notice 1.0 | delays | default | motion | FeaturedStoryPreview.tsx:104-249 |
| Story preview play pulse | `isPlaying` | scale 1-1.5-1, opacity, infinite | 2 s loop | easeInOut | motion | FeaturedStoryPreview.tsx:174-183 |

## 2. Per-transition answers

Common facts for every route change (App.tsx): the URL hash and `route` state change synchronously, so **the route changes first and the animation runs after it** (the old screen is still painted for its exit while the URL already shows the new one). `mode="wait"` makes exit and enter strictly sequential, never overlapping. Scroll is reset in the same tick as the route change, not after the exit.

### 2.1 Tab to tab (For You / Explore / Library / Profile)

- **Cause:** `BottomNav` tap -> `onNavigate` -> `handleNavigate` -> `trackedGo` (App.tsx:197-199). Also presence rows (`nav.go("explore", {tab})`), header profile icon, "See all" links.
- **Direction:** none. Pure cross-fade via sequential fade-out then fade-in. No slide, no left/right awareness by tab order.
- **Duration:** 0.4 s exit of the old tab + 0.4 s enter of the new tab = **0.8 s** before the screen is fully visible, plus in-screen stagger (section 4.2). Easing: motion default, not tokenised.
- **What moves:** the entire screen, including header and bottom nav. The nav is NOT fixed during the change; it fades out with the old screen and fades in with the new one, so the persistent chrome visibly blinks. `NavigationBar`'s `initial={false}` only stops a second, separate animation; it does not keep it on screen.
- **Run order:** after the route change (see above).
- **Scroll:** not preserved. `window.scrollTo({top:0})` runs for every route including tab switches and `popstate`. There is no `history.scrollRestoration` handling and no per-route scroll store (grep: the only `scrollTo` is App.tsx:82). Local state is also lost on remount (Library inner tab, Explore search text, rail positions). Explore's key includes `tab` (App.tsx:283), so changing the Explore sub-tab through `nav.go` remounts the whole screen and replays the full exit/enter.
- **Smooth scroll side effect:** `html { scroll-behavior: smooth }` (index.css:17-19) means the `scrollTo` animates the outgoing screen up while it is fading out.
- **Mobile vs desktop:** identical. The column is `max-w-[428px]`, nav bars are full-width fixed with a centred inner column. Hover-only effects (card lift, image zoom) never fire on touch.
- **Reduced motion:** opacity fades and delays still run (see section 3). Only the y/x parts stop.

### 2.2 Tab to story preview, preview to chapter, and back

- **Cause:** card tap -> `openStory` -> `trackedGo("story-preview")`; "Enter Story" -> `trackedGo("story-chapter")`; close -> `back` (preview) or `go("for-you")` (chapter, App.tsx:250, no depth increment).
- **Forward:** tab fades out 0.4 s, then the preview slides up from the bottom (spring, `fixed inset-0 z-50`). Header, bottom nav and the tab behind it are already gone (not covered, removed), so there is a 0.4 s empty black gap before the slide starts.
- **Back:** preview slides down (spring), then the tab mounts and fades in 0.4 s and replays its whole entrance stagger. Scroll is at top, not where the user left.
- **Chapter:** preview exits (spring down), reader fades in (opacity only, lib default). Reader chrome (top controls) is a nested `AnimatePresence` toggled by tapping the screen (StoryChapterScreen.tsx:262, 418).
- **Whole screen vs content:** whole screen. Preview has additional per-element delays up to 1.0 s (section 4.3).
- **Mini player:** `MediaPlayerBar` is hidden on `story-chapter` and `onboarding` only. It jumps between `bottom-[76px]` and `bottom-3` without a transition when going between tabs and pushed screens.
- **Mobile vs desktop:** same; the preview centres its content at 428 px over a full-bleed image.
- **Reduced motion:** the `y:"100%"` slide becomes instant, the opacity fade (spring-driven) still plays, internal delays remain.

### 2.3 Tab to pushed screen (`ScreenFrame`) and back

- **Cause:** `trackedGo` from profile rows, notification/search icons, etc. Back via the top-bar back button -> `back()`, or the browser/Android back button -> `popstate`.
- **Direction:** the screen always enters from x = +24 px and always exits to x = +24 px (ScreenFrame.tsx:9-11). So going back also exits to the right, i.e. the same direction as going forward is entered from; there is no forward/back distinction and 24 px is a hint, not a page push.
- **Duration/easing:** 0.25 s, cubic-bezier(.2,0,0,1). Previous tab exit 0.4 s first, so forward is 0.65 s total, back is 0.25 + 0.4 = 0.65 s.
- **Whole screen vs content:** the whole frame, including the sticky `TopBar` (primitives.tsx:327), moves together. No fixed nav exists on pushed screens, so nothing stays still. Any `position: fixed` child inside a moving `ScreenFrame` would be offset by the transform while it runs (none found, sheets are portalled).
- **Search / Settings / About / Moderation / creator flows:** these do not use `ScreenFrame` (Search and About have their own wrapper; Moderation, Admin, Earnings, Monetization, Subscription, Creator publish were not inspected; see App.tsx:316-346) so they have their own durations. Search was not re-measured here; About fades with delays up to 1.4 s (AboutScreen.tsx).
- **Scroll:** reset to top on every push and pop.
- **Reduced motion:** x slide off, 0.25 s opacity fade stays.

### 2.4 Radix Sheet / Drawer / Dialog (`overlays.tsx`)

- **Cause:** component state (`open`). Used by `NoteSheet`, `ReportContentSheet`, `MediaPlayerBar` (expanded player), `ConfirmDialog` in Library, Subscription, Notes.
- **Direction:** Sheet from bottom, Drawer from right, Dialog none.
- **Duration/easing:** all enter animations are tw-animate-css defaults: **150 ms, `ease`** (no `duration-*`/`ease-*` classes). A 100 % translate in 150 ms is fast for a sheet (target 250-450 ms).
- **Exit:** none. Without `animate-out` or `data-[state=closed]` classes, Radix `Presence` unmounts immediately, so close is an instant cut while open is animated. Asymmetric.
- **Scroll:** Radix locks body scroll while open and restores it on close; position is preserved by the lock, not by app code.
- **Whole screen vs content:** overlay only; the page behind is static (backdrop blur `backdrop-blur-sm`).
- **Nav:** `BottomNav` is `z-50`, overlays are `z-[60]/[61]`, so the nav is covered, not moved.
- **Mobile vs desktop:** Sheet is `max-w-[428px]` centred; Drawer `w-[min(380px,88vw)]`; Dialog `max-w-[360px]`. No motion differences.
- **Reduced motion:** works. The CSS rules set `animation-duration: .01ms !important`, which collapses these keyframes under both the OS query and the in-app flag.

### 2.5 Legacy motion modals (Paywall, Checkout, ContextCard, SubmitResponse, LanguageSwitcher, BranchingChoice)

- **Cause:** local state. Each wraps its own `AnimatePresence`, so they do have enter and exit (unlike Radix ones).
- **Direction:** Checkout slides from bottom; others scale 0.95 -> 1 with 20 px y. Springs, no fixed duration; Paywall uses the lib default tween.
- **Whole screen vs content:** overlay only.
- **Reduced motion:** motion's `reducedMotion` stops scale/y (transforms) but opacity still fades with its delay.
- **Inconsistency:** same intent (modal), five different curves; 3 different z-indexes (40/50/60/70).

## 3. Reduced motion: does it actually disable things?

| Mechanism | Where | What it reaches | What it misses |
|---|---|---|---|
| OS media query | seen-tokens.css:126-135 | All CSS transitions and keyframes (`animation-duration .01ms`, 1 iteration, `scroll-behavior: auto` on `*`, which includes `html`) -> Radix overlays, Tailwind hovers, skeleton, spinner | Everything driven by motion (JS/WAAPI) |
| In-app flag | App.tsx:148-152 sets `data-motion` in a `useEffect`; CSS at seen-tokens.css:137-145 | Same CSS properties as above, via `:root[data-motion="reduced"] *` | The `html` element itself: `:root[...] *` matches descendants only, so `html { scroll-behavior: smooth }` (index.css:18) stays smooth. Not covered before the first effect runs |
| `MotionConfig` | App.tsx:209: `"always"` if in-app flag, else `"user"` (honours OS) | motion turns transform animations (x, y, scale, rotate) and layout animations into instant changes | **Opacity and colour still animate**, with their duration and **delay**. A 0.4 s tab fade, 0.8 s Library rows and all stagger delays still run. Infinite loops that only touch opacity keep running (story preview ring: FeaturedStoryPreview.tsx:174-183) |
| `prefersReducedMotion()` (motion.ts:14-20) | ContentCard, creator-flow steps | Skips `variants` for hover/enter | Evaluated at render time, not reactive: toggling the in-app setting does not update already-rendered cards. Also ignores the `MotionConfig` choice |

Conclusions:
- Radix overlays and Tailwind transitions: yes, disabled by either the OS or the in-app setting.
- motion screens: **partially**. Movement stops, but fades and every delay remain, so a reduced-motion user on Profile still waits ~1.2 s for the last section.
- Side effect: `animate-spin` is forced to one 0.01 ms iteration (spinner stops, loading feedback is lost); `animate-pulse` skeletons freeze.
- Smooth scroll to top remains under the in-app setting.

## 4. Findings

### 4.1 Duration/delay outside the target scale

Fast (100-180 ms): OK across Tailwind `transition-colors/all/transform` (150 ms default) and `--seen-duration-fast`. Gaps are in the other bands.

| Value | Where | Issue |
|---|---|---|
| 0.4 s + 0.4 s (wait) | Tab wrappers (4 files, lines in 1.1) | Individually inside "large"; as a tab switch it is 800 ms. Tabs should be "standard" (180-300 ms) |
| 1.2 s | ForYouScreen.tsx:136 welcome fade (first visit only) | Above 450 ms |
| 0.8 s | LibraryScreen.tsx:100, 131; HEAD ForYou presence rows | Above 450 ms (ForYou now 0.25) |
| 1.2 s / 1.5 s / 2.0 s | OnboardingSystem.tsx:278-342 | Above scale; deliberate "cinematic" intro, but blocks the first interaction |
| delays to 1.4 s | AboutScreen.tsx:99-253 | Content appears late |
| delays to 1.0 s | FeaturedStoryPreview.tsx:104-249 | "Enter Story" CTA appears at 0.4-0.5 s, ambient notice at 1.0 s |
| delays to 0.5 s + lib default | ProfileScreen.tsx:138-472 | Last section settles ~0.8 s after mount |
| delay 0.3 + 0.1 x index | ExploreScreen.tsx:186 | Unbounded by category count |
| 700 ms | cards.tsx:67, StoryCard.tsx:38, ContentCard.tsx:72 image zoom | Above fast/standard for a hover |
| 500 ms | LibraryScreen.tsx:115, 146 glow; OnboardingSystem, LanguageSelectionScreen, OnboardingAccessibility `duration-500` | Above standard for hover feedback |
| 300 ms | LibraryScreen:106,137,165; creator-flow, Onboarding `duration-300` | Upper edge of standard, acceptable |
| 150 ms | overlays.tsx:140, 164 (Sheet/Drawer) | Below large (250-450) for a sheet/drawer; Dialog has no motion |
| 0.4 s + stagger | ContentCard hover/tap (ContentCard.tsx:63) | Feedback should be 100-180 ms; also delayed by `index * 0.05` because the delay sits in the shared `transition` |
| 0 ms | Radix close, `MediaPlayerBar` offset swap | No exit; instant jump |
| spring (no duration) | story preview, Checkout, ContextCard, SubmitResponse, LanguageSwitcher, `TRANSITIONS.spring` | Not tokenised, settle time depends on stiffness (est. 0.3-0.5 s) |
| "(def)" | ~40 `transition={{ delay }}` with no duration | Falls back to library default (0.3 s tween for opacity, spring for y/x/scale), so real timing is implicit |

Unused but out of scale: `DURATION.slowest 0.8`, `DURATION.cinematic 1.2` (motion.ts), `TRANSITIONS.cinematic`, `EMPTY_STATE_VARIANTS` (0.8), `PROGRESS_VARIANTS` (1.2), `WAVEFORM_VARIANTS` (2 s loop), `TAB_VARIANTS`. None are referenced outside motion.ts (grep). `--seen-ease-enter`, `--seen-ease-exit` tokens are also defined but I found no consumer; the `EASING` table in motion.ts (six curves) does not match the CSS tokens.

### 4.2 Stagger / late content: For You worst case

Working tree (post-edit):
- Wrapper fade 0.4 s (children are inside it, so nothing is fully opaque before 0.4 s).
- Sections: delays 0 / 0.05 / 0.10 / 0.15, each 0.25 s -> last section done at 0.40 s.
- Hint line: 0.20 + 0.25 = 0.45 s.
- Presence rows: 0.05 x 2 + 0.25 = 0.35 s.
- `ContentCard`: section delay + `index * 0.05` + 0.4 s `reveal`: worst new-releases card (index 2) ~ 0.15 + 0.10 + 0.4 = **0.65 s**.
- Worst case after mount about **0.65 s**; plus 0.4 s exit of the previous tab = **~1.05 s** from tap. First visit adds the 1.2 s welcome block (it also pushes content down, a layout shift on its own).

HEAD (committed, for comparison): header delay 0.1, sections 0.3 / 0.4 / 0.5, hint 0.6, presence rows 0.2 + 0.1 x i + 0.8 s = **1.2 s**, cards up to ~1.0 s. So tap-to-complete was **~1.6 s**.

Still unchanged elsewhere (same pattern as HEAD ForYou):
- Profile: 0.5 delay + ~0.3 default = ~0.8 s after mount, **~1.2 s** from tap.
- Library: 0.5 delay + 0.8 = **1.3 s** after mount, ~1.7 s from tap.
- Explore: 0.3 + 0.1 x categories + default; with N categories, `0.3 + 0.1N + ~0.3` s.

### 4.3 Entrance animations that replay on every tab switch

- Every tab screen is remounted per navigation (keyed, `mode="wait"`), so the whole entrance replays on each switch, on every back, and after a `popstate`, even when returning to a screen the user just left.
- `NavigationBar` and `BottomNav` are children of each tab wrapper (ForYou:115/261, Explore:102/235, Library:74/302, Profile:133/491), so they fade out and back in on every tab change. This is the main source of the "flicker". `initial={false}` on the header (NavigationBar.tsx:18) does not prevent it.
- `ContentCard` entrance (opacity, y 20, scale .98 + stagger) replays on every mount, also inside Library inner-tab switches and Explore search result changes.
- `SectionHeader` re-animates on every mount (SectionHeader.tsx:16-19), nested inside an already-animating section (double fade).
- Library inner tab (LibraryScreen.tsx:202, 250): the `exit` props are dead code, because no `AnimatePresence` wraps them. Old list unmounts instantly, new one animates in.
- Nested opacity: a child fade runs inside a parent fade (screen 0.4 + section 0.25 + card 0.4), so visual completion is later than any single duration suggests.
- Explore `key={explore-${tab}}` remounts the whole screen on sub-tab change.

### 4.4 Layout-shifting animations (non-transform / non-opacity)

No `motion` prop animates `height`, `width`, `top` or `left` (checked in the files in scope and by grep of `animate=`). Items that do move layout:
- `StoryChapterScreen.tsx:354` progress pips: `transition-all` while width toggles `w-2` <-> `w-4` (150 ms, causes reflow of the row).
- `display.tsx:16` progress bar `transition-all` on inline `width%`.
- `MediaPlayerBar.tsx:35` `transition-[width]`, updated every playback tick.
- Welcome note (ForYouScreen.tsx:132) enters in flow with `mb-8 py-6`, so it pushes the header and every section down when it mounts.
- `ForYouSections.tsx` hero is fixed height (520 px), fine. Rails use `overflow-x-auto`, no animation.
- `TooltipProvider`/tooltips: no motion.
- `ui/accordion` / `ui/collapsible` use tw-animate `height` keyframes (shadcn); not used in audited screens.
- Paint-heavy but not layout: `ContentCard` hover animates `boxShadow` (motion.ts CARD_VARIANTS); `backdrop-blur-xl` bars over moving content; `blur-xl` glows with opacity transitions.

### 4.5 Other issues found

- Smooth scroll-to-top runs while the old screen is still exiting (App.tsx:82 vs `mode="wait"`), visible as a scroll animation under a fading screen. Under the in-app reduce-motion flag it stays smooth (section 3).
- No scroll restoration at all (no `history.scrollRestoration`, no per-route map). Back always lands at top.
- Back-direction mismatch: `ScreenFrame` exits to the same side it entered from; no distinction between push and pop.
- `back()` fallback and two direct `go()` calls (App.tsx:250, 316) do not increment `depth`, so the browser back semantics around them can differ from the in-app back.
- Radix overlays have no exit animation (instant close), legacy motion modals do: two different feel/curves in one app.
- Dialog has no entrance animation; only the backdrop fades.
- `MediaPlayerBar` jumps between `bottom-[76px]` and `bottom-3`.
- Lazy chunk first load: `Suspense` wraps `AnimatePresence`, so the old screen's exit is cut and replaced by a skeleton (App.tsx:214-220). Only affects the six lazy screens, first visit.
- `prefersReducedMotion()` is non-reactive.
- `DURATION`/`--seen-duration-*` are aligned (0.15/0.25/0.4) in the working tree but at HEAD `motion.ts` was 0.2/0.3/0.5; almost no call site uses them yet (`TRANSITIONS.default` in two places, `reveal` in ContentCard).

## 5. Recommendations

### P1 (visible every session)

1. **Move the chrome out of the animated screen.** `src/app/App.tsx`: render `NavigationBar` and `BottomNav` once beside `AnimatePresence` (tab routes only, active tab derived from `currentScreen`) and delete the per-screen copies in `ForYouScreen.tsx`, `ExploreScreen.tsx`, `LibraryScreen.tsx`, `ProfileScreen.tsx`. The nav then stays fixed during tab changes.
2. **Make tab switches one short cross-fade.** `ForYouScreen.tsx:116-120`, `ExploreScreen.tsx:95-99`, `LibraryScreen.tsx:67-71`, `ProfileScreen.tsx:125-129`: change `transition={{ duration: 0.4 }}` to `TRANSITIONS.default` (0.25 s) and give `exit` its own `{ duration: DURATION.fast }`; or switch `App.tsx:221` to `mode="popLayout"`/default so exit and enter overlap and the 0.8 s becomes ~0.25 s.
3. **Cap stagger on remaining tabs.** `ProfileScreen.tsx` (delays .1 to .5), `LibraryScreen.tsx:100, 131` (0.8 s), `ExploreScreen.tsx:110, 186`: use `duration: 0.25`, `delay <= 0.15`, clamp Explore's `index * 0.1` with `Math.min(index, 3) * 0.05`. Match the ForYou values.
4. **Fix ContentCard hover/tap feedback.** `ContentCard.tsx:63`: put the stagger on the entrance only (`variants.visible.transition`) and give `hover`/`tap` `transition: TRANSITIONS.interaction` (0.15 s) in `utils/motion.ts` CARD_VARIANTS.
5. **Stop the smooth scroll under the exiting screen.** `src/styles/index.css:17-19`: remove `scroll-behavior: smooth` from `html` (or scope it to `@media (prefers-reduced-motion: no-preference)` and `:root:not([data-motion="reduced"])`); in `App.tsx:82` call `window.scrollTo({ top: 0, behavior: "instant" })`.

### P2

6. **Give Sheet/Drawer/Dialog real timing and an exit.** `seen/overlays.tsx:12, 50, 140, 164`: add `data-[state=open]:duration-[var(--seen-duration-slow)] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom` (and `-to-right`, `fade-out-0`) plus a short `zoom-in-95 fade-in-0` for `Dialog` content; use `ease-[var(--seen-ease-enter)]`.
7. **Make reduced motion also skip delays and fades.** `App.tsx:209` keep `MotionConfig`; add a shared `useMotionTransition()` that returns `{ duration: 0 }` when `data-motion="reduced"` or OS reduce, and use it for the screen wrappers and `ContentCard`; make `prefersReducedMotion()` (motion.ts:14-20) subscribe to `matchMedia` and the data attribute.
8. **Cover `html` in the in-app reduced rule.** `seen-tokens.css:138`: add `:root[data-motion="reduced"] { scroll-behavior: auto !important; }`.
9. **Pass direction to pushed screens.** `ScreenFrame.tsx:9-11`: use `exit={{ opacity: 0, x: -24 }}` or read a `direction` from `App.tsx` (`popstate` = back) so back reverses.
10. **Fix mini player jump.** `seen/MediaPlayerBar.tsx` (container class near line 28): add `transition-[bottom] duration-[var(--seen-duration-base)]`, or animate with `transform: translateY` instead of `bottom`.
11. **Preserve scroll on back.** `App.tsx:78-85`: store `window.scrollY` per history entry (key by `history.state.key`) and in `popstate` restore it after the new screen mounts instead of `scrollTo({top:0})`; keep top only for forward navigation.

### P3

12. **Replace dead exits in Library inner tabs.** `LibraryScreen.tsx:202-207, 250-255`: wrap the two blocks in `<AnimatePresence mode="wait">` or delete the `exit` props.
13. **Shorten image-zoom and glow hovers.** `cards.tsx:67`, `StoryCard.tsx:38`, `ContentCard.tsx:72`: `duration-700` -> `duration-[var(--seen-duration-slow)]`; `LibraryScreen.tsx:115, 146`: `duration-500` -> `duration-[var(--seen-duration-base)]`.
14. **Trim story-preview delays.** `FeaturedStoryPreview.tsx:104-249`: cap delays at 0.15 s so "Enter Story" (delay 0.5) and the notice (1.0) appear with the screen; give the spring explicit damping for the play button (`stiffness: 200` only, line 158).
15. **Unify legacy modal motion.** `PaywallModal.tsx:75-85`, `CheckoutModal.tsx:84`, `ContextCardModal.tsx:59`, `SubmitResponseModal.tsx:104`, `LanguageSwitcher.tsx:59`: replace per-file springs with `TRANSITIONS.default`/`reveal`, or migrate them to `Dialog`/`Sheet`.
16. **Replace width transitions.** `StoryChapterScreen.tsx:354`: use `scale-x` or a fixed-width pip with `bg` change; `display.tsx:16` and `MediaPlayerBar.tsx:35`: `transform: scaleX(pct)` with `origin-left`.
17. **Keep the spinner alive under reduced motion.** `seen-tokens.css:126-145`: exclude `.animate-spin` (or replace it with an opacity pulse) so loading remains visible.
18. **Loop in story preview.** `FeaturedStoryPreview.tsx:174-183`: guard the infinite ring with `useReducedMotion()` or remove the opacity loop.
19. **Prune dead presets.** `utils/motion.ts`: delete `DURATION.slowest/cinematic`, `TRANSITIONS.cinematic`, `EMPTY_STATE_VARIANTS`, `PROGRESS_VARIANTS`, `WAVEFORM_VARIANTS`, `TAB_VARIANTS` (unreferenced), and either use or drop `--seen-ease-enter/exit`.

## 6. Do-not-break checklist for the Figma re-alignment

- Keep `key` on every screen inside `AnimatePresence`; keep `MediaPlayerBar` and `Toaster` outside it.
- `exit` on a screen wrapper is what lets `mode="wait"` work; a screen with no motion root exits instantly (the empty state branch of ForYou does this at ForYouScreen.tsx:~91).
- Keep `data-motion` and `data-player` on `<html>`; `[data-player="on"] main` gives the mini player padding (seen-tokens.css:164-166).
- `ScreenFrame` and tab screens use `min-h-dvh`; fixed bars rely on screen wrappers having no transform (tab wrappers are opacity-only, so they are safe; do not add `x/y/scale` to a tab wrapper).
- E2E and unit tests mock `window.scrollTo` (src/test/setup.ts:11); changing to `scrollTo({behavior})` keeps that working.
