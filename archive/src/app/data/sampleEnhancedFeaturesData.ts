/**
 * SAMPLE DATA — ENHANCED FEATURES
 * SEEN by CREOVA
 * 
 * Production-ready sample data for all 11 feature sets
 * Use this data to populate KV store during Phase 1 (Data Migration)
 */

import type {
  EnhancedContextCard,
  InstitutionalCollection,
  CreatorNote,
  ReflectionPrompt,
  OfflineCulturalPack,
  NarratorProfile,
  ChapterNarrationTrack,
  SeasonalEditorialFraming,
  ContentRights,
} from '../types/enhancedFeatures';

// ============================================================================
// FEATURE A: ENHANCED CONTEXT CARDS
// ============================================================================

export const SAMPLE_CONTEXT_CARDS: EnhancedContextCard[] = [
  {
    id: 'context-africville',
    term: 'Africville',
    explanation: {
      en: 'A Black community in Halifax, Nova Scotia, forcibly displaced in the 1960s.',
      fr: 'Une communauté noire à Halifax, Nouvelle-Écosse, déplacée de force dans les années 1960.',
      es: 'Una comunidad negra en Halifax, Nueva Escocia, desplazada por la fuerza en la década de 1960.',
    },
    expandedContext: {
      en: 'Africville was established in the 1840s by Black refugees and freedmen. Despite being one of Halifax\'s oldest communities, it was systematically denied services (water, sewage, roads) while being surrounded by industrial pollution. In the 1960s, the city demolished Africville under the guise of "urban renewal," displacing over 400 residents. The community fought for recognition for decades, receiving a formal apology in 2010.',
      fr: 'Africville a été fondée dans les années 1840 par des réfugiés noirs et des affranchis. Bien qu\'elle soit l\'une des plus anciennes communautés d\'Halifax, elle s\'est vu refuser systématiquement les services (eau, égouts, routes) tout en étant entourée de pollution industrielle. Dans les années 1960, la ville a démoli Africville sous prétexte de « rénovation urbaine », déplaçant plus de 400 résidents. La communauté s\'est battue pour la reconnaissance pendant des décennies, recevant des excuses formelles en 2010.',
      es: 'Africville fue fundada en la década de 1840 por refugiados negros y libertos. A pesar de ser una de las comunidades más antiguas de Halifax, se le negaron sistemáticamente los servicios (agua, alcantarillado, carreteras) mientras estaba rodeada de contaminación industrial. En la década de 1960, la ciudad demolió Africville bajo el pretexto de "renovación urbana", desplazando a más de 400 residentes. La comunidad luchó por el reconocimiento durante décadas, recibiendo una disculpa formal en 2010.',
    },
    institutionAnnotation: {
      text: {
        en: 'The displacement of Africville is recognized as environmental racism and a form of cultural genocide. The Africville Museum, established in 2012, preserves the history and honors the resilience of former residents and their descendants.',
        fr: 'Le déplacement d\'Africville est reconnu comme du racisme environnemental et une forme de génocide culturel. Le Musée d\'Africville, créé en 2012, préserve l\'histoire et honore la résilience des anciens résidents et de leurs descendants.',
        es: 'El desplazamiento de Africville es reconocido como racismo ambiental y una forma de genocidio cultural. El Museo Africville, establecido en 2012, preserva la historia y honra la resiliencia de los antiguos residentes y sus descendientes.',
      },
      source: {
        institutionName: 'Dalhousie University African Diaspora Studies',
        verifiedBy: 'Dr. Lynn Jones (Director)',
        verificationDate: '2026-01-15',
        institutionUrl: 'https://www.dal.ca/faculty/arts/african-diaspora.html',
        contactEmail: 'african.diaspora@dal.ca',
      },
    },
    relatedStoryIds: ['s2-africville-memory'],
    relatedContextCardIds: ['context-urban-renewal', 'context-environmental-racism'],
    createdAt: '2026-01-15T10:00:00Z',
    lastUpdated: '2026-01-15T10:00:00Z',
  },
  {
    id: 'context-sleeping-car-porter',
    term: 'Sleeping Car Porter',
    explanation: {
      en: 'Black railway workers who served passengers on overnight trains, primarily employed by Canadian Pacific Railway.',
      fr: 'Travailleurs ferroviaires noirs qui servaient les passagers dans les trains de nuit, principalement employés par le Chemin de fer Canadien Pacifique.',
      es: 'Trabajadores ferroviarios negros que servían a los pasajeros en trenes nocturnos, principalmente empleados por Canadian Pacific Railway.',
    },
    expandedContext: {
      en: 'From the 1880s to the 1960s, Black men worked as Sleeping Car Porters on Canadian railways. Despite grueling conditions and low wages, they formed the Brotherhood of Sleeping Car Porters (BSCP), one of the first Black labor unions in North America. The BSCP fought for fair wages, dignified working conditions, and became a training ground for civil rights activism.',
      fr: 'Des années 1880 aux années 1960, des hommes noirs ont travaillé comme porteurs de wagons-lits sur les chemins de fer canadiens. Malgré des conditions éprouvantes et des salaires bas, ils ont formé la Fraternité des porteurs de wagons-lits (BSCP), l\'un des premiers syndicats noirs d\'Amérique du Nord. Le BSCP s\'est battu pour des salaires équitables, des conditions de travail dignes et est devenu un terrain d\'entraînement pour l\'activisme des droits civiques.',
      es: 'Desde la década de 1880 hasta la década de 1960, hombres negros trabajaron como mozos de coche cama en los ferrocarriles canadienses. A pesar de las condiciones agotadoras y los bajos salarios, formaron la Hermandad de Mozos de Coche Cama (BSCP), uno de los primeros sindicatos negros de América del Norte. El BSCP luchó por salarios justos, condiciones de trabajo dignas y se convirtió en un campo de entrenamiento para el activismo de derechos civiles.',
    },
    institutionAnnotation: {
      text: {
        en: 'The legacy of Sleeping Car Porters extends beyond labor organizing—they were community builders, spreading news and culture across Canada, and many became leaders in civil rights movements.',
        fr: 'L\'héritage des porteurs de wagons-lits va au-delà de l\'organisation syndicale—ils étaient des bâtisseurs de communauté, diffusant des nouvelles et la culture à travers le Canada, et beaucoup sont devenus des leaders dans les mouvements de droits civiques.',
        es: 'El legado de los mozos de coche cama se extiende más allá de la organización laboral: fueron constructores de comunidad, difundiendo noticias y cultura por todo Canadá, y muchos se convirtieron en líderes de movimientos de derechos civiles.',
      },
      source: {
        institutionName: 'Canadian Museum for Human Rights',
        verifiedBy: 'Clint Curle (Senior Historian)',
        verificationDate: '2026-01-20',
        institutionUrl: 'https://humanrights.ca',
        contactEmail: 'info@humanrights.ca',
      },
    },
    relatedStoryIds: ['s2-sleeping-car-porters'],
    relatedContextCardIds: ['context-bscp', 'context-labor-organizing'],
    createdAt: '2026-01-20T14:00:00Z',
    lastUpdated: '2026-01-20T14:00:00Z',
  },
  {
    id: 'context-underground-railroad',
    term: 'Underground Railroad',
    explanation: {
      en: 'A network of secret routes and safe houses used by enslaved African Americans to escape to free states and Canada.',
      fr: 'Un réseau de routes secrètes et de maisons sûres utilisées par les Africains-Américains réduits en esclavage pour s\'échapper vers les États libres et le Canada.',
      es: 'Una red de rutas secretas y casas seguras utilizadas por afroamericanos esclavizados para escapar a estados libres y Canadá.',
    },
    expandedContext: {
      en: 'Between 1800 and 1865, an estimated 30,000-40,000 freedom seekers escaped to Canada via the Underground Railroad. Canada represented freedom—while the U.S. Fugitive Slave Act forced escapees to keep running, Canada offered legal protection. Many settled in Ontario, establishing vibrant Black communities.',
      fr: 'Entre 1800 et 1865, on estime que 30 000 à 40 000 chercheurs de liberté se sont échappés au Canada via le chemin de fer clandestin. Le Canada représentait la liberté—alors que la loi américaine sur les esclaves fugitifs obligeait les fugitifs à continuer de fuir, le Canada offrait une protection légale. Beaucoup se sont installés en Ontario, établissant des communautés noires dynamiques.',
      es: 'Entre 1800 y 1865, se estima que entre 30,000 y 40,000 buscadores de libertad escaparon a Canadá a través del Ferrocarril Subterráneo. Canadá representaba la libertad: mientras la Ley de Esclavos Fugitivos de EE. UU. obligaba a los fugitivos a seguir huyendo, Canadá ofrecía protección legal. Muchos se establecieron en Ontario, estableciendo comunidades negras vibrantes.',
    },
    relatedStoryIds: ['s2-black-canadian-renaissance'],
    relatedContextCardIds: ['context-harriet-tubman', 'context-black-settlements-canada'],
    createdAt: '2026-01-18T09:00:00Z',
    lastUpdated: '2026-01-18T09:00:00Z',
  },
];

