import type {
  ArtistInvitation,
  EditorialDecisionStatus,
  IntakeApi,
  IntakeStoryDraftInput,
  IntakeStoryRecord,
  RightsGrant,
  RightsGrantInput,
  StoryLifecycleStatus,
  StoryReviewEvent,
} from "../contracts/intake";
import { ServiceError, call, readStore, writeStore } from "../runtime";

interface StoredInvitation extends ArtistInvitation {
  tokenHash: string;
  revokedAt?: string;
}

interface DemoActor {
  id: string;
  email: string;
  name?: string;
  role: "viewer" | "creator" | "moderator" | "admin";
}

const SESSION_KEY = "seenos_auth_session";
const USERS_KEY = "seenos_users_db";
const INVITATIONS_KEY = "intake.invitations";
const STORIES_KEY = "intake.stories";
const RIGHTS_KEY = "intake.rightsGrants";
const REVIEWS_KEY = "intake.storyReviews";

function simpleHash(raw: string): string {
  const clean = raw.trim();
  let h1 = 0xdeadbeef ^ clean.length;
  let h2 = 0x41c6ce57 ^ clean.length;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}

function getDemoActor(): DemoActor | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as { userId?: string; expiresAt?: number };
    if (!session.userId || (session.expiresAt && session.expiresAt < Date.now())) return null;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}") as Record<
      string,
      { id?: string; email?: string; name?: string; role?: DemoActor["role"] }
    >;
    const u = users[session.userId];
    return {
      id: session.userId,
      email: u?.email ?? `${session.userId}@seen.local`,
      name: u?.name,
      role: u?.role ?? (localStorage.getItem("seenos_user_role") as DemoActor["role"]) ?? "viewer",
    };
  } catch {
    return null;
  }
}

function requireCurrentUser(): DemoActor {
  const user = getDemoActor();
  if (!user) throw new ServiceError("Sign in to continue.", "forbidden");
  return user;
}

function requireStaff(): DemoActor {
  const user = requireCurrentUser();
  if (user.role !== "moderator" && user.role !== "admin") {
    throw new ServiceError("You don't have permission to do that.", "forbidden");
  }
  return user;
}

