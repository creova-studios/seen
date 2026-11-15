import { describe, expect, it, vi } from "vitest";
import { act, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { StoryStateProvider } from "../contexts/StoryStateContext";
import { AuthProvider, DEMO_PASSWORD, useAuth } from "../contexts/AuthContext";
import { GuestLayer } from "../guest/GuestLayer";
import { GuestBanner } from "../guest/GuestBanner";
import { useGuest } from "../guest/useGuest";
import { hasSeenCreatorIntro, markCreatorIntroSeen } from "../guest/creatorIntro";
import {
  dismissGuestBanner,
  dismissGuestPrompt,
  enterGuestMode,
  finishGuestAuth,
  hasChosenGuest,
  openGuestAuth,
  openGuestPrompt,
  useGuestStore,
} from "../guest/guestStore";

function Providers({ children }: { children: ReactNode }) {
  return (
    <StoryStateProvider>
      <AuthProvider>{children}</AuthProvider>
    </StoryStateProvider>
  );
}

/** Mounts the sheet next to a probe that exposes the auth state, so a test can tell when the account exists. */
function Probe() {
  const { state } = useAuth();
  return <p data-testid="auth">{state.isAuthenticated ? "signed-in" : "signed-out"}</p>;
}

function mountLayer() {
  return render(
    <Providers>
      <GuestLayer />
      <Probe />
    </Providers>,
  );
}

describe("guest store", () => {
  it("remembers the choice to explore without an account, and forgets it once an account exists", () => {
    expect(hasChosenGuest()).toBe(false);
    enterGuestMode();
    expect(hasChosenGuest()).toBe(true);
    act(() => finishGuestAuth());
    expect(hasChosenGuest()).toBe(false);
  });

  it("runs the interrupted action once after sign-in, and never after 'Not now'", () => {
    const done = vi.fn();
    act(() => openGuestPrompt({ reason: "save", subject: "Nuit" }, done));
    act(() => dismissGuestPrompt());
    act(() => finishGuestAuth());
    expect(done).not.toHaveBeenCalled();

    act(() => openGuestPrompt({ reason: "save", subject: "Nuit" }, done));
    act(() => finishGuestAuth());
    act(() => finishGuestAuth());
    expect(done).toHaveBeenCalledTimes(1);
  });

  it("keeps the banner dismissed for the session", () => {
    const { result } = renderHook(() => useGuestStore());
    expect(result.current.bannerDismissed).toBe(false);
    act(() => dismissGuestBanner());
    expect(result.current.bannerDismissed).toBe(true);
    expect(sessionStorage.getItem("seen.v1.guestBannerDismissed")).toBe("true");
  });
});

describe("useGuest", () => {
  it("opens the sheet instead of running the action for a signed-out visitor", () => {
    const action = vi.fn();
    const { result } = renderHook(() => ({ guest: useGuest(), store: useGuestStore() }), { wrapper: Providers });
    let ran = true;
    act(() => {
      ran = result.current.guest.requireAccount({ reason: "follow", subject: "Kira Chen" }, action);
    });
    expect(ran).toBe(false);
    expect(action).not.toHaveBeenCalled();
    expect(result.current.store.prompt).toEqual({ reason: "follow", subject: "Kira Chen" });
    act(() => dismissGuestPrompt());
  });

  it("runs the action straight away for a signed-in member", async () => {
    const action = vi.fn();
    const { result } = renderHook(() => ({ guest: useGuest(), auth: useAuth() }), { wrapper: Providers });
    await waitFor(() => expect(localStorage.getItem("seenos_users_db")).toContain("viewer@seen.demo"));
    await act(() => result.current.auth.signIn("viewer@seen.demo", DEMO_PASSWORD));
    act(() => {
      result.current.guest.requireAccount({ reason: "save" }, action);
    });
    expect(action).toHaveBeenCalledTimes(1);
    expect(result.current.guest.isGuest).toBe(false);
  });
});

describe("guest sheet", () => {
  it("names the story the guest tried to save and offers three ways forward", async () => {
    mountLayer();
    act(() => openGuestPrompt({ reason: "save", subject: "Voices of Migration" }));
    const sheet = await screen.findByRole("dialog");
    expect(within(sheet).getByText("Keep this story")).toBeInTheDocument();
    expect(within(sheet).getByText(/save Voices of Migration/i)).toBeInTheDocument();
    expect(within(sheet).getByRole("button", { name: "Create free account" })).toBeInTheDocument();
    expect(within(sheet).getByRole("button", { name: /i already have an account/i })).toBeInTheDocument();
    expect(within(sheet).getByRole("button", { name: /not now, keep browsing/i })).toBeInTheDocument();
    act(() => dismissGuestPrompt());
  });

  it("'Not now' closes the sheet and leaves the guest where they were", async () => {
    mountLayer();
    const done = vi.fn();
    act(() => openGuestPrompt({ reason: "library" }, done));
    await userEvent.click(await screen.findByRole("button", { name: /not now/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(done).not.toHaveBeenCalled();
    expect(screen.getByTestId("auth")).toHaveTextContent("signed-out");
  });

  it("creating an account finishes the action the guest started", async () => {
    mountLayer();
    enterGuestMode();
    const done = vi.fn();
    act(() => openGuestPrompt({ reason: "save", subject: "Nuit" }, done));
    await userEvent.click(await screen.findByRole("button", { name: "Create free account" }));

    await userEvent.type(await screen.findByLabelText("Name"), "Maya");
    await userEvent.type(screen.getByLabelText("Email"), "maya@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(screen.getByTestId("auth")).toHaveTextContent("signed-in"));
    await waitFor(() => expect(done).toHaveBeenCalledTimes(1));
    expect(hasChosenGuest()).toBe(false);
    expect(localStorage.getItem("onboarding_completed")).toBe("true");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("the sign-in path opens the form in sign-in mode and a wrong password stays on it with the error", async () => {
    mountLayer();
    act(() => openGuestPrompt({ reason: "create" }));
    await userEvent.click(await screen.findByRole("button", { name: /i already have an account/i }));
    expect(await screen.findByText("Welcome back")).toBeInTheDocument();

    await waitFor(() => expect(localStorage.getItem("seenos_users_db")).toContain("viewer@seen.demo"));
    await userEvent.type(screen.getByLabelText("Email"), "viewer@seen.demo");
    await userEvent.type(screen.getByLabelText("Password"), "not-the-password");
    await userEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/doesn't match/i);
    expect(screen.getByTestId("auth")).toHaveTextContent("signed-out");

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByText("Welcome back")).toBeNull();
  });

  it("opening the form directly works too (banner and locked tabs share the same path)", async () => {
    mountLayer();
    act(() => openGuestAuth("signup"));
    expect(await screen.findByText("Create your account")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
  });
});

describe("guest banner", () => {
  it("shows only to someone who chose to explore, and can be dismissed", async () => {
    const { rerender } = render(<Providers><GuestBanner /></Providers>);
    await waitFor(() => expect(screen.queryByRole("note")).toBeNull());

    enterGuestMode();
    rerender(<Providers><GuestBanner /></Providers>);
    const note = await screen.findByRole("note");
    expect(note).toHaveTextContent(/exploring as a guest/i);
    await userEvent.click(within(note).getByRole("button", { name: /dismiss guest notice/i }));
    await waitFor(() => expect(screen.queryByRole("note")).toBeNull());
  });
});

describe("creator intro flag", () => {
  it("is per account, and never traps someone without an id", () => {
    expect(hasSeenCreatorIntro("user_a")).toBe(false);
    markCreatorIntroSeen("user_a");
    expect(hasSeenCreatorIntro("user_a")).toBe(true);
    expect(hasSeenCreatorIntro("user_b")).toBe(false);
    expect(hasSeenCreatorIntro(undefined)).toBe(true);
  });
});
