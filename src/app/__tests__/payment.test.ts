import { describe, expect, it, vi } from "vitest";
import { processPayment } from "../data/paymentService";

describe("demo payment gateway", () => {
  const base = { amount: 500, cardExpiry: "12/30", cardCvc: "123", cardholderName: "T" };
  const run = async (cardNumber: string) => {
    vi.useFakeTimers();
    const p = processPayment({ ...base, cardNumber });
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    return p;
  };
  it("accepts the documented test card", async () => {
    expect((await run("4242 4242 4242 4242")).success).toBe(true);
  });
  it("declines the decline test card", async () => {
    expect(await run("4000 0000 0000 0002")).toMatchObject({ success: false, errorMessage: /declined/ });
  });
  it("never reports success for any other (possibly real) card", async () => {
    expect(await run("5555 5555 5555 4444")).toMatchObject({ success: false, errorMessage: /test cards only/ });
  });
});
