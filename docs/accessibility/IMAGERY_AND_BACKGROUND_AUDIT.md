# Imagery and background audit

Scope: every place a photo or image-like background sits behind or beside text and controls, plus art direction for BIPOC storytelling imagery. Read-only code audit; no source was changed.

Limits of this audit. The sandbox proxy blocks images.unsplash.com (HTTP 403), so none of the 13 stock photos could be viewed. "Depicts" below is inferred from the story each is attached to and is unverified. Contrast figures are computed from the Tailwind classes against a worst-case pure white photo (the same worst case the e2e test uses), not measured in a browser. I did not run the e2e suite.

Severity: P0 = small, safe to implement in code now. P1 = needs design or content work. P2 = polish or process.

---

## 1. Inventory

### 1.1 Image sources

All story imagery is remote. There is no first-party image asset, no creator photo, no onboarding image and no notification image anywhere in `src/`.

| Source | Where | Notes |
|---|---|---|
| `coverImage` Unsplash URL (12 stories) | `src/app/data/storyDatabase.ts` | Flows to `mediaSource` (`storyService.ts:46`, `searchService.ts:106,155`) then every card, hero, row, player, collection banner and reader background. |
| Chapter image (1 only) | `storyDatabase.ts:337` (`voices-ch1`) | Reuses the same photo as `home-no-fixed-address`. Has no `imageAlt` or `imageDecorative`. |
| Create-flow fallback cover | `src/app/data/userStoriesService.ts:143` | Stock photo `1487956382158` is applied to any user story with no chapter image. |
| Creator-pasted URL | `creator-flow/MediaChaptersStep.tsx:331-332` | `window.prompt('Paste an image URL')`. Arbitrary hotlinked image; no consent, credit or licence field. |
| Avatars | `seen/primitives.tsx:176-187` | `Avatar` supports `src` but no caller passes it. Every avatar is initials on a dark circle. |

Distinct covers (all `?w=800&h=1200&fit=crop`; unverified, inferred from story):

| Photo id | Story (themes) | Likely depicts / concern |
|---|---|---|
| 1511192336575 | Midnight Resonance (Montreal jazz) | Probably a music or stage scene. Plausible but unconfirmed that it is Montreal or Black jazz. |
| 1488646953014 | Voices of Migration (five immigrant families) | Probably a portrait or travel image. Not the families in the story. |
| 1506905925346 | Words That Remember (Indigenous languages) | Probably landscape. A generic landscape standing in for Indigenous language communities is a representation risk. |
| 1519389950473 | Seen / Unseen (visibility in public space) | Probably urban or street scene. |
| 1455390582262 | Letters Never Sent | Probably paper, letters or writing. Fits the metaphor. |
| 1522202176988 | Soft Power (culture, diaspora) | Probably people or a group. Likely generic diversity-style stock. |
| 1464207687429 | Home (No Fixed Address) cover, and Voices ch1 image | Used twice for unrelated stories. |
| 1531206715517 | The First Generation | Probably a portrait. Not a real first-generation person from the story. |
| 1505142468610 | Black Atlantic Canada | Probably ocean or coast. Doesn't depict Black Maritime communities. |
| 1518837695005 | What We Carry (intergenerational trauma) | Unverified. |
| 1533158326339 | Small Histories (archival vignettes) | Unverified. |
| 1553877522 | Work / Worth | Unverified. |
| 1487956382158 | Create-flow default cover | Unverified. Same image for every untitled user story. |

Finding I1 (P1): every cover is generic Unsplash stock chosen by theme, not made for or by the story's community. Landscape and portrait stand-ins for Indigenous, Black Atlantic and migrant stories read as placeholder and risk the "generic diversity stock" look. One photo is reused for two stories. No photographer credit, licence or consent is stored on `StoryWorld` (`storyDatabase.ts` interface, around lines 79-90).

### 1.2 Surface by surface

