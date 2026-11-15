import { beforeEach, describe, expect, it } from "vitest";
import { DuplicateReportError, listReports, resolveReport, submitReport } from "../data/reportService";

const base = { targetType: "story" as const, targetId: "s1", targetTitle: "A story", reason: "spam" as const, reporterId: "u1" };

beforeEach(() => localStorage.clear());

describe("content reports", () => {
  it("stores a report as open and trims details", () => {
    const r = submitReport({ ...base, details: "  looks fake  " });
    expect(r.status).toBe("open");
    expect(listReports()[0].details).toBe("looks fake");
  });

  it("caps details at 500 characters", () => {
    const r = submitReport({ ...base, details: "x".repeat(900) });
    expect(r.details).toHaveLength(500);
  });

  it("rejects a second open report on the same target by the same person", () => {
    submitReport(base);
    expect(() => submitReport(base)).toThrow(DuplicateReportError);
    expect(() => submitReport({ ...base, reporterId: "u2" })).not.toThrow();
  });

  it("allows a new report once the earlier one is resolved", () => {
    const r = submitReport(base);
    resolveReport(r.id, "dismissed", "mod1");
    expect(listReports()[0]).toMatchObject({ status: "dismissed", reviewedBy: "mod1" });
    expect(() => submitReport(base)).not.toThrow();
  });

  it("throws when resolving an unknown report", () => {
    expect(() => resolveReport("nope", "dismissed", "mod1")).toThrow();
  });
});
