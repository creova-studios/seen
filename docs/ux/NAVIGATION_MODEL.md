# Navigation model

- **Owner:** `App.tsx` holds the current route `{ screen, params }`. `navigation/AppNav.tsx` exposes `go`, `back`, `openStory`, `openSearch`, `openNotifications`, `openProfile`, `unreadCount` to any component.
- **URLs:** every navigation writes a hash URL (`routes.ts › toHash`). Hash routing works on Vercel static hosting without rewrite rules.
- **Back:** `back()` uses browser history when this session pushed entries, else falls back to For You (so a deep-linked screen's back button never exits the app). The browser/Android back button triggers `popstate`, which restores the previous route.
- **Deep links:** on load, a signed-in, onboarded user lands on the hashed screen. Reader screens that need in-memory state (`story-chapter`, `chapter-index`) fall back to For You.
- **Tabs** push history (so back walks tab history, matching platform expectations on the web).
- **Search** result selection *replaces* the search entry, so back from a story returns to where search was opened.
- **Guards:** `canAccess(screen, role)` runs on every render; a guarded screen renders the Restricted state instead (and fires `access_denied`).
