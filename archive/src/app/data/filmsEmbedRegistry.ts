/**
 * FILMS EMBED REGISTRY
 * SEEN by CREOVA — In-App YouTube Playback
 * 
 * Films play within SEEN app (no external redirect)
 * BIPOC-created or BIPOC-focused content only
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Film {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  creator: string;
  culturalFocus: string[];
  duration: string; // e.g., "20 min"
  
  /** YouTube embed configuration */
  source: 'YouTube';
  embedUrl: string; // Embed URL (youtube.com/embed/VIDEO_ID)
  videoId: string;  // For tracking/reference
  
  /** Cover image */
  coverImage: string;
  
  /** Metadata */
  year: number;
  format: 'Short' | 'Mid-Length' | 'Feature' | 'Documentary';
  language: string[];
  
  /** Accessibility */
  hasSubtitles: boolean;
  hasTranscript: boolean;
  
  /** Discovery */
  featured: boolean;
  new: boolean;
  themes: string[];
  
  /** Playback rules */
  playbackRules: {
    autoplay: false; // NEVER autoplay
    controls: true;
    modestBranding: true; // Minimal YouTube branding
    rel: 0; // No related videos at end
  };
}

// ============================================
// FILM CATALOG
// ============================================

export const FILMS_CATALOG: Film[] = [
  {
    id: 'film-threads-unseen',
    title: {
      en: 'Threads Unseen',
      fr: 'Fils Invisibles',
      es: 'Hilos Invisibles',
    },
    description: {
      en: 'A 20-minute documentary exploring the invisible labor of immigrant seamstresses in Toronto basement workshops. Before gentrification erased them, these spaces were essential infrastructure for survival economies.',
      fr: 'Un documentaire de 20 minutes explorant le travail invisible des couturières immigrantes dans les ateliers de sous-sols de Toronto. Avant que la gentrification ne les efface, ces espaces étaient une infrastructure essentielle pour les économies de survie.',
      es: 'Un documental de 20 minutos explorando el trabajo invisible de costureras inmigrantes en talleres de sótanos de Toronto. Antes de que la gentrificación los borrara, estos espacios eran infraestructura esencial para economías de supervivencia.',
    },
    creator: 'Layla Hammoud',
    culturalFocus: ['Labor & Economics', 'Migration', 'Invisible Labor'],
    duration: '20 min',
    source: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_1', // Replace with actual video ID
    videoId: 'PLACEHOLDER_VIDEO_ID_1',
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea37f5ba?w=800&h=1200&fit=crop',
    year: 2025,
    format: 'Documentary',
    language: ['en', 'fr'],
    hasSubtitles: true,
    hasTranscript: true,
    featured: true,
    new: true,
    themes: ['Labor', 'Migration', 'Gentrification'],
    playbackRules: {
      autoplay: false,
      controls: true,
      modestBranding: true,
      rel: 0,
    },
  },
  {
    id: 'film-saltwater-routes',
    title: {
      en: 'Saltwater Routes',
      fr: 'Routes d\'Eau Salée',
      es: 'Rutas de Agua Salada',
    },
    description: {
      en: 'A 15-minute visual essay on Caribbean-Canadian migration and the Atlantic Ocean as both highway and graveyard. Combines archival footage, interviews, and experimental cinematography.',
      fr: 'Un essai visuel de 15 minutes sur la migration caribéenne-canadienne et l\'Océan Atlantique comme autoroute et cimetière. Combine des images d\'archives, des entrevues, et de la cinématographie expérimentale.',
      es: 'Un ensayo visual de 15 minutos sobre migración caribeña-canadiense y el Océano Atlántico como autopista y cementerio. Combina metraje de archivo, entrevistas, y cinematografía experimental.',
    },
    creator: 'Marcus Johnson',
    culturalFocus: ['Black Atlantic Canada', 'Migration', 'Caribbean Diaspora'],
    duration: '15 min',
    source: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_2',
    videoId: 'PLACEHOLDER_VIDEO_ID_2',
    coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=1200&fit=crop',
    year: 2025,
    format: 'Short',
    language: ['en', 'fr'],
    hasSubtitles: true,
    hasTranscript: true,
    featured: true,
    new: false,
    themes: ['Black Atlantic', 'Migration', 'Memory'],
    playbackRules: {
      autoplay: false,
      controls: true,
      modestBranding: true,
      rel: 0,
    },
  },
  {
    id: 'film-language-keepers',
    title: {
      en: 'Language Keepers',
      fr: 'Gardiens de Langue',
      es: 'Guardianes de Idioma',
    },
    description: {
      en: 'A 30-minute documentary on Indigenous language revitalization efforts across Canada. Features Cree, Inuktitut, and Mi\'kmaq communities fighting to keep their languages alive.',
      fr: 'Un documentaire de 30 minutes sur les efforts de revitalisation des langues autochtones à travers le Canada. Présente des communautés cries, inuktituques, et mi\'kmaq luttant pour garder leurs langues vivantes.',
      es: 'Un documental de 30 minutos sobre esfuerzos de revitalización de idiomas indígenas en Canadá. Presenta comunidades cree, inuktitut, y mi\'kmaq luchando por mantener sus idiomas vivos.',
    },
    creator: 'Tanya Tagaq & Collaborators',
    culturalFocus: ['Indigenous Languages', 'Cultural Heritage', 'Resistance'],
    duration: '30 min',
    source: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_3',
    videoId: 'PLACEHOLDER_VIDEO_ID_3',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
    year: 2025,
    format: 'Documentary',
    language: ['en', 'fr', 'es', 'Cree', 'Inuktitut', 'Mi\'kmaq'],
    hasSubtitles: true,
    hasTranscript: true,
    featured: true,
    new: false,
    themes: ['Indigenous Languages', 'Revitalization', 'Cultural Heritage'],
    playbackRules: {
      autoplay: false,
      controls: true,
      modestBranding: true,
      rel: 0,
    },
  },
  {
    id: 'film-africville-memory',
    title: {
      en: 'Africville: Memory of a Community',
      fr: 'Africville: Mémoire d\'une Communauté',
      es: 'Africville: Memoria de una Comunidad',
    },
    description: {
      en: 'Archival documentary featuring interviews with former Africville residents. Tells the story of the community\'s destruction and ongoing fight for justice.',
      fr: 'Documentaire d\'archives présentant des entrevues avec d\'anciens résidents d\'Africville. Raconte l\'histoire de la destruction de la communauté et la lutte continue pour la justice.',
      es: 'Documental de archivo con entrevistas a antiguos residentes de Africville. Cuenta la historia de la destrucción de la comunidad y lucha continua por justicia.',
    },
    creator: 'NFB (National Film Board of Canada)',
    culturalFocus: ['Black Canadian History', 'Environmental Racism', 'Community'],
    duration: '25 min',
    source: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_4',
    videoId: 'PLACEHOLDER_VIDEO_ID_4',
    coverImage: 'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=800&h=1200&fit=crop',
    year: 1991,
    format: 'Documentary',
    language: ['en'],
    hasSubtitles: true,
    hasTranscript: true,
    featured: true,
    new: false,
    themes: ['Africville', 'Environmental Racism', 'Black History'],
    playbackRules: {
      autoplay: false,
      controls: true,
      modestBranding: true,
      rel: 0,
    },
  },
  {
    id: 'film-komagata-maru',
    title: {
      en: 'Komagata Maru: Exclusion and Resistance',
      fr: 'Komagata Maru: Exclusion et Résistance',
      es: 'Komagata Maru: Exclusión y Resistencia',
    },
    description: {
      en: 'The story of the Komagata Maru incident (1914), when 376 South Asian passengers were turned away from Vancouver due to racist immigration laws.',
      fr: 'L\'histoire de l\'incident du Komagata Maru (1914), quand 376 passagers sud-asiatiques ont été refoulés de Vancouver en raison de lois d\'immigration racistes.',
      es: 'La historia del incidente Komagata Maru (1914), cuando 376 pasajeros sur-asiáticos fueron rechazados de Vancouver debido a leyes de inmigración racistas.',
    },
    creator: 'Ali Kazimi',
    culturalFocus: ['South Asian History', 'Immigration', 'Racism'],
    duration: '45 min',
    source: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_5',
    videoId: 'PLACEHOLDER_VIDEO_ID_5',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=1200&fit=crop',
    year: 2011,
    format: 'Documentary',
    language: ['en', 'Punjabi'],
    hasSubtitles: true,
    hasTranscript: true,
    featured: false,
    new: false,
    themes: ['Asian Canadian History', 'Exclusion', 'Immigration'],
    playbackRules: {
      autoplay: false,
      controls: true,
      modestBranding: true,
      rel: 0,
    },
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFilmById(id: string): Film | undefined {
  return FILMS_CATALOG.find(f => f.id === id);
}

export function getFeaturedFilms(): Film[] {
  return FILMS_CATALOG.filter(f => f.featured);
}

export function getNewFilms(): Film[] {
  return FILMS_CATALOG.filter(f => f.new);
}

export function getFilmsByTheme(theme: string): Film[] {
  return FILMS_CATALOG.filter(f => f.themes.includes(theme));
}

// ============================================
// YOUTUBE EMBED GENERATOR
// ============================================

/**
 * Generate YouTube embed URL with proper parameters
 */
export function generateEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '0',        // No autoplay
    controls: '1',        // Show controls
    modestbranding: '1',  // Minimal YouTube branding
    rel: '0',             // No related videos at end
    enablejsapi: '1',     // Enable JS API for tracking
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Validate that film playback respects rules
 */
export function validatePlaybackRules(film: Film): boolean {
  return (
    film.playbackRules.autoplay === false &&
    film.playbackRules.controls === true &&
    film.playbackRules.modestBranding === true &&
    film.playbackRules.rel === 0
  );
}

// ============================================
// SAFETY CHECKS
// ============================================

/**
 * Ensure no external redirects
 */
export function isInAppPlayback(url: string): boolean {
  return url.includes('youtube.com/embed/');
}

/**
 * Log missing assets
 */
export function auditFilmAssets(): {
  total: number;
  missingSubtitles: string[];
  missingTranscripts: string[];
  validEmbeds: number;
} {
  const missingSubtitles = FILMS_CATALOG.filter(f => !f.hasSubtitles).map(f => f.id);
  const missingTranscripts = FILMS_CATALOG.filter(f => !f.hasTranscript).map(f => f.id);
  const validEmbeds = FILMS_CATALOG.filter(f => isInAppPlayback(f.embedUrl)).length;
  
  return {
    total: FILMS_CATALOG.length,
    missingSubtitles,
    missingTranscripts,
    validEmbeds,
  };
}

console.log('[Films] Catalog loaded:', FILMS_CATALOG.length, 'films');
console.log('[Films] Asset audit:', auditFilmAssets());
