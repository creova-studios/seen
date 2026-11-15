import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { AuthContext, RATE_LIMITED_MESSAGE, WRONG_CREDENTIALS_MESSAGE, type AuthContextType, type AuthState, type User } from "./authContextBase";
import type { Language, UserIntent, UserRole } from "./StoryStateContext";
import { getSupabaseClient } from "../services/supabase/client";

/**
 * Supabase Auth (email and password, Google). Same surface as the demo provider.
 * Roles come from the server-owned `profiles.role` column; the client can only ever ask for viewer or creator at sign-up.
 */
const SELF_ASSIGNABLE: UserRole[] = ["viewer", "creator"];
const GOOGLE_ENABLED = import.meta.env.VITE_GOOGLE_AUTH === "true";

const empty: AuthState = { user: null, accessToken: null, isLoading: false, isAuthenticated: false };

async function loadUser(session: Session): Promise<User> {
  const client = await getSupabaseClient();
  const { data } = await client.from("profiles").select("display_name, role, created_at, bio").eq("id", session.user.id).maybeSingle();
  const meta = (session.user.user_metadata ?? {}) as Record<string, string | undefined>;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: data?.display_name ?? meta.name ?? meta.full_name ?? "",
    role: (data?.role as UserRole) ?? "viewer",
    language: (meta.language as Language) ?? "en",
    intent: (meta.intent as UserIntent) ?? "explore",
    bio: (data as { bio?: string | null } | null)?.bio ?? undefined,
    createdAt: data?.created_at ?? session.user.created_at,
  };
}

function friendly(e: { message: string; status?: number; code?: string }): Error {
  if (e.status === 429 || e.code === "over_request_rate_limit" || e.code === "over_email_send_rate_limit") return new Error(RATE_LIMITED_MESSAGE);
  if (e.code === "invalid_credentials" || /invalid login/i.test(e.message)) return new Error(WRONG_CREDENTIALS_MESSAGE);
  if (e.code === "user_already_exists" || /already registered/i.test(e.message)) return new Error("An account with this email exists. Sign in instead.");
  if (/fetch|network/i.test(e.message)) return new Error("You appear to be offline.");
  return new Error(e.message);
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ...empty, isLoading: true });

  useEffect(() => {
    let off: (() => void) | undefined;
    let live = true;
    void (async () => {
      const client = await getSupabaseClient();
      const apply = async (session: Session | null) => {
        if (!live) return;
        if (!session) return setState(empty);
        const user = await loadUser(session);
        if (live) setState({ user, accessToken: session.access_token, isLoading: false, isAuthenticated: true });
      };
      const { data } = client.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") window.location.hash = "#/reset-password/recovery";
        void apply(session);
      });
      off = () => data.subscription.unsubscribe();
      await apply((await client.auth.getSession()).data.session);
    })().catch(() => live && setState(empty));
    return () => {
      live = false;
      off?.();
    };
  }, []);

  const value: AuthContextType = {
    state,
    async signUp(email, password, name, role, language, intent) {
      const client = await getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name, role: SELF_ASSIGNABLE.includes(role) ? role : "viewer", language, intent }, emailRedirectTo: window.location.origin + "/" },
      });
      if (error) throw friendly(error);
      if (!data.session) throw new Error(`We sent a confirmation link to ${email.trim()}. Open it, then sign in.`);
    },
    async signIn(email, password) {
      const client = await getSupabaseClient();
      const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw friendly(error);
    },
    async signOut() {
      const client = await getSupabaseClient();
      await client.auth.signOut();
      setState(empty);
      for (const k of ["hasEnteredSEEN", "onboarding_completed", "onboarding_step"]) localStorage.removeItem(k);
    },
    async checkSession() {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      if (data.session) {
        const user = await loadUser(data.session);
        setState(prev => ({ ...prev, user }));
      }
    },
    async updateProfile(updates) {
      if (!state.user) throw new Error("Not authenticated");
      const client = await getSupabaseClient();
      // Role, id and email are never changed from the client; display name goes to profiles, the rest to metadata.
      if (updates.name !== undefined || updates.bio !== undefined) {
        const patch: Record<string, string> = {};
        if (updates.name !== undefined) patch.display_name = updates.name;
        if (updates.bio !== undefined) patch.bio = updates.bio;
        const { error } = await client.from("profiles").update(patch).eq("id", state.user.id);
        if (error) throw friendly(error);
      }
      if (updates.language !== undefined || updates.intent !== undefined) {
        await client.auth.updateUser({ data: { language: updates.language ?? state.user.language, intent: updates.intent ?? state.user.intent } });
      }
      setState(prev => (prev.user ? { ...prev, user: { ...prev.user, name: updates.name ?? prev.user.name, bio: updates.bio ?? prev.user.bio, language: updates.language ?? prev.user.language, intent: updates.intent ?? prev.user.intent } } : prev));
    },
    async requestRoleElevation() {
      throw new Error("Role requests aren't available yet. Ask an admin.");
    },
    async requestPasswordRecovery(email) {
      const client = await getSupabaseClient();
      // The same result whether or not the account exists.
      await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + "/#/reset-password/recovery" });
      return {};
    },
    async changePassword(currentPassword, newPassword) {
      if (!state.user) throw new Error("Not authenticated");
      if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
      const client = await getSupabaseClient();
      const check = await client.auth.signInWithPassword({ email: state.user.email, password: currentPassword });
      if (check.error) throw new Error("Your current password is not correct.");
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (error) throw friendly(error);
    },
    async resetPassword(_token, newPassword) {
      if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
      const client = await getSupabaseClient();
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (error) throw new Error(/expired|session/i.test(error.message) ? "This reset link has expired. Request a new one." : error.message);
    },
    signInWithGoogle: GOOGLE_ENABLED
      ? async () => {
          const client = await getSupabaseClient();
          const { error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/" } });
          if (error) throw friendly(error);
        }
      : undefined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