function canAuthorEdit(status: StoryLifecycleStatus): boolean {
  switch (status) {
    case "draft":
    case "changes_requested":
      return true;
    case "submitted":
    case "in_review":
    case "approved":
    case "published":
    case "rejected":
    case "unpublished":
    case "withdrawn":
    case "removed":
      return false;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export const demoIntake: { intake: IntakeApi } = {
  intake: {
    createInvitation: input =>
      call(() => {
        requireStaff();
        const raw = (input.rawToken ?? "").trim();
        if (raw.length < 12) {
          throw new ServiceError("Invitation token must be at least 12 characters.", "invalid");
        }
        const grantedRole = input.grantedRole ?? "creator";
        const validDays = input.validDays ?? 14;
        if (validDays < 1 || validDays > 90) {
          throw new ServiceError("Invitation expiry window must be between 1 and 90 days.", "invalid");
        }
        const invitedEmail = (input.invitedEmail ?? "*").trim().toLowerCase() || "*";
        const tokenHash = simpleHash(raw);
        const list = readStore<StoredInvitation[]>(INVITATIONS_KEY, []);
        if (list.some(i => i.tokenHash === tokenHash)) {
          throw new ServiceError("Invitation token already exists.", "conflict");
        }
        const now = new Date();
        const expiresAt = new Date(now.getTime() + validDays * 86_400_000).toISOString();
        const created: StoredInvitation = {
          id: `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          tokenHash,
          invitedEmail,
          grantedRole,
          expiresAt,
          createdAt: now.toISOString(),
        };
        writeStore(INVITATIONS_KEY, [created, ...list]);
        const { tokenHash: _hidden, ...publicRecord } = created;
        return publicRecord;
      }),

    redeemInvitation: rawToken =>
      call(() => {
        const user = requireCurrentUser();
        const tokenHash = simpleHash(rawToken ?? "");
        const list = readStore<StoredInvitation[]>(INVITATIONS_KEY, []);
        const idx = list.findIndex(i => i.tokenHash === tokenHash);
        if (idx === -1) {
          throw new ServiceError("Invalid invitation token.", "invalid");
        }
        const inv = list[idx];
        if (inv.revokedAt) {
          throw new ServiceError("This invitation has been revoked.", "forbidden");
        }
        if (inv.redeemedAt) {
          throw new ServiceError("This invitation has already been used.", "conflict");
        }
        if (new Date(inv.expiresAt).getTime() <= Date.now()) {
          throw new ServiceError("This invitation has expired.", "invalid");
        }
        if (inv.invitedEmail !== "*" && inv.invitedEmail !== user.email.trim().toLowerCase()) {
          throw new ServiceError("This invitation was issued to a different email address.", "forbidden");
        }
        const updated: StoredInvitation = {
          ...inv,
          redeemedBy: user.id,
          redeemedAt: new Date().toISOString(),
        };
        const nextList = [...list];
        nextList[idx] = updated;
        writeStore(INVITATIONS_KEY, nextList);

        // Promote demo user role in localStorage if currently viewer
        try {
          const rawDb = localStorage.getItem(USERS_KEY);
          if (rawDb) {
            const db = JSON.parse(rawDb) as Record<string, { id: string; role: string }>;
            if (db[user.id] && db[user.id].role === "viewer") {
              db[user.id].role = inv.grantedRole;
              localStorage.setItem(USERS_KEY, JSON.stringify(db));
            }
          }
        } catch {
          /* ignore storage errors */
        }

        return { grantedRole: inv.grantedRole };
      }),

    saveDraft: (input: IntakeStoryDraftInput) =>
      call(() => {
        const user = requireCurrentUser();
        const title = input.title.trim();
        if (!title || title.length > 140) {
          throw new ServiceError("Title is required and must be 140 characters or fewer.", "invalid");
        }
        const summary = (input.summary ?? "").trim();
        if (summary.length > 600) {
          throw new ServiceError("Summary must be 600 characters or fewer.", "invalid");
        }
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        const now = new Date().toISOString();

        if (input.id) {
          const idx = stories.findIndex(s => s.id === input.id);
          if (idx === -1) throw new ServiceError("Story not found.", "not_found");
          const existing = stories[idx];
          if (existing.authorId !== user.id) {
            throw new ServiceError("You don't have permission to edit this story.", "forbidden");
          }
          if (!canAuthorEdit(existing.status)) {
            throw new ServiceError(`Cannot edit a story while in '${existing.status}' status.`, "invalid");
          }
          const chapters = input.chapters.map((ch, i) => ({
            id: existing.chapters[i]?.id ?? `ch_${i + 1}`,
            storyId: existing.id,
            position: i + 1,
            title: ch.title.trim(),
            body: ch.body.trim(),
          }));
          const updated: IntakeStoryRecord = {
            ...existing,
            title,
            summary,
            coverUrl: input.coverUrl ?? existing.coverUrl,
            languages: input.languages.length ? input.languages : existing.languages,
            themes: input.themes ?? existing.themes,
            intendedAudience: input.intendedAudience ?? existing.intendedAudience,
            contentWarnings: input.contentWarnings ?? existing.contentWarnings,
            chapters,
          };
          const next = [...stories];
          next[idx] = updated;
          writeStore(STORIES_KEY, next);
          return updated;
        }

        const storyId = `db_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        const chapters = input.chapters.map((ch, i) => ({
          id: `ch_${storyId}_${i + 1}`,
          storyId,
          position: i + 1,
          title: ch.title.trim(),
          body: ch.body.trim(),
        }));
        const created: IntakeStoryRecord = {
          id: storyId,
          authorId: user.id,
          title,
          summary,
          coverUrl: input.coverUrl,
          languages: input.languages.length ? input.languages : ["en"],
          themes: input.themes ?? [],
          intendedAudience: input.intendedAudience ?? "",
          contentWarnings: input.contentWarnings ?? [],
          status: "draft",
          version: 1,
          createdAt: now,
          chapters,
        };
        writeStore(STORIES_KEY, [created, ...stories]);
        return created;
      }),

    recordRightsGrant: (input: RightsGrantInput) =>
      call(() => {
        const user = requireCurrentUser();
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        const story = stories.find(s => s.id === input.storyId);
        if (!story) throw new ServiceError("Story not found.", "not_found");
        if (story.authorId !== user.id) {
          throw new ServiceError("You don't have permission to grant rights for this story.", "forbidden");
        }
        if (!canAuthorEdit(story.status)) {
          throw new ServiceError("Rights can only be recorded while the story is in draft or revision.", "invalid");
        }
        if (!input.confirmsOriginalWork || !input.grantsNonExclusiveLicense || !input.confirmsThirdPartyConsents) {
          throw new ServiceError("All mandatory copyright and consent declarations must be confirmed.", "invalid");
        }
        const attributionName = input.attributionName.trim();
        if (!attributionName || attributionName.length > 120) {
          throw new ServiceError("Attribution name is required (max 120 characters).", "invalid");
        }
        const grant: RightsGrant = {
          id: `rg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          storyId: story.id,
          authorId: user.id,
          termsVersion: (input.termsVersion ?? "2026-11-v1").trim(),
          confirmsOriginalWork: true,
          grantsNonExclusiveLicense: true,
          confirmsThirdPartyConsents: true,
          allowTranslation: input.allowTranslation,
          allowAudioNarration: input.allowAudioNarration,
          attributionName,
          createdAt: new Date().toISOString(),
        };
        const list = readStore<RightsGrant[]>(RIGHTS_KEY, []);
        writeStore(RIGHTS_KEY, [grant, ...list]);
        return grant;
      }),

    submitForReview: storyId =>
      call(() => {
        const user = requireCurrentUser();
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        const idx = stories.findIndex(s => s.id === storyId);
        if (idx === -1) throw new ServiceError("Story not found.", "not_found");
        const story = stories[idx];
        if (story.authorId !== user.id) {
          throw new ServiceError("You don't have permission to submit this story.", "forbidden");
        }
        if (!canAuthorEdit(story.status)) {
          throw new ServiceError(`Story cannot be submitted from '${story.status}' status.`, "invalid");
        }
        const validChapters = story.chapters.filter(c => c.title.trim().length > 0 && c.body.trim().length > 0);
        if (validChapters.length < 1) {
          throw new ServiceError("At least one chapter with a title and body is required before submitting.", "invalid");
        }
        const grants = readStore<RightsGrant[]>(RIGHTS_KEY, []);
        const hasGrant = grants.some(
          g =>
            g.storyId === story.id &&
            g.authorId === user.id &&
            g.confirmsOriginalWork &&
            g.grantsNonExclusiveLicense &&
            g.confirmsThirdPartyConsents,
        );
        if (!hasGrant) {
          throw new ServiceError("Please complete the creator rights declaration before submitting.", "invalid");
        }
        const updated: IntakeStoryRecord = {
          ...story,
          status: "submitted",
          submittedAt: new Date().toISOString(),
          version: story.status === "changes_requested" ? story.version + 1 : story.version,
        };
        const next = [...stories];
        next[idx] = updated;
        writeStore(STORIES_KEY, next);
        return updated;
      }),

    reviewSubmission: ({ storyId, nextStatus, editorialNotes }) =>
      call(() => {
        const staff = requireStaff();
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        const idx = stories.findIndex(s => s.id === storyId);
        if (idx === -1) throw new ServiceError("Story not found.", "not_found");
        const story = stories[idx];

        if (
          (story.status === "draft" || story.status === "withdrawn") &&
          ["in_review", "changes_requested", "approved", "published"].includes(nextStatus)
        ) {
          throw new ServiceError(`Cannot review an unsubmitted story in '${story.status}' status.`, "invalid");
        }
        const cleanNotes = (editorialNotes ?? "").trim();
        if ((nextStatus === "changes_requested" || nextStatus === "rejected") && !cleanNotes) {
          throw new ServiceError("Editorial notes are required when requesting changes or rejecting a submission.", "invalid");
        }

        const now = new Date().toISOString();
        const updated: IntakeStoryRecord = {
          ...story,
          status: nextStatus,
          reviewedBy: staff.id,
          reviewedAt: now,
          reviewNotes: cleanNotes || story.reviewNotes,
          publishedAt:
            nextStatus === "published"
              ? story.publishedAt ?? now
              : ["unpublished", "rejected", "removed"].includes(nextStatus)
                ? undefined
                : story.publishedAt,
        };
        const next = [...stories];
        next[idx] = updated;
        writeStore(STORIES_KEY, next);

        const reviewEvent: StoryReviewEvent = {
          id: `rev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          storyId: story.id,
          reviewerId: staff.id,
          fromStatus: story.status,
          toStatus: nextStatus as EditorialDecisionStatus,
          editorialNotes: cleanNotes,
          createdAt: now,
        };
        const reviews = readStore<StoryReviewEvent[]>(REVIEWS_KEY, []);
        writeStore(REVIEWS_KEY, [reviewEvent, ...reviews]);

        return updated;
      }),

    withdrawStory: storyId =>
      call(() => {
        const user = requireCurrentUser();
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        const idx = stories.findIndex(s => s.id === storyId);
        if (idx === -1) throw new ServiceError("Story not found.", "not_found");
        const story = stories[idx];
        if (story.authorId !== user.id) {
          throw new ServiceError("You don't have permission to withdraw this story.", "forbidden");
        }
        if (story.status === "removed") {
          throw new ServiceError("A removed story cannot be modified.", "forbidden");
        }
        const updated: IntakeStoryRecord = {
          ...story,
          status: "withdrawn",
          publishedAt: undefined,
        };
        const next = [...stories];
        next[idx] = updated;
        writeStore(STORIES_KEY, next);
        return updated;
      }),

    listMyStories: () =>
      call(() => {
        const user = requireCurrentUser();
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        return stories.filter(s => s.authorId === user.id);
      }),

    listReviewQueue: () =>
      call(() => {
        requireStaff();
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        return stories.filter(s =>
          ["submitted", "in_review", "changes_requested", "approved"].includes(s.status),
        );
      }),

    listPublishedStories: () =>
      call(() => {
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        return stories.filter(s => s.status === "published");
      }),

    listStoryReviews: storyId =>
      call(() => {
        const user = requireCurrentUser();
        const stories = readStore<IntakeStoryRecord[]>(STORIES_KEY, []);
        const story = stories.find(s => s.id === storyId);
        if (!story) throw new ServiceError("Story not found.", "not_found");
        const isStaff = user.role === "moderator" || user.role === "admin";
        if (story.authorId !== user.id && !isStaff) {
          throw new ServiceError("You don't have permission to view reviews for this story.", "forbidden");
        }
        const reviews = readStore<StoryReviewEvent[]>(REVIEWS_KEY, []);
        return reviews.filter(r => r.storyId === storyId);
      }),
  },
};
