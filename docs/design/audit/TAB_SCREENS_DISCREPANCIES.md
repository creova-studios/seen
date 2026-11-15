# Tab screens: Figma vs code discrepancies

Scope: Explore, Library, Profile (+ Settings Hub, Privacy & security) and Creator profile.
Figma file `8WMBpUhanDkUjodZYolyDT`. Read-only audit; no source edited. Figma canvas coordinates are ignored; only internal structure (gutters, gaps, sizes, type, radii) is compared.

Priority: P1 visible/structural, P2 spacing/type, P3 polish. Risk: whether the fix removes or moves a live feature.

Frames audited (ids use `:`):
- Explore Default `320:27`, Explore Empty Filter `320:103`
- Library Saved `330:2`
- Public Profile `345:2`, Settings Hub `345:57`, Privacy & Security `346:2`
- "creator-profile" `68:182` (see caveat below)

Caveat on `68:182` (creator profile): this frame is a legacy, off-system frame. It uses JetBrains Mono, Instrument Serif and Geist at 8-10px, a 20px gutter, a 56px nav with 9px labels, and a 24px icon nav containing a "Create" tab. None of this matches the SEEN token set (Inter/Fraunces/Geist Mono, 24px gutter, 64px nav). The system-aligned creator profile in Figma is `345:2` "PROFILE / Public Profile", which is a viewer-facing profile with a hero gradient, stats and a story grid. Treat `345:2` as the visual reference for `CreatorProfileScreen`, and treat `68:182` only as a content reference (Published archives, Collaborations & drafts, completion rate). Do not copy its fonts or sizes.

## Global Figma facts verified from the frames

| Item | Figma value (node) |
|---|---|
| Canvas | `--seen-canvas-base #0b0b0c`, plus a `rgba(255,255,255,0.02)` full-frame "grain" overlay (`320:28`, `330:3`, `345:5/369:57`) |
| Gutter | 24px (`left-[24px]`, content width 342 on a 390 frame) |
| Page title | Fraunces Regular 34 / lh 1.16 / tracking -0.5, `SOFT 0, WONK 1` (`320:31`, `345:61`, `346:6`). Library title is Inter **Light** 34 (`330:6`), which is inconsistent within Figma itself |
| Title top | Tab roots: 64px from frame top (status bar 44 + 20). Pushed screens: back chevron at y 57, title at y 92 |
| Section title | Inter SemiBold 20 / 1.3 (`320:48`, `320:64`) |
| Caption | Inter Regular 12 / 1.4 / +0.2 tracking |
| Metadata | Geist Mono 11 / 1.3 / +0.8 tracking, muted `#8b8b94` (`320:68`) |
| Card title | Inter SemiBold 16 / 1.35 (`320:69`) |
| Chip | Inter Medium 13 / 1.2 / +0.2, pad 12 x 8, radius pill, 1px `#222226` border. Active: white fill, `#000` text (`320:36`) |
| Search | h 44, pill, 1px `#222226`, `#121214` fill, 16px Inter placeholder muted, 16px icon (`320:32`) |
| Grid card | Image 164 x 200, radius 12, gap 8 between image/meta/title, grid gap 14 col / 20 row (`320:65`) |
| Bottom nav | 64px, `#121214`, 1px top border, 4 equal columns (97px), 20px icon, gap 4, label Inter Medium 11 / +0.2, **uppercase**, active = white, inactive = muted `#8b8b94` (`320:90`) |
| Settings row | h 56, full width, 1px bottom border `#222226`, 16px label left, 13px muted value right, 5x10 chevron, gap 12, **no card fill, no radius** (`345:63`) |
| Primary / secondary button | h 44, radius 12, Inter SemiBold 13 / tracking 1.6, UPPERCASE (`345:14`, `345:16`) |

---

## 1. Explore tab (`320:27`, `320:103`) vs `ExploreScreen.tsx`

