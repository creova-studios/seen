/**
 * Role policy for the SEEN edge function server (CRE-167).
 *
 * - Roles are assigned by the server. Signup only ever yields a self-serve role
 *   (viewer or creator; creator is self-serve per SELF_ASSIGNABLE_ROLES in
 *   src/app/contexts/AuthContext.tsx). Anything else, including admin and
 *   moderator, falls back to viewer.
 * - The authoritative role lives in auth `app_metadata.role`, which only the
 *   service role can write. `user_metadata` is writable by the user themselves
 *   (supabase.auth.updateUser) and is never read for authorisation.
 * - The KV profile role is only trusted for the self-serve `creator` role, so
 *   accounts that self-signed up as admin/moderator before this fix (and so have
 *   role admin/moderator in KV but nothing in app_metadata) are treated as viewer.
 */

export const ROLES = ["viewer", "creator", "moderator", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const SELF_SERVE_ROLES: readonly Role[] = ["viewer", "creator"];
export const DEFAULT_ROLE: Role = "viewer";

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Role for a new account: the requested role if self-serve, otherwise viewer. Never errors. */
export function resolveSignupRole(requested: unknown): Role {
  return isRole(requested) && SELF_SERVE_ROLES.includes(requested) ? requested : DEFAULT_ROLE;
}

export interface AuthUserLike {
  app_metadata?: Record<string, unknown> | null;
  // user_metadata is intentionally not part of this type: it must not be used for roles.
}

export interface ProfileLike {
  role?: unknown;
}

/**
 * The role the server enforces for a user. Reads only server-controlled data:
 * app_metadata.role first, then the KV profile for the self-serve creator role.
 */
export function resolveEffectiveRole(user: AuthUserLike | null | undefined, profile: ProfileLike | null | undefined): Role {
  const appRole = user?.app_metadata?.role;
  if (isRole(appRole)) return appRole;
  if (profile?.role === "creator") return "creator";
  return DEFAULT_ROLE;
}