// ============================================================================
// FEATURE C: INSTITUTIONAL COLLECTIONS
// ============================================================================

export const SAMPLE_INSTITUTIONAL_COLLECTIONS: InstitutionalCollection[] = [
  {
    id: 'collection-black-labor-history',
    title: {
      en: 'Black Canadian Labor History',
      fr: 'Histoire du travail noir canadien',
      es: 'Historia del trabajo negro canadiense',
    },
    description: {
      en: 'Stories of Black workers organizing for dignity, fair wages, and justice. From Sleeping Car Porters to contemporary labor movements.',
      fr: 'Histoires de travailleurs noirs s\'organisant pour la dignité, des salaires équitables et la justice. Des porteurs de wagons-lits aux mouvements syndicaux contemporains.',
      es: 'Historias de trabajadores negros organizándose por dignidad, salarios justos y justicia. Desde mozos de coche cama hasta movimientos laborales contemporáneos.',
    },
    editorialFraming: {
      en: 'Labor organizing has always been central to Black Canadian freedom struggles. These stories show how workers fought not just for wages, but for dignity, community power, and the right to be seen as fully human.',
      fr: 'L\'organisation syndicale a toujours été au cœur des luttes pour la liberté des Noirs canadiens. Ces histoires montrent comment les travailleurs se sont battus non seulement pour les salaires, mais pour la dignité, le pouvoir communautaire et le droit d\'être considérés comme pleinement humains.',
      es: 'La organización laboral siempre ha sido central en las luchas por la libertad de los negros canadienses. Estas historias muestran cómo los trabajadores lucharon no solo por salarios, sino por dignidad, poder comunitario y el derecho a ser vistos como plenamente humanos.',
    },
    curatedBy: 'Canadian Labour Congress & CREOVA Collective',
    contentIds: [
      's2-sleeping-car-porters',
      's2-black-canadian-renaissance',
    ],
    suggestedOrder: [
      's2-sleeping-car-porters',
      's2-black-canadian-renaissance',
    ],
    discussionPrompts: [
      {
        promptText: {
          en: 'How did labor organizing create community power beyond the workplace?',
          fr: 'Comment l\'organisation syndicale a-t-elle créé un pouvoir communautaire au-delà du lieu de travail?',
          es: '¿Cómo la organización laboral creó poder comunitario más allá del lugar de trabajo?',
        },
        intendedAudience: 'undergraduate',
        estimatedTime: '20 minutes',
      },
      {
        promptText: {
          en: 'What role did the Brotherhood of Sleeping Car Porters play in the broader civil rights movement?',
          fr: 'Quel rôle la Fraternité des porteurs de wagons-lits a-t-elle joué dans le mouvement plus large des droits civiques?',
          es: '¿Qué papel jugó la Hermandad de Mozos de Coche Cama en el movimiento más amplio de derechos civiles?',
        },
        intendedAudience: 'high-school',
        estimatedTime: '15 minutes',
      },
      {
        promptText: {
          en: 'How do we see labor organizing today in Black Canadian communities? What has changed? What remains the same?',
          fr: 'Comment voyons-nous l\'organisation syndicale aujourd\'hui dans les communautés noires canadiennes? Qu\'est-ce qui a changé? Qu\'est-ce qui reste le même?',
          es: '¿Cómo vemos la organización laboral hoy en las comunidades negras canadienses? ¿Qué ha cambiado? ¿Qué sigue igual?',
        },
        intendedAudience: 'general-public',
        estimatedTime: '30 minutes',
      },
    ],
    estimatedCompletionTime: '2 hours',
    themes: ['labor', 'organizing', 'civil-rights', 'Black-Canadian-history'],
    language: ['en', 'fr', 'es'],
    createdAt: '2026-02-01T10:00:00Z',
    lastUpdated: '2026-02-01T10:00:00Z',
    isPublic: true,
  },
  {
    id: 'collection-diaspora-belonging',
    title: {
      en: 'Diaspora & Belonging',
      fr: 'Diaspora et appartenance',
      es: 'Diáspora y pertenencia',
    },
    description: {
      en: 'Stories of migration, language, home, and the question: where do I belong?',
      fr: 'Histoires de migration, de langue, de chez-soi et de la question : où est ma place?',
      es: 'Historias de migración, idioma, hogar y la pregunta: ¿dónde pertenezco?',
    },
    editorialFraming: {
      en: 'Diaspora is not about loss—it is about making home in multiple places, carrying culture across borders, and refusing singular definitions of belonging.',
      fr: 'La diaspora ne concerne pas la perte—elle concerne le fait de se créer un chez-soi dans plusieurs endroits, de porter la culture au-delà des frontières et de refuser les définitions singulières de l\'appartenance.',
      es: 'La diáspora no se trata de pérdida—se trata de hacer hogar en múltiples lugares, llevar la cultura a través de fronteras y rechazar definiciones singulares de pertenencia.',
    },
    curatedBy: 'CREOVA Collective',
    contentIds: [
      's3-diaspora-belonging',
      's3-intergenerational-translation',
      's3-mixed-identity-navigation',
    ],
    suggestedOrder: [
      's3-diaspora-belonging',
      's3-intergenerational-translation',
      's3-mixed-identity-navigation',
    ],
    discussionPrompts: [
      {
        promptText: {
          en: 'What does "home" mean when you have roots in multiple places?',
          fr: 'Que signifie « chez-soi » lorsque vous avez des racines dans plusieurs endroits?',
          es: '¿Qué significa "hogar" cuando tienes raíces en múltiples lugares?',
        },
        intendedAudience: 'general-public',
        estimatedTime: '15 minutes',
      },
      {
        promptText: {
          en: 'How do immigrant parents and their Canadian-born children navigate cultural differences?',
          fr: 'Comment les parents immigrants et leurs enfants nés au Canada naviguent-ils dans les différences culturelles?',
          es: '¿Cómo los padres inmigrantes y sus hijos nacidos en Canadá navegan las diferencias culturales?',
        },
        intendedAudience: 'undergraduate',
        estimatedTime: '25 minutes',
      },
    ],
    estimatedCompletionTime: '3 hours',
    themes: ['diaspora', 'migration', 'identity', 'belonging', 'language'],
    language: ['en', 'fr', 'es'],
    createdAt: '2026-02-03T14:00:00Z',
    lastUpdated: '2026-02-03T14:00:00Z',
    isPublic: true,
  },
  {
    id: 'collection-indigenous-futures',
    title: {
      en: 'Indigenous Futures & Urban Resilience',
      fr: 'Futurs autochtones et résilience urbaine',
      es: 'Futuros indígenas y resiliencia urbana',
    },
    description: {
      en: 'Stories of Indigenous people navigating urban spaces, reclaiming ceremony, and imagining futures grounded in tradition.',
      fr: 'Histoires de peuples autochtones naviguant dans les espaces urbains, réclamant les cérémonies et imaginant des futurs ancrés dans la tradition.',
      es: 'Historias de pueblos indígenas navegando espacios urbanos, reclamando ceremonias e imaginando futuros arraigados en la tradición.',
    },
    editorialFraming: {
      en: 'Indigenous futures are not about choosing between tradition and modernity—they are about carrying knowledge forward, adapting without erasure, and building futures where land, language, and ceremony thrive.',
      fr: 'Les futurs autochtones ne consistent pas à choisir entre tradition et modernité—ils consistent à porter la connaissance de l\'avant, à s\'adapter sans effacement et à construire des futurs où la terre, la langue et la cérémonie prospèrent.',
      es: 'Los futuros indígenas no se tratan de elegir entre tradición y modernidad—se tratan de llevar el conocimiento adelante, adaptarse sin borrar y construir futuros donde la tierra, el idioma y la ceremonia prosperen.',
    },
    curatedBy: 'Winnipeg Art Gallery (Inuit Art Centre) & CREOVA Collective',
    contentIds: [
      's3-indigenous-urban',
      's4-cultural-futurism',
      's4-intergenerational-knowledge',
    ],
    suggestedOrder: [
      's3-indigenous-urban',
      's4-intergenerational-knowledge',
      's4-cultural-futurism',
    ],
    discussionPrompts: [
      {
        promptText: {
          en: 'What does it mean to practice ceremony in the city?',
          fr: 'Que signifie pratiquer la cérémonie en ville?',
          es: '¿Qué significa practicar la ceremonia en la ciudad?',
        },
        intendedAudience: 'undergraduate',
        estimatedTime: '20 minutes',
      },
      {
        promptText: {
          en: 'How does Indigenous futurism challenge colonial narratives about progress?',
          fr: 'Comment le futurisme autochtone remet-il en question les récits coloniaux sur le progrès?',
          es: '¿Cómo el futurismo indígena desafía las narrativas coloniales sobre el progreso?',
        },
        intendedAudience: 'graduate',
        estimatedTime: '30 minutes',
      },
    ],
    estimatedCompletionTime: '3 hours',
    institutionId: 'winnipeg-art-gallery',
    themes: ['Indigenous', 'futurism', 'urban', 'ceremony', 'resilience'],
    language: ['en', 'fr'],
    createdAt: '2026-02-05T11:00:00Z',
    lastUpdated: '2026-02-05T11:00:00Z',
    isPublic: true,
  },
];