| Element | Figma | Current code | Difference | Required fix | Pri | Risk |
|---|---|---|---|---|---|---|
| Page header | "Explore" Fraunces 34 -0.5 tracking at the gutter, no subtitle (`320:31`) | `h1` `text-2xl font-bold` + subtitle "Discover cultural stories and creators" (ExploreScreen.tsx:113-114) | Wrong family, size (24 vs 34), weight (bold vs regular). Extra subtitle not in Figma | Use `font-seen-display text-[34px] leading-[1.16] tracking-[-0.5px] font-normal`. Keep or drop subtitle by product choice (it is not in Figma) | P1 | None. Presentation only |
| Top app header | None. Figma tab screens have a status bar then the title; no "SEEN by CREOVA / search / bell / profile" bar | `NavigationBar` fixed top bar, 3 icon buttons (NavigationBar.tsx:19-37) | Whole header region is an app-only affordance. Main content starts at `pt-20` (80px) vs Figma title at y 64 | Keep (see section b). Do not remove: it is the only entry to Search and Notifications. Consider aligning `pt-20` after the bar height is measured, not removing it | P3 | Removing it kills search/notification entry points. Do not remove |
| Search field | Under the title, h 44, pill, 16px icon, placeholder "Search stories, creators, cultures" (`320:32`) | `SearchBar` (forms.tsx:98-128) placed *after* the tab switcher, inside Stories only (ExploreScreen.tsx:135-143), placeholder "Search stories, creators, topics..." | Order (Figma: title, search, chips) vs code (title, segmented tabs, search). Placeholder copy differs. Field height depends on `fieldBase` (not verified at 44) | Move search above the tab switcher or make it global to all three tabs; change copy to "cultures"; confirm height is 44 | P2 | Moving it changes tab semantics. `searchQuery` currently only filters Stories, so a global search needs a design decision |
| Filter chips (All / Music / Story / Film / Collections / Archives) | Horizontal chip row, pill, 13/500 (`320:35`) | Not present. A 3-way `SegmentedTabs` (Stories / Creators / Collections) in a rounded-full tray, 10-11px uppercase tracking .14em (primitives.tsx:291-320) | Different component, different taxonomy, different style. Figma chips filter by media type; code tabs switch entity type | Add a type-filter chip row for the Stories tab (`All, Music, Story, Film, ...`) driven by `item.type` / theme. Keep entity tabs (Creators, Collections) as they are live features | P1 | Keep SegmentedTabs. Adding chips is additive. Do not replace tabs |
| Active chip style | White fill, black text, 13/500, +0.2 tracking (`320:36`) | Active tab `bg-white text-black`, 11px uppercase (primitives.tsx:311) | Colour right; size/case/tracking wrong for a chip | If a chip primitive is introduced, use 13px, normal case, +0.2 | P2 | None |
| "Browse by culture" | Section title SemiBold 20 + wrapped chip row (Mi'kmaw, Inuktitut, Anishinaabe, Michif, Acadian, Quebecois, Ukrainian-Canadian) (`320:48`, `320:49`) | Absent | Whole section missing | See section (a) | P1 | None (additive) |
| "Everything" 2-col grid | Title 20/600, then 164 x 200 cards in a 2-col grid, gap 14 x 20; each card: Geist Mono 11 type label below image, 16/600 title (`320:64`, `320:65`) | Curated vertical category list of full-width `ContentCard` (aspect 4/5), each a hero-sized card with overlaid text (ExploreScreen.tsx:211-226; ContentCard.tsx:64) | Fundamental layout difference: full-bleed 4:5 cards (about 342 x 427 each) vs compact 164 x 200 grid. Type label and title sit *below* the image in Figma, *inside the gradient overlay* in code | Add a compact grid card variant (image 164 x 200 r12, mono type label, title) and use it for "Everything" or for category rails. Keep ContentCard for hero/search results | P1 | Replacing curated categories with a flat grid would remove the category structure (Featured, Migration, Indigenous, Documentary). Keep categories; add the grid as an additional or alternate view |
| Section header | Inter SemiBold 20, no subtitle on this frame | `SectionHeader` is already `text-xl font-semibold leading-[1.3]`, subtitle 12px `text-seen-muted` (SectionHeader.tsx:116-121) | Matches. Header has a `mb-4` (16) vs Figma title-to-content 36-40 (title y 400, grid y 440 at 26px text height = about 14) | Fine. No change | n/a | n/a |
| Rail layout | None on Explore in Figma | Horizontal rail only when `category.id === 'new-music'` (ExploreScreen.tsx:195). `getExploreCategories` never emits that id (ids are featured / music-sound / migration / indigenous / documentary, storyService.ts:105-132) | The rail branch is **dead code**; every category renders as a vertical stack of large cards | Either fix the id (`music-sound`) and use the 150 x 200 rail card, or delete the branch. `StoryCard` is 220 wide, not 150 | P2 | Low. Dead branch today |
| Card metadata | Geist Mono 11, +0.8 tracking, muted, label like "STORY·AUDIO" (`320:68`) | Mixed: pill over image, `text-[10px] tracking-[0.14em]` Inter (ContentCard.tsx:79) | Wrong face and scale; sits in an overlay pill, not under the image | Use Geist Mono 11 tracking 0.8 in the compact card; keep `typeLabel` slot (CLAUDE.md forbids overlay badges outside the slots) | P2 | None |
| Empty filter state | Chips row at top; centred 56px icon, 20/600 title "No interactive stories yet", 13px body, secondary 44px "BROWSE ALL STORIES" outline button (`320:113-117`) | Empty state only when *no categories at all* and shows "No Content Available" + "For You" action via `EmptyState` (ExploreScreen.tsx:69-91). No filter-empty state | Missing filter-empty state (depends on the chips above). Copy and CTA label differ | When a chip filter yields zero items, render `EmptyState` with the Figma copy and a "Browse all stories" action resetting the filter | P2 | None |
| Search results | Not in these frames (separate Search frames `322:*`) | In-page results at `searchQuery.length > 2` (ExploreScreen.tsx:146-178) | Not auditable here | n/a (Search frames out of scope) | n/a | Keep |
| Loading / error | Not shown | Explore does not use `useResource`/`ResourceView` (data is sync catalogue). CLAUDE.md rule applies only to async surfaces | n/a | n/a | n/a | n/a |
| Bottom nav | See shared section C | See C | See C | See C | | |

## 2. Library tab (`330:2`) vs `LibraryScreen.tsx`

| Element | Figma | Current code | Difference | Required fix | Pri | Risk |
|---|---|---|---|---|---|---|
| Title | "Your library" Inter **Light** 34 / -0.5 at 64 (`330:6`) | `h1` "Library" `text-2xl font-bold` + subtitle (LibraryScreen.tsx:85-86) | Copy, size, weight, family. Library is the only title in Figma not set in Fraunces; this looks like a design inconsistency (Explore/Profile use Fraunces) | Ask design which is intended. Recommend Fraunces 34 for all tab titles, copy "Your library" | P1 | None |
| Section switcher | Horizontal underline tab row: Saved (active, 24 x 2 white underline), Continue, Following, Collections, Downloads, History; 13/500, gap 18 (`330:7`) | Three stacked "presence indicator" rows (icon with blur glow, 24px light count, caption): In progress / Journeys complete / Saved, each `role="button"` with a 2px left border (LibraryScreen.tsx:96-175) | Different pattern and different tab set. Code rows consume about 3 x 44px of vertical space before any content. Glow blurs (`blur-xl`) and staggered x-animations (0.8s) are not in Figma | Replace with an underline tab row `Saved / Continue / Following / Collections / Downloads / History` as a proper `role="tablist"`. Map Continue = existing In progress; keep Completed reachable (see risk) | P1 | HIGH. The three count rows are live and carry counts the user sees. Do not drop Completed (no Figma tab). Options: add "Completed" as a Continue sub-filter, or keep counts as a stat strip under the tabs |
| Default tab | Saved | `inProgress` (LibraryScreen.tsx:47) | Figma opens on Saved | Decide default (product). Behavioural, do not change silently | P3 | Changes first-load content |
| Content layout | 2-col grid of 164 x 200 cards; Geist Mono type label, 16/600 title, 12 caption "Sylvia Hamilton · 42 min" (`330:21`) | Saved tab uses `StoryRow` list rows (64 x 80 thumb, 14px title, 10px caps meta) (StoryRow.tsx:16-29). Continue/Completed use `ContentCard` landscape 16:10 (LibraryScreen.tsx:213-222) | Row/hero vs grid. Saved items in Figma include non-story types (COLLECTION, FILM) | Use the compact grid card on Saved. Keep StoryRow where a row is wanted (Compact layout exists in Figma 300:12) | P1 | None if additive |
| Card caption | 12px secondary, byline + duration or "3 chapters" / "12 stories" | `ContentCard` creator is 10px caps `text-white/55` over image (ContentCard.tsx:96) | Style and position differ | Part of grid-card work | P2 | None |
| Progress badge | Not shown on Saved. Continue frame `330:55` not audited in detail | `CircularProgress` in top-right badge slot (LibraryScreen.tsx:220) | n/a | Keep | n/a | Keep |
| Remove (trash) button | Not in Figma | Absolute 44px round button over the card, bottom-right (LibraryScreen.tsx:224-231) | **Violates CLAUDE.md rule** ("never overlay ... or wrap cards") in spirit: a second tap target layered on the card. Not in Figma | Move to a card overflow/long-press or a badge-adjacent action slot. Do not delete the capability | P2 | Removing it removes the only way to delete progress. Keep the function |
| Empty states | `331:2` "LIBRARY / Empty · New User" exists; not audited here | `EmptyState` per tab (LibraryScreen.tsx:189-195, 237-243, 276-282) | n/a | Audit `331:2` in a follow-up | P3 | Keep |
| Sync / offline | `331:40` Sync In Progress, `330:111` Downloads Offline | Not present in screen | Missing (see a) | See a | P3 | n/a |
| Page notes / Data | Saved item set | `savedIds` filtered to resolvable stories (LibraryScreen.tsx:50) | Code can only save stories. Figma shows saved collections and film items | Saved collections exist in `api.collections.listSaved()` (used in ProfileScreen.tsx:459). Real data exists | P2 | None |
| Ghost comment | | `{/* Bottom Navigation */}` comment sits above `ConfirmDialog` (LibraryScreen.tsx:288) | Cosmetic | Move/delete comment | P3 | None |

## 3. Profile tab (`345:2`) vs `ProfileScreen.tsx`

Figma `345:2` is a *public* profile with a hero gradient (180px), an 80px avatar overlapping the hero, a Fraunces name, and a stats row. The in-app ProfileScreen is a self-profile dashboard + menu. These are different jobs; the audit compares visual language, and flags missing elements.

| Element | Figma | Current code | Difference | Required fix | Pri | Risk |
|---|---|---|---|---|---|---|
| Hero | 390 x 180 brown-to-black gradient at top (`345:5`) | None; page is flat black under the nav bar | Missing | Optional: add gradient header behind avatar (decorative) | P3 | None |
| Avatar | 80 x 80 circle at left 24, top 140 (overlaps hero) (`345:9`) | 80 x 80 initials circle with `border-2 border-white/10 bg-white/5` (ProfileScreen.tsx:95-99). Size matches | Size matches; no hero overlap; initials glyph 24px light | Keep. Style tweaks only | P3 | None |
| Name | Fraunces 34 / -0.5 (`345:10`) | `h1` `text-xl font-bold` (20px bold) (ProfileScreen.tsx:103) | Family, size 20 vs 34, weight | Fraunces 34 regular. Long names need wrapping, since Figma uses `whitespace-nowrap` (unsafe for user-entered names): use `break-words` and a 2-line clamp | P1 | None |
| Meta line | "Filmmaker · Halifax · joined 2024", Inter 12 muted (`345:11`) | Email (`text-sm text-white/60`) and "Member since {Month Year}" (`text-xs text-white/55`) (ProfileScreen.tsx:108-109) | Code shows email (private) where Figma shows role/location. Code has no role/location data | Keep join date (real). Do not invent role/city; they have no data source | P3 | None |
| Bio | Inter 13 / 1.5 secondary, 342 wide (`345:12`) | `text-sm` 14 `text-white/80`, honest "No bio yet." italic (ProfileScreen.tsx:114-118) | Size 14 vs 13; empty copy is correct for no bio feature | Keep behaviour; set 13px/1.5 secondary | P2 | None |
| Action buttons | Two 44px buttons side by side, gap 10: "EDIT PROFILE" outline `#2e2e33` border r12 and "CREATOR STUDIO" white fill; Inter SemiBold 13 tracking 1.6 UPPERCASE (`345:13-17`) | One full-width button, `py-3 rounded-xl bg-white/5 border-white/10`, icon + "Edit Profile", sentence case 14px (ProfileScreen.tsx:121-127). Opens `onOpenSettings` | Style, case, tracking, border colour; no second CTA. "Edit profile" opens Settings (there is no dedicated edit screen) | Restyle to the Figma Button; add "Creator Studio" only for creators (code already has a Creator Dashboard card, ProfileScreen.tsx:222-254) | P1 | Do not drop the creator card or the "Start Creating" invite (viewer path) |
| Stats row | 4 stats: Stories 6, Followers 1.2K, Following 48, Collections 3; value 20/600, label 12 muted, gap 24, left-aligned (`345:18`) | 2 `StatCard`s in a grid: "Stories Completed", "Minutes Listened", boxed `bg-white/5 border rounded-xl` (ProfileScreen.tsx:137-140, 445-451) | Different metrics, different treatment (boxed cards vs plain text). Code comment says no follow graph exists, so Followers is intentionally absent | Keep real stats. Restyle to the plain 20/600 + 12 caption layout. "Following" and "Collections" counts exist via `api.creators.listFollowing()` / `api.collections.listSaved()` (already fetched in YourSeenSection) and can be shown. **Followers has no data**: do not show | P1 | None |
| Content tabs | Underline tabs Stories / Collections / Appreciated, 13/500, active underline 20 x 2 (`345:31`) | No tabs; vertical sections instead | Missing | See a (Appreciated has no data) | P2 | Additive |
| Story grid | 4 tiles 164 x 164, r12, gap 14 (`345:39`) | `My Stories` rows for creators (ProfileScreen.tsx:257-280); viewers see none | Different | Only for creators. Reuse grid card | P3 | None |
| Menu sections ("Your SEEN", Creator Tools, Preferences, Community) | Not in this frame (these live in Settings Hub `345:57`) | Eyebrow headings `text-sm tracking-wider uppercase text-white/55` and `ListItem` cards | Settings Hub rows are borderless 56px rows, not carded | See Settings below | P2 | Keep every entry |
| Section heading style | Section titles are 20/600 (not uppercase eyebrows) | `text-sm tracking-wider uppercase` (ProfileScreen.tsx:166,264,317,351,397,467) | Contradicts the semibold-20 section header already adopted in `SectionHeader` | Use `SectionHeader`/20 semibold or keep eyebrows by decision; flag inconsistency | P2 | None |
| Sign out | Separate "Logout Confirmation" frame `346:154` (not audited) | Immediate `signOut()` + `window.location.reload()` with no confirm (ProfileScreen.tsx:20-29, 424-430) | Figma has a confirmation step; code has none | Add a ConfirmDialog (component exists in `seen/overlays`) | P2 | Behavioural: adds a step to sign out |
| Footer | None | "SEEN v1.0.0 - Made with (heart emoji) by CREOVA" (ProfileScreen.tsx:435) | Not in Figma. Hard-coded version string; emoji | Keep or move to About | P3 | None |
| Dev block | | Empty `process.env.NODE_ENV === 'development'` section (ProfileScreen.tsx:147-156) | Dead code | Remove in a code-cleanup pass | P3 | None |
| Duplicate "Creator Tools" + "Creator Dashboard" card | | Creators see both a Tools list (ProfileScreen.tsx:172-193) and a dashboard card (223-254) with overlapping destinations | Redundant | Consolidate later | P3 | Do not remove without product sign-off |

### 3b. Settings Hub (`345:57`) vs Profile "Preferences/Community" rows and `ProfilePreferencesScreen`

| Element | Figma | Current code | Difference | Fix | Pri | Risk |
|---|---|---|---|---|---|---|
| Row | h 56, borderless, 1px bottom divider, 16px label, 13px muted value, 5 x 10 chevron, gap 12, full 342 width (`345:63`) | `ListItem`: `min-h-14` (56) card with `rounded-seen-md border bg-seen-surface`, 14px label, 14px value `text-white/60`, lucide ChevronRight 16px, `px-4` (display.tsx:49-73) | Height matches. Card chrome (fill, border, radius, padding) is not in Figma; label 14 vs 16; value 14 vs 13 | Add a `variant="plain"` to `ListItem` (divider only, 16/13). Used app-wide so do as a variant | P2 | Do not change the default: Settings/Privacy/Account screens share it |
| Group sub-headers | Rows with muted "header" value (Account, Experience, Privacy & safety, Money) look like unfinished placeholder text ("header") | Eyebrow headings | **Figma placeholder bug**: the literal value "header" is a leftover text layer. Do not ship it | Use plain group labels (13 muted) not rows | P3 | None |
| Back affordance | Chevron at x 28 / y 57 (vector) and a legacy `BackButton` (JetBrains Mono "<- Back", `248:68`) at the same place | `TopBar` with `IconButton` back arrow + 16px semibold title, sticky (primitives.tsx:325-336) | Figma has the page title as Fraunces 34 **below** the back chevron (y 92), not a centred 16px bar title. The legacy BackButton is a stale instance (JetBrains Mono) and conflicts with the chevron | Follow the chevron + Fraunces 34 title pattern for pushed screens; ignore the `248:68` instance | P1 | Touches all pushed screens that use `TopBar`; do as a variant |
| Content coverage | Account, Edit profile, Email & password, Connected accounts, Language, Content preferences, Accessibility, Notifications, Downloads, Privacy & safety, Privacy, Blocked accounts, Data controls, Subscriptions, Billing | Code Settings = `ProfilePreferencesScreen` + `AccountPrivacyScreen` (toggles, data export, sign out). Profile has Language, Intent, Accessibility, Settings, Subscriptions & Billing | Several Figma rows have no screen (Connected accounts, Content preferences, Blocked accounts, Downloads) | See a | P2 | Additive |

### 3c. Privacy & security (`346:2`) vs `AccountPrivacyScreen.tsx`

| Element | Figma | Current code | Difference | Fix | Pri | Risk |
|---|---|---|---|---|---|---|
| Page structure | Back chevron, Fraunces 34 "Privacy & security", then 11 plain 56px rows grouped Profile / Security / Contact | `ScreenFrame`/TopBar + `Toggle` and `ListItem` (AccountPrivacyScreen.tsx:119-165) | Figma uses "row -> detail" navigation; code uses inline toggles | Keep inline toggles (better UX; no extra screens) but restyle rows | P2 | None |
| Rows with no code counterpart | Profile visibility, Show what I'm listening to, Let people see my collections, Appear in "voices to discover", Two-factor authentication, Active sessions, Sign out everywhere, Who can message me, Who can @mention me | Not implemented (no social graph, no messaging, no 2FA) | Missing | Do **not** add: no backend. Messaging/@mention imply features that do not exist | n/a | Adding them would be dead controls (CLAUDE.md "no dead buttons") |
| Rows with a counterpart | Data controls | `exportData` and `signout` list items (AccountPrivacyScreen.tsx:164-165) | Partial | Keep | P3 | Keep |

## 4. Creator profile (`68:182` and `345:2`) vs `CreatorProfileScreen.tsx`

| Element | Figma | Current code | Difference | Fix | Pri | Risk |
|---|---|---|---|---|---|---|
| Layout alignment | `345:2`: left-aligned: hero, avatar 80, name left, stats row, tabs, grid | Centre-aligned column, `Avatar size="lg"`, name 24 light, bio centred, language badges, centred Follow button (CreatorProfileScreen.tsx:54-73) | Centred vs left-aligned | Move to left-aligned layout per `345:2` | P1 | None |
| Name | Fraunces 34 | `text-2xl font-light` | Family/size | Fraunces 34 | P1 | None |
| Follow button | Not on `345:2` (own profile). `68:182` has only EDIT PROFILE | Primary/secondary toggle with optimistic update + rollback + toast (CreatorProfileScreen.tsx:32-47, 63-72) | Not in Figma but required (viewing someone else) | Keep. Use the Figma Button style (13/600, tracking 1.6, UPPERCASE, h 44, r12) | P2 | Keep. Live feature |
| Stats | Stories / Followers / Following / Collections (`345:19`); `68:182` Stories / Listeners / Completion rate | "Stories" section subtitle only: `${storyIds.length} published` | Missing stat row | Add Stories count (real). Followers/Listeners/Completion have **no data** (Creator contract has no counts, creators.ts:2-10) | P2 | None |
| Story list | 164 square grid (`345:39`); `68:182` 90px tiles with 8px radius, 2-col | `StoryRow` list (compact rows) | Row vs grid | Keep rows or move to grid card (see Explore). Low risk either way | P3 | None |
| Themes | Not in Figma | `Badge tone="purple"` chip list (CreatorProfileScreen.tsx:77-83) | Not in Figma | Keep | n/a | Keep |
| Languages | Not in Figma | `Badge` list from `creator.languages` | Not in Figma; important for a multilingual product | Keep | n/a | Keep |
| Report | Not in Figma | `ReportContentSheet` + ghost button (CreatorProfileScreen.tsx:93-98) | Safety feature, not in Figma | Keep | n/a | Keep |
| Collaborations & drafts, published archives | `68:182` only | None | Creator-owner features | Out of scope for the public view | P3 | n/a |
| Header | Back chevron + no bar title | `ScreenFrame` TopBar with creator name (ScreenFrame.tsx:6-19) | Same as 3b | Same fix as 3b | P2 | Shared |
| Section titles | 20/600 | `SectionTitle` is `text-xl font-light` (primitives.tsx:346) | **Weight conflict**: `SectionTitle` is Light while `SectionHeader` was moved to semibold | Make `SectionTitle` `font-semibold leading-[1.3]` | P1 | Used in many screens; visual-only |

---

## (a) Elements in Figma with no counterpart in the app

| Element | Frame | Real data exists? | Note |
|---|---|---|---|
| Media-type chip row (All, Music, Story, Film, Collections, Archives) | `320:35` | Partly: `ContentItem.type` exists (storyService.ts:36-42 sets `'story'` for everything), so only Story is distinguishable today. Themes exist (`getStoriesByTheme`) | Filter by **theme** instead, or by `type` once more types exist |
| Browse by culture chips (Mi'kmaw, Inuktitut, Anishinaabe, Michif, Acadian, Quebecois, Ukrainian-Canadian) | `320:48` | Not verified as a catalogue field. Themes include "Indigenous", "Migration" only. Do not hard-code the Figma names | Derive from real tags or leave out |
| 2-col compact grid card (164 x 200) with mono label + title | `320:65`, `330:21` | UI only | Build `GridCard` using `typeLabel`/`badge` slots |
| Library tabs: Following, Collections, Downloads, History | `330:7` | Following: yes (`api.creators.listFollowing`). Collections: yes (`api.collections.listSaved`). Downloads: an `offline` services folder exists (not verified for UI). History: progress snapshots exist | Add one at a time only when wired (no dead tabs) |
| Library Sync / offline / downloads UI | `331:40`, `330:111` | Unverified | Follow-up |
| Hero gradient behind avatar | `345:5` | n/a (decorative) | Optional |
| Followers count | `345:23` | **No** | Do not show a number |
| "Appreciated" tab | `345:37` | **No** | Skip |
| Role/location line ("Filmmaker . Halifax") | `345:11` | **No** | Skip |
| Creator Studio button | `345:16` | Yes: `onOpenCreatorDashboard` | Creators only |
| Connected accounts, Content preferences ("3 muted topics"), Blocked accounts, Email & password, Billing "Visa 4242" | `345:74-145` | **No** (no backend) | Do not add placeholders. Sample values in Figma (sylvia@africvillemuseum.ca, Visa 4242) must never ship |
| Privacy toggles: messaging, @mention, visible listening, voices to discover, 2FA, sessions | `346:*` | **No** | See 3c |
| Logout confirmation | `346:154` | Component exists (`ConfirmDialog`) | Wire it |
| Status bar ("9:41") | all | n/a | Mockup chrome; never implement |
| Film grain overlay `rgba(255,255,255,.02)` | all | n/a | Optional |

## (b) Elements in the app, not in Figma (preserve)

- `NavigationBar` with Search, Notifications (unread badge) and Profile shortcuts (NavigationBar.tsx). Only entry points to Search/Notifications.
- Explore Creators and Collections tabs (`CreatorsPanel`, `CollectionsPanel`), plus `initialTab` deep link from Profile "Following" (ProfileScreen.tsx:469).
- Search-as-you-type results in Explore (ExploreScreen.tsx:146-178) and language chip text on cards (`languageChipText`).
- Library: progress badge (`CircularProgress`), Completed tab, delete-from-progress with confirm + toast (LibraryScreen.tsx:289-300).
- Profile: "Your SEEN" block (Following, Saved collections, Funding tracker, Notifications) using `useResource`; role-gated Creator/Moderation/Admin tools; Creator dashboard card; My Stories; viewer "Share your story" invite; Recent Activity; Language / Intent / Accessibility rows; Community & About; honest "No bio yet" and real stats.
- Creator profile: Follow with optimistic rollback, theme and language badges, Report sheet.
- Settings/privacy: data export, sign out, notification preference toggles (AccountPrivacyScreen).

## (c) Shared-component issues affecting several screens

| # | Component | Figma | Code | Impact | Fix | Pri | Risk |
|---|---|---|---|---|---|---|---|
| C1 | Tab page titles | Fraunces 34 / 1.16 / -0.5 | Each screen inlines `text-2xl font-bold` (ExploreScreen.tsx:113, LibraryScreen.tsx:85, ProfileScreen.tsx:103); Fraunces used only in `ForYouSections.tsx:41` | Explore, Library, Profile, Creator, Settings, Privacy all wrong | Add one `PageTitle` primitive (font-seen-display 34) and use it everywhere | P1 | Visual only. Long translations (FR/ES) may wrap; allow 2 lines |
| C2 | `BottomNav` | 64px, `#121214` fill, 11px / +0.2 tracking labels, active white / inactive `#8b8b94`, 20px icon, gap 4 | `h-seen-nav` (64) OK; `bg-black/80 backdrop-blur-xl border-white/5`; label `tracking-[0.02em]` (about 0.22px at 11px; OK); inactive `text-white/55` (about #8b8b8b on black, matches muted); icons are lucide with `strokeWidth` 1.5/2 (BottomNav.tsx:18-37) | Fill and border colour differ (translucent black/5% vs `#121214`/`#222226`). Labels are uppercase in both. Icon set differs (Home, Compass, Library, User vs Figma Ellipse placeholders: unknowable) | Switch to `bg-seen-surface border-seen-border`; drop blur if exact match wanted | P2 | Visual only. Keep `pb-[env(safe-area-inset-bottom)]` |
| C3 | `SectionTitle` vs `SectionHeader` | Both are Inter SemiBold 20 | `SectionHeader` semibold (SectionHeader.tsx:116); `SectionTitle` `font-light` (primitives.tsx:346) | Inconsistent across screens | Make `SectionTitle` semibold 20/1.3, `text-white/55` to `text-seen-muted` for subtitle | P1 | Visual |
| C4 | `ListItem` | Borderless 56px row, 16/13 | Carded, 14/14 (display.tsx:49-73) | Settings, Profile, Account, Privacy | Add `variant="plain"` | P2 | Shared by many screens; default must not change |
| C5 | `ContentCard` | Used as hero card only; compact grid card missing | 4:5 or 16:10 with overlay text; `typeLabel` 10px Inter pill | Explore, Library, Search | Add `GridCard` (164 x 200, r12, label/title below) rather than altering ContentCard | P1 | Additive |
| C6 | `StoryCard` rail | 150 x 200 (or 240 x 140) | `w-[220px] aspect-[3/4]` (StoryCard.tsx:169-171) | Rail users (For You owner, Explore dead branch) | Parameterise to 150 x 200; coordinate with the For You owner before changing | P2 | Another process owns For You; do not edit unilaterally |
| C7 | `SegmentedTabs` | Chips (13/500 normal case) and underline tabs (13/500, 2px) | Pill tray, 10-11px uppercase tracking .14em (primitives.tsx:291-320) | Explore, any screen with tabs | Add `UnderlineTabs` and `Chip` primitives; keep SegmentedTabs | P1 | Additive |
| C8 | `SearchBar` | h 44, 16px text, 16px icon | Needs verification of `fieldBase` height and font size (forms.tsx) | Explore, Search | Verify 44px and 16px (also avoids iOS zoom) | P2 | None |
| C9 | `TopBar` for pushed screens | Chevron at y 57 + Fraunces 34 title below | Sticky 56px bar with 16px semibold title (primitives.tsx:325-336) | Settings, Privacy, Creator profile, and all `ScreenFrame` users | Add large-title variant | P2 | Shared by many screens. Variant only |
| C10 | Canvas colour | `#0b0b0c` base, `#121214` surface | `bg-black` everywhere; `--seen-canvas: #000000` (seen-tokens.css:12); `--seen-text-on-brand: #0b0b0c` | Whole app slightly darker than Figma | Set `--seen-canvas` to `#0b0b0c` and replace `bg-black` with `bg-seen-canvas` per screen. Check AA contrast and PWA/theme colour | P2 | Global visual shift; test every screen/e2e axe |
| C11 | Gutter | 24px | `--seen-gutter` 20px, 24px at >= 360px (seen-tokens.css:69,88) | Matches | None | n/a | n/a |
| C12 | Top offset | Title at 64px from the frame top | `pt-20` (80px) + a 3-line NavigationBar (about 56-64px, `pt-[max(.75rem, safe-area)]`) in the flow (ExploreScreen.tsx:105) | The title starts below the fixed bar, so there is no 1:1 mapping. Use the measured bar height instead of a magic 80 | Replace `pt-20` with a `--seen-header-height` token | P3 | None |
| C13 | Muted text | `#8b8b94` | `text-white/55` and `text-seen-muted` (#8b8b94) mixed; 4 spellings (`text-white/50` at SectionHeader.tsx:131, StatCard ProfileScreen.tsx:449, `text-white/60`, `text-white/70`) | CLAUDE.md says secondary text is `text-white/55` or `text-seen-muted`. `text-white/50` and `/60` slip through (AA risk for `/50`) | Replace `/50` with `/55`; unify | P2 | Contrast only improves |
| C14 | Grain overlay | `rgba(255,255,255,.02)` | None | Subtle | Skip | P3 | None |
| C15 | Placeholder content in Figma | "header" literal, sample emails, Visa 4242, "Sylvia Hamilton", "Africville" | n/a | Real names/orgs in Figma (Sylvia Hamilton, Africville Museum) must not be copied into demo data as partners (CLAUDE.md) | Do not import | P1 | Policy |
