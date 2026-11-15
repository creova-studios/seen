import { describe, expect, it } from "vitest";
import { AuthError, findAccount, passwordChecks, signIn, signUp, type Account, type AccountStore } from "../../../mobile/src/native/auth";

const memory = (): AccountStore & { rows: Account[] } => {
  const s = { rows: [] as Account[], load: async () => s.rows, save: async (a: Account[]) => void (s.rows = a) };
  return s;
};
const hash = async (t: string) => `h(${t.length}:${[...t].reduce((n, c) => (n * 31 + c.charCodeAt(0)) | 0, 7)})`;
let n = 0;
const id = () => `u${++n}`;
const good = { name: "Maya", email: "Maya@Example.com", password: "Password123" };
const code = async (p: Promise<unknown>) => p.then(() => "ok", (e: AuthError) => e.code);

describe("native accounts", () => {
  it("checks passwords the way the website does", () => {
    expect(passwordChecks("Password123").ok).toBe(true);
    expect(passwordChecks("password123")).toMatchObject({ upper: false, ok: false });
    expect(passwordChecks("Pass1")).toMatchObject({ length: false, ok: false });
  });

  it("signs up, never stores the password as typed, and signs in with any email casing", async () => {
    const store = memory();
    const me = await signUp(store, hash, good, id);
    expect(me).toMatchObject({ name: "Maya", email: "maya@example.com" });
    expect(JSON.stringify(store.rows)).not.toContain("Password123");
    expect(await signIn(store, hash, "  MAYA@example.com ", "Password123")).toEqual(me);
    expect(await findAccount(store, me.id)).toEqual(me);
    expect(await findAccount(store, "nobody")).toBeNull();
  });

  it("rejects duplicates, weak passwords and bad input", async () => {
    const store = memory();
    await signUp(store, hash, good, id);
    expect(await code(signUp(store, hash, { ...good, email: "maya@example.com" }, id))).toBe("exists");
    expect(await code(signUp(store, hash, { ...good, email: "b@example.com", password: "weak" }, id))).toBe("weak");
    expect(await code(signUp(store, hash, { ...good, email: "not-an-email" }, id))).toBe("invalid");
    expect(await code(signUp(store, hash, { ...good, name: " ", email: "c@example.com" }, id))).toBe("invalid");
    expect(store.rows).toHaveLength(1);
  });

  it("gives one answer for a wrong password and an unknown email", async () => {
    const store = memory();
    await signUp(store, hash, good, id);
    expect(await code(signIn(store, hash, "maya@example.com", "Wrong-pass1"))).toBe("wrong");
    expect(await code(signIn(store, hash, "nobody@example.com", "Password123"))).toBe("wrong");
  });
});
