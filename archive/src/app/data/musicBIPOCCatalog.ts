/**
 * MUSIC BIPOC CATALOG
 * SEEN by CREOVA — Cultural Listening Space
 * 
 * BIPOC artists & labels
 * Album/experience-based listening (NOT playlist chasing)
 * In-app playback only
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface MusicItem {
  musicId: string;
  artistName: string;
  titletrack: string; // Track or album title
  description: MultilingualText;
  culturalContext: MultilingualText;
  
  /** Duration */
  duration: string;
  
  /** Playback source */
  playbackSource: 'hosted' | 'embedded';
  audioUrl?: string; // For hosted files
  embedUrl?: string; // For embedded players (e.g., Bandcamp, SoundCloud)
  
  /** Metadata */
  releaseYear: number;
  genre: string[];
  language: string[];
  
  /** Content type */
  type: 'Album' | 'EP' | 'Single' | 'Sound Experience' | 'Compilation';
  trackCount?: number;
  
  /** Artwork */
  coverArt: string;
  
  /** Discovery */
  featured: boolean;
  new: boolean;
  themes: string[];
  
  /** Label/Publisher */
  label?: string;
  
  /** Linked content */
  linkedToStories?: string[]; // Story IDs this music relates to
}

// ============================================
// MUSIC CATALOG
// ============================================