| Surface | File:line | Image | Alt | Contrast guarantee | Focus over image | Load failure |
|---|---|---|---|---|---|---|
| Hero (FeaturedHero) | `ForYouSections.tsx:35-50` | `mediaSource` cover | `alt=""` decorative; title is text | Top `from-black/80` 150px (`:37`). Bottom 340px fade to opaque `seen-canvas` (`:38`); text sits on near-solid canvas. | The one control, "Experience", sits on the solid part. White 2px outline is visible. | Dark gradient fallback; text unaffected. Image is `loading="lazy"` even though it is the LCP element. |
| RailCard | `ForYouSections.tsx:66-73` | cover | decorative | No text on the image. Text is below on canvas. | Whole card is the button. Outline visible on canvas. Rail clips top outline (see P0-5). | Gradient tile |
| StoryCard | `StoryCard.tsx:32-46` | cover | `alt={title}` but `decorative` so output is `""` | `from-black/70 via-transparent to-transparent` (`:40`): bottom only. Type pill at top-left (`:42`) is `bg-black/40`, `text-white/90`, 10px. Text below the image on canvas. | Outline on canvas | Gradient tile |
| ContentCard | `ContentCard.tsx:66-108` | cover | decorative | `from-black via-black/50 to-black/10` (`:74`). Title block at bottom is on near-black: pass. Top pills (`:79`, `:87`, `:91`) sit on only 10% black. | Outline outside card; hover-only play disc also shows on `group-focus-visible` (`:103`) | Gradient tile; text still readable |
| CollectionCard | `seen/cards.tsx:60-86` | cover of `coverStoryId` | decorative | `from-black/80 to-transparent` (`:69`): bottom only. Badge at top (`:71`) is `text-white/70 bg-white/5` (primitives `:142`), no scrim behind it. Saved icon (`:76`) is also unprotected. | border + global outline | Gradient tile |
| StoryRow thumbnail | `seen/StoryRow.tsx:17-19` | cover | decorative, title adjacent | No text on image | global outline | Gradient tile |
| Story preview | `FeaturedStoryPreview.tsx:108-164` | cover full-bleed | decorative | `from-black/80 via-transparent to-black` (`:111`). Four 44px circle controls at top have `bg-black/40` over the 80% region: pass. Centre play disc is `aria-hidden`, `tabIndex -1`. Middle of the photo has no scrim, but nothing sits there except the disc. | Controls over black/80 top; 2px white outline visible | Gradient tile; controls remain |
| Reader background | `StoryChapterScreen.tsx:274-283` | chapter image else cover | Informative only if `imageAlt` set and not `imageDecorative`; otherwise `""` | `from-black/70 via-black/40 to-black` (`:282`). Mid-screen is 40% black only, and reader body text can sit there. | Controls auto-hide; when shown they are over black/70 top | Gradient tile |
| Collection detail banner | `screens/CollectionDetailScreen.tsx:52-62` | cover | decorative | `from-black via-black/50 to-transparent` (`:54`). Title and badge sit at the bottom on near-black: pass. | Back button is in `ScreenFrame`, not over the image | Gradient tile |
| Context card | `ContextCardModal.tsx:65-68` | card image | `alt=title`, `decorative` so `""` | `to-black/80`, no text on image | Close button is below image | Gradient tile |
| Mini and expanded player | `seen/MediaPlayerBar.tsx:45,81` | cover | decorative | No text on image | Outline on dark | Gradient tile |
| Avatars and creator profile | `primitives.tsx:176`, `CreatorProfileScreen.tsx:55`, `cards.tsx:33`, `ForYouSections.tsx:93` | None (initials) | `aria-hidden`; name is in adjacent text | Solid `bg-seen-elevated`: pass | n/a | n/a |
| Explore, Library, Search, For You lists | `ExploreScreen.tsx:172+`, `LibraryScreen.tsx:258,306`, `SearchScreen.tsx:165`, `ForYouScreen.tsx:176-280` | `ContentCard`, `RailCard` | as above | as above | as above | as above |
| Onboarding, language, notifications | `OnboardingSystem.tsx`, `OnboardingOrientation.tsx:32`, `NotificationsScreen.tsx` | No images. Only a `from-black via-black` footer fade under sticky buttons. | n/a | pass | n/a | n/a |
| Create Story cover | `creator-flow/MediaChaptersStep.tsx:331-338, 358-385`; `userStoriesService.ts:143` | There is no cover field. Cover is chapter 1's image, else a stock photo. | Per chapter: required description textarea (`:365`) or "decorative" checkbox (`:381`); blocks Continue (`:113-115`) | n/a | n/a | n/a |
| Moderation | `ModerationGovernanceSystem.tsx:306` | `<img alt="Response">` of user content | Non-descriptive | none | n/a | No fallback. Uses raw `<img>`, not `SeenImage`. |
| `figma/ImageWithFallback.tsx` | whole file | Shim | `alt="Error loading image"` on failure | n/a | n/a | Not used by any listed surface |