// ============================================================================
// FEATURE E: CREATOR NOTES
// ============================================================================

export const SAMPLE_CREATOR_NOTES: CreatorNote[] = [
  {
    id: 'note-s2-sleeping-car-porters',
    storyWorldId: 's2-sleeping-car-porters',
    noteText: {
      en: 'This story was shaped by archival research at Library and Archives Canada, interviews with descendants of Sleeping Car Porters, and consultation with the Canadian Museum for Human Rights. The voices of porters who organized, resisted, and built community are not just history—they are a blueprint for labor organizing today. Thank you to the families who shared their stories and trusted us to carry them forward.',
      fr: 'Cette histoire a été façonnée par des recherches d\'archives à Bibliothèque et Archives Canada, des entrevues avec des descendants de porteurs de wagons-lits et des consultations avec le Musée canadien pour les droits de la personne. Les voix des porteurs qui se sont organisés, ont résisté et ont bâti la communauté ne sont pas seulement de l\'histoire—elles sont un plan pour l\'organisation syndicale aujourd\'hui. Merci aux familles qui ont partagé leurs histoires et nous ont fait confiance pour les porter de l\'avant.',
      es: 'Esta historia fue formada por investigación de archivos en Biblioteca y Archivos de Canadá, entrevistas con descendientes de mozos de coche cama y consulta con el Museo Canadiense de Derechos Humanos. Las voces de los mozos que se organizaron, resistieron y construyeron comunidad no son solo historia—son un modelo para la organización laboral hoy. Gracias a las familias que compartieron sus historias y confiaron en nosotros para llevarlas adelante.',
    },
    creatorName: 'CREOVA Collective',
    creatorBio: {
      en: 'CREOVA is a collective of Black, Indigenous, and diaspora storytellers centering cultural memory, resistance, and futures.',
      fr: 'CREOVA est un collectif de conteurs noirs, autochtones et de la diaspora centrant la mémoire culturelle, la résistance et les futurs.',
      es: 'CREOVA es un colectivo de narradores negros, indígenas y de la diáspora que centran la memoria cultural, la resistencia y los futuros.',
    },
    createdAt: '2026-01-25T16:00:00Z',
    lastUpdated: '2026-01-25T16:00:00Z',
    isPublished: true,
  },
  {
    id: 'note-s3-diaspora-belonging',
    storyWorldId: 's3-diaspora-belonging',
    noteText: {
      en: 'These stories emerged from conversations with first- and second-generation immigrants navigating language, home, and identity. Diaspora is not about loss—it is about making home in multiple places. Thank you to everyone who shared their stories of translation, code-switching, and belonging.',
      fr: 'Ces histoires ont émergé de conversations avec des immigrants de première et deuxième génération naviguant la langue, le chez-soi et l\'identité. La diaspora ne concerne pas la perte—elle concerne le fait de se créer un chez-soi dans plusieurs endroits. Merci à tous ceux qui ont partagé leurs histoires de traduction, de changement de code et d\'appartenance.',
      es: 'Estas historias surgieron de conversaciones con inmigrantes de primera y segunda generación navegando el idioma, el hogar y la identidad. La diáspora no se trata de pérdida—se trata de hacer hogar en múltiples lugares. Gracias a todos los que compartieron sus historias de traducción, cambio de código y pertenencia.',
    },
    creatorName: 'CREOVA Collective',
    createdAt: '2026-02-01T12:00:00Z',
    lastUpdated: '2026-02-01T12:00:00Z',
    isPublished: true,
  },
];

