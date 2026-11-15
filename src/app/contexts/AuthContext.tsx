import { useContext, useState, useEffect, ReactNode } from 'react';
import type { UserRole, Language, UserIntent } from './StoryStateContext';

/**
 * AUTHENTICATION
 *
 * Local-storage backed authentication. Accounts, sessions, and profile
 * updates are persisted on-device so the full auth flow (sign up, sign in,
 * sign out, password recovery, role elevation) works end-to-end without a
 * deployed backend. A Supabase Edge Function with a matching contract lives
 * at supabase/functions/server/index.tsx — swap the implementations below
 * for fetch() calls to that API once it is deployed; the AuthContextType
 * surface is designed to stay identical either way.
 */

import { AuthContext, RATE_LIMITED_MESSAGE, WRONG_CREDENTIALS_MESSAGE, type AuthContextType, type AuthState, type User } from './authContextBase';
export { RATE_LIMITED_MESSAGE, WRONG_CREDENTIALS_MESSAGE };
import { backend } from '../services/backend';
import { SupabaseAuthProvider } from './SupabaseAuthProvider';
export type { AuthContextType, AuthState, User };



const AUTH_STORAGE_KEY = 'seenos_auth_session';
const RESET_STORAGE_KEY = 'seenos_password_resets';
/** A stored session stops being honoured after this long. Sessions saved before expiry existed have no expiresAt and stay valid. */
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ELEVATION_KEY = 'seenos_role_elevation_requests';

/**
 * Roles a person may pick for themselves at sign-up. Moderator/admin are
 * privileged: choosing one creates a viewer account plus a pending elevation
 * request for an admin to review, instead of granting the role on the spot.
 */
export const SELF_ASSIGNABLE_ROLES: UserRole[] = ['viewer', 'creator'];

export function resolveSignupRole(requested: UserRole): { role: UserRole; pendingElevation: UserRole | null } {
  return SELF_ASSIGNABLE_ROLES.includes(requested)
    ? { role: requested, pendingElevation: null }
    : { role: 'viewer', pendingElevation: requested };
}

