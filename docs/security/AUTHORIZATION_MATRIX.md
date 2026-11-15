# Authorization matrix

✅ allowed · ❌ denied (Restricted state) · 🔜 planned. **UI guard today; server/RLS enforcement is required before any open release.** Source: `navigation/routes.ts › SCREEN_ROLES` (unit-tested).

| Capability / screen | viewer | creator | moderator | admin | Enforced where today |
|---|---|---|---|---|---|
| For You, Explore, Library, Search, Notifications | ✅ | ✅ | ✅ | ✅ | — |
| Creator profiles, follow | ✅ | ✅ | ✅ | ✅ | — |
| Collections, save | ✅ | ✅ | ✅ | ✅ | — |
| Funding, track applications | ✅ | ✅ | ✅ | ✅ | — |
| Publish a story (wizard) | ✅ (becomes creator on first publish) | ✅ | ✅ | ✅ | UI |
| Creator monetization / earnings | ❌ | ✅ | ❌ | ✅ | `canAccess` |
| Moderation queue | ❌ | ❌ | ✅ | ✅ | `canAccess`; Edge fn `requireRole(['moderator','admin'])` |
| Admin dashboard, institutional management | ❌ | ❌ | ❌ | ✅ | `canAccess` |
| Self-assign role at sign-up | viewer | creator | ❌ → request | ❌ → request | `resolveSignupRole` |
| Change own role via profile | ❌ | ❌ | ❌ | ❌ | `updateProfile` strips `role` |
| Approve role requests | ❌ | ❌ | ❌ | 🔜 | — |
| Manage funding listings | ❌ | ❌ | ❌ | 🔜 (funder org editors) | — |
| Tenant (org) data | 🔜 members of org only, per RLS | | | | — |
