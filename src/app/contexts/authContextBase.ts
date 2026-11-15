import { createContext } from 'react';
import type { UserRole, Language, UserIntent } from './StoryStateContext';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: Language;
  intent: UserIntent;
  /** Up to 280 characters, written by the person in Edit profile. */
  bio?: string;
  passwordHash?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True when a stored session was found but had passed its expiry. */
  sessionExpired?: boolean;
}

export interface AuthContextType {
  state: AuthState;
  signUp: (email: string, password: string, name: string, role: UserRole, language: Language, intent: UserIntent) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  requestRoleElevation: (requestedRole: UserRole, reason: string) => Promise<void>;
  requestPasswordRecovery: (email: string) => Promise<{ resetToken?: string }>;
  /** Sets a new password from a reset token. Rejects with a readable message when the token is invalid or expired. */
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  /** Verifies the current password, then sets a new one. Rejects with a readable message. */
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  /** Present only when Google sign-in is configured (Supabase backend). Redirects away to Google. */
  signInWithGoogle?: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const WRONG_CREDENTIALS_MESSAGE = "That email or password doesn't match. Check and try again.";
export const RATE_LIMITED_MESSAGE = "Too many attempts. Wait a minute and try again.";
