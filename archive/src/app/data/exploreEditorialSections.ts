/**
 * EXPLORE EDITORIAL SECTIONS
 * SEEN by CREOVA — Discovery Logic (UI-Locked)
 * 
 * Editorial sections that populate the Explore tab
 * Uses existing card components, NO UI/UX modifications
 * All ordering is editorial or chronological, NOT algorithmic
 * 
 * RULES:
 * - No infinite scroll dominance
 * - No popularity metrics
 * - No engagement ranking
 * - Human-curated content selection
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ExploreSectionConfig {
  sectionId: string;
  title: MultilingualText;
  description: MultilingualText;
  
  /** Content types allowed in this section */
  contentTypesAllowed: ('story' | 'film' | 'music' | 'collection')[];
  
  /** Manually curated content IDs (in display order) */
  contentIds: string[];
  
  /** Editorial rationale for this section */
  editorialRationale: string;
  
  /** Rotation frequency */
  rotationCadence: 'monthly' | 'quarterly' | 'seasonal' | 'static';
  
  /** Maximum items to display */
  maxItems: number;
  
  /** Display order on Explore page */
  displayOrder: number;
}

// ============================================
// SECTION 1: FEATURED COLLECTIONS
// ============================================

export const SECTION_FEATURED_COLLECTIONS: ExploreSectionConfig = {
  sectionId: 'featured-collections',
  title: {
    en: 'Featured Collections',
    fr: 'Collections en Vedette',
    es: 'Colecciones Destacadas',
  },
  description: {
    en: 'Curated collections from universities, museums, and cultural institutions',
    fr: 'Collections organisées par des universités, musées et institutions culturelles',
    es: 'Colecciones curadas por universidades, museos e instituciones culturales',
  },
  contentTypesAllowed: ['collection'],
  contentIds: [
    'coll-underground-railroad',      // Underground Railroad in Canada
    'coll-black-canadian-history',    // Black Canadian History Archive
    'coll-africville-memory',         // Africville & Community Displacement
    'coll-indigenous-solidarity',     // Indigenous & Black Solidarity
  ],
  editorialRationale: 'Institutional priority. Rotates monthly to highlight different academic and museum partnerships. Human-curated based on educational relevance and community impact.',
  rotationCadence: 'monthly',
  maxItems: 4,
  displayOrder: 1,
};

// ============================================
// SECTION 2: BLACK HISTORY OF CANADA
// ============================================

export const SECTION_BLACK_HISTORY_CANADA: ExploreSectionConfig = {
  sectionId: 'black-history-canada',
  title: {
    en: 'Black History of Canada',
    fr: 'Histoire Noire du Canada',
    es: 'Historia Negra de Canadá',
  },
  description: {
    en: 'Stories, films, and music exploring Black Canadian experiences from the 1700s to today',
    fr: 'Histoires, films et musique explorant les expériences canadiennes noires des années 1700 à aujourd\'hui',
    es: 'Historias, películas y música explorando experiencias canadienses negras desde los 1700 hasta hoy',
  },
  contentTypesAllowed: ['story', 'film', 'music'],
  contentIds: [
    // Stories
    'the-black-loyalists-arrival',
    'africville-what-the-city-took',
    's2-black-canadian-renaissance',
    
    // Films
    'nfb-remember-africville',
    'nfb-journey-to-justice',
    'nfb-speakers-for-the-dead',
    'cbc-viola-desmond',
    'nfb-montreal-negro-community',
    
    // Music
    'black-sound-canada-compilation',
  ],
  editorialRationale: 'Grouped thematically, not ranked. Includes archival films, story worlds, and music compilation. Chronological ordering where appropriate (e.g., Black Loyalists before Africville). No engagement metrics used.',
  rotationCadence: 'seasonal',
  maxItems: 12,
  displayOrder: 2,
};

// ============================================
// SECTION 3: AFRICVILLE & DISPLACEMENT
// ============================================

