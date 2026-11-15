import { describe, expect, it } from "vitest";
import { STRINGS, translate, type StringKey } from "../i18n/strings";

const slots = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");

describe("i18n strings", () => {
  const entries = Object.entries(STRINGS) as [StringKey, Record<"en" | "fr" | "es", string>][];
  it("has English, French and Spanish for every key", () => {
    for (const [key, v] of entries) for (const l of ["en", "fr", "es"] as const) expect(v[l], `${key}.${l}`).toBeTruthy();
  });
  it("keeps placeholders identical across languages", () => {
    for (const [key, v] of entries) {
      expect(slots(v.fr), key).toBe(slots(v.en));
      expect(slots(v.es), key).toBe(slots(v.en));
    }
  });
  it("substitutes placeholders and falls back to English for an unknown language", () => {
    expect(translate("note.desc", "fr", { title: "Nuit" })).toContain("Nuit");
    expect(translate("note.send", "de")).toBe("Send note");
  });
});

import { localizeError } from "../i18n/strings";
import { WRONG_CREDENTIALS_MESSAGE, RATE_LIMITED_MESSAGE } from "../contexts/authContextBase";

describe("sign-in errors", () => {
  it("translates the messages we author and leaves others alone", () => {
    expect(localizeError(WRONG_CREDENTIALS_MESSAGE, "fr")).toMatch(/ne correspond pas/);
    expect(localizeError(RATE_LIMITED_MESSAGE, "es")).toMatch(/Demasiados/);
    expect(localizeError(WRONG_CREDENTIALS_MESSAGE, "en")).toBe(WRONG_CREDENTIALS_MESSAGE);
    expect(localizeError("Something else", "fr")).toBe("Something else");
  });
});
