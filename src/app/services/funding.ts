import type { DeadlineState, FundingOpportunity } from "./contracts";

const DAY = 86_400_000;

/** Pure rule for a fixed deadline: open, closing soon (≤ 14 days) or closed. */
export function deadlineState(deadline: string, now: Date = new Date()): "open" | "closing-soon" | "closed" {
  const ms = new Date(deadline).getTime() - now.getTime();
  if (ms < 0) return "closed";
  if (ms <= 14 * DAY) return "closing-soon";
  return "open";
}

/** Status of an opportunity, covering rolling, upcoming and not-yet-announced intakes. */
export function opportunityStatus(
  o: Pick<FundingOpportunity, "availability" | "deadline" | "opensAt">,
  now: Date = new Date(),
): DeadlineState {
  if (o.opensAt && new Date(o.opensAt).getTime() > now.getTime()) return "upcoming";
  if (o.availability === "rolling") return "rolling";
  if (o.availability === "upcoming") return "upcoming";
  if (o.deadline) return deadlineState(o.deadline, now);
  return "tba";
}

/** Closed and "next dates not announced" both mean you can't apply right now. */
export function isApplyable(status: DeadlineState): boolean {
  return status === "open" || status === "closing-soon" || status === "rolling";
}

const fmtDate = (d: Date, timeZone = "America/Toronto") =>
  d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone });

/** Dates are shown in the funder's own time zone so "Mar 1" never becomes "Mar 2". */
export function formatDeadline(deadline: string, now: Date = new Date(), timeZone?: string): string {
  const d = new Date(deadline);
  const ms = d.getTime() - now.getTime();
  // Check the sign before rounding: Math.ceil turns "closed an hour ago" into -0, which equals 0.
  if (ms < 0) return `Closed ${fmtDate(d, timeZone)}`;
  const days = Math.ceil(ms / DAY);
  if (days === 0) return `Closes today`;
  if (days === 1) return `Closes tomorrow`;
  if (days <= 14) return `Closes in ${days} days`;
  return `Closes ${fmtDate(d, timeZone)}`;
}

export function formatStatus(o: FundingOpportunity, now: Date = new Date()): string {
  const status = opportunityStatus(o, now);
  switch (status) {
    case "rolling":
      return o.deadlineNote ?? "Rolling intake";
    case "upcoming":
      return o.opensAt ? `Opens ${fmtDate(new Date(o.opensAt), o.deadlineTimeZone)}` : o.deadlineNote ?? "Opening soon";
    case "tba":
      return o.deadlineNote ?? "Next dates not announced";
    default:
      return formatDeadline(o.deadline!, now, o.deadlineTimeZone);
  }
}

export function formatAmount(o: Pick<FundingOpportunity, "amountMin" | "amountMax" | "currency" | "amountNote">): string {
  const f = (n: number) => `$${n.toLocaleString("en-CA")}`;
  if (o.amountMax == null) return o.amountNote ?? "Amount varies";
  if (o.amountMin == null || o.amountMin === o.amountMax) return `Up to ${f(o.amountMax)} ${o.currency}`;
  return `${f(o.amountMin)}–${f(o.amountMax)} ${o.currency}`;
}
