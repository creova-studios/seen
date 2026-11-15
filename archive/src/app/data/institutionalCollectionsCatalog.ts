/**
 * INSTITUTIONAL COLLECTIONS CATALOG
 * SEEN by CREOVA — Academic & Archive-Grade Collections
 * 
 * Suitable for:
 * - Universities and colleges (undergraduate/graduate level)
 * - K-12 education (high school level)
 * - Museums (Canadian Museum for Human Rights, ROM, etc.)
 * - Archives (Library and Archives Canada, provincial archives)
 * - Cultural institutions (community centers, research institutes)
 * - Public education programs
 * 
 * CMF-compliant, academically rigorous, citation-ready
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type InstitutionalLevel = 
  | 'K-12 (High School)'
  | 'Undergraduate'
  | 'Graduate / Research'
  | 'Public Education'
  | 'Museum / Archive'
  | 'Multi-Level';

export type CurriculumAlignment = 
  | 'Ontario Curriculum'
  | 'Canadian History'
  | 'Social Studies'
  | 'Equity & Inclusion'
  | 'Indigenous Studies'
  | 'African Canadian Studies'
  | 'Migration Studies'
  | 'Cultural Studies'
  | 'Labour Studies'
  | 'Women & Gender Studies';

export interface InstitutionalCollection {
  collectionId: string;
  
  /** Title */
  title: MultilingualText;
  
  /** Institutional framing (academic/neutral tone) */
  institutionalDescription: MultilingualText;
  
  /** Historical scope */
  historicalScope: {
    timeperiod: string; // e.g., "1783-1792" or "1960s-present"
    geography: string; // e.g., "Nova Scotia" or "Canada-wide"
    themes: string[];
  };
  
  /** Included content */
  includedContent: {
    stories?: string[];
    films?: string[];
    music?: string[];
    archivalDocuments?: string[];
    primarySources?: string[];
  };
  
  /** Educational suitability */
  educationalSuitability: {
    levels: InstitutionalLevel[];
    curriculumAlignment: CurriculumAlignment[];
    learningObjectives: MultilingualText[];
    criticalThinkingPrompts: MultilingualText[];
  };
  
  /** CMF-safe editorial rationale */
  editorialRationale: MultilingualText;
  
  /** Target audiences */
  targetAudiences: string[];
  
  /** Accessibility features */
  accessibilityFeatures: {
    transcripts: boolean;
    captions: boolean;
    audioDescriptions: boolean;
    readableTextLevel: string; // e.g., "Grade 10-12" or "Undergraduate"
  };
  
  /** Rights clearances */
  rightsClearances: {
    educationalUseApproved: boolean;
    archivalUseApproved: boolean;
    citationGuidelines: string;
    attributionRequired: string[];
  };
  
  /** Academic metadata */
  academicMetadata: {
    subjectHeadings: string[];
    keywords: string[];
    relatedScholarship: string[];
    primarySourceTypes: string[];
  };
  
  /** Institutional partnerships */
  institutionalPartners?: string[];
  
  /** Created date */
  createdDate: string;
  
  /** Featured status */
  featured: boolean;
}

// ============================================
// INSTITUTIONAL COLLECTIONS
// ============================================

