/**
 * BIPOC COLLECTIONS CATALOG
 * SEEN by CREOVA — Curated, Not Algorithmic
 * 
 * Human-curated collections grouping stories, films, and music
 * NO popularity ranking, NO infinite scroll, NO algorithmic sorting
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface BIPOCCollection {
  collectionId: string;
  title: MultilingualText;
  curatorialDescription: MultilingualText;
  
  /** Content IDs included in collection */
  includedContent: {
    stories?: string[];
    films?: string[];
    music?: string[];
  };
  
  /** Editorial rationale */
  editorialRationale: MultilingualText;
  
  /** Curator information */
  curator: string;
  
  /** Collection image */
  coverImage: string;
  
  /** Themes */
  themes: string[];
  
  /** Languages available */
  languagesAvailable: string[];
  
  /** Featured status */
  featured: boolean;
  
  /** Created date */
  createdDate: string;
}

// ============================================
// COLLECTIONS
// ============================================

export const BIPOC_COLLECTIONS: BIPOCCollection[] = [
  {
    collectionId: 'collection-black-canadian-history',
    title: {
      en: 'Black Canadian History',
      fr: 'Histoire Canadienne Noire',
      es: 'Historia Canadiense Negra',
    },
    curatorialDescription: {
      en: 'From Black Loyalists to Africville to contemporary resistance — this collection centers Black Canadian experiences that textbooks erase. Not a history lesson. A reclamation.',
      fr: 'Des Loyalistes Noirs à Africville à la résistance contemporaine — cette collection centre les expériences canadiennes noires que les manuels effacent. Pas une leçon d\'histoire. Une récupération.',
      es: 'De Leales Negros a Africville a resistencia contemporánea — esta colección centra experiencias canadienses negras que libros de texto borran. No una lección de historia. Una reclamación.',
    },
    includedContent: {
      stories: ['black-loyalists', 'africville-destroyed', 'black-atlantic-canada'],
      films: ['film-black-sound-canada', 'film-africville-docs'],
      music: ['music-black-sound-canada'],
    },
    editorialRationale: {
      en: 'Canada\'s myth of multiculturalism erases Black history. This collection refuses that erasure. It documents systemic racism, resilience, and ongoing struggle. These are not feel-good stories — they are truth-telling.',
      fr: 'Le mythe canadien du multiculturalisme efface l\'histoire noire. Cette collection refuse cet effacement. Elle documente le racisme systémique, la résilience, et la lutte continue. Ce ne sont pas des histoires réconfortantes — c\'est dire la vérité.',
      es: 'El mito canadiense del multiculturalismo borra historia negra. Esta colección rechaza ese borrado. Documenta racismo sistémico, resiliencia, y lucha continua. No son historias reconfortantes — son verdad.',
    },
    curator: 'SEEN Editorial + Black History Advisors',
    coverImage: 'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=800&h=1200&fit=crop',
    themes: ['Black Canadian History', 'Systemic Racism', 'Resistance', 'Community'],
    languagesAvailable: ['en', 'fr', 'es'],
    featured: true,
    createdDate: 'Feb 2026',
  },
  {
    collectionId: 'collection-indigenous-knowledge',
    title: {
      en: 'Indigenous Knowledge & Memory',
      fr: 'Savoir et Mémoire Autochtones',
      es: 'Conocimiento y Memoria Indígenas',
    },
    curatorialDescription: {
      en: 'Indigenous people are not historical artifacts. We are here. We are creating. We are resisting. This collection centers Indigenous voices on language, land, and sovereignty.',
      fr: 'Les peuples autochtones ne sont pas des artefacts historiques. Nous sommes ici. Nous créons. Nous résistons. Cette collection centre les voix autochtones sur la langue, la terre, et la souveraineté.',
      es: 'Pueblos indígenas no son artefactos históricos. Estamos aquí. Estamos creando. Estamos resistiendo. Esta colección centra voces indígenas sobre idioma, tierra, y soberanía.',
    },
    includedContent: {
      stories: ['indigenous-languages', 'future-land-back', 'future-sixties-scoop'],
      films: ['film-language-keepers'],
      music: ['music-inuit-throat-songs'],
    },
    editorialRationale: {
      en: 'Indigenous knowledge is not dead. It is living, evolving, and resisting colonial erasure. This collection refuses the past tense and centers Indigenous futurity.',
      fr: 'Le savoir autochtone n\'est pas mort. Il est vivant, évoluant, et résistant à l\'effacement colonial. Cette collection refuse le passé et centre la futurité autochtone.',
      es: 'Conocimiento indígena no está muerto. Está vivo, evolucionando, y resistiendo borrado colonial. Esta colección rechaza el pasado y centra futuridad indígena.',
    },
    curator: 'Indigenous Advisory Council',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
    themes: ['Indigenous Sovereignty', 'Language', 'Land', 'Resistance'],
    languagesAvailable: ['en', 'fr', 'es'],
    featured: true,
    createdDate: 'Feb 2026',
  },
  {
    collectionId: 'collection-asian-diaspora-canada',
    title: {
      en: 'Asian Diaspora in Canada',
      fr: 'Diaspora Asiatique au Canada',
      es: 'Diáspora Asiática en Canadá',
    },
    curatorialDescription: {
      en: 'From head tax to internment camps to contemporary anti-Asian hate — Asian Canadian history is a history of exclusion and resistance. This collection refuses the model minority myth.',
      fr: 'De la taxe d\'entrée aux camps d\'internement à la haine anti-asiatique contemporaine — l\'histoire canadienne asiatique est une histoire d\'exclusion et de résistance. Cette collection refuse le mythe de la minorité modèle.',
      es: 'De impuesto de capitación a campos de internamiento a odio anti-asiático contemporáneo — historia canadiense asiática es historia de exclusión y resistencia. Esta colección rechaza mito de minoría modelo.',
    },
    includedContent: {
      stories: ['future-chinese-exclusion', 'future-japanese-internment', 'future-south-asian-migration'],
      films: [],
      music: [],
    },
    editorialRationale: {
      en: 'Asian Canadians are not a monolith. This collection documents diverse experiences of Chinese, Japanese, South Asian, and Southeast Asian communities, all shaped by Canadian racism.',
      fr: 'Les Canadiens asiatiques ne sont pas un monolithe. Cette collection documente des expériences diverses de communautés chinoises, japonaises, sud-asiatiques, et d\'Asie du Sud-Est, toutes façonnées par le racisme canadien.',
      es: 'Canadienses asiáticos no son un monolito. Esta colección documenta experiencias diversas de comunidades chinas, japonesas, sur-asiáticas, y del sudeste asiático, todas formadas por racismo canadiense.',
    },
    curator: 'Asian Canadian Cultural Advisors',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=1200&fit=crop',
    themes: ['Asian Canadian History', 'Exclusion', 'Internment', 'Model Minority Myth'],
    languagesAvailable: ['en', 'fr', 'es'],
    featured: true,
    createdDate: 'Feb 2026',
  },
  {
    collectionId: 'collection-sound-resistance',
    title: {
      en: 'Sound & Resistance',
      fr: 'Son et Résistance',
      es: 'Sonido y Resistencia',
    },
    curatorialDescription: {
      en: 'Music is resistance. From throat singing to jazz to hip-hop — BIPOC artists have used sound to document, resist, and create. This collection is a sonic archive of cultural power.',
      fr: 'La musique est résistance. Du chant de gorge au jazz au hip-hop — les artistes PANDC ont utilisé le son pour documenter, résister, et créer. Cette collection est une archive sonore de pouvoir culturel.',
      es: 'Música es resistencia. De canto de garganta a jazz a hip-hop — artistas BIPOC han usado sonido para documentar, resistir, y crear. Esta colección es archivo sonoro de poder cultural.',
    },
    includedContent: {
      stories: ['midnight-resonance'],
      films: ['film-black-sound-canada'],
      music: ['music-black-sound-canada', 'music-inuit-throat-songs', 'music-midnight-resonance'],
    },
    editorialRationale: {
      en: 'Sound carries memory. These albums, performances, and sonic experiments refuse silence. They document struggle, joy, and cultural survival.',
      fr: 'Le son porte la mémoire. Ces albums, performances, et expériences sonores refusent le silence. Ils documentent la lutte, la joie, et la survie culturelle.',
      es: 'Sonido lleva memoria. Estos álbumes, actuaciones, y experimentos sonoros rechazan silencio. Documentan lucha, alegría, y supervivencia cultural.',
    },
    curator: 'SEEN Music Curator',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
    themes: ['Music', 'Resistance', 'Cultural Production', 'Sonic Archives'],
    languagesAvailable: ['en', 'fr', 'es'],
    featured: true,
    createdDate: 'Feb 2026',
  },
  {
    collectionId: 'collection-youth-futures',
    title: {
      en: 'Youth & Cultural Futures',
      fr: 'Jeunesse et Avenirs Culturels',
      es: 'Juventud y Futuros Culturales',
    },
    curatorialDescription: {
      en: 'BIPOC youth are building the future. Climate organizing, mutual aid, cultural production, abolition. This collection centers young voices refusing to wait for permission.',
      fr: 'La jeunesse PANDC construit l\'avenir. Organisation climatique, aide mutuelle, production culturelle, abolition. Cette collection centre les jeunes voix refusant d\'attendre la permission.',
      es: 'Juventud BIPOC está construyendo futuro. Organización climática, ayuda mutua, producción cultural, abolición. Esta colección centra voces jóvenes rechazando esperar permiso.',
    },
    includedContent: {
      stories: ['future-youth-futures'],
      films: [],
      music: [],
    },
    editorialRationale: {
      en: 'Young people are not the future — they are the present. This collection refuses patronizing narratives and centers youth leadership.',
      fr: 'Les jeunes ne sont pas l\'avenir — ils sont le présent. Cette collection refuse les récits condescendants et centre le leadership des jeunes.',
      es: 'Jóvenes no son el futuro — son el presente. Esta colección rechaza narrativas condescendientes y centra liderazgo juvenil.',
    },
    curator: 'BIPOC Youth Advisory',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=1200&fit=crop',
    themes: ['Youth Organizing', 'Climate Justice', 'Mutual Aid', 'Cultural Production'],
    languagesAvailable: ['en', 'fr', 'es'],
    featured: false,
    createdDate: 'Feb 2026',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCollectionById(id: string): BIPOCCollection | undefined {
  return BIPOC_COLLECTIONS.find(c => c.collectionId === id);
}

export function getFeaturedCollections(): BIPOCCollection[] {
  return BIPOC_COLLECTIONS.filter(c => c.featured);
}

export function getCollectionsByTheme(theme: string): BIPOCCollection[] {
  return BIPOC_COLLECTIONS.filter(c => c.themes.includes(theme));
}