function recordElevationRequest(user: Pick<User, 'id' | 'name' | 'role'>, requestedRole: UserRole, reason: string) {
  let requests: unknown[] = [];
  try {
    requests = JSON.parse(localStorage.getItem(ELEVATION_KEY) || '[]');
  } catch {
    requests = [];
  }
  requests.push({
    id: `elev_${crypto.randomUUID()}`,
    userId: user.id,
    userName: user.name,
    currentRole: user.role,
    requestedRole,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(ELEVATION_KEY, JSON.stringify(requests));
}

/**
 * Demo test accounts (local demo mode only — they live in this browser's
 * localStorage, never on a server). Documented in docs/testing/USER_TESTING_RC_CHECKLIST.md.
 * Disable with VITE_DEMO_ACCOUNTS=false.
 */
export const DEMO_PASSWORD = 'SeenDemo2026!';
const DEMO_ACCOUNTS: Array<Pick<User, 'id' | 'email' | 'name' | 'role'>> = [
  { id: 'user_demo_viewer', email: 'viewer@seen.demo', name: 'Demo Viewer', role: 'viewer' },
  { id: 'user_demo_creator', email: 'creator@seen.demo', name: 'Demo Creator', role: 'creator' },
  { id: 'user_demo_moderator', email: 'moderator@seen.demo', name: 'Demo Moderator', role: 'moderator' },
  { id: 'user_demo_admin', email: 'admin@seen.demo', name: 'Demo Admin', role: 'admin' },
];
const USERS_STORAGE_KEY = 'seenos_users_db';

// ============================================
// Local "database" helpers
// ============================================

function loadUsersDb(): Record<string, User> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsersDb(db: Record<string, User>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(db));
}

// Not cryptographically secure — this is a demo-mode local auth store.
// A real deployment must hash with bcrypt/argon2 server-side and never
// store or compare passwords client-side.
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'seen_salt_v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  return `tok_${crypto.randomUUID()}`;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 60_000;
const failures = new Map<string, number[]>();

function recentFailures(email: string): number[] {
  const now = Date.now();
  return (failures.get(email) ?? []).filter(t => now - t < FAILURE_WINDOW_MS);
}
function isRateLimited(email: string): boolean {
  return recentFailures(email).length >= MAX_FAILURES;
}
function recordFailure(email: string) {
  failures.set(email, [...recentFailures(email), Date.now()]);
}
function clearFailures(email: string) {
  failures.delete(email);
}

/** Demo (device-local) accounts by default; Supabase Auth when the backend is configured. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return backend.mode === 'supabase' ? <SupabaseAuthProvider>{children}</SupabaseAuthProvider> : <DemoAuthProvider>{children}</DemoAuthProvider>;
}

function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load session from localStorage on mount
  useEffect(() => {
    if (import.meta.env.VITE_DEMO_ACCOUNTS !== 'false') {
      void (async () => {
        const db = loadUsersDb();
        let changed = false;
        for (const acct of DEMO_ACCOUNTS) {
          if (db[acct.id]) continue;
          db[acct.id] = {
            ...acct,
            language: 'en',
            intent: 'explore',
            passwordHash: await hashPassword(DEMO_PASSWORD),
            createdAt: '2026-01-01T00:00:00.000Z',
          };
          changed = true;
        }
        if (changed) saveUsersDb(db);
      })();
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { accessToken, userId, expiresAt } = JSON.parse(stored);
        if (typeof expiresAt === 'number' && expiresAt < Date.now()) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false, sessionExpired: true });
          return;
        }
        const usersDb = loadUsersDb();
        const user = userId ? usersDb[userId] : null;

        if (accessToken && user) {
          setState({
            user: stripPassword(user),
            accessToken,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }

    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const stripPassword = (user: User): User => {
    const { passwordHash, ...rest } = user;
    return rest as User;
  };

  const persistSession = (accessToken: string | null, userId: string | null) => {
    if (accessToken && userId) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ accessToken, userId, expiresAt: Date.now() + SESSION_TTL_MS }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    language: Language,
    intent: UserIntent
  ) => {
    await sleep(400); // simulate network latency for realistic UX

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || !name) {
      throw new Error('Email, password, and name are required.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    const usersDb = loadUsersDb();
    const existing = Object.values(usersDb).find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email exists. Sign in instead.');
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const { role: grantedRole, pendingElevation } = resolveSignupRole(role);
    const newUser: User = {
      id: `user_${crypto.randomUUID()}`,
      email: normalizedEmail,
      name,
      role: grantedRole,
      language,
      intent,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    usersDb[newUser.id] = newUser;
    saveUsersDb(usersDb);
    if (pendingElevation) {
      recordElevationRequest(newUser, pendingElevation, 'Requested at sign-up');
    }

    const accessToken = generateToken();
    setState({
      user: stripPassword(newUser),
      accessToken,
      isLoading: false,
      isAuthenticated: true,
    });
    persistSession(accessToken, newUser.id);
  };

  const signIn = async (email: string, password: string) => {
    await sleep(400);

    const normalizedEmail = email.trim().toLowerCase();
    const usersDb = loadUsersDb();
    const user = Object.values(usersDb).find(u => u.email.toLowerCase() === normalizedEmail);

    if (isRateLimited(normalizedEmail)) {
      throw new Error(RATE_LIMITED_MESSAGE);
    }

    // One message for an unknown email and a wrong password, so the form cannot be used to find out who has an account.
    const passwordHash = await hashPassword(password);
    if (!user || user.passwordHash !== passwordHash) {
      recordFailure(normalizedEmail);
      throw new Error(WRONG_CREDENTIALS_MESSAGE);
    }
    clearFailures(normalizedEmail);

    const accessToken = generateToken();
    setState({
      user: stripPassword(user),
      accessToken,
      isLoading: false,
      isAuthenticated: true,
    });
    persistSession(accessToken, user.id);
  };

  const signOut = async () => {
    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
    persistSession(null, null);

    localStorage.removeItem('hasEnteredSEEN');
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_step');
  };

  const checkSession = async () => {
    if (!state.user) return;
    const usersDb = loadUsersDb();
    const freshUser = usersDb[state.user.id];
    if (!freshUser) {
      await signOut();
      return;
    }
    setState(prev => ({ ...prev, user: stripPassword(freshUser) }));
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) {
      throw new Error('Not authenticated');
    }

    const usersDb = loadUsersDb();
    const existing = usersDb[state.user.id];
    if (!existing) {
      throw new Error('User not found');
    }

    // Role, id, email and password are never changeable through a profile
    // update — roles change only via the elevation/approval flow.
    const { role: _role, id: _id, email: _email, passwordHash: _ph, ...safeUpdates } = updates;
    const updated: User = {
      ...existing,
      ...safeUpdates,
      id: existing.id,
      role: existing.role,
      email: existing.email,
      passwordHash: existing.passwordHash,
      updatedAt: new Date().toISOString(),
    };

    usersDb[existing.id] = updated;
    saveUsersDb(usersDb);

    setState(prev => ({ ...prev, user: stripPassword(updated) }));
  };

  const requestRoleElevation = async (requestedRole: UserRole, reason: string) => {
    if (!state.user) {
      throw new Error('Not authenticated');
    }
    // Logged for admin review; never applied immediately.
    recordElevationRequest(state.user, requestedRole, reason);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await sleep(300);
    if (!state.user) throw new Error('Not authenticated');
    if (newPassword.length < 8) throw new Error('Password must be at least 8 characters.');
    const usersDb = loadUsersDb();
    const existing = usersDb[state.user.id];
    if (!existing) throw new Error('User not found');
    const key = existing.email.toLowerCase();
    if (isRateLimited(key)) throw new Error(RATE_LIMITED_MESSAGE);
    if (existing.passwordHash !== (await hashPassword(currentPassword))) {
      recordFailure(key);
      throw new Error('Your current password is not correct.');
    }
    clearFailures(key);
    usersDb[existing.id] = { ...existing, passwordHash: await hashPassword(newPassword), updatedAt: new Date().toISOString() };
    saveUsersDb(usersDb);
  };

  const requestPasswordRecovery = async (email: string) => {
    await sleep(300);
    const usersDb = loadUsersDb();
    const user = Object.values(usersDb).find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      // Do not reveal whether the account exists
      return {};
    }
    // Demo mode: return a reset token directly instead of emailing it,
    // since no email provider is connected in this environment.
    const resetToken = generateToken();
    const key = RESET_STORAGE_KEY;
    let resets: Record<string, { userId: string; expiresAt: number }> = {};
    try {
      resets = JSON.parse(localStorage.getItem(key) || '{}');
    } catch {
      resets = {};
    }
    resets[resetToken] = { userId: user.id, expiresAt: Date.now() + 30 * 60 * 1000 };
    localStorage.setItem(key, JSON.stringify(resets));
    return { resetToken };
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await sleep(300);
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }
    let resets: Record<string, { userId: string; expiresAt: number }> = {};
    try {
      resets = JSON.parse(localStorage.getItem(RESET_STORAGE_KEY) || '{}');
    } catch {
      resets = {};
    }
    const entry = resets[token];
    if (!entry) {
      throw new Error('This reset link is not valid. Request a new one.');
    }
    if (entry.expiresAt < Date.now()) {
      delete resets[token];
      localStorage.setItem(RESET_STORAGE_KEY, JSON.stringify(resets));
      throw new Error('This reset link has expired. Request a new one.');
    }
    const usersDb = loadUsersDb();
    const user = usersDb[entry.userId];
    if (!user) {
      throw new Error('This reset link is not valid. Request a new one.');
    }
    usersDb[user.id] = { ...user, passwordHash: await hashPassword(newPassword), updatedAt: new Date().toISOString() };
    saveUsersDb(usersDb);
    // One use only.
    delete resets[token];
    localStorage.setItem(RESET_STORAGE_KEY, JSON.stringify(resets));
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        signUp,
        signIn,
        signOut,
        checkSession,
        updateProfile,
        requestRoleElevation,
        requestPasswordRecovery,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
