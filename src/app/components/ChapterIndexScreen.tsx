import { Play } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { getChaptersForStory, getStoryWorldById, getLocalizedText } from "../data/storyDatabase";
import { creatorIdFromName, getContentPricing, hasAccessToContent } from "../data/monetizationService";
import { ScreenFrame } from "../screens/ScreenFrame";
import { ChapterRow, LinearProgress, type ChapterRowState } from "./seen/display";
import { Button, StateTemplate } from "./seen/primitives";

interface ChapterIndexScreenProps {
  onClose: () => void;
  onSelectChapter: (chapterId: string) => void;
  storyWorldId?: string;
}

const COPY = {
  en: { toc: "Table of contents", resume: "Resume story", start: "Start story", total: "min total", chapters: "chapters", locked: "Unlock the story to read" },
  fr: { toc: "Table des matières", resume: "Reprendre l'histoire", start: "Commencer", total: "min au total", chapters: "chapitres", locked: "Débloquez l'histoire pour lire" },
  es: { toc: "Tabla de contenidos", resume: "Reanudar historia", start: "Empezar", total: "min en total", chapters: "capítulos", locked: "Desbloquea la historia para leer" },
} as const;

/** Chapter list using the Figma Chapter Row (Available / Playing / Completed / Locked). */
export function ChapterIndexScreen({ onClose, onSelectChapter, storyWorldId = "midnight-resonance" }: ChapterIndexScreenProps) {
  const { state, getProgressForStory } = useStoryState();
  const { state: authState } = useAuth();
  const chapters = getChaptersForStory(storyWorldId);
  const storyWorld = getStoryWorldById(storyWorldId);
  const progress = getProgressForStory(storyWorldId);
  const t = COPY[state.language] ?? COPY.en;

  if (!storyWorld) {
    return (
      <ScreenFrame title="Chapters" onBack={onClose}>
        <StateTemplate kind="empty" title="Story not found" message="This story isn't available any more." actionLabel="Go back" onAction={onClose} />
      </ScreenFrame>
    );
  }

  const creatorId = creatorIdFromName(getLocalizedText(storyWorld.creator, "en"));
  const locked = getContentPricing(storyWorld.id).accessTier !== "free" && !hasAccessToContent(storyWorld.id, authState.user?.id ?? null, creatorId);
  const completedIndex = progress ? chapters.findIndex(ch => ch.id === progress.lastCompletedChapterId) : -1;
  const currentId = state.currentChapterId;

  const stateOf = (id: string, index: number): ChapterRowState => {
    if (locked) return "locked";
    if (id === currentId) return "playing";
    if (index <= completedIndex || progress?.completed) return "completed";
    return "available";
  };
  const done = progress?.completed ? chapters.length : completedIndex + 1;

  return (
    <ScreenFrame title={getLocalizedText(storyWorld.title, state.language)} onBack={onClose}>
      <section className="pb-6 border-b border-white/5">
        <p className="text-[10px] tracking-[0.14em] uppercase text-seen-muted">{t.toc}</p>
        <p className="text-sm text-seen-secondary leading-relaxed mt-3">{getLocalizedText(storyWorld.description, state.language)}</p>
        <p className="text-xs text-seen-muted mt-3">
          {chapters.reduce((sum, ch) => sum + (ch.estimatedDuration || 0), 0)} {t.total} · {chapters.length} {t.chapters}
        </p>
        <div className="mt-4">
          <LinearProgress value={Math.max(0, done)} max={chapters.length} label={`${Math.max(0, done)} of ${chapters.length} chapters completed`} />
        </div>
      </section>

      <ol className="space-y-3 pt-6">
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <ChapterRow
              index={chapter.order}
              title={getLocalizedText(chapter.title, state.language)}
              meta={`${chapter.estimatedDuration} min`}
              state={stateOf(chapter.id, index)}
              lockedReason={t.locked}
              onSelect={() => onSelectChapter(chapter.id)}
            />
          </li>
        ))}
      </ol>

      {!locked && chapters.length > 0 && (
        <Button className="mt-8" fullWidth icon={<Play className="w-4 h-4" aria-hidden />} onClick={() => onSelectChapter(currentId || chapters[0].id)}>
          {currentId || done > 0 ? t.resume : t.start}
        </Button>
      )}
    </ScreenFrame>
  );
}
