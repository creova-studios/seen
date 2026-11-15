import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ArtistInvitation,
  EditorialDecisionStatus,
  IntakeApi,
  IntakeChapter,
  IntakeStoryDraftInput,
  IntakeStoryRecord,
  RightsGrant,
  RightsGrantInput,
  StoryLifecycleStatus,
  StoryReviewEvent,
} from "../contracts/intake";
import { ServiceError } from "../runtime";
import { getSupabaseClient } from "./client";
import { DbError } from "./db";
import { toServiceError } from "./safety";

interface StoryRow {
  id: string;
  author_id: string;
  title: string;
  summary: string;
  cover_url: string | null;
  languages: string[];
  themes: string[];
  intended_audience: string;
  content_warnings: string[];
  status: StoryLifecycleStatus;
  version: number;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
  published_at: string | null;
  created_at: string;
  chapters?: ChapterRow[];
}

interface ChapterRow {
  id: string;
  story_id: string;
  position: number;
  title: string;
  body: string;
}

interface RightsGrantRow {
  id: string;
  story_id: string;
  author_id: string;
  terms_version: string;
  confirms_original_work: boolean;
  grants_non_exclusive_license: boolean;
  confirms_third_party_consents: boolean;
  allow_translation: boolean;
  allow_audio_narration: boolean;
  attribution_name: string;
  created_at: string;
}

interface StoryReviewRow {
  id: string;
  story_id: string;
  reviewer_id: string | null;
  from_status: StoryLifecycleStatus;
  to_status: EditorialDecisionStatus;
  editorial_notes: string;
  created_at: string;
}

interface InvitationRow {
  id: string;
  invited_email: string;
  granted_role: "creator" | "moderator";
  expires_at: string;
  redeemed_by: string | null;
  redeemed_at: string | null;
  created_at: string;
}

function toChapter(r: ChapterRow): IntakeChapter {
  return {
    id: r.id,
    storyId: r.story_id,
    position: r.position,
    title: r.title,
    body: r.body,
  };
}

function toStoryRecord(r: StoryRow): IntakeStoryRecord {
  const chapters = (r.chapters ?? []).slice().sort((a, b) => a.position - b.position).map(toChapter);
  return {
    id: r.id,
    authorId: r.author_id,
    title: r.title,
    summary: r.summary,
    coverUrl: r.cover_url ?? undefined,
    languages: r.languages ?? [],
    themes: r.themes ?? [],
    intendedAudience: r.intended_audience ?? "",
    contentWarnings: r.content_warnings ?? [],
    status: r.status,
    version: r.version ?? 1,
    submittedAt: r.submitted_at ?? undefined,
    reviewedAt: r.reviewed_at ?? undefined,
    reviewedBy: r.reviewed_by ?? undefined,
    reviewNotes: r.review_notes ?? undefined,
    publishedAt: r.published_at ?? undefined,
    createdAt: r.created_at,
    chapters,
  };
}

const STORY_SELECT =
  "id, author_id, title, summary, cover_url, languages, themes, intended_audience, content_warnings, status, version, submitted_at, reviewed_at, reviewed_by, review_notes, published_at, created_at, chapters(id, story_id, position, title, body)";

