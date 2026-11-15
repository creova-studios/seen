# 01 — SEEN repository forensic audit

**SEEN — a Creova product.** Evidence: repository tree, imports, package manifests, Git history and branches (see `00_…BASELINE.md`), 2026-10-05.

## 1. How many SEEN implementations really exist?

The founder remembers three. The evidence shows **four code lines plus one unwired backend**:

| ID | Where | What it is | Runs today? | Deployed? |
|---|---|---|---|---|
| **A** | `main` → `src/` | React 18 + Vite web app; the unified UI from PR #19/#22 | ✅ builds, 64 unit + 33 E2E pass | ✅ **production** (`a35a8f1`) |
| **B** | `archive/src/` (80 files) + branch `claude/platform-audit-OKLXV` | The earlier web app's unreachable screens (Home, Story World Entry, Story Builder, Sound-Driven Story, Branch Map, QR object entry, Creator Insights, Brock collaboration, Lyrics/Context panels …). Archived by ADR-001; the branch rewires some of them | ❌ not built, not type-checked | ❌ |
| **C** | `mobile/` | Expo SDK 57 native app (iOS/Android): invocation, onboarding (role + intent), For You, Story Detail, Profile — sample data, no backend | Runs with Expo Go (not verified in this sandbox) | ❌ |
| **D** | branch `claude/dead-code-typecheck-fixes` | A parallel line of Implementation A (diverged 2026-09-01) that added ~20 screens and an a11y hook never merged | Builds on its own base (per its CI history); not re-verified here | ❌ (preview only) |
| *Backend* | `supabase/functions/server/` (11 files, ~6.7k lines, 36 routes) | Hono edge function from the CMF-grant era: auth, cultural metrics, ethical discovery, governance/moderation, creator rights, grant readiness, audio | **Not deployed/used** by A except one call in `StoryStateContext`; front end uses a local demo adapter (ADR-002) | ❌ |

`src/app/components/ui/` (48 shadcn files) is a **fifth, dormant design kit**: zero imports from app code.

## 2. Implementation A — canonical web app (`src/`)

| Dimension | Finding |
|---|---|
| Framework | React 18.3.1, TypeScript 5.7 (`strict: false`), Vite 6.3.5 |
| Routing | Single-page state machine in `App.tsx` mirrored to hash URLs (`navigation/routes.ts`, ADR-004); 23 screens; role allow-lists (`canAccess`) |
| Styling | Tailwind 4 with SEEN tokens in `src/styles/seen-tokens.css` (from Figma variables); primitives/organisms in `components/seen/` |
| State | React contexts: `AuthContext` (demo accounts in localStorage), `StoryStateContext` (story progress, language, a11y prefs), `PlaybackProvider` |
| Data | **Two layers coexist**: (1) new typed `services/` contracts + demo adapter (creators, collections, funding, notifications); (2) older `data/*Service.ts` modules over localStorage (`userDataService`, `userStoriesService`, `monetizationService`, `adminService`, `roleService`, `searchService`, `paymentService`). Catalogue: `data/storyDatabase.ts` (14 story worlds, EN/FR/ES) |
| Auth / authz | Client-only demo auth (SHA-256 in localStorage); roles enforced in UI only. **Not production-safe** (documented in `docs/security/`) |
| Search | Fuse.js over the local catalogue (stories only) |
| Discovery | Static curated feed + Explore categories; no ranking model |
| Media | `PlaybackProvider`: recorded audio → device voice (labelled) → explicit unavailable. **No recorded narration files exist** |
| Analytics | `observability.ts`: allow-listed `track()` events, error beacon to optional endpoint |
| Tests | Vitest (7 files, 64 tests), Playwright (33 incl. axe WCAG 2.2 AA) |
| Accessibility | AA contrast tokens, 44 px targets, focus-visible, reduced-motion/high-contrast app-wide |
| Monitoring | Error boundary + beacon; no sink chosen |
| Deployment | Vercel, `main` → production |

### Dead / duplicated code inside A

| Item | Evidence | Action |
|---|---|---|
| `components/ui/*` (48 files) | 0 imports | Retire after confirming no planned use (P2) |
| `data/routeGuards.ts` | 0 imports (superseded by `routes.canAccess`) | Retire |
| `data/demoData.ts`, `generateMissingChapters.ts` | 1 import each; content generation helpers | Review |
| Two data layers (`data/*Service.ts` vs `services/`) | See above | Converge on `services/` contracts (P1) |
| `StoryStateContext` calls a Supabase edge function URL | Endpoint not deployed | Replace with service contract when backend lands |
| `utils/supabase/info.tsx` | Committed project id + anon key | Move to env (P2) |
| Legacy screens restyled only partly | Publish wizard, moderation, admin | Restyle with `components/seen` (P2) |
| TODO/FIXME/HACK markers | 0 in app code | — |

