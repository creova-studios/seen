import './polyfill';
import { useSyncExternalStore } from 'react';
import { getAllUserStoryWorlds } from '@seen/data/userStoriesService';
import { catalogVersion, subscribeCatalog } from './create';
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
import type { Creator } from '@seen/services/contracts';
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

/** The catalogue plus stories people published on this phone (public ones only). */
export const getPublicStories = (): StoryWorld[] => [...getAllUserStoryWorlds().filter(s => s.visibility === 'public'), ...getCatalogStories()];
/** Same list, and the screen redraws when someone publishes. */
export const usePublicStories = () => {
  useSyncExternalStore(subscribeCatalog, catalogVersion);
  return getPublicStories();
};

export { FUNDING_LISTINGS } from '@seen/services/data/fundingListings';
export { formatAmount, formatStatus, isApplyable, opportunityStatus } from '@seen/services/funding';
export type { FundingOpportunity } from '@seen/services/contracts';
