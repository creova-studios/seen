# Design token map — Figma variable → CSS → Tailwind

Source: `get_variable_defs` on node `294:2`. Values are identical to Figma.

| Figma variable | CSS custom property | Tailwind utility | Value |
|---|---|---|---|
| canvas/black | `--seen-canvas` | `bg-seen-canvas` | #000000 |
| surface/base | `--seen-surface-base` | `bg-seen-surface` | #121214 |
| surface/elevated | `--seen-surface-elevated` | `bg-seen-elevated` | #1a1a1d |
| border/default | `--seen-border-default` | `border-seen-border` | #222226 |
| border/focus | `--seen-border-focus` | `border-seen-focus` | #ffffff4d |
| text/primary | `--seen-text-primary` | `text-seen-text` | #ffffff |
| text/secondary | `--seen-text-secondary` | `text-seen-secondary` | #a1a1aa |
| text/muted | `--seen-text-muted` | `text-seen-muted` | #8b8b94 |
| text/on-brand | `--seen-text-on-brand` | — | #0b0b0c |
| brand/primary | `--seen-brand-primary` | `bg-white` (Button primary) | #ffffff |
| brand/on-primary | `--seen-brand-on-primary` | `text-black` | #000000 |
| brand/secondary | `--seen-brand-secondary` | — | #c9c9ce |
| brand/accent | `--seen-brand-accent` | `text-seen-accent` | #c084fc |
| status/success | `--seen-status-success` | `text-seen-success` | #20c997 |
| status/warning | `--seen-status-warning` | `text-seen-warning` | #f5a623 |
| status/error | `--seen-status-error` | `bg-seen-error` | #e5484d |
| status/info | `--seen-status-info` | `text-seen-info` | #60a5fa |
| domain/editorial | `--seen-domain-editorial` | `text-seen-editorial` | #ffe29e |
| domain/funding | `--seen-domain-funding` | `text-seen-funding` | #ffd166 |
| domain/creator | `--seen-domain-creator` | `text-seen-creator` | #c084fc |
| domain/institutional | `--seen-domain-institutional` | `text-seen-institutional` | #60a5fa |
| media/story | `--seen-media-story` | `text-seen-story` | #fbbf24 |
| space-1 … space-12 | `--seen-space-1 … 12` | Tailwind spacing (4 px grid) | 2, 4, 8, 12, 16, 20, 24, 32, 40, 56, 96 px |
| radius-xs / sm / md / lg / xl / pill | `--seen-radius-*` | `rounded-seen-sm/md/lg/xl`, `rounded-full` | 4, 8, 12, 16, 24, 999 |
| border-hairline / strong | — | `border` / `border-2` | 1 / 2 px |
| SEEN/Elevation 2 | `--seen-elevation-2` | — | 0 8 24 rgba(0,0,0,.45) |

## Typography

| Figma style | Figma spec | Code today | Note |
|---|---|---|---|
| Heading 1 | Fraunces 34/1.16, −0.5 | Inter light 36–40 (`text-4xl font-light`) | Live language kept; Fraunces is a proposal to test |
| Heading 2 | Fraunces 26/1.22 | Inter light 24–30 | same |
| Heading 3 | Inter SemiBold 20/1.3 | `text-xl` | ✅ |
| Subheading | Inter SemiBold 16/1.35 | `text-base font-semibold` | ✅ |
| Body | Inter 16/1.55 | `text-base leading-relaxed` | ✅ |
| Body small | Inter 13/1.5 | `text-sm` (14) | ≈ |
| Label | Inter Medium 13, +0.2 | `text-[11–13px] uppercase tracking` | ✅ |
| Button | Inter SemiBold 13, +1.6 | `Button` (13 px, tracking 0.12em, uppercase) | ✅ |
| Caption | Inter 12/1.4 | `text-xs` | ✅ |
| Metadata | Geist Mono 11, +0.8 | Inter 10 px uppercase, tracking 0.14em | Live language kept |

## Layout tokens (code-only)

`--seen-content-max: 428px` · `--seen-gutter: 20px` · `--seen-touch-min: 44px` · `--seen-duration-fast/base` · `--seen-ease-standard`.
