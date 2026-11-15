/**
 * SECTION-SPECIFIC DATA QUERIES
 * SEEN by CREOVA
 * 
 * Each query function is scoped to a specific section context.
 * NO cross-section data sharing. NO fallback content.
 */

import type { 
  ContentItem, 
  ContentLanguage,
  UserIntent,
  UserRole,
  ForYouFeedItem,
  ExploreCategory,
  LibraryData,
  UserProgress,
  UserBookmark,
  EmptyState
} from './types';
import { 
  ALL_CONTENT,
  MUSIC_CONTENT,
  STORY_CONTENT,
  FILM_CONTENT,
  INSTITUTIONAL_CONTENT,
  getContentById
} from './database';
import { validateContentArray } from './types';

// ============================================
// FOR YOU SECTION QUERIES
// ============================================

/**
 * Get personalized feed for For You section
 * Based on user language, intent, and preferences
 * 
 * NO FALLBACK CONTENT - returns empty array if no matches
 */
export function getForYouFeed(
  userLanguage: ContentLanguage,
  userIntent: UserIntent,
  limit: number = 10
): ForYouFeedItem[] {
  let items: ContentItem[] = [];
  
  // Personalization logic based on intent
  switch (userIntent) {
    case 'explore':
      // Prioritize featured stories and music
      items = ALL_CONTENT
        .filter(item => 
          item.featured === true || 
          item.language.includes(userLanguage)
        )
        .sort((a, b) => {
          // Featured first
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          // Then by language match
          const aMatch = a.language.includes(userLanguage);
          const bMatch = b.language.includes(userLanguage);
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0;
        })
        .slice(0, limit);
      break;
      
    case 'create':
      // Prioritize stories and creative content
      items = [...STORY_CONTENT, ...FILM_CONTENT, ...MUSIC_CONTENT]
        .filter(item => item.language.includes(userLanguage))
        .slice(0, limit);
      break;
      
    case 'contribute':
      // Show institutional collections and archives
      items = [...INSTITUTIONAL_CONTENT, ...STORY_CONTENT]
        .filter(item => item.language.includes(userLanguage))
        .slice(0, limit);
      break;
  }
  
  // Validate and map to ForYouFeedItem
  const validItems = validateContentArray(items, 'FOR_YOU');
  
  return validItems.map(item => ({
    ...item,
    recommendationReason: getRecommendationReason(item, userLanguage, userIntent),
    relevanceScore: calculateRelevanceScore(item, userLanguage, userIntent)
  }));
}

function getRecommendationReason(
  item: ContentItem, 
  userLanguage: ContentLanguage,
  userIntent: UserIntent
): string {
  if (item.featured) return 'Featured';
  if (item.new) return 'New Release';
  if (item.trending) return 'Trending';
  if (item.language.includes(userLanguage)) return `Available in ${userLanguage.toUpperCase()}`;
  if (userIntent === 'create' && item.type === 'story') return 'Recommended for Creators';
  return 'Recommended';
}

function calculateRelevanceScore(
  item: ContentItem,
  userLanguage: ContentLanguage,
  userIntent: UserIntent
): number {
  let score = 0;
  
  if (item.featured) score += 0.5;
  if (item.new) score += 0.3;
  if (item.trending) score += 0.2;
  if (item.language.includes(userLanguage)) score += 0.4;
  
  // Intent-based scoring
  if (userIntent === 'create' && (item.type === 'story' || item.type === 'film')) score += 0.3;
  if (userIntent === 'contribute' && item.institutional) score += 0.4;
  
  return Math.min(score, 1);
}

/**
 * Get empty state for For You section
 */
export function getForYouEmptyState(): EmptyState {
  return {
    icon: 'Heart',
    title: 'Your feed is being prepared',
    message: 'Check back soon for personalized recommendations based on your preferences.',
    actionLabel: 'Explore Stories',
    actionTarget: 'explore'
  };
}

// ============================================
// EXPLORE SECTION QUERIES
// ============================================

/**
 * Get curated categories for Explore section
 * Fixed categories with diverse content
 * 
 * NO FALLBACK CONTENT - returns empty categories if no items
 */
