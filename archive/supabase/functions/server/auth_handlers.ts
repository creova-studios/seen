/**
 * Auth, role-check and role-grant handlers for the SEEN edge function server.
 *
 * Kept free of Deno globals and npm: imports so the same code runs under the
 * edge runtime (wired up in index.tsx) and under vitest (CRE-167 tests).
 */
import { isRole, resolveEffectiveRole, resolveSignupRole, type Role } from "./auth_policy.ts";
import { errInfo, log } from "./safe_log.ts";

// Minimal shapes of the pieces of Hono and supabase-js these handlers use.
// deno-lint-ignore no-explicit-any
type Json = any;
export interface Ctx {
  req: {
    json: () => Promise<Json>;
    header: (name: string) => string | undefined;
    param: (name: string) => string | undefined;
    path: string;
  };
  json: (body: Json, status?: number) => Response | Json;
  get: (key: string) => Json;
  set: (key: string, value: Json) => void;
}
export type Next = () => Promise<void> | void;

export interface KvLike {
  get: (key: string) => Promise<Json>;
  set: (key: string, value: Json) => Promise<void>;
}

export interface AuthDeps {
  // deno-lint-ignore no-explicit-any
  supabaseAdmin: any;
  // deno-lint-ignore no-explicit-any
  getSupabaseClient: () => any;
  kv: KvLike;
  now?: () => Date;
  randomId?: () => string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) return { valid: false, error: "Password must be at least 8 characters long" };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "Password must contain at least one uppercase letter" };
  if (!/[a-z]/.test(password)) return { valid: false, error: "Password must contain at least one lowercase letter" };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain at least one number" };
  return { valid: true };
}

export function bearerToken(c: { req: { header: (name: string) => string | undefined } }): string | undefined {
  const header = c.req.header("Authorization");
  if (!header) return undefined;
  const [scheme, value] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" && value ? value : undefined;
}

const LANGUAGES = ["en", "fr", "es"];
const INTENTS = ["explore", "create", "contribute"];

function pick(value: unknown, allowed: string[], fallback: string): string {
  return typeof value === "string" && allowed.includes(value) ? value : fallback;
}

