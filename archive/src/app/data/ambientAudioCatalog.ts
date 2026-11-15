/**
 * AMBIENT AUDIO CATALOG
 * SEEN by CREOVA — Ambient Soundscape System
 * 
 * Non-intrusive, cinematic, cultural soundscapes
 * Designed to deepen immersion without distracting from narration
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type AmbientCategory = 
  | 'urban-night'
  | 'interior-spaces'
  | 'nature-land'
  | 'transit-movement'
  | 'memory-abstract';

export interface AmbientSound {
  id: string;
  name: MultilingualText;
  category: AmbientCategory;
  
  /** Mood/emotional tone of the soundscape */
  mood: {
    en: string;
    fr: string;
    es: string;
  };
  
  /** Cultural context (if applicable) */
  culturalContext?: MultilingualText;
  
  /** File path to audio asset */
  filePath: string;
  
  /** Duration in seconds (for seamless looping calculation) */
  duration: number;
  
  /** Recommended volume relative to narration (in dB) */
  mixLevel: number; // e.g., -18 means 18dB below narration
  
  /** Whether this sound loops seamlessly */
  seamlessLoop: boolean;
  
  /** Dominant frequency range (for mixing purposes) */
  frequencyRange: 'low' | 'mid' | 'high' | 'full-spectrum';
  
  /** Tags for discovery and matching */
  tags: string[];
  
  /** Compatible story themes */
  compatibleThemes: string[];
  
  /** Production notes */
  productionNotes?: string;
}

// ============================================
// AMBIENT SOUNDSCAPE CATALOG
// ============================================