// ============================================================================
// FEATURE F: REFLECTION PROMPTS
// ============================================================================

export const SAMPLE_REFLECTION_PROMPTS: ReflectionPrompt[] = [
  {
    id: 'prompt-cultural-connection-s2-1',
    chapterId: 's2-sleeping-car-porters-ch1',
    promptText: {
      en: 'Have you or your family experienced labor organizing? What role did community play?',
      fr: 'Avez-vous ou votre famille vécu l\'organisation syndicale? Quel rôle la communauté a-t-elle joué?',
      es: '¿Usted o su familia han experimentado la organización laboral? ¿Qué papel jugó la comunidad?',
    },
    promptType: 'cultural-connection',
    createdAt: '2026-01-28T10:00:00Z',
    isActive: true,
  },
  {
    id: 'prompt-personal-reflection-s3-1',
    chapterId: 's3-diaspora-belonging-ch1',
    promptText: {
      en: 'What does "home" mean to you when you have roots in multiple places?',
      fr: 'Que signifie « chez-soi » pour vous lorsque vous avez des racines dans plusieurs endroits?',
      es: '¿Qué significa "hogar" para ti cuando tienes raíces en múltiples lugares?',
    },
    promptType: 'personal-reflection',
    createdAt: '2026-02-02T14:00:00Z',
    isActive: true,
  },
];

