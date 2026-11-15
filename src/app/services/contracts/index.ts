/**
 * API contracts for the SEEN feature domains added in the product-completion
 * pass (Creators, Collections, Funding, Notifications).
 *
 * UI code depends only on these interfaces. `demoAdapter` (services/demo/*)
 * implements them against seeded data + localStorage so the product is fully
 * testable today; a Supabase adapter implementing the same interfaces is the
 * planned swap (docs/architecture/API_CONTRACTS.md). Every entity that will be
 * tenant-scoped carries an `orgId` so row-level policies can key on it.
 */

import type { CreatorsApi } from "./creators";
import type { CollectionsApi } from "./collections";
import type { FundingApi } from "./funding";
import type { NotificationsApi } from "./notifications";
import type { ReportsApi, BlocksApi, NotesApi, PreferencesApi } from "./safety";

export * from "./common";
export * from "./creators";
export * from "./collections";
export * from "./funding";
export * from "./notifications";
export * from "./safety";

export interface SeenApi {
  creators: CreatorsApi;
  collections: CollectionsApi;
  funding: FundingApi;
  notifications: NotificationsApi;
  reports: ReportsApi;
  blocks: BlocksApi;
  notes: NotesApi;
  preferences: PreferencesApi;
}