export function getExploreCategories(): ExploreCategory[] {
  const categories: ExploreCategory[] = [
    {
      id: 'featured-stories',
      name: 'Featured Stories',
      description: 'Hand-picked narratives',
      items: validateContentArray(
        STORY_CONTENT.filter(item => item.featured || item.new),
        'EXPLORE_FEATURED_STORIES'
      )
    },
    {
      id: 'new-music',
      name: 'New Music',
      description: 'Latest releases',
      items: validateContentArray(
        MUSIC_CONTENT.filter(item => item.new || item.trending),
        'EXPLORE_NEW_MUSIC'
      )
    },
    {
      id: 'documentary-films',
      name: 'Documentary Films',
      description: 'Cultural stories on screen',
      items: validateContentArray(
        FILM_CONTENT,
        'EXPLORE_DOCUMENTARY_FILMS'
      )
    },
    {
      id: 'institutional-collections',
      name: 'Institutional Collections',
      description: 'Cultural heritage & archives',
      items: validateContentArray(
        INSTITUTIONAL_CONTENT,
        'EXPLORE_INSTITUTIONAL'
      )
    }
  ];
  
  // Filter out empty categories
  return categories.filter(cat => cat.items.length > 0);
}

/**
 * Get trending content for Explore
 */
export function getExploreTrending(): ContentItem[] {
  return validateContentArray(
    ALL_CONTENT.filter(item => item.trending === true),
    'EXPLORE_TRENDING'
  );
}

/**
 * Get new releases for Explore
 */
export function getExploreNewReleases(): ContentItem[] {
  return validateContentArray(
    ALL_CONTENT.filter(item => item.new === true),
    'EXPLORE_NEW_RELEASES'
  );
}

/**
 * Get empty state for Explore section
 */
export function getExploreEmptyState(): EmptyState {
  return {
    icon: 'Compass',
    title: 'No content available',
    message: 'We\'re constantly adding new stories, music, and films. Check back soon!',
    actionLabel: 'Return to For You',
    actionTarget: 'for_you'
  };
}

// ============================================
// LIBRARY SECTION QUERIES
// ============================================

/**
 * Get library content for user
 * ONLY returns content user has explicitly interacted with
 * 
 * NO DEFAULT CONTENT - returns empty arrays if no saved/progress items
 */
export function getLibraryData(
  inProgressIds: string[],
  savedIds: string[],
  progressMap: Map<string, UserProgress>,
  bookmarkMap: Map<string, UserBookmark>
): LibraryData {
  // Get in-progress content
  const inProgress = inProgressIds
    .map(id => {
      const content = getContentById(id);
      const progress = progressMap.get(id);
      if (!content || !progress) return null;
      return { content, progress };
    })
    .filter((item): item is { content: ContentItem; progress: UserProgress } => item !== null);
  
  // Get saved content
  const saved = savedIds
    .map(id => {
      const content = getContentById(id);
      const bookmark = bookmarkMap.get(id);
      if (!content || !bookmark) return null;
      return { content, bookmark };
    })
    .filter((item): item is { content: ContentItem; bookmark: UserBookmark } => item !== null);
  
  // Get completed content
  const completed = Array.from(progressMap.values())
    .filter(p => p.completed)
    .map(progress => {
      const content = getContentById(progress.contentId);
      if (!content) return null;
      return { content, progress };
    })
    .filter((item): item is { content: ContentItem; progress: UserProgress } => item !== null);
  
  return {
    inProgress,
    saved,
    completed
  };
}

/**
 * Get empty state for Library section
 */
export function getLibraryEmptyState(section: 'inProgress' | 'saved' | 'completed'): EmptyState {
  switch (section) {
    case 'inProgress':
      return {
        icon: 'Play',
        title: 'No stories in progress',
        message: 'Start exploring to see your in-progress content here.',
        actionLabel: 'Explore Stories',
        actionTarget: 'explore'
      };
    case 'saved':
      return {
        icon: 'Bookmark',
        title: 'No saved content',
        message: 'Save stories and music you want to revisit later.',
        actionLabel: 'Browse For You',
        actionTarget: 'for_you'
      };
    case 'completed':
      return {
        icon: 'Check',
        title: 'No completed content',
        message: 'Content you finish will appear here.',
        actionLabel: 'Start Exploring',
        actionTarget: 'explore'
      };
  }
}

// ============================================
// ROLE-BASED FILTERING
// ============================================

/**
 * Filter content based on user role
 * Ensures users only see content appropriate for their permissions
 */
export function filterContentByRole(
  content: ContentItem[],
  userRole: UserRole
): ContentItem[] {
  switch (userRole) {
    case 'viewer':
      // Viewers see only published, public content
      return content.filter(item => !item.institutional);
      
    case 'creator':
      // Creators see all content including drafts (would check draft status)
      return content;
      
    case 'moderator':
      // Moderators see all content for review
      return content;
      
    case 'admin':
      // Admins see everything including institutional collections
      return content;
      
    default:
      return content;
  }
}

// ============================================
// CONTENT TYPE HELPERS
// ============================================

/**
 * Get content type label for UI display
 */
