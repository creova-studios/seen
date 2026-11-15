# Figma audit — `seen.io` (file `8WMBpUhanDkUjodZYolyDT`)

Inspected through the Figma MCP (`get_metadata`, `get_variable_defs`) on 2026-09-23.

## What the file contains

The file has **one page**, `06 — COMPONENTS` (node `280:4`). It holds a single
design-system board `02 — DESIGN SYSTEM` (`294:2`, 2400×16117) plus loose
component masters. **There are no screen or flow frames in this file** — the
"missing Figma screens" are therefore expressed as *components that imply
features* (Creator Card, Collection Card, Opportunity Card, Notification Item,
Subscription Card, OTP/Password fields, Media Player Bar…). The earlier SEEN
Figma Make file referenced in `README.md` (`DWADSa9ijmNwRfM701qUWs`) is a
different file and was not part of this brief.

Stated rule on the board (`294:5`): *"Every fill, stroke, radius, gap and pad is
bound to a SEEN variable. Interactive components carry default · hover · focus ·
pressed · disabled · loading."*

Full component-by-component inventory with node ids and decisions:
[`docs/design/FIGMA_INVENTORY.md`](../design/FIGMA_INVENTORY.md).
Variables and how they map to code: [`DESIGN_TOKEN_MAP.md`](../design/DESIGN_TOKEN_MAP.md).

## Features implied by the component library

| Figma component | Implied feature | Existed in code? | Decision |
|---|---|---|---|
| Segmented Tabs `Stories / Creators / Collections` (298:162) | Explore split by entity | No | **Built** (Explore tabs) |
| Creator Card (570:3) | Creator directory + profiles + follow | No | **Built** |
| Collection Card (570:5) | Curated collections + save | Only a broken institutional screen | **Built** (thematic + institutional) |
| Opportunity Card (570:7), "ORGANISMS · FUNDING" | Funding opportunities | No | **Built** (list, filters, detail, tracker) |
| Notification Item: Story / Funding / Money / Moderation (363:160) | Notification centre | No | **Built** (Story + Funding types live; Money/Moderation types defined) |
| Empty / Error / Offline templates (301:79) | Standard async states | Partial (empty only) | **Built** as `StateTemplate` + `ResourceView` |
| Banner, Toast (305:53, 570:9) | Feedback | Toast lib installed, unused | **Wired** (`sonner`, `Banner`) |
| Metric Card, Subscription Card | Creator money surfaces | Existing bespoke screens | Keep existing screens; restyle deferred |
| OTP Field, Password Field (363:110, 363:132) | OTP sign-in / reveal password | No OTP flow exists | **Deferred** — needs a real auth backend; building an OTP UI over local demo auth would be fake functionality |
| Media Player Bar Mini/Expanded (363:67) | Persistent mini-player | Chapter screen has its own player | **Deferred** (needs global audio state) |
| Drawer, Sheet, Dialog, Tooltip | Surfaces | Radix primitives exist in `components/ui` | Use when a flow needs them |
| Chapter Row states Available/Playing/Completed/Locked (300:60) | Chapter list states | Chapter index exists | Restyle deferred |

## Conflicts with the live app and how they were resolved

| Topic | Figma | Live app | Resolution |
|---|---|---|---|
| Heading typeface | Fraunces (H1/H2) | Inter light | **Kept Inter** (live language wins per precedence rule 2). Fraunces recorded as a proposal |
| Metadata font | Geist Mono 11px | Inter uppercase tracked | Kept Inter uppercase tracked |
| Secondary text colour | `text/muted #8b8b94` | white at 30–45% (fails AA) | **Moved to Figma level** (white/55 ≈ #8c8c8c) — Figma wins because live fails WCAG |
| Surfaces | `surface/base #121214`, `elevated #1a1a1d` | white/5 on black | New components use the tokens; the two read almost identically on black |
| Primary button | white fill, black text | white fill on onboarding CTAs | Aligned |
