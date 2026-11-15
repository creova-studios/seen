import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useAppNav } from "../navigation/AppNav";
import { canAccess } from "../navigation/routes";
import { useT } from "../i18n/useT";
import { StoryIntentStep, type StoryIntentData } from "./creator-flow/StoryIntentStep";
import { StoryStructureStep, type StoryStructureData } from "./creator-flow/StoryStructureStep";
import { MediaChaptersStep, type MediaChaptersData } from "./creator-flow/MediaChaptersStep";
import { ContextAccessibilityStep, type ContextAccessibilityData } from "./creator-flow/ContextAccessibilityStep";
import { PreviewPublishStep, type PublishData } from "./creator-flow/PreviewPublishStep";
import { PostPublishSuccess } from "./creator-flow/PostPublishSuccess";
import {
  getOrCreateDraft,
  updateDraft,
  deleteDraft,
  publishStory,
} from "../data/userStoriesService";

type WizardStep = "intent" | "structure" | "media" | "context" | "preview" | "success";

interface CreatorPublishFlowProps {
  onClose: () => void;
  onViewStory: (storyId: string) => void;
  onGoToLibrary: () => void;
  onViewEarnings: () => void;
}

export function CreatorPublishFlow({ onClose, onViewStory, onGoToLibrary, onViewEarnings }: CreatorPublishFlowProps) {
  const { state: authState } = useAuth();
  const nav = useAppNav();
  const t = useT();
  // Creators and admins can jump to their stories from the first step (PR-2). The draft is saved per step, so nothing is lost.
  const canSeeStories = !!authState.user && canAccess("creator-stories", authState.user.role);
  const creatorId = authState.user?.id ?? "creator_demo";
  const creatorName = authState.user?.name ?? "Creator";

  // One active draft per creator — reopening "New Story" resumes it rather
  // than silently discarding in-progress work.
  const [draftId] = useState(() => `draft_${creatorId}`);
  const [draft] = useState(() => getOrCreateDraft(creatorId, draftId));

  const [step, setStep] = useState<WizardStep>("intent");
  const [intentData, setIntentData] = useState<StoryIntentData | undefined>(draft.intent as StoryIntentData);
  const [structureData, setStructureData] = useState<StoryStructureData | undefined>(draft.structure as StoryStructureData);
  const [mediaData, setMediaData] = useState<MediaChaptersData | undefined>(draft.media as MediaChaptersData);
  const [contextData, setContextData] = useState<ContextAccessibilityData | undefined>(draft.context as ContextAccessibilityData);
  const [publishedStoryId, setPublishedStoryId] = useState<string | null>(null);
  const [publishedTitle, setPublishedTitle] = useState("");
  const [publishedVisibility, setPublishedVisibility] = useState<PublishData["visibility"]>("public");

  const handleClose = () => {
    // Progress is already auto-saved per-step via updateDraft, so closing
    // mid-wizard doesn't lose work — the draft resumes next time.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <AnimatePresence mode="wait">
        {step === "intent" && (
          <IntentWrapper key="intent" onClose={handleClose}>
            <StoryIntentStep
              footerLink={canSeeStories ? { label: t("nav.yourStories"), onClick: () => nav.go("creator-stories") } : undefined}
              initialData={intentData ?? draft.intent}
              onSaveDraft={data => updateDraft(draftId, { intent: data })}
              onNext={data => {
                setIntentData(data);
                updateDraft(draftId, { intent: data });
                setStep("structure");
              }}
            />
          </IntentWrapper>
        )}

        {step === "structure" && (
          <StoryStructureStep
            key="structure"
            initialData={structureData ?? draft.structure}
            onBack={() => setStep("intent")}
            onSaveDraft={data => updateDraft(draftId, { structure: data })}
            onNext={data => {
              setStructureData(data);
              updateDraft(draftId, { structure: data });
              setStep("media");
            }}
          />
        )}

        {step === "media" && (
          <MediaChaptersStep
            key="media"
            initialData={mediaData ?? draft.media}
            structureType={structureData?.structureType ?? "linear"}
            onBack={() => setStep("structure")}
            onSaveDraft={data => updateDraft(draftId, { media: data })}
            onNext={data => {
              setMediaData(data);
              updateDraft(draftId, { media: data });
              setStep("context");
            }}
          />
        )}

        {step === "context" && (
          <ContextAccessibilityStep
            key="context"
            initialData={contextData ?? draft.context}
            storyLanguages={intentData?.languages ?? ["en"]}
            onBack={() => setStep("media")}
            onSaveDraft={data => updateDraft(draftId, { context: data })}
            onNext={data => {
              setContextData(data);
              updateDraft(draftId, { context: data });
              setStep("preview");
            }}
          />
        )}

        {step === "preview" && intentData && structureData && mediaData && contextData && (
          <PreviewPublishStep
            key="preview"
            storyTitle={intentData.title}
            totalChapters={mediaData.chapters.length}
            storyLanguages={intentData.languages}
            onBack={() => setStep("context")}
            onPublish={publishData => {
              const story = publishStory(
                creatorId,
                creatorName,
                intentData,
                structureData,
                mediaData,
                contextData,
                publishData
              );
              deleteDraft(draftId);
              setPublishedStoryId(story.id);
              setPublishedTitle(intentData.title);
              setPublishedVisibility(publishData.visibility);
              setStep("success");
            }}
          />
        )}

        {step === "success" && publishedStoryId && (
          <PostPublishSuccess
            key="success"
            storyTitle={publishedTitle}
            visibility={publishedVisibility}
            onViewStory={() => onViewStory(publishedStoryId)}
            onGoToLibrary={onGoToLibrary}
            onViewAnalytics={() => onViewEarnings()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Wraps only the first step with a close affordance — the rest use each
 * step's own Back button to move backward through the wizard. */
function IntentWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="fixed top-6 right-5 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70"
        aria-label="Close"
      >
        ✕
      </button>
      {children}
    </div>
  );
}
