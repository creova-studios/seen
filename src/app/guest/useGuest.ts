import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { openGuestPrompt, type GuestPrompt } from "./guestStore";

/**
 * Gate for actions that need an account. Signed in: runs `then` now. Signed out: opens the sign-in sheet and
 * runs `then` after they sign in or sign up, so the tap is not lost.
 */
export function useGuest() {
  const { state } = useAuth();
  const isGuest = !state.isAuthenticated;
  const requireAccount = useCallback(
    (prompt: GuestPrompt, then?: () => void): boolean => {
      if (state.isAuthenticated) {
        then?.();
        return true;
      }
      openGuestPrompt(prompt, then);
      return false;
    },
    [state.isAuthenticated],
  );
  return { isGuest, requireAccount };
}
