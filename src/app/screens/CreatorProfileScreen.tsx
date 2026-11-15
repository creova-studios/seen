import { useT } from "../i18n/useT";
import { useState } from "react";
import { track } from "../observability";
import { toast } from "sonner";
import { Flag, Share2, UserCheck, UserPlus } from "lucide-react";
import { ReportContentSheet } from "../components/ReportContentSheet";
import { api } from "../services";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Avatar, Badge, Button, SectionTitle, SkeletonList } from "../components/seen/primitives";
import { creatorCover } from "../components/seen/cards";
import { SeenImage } from "../components/seen/SeenImage";
import { FeaturedStoryCard, StoryRow } from "../components/seen/StoryRow";
import { useAppNav } from "../navigation/AppNav";
import { useStoryState } from "../contexts/StoryStateContext";
import { useGuest } from "../guest/useGuest";
import { ScreenFrame } from "./ScreenFrame";

const LANG_LABEL: Record<string, string> = { en: "English", fr: "Français", es: "Español" };

export function CreatorProfileScreen({ creatorId }: { creatorId: string }) {
  const t = useT();
  const nav = useAppNav();
  const { requireAccount } = useGuest();
  const { state } = useStoryState();
  const resource = useResource(
    async () => {
      const [creator, following] = await Promise.all([api.creators.get(creatorId), api.creators.listFollowing()]);
      return { creator, following: following.includes(creatorId) };
    },
    [creatorId],
  );
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const shareProfile = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/creator/${encodeURIComponent(creatorId)}`;
    try {
      if (navigator.share) await navigator.share({ title: resource.data?.creator.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success(t("creator.shareCopied"));
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") toast.error("Couldn't share this profile. Copy the address from your browser instead.");
    }
  };

  const toggleFollow = () => {
    if (!resource.data) return;
    requireAccount({ reason: "follow", subject: resource.data.creator.name }, () => void applyFollow());
  };

  const applyFollow = async () => {
    if (!resource.data) return;
    const next = !resource.data.following;
    setBusy(true);
    resource.mutate(prev => ({ ...prev!, following: next })); // optimistic
    try {
      await api.creators.setFollowing(creatorId, next);
      track(next ? "creator_followed" : "creator_unfollowed", { creatorId });
      toast.success(next ? `Following ${resource.data.creator.name}` : `Unfollowed ${resource.data.creator.name}`);
    } catch {
      resource.mutate(prev => ({ ...prev!, following: !next })); // roll back
      toast.error("Couldn't update follow. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame title={resource.data?.creator.name ?? "Creator"} onBack={nav.back}>
      <ResourceView resource={resource} what="creator" skeleton={<SkeletonList count={4} label="Loading creator" />}>
        {({ creator, following }) => (
          <>
            {/* Banner: the creator's own work, fading into the page, with an accent line on top. */}
            <div aria-hidden className="relative -mx-gutter h-40 overflow-hidden">
              <SeenImage src={creatorCover(creator)} alt="" decorative seed={creator.id} className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-0.5 bg-seen-accent" />
            </div>
            <section className="relative -mt-12 flex flex-col items-center text-center pb-8 border-b border-white/5">
              <Avatar name={creator.name} size="lg" ring />
              <p className="font-seen-mono text-[11px] tracking-[0.8px] uppercase text-seen-accent mt-5">{t("creator.eyebrow")}</p>
              <h2 className="font-seen-display text-[30px] font-normal leading-[1.16] tracking-[-0.5px] mt-1">{creator.name}</h2>
              <p className="text-sm text-seen-secondary mt-2 max-w-[320px] leading-relaxed">{creator.bio}</p>
              <dl className="mt-5 grid grid-cols-3 gap-2 w-full max-w-[320px]">
                {[
                  [creator.storyIds.length, t("creator.stat.stories")],
                  [creator.languages.length, t("creator.stat.languages")],
                  [creator.themes.length, t("creator.stat.themes")],
                ].map(([n, label]) => (
                  <div key={label as string} className="rounded-seen-md border border-seen-accent/30 bg-seen-accent/10 py-2">
                    <dt className="text-[10px] tracking-[0.14em] uppercase text-seen-accent">{label}</dt>
                    <dd className="text-lg font-semibold text-white">{n}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {creator.languages.map(l => (
                  <Badge key={l}>{LANG_LABEL[l] ?? l}</Badge>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Button
                  variant={following ? "secondary" : "primary"}
                  loading={busy}
                  onClick={toggleFollow}
                  aria-pressed={following}
                  icon={following ? <UserCheck className="w-4 h-4" aria-hidden /> : <UserPlus className="w-4 h-4" aria-hidden />}
                >
                  {following ? "Following" : "Follow"}
                </Button>
                <button
                  type="button"
                  onClick={shareProfile}
                  aria-label={t("creator.share")}
                  className="w-11 h-11 rounded-full border border-seen-border bg-seen-surface flex items-center justify-center text-white/80 hover:border-white/30"
                >
                  <Share2 className="w-4 h-4" aria-hidden />
                </button>
              </div>
            </section>

            <section className="pt-8">
              {creator.storyIds.length > 0 && (
                <>
                  <SectionTitle title={t("creator.featured")} />
                  <div className="mb-8">
                    <FeaturedStoryCard storyId={creator.storyIds[0]} language={state.language} onOpen={nav.openStory} startLabel={t("creator.start")} />
                  </div>
                </>
              )}
              {creator.storyIds.length > 1 && (
                <>
                  <SectionTitle title={t("creator.more")} subtitle={`${creator.storyIds.length - 1} published`} />
                  <ul className="space-y-3">
                    {creator.storyIds.slice(1).map(id => (
                      <li key={id}>
                        <StoryRow storyId={id} language={state.language} onOpen={nav.openStory} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <SectionTitle title={t("creator.stat.themes")} />
              <div className="flex flex-wrap gap-2 mb-2">
                {creator.themes.map(theme => (
                  <Badge key={theme} tone="purple">
                    {theme}
                  </Badge>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <Button variant="ghost" size="sm" icon={<Flag className="w-4 h-4" aria-hidden />} onClick={() => setReportOpen(true)}>
                  {t("report.open.profile")}
                </Button>
              </div>
            </section>
            <ReportContentSheet open={reportOpen} onOpenChange={setReportOpen} targetType="creator" targetId={creator.id} targetTitle={creator.name} />
          </>
        )}
      </ResourceView>
    </ScreenFrame>
  );
}
