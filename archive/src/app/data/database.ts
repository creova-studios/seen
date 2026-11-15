/**
 * CENTRALIZED CONTENT DATABASE
 * SEEN by CREOVA
 * 
 * Single source of truth for all platform content.
 * Each section queries this database with strict filters.
 */

import type { 
  ContentItem, 
  ContentType, 
  ContentLanguage,
  UserIntent,
  UserRole 
} from './types';

// ============================================
// MUSIC CONTENT
// ============================================

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
    featured: true,
    new: true,
    trending: true
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
    tags: ['jazz', 'hip-hop', 'montreal', 'urban'],
    new: true
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
  },
  {
    id: 'music-005',
    type: 'music',
    title: 'Northern Echoes',
    description: 'Ambient soundscapes inspired by the Canadian Arctic, featuring throat singing and electronic drones.',
    duration: '42 min',
    creator: 'Tanya Tagaq & Simon Goff',
    releaseDate: 'Oct 2025',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['ambient', 'arctic', 'indigenous', 'experimental']
  }
];

// ============================================
// STORY CONTENT
// ============================================

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
    tags: ['photography', 'montreal', 'urban', 'visual'],
    featured: true
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
    tags: ['family', 'music', 'history', 'nostalgia'],
    new: true
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
  },
  {
    id: 'story-004',
    type: 'story',
    title: 'Threads of Memory',
    description: 'Historias entrelazadas de tres generaciones de tejedoras en las montañas de Guatemala.',
    duration: '3 chapters',
    creator: 'Elena Morales',
    releaseDate: 'Nov 2025',
    language: ['es', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    tags: ['textile', 'tradition', 'guatemala', 'generational']
  }
];

// ============================================
// FILM CONTENT
// ============================================

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
    tags: ['architecture', 'documentary', 'urban', 'experimental'],
    new: true
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
  },
  {
    id: 'film-003',
    type: 'film',
    title: 'Street Canvases',
    description: 'A visual exploration of street art and graffiti culture across Latin American cities.',
    duration: '35 min',
    creator: 'Diego Ramirez',
    releaseDate: 'Oct 2025',
    language: ['es', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    tags: ['street-art', 'urban', 'latin-america', 'visual']
  }
];

// ============================================
// INSTITUTIONAL COLLECTIONS
// ============================================

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

// ============================================
// COMBINED DATABASE
// ============================================

export const ALL_CONTENT: ContentItem[] = [
  ...MUSIC_CONTENT,
  ...STORY_CONTENT,
  ...FILM_CONTENT,
  ...INSTITUTIONAL_CONTENT
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get content by ID
 */
export function getContentById(id: string): ContentItem | undefined {
  return ALL_CONTENT.find(item => item.id === id);
}

/**
 * Get content by type
 */
export function getContentByType(type: ContentType): ContentItem[] {
  return ALL_CONTENT.filter(item => item.type === type);
}

/**
 * Get content by language
 */
export function getContentByLanguage(language: ContentLanguage): ContentItem[] {
  return ALL_CONTENT.filter(item => item.language.includes(language));
}

/**
 * Search content
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
