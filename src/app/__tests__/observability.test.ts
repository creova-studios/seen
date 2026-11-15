import { describe, expect, it } from "vitest";
import { __buffer, reportError, track } from "../observability";

describe("observability", () => {
  it("drops personally identifying properties from analytics events", () => {
    track("search_performed", { results: 3, query: "my private search", email: "a@b.c", userName: "Ada" } as never);
    const last = __buffer.events.at(-1)!;
    expect(last.props).toEqual({ results: 3 });
  });

  it("returns a correlation id for errors and truncates messages", () => {
    const id = reportError(new Error("x".repeat(1000)), "test");
    const last = __buffer.errors.at(-1)!;
    expect(last.props?.id).toBe(id);
    expect(String(last.props?.message).length).toBeLessThanOrEqual(300);
  });
});
