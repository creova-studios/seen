import { describe, expect, it } from "vitest";
import { resolveBackend } from "../services/backend";

describe("backend switch", () => {
  it("defaults to demo with no configuration", () => {
    expect(resolveBackend({}).mode).toBe("demo");
  });
  it("stays on demo while the project is paused or credentials are missing", () => {
    expect(resolveBackend({ VITE_BACKEND: "supabase" }).mode).toBe("demo");
    expect(resolveBackend({ VITE_BACKEND: "supabase", VITE_SUPABASE_URL: "https://abc.supabase.co" }).mode).toBe("demo");
  });
  it("rejects a malformed URL", () => {
    expect(resolveBackend({ VITE_BACKEND: "supabase", VITE_SUPABASE_URL: "http://evil.test", VITE_SUPABASE_ANON_KEY: "k" }).mode).toBe("demo");
  });
  it("switches only when fully configured", () => {
    expect(resolveBackend({ VITE_BACKEND: "supabase", VITE_SUPABASE_URL: "https://cddipfbiqnxouvgsndly.supabase.co", VITE_SUPABASE_ANON_KEY: "k" }).mode).toBe("supabase");
  });
});
