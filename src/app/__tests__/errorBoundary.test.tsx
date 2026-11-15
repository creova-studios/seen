import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary, crashEscape, leaveCrashedScreen } from "../components/ErrorBoundary";

describe("crash escape route", () => {
  it("leaves For You for Explore, including a blank hash", () => {
    for (const hash of ["", "#", "#/", "#/for-you", "#/for-you/", "#/for-you?x=1"]) {
      expect(crashEscape(hash)).toMatchObject({ actionLabel: "Open Explore", target: "#/explore" });
    }
  });

  it("returns every other screen to For You", () => {
    for (const hash of ["#/explore", "#/explore/creators", "#/library", "#/profile", "#/search", "#/story/midnight-resonance"]) {
      expect(crashEscape(hash)).toMatchObject({ actionLabel: "Back to For You", target: "#/for-you" });
    }
  });
});

function Boom(): never {
  throw new Error("forced screen error");
}

describe("ErrorBoundary fallback", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("labels the escape for the screen that crashed", () => {
    window.location.hash = "#/for-you";
    const { unmount } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("button", { name: /open explore/i })).toBeInTheDocument();
    expect(screen.getByText(/Open Explore to keep going/)).toBeInTheDocument();
    unmount();

    window.location.hash = "#/library";
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("button", { name: /back to for you/i })).toBeInTheDocument();
    expect(screen.getByText(/Go back to For You to keep going/)).toBeInTheDocument();
  });

  it("reloads the escape target", () => {
    const reload = vi.fn();
    const location = { hash: "#/for-you", reload };
    leaveCrashedScreen(location.hash, location);
    expect(location.hash).toBe("#/explore");
    expect(reload).toHaveBeenCalledOnce();
  });
});