export function getContentTypeLabel(type: string): string {
  switch (type) {
    case 'music': return 'Music';
    case 'story': return 'Story';
    case 'film': return 'Film';
    case 'collection': return 'Collection';
    case 'archive': return 'Archive';
    default: return 'Content';
  }
}

/**
 * Get content type color for badges
 */
export function getContentTypeColor(type: string): string {
  switch (type) {
    case 'music': return 'purple';
    case 'story': return 'blue';
    case 'film': return 'orange';
    case 'collection': return 'green';
    case 'archive': return 'amber';
    default: return 'gray';
  }
}

// ============================================
// CREATOR MODE QUERIES
// ============================================

/**
 * Get creator performance data
 */
export function getCreatorPerformanceData() {
  return {
    period: 'Last 30 days',
    views: 2845,
    viewsTrend: 12,
    completion: 78,
    responses: 156,
  };
}

/**
 * Get creator drafts in progress
 */
export function getCreatorDrafts() {
  return [
    {
      id: 'draft-1',
      title: 'Montreal Jazz History',
      progress: 65,
      lastEdited: '2 hours ago',
    },
    {
      id: 'draft-2',
      title: 'Indigenous Storytelling',
      progress: 30,
      lastEdited: '1 day ago',
    },
  ];
}

/**
 * Get creator recommendations
 */
export function getCreatorRecommendations() {
  return [
    {
      id: 'rec-1',
      title: 'Add multilingual captions',
      description: 'Increase accessibility and reach by adding French and Spanish captions to your content.',
    },
    {
      id: 'rec-2',
      title: 'Explore trending formats',
      description: 'Audio-first stories are seeing 23% higher completion rates this month.',
    },
  ];
}

/**
 * Get creator open calls and opportunities
 */
export function getCreatorOpenCalls(language: ContentLanguage) {
  const calls = [
    {
      id: 'call-1',
      title: 'Indigenous Voices in Digital Media',
      description: 'Seeking contemporary stories from Indigenous creators exploring digital storytelling, traditional knowledge, and cultural preservation.',
      category: 'Cultural Heritage',
      organization: 'National Film Board',
      deadline: 'March 30, 2026',
      featured: true,
      languages: ['en', 'fr'] as ContentLanguage[],
    },
    {
      id: 'call-2',
      title: 'Franco-African Music Archives',
      description: 'Open call for music historians and creators to contribute to our expanding Franco-African music collection.',
      category: 'Music & Archives',
      organization: 'Canadian Museum',
      deadline: 'April 15, 2026',
      featured: false,
      languages: ['fr', 'en'] as ContentLanguage[],
    },
    {
      id: 'call-3',
      title: 'Urban Documentary Series',
      description: 'Documentary filmmakers wanted for a series exploring cultural identity in Canadian cities.',
      category: 'Film & Documentary',
      organization: 'CBC Arts',
      deadline: 'May 1, 2026',
      featured: true,
      languages: ['en', 'fr'] as ContentLanguage[],
    },
  ];

  return calls.filter(call => call.languages.includes(language));
}

/**
 * Get trending content formats
 */
export function getTrendingFormats() {
  return [
    {
      id: 'trend-1',
      type: 'music' as const,
      growth: 23,
      description: 'Audio-first storytelling with archival samples',
    },
    {
      id: 'trend-2',
      type: 'film' as const,
      growth: 18,
      description: 'Short-form documentary (8-12 min)',
    },
    {
      id: 'trend-3',
      type: 'story' as const,
      growth: 15,
      description: 'Multimedia essays with historical context',
    },
  ];
}

/**
 * Get institutional collection opportunities
 */
export function getInstitutionalOpportunities(language: ContentLanguage) {
  const opportunities = [
    {
      id: 'inst-1',
      institution: 'National Gallery of Canada',
      collection: 'Contemporary Indigenous Art',
      themes: ['Identity', 'Land', 'Resistance'],
      languages: ['en', 'fr'] as ContentLanguage[],
    },
    {
      id: 'inst-2',
      institution: 'Musée des beaux-arts de Montréal',
      collection: 'Franco-Quebec Cultural History',
      themes: ['Heritage', 'Language', 'Community'],
      languages: ['fr', 'en'] as ContentLanguage[],
    },
    {
      id: 'inst-3',
      institution: 'Toronto Public Library',
      collection: 'Multicultural Toronto Archives',
      themes: ['Immigration', 'Urban Life', 'Diversity'],
      languages: ['en', 'fr', 'es'] as ContentLanguage[],
    },
  ];

  return opportunities.filter(opp => opp.languages.includes(language));
}