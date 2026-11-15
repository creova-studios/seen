import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, DEMO_PASSWORD, resolveSignupRole, useAuth } from "../contexts/AuthContext";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe("sign-up role policy", () => {
  it("grants only self-assignable roles", () => {
    expect(resolveSignupRole("viewer")).toEqual({ role: "viewer", pendingElevation: null });
    expect(resolveSignupRole("creator")).toEqual({ role: "creator", pendingElevation: null });
    expect(resolveSignupRole("moderator")).toEqual({ role: "viewer", pendingElevation: "moderator" });
    expect(resolveSignupRole("admin")).toEqual({ role: "viewer", pendingElevation: "admin" });
  });

  it("creates a viewer + pending request when signing up as moderator", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.state.isLoading).toBe(false));
    await act(() => result.current.signUp("mod@example.com", "Password123", "Mod", "moderator", "en", "explore"));
    expect(result.current.state.user?.role).toBe("viewer");
    const requests = JSON.parse(localStorage.getItem("seenos_role_elevation_requests")!);
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({ requestedRole: "moderator", status: "pending" });
  });

  it("ignores role changes in profile updates", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.state.isLoading).toBe(false));
    await act(() => result.current.signUp("v@example.com", "Password123", "V", "viewer", "en", "explore"));
    await act(() => result.current.updateProfile({ role: "admin", name: "Renamed" }));
    expect(result.current.state.user).toMatchObject({ role: "viewer", name: "Renamed" });
  });

  it("seeds role-specific demo accounts that can sign in", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(localStorage.getItem("seenos_users_db")).toContain("admin@seen.demo"));
    await act(() => result.current.signIn("admin@seen.demo", DEMO_PASSWORD));
    expect(result.current.state.user?.role).toBe("admin");
    await expect(result.current.signIn("admin@seen.demo", "wrong")).rejects.toThrow(/doesn't match/i);
  });
});
