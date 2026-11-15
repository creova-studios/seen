import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button, SegmentedTabs, StateTemplate } from "../components/seen/primitives";
import { ListItem } from "../components/seen/display";
import { deleteDraft, listDraftsForCreator, listStoriesForCreator } from "../data/userStoriesService";
import { useAppNav } from "../navigation/AppNav";
import { useT } from "../i18n/useT";
import { api, type IntakeStoryRecord, type StoryLifecycleStatus } from "../services";
import { ScreenFrame } from "./ScreenFrame";

type Tab = "published" | "drafts";

function statusBadgeLabel(status: StoryLifecycleStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "in_review":
      return "In Review";
    case "changes_requested":
      return "Changes Requested";
    case "approved":
      return "Approved";
    case "published":
      return "Published";
    case "rejected":
      return "Rejected";
    case "unpublished":
      return "Unpublished";
    case "withdrawn":
      return "Withdrawn";
    case "removed":
      return "Removed";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

/** The creator's own stories: published ones open the story, drafts and submissions show review status. */
export function CreatorStoriesScreen() {
  const nav = useAppNav();
  const t = useT();
  const { state } = useAuth();
  const creatorId = state.user?.id ?? "creator_demo";
  const [tab, setTab] = useState<Tab>("published");
  const [version, setVersion] = useState(0);
  const [submissions, setSubmissions] = useState<IntakeStoryRecord[]>([]);

  useEffect(() => {
    let live = true;
    api.intake
      .listMyStories()
      .then(items => {
        if (live) setSubmissions(items);
      })
      .catch(() => {
        if (live) setSubmissions([]);
      });
    return () => {
      live = false;
    };
  }, [version, creatorId]);

  const published = listStoriesForCreator(creatorId);
  const drafts = listDraftsForCreator(creatorId);

  const discard = (id: string) => {
    deleteDraft(id);
    setVersion(v => v + 1);
    toast.success(t("cs.discarded"));
  };

  const handleWithdraw = async (storyId: string) => {
    try {
      await api.intake.withdrawStory(storyId);
      setVersion(v => v + 1);
      toast.success("Story withdrawn.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not withdraw story.");
    }
  };

  const handleResubmit = async (storyId: string) => {
    try {
      await api.intake.submitForReview(storyId);
      setVersion(v => v + 1);
      toast.success("Story resubmitted for review.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resubmit story.");
    }
  };

  return (
    <ScreenFrame title={t("cs.title")} onBack={nav.back}>
      <div className="flex flex-col gap-4">
        <SegmentedTabs<Tab>
          label={t("cs.tabs")}
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "published", label: `${t("cs.tab.published")} (${published.length})` },
            { id: "drafts", label: `${t("cs.tab.drafts")} (${drafts.length + submissions.length})` },
          ]}
        />
        <Button variant="secondary" fullWidth onClick={() => nav.go("creator-publish")}>
          <Plus className="w-4 h-4" aria-hidden /> {t("cs.new")}
        </Button>
        {tab === "published" ? (
          published.length === 0 ? (
            <StateTemplate kind="empty" title={t("cs.empty.pub.title")} message={t("cs.empty.pub.msg")} />
          ) : (
            <div className="flex flex-col gap-2" role="tabpanel">
              {published.map(s => (
                <ListItem
                  key={s.id}
                  label={s.title.en}
                  description={`${s.visibility} · ${s.chapterCount}`}
                  onClick={() => nav.openStory(s.id)}
                />
              ))}
            </div>
          )
        ) : drafts.length === 0 && submissions.length === 0 ? (
          <StateTemplate kind="empty" title={t("cs.empty.dr.title")} message={t("cs.empty.dr.msg")} />
        ) : (
          <div className="flex flex-col gap-3" role="tabpanel">
            {submissions.map(sub => (
              <div
                key={sub.id}
                data-testid="intake-submission-item"
                className="rounded-seen-md border border-seen-border bg-seen-surface p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white">{sub.title}</p>
                  <span className="px-2.5 py-0.5 rounded-full text-xs border border-white/20 bg-white/5 text-white/80">
                    {statusBadgeLabel(sub.status)} · v{sub.version}
                  </span>
                </div>
                <p className="text-xs text-seen-muted line-clamp-2">{sub.summary}</p>
                {sub.reviewNotes && (
                  <p className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-400/20 rounded p-2">
                    Editorial note: {sub.reviewNotes}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  {sub.status === "published" && (
                    <Button onClick={() => nav.openStory(sub.id)}>Open story</Button>
                  )}
                  {sub.status === "changes_requested" && (
                    <Button onClick={() => handleResubmit(sub.id)}>Resubmit for review</Button>
                  )}
                  {sub.status !== "withdrawn" && sub.status !== "removed" && (
                    <Button variant="ghost" onClick={() => handleWithdraw(sub.id)}>
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {drafts.map(d => (
              <div key={d.id} className="rounded-seen-md border border-seen-border bg-seen-surface p-4">
                <p className="text-sm text-white">{d.intent?.title?.trim() || t("cs.untitled")}</p>
                <p className="text-xs text-seen-muted mt-0.5">{new Date(d.updatedAt).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => nav.go("creator-publish")}>{t("cs.continue")}</Button>
                  <Button variant="ghost" onClick={() => discard(d.id)}>{t("cs.discard")}</Button>
                </div>
              </div>
            ))}
            <p className="text-xs text-seen-muted">{t("cs.deviceNote")}</p>
          </div>
        )}
      </div>
    </ScreenFrame>
  );
}
