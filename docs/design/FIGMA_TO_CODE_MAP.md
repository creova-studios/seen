# Figma → code map

Quick lookup for designers and engineers. Full status table: `FIGMA_INVENTORY.md`.

| Figma | Code import |
|---|---|
| Button (294:54) | `import { Button } from "components/seen/primitives"` — `variant="primary|secondary|ghost|destructive"`, `loading`, `icon`, `size` |
| Icon Button (302:32) | `IconButton` — `label` (required, becomes aria-label), `variant`, `badge` |
| Chip (295:37) | `Chip` — `selected` → `aria-pressed` |
| Badge (296:10) | `Badge` — `tone="gold|mint|purple|surface|info|error"` |
| Avatar (296:20) | `Avatar` — `name`, `src?`, `size="sm|md|lg"` |
| Skeleton (296:43) | `Skeleton kind="line|block|card|circle"`, `SkeletonList` |
| Segmented Tabs (298:162) | `SegmentedTabs` — `tabs`, `value`, `onChange`, `label` |
| Top Bar WithBack (298:118) | `TopBar` / `ScreenFrame` |
| Section Header (248:71) | `SectionHeader` (legacy screens) / `SectionTitle` |
| Story Card Portrait / Landscape / Compact (300:17) | `StoryCard` / `ContentCard aspect="landscape"` / `StoryRow` |
| State Template (301:79) | `StateTemplate kind="empty|error|offline|denied"` |
| Banner (305:53) | `Banner tone=…` |
| Toast (570:9) | `import { toast } from "sonner"` |
| Creator Card (570:3) | `CreatorCard` |
| Collection Card (570:5) | `CollectionCard` |
| Opportunity Card (570:7) | `OpportunityCard` |
| Notification Item (363:160) | `NotificationItem` |
| Metric Card (570:17) | `MetricCard` |

Code Connect: not yet published. Recommended next step is to map the rows above
with Figma Code Connect so Dev Mode shows these imports directly.