// ============================================================================
// FEATURE G: OFFLINE CULTURAL PACKS
// ============================================================================

export const SAMPLE_OFFLINE_PACKS: OfflineCulturalPack[] = [
  {
    id: 'pack-season2-full',
    packName: {
      en: 'Season 2: Black Canadian Histories (Complete)',
      fr: 'Saison 2 : Histoires noires canadiennes (complet)',
      es: 'Temporada 2: Historias negras canadienses (completo)',
    },
    description: {
      en: 'All 35 chapters of Season 2, including text, narration audio (EN/FR/ES), and context cards. Perfect for offline study or low-bandwidth access.',
      fr: 'Les 35 chapitres de la saison 2, incluant le texte, l\'audio de narration (EN/FR/ES) et les cartes contextuelles. Parfait pour l\'étude hors ligne ou l\'accès à faible bande passante.',
      es: 'Los 35 capítulos de la Temporada 2, incluido texto, audio de narración (EN/FR/ES) y tarjetas de contexto. Perfecto para estudio sin conexión o acceso de bajo ancho de banda.',
    },
    storyWorldIds: [
      's2-black-canadian-renaissance',
      's2-sleeping-car-porters',
      's2-black-womens-archive',
      's2-montreal-black-music',
      's2-africville-memory',
      's2-black-canadian-futures',
    ],
    includeNarrationAudio: true,
    includeContextCards: true,
    includeFilms: false,
    languages: ['en', 'fr', 'es'],
    estimatedSizeMB: 450, // 35 chapters × ~3 min × 3 languages
    storageLimit: 500,
    institutionEnabledOnly: false, // Public pack
    requiresAuth: false,
    downloadUrl: 'https://[supabase-storage]/packs/season2-complete.zip',
    createdAt: '2026-02-10T09:00:00Z',
    lastUpdated: '2026-02-10T09:00:00Z',
  },
  {
    id: 'pack-diaspora-theme',
    packName: {
      en: 'Diaspora & Belonging Collection',
      fr: 'Collection Diaspora et appartenance',
      es: 'Colección Diáspora y pertenencia',
    },
    description: {
      en: 'Curated stories about migration, language, and home. Includes 18 chapters across 3 story worlds.',
      fr: 'Histoires sélectionnées sur la migration, la langue et le chez-soi. Comprend 18 chapitres sur 3 mondes d\'histoires.',
      es: 'Historias curadas sobre migración, idioma y hogar. Incluye 18 capítulos en 3 mundos de historias.',
    },
    storyWorldIds: [
      's3-diaspora-belonging',
      's3-intergenerational-translation',
      's3-mixed-identity-navigation',
    ],
    includeNarrationAudio: true,
    includeContextCards: true,
    includeFilms: false,
    languages: ['en', 'fr', 'es'],
    estimatedSizeMB: 250,
    storageLimit: 300,
    institutionEnabledOnly: false,
    requiresAuth: false,
    createdAt: '2026-02-12T11:00:00Z',
    lastUpdated: '2026-02-12T11:00:00Z',
  },
];

