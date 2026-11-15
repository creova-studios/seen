# ADR-001 — Archive unreachable source instead of fixing or deleting it

**Status:** Accepted (2026-09-23)

**Context.** 122 of 186 source files were not reachable from the entry point. They held all but five of the 74 type errors, inflated review surface, and made "what does the app do" hard to answer. Some contain valuable content (season 2–4 story drafts, narration scripts).

**Decision.** Move unreachable modules with `git mv` to `archive/src/…`, outside `tsconfig` `include` and the Vite graph. Do not delete.

**Consequences.** Typecheck is clean and meaningful. History is preserved; restoring a module is one `git mv`. The archive must not be imported from `src/`.
