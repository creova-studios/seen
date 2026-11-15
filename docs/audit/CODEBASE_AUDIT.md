# Codebase audit

## Shape at baseline

- 186 source files under `src/`; **only 64 were reachable from `src/main.tsx`** (measured with an esbuild metafile).
- All 74 TypeScript errors were in unreachable files plus 5 real bugs in reachable ones (About/Institutional prop mismatches, `getTextHelper`, two Motion typing issues).
- Three parallel navigation systems: `App.tsx` screen state (the real one), `navigation/NavigationController.tsx` (a second, disconnected state machine that the header used — the cause of the dead Search/Profile buttons) and `interactions/InteractionHandlers.tsx` (unreachable).
- Four copies of the bottom navigation.
- Two story databases referenced in `CLAUDE.md` (`content.ts` vs `storyDatabase.ts`): `content.ts` had already been removed; `storyDatabase.ts` (12 story worlds, chapters in a separate `CHAPTERS_REGISTRY`) is the single source of truth. The "chapters nested in story objects" issue in `CLAUDE.md` is also already resolved (`getChapterById(storyId, chapterId)` resolves through the registry).
- Tests: 4 files written for Jest with no test runner installed.

## What was archived and why

Unreachable modules were moved (with `git mv`, history preserved) to
`archive/src/…` and excluded from type-checking and the build:

- ~30 data modules (season 2–4 story drafts, film/music catalogues, audio script packs, editorial registries). Several contain real content work — keep for future seasons; they are data, not dead code to delete.
- ~25 components/screens never mounted (`HomeScreen`, `*ScreenCreator`, `StoryBuilderScreen`, `StoryBranchMapScreen`, `AccessibilityControlsScreen`, `SplashScreen`, …) and `InstitutionalCollectionScreen` (replaced by Collections).
- `InteractionHandlers.tsx`, `NavigationController.tsx`, `useEnhancedFeatures`, `useLocalizedUI`, the old Jest tests.

Restoring any of them: `git mv archive/src/<path> src/<path>` and fix its imports.

## Structure after the pass

```
src/app/
├── App.tsx                 # route state, history sync, guards, providers
├── navigation/
│   ├── AppNav.tsx          # context: go/back/openStory/openSearch/…
│   └── routes.ts           # screen list, hash URLs, role allow-lists
├── services/               # feature data boundary (ADR-002)
│   ├── contracts.ts        # typed API contracts
│   ├── runtime.ts          # errors, latency/failure simulation, storage
│   ├── funding.ts          # pure funding rules
│   └── demo/               # demo adapter + deterministic catalogue
├── screens/                # new feature screens (creators, collections, funding, notifications, search)
├── components/
│   ├── seen/               # design-system primitives + Figma organisms
│   └── …                   # existing screens (For You, Explore, Library, Profile, reader, creator tools)
├── hooks/useResource.ts    # loading / error / retry / optimistic state
├── observability.ts        # error capture + privacy-safe analytics
└── __tests__/              # Vitest suites
e2e/                        # Playwright journeys + axe scans
```

## Remaining debt (tracked in KNOWN_DEFERRED_ITEMS.md)

- `strict: false` in `tsconfig.json`; turning on `strict` is the next typing step.
- Bottom nav still duplicated in three screens.
- `StoryStateContext` persists role in `localStorage` (inherent to client-only auth).
- No linter configured.
