/**
 * PAYMENT PROCESSING — MOCK GATEWAY
 *
 * Simulates a card-based checkout (Stripe-shaped request/response) so the
 * full purchase → subscribe → cancel → refund flow works end-to-end for
 * demos without live payment credentials. Swap `processPayment` for a real
 * Stripe PaymentIntent call server-side when ready — the CheckoutRequest/
 * CheckoutResult contract is designed to survive that swap unchanged.
 *
 * Test cards (mock):
 *   4242 4242 4242 4242 → always succeeds
 *   4000 0000 0000 0002 → always declined
 *   anything else       → rejected: demo mode never pretends to charge a real card
 */

export interface CheckoutRequest {
  amount: number; // USD cents
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardholderName: string;
}

export interface CheckoutResult {
  success: boolean;
  last4: string;
  errorMessage?: string;
  processedAt: string;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(digits);
}

export function isValidExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryDate = new Date(year, month, 0);
  return expiryDate >= now;
}

export function isValidCvc(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc);
}

export async function processPayment(request: CheckoutRequest): Promise<CheckoutResult> {
  // Simulate network latency of a real payment processor
  await sleep(1200);

  const digits = request.cardNumber.replace(/\s/g, '');
  const last4 = digits.slice(-4);

  if (!isValidCardNumber(request.cardNumber)) {
    return { success: false, last4, errorMessage: 'Invalid card number.', processedAt: new Date().toISOString() };
  }
  if (!isValidExpiry(request.cardExpiry)) {
    return { success: false, last4, errorMessage: 'Card has expired or expiry date is invalid.', processedAt: new Date().toISOString() };
  }
  if (!isValidCvc(request.cardCvc)) {
    return { success: false, last4, errorMessage: 'Invalid security code.', processedAt: new Date().toISOString() };
  }

  // Simulated decline test card
  if (digits === '4000000000000002') {
    return { success: false, last4, errorMessage: 'Your card was declined.', processedAt: new Date().toISOString() };
  }

  if (!DEMO_TEST_CARDS.has(digits)) {
    return {
      success: false,
      last4,
      errorMessage: 'Demo mode accepts test cards only — use 4242 4242 4242 4242. No real card is ever charged here.',
      processedAt: new Date().toISOString(),
    };
  }

  return { success: true, last4, processedAt: new Date().toISOString() };
}

// A real card number must never produce a (fake) success.
export const DEMO_TEST_CARDS = new Set(['4242424242424242']);

export async function processRefund(transactionId: string, amount: number): Promise<{ success: boolean }> {
  await sleep(800);
  return { success: true };
}
