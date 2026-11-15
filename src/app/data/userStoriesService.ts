/**
 * CREATOR-PUBLISHED STORIES — SERVICE LAYER
 *
 * localStorage-backed persistence for stories created through the
 * CreatorPublishFlow wizard. Kept as a separate namespace from the static
 * STORY_WORLDS catalog (storyDatabase.ts) rather than mutating it, so the
 * curated catalog stays untouched. getStoryWorldById/getChaptersForStory/
 * getChapterById in storyDatabase.ts fall back to this store when a story
 * isn't found in the static catalog, so creator-published stories are
 * readable through the same screens as curated ones.
 */

import type { StoryWorld, Chapter, Language, MultilingualText } from './storyDatabase';
import type { StoryIntentData } from '../components/creator-flow/StoryIntentStep';
import type { StoryStructureData } from '../components/creator-flow/StoryStructureStep';
import type { MediaChaptersData, Chapter as WizardChapter } from '../components/creator-flow/MediaChaptersStep';
import type { ContextAccessibilityData } from '../components/creator-flow/ContextAccessibilityStep';
import type { PublishData } from '../components/creator-flow/PreviewPublishStep';

const STORIES_KEY = 'seenos_user_stories';
const DRAFTS_KEY = 'seenos_creator_drafts';

export interface CreatorDraft {
  id: string;
  creatorId: string;
  updatedAt: string;
  intent?: Partial<StoryIntentData>;
  structure?: Partial<StoryStructureData>;
  media?: Partial<MediaChaptersData>;
  context?: Partial<ContextAccessibilityData>;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function toMultilingual(text: string, languages: Language[]): MultilingualText {
  // The wizard collects each field once, not per-language, so the same
  // text is used for every selected language. getLocalizedText's
  // fallback-to-English behavior means this degrades gracefully — it's
  // not real translation, but every selected language still resolves to
  // real creator-authored text rather than a blank field.
  const result: MultilingualText = { en: '', fr: '', es: '' };
  languages.forEach(lang => { result[lang] = text; });
  if (!result.en) result.en = text; // guarantee the fallback language is never empty
  return result;
}

// ============================================
// DRAFTS (auto-saved as the wizard progresses)
// ============================================

export function getOrCreateDraft(creatorId: string, draftId: string): CreatorDraft {
  const drafts = load<Record<string, CreatorDraft>>(DRAFTS_KEY, {});
  if (drafts[draftId]) return drafts[draftId];
  const fresh: CreatorDraft = { id: draftId, creatorId, updatedAt: new Date().toISOString() };
  drafts[draftId] = fresh;
  save(DRAFTS_KEY, drafts);
  return fresh;
}

export function updateDraft(draftId: string, updates: Partial<Omit<CreatorDraft, 'id' | 'creatorId'>>): CreatorDraft {
  const drafts = load<Record<string, CreatorDraft>>(DRAFTS_KEY, {});
  const existing = drafts[draftId];
  const updated: CreatorDraft = {
    ...(existing ?? { id: draftId, creatorId: '', updatedAt: new Date().toISOString() }),
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  drafts[draftId] = updated;
  save(DRAFTS_KEY, drafts);
  return updated;
}

export function deleteDraft(draftId: string): void {
  const drafts = load<Record<string, CreatorDraft>>(DRAFTS_KEY, {});
  delete drafts[draftId];
  save(DRAFTS_KEY, drafts);
}

export function listDraftsForCreator(creatorId: string): CreatorDraft[] {
  return Object.values(load<Record<string, CreatorDraft>>(DRAFTS_KEY, {})).filter(d => d.creatorId === creatorId);
}

// ============================================
// PUBLISHED STORIES
// ============================================

export function publishStory(
  creatorId: string,
  creatorName: string,
  intent: StoryIntentData,
  structure: StoryStructureData,
  media: MediaChaptersData,
  context: ContextAccessibilityData,
  publish: PublishData
): StoryWorld {
  const storyId = `user_${crypto.randomUUID()}`;
  const languages = intent.languages.length > 0 ? intent.languages : (['en'] as Language[]);

  const chapters: Chapter[] = media.chapters
    .filter(ch => ch.title.trim() && ch.text.trim())
    .map((ch: WizardChapter, index) => ({
      id: `${storyId}-ch${index + 1}`,
      order: index + 1,
      title: toMultilingual(ch.title, languages),
      description: toMultilingual(ch.description, languages),
      text: toMultilingual(ch.text, languages),
      media: {
        narration: ch.narration ? { url: ch.narration.file, duration: ch.narration.duration } : undefined,
        ambient: ch.ambient ? { url: ch.ambient.file } : undefined,
        music: ch.music ? { url: ch.music.file } : undefined,
        images: ch.images,
        imageAlt: ch.imageDecorative ? undefined : ch.imageAlt?.trim() || undefined,
        imageDecorative: ch.imageDecorative || undefined,
        video: ch.video ? { url: ch.video.file, duration: ch.video.duration } : undefined,
      },
      estimatedDuration: ch.estimatedDuration,
      contextCards: context.contextCards.map(card => ({
        id: card.id,
        type: card.type,
        title: toMultilingual(card.title, languages),
        content: toMultilingual(card.content, languages),
      })),
    }));

  const totalMinutes = chapters.reduce((sum, ch) => sum + ch.estimatedDuration, 0);

  const story: StoryWorld = {
    id: storyId,
    title: toMultilingual(intent.title, languages),
    description: toMultilingual(intent.description, languages),
    creator: toMultilingual(creatorName, languages),
    // No stock fallback: a story without a cover shows SEEN's own tile rather than someone else's photograph.
    coverImage: media.chapters[0]?.images?.[0] || '',
    releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    languagesAvailable: languages,
    culturalThemes: intent.culturalThemes,
    totalDuration: `${totalMinutes} min`,
    chapterCount: chapters.length,
    chapters,
    visibility: publish.visibility,
    contentWarnings: context.contentWarnings && context.contentWarnings.length > 0 ? context.contentWarnings : undefined,
    institutionalPartner: publish.institutionalCollection || undefined,
    new: true,
  };

  const stories = load<Record<string, StoryWorld & { creatorId: string }>>(STORIES_KEY, {});
  stories[storyId] = { ...story, creatorId };
  save(STORIES_KEY, stories);

  return story;
}

export function getUserStoryWorldById(id: string): StoryWorld | undefined {
  const stories = load<Record<string, StoryWorld>>(STORIES_KEY, {});
  return stories[id];
}

export function listStoriesForCreator(creatorId: string): StoryWorld[] {
  const stories = load<Record<string, StoryWorld & { creatorId: string }>>(STORIES_KEY, {});
  return Object.values(stories).filter(s => s.creatorId === creatorId);
}

export function getAllUserStoryWorlds(): StoryWorld[] {
  return Object.values(load<Record<string, StoryWorld>>(STORIES_KEY, {}));
}
