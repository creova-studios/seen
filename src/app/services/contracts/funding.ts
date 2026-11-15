import type { ISODate } from "./common";
import type { TrackedOutcome } from "../applicationStatus";

// ----------------------------------------------------------------- Funding
export type OpportunityType = "grant" | "residency" | "commission" | "fellowship" | "fund" | "lab" | "pitch";
export type EligibilityAnswer = "yes" | "no" | "unsure";
export type ApplicationStatus = "none" | "saved" | "in-progress" | "applied";
/**
 * open / closing-soon / closed — fixed deadline, computed against now.
 * rolling  — apply any time (e.g. before your project starts).
 * upcoming — intake announced but not open yet.
 * tba      — recurring programme whose next dates the funder hasn't confirmed.
 */
export type DeadlineState = "open" | "closing-soon" | "closed" | "rolling" | "upcoming" | "tba";
export type Availability = "deadline" | "rolling" | "upcoming" | "tba";

export interface FundingOpportunity {
  id: string;
  title: string;
  funder: string;
  type: OpportunityType;
  /** null when the funder publishes no single figure; see amountNote. */
  amountMin: number | null;
  amountMax: number | null;
  amountNote?: string;
  currency: "CAD";
  availability: Availability;
  /** Only set when the funder has published the date. Never estimated. */
  deadline: ISODate | null;
  opensAt?: ISODate | null;
  /** IANA zone the funder publishes the deadline in (default America/Toronto). */
  deadlineTimeZone?: string;
  deadlineNote?: string;
  region: string;
  summary: string;
  eligibility: string[];
  disciplines: string[];
  languages: string[];
  steps: string[];        // application checklist shown on the detail screen
  applyUrl: string;       // funder's official programme page
  sourceUrls: string[];   // where each fact was verified
  verifiedAt: ISODate;    // when SEEN last checked the listing
  isDemo: boolean;        // demo listings are always labelled in the UI
  orgId: string | null;
}

export interface ApplicationState {
  opportunityId: string;
  status: ApplicationStatus;
  completedSteps: number[];
  /** What the funder told the user, recorded by the user. SEEN receives no funder decisions. */
  outcome?: TrackedOutcome | null;
  /** The user's own answer per listed eligibility criterion (index in `eligibility`). Self-assessed, never a determination. */
  eligibilityAnswers?: Record<number, EligibilityAnswer>;
  /** Private notes the user keeps about this application. */
  notes?: string;
  updatedAt: ISODate;
}

export interface FundingApi {
  list(): Promise<FundingOpportunity[]>;
  get(id: string): Promise<FundingOpportunity>;
  listApplications(): Promise<ApplicationState[]>;
  getApplication(id: string): Promise<ApplicationState>;
  updateApplication(id: string, patch: Partial<Pick<ApplicationState, "status" | "completedSteps" | "outcome" | "eligibilityAnswers" | "notes">>): Promise<ApplicationState>;
}
