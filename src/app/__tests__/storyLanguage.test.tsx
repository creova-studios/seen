import { describe, expect, it } from "vitest";
import { languageCodesLine, languageNamesList, substitutedLanguage } from "../components/seen/languageChip";
import { translate } from "../i18n/strings";

describe("story language helpers (11A)", () => {
  it("lists the codes in catalogue order, and says nothing without a languages field", () => {
    expect(languageCodesLine(["en", "fr", "es"])).toBe("EN · FR · ES");
    expect(languageCodesLine(["fr", "fr"])).toBe("FR");
    expect(languageCodesLine(undefined)).toBeNull();
    expect(languageCodesLine([])).toBeNull();
  });

  it("builds full names for assistive tech in each interface language", () => {
    expect(languageNamesList(["English"], " and ")).toBe("English");
    expect(languageNamesList(["English", "Français"], translate("list.and", "en"))).toBe("English and Français");
    expect(languageNamesList(["English", "Français", "Español"], translate("list.and", "fr"))).toBe("English, Français et Español");
    expect(languageNamesList(["English", "Español"], translate("list.and", "es"))).toBe("English y Español");
  });

  it("names the substituted language only when the viewer's language is missing: English first, else the first available", () => {
    expect(substitutedLanguage(["en", "fr"], "fr")).toBeNull();
    expect(substitutedLanguage(["en"], "fr")).toBe("en");
    expect(substitutedLanguage(["es", "fr"], "en")).toBe("es");
    expect(substitutedLanguage(undefined, "fr")).toBeNull();
  });

  it("writes the notice and the story line in all three languages", () => {
    expect(translate("story.fallback", "en", { shown: "English", wanted: "Français" })).toBe("Shown in English. Not yet available in Français.");
    expect(translate("story.fallback", "fr", { shown: "English", wanted: "Español" })).toContain("Pas encore disponible en Español");
    expect(translate("story.available", "es", { list: "EN · FR" })).toBe("Disponible en EN · FR");
    expect(translate("search.language", "en")).toBe("Story language");
  });
});
