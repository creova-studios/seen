# SEEN design system

**Rule of precedence:** the live app's visual language (black canvas, light
Inter headings, uppercase tracked labels, hairline borders, restrained motion)
is the baseline; Figma supplies tokens, component states and missing
components; accessibility requirements override both.

## Where things live

| Layer | File |
|---|---|
| Tokens | `src/styles/seen-tokens.css` (`--seen-*` + Tailwind `@theme` utilities: `bg-seen-surface`, `text-seen-muted`, `rounded-seen-lg`, …) |
| Primitives | `src/app/components/seen/primitives.tsx` — Button, IconButton, Chip, Badge, Avatar, Skeleton, StateTemplate, Banner, SegmentedTabs, TopBar, SectionTitle, MetricCard, Page |
| Organisms | `src/app/components/seen/cards.tsx` — CreatorCard, CollectionCard, OpportunityCard, NotificationItem, SaveToggle; `StoryRow.tsx`; `ContentCard.tsx`; `StoryCard.tsx` |
| Async states | `ResourceView.tsx` + `hooks/useResource.ts` |
| Images | `SeenImage.tsx` (deterministic gradient fallback) |

## Layout contracts

- **Column:** every screen is `max-w-[428px] mx-auto px-5` (`Page`, `ScreenFrame`). Wider viewports centre the column; nothing may overflow horizontally (E2E asserts at 320/360/390/430/768/1280).
- **Cards** (fixes the audit's alignment defects):
  1. The card is the only tap target — never wrap a card in another clickable element.
  2. Top-left slot = content type; top-right slot = status (progress, saved, applied). Callers pass `typeLabel` / `badge`; they never overlay their own badges.
  3. Media has a fixed aspect ratio (`4/5` portrait, `16/10` landscape, `3/4` rail, `16/9` collection).
  4. Titles clamp to 2 lines and reserve 2 lines of height where cards sit side-by-side; bylines truncate to 1 line.
  5. Metadata/actions pin to the bottom with `mt-auto`; grids use `auto-rows-fr` so rows share height.
- **Touch targets:** 44×44 px minimum (`IconButton` wraps the 36 px visual in a 44 px hit area; chips/buttons use `min-h-9`/`min-h-11`).

## Colour and contrast

Secondary text is white/55 (≈ #8c8c8c, 6.3:1 on black) — the Figma `text/muted`
level. White/30–45 is no longer used for text (it failed WCAG AA). Status and
domain colours come only from tokens (`seen-success`, `seen-funding`, …).

## Motion

Purposeful only: screen enter (fade/slide 250 ms, `--seen-ease-standard`),
optimistic state flips, skeleton pulse. `prefers-reduced-motion` collapses all
CSS animation/transition durations globally (`seen-tokens.css`) and the Motion
helpers in `utils/motion.ts` already honour it.

## Feedback

Every user action gets feedback within ~100 ms: optimistic UI for follow, save,
checklist and read state; toasts (`sonner`) confirm or explain failures and
never report success before the write succeeds; errors say what to do next.