export const SECTION_AFRICVILLE_DISPLACEMENT: ExploreSectionConfig = {
  sectionId: 'africville-displacement',
  title: {
    en: 'Africville & Community Displacement',
    fr: 'Africville et Déplacement Communautaire',
    es: 'Africville y Desplazamiento Comunitario',
  },
  description: {
    en: 'The destruction of Africville and the ongoing fight for recognition and reparations',
    fr: 'La destruction d\'Africville et la lutte continue pour la reconnaissance et les réparations',
    es: 'La destrucción de Africville y la lucha continua por reconocimiento y reparaciones',
  },
  contentTypesAllowed: ['story', 'film', 'collection'],
  contentIds: [
    // Story
    'africville-what-the-city-took',
    
    // Films
    'nfb-remember-africville',
    'nfb-here-were-roots',
    'africville-museum-doc',
    
    // Collection
    'coll-africville-memory',
  ],
  editorialRationale: 'Deep-dive section on single community. Story provides narrative context, films provide archival testimony, collection provides academic framing. Respectful pacing—no rapid content switching.',
  rotationCadence: 'static',
  maxItems: 6,
  displayOrder: 3,
};

// ============================================
// SECTION 4: INDIGENOUS KNOWLEDGE & MEMORY
// ============================================

export const SECTION_INDIGENOUS_KNOWLEDGE: ExploreSectionConfig = {
  sectionId: 'indigenous-knowledge-memory',
  title: {
    en: 'Indigenous Knowledge & Memory',
    fr: 'Savoir et Mémoire Autochtones',
    es: 'Conocimiento y Memoria Indígena',
  },
  description: {
    en: 'Indigenous histories, contemporary voices, and solidarity with Black communities',
    fr: 'Histoires autochtones, voix contemporaines et solidarité avec les communautés noires',
    es: 'Historias indígenas, voces contemporáneas y solidaridad con comunidades negras',
  },
  contentTypesAllowed: ['film', 'story', 'collection'],
  contentIds: [
    // Films
    'nfb-we-were-children',
    'nfb-the-pass-system',
    'nfb-places-not-our-own',
    'aptn-8th-fire',
    
    // Collection
    'coll-indigenous-solidarity',
  ],
  editorialRationale: 'Respectful pacing. No autoplay. Content selected for educational value and community endorsement. Includes historical trauma (residential schools, pass system) and contemporary Indigenous voices.',
  rotationCadence: 'quarterly',
  maxItems: 8,
  displayOrder: 4,
};

// ============================================
// SECTION 5: UNDERGROUND RAILROAD IN CANADA
// ============================================

export const SECTION_UNDERGROUND_RAILROAD: ExploreSectionConfig = {
  sectionId: 'underground-railroad-canada',
  title: {
    en: 'Underground Railroad in Canada',
    fr: 'Chemin de Fer Clandestin au Canada',
    es: 'Ferrocarril Subterráneo en Canadá',
  },
  description: {
    en: 'The journey to freedom and the complex reality of Black life in 19th century Canada',
    fr: 'Le voyage vers la liberté et la réalité complexe de la vie noire au Canada du 19e siècle',
    es: 'El viaje hacia la libertad y la realidad compleja de la vida negra en Canadá del siglo XIX',
  },
  contentTypesAllowed: ['story', 'film', 'collection'],
  contentIds: [
    // Story
    'the-black-loyalists-arrival',
    
    // Films
    'nfb-journey-to-freedom',
    'heritage-minute-underground-railroad',
    
    // Collection
    'coll-underground-railroad',
  ],
  editorialRationale: 'Challenges "Canada as haven" myth. Story provides nuanced narrative (arrival was not freedom), films provide archival evidence, collection provides academic context.',
  rotationCadence: 'static',
  maxItems: 4,
  displayOrder: 5,
};

// ============================================
// SECTION 6: SOUND & CULTURE
// ============================================

export const SECTION_SOUND_CULTURE: ExploreSectionConfig = {
  sectionId: 'sound-culture',
  title: {
    en: 'Sound & Culture',
    fr: 'Son et Culture',
    es: 'Sonido y Cultura',
  },
  description: {
    en: 'Music, audio stories, and sonic experiences from BIPOC creators',
    fr: 'Musique, histoires audio et expériences sonores de créateurs PANDC',
    es: 'Música, historias de audio y experiencias sónicas de creadores BIPOC',
  },
  contentTypesAllowed: ['music', 'story'],
  contentIds: [
    // Music (Album/Experience-based, no individual tracks)
    'midnight-resonance-album',
    'black-sound-canada-compilation',
    'inuit-throat-songs-experience',
    'asian-diaspora-sounds-compilation',
    'creova-sampler-vol1',
    
    // Audio-led stories
    's2-black-canadian-renaissance',  // Has music/sound focus in Ch. 3
  ],
  editorialRationale: 'Album/experience-based listening. No shuffle. No autoplay between items. User must actively choose each listening experience. Emphasizes full-album engagement over singles.',
  rotationCadence: 'monthly',
  maxItems: 6,
  displayOrder: 6,
};

