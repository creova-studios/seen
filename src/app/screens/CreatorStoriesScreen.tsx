import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button, SegmentedTabs, StateTemplate } from "../components/seen/primitives";
import { ListItem } from "../components/seen/display";
import { deleteDraft, listDraftsForCreator, listStoriesForCreator } from "../data/userStoriesService";
import { useAppNav } from "../navigation/AppNav";
import { useT } from "../i18n/useT";
import { ScreenFrame } from "./ScreenFrame";

type Tab = "published" | "drafts";

/** The creator's own stories: published ones open the story, drafts resume the publish flow. */
export function CreatorStoriesScreen() {
  const nav = useAppNav();
  const t = useT();
  const { state } = useAuth();
  const creatorId = state.user?.id ?? "creator_demo";
  const [tab, setTab] = useState<Tab>("published");
  const [version, setVersion] = useState(0);
  void version;
  const published = listStoriesForCreator(creatorId);
  const drafts = listDraftsForCreator(creatorId);

  const discard = (id: string) => {
    deleteDraft(id);
    setVersion(v => v + 1);
    toast.success(t("cs.discarded"));
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
            { id: "drafts", label: `${t("cs.tab.drafts")} (${drafts.length})` },
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
        ) : drafts.length === 0 ? (
          <StateTemplate kind="empty" title={t("cs.empty.dr.title")} message={t("cs.empty.dr.msg")} />
        ) : (
          <div className="flex flex-col gap-3" role="tabpanel">
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