## 3. Implementation B — archived web screens (`archive/`)

Archived (not deleted) by ADR-001 because nothing routed to them. **Several match Figma frames that still exist**, so they are product evidence, not trash:

| Archived screen | Figma frame | Value |
|---|---|---|
| `SoundDrivenStoryView`, `AudioLayerControl` | `sound-driven-story`, `audio-layer-control` | Immersive audio concept |
| `StoryBranchMapScreen`, `StoryChoiceOverlay`, `SoftBranchingChoice` | STORY / Branch Map, Choice Overlay, Soft Branching | Branching narratives (A already has `BranchingChoiceOverlay`) |
| `ObjectQREntryScreen` | DISCOVERY / Object QR Entry (concept) | Museum/institution entry point |
| `InstitutionalCollectionScreen`, `BrockCollaborationScreen` | INSTITUTIONS / *, `06-22 Brock University Partnership` | ⚠ names a real institution — not usable without a signed agreement |
| `CreatorInsightsScreen`, `CreatorOnboardingFlow` | CREATOR / Become a Creator, `creator-insights` | Creator onboarding + analytics |
| `AccessibilityControlsScreen` | PROFILE / Accessibility Settings | Partly covered by A's Settings |
| `HomeScreen`, `StoryWorldEntryScreen`, `*Creator` variants | `archive-home`, `archive-story-entry` (Figma marks them "archive-") | Historical |

## 4. Implementation C — mobile (`mobile/`)

862 lines; 5 screens; sample catalogue of a subset of A's stories; own `theme.ts`; separate `CLAUDE.md`/`AGENTS.md`. No auth, no API, no tests. It duplicates A's onboarding and feed with a different stack (React 19 / RN).

## 5. Implementation D — `claude/dead-code-typecheck-fixes`

Screens and hooks that **exist only here** (not on `main`, not in `archive/`):

`AppUpdateModal`, `ChangePasswordScreen`, `ContentUnavailableScreen`, `EditProfileScreen`, `EmailVerificationScreen`, `GuestSignupPromptModal`, `LoadingSkeleton`, `LogoutConfirmationModal`, `MediaPlaybackErrorScreen`, `NetworkErrorState`, `NotificationSettingsScreen`, `OfflineBanner`, `PermissionDeniedScreen`, `ReportContentScreen`, `SaveConfirmationToast`, `SessionExpiredScreen`, `ShareSheet`, `StoryCompletionScreen`, `TermsPrivacyScreen`, `hooks/useDialogA11y`, `hooks/useMediaPermission`.

Every one has a matching Figma frame (e.g. `edit-profile`, `change-password`, `report-content`, `terms-privacy`, `share-sheet`, `story-completion`, `session-expired`). Some overlap with A's newer equivalents (A has its own Notifications, Search, Skeleton, StateTemplate offline/error) — those overlaps are **MERGE**, the rest **MIGRATE** (see matrix 02).

## 6. Backend (`supabase/functions/server/`)

36 routes across auth, KV store, cultural metrics, ethical discovery, governance/moderation, creator rights/IP, grant readiness ("CMF" endpoints), accessibility and audio. It predates the current product definition, carries CMF-specific naming the product has since removed, and is not deployed. ADR-003 recommends Supabase (Postgres + Auth + RLS) with service contracts; this function is **reference material**, not a foundation.

## 7. Cross-cutting findings

| Area | Finding | Severity |
|---|---|---|
| Competing design systems | `components/seen` (canonical, Figma-bound) vs `components/ui` shadcn (unused) vs bespoke legacy screens vs `mobile/src/theme.ts` | P2 |
| Competing data models | Story shape differs between `storyDatabase.ts`, `services/contracts.ts`, mobile `stories.ts`, Figma's Story object, and the edge function | P1 |
| Package manager | npm on `main`, pnpm on two branches, lockfile ignored | P1 |
| No lint/format | — | P2 |
| `strict: false` | Large legacy surface | P2 |
| Real-organisation names | `BrockCollaborationScreen` + Figma `06-22 Brock University Partnership` | P0 if shipped; currently archived |
| Generated output | `dist/`, `test-results/` ignored correctly | — |
