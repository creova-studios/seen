import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./primitives";

describe("IconButton badge", () => {
  it("puts the visible count in the accessible name as its own word (WCAG 2.5.3)", () => {
    render(<IconButton label="Notifications" badge={3}>x</IconButton>);
    const btn = screen.getByRole("button", { name: "Notifications 3 unread" });
    expect(btn.textContent).toContain("3");
    expect(btn.getAttribute("aria-label")?.split(/\s+/)).toContain("3");
  });

  it("names the capped badge the way it is shown", () => {
    render(<IconButton label="Notifications" badge={12}>x</IconButton>);
    const btn = screen.getByRole("button", { name: "Notifications 9+ unread" });
    expect(btn.textContent).toContain("9+");
  });

  it("has no count in the name when there is nothing unread", () => {
    render(<IconButton label="Notifications" badge={0}>x</IconButton>);
    expect(screen.getByRole("button", { name: "Notifications" })).toBeTruthy();
  });
});
