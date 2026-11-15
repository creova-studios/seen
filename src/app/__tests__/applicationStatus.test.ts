import { describe, expect, it } from "vitest";
import { canSet, OUTCOMES, statusLabel } from "../services/applicationStatus";

describe("G3 truthful statuses", () => {
  it("walks the user's own steps in order", () => {
    expect(canSet(null, "eligibility_checked")).toBe(true);
    expect(canSet(null, "ready")).toBe(false);
    expect(canSet("eligibility_checked", "draft")).toBe(true);
    expect(canSet("draft", "ready")).toBe(true);
    expect(canSet("ready", "submitted_by_me")).toBe(true);
  });
  it("records no funder outcome before the user marks it submitted", () => {
    for (const o of OUTCOMES) {
      expect(canSet(null, o)).toBe(false);
      expect(canSet("ready", o)).toBe(false);
      expect(canSet("submitted_by_me", o)).toBe(true);
    }
  });
  it("labels every outcome as tracked by the user", () => {
    for (const o of OUTCOMES) expect(statusLabel(o)).toMatch(/tracked by you$/);
    expect(statusLabel("submitted_by_me")).toBe("Submitted (marked by you)");
  });
  it("does not step back into user steps after an outcome", () => {
    expect(canSet("approved", "draft")).toBe(false);
  });
});
