import { describe, expect, it, vi, beforeEach } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoryStateProvider } from "../contexts/StoryStateContext";
import { FollowAlongText, currentSentence, sentenceIndexAt, sentencesOf } from "../components/StoryReaderExtras";

const TEXT = "First line here. Second line follows! Third line asks? Fourth line closes.";

describe("sentence timing", () => {
  it("splits on sentence ends and maps progress to a sentence, clamped to the ends", () => {
    expect(sentencesOf(TEXT)).toHaveLength(4);
    expect(sentenceIndexAt(4, 0)).toBe(0);
    expect(sentenceIndexAt(4, 0.26)).toBe(1);
    expect(sentenceIndexAt(4, 0.99)).toBe(3);
    expect(sentenceIndexAt(4, 1)).toBe(3);
    expect(sentenceIndexAt(4, -1)).toBe(0);
    expect(sentenceIndexAt(0, 0.5)).toBe(0);
    expect(currentSentence(TEXT, 0.6)).toBe("Third line asks?");
    expect(currentSentence("", 0.5)).toBe("");
  });
});

function mount(props: { progress: number; playing: boolean; reducedMotion?: boolean }) {
  const scroller = createRef<HTMLDivElement>();
  const scrollBy = vi.spyOn(Element.prototype, "scrollBy").mockImplementation(() => {});
  const ui = (p: typeof props) => (
    <StoryStateProvider>
      <div ref={scroller}>
        <FollowAlongText text={TEXT} progress={p.progress} playing={p.playing} scroller={scroller} reducedMotion={p.reducedMotion} chapterKey="c1" />
      </div>
    </StoryStateProvider>
  );
  const view = render(ui(props));
  return { ...view, rerenderWith: (p: typeof props) => view.rerender(ui(p)), scrollBy, scroller };
}

describe("FollowAlongText", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("keeps the text readable and unlit before anything plays", () => {
    const { container } = mount({ progress: 0, playing: false });
    expect(container.textContent).toBe(TEXT);
    expect(container.querySelector("[data-current]")).toBeNull();
  });

  it("lights exactly the sentence being spoken and moves it along", () => {
    const { container, rerenderWith } = mount({ progress: 0.3, playing: true });
    expect(container.querySelector("[data-current]")!.textContent!.trim()).toBe("Second line follows!");
    rerenderWith({ progress: 0.8, playing: true });
    expect(container.querySelectorAll("[data-current]")).toHaveLength(1);
    expect(container.querySelector("[data-current]")!.textContent!.trim()).toBe("Fourth line closes.");
    expect(container.textContent).toBe(TEXT);
  });

  it("scrolls the lit sentence into view while playing, smoothly, or at once under reduced motion", () => {
    const smooth = mount({ progress: 0.3, playing: true });
    expect(smooth.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
    smooth.unmount();
    const instant = mount({ progress: 0.3, playing: true, reducedMotion: true });
    expect(instant.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });

  it("does not scroll when paused or finished", () => {
    const { scrollBy } = mount({ progress: 0.5, playing: false });
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("stops following when the reader scrolls away, and resumes from the Follow along button", async () => {
    const { scroller, scrollBy, rerenderWith } = mount({ progress: 0.3, playing: true });
    scrollBy.mockClear();
    expect(screen.queryByRole("button", { name: "Follow along" })).toBeNull();

    fireEvent.wheel(scroller.current!);
    const resume = await screen.findByRole("button", { name: "Follow along" });
    rerenderWith({ progress: 0.55, playing: true });
    expect(scrollBy).not.toHaveBeenCalled(); // the reader is in charge now

    await userEvent.click(resume);
    expect(scrollBy).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Follow along" })).toBeNull();
  });
});
