import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoryStateProvider } from "../contexts/StoryStateContext";
import { InterestChips } from "../components/InterestChips";
import { availableInterests, storiesForInterests } from "../data/interests";

const mount = (selected: string[], onChange = vi.fn()) =>
  render(
    <StoryStateProvider>
      <InterestChips selected={selected} onChange={onChange} language="en" />
    </StoryStateProvider>,
  );

describe("InterestChips", () => {
  it("offers the most common topics to someone with no chosen interests (a guest), none of them empty", () => {
    mount([]);
    const chips = within(screen.getByRole("group", { name: "Topics" })).getAllByRole("button");
    expect(chips.length).toBeGreaterThan(2);
    expect(chips.length).toBeLessThanOrEqual(10);
    for (const c of chips) {
      expect(c).toHaveAttribute("aria-pressed", "false");
      expect(storiesForInterests([c.textContent!.trim()], "en").length).toBeGreaterThan(0);
    }
  });

  it("starts with the topics chosen at sign-up selected, even when they are not among the most common", () => {
    const rare = availableInterests().at(-1)!;
    mount([rare]);
    expect(screen.getByRole("button", { name: rare })).toHaveAttribute("aria-pressed", "true");
  });

  it("adds and removes a topic, and selecting nothing is allowed", async () => {
    const onChange = vi.fn();
    const first = availableInterests()[0];
    const { rerender } = mount([], onChange);
    await userEvent.click(screen.getByRole("button", { name: first }));
    expect(onChange).toHaveBeenLastCalledWith([first]);
    rerender(
      <StoryStateProvider>
        <InterestChips selected={[first]} onChange={onChange} language="en" />
      </StoryStateProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: first }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
