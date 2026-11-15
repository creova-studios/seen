import { motion } from "motion/react";
import { StateTemplate } from "./seen/primitives";
import { ScreenFrame } from "../screens/ScreenFrame";
import { useAppNav } from "../navigation/AppNav";
import { ArrowLeft, Play, Share2, Bookmark, Lock, Flag, PenLine } from "lucide-react";
import { ReportContentSheet } from "./ReportContentSheet";
import { NoteSheet } from "./NoteSheet";
import { useT } from "../i18n/useT";
import { languageCodesLine, languageNamesList, substitutedLanguage } from "./seen/languageChip";
import type { StringKey } from "../i18n/strings";
import { SeenImage } from "./seen/SeenImage";
import { useState } from "react";
import { toast } from "sonner";
import { shareUrl } from "../navigation/shareUrl";
import { deleteBookmark, isBookmarked, saveBookmark } from "../data/userDataService";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { useGuest } from "../guest/useGuest";
import { getStoryWorldData } from "../data/storyService";
import { getStoryWorldById, type Language } from "../data/storyDatabase";
import { PaywallModal } from "./PaywallModal";
import { hasAccessToContent, getContentPricing, creatorIdFromName } from "../data/monetizationService";

interface FeaturedStoryPreviewProps {
  onClose: () => void;
  onEnterStory?: () => void;
}

