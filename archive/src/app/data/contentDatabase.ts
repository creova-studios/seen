/**
 * CENTRALIZED CONTENT DATABASE
 * 
 * This file contains ALL content across SEEN by CREOVA
 * Each section (For You, Explore, Library) queries this database
 * with section-specific filters and personalization logic.
 * 
 * WHY THIS EXISTS:
 * - Prevents content duplication across sections
 * - Enables proper filtering by type, language, user state
 * - Supports CMF grant requirements for diverse cultural content
 */

export type ContentType = 'music' | 'story' | 'film' | 'collection' | 'archive';
export type ContentLanguage = 'en' | 'fr' | 'es';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  duration: string; // "45 min" or "12 tracks"
  creator: string;
  releaseDate: string; // "Feb 2026"
  language: ContentLanguage[];
  mediaSource: string; // Image URL
  tags: string[]; // For filtering
  featured?: boolean;
  institutional?: boolean; // CMF institutional content
}

/**
 * MUSIC CONTENT
 */
export const MUSIC_CONTENT: ContentItem[] = [
  {
    id: 'music-001',
    type: 'music',
    title: 'Midnight Resonance',
    description: 'A sonic journey through Tokyo\'s nocturnal soundscapes, blending binaural field recordings with experimental electronic textures.',
    duration: '45 min',
    creator: 'CREOVA Music',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    tags: ['electronic', 'ambient', 'tokyo', 'experimental'],
    featured: true
  },
  {
    id: 'music-002',
    type: 'music',
    title: 'Rythmes Montréalais',
    description: 'Une exploration sonore des quartiers multiculturels de Montréal, fusionnant jazz, hip-hop et musiques du monde.',
    duration: '38 min',
    creator: 'Collectif Urbain',
    releaseDate: 'Jan 2026',
    language: ['fr', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    tags: ['jazz', 'hip-hop', 'montreal', 'urban']
  },
  {
    id: 'music-003',
    type: 'music',
    title: 'Desert Frequencies',
    description: 'Traditional Tuareg guitar meets modular synthesis in this cross-continental collaboration.',
    duration: '52 min',
    creator: 'Tinariwen × Modular Collective',
    releaseDate: 'Dec 2025',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800',
    tags: ['world', 'electronic', 'guitar', 'collaboration']
  },
  {
    id: 'music-004',
    type: 'music',
    title: 'Sonic Migrations',
    description: 'A documentary soundscape tracing immigrant stories through audio archives and contemporary composition.',
    duration: '1h 15min',
    creator: 'Ana Ferreira',
    releaseDate: 'Nov 2025',
    language: ['en', 'es', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    tags: ['documentary', 'archive', 'migration', 'cultural']
  }
];

/**
 * STORY CONTENT
 */
export const STORY_CONTENT: ContentItem[] = [
  {
    id: 'story-001',
    type: 'story',
    title: 'Echoes of Light',
    description: 'A photographer discovers hidden stories in Montreal\'s underground metro system through light and shadow.',
    duration: '4 chapters',
    creator: 'Sophie Tremblay',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    tags: ['photography', 'montreal', 'urban', 'visual']
  },
  {
    id: 'story-002',
    type: 'story',
    title: 'The Last Cassette',
    description: 'Un jeune musicien hérite d\'une cassette mystérieuse qui révèle l\'histoire cachée de sa famille à travers trois générations.',
    duration: '5 chapters',
    creator: 'Marc Beaumont',
    releaseDate: 'Jan 2026',
    language: ['fr', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1526974335478-7b5741355990?w=800',
    tags: ['family', 'music', 'history', 'nostalgia']
  },
  {
    id: 'story-003',
    type: 'story',
    title: 'Borderless Voices',
    description: 'An interactive documentary following four artists navigating identity and belonging across three continents.',
    duration: '6 chapters',
    creator: 'CREOVA Documentary',
    releaseDate: 'Dec 2025',
    language: ['en', 'es', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    tags: ['documentary', 'identity', 'international', 'interactive']
  }
];

/**
 * FILM CONTENT
 */
export const FILM_CONTENT: ContentItem[] = [
  {
    id: 'film-001',
    type: 'film',
    title: 'Concrete Symphony',
    description: 'A cinematic essay on urban architecture and the sounds of construction in three global cities.',
    duration: '28 min',
    creator: 'Karim Hassan',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    tags: ['architecture', 'documentary', 'urban', 'experimental']
  },
  {
    id: 'film-002',
    type: 'film',
    title: 'Les Voix du Fleuve',
    description: 'Court-métrage poétique sur les communautés riveraines du Saint-Laurent et leurs traditions orales.',
    duration: '18 min',
    creator: 'Marie-Claude Dubois',
    releaseDate: 'Jan 2026',
    language: ['fr'],
    mediaSource: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['quebec', 'river', 'tradition', 'poetry']
  }
];

/**
 * INSTITUTIONAL COLLECTIONS (CMF Grant Content)
 */
export const INSTITUTIONAL_CONTENT: ContentItem[] = [
  {
    id: 'inst-001',
    type: 'collection',
    title: 'National Film Board Archive',
    description: 'Curated selection of NFB documentaries exploring Canadian cultural identity and social movements.',
    duration: '24 films',
    creator: 'NFB Canada',
    releaseDate: 'Ongoing',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    tags: ['archive', 'documentary', 'canada', 'institutional'],
    institutional: true
  },
  {
    id: 'inst-002',
    type: 'archive',
    title: 'Indigenous Audio Archives',
    description: 'Oral histories and traditional music from First Nations, Inuit, and Métis communities across Canada.',
    duration: '180+ recordings',
    creator: 'Cultural Heritage Institute',
    releaseDate: 'Ongoing',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    tags: ['indigenous', 'archive', 'oral-history', 'traditional'],
    institutional: true
  },
  {
    id: 'inst-003',
    type: 'collection',
    title: 'Francophone Music Heritage',
    description: 'Collection patrimoniale de musique francophone du Canada, de la chanson traditionnelle au hip-hop contemporain.',
    duration: '45 albums',
    creator: 'Bibliothèque et Archives nationales du Québec',
    releaseDate: 'Ongoing',
    language: ['fr', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    tags: ['music', 'francophone', 'heritage', 'quebec'],
    institutional: true
  }
];

/**
 * COMBINED DATABASE
 */
export const ALL_CONTENT: ContentItem[] = [
  ...MUSIC_CONTENT,
  ...STORY_CONTENT,
  ...FILM_CONTENT,
  ...INSTITUTIONAL_CONTENT
];

/**
 * SECTION-SPECIFIC QUERY FUNCTIONS
 * Each section uses these to get appropriate content
 */

/**
 * FOR YOU SECTION
 * Personalized recommendations based on user preferences
 */
export function getForYouContent(userLanguage: ContentLanguage, userIntent: 'explore' | 'create' | 'contribute'): ContentItem[] {
  // Prioritize featured content and user's language
  return ALL_CONTENT
    .filter(item => 
      item.language.includes(userLanguage) || 
      item.featured === true
    )
    .slice(0, 8); // Limit to 8 personalized items
}

/**
 * EXPLORE SECTION
 * Curated categories with diverse content
 */
export function getExploreCategories(): {
  category: string;
  items: ContentItem[];
}[] {
  return [
    {
      category: 'Featured Stories',
      items: STORY_CONTENT.slice(0, 3)
    },
    {
      category: 'New Music',
      items: MUSIC_CONTENT
    },
    {
      category: 'Documentary Films',
      items: FILM_CONTENT
    },
    {
      category: 'Institutional Collections',
      items: INSTITUTIONAL_CONTENT
    }
  ];
}

/**
 * LIBRARY SECTION
 * User-saved and in-progress content
 */
export function getLibraryContent(savedIds: string[], inProgressIds: string[]): {
  saved: ContentItem[];
  inProgress: ContentItem[];
} {
  return {
    saved: ALL_CONTENT.filter(item => savedIds.includes(item.id)),
    inProgress: ALL_CONTENT.filter(item => inProgressIds.includes(item.id))
  };
}

/**
 * SEARCH/FILTER FUNCTIONS
 */
export function searchContent(query: string): ContentItem[] {
  const lowerQuery = query.toLowerCase();
  return ALL_CONTENT.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.creator.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterByType(type: ContentType): ContentItem[] {
  return ALL_CONTENT.filter(item => item.type === type);
}

export function filterByLanguage(language: ContentLanguage): ContentItem[] {
  return ALL_CONTENT.filter(item => item.language.includes(language));
}
