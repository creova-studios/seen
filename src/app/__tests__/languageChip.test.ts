import { describe, expect, it } from "vitest";
import { languageChipText } from "../components/seen/languageChip";

describe("language chip (E2)", () => {
  it("shows nothing without a languages field", () => {
    expect(languageChipText(undefined, "en")).toBeNull();
    expect(languageChipText([], "en")).toBeNull();
  });
  it("puts the viewer's language first", () => {
    expect(languageChipText(["en", "fr"], "fr")).toBe("FR · EN");
    expect(languageChipText(["en"], "fr")).toBe("EN");
  });
  it("collapses three or more to stay narrow", () => {
    expect(languageChipText(["en", "fr", "es"], "es")).toBe("ES +2");
  });
});
