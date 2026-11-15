/**
 * Content reports.
 *
 * People report a story or creator profile; moderators review the reports.
 * Stored on this device until the backend ships. The reporter's id is kept for
 * moderators only: the reported creator never sees who reported them.
 */

const REPORTS_KEY = "seenos_content_reports";

export const REPORT_REASONS = [
  { value: "harassment", label: "Harassment or hate", description: "Targets a person or group." },
  { value: "misinformation", label: "Misleading or false", description: "Claims presented as fact that are not." },
  { value: "rights", label: "Copyright or cultural rights", description: "Uses work or cultural material without permission." },
  { value: "sensitive", label: "Sensitive content without context", description: "Needs a warning or cultural context." },
  { value: "spam", label: "Spam or scam", description: "Advertising, impersonation or fraud." },
  { value: "other", label: "Something else", description: "Tell us more below." },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["value"];
export type ReportTarget = "story" | "creator";
export type ReportStatus = "open" | "action_taken" | "dismissed";

export interface ContentReport {
  id: string;
  targetType: ReportTarget;
  targetId: string;
  targetTitle: string;
  reason: ReportReason;
  details?: string;
  /** Visible to moderators only. */
  reporterId: string;
  createdAt: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const MAX_DETAILS = 500;

export class DuplicateReportError extends Error {
  constructor() {
    super("You already reported this. We're reviewing it.");
    this.name = "DuplicateReportError";
  }
}

function read(): ContentReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? (JSON.parse(raw) as ContentReport[]) : [];
  } catch {
    return [];
  }
}

function write(reports: ContentReport[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function submitReport(input: {
  targetType: ReportTarget;
  targetId: string;
  targetTitle: string;
  reason: ReportReason;
  details?: string;
  reporterId: string;
}): ContentReport {
  const reports = read();
  const dup = reports.find(
    r => r.status === "open" && r.reporterId === input.reporterId && r.targetType === input.targetType && r.targetId === input.targetId,
  );
  if (dup) throw new DuplicateReportError();
  const details = input.details?.trim().slice(0, MAX_DETAILS) || undefined;
  const report: ContentReport = {
    id: `report_${crypto.randomUUID()}`,
    targetType: input.targetType,
    targetId: input.targetId,
    targetTitle: input.targetTitle,
    reason: input.reason,
    details,
    reporterId: input.reporterId,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  write([report, ...reports]);
  return report;
}

export function listReports(): ContentReport[] {
  return read();
}

export function resolveReport(id: string, status: Exclude<ReportStatus, "open">, moderatorId: string): void {
  const reports = read();
  const i = reports.findIndex(r => r.id === id);
  if (i < 0) throw new Error("Report not found");
  reports[i] = { ...reports[i], status, reviewedBy: moderatorId, reviewedAt: new Date().toISOString() };
  write(reports);
}

export function reasonLabel(reason: ReportReason): string {
  return REPORT_REASONS.find(r => r.value === reason)?.label ?? reason;
}