### 1.3 Fallback behaviour (`seen/SeenImage.tsx`)

- On error or missing `src` it renders a deterministic dark gradient (6 palettes, hashed from `seed`) with `data-testid="image-fallback"` (`:38-49`). Non-decorative: `role="img"` + `aria-label`. Decorative: `aria-hidden`. Good.
- `failed` is `useState(!src)` and never resets (`:36`). If the same component instance later receives a new `src` (reader chapter change, list reuse) it stays on the fallback after one failure.
- The tile has no title, monogram or text, so a failed cover on a story with no adjacent text (reader background, preview) is just a dark gradient. Acceptable for contrast, weak for identity.
- No loading placeholder (the parent is `bg-seen-canvas`/transparent until decode), no `width`/`height`, so layout relies on the parent aspect ratio. All parents set one: pass.

---

## 2. What already passes

- Global focus indicator: 2px `rgba(255,255,255,.7)` outline, 2px offset, on every `button, a, input, [tabindex]` (`src/styles/seen-tokens.css:126`).
- Hero: two scrims (`ForYouSections.tsx:37-38`); title block is on near-solid `seen-canvas`, so the text contrast does not depend on the photo.
- ContentCard and CollectionDetail banners: bottom text sits on `from-black` (effectively solid black behind the text).
- FeaturedStoryPreview: `from-black/80` at the top behind the four circle controls, `to-black` at the bottom behind the CTA.
- Reader: `from-black/70 via-black/40 to-black`, and chapter images have an author-supplied description or decorative flag that is respected (`StoryChapterScreen.tsx:277-278`).
- Alt policy: all card and banner covers are decorative with the title in adjacent real text; no duplicate announcements. Cards are single tap targets with no overlay badges outside the type/badge slots.
- Create flow requires a description or an explicit "decorative" tick per chapter image, with `aria-invalid`, `role="alert"` and a 250-character cap (`MediaChaptersStep.tsx:113-115, 357-390`).
- Avatars are aria-hidden with the name in adjacent text; initials sit on a solid background.
- Automated test `e2e/audit/manual-a11y.spec.ts:172-251`: routes every `images.unsplash.com` request to a pure white SVG (worst case for light text), hides all text colour, screenshots the backdrop, and takes the lightest 5% / darkest 5% of pixels behind each text node. It asserts 4.5:1 (3:1 for large text) on `for-you`, `explore`, `library`, `story/midnight-resonance`, `creator/kira-chen`, `collections` at 390px, and writes `test-results/manual-a11y-image-contrast.json`. Its blind spots: first 40 text nodes per route only (`:214`), viewport only, only pure white (no mid-tone or busy images), static state (no hover), and only elements with a direct text node. Conditions under which it would not flag the items in section 3 should be checked by running it; I have not.

---

## 3. Findings and recommendations

### P0 (small, safe, implement now)