// ============================================================================
// FEATURE H: NARRATOR PROFILES & TRACKS
// ============================================================================

export const SAMPLE_NARRATOR_PROFILES: NarratorProfile[] = [
  {
    id: 'narrator-en-primary',
    narratorName: 'Jordan Williams',
    narratorBio: {
      en: 'Jordan is a Toronto-based voice actor and storyteller with a background in theater and documentary narration.',
      fr: 'Jordan est un acteur vocal et conteur basé à Toronto avec une formation en théâtre et narration documentaire.',
      es: 'Jordan es un actor de voz y narrador con sede en Toronto con experiencia en teatro y narración documental.',
    },
    voiceDescription: {
      en: 'Warm, reflective, grounded',
      fr: 'Chaleureux, réfléchi, ancré',
      es: 'Cálido, reflexivo, fundamentado',
    },
    language: 'en',
    gender: 'non-binary',
    ageRange: '30-40',
    creditName: 'Jordan Williams',
    portfolioUrl: 'https://example.com/jordan-williams',
  },
  {
    id: 'narrator-fr-primary',
    narratorName: 'Amélie Dubois',
    narratorBio: {
      en: 'Amélie is a Montreal-based narrator specializing in cultural and historical storytelling.',
      fr: 'Amélie est une narratrice basée à Montréal spécialisée dans les récits culturels et historiques.',
      es: 'Amélie es una narradora con sede en Montreal especializada en narración cultural e histórica.',
    },
    voiceDescription: {
      en: 'Clear, contemplative, culturally grounded',
      fr: 'Claire, contemplative, culturellement ancrée',
      es: 'Clara, contemplativa, culturalmente fundamentada',
    },
    language: 'fr',
    gender: 'female',
    ageRange: '35-45',
    creditName: 'Amélie Dubois',
  },
  {
    id: 'narrator-es-primary',
    narratorName: 'Carlos Méndez',
    narratorBio: {
      en: 'Carlos is a voice actor from Mexico City, now based in Toronto, specializing in documentary and cultural narration.',
      fr: 'Carlos est un acteur vocal de Mexico, maintenant basé à Toronto, spécialisé dans la narration documentaire et culturelle.',
      es: 'Carlos es un actor de voz de la Ciudad de México, ahora radicado en Toronto, especializado en narración documental y cultural.',
    },
    voiceDescription: {
      en: 'Steady, warm, accessible',
      fr: 'Stable, chaleureux, accessible',
      es: 'Estable, cálido, accesible',
    },
    language: 'es',
    gender: 'male',
    ageRange: '30-45',
    creditName: 'Carlos Méndez',
  },
];