export const AMBIENT_SOUNDS: AmbientSound[] = [
  // ============================================
  // URBAN NIGHT
  // ============================================
  {
    id: 'urban-night-distant-traffic',
    name: {
      en: 'Distant City Traffic',
      fr: 'Circulation Urbaine Distante',
      es: 'Tráfico Urbano Distante',
    },
    category: 'urban-night',
    mood: {
      en: 'Contemplative, Solitary, Urban Loneliness',
      fr: 'Contemplatif, Solitaire, Solitude Urbaine',
      es: 'Contemplativo, Solitario, Soledad Urbana',
    },
    culturalContext: {
      en: 'The ambient hum of late-night city life, familiar to urban immigrants and night workers.',
      fr: 'Le bourdonnement ambiant de la vie urbaine nocturne, familier aux immigrants urbains et travailleurs de nuit.',
      es: 'El zumbido ambiente de la vida urbana nocturna, familiar a inmigrantes urbanos y trabajadores nocturnos.',
    },
    filePath: '/media/ambient/urban-night-distant-traffic.mp3',
    duration: 180, // 3 minutes
    mixLevel: -20,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['city', 'night', 'urban', 'traffic', 'solitude'],
    compatibleThemes: ['Migration & Diaspora', 'Identity & Belonging', 'Labor & Economics'],
    productionNotes: 'Low-frequency rumble, distant car horns (very occasional), no jarring sounds',
  },
  {
    id: 'urban-night-empty-streets',
    name: {
      en: 'Empty Street Ambience',
      fr: 'Ambiance de Rue Vide',
      es: 'Ambiente de Calle Vacía',
    },
    category: 'urban-night',
    mood: {
      en: 'Reflective, Quiet Presence, Post-Migration Contemplation',
      fr: 'Réfléchi, Présence Silencieuse, Contemplation Post-Migration',
      es: 'Reflexivo, Presencia Tranquila, Contemplación Post-Migración',
    },
    filePath: '/media/ambient/urban-night-empty-streets.mp3',
    duration: 240,
    mixLevel: -22,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['night', 'quiet', 'urban', 'empty', 'contemplation'],
    compatibleThemes: ['Home (No Fixed Address)', 'Work / Worth', 'Black Atlantic Canada'],
    productionNotes: 'Very sparse — occasional distant footsteps, wind, minimal traffic',
  },
  {
    id: 'urban-night-rain',
    name: {
      en: 'City Rain',
      fr: 'Pluie Urbaine',
      es: 'Lluvia Urbana',
    },
    category: 'urban-night',
    mood: {
      en: 'Melancholic, Cleansing, Memory',
      fr: 'Mélancolique, Purificateur, Mémoire',
      es: 'Melancólico, Limpiador, Memoria',
    },
    culturalContext: {
      en: 'Rain in the city evokes displacement, adaptation, and the distance from warmer homelands.',
      fr: 'La pluie en ville évoque le déplacement, l\'adaptation, et la distance des patries plus chaudes.',
      es: 'La lluvia en la ciudad evoca desplazamiento, adaptación, y la distancia de patrias más cálidas.',
    },
    filePath: '/media/ambient/urban-night-rain.mp3',
    duration: 300,
    mixLevel: -18,
    seamlessLoop: true,
    frequencyRange: 'full-spectrum',
    tags: ['rain', 'city', 'weather', 'melancholy', 'cleansing'],
    compatibleThemes: ['The First Generation', 'What We Carry', 'Voices of Migration'],
    productionNotes: 'Steady rain, occasional car passing on wet pavement, no thunder',
  },

  // ============================================
  // INTERIOR SPACES
  // ============================================
  {
    id: 'interior-room-tone',
    name: {
      en: 'Quiet Room Presence',
      fr: 'Présence de Chambre Silencieuse',
      es: 'Presencia de Habitación Silenciosa',
    },
    category: 'interior-spaces',
    mood: {
      en: 'Intimate, Personal, Safe Space',
      fr: 'Intime, Personnel, Espace Sûr',
      es: 'Íntimo, Personal, Espacio Seguro',
    },
    culturalContext: {
      en: 'The subtle sounds of a private space where cultural identity is maintained and stories are shared.',
      fr: 'Les sons subtils d\'un espace privé où l\'identité culturelle est maintenue et les histoires partagées.',
      es: 'Los sonidos sutiles de un espacio privado donde se mantiene la identidad cultural y se comparten historias.',
    },
    filePath: '/media/ambient/interior-room-tone.mp3',
    duration: 180,
    mixLevel: -24,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['interior', 'quiet', 'intimate', 'home', 'safety'],
    compatibleThemes: ['Family & Separation', 'Letters Never Sent', 'Small Histories'],
    productionNotes: 'Very subtle — slight air movement, distant muffled sounds, room tone',
  },
  {
    id: 'interior-kitchen',
    name: {
      en: 'Kitchen Ambience',
      fr: 'Ambiance de Cuisine',
      es: 'Ambiente de Cocina',
    },
    category: 'interior-spaces',
    mood: {
      en: 'Familial, Nourishing, Generational',
      fr: 'Familial, Nourrissant, Générationnel',
      es: 'Familiar, Nutritivo, Generacional',
    },
    culturalContext: {
      en: 'The kitchen as a site of cultural preservation — where recipes, language, and memory are passed down.',
      fr: 'La cuisine comme lieu de préservation culturelle — où recettes, langue, et mémoire se transmettent.',
      es: 'La cocina como sitio de preservación cultural — donde recetas, idioma, y memoria se transmiten.',
    },
    filePath: '/media/ambient/interior-kitchen.mp3',
    duration: 240,
    mixLevel: -20,
    seamlessLoop: true,
    frequencyRange: 'mid',
    tags: ['kitchen', 'cooking', 'family', 'home', 'culture'],
    compatibleThemes: ['The First Generation', 'What We Carry', 'Soft Power'],
    productionNotes: 'Gentle cooking sounds — water simmering, occasional pot/pan, gas burner hum',
  },
  {
    id: 'interior-basement-workshop',
    name: {
      en: 'Basement Workshop',
      fr: 'Atelier du Sous-Sol',
      es: 'Taller de Sótano',
    },
    category: 'interior-spaces',
    mood: {
      en: 'Industrious, Hidden Labor, Resilience',
      fr: 'Industrieux, Travail Caché, Résilience',
      es: 'Industrioso, Labor Oculta, Resiliencia',
    },
    culturalContext: {
      en: 'Immigrant labor often happens in basements — sewing, repair work, survival economies.',
      fr: 'Le travail immigrant se passe souvent dans les sous-sols — couture, réparation, économies de survie.',
      es: 'El trabajo inmigrante a menudo ocurre en sótanos — costura, reparación, economías de supervivencia.',
    },
    filePath: '/media/ambient/interior-basement-workshop.mp3',
    duration: 200,
    mixLevel: -18,
    seamlessLoop: true,
    frequencyRange: 'mid',
    tags: ['basement', 'work', 'labor', 'repair', 'industry'],
    compatibleThemes: ['Small Histories', 'Work / Worth', 'The First Generation'],
    productionNotes: 'Sewing machine rhythm (occasional), mechanical hum, fluorescent light buzz',
  },

  // ============================================
  // NATURE / LAND
  // ============================================
  {
    id: 'nature-forest-calm',
    name: {
      en: 'Forest Calm',
      fr: 'Calme de Forêt',
      es: 'Calma de Bosque',
    },
    category: 'nature-land',
    mood: {
      en: 'Grounding, Ancestral, Rooted',
      fr: 'Ancrant, Ancestral, Enraciné',
      es: 'Fundamentador, Ancestral, Arraigado',
    },
    culturalContext: {
      en: 'Connection to land, Indigenous presence, ecological memory.',
      fr: 'Connexion à la terre, présence autochtone, mémoire écologique.',
      es: 'Conexión con la tierra, presencia indígena, memoria ecológica.',
    },
    filePath: '/media/ambient/nature-forest-calm.mp3',
    duration: 300,
    mixLevel: -18,
    seamlessLoop: true,
    frequencyRange: 'full-spectrum',
    tags: ['forest', 'nature', 'trees', 'birds', 'land'],
    compatibleThemes: ['Indigenous Languages', 'Place & Memory', 'Healing & Resilience'],
    productionNotes: 'Gentle wind through trees, distant bird calls (sparse), rustling leaves',
  },
  {
    id: 'nature-ocean-waves',
    name: {
      en: 'Ocean Waves',
      fr: 'Vagues Océaniques',
      es: 'Olas del Océano',
    },
    category: 'nature-land',
    mood: {
      en: 'Vast, Cyclical, Migration',
      fr: 'Vaste, Cyclique, Migration',
      es: 'Vasto, Cíclico, Migración',
    },
    culturalContext: {
      en: 'The Atlantic as connector and divider — migration routes, diaspora, saltwater memory.',
      fr: 'L\'Atlantique comme connecteur et diviseur — routes migratoires, diaspora, mémoire d\'eau salée.',
      es: 'El Atlántico como conector y divisor — rutas migratorias, diáspora, memoria de agua salada.',
    },
    filePath: '/media/ambient/nature-ocean-waves.mp3',
    duration: 240,
    mixLevel: -16,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['ocean', 'waves', 'water', 'migration', 'atlantic'],
    compatibleThemes: ['Black Atlantic Canada', 'Voices of Migration', 'Place & Memory'],
    productionNotes: 'Rhythmic wave patterns, no seagulls, deep bass frequencies',
  },
  {
    id: 'nature-prairie-wind',
    name: {
      en: 'Prairie Wind',
      fr: 'Vent de Prairie',
      es: 'Viento de Pradera',
    },
    category: 'nature-land',
    mood: {
      en: 'Open, Vast, Possibility',
      fr: 'Ouvert, Vaste, Possibilité',
      es: 'Abierto, Vasto, Posibilidad',
    },
    culturalContext: {
      en: 'Canadian prairie as site of settlement, displacement, agricultural labor, and horizon.',
      fr: 'Prairie canadienne comme lieu de colonisation, déplacement, travail agricole, et horizon.',
      es: 'Pradera canadiense como sitio de asentamiento, desplazamiento, trabajo agrícola, y horizonte.',
    },
    filePath: '/media/ambient/nature-prairie-wind.mp3',
    duration: 280,
    mixLevel: -18,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['prairie', 'wind', 'open', 'land', 'horizon'],
    compatibleThemes: ['Home (No Fixed Address)', 'Place & Memory', 'Indigenous Languages'],
    productionNotes: 'Constant gentle wind, grass rustling, vast openness',
  },

  // ============================================
  // TRANSIT & MOVEMENT
  // ============================================
  {
    id: 'transit-subway',
    name: {
      en: 'Subway Transit',
      fr: 'Transit du Métro',
      es: 'Tránsito de Metro',
    },
    category: 'transit-movement',
    mood: {
      en: 'In-Between, Daily Commute, Working Class',
      fr: 'Entre-Deux, Trajet Quotidien, Classe Ouvrière',
      es: 'Intermedio, Viaje Diario, Clase Trabajadora',
    },
    culturalContext: {
      en: 'Public transit as the connective tissue of immigrant urban life — commute to work, between worlds.',
      fr: 'Transport en commun comme tissu conjonctif de la vie urbaine immigrante — trajet au travail, entre mondes.',
      es: 'Tránsito público como tejido conectivo de la vida urbana inmigrante — viaje al trabajo, entre mundos.',
    },
    filePath: '/media/ambient/transit-subway.mp3',
    duration: 200,
    mixLevel: -18,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['subway', 'transit', 'commute', 'urban', 'movement'],
    compatibleThemes: ['Work / Worth', 'The First Generation', 'Migration & Diaspora'],
    productionNotes: 'Train rumble, track sounds, occasional station announcements (muffled, unintelligible)',
  },
  {
    id: 'transit-airport-hall',
    name: {
      en: 'Airport Terminal',
      fr: 'Terminal d\'Aéroport',
      es: 'Terminal de Aeropuerto',
    },
    category: 'transit-movement',
    mood: {
      en: 'Threshold, Arrival, Departure',
      fr: 'Seuil, Arrivée, Départ',
      es: 'Umbral, Llegada, Partida',
    },
    culturalContext: {
      en: 'The airport as the crossing point — arrival in a new country, farewell to the old.',
      fr: 'L\'aéroport comme point de croisement — arrivée dans un nouveau pays, adieu à l\'ancien.',
      es: 'El aeropuerto como punto de cruce — llegada a un nuevo país, despedida al antiguo.',
    },
    filePath: '/media/ambient/transit-airport-hall.mp3',
    duration: 180,
    mixLevel: -20,
    seamlessLoop: true,
    frequencyRange: 'full-spectrum',
    tags: ['airport', 'arrival', 'departure', 'migration', 'threshold'],
    compatibleThemes: ['Voices of Migration', 'The First Generation', 'Family & Separation'],
    productionNotes: 'Distant announcements (unintelligible), footsteps, luggage wheels, air circulation',
  },
  {
    id: 'transit-car-interior',
    name: {
      en: 'Car Interior (Driving)',
      fr: 'Intérieur de Voiture (Conduite)',
      es: 'Interior de Coche (Conduciendo)',
    },
    category: 'transit-movement',
    mood: {
      en: 'Solitary Reflection, Journey, Hustle',
      fr: 'Réflexion Solitaire, Voyage, Agitation',
      es: 'Reflexión Solitaria, Viaje, Ajetreo',
    },
    culturalContext: {
      en: 'The car as workspace for gig economy workers, taxi drivers, delivery drivers — solitary labor.',
      fr: 'La voiture comme espace de travail pour travailleurs de l\'économie à la tâche, chauffeurs de taxi — travail solitaire.',
      es: 'El coche como espacio de trabajo para trabajadores de economía gig, taxistas — labor solitaria.',
    },
    filePath: '/media/ambient/transit-car-interior.mp3',
    duration: 240,
    mixLevel: -18,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['car', 'driving', 'gig-work', 'solitary', 'transit'],
    compatibleThemes: ['Work / Worth', 'The First Generation', 'Black Atlantic Canada'],
    productionNotes: 'Engine hum, road noise, occasional turn signal, no radio',
  },

  // ============================================
  // MEMORY / ABSTRACT TEXTURE
  // ============================================
  {
    id: 'memory-soft-texture',
    name: {
      en: 'Soft Memory Texture',
      fr: 'Texture de Mémoire Douce',
      es: 'Textura de Memoria Suave',
    },
    category: 'memory-abstract',
    mood: {
      en: 'Nostalgic, Fading, Gentle',
      fr: 'Nostalgique, Fuyant, Doux',
      es: 'Nostálgico, Desvaneciente, Suave',
    },
    culturalContext: {
      en: 'The abstract quality of memory — not sharp, but soft and incomplete.',
      fr: 'La qualité abstraite de la mémoire — pas nette, mais douce et incomplète.',
      es: 'La cualidad abstracta de la memoria — no nítida, sino suave e incompleta.',
    },
    filePath: '/media/ambient/memory-soft-texture.mp3',
    duration: 300,
    mixLevel: -22,
    seamlessLoop: true,
    frequencyRange: 'mid',
    tags: ['memory', 'abstract', 'texture', 'nostalgia', 'fading'],
    compatibleThemes: ['What We Carry', 'Letters Never Sent', 'Small Histories'],
    productionNotes: 'Pad-like texture, no rhythm, ethereal, warm analog quality',
  },
  {
    id: 'memory-distant-voices',
    name: {
      en: 'Distant Echoes',
      fr: 'Échos Distants',
      es: 'Ecos Distantes',
    },
    category: 'memory-abstract',
    mood: {
      en: 'Haunting, Ancestral, Presence',
      fr: 'Hantant, Ancestral, Présence',
      es: 'Inquietante, Ancestral, Presencia',
    },
    culturalContext: {
      en: 'The voices of those who came before — not heard clearly, but felt as presence.',
      fr: 'Les voix de ceux qui sont venus avant — pas entendues clairement, mais ressenties comme présence.',
      es: 'Las voces de quienes vinieron antes — no escuchadas claramente, pero sentidas como presencia.',
    },
    filePath: '/media/ambient/memory-distant-voices.mp3',
    duration: 260,
    mixLevel: -24,
    seamlessLoop: true,
    frequencyRange: 'mid',
    tags: ['memory', 'voices', 'ancestral', 'haunting', 'presence'],
    compatibleThemes: ['What We Carry', 'Indigenous Languages', 'Black Atlantic Canada'],
    productionNotes: 'Heavily processed vocal textures (unintelligible), reverb-heavy, ethereal',
  },
  {
    id: 'memory-time-suspension',
    name: {
      en: 'Suspended Time',
      fr: 'Temps Suspendu',
      es: 'Tiempo Suspendido',
    },
    category: 'memory-abstract',
    mood: {
      en: 'Stillness, Reflection, Liminal',
      fr: 'Immobilité, Réflexion, Liminal',
      es: 'Quietud, Reflexión, Liminal',
    },
    culturalContext: {
      en: 'The experience of being between worlds, between times — immigrant liminal space.',
      fr: 'L\'expérience d\'être entre mondes, entre temps — espace liminal immigrant.',
      es: 'La experiencia de estar entre mundos, entre tiempos — espacio liminal inmigrante.',
    },
    filePath: '/media/ambient/memory-time-suspension.mp3',
    duration: 240,
    mixLevel: -20,
    seamlessLoop: true,
    frequencyRange: 'low',
    tags: ['time', 'suspension', 'liminal', 'reflection', 'stillness'],
    compatibleThemes: ['Home (No Fixed Address)', 'Seen / Unseen', 'Voices of Migration'],
    productionNotes: 'Very slow movement, drone-like, no rhythm, contemplative',
  },
  {
    id: 'memory-archive-static',
    name: {
      en: 'Archive Static',
      fr: 'Statique d\'Archive',
      es: 'Estática de Archivo',
    },
    category: 'memory-abstract',
    mood: {
      en: 'Preservation, Fragility, Historical',
      fr: 'Préservation, Fragilité, Historique',
      es: 'Preservación, Fragilidad, Histórico',
    },
    culturalContext: {
      en: 'The sound of old recordings, degraded tapes, archived voices — history preserved imperfectly.',
      fr: 'Le son des vieux enregistrements, bandes dégradées, voix archivées — histoire préservée imparfaitement.',
      es: 'El sonido de grabaciones antiguas, cintas degradadas, voces archivadas — historia preservada imperfectamente.',
    },
    filePath: '/media/ambient/memory-archive-static.mp3',
    duration: 220,
    mixLevel: -22,
    seamlessLoop: true,
    frequencyRange: 'full-spectrum',
    tags: ['archive', 'static', 'history', 'preservation', 'fragility'],
    compatibleThemes: ['Small Histories', 'Letters Never Sent', 'Midnight Resonance'],
    productionNotes: 'Gentle tape hiss, vinyl crackle (very subtle), analog warmth, no harsh frequencies',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get ambient sounds by category
 */
export function getAmbientSoundsByCategory(category: AmbientCategory): AmbientSound[] {
  return AMBIENT_SOUNDS.filter(sound => sound.category === category);
}

/**
 * Get ambient sounds compatible with a story theme
 */
export function getAmbientSoundsByTheme(theme: string): AmbientSound[] {
  return AMBIENT_SOUNDS.filter(sound => 
    sound.compatibleThemes.includes(theme)
  );
}

/**
 * Get ambient sound by ID
 */
export function getAmbientSoundById(id: string): AmbientSound | undefined {
  return AMBIENT_SOUNDS.find(sound => sound.id === id);
}

/**
 * Get all ambient sounds sorted by category
 */
export function getAllAmbientSoundsByCategory(): Record<AmbientCategory, AmbientSound[]> {
  return {
    'urban-night': getAmbientSoundsByCategory('urban-night'),
    'interior-spaces': getAmbientSoundsByCategory('interior-spaces'),
    'nature-land': getAmbientSoundsByCategory('nature-land'),
    'transit-movement': getAmbientSoundsByCategory('transit-movement'),
    'memory-abstract': getAmbientSoundsByCategory('memory-abstract'),
  };
}

/**
 * Audio mixing utilities
 */
export const AudioMixing = {
  /**
   * Calculate ambient volume relative to narration
   * @param narrationVolume - Narration volume (0-1 scale)
   * @param ambientMixLevel - Mix level in dB (e.g., -18)
   * @returns Ambient volume (0-1 scale)
   */
  calculateAmbientVolume(narrationVolume: number, ambientMixLevel: number): number {
    // Convert dB to linear scale
    const gain = Math.pow(10, ambientMixLevel / 20);
    return narrationVolume * gain;
  },

  /**
   * Auto-duck ambient audio during narration
   * @param isNarrationPlaying - Whether narration is currently playing
   * @param baseAmbientVolume - Base ambient volume (0-1)
   * @returns Ducked volume (0-1)
   */
  autoDuck(isNarrationPlaying: boolean, baseAmbientVolume: number): number {
    if (isNarrationPlaying) {
      // Reduce ambient by 12dB when narration is playing
      return baseAmbientVolume * 0.25; // ~12dB reduction
    }
    return baseAmbientVolume;
  },
};

/**
 * Playback configuration
 */
export const AmbientPlaybackConfig = {
  /** Default mix level for ambient sounds */
  defaultMixLevel: -18,
  
  /** Fade in duration (ms) */
  fadeInDuration: 2000,
  
  /** Fade out duration (ms) */
  fadeOutDuration: 3000,
  
  /** Auto-duck duration (ms) */
  duckTransitionDuration: 500,
  
  /** Whether ambient audio is optional per chapter */
  optionalPerChapter: true,
  
  /** Whether to auto-start ambient when chapter starts */
  autoStart: true,
  
  /** Loop behavior */
  seamlessLooping: true,
};
