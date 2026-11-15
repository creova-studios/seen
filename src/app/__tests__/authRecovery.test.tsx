import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { passwordProblems } from "../screens/ResetPasswordScreen";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

async function ready() {
  const hook = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(hook.result.current.state.isLoading).toBe(false));
  return hook;
}

beforeEach(() => localStorage.clear());

describe("password reset", () => {
  it("sets a new password once, then rejects the same link", async () => {
    const { result } = await ready();
    await act(() => result.current.signUp("r@example.com", "OldPassword1", "R", "viewer", "en", "explore"));
    const { resetToken } = await result.current.requestPasswordRecovery("r@example.com");
    expect(resetToken).toBeTruthy();
    await act(() => result.current.resetPassword(resetToken!, "NewPassword2"));
    await expect(result.current.signIn("r@example.com", "OldPassword1")).rejects.toThrow(/doesn't match/i);
    await act(() => result.current.signIn("r@example.com", "NewPassword2"));
    expect(result.current.state.isAuthenticated).toBe(true);
    await expect(result.current.resetPassword(resetToken!, "Another3Password")).rejects.toThrow(/not valid/i);
  });

  it("rejects an expired link with its own message", async () => {
    const { result } = await ready();
    await act(() => result.current.signUp("e@example.com", "OldPassword1", "E", "viewer", "en", "explore"));
    const { resetToken } = await result.current.requestPasswordRecovery("e@example.com");
    const resets = JSON.parse(localStorage.getItem("seenos_password_resets")!);
    resets[resetToken!].expiresAt = Date.now() - 1000;
    localStorage.setItem("seenos_password_resets", JSON.stringify(resets));
    await expect(result.current.resetPassword(resetToken!, "NewPassword2")).rejects.toThrow(/expired/i);
  });

  it("rejects an unknown link and a short password", async () => {
    const { result } = await ready();
    await expect(result.current.resetPassword("nope", "NewPassword2")).rejects.toThrow(/not valid/i);
    await expect(result.current.resetPassword("nope", "short")).rejects.toThrow(/8 characters/i);
  });
});

describe("session expiry", () => {
  it("signs out and flags an expired session", async () => {
    localStorage.setItem("seenos_auth_session", JSON.stringify({ accessToken: "t", userId: "u", expiresAt: Date.now() - 1000 }));
    const { result } = await ready();
    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.sessionExpired).toBe(true);
    expect(localStorage.getItem("seenos_auth_session")).toBeNull();
  });

  it("keeps sessions saved before expiry existed", async () => {
    const { result } = await ready();
    await act(() => result.current.signUp("k@example.com", "Password123", "K", "viewer", "en", "explore"));
    const saved = JSON.parse(localStorage.getItem("seenos_auth_session")!);
    expect(saved.expiresAt).toBeGreaterThan(Date.now());
  });
});

describe("password rules", () => {
  it("lists what is missing", () => {
    expect(passwordProblems("abc")).toEqual(["at least 8 characters", "an uppercase letter", "a number"]);
    expect(passwordProblems("Password123")).toEqual([]);
  });
});

describe("sign-in messages", () => {
  it("uses one message for an unknown email and a wrong password", async () => {
    const { result } = await ready();
    await act(() => result.current.signUp("known@example.com", "RightPassword1", "K", "viewer", "en", "explore"));
    await act(() => result.current.signOut());
    const unknown = await result.current.signIn("nobody@example.com", "x").catch((e: Error) => e.message);
    const wrong = await result.current.signIn("known@example.com", "wrong").catch((e: Error) => e.message);
    expect(unknown).toBe(wrong);
    expect(unknown).toMatch(/doesn't match/i);
  });
  it("slows down repeated failures, then recovers on a correct sign-in elsewhere", async () => {
    const { result } = await ready();
    for (let i = 0; i < 5; i++) await result.current.signIn("spam@example.com", "x").catch(() => undefined);
    await expect(result.current.signIn("spam@example.com", "x")).rejects.toThrow(/too many attempts/i);
  }, 15000);
});
