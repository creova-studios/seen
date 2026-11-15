/**
 * STORY SERVICE
 * SEEN by CREOVA
 * 
 * Data access layer for story worlds with multilingual support,
 * progress tracking, and content rendering.
 */

import {
  STORY_WORLDS,
  getStoryWorldById,
  getChapterById,
  getChaptersForStory,
  getLocalizedText,
  getPublicStories,
  getStoriesByLanguage,
  getFeaturedStories,
  getStoriesByTheme,
  type StoryWorld,
  type Chapter,
  type Language,
  type MultilingualText,
} from './storyDatabase';
import type { ContentItem, UserProgress } from './types';

// ============================================
// STORY TO CONTENT ITEM CONVERSION
// ============================================

/**
 * Convert StoryWorld to ContentItem for rendering in feeds
 */
export function storyWorldToContentItem(
  story: StoryWorld,
  language: Language
): ContentItem {
  return {
    id: story.id,
    type: 'story',
    title: getLocalizedText(story.title, language),
    description: getLocalizedText(story.description, language),
    duration: `${story.chapterCount} chapters • ${story.totalDuration}`,
    creator: getLocalizedText(story.creator, language),
    releaseDate: story.releaseDate,
    language: story.languagesAvailable,
    mediaSource: story.coverImage,
    tags: story.culturalThemes,
    featured: story.featured,
    institutional: story.visibility === 'institutional',
    new: story.new,
    trending: story.trending,
  };
}

// ============================================
// FOR YOU FEED
// ============================================

export interface ForYouFeedParams {
  language: Language;
  userId?: string;
  intent?: 'explore' | 'create' | 'contribute';
  limit?: number;
}

/**
 * Get personalized For You feed
 */
export function getForYouFeed(params: ForYouFeedParams): ContentItem[] {
  const { language, intent, limit = 20 } = params;
  
  // Get stories matching user's language
  const languageMatches = getStoriesByLanguage(language);
  
  // Prioritize featured stories
  const featured = getFeaturedStories();
  
  // Combine and deduplicate
  const allStories = Array.from(new Set([...featured, ...languageMatches]));
  
  // Convert to content items
  const contentItems = allStories
    .slice(0, limit)
    .map(story => storyWorldToContentItem(story, language));
  
  console.log(`[ForYou] Generated feed: ${contentItems.length} stories for language ${language}`);
  
  return contentItems;
}

// ============================================
// EXPLORE FEED
// ============================================

export interface ExploreCategory {
  id: string;
  name: string;
  description?: string;
  items: ContentItem[];
}

/**
 * Get Explore categories with stories
 */
export function getExploreCategories(language: Language): ExploreCategory[] {
  const categories: ExploreCategory[] = [
    {
      id: 'featured',
      name: language === 'en' ? 'Featured' : language === 'fr' ? 'En vedette' : 'Destacado',
      items: getFeaturedStories().map(s => storyWorldToContentItem(s, language)),
    },
    {
      id: 'music-sound',
      name: language === 'en' ? 'Music & Sound' : language === 'fr' ? 'Musique & Son' : 'Música y Sonido',
      items: getStoriesByTheme('Music & Sound').map(s => storyWorldToContentItem(s, language)),
    },
    {
      id: 'migration',
      name: language === 'en' ? 'Migration Stories' : language === 'fr' ? 'Histoires de Migration' : 'Historias de Migración',
      items: getStoriesByTheme('Migration').map(s => storyWorldToContentItem(s, language)),
    },
    {
      id: 'indigenous',
      name: language === 'en' ? 'Indigenous Voices' : language === 'fr' ? 'Voix Autochtones' : 'Voces Indígenas',
      items: getStoriesByTheme('Indigenous').map(s => storyWorldToContentItem(s, language)),
    },
    {
      id: 'documentary',
      name: language === 'en' ? 'Documentary' : language === 'fr' ? 'Documentaire' : 'Documental',
      items: getStoriesByTheme('Documentary').map(s => storyWorldToContentItem(s, language)),
    },
  ];
  
  // Filter out empty categories
  const validCategories = categories.filter(cat => cat.items.length > 0);
  
  console.log(`[Explore] Generated ${validCategories.length} categories for language ${language}`);
  
  return validCategories;
}

// ============================================
// LIBRARY FEED
// ============================================

/**
 * Get user's library (in-progress and completed stories)
 */
export function getLibraryStories(
  progressSnapshots: Array<{ storyWorldId: string; lastCompletedChapterId: string; completed?: boolean }>,
  language: Language
): {
  inProgress: Array<{ content: ContentItem; progress: UserProgress }>;
  completed: Array<{ content: ContentItem; progress: UserProgress }>;
} {
  const inProgress: Array<{ content: ContentItem; progress: UserProgress }> = [];
  const completed: Array<{ content: ContentItem; progress: UserProgress }> = [];
  
  for (const snapshot of progressSnapshots) {
    const story = getStoryWorldById(snapshot.storyWorldId);
    if (!story) {
      console.warn(`[Library] Story not found: ${snapshot.storyWorldId}`);
      continue;
    }
    
    const contentItem = storyWorldToContentItem(story, language);
    
    // Find chapter index using independent registry
    const chapters = getChaptersForStory(snapshot.storyWorldId);
    const chapterIndex = chapters.findIndex(
      ch => ch.id === snapshot.lastCompletedChapterId
    );
    
    const progressPercentage = ((chapterIndex + 1) / story.chapterCount) * 100;
    
    const userProgress: UserProgress = {
      contentId: story.id,
      contentType: 'story',
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      progressPercentage,
      currentChapterId: snapshot.lastCompletedChapterId,
      currentChapterIndex: chapterIndex,
      totalChapters: story.chapterCount,
      completed: snapshot.completed || progressPercentage >= 100,
    };
    
    if (userProgress.completed) {
      completed.push({ content: contentItem, progress: userProgress });
    } else {
      inProgress.push({ content: contentItem, progress: userProgress });
    }
  }
  
  console.log(`[Library] In progress: ${inProgress.length}, Completed: ${completed.length}`);
  
  return { inProgress, completed };
}