export function FeaturedStoryPreview({ onClose, onEnterStory }: FeaturedStoryPreviewProps) {
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const { state } = useStoryState();
  const t = useT();
  const nav = useAppNav();
  const { state: authState } = useAuth();
  const { requireAccount } = useGuest();

  // Get story data from current story world ID
  const storyData = state.currentStoryWorldId
    ? getStoryWorldData(state.currentStoryWorldId, state.language as Language)
    : null;

  if (!storyData) {
    // A stale link, notification or search result can point at a story that no longer exists.
    return (
      <ScreenFrame title="" onBack={onClose}>
        <StateTemplate
          kind="empty"
          title={t("unavail.title")}
          message={t("unavail.msg")}
          actionLabel={t("unavail.action")}
          onAction={() => nav.go("explore")}
        />
      </ScreenFrame>
    );
  }

  const contentWarnings = getStoryWorldById(storyData.id)?.contentWarnings ?? [];
  const saved = savedOverride ?? (storyData ? isBookmarked(storyData.id) : false);
  const setSaved = (v: boolean) => setSavedOverride(v);

  const handleShare = async () => {
    const url = shareUrl(storyData.id);
    try {
      if (navigator.share) {
        await navigator.share({ title: storyData.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") toast.error("Couldn't share this story. Copy the address from your browser instead.");
    }
  };

  const handleToggleSaved = () =>
    requireAccount({ reason: "save", subject: storyData.title }, () => {
      if (saved) {
        deleteBookmark(storyData.id);
        toast.success("Removed from Saved");
      } else {
        saveBookmark({ contentId: storyData.id, contentType: "story", savedAt: new Date().toISOString() });
        toast.success("Saved to your Library");
      }
      setSaved(!saved);
    });

  const creatorId = creatorIdFromName(storyData.creator);
  const pricing = getContentPricing(storyData.id);
  const isLocked = pricing.accessTier !== "free" && !hasAccessToContent(storyData.id, authState.user?.id ?? null, creatorId);

  const handleEnterStory = () => {
    if (isLocked) {
      setPaywallOpen(true);
      return;
    }
    if (onEnterStory) {
      onEnterStory();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <SeenImage src={storyData.coverImage} alt={storyData.title} seed={storyData.id} decorative className="w-full h-full object-cover" />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/80 to-black" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col max-w-(--seen-content-max) mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between p-5 pt-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2"
          >
            <button 
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Share"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button 
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label={saved ? "Remove from Saved" : "Save to Library"}
              aria-pressed={saved}
              onClick={handleToggleSaved}
            >
              <Bookmark className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setNoteOpen(true)}
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label={t("note.open")}
            >
              <PenLine className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label={t("report.open.story")}
            >
              <Flag className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        </div>

        {/* Center: Play button */}
        <div className="flex-1 flex items-center justify-center">
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnterStory}
            // Pointer shortcut only: the labelled "Start reading" button below is the accessible control, so this one is hidden from assistive tech and the tab order.
            aria-hidden="true"
            tabIndex={-1}
            className="w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl"
          >
            {isLocked ? <Lock className="w-8 h-8 text-black" aria-hidden /> : <Play className="w-8 h-8 text-black fill-black ml-1" aria-hidden />}
          </motion.button>
        </div>

        {/* Bottom: Content info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 pb-8 space-y-4"
        >
          {/* Category badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs tracking-[0.2em] uppercase text-white/60 backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {storyData.culturalThemes?.[0] || 'Story'}
            </span>
            <span className="text-xs text-white/55">• {storyData.totalDuration}</span>
            {isLocked && (
              <span className="text-xs text-amber-300 flex items-center gap-1 backdrop-blur-sm bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                <Lock className="w-3 h-3" />
                {pricing.accessTier === "one-time-purchase" ? "Premium" : "Subscriber-only"}
              </span>
            )}
          </div>

          {/* Which languages the story has, how it will be heard, and a notice when the viewer's language is missing. */}
          {(() => {
            const codes = languageCodesLine(storyData.languagesAvailable);
            const shown = substitutedLanguage(storyData.languagesAvailable, state.language);
            const name = (l: string) => t(`search.lang.${l}` as StringKey);
            return (
              <div className="space-y-1">
                <p className="text-xs text-white/70">
                  {codes && (
                    <>
                      <span aria-hidden>{t("story.available", { list: codes })}</span>
                      <span className="sr-only">{t("story.available", { list: languageNamesList(storyData.languagesAvailable.map(name), t("list.and")) })}</span>
                      {" · "}
                    </>
                  )}
                  {t("story.listenDevice")}
                </p>
                {shown && (
                  <p role="status" className="text-xs text-white/80">
                    {t("story.fallback", { shown: name(shown), wanted: name(state.language) })}
                  </p>
                )}
              </div>
            );
          })()}

          {/* Title and description */}
          <div className="space-y-3">
            <h1 className="text-3xl tracking-tight text-white leading-tight">
              {storyData.title}
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-[340px]">
              {storyData.description}
            </p>
          </div>

          {/* Credits */}
          <div className="pt-2 space-y-1">
            <p className="text-sm text-white/55">
              Created by <span className="text-white/80">{storyData.creator}</span>
            </p>
            <p className="text-xs text-white/55">
              Released {storyData.releaseDate}
            </p>
          </div>

          {/* Content notes, shown before the story can be started */}
          {contentWarnings.length > 0 && (
            <div role="note" aria-label="Content note" className="rounded-xl border border-amber-300/40 bg-amber-300/10 p-4 text-sm text-white/90">
              <p className="font-medium text-white">Content note</p>
              <p className="mt-1">This story includes: {contentWarnings.join(", ")}.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnterStory}
              className="flex-1 py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              {isLocked ? t("story.unlock") : t("story.start")}
              {isLocked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
            </motion.button>
            
          </div>

        </motion.div>
      </div>

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onUnlocked={() => {
          setPaywallOpen(false);
          onEnterStory?.();
        }}
        contentId={storyData.id}
        contentTitle={storyData.title}
        creatorName={storyData.creator}
      />

      <NoteSheet open={noteOpen} onOpenChange={setNoteOpen} storyId={storyData.id} storyTitle={storyData.title} />
      <ReportContentSheet open={reportOpen} onOpenChange={setReportOpen} targetType="story" targetId={storyData.id} targetTitle={storyData.title} />
    </motion.div>
  );
}