export const SAMPLE_NARRATION_TRACKS: ChapterNarrationTrack[] = [
  {
    chapterId: 's2-sleeping-car-porters-ch1',
    narratorId: 'narrator-en-primary',
    language: 'en',
    audioUrl: 'https://[supabase]/season2/s2-sleeping-car-porters/s2-porters-ch1_en.mp3',
    duration: 240, // 4 minutes
    format: 'mp3',
    bitrate: '320kbps',
    lufsNormalization: -16,
    isDefault: true,
    createdAt: '2026-01-30T10:00:00Z',
  },
  {
    chapterId: 's2-sleeping-car-porters-ch1',
    narratorId: 'narrator-fr-primary',
    language: 'fr',
    audioUrl: 'https://[supabase]/season2/s2-sleeping-car-porters/s2-porters-ch1_fr.mp3',
    duration: 250, // 4 min 10 sec (FR typically 5-10% longer)
    format: 'mp3',
    bitrate: '320kbps',
    lufsNormalization: -16,
    isDefault: true,
    createdAt: '2026-01-30T10:00:00Z',
  },
];

// ============================================================================
// FEATURE K: SEASONAL EDITORIAL FRAMING
// ============================================================================

export const SAMPLE_SEASONAL_FRAMING: SeasonalEditorialFraming[] = [
  {
    season: 2,
    introText: {
      en: 'Season 2 explores Black Canadian histories often erased from official narratives. These are stories of resistance, refusal, and community-building—from Sleeping Car Porters organizing for dignity to Africville residents fighting displacement. This is not "Black History Month" tokenism. This is everyday resilience, carried across generations.',
      fr: 'La saison 2 explore les histoires noires canadiennes souvent effacées des récits officiels. Ce sont des histoires de résistance, de refus et de construction communautaire—des porteurs de wagons-lits s\'organisant pour la dignité aux résidents d\'Africville luttant contre le déplacement. Ce n\'est pas le symbolisme du « Mois de l\'histoire des Noirs ». C\'est la résilience quotidienne, portée à travers les générations.',
      es: 'La Temporada 2 explora historias negras canadienses a menudo borradas de las narrativas oficiales. Estas son historias de resistencia, rechazo y construcción comunitaria—desde mozos de coche cama organizándose por dignidad hasta residentes de Africville luchando contra el desplazamiento. Esto no es tokenismo del "Mes de la Historia Negra". Esta es resiliencia cotidiana, llevada a través de generaciones.',
    },
    curatedBy: 'CREOVA Collective',
    seasonTheme: {
      en: 'Resistance & Refusal',
      fr: 'Résistance et refus',
      es: 'Resistencia y rechazo',
    },
    historicalContext: {
      en: 'Black Canadians have been organizing, resisting, and building community for over 400 years. These stories center that legacy.',
      fr: 'Les Noirs canadiens s\'organisent, résistent et bâtissent la communauté depuis plus de 400 ans. Ces histoires centrent cet héritage.',
      es: 'Los negros canadienses han estado organizándose, resistiendo y construyendo comunidad durante más de 400 años. Estas historias centran ese legado.',
    },
    displayOnce: true,
    dismissible: true,
    publishedAt: '2026-01-15T00:00:00Z',
    lastUpdated: '2026-01-15T00:00:00Z',
  },
  {
    season: 3,
    introText: {
      en: 'Season 3 centers diaspora, migration, and belonging. What does "home" mean when you carry multiple worlds? How do we translate ourselves across languages, cultures, borders? These stories refuse singular definitions—they honor complexity.',
      fr: 'La saison 3 centre la diaspora, la migration et l\'appartenance. Que signifie « chez-soi » lorsque vous portez plusieurs mondes? Comment nous traduisons-nous à travers les langues, les cultures, les frontières? Ces histoires refusent les définitions singulières—elles honorent la complexité.',
      es: 'La Temporada 3 centra la diáspora, la migración y la pertenencia. ¿Qué significa "hogar" cuando llevas múltiples mundos? ¿Cómo nos traducimos a través de idiomas, culturas, fronteras? Estas historias rechazan definiciones singulares—honran la complejidad.',
    },
    curatedBy: 'CREOVA Collective',
    seasonTheme: {
      en: 'Diaspora & Translation',
      fr: 'Diaspora et traduction',
      es: 'Diáspora y traducción',
    },
    displayOnce: true,
    dismissible: true,
    publishedAt: '2026-02-01T00:00:00Z',
    lastUpdated: '2026-02-01T00:00:00Z',
  },
];

