/**
 * Artist Onboarding, Story Intake, Rights Grants & Editorial Review Contracts (Phase 3 & 5).
 *
 * Content State Machine:
 *   draft -> submitted -> in_review -> changes_requested -> approved -> published
 *   plus rejected, unpublished, withdrawn, removed.
 */

export type StoryLifecycleStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "rejected"
  | "unpublished"
  | "withdrawn"
  | "removed";

export type EditorialDecisionStatus =
  | "in_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "rejected"
  | "unpublished"
  | "removed";

export interface ArtistInvitation {
  id: string;
  invitedEmail: string;
  grantedRole: "creator" | "moderator";
  expiresAt: string;
  redeemedBy?: string;
  redeemedAt?: string;
  createdAt: string;
}

export interface RightsGrantInput {
  storyId: string;
  termsVersion?: string;
  confirmsOriginalWork: boolean;
  grantsNonExclusiveLicense: boolean;
  confirmsThirdPartyConsents: boolean;
  allowTranslation: boolean;
  allowAudioNarration: boolean;
  attributionName: string;
}

export interface RightsGrant extends RightsGrantInput {
  id: string;
  authorId: string;
  termsVersion: string;
  createdAt: string;
}

export interface IntakeChapterInput {
  position: number;
  title: string;
  body: string;
}

export interface IntakeChapter extends IntakeChapterInput {
  id: string;
  storyId: string;
}

export interface IntakeStoryDraftInput {
  id?: string;
  title: string;
  summary: string;
  coverUrl?: string;
  languages: string[];
  themes?: string[];
  intendedAudience?: string;
  contentWarnings?: string[];
  chapters: IntakeChapterInput[];
}

export interface IntakeStoryRecord {
  id: string;
  authorId: string;
  title: string;
  summary: string;
  coverUrl?: string;
  languages: string[];
  themes: string[];
  intendedAudience: string;
  contentWarnings: string[];
  status: StoryLifecycleStatus;
  version: number;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  publishedAt?: string;
  createdAt: string;
  chapters: IntakeChapter[];
}

export interface StoryReviewEvent {
  id: string;
  storyId: string;
  reviewerId?: string;
  fromStatus: StoryLifecycleStatus;
  toStatus: EditorialDecisionStatus;
  editorialNotes: string;
  createdAt: string;
}

export interface IntakeApi {
  /** Staff-only: create a single-use artist invitation token for an email (or '*' pilot code). */
  createInvitation(input: {
    rawToken: string;
    invitedEmail?: string;
    grantedRole?: "creator" | "moderator";
    validDays?: number;
  }): Promise<ArtistInvitation>;

  /** Authenticated user: redeem an invitation token to receive the granted role ('creator' | 'moderator'). */
  redeemInvitation(rawToken: string): Promise<{ grantedRole: "creator" | "moderator" }>;

  /** Creator: create or update a story draft (allowed only while in 'draft' or 'changes_requested'). */
  saveDraft(input: IntakeStoryDraftInput): Promise<IntakeStoryRecord>;

  /** Creator: record an immutable copyright & license attestation for a story draft. */
  recordRightsGrant(input: RightsGrantInput): Promise<RightsGrant>;

  /** Creator: submit a draft (with >=1 chapter and a recorded rights grant) for editorial review. */
  submitForReview(storyId: string): Promise<IntakeStoryRecord>;

  /** Staff (moderator/admin): transition a submitted story through editorial review. */
  reviewSubmission(input: {
    storyId: string;
    nextStatus: EditorialDecisionStatus;
    editorialNotes?: string;
  }): Promise<IntakeStoryRecord>;

  /** Creator: withdraw their own story from review or publication (`status = 'withdrawn'`). */
  withdrawStory(storyId: string): Promise<IntakeStoryRecord>;

  /** Creator: list their own stories across all statuses; Staff: optionally list all submissions. */
  listMyStories(): Promise<IntakeStoryRecord[]>;

  /** Staff: list stories in the editorial review queue (`submitted`, `in_review`, `changes_requested`, `approved`). */
  listReviewQueue(): Promise<IntakeStoryRecord[]>;

  /** Public / Reader: list only `published` stories from the intake repository. */
  listPublishedStories(): Promise<IntakeStoryRecord[]>;

  /** Read review history for a story (visible to story author or staff). */
  listStoryReviews(storyId: string): Promise<StoryReviewEvent[]>;
}