**P0-1. Type pills and badges on image tops have no scrim (contrast).**
Computed against a white photo:
- `StoryCard.tsx:42`: `bg-black/40` over no top scrim gives about 2.6:1 for white/90 10px text.
- `ContentCard.tsx:79`: `bg-black/40` over black/10 gives about 3.1:1.
- `ContentCard.tsx:87`: `bg-white/10` with white text gives about 1.2:1 on a white photo.
- `cards.tsx:71`: `Badge` surface `text-white/70 bg-white/5` gives about 1.3:1 on a white photo.

Change:
- `StoryCard.tsx:42` and `ContentCard.tsx:79`: `bg-black/40` becomes `bg-black/60`, `text-white/90` becomes `text-white` (about 5.7:1 and 6.7:1 on white).
- `ContentCard.tsx:87`: `bg-white/10` becomes `bg-black/60`.
- `cards.tsx:69`: `bg-gradient-to-t from-black/80 to-transparent` becomes `bg-gradient-to-t from-black/80 via-transparent to-black/70` (about 5:1 for the badge and saved icon at the top).

**P0-2. `SeenImage` never leaves the fallback when `src` changes.**
`seen/SeenImage.tsx:36`: add `useEffect(() => setFailed(!src), [src]);` (import `useEffect`). Fixes reader chapter changes and reused list items.

**P0-3. Hero image loads lazily although it is the LCP.**
`ForYouSections.tsx:35`: give `SeenImage` an optional `priority` prop (`loading="eager"`, `fetchPriority="high"`), `SeenImage.tsx:55` honour it, pass it only from the hero. Prevents a flash of dark fallback on first paint.

**P0-4. Reader mid-section scrim is too weak for body text over a bright cover.**
`StoryChapterScreen.tsx:282`: `from-black/70 via-black/40 to-black` becomes `from-black/70 via-black/65 to-black`. At 40%, a white image behind text gives roughly 3:1 for 16px text; 65% gives roughly 7:1. Verify reader text actually sits over this region before merging.

**P0-5. Rail clips the top of focus outlines.**
`ForYouSections.tsx:78`: `overflow-x-auto` also clips vertically; cards have no top padding, so the 2px outline plus 2px offset is cut off. Add `pt-1 -mt-1` to the className (bottom already has `pb-2`).

**P0-6. Silent stock fallback cover for user stories.**
`userStoriesService.ts:143`: remove the hard-coded Unsplash URL and leave `coverImage` as `''` so `SeenImage` renders the branded tile (seeded per story). A random stock photo on a community member's own story is worse than a designed tile, and it is not credited.

**P0-7. Misleading `alt` on decorative cards.**
`StoryCard.tsx:35`, `ContentCard.tsx:69`, `cards.tsx:64`, `FeaturedStoryPreview.tsx:109`, `ContextCardModal.tsx:66`, `StoryRow.tsx:18`: `alt={title} decorative` is dead code that reads as informative. Change to `alt="" decorative` to match the intended policy and avoid someone removing `decorative` later and creating duplicate announcements. The fallback tile's `aria-label` is also dropped by `decorative`, which is intended.

### P1 (design or content work)

- **P1-1. Replace generic stock covers.** See section 4. Includes de-duplicating `1464207687429` (used by two unrelated stories) and removing hotlinked URLs from `storyDatabase.ts` in favour of self-hosted, credited, WebP/AVIF assets.
- **P1-2. Add `StoryCover` metadata.** `{ src, alt, credit, licence, consentRef, focalPoint, safeZone }` on `StoryWorld`. Cards stay decorative, but the story page needs an informative description of the cover.
- **P1-3. Cover alt text and credit in Create Story.** No cover field exists; cover is chapter 1's image. Add an explicit "Cover image" step with required description (or "decorative"), credit line, and a consent/rights tick.
- **P1-4. Replace `window.prompt` image URL entry** (`MediaChaptersStep.tsx:331`) with an upload to the app's own storage with type and size checks, EXIF/location stripping and moderation. Hotlinked user URLs leak viewer IPs and can change after publication.
- **P1-5. Seed catalogue chapter image has no alt.** `storyDatabase.ts:337` needs `imageAlt` (or `imageDecorative: true`) so the reader applies a deliberate choice.
- **P1-6. Real avatars with consent.** `Avatar` supports `src` but nothing passes it. Add creator-approved portraits (see section 4) and keep initials as the fallback.
- **P1-7. Fallback tile identity.** Render a title monogram or the story's first words in a low-contrast display face on the fallback tile so a failed cover is still recognisable. Keep `aria-hidden`.
- **P1-8. Unprotected pills elsewhere.** After P0-1, extend `e2e/audit/manual-a11y.spec.ts` to raise the 40-node cap per route, add a mid-grey and a high-frequency (busy, high-contrast) test image, and add the Search and creator-profile routes.
- **P1-9. Moderation image preview.** `ModerationGovernanceSystem.tsx:306` uses a raw `<img alt="Response">`. Use `SeenImage`, describe it ("Reported image attached to this response") and add a blur-by-default toggle for reviewers.

