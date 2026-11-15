/**
 * FUTURE STORY WORLDS INVENTORY
 * SEEN by CREOVA — Planned Content (NOT PUBLISHED)
 * 
 * Future seasons — do NOT surface in Explore or For You
 * Planning phase only
 */

import type { Language, MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type SeasonAssignment = 'Season 2' | 'Season 3' | 'Season 4';
export type CommunityFocus = 
  | 'Black Canadian'
  | 'Indigenous'
  | 'Asian Diaspora'
  | 'Cross-Cultural Solidarity'
  | 'LGBTQ2S+ BIPOC'
  | 'Youth & Intergenerational';

export type ContentFormat = 'story' | 'audio' | 'hybrid' | 'visual-essay';

export interface FutureStoryWorld {
  storyWorldId: string;
  
  /** Working title (subject to change) */
  workingTitle: MultilingualText;
  
  /** Cultural theme */
  culturalTheme: string;
  
  /** Community focus */
  communityFocus: CommunityFocus;
  
  /** Format */
  format: ContentFormat;
  
  /** Estimated chapter count */
  estimatedChapters: number;
  
  /** Season assignment */
  season: SeasonAssignment;
  
  /** Target audience */
  targetAudience: string[];
  
  /** Editorial intent */
  editorialIntent: MultilingualText;
  
  /** Status (always "Planned" for future content) */
  status: 'Planned';
  
  /** Planning notes */
  planningNotes?: string;
  
  /** Potential institutional partners */
  potentialPartners?: string[];
}

// ============================================
// BLACK CANADIAN HISTORY STORIES (5+)
// ============================================

export const FUTURE_BLACK_CANADIAN_STORIES: FutureStoryWorld[] = [
  {
    storyWorldId: 'future-black-loyalists',
    workingTitle: {
      en: 'Black Loyalists: The First Freedom Seekers',
      fr: 'Loyalistes Noirs: Les Premiers Chercheurs de Liberté',
      es: 'Leales Negros: Los Primeros Buscadores de Libertad',
    },
    culturalTheme: 'Black Canadian History & Migration',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Black Canadian communities', 'History educators', 'General public'],
    editorialIntent: {
      en: 'The story of Black Loyalists who fled the American Revolution seeking freedom in Canada, only to face broken promises, harsh conditions, and eventual migration to Sierra Leone. This is not a redemption story — it is a story of survival against systemic betrayal.',
      fr: 'L\'histoire des Loyalistes Noirs qui ont fui la Révolution américaine cherchant la liberté au Canada, pour faire face à des promesses brisées, des conditions difficiles, et une migration éventuelle vers la Sierra Leone. Ce n\'est pas une histoire de rédemption — c\'est une histoire de survie contre la trahison systémique.',
      es: 'La historia de los Leales Negros que huían de la Revolución Americana buscando libertad en Canadá, solo para enfrentar promesas rotas, condiciones duras, y migración eventual a Sierra Leona. Esta no es una historia de redención — es una historia de supervivencia contra la traición sistémica.',
    },
    status: 'Planned',
    planningNotes: 'Focus on Birchtown, Nova Scotia — largest free Black settlement outside Africa at the time (1783). Interview descendants, archival research with Black Cultural Centre for Nova Scotia.',
    potentialPartners: ['Black Cultural Centre for Nova Scotia', 'Black Loyalist Heritage Society'],
  },
  {
    storyWorldId: 'future-underground-railroad',
    workingTitle: {
      en: 'The Underground Railroad: Canadian Terminus',
      fr: 'Le Chemin de Fer Clandestin: Terminus Canadien',
      es: 'El Ferrocarril Subterráneo: Terminus Canadiense',
    },
    culturalTheme: 'Black Freedom Movement & Refuge',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 7,
    season: 'Season 2',
    targetAudience: ['Black communities', 'Educators', 'History buffs'],
    editorialIntent: {
      en: 'Canada was not the promised land. This story explores what happened AFTER arrival — the racism, segregation, economic struggle, and community-building of Black refugees who escaped slavery. Focus on Chatham, Buxton, and Amherstburg settlements.',
      fr: 'Le Canada n\'était pas la terre promise. Cette histoire explore ce qui s\'est passé APRÈS l\'arrivée — le racisme, la ségrégation, la lutte économique, et la construction communautaire des réfugiés noirs qui ont échappé à l\'esclavage. Focus sur les colonies de Chatham, Buxton, et Amherstburg.',
      es: 'Canadá no era la tierra prometida. Esta historia explora lo que sucedió DESPUÉS de la llegada — el racismo, segregación, lucha económica, y construcción comunitaria de refugiados negros que escaparon de la esclavitud. Enfoque en asentamientos de Chatham, Buxton, y Amherstburg.',
    },
    status: 'Planned',
    planningNotes: 'Partner with Buxton National Historic Site & Museum. Feature stories of Josiah Henson, Mary Ann Shadd Cary. Challenge myth of Canada as anti-racist haven.',
    potentialPartners: ['Buxton National Historic Site', 'Ontario Black History Society'],
  },
  {
    storyWorldId: 'future-africville',
    workingTitle: {
      en: 'Africville: A Community Destroyed',
      fr: 'Africville: Une Communauté Détruite',
      es: 'Africville: Una Comunidad Destruida',
    },
    culturalTheme: 'Black Community & Environmental Racism',
    communityFocus: 'Black Canadian',
    format: 'hybrid',
    estimatedChapters: 5,
    season: 'Season 2',
    targetAudience: ['Black Nova Scotians', 'Urban planning students', 'Anti-racism activists'],
    editorialIntent: {
      en: 'Africville was a thriving Black community in Halifax, Nova Scotia. In the 1960s, the city demolished it under the guise of "urban renewal" — environmental racism and forced displacement. This story centers former residents and their fight for recognition and reparations.',
      fr: 'Africville était une communauté noire prospère à Halifax, Nouvelle-Écosse. Dans les années 1960, la ville l\'a démolie sous couvert de "renouvellement urbain" — racisme environnemental et déplacement forcé. Cette histoire centre les anciens résidents et leur lutte pour la reconnaissance et les réparations.',
      es: 'Africville era una próspera comunidad negra en Halifax, Nueva Escocia. En los años 1960, la ciudad la demolió bajo el pretexto de "renovación urbana" — racismo ambiental y desplazamiento forzado. Esta historia centra a antiguos residentes y su lucha por reconocimiento y reparaciones.',
    },
    status: 'Planned',
    planningNotes: 'Collaborate with Africville Museum and former residents. Include audio from original families. Cover 2010 apology and ongoing reparations work.',
    potentialPartners: ['Africville Museum', 'Africville Genealogy Society'],
  },
  {
    storyWorldId: 'future-caribbean-migration',
    workingTitle: {
      en: 'Caribbean Canada: Beyond the Beaches',
      fr: 'Canada Caribéen: Au-Delà des Plages',
      es: 'Canadá Caribeño: Más Allá de las Playas',
    },
    culturalTheme: 'Caribbean Migration & Labor',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Caribbean-Canadian communities', 'Immigration researchers', 'Youth'],
    editorialIntent: {
      en: 'The story of Caribbean migration to Canada — not as vacation destination, but as site of labor, struggle, family separation, and community resilience. Focus on Jamaican, Trinidadian, and Bajan communities in Toronto, Montreal, and Calgary.',
      fr: 'L\'histoire de la migration caribéenne au Canada — pas comme destination de vacances, mais comme site de travail, de lutte, de séparation familiale, et de résilience communautaire. Focus sur les communautés jamaïcaines, trinidadiennes, et barbadiens à Toronto, Montréal, et Calgary.',
      es: 'La historia de migración caribeña a Canadá — no como destino vacacional, sino como sitio de trabajo, lucha, separación familiar, y resiliencia comunitaria. Enfoque en comunidades jamaiquinas, trinitenses, y de Barbados en Toronto, Montreal, y Calgary.',
    },
    status: 'Planned',
    planningNotes: 'Explore domestic worker programs (1955+), family sponsorship challenges, anti-Black racism in Canadian immigration policy. Feature Caribana origins.',
    potentialPartners: ['Caribbean Cultural Committee', 'Institute for Caribbean Studies'],
  },
  {
    storyWorldId: 'future-black-porters',
    workingTitle: {
      en: 'The Porters: Black Labor on Rails',
      fr: 'Les Porteurs: Travail Noir sur Rails',
      es: 'Los Porteadores: Trabajo Negro en Rieles',
    },
    culturalTheme: 'Black Labor & Organizing',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Labor historians', 'Black working-class communities', 'Union organizers'],
    editorialIntent: {
      en: 'Sleeping car porters were among the first Black workers to organize in Canada. They faced racism, exploitation, and systemic barriers — yet built the Brotherhood of Sleeping Car Porters and changed Canadian labor history. This is their story.',
      fr: 'Les porteurs de wagons-lits étaient parmi les premiers travailleurs noirs à s\'organiser au Canada. Ils ont fait face au racisme, à l\'exploitation, et aux barrières systémiques — mais ont construit la Fraternité des Porteurs de Wagons-Lits et changé l\'histoire du travail canadien. C\'est leur histoire.',
      es: 'Los porteadores de coches cama estaban entre los primeros trabajadores negros en organizarse en Canadá. Enfrentaron racismo, explotación, y barreras sistémicas — pero construyeron la Hermandad de Porteadores de Coches Cama y cambiaron la historia laboral canadiense. Esta es su historia.',
    },
    status: 'Planned',
    planningNotes: 'Partner with Canadian Labour Congress, interview descendants of porters. Feature Stanley Grizzle, A. Philip Randolph connections.',
    potentialPartners: ['Canadian Railway Museum', 'Black Labour History Project'],
  },
  {
    storyWorldId: 'future-black-arts-resistance',
    workingTitle: {
      en: 'Black Sound & Vision: Canadian Resistance',
      fr: 'Son et Vision Noirs: Résistance Canadienne',
      es: 'Sonido y Visión Negros: Resistencia Canadiense',
    },
    culturalTheme: 'Black Arts & Cultural Production',
    communityFocus: 'Black Canadian',
    format: 'hybrid',
    estimatedChapters: 7,
    season: 'Season 3',
    targetAudience: ['Black artists', 'Cultural workers', 'Music fans'],
    editorialIntent: {
      en: 'Black Canadian artists built sound, vision, and resistance against erasure. From Oscar Peterson to Michie Mee to The Weeknd, from Black Film Workshop to MOCA. This story refuses the narrative that Black Canadian culture is derivative — it is original, essential, and revolutionary.',
      fr: 'Les artistes noirs canadiens ont construit son, vision, et résistance contre l\'effacement. D\'Oscar Peterson à Michie Mee à The Weeknd, du Black Film Workshop au MOCA. Cette histoire refuse le récit que la culture noire canadienne est dérivée — elle est originale, essentielle, et révolutionnaire.',
      es: 'Artistas negros canadienses construyeron sonido, visión, y resistencia contra el borrado. Desde Oscar Peterson hasta Michie Mee hasta The Weeknd, desde Black Film Workshop hasta MOCA. Esta historia rechaza la narrativa de que la cultura negra canadiense es derivada — es original, esencial, y revolucionaria.',
    },
    status: 'Planned',
    planningNotes: 'Feature jazz, hip-hop, reggae, Afrobeats scenes. Cover institutional racism in Canadian arts funding. Celebrate Black creative legacy.',
    potentialPartners: ['Black Music Archive', 'MOCA (Museum of Contemporary Art)'],
  },
];

// ============================================
// INDIGENOUS-CENTERED STORIES (3+)
// ============================================

export const FUTURE_INDIGENOUS_STORIES: FutureStoryWorld[] = [
  {
    storyWorldId: 'future-sixties-scoop',
    workingTitle: {
      en: 'Stolen Childhoods: The Sixties Scoop',
      fr: 'Enfances Volées: La Rafle des Années 60',
      es: 'Infancias Robadas: El Barrido de los Sesenta',
    },
    culturalTheme: 'Indigenous Child Welfare & Cultural Genocide',
    communityFocus: 'Indigenous',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Scoop survivors', 'Adoptees', 'Child welfare workers', 'General public'],
    editorialIntent: {
      en: 'Between 1960s-1980s, over 20,000 Indigenous children were stolen from their families and adopted into white families. Many never reconnected. This is cultural genocide that continues today through child welfare systems. Survivors speak.',
      fr: 'Entre les années 1960-1980, plus de 20,000 enfants autochtones ont été volés de leurs familles et adoptés dans des familles blanches. Beaucoup ne se sont jamais reconnectés. C\'est un génocide culturel qui continue aujourd\'hui à travers les systèmes de protection de l\'enfance. Les survivants parlent.',
      es: 'Entre 1960s-1980s, más de 20,000 niños indígenas fueron robados de sus familias y adoptados en familias blancas. Muchos nunca se reconectaron. Esto es genocidio cultural que continúa hoy a través de sistemas de bienestar infantil. Sobrevivientes hablan.',
    },
    status: 'Planned',
    planningNotes: 'Center survivor voices. Partner with Sixties Scoop networks. Cover ongoing child apprehensions (higher rates than residential schools). No healing narrative without accountability.',
    potentialPartners: ['Sixties Scoop Network', 'Indigenous child welfare advocates'],
  },
  {
    storyWorldId: 'future-land-back',
    workingTitle: {
      en: 'Land Back: Not a Metaphor',
      fr: 'Retour de la Terre: Pas une Métaphore',
      es: 'Tierra de Vuelta: No es una Metáfora',
    },
    culturalTheme: 'Indigenous Land Sovereignty & Direct Action',
    communityFocus: 'Indigenous',
    format: 'hybrid',
    estimatedChapters: 5,
    season: 'Season 2',
    targetAudience: ['Land defenders', 'Activists', 'Settlers learning accountability'],
    editorialIntent: {
      en: 'Land Back is not symbolic reconciliation. It is material return of stolen territory. This story documents 1492 Land Back Lane, Tiny House Warriors, Wet\'suwet\'en resistance, and reclaimed lands. Direct action, legal battles, and refusal.',
      fr: 'Retour de la Terre n\'est pas une réconciliation symbolique. C\'est le retour matériel du territoire volé. Cette histoire documente 1492 Land Back Lane, Tiny House Warriors, résistance Wet\'suwet\'en, et terres récupérées. Action directe, batailles juridiques, et refus.',
      es: 'Tierra de Vuelta no es reconciliación simbólica. Es devolución material de territorio robado. Esta historia documenta 1492 Land Back Lane, Tiny House Warriors, resistencia Wet\'suwet\'en, y tierras recuperadas. Acción directa, batallas legales, y rechazo.',
    },
    status: 'Planned',
    planningNotes: 'Focus on successful land reclamations AND ongoing struggles. Feature land defenders (with consent). Cover state violence, RCMP complicity.',
    potentialPartners: ['Yellowhead Institute', 'Land defenders (with permission)'],
  },
  {
    storyWorldId: 'future-two-spirit-histories',
    workingTitle: {
      en: 'Two-Spirit: Reclaiming Indigenous Gender',
      fr: 'Bispirituel: Récupérer le Genre Autochtone',
      es: 'Dos Espíritus: Recuperando Género Indígena',
    },
    culturalTheme: 'Indigenous Gender Diversity & LGBTQ2S+',
    communityFocus: 'LGBTQ2S+ BIPOC',
    format: 'story',
    estimatedChapters: 5,
    season: 'Season 3',
    targetAudience: ['Two-Spirit people', 'LGBTQ2S+ communities', 'Indigenous youth'],
    editorialIntent: {
      en: 'Two-Spirit identity is not a Western import — it is Indigenous. Pre-colonial gender systems recognized multiple genders. Colonization imposed binary violence. This story centers Two-Spirit people reclaiming their place in Indigenous communities and resisting both homophobia and colonial gender norms.',
      fr: 'L\'identité bispirituelle n\'est pas une importation occidentale — elle est autochtone. Les systèmes de genre précoloniaux reconnaissaient plusieurs genres. La colonisation a imposé la violence binaire. Cette histoire centre les personnes bispirituelles récupérant leur place dans les communautés autochtones et résistant à l\'homophobie et aux normes de genre coloniales.',
      es: 'La identidad de Dos Espíritus no es una importación occidental — es indígena. Sistemas de género precoloniales reconocían múltiples géneros. Colonización impuso violencia binaria. Esta historia centra a personas Dos Espíritus recuperando su lugar en comunidades indígenas y resistiendo homofobia y normas de género coloniales.',
    },
    status: 'Planned',
    planningNotes: 'Consult with Two-Spirit Elders and communities. Cover historical roles, colonial erasure, contemporary organizing. Feature 2-Spirits in Motion.',
    potentialPartners: ['2-Spirits in Motion', 'Two-Spirit Elders'],
  },
];

// ============================================
// ASIAN DIASPORA STORIES (3+)
// ============================================

export const FUTURE_ASIAN_DIASPORA_STORIES: FutureStoryWorld[] = [
  {
    storyWorldId: 'future-chinese-exclusion',
    workingTitle: {
      en: 'The Chinese Exclusion Act: Canadian Racism',
      fr: 'Loi d\'Exclusion Chinoise: Racisme Canadien',
      es: 'Ley de Exclusión China: Racismo Canadiense',
    },
    culturalTheme: 'Asian Canadian History & Anti-Asian Racism',
    communityFocus: 'Asian Diaspora',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Chinese-Canadian communities', 'Educators', 'General public'],
    editorialIntent: {
      en: 'Canada banned Chinese immigration from 1923-1947. Before that, the head tax extracted wealth from Chinese laborers who built the railroad. This story refuses the model minority myth and centers systemic anti-Asian racism in Canadian history.',
      fr: 'Le Canada a interdit l\'immigration chinoise de 1923-1947. Avant cela, la taxe d\'entrée a extrait la richesse des travailleurs chinois qui ont construit le chemin de fer. Cette histoire refuse le mythe de la minorité modèle et centre le racisme anti-asiatique systémique dans l\'histoire canadienne.',
      es: 'Canadá prohibió inmigración china de 1923-1947. Antes, el impuesto de capitación extrajo riqueza de trabajadores chinos que construyeron el ferrocarril. Esta historia rechaza el mito de minoría modelo y centra racismo anti-asiático sistémico en historia canadiense.',
    },
    status: 'Planned',
    planningNotes: 'Partner with Chinese Canadian Museum. Feature testimonies, archival photos. Cover head tax, exclusion, apology (2006), and ongoing anti-Asian hate.',
    potentialPartners: ['Chinese Canadian Museum', 'Head Tax Families'],
  },
  {
    storyWorldId: 'future-japanese-internment',
    workingTitle: {
      en: 'Japanese Internment: Canadian Concentration Camps',
      fr: 'Internement Japonais: Camps de Concentration Canadiens',
      es: 'Internamiento Japonés: Campos de Concentración Canadienses',
    },
    culturalTheme: 'Japanese Canadian History & State Violence',
    communityFocus: 'Asian Diaspora',
    format: 'story',
    estimatedChapters: 7,
    season: 'Season 2',
    targetAudience: ['Japanese-Canadian communities', 'Human rights educators'],
    editorialIntent: {
      en: 'Over 22,000 Japanese Canadians were forcibly removed from their homes and imprisoned in internment camps during WWII. Their property was stolen. Families were separated. This was not "relocation" — it was concentration camps. Canada has never fully repaired this harm.',
      fr: 'Plus de 22,000 Canadiens japonais ont été forcément retirés de leurs maisons et emprisonnés dans des camps d\'internement pendant la Seconde Guerre mondiale. Leurs biens ont été volés. Les familles ont été séparées. Ce n\'était pas une "relocalisation" — c\'étaient des camps de concentration. Le Canada n\'a jamais complètement réparé ce tort.',
      es: 'Más de 22,000 canadienses japoneses fueron forzosamente removidos de sus hogares y encarcelados en campos de internamiento durante la Segunda Guerra Mundial. Su propiedad fue robada. Familias fueron separadas. Esto no fue "reubicación" — fueron campos de concentración. Canadá nunca ha reparado completamente este daño.',
    },
    status: 'Planned',
    planningNotes: 'Partner with Nikkei National Museum. Feature survivor testimony, archival records. Cover apology (1988), redress, and intergenerational trauma.',
    potentialPartners: ['Nikkei National Museum', 'Japanese Canadian Cultural Centre'],
  },
  {
    storyWorldId: 'future-south-asian-migration',
    workingTitle: {
      en: 'From Komagata Maru to Now: South Asian Canada',
      fr: 'Du Komagata Maru à Maintenant: Canada Sud-Asiatique',
      es: 'De Komagata Maru a Ahora: Canadá Sur-Asiático',
    },
    culturalTheme: 'South Asian Migration & Resistance',
    communityFocus: 'Asian Diaspora',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 3',
    targetAudience: ['South Asian communities', 'Immigration historians'],
    editorialIntent: {
      en: 'The Komagata Maru incident (1914) saw 376 South Asian passengers turned away from Vancouver — Canada\'s racist immigration laws in action. This story traces South Asian Canadian history from exclusion to Punjabi labor organizing, Sikh community-building, and contemporary anti-racist struggle.',
      fr: 'L\'incident du Komagata Maru (1914) a vu 376 passagers sud-asiatiques refoulés de Vancouver — les lois d\'immigration racistes du Canada en action. Cette histoire retrace l\'histoire sud-asiatique canadienne de l\'exclusion à l\'organisation du travail punjabi, la construction communautaire sikh, et la lutte antiraciste contemporaine.',
      es: 'El incidente Komagata Maru (1914) vio 376 pasajeros sur-asiáticos rechazados de Vancouver — leyes de inmigración racistas de Canadá en acción. Esta historia traza historia canadiense sur-asiática desde exclusión hasta organización laboral punjabi, construcción comunitaria sij, y lucha antirracista contemporánea.',
    },
    status: 'Planned',
    planningNotes: 'Partner with South Asian Canadian historians. Cover Komagata Maru, Ghadar Party, labor history, Air India bombing, contemporary Islamophobia.',
    potentialPartners: ['South Asian Canadian Histories Association', 'Sikh Heritage Museum'],
  },
];

// ============================================
// CROSS-CULTURAL SOLIDARITY STORIES (2+)
// ============================================

export const FUTURE_SOLIDARITY_STORIES: FutureStoryWorld[] = [
  {
    storyWorldId: 'future-coalitions-resistance',
    workingTitle: {
      en: 'Coalitions: BIPOC Solidarity in Action',
      fr: 'Coalitions: Solidarité PANDC en Action',
      es: 'Coaliciones: Solidaridad BIPOC en Acción',
    },
    culturalTheme: 'Cross-Cultural Solidarity & Organizing',
    communityFocus: 'Cross-Cultural Solidarity',
    format: 'hybrid',
    estimatedChapters: 5,
    season: 'Season 3',
    targetAudience: ['Activists', 'Organizers', 'BIPOC communities'],
    editorialIntent: {
      en: 'BIPOC solidarity is not automatic — it is built through shared struggle, mutual aid, and political education. This story documents successful coalitions: Black-Indigenous alliances, Asian-Black organizing, immigrant worker solidarity. Not utopian — honest about tensions and breakthroughs.',
      fr: 'La solidarité PANDC n\'est pas automatique — elle est construite à travers la lutte partagée, l\'aide mutuelle, et l\'éducation politique. Cette histoire documente les coalitions réussies: alliances Noires-Autochtones, organisation Asiatique-Noire, solidarité des travailleurs immigrants. Pas utopique — honnête sur les tensions et percées.',
      es: 'Solidaridad BIPOC no es automática — se construye a través de lucha compartida, ayuda mutua, y educación política. Esta historia documenta coaliciones exitosas: alianzas Negro-Indígenas, organización Asiático-Negra, solidaridad trabajadora inmigrante. No utópica — honesta sobre tensiones y avances.',
    },
    status: 'Planned',
    planningNotes: 'Feature real organizing examples: Idle No More + BLM, migrant worker unions, tenant organizing. Acknowledge anti-Blackness in non-Black POC communities.',
    potentialPartners: ['Community organizers (with consent)', 'Labor unions'],
  },
  {
    storyWorldId: 'future-youth-futures',
    workingTitle: {
      en: 'BIPOC Youth: Building the Future',
      fr: 'Jeunesse PANDC: Construire l\'Avenir',
      es: 'Juventud BIPOC: Construyendo el Futuro',
    },
    culturalTheme: 'Youth Organizing & Cultural Futures',
    communityFocus: 'Youth & Intergenerational',
    format: 'hybrid',
    estimatedChapters: 6,
    season: 'Season 3',
    targetAudience: ['BIPOC youth', 'Youth organizers', 'Educators'],
    editorialIntent: {
      en: 'BIPOC youth are not waiting for permission. They are organizing climate strikes, decolonial education, mutual aid networks, and cultural production. This story centers young voices building the future they want to see.',
      fr: 'La jeunesse PANDC n\'attend pas la permission. Elle organise des grèves climatiques, l\'éducation décoloniale, des réseaux d\'aide mutuelle, et la production culturelle. Cette histoire centre les jeunes voix construisant l\'avenir qu\'elles veulent voir.',
      es: 'Juventud BIPOC no está esperando permiso. Están organizando huelgas climáticas, educación decolonial, redes de ayuda mutua, y producción cultural. Esta historia centra voces jóvenes construyendo el futuro que quieren ver.',
    },
    status: 'Planned',
    planningNotes: 'Feature youth organizers (with consent). Cover climate justice, abolitionist organizing, cultural production. Intergenerational dialogue.',
    potentialPartners: ['Youth climate networks', 'Youth arts collectives'],
  },
];

// ============================================
// COMBINED INVENTORY
// ============================================

export const FUTURE_STORY_WORLDS_INVENTORY: FutureStoryWorld[] = [
  ...FUTURE_BLACK_CANADIAN_STORIES,
  ...FUTURE_INDIGENOUS_STORIES,
  ...FUTURE_ASIAN_DIASPORA_STORIES,
  ...FUTURE_SOLIDARITY_STORIES,
];

// ============================================
// SUMMARY STATISTICS
// ============================================

export const FUTURE_INVENTORY_SUMMARY = {
  totalStories: FUTURE_STORY_WORLDS_INVENTORY.length,
  byFocus: {
    'Black Canadian': FUTURE_BLACK_CANADIAN_STORIES.length,
    'Indigenous': FUTURE_INDIGENOUS_STORIES.length,
    'Asian Diaspora': FUTURE_ASIAN_DIASPORA_STORIES.length,
    'Cross-Cultural Solidarity': FUTURE_SOLIDARITY_STORIES.length,
  },
  bySeason: {
    'Season 2': FUTURE_STORY_WORLDS_INVENTORY.filter(s => s.season === 'Season 2').length,
    'Season 3': FUTURE_STORY_WORLDS_INVENTORY.filter(s => s.season === 'Season 3').length,
  },
  totalEstimatedChapters: FUTURE_STORY_WORLDS_INVENTORY.reduce((sum, s) => sum + s.estimatedChapters, 0),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get future stories by season
 */
export function getFutureStoriesBySeason(season: SeasonAssignment): FutureStoryWorld[] {
  return FUTURE_STORY_WORLDS_INVENTORY.filter(s => s.season === season);
}

/**
 * Get future stories by community focus
 */
export function getFutureStoriesByFocus(focus: CommunityFocus): FutureStoryWorld[] {
  return FUTURE_STORY_WORLDS_INVENTORY.filter(s => s.communityFocus === focus);
}

/**
 * Get future story by ID
 */
export function getFutureStoryById(id: string): FutureStoryWorld | undefined {
  return FUTURE_STORY_WORLDS_INVENTORY.find(s => s.storyWorldId === id);
}

// ============================================
// PUBLISHING GATE (SAFETY)
// ============================================

/**
 * Check if a story is published (ALWAYS false for future stories)
 */
export function isFutureStoryPublished(storyId: string): boolean {
  const story = getFutureStoryById(storyId);
  // Future stories are NEVER published
  return false;
}

/**
 * Check if story should appear in Explore (ALWAYS false for future stories)
 */
export function shouldAppearInExplore(storyId: string): boolean {
  // Future stories DO NOT appear in Explore
  return false;
}

/**
 * Check if story should appear in For You (ALWAYS false for future stories)
 */
export function shouldAppearInForYou(storyId: string): boolean {
  // Future stories DO NOT appear in For You
  return false;
}

// ============================================
// VALIDATION
// ============================================

export const VALIDATION_REPORT = {
  totalPlannedStories: FUTURE_STORY_WORLDS_INVENTORY.length,
  blackCanadianStoriesCount: FUTURE_BLACK_CANADIAN_STORIES.length,
  indigenousStoriesCount: FUTURE_INDIGENOUS_STORIES.length,
  asianDiasporaStoriesCount: FUTURE_ASIAN_DIASPORA_STORIES.length,
  solidarityStoriesCount: FUTURE_SOLIDARITY_STORIES.length,
  
  meetsRequirements: {
    blackCanadianStories: FUTURE_BLACK_CANADIAN_STORIES.length >= 5,
    indigenousStories: FUTURE_INDIGENOUS_STORIES.length >= 3,
    asianDiasporaStories: FUTURE_ASIAN_DIASPORA_STORIES.length >= 3,
    solidarityStories: FUTURE_SOLIDARITY_STORIES.length >= 2,
  },
  
  allStoriesPlanned: FUTURE_STORY_WORLDS_INVENTORY.every(s => s.status === 'Planned'),
  noStoriesPublished: FUTURE_STORY_WORLDS_INVENTORY.every(s => !isFutureStoryPublished(s.storyWorldId)),
};

console.log('[Future Story Worlds] Inventory loaded:', VALIDATION_REPORT);
