# Offline save control (DS5, E6) — spec

Gated on the Supabase adapter: no fake offline version ships on the demo adapter.

**Control.** A 44 px icon button in the story action row (never a badge). States: not saved (download icon, label "Save for offline"), saving (spinner, `aria-busy`), saved (check icon, "Saved offline"), error.
**Manage list.** Library > Saved shows a "Saved offline" group: title, size, "Saved {date}", Remove. Count shown as "{n} of 20".
**21st save.** Sheet, not a toast: "You can keep 20 stories offline. Remove one to add another." with the list of saved stories and a Remove button on each; no automatic eviction.
**Expired (14 days).** Reader shows a Banner "Reconnect to refresh this story." with Retry; reading stays blocked until revalidated online.
**Removed upstream.** After sync the row shows "No longer available offline" and is removed on the next visit.
**Device full / storage evicted.** Banner "Your device is full. Free some space and try again." (iOS Safari may evict storage; never a silent failure).
**Sign-out.** Clears the cache; confirm copy on sign-out: "Saved offline stories on this device will be removed."
**Accessibility.** Status changes announced in a polite live region; list rows are real buttons with 44 px targets.
Rules and tests: `src/app/services/offline/offlineCache.ts`, `offlineCache.test.ts`.