export function createAuthHandlers(deps: AuthDeps) {
  const { supabaseAdmin, getSupabaseClient, kv } = deps;
  const now = deps.now ?? (() => new Date());
  const randomId = deps.randomId ?? (() => Math.random().toString(36).slice(2, 11));

  /**
   * POST /auth/signup  Body: { email, password, name, role?, language?, intent? }
   * The role is decided here: viewer or creator only. Any client-sent role,
   * isAdmin, app_metadata or user_metadata is ignored.
   */
  async function signup(c: Ctx) {
    try {
      let body: Json;
      try {
        body = await c.req.json();
      } catch {
        return c.json({ error: "Invalid request body" }, 400);
      }
      if (!body || typeof body !== "object") return c.json({ error: "Invalid request body" }, 400);

      const email = typeof body.email === "string" ? body.email.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      const name = typeof body.name === "string" ? body.name.trim().slice(0, 255) : "";
      const role: Role = resolveSignupRole(body.role);
      const language = pick(body.language, LANGUAGES, "en");
      const intent = pick(body.intent, INTENTS, "explore");

      if (!email || !password || !name) {
        log.warn("signup.rejected", { reason: "missing_fields" });
        return c.json({ error: "Missing required fields: email, password, name" }, 400);
      }
      if (!EMAIL_RE.test(email)) {
        log.warn("signup.rejected", { reason: "invalid_email_format" });
        return c.json({ error: "Invalid email format" }, 400);
      }
      const passwordCheck = validatePassword(password);
      if (!passwordCheck.valid) {
        log.warn("signup.rejected", { reason: "weak_password" });
        return c.json({ error: passwordCheck.error }, 400);
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        // Display preferences only. Nothing in user_metadata is used for authorisation.
        user_metadata: { name, language, intent },
        // Server-controlled; only the service role can write app_metadata.
        app_metadata: { role },
        // Auto-confirm is kept for now because no SMTP provider is configured (CRE-167 follow-up).
        email_confirm: true,
      });

      if (error) {
        log.error("signup.create_failed", errInfo(error));
        if (error.code === "email_exists" || error.message?.includes("already been registered")) {
          return c.json({ error: "An account with this email already exists. Please sign in instead.", code: "email_exists" }, 409);
        }
        return c.json({ error: "Could not create the account. Please try again." }, 400);
      }
      if (!data?.user) {
        log.error("signup.create_failed", { reason: "no_user_returned" });
        return c.json({ error: "Could not create the account. Please try again." }, 400);
      }

      const userId: string = data.user.id;
      log.info("signup.created", { userId, role });

      const stamp = now().toISOString();
      try {
        await kv.set(`user_profile:${userId}`, { id: userId, email, name, role, language, intent, createdAt: stamp, updatedAt: stamp });
      } catch (kvError) {
        log.error("signup.profile_store_failed", { userId, ...errInfo(kvError) });
      }

      const user = { id: userId, email: data.user.email, name, role, language, intent };

      try {
        const createSession = supabaseAdmin.auth.admin.createSession;
        if (typeof createSession !== "function") {
          log.warn("signup.session_unavailable", { userId });
          return c.json({ user, requiresSignIn: true, message: "Account created successfully. Please sign in to continue." }, 201);
        }
        const { data: sessionData, error: sessionError } = await createSession.call(supabaseAdmin.auth.admin, { user_id: userId });
        if (sessionError || !sessionData?.session) {
          log.warn("signup.session_failed", { userId, ...errInfo(sessionError) });
          return c.json({ user, requiresSignIn: true, message: "Account created successfully. Please sign in to continue." }, 201);
        }
        return c.json({
          session: { access_token: sessionData.session.access_token, refresh_token: sessionData.session.refresh_token },
          user,
        }, 201);
      } catch (sessionCreationError) {
        log.warn("signup.session_failed", { userId, ...errInfo(sessionCreationError) });
        return c.json({ user, requiresSignIn: true, message: "Account created successfully. Please sign in to continue." }, 201);
      }
    } catch (error) {
      log.error("signup.unexpected_error", errInfo(error));
      return c.json({ error: "Signup failed. Please try again." }, 500);
    }
  }

  /**
   * POST /auth/signin  Body: { email, password }
   * Errors are generic so the response does not reveal whether an account exists.
   */
  async function signin(c: Ctx) {
    try {
      let body: Json;
      try {
        body = await c.req.json();
      } catch {
        return c.json({ error: "Invalid request body" }, 400);
      }
      const email = typeof body?.email === "string" ? body.email.trim() : "";
      const password = typeof body?.password === "string" ? body.password : "";
      if (!email || !password) {
        log.warn("signin.rejected", { reason: "missing_fields" });
        return c.json({ error: "Missing required fields: email, password" }, 400);
      }

      const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
      if (error) {
        log.warn("signin.failed", errInfo(error));
        return c.json({ error: "Invalid email or password.", code: "invalid_credentials" }, 401);
      }
      if (!data?.user || !data?.session) {
        log.error("signin.failed", { reason: "no_session_returned" });
        return c.json({ error: "Sign in failed. Please try again." }, 401);
      }

      const userId: string = data.user.id;
      const profile = await kv.get(`user_profile:${userId}`);
      // Role comes from server-controlled data only (app_metadata, else viewer / KV creator).
      const role = resolveEffectiveRole(data.user, profile);
      let userProfile = profile;
      if (!profile) {
        log.warn("signin.profile_missing", { userId });
        const stamp = now().toISOString();
        userProfile = {
          id: userId,
          email: data.user.email,
          name: typeof data.user.user_metadata?.name === "string" ? data.user.user_metadata.name : "User",
          role,
          language: pick(data.user.user_metadata?.language, LANGUAGES, "en"),
          intent: pick(data.user.user_metadata?.intent, INTENTS, "explore"),
          createdAt: stamp,
          updatedAt: stamp,
        };
        await kv.set(`user_profile:${userId}`, userProfile);
      }
      log.info("signin.succeeded", { userId, role });

      return c.json({
        session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token },
        user: { ...userProfile, role },
      });
    } catch (error) {
      log.error("signin.unexpected_error", errInfo(error));
      return c.json({ error: "Sign in failed. Please try again." }, 500);
    }
  }

  /** Middleware: only lets through users whose server-controlled role is in allowedRoles. */
  function requireRole(allowedRoles: Role[]) {
    return async (c: Ctx, next: Next) => {
      const accessToken = bearerToken(c);
      if (!accessToken) return c.json({ error: "Unauthorized: No access token provided" }, 401);

      const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
      const user = data?.user;
      if (error || !user) return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);

      const profile = await kv.get(`user_profile:${user.id}`);
      if (!profile) return c.json({ error: "Unauthorized: Profile not found" }, 401);

      const role = resolveEffectiveRole(user, profile);
      if (!allowedRoles.includes(role)) {
        log.warn("authz.denied", { userId: user.id, role, path: c.req.path });
        return c.json({ error: "Forbidden: Insufficient permissions" }, 403);
      }

      c.set("user", user);
      c.set("profile", { ...profile, role });
      c.set("role", role);
      await next();
    };
  }

  /**
   * POST /admin/users/:userId/role  Body: { role }   (mount behind requireRole(['admin']))
   * The only API path that grants moderator/admin. Writes app_metadata (authoritative)
   * and the KV profile, and audit-logs actor id, target id and role.
   */
  async function grantRole(c: Ctx) {
    try {
      const actor = c.get("user");
      const targetId = c.req.param("userId");
      let body: Json;
      try {
        body = await c.req.json();
      } catch {
        return c.json({ error: "Invalid request body" }, 400);
      }
      const role = body?.role;
      if (!targetId) return c.json({ error: "Missing user id" }, 400);
      if (!isRole(role)) return c.json({ error: "Invalid role. Must be: viewer, creator, moderator, or admin" }, 400);

      const { data: targetData, error: targetError } = await supabaseAdmin.auth.admin.getUserById(targetId);
      if (targetError || !targetData?.user) {
        log.warn("role_grant.target_not_found", { actorId: actor?.id, targetId, ...errInfo(targetError) });
        return c.json({ error: "User not found" }, 404);
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetId, {
        app_metadata: { ...(targetData.user.app_metadata ?? {}), role },
      });
      if (updateError) {
        log.error("role_grant.update_failed", { actorId: actor?.id, targetId, ...errInfo(updateError) });
        return c.json({ error: "Could not update the role. Please try again." }, 500);
      }

      const stamp = now().toISOString();
      const profile = (await kv.get(`user_profile:${targetId}`)) ?? { id: targetId, createdAt: stamp };
      await kv.set(`user_profile:${targetId}`, { ...profile, role, updatedAt: stamp });

      const audit = { actorId: actor?.id ?? null, targetId, role };
      await kv.set(`audit_role_grant:${stamp}:${randomId()}`, audit);
      log.info("audit.role_grant", audit);

      return c.json({ userId: targetId, role });
    } catch (error) {
      log.error("role_grant.unexpected_error", errInfo(error));
      return c.json({ error: "Could not update the role. Please try again." }, 500);
    }
  }

  return { signup, signin, requireRole, grantRole };
}
