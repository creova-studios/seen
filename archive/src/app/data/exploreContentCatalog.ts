/**
 * EXPLORE CONTENT CATALOG
 * SEEN by CREOVA — Collections, Films, Music
 * 
 * Diverse cultural content beyond stories
 * Curated, editorial, non-competitive
 */

import type { Language, MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ContentType = 'collection' | 'film' | 'music' | 'archive';

export type DiscoveryCategory = 
  | 'Featured'
  | 'New Releases'
  | 'Indigenous Voices'
  | 'Diasporic Journeys'
  | 'Sonic Archives'
  | 'Visual Stories'
  | 'Institutional Collections'
  | 'Community Curated';

export interface ExploreContent {
  id: string;
  type: ContentType;
  
  /** Title */
  title: MultilingualText;
  
  /** Description */
  description: MultilingualText;
  
  /** Creator / Institution */
  creator: MultilingualText;
  
  /** Cover image */
  coverImage: string;
  
  /** Duration (for films/audio) or item count (for collections) */
  duration?: string;
  itemCount?: number;
  
  /** Cultural themes */
  culturalThemes: string[];
  
  /** Discovery category */
  discoveryCategory: DiscoveryCategory[];
  
  /** Languages available */
  languagesAvailable: Language[];
  
  /** Release date */
  releaseDate: string;
  
  /** Featured status */
  featured: boolean;
  new: boolean;
  trending: boolean;
  
  /** Content-specific fields */
  metadata: {
    // For films
    director?: string;
    runtime?: number; // minutes
    year?: number;
    format?: 'short' | 'mid-length' | 'feature';
    
    // For music
    artist?: string;
    trackCount?: number;
    genre?: string;
    
    // For collections
    curator?: string;
    collectionType?: 'thematic' | 'institutional' | 'community';
    
    // For archives
    institution?: string;
    archiveType?: string;
  };
  
  /** Editorial framing */
  editorialNote?: MultilingualText;
  
  /** Accessibility */
  transcripts?: boolean;
  captions?: boolean;
  audioDescription?: boolean;
}

// ============================================
// COLLECTIONS
// ============================================

export const EXPLORE_COLLECTIONS: ExploreContent[] = [
  {
    id: 'collection-migration-voices',
    type: 'collection',
    title: {
      en: 'Voices of Migration: A Curated Journey',
      fr: 'Voix de Migration: Un Voyage Curateur',
      es: 'Voces de Migración: Un Viaje Curado',
    },
    description: {
      en: 'Seven Story Worlds exploring migration, diaspora, and the meaning of home across generations and geographies.',
      fr: 'Sept mondes narratifs explorant la migration, la diaspora, et le sens du foyer à travers les générations et les géographies.',
      es: 'Siete mundos narrativos explorando migración, diáspora, y el significado del hogar a través de generaciones y geografías.',
    },
    creator: {
      en: 'SEEN Editorial Team',
      fr: 'Équipe Éditoriale SEEN',
      es: 'Equipo Editorial SEEN',
    },
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1200&fit=crop',
    itemCount: 7,
    culturalThemes: ['Migration & Diaspora', 'Identity & Belonging', 'Family & Separation'],
    discoveryCategory: ['Featured', 'Community Curated'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Feb 2026',
    featured: true,
    new: false,
    trending: false,
    metadata: {
      curator: 'SEEN Editorial',
      collectionType: 'thematic',
    },
    editorialNote: {
      en: 'Migration is not one story. It is thousands. This collection brings together narratives of arrival, displacement, belonging, and home-building across Lebanese, Caribbean, Syrian, and Latin American diasporas in Canada.',
      fr: 'La migration n\'est pas une histoire. Ce sont des milliers. Cette collection rassemble des récits d\'arrivée, de déplacement, d\'appartenance, et de construction de foyer à travers les diasporas libanaises, caribéennes, syriennes, et latino-américaines au Canada.',
      es: 'La migración no es una historia. Son miles. Esta colección reúne narrativas de llegada, desplazamiento, pertenencia, y construcción de hogar a través de diásporas libanesas, caribeñas, sirias, y latinoamericanas en Canadá.',
    },
  },
  {
    id: 'collection-indigenous-futures',
    type: 'collection',
    title: {
      en: 'Indigenous Futures',
      fr: 'Avenirs Autochtones',
      es: 'Futuros Indígenas',
    },
    description: {
      en: 'Contemporary Indigenous storytelling that refuses the past tense. Language, land, resistance, and futurity.',
      fr: 'Narration autochtone contemporaine qui refuse le passé. Langue, terre, résistance, et futurité.',
      es: 'Narración indígena contemporánea que rechaza el pasado. Idioma, tierra, resistencia, y futuridad.',
    },
    creator: {
      en: 'Indigenous Storytellers Collective',
      fr: 'Collectif de Conteurs Autochtones',
      es: 'Colectivo de Narradores Indígenas',
    },
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
    itemCount: 4,
    culturalThemes: ['Indigenous Languages', 'Place & Memory', 'Healing & Resilience'],
    discoveryCategory: ['Featured', 'Indigenous Voices'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Feb 2026',
    featured: true,
    new: false,
    trending: false,
    metadata: {
      curator: 'Indigenous Advisory Council',
      collectionType: 'community',
    },
    editorialNote: {
      en: 'Indigenous people are not historical artifacts. We are here. We are creating. We are resisting. We are thriving. These stories center Indigenous voices on our own terms.',
      fr: 'Les peuples autochtones ne sont pas des artefacts historiques. Nous sommes ici. Nous créons. Nous résistons. Nous prospérons. Ces histoires centrent les voix autochtones selon nos propres termes.',
      es: 'Los pueblos indígenas no son artefactos históricos. Estamos aquí. Estamos creando. Estamos resistiendo. Estamos prosperando. Estas historias centran las voces indígenas en nuestros propios términos.',
    },
  },
  {
    id: 'collection-intergenerational-memory',
    type: 'collection',
    title: {
      en: 'What We Carry: Intergenerational Stories',
      fr: 'Ce Que Nous Portons: Histoires Intergénérationnelles',
      es: 'Lo Que Llevamos: Historias Intergeneracionales',
    },
    description: {
      en: 'Stories exploring trauma, inheritance, healing, and what gets passed down across generations.',
      fr: 'Histoires explorant le traumatisme, l\'héritage, la guérison, et ce qui se transmet à travers les générations.',
      es: 'Historias explorando trauma, herencia, sanación, y lo que se transmite a través de generaciones.',
    },
    creator: {
      en: 'SEEN Curatorial',
      fr: 'Curation SEEN',
      es: 'Curaduría SEEN',
    },
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1200&fit=crop',
    itemCount: 5,
    culturalThemes: ['Family & Separation', 'Healing & Resilience', 'What We Carry'],
    discoveryCategory: ['Featured', 'Diasporic Journeys'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Feb 2026',
    featured: false,
    new: false,
    trending: true,
    metadata: {
      curator: 'SEEN Editorial',
      collectionType: 'thematic',
    },
  },
];

// ============================================
// FILMS
// ============================================

export const EXPLORE_FILMS: ExploreContent[] = [
  {
    id: 'film-threads-unseen',
    type: 'film',
    title: {
      en: 'Threads Unseen',
      fr: 'Fils Invisibles',
      es: 'Hilos Invisibles',
    },
    description: {
      en: 'A 20-minute documentary exploring the invisible labor of immigrant seamstresses in Toronto basement workshops.',
      fr: 'Un documentaire de 20 minutes explorant le travail invisible des couturières immigrantes dans les ateliers de sous-sols de Toronto.',
      es: 'Un documental de 20 minutos explorando el trabajo invisible de costureras inmigrantes en talleres de sótanos de Toronto.',
    },
    creator: {
      en: 'Directed by Layla Hammoud',
      fr: 'Réalisé par Layla Hammoud',
      es: 'Dirigido por Layla Hammoud',
    },
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea37f5ba?w=800&h=1200&fit=crop',
    duration: '20 min',
    culturalThemes: ['Labor & Economics', 'Migration & Diaspora', 'Invisible Labor'],
    discoveryCategory: ['Featured', 'Visual Stories', 'New Releases'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Jan 2026',
    featured: true,
    new: true,
    trending: false,
    metadata: {
      director: 'Layla Hammoud',
      runtime: 20,
      year: 2025,
      format: 'short',
    },
    editorialNote: {
      en: 'Before gentrification erased them, basement sewing shops were essential infrastructure for immigrant communities. This film preserves their memory.',
      fr: 'Avant que la gentrification ne les efface, les ateliers de couture au sous-sol étaient une infrastructure essentielle pour les communautés immigrantes. Ce film préserve leur mémoire.',
      es: 'Antes de que la gentrificación los borrara, los talleres de costura en sótanos eran infraestructura esencial para comunidades inmigrantes. Esta película preserva su memoria.',
    },
    transcripts: true,
    captions: true,
    audioDescription: true,
  },
  {
    id: 'film-saltwater-routes',
    type: 'film',
    title: {
      en: 'Saltwater Routes',
      fr: 'Routes d\'Eau Salée',
      es: 'Rutas de Agua Salada',
    },
    description: {
      en: 'A visual essay on Caribbean-Canadian migration and the Atlantic as both highway and graveyard.',
      fr: 'Un essai visuel sur la migration caribéenne-canadienne et l\'Atlantique comme autoroute et cimetière.',
      es: 'Un ensayo visual sobre migración caribeña-canadiense y el Atlántico como autopista y cementerio.',
    },
    creator: {
      en: 'Directed by Marcus Johnson',
      fr: 'Réalisé par Marcus Johnson',
      es: 'Dirigido por Marcus Johnson',
    },
    coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=1200&fit=crop',
    duration: '15 min',
    culturalThemes: ['Black Atlantic Canada', 'Migration & Diaspora', 'Place & Memory'],
    discoveryCategory: ['Featured', 'Visual Stories', 'Diasporic Journeys'],
    languagesAvailable: ['en', 'fr'],
    releaseDate: 'Nov 2025',
    featured: true,
    new: false,
    trending: false,
    metadata: {
      director: 'Marcus Johnson',
      runtime: 15,
      year: 2025,
      format: 'short',
    },
    transcripts: true,
    captions: true,
    audioDescription: false,
  },
  {
    id: 'film-language-keepers',
    type: 'film',
    title: {
      en: 'Language Keepers',
      fr: 'Gardiens de Langue',
      es: 'Guardianes de Idioma',
    },
    description: {
      en: 'Indigenous language revitalization efforts across Canada. 30-minute documentary featuring Cree, Inuktitut, and Mi\'kmaq communities.',
      fr: 'Efforts de revitalisation des langues autochtones à travers le Canada. Documentaire de 30 minutes avec des communautés cries, inuktituques, et mi\'kmaq.',
      es: 'Esfuerzos de revitalización de idiomas indígenas en Canadá. Documental de 30 minutos con comunidades cree, inuktitut, y mi\'kmaq.',
    },
    creator: {
      en: 'Directed by Tanya Tagaq & Collaboration',
      fr: 'Réalisé par Tanya Tagaq & Collaboration',
      es: 'Dirigido por Tanya Tagaq & Colaboración',
    },
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
    duration: '30 min',
    culturalThemes: ['Indigenous Languages', 'Cultural Heritage', 'Healing & Resilience'],
    discoveryCategory: ['Featured', 'Indigenous Voices', 'Visual Stories'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Dec 2025',
    featured: true,
    new: false,
    trending: true,
    metadata: {
      director: 'Tanya Tagaq',
      runtime: 30,
      year: 2025,
      format: 'mid-length',
    },
    transcripts: true,
    captions: true,
    audioDescription: true,
  },
];

// ============================================
// MUSIC / AUDIO WORKS
// ============================================

export const EXPLORE_MUSIC: ExploreContent[] = [
  {
    id: 'music-midnight-resonance',
    type: 'music',
    title: {
      en: 'Midnight Resonance: The Album',
      fr: 'Résonance de Minuit: L\'Album',
      es: 'Resonancia de Medianoche: El Álbum',
    },
    description: {
      en: 'Late-night radio transmissions preserving cultural memory through sound. Experimental audio collage blending field recordings, music, and storytelling.',
      fr: 'Transmissions radio de fin de nuit préservant la mémoire culturelle par le son. Collage audio expérimental mélangeant enregistrements de terrain, musique, et narration.',
      es: 'Transmisiones de radio nocturnas preservando memoria cultural a través del sonido. Collage de audio experimental mezclando grabaciones de campo, música, y narración.',
    },
    creator: {
      en: 'Curated by DJ Naveed',
      fr: 'Curé par DJ Naveed',
      es: 'Curado por DJ Naveed',
    },
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
    duration: '45 min',
    culturalThemes: ['Cultural Heritage', 'Sonic Archives', 'Place & Memory'],
    discoveryCategory: ['Featured', 'Sonic Archives'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Oct 2025',
    featured: true,
    new: false,
    trending: false,
    metadata: {
      artist: 'DJ Naveed',
      trackCount: 8,
      genre: 'Experimental / Cultural',
    },
    editorialNote: {
      en: 'Late-night community radio was where culture survived. This album recreates that frequency.',
      fr: 'La radio communautaire de fin de nuit était où la culture survivait. Cet album recrée cette fréquence.',
      es: 'La radio comunitaria nocturna era donde sobrevivía la cultura. Este álbum recrea esa frecuencia.',
    },
    transcripts: true,
  },
  {
    id: 'music-black-sound-canada',
    type: 'music',
    title: {
      en: 'Black Sound: A Canadian Archive',
      fr: 'Son Noir: Une Archive Canadienne',
      es: 'Sonido Negro: Un Archivo Canadiense',
    },
    description: {
      en: 'Curated collection of Black Canadian music from jazz to reggae to hip-hop. 12 tracks spanning 70 years.',
      fr: 'Collection curée de musique canadienne noire du jazz au reggae au hip-hop. 12 pistes couvrant 70 ans.',
      es: 'Colección curada de música canadiense negra desde jazz hasta reggae hasta hip-hop. 12 pistas abarcando 70 años.',
    },
    creator: {
      en: 'Curated by Black Music Archive',
      fr: 'Curé par Archive de Musique Noire',
      es: 'Curado por Archivo de Música Negra',
    },
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop',
    duration: '60 min',
    culturalThemes: ['Black Canadian Experience', 'Cultural Heritage', 'Sonic Archives'],
    discoveryCategory: ['Featured', 'Sonic Archives', 'Institutional Collections'],
    languagesAvailable: ['en', 'fr'],
    releaseDate: 'Feb 2026',
    featured: true,
    new: true,
    trending: false,
    metadata: {
      artist: 'Various Artists',
      trackCount: 12,
      genre: 'Jazz / Reggae / Hip-Hop',
    },
    editorialNote: {
      en: 'Black musicians built Canadian sound. This archive refuses erasure.',
      fr: 'Les musiciens noirs ont construit le son canadien. Cette archive refuse l\'effacement.',
      es: 'Músicos negros construyeron el sonido canadiense. Este archivo rechaza el borrado.',
    },
  },
  {
    id: 'music-inuit-throat-songs',
    type: 'music',
    title: {
      en: 'Katajjaq: Inuit Throat Songs',
      fr: 'Katajjaq: Chants de Gorge Inuits',
      es: 'Katajjaq: Cantos de Garganta Inuit',
    },
    description: {
      en: 'Traditional Inuit throat singing performed by contemporary artists. 6 performances.',
      fr: 'Chant de gorge inuit traditionnel interprété par des artistes contemporains. 6 performances.',
      es: 'Canto de garganta inuit tradicional interpretado por artistas contemporáneos. 6 actuaciones.',
    },
    creator: {
      en: 'Performed by Tanya Tagaq & Collaborators',
      fr: 'Interprété par Tanya Tagaq & Collaborateurs',
      es: 'Interpretado por Tanya Tagaq & Colaboradores',
    },
    coverImage: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=1200&fit=crop',
    duration: '25 min',
    culturalThemes: ['Indigenous Languages', 'Cultural Heritage', 'Sonic Archives'],
    discoveryCategory: ['Featured', 'Indigenous Voices', 'Sonic Archives'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Jan 2026',
    featured: true,
    new: true,
    trending: true,
    metadata: {
      artist: 'Tanya Tagaq',
      trackCount: 6,
      genre: 'Traditional / Experimental',
    },
    editorialNote: {
      en: 'Throat singing is play, competition, storytelling, and connection. An ancient practice kept alive.',
      fr: 'Le chant de gorge est jeu, compétition, narration, et connexion. Une pratique ancienne maintenue vivante.',
      es: 'El canto de garganta es juego, competencia, narración, y conexión. Una práctica antigua mantenida viva.',
    },
  },
];

// ============================================
// INSTITUTIONAL ARCHIVES
// ============================================

export const EXPLORE_ARCHIVES: ExploreContent[] = [
  {
    id: 'archive-nfb-migration',
    type: 'archive',
    title: {
      en: 'NFB Migration Collection',
      fr: 'Collection Migration ONF',
      es: 'Colección Migración NFB',
    },
    description: {
      en: 'National Film Board archival documentaries on immigration to Canada (1950s–1990s). 8 films.',
      fr: 'Documentaires d\'archives de l\'Office national du film sur l\'immigration au Canada (1950s–1990s). 8 films.',
      es: 'Documentales de archivo de National Film Board sobre inmigración a Canadá (1950s–1990s). 8 películas.',
    },
    creator: {
      en: 'National Film Board of Canada',
      fr: 'Office National du Film du Canada',
      es: 'Oficina Nacional de Cine de Canadá',
    },
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=1200&fit=crop',
    itemCount: 8,
    culturalThemes: ['Migration & Diaspora', 'Historical Archives', 'Institutional Collections'],
    discoveryCategory: ['Institutional Collections', 'Diasporic Journeys'],
    languagesAvailable: ['en', 'fr'],
    releaseDate: 'Feb 2026',
    featured: false,
    new: false,
    trending: false,
    metadata: {
      institution: 'National Film Board of Canada',
      archiveType: 'Film Collection',
    },
    editorialNote: {
      en: 'Historical documentation of migration stories, preserved and made accessible.',
      fr: 'Documentation historique d\'histoires de migration, préservée et rendue accessible.',
      es: 'Documentación histórica de historias de migración, preservada y accesible.',
    },
    transcripts: true,
    captions: true,
  },
  {
    id: 'archive-cmhr-oral-histories',
    type: 'archive',
    title: {
      en: 'Canadian Museum for Human Rights: Oral Histories',
      fr: 'Musée Canadien pour les Droits de la Personne: Histoires Orales',
      es: 'Museo Canadiense de Derechos Humanos: Historias Orales',
    },
    description: {
      en: 'Curated oral history collection documenting human rights struggles in Canada. 12 testimonies.',
      fr: 'Collection d\'histoire orale curée documentant les luttes pour les droits de la personne au Canada. 12 témoignages.',
      es: 'Colección de historia oral curada documentando luchas por derechos humanos en Canadá. 12 testimonios.',
    },
    creator: {
      en: 'Canadian Museum for Human Rights',
      fr: 'Musée Canadien pour les Droits de la Personne',
      es: 'Museo Canadiense de Derechos Humanos',
    },
    coverImage: 'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=800&h=1200&fit=crop',
    itemCount: 12,
    culturalThemes: ['Justice & Rights', 'Historical Archives', 'Institutional Collections'],
    discoveryCategory: ['Institutional Collections'],
    languagesAvailable: ['en', 'fr', 'es'],
    releaseDate: 'Feb 2026',
    featured: false,
    new: false,
    trending: false,
    metadata: {
      institution: 'Canadian Museum for Human Rights',
      archiveType: 'Oral History Collection',
    },
    transcripts: true,
    captions: true,
  },
];

// ============================================
// COMBINED CATALOG
// ============================================

export const EXPLORE_CATALOG: ExploreContent[] = [
  ...EXPLORE_COLLECTIONS,
  ...EXPLORE_FILMS,
  ...EXPLORE_MUSIC,
  ...EXPLORE_ARCHIVES,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get content by type
 */
export function getContentByType(type: ContentType): ExploreContent[] {
  return EXPLORE_CATALOG.filter(c => c.type === type);
}

/**
 * Get content by discovery category
 */
export function getContentByCategory(category: DiscoveryCategory): ExploreContent[] {
  return EXPLORE_CATALOG.filter(c => c.discoveryCategory.includes(category));
}

/**
 * Get featured content
 */
export function getFeaturedContent(): ExploreContent[] {
  return EXPLORE_CATALOG.filter(c => c.featured);
}

/**
 * Get new releases
 */
export function getNewReleases(): ExploreContent[] {
  return EXPLORE_CATALOG.filter(c => c.new);
}

/**
 * Get trending content
 */
export function getTrendingContent(): ExploreContent[] {
  return EXPLORE_CATALOG.filter(c => c.trending);
}

/**
 * Get content by cultural theme
 */
export function getContentByTheme(theme: string): ExploreContent[] {
  return EXPLORE_CATALOG.filter(c => c.culturalThemes.includes(theme));
}

/**
 * Get content by language
 */
export function getContentByLanguage(language: Language): ExploreContent[] {
  return EXPLORE_CATALOG.filter(c => c.languagesAvailable.includes(language));
}

/**
 * Get content by ID
 */
export function getContentById(id: string): ExploreContent | undefined {
  return EXPLORE_CATALOG.find(c => c.id === id);
}

// ============================================
// EDITORIAL RULES
// ============================================

export const EditorialRules = {
  /** Collections are curated, not algorithmic */
  curatedOnly: true,
  
  /** No autoplay for films */
  noAutoplay: true,
  
  /** Films require user-initiated play */
  userInitiated: true,
  
  /** Music albums play in intended sequence */
  sequenceRespected: true,
  
  /** No playlist chasing (Spotify-style algorithms) */
  noPlaylistChasing: true,
  
  /** Editorial framing required for all content */
  editorialFramingRequired: true,
  
  /** Accessibility features mandatory */
  accessibilityMandatory: true,
};

// ============================================
// CONTENT FILTERS
// ============================================

export interface ContentFilters {
  type?: ContentType[];
  category?: DiscoveryCategory[];
  language?: Language;
  theme?: string[];
  featured?: boolean;
  new?: boolean;
  trending?: boolean;
}

/**
 * Filter content by multiple criteria
 */
export function filterContent(filters: ContentFilters): ExploreContent[] {
  let results = EXPLORE_CATALOG;
  
  if (filters.type && filters.type.length > 0) {
    results = results.filter(c => filters.type!.includes(c.type));
  }
  
  if (filters.category && filters.category.length > 0) {
    results = results.filter(c => 
      c.discoveryCategory.some(cat => filters.category!.includes(cat))
    );
  }
  
  if (filters.language) {
    results = results.filter(c => c.languagesAvailable.includes(filters.language!));
  }
  
  if (filters.theme && filters.theme.length > 0) {
    results = results.filter(c => 
      c.culturalThemes.some(theme => filters.theme!.includes(theme))
    );
  }
  
  if (filters.featured !== undefined) {
    results = results.filter(c => c.featured === filters.featured);
  }
  
  if (filters.new !== undefined) {
    results = results.filter(c => c.new === filters.new);
  }
  
  if (filters.trending !== undefined) {
    results = results.filter(c => c.trending === filters.trending);
  }
  
  return results;
}
