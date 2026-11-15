import { describe, expect, it } from "vitest";
import { isExternalHandoff, isInternalUrl, originOf } from "../../../mobile/src/navigation";

const BASE = "https://seen-sigma-eight.vercel.app";

describe("native shell link rules", () => {
  it("keeps SEEN's own pages (any path, query or hash) inside the app", () => {
    expect(isInternalUrl(`${BASE}/`, BASE)).toBe(true);
    expect(isInternalUrl(`${BASE}/#/story/midnight-resonance`, BASE)).toBe(true);
    expect(isInternalUrl(`${BASE}/s/abc?x=1`, BASE)).toBe(true);
    expect(isInternalUrl("about:blank", BASE)).toBe(true);
  });

  it("sends every other site out to the system browser, including look-alike hosts", () => {
    expect(isInternalUrl("https://example.com/", BASE)).toBe(false);
    expect(isInternalUrl("https://seen-sigma-eight.vercel.app.evil.com/", BASE)).toBe(false);
    expect(isInternalUrl("http://seen-sigma-eight.vercel.app/", BASE)).toBe(false);
    expect(isInternalUrl("javascript:alert(1)", BASE)).toBe(false);
  });

  it("only hands web, mail, phone and sms links to the phone", () => {
    for (const ok of ["https://example.com", "mailto:hello@example.com", "tel:+15555550100", "sms:+15555550100"]) expect(isExternalHandoff(ok)).toBe(true);
    for (const bad of ["javascript:alert(1)", "file:///etc/passwd", "intent://x#Intent;end", "data:text/html,hi"]) expect(isExternalHandoff(bad)).toBe(false);
  });

  it("reads origins case-insensitively and rejects non-URLs", () => {
    expect(originOf("HTTPS://SEEN-SIGMA-EIGHT.vercel.app/x")).toBe(BASE);
    expect(originOf("not a url")).toBeNull();
  });
});