### P2

- **P2-1. Dual-ring focus** (white 2px plus black 1px outer) for any control placed on imagery, so it stays visible on light photos (`seen-tokens.css:126`).
- **P2-2.** `figma/ImageWithFallback.tsx` is unused and has a non-descriptive failure alt ("Error loading image"); delete it or route it through `SeenImage`.
- **P2-3.** Add `width`/`height` or `aspect-ratio` plus `sizes`/`srcset` for covers (currently one 800x1200 file serves 64px thumbnails).
- **P2-4.** Respect `prefers-reduced-motion` for the `group-hover:scale-105` cover zoom (global reduced-motion rule already shortens transitions; confirm).
- **P2-5.** `ContentCard` hover play disc is revealed on focus-visible (good); keep the reveal consistent on `StoryCard`.

---

## 4. Art-direction brief for BIPOC storytelling covers

Principle: a cover should look like it was made by or with the story's community, for this story. If it could illustrate any article about "diversity", it is wrong.

**What to commission or curate instead of stock**
- Commission photographers and illustrators from the communities in the story, paid per image, credited on the cover page and in credits. Prefer one local creator per collection so the catalogue has a plural, recognisable voice.
- Prefer specific over symbolic: a named neighbourhood, a hand-lettered shop sign, an object the story is about (a suitcase, a language-learning notebook, a harbour pier), not generic smiling groups or hands-in-a-circle compositions.
- Mix media: documentary portrait, archival material the community owns (with a signed release), risograph or collage illustration, typographic covers with the story's own language (EN/FR/ES plus Indigenous-language title where applicable, in the correct orthography).
- Contemporary and warm: current clothing, current places, natural light, mid-tone colour grading that keeps skin tones accurate. Avoid desaturated "struggle" imagery, poverty tropes, bare landscapes standing in for Indigenous people, and exoticised crowd shots.
- Never use a stock photo of a real person to depict a named person in an oral history. Use the real person (with consent), an object, a place, or an illustration.

**Credits, consent, rights**
- Per image: photographer or artist name, year, licence, and a signed release for every identifiable person. Store a `consentRef` and an expiry; honour withdrawal by swapping to the fallback tile within 7 days.
- Indigenous stories: follow community protocols and OCAP principles for imagery of people, ceremony, sacred sites and language; get written approval from the named community contact before publishing.
- Children: no identifiable minors without guardian written consent.
- Do not use AI-generated people to depict real communities. If AI-assisted illustration is used, label it.

**Formats and layout**
- Master: 4:5 portrait at 1600x2000 (cards use 3:4 `StoryCard`, 4:5 `ContentCard`, 16:10 collection and landscape, 16:9 collection card, 1:1 player, 520px-tall full-bleed hero). Deliver one master with a focal point and let the app crop.
- Safe zones on the 4:5 master (as a percentage of height): keep the subject's face or key object inside the central 60%; keep the top 15% and bottom 35% free of detail, because pills and scrims sit there (type pill top-left, badge top-right, title block bottom).
- Hero (full-bleed, 390x520): subject in the upper-middle; the bottom 340px is overlaid by the canvas fade and the top 150px by the header scrim.
- Never bake text, titles or logos into covers. The app renders all text (it is localised in three languages).
- Export WebP or AVIF, under 150 KB at 800px wide; provide a 1:1 crop and a 16:9 crop where the subject allows.

