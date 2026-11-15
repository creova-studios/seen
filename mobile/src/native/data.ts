import './polyfill';
import { useSyncExternalStore } from 'react';
import { getAllUserStoryWorlds } from '@seen/data/userStoriesService';
import { bumpCatalog, catalogVersion, subscribeCatalog } from './create';
import {
  getPublicStories as getCatalogStories,
  getStoryWorldById,
  getLocalizedText,
  type Language,
  type StoryWorld,
} from '@seen/data/storyDatabase';
import { getChaptersForStory } from '@seen/data/storyDatabase';
import { translate, type StringKey } from '@seen/i18n/strings';
import { buildCreators } from '@seen/services/demo/catalog';
import { api } from '@seen/services';
import type { Creator, IntakeStoryRecord } from '@seen/services/contracts';
import { availableInterests, storiesForInterests } from '@seen/data/interests';

export type { Language, StoryWorld };
export { getStoryWorldById, getLocalizedText, getChaptersForStory };

export const t = (key: StringKey, lang: Language, vars?: Record<string, string>) => translate(key, lang, vars);

/** Splits chapter text into sentences, the same way the website does (for follow-along reading). */
export const sentencesOf = (text: string) => text.split(/(?<=[.!?…])\s+/).filter(Boolean);

export type { Creator };
export { availableInterests, storiesForInterests };
let creators: Creator[] | null = null;
/** The creators, built from the catalogue exactly as the website builds them. */
export const getCreators = () => (creators ??= buildCreators());
export const getCreator = (id: string) => getCreators().find(c => c.id === id);
/** A creator's banner: the cover of their first catalogue story. */
export const creatorCover = (cr: Creator) => cr.storyIds.map(id => getStoryWorldById(id)?.coverImage).find(Boolean);
export const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

/** The catalogue plus stories people published on this phone or via editorial intake (public ones only). */
export const getPublicStories = (): StoryWorld[] => [...getAllUserStoryWorlds().filter(s => s.visibility === 'public'), ...getCatalogStories()];
/** Same list, and the screen redraws when someone publishes or remote catalogue syncs. */
export const usePublicStories = () => {
  useSyncExternalStore(subscribeCatalog, catalogVersion);
  return getPublicStories();
};

const USER_STORIES_KEY = 'seenos_user_stories';

function toMultilingual(text: string, languages: string[]) {
  const out = { en: '', fr: '', es: '' };
  for (const l of languages) {
    if (l === 'en' || l === 'fr' || l === 'es') out[l] = text;
  }
  if (!out.en) out.en = text;
  return out;
}

function intakeRecordToUserStory(story: IntakeStoryRecord) {
  const langs = story.languages.length ? story.languages : ['en'];
  const chapters = story.chapters.map((ch, idx) => ({
    id: ch.id || `${story.id}-ch${idx + 1}`,
    order: ch.position || idx + 1,
    title: toMultilingual(ch.title, langs),
    description: toMultilingual('', langs),
    text: toMultilingual(ch.body, langs),
    media: {},
    estimatedDuration: Math.max(1, Math.round(ch.body.trim().split(/\s+/).length / 150)),
    contextCards: [],
  }));
  return {
    id: story.id,
    title: toMultilingual(story.title, langs),
    subtitle: toMultilingual(story.themes[0] ?? 'Artist Story', langs),
    description: toMultilingual(story.summary, langs),
    creator: {
      name: 'SEEN Artist',
      bio: toMultilingual('Published via SEEN Editorial Review', langs),
      location: 'SEEN Community',
    },
    coverImage: story.coverUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    culturalTags: story.themes,
    availableLanguages: langs.filter((l): l is Language => l === 'en' || l === 'fr' || l === 'es'),
    chapterCount: chapters.length,
    estimatedTotalDuration: chapters.reduce((acc, c) => acc + c.estimatedDuration, 0),
    isFeatured: false,
    contentWarnings: story.contentWarnings.length ? story.contentWarnings : undefined,
    creatorId: story.authorId,
    visibility: 'public',
    publishedAt: story.publishedAt || new Date().toISOString(),
    chapters,
    contextCards: [],
    hasCaptions: false,
    hasTranscripts: false,
    languageNotes: {},
  };
}

/**
 * Syncs `published` stories from `api.intake.listPublishedStories()` (Supabase or local intake store)
 * into `seenos_user_stories` and notifies subscribers (`usePublicStories`).
 * Safe to call offline: errors are caught and existing cached stories remain intact.
 */
export async function syncPublishedStoriesFromBackend(): Promise<number> {
  try {
    const published = await api.intake.listPublishedStories();
    const raw = localStorage.getItem(USER_STORIES_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const publishedIds = new Set(published.map(s => s.id));

    for (const existingId of Object.keys(map)) {
      if (existingId.startsWith('db_') && !publishedIds.has(existingId)) {
        delete map[existingId];
      }
    }
    for (const story of published) {
      map[story.id] = intakeRecordToUserStory(story);
    }
    localStorage.setItem(USER_STORIES_KEY, JSON.stringify(map));
    bumpCatalog();
    return published.length;
  } catch {
    return 0;
  }
}

export { FUNDING_LISTINGS } from '@seen/services/data/fundingListings';
export { formatAmount, formatStatus, isApplyable, opportunityStatus } from '@seen/services/funding';
export type { FundingOpportunity } from '@seen/services/contracts';
