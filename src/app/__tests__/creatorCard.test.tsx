import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatorCard, creatorCover } from "../components/seen/cards";
import type { Creator } from "../services/contracts";

const creator: Creator = {
  id: "kira-chen",
  name: "Kira Chen",
  bio: "A storyteller.",
  themes: ["Community Stories", "Music & Sound", "Urban Culture"],
  storyIds: ["midnight-resonance"],
  languages: ["en", "fr"],
  orgId: null,
};

describe("CreatorCard", () => {
  it("is one tap target showing the name, at most two themes and the story count", async () => {
    const onOpen = vi.fn();
    render(<CreatorCard creator={creator} onOpen={onOpen} />);
    const card = screen.getByTestId("creator-card");
    expect(within(card).getByRole("heading", { name: "Kira Chen" })).toBeInTheDocument();
    expect(within(card).getAllByRole("listitem").map(li => li.textContent)).toEqual(["Community Stories", "Music & Sound"]);
    expect(card).toHaveTextContent(/1 story/i);
    expect(within(card).queryByText("Following")).toBeNull();
    await userEvent.click(card);
    expect(onOpen).toHaveBeenCalledWith("kira-chen");
  });

  it("says Following in the status corner for someone you follow", () => {
    render(<CreatorCard creator={creator} following onOpen={() => {}} />);
    expect(screen.getByText("Following")).toBeInTheDocument();
  });

  it("uses the first catalogue story's cover as the banner, and nothing when there is none", () => {
    expect(creatorCover(creator)).toMatch(/^https?:\/\//);
    expect(creatorCover({ ...creator, storyIds: [] })).toBeUndefined();
    expect(creatorCover({ ...creator, storyIds: ["no-such-story"] })).toBeUndefined();
  });
});
