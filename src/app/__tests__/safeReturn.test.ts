import { beforeEach, describe, expect, it } from "vitest";
import { isSafeReturn, rememberReturn, takeReturn } from "../navigation/safeReturn";

describe("return route after sign-in", () => {
  beforeEach(() => sessionStorage.clear());
  it("accepts internal hash routes only", () => {
    expect(isSafeReturn("#/story/black-atlantic")).toBe(true);
    for (const bad of ["https://evil.test", "//evil.test", "javascript:alert(1)", "#//evil.test", "#/../x", "/story/1", "", null, 5]) {
      expect(isSafeReturn(bad)).toBe(false);
    }
  });
  it("round-trips once and clears", () => {
    rememberReturn("#/story/abc");
    expect(takeReturn()).toBe("#/story/abc");
    expect(takeReturn()).toBeNull();
  });
  it("ignores unsafe values", () => {
    rememberReturn("https://evil.test");
    expect(takeReturn()).toBeNull();
  });
});