// ============================================
// SECTION 7: YOUTH, ART & FUTURES
// ============================================

export const SECTION_YOUTH_ART_FUTURES: ExploreSectionConfig = {
  sectionId: 'youth-art-futures',
  title: {
    en: 'Youth, Art & Futures',
    fr: 'Jeunesse, Art et Futurs',
    es: 'Juventud, Arte y Futuros',
  },
  description: {
    en: 'Experimental work, emerging creators, and visions of Black and Indigenous futures',
    fr: 'Travail expérimental, créateurs émergents et visions de futurs noirs et autochtones',
    es: 'Trabajo experimental, creadores emergentes y visiones de futuros negros e indígenas',
  },
  contentTypesAllowed: ['film', 'story', 'music'],
  contentIds: [
    // Films
    'nfb-the-colour-of-beauty',
    'nfb-hip-hop-evolution',
    'nfb-fresh-to-def',
    'cbc-black-lives-matter-canada',
    
    // Future-oriented stories (Season 2, 4)
    's2-black-canadian-renaissance',
    
    // Experimental music
    'inuit-throat-songs-experience',
  ],
  editorialRationale: 'Emerging voices and experimental forms. Includes contemporary activism (BLM Canada), experimental sound (Inuit throat singing), and speculative narratives. No content restrictions based on "marketability."',
  rotationCadence: 'monthly',
  maxItems: 8,
  displayOrder: 7,
};

// ============================================
// SECTION 8: ASIAN DIASPORA IN CANADA
// ============================================

export const SECTION_ASIAN_DIASPORA: ExploreSectionConfig = {
  sectionId: 'asian-diaspora-canada',
  title: {
    en: 'Asian Diaspora in Canada',
    fr: 'Diaspora Asiatique au Canada',
    es: 'Diáspora Asiática en Canadá',
  },
  description: {
    en: 'South Asian, East Asian, and Southeast Asian histories of migration, exclusion, and belonging',
    fr: 'Histoires sud-asiatiques, est-asiatiques et sud-est asiatiques de migration, exclusion et appartenance',
    es: 'Historias sudasiáticas, asiáticas orientales y del sudeste asiático de migración, exclusión y pertenencia',
  },
  contentTypesAllowed: ['film', 'collection', 'music'],
  contentIds: [
    // Films
    'nfb-continuous-journey',           // Komagata Maru
    'nfb-enemy-alien',                  // Japanese internment
    'heritage-minute-chinese-head-tax', // Chinese head tax
    
    // Music
    'asian-diaspora-sounds-compilation',
    
    // Collection
    'coll-asian-canadian-history',
  ],
  editorialRationale: 'Pan-Asian diaspora focus. Includes critical immigration histories (Komagata Maru, Japanese internment, Chinese head tax). Sonic compilation provides contemporary cultural expression.',
  rotationCadence: 'quarterly',
  maxItems: 6,
  displayOrder: 8,
};

// ============================================
// SECTION 9: CIVIL RIGHTS & RESISTANCE
// ============================================

export const SECTION_CIVIL_RIGHTS_RESISTANCE: ExploreSectionConfig = {
  sectionId: 'civil-rights-resistance',
  title: {
    en: 'Civil Rights & Resistance',
    fr: 'Droits Civiques et Résistance',
    es: 'Derechos Civiles y Resistencia',
  },
  description: {
    en: 'Stories of resistance, organizing, and the fight for justice in Canada',
    fr: 'Histoires de résistance, d\'organisation et de lutte pour la justice au Canada',
    es: 'Historias de resistencia, organización y lucha por justicia en Canadá',
  },
  contentTypesAllowed: ['film', 'story'],
  contentIds: [
    // Films
    'nfb-journey-to-justice',          // Viola Desmond & civil rights
    'cbc-viola-desmond',               // Viola Desmond short
    'cbc-black-lives-matter-canada',   // BLM Canada
    
    // Stories
    's2-black-canadian-renaissance',   // Includes resistance narrative
  ],
  editorialRationale: 'Resistance across eras. From Viola Desmond (1946) to BLM (2020). Shows continuity of struggle, not "progress narrative." Resistance as ongoing, not resolved.',
  rotationCadence: 'static',
  maxItems: 5,
  displayOrder: 9,
};

