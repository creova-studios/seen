/**
 * G3 application statuses (DS6). SEEN only knows what the user does: the first four are
 * user actions; funder outcomes are recorded by the user and always labelled "tracked by you".
 */
export type UserStatus = "eligibility_checked" | "draft" | "ready" | "submitted_by_me";
export type TrackedOutcome = "under_review" | "info_requested" | "shortlisted" | "approved" | "declined";
export type TrackedStatus = UserStatus | TrackedOutcome;

const ORDER: UserStatus[] = ["eligibility_checked", "draft", "ready", "submitted_by_me"];
export const OUTCOMES: TrackedOutcome[] = ["under_review", "info_requested", "shortlisted", "approved", "declined"];

/** True when `next` can be recorded from `current`. Outcomes need "submitted_by_me" first; user steps never go backwards except to draft. */
export function canSet(current: TrackedStatus | null, next: TrackedStatus): boolean {
  if ((OUTCOMES as string[]).includes(next)) {
    return current === "submitted_by_me" || (OUTCOMES as string[]).includes(current ?? "");
  }
  if (current && (OUTCOMES as string[]).includes(current)) return false;
  const from = current ? ORDER.indexOf(current as UserStatus) : -1;
  const to = ORDER.indexOf(next as UserStatus);
  return to === from + 1 || next === "draft";
}

export function statusLabel(s: TrackedStatus): string {
  const base: Record<TrackedStatus, string> = {
    eligibility_checked: "Eligibility checked",
    draft: "Draft",
    ready: "Ready to submit",
    submitted_by_me: "Submitted (marked by you)",
    under_review: "Under review",
    info_requested: "Info requested",
    shortlisted: "Shortlisted",
    approved: "Approved",
    declined: "Declined",
  };
  return (OUTCOMES as string[]).includes(s) ? `${base[s]} · tracked by you` : base[s];
}
