# 07 — SEEN design system audit

**SEEN — a Creova product.** Detailed token mapping: `docs/design/DESIGN_TOKEN_MAP.md`; component status: `docs/design/FIGMA_INVENTORY.md`.

## Competing systems found

| System | Where | Used? | Verdict |
|---|---|---|---|
| **SEEN tokens + `components/seen`** | `src/styles/seen-tokens.css`, `src/app/components/seen/*` | ✅ all new and migrated screens; bound 1:1 to Figma `06 — COMPONENTS` variables | **Canonical** |
| shadcn/ui kit | `src/app/components/ui/*` (48 files) | ❌ 0 imports | Retire (P2) after confirming no planned use |
| Bespoke legacy styling | Onboarding cinematic steps, publish wizard, moderation, admin, earnings | ✅ | Restyle onto `components/seen` (P2); keep onboarding's brand moment intentionally |
| Mobile theme | `mobile/src/theme.ts` | ✅ in Expo app | Align tokens if mobile continues (D-03) |
| Archived screens | `archive/` | ❌ | Historical |

## Inventory and drift (measured in `src/app`, excluding `ui/`)

| Category | Canonical | Drift found |
|---|---|---|
| Colours | Token utilities (`bg-seen-elevated`, `text-seen-muted`, status, domain accents) | 7 one-off hex values in 2 files (gradients); `text-white/50` used 42× (passes AA at 5.3:1, but the rule says `/55`) |
| Typography | Inter (live); Figma specifies **Fraunces** headings + Geist Mono metadata | Founder decision D-04. Title/body sizes vary per card component (FB-15) |
| Spacing | Figma space-1…12 (2–96 px), 20 px gutter | Mostly Tailwind defaults; consistent enough |
| Radii | `rounded-seen-sm/md/lg/xl` | Raw `rounded-lg` 73×, `rounded-xl` 41×, `rounded-md` 38×, `rounded-2xl` 17×, plus 3 arbitrary values → normalise |
| Borders | `border-seen-border` `#222226` | `white/5`–`white/15` on cards ≈ 1.2–1.6:1, **below 3:1** for UI component boundaries where the border is the only affordance (FB-07) |
| Elevation | `--seen-elevation-2` | OK |
| Icons | lucide-react | Consistent |
| Buttons, inputs, chips, tabs, nav, modals, drawers, toasts, loaders, skeletons, empty states | `components/seen` (Figma-bound) | Legacy screens still use bespoke buttons |
| Cards | Story Card (portrait/landscape/compact), Creator, Collection, Opportunity | **Three story-card implementations** (`StoryCard`, `ContentCard`, `StoryRow`) with different metadata. Consolidate (FB-15) |
| Breakpoints | Mobile column max 428 px | No tablet/desktop layouts anywhere (Figma or code) |

## Canonical card family proposal (FB-15, FB-04, FB-10)

One `StoryCard` with `variant="portrait|landscape|compact"`. Shared anatomy:

1. Cover (fixed ratio per variant: 3:4, 16:9, 1:1)
2. Type label slot
3. Title (one type style, 2-line clamp)
4. **Creator name** (always)
5. Metadata row: `N min listen` / `N min read` · language · progress
6. Save toggle (separate target, ≥ 44 px)

The border meets 3:1, and the whole card is one tap target (CLAUDE.md rule).

Do not delete `ContentCard`/`StoryRow` until the new variants cover every usage (parity check in the consolidation plan).
