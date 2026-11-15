import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, List, Share2, Bookmark, Info, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePlayback } from "../playback/PlaybackProvider";
import { pushNotification } from "../services";
import { deleteBookmark, isBookmarked, saveBookmark } from "../data/userDataService";
import { toast } from "sonner";
import { ExpandedPlayer } from "./seen/MediaPlayerBar";
import { Button } from "./seen/primitives";
import { CaptionBar, FollowAlongText, PlayerAlert, ReaderTools, StoryCompletion, TranscriptSheet } from "./StoryReaderExtras";
import { useAppNav } from "../navigation/AppNav";
import { useT } from "../i18n/useT";
import { SeenImage } from "./seen/SeenImage";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { useGuest } from "../guest/useGuest";
import {
  getChaptersForStory,
  getLocalizedText,
  type Chapter,
  getChapterById,
  getStoryWorldById
} from "../data/storyDatabase";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ContextCardModal } from "./ContextCardModal";
import { shareUrl } from "../navigation/shareUrl";
import { CommunityResponsesPanel } from "./CommunityResponsesPanel";
import { BranchingChoiceOverlay } from "./BranchingChoiceOverlay";
import { SubmitResponseModal } from "./SubmitResponseModal";
import { submitCommunityResponse, getApprovedResponsesForChapter } from "../data/adminService";

interface StoryChapterScreenProps {
  onClose: () => void;
  onShowIndex: () => void;
  storyWorldId?: string;
}

