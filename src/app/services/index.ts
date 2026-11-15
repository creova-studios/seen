/**
 * Single entry point for feature data. Screens import `api` from here and
 * never reach into an adapter directly, so swapping the demo adapter for a
 * Supabase-backed one is a one-line change (see ADR-002).
 */
import { demoAdapter } from "./demo/adapter";
import type { SeenApi } from "./contracts";
import { backend } from "./backend";
import { createSupabaseSafety } from "./supabase/safety";
import { lazySafetyDb } from "./supabase/client";

/**
 * Demo by default. With a configured Supabase project, reports, blocks, notes and preferences
 * go to the database; creators, collections, funding and notifications stay derived from the
 * static catalogue until their tables exist.
 */
export const api: SeenApi = backend.mode === "supabase" ? { ...demoAdapter, ...createSupabaseSafety(lazySafetyDb()) } : demoAdapter;

export * from "./contracts";
export { ServiceError, getSimulation, setSimulation } from "./runtime";
export { pushNotification } from "./demo/adapter";
export { deadlineState, formatAmount, formatDeadline, formatStatus, isApplyable, opportunityStatus } from "./funding";