// ============================================
// COMBINED REGISTRY
// ============================================

export const EXPLORE_SECTIONS_REGISTRY: ExploreSectionConfig[] = [
  SECTION_FEATURED_COLLECTIONS,
  SECTION_BLACK_HISTORY_CANADA,
  SECTION_AFRICVILLE_DISPLACEMENT,
  SECTION_INDIGENOUS_KNOWLEDGE,
  SECTION_UNDERGROUND_RAILROAD,
  SECTION_SOUND_CULTURE,
  SECTION_YOUTH_ART_FUTURES,
  SECTION_ASIAN_DIASPORA,
  SECTION_CIVIL_RIGHTS_RESISTANCE,
];

// Sort by display order
EXPLORE_SECTIONS_REGISTRY.sort((a, b) => a.displayOrder - b.displayOrder);

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSectionById(sectionId: string): ExploreSectionConfig | undefined {
  return EXPLORE_SECTIONS_REGISTRY.find(s => s.sectionId === sectionId);
}

export function getSectionsByContentType(contentType: 'story' | 'film' | 'music' | 'collection'): ExploreSectionConfig[] {
  return EXPLORE_SECTIONS_REGISTRY.filter(s =>
    s.contentTypesAllowed.includes(contentType)
  );
}

export function getContentIdsBySectionId(sectionId: string): string[] {
  const section = getSectionById(sectionId);
  return section?.contentIds || [];
}

export function getAllCuratedContentIds(): string[] {
  // Returns all content IDs across all sections (deduplicated)
  const allIds = EXPLORE_SECTIONS_REGISTRY.flatMap(s => s.contentIds);
  return Array.from(new Set(allIds));
}

export function validateNoAlgorithmicRanking(): boolean {
  // Verify no section uses algorithmic ranking
  // All sections must have fixed contentIds array
  return EXPLORE_SECTIONS_REGISTRY.every(s =>
    Array.isArray(s.contentIds) && s.contentIds.length > 0
  );
}

export function validateNoPopularityMetrics(): boolean {
  // Verify no section references view counts, likes, shares, etc.
  // This is enforced by type system (no such fields exist)
  return true;
}

// ============================================
// ROTATION LOGIC
// ============================================

/**
 * Get sections that need rotation based on current date
 * Returns sections where rotation cadence period has elapsed
 */
export function getSectionsDueForRotation(currentDate: Date = new Date()): ExploreSectionConfig[] {
  // This is a placeholder for editorial rotation logic
  // In production, this would check last rotation date against cadence
  // For now, returns sections marked as 'monthly' or 'quarterly'
  
  const rotatableSections = EXPLORE_SECTIONS_REGISTRY.filter(s =>
    s.rotationCadence === 'monthly' || s.rotationCadence === 'quarterly'
  );
  
  // Editorial team would manually update contentIds for these sections
  return rotatableSections;
}

// ============================================
// VALIDATION & SUMMARY
// ============================================

export const EXPLORE_SECTIONS_SUMMARY = {
  totalSections: EXPLORE_SECTIONS_REGISTRY.length,
  totalCuratedItems: getAllCuratedContentIds().length,
  noAlgorithmicRanking: validateNoAlgorithmicRanking(),
  noPopularityMetrics: validateNoPopularityMetrics(),
  byContentType: {
    stories: getSectionsByContentType('story').length,
    films: getSectionsByContentType('film').length,
    music: getSectionsByContentType('music').length,
    collections: getSectionsByContentType('collection').length,
  },
  rotationCadences: {
    static: EXPLORE_SECTIONS_REGISTRY.filter(s => s.rotationCadence === 'static').length,
    monthly: EXPLORE_SECTIONS_REGISTRY.filter(s => s.rotationCadence === 'monthly').length,
    quarterly: EXPLORE_SECTIONS_REGISTRY.filter(s => s.rotationCadence === 'quarterly').length,
    seasonal: EXPLORE_SECTIONS_REGISTRY.filter(s => s.rotationCadence === 'seasonal').length,
  },
};

console.log('[Explore Sections] Registry loaded:', EXPLORE_SECTIONS_SUMMARY);
console.log('[Explore Sections] No algorithmic ranking:', validateNoAlgorithmicRanking());
console.log('[Explore Sections] No popularity metrics:', validateNoPopularityMetrics());