export function StoryChapterScreen({ 
  onClose, 
  onShowIndex,
  storyWorldId = 'midnight-resonance'
}: StoryChapterScreenProps) {
  const { state, navigateToChapter, updateAudioState, saveProgress, setLanguage, recordBranchChoice, setAccessibilityPreferences } = useStoryState();
  const nav = useAppNav();
  const { requireAccount } = useGuest();
  const { state: authState } = useAuth();
  const chapters = getChaptersForStory(storyWorldId);
  const storyWorld = getStoryWorldById(storyWorldId);
  
  const [currentChapter, setCurrentChapter] = useState<Chapter>(() => {
    // Resume from saved progress or start at first chapter
    const savedChapterId = state.currentChapterId;
    return chapters.find(ch => ch.id === savedChapterId) || chapters[0];
  });
  
  const [controlsVisible, setControlsVisible] = useState(true);
  
  // NEW: State for context cards, community responses, and branching
  const [selectedContextCardIndex, setSelectedContextCardIndex] = useState<number | null>(null);
  const [showCommunityResponses, setShowCommunityResponses] = useState(false);
  const [showSubmitResponse, setShowSubmitResponse] = useState(false);
  const [showBranchChoice, setShowBranchChoice] = useState(false);
  const [hasMadeBranchChoice, setHasMadeBranchChoice] = useState(false);
  
  // Early return if no chapter is found
  if (!currentChapter) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <div className="text-white/60 text-center px-5">
          <p className="mb-4">No chapters available</p>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  // Get context cards and responses for current chapter.
  // Community responses come from the real moderation queue — only
  // moderator-approved submissions are shown to readers.
  const contextCards = currentChapter.contextCards || [];
  const approvedResponses = getApprovedResponsesForChapter(currentChapter.id);
  const communityResponses = approvedResponses.map(r => ({
    id: r.id,
    type: r.type,
    content: r.content,
    authorName: r.contributorName,
    timestamp: r.timestamp,
    language: r.language,
  }));
  const branchChoice = currentChapter.branchChoices?.[0]; // Get first branch choice if available
  
  // Shared playback engine: keeps narrating if the reader is left, and falls
  // back to the device voice when no recorded narration exists.
  const playback = usePlayback();
  const loadChapter = () =>
    playback.load({
      storyId: storyWorldId,
      chapterId: currentChapter.id,
      title: getLocalizedText(currentChapter.title, state.language),
      artist: storyWorld ? getLocalizedText(storyWorld.creator, state.language) : undefined,
      src: currentChapter.media?.narration?.url,
      text: getLocalizedText(currentChapter.text, state.language),
      lang: state.language,
      coverImage: storyWorld?.coverImage,
    });
  useEffect(() => {
    loadChapter();
  }, [currentChapter.id, state.language]); // eslint-disable-line react-hooks/exhaustive-deps

  const t = useT();
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const textScroller = useRef<HTMLDivElement>(null);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionSeen, setCompletionSeen] = useState(false);
  const chapterText = getLocalizedText(currentChapter.text, state.language);
  const captionsOn = state.accessibilityPreferences.captionsEnabled;
  const onLastChapter = chapters.findIndex(ch => ch.id === currentChapter.id) === chapters.length - 1;
  // Reaching the end of the last chapter completes the story (once per visit to that chapter).
  useEffect(() => {
    setCompletionSeen(false);
  }, [currentChapter.id]);
  useEffect(() => {
    if (onLastChapter && playback.status === "ended" && !completionSeen) {
      setCompletionOpen(true);
      setCompletionSeen(true);
    }
  }, [onLastChapter, playback.status, completionSeen]);

  useEffect(() => {
    updateAudioState({ isPlaying: playback.status === "playing", playbackPosition: playback.elapsed });
  }, [playback.status, playback.elapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [controlsVisible]);

  // Save progress when chapter changes
  useEffect(() => {
    navigateToChapter(currentChapter.id);
    saveProgress();
  }, [currentChapter.id]);

  const handleShowControls = () => {
    setControlsVisible(true);
  };

  // NEW: Handler for branching choice
  const handleBranchChoice = (optionId: string, nextChapterId?: string) => {
    if (!branchChoice) return;
    
    // Record the choice
    recordBranchChoice(currentChapter.id, branchChoice.id, optionId);
    setHasMadeBranchChoice(true);
    setShowBranchChoice(false);
    
    // If this is a hard branch (impacts outcome), navigate to specific chapter
    if (branchChoice.impactsOutcome && nextChapterId) {
      const targetChapter = getChapterById(storyWorldId, nextChapterId);
      if (targetChapter) {
        playback.pause();
        setTimeout(() => {
          setCurrentChapter(targetChapter);
        }, 600);
      }
    }
    // For soft branches, just continue normally
  };

  // Handler for community response submission
  const handleSubmitResponse = () => {
    setShowCommunityResponses(false);
    setShowSubmitResponse(true);
  };

  const [submissionForceRefresh, setSubmissionForceRefresh] = useState(0);

  const [saved, setSaved] = useState(() => isBookmarked(storyWorldId));
  const handleToggleSaved = () =>
    requireAccount({ reason: "save", subject: storyWorld ? getLocalizedText(storyWorld.title, state.language) : undefined }, () => {
      if (saved) {
        deleteBookmark(storyWorldId);
        toast.success("Removed from Saved");
      } else {
        saveBookmark({ contentId: storyWorldId, contentType: "story", savedAt: new Date().toISOString() });
        toast.success("Saved to your Library");
      }
      setSaved(!saved);
    });

  const handleShare = async () => {
    const url = shareUrl(storyWorldId);
    const title = storyWorld ? getLocalizedText(storyWorld.title, state.language) : "SEEN";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") toast.error("Couldn't share this story. Copy the address from your browser instead.");
    }
  };

  const handleActualSubmit = (type: "text" | "audio" | "image", content: string, isAnonymous: boolean) => {
    submitCommunityResponse({
      chapterId: currentChapter.id,
      storyId: storyWorldId,
      contributorId: authState.user?.id ?? "anonymous",
      contributorName: isAnonymous ? "Anonymous" : (authState.user?.name ?? "Anonymous"),
      type,
      content,
      language: state.language,
    });
    setShowSubmitResponse(false);
    pushNotification({
      type: "moderation",
      title: "Response sent for review",
      body: `Your response to “${getLocalizedText(currentChapter.title, state.language)}” will appear once a moderator approves it.`,
      target: { screen: "story", id: storyWorldId },
    });
    setSubmissionForceRefresh(n => n + 1); // re-render so any future approved response shows
  };

  // Show branch choice automatically when chapter loads (if not already made)
  useEffect(() => {
    if (branchChoice && !hasMadeBranchChoice) {
      // Show branch choice after a brief delay
      const timer = setTimeout(() => {
        setShowBranchChoice(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentChapter.id, branchChoice]);

  // Reset branch choice state when chapter changes
  useEffect(() => {
    setHasMadeBranchChoice(false);
    setShowBranchChoice(false);
  }, [currentChapter.id]);

  const navigateChapter = (direction: 'prev' | 'next') => {
    // Guests read chapter 1; the rest asks for an account (limited guest mode, D2).
    if (direction === 'next' && !authState.isAuthenticated) {
      requireAccount({ reason: "continue", subject: storyWorld ? getLocalizedText(storyWorld.title, state.language) : undefined });
      return;
    }
    const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      // Cinematic transition: fade out audio
      playback.pause();
      
      // Wait for fade, then switch chapter
      setTimeout(() => {
        setCurrentChapter(chapters[newIndex]);
      }, 500);
    }
  };

  const canGoPrev = chapters.findIndex(ch => ch.id === currentChapter.id) > 0;
  const canGoNext = chapters.findIndex(ch => ch.id === currentChapter.id) < chapters.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleShowControls}
      className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <SeenImage
          src={currentChapter.media?.images?.[0] || storyWorld?.coverImage}
          alt={currentChapter.media?.images?.[0] && !currentChapter.media.imageDecorative ? currentChapter.media.imageAlt ?? "" : ""}
          decorative={!(currentChapter.media?.images?.[0] && !currentChapter.media.imageDecorative && currentChapter.media.imageAlt)}
          seed={storyWorldId}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black" />
      </div>

      {/* Top controls - auto-hide */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-20"
          >
            <div className="max-w-(--seen-content-max) mx-auto flex items-center justify-between p-5 pt-8">
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex gap-2">
                <LanguageSwitcher
                  currentLanguage={state.language}
                  onLanguageChange={setLanguage}
                  availableLanguages={['en', 'fr', 'es']}
                />
                <button
                  onClick={onShowIndex}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Chapter index"
                >
                  <List className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleToggleSaved}
                  aria-pressed={saved}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label={saved ? "Remove from saved" : "Save story"}
                >
                  <Bookmark className={`w-4 h-4 text-white ${saved ? "fill-white" : ""}`} />
                </button>
                <button
                  onClick={() => setSelectedContextCardIndex(contextCards.length > 0 ? 0 : null)}
                  disabled={contextCards.length === 0}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Info"
                >
                  <Info className="w-4 h-4 text-white" />
                  {contextCards.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setShowCommunityResponses(true)}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Community Responses"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  {communityResponses.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                      {communityResponses.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {/* Scrollable text region: long chapters must be readable, never clipped behind the player */}
      <div ref={textScroller} className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-(--seen-content-max) mx-auto min-h-full flex flex-col justify-end p-6 pt-28 space-y-6">
          {/* Chapter indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/55">
              Chapter {currentChapter.order} of {chapters.length}
            </span>
            {/* Soft progress indicator */}
            <div className="flex gap-1">
              {chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`h-1 rounded-full transition-all ${
                    idx <= chapters.findIndex(c => c.id === currentChapter.id)
                      ? 'w-4 bg-white/60'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Chapter title */}
          <motion.h1
            key={currentChapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl tracking-tight text-white leading-tight"
          >
            {getLocalizedText(currentChapter.title, state.language)}
          </motion.h1>

          {/* Chapter content: the spoken sentence is lit and followed while it plays */}
          <motion.div
            key={`${currentChapter.id}-content`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <FollowAlongText
              text={chapterText}
              progress={playback.progress}
              playing={playback.status === "playing"}
              scroller={textScroller}
              reducedMotion={state.accessibilityPreferences.reducedMotion}
              chapterKey={currentChapter.id}
            />
          </motion.div>


        </div>
      </div>

      <TranscriptSheet open={transcriptOpen} onOpenChange={setTranscriptOpen} chapterTitle={getLocalizedText(currentChapter.title, state.language)} text={chapterText} />

      {completionOpen && storyWorld && (
        <StoryCompletion
          story={storyWorld}
          language={state.language}
          minutes={chapters.reduce((n, c) => n + (c.estimatedDuration || 0), 0)}
          chapterCount={chapters.length}
          onReflect={() => { setCompletionOpen(false); setShowSubmitResponse(true); }}
          onKeepReading={() => setCompletionOpen(false)}
          onLibrary={() => { setCompletionOpen(false); nav.go("library"); }}
        />
      )}

      {/* Context Card Modal */}
      {selectedContextCardIndex !== null && contextCards[selectedContextCardIndex] && (
        <ContextCardModal
          isOpen={true}
          onClose={() => setSelectedContextCardIndex(null)}
          contextCard={contextCards[selectedContextCardIndex]}
        />
      )}

      {/* Community Responses Panel */}
      <CommunityResponsesPanel
        isOpen={showCommunityResponses}
        onClose={() => setShowCommunityResponses(false)}
        chapterId={currentChapter.id}
        chapterTitle={getLocalizedText(currentChapter.title, state.language)}
        responses={communityResponses}
        onSubmitResponse={handleSubmitResponse}
      />

      <SubmitResponseModal
        isOpen={showSubmitResponse}
        onClose={() => setShowSubmitResponse(false)}
        chapterId={currentChapter.id}
        chapterTitle={getLocalizedText(currentChapter.title, state.language)}
        onSubmit={handleActualSubmit}
      />

      {/* Branching Choice Overlay */}
      <AnimatePresence>
        {showBranchChoice && branchChoice && (
          <BranchingChoiceOverlay
            branchChoice={branchChoice}
            onChoose={handleBranchChoice}
          />
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="relative z-20 flex-shrink-0 bg-black/90 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-(--seen-content-max) mx-auto px-5 pt-4 pb-5 space-y-3">
          <PlayerAlert status={playback.status} onRetry={loadChapter} />
          <CaptionBar text={chapterText} progress={playback.progress} show={captionsOn && playback.source === "voice" && (playback.status === "playing" || playback.status === "paused")} />
          {captionsOn && playback.source === "recording" && <p className="text-xs text-seen-muted text-center">{t("reader.captions.voiceOnly")}</p>}

          {/* Audio player */}
          <ExpandedPlayer compact />

          {/* At the end of a chapter, offer the next one clearly. It never starts by itself (PR-4). */}
          {canGoNext && playback.status === "ended" && (
            <Button fullWidth onClick={() => navigateChapter('next')} icon={<ChevronRight className="w-4 h-4" aria-hidden />}>
              {t("reader.nextChapter")}
            </Button>
          )}

          <div className="flex justify-center">
            <ReaderTools
              captionsOn={captionsOn}
              onToggleCaptions={() => setAccessibilityPreferences({ captionsEnabled: !captionsOn })}
              onOpenTranscript={() => setTranscriptOpen(true)}
            />
          </div>

          {/* Chapter navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigateChapter('prev')}
              disabled={!canGoPrev}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all
                ${canGoPrev 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-white/5 text-white/55 cursor-not-allowed'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs tracking-wider uppercase">Prev</span>
            </button>

            <button
              onClick={() => (canGoNext ? navigateChapter('next') : setCompletionOpen(true))}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all
                ${canGoNext 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-white/5 text-white/55 cursor-not-allowed'
                }
              `}
            >
              <span className="text-xs tracking-wider uppercase">{canGoNext ? "Next" : t("reader.finish")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}