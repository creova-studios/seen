# SEEN — user roles

**SEEN — a Creova product.** Roles in code: `viewer`, `creator`, `moderator`, `admin` (`navigation/routes.ts`). Figma adds Institution roles (Owner/Curator/Editor/Contributor/Viewer) and multi-select roles.

| Role | Justified now? | Can | Cannot | How obtained | Interface |
|---|---|---|---|---|---|
| **Visitor (guest)** | ✅ (new) | Read the introduction, explore, open stories | Save, follow, publish, apply | No account | Consumer tabs; sign-up prompt on save/follow |
| **Explorer** (`viewer`) | ✅ | Everything a visitor can + save, follow, continue, notifications, report, track funding | Publish | Sign-up | 4 tabs: For You · Explore · Library · Profile |
| **Creator** | ✅ | Explorer + publish, Edit Profile with "seeking/support", Creator Studio, funding tracker | Moderate | Self-select (no approval needed today) | Consumer tabs + Creator Studio stack (entry per D-05) |
| **Supporter / partner / funder** | ⏳ later | Discover creators/projects; contact; fund | — | Application + verification | Not built. Needs D-07 |
| **Institution member** | ⏳ later | Curate collections, metadata, rights | — | Invited by an institution Owner | Institution Workspace (Figma). No signed partners yet |
| **Moderator** | ✅ (requires backend for real use) | Review reports, decide, log reasons | Self-grant | **Request only**; approved by admin (approval UI pending) | Moderation queue |
| **Admin** | ✅ internal | Approve roles, feature toggles, platform health | — | **Server-assigned only** | Admin dashboard |

Rules:
- Role checks in the UI are UX only; enforcement belongs in Supabase RLS / edge functions (ADR-003).
- Roles are multi-select (Figma). Today the code stores one role. Migration item MIG-12.
- Intent (why someone came) shapes the feed and is never a gate.