export function createSupabaseIntake(getClient: () => Promise<SupabaseClient> = getSupabaseClient): { intake: IntakeApi } {
  const ok = <T>(res: { data: T | null; error: { code?: string; message: string } | null }): T => {
    if (res.error) {
      throw new DbError(res.error.message, res.error.code ?? (/fetch|network/i.test(res.error.message) ? "NETWORK" : ""));
    }
    return res.data as T;
  };

  const run = async <T>(fn: (client: SupabaseClient) => Promise<T>): Promise<T> => {
    try {
      const client = await getClient();
      return await fn(client);
    } catch (e) {
      throw toServiceError(e);
    }
  };

  const requireUid = async (client: SupabaseClient): Promise<string> => {
    const { data } = await client.auth.getUser();
    if (!data.user?.id) throw new ServiceError("Sign in to continue.", "forbidden");
    return data.user.id;
  };

  const fetchStory = async (client: SupabaseClient, storyId: string): Promise<IntakeStoryRecord> => {
    const row = ok<StoryRow>(
      await client.from("stories").select(STORY_SELECT).eq("id", storyId).single(),
    );
    return toStoryRecord(row);
  };

  return {
    intake: {
      createInvitation: input =>
        run(async client => {
          const invId = ok<string>(
            await client.rpc("create_artist_invitation", {
              raw_token: input.rawToken,
              target_email: input.invitedEmail ?? "*",
              role_to_grant: input.grantedRole ?? "creator",
              valid_days: input.validDays ?? 14,
            }),
          );
          const row = ok<InvitationRow>(
            await client
              .from("invitations")
              .select("id, invited_email, granted_role, expires_at, redeemed_by, redeemed_at, created_at")
              .eq("id", invId)
              .single(),
          );
          return {
            id: row.id,
            invitedEmail: row.invited_email,
            grantedRole: row.granted_role,
            expiresAt: row.expires_at,
            redeemedBy: row.redeemed_by ?? undefined,
            redeemedAt: row.redeemed_at ?? undefined,
            createdAt: row.created_at,
          } satisfies ArtistInvitation;
        }),

      redeemInvitation: rawToken =>
        run(async client => {
          const grantedRole = ok<"creator" | "moderator">(
            await client.rpc("redeem_artist_invitation", { raw_token: rawToken }),
          );
          return { grantedRole };
        }),

      saveDraft: (input: IntakeStoryDraftInput) =>
        run(async client => {
          const uid = await requireUid(client);
          const title = input.title.trim();
          if (!title || title.length > 140) {
            throw new ServiceError("Title is required and must be 140 characters or fewer.", "invalid");
          }
          let storyId = input.id;
          if (storyId) {
            ok(
              await client
                .from("stories")
                .update({
                  title,
                  summary: (input.summary ?? "").trim(),
                  cover_url: input.coverUrl ?? null,
                  languages: input.languages.length ? input.languages : ["en"],
                  themes: input.themes ?? [],
                  intended_audience: input.intendedAudience ?? "",
                  content_warnings: input.contentWarnings ?? [],
                })
                .eq("id", storyId),
            );
          } else {
            const inserted = ok<{ id: string }>(
              await client
                .from("stories")
                .insert({
                  author_id: uid,
                  title,
                  summary: (input.summary ?? "").trim(),
                  cover_url: input.coverUrl ?? null,
                  languages: input.languages.length ? input.languages : ["en"],
                  themes: input.themes ?? [],
                  intended_audience: input.intendedAudience ?? "",
                  content_warnings: input.contentWarnings ?? [],
                })
                .select("id")
                .single(),
            );
            storyId = inserted.id;
          }

          ok(await client.from("chapters").delete().eq("story_id", storyId));
          if (input.chapters.length > 0) {
            ok(
              await client.from("chapters").insert(
                input.chapters.map((ch, i) => ({
                  story_id: storyId,
                  position: i + 1,
                  title: ch.title.trim(),
                  body: ch.body.trim(),
                })),
              ),
            );
          }
          return fetchStory(client, storyId);
        }),

      recordRightsGrant: (input: RightsGrantInput) =>
        run(async client => {
          const uid = await requireUid(client);
          const row = ok<RightsGrantRow>(
            await client
              .from("rights_grants")
              .insert({
                story_id: input.storyId,
                author_id: uid,
                terms_version: input.termsVersion ?? "2026-11-v1",
                confirms_original_work: input.confirmsOriginalWork,
                grants_non_exclusive_license: input.grantsNonExclusiveLicense,
                confirms_third_party_consents: input.confirmsThirdPartyConsents,
                allow_translation: input.allowTranslation,
                allow_audio_narration: input.allowAudioNarration,
                attribution_name: input.attributionName.trim(),
              })
              .select("*")
              .single(),
          );
          return {
            id: row.id,
            storyId: row.story_id,
            authorId: row.author_id,
            termsVersion: row.terms_version,
            confirmsOriginalWork: row.confirms_original_work,
            grantsNonExclusiveLicense: row.grants_non_exclusive_license,
            confirmsThirdPartyConsents: row.confirms_third_party_consents,
            allowTranslation: row.allow_translation,
            allowAudioNarration: row.allow_audio_narration,
            attributionName: row.attribution_name,
            createdAt: row.created_at,
          } satisfies RightsGrant;
        }),

      submitForReview: storyId =>
        run(async client => {
          ok(await client.rpc("submit_story_for_review", { target_story_id: storyId }));
          return fetchStory(client, storyId);
        }),

      reviewSubmission: ({ storyId, nextStatus, editorialNotes }) =>
        run(async client => {
          ok(
            await client.rpc("review_story_submission", {
              target_story_id: storyId,
              next_status: nextStatus,
              notes: editorialNotes ?? "",
            }),
          );
          return fetchStory(client, storyId);
        }),

      withdrawStory: storyId =>
        run(async client => {
          ok(await client.rpc("withdraw_story", { target_story_id: storyId }));
          return fetchStory(client, storyId);
        }),

      listMyStories: () =>
        run(async client => {
          const uid = await requireUid(client);
          const rows = ok<StoryRow[]>(
            await client
              .from("stories")
              .select(STORY_SELECT)
              .eq("author_id", uid)
              .order("created_at", { ascending: false }),
          );
          return rows.map(toStoryRecord);
        }),

      listReviewQueue: () =>
        run(async client => {
          const rows = ok<StoryRow[]>(
            await client
              .from("stories")
              .select(STORY_SELECT)
              .in("status", ["submitted", "in_review", "changes_requested", "approved"])
              .order("submitted_at", { ascending: true }),
          );
          return rows.map(toStoryRecord);
        }),

      listPublishedStories: () =>
        run(async client => {
          const rows = ok<StoryRow[]>(
            await client
              .from("stories")
              .select(STORY_SELECT)
              .eq("status", "published")
              .order("published_at", { ascending: false }),
          );
          return rows.map(toStoryRecord);
        }),

      listStoryReviews: storyId =>
        run(async client => {
          const rows = ok<StoryReviewRow[]>(
            await client
              .from("story_reviews")
              .select("id, story_id, reviewer_id, from_status, to_status, editorial_notes, created_at")
              .eq("story_id", storyId)
              .order("created_at", { ascending: false }),
          );
          return rows.map<StoryReviewEvent>(r => ({
            id: r.id,
            storyId: r.story_id,
            reviewerId: r.reviewer_id ?? undefined,
            fromStatus: r.from_status,
            toStatus: r.to_status,
            editorialNotes: r.editorial_notes,
            createdAt: r.created_at,
          }));
        }),
    },
  };
}
