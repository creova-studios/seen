import { describe, expect, it } from "vitest";
import { currentSentence, transcriptParagraphs } from "../components/StoryReaderExtras";

describe("transcript and captions", () => {
  it("splits one block into two-sentence paragraphs and keeps authored paragraphs", () => {
    expect(transcriptParagraphs("One. Two. Three. Four. Five.")).toEqual(["One. Two.", "Three. Four.", "Five."]);
    expect(transcriptParagraphs("First para.\n\nSecond para.")).toEqual(["First para.", "Second para."]);
    expect(transcriptParagraphs("No punctuation")).toEqual(["No punctuation"]);
  });
  it("follows the device voice by progress and never goes out of range", () => {
    const text = "A. B. C. D.";
    expect(currentSentence(text, 0)).toBe("A.");
    expect(currentSentence(text, 0.6)).toBe("C.");
    expect(currentSentence(text, 1)).toBe("D.");
    expect(currentSentence("", 0.5)).toBe("");
  });
});
