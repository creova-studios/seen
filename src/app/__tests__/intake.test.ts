import { beforeEach, describe, expect, it } from "vitest";
import { getChaptersForStory, getStoryWorldById } from "../data/storyDatabase";
import { api } from "../services";
import { setLatency } from "../services/runtime";

function signInDemoUser(id: string, email: string, name: string, role: "viewer" | "creator" | "moderator" | "admin") {
  const rawDb = localStorage.getItem("seenos_users_db");
  const db = rawDb ? (JSON.parse(rawDb) as Record<string, unknown>) : {};
  db[id] = { id, email, name, role };
  localStorage.setItem("seenos_users_db", JSON.stringify(db));
  localStorage.setItem("seenos_auth_session", JSON.stringify({ userId: id, accessToken: `tok_${id}` }));
}

describe("Artist Intake & Editorial Moderation Contract (Phase 3 & 5)", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    setLatency(0);
  });

  it("blocks non-staff from creating artist invitations and enforces single-use redemption", async () => {
    signInDemoUser("usr_viewer", "viewer@seen.demo", "Viewer Demo", "viewer");
    await expect(
      api.intake.createInvitation({ rawToken: "artist-invite-2026-alpha", invitedEmail: "viewer@seen.demo" }),
    ).rejects.toMatchObject({ code: "forbidden" });

    // Staff moderator creates an invitation for viewer@seen.demo
    signInDemoUser("usr_mod", "moderator@seen.demo", "Moderator Demo", "moderator");
    const inv = await api.intake.createInvitation({
      rawToken: "artist-invite-2026-alpha",
      invitedEmail: "viewer@seen.demo",
      grantedRole: "creator",
      validDays: 7,
    });
    expect(inv.invitedEmail).toBe("viewer@seen.demo");
    expect(inv.grantedRole).toBe("creator");

    // Viewer redeems invitation and is promoted to creator
    signInDemoUser("usr_viewer", "viewer@seen.demo", "Viewer Demo", "viewer");
    const redeemed = await api.intake.redeemInvitation("artist-invite-2026-alpha");
    expect(redeemed.grantedRole).toBe("creator");

    // Reusing the same invitation token fails with conflict
    await expect(api.intake.redeemInvitation("artist-invite-2026-alpha")).rejects.toMatchObject({
      code: "conflict",
    });
  });

  it("enforces the full editorial state machine: draft -> submitted -> in_review -> changes_requested -> approved -> published -> withdrawn", async () => {
    signInDemoUser("usr_creator", "creator@seen.demo", "Creator Demo", "creator");

    // 1. Creator saves a draft
    const draft = await api.intake.saveDraft({
      title: "The Harbor of Salt and Memory",
      summary: "Three generations of Atlantic boatbuilders.",
      languages: ["en", "fr"],
      themes: ["Heritage & Memory"],
      intendedAudience: "General public",
      contentWarnings: [],
      chapters: [{ position: 1, title: "Part I: Keel", body: "Cedar shavings covered the workshop floor." }],
    });
    expect(draft.status).toBe("draft");
    expect(draft.version).toBe(1);

    // 2. Submitting without a rights grant is rejected
    await expect(api.intake.submitForReview(draft.id)).rejects.toMatchObject({ code: "invalid" });

    // 3. Creator records copyright & non-exclusive license grant
    const grant = await api.intake.recordRightsGrant({
      storyId: draft.id,
      confirmsOriginalWork: true,
      grantsNonExclusiveLicense: true,
      confirmsThirdPartyConsents: true,
      allowTranslation: true,
      allowAudioNarration: true,
      attributionName: "Creator Demo",
    });
    expect(grant.storyId).toBe(draft.id);

    // 4. Creator submits story for review
    const submitted = await api.intake.submitForReview(draft.id);
    expect(submitted.status).toBe("submitted");

    // Public reader feed still does NOT include unapproved submissions
    expect(await api.intake.listPublishedStories()).toHaveLength(0);

    // Non-staff cannot review submissions
    await expect(
      api.intake.reviewSubmission({ storyId: draft.id, nextStatus: "published" }),
    ).rejects.toMatchObject({ code: "forbidden" });

    // 5. Moderator begins review and requests changes (notes required)
    signInDemoUser("usr_mod", "moderator@seen.demo", "Moderator Demo", "moderator");
    const queue = await api.intake.listReviewQueue();
    expect(queue.map(s => s.id)).toContain(draft.id);

    const inReview = await api.intake.reviewSubmission({
      storyId: draft.id,
      nextStatus: "in_review",
      editorialNotes: "Assigned to editorial desk.",
    });
    expect(inReview.status).toBe("in_review");

    await expect(
      api.intake.reviewSubmission({ storyId: draft.id, nextStatus: "changes_requested", editorialNotes: "   " }),
    ).rejects.toMatchObject({ code: "invalid" });

    const changesReq = await api.intake.reviewSubmission({
      storyId: draft.id,
      nextStatus: "changes_requested",
      editorialNotes: "Please add French subtitle context in Chapter 1.",
    });
    expect(changesReq.status).toBe("changes_requested");

    // 6. Creator updates draft and resubmits (version increments to 2)
    signInDemoUser("usr_creator", "creator@seen.demo", "Creator Demo", "creator");
    await api.intake.saveDraft({
      id: draft.id,
      title: "The Harbor of Salt and Memory",
      summary: "Three generations of Atlantic boatbuilders (Revised).",
      languages: ["en", "fr"],
      chapters: [
        { position: 1, title: "Part I: Keel", body: "Cedar shavings covered the workshop floor in Caraquet." },
      ],
    });
    const resubmitted = await api.intake.submitForReview(draft.id);
    expect(resubmitted.status).toBe("submitted");
    expect(resubmitted.version).toBe(2);

    // 7. Moderator approves and publishes
    signInDemoUser("usr_mod", "moderator@seen.demo", "Moderator Demo", "moderator");
    await api.intake.reviewSubmission({
      storyId: draft.id,
      nextStatus: "approved",
      editorialNotes: "Approved for publication.",
    });
    const published = await api.intake.reviewSubmission({
      storyId: draft.id,
      nextStatus: "published",
      editorialNotes: "Live in SEEN catalogue.",
    });
    expect(published.status).toBe("published");
    expect(published.publishedAt).toBeTruthy();

    // Published story now appears in public list and reader catalogue
    const publicStories = await api.intake.listPublishedStories();
    expect(publicStories.map(s => s.id)).toContain(draft.id);
    const catalogStory = getStoryWorldById(draft.id);
    expect(catalogStory?.title.en).toBe("The Harbor of Salt and Memory");
    expect(getChaptersForStory(draft.id)).toHaveLength(1);

    // 8. Creator withdraws story -> immediately removed from public list and reader catalogue
    signInDemoUser("usr_creator", "creator@seen.demo", "Creator Demo", "creator");
    const withdrawn = await api.intake.withdrawStory(draft.id);
    expect(withdrawn.status).toBe("withdrawn");
    expect(await api.intake.listPublishedStories()).toHaveLength(0);
    expect(getStoryWorldById(draft.id)).toBeUndefined();

    const reviews = await api.intake.listStoryReviews(draft.id);
    expect(reviews.length).toBeGreaterThanOrEqual(4);
  });
});
