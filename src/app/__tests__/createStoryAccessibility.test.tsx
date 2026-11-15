import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MediaChaptersStep } from "../components/creator-flow/MediaChaptersStep";
import { ContextAccessibilityStep } from "../components/creator-flow/ContextAccessibilityStep";

const chapter = (over = {}) => ({
  id: "1",
  title: "Harbour",
  description: "",
  text: "We walked to the water.",
  estimatedDuration: 3,
  completeness: 50,
  images: ["https://example.com/a.jpg"],
  ...over,
});

describe("Create Story: image descriptions", () => {
  it("blocks Next until an attached image has a description or is marked decorative", async () => {
    render(<MediaChaptersStep onNext={vi.fn()} onBack={vi.fn()} onSaveDraft={vi.fn()} initialData={{ chapters: [chapter()] }} structureType="linear" />);
    const next = screen.getByRole("button", { name: /next: context/i });
    expect(next).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(/add a description/i);
    await userEvent.type(screen.getByLabelText(/describe this image for people who cannot see it/i), "A woman on a dock");
    expect(next).toBeEnabled();
  });

  it("accepts a decorative image without a description", async () => {
    render(<MediaChaptersStep onNext={vi.fn()} onBack={vi.fn()} onSaveDraft={vi.fn()} initialData={{ chapters: [chapter()] }} structureType="linear" />);
    await userEvent.click(screen.getByRole("checkbox", { name: /decorative/i }));
    expect(screen.getByRole("button", { name: /next: context/i })).toBeEnabled();
  });
});

describe("Create Story: content notes", () => {
  it("lets the creator pick and add content notes, and passes them on", async () => {
    const onNext = vi.fn();
    render(<ContextAccessibilityStep onNext={onNext} onBack={vi.fn()} onSaveDraft={vi.fn()} storyLanguages={["en"]} />);
    const grief = screen.getByRole("button", { name: "Grief or loss" });
    await userEvent.click(grief);
    expect(grief).toHaveAttribute("aria-pressed", "true");
    await userEvent.type(screen.getByLabelText(/add your own content note/i), "Eviction{Enter}");
    expect(screen.getByRole("button", { name: "Eviction" })).toHaveAttribute("aria-pressed", "true");
  });
});
