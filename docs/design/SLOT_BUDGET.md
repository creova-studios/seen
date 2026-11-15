# Card and preview slot budget (DS1)

One tap target per card; badges live in slots, never as overlays or wrapper divs.

| Element | Slot | Rule |
|---|---|---|
| Language chip (E2) | `typeLabel`, after the content type | Viewer's language first, at most two codes then "+N" (`languageChipText`); no `languages` field means no chip. Built on Explore cards. |
| Funding hint (E3) | `badge` | Hidden below 360 px. Not built (legal check first). |
| Saved offline (E6) | Small icon in the action row | Never a badge. Not built (needs Supabase adapter). |
| Report, Block | Preview action row / overflow menu | Report built; Block when blocks have a screen. |
| Private note (E1) | Preview action row (pen icon, 44 px) | Built. End-of-story prompt is a follow-up in the reader. |
| Seeking strip (E3) | Below summary and first chapter CTA | Collapsed, at most 2 entries, "See all" only when wired. |

Verification: the existing 320 / 360 / 390 / 430 / 768 / 1280 px no-overflow journeys run after every addition.