export const INSTITUTIONAL_COLLECTIONS: InstitutionalCollection[] = [
  
  // ============================================
  // COLLECTION 1: BLACK LOYALISTS & EARLY CANADA
  // ============================================
  
  {
    collectionId: 'inst-black-loyalists-early-canada',
    title: {
      en: 'Black Loyalists and Early Black Settlement in Canada',
      fr: 'Loyalistes Noirs et Premières Colonies Noires au Canada',
      es: 'Leales Negros y Asentamiento Negro Temprano en Canadá',
    },
    institutionalDescription: {
      en: 'This collection examines the migration of approximately 3,000 Black Loyalists to British North America (Nova Scotia and New Brunswick) following the American Revolution (1783). It explores the broken promises of land and freedom, systemic racism in colonial administration, and the subsequent migration of over 1,200 Black Loyalists to Sierra Leone (1792). Content includes primary source analysis, historical narratives, and community perspectives from descendants.',
      fr: 'Cette collection examine la migration d\'environ 3,000 Loyalistes Noirs vers l\'Amérique du Nord britannique (Nouvelle-Écosse et Nouveau-Brunswick) après la Révolution américaine (1783). Elle explore les promesses brisées de terre et de liberté, le racisme systémique dans l\'administration coloniale, et la migration subséquente de plus de 1,200 Loyalistes Noirs vers la Sierra Leone (1792). Le contenu comprend l\'analyse de sources primaires, des récits historiques, et des perspectives communautaires de descendants.',
      es: 'Esta colección examina la migración de aproximadamente 3,000 Leales Negros a América del Norte británica (Nueva Escocia y New Brunswick) después de la Revolución Americana (1783). Explora las promesas rotas de tierra y libertad, racismo sistémico en administración colonial, y la migración subsiguiente de más de 1,200 Leales Negros a Sierra Leona (1792). El contenido incluye análisis de fuentes primarias, narrativas históricas, y perspectivas comunitarias de descendientes.',
    },
    historicalScope: {
      timeperiod: '1783-1792 (primary), with contemporary context',
      geography: 'Nova Scotia, New Brunswick, Sierra Leone',
      themes: [
        'Black Canadian History',
        'Colonial Settlement',
        'Systemic Racism',
        'Migration & Diaspora',
        'Broken Promises',
        'Community Resilience',
      ],
    },
    includedContent: {
      stories: ['black-loyalists'],
      films: [],
      music: [],
      primarySources: [
        'Book of Negroes (1783)',
        'Land grant records',
        'Birchtown census data',
        'Petition letters (Thomas Peters)',
      ],
    },
    educationalSuitability: {
      levels: ['K-12 (High School)', 'Undergraduate', 'Public Education', 'Museum / Archive'],
      curriculumAlignment: [
        'Ontario Curriculum',
        'Canadian History',
        'African Canadian Studies',
        'Migration Studies',
      ],
      learningObjectives: [
        {
          en: 'Analyze the motivations and experiences of Black Loyalists who migrated to British North America',
          fr: 'Analyser les motivations et expériences des Loyalistes Noirs qui ont migré vers l\'Amérique du Nord britannique',
          es: 'Analizar motivaciones y experiencias de Leales Negros que migraron a América del Norte británica',
        },
        {
          en: 'Evaluate the role of systemic racism in colonial land distribution and governance',
          fr: 'Évaluer le rôle du racisme systémique dans la distribution des terres coloniales et la gouvernance',
          es: 'Evaluar el papel del racismo sistémico en distribución de tierras coloniales y gobernanza',
        },
        {
          en: 'Examine primary sources to understand historical perspectives and community agency',
          fr: 'Examiner les sources primaires pour comprendre les perspectives historiques et l\'agence communautaire',
          es: 'Examinar fuentes primarias para entender perspectivas históricas y agencia comunitaria',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How did the British colonial administration\'s treatment of Black Loyalists contradict the promises made during the American Revolution?',
          fr: 'Comment le traitement des Loyalistes Noirs par l\'administration coloniale britannique contredisait-il les promesses faites pendant la Révolution américaine?',
          es: '¿Cómo contradijo el tratamiento de Leales Negros por la administración colonial británica las promesas hechas durante la Revolución Americana?',
        },
        {
          en: 'What does the migration to Sierra Leone reveal about Black Loyalist agency and resistance?',
          fr: 'Que révèle la migration vers la Sierra Leone sur l\'agence et la résistance des Loyalistes Noirs?',
          es: '¿Qué revela la migración a Sierra Leona sobre la agencia y resistencia de Leales Negros?',
        },
      ],
    },
    editorialRationale: {
      en: 'This collection provides academically rigorous content on a foundational yet often marginalized chapter of Canadian history. It challenges narratives of Canada as a haven for freedom seekers by documenting systemic racism in early colonial governance. Suitable for undergraduate Canadian history courses, high school social studies, and museum programming.',
      fr: 'Cette collection fournit un contenu académiquement rigoureux sur un chapitre fondamental mais souvent marginalisé de l\'histoire canadienne. Elle remet en question les récits du Canada comme refuge pour les chercheurs de liberté en documentant le racisme systémique dans la gouvernance coloniale précoce. Convient aux cours d\'histoire canadienne de premier cycle, aux études sociales du secondaire, et à la programmation muséale.',
      es: 'Esta colección proporciona contenido académicamente riguroso sobre un capítulo fundamental pero a menudo marginado de la historia canadiense. Desafía narrativas de Canadá como refugio para buscadores de libertad documentando racismo sistémico en gobernanza colonial temprana. Adecuado para cursos de historia canadiense de pregrado, estudios sociales de secundaria, y programación de museos.',
    },
    targetAudiences: [
      'Undergraduate history students',
      'High school educators (Grades 10-12)',
      'Museum curators and educators',
      'Black Canadian communities',
      'General public interested in Canadian history',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Grade 10-12 / Undergraduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "Black Loyalists and Early Black Settlement in Canada." Institutional Collection. 2026.',
      attributionRequired: ['SEEN by CREOVA', 'Black Cultural Centre for Nova Scotia (partner)'],
    },
    academicMetadata: {
      subjectHeadings: [
        'Black Loyalists',
        'Nova Scotia -- History -- 18th century',
        'Canada -- Race relations -- History',
        'African Canadians -- History',
      ],
      keywords: [
        'Black Loyalists',
        'Birchtown',
        'Thomas Peters',
        'Sierra Leone migration',
        'Colonial racism',
        'Land grants',
      ],
      relatedScholarship: [
        'Walker, James W. St. G. The Black Loyalists (1976)',
        'Whitfield, Harvey Amani. North to Bondage (2016)',
        'Spray, W.A. The Blacks in New Brunswick (1972)',
      ],
      primarySourceTypes: [
        'Land grant records',
        'Census data',
        'Petition letters',
        'The Book of Negroes',
      ],
    },
    institutionalPartners: ['Black Cultural Centre for Nova Scotia', 'Black Loyalist Heritage Society'],
    createdDate: 'Feb 2026',
    featured: true,
  },
  
  // ============================================
  // COLLECTION 2: AFRICVILLE & ENVIRONMENTAL RACISM
  // ============================================
  
  {
    collectionId: 'inst-africville-environmental-racism',
    title: {
      en: 'Africville and Environmental Racism in Canada',
      fr: 'Africville et le Racisme Environnemental au Canada',
      es: 'Africville y Racismo Ambiental en Canadá',
    },
    institutionalDescription: {
      en: 'This collection examines the history of Africville, a Black community in Halifax, Nova Scotia, and its demolition under the guise of "urban renewal" in the 1960s. It provides a case study in environmental racism, forced displacement, and community resistance. Content includes oral histories from former residents, archival documentation of the demolition, the 2010 apology, and ongoing reparations work. This collection is essential for understanding systemic racism in Canadian urban planning.',
      fr: 'Cette collection examine l\'histoire d\'Africville, une communauté noire à Halifax, Nouvelle-Écosse, et sa démolition sous couvert de "renouvellement urbain" dans les années 1960. Elle fournit une étude de cas sur le racisme environnemental, le déplacement forcé, et la résistance communautaire. Le contenu comprend des histoires orales d\'anciens résidents, de la documentation d\'archives de la démolition, les excuses de 2010, et le travail de réparations en cours. Cette collection est essentielle pour comprendre le racisme systémique dans l\'urbanisme canadien.',
      es: 'Esta colección examina la historia de Africville, una comunidad negra en Halifax, Nueva Escocia, y su demolición bajo pretexto de "renovación urbana" en los 1960s. Proporciona estudio de caso sobre racismo ambiental, desplazamiento forzado, y resistencia comunitaria. El contenido incluye historias orales de antiguos residentes, documentación de archivo de la demolición, la disculpa de 2010, y trabajo de reparaciones en curso. Esta colección es esencial para entender racismo sistémico en planificación urbana canadiense.',
    },
    historicalScope: {
      timeperiod: '1848-present (community founding to ongoing reparations)',
      geography: 'Halifax, Nova Scotia',
      themes: [
        'Environmental Racism',
        'Urban Planning & Policy',
        'Forced Displacement',
        'Community Resistance',
        'Reparations & Justice',
        'Black Canadian History',
      ],
    },
    includedContent: {
      stories: ['africville-destroyed'],
      films: ['film-africville-memory'],
      music: [],
      primarySources: [
        'City of Halifax demolition records',
        'Oral history testimonies',
        '2010 Apology text',
        'Africville Genealogy Society records',
      ],
    },
    educationalSuitability: {
      levels: ['K-12 (High School)', 'Undergraduate', 'Graduate / Research', 'Public Education', 'Museum / Archive'],
      curriculumAlignment: [
        'Ontario Curriculum',
        'Canadian History',
        'Social Studies',
        'Equity & Inclusion',
        'African Canadian Studies',
      ],
      learningObjectives: [
        {
          en: 'Define environmental racism and analyze its manifestation in Canadian urban policy',
          fr: 'Définir le racisme environnemental et analyser sa manifestation dans la politique urbaine canadienne',
          es: 'Definir racismo ambiental y analizar su manifestación en política urbana canadiense',
        },
        {
          en: 'Examine the social and economic impacts of forced displacement on Black communities',
          fr: 'Examiner les impacts sociaux et économiques du déplacement forcé sur les communautés noires',
          es: 'Examinar impactos sociales y económicos del desplazamiento forzado en comunidades negras',
        },
        {
          en: 'Evaluate the effectiveness of apologies and reparations in addressing historical injustice',
          fr: 'Évaluer l\'efficacité des excuses et des réparations pour remédier à l\'injustice historique',
          es: 'Evaluar efectividad de disculpas y reparaciones para abordar injusticia histórica',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How did the City of Halifax use "urban renewal" discourse to justify environmental racism?',
          fr: 'Comment la Ville de Halifax a-t-elle utilisé le discours de "renouvellement urbain" pour justifier le racisme environnemental?',
          es: '¿Cómo usó la Ciudad de Halifax el discurso de "renovación urbana" para justificar racismo ambiental?',
        },
        {
          en: 'What are the limitations of apologies without material reparations and land return?',
          fr: 'Quelles sont les limites des excuses sans réparations matérielles et retour de terres?',
          es: '¿Cuáles son las limitaciones de disculpas sin reparaciones materiales y retorno de tierras?',
        },
      ],
    },
    editorialRationale: {
      en: 'Africville is a critical case study for understanding environmental racism and urban displacement in Canada. This collection centers the voices of former residents and refuses sanitized narratives of "development." Suitable for courses in urban studies, environmental justice, Canadian history, and African Canadian studies. Essential for museum programming on systemic racism.',
      fr: 'Africville est une étude de cas critique pour comprendre le racisme environnemental et le déplacement urbain au Canada. Cette collection centre les voix des anciens résidents et refuse les récits aseptisés de "développement." Convient aux cours d\'études urbaines, de justice environnementale, d\'histoire canadienne, et d\'études africaines canadiennes. Essentiel pour la programmation muséale sur le racisme systémique.',
      es: 'Africville es estudio de caso crítico para entender racismo ambiental y desplazamiento urbano en Canadá. Esta colección centra voces de antiguos residentes y rechaza narrativas sanitizadas de "desarrollo." Adecuado para cursos de estudios urbanos, justicia ambiental, historia canadiense, y estudios africanos canadienses. Esencial para programación de museos sobre racismo sistémico.',
    },
    targetAudiences: [
      'Urban planning students',
      'Environmental justice educators',
      'Undergraduate and graduate researchers',
      'Museum and archive professionals',
      'Policy makers and urban planners',
      'Black Nova Scotian communities',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Undergraduate / Graduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "Africville and Environmental Racism in Canada." Institutional Collection. 2026.',
      attributionRequired: ['SEEN by CREOVA', 'Africville Museum', 'Africville Genealogy Society'],
    },
    academicMetadata: {
      subjectHeadings: [
        'Africville (Halifax, N.S.)',
        'Environmental racism -- Canada',
        'Urban renewal -- Nova Scotia -- Halifax',
        'African Canadians -- Nova Scotia -- Halifax',
      ],
      keywords: [
        'Africville',
        'Environmental racism',
        'Urban renewal',
        'Forced displacement',
        'Reparations',
        'Community resistance',
      ],
      relatedScholarship: [
        'Nelson, Jennifer. Razing Africville (2008)',
        'Clairmont, Donald H. and Dennis William Magill. Africville: The Life and Death of a Canadian Black Community (1999)',
        'Bundy, Alison. A Dream Deferred: The Story of Africville (1989)',
      ],
      primarySourceTypes: [
        'Oral histories',
        'City planning documents',
        'Apology texts',
        'Genealogical records',
      ],
    },
    institutionalPartners: ['Africville Museum', 'Africville Genealogy Society'],
    createdDate: 'Feb 2026',
    featured: true,
  },
  
  // ============================================
  // COLLECTION 3: UNDERGROUND RAILROAD (CANADIAN ROUTES)
  // ============================================
  
  {
    collectionId: 'inst-underground-railroad-canada',
    title: {
      en: 'The Underground Railroad: Canadian Routes and Settlement',
      fr: 'Le Chemin de Fer Clandestin: Routes et Colonies Canadiennes',
      es: 'El Ferrocarril Subterráneo: Rutas y Asentamientos Canadienses',
    },
    institutionalDescription: {
      en: 'This collection examines the Underground Railroad\'s Canadian terminus, focusing on Black settlements in Ontario (Chatham, Buxton, Amherstburg, Windsor) and experiences of freedom seekers after arrival. It challenges the myth of Canada as an anti-racist haven by documenting systemic racism, segregation, and economic hardship faced by Black refugees. Content includes historical narratives, archival maps, oral histories, and analysis of Black community-building strategies.',
      fr: 'Cette collection examine le terminus canadien du Chemin de Fer Clandestin, en se concentrant sur les colonies noires en Ontario (Chatham, Buxton, Amherstburg, Windsor) et les expériences des chercheurs de liberté après l\'arrivée. Elle remet en question le mythe du Canada comme refuge antiraciste en documentant le racisme systémique, la ségrégation, et les difficultés économiques auxquelles les réfugiés noirs ont été confrontés. Le contenu comprend des récits historiques, des cartes d\'archives, des histoires orales, et une analyse des stratégies de construction communautaire noire.',
      es: 'Esta colección examina el terminus canadiense del Ferrocarril Subterráneo, enfocándose en asentamientos negros en Ontario (Chatham, Buxton, Amherstburg, Windsor) y experiencias de buscadores de libertad después de llegar. Desafía el mito de Canadá como refugio antirracista documentando racismo sistémico, segregación, y dificultades económicas enfrentadas por refugiados negros. El contenido incluye narrativas históricas, mapas de archivo, historias orales, y análisis de estrategias de construcción comunitaria negra.',
    },
    historicalScope: {
      timeperiod: '1830s-1860s (primary), with post-Civil War context',
      geography: 'Southern Ontario (Chatham, Buxton, Amherstburg, Windsor, St. Catharines)',
      themes: [
        'Underground Railroad',
        'Black Canadian History',
        'Freedom & Refuge',
        'Systemic Racism',
        'Community Building',
        'Abolitionist Networks',
      ],
    },
    includedContent: {
      stories: ['future-underground-railroad'],
      films: [],
      music: [],
      primarySources: [
        'Josiah Henson autobiography',
        'Mary Ann Shadd Cary writings',
        'Buxton settlement records',
        'Census data (1850s-1860s)',
      ],
    },
    educationalSuitability: {
      levels: ['K-12 (High School)', 'Undergraduate', 'Public Education', 'Museum / Archive'],
      curriculumAlignment: [
        'Ontario Curriculum',
        'Canadian History',
        'African Canadian Studies',
        'Migration Studies',
      ],
      learningObjectives: [
        {
          en: 'Analyze the routes and networks of the Underground Railroad into Canada',
          fr: 'Analyser les routes et réseaux du Chemin de Fer Clandestin vers le Canada',
          es: 'Analizar rutas y redes del Ferrocarril Subterráneo hacia Canadá',
        },
        {
          en: 'Evaluate the myth of Canada as an anti-racist haven against historical evidence',
          fr: 'Évaluer le mythe du Canada comme refuge antiraciste par rapport aux preuves historiques',
          es: 'Evaluar mito de Canadá como refugio antirracista contra evidencia histórica',
        },
        {
          en: 'Examine strategies of Black community-building and resistance in 19th century Canada',
          fr: 'Examiner les stratégies de construction communautaire noire et de résistance au Canada du 19e siècle',
          es: 'Examinar estrategias de construcción comunitaria negra y resistencia en Canadá del siglo XIX',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How did Black refugees\' experiences in Canada contradict the promise of freedom?',
          fr: 'Comment les expériences des réfugiés noirs au Canada contredisaient-elles la promesse de liberté?',
          es: '¿Cómo contradijeron las experiencias de refugiados negros en Canadá la promesa de libertad?',
        },
        {
          en: 'What role did Black women like Mary Ann Shadd Cary play in abolitionist organizing?',
          fr: 'Quel rôle les femmes noires comme Mary Ann Shadd Cary ont-elles joué dans l\'organisation abolitionniste?',
          es: '¿Qué papel jugaron mujeres negras como Mary Ann Shadd Cary en organización abolicionista?',
        },
      ],
    },
    editorialRationale: {
      en: 'This collection provides critical examination of the Underground Railroad\'s Canadian context, challenging triumphalist narratives. It documents systemic racism alongside community resilience. Suitable for high school and undergraduate Canadian history courses, museum exhibitions, and public education programs focused on migration and freedom struggles.',
      fr: 'Cette collection fournit un examen critique du contexte canadien du Chemin de Fer Clandestin, remettant en question les récits triomphalistes. Elle documente le racisme systémique parallèlement à la résilience communautaire. Convient aux cours d\'histoire canadienne du secondaire et du premier cycle, aux expositions de musées, et aux programmes d\'éducation publique axés sur la migration et les luttes pour la liberté.',
      es: 'Esta colección proporciona examen crítico del contexto canadiense del Ferrocarril Subterráneo, desafiando narrativas triunfalistas. Documenta racismo sistémico junto con resiliencia comunitaria. Adecuado para cursos de historia canadiense de secundaria y pregrado, exposiciones de museos, y programas de educación pública enfocados en migración y luchas por libertad.',
    },
    targetAudiences: [
      'High school history students (Grades 10-12)',
      'Undergraduate Canadian history courses',
      'Museum educators and curators',
      'Black Canadian communities',
      'General public interested in abolitionist history',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Grade 10-12 / Undergraduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "The Underground Railroad: Canadian Routes and Settlement." Institutional Collection. 2026.',
      attributionRequired: ['SEEN by CREOVA', 'Buxton National Historic Site', 'Ontario Black History Society'],
    },
    academicMetadata: {
      subjectHeadings: [
        'Underground Railroad -- Canada',
        'Fugitive slaves -- Canada -- Ontario',
        'African Canadians -- Ontario -- History -- 19th century',
        'Chatham (Ont.) -- History',
        'Buxton (Ont.) -- History',
      ],
      keywords: [
        'Underground Railroad',
        'Josiah Henson',
        'Mary Ann Shadd Cary',
        'Buxton Settlement',
        'Black refugees',
        'Canadian racism',
      ],
      relatedScholarship: [
        'Siebert, Wilbur H. The Underground Railroad from Slavery to Freedom (1898)',
        'Smardz Frost, Karolyn. I\'ve Got a Home in Glory Land (2007)',
        'Shadd, Adrienne. The Journey from Tollgate to Parkway (2010)',
      ],
      primarySourceTypes: [
        'Autobiographies',
        'Newspaper articles (The Provincial Freeman)',
        'Census records',
        'Land deeds',
      ],
    },
    institutionalPartners: ['Buxton National Historic Site', 'Ontario Black History Society'],
    createdDate: 'Feb 2026',
    featured: true,
  },
  
  // ============================================
  // COLLECTION 4: CARIBBEAN MIGRATION TO CANADA
  // ============================================
  
  {
    collectionId: 'inst-caribbean-migration-canada',
    title: {
      en: 'Caribbean Migration to Canada: Labour, Family, and Community',
      fr: 'Migration Caribéenne au Canada: Travail, Famille, et Communauté',
      es: 'Migración Caribeña a Canadá: Trabajo, Familia, y Comunidad',
    },
    institutionalDescription: {
      en: 'This collection examines Caribbean migration to Canada from the 1950s to present, focusing on Jamaican, Trinidadian, and Barbadian communities in Toronto, Montreal, and Calgary. It analyzes the Domestic Worker Program, family separation, labor exploitation, and community-building strategies. Content includes oral histories, immigration policy analysis, and cultural preservation efforts (e.g., Caribana). This collection challenges tourism-based narratives of Caribbean culture.',
      fr: 'Cette collection examine la migration caribéenne au Canada des années 1950 à aujourd\'hui, en se concentrant sur les communautés jamaïcaines, trinidadiennes, et barbadiens à Toronto, Montréal, et Calgary. Elle analyse le Programme des aides familiaux, la séparation familiale, l\'exploitation du travail, et les stratégies de construction communautaire. Le contenu comprend des histoires orales, une analyse des politiques d\'immigration, et des efforts de préservation culturelle (par exemple, Caribana). Cette collection remet en question les récits touristiques de la culture caribéenne.',
      es: 'Esta colección examina migración caribeña a Canadá desde los 1950s hasta presente, enfocándose en comunidades jamaiquinas, trinitenses, y de Barbados en Toronto, Montreal, y Calgary. Analiza Programa de Trabajadores Domésticos, separación familiar, explotación laboral, y estrategias de construcción comunitaria. El contenido incluye historias orales, análisis de políticas de inmigración, y esfuerzos de preservación cultural (ej., Caribana). Esta colección desafía narrativas turísticas de cultura caribeña.',
    },
    historicalScope: {
      timeperiod: '1950s-present',
      geography: 'Toronto, Montreal, Calgary (primary); Canada-wide',
      themes: [
        'Caribbean Migration',
        'Labor & Economics',
        'Immigration Policy',
        'Family Separation',
        'Cultural Preservation',
        'Black Canadian History',
      ],
    },
    includedContent: {
      stories: ['future-caribbean-migration'],
      films: ['film-saltwater-routes'],
      music: [],
      primarySources: [
        'Domestic Worker Program records',
        'Immigration statistics',
        'Oral histories',
        'Caribana historical documents',
      ],
    },
    educationalSuitability: {
      levels: ['K-12 (High School)', 'Undergraduate', 'Graduate / Research', 'Public Education'],
      curriculumAlignment: [
        'Canadian History',
        'Migration Studies',
        'African Canadian Studies',
        'Labour Studies',
        'Women & Gender Studies',
      ],
      learningObjectives: [
        {
          en: 'Analyze immigration policies and their impact on Caribbean migrants to Canada',
          fr: 'Analyser les politiques d\'immigration et leur impact sur les migrants caribéens au Canada',
          es: 'Analizar políticas de inmigración y su impacto en migrantes caribeños a Canadá',
        },
        {
          en: 'Examine the gendered nature of Caribbean labor migration (Domestic Worker Program)',
          fr: 'Examiner la nature genrée de la migration de main-d\'œuvre caribéenne (Programme des aides familiaux)',
          es: 'Examinar naturaleza de género de migración laboral caribeña (Programa de Trabajadores Domésticos)',
        },
        {
          en: 'Evaluate strategies of cultural preservation and community-building in diaspora',
          fr: 'Évaluer les stratégies de préservation culturelle et de construction communautaire en diaspora',
          es: 'Evaluar estrategias de preservación cultural y construcción comunitaria en diáspora',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How did Canadian immigration policy create precarity for Caribbean domestic workers?',
          fr: 'Comment la politique d\'immigration canadienne a-t-elle créé la précarité pour les travailleurs domestiques caribéens?',
          es: '¿Cómo creó la política de inmigración canadiense precariedad para trabajadores domésticos caribeños?',
        },
        {
          en: 'What role does cultural celebration (Caribana) play in Caribbean-Canadian identity?',
          fr: 'Quel rôle la célébration culturelle (Caribana) joue-t-elle dans l\'identité caribéenne-canadienne?',
          es: '¿Qué papel juega la celebración cultural (Caribana) en identidad caribeña-canadiense?',
        },
      ],
    },
    editorialRationale: {
      en: 'This collection documents Caribbean migration beyond tourism narratives, centering labor exploitation, family separation, and resilience. It is essential for understanding racialized immigration policy and Black Canadian community formation. Suitable for undergraduate courses in migration studies, labor history, and diaspora studies, as well as museum programming on migration.',
      fr: 'Cette collection documente la migration caribéenne au-delà des récits touristiques, en centrant l\'exploitation du travail, la séparation familiale, et la résilience. Elle est essentielle pour comprendre la politique d\'immigration racialisée et la formation de la communauté noire canadienne. Convient aux cours de premier cycle en études de migration, histoire du travail, et études de diaspora, ainsi qu\'à la programmation muséale sur la migration.',
      es: 'Esta colección documenta migración caribeña más allá de narrativas turísticas, centrando explotación laboral, separación familiar, y resiliencia. Es esencial para entender política de inmigración racializada y formación de comunidad canadiense negra. Adecuado para cursos de pregrado en estudios de migración, historia laboral, y estudios de diáspora, así como programación de museos sobre migración.',
    },
    targetAudiences: [
      'Migration and diaspora studies students',
      'Labor historians',
      'Caribbean-Canadian communities',
      'Immigration policy researchers',
      'Museum and community educators',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Undergraduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "Caribbean Migration to Canada: Labour, Family, and Community." Institutional Collection. 2026.',
      attributionRequired: ['SEEN by CREOVA', 'Caribbean Cultural Committee', 'Institute for Caribbean Studies'],
    },
    academicMetadata: {
      subjectHeadings: [
        'Caribbean Canadians -- History',
        'West Indians -- Canada',
        'Domestic workers -- Canada',
        'Immigrants -- Canada -- Social conditions',
      ],
      keywords: [
        'Caribbean migration',
        'Domestic Worker Program',
        'Jamaican Canadians',
        'Caribana',
        'Labor migration',
        'Family separation',
      ],
      relatedScholarship: [
        'Henry, Frances. The Caribbean Diaspora in Toronto (1994)',
        'Calliste, Agnes. Black Canadians in Chatham-Kent (2011)',
        'James, Carl E. and Adrienne Shadd. Talking About Identity (2001)',
      ],
      primarySourceTypes: [
        'Oral histories',
        'Immigration records',
        'Policy documents',
        'Community archives',
      ],
    },
    institutionalPartners: ['Caribbean Cultural Committee', 'Institute for Caribbean Studies'],
    createdDate: 'Feb 2026',
    featured: true,
  },
  
  // ============================================
  // COLLECTION 5: BLACK LABOUR IN CANADA (RAIL PORTERS & DOMESTIC WORK)
  // ============================================
  
  {
    collectionId: 'inst-black-labour-canada',
    title: {
      en: 'Black Labour in Canada: Railway Porters and Domestic Workers',
      fr: 'Travail Noir au Canada: Porteurs de Chemin de Fer et Travailleurs Domestiques',
      es: 'Trabajo Negro en Canadá: Porteadores de Ferrocarril y Trabajadores Domésticos',
    },
    institutionalDescription: {
      en: 'This collection examines Black labor in Canada, focusing on railway porters and domestic workers. It documents the Brotherhood of Sleeping Car Porters, labor organizing, racism in employment, and the gendered nature of Black domestic work. Content includes union records, oral histories from porters and domestic workers, and analysis of labor rights struggles. This collection is essential for understanding racialized labor markets and working-class organizing in Canada.',
      fr: 'Cette collection examine le travail noir au Canada, en se concentrant sur les porteurs de chemin de fer et les travailleurs domestiques. Elle documente la Fraternité des Porteurs de Wagons-Lits, l\'organisation du travail, le racisme dans l\'emploi, et la nature genrée du travail domestique noir. Le contenu comprend des archives syndicales, des histoires orales de porteurs et de travailleurs domestiques, et une analyse des luttes pour les droits des travailleurs. Cette collection est essentielle pour comprendre les marchés du travail racialisés et l\'organisation de la classe ouvrière au Canada.',
      es: 'Esta colección examina trabajo negro en Canadá, enfocándose en porteadores de ferrocarril y trabajadores domésticos. Documenta Hermandad de Porteadores de Coches Cama, organización laboral, racismo en empleo, y naturaleza de género de trabajo doméstico negro. El contenido incluye registros sindicales, historias orales de porteadores y trabajadores domésticos, y análisis de luchas por derechos laborales. Esta colección es esencial para entender mercados laborales racializados y organización de clase trabajadora en Canadá.',
    },
    historicalScope: {
      timeperiod: '1900s-1970s (railway porters); 1950s-present (domestic workers)',
      geography: 'Canada-wide (railways); Toronto, Montreal (domestic work focus)',
      themes: [
        'Black Labour History',
        'Union Organizing',
        'Racialized Employment',
        'Domestic Work',
        'Working-Class Resistance',
        'Gender & Labor',
      ],
    },
    includedContent: {
      stories: ['future-black-porters'],
      films: [],
      music: [],
      primarySources: [
        'Brotherhood of Sleeping Car Porters records',
        'Railway employment statistics',
        'Union newsletters',
        'Oral histories from porters and domestic workers',
      ],
    },
    educationalSuitability: {
      levels: ['Undergraduate', 'Graduate / Research', 'Public Education', 'Museum / Archive'],
      curriculumAlignment: [
        'Labour Studies',
        'African Canadian Studies',
        'Canadian History',
        'Women & Gender Studies',
      ],
      learningObjectives: [
        {
          en: 'Analyze the role of race in Canadian labor markets and employment discrimination',
          fr: 'Analyser le rôle de la race dans les marchés du travail canadiens et la discrimination à l\'emploi',
          es: 'Analizar el papel de la raza en mercados laborales canadienses y discriminación en empleo',
        },
        {
          en: 'Examine strategies of Black labor organizing and union formation',
          fr: 'Examiner les stratégies d\'organisation du travail noir et de formation syndicale',
          es: 'Examinar estrategias de organización laboral negra y formación sindical',
        },
        {
          en: 'Evaluate the gendered and racialized nature of domestic work',
          fr: 'Évaluer la nature genrée et racialisée du travail domestique',
          es: 'Evaluar naturaleza de género y racializada de trabajo doméstico',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How did railway porters challenge racial capitalism through union organizing?',
          fr: 'Comment les porteurs de chemin de fer ont-ils défié le capitalisme racial par l\'organisation syndicale?',
          es: '¿Cómo desafiaron porteadores de ferrocarril capitalismo racial mediante organización sindical?',
        },
        {
          en: 'What are the continuities between historical domestic work and contemporary care work migration?',
          fr: 'Quelles sont les continuités entre le travail domestique historique et la migration contemporaine du travail de soins?',
          es: '¿Cuáles son las continuidades entre trabajo doméstico histórico y migración de trabajo de cuidados contemporánea?',
        },
      ],
    },
    editorialRationale: {
      en: 'This collection documents Black working-class history and labor organizing, challenging narratives that erase Black workers from Canadian labor history. It centers the Brotherhood of Sleeping Car Porters as a site of resistance and documents the ongoing exploitation of Black domestic workers. Essential for labor studies, Black Canadian history, and gender studies courses.',
      fr: 'Cette collection documente l\'histoire de la classe ouvrière noire et l\'organisation du travail, remettant en question les récits qui effacent les travailleurs noirs de l\'histoire du travail canadien. Elle centre la Fraternité des Porteurs de Wagons-Lits comme site de résistance et documente l\'exploitation continue des travailleurs domestiques noirs. Essentiel pour les cours d\'études du travail, d\'histoire canadienne noire, et d\'études de genre.',
      es: 'Esta colección documenta historia de clase trabajadora negra y organización laboral, desafiando narrativas que borran trabajadores negros de historia laboral canadiense. Centra Hermandad de Porteadores de Coches Cama como sitio de resistencia y documenta explotación continua de trabajadores domésticos negros. Esencial para cursos de estudios laborales, historia canadiense negra, y estudios de género.',
    },
    targetAudiences: [
      'Labor studies students',
      'Black Canadian communities',
      'Union organizers and educators',
      'Gender studies scholars',
      'Museum and archive professionals',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Undergraduate / Graduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "Black Labour in Canada: Railway Porters and Domestic Workers." Institutional Collection. 2026.',
      attributionRequired: ['SEEN by CREOVA', 'Canadian Labour Congress', 'Black Labour History Project'],
    },
    academicMetadata: {
      subjectHeadings: [
        'African Canadian labor union members',
        'Railroad workers -- Canada',
        'Brotherhood of Sleeping Car Porters',
        'Domestic workers -- Canada',
        'Women, Black -- Employment -- Canada',
      ],
      keywords: [
        'Sleeping car porters',
        'Brotherhood',
        'Stanley Grizzle',
        'Domestic workers',
        'Labor organizing',
        'Racialized employment',
      ],
      relatedScholarship: [
        'Calliste, Agnes. "Sleeping Car Porters in Canada" (1987)',
        'Brand, Dionne. No Burden to Carry (1991)',
        'Cooper, Afua. The Hanging of Angélique (2006)',
      ],
      primarySourceTypes: [
        'Union records',
        'Oral histories',
        'Employment contracts',
        'Railway company records',
      ],
    },
    institutionalPartners: ['Canadian Labour Congress', 'Black Labour History Project', 'Canadian Railway Museum'],
    createdDate: 'Feb 2026',
    featured: true,
  },
  
  // ============================================
  // COLLECTION 6: BLACK ARTS & CULTURAL RESISTANCE IN CANADA
  // ============================================
  
  {
    collectionId: 'inst-black-arts-cultural-resistance',
    title: {
      en: 'Black Arts and Cultural Resistance in Canada',
      fr: 'Arts Noirs et Résistance Culturelle au Canada',
      es: 'Artes Negras y Resistencia Cultural en Canadá',
    },
    institutionalDescription: {
      en: 'This collection examines Black cultural production and artistic resistance in Canada from the 1960s to present. It documents Black Theatre Canada, the Black Film Workshop, hip-hop culture, literary movements (Dionne Brand, Austin Clarke), and contemporary visual arts. Content analyzes how Black artists challenged systemic racism in Canadian arts funding and created autonomous cultural spaces. Essential for understanding Black Canadian cultural history.',
      fr: 'Cette collection examine la production culturelle noire et la résistance artistique au Canada des années 1960 à aujourd\'hui. Elle documente Black Theatre Canada, le Black Film Workshop, la culture hip-hop, les mouvements littéraires (Dionne Brand, Austin Clarke), et les arts visuels contemporains. Le contenu analyse comment les artistes noirs ont défié le racisme systémique dans le financement des arts canadiens et créé des espaces culturels autonomes. Essentiel pour comprendre l\'histoire culturelle canadienne noire.',
      es: 'Esta colección examina producción cultural negra y resistencia artística en Canadá desde los 1960s hasta presente. Documenta Black Theatre Canada, Black Film Workshop, cultura hip-hop, movimientos literarios (Dionne Brand, Austin Clarke), y artes visuales contemporáneas. El contenido analiza cómo artistas negros desafiaron racismo sistémico en financiamiento de artes canadienses y crearon espacios culturales autónomos. Esencial para entender historia cultural canadiense negra.',
    },
    historicalScope: {
      timeperiod: '1960s-present',
      geography: 'Toronto, Montreal, Halifax (primary); Canada-wide',
      themes: [
        'Black Canadian Arts',
        'Cultural Production',
        'Resistance & Activism',
        'Hip-Hop Culture',
        'Black Literature',
        'Visual Arts',
      ],
    },
    includedContent: {
      stories: ['future-black-arts-resistance'],
      films: ['film-black-sound-canada'],
      music: ['music-black-sound-canada'],
      primarySources: [
        'Black Theatre Canada archives',
        'Black Film Workshop records',
        'Literary texts (Brand, Clarke, Sears)',
        'Hip-hop cultural artifacts',
      ],
    },
    educationalSuitability: {
      levels: ['Undergraduate', 'Graduate / Research', 'Public Education', 'Museum / Archive'],
      curriculumAlignment: [
        'Cultural Studies',
        'African Canadian Studies',
        'Canadian Literature',
        'Visual Arts',
      ],
      learningObjectives: [
        {
          en: 'Analyze Black cultural production as resistance to systemic erasure',
          fr: 'Analyser la production culturelle noire comme résistance à l\'effacement systémique',
          es: 'Analizar producción cultural negra como resistencia a borrado sistémico',
        },
        {
          en: 'Examine institutional racism in Canadian arts funding and cultural policy',
          fr: 'Examiner le racisme institutionnel dans le financement des arts canadiens et la politique culturelle',
          es: 'Examinar racismo institucional en financiamiento de artes canadienses y política cultural',
        },
        {
          en: 'Evaluate the role of autonomous cultural spaces in Black community-building',
          fr: 'Évaluer le rôle des espaces culturels autonomes dans la construction de la communauté noire',
          es: 'Evaluar el papel de espacios culturales autónomos en construcción de comunidad negra',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How did Black artists challenge the myth of Canadian multiculturalism?',
          fr: 'Comment les artistes noirs ont-ils défié le mythe du multiculturalisme canadien?',
          es: '¿Cómo desafiaron artistas negros el mito del multiculturalismo canadiense?',
        },
        {
          en: 'What is the relationship between cultural production and political resistance?',
          fr: 'Quelle est la relation entre production culturelle et résistance politique?',
          es: '¿Cuál es la relación entre producción cultural y resistencia política?',
        },
      ],
    },
    editorialRationale: {
      en: 'This collection documents Black Canadian cultural production as resistance to erasure and marginalization. It challenges narratives that position Black Canadian culture as derivative of American forms. Essential for courses in Canadian literature, cultural studies, and African Canadian studies, as well as museum programming on contemporary Black art.',
      fr: 'Cette collection documente la production culturelle noire canadienne comme résistance à l\'effacement et à la marginalisation. Elle remet en question les récits qui positionnent la culture noire canadienne comme dérivée des formes américaines. Essentiel pour les cours de littérature canadienne, études culturelles, et études africaines canadiennes, ainsi que pour la programmation muséale sur l\'art noir contemporain.',
      es: 'Esta colección documenta producción cultural canadiense negra como resistencia a borrado y marginalización. Desafía narrativas que posicionan cultura canadiense negra como derivada de formas estadounidenses. Esencial para cursos de literatura canadiense, estudios culturales, y estudios africanos canadienses, así como programación de museos sobre arte negro contemporáneo.',
    },
    targetAudiences: [
      'Cultural studies students',
      'Black Canadian artists and cultural workers',
      'Museum curators and arts educators',
      'Literature and visual arts scholars',
      'Arts funding organizations',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Undergraduate / Graduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "Black Arts and Cultural Resistance in Canada." Institutional Collection. 2026.',
      attributionRequired: ['SEEN by CREOVA', 'MOCA', 'Black Music Archive', 'Black Canadian Studies programs'],
    },
    academicMetadata: {
      subjectHeadings: [
        'African Canadians in the performing arts',
        'Black Canadian literature',
        'Hip-hop -- Canada',
        'Arts, Black -- Canada',
      ],
      keywords: [
        'Black Theatre Canada',
        'Black Film Workshop',
        'Dionne Brand',
        'Austin Clarke',
        'Hip-hop culture',
        'Cultural resistance',
      ],
      relatedScholarship: [
        'Brand, Dionne. A Map to the Door of No Return (2001)',
        'Clarke, George Elliott. Odysseys Home: Mapping African-Canadian Literature (2002)',
        'Walcott, Rinaldo. Black Like Who? (2003)',
      ],
      primarySourceTypes: [
        'Theatrical scripts',
        'Film archives',
        'Literary texts',
        'Music recordings',
      ],
    },
    institutionalPartners: ['MOCA (Museum of Contemporary Art)', 'Black Music Archive', 'Black Canadian Studies programs'],
    createdDate: 'Feb 2026',
    featured: true,
  },

  // ============================================
  // COLLECTION 7: INDIGENOUS KNOWLEDGE SYSTEMS & LANGUAGE REVITALIZATION
  // ============================================
  
  {
    collectionId: 'inst-indigenous-knowledge-language',
    title: {
      en: 'Indigenous Knowledge Systems and Language Revitalization',
      fr: 'Systèmes de Connaissances Autochtones et Revitalisation Linguistique',
      es: 'Sistemas de Conocimiento Indígenas y Revitalización Lingüística',
    },
    institutionalDescription: {
      en: 'This collection examines Indigenous knowledge systems and language revitalization efforts across Canada. It documents the impacts of residential schools on language loss, contemporary revitalization programs, and the relationship between language, land, and sovereignty. Content includes Indigenous language pedagogies, oral histories, and community-led preservation initiatives. This collection centers Indigenous epistemologies and refuses colonial frameworks.',
      fr: 'Cette collection examine les systèmes de connaissances autochtones et les efforts de revitalisation linguistique à travers le Canada. Elle documente les impacts des pensionnats sur la perte linguistique, les programmes de revitalisation contemporains, et la relation entre langue, terre, et souveraineté. Le contenu comprend des pédagogies de langues autochtones, des histoires orales, et des initiatives de préservation communautaires. Cette collection centre les épistémologies autochtones et refuse les cadres coloniaux.',
      es: 'Esta colección examina sistemas de conocimiento indígenas y esfuerzos de revitalización lingüística en Canadá. Documenta impactos de escuelas residenciales en pérdida de idioma, programas de revitalización contemporáneos, y relación entre idioma, tierra, y soberanía. El contenido incluye pedagogías de idiomas indígenas, historias orales, e iniciativas de preservación comunitarias. Esta colección centra epistemologías indígenas y rechaza marcos coloniales.',
    },
    historicalScope: {
      timeperiod: 'Pre-contact to present',
      geography: 'Canada-wide (Cree, Inuktitut, Mi\'kmaq, Ojibwe, and other language communities)',
      themes: [
        'Indigenous Languages',
        'Cultural Genocide',
        'Language Revitalization',
        'Indigenous Knowledge Systems',
        'Residential Schools',
        'Sovereignty',
      ],
    },
    includedContent: {
      stories: ['indigenous-languages'],
      films: ['film-language-keepers'],
      music: ['music-inuit-throat-songs'],
      primarySources: [
        'Residential school records',
        'Language revitalization program documentation',
        'Oral histories from Elders',
        'Indigenous language learning materials',
      ],
    },
    educationalSuitability: {
      levels: ['K-12 (High School)', 'Undergraduate', 'Graduate / Research', 'Public Education', 'Museum / Archive'],
      curriculumAlignment: [
        'Indigenous Studies',
        'Canadian History',
        'Equity & Inclusion',
        'Cultural Studies',
      ],
      learningObjectives: [
        {
          en: 'Understand the relationship between language, culture, and Indigenous sovereignty',
          fr: 'Comprendre la relation entre langue, culture, et souveraineté autochtone',
          es: 'Entender relación entre idioma, cultura, y soberanía indígena',
        },
        {
          en: 'Analyze the impact of residential schools on Indigenous language loss',
          fr: 'Analyser l\'impact des pensionnats sur la perte linguistique autochtone',
          es: 'Analizar impacto de escuelas residenciales en pérdida de idioma indígena',
        },
        {
          en: 'Examine community-led language revitalization as resistance to colonial erasure',
          fr: 'Examiner la revitalisation linguistique communautaire comme résistance à l\'effacement colonial',
          es: 'Examinar revitalización lingüística comunitaria como resistencia a borrado colonial',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How does language revitalization challenge ongoing colonialism?',
          fr: 'Comment la revitalisation linguistique défie-t-elle la colonisation continue?',
          es: '¿Cómo desafía la revitalización lingüística colonialismo continuo?',
        },
        {
          en: 'What is the relationship between land-based education and language learning?',
          fr: 'Quelle est la relation entre éducation basée sur la terre et apprentissage linguistique?',
          es: '¿Cuál es la relación entre educación basada en tierra y aprendizaje de idioma?',
        },
      ],
    },
    editorialRationale: {
      en: 'This collection documents Indigenous knowledge systems and language revitalization as acts of sovereignty and resistance. It centers Indigenous voices and epistemologies. Essential for Indigenous studies, Canadian history, and education courses. Must be used with cultural humility and consultation with Indigenous communities.',
      fr: 'Cette collection documente les systèmes de connaissances autochtones et la revitalisation linguistique comme actes de souveraineté et résistance. Elle centre les voix et épistémologies autochtones. Essentiel pour les études autochtones, l\'histoire canadienne, et les cours d\'éducation. Doit être utilisé avec humilité culturelle et consultation avec les communautés autochtones.',
      es: 'Esta colección documenta sistemas de conocimiento indígenas y revitalización lingüística como actos de soberanía y resistencia. Centra voces y epistemologías indígenas. Esencial para estudios indígenas, historia canadiense, y cursos de educación. Debe usarse con humildad cultural y consulta con comunidades indígenas.',
    },
    targetAudiences: [
      'Indigenous communities',
      'Education students and educators',
      'Language revitalization practitioners',
      'Museum and cultural center professionals',
      'Researchers in Indigenous studies',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Grade 10-12 / Undergraduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "Indigenous Knowledge Systems and Language Revitalization." Institutional Collection. 2026. Used with permission from Indigenous Advisory Council.',
      attributionRequired: ['SEEN by CREOVA', 'Indigenous Advisory Council', 'Specific language communities (as appropriate)'],
    },
    academicMetadata: {
      subjectHeadings: [
        'Indigenous peoples -- Canada -- Languages',
        'Language revitalization -- Canada',
        'Residential schools -- Canada',
        'Traditional ecological knowledge',
      ],
      keywords: [
        'Indigenous languages',
        'Language revitalization',
        'Residential schools',
        'Cultural genocide',
        'Oral traditions',
        'Indigenous knowledge',
      ],
      relatedScholarship: [
        'Truth and Reconciliation Commission of Canada (2015)',
        'McIvor, Onowa and Art Napoleon. Language and Culture as Protective Factors (2009)',
        'Simpson, Leanne Betasamosake. As We Have Always Done (2017)',
      ],
      primarySourceTypes: [
        'Oral histories',
        'Language learning materials',
        'Residential school documents',
        'Revitalization program records',
      ],
    },
    institutionalPartners: ['Indigenous Advisory Council', 'National Centre for Truth and Reconciliation'],
    createdDate: 'Feb 2026',
    featured: true,
  },

  // ============================================
  // COLLECTION 8: ASIAN CANADIAN HISTORY & EXCLUSION
  // ============================================
  
  {
    collectionId: 'inst-asian-canadian-history-exclusion',
    title: {
      en: 'Asian Canadian History: Exclusion, Internment, and Resistance',
      fr: 'Histoire Canadienne Asiatique: Exclusion, Internement, et Résistance',
      es: 'Historia Canadiense Asiática: Exclusión, Internamiento, y Resistencia',
    },
    institutionalDescription: {
      en: 'This collection examines Asian Canadian history through the lens of exclusion and resistance. It documents the Chinese Exclusion Act (1923-1947), Japanese internment (1942-1949), the Komagata Maru incident (1914), and South Asian labor organizing. Content challenges the model minority myth and centers Asian Canadian experiences of systemic racism, community resilience, and political organizing. Essential for understanding racialized immigration policy in Canada.',
      fr: 'Cette collection examine l\'histoire canadienne asiatique à travers le prisme de l\'exclusion et de la résistance. Elle documente la Loi d\'Exclusion Chinoise (1923-1947), l\'internement japonais (1942-1949), l\'incident du Komagata Maru (1914), et l\'organisation du travail sud-asiatique. Le contenu remet en question le mythe de la minorité modèle et centre les expériences canadiennes asiatiques de racisme systémique, résilience communautaire, et organisation politique. Essentiel pour comprendre la politique d\'immigration racialisée au Canada.',
      es: 'Esta colección examina historia canadiense asiática a través de lente de exclusión y resistencia. Documenta Ley de Exclusión China (1923-1947), internamiento japonés (1942-1949), incidente Komagata Maru (1914), y organización laboral sur-asiática. El contenido desafía mito de minoría modelo y centra experiencias canadienses asiáticas de racismo sistémico, resiliencia comunitaria, y organización política. Esencial para entender política de inmigración racializada en Canadá.',
    },
    historicalScope: {
      timeperiod: '1885-present (Chinese head tax to contemporary)',
      geography: 'British Columbia (primary); Canada-wide',
      themes: [
        'Asian Canadian History',
        'Immigration Exclusion',
        'Japanese Internment',
        'Labor Organizing',
        'Model Minority Myth',
        'Systemic Racism',
      ],
    },
    includedContent: {
      stories: ['future-chinese-exclusion', 'future-japanese-internment', 'future-south-asian-migration'],
      films: ['film-komagata-maru'],
      music: ['music-asian-diaspora-sounds'],
      primarySources: [
        'Chinese Immigration Act (1923)',
        'Japanese internment records',
        'Komagata Maru passenger lists',
        'Head tax certificates',
      ],
    },
    educationalSuitability: {
      levels: ['K-12 (High School)', 'Undergraduate', 'Graduate / Research', 'Public Education', 'Museum / Archive'],
      curriculumAlignment: [
        'Canadian History',
        'Migration Studies',
        'Equity & Inclusion',
        'Cultural Studies',
      ],
      learningObjectives: [
        {
          en: 'Analyze racist immigration policies targeting Asian communities in Canadian history',
          fr: 'Analyser les politiques d\'immigration racistes ciblant les communautés asiatiques dans l\'histoire canadienne',
          es: 'Analizar políticas de inmigración racistas dirigidas a comunidades asiáticas en historia canadiense',
        },
        {
          en: 'Examine the Japanese internment as a case of state-sanctioned racial violence',
          fr: 'Examiner l\'internement japonais comme un cas de violence raciale sanctionnée par l\'État',
          es: 'Examinar internamiento japonés como caso de violencia racial sancionada por estado',
        },
        {
          en: 'Challenge the model minority myth through historical evidence',
          fr: 'Remettre en question le mythe de la minorité modèle par des preuves historiques',
          es: 'Desafiar mito de minoría modelo mediante evidencia histórica',
        },
      ],
      criticalThinkingPrompts: [
        {
          en: 'How did the Canadian government use economic rationales to justify racist exclusion?',
          fr: 'Comment le gouvernement canadien a-t-il utilisé des justifications économiques pour justifier l\'exclusion raciste?',
          es: '¿Cómo usó gobierno canadiense justificaciones económicas para justificar exclusión racista?',
        },
        {
          en: 'What does the internment of Japanese Canadians reveal about Canadian nationalism?',
          fr: 'Que révèle l\'internement des Canadiens japonais sur le nationalisme canadien?',
          es: '¿Qué revela internamiento de canadienses japoneses sobre nacionalismo canadiense?',
        },
      ],
    },
    editorialRationale: {
      en: 'This collection documents Asian Canadian history as a history of exclusion and resistance, challenging sanitized narratives of Canadian multiculturalism. It refuses the model minority myth and centers systemic racism. Essential for undergraduate Canadian history, migration studies, and Asian Canadian studies courses, as well as museum programming on immigration and human rights.',
      fr: 'Cette collection documente l\'histoire canadienne asiatique comme une histoire d\'exclusion et de résistance, remettant en question les récits aseptisés du multiculturalisme canadien. Elle refuse le mythe de la minorité modèle et centre le racisme systémique. Essentiel pour les cours d\'histoire canadienne de premier cycle, études de migration, et études canadiennes asiatiques, ainsi que pour la programmation muséale sur l\'immigration et les droits de la personne.',
      es: 'Esta colección documenta historia canadiense asiática como historia de exclusión y resistencia, desafiando narrativas sanitizadas de multiculturalismo canadiense. Rechaza mito de minoría modelo y centra racismo sistémico. Esencial para cursos de historia canadiense de pregrado, estudios de migración, y estudios canadienses asiáticos, así como programación de museos sobre inmigración y derechos humanos.',
    },
    targetAudiences: [
      'Asian Canadian communities',
      'Immigration and human rights educators',
      'Undergraduate and graduate students',
      'Museum curators',
      'Policy researchers',
    ],
    accessibilityFeatures: {
      transcripts: true,
      captions: true,
      audioDescriptions: true,
      readableTextLevel: 'Grade 10-12 / Undergraduate',
    },
    rightsClearances: {
      educationalUseApproved: true,
      archivalUseApproved: true,
      citationGuidelines: 'SEEN by CREOVA. "Asian Canadian History: Exclusion, Internment, and Resistance." Institutional Collection. 2026.',
      attributionRequired: ['SEEN by CREOVA', 'Chinese Canadian Museum', 'Nikkei National Museum', 'South Asian Canadian Histories Association'],
    },
    academicMetadata: {
      subjectHeadings: [
        'Asian Canadians -- History',
        'Japanese Canadians -- Evacuation and relocation, 1942-1945',
        'Chinese -- Canada -- History',
        'Komagata Maru Incident, 1914',
      ],
      keywords: [
        'Chinese Exclusion Act',
        'Head tax',
        'Japanese internment',
        'Komagata Maru',
        'Model minority myth',
        'Anti-Asian racism',
      ],
      relatedScholarship: [
        'Roy, Patricia E. The Oriental Question (2003)',
        'Miki, Roy. Redress: Inside the Japanese Canadian Call for Justice (2004)',
        'Kazimi, Ali. Undesirables: White Canada and the Komagata Maru (2012)',
      ],
      primarySourceTypes: [
        'Immigration Act documents',
        'Internment camp records',
        'Head tax certificates',
        'Oral histories',
      ],
    },
    institutionalPartners: ['Chinese Canadian Museum', 'Nikkei National Museum', 'South Asian Canadian Histories Association'],
    createdDate: 'Feb 2026',
    featured: true,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getInstitutionalCollectionById(id: string): InstitutionalCollection | undefined {
  return INSTITUTIONAL_COLLECTIONS.find(c => c.collectionId === id);
}

export function getInstitutionalCollectionsByLevel(level: InstitutionalLevel): InstitutionalCollection[] {
  return INSTITUTIONAL_COLLECTIONS.filter(c => 
    c.educationalSuitability.levels.includes(level)
  );
}

export function getInstitutionalCollectionsByCurriculum(curriculum: CurriculumAlignment): InstitutionalCollection[] {
  return INSTITUTIONAL_COLLECTIONS.filter(c =>
    c.educationalSuitability.curriculumAlignment.includes(curriculum)
  );
}

export function getFeaturedInstitutionalCollections(): InstitutionalCollection[] {
  return INSTITUTIONAL_COLLECTIONS.filter(c => c.featured);
}

// ============================================
// SUMMARY STATISTICS
// ============================================

export const INSTITUTIONAL_COLLECTIONS_SUMMARY = {
  totalCollections: INSTITUTIONAL_COLLECTIONS.length,
  byTheme: {
    'Black Canadian History': INSTITUTIONAL_COLLECTIONS.filter(c => 
      c.historicalScope.themes.includes('Black Canadian History')
    ).length,
    'Indigenous': INSTITUTIONAL_COLLECTIONS.filter(c =>
      c.historicalScope.themes.some(t => t.includes('Indigenous'))
    ).length,
    'Asian Canadian History': INSTITUTIONAL_COLLECTIONS.filter(c =>
      c.historicalScope.themes.includes('Asian Canadian History')
    ).length,
  },
  featured: INSTITUTIONAL_COLLECTIONS.filter(c => c.featured).length,
};

console.log('[Institutional Collections] Catalog loaded:', INSTITUTIONAL_COLLECTIONS_SUMMARY);
