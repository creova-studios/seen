import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FirstScreenBackdrop } from "../components/FirstScreenBackdrop";

describe("FirstScreenBackdrop", () => {
  it("is decoration only: hidden from assistive tech, not clickable, and has no text, links or media controls", () => {
    const { container } = render(<FirstScreenBackdrop reduce={false} />);
    const root = screen.getByTestId("first-screen-backdrop");
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.className).toContain("pointer-events-none");
    expect(container.textContent).toBe("");
    expect(container.querySelector("video, audio, a, button")).toBeNull();
  });

  it("starts with one image of a real story, so the screen is not held up by a gallery", () => {
    const { container } = render(<FirstScreenBackdrop reduce={false} />);
    expect(container.querySelectorAll("[data-slide]").length).toBe(1);
    expect(container.querySelector("[data-slide=active] img")?.getAttribute("src")).toMatch(/^https:\/\//);
  });

  it("with reduced motion it stays one still image with no zoom", () => {
    const { container } = render(<FirstScreenBackdrop reduce />);
    expect(container.querySelectorAll("img").length).toBe(1);
    expect(container.querySelector(".seen-kenburns")).toBeNull();
  });
});