// ============================================
// STORY WORLD DATA
// ============================================

/**
 * Get full story world data with localized content
 */
export function getStoryWorldData(storyWorldId: string, language: Language) {
  const story = getStoryWorldById(storyWorldId);
  
  if (!story) {
    console.error(`[StoryWorld] Story not found: ${storyWorldId}`);
    return null;
  }
  
  const chapters = getChaptersForStory(storyWorldId);

  return {
    id: story.id,
    title: getLocalizedText(story.title, language),
    description: getLocalizedText(story.description, language),
    creator: getLocalizedText(story.creator, language),
    coverImage: story.coverImage,
    releaseDate: story.releaseDate,
    totalDuration: story.totalDuration,
    chapterCount: story.chapterCount,
    culturalThemes: story.culturalThemes,
    languagesAvailable: story.languagesAvailable,
    chapters: chapters.map(ch => ({
      id: ch.id,
      order: ch.order,
      title: getLocalizedText(ch.title, language),
      description: getLocalizedText(ch.description, language),
      estimatedDuration: ch.estimatedDuration,
    })),
  };
}

/**
 * Get chapter data with localized content
 */
export function getChapterData(
  storyWorldId: string,
  chapterId: string,
  language: Language
) {
  const chapter = getChapterById(storyWorldId, chapterId);
  
  if (!chapter) {
    console.error(`[Chapter] Chapter not found: ${storyWorldId}/${chapterId}`);
    return null;
  }
  
  return {
    id: chapter.id,
    order: chapter.order,
    title: getLocalizedText(chapter.title, language),
    description: getLocalizedText(chapter.description, language),
    text: getLocalizedText(chapter.text, language),
    media: chapter.media,
    estimatedDuration: chapter.estimatedDuration,
    contextCards: chapter.contextCards?.map(card => ({
      id: card.id,
      type: card.type,
      title: getLocalizedText(card.title, language),
      content: getLocalizedText(card.content, language),
    })),
  };
}

/**
 * Get next chapter in sequence
 */
export function getNextChapter(
  storyWorldId: string,
  currentChapterId: string
): { id: string; title: MultilingualText } | null {
  const chapters = getChaptersForStory(storyWorldId);
  if (chapters.length === 0) return null;

  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);
  if (currentIndex === -1 || currentIndex >= chapters.length - 1) {
    return null; // Last chapter or not found
  }

  const nextChapter = chapters[currentIndex + 1];
  return {
    id: nextChapter.id,
    title: nextChapter.title,
  };
}

/**
 * Get previous chapter in sequence
 */
export function getPreviousChapter(
  storyWorldId: string,
  currentChapterId: string
): { id: string; title: MultilingualText } | null {
  const chapters = getChaptersForStory(storyWorldId);
  if (chapters.length === 0) return null;

  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);
  if (currentIndex <= 0) {
    return null; // First chapter or not found
  }

  const prevChapter = chapters[currentIndex - 1];
  return {
    id: prevChapter.id,
    title: prevChapter.title,
  };
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate story world completeness
 */
export function validateStoryWorld(storyWorldId: string): boolean {
  const story = getStoryWorldById(storyWorldId);

  if (!story) {
    console.error(`[Validation] Story not found: ${storyWorldId}`);
    return false;
  }

  // Check all chapters exist using independent registry
  const chapters = getChaptersForStory(storyWorldId);
  if (chapters.length === 0) {
    console.error(`[Validation] Story has no chapters: ${storyWorldId}`);
    return false;
  }

  // Check multilingual content
  for (const chapter of chapters) {
    if (!chapter.title.en || !chapter.description.en || !chapter.text.en) {
      console.error(`[Validation] Chapter missing English content: ${chapter.id}`);
      return false;
    }
  }

  return true;
}

// ============================================
// SEARCH
// ============================================

/**
 * Search stories by query
 */
export function searchStories(query: string, language: Language): ContentItem[] {
  const lowerQuery = query.toLowerCase();
  
  const results = STORY_WORLDS.filter(story => {
    const title = getLocalizedText(story.title, language).toLowerCase();
    const description = getLocalizedText(story.description, language).toLowerCase();
    const creator = getLocalizedText(story.creator, language).toLowerCase();
    const themes = story.culturalThemes.join(' ').toLowerCase();
    
    return (
      title.includes(lowerQuery) ||
      description.includes(lowerQuery) ||
      creator.includes(lowerQuery) ||
      themes.includes(lowerQuery)
    );
  });
  
  console.log(`[Search] Found ${results.length} results for "${query}" in ${language}`);
  
  return results.map(story => storyWorldToContentItem(story, language));
}