**Alt text for covers**
- Describe the photo's content and mood in one or two sentences (not "image of"), include relevant visible identity details only if the creator wants them included, and never guess at ethnicity or identity from appearance.
- Required for informative covers (story page header), `alt=""` for covers repeated next to the title in cards. Provide EN, FR and ES alt.
- Example: "Two women in winter coats read letters at a kitchen table lit by a window; a suitcase stands by the door."

---

## 5. Technical rules

1. Any text or control over an image must sit on a scrim in the same stacking context. No exceptions for cards, heroes or banners.
2. Scrim minimums, tested against a white photo: text 16px or smaller, at least 65% black (about 7:1) behind it, or a solid surface; text 24px and larger, at least 50%; icon-only circle controls, `bg-black/50` plus a scrim of at least 60% behind (3:1 for graphics).
3. Prefer a bottom gradient plus a top gradient on every full-bleed image; do not rely on `to-transparent` where a pill or icon sits.
4. Pills and badges placed on an image use `bg-black/60` or darker and `text-white`; never `bg-white/5..10` or `text-white/70` on imagery. Add an `onImage` variant to `Badge` to enforce this.
5. Never put critical text (title, price, deadline, warning, call to action) directly on a user-generated image. Put it on a solid surface below or use a solid scrim. User images are unpredictable: assume a white, busy or low-quality photo.
6. Alt rules: informative image = description of content, in the user's language; decorative image (title already adjacent in text, repeated, or purely atmospheric) = `alt=""` with `decorative`. A card or banner is decorative when its title is real text. A cover on a story's own page is informative and needs a description. Never put the title in `alt` when the title is shown beside the image.
7. Creator flow: required cover description or a "decorative" tick (already enforced for chapter images; add for cover), 250-character cap, credit and consent fields, no empty publish.
8. Fallback tile: every image goes through `SeenImage`; a failure or missing URL renders the seeded gradient tile with a title monogram, keeps layout via the parent aspect ratio, and keeps text contrast unchanged (text must never depend on the image loading).
9. Focus: controls on imagery must keep the global 2px outline visible; where the control is over an image use a dual ring; rails must leave room around the cards so the ring is not clipped.
10. Tests: extend the white-photo contrast test with a mid-grey and a busy image, add a "failed image" case (route images to 404) asserting `image-fallback` renders and text contrast still holds.

---

## 6. Summary

Scrims and alt-text policy are mostly sound: the hero, banners, preview and reader text blocks sit on strong gradients, covers are decorative next to real text, the create flow forces image descriptions, and a worst-case white-photo test runs. The gaps are (a) top-of-image pills and badges with no scrim (computed 1.2 to 3.1:1 on bright photos), (b) fallback and loading edge cases in `SeenImage`, (c) the user-story default cover and URL-paste upload, and (d) a catalogue of generic hotlinked stock with no credit, consent or cover alt metadata.

Recommended P0 set: P0-1 (pill and badge scrims), P0-2 (`SeenImage` reset), P0-3 (eager hero), P0-4 (reader scrim), P0-5 (rail focus clipping), P0-6 (drop stock default cover), P0-7 (honest decorative alt).


## Applied in this phase
Type pills and badges over photos given a dark backing; collection banner scrim and `overImage` badge tone; story page and reader scrims raised; `SeenImage` retries when `src` changes; Create Story no longer substitutes a stock photograph when no cover is given (SEEN's own tile shows). Not applied: hero `priority` loading (performance, not accessibility), rename of redundant `alt` props on decorative images (no behaviour change), Rail focus-outline padding (needs a visual check), commissioning brief items (editorial).