// ============================================================================
// FEATURE J: CONTENT RIGHTS
// ============================================================================

export const SAMPLE_CONTENT_RIGHTS: ContentRights[] = [
  {
    contentId: 's2-sleeping-car-porters',
    contentType: 'story',
    rightsHolder: 'CREOVA Collective',
    rightsHolderContact: 'rights@creova.ca',
    licenseType: 'CMF-grant-compliant',
    licenseStartDate: '2026-01-01',
    licenseEndDate: undefined, // Perpetual
    allowedUsage: {
      platformPlayback: true,
      institutionalDownload: true,
      educationalUse: true,
      commercialUse: false,
      archivalPreservation: true,
    },
    attributionText: {
      en: 'Story by CREOVA Collective. Funded by Canada Media Fund.',
      fr: 'Histoire de CREOVA Collective. Financé par le Fonds des médias du Canada.',
      es: 'Historia de CREOVA Collective. Financiado por Canada Media Fund.',
    },
    attributionRequired: true,
    geographicRestrictions: [], // Worldwide
    cmfFunded: true,
    cmfReportingRequired: true,
    createdAt: '2026-01-15T00:00:00Z',
    lastReviewedAt: '2026-01-15T00:00:00Z',
  },
  {
    contentId: 's3-diaspora-belonging',
    contentType: 'story',
    rightsHolder: 'CREOVA Collective',
    rightsHolderContact: 'rights@creova.ca',
    licenseType: 'CMF-grant-compliant',
    licenseStartDate: '2026-02-01',
    allowedUsage: {
      platformPlayback: true,
      institutionalDownload: true,
      educationalUse: true,
      commercialUse: false,
      archivalPreservation: true,
    },
    attributionText: {
      en: 'Story by CREOVA Collective. Funded by Canada Media Fund.',
      fr: 'Histoire de CREOVA Collective. Financé par le Fonds des médias du Canada.',
      es: 'Historia de CREOVA Collective. Financiado por Canada Media Fund.',
    },
    attributionRequired: true,
    cmfFunded: true,
    cmfReportingRequired: true,
    createdAt: '2026-02-01T00:00:00Z',
    lastReviewedAt: '2026-02-01T00:00:00Z',
  },
];

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  contextCards: SAMPLE_CONTEXT_CARDS,
  collections: SAMPLE_INSTITUTIONAL_COLLECTIONS,
  creatorNotes: SAMPLE_CREATOR_NOTES,
  reflectionPrompts: SAMPLE_REFLECTION_PROMPTS,
  offlinePacks: SAMPLE_OFFLINE_PACKS,
  narratorProfiles: SAMPLE_NARRATOR_PROFILES,
  narrationTracks: SAMPLE_NARRATION_TRACKS,
  seasonalFraming: SAMPLE_SEASONAL_FRAMING,
  contentRights: SAMPLE_CONTENT_RIGHTS,
};

console.log('[SampleData] All enhanced features sample data ready for migration');