export const MUSIC_BIPOC_CATALOG: MusicItem[] = [
  {
    musicId: 'music-midnight-resonance',
    artistName: 'DJ Naveed',
    title: 'Midnight Resonance: The Album',
    description: {
      en: 'Late-night radio transmissions preserving cultural memory through sound. Experimental audio collage blending field recordings, music, and storytelling.',
      fr: 'Transmissions radio de fin de nuit préservant la mémoire culturelle par le son. Collage audio expérimental mélangeant enregistrements de terrain, musique, et narration.',
      es: 'Transmisiones de radio nocturnas preservando memoria cultural a través del sonido. Collage de audio experimental mezclando grabaciones de campo, música, y narración.',
    },
    culturalContext: {
      en: 'Late-night community radio was where culture survived when mainstream media ignored us. This album recreates that frequency — a sonic archive of diaspora.',
      fr: 'La radio communautaire de fin de nuit était où la culture survivait quand les médias grand public nous ignoraient. Cet album recrée cette fréquence — une archive sonore de la diaspora.',
      es: 'Radio comunitaria nocturna era donde sobrevivía la cultura cuando medios principales nos ignoraban. Este álbum recrea esa frecuencia — archivo sonoro de diáspora.',
    },
    duration: '45 min',
    playbackSource: 'hosted',
    audioUrl: '/media/music/midnight-resonance-album.mp3',
    releaseYear: 2025,
    genre: ['Experimental', 'Cultural', 'Sound Collage'],
    language: ['en', 'ar', 'fr'],
    type: 'Album',
    trackCount: 8,
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
    featured: true,
    new: false,
    themes: ['Cultural Heritage', 'Sonic Archives', 'Diaspora'],
    label: 'CREOVA Music',
    linkedToStories: ['midnight-resonance'],
  },
  {
    musicId: 'music-black-sound-canada',
    artistName: 'Various Artists',
    title: 'Black Sound: A Canadian Archive',
    description: {
      en: 'Curated collection of Black Canadian music from jazz to reggae to hip-hop. 12 tracks spanning 70 years of Black musical excellence.',
      fr: 'Collection curée de musique canadienne noire du jazz au reggae au hip-hop. 12 pistes couvrant 70 ans d\'excellence musicale noire.',
      es: 'Colección curada de música canadiense negra desde jazz hasta reggae hasta hip-hop. 12 pistas abarcando 70 años de excelencia musical negra.',
    },
    culturalContext: {
      en: 'Black musicians built Canadian sound, yet are erased from national narrative. This archive refuses that erasure. From Oscar Peterson to Maestro Fresh Wes to The Weeknd.',
      fr: 'Les musiciens noirs ont construit le son canadien, mais sont effacés du récit national. Cette archive refuse cet effacement. D\'Oscar Peterson à Maestro Fresh Wes à The Weeknd.',
      es: 'Músicos negros construyeron sonido canadiense, pero son borrados de narrativa nacional. Este archivo rechaza ese borrado. De Oscar Peterson a Maestro Fresh Wes a The Weeknd.',
    },
    duration: '60 min',
    playbackSource: 'hosted',
    audioUrl: '/media/music/black-sound-canada.mp3',
    releaseYear: 2026,
    genre: ['Jazz', 'Reggae', 'Hip-Hop', 'R&B'],
    language: ['en', 'fr'],
    type: 'Compilation',
    trackCount: 12,
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop',
    featured: true,
    new: true,
    themes: ['Black Canadian Music', 'Jazz', 'Hip-Hop', 'Cultural Archives'],
    label: 'Black Music Archive',
    linkedToStories: ['black-atlantic-canada'],
  },
  {
    musicId: 'music-inuit-throat-songs',
    artistName: 'Tanya Tagaq & Collaborators',
    title: 'Katajjaq: Inuit Throat Songs',
    description: {
      en: 'Traditional Inuit throat singing performed by contemporary artists. 6 performances celebrating this ancient practice kept alive.',
      fr: 'Chant de gorge inuit traditionnel interprété par des artistes contemporains. 6 performances célébrant cette pratique ancienne maintenue vivante.',
      es: 'Canto de garganta inuit tradicional interpretado por artistas contemporáneos. 6 actuaciones celebrando esta práctica antigua mantenida viva.',
    },
    culturalContext: {
      en: 'Throat singing (katajjaq) is play, competition, storytelling, and connection. An ancient Inuit practice that colonizers tried to ban, now reclaimed and celebrated.',
      fr: 'Le chant de gorge (katajjaq) est jeu, compétition, narration, et connexion. Une pratique inuite ancienne que les colonisateurs ont essayé d\'interdire, maintenant récupérée et célébrée.',
      es: 'Canto de garganta (katajjaq) es juego, competencia, narración, y conexión. Práctica inuit antigua que colonizadores intentaron prohibir, ahora reclamada y celebrada.',
    },
    duration: '25 min',
    playbackSource: 'hosted',
    audioUrl: '/media/music/inuit-throat-songs.mp3',
    releaseYear: 2026,
    genre: ['Traditional', 'Experimental', 'Indigenous'],
    language: ['Inuktitut'],
    type: 'Sound Experience',
    trackCount: 6,
    coverArt: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=1200&fit=crop',
    featured: true,
    new: true,
    themes: ['Indigenous Music', 'Throat Singing', 'Cultural Heritage', 'Inuit'],
    linkedToStories: ['indigenous-languages'],
  },
  {
    musicId: 'music-asian-diaspora-sounds',
    artistName: 'Various Artists',
    title: 'Sounds of Asian Canada',
    description: {
      en: 'Musical journey through Asian Canadian communities — Chinese opera, Bhangra, Taiko drumming, Vietnamese pop. 10 tracks celebrating diverse Asian diasporic sounds.',
      fr: 'Voyage musical à travers les communautés canadiennes asiatiques — opéra chinois, Bhangra, tambours Taiko, pop vietnamienne. 10 pistes célébrant les sons diasporiques asiatiques divers.',
      es: 'Viaje musical a través de comunidades canadienses asiáticas — ópera china, Bhangra, tambores Taiko, pop vietnamita. 10 pistas celebrando sonidos diaspóricos asiáticos diversos.',
    },
    culturalContext: {
      en: 'Asian Canadian music is not a monolith. From traditional forms to contemporary fusion, these sounds document migration, adaptation, and cultural maintenance.',
      fr: 'La musique canadienne asiatique n\'est pas un monolithe. Des formes traditionnelles à la fusion contemporaine, ces sons documentent la migration, l\'adaptation, et le maintien culturel.',
      es: 'Música canadiense asiática no es un monolito. De formas tradicionales a fusión contemporánea, estos sonidos documentan migración, adaptación, y mantenimiento cultural.',
    },
    duration: '50 min',
    playbackSource: 'hosted',
    audioUrl: '/media/music/asian-diaspora-sounds.mp3',
    releaseYear: 2026,
    genre: ['Traditional', 'Fusion', 'Contemporary'],
    language: ['Cantonese', 'Punjabi', 'Vietnamese', 'Japanese'],
    type: 'Compilation',
    trackCount: 10,
    coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=1200&fit=crop',
    featured: false,
    new: false,
    themes: ['Asian Canadian Music', 'Diaspora', 'Cultural Fusion'],
  },
  {
    musicId: 'music-creova-label-sampler',
    artistName: 'CREOVA Artists',
    title: 'CREOVA Music Sampler Vol. 1',
    description: {
      en: 'Debut compilation from CREOVA Music label featuring emerging BIPOC artists from across Canada. Hip-hop, electronic, R&B, and experimental sounds.',
      fr: 'Compilation de début de l\'étiquette CREOVA Music présentant des artistes PANDC émergents de partout au Canada. Hip-hop, électronique, R&B, et sons expérimentaux.',
      es: 'Compilación debut del sello CREOVA Music presentando artistas BIPOC emergentes de todo Canadá. Hip-hop, electrónica, R&B, y sonidos experimentales.',
    },
    culturalContext: {
      en: 'CREOVA Music supports BIPOC artists creating outside mainstream industry gatekeeping. This sampler showcases diverse voices building new sonic futures.',
      fr: 'CREOVA Music soutient les artistes PANDC créant en dehors du contrôle de l\'industrie grand public. Cet échantillon présente des voix diverses construisant de nouveaux avenirs sonores.',
      es: 'CREOVA Music apoya artistas BIPOC creando fuera del control de industria principal. Este muestrario presenta voces diversas construyendo nuevos futuros sonoros.',
    },
    duration: '40 min',
    playbackSource: 'hosted',
    audioUrl: '/media/music/creova-sampler-vol1.mp3',
    releaseYear: 2026,
    genre: ['Hip-Hop', 'Electronic', 'R&B', 'Experimental'],
    language: ['en', 'fr'],
    type: 'Compilation',
    trackCount: 8,
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=1200&fit=crop',
    featured: true,
    new: true,
    themes: ['Emerging Artists', 'BIPOC Music', 'Contemporary'],
    label: 'CREOVA Music',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getMusicById(id: string): MusicItem | undefined {
  return MUSIC_BIPOC_CATALOG.find(m => m.musicId === id);
}

export function getFeaturedMusic(): MusicItem[] {
  return MUSIC_BIPOC_CATALOG.filter(m => m.featured);
}

export function getNewMusic(): MusicItem[] {
  return MUSIC_BIPOC_CATALOG.filter(m => m.new);
}

export function getMusicByTheme(theme: string): MusicItem[] {
  return MUSIC_BIPOC_CATALOG.filter(m => m.themes.includes(theme));
}

export function getMusicByGenre(genre: string): MusicItem[] {
  return MUSIC_BIPOC_CATALOG.filter(m => m.genre.includes(genre));
}

export function getMusicLinkedToStory(storyId: string): MusicItem[] {
  return MUSIC_BIPOC_CATALOG.filter(m => 
    m.linkedToStories?.includes(storyId)
  );
}

// ============================================
// PLAYBACK RULES
// ============================================

export const MusicPlaybackRules = {
  /** In-app playback only (no external app redirects) */
  inAppOnly: true,
  
  /** No virality-optimized playlists */
  noViralityPlaylists: true,
  
  /** Album/experience-based listening preferred */
  albumBasedListening: true,
  
  /** Respect artist intent (track order, album flow) */
  respectArtistIntent: true,
  
  /** No autoplay between unrelated albums */
  noAutoplayBetweenAlbums: true,
};

// ============================================
// DISCOVERY MAPPING
// ============================================

/**
 * Map music to Explore categories
 */
export function mapMusicToExploreCategories(): Record<string, MusicItem[]> {
  return {
    'Featured': getFeaturedMusic(),
    'New Releases': getNewMusic(),
    'Black Sound': getMusicByTheme('Black Canadian Music'),
    'Indigenous Music': getMusicByTheme('Indigenous Music'),
    'Sonic Archives': getMusicByTheme('Sonic Archives'),
    'CREOVA Label': MUSIC_BIPOC_CATALOG.filter(m => m.label === 'CREOVA Music'),
  };
}

// ============================================
// ASSET AUDIT
// ============================================

export function auditMusicAssets(): {
  total: number;
  hostedFiles: number;
  embeddedFiles: number;
  missingAudio: string[];
  validPlayback: number;
} {
  const hostedFiles = MUSIC_BIPOC_CATALOG.filter(m => m.playbackSource === 'hosted').length;
  const embeddedFiles = MUSIC_BIPOC_CATALOG.filter(m => m.playbackSource === 'embedded').length;
  const missingAudio = MUSIC_BIPOC_CATALOG
    .filter(m => !m.audioUrl && !m.embedUrl)
    .map(m => m.musicId);
  const validPlayback = MUSIC_BIPOC_CATALOG.filter(m => 
    (m.playbackSource === 'hosted' && m.audioUrl) ||
    (m.playbackSource === 'embedded' && m.embedUrl)
  ).length;
  
  return {
    total: MUSIC_BIPOC_CATALOG.length,
    hostedFiles,
    embeddedFiles,
    missingAudio,
    validPlayback,
  };
}

console.log('[Music] Catalog loaded:', MUSIC_BIPOC_CATALOG.length, 'items');
console.log('[Music] Asset audit:', auditMusicAssets());
