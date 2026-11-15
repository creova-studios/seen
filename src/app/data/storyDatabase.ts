/**
 * STORY DATABASE
 * SEEN by CREOVA
 * 
 * Complete multilingual story worlds with chapters, media, and context cards.
 * All content supports EN/FR/ES with fallback logic.
 */

export type Language = 'en' | 'fr' | 'es';

// ============================================
// MULTILINGUAL TEXT INTERFACE
// ============================================

export interface MultilingualText {
  en: string;
  fr: string;
  es: string;
}

// ============================================
// STORY WORLD STRUCTURE
// ============================================

export interface ContextCard {
  id: string;
  type: 'cultural' | 'historical' | 'institutional';
  title: MultilingualText;
  content: MultilingualText;
}

export interface ChapterMedia {
  narration?: {
    url: string;
    duration: number; // seconds
  };
  ambient?: {
    url: string;
  };
  music?: {
    url: string;
  };
  images?: string[];
  /** Description of the first image for people who cannot see it. Empty with imageDecorative for purely decorative art. */
  imageAlt?: string;
  imageDecorative?: boolean;
  video?: {
    url: string;
    duration: number;
  };
}

export interface ChapterBranchChoice {
  id: string;
  questionText: MultilingualText;
  options: Array<{
    id: string;
    text: MultilingualText;
    nextChapterId?: string;
    tag?: string;
  }>;
  impactsOutcome?: boolean;
}

export interface Chapter {
  id: string;
  order: number;
  title: MultilingualText;
  description: MultilingualText;
  text: MultilingualText;
  media: ChapterMedia;
  estimatedDuration: number; // minutes
  contextCards?: ContextCard[];
  branchChoices?: ChapterBranchChoice[];
}

export interface StoryWorld {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  creator: MultilingualText;
  coverImage: string;
  releaseDate: string;
  languagesAvailable: Language[];
  culturalThemes: string[];
  totalDuration: string; // "45 min"
  chapterCount: number;
  chapters: Chapter[];
  visibility: 'public' | 'institutional' | 'private';
  /** Optional content notes shown before the story begins. */
  contentWarnings?: string[];
  featured?: boolean;
  new?: boolean;
  trending?: boolean;
  institutionalPartner?: string;
}

// ============================================
// IMPORT MISSING CHAPTERS
// ============================================

import {
  blackAtlanticCanadaChapters,
  whatWeCarryChapters,
  smallHistoriesChapters,
  workWorthChapters,
} from './generateMissingChapters';

// userStoriesService only imports *types* from this file (erased at build
// time), so this doesn't create a real runtime circular dependency.
import { getUserStoryWorldById } from './userStoriesService';

// ============================================
// STORY DATABASE
// ============================================

export const STORY_WORLDS: StoryWorld[] = [
  {
    id: 'midnight-resonance',
    title: {
      en: 'Midnight Resonance',
      fr: 'Résonance de Minuit',
      es: 'Resonancia de Medianoche',
    },
    description: {
      en: 'A sonic journey through Montreal\'s underground jazz scene, tracing the lives of three musicians whose paths converge in the city\'s most mysterious club.',
      fr: 'Un voyage sonore à travers la scène jazz underground de Montréal, retraçant la vie de trois musiciens dont les chemins convergent dans le club le plus mystérieux de la ville.',
      es: 'Un viaje sonoro a través de la escena de jazz underground de Montreal, trazando las vidas de tres músicos cuyos caminos convergen en el club más misterioso de la ciudad.',
    },
    creator: {
      en: 'Kira Chen',
      fr: 'Kira Chen',
      es: 'Kira Chen',
    },
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=1200&fit=crop',
    releaseDate: 'Feb 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Music & Sound', 'Urban Culture', 'Community Stories'],
    totalDuration: '45 min',
    chapterCount: 4,
    featured: true,
    new: true,
    trending: true,
    visibility: 'public',
    chapters: [
      {
        id: 'midnight-resonance-ch1',
        order: 1,
        title: {
          en: 'The First Note',
          fr: 'La Première Note',
          es: 'La Primera Nota',
        },
        description: {
          en: 'Maya discovers an unmarked door in the Plateau, leading to a world she never knew existed.',
          fr: 'Maya découvre une porte non marquée dans le Plateau, menant à un monde qu\'elle ne connaissait pas.',
          es: 'Maya descubre una puerta sin marcar en el Plateau, que conduce a un mundo que nunca supo que existía.',
        },
        text: {
          en: 'The snow falls heavy on Rue Saint-Denis. Maya pulls her coat tighter, saxophone case strapped across her back. She\'s walked this street a thousand times, but tonight something feels different. A bass line pulses from somewhere below ground...',
          fr: 'La neige tombe lourdement sur la rue Saint-Denis. Maya resserre son manteau, étui de saxophone sanglé dans le dos. Elle a marché dans cette rue mille fois, mais ce soir quelque chose est différent. Une ligne de basse pulse quelque part sous terre...',
          es: 'La nieve cae pesadamente sobre la Rue Saint-Denis. Maya se ciñe el abrigo, el estuche del saxofón atado a la espalda. Ha caminado por esta calle mil veces, pero esta noche algo se siente diferente. Una línea de bajo pulsa desde algún lugar bajo tierra...',
        },
        media: {
          ambient: {
            url: '/media/ambient/snow-city.mp3',
          },
          music: {
            url: '/media/music/bass-pulse.mp3',
          },
        },
        estimatedDuration: 10,
        contextCards: [
          {
            id: 'plateau-context',
            type: 'cultural',
            title: {
              en: 'Montreal\'s Plateau Neighborhood',
              fr: 'Le Quartier du Plateau à Montréal',
              es: 'El Barrio Plateau de Montreal',
            },
            content: {
              en: 'The Plateau-Mont-Royal has been Montreal\'s cultural heartbeat since the 1960s, home to artists, musicians, and the city\'s underground creative scene.',
              fr: 'Le Plateau-Mont-Royal est le cœur culturel de Montréal depuis les années 1960, refuge des artistes, musiciens et de la scène créative underground de la ville.',
              es: 'El Plateau-Mont-Royal ha sido el corazón cultural de Montreal desde los años 1960, hogar de artistas, músicos y la escena creativa underground de la ciudad.',
            },
          },
        ],
      },
      {
        id: 'midnight-resonance-ch2',
        order: 2,
        title: {
          en: 'Underground Harmonies',
          fr: 'Harmonies Souterraines',
          es: 'Armonías Subterráneas',
        },
        description: {
          en: 'Inside the club, three musicians meet for the first time, each carrying their own story.',
          fr: 'À l\'intérieur du club, trois musiciens se rencontrent pour la première fois, chacun portant sa propre histoire.',
          es: 'Dentro del club, tres músicos se encuentran por primera vez, cada uno con su propia historia.',
        },
        text: {
          en: 'The club is smaller than Maya imagined. Red velvet walls absorb every sound. A drummer sits alone at the kit, eyes closed. A bassist tunes in the corner. And Maya, saxophone in hand, realizes this is the audition she\'s been waiting for her entire life.',
          fr: 'Le club est plus petit que Maya l\'imaginait. Les murs de velours rouge absorbent chaque son. Un batteur est assis seul à la batterie, les yeux fermés. Un bassiste s\'accorde dans le coin. Et Maya, saxophone à la main, réalise que c\'est l\'audition qu\'elle attendait toute sa vie.',
          es: 'El club es más pequeño de lo que Maya imaginó. Las paredes de terciopelo rojo absorben cada sonido. Un baterista se sienta solo en la batería, con los ojos cerrados. Un bajista afina en la esquina. Y Maya, saxofón en mano, se da cuenta de que esta es la audición que ha esperado toda su vida.',
        },
        media: {
          ambient: {
            url: '/media/ambient/jazz-club.mp3',
          },
          music: {
            url: '/media/music/trio-warmup.mp3',
          },
        },
        estimatedDuration: 12,
      },
      {
        id: 'midnight-resonance-ch3',
        order: 3,
        title: {
          en: 'The Session',
          fr: 'La Séance',
          es: 'La Sesión',
        },
        description: {
          en: 'The trio plays together for the first time, creating something neither planned nor expected.',
          fr: 'Le trio joue ensemble pour la première fois, créant quelque chose ni planifié ni attendu.',
          es: 'El trío toca junto por primera vez, creando algo que no fue planeado ni esperado.',
        },
        text: {
          en: 'No words are spoken. The drummer counts off with a whispered "one, two..." and suddenly the room is alive. Maya\'s saxophone weaves between Marcus\'s bass and Theo\'s drums. They\'ve never played together, but somehow, they\'ve known each other forever.',
          fr: 'Aucun mot n\'est prononcé. Le batteur compte à voix basse "un, deux..." et soudain la pièce s\'anime. Le saxophone de Maya se tisse entre la basse de Marcus et la batterie de Theo. Ils n\'ont jamais joué ensemble, mais d\'une certaine manière, ils se connaissent depuis toujours.',
          es: 'No se dicen palabras. El baterista cuenta con un susurro "uno, dos..." y de repente la sala cobra vida. El saxofón de Maya se entrelaza entre el bajo de Marcus y la batería de Theo. Nunca han tocado juntos, pero de alguna manera, se conocen desde siempre.',
        },
        media: {
          music: {
            url: '/media/music/trio-session.mp3',
          },
        },
        estimatedDuration: 15,
        contextCards: [
          {
            id: 'jazz-improvisation',
            type: 'cultural',
            title: {
              en: 'Jazz Improvisation',
              fr: 'Improvisation Jazz',
              es: 'Improvisación de Jazz',
            },
            content: {
              en: 'In jazz, improvisation is conversation. Musicians respond to each other in real-time, creating unrepeatable moments of collective creation.',
              fr: 'Dans le jazz, l\'improvisation est une conversation. Les musiciens se répondent en temps réel, créant des moments irremplaçables de création collective.',
              es: 'En el jazz, la improvisación es conversación. Los músicos se responden en tiempo real, creando momentos irrepetibles de creación colectiva.',
            },
          },
        ],
      },
      {
        id: 'midnight-resonance-ch4',
        order: 4,
        title: {
          en: 'Resonance',
          fr: 'Résonance',
          es: 'Resonancia',
        },
        description: {
          en: 'The final note rings out, and everything changes.',
          fr: 'La dernière note retentit, et tout change.',
          es: 'La nota final resuena, y todo cambia.',
        },
        text: {
          en: 'When the last note fades, the silence is deafening. Maya opens her eyes. Marcus is smiling. Theo is already reaching for his phone to record the next one. The club owner nods from the shadows. "Thursday nights," he says. "You start Thursday nights."',
          fr: 'Quand la dernière note s\'estompe, le silence est assourdissant. Maya ouvre les yeux. Marcus sourit. Theo tend déjà la main vers son téléphone pour enregistrer le prochain morceau. Le propriétaire du club fait un signe de tête depuis les ombres. "Jeudis soirs," dit-il. "Vous commencez jeudis soirs."',
          es: 'Cuando la última nota se desvanece, el silencio es ensordecedor. Maya abre los ojos. Marcus está sonriendo. Theo ya está alcanzando su teléfono para grabar el siguiente. El dueño del club asiente desde las sombras. "Jueves por la noche," dice. "Empiezan los jueves por la noche."',
        },
        media: {
          ambient: {
            url: '/media/ambient/club-silence.mp3',
          },
        },
        estimatedDuration: 8,
      },
    ],
  },
  {
    id: 'voices-of-migration',
    title: {
      en: 'Voices of Migration',
      fr: 'Voix de la Migration',
      es: 'Voces de Migración',
    },
    description: {
      en: 'An oral history project documenting the journeys of five families who built new lives in Canada, told through their own words and archive materials.',
      fr: 'Un projet d\'histoire orale documentant les voyages de cinq familles qui ont construit de nouvelles vies au Canada, raconté à travers leurs propres mots et matériaux d\'archives.',
      es: 'Un proyecto de historia oral que documenta los viajes de cinco familias que construyeron nuevas vidas en Canadá, contado a través de sus propias palabras y materiales de archivo.',
    },
    creator: {
      en: 'Documentary Collective',
      fr: 'Collectif Documentaire',
      es: 'Colectivo Documental',
    },
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=1200&fit=crop',
    releaseDate: 'Jan 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Migration & Diaspora', 'Community Stories', 'Documentary & Film'],
    totalDuration: '60 min',
    chapterCount: 5,
    featured: true,
    trending: false,
    new: false,
    visibility: 'institutional',
    chapters: [
      {
        id: 'voices-ch1',
        order: 1,
        title: {
          en: 'The Journey Begins',
          fr: 'Le Voyage Commence',
          es: 'El Viaje Comienza',
        },
        description: {
          en: 'Five families share their reasons for leaving home and the hopes that carried them forward.',
          fr: 'Cinq familles partagent leurs raisons de quitter leur foyer et les espoirs qui les ont portées.',
          es: 'Cinco familias comparten sus razones para dejar el hogar y las esperanzas que los impulsaron.',
        },
        text: {
          en: '"We left with two suitcases and a photograph," Maria remembers. "Everything else we would build again."',
          fr: '"Nous sommes partis avec deux valises et une photographie," se souvient Maria. "Tout le reste, nous le reconstruirions."',
          es: '"Partimos con dos maletas y una fotografía," recuerda María. "Todo lo demás lo reconstruiríamos."',
        },
        media: {
          narration: {
            url: '/media/narration/maria-interview.mp3',
            duration: 720,
          },
          images: ['https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800'],
        },
        estimatedDuration: 12,
        contextCards: [
          {
            id: 'immigration-waves',
            type: 'historical',
            title: {
              en: 'Canadian Immigration History',
              fr: 'Histoire de l\'Immigration Canadienne',
              es: 'Historia de la Inmigración Canadiense',
            },
            content: {
              en: 'Canada has welcomed over 17 million immigrants since 1867, each wave contributing to the country\'s cultural mosaic.',
              fr: 'Le Canada a accueilli plus de 17 millions d\'immigrants depuis 1867, chaque vague contribuant à la mosaïque culturelle du pays.',
              es: 'Canadá ha dado la bienvenida a más de 17 millones de inmigrantes desde 1867, cada ola contribuyendo al mosaico cultural del país.',
            },
          },
        ],
      },
      {
        id: 'voices-ch2',
        order: 2,
        title: {
          en: 'Arrival',
          fr: 'Arrivée',
          es: 'Llegada',
        },
        description: {
          en: 'First impressions of a new country, a new language, and a new life.',
          fr: 'Premières impressions d\'un nouveau pays, d\'une nouvelle langue et d\'une nouvelle vie.',
          es: 'Primeras impresiones de un nuevo país, un nuevo idioma y una nueva vida.',
        },
        text: {
          en: 'The cold was the first shock. Then the language. Then the realization that starting over means exactly that—starting from zero.',
          fr: 'Le froid a été le premier choc. Puis la langue. Puis la réalisation que recommencer signifie exactement cela—repartir de zéro.',
          es: 'El frío fue el primer shock. Luego el idioma. Luego la realización de que empezar de nuevo significa exactamente eso—comenzar desde cero.',
        },
        media: {
          narration: {
            url: '/media/narration/arrival-stories.mp3',
            duration: 840,
          },
        },
        estimatedDuration: 14,
      },
      {
        id: 'voices-ch3',
        order: 3,
        title: {
          en: 'Finding Community',
          fr: 'Trouver une Communauté',
          es: 'Encontrar Comunidad',
        },
        description: {
          en: 'How strangers became neighbors, and neighbors became family.',
          fr: 'Comment des étrangers sont devenus des voisins, et des voisins sont devenus une famille.',
          es: 'Cómo los extraños se convirtieron en vecinos, y los vecinos en familia.',
        },
        text: {
          en: 'In the church basement, we found others who spoke our language. We cooked together, celebrated together, cried together. We were building something new.',
          fr: 'Dans le sous-sol de l\'église, nous avons trouvé d\'autres qui parlaient notre langue. Nous avons cuisiné ensemble, célébré ensemble, pleuré ensemble. Nous construisions quelque chose de nouveau.',
          es: 'En el sótano de la iglesia, encontramos a otros que hablaban nuestro idioma. Cocinamos juntos, celebramos juntos, lloramos juntos. Estábamos construyendo algo nuevo.',
        },
        media: {
          narration: {
            url: '/media/narration/community-building.mp3',
            duration: 660,
          },
        },
        estimatedDuration: 11,
      },
      {
        id: 'voices-ch4',
        order: 4,
        title: {
          en: 'Between Two Worlds',
          fr: 'Entre Deux Mondes',
          es: 'Entre Dos Mundos',
        },
        description: {
          en: 'The children grow up straddling cultures, creating something entirely their own.',
          fr: 'Les enfants grandissent en chevauchant les cultures, créant quelque chose d\'entièrement leur.',
          es: 'Los niños crecen a caballo entre culturas, creando algo completamente propio.',
        },
        text: {
          en: 'My daughter speaks three languages. She celebrates two new years. She is Canadian, but she carries our stories with her. That\'s the gift we gave her.',
          fr: 'Ma fille parle trois langues. Elle célèbre deux nouvelles années. Elle est Canadienne, mais elle porte nos histoires avec elle. C\'est le cadeau que nous lui avons donné.',
          es: 'Mi hija habla tres idiomas. Celebra dos años nuevos. Es canadiense, pero lleva nuestras historias con ella. Ese es el regalo que le dimos.',
        },
        media: {
          narration: {
            url: '/media/narration/next-generation.mp3',
            duration: 780,
          },
        },
        estimatedDuration: 13,
      },
      {
        id: 'voices-ch5',
        order: 5,
        title: {
          en: 'Home',
          fr: 'Chez Soi',
          es: 'Hogar',
        },
        description: {
          en: 'What does home mean when you carry two countries in your heart?',
          fr: 'Que signifie chez soi quand on porte deux pays dans son cœur?',
          es: '¿Qué significa el hogar cuando llevas dos países en tu corazón?',
        },
        text: {
          en: 'Someone asked me recently, "When did Canada become home?" I couldn\'t answer. Maybe it was the day I stopped translating in my head. Maybe it was the day my granddaughter was born here. Or maybe home was never a place—it was the people we became.',
          fr: 'Quelqu\'un m\'a demandé récemment, "Quand le Canada est-il devenu chez vous?" Je n\'ai pas pu répondre. Peut-être le jour où j\'ai arrêté de traduire dans ma tête. Peut-être le jour où ma petite-fille est née ici. Ou peut-être que chez soi n\'a jamais été un lieu—c\'était les personnes que nous sommes devenus.',
          es: 'Alguien me preguntó recientemente, "¿Cuándo se convirtió Canadá en hogar?" No pude responder. Tal vez fue el día que dejé de traducir en mi cabeza. Tal vez fue el día que nació mi nieta aquí. O tal vez el hogar nunca fue un lugar—fueron las personas en las que nos convertimos.',
        },
        media: {
          narration: {
            url: '/media/narration/home-reflections.mp3',
            duration: 600,
          },
        },
        estimatedDuration: 10,
        contextCards: [
          {
            id: 'dual-identity',
            type: 'cultural',
            title: {
              en: 'Dual Identity in Diaspora',
              fr: 'Double Identité dans la Diaspora',
              es: 'Doble Identidad en la Diáspora',
            },
            content: {
              en: 'Many immigrants and their children navigate multiple cultural identities, creating rich, hybrid experiences that enrich both their heritage culture and their new home.',
              fr: 'De nombreux immigrants et leurs enfants naviguent entre plusieurs identités culturelles, créant des expériences hybrides riches qui enrichissent à la fois leur culture patrimoniale et leur nouveau foyer.',
              es: 'Muchos inmigrantes y sus hijos navegan múltiples identidades culturales, creando experiencias híbridas ricas que enriquecen tanto su cultura patrimonial como su nuevo hogar.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'indigenous-languages',
    title: {
      en: 'Words That Remember',
      fr: 'Mots Qui Se Souviennent',
      es: 'Palabras Que Recuerdan',
    },
    description: {
      en: 'A journey into Indigenous language revitalization, following three communities working to bring their languages back from the edge of extinction.',
      fr: 'Un voyage dans la revitalisation des langues autochtones, suivant trois communautés travaillant à ramener leurs langues du bord de l\'extinction.',
      es: 'Un viaje hacia la revitalización de lenguas indígenas, siguiendo a tres comunidades que trabajan para traer sus idiomas de vuelta del borde de la extinción.',
    },
    creator: {
      en: 'Indigenous Media Collective',
      fr: 'Collectif Médiatique Autochtone',
      es: 'Colectivo de Medios Indígenas',
    },
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
    releaseDate: 'Dec 2025',
    languagesAvailable: ['en', 'fr'],
    culturalThemes: ['Indigenous Knowledge', 'Language & Identity', 'Heritage & Memory'],
    totalDuration: '52 min',
    chapterCount: 4,
    featured: false,
    trending: true,
    new: false,
    visibility: 'public',
    chapters: [
      {
        id: 'indigenous-ch1',
        order: 1,
        title: {
          en: 'Silence and Sound',
          fr: 'Silence et Son',
          es: 'Silencio y Sonido',
        },
        description: {
          en: 'Understanding what was lost and why language matters.',
          fr: 'Comprendre ce qui a été perdu et pourquoi la langue compte.',
          es: 'Entendiendo lo que se perdió y por qué importa el idioma.',
        },
        text: {
          en: 'For 150 years, our language was forbidden. Children were punished for speaking the words their grandmothers taught them. Now, three generations later, we have five fluent speakers left. But we also have determination.',
          fr: 'Pendant 150 ans, notre langue a été interdite. Les enfants étaient punis pour parler les mots que leurs grand-mères leur avaient appris. Maintenant, trois générations plus tard, il nous reste cinq locuteurs courants. Mais nous avons aussi de la détermination.',
          es: 'Durante 150 años, nuestro idioma fue prohibido. Los niños eran castigados por hablar las palabras que sus abuelas les enseñaron. Ahora, tres generaciones después, nos quedan cinco hablantes fluidos. Pero también tenemos determinación.',
        },
        media: {
          narration: {
            url: '/media/narration/language-loss.mp3',
            duration: 900,
          },
        },
        estimatedDuration: 15,
        contextCards: [
          {
            id: 'residential-schools',
            type: 'historical',
            title: {
              en: 'Residential Schools and Language Suppression',
              fr: 'Pensionnats et Suppression Linguistique',
              es: 'Escuelas Residenciales y Supresión del Idioma',
            },
            content: {
              en: 'Canada\'s residential school system, operating from the 1870s to 1996, forcibly separated Indigenous children from their families and prohibited the use of Indigenous languages, causing severe cultural and linguistic disruption.',
              fr: 'Le système des pensionnats du Canada, fonctionnant des années 1870 à 1996, a séparé de force les enfants autochtones de leurs familles et interdit l\'utilisation des langues autochtones, causant une grave perturbation culturelle et linguistique.',
              es: 'El sistema de escuelas residenciales de Canadá, operando desde la década de 1870 hasta 1996, separó por la fuerza a los niños indígenas de sus familias y prohibió el uso de lenguas indígenas, causando una grave disrupción cultural y lingüística.',
            },
          },
        ],
      },
      {
        id: 'indigenous-ch2',
        order: 2,
        title: {
          en: 'The Elders Speak',
          fr: 'Les Aînés Parlent',
          es: 'Los Ancianos Hablan',
        },
        description: {
          en: 'Recording and learning from the last fluent speakers.',
          fr: 'Enregistrement et apprentissage auprès des derniers locuteurs courants.',
          es: 'Grabando y aprendiendo de los últimos hablantes fluidos.',
        },
        text: {
          en: 'Elder Mary sits with the recording equipment, speaking into the microphone with patience. Every word is a seed being planted. The young people listen, repeat, stumble, try again. She smiles. "You\'re doing it," she says in English. Then, in our language: "You are remembering."',
          fr: 'L\'aînée Mary est assise avec l\'équipement d\'enregistrement, parlant dans le microphone avec patience. Chaque mot est une graine plantée. Les jeunes écoutent, répètent, trébuchent, réessaient. Elle sourit. "Vous le faites," dit-elle en anglais. Puis, dans notre langue: "Vous vous souvenez."',
          es: 'La anciana Mary se sienta con el equipo de grabación, hablando al micrófono con paciencia. Cada palabra es una semilla plantada. Los jóvenes escuchan, repiten, tropiezan, intentan de nuevo. Ella sonríe. "Lo están haciendo," dice en inglés. Luego, en nuestro idioma: "Están recordando."',
        },
        media: {
          narration: {
            url: '/media/narration/elder-teachings.mp3',
            duration: 960,
          },
        },
        estimatedDuration: 16,
      },
      {
        id: 'indigenous-ch3',
        order: 3,
        title: {
          en: 'Classroom Revolution',
          fr: 'Révolution en Classe',
          es: 'Revolución en el Aula',
        },
        description: {
          en: 'Building language programs from scratch in community schools.',
          fr: 'Construire des programmes linguistiques à partir de zéro dans les écoles communautaires.',
          es: 'Construyendo programas de idiomas desde cero en escuelas comunitarias.',
        },
        text: {
          en: 'The children sing their ABCs in a language their great-grandparents spoke. The teacher, barely thirty, learned it as an adult. "I\'m not fluent," she admits. "But I\'m trying. And trying is how languages survive."',
          fr: 'Les enfants chantent leur alphabet dans une langue que leurs arrière-grands-parents parlaient. L\'enseignante, à peine trente ans, l\'a apprise à l\'âge adulte. "Je ne suis pas courante," admet-elle. "Mais j\'essaie. Et essayer, c\'est ainsi que les langues survivent."',
          es: 'Los niños cantan su abecedario en un idioma que hablaban sus bisabuelos. La maestra, apenas de treinta años, lo aprendió de adulta. "No soy fluida," admite. "Pero lo intento. E intentarlo es como sobreviven los idiomas."',
        },
        media: {
          narration: {
            url: '/media/narration/classroom-stories.mp3',
            duration: 780,
          },
        },
        estimatedDuration: 13,
      },
      {
        id: 'indigenous-ch4',
        order: 4,
        title: {
          en: 'Future Voices',
          fr: 'Voix du Futur',
          es: 'Voces del Futuro',
        },
        description: {
          en: 'Young people taking their language into the digital age.',
          fr: 'Des jeunes emmenant leur langue à l\'ère numérique.',
          es: 'Jóvenes llevando su idioma a la era digital.',
        },
        text: {
          en: 'They create TikToks in their ancestral language. They translate memes. They code apps that teach vocabulary through games. "Our language isn\'t dead," says 16-year-old Sophie. "It\'s just been sleeping. And we\'re waking it up."',
          fr: 'Ils créent des TikToks dans leur langue ancestrale. Ils traduisent des mèmes. Ils codent des applications qui enseignent le vocabulaire à travers des jeux. "Notre langue n\'est pas morte," dit Sophie, 16 ans. "Elle dormait juste. Et nous la réveillons."',
          es: 'Crean TikToks en su idioma ancestral. Traducen memes. Codifican aplicaciones que enseñan vocabulario a través de juegos. "Nuestro idioma no está muerto," dice Sophie de 16 años. "Solo estaba dormido. Y lo estamos despertando."',
        },
        media: {
          narration: {
            url: '/media/narration/digital-revitalization.mp3',
            duration: 480,
          },
        },
        estimatedDuration: 8,
      },
    ],
  },
  {
    id: 'seen-unseen',
    title: {
      en: 'Seen / Unseen',
      fr: 'Vu / Invisible',
      es: 'Visto / Invisible',
    },
    description: {
      en: 'Four meditations on visibility and erasure in Canadian public space, exploring who is seen, who remains invisible, and why it matters.',
      fr: 'Quatre méditations sur la visibilité et l\'effacement dans l\'espace public canadien, explorant qui est vu, qui reste invisible, et pourquoi cela compte.',
      es: 'Cuatro meditaciones sobre visibilidad y borrado en el espacio público canadiense, explorando quién es visto, quién permanece invisible, y por qué importa.',
    },
    creator: {
      en: 'SEEN Collective',
      fr: 'Collectif SEEN',
      es: 'Colectivo SEEN',
    },
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=1200&fit=crop',
    releaseDate: 'Feb 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Visibility & Representation', 'Urban Culture', 'Social Justice'],
    totalDuration: '15 min',
    chapterCount: 4,
    featured: true,
    new: true,
    trending: false,
    visibility: 'public',
    chapters: [
      {
        id: 'seen-unseen-ch1',
        order: 1,
        title: {
          en: 'The Commute',
          fr: 'Le Trajet',
          es: 'El Viaje',
        },
        description: {
          en: 'Morning rush hour reveals patterns of who takes up space and who disappears.',
          fr: 'L\'heure de pointe matinale révèle des schémas de qui occupe l\'espace et qui disparaît.',
          es: 'La hora pico matutina revela patrones de quién ocupa espacio y quién desaparece.',
        },
        text: {
          en: 'The subway platform at 7:43 AM. Bodies pressed together but not touching. Eyes deliberately elsewhere. A woman in a hijab stands near the yellow line. People leave space around her. Not hostility exactly. Just distance. She is visible and invisible simultaneously. Seen as a symbol. Unseen as a person. She holds a coffee cup with a university logo. She checks her phone like everyone else. But the space around her stays empty. By 7:47 the train arrives. People board. The empty space travels with her.',
          fr: 'Le quai de métro à 7h43. Des corps pressés ensemble mais sans se toucher. Les yeux délibérément ailleurs. Une femme en hijab se tient près de la ligne jaune. Les gens laissent de l\'espace autour d\'elle. Pas exactement de l\'hostilité. Juste de la distance. Elle est visible et invisible simultanément. Vue comme un symbole. Invisible en tant que personne. Elle tient une tasse de café avec un logo universitaire. Elle vérifie son téléphone comme tout le monde. Mais l\'espace autour d\'elle reste vide. À 7h47, le train arrive. Les gens montent. L\'espace vide voyage avec elle.',
          es: 'El andén del metro a las 7:43 AM. Cuerpos apretados juntos pero sin tocarse. Ojos deliberadamente en otra parte. Una mujer con hiyab está cerca de la línea amarilla. La gente deja espacio a su alrededor. No exactamente hostilidad. Solo distancia. Es visible e invisible simultáneamente. Vista como símbolo. Invisible como persona. Sostiene una taza de café con un logo universitario. Revisa su teléfono como todos los demás. Pero el espacio alrededor de ella permanece vacío. A las 7:47 llega el tren. La gente sube. El espacio vacío viaja con ella.',
        },
        media: {
          ambient: {
            url: '/media/ambient/subway-platform.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'seen-unseen-ch2',
        order: 2,
        title: {
          en: 'Street Corner',
          fr: 'Coin de Rue',
          es: 'Esquina',
        },
        description: {
          en: 'A homeless man sits in the same spot every day. Most people walk past without seeing.',
          fr: 'Un sans-abri est assis au même endroit chaque jour. La plupart des gens passent sans voir.',
          es: 'Un hombre sin hogar se sienta en el mismo lugar cada día. La mayoría de la gente pasa sin ver.',
        },
        text: {
          en: 'Corner of Yonge and Dundas. He sits against the brick wall with a cardboard sign and a Tim Hortons cup. His name is Michael but nobody asks. Thousands of people pass every day. Some drop change without making eye contact. Some step around him like he is furniture. Some see him and look away deliberately. A few stop. Fewer talk. Almost nobody asks his name. He has been here three years. He knows the patterns. Morning commuters never stop. Lunch hour brings guilt donations. Evening brings fatigue and avoidance. Late night brings fear. He is most visible at the times people least want to see him. The irony is not lost on Michael.',
          fr: 'Coin de Yonge et Dundas. Il est assis contre le mur de briques avec une pancarte en carton et un gobelet Tim Hortons. Il s\'appelle Michael mais personne ne demande. Des milliers de personnes passent chaque jour. Certains laissent tomber de la monnaie sans faire de contact visuel. Certains le contournent comme s\'il était un meuble. Certains le voient et détournent délibérément le regard. Quelques-uns s\'arrêtent. Moins parlent. Presque personne ne demande son nom. Il est ici depuis trois ans. Il connaît les schémas. Les navetteurs du matin ne s\'arrêtent jamais. L\'heure du déjeuner apporte des dons de culpabilité. Le soir apporte fatigue et évitement. Tard dans la nuit apporte la peur. Il est le plus visible aux moments où les gens veulent le moins le voir. L\'ironie n\'échappe pas à Michael.',
          es: 'Esquina de Yonge y Dundas. Está sentado contra la pared de ladrillos con un cartel de cartón y una taza de Tim Hortons. Se llama Michael pero nadie pregunta. Miles de personas pasan cada día. Algunos dejan cambio sin hacer contacto visual. Algunos lo rodean como si fuera un mueble. Algunos lo ven y miran hacia otro lado deliberadamente. Pocos se detienen. Menos hablan. Casi nadie pregunta su nombre. Ha estado aquí tres años. Conoce los patrones. Los viajeros matutinos nunca se detienen. La hora del almuerzo trae donaciones de culpa. La noche trae fatiga y evitación. La noche tardía trae miedo. Es más visible en los momentos en que la gente menos quiere verlo. La ironía no se le escapa a Michael.',
        },
        media: {
          ambient: {
            url: '/media/ambient/busy-intersection.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'seen-unseen-ch3',
        order: 3,
        title: {
          en: 'The Photograph',
          fr: 'La Photographie',
          es: 'La Fotografía',
        },
        description: {
          en: 'A family photo from 1985 shows who was included in Canadian history and who was cropped out.',
          fr: 'Une photo de famille de 1985 montre qui était inclus dans l\'histoire canadienne et qui a été recadré.',
          es: 'Una foto familiar de 1985 muestra quién fue incluido en la historia canadiense y quién fue recortado.',
        },
        text: {
          en: 'The community center opened in 1985. There is a photograph on the wall. Mayor cutting ribbon. Local officials smiling. Community leaders applauding. All white faces. But Mei remembers that day differently. Her father was there. He helped build the center. He laid the foundation. Poured concrete. Installed the wiring. But when the photographer arrived, someone asked the workers to step aside. \"Just for the official photo,\" they said. Her father stepped aside. So did the other Chinese workers. The Jamaican carpenter. The Portuguese mason. They built it. But they are not in the picture. Forty years later, the photograph still hangs. The builders are still missing. Their children remember.',
          fr: 'Le centre communautaire a ouvert en 1985. Il y a une photographie au mur. Le maire coupe le ruban. Les fonctionnaires locaux sourient. Les leaders communautaires applaudissent. Tous des visages blancs. Mais Mei se souvient de ce jour différemment. Son père était là. Il a aidé à construire le centre. Il a posé les fondations. Coulé le béton. Installé le câblage. Mais quand le photographe est arrivé, quelqu\'un a demandé aux travailleurs de s\'écarter. \"Juste pour la photo officielle,\" ont-ils dit. Son père s\'est écarté. Les autres travailleurs chinois aussi. Le menuisier jamaïcain. Le maçon portugais. Ils l\'ont construit. Mais ils ne sont pas sur la photo. Quarante ans plus tard, la photographie est toujours accrochée. Les constructeurs manquent toujours. Leurs enfants se souviennent.',
          es: 'El centro comunitario abrió en 1985. Hay una fotografía en la pared. El alcalde cortando la cinta. Funcionarios locales sonriendo. Líderes comunitarios aplaudiendo. Todas caras blancas. Pero Mei recuerda ese día de manera diferente. Su padre estaba allí. Ayudó a construir el centro. Puso los cimientos. Vertió concreto. Instaló el cableado. Pero cuando llegó el fotógrafo, alguien pidió a los trabajadores que se apartaran. \"Solo para la foto oficial,\" dijeron. Su padre se apartó. También los otros trabajadores chinos. El carpintero jamaicano. El albañil portugués. Lo construyeron. Pero no están en la foto. Cuarenta años después, la fotografía todavía cuelga. Los constructores todavía faltan. Sus hijos recuerdan.',
        },
        media: {
          ambient: {
            url: '/media/ambient/community-center.mp3',
          },
        },
        estimatedDuration: 4,
        contextCards: [
          {
            id: 'historical-exclusion',
            type: 'historical',
            title: {
              en: 'Historical Exclusion in Documentation',
              fr: 'Exclusion Historique dans la Documentation',
              es: 'Exclusión Histórica en la Documentación',
            },
            content: {
              en: 'Throughout Canadian history, official photographs and documents often excluded racialized workers and community members, creating an incomplete historical record that erases contributions of non-white Canadians.',
              fr: 'Tout au long de l\'histoire canadienne, les photographies et documents officiels excluaient souvent les travailleurs et membres de la communauté racialisés, créant un dossier historique incomplet qui efface les contributions des Canadiens non blancs.',
              es: 'A lo largo de la historia canadiense, las fotografías y documentos oficiales a menudo excluían a trabajadores y miembros de la comunidad racializados, creando un registro histórico incompleto que borra las contribuciones de canadienses no blancos.',
            },
          },
        ],
      },
      {
        id: 'seen-unseen-ch4',
        order: 4,
        title: {
          en: 'Who Counts',
          fr: 'Qui Compte',
          es: 'Quién Cuenta',
        },
        description: {
          en: 'A meditation on visibility, representation, and the power of being seen.',
          fr: 'Une méditation sur la visibilité, la représentation, et le pouvoir d\'être vu.',
          es: 'Una meditación sobre visibilidad, representación, y el poder de ser visto.',
        },
        text: {
          en: 'Being seen is not the same as being counted. Being counted is not the same as being heard. Being heard is not the same as being understood. The hijabi woman on the subway. The homeless man on the corner. The workers cropped from history. They are all seen. But are they counted? In census data maybe. In policy documents possibly. But in the daily calculus of whose experience matters, whose voice shapes the conversation, whose story gets told—do they count? Visibility without power is surveillance. Representation without agency is tokenism. The work is not just to be seen. The work is to matter. To count. To shape the narrative. Not to appear in someone else\'s story, but to tell your own.',
          fr: 'Être vu n\'est pas la même chose qu\'être compté. Être compté n\'est pas la même chose qu\'être entendu. Être entendu n\'est pas la même chose qu\'être compris. La femme en hijab dans le métro. L\'homme sans-abri au coin. Les travailleurs recadrés de l\'histoire. Ils sont tous vus. Mais sont-ils comptés? Dans les données de recensement peut-être. Dans les documents politiques possiblement. Mais dans le calcul quotidien de quelle expérience compte, quelle voix façonne la conversation, quelle histoire est racontée—comptent-ils? La visibilité sans pouvoir est surveillance. La représentation sans agence est du tokenisme. Le travail n\'est pas seulement d\'être vu. Le travail est de compter. D\'avoir de l\'importance. De façonner le récit. Pas d\'apparaître dans l\'histoire de quelqu\'un d\'autre, mais de raconter la sienne.',
          es: 'Ser visto no es lo mismo que ser contado. Ser contado no es lo mismo que ser escuchado. Ser escuchado no es lo mismo que ser comprendido. La mujer con hiyab en el metro. El hombre sin hogar en la esquina. Los trabajadores recortados de la historia. Todos son vistos. ¿Pero son contados? En datos censales tal vez. En documentos de política posiblemente. Pero en el cálculo diario de qué experiencia importa, qué voz da forma a la conversación, qué historia se cuenta—¿cuentan? Visibilidad sin poder es vigilancia. Representación sin agencia es tokenismo. El trabajo no es solo ser visto. El trabajo es importar. Contar. Dar forma a la narrativa. No aparecer en la historia de alguien más, sino contar la propia.',
        },
        media: {
          ambient: {
            url: '/media/ambient/urban-reflection.mp3',
          },
        },
        estimatedDuration: 3,
      },
    ],
  },
  {
    id: 'letters-never-sent',
    title: {
      en: 'Letters Never Sent',
      fr: 'Lettres Jamais Envoyées',
      es: 'Cartas Nunca Enviadas',
    },
    description: {
      en: 'Five letters written but never delivered, exploring the silence between migrant parents and the children they left behind.',
      fr: 'Cinq lettres écrites mais jamais livrées, explorant le silence entre parents migrants et les enfants qu\'ils ont laissés derrière.',
      es: 'Cinco cartas escritas pero nunca entregadas, explorando el silencio entre padres migrantes y los hijos que dejaron atrás.',
    },
    creator: {
      en: 'Anonymous Contributors',
      fr: 'Contributeurs Anonymes',
      es: 'Contribuyentes Anónimos',
    },
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=1200&fit=crop',
    releaseDate: 'Jan 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Family & Separation', 'Migration & Diaspora', 'Heritage & Memory'],
    totalDuration: '20 min',
    chapterCount: 5,
    featured: true,
    new: false,
    trending: false,
    visibility: 'public',
    chapters: [
      {
        id: 'letters-ch1',
        order: 1,
        title: {
          en: 'Dear Mom',
          fr: 'Chère Maman',
          es: 'Querida Mamá',
        },
        description: {
          en: 'A child writes to the mother who left for Canada when she was three.',
          fr: 'Un enfant écrit à la mère qui est partie au Canada quand elle avait trois ans.',
          es: 'Un niño escribe a la madre que se fue a Canadá cuando tenía tres años.',
        },
        text: {
          en: 'Dear Mom, I know you can\'t read this. And I\'ll probably never send it. But I need to say it anyway. I\'m angry. Not at you. Not exactly. But at the choice you had to make. You left me with grandmother. With aunties. With people who loved me but weren\'t you. You went to Canada. To work. To send money home. To give me a better life. And you did. I have everything you didn\'t. Education. Opportunity. Security. But I don\'t have you. I don\'t remember your voice. Just the crackling phone calls. Once a month. Five minutes. Expensive. \"I love you. Be good. Study hard.\" And then silence. For weeks. I know you sacrificed. I know you worked impossible hours. I know you cried yourself to sleep missing me. But I was a child. And I didn\'t understand. I just knew you left. And now. I\'m older. And I understand. But the hurt is still there. This letter will stay in my drawer. But maybe writing it is enough.',
          fr: 'Chère Maman, Je sais que tu ne peux pas lire ceci. Et je ne l\'enverrai probablement jamais. Mais j\'ai besoin de le dire quand même. Je suis en colère. Pas contre toi. Pas exactement. Mais contre le choix que tu as dû faire. Tu m\'as laissé avec grand-mère. Avec les tantes. Avec des gens qui m\'aimaient mais n\'étaient pas toi. Tu es partie au Canada. Pour travailler. Pour envoyer de l\'argent à la maison. Pour me donner une meilleure vie. Et tu l\'as fait. J\'ai tout ce que tu n\'avais pas. Éducation. Opportunité. Sécurité. Mais je ne t\'ai pas. Je ne me souviens pas de ta voix. Juste les appels téléphoniques qui crépitent. Une fois par mois. Cinq minutes. Cher. \"Je t\'aime. Sois sage. Étudie bien.\" Et puis le silence. Pendant des semaines. Je sais que tu as sacrifié. Je sais que tu as travaillé des heures impossibles. Je sais que tu as pleuré en t\'endormant en pensant à moi. Mais j\'étais un enfant. Et je ne comprenais pas. Je savais juste que tu étais partie. Et maintenant. Je suis plus âgé. Et je comprends. Mais la douleur est toujours là. Cette lettre restera dans mon tiroir. Mais peut-être que l\'écrire suffit.',
          es: 'Querida Mamá, Sé que no puedes leer esto. Y probablemente nunca lo enviaré. Pero necesito decirlo de todos modos. Estoy enojado. No contigo. No exactamente. Pero con la elección que tuviste que hacer. Me dejaste con la abuela. Con las tías. Con personas que me amaban pero no eran tú. Fuiste a Canadá. A trabajar. A enviar dinero a casa. A darme una mejor vida. Y lo hiciste. Tengo todo lo que tú no tenías. Educación. Oportunidad. Seguridad. Pero no te tengo a ti. No recuerdo tu voz. Solo las llamadas telefónicas con estática. Una vez al mes. Cinco minutos. Caro. \"Te amo. Pórtate bien. Estudia duro.\" Y luego silencio. Por semanas. Sé que sacrificaste. Sé que trabajaste horas imposibles. Sé que lloraste hasta dormirte extrañándome. Pero yo era un niño. Y no entendía. Solo sabía que te fuiste. Y ahora. Soy mayor. Y entiendo. Pero el dolor todavía está ahí. Esta carta se quedará en mi cajón. Pero tal vez escribirla es suficiente.',
        },
        media: {
          ambient: {
            url: '/media/ambient/quiet-room.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'letters-ch2',
        order: 2,
        title: {
          en: 'To My Younger Self',
          fr: 'À Mon Moi Plus Jeune',
          es: 'A Mi Yo Más Joven',
        },
        description: {
          en: 'Learning to live between two languages and two worlds.',
          fr: 'Apprendre à vivre entre deux langues et deux mondes.',
          es: 'Aprender a vivir entre dos idiomas y dos mundos.',
        },
        text: {
          en: 'To my younger self, You\'re going to be okay. I know you don\'t believe that right now. I know you feel out of place. Wrong language. Wrong accent. Wrong everything. You speak your parents\' language at home. English everywhere else. And neither one feels like yours. Your name gets mispronounced. Every day. On attendance sheets. At coffee shops. On official documents. You stopped correcting people. It\'s easier to answer to the wrong name than to explain. Again. But listen. One day. You\'ll meet people who say your name correctly without being told. Because it\'s their name too. You\'ll find community. Not in the place you were born. Not in the place you live. But in the in-between. With other people who carry two languages. Two cultures. Two homes. Two worlds. People who understand what it\'s like to translate everything. Even your own thoughts. You\'re not broken. You\'re not incomplete. You\'re bilingual. Bicultural. In-between. And that\'s a gift. It will take you years to see it that way. But you will. I promise.',
          fr: 'À mon moi plus jeune, Tu vas bien aller. Je sais que tu ne crois pas ça maintenant. Je sais que tu te sens déplacé. Mauvaise langue. Mauvais accent. Tout est mauvais. Tu parles la langue de tes parents à la maison. L\'anglais partout ailleurs. Et aucune ne semble être la tienne. Ton nom est mal prononcé. Chaque jour. Sur les feuilles de présence. Dans les cafés. Sur les documents officiels. Tu as arrêté de corriger les gens. C\'est plus facile de répondre au mauvais nom que d\'expliquer. Encore. Mais écoute. Un jour. Tu rencontreras des gens qui disent ton nom correctement sans qu\'on leur dise. Parce que c\'est leur nom aussi. Tu trouveras une communauté. Pas dans l\'endroit où tu es né. Pas dans l\'endroit où tu vis. Mais dans l\'entre-deux. Avec d\'autres personnes qui portent deux langues. Deux cultures. Deux maisons. Deux mondes. Des gens qui comprennent ce que c\'est de tout traduire. Même tes propres pensées. Tu n\'es pas brisé. Tu n\'es pas incomplet. Tu es bilingue. Biculturel. Entre-deux. Et c\'est un cadeau. Ça te prendra des années pour le voir ainsi. Mais tu le feras. Je te le promets.',
          es: 'A mi yo más joven, Vas a estar bien. Sé que no crees eso ahora. Sé que te sientes fuera de lugar. Idioma equivocado. Acento equivocado. Todo equivocado. Hablas el idioma de tus padres en casa. Inglés en todos lados. Y ninguno se siente como tuyo. Tu nombre es pronunciado mal. Todos los días. En las listas de asistencia. En las cafeterías. En documentos oficiales. Dejaste de corregir a la gente. Es más fácil responder al nombre equivocado que explicar. Otra vez. Pero escucha. Un día. Conocerás gente que dice tu nombre correctamente sin que se les diga. Porque es su nombre también. Encontrarás comunidad. No en el lugar donde naciste. No en el lugar donde vives. Sino en el medio. Con otras personas que llevan dos idiomas. Dos culturas. Dos hogares. Dos mundos. Personas que entienden lo que es traducir todo. Incluso tus propios pensamientos. No estás roto. No estás incompleto. Eres bilingüe. Bicultural. En el medio. Y eso es un regalo. Te tomará años verlo así. Pero lo harás. Lo prometo.',
        },
        media: {
          ambient: {
            url: '/media/ambient/writing-desk.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'letters-ch3',
        order: 3,
        title: {
          en: 'To the Country I Left',
          fr: 'Au Pays Que J\'ai Quitté',
          es: 'Al País Que Dejé',
        },
        description: {
          en: 'Nostalgia for a home that no longer exists.',
          fr: 'Nostalgie d\'une maison qui n\'existe plus.',
          es: 'Nostalgia por un hogar que ya no existe.',
        },
        text: {
          en: 'To the country I left, I think about you more than I admit. Your streets. Your sounds. Your smells. The way the air feels different. I left because I had to. Because staying meant giving up dreams. Opportunities. A future. But leaving meant giving up you. I don\'t fit there anymore. When I visit. I\'m a guest. A foreigner in my own birthplace. People can tell. The way I dress. The way I speak. Even the way I stand. \"You\'ve become too Western,\" they say. But here. In Canada. I\'m not Western either. I\'m ethnic. Immigrant. Other. I carry you with me. But I can\'t go back. I don\'t know if I\'m homesick. Or if I just miss the person I was when I lived there. Before the world got complicated. Before I had to choose. You were my first love. My first language. My first home. And I left you. I\'m sorry. But I\'m not coming back. And maybe that\'s the real loss. Not that I left. But that I can\'t return. Not really.',
          fr: 'Au pays que j\'ai quitté, Je pense à toi plus que je l\'admets. Tes rues. Tes sons. Tes odeurs. La façon dont l\'air est différent. Je suis parti parce que je devais. Parce que rester signifiait abandonner les rêves. Les opportunités. Un avenir. Mais partir signifiait t\'abandonner. Je ne rentre plus là-bas. Quand je visite. Je suis un invité. Un étranger dans mon propre lieu de naissance. Les gens peuvent le dire. La façon dont je m\'habille. La façon dont je parle. Même la façon dont je me tiens. \"Tu es devenu trop occidental,\" disent-ils. Mais ici. Au Canada. Je ne suis pas occidental non plus. Je suis ethnique. Immigrant. Autre. Je te porte avec moi. Mais je ne peux pas revenir. Je ne sais pas si j\'ai le mal du pays. Ou si je manque juste la personne que j\'étais quand je vivais là. Avant que le monde devienne compliqué. Avant que je doive choisir. Tu étais mon premier amour. Ma première langue. Ma première maison. Et je t\'ai quitté. Je suis désolé. Mais je ne reviendrai pas. Et peut-être que c\'est la vraie perte. Non pas que je sois parti. Mais que je ne peux pas revenir. Pas vraiment.',
          es: 'Al país que dejé, Pienso en ti más de lo que admito. Tus calles. Tus sonidos. Tus olores. La forma en que el aire se siente diferente. Me fui porque tenía que hacerlo. Porque quedarme significaba renunciar a sueños. Oportunidades. Un futuro. Pero irme significaba renunciar a ti. Ya no encajo allá. Cuando visito. Soy un invitado. Un extranjero en mi propio lugar de nacimiento. La gente puede notarlo. La forma en que me visto. La forma en que hablo. Incluso la forma en que me paro. \"Te has vuelto demasiado occidental,\" dicen. Pero aquí. En Canadá. Tampoco soy occidental. Soy étnico. Inmigrante. Otro. Te llevo conmigo. Pero no puedo volver. No sé si tengo nostalgia. O si solo extraño a la persona que era cuando vivía allí. Antes de que el mundo se complicara. Antes de tener que elegir. Fuiste mi primer amor. Mi primer idioma. Mi primer hogar. Y te dejé. Lo siento. Pero no voy a volver. Y tal vez esa es la pérdida real. No que me fui. Sino que no puedo regresar. No realmente.',
        },
        media: {
          ambient: {
            url: '/media/ambient/distant-memories.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'letters-ch4',
        order: 4,
        title: {
          en: 'To the Stranger Who Looks Like Me',
          fr: 'À l\'Étrangère Qui Me Ressemble',
          es: 'A la Extraña Que Se Parece a Mí',
        },
        description: {
          en: 'Divided by choices, united by experience.',
          fr: 'Divisées par les choix, unies par l\'expérience.',
          es: 'Divididas por elecciones, unidas por experiencia.',
        },
        text: {
          en: 'Dear stranger who looks like me, We passed each other on the street today. You were wearing a hijab. I wasn\'t. For a moment. Our eyes met. And I saw it. Judgment. Or maybe just curiosity. Or maybe I imagined it. I wanted to say. I\'m still Muslim. I still pray. I still fast. I just don\'t cover. But you kept walking. And so did I. And now I\'m sitting here. Wondering why I felt I owed you an explanation. We share a religion. A culture. Maybe even a country of origin. But we made different choices. You chose visibility. I chose privacy. Neither is wrong. But sometimes it feels like we\'re supposed to be on opposing teams. The covered versus the uncovered. The traditional versus the modern. The good Muslim versus the bad one. I hate that binary. Because we\'re both navigating the same thing. Being Muslim. In a place that often doesn\'t understand us. You face harassment for covering. I face judgment for not. We\'re both trying to be ourselves. In a world that wants us to be less. Or more. But never just right. I wish I had said something. Maybe next time.',
          fr: 'Chère étrangère qui me ressemble, Nous nous sommes croisées dans la rue aujourd\'hui. Tu portais un hijab. Pas moi. Un instant. Nos yeux se sont rencontrés. Et j\'ai vu. Jugement. Ou peut-être juste curiosité. Ou peut-être que je l\'ai imaginé. Je voulais dire. Je suis toujours musulmane. Je prie toujours. Je jeûne toujours. Je ne me couvre juste pas. Mais tu as continué à marcher. Et moi aussi. Et maintenant je suis assise ici. Me demandant pourquoi j\'ai senti que je te devais une explication. Nous partageons une religion. Une culture. Peut-être même un pays d\'origine. Mais nous avons fait des choix différents. Tu as choisi la visibilité. J\'ai choisi la vie privée. Aucun n\'est mauvais. Mais parfois on dirait que nous sommes censées être dans des équipes opposées. Les couvertes contre les non-couvertes. Les traditionnelles contre les modernes. La bonne musulmane contre la mauvaise. Je déteste ce binaire. Parce que nous naviguons toutes les deux la même chose. Être musulmane. Dans un endroit qui souvent ne nous comprend pas. Tu fais face au harcèlement pour te couvrir. Je fais face au jugement pour ne pas le faire. Nous essayons toutes les deux d\'être nous-mêmes. Dans un monde qui veut que nous soyons moins. Ou plus. Mais jamais juste bien. J\'aurais aimé dire quelque chose. Peut-être la prochaine fois.',
          es: 'Querida extraña que se parece a mí, Nos cruzamos en la calle hoy. Llevabas un hiyab. Yo no. Por un momento. Nuestros ojos se encontraron. Y vi. Juicio. O tal vez solo curiosidad. O tal vez lo imaginé. Quería decir. Todavía soy musulmana. Todavía rezo. Todavía ayuno. Solo no me cubro. Pero seguiste caminando. Y yo también. Y ahora estoy sentada aquí. Preguntándome por qué sentí que te debía una explicación. Compartimos una religión. Una cultura. Tal vez incluso un país de origen. Pero tomamos decisiones diferentes. Tú elegiste visibilidad. Yo elegí privacidad. Ninguna está mal. Pero a veces se siente como si se supone que estemos en equipos opuestos. Las cubiertas contra las descubiertas. Las tradicionales contra las modernas. La buena musulmana contra la mala. Odio ese binario. Porque ambas estamos navegando lo mismo. Ser musulmana. En un lugar que a menudo no nos entiende. Enfrentas acoso por cubrirte. Enfrento juicio por no hacerlo. Ambas estamos tratando de ser nosotras mismas. En un mundo que quiere que seamos menos. O más. Pero nunca justo bien. Ojalá hubiera dicho algo. Tal vez la próxima vez.',
        },
        media: {
          ambient: {
            url: '/media/ambient/city-street.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'letters-ch5',
        order: 5,
        title: {
          en: 'To My Children Who Don\'t Exist Yet',
          fr: 'À Mes Enfants Qui N\'existent Pas Encore',
          es: 'A Mis Hijos Que Aún No Existen',
        },
        description: {
          en: 'Uncertainty about passing on a fractured heritage.',
          fr: 'Incertitude quant à transmettre un héritage fracturé.',
          es: 'Incertidumbre sobre transmitir una herencia fracturada.',
        },
        text: {
          en: 'To my children who don\'t exist yet, I don\'t know if I\'ll have you. I don\'t know if I want to bring you into this world. This country. This life. Because I\'ll have to teach you things I wish I didn\'t know. How to navigate being different. How to code-switch. How to make yourself smaller so others feel comfortable. I\'ll have to explain why some people stare. Why some people are afraid. Why some people assume things about you before you even speak. I\'ll have to decide what parts of my culture to pass down. And what parts to let go. Do I teach you the language? Knowing you\'ll probably lose it. Like I\'m losing mine. Do I teach you the religion? Knowing you might reject it. Or be rejected for it. Do I tell you where we come from? Knowing it might make you feel like you don\'t belong here. Or do I raise you Canadian. Fully. Completely. And watch you grow up not knowing half of yourself. I want you to be proud. But I also want you to be safe. I want you to know where you come from. But I also want you to feel at home where you are. I don\'t have answers yet. But if you exist someday. I hope I figure it out. You deserve better than my uncertainty.',
          fr: 'À mes enfants qui n\'existent pas encore, Je ne sais pas si je vous aurai. Je ne sais pas si je veux vous amener dans ce monde. Ce pays. Cette vie. Parce que je devrai vous enseigner des choses que j\'aurais aimé ne pas savoir. Comment naviguer en étant différent. Comment changer de code. Comment vous faire plus petit pour que les autres se sentent à l\'aise. Je devrai expliquer pourquoi certaines personnes regardent. Pourquoi certaines personnes ont peur. Pourquoi certaines personnes supposent des choses sur vous avant même que vous parliez. Je devrai décider quelles parties de ma culture transmettre. Et quelles parties laisser aller. Est-ce que je vous enseigne la langue? Sachant que vous la perdrez probablement. Comme je perds la mienne. Est-ce que je vous enseigne la religion? Sachant que vous pourriez la rejeter. Ou être rejetés pour elle. Est-ce que je vous dis d\'où nous venons? Sachant que cela pourrait vous faire sentir que vous n\'appartenez pas ici. Ou est-ce que je vous élève canadiens. Pleinement. Complètement. Et vous regarde grandir sans connaître la moitié de vous-mêmes. Je veux que vous soyez fiers. Mais je veux aussi que vous soyez en sécurité. Je veux que vous sachiez d\'où vous venez. Mais je veux aussi que vous vous sentiez chez vous là où vous êtes. Je n\'ai pas encore de réponses. Mais si vous existez un jour. J\'espère que je trouverai. Vous méritez mieux que mon incertitude.',
          es: 'A mis hijos que aún no existen, No sé si los tendré. No sé si quiero traerlos a este mundo. Este país. Esta vida. Porque tendré que enseñarles cosas que desearía no saber. Cómo navegar siendo diferente. Cómo cambiar de código. Cómo hacerse más pequeño para que otros se sientan cómodos. Tendré que explicar por qué algunas personas miran. Por qué algunas personas tienen miedo. Por qué algunas personas asumen cosas sobre ustedes antes de que hablen. Tendré que decidir qué partes de mi cultura transmitir. Y qué partes dejar ir. ¿Les enseño el idioma? Sabiendo que probablemente lo perderán. Como estoy perdiendo el mío. ¿Les enseño la religión? Sabiendo que podrían rechazarla. O ser rechazados por ella. ¿Les digo de dónde venimos? Sabiendo que podría hacerlos sentir que no pertenecen aquí. O los crío canadienses. Totalmente. Completamente. Y los veo crecer sin conocer la mitad de ustedes mismos. Quiero que estén orgullosos. Pero también quiero que estén seguros. Quiero que sepan de dónde vienen. Pero también quiero que se sientan en casa donde están. Todavía no tengo respuestas. Pero si existen algún día. Espero descubrirlo. Merecen algo mejor que mi incertidumbre.',
        },
        media: {
          ambient: {
            url: '/media/ambient/contemplation.mp3',
          },
        },
        estimatedDuration: 4,
      },
    ],
  },
  {
    id: 'soft-power',
    title: {
      en: 'Soft Power',
      fr: 'Pouvoir Doux',
      es: 'Poder Suave',
    },
    description: {
      en: 'Six stories exploring how culture, language, and identity become tools of influence in the Canadian diaspora.',
      fr: 'Six histoires explorant comment la culture, la langue et l\'identité deviennent des outils d\'influence dans la diaspora canadienne.',
      es: 'Seis historias explorando cómo la cultura, el idioma y la identidad se convierten en herramientas de influencia en la diáspora canadiense.',
    },
    creator: {
      en: 'Maya Osman',
      fr: 'Maya Osman',
      es: 'Maya Osman',
    },
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1200&fit=crop',
    releaseDate: 'Jan 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Identity & Belonging', 'Language & Power', 'Migration & Diaspora'],
    totalDuration: '18 min',
    chapterCount: 6,
    featured: false,
    new: false,
    trending: true,
    visibility: 'public',
    chapters: [
      {
        id: 'soft-power-ch1',
        order: 1,
        title: {
          en: 'The Name Game',
          fr: 'Le Jeu du Nom',
          es: 'El Juego del Nombre',
        },
        description: {
          en: 'How a name becomes political, personal, and impossible to pronounce.',
          fr: 'Comment un nom devient politique, personnel, et impossible à prononcer.',
          es: 'Cómo un nombre se vuelve político, personal, e imposible de pronunciar.',
        },
        text: {
          en: 'Her name is Zhara. Zuh-HAH-ruh. Three syllables. Simple enough. But at Starbucks she says \"Sarah.\" At the bank, \"Sarah.\" At the doctor\'s office, \"Sarah.\" Because correcting people is exhausting. Because the apologetic smile when they mangle it is worse than just giving in. Because sometimes fitting in is easier than fighting. Her little sister doesn\'t do this. Her little sister, born here, corrects everyone. \"It\'s not that hard,\" she says, age twelve and fearless. Zhara envies her. Zhara remembers being that bold. Before she learned that your name is the first thing people decide is too hard, too foreign, too other. Before she learned that assimilation starts with introducing yourself.',
          fr: 'Son nom est Zhara. Zuh-HAH-ruh. Trois syllabes. Assez simple. Mais chez Starbucks, elle dit \"Sarah.\" À la banque, \"Sarah.\" Au cabinet du médecin, \"Sarah.\" Parce que corriger les gens est épuisant. Parce que le sourire d\'excuse quand ils le massacrent est pire que de simplement céder. Parce que parfois s\'intégrer est plus facile que se battre. Sa petite sœur ne fait pas ça. Sa petite sœur, née ici, corrige tout le monde. \"Ce n\'est pas si difficile,\" dit-elle, douze ans et sans peur. Zhara l\'envie. Zhara se souvient d\'être aussi audacieuse. Avant qu\'elle apprenne que votre nom est la première chose que les gens décident est trop difficile, trop étranger, trop autre. Avant qu\'elle apprenne que l\'assimilation commence en se présentant.',
          es: 'Su nombre es Zhara. Zuh-HAH-ruh. Tres sílabas. Bastante simple. Pero en Starbucks dice \"Sarah.\" En el banco, \"Sarah.\" En la oficina del médecin, \"Sarah.\" Porque corregir a la gente es agotador. Porque la sonrisa de disculpa cuando lo destrozan es peor que simplemente ceder. Porque a veces encajar es más fácil que luchar. Su hermana pequeña no hace esto. Su hermana pequeña, nacida aquí, corrige a todos. \"No es tan difícil,\" dice, doce años y sin miedo. Zhara la envidia. Zhara recuerda ser tan audaz. Antes de que aprendiera que tu nombre es lo primero que la gente decide que es demasiado difícil, demasiado extranjero, demasiado otro. Antes de que aprendiera que la asimilación comienza al presentarte.',
        },
        media: {
          ambient: {
            url: '/media/ambient/coffee-shop.mp3',
          },
        },
        estimatedDuration: 3,
      },
      {
        id: 'soft-power-ch2',
        order: 2,
        title: {
          en: 'Code Switch',
          fr: 'Changement de Code',
          es: 'Cambio de Código',
        },
        description: {
          en: 'Between languages, between identities, between worlds.',
          fr: 'Entre les langues, entre les identités, entre les mondes.',
          es: 'Entre idiomas, entre identidades, entre mundos.',
        },
        text: {
          en: 'At work, Marcus speaks perfect Canadian English. Neutral accent, professional tone, grammatically flawless. On the subway home, he switches. Patois with his uncle on the phone. Mix of English and Jamaican Creole with friends. Full Creole with his grandmother. It\'s not performance. It\'s survival. It\'s code-switching. The ability to move between worlds without belonging fully to either. White colleagues think he \"speaks so well,\" as if this is surprising. Jamaican elders think he\'s \"too Canadian,\" as if this is shameful. He\'s too much of both. Not enough of either. The in-between is exhausting. The in-between is home.',
          fr: 'Au travail, Marcus parle un anglais canadien parfait. Accent neutre, ton professionnel, grammaticalement impeccable. Dans le métro pour rentrer, il change. Patois avec son oncle au téléphone. Mélange d\'anglais et de créole jamaïcain avec des amis. Créole complet avec sa grand-mère. Ce n\'est pas une performance. C\'est une survie. C\'est le changement de code. La capacité de se déplacer entre les mondes sans appartenir pleinement à l\'un ou l\'autre. Les collègues blancs pensent qu\'il \"parle si bien,\" comme si c\'était surprenant. Les aînés jamaïcains pensent qu\'il est \"trop canadien,\" comme si c\'était honteux. Il est trop des deux. Pas assez de l\'un ou l\'autre. L\'entre-deux est épuisant. L\'entre-deux est la maison.',
          es: 'En el trabajo, Marcus habla inglés canadiense perfecto. Acento neutral, tono profesional, gramaticalmente impecable. En el metro a casa, cambia. Patois con su tío por teléfono. Mezcla de inglés y criollo jamaicano con amigos. Criollo completo con su abuela. No es actuación. Es supervivencia. Es cambio de código. La capacidad de moverse entre mundos sin pertenecer completamente a ninguno. Los colegas blancos piensan que \"habla tan bien,\" como si esto fuera sorprendente. Los ancianos jamaicanos piensan que es \"demasiado canadiense,\" como si esto fuera vergonzoso. Es demasiado de ambos. No es suficiente de ninguno. El medio es agotador. El medio es hogar.',
        },
        media: {
          ambient: {
            url: '/media/ambient/subway-ride.mp3',
          },
        },
        estimatedDuration: 3,
      },
      {
        id: 'soft-power-ch3',
        order: 3,
        title: {
          en: 'Cultural Capital',
          fr: 'Capital Culturel',
          es: 'Capital Cultural',
        },
        description: {
          en: 'When your culture becomes a commodity.',
          fr: 'Quand votre culture devient une marchandise.',
          es: 'Cuando tu cultura se convierte en mercancía.',
        },
        text: {
          en: 'The fashion brand wants to use henna. The music label wants to sample qawwali. The restaurant wants to serve \"authentic fusion.\" They want Priya\'s culture. But not Priya. They want the aesthetic without the people. The flavor without the history. The style without the struggle. She consults for them. They pay well. She teaches them about cultural appropriation. They nod seriously. Then they do it anyway. With a diversity consultant credit in small print. Her name as permission. Her expertise as cover. She takes the money. She hates herself a little. She knows refusal won\'t stop them. At least this way she has some control. At least this way she gets paid. This is soft power. Negotiating from a position of weakness and calling it influence.',
          fr: 'La marque de mode veut utiliser le henné. Le label musical veut échantillonner le qawwali. Le restaurant veut servir de la \"fusion authentique.\" Ils veulent la culture de Priya. Mais pas Priya. Ils veulent l\'esthétique sans les gens. La saveur sans l\'histoire. Le style sans la lutte. Elle consulte pour eux. Ils paient bien. Elle leur enseigne l\'appropriation culturelle. Ils hochent la tête sérieusement. Puis ils le font quand même. Avec un crédit de consultant en diversité en petits caractères. Son nom comme permission. Son expertise comme couverture. Elle prend l\'argent. Elle se déteste un peu. Elle sait que le refus ne les arrêtera pas. Au moins de cette façon, elle a un certain contrôle. Au moins de cette façon, elle est payée. C\'est le pouvoir doux. Négocier à partir d\'une position de faiblesse et l\'appeler influence.',
          es: 'La marca de moda quiere usar henna. El sello discográfico quiere samplear qawwali. El restaurante quiere servir \"fusión auténtica.\" Quieren la cultura de Priya. Pero no a Priya. Quieren la estética sin la gente. El sabor sin la historia. El estilo sin la lucha. Ella consulta para ellos. Pagan bien. Les enseña sobre apropiación cultural. Asienten seriamente. Luego lo hacen de todos modos. Con un crédito de consultora de diversidad en letra pequeña. Su nombre como permiso. Su experiencia como cobertura. Toma el dinero. Se odia un poco. Sabe que el rechazo no los detendrá. Al menos de esta manera tiene algo de control. Al menos de esta manera le pagan. Esto es poder suave. Negociar desde una posición de debilidad y llamarlo influencia.',
        },
        media: {
          ambient: {
            url: '/media/ambient/corporate-office.mp3',
          },
        },
        estimatedDuration: 3,
        contextCards: [
          {
            id: 'cultural-appropriation',
            type: 'cultural',
            title: {
              en: 'Cultural Appropriation vs. Appreciation',
              fr: 'Appropriation Culturelle vs. Appréciation',
              es: 'Apropiación Cultural vs. Apreciación',
            },
            content: {
              en: 'Cultural appropriation occurs when elements of a marginalized culture are taken and used by members of a dominant culture without understanding, respect, or compensation, often for profit or aesthetic purposes.',
              fr: 'L\'appropriation culturelle se produit lorsque des éléments d\'une culture marginalisée sont pris et utilisés par des membres d\'une culture dominante sans compréhension, respect ou compensation, souvent à des fins de profit ou esthétiques.',
              es: 'La apropiación cultural ocurre cuando elementos de una cultura marginalizada son tomados y usados por miembros de una cultura dominante sin comprensión, respeto o compensación, a menudo con fines de lucro o estéticos.',
            },
          },
        ],
      },
      {
        id: 'soft-power-ch4',
        order: 4,
        title: {
          en: 'Model Minority',
          fr: 'Minorité Modèle',
          es: 'Minoría Modelo',
        },
        description: {
          en: 'The myth that divides and the pressure to be perfect.',
          fr: 'Le mythe qui divise et la pression d\'être parfait.',
          es: 'El mito que divide y la presión de ser perfecto.',
        },
        text: {
          en: 'Jun\'s parents came from Korea with nothing. Now he\'s an engineer at a tech company. Success story, right? Model minority. Proof that hard work pays off. Proof that racism isn\'t real if you just try hard enough. Except Jun knows the cost. His father worked three jobs. His mother cleaned houses. He had no childhood, only studying. No room for failure. No room for anything but perfection. And now he\'s held up as proof. \"Why can\'t they be more like the Asians?\" As if his success erases systemic racism. As if being the \"good minority\" isn\'t just another form of control. As if he didn\'t have to be twice as good to get half as far. The model minority myth is a weapon. Used against other minorities. Used to divide. Used to maintain the hierarchy while pretending it doesn\'t exist.',
          fr: 'Les parents de Jun sont venus de Corée sans rien. Maintenant, il est ingénieur dans une entreprise technologique. Histoire de succès, non? Minorité modèle. Preuve que le travail acharné paie. Preuve que le racisme n\'est pas réel si vous essayez assez fort. Sauf que Jun connaît le coût. Son père travaillait trois emplois. Sa mère nettoyait des maisons. Il n\'a pas eu d\'enfance, seulement des études. Pas de place pour l\'échec. Pas de place pour autre chose que la perfection. Et maintenant, il est présenté comme preuve. \"Pourquoi ne peuvent-ils pas être plus comme les Asiatiques?\" Comme si son succès effaçait le racisme systémique. Comme si être la \"bonne minorité\" n\'était pas juste une autre forme de contrôle. Comme s\'il n\'avait pas dû être deux fois meilleur pour aller deux fois moins loin. Le mythe de la minorité modèle est une arme. Utilisée contre d\'autres minorités. Utilisée pour diviser. Utilisée pour maintenir la hiérarchie tout en prétendant qu\'elle n\'existe pas.',
          es: 'Los padres de Jun vinieron de Corea sin nada. Ahora es ingeniero en una empresa de tecnología. Historia de éxito, ¿verdad? Minoría modelo. Prueba de que el trabajo duro vale la pena. Prueba de que el racismo no es real si solo te esfuerzas lo suficiente. Excepto que Jun conoce el costo. Su padre trabajó tres empleos. Su madre limpiaba casas. No tuvo infancia, solo estudio. Sin lugar para el fracaso. Sin lugar para nada más que la perfección. Y ahora es presentado como prueba. \"¿Por qué no pueden ser más como los asiáticos?\" Como si su éxito borrara el racismo sistémico. Como si ser la \"buena minoría\" no fuera solo otra forma de control. Como si no tuviera que ser el doble de bueno para llegar a la mitad de lejos. El mito de la minoría modelo es un arma. Usada contra otras minorías. Usada para dividir. Usada para mantener la jerarquía mientras se pretende que no existe.',
        },
        media: {
          ambient: {
            url: '/media/ambient/office-work.mp3',
          },
        },
        estimatedDuration: 3,
      },
      {
        id: 'soft-power-ch5',
        order: 5,
        title: {
          en: 'Accent Politics',
          fr: 'Politique de l\'Accent',
          es: 'Política del Acento',
        },
        description: {
          en: 'How you speak determines what people hear.',
          fr: 'Comment vous parlez détermine ce que les gens entendent.',
          es: 'Cómo hablas determina lo que la gente escucha.',
        },
        text: {
          en: 'Sofia\'s mother speaks English with a thick Portuguese accent. After thirty years in Canada. Sofia used to be embarrassed. Would translate for her. Simplify for her. Speak for her. Now Sofia understands. Her mother speaks four languages fluently. English is her fourth. She runs a business. Raised three kids. Built a life. But people hear the accent and assume incompetence. They speak slower. Louder. As if volume creates understanding. They ask Sofia to translate even when her mother just spoke in English. They smile patronizingly. Her mother lets them. She knows what Sofia is learning. That an accent is not a deficit. It\'s evidence of courage. Of learning. Of building a new life in a new language. The people who mock accents speak one language. Her mother speaks four. Who is really limited here?',
          fr: 'La mère de Sofia parle anglais avec un fort accent portugais. Après trente ans au Canada. Sofia avait l\'habitude d\'être gênée. Traduisait pour elle. Simplifiait pour elle. Parlait pour elle. Maintenant Sofia comprend. Sa mère parle couramment quatre langues. L\'anglais est sa quatrième. Elle dirige une entreprise. A élevé trois enfants. Construit une vie. Mais les gens entendent l\'accent et supposent l\'incompétence. Ils parlent plus lentement. Plus fort. Comme si le volume créait la compréhension. Ils demandent à Sofia de traduire même quand sa mère vient de parler en anglais. Ils sourient avec condescendance. Sa mère les laisse faire. Elle sait ce que Sofia apprend. Qu\'un accent n\'est pas un déficit. C\'est la preuve de courage. D\'apprentissage. De construire une nouvelle vie dans une nouvelle langue. Les gens qui se moquent des accents parlent une langue. Sa mère en parle quatre. Qui est vraiment limité ici?',
          es: 'La madre de Sofia habla inglés con un fuerte acento portugués. Después de treinta años en Canadá. Sofia solía avergonzarse. Traducía por ella. Simplificaba por ella. Hablaba por ella. Ahora Sofia entiende. Su madre habla cuatro idiomas con fluidez. El inglés es su cuarto. Dirige un negocio. Crió tres hijos. Construyó una vida. Pero la gente escucha el acento y asume incompetencia. Hablan más despacio. Más fuerte. Como si el volumen creara comprensión. Le piden a Sofia que traduzca incluso cuando su madre acaba de hablar en inglés. Sonríen con condescendencia. Su madre los deja. Sabe lo que Sofia está aprendiendo. Que un acento no es un déficit. Es evidencia de coraje. De aprendizaje. De construir una nueva vida en un nuevo idioma. Las personas que se burlan de los acentos hablan un idioma. Su madre habla cuatro. ¿Quién está realmente limitado aquí?',
        },
        media: {
          ambient: {
            url: '/media/ambient/family-home.mp3',
          },
        },
        estimatedDuration: 3,
      },
      {
        id: 'soft-power-ch6',
        order: 6,
        title: {
          en: 'Reclaiming Power',
          fr: 'Récupérer le Pouvoir',
          es: 'Reclamar el Poder',
        },
        description: {
          en: 'What happens when you stop negotiating and start demanding.',
          fr: 'Que se passe-t-il quand vous arrêtez de négocier et commencez à exiger.',
          es: 'Qué sucede cuando dejas de negociar y comienzas a exigir.',
        },
        text: {
          en: 'There is a shift happening. Subtle but seismic. People are done code-switching. Done anglicizing names. Done explaining their accents. Done being grateful for inclusion. The next generation doesn\'t ask for permission. They don\'t negotiate for space. They take it. They refuse the model minority trap. They reject respectability politics. They say their names correctly and make you learn to say it right. They speak their languages proudly. They wear their cultures visibly. This is not soft power. This is power, period. Not asking to be seen. Demanding to be heard. Not hoping for representation. Creating their own platforms. Not waiting for justice. Building it themselves. The shift is generational. Irreversible. Inevitable. And it sounds like freedom.',
          fr: 'Il y a un changement qui se produit. Subtil mais sismique. Les gens en ont fini avec le changement de code. Fini d\'angliciser les noms. Fini d\'expliquer leurs accents. Fini d\'être reconnaissants pour l\'inclusion. La prochaine génération ne demande pas la permission. Elle ne négocie pas pour l\'espace. Elle le prend. Elle refuse le piège de la minorité modèle. Elle rejette la politique de respectabilité. Elle dit ses noms correctement et vous oblige à apprendre à le dire correctement. Elle parle ses langues fièrement. Elle porte ses cultures visiblement. Ce n\'est pas du pouvoir doux. C\'est du pouvoir, point final. Ne pas demander à être vu. Exiger d\'être entendu. Ne pas espérer la représentation. Créer ses propres plateformes. Ne pas attendre la justice. La construire eux-mêmes. Le changement est générationnel. Irréversible. Inévitable. Et ça ressemble à la liberté.',
          es: 'Hay un cambio sucediendo. Sutil pero sísmico. La gente ha terminado con el cambio de código. Terminado con anglicizar nombres. Terminado con explicar sus acentos. Terminado con estar agradecidos por la inclusión. La próxima generación no pide permiso. No negocia por espacio. Lo toma. Rechaza la trampa de la minoría modelo. Rechaza la política de respetabilidad. Dice sus nombres correctamente y te obliga a aprender a decirlo bien. Habla sus idiomas con orgullo. Usa sus culturas visiblemente. Esto no es poder suave. Esto es poder, punto. No pedir ser visto. Exigir ser escuchado. No esperar representación. Crear sus propias plataformas. No esperar justicia. Construirla ellos mismos. El cambio es generacional. Irreversible. Inevitable. Y suena como libertad.',
        },
        media: {
          ambient: {
            url: '/media/ambient/city-energy.mp3',
          },
        },
        estimatedDuration: 3,
      },
    ],
  },
  {
    id: 'home-no-fixed-address',
    title: {
      en: 'Home (No Fixed Address)',
      fr: 'Maison (Sans Adresse Fixe)',
      es: 'Hogar (Sin Dirección Fija)',
    },
    description: {
      en: 'Five meditations on belonging, place-making, and what home means when you carry it with you instead of living in it.',
      fr: 'Cinq méditations sur l\'appartenance, la création de lieux, et ce que signifie la maison quand vous la portez avec vous au lieu d\'y vivre.',
      es: 'Cinco meditaciones sobre pertenencia, creación de lugar, y qué significa hogar cuando lo llevas contigo en lugar de vivir en él.',
    },
    creator: {
      en: 'Collective Voice',
      fr: 'Voix Collective',
      es: 'Voz Colectiva',
    },
    coverImage: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=1200&fit=crop',
    releaseDate: 'Dec 2025',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Identity & Belonging', 'Migration & Diaspora', 'Place & Memory'],
    totalDuration: '20 min',
    chapterCount: 5,
    featured: false,
    new: false,
    trending: false,
    visibility: 'public',
    chapters: [
      {
        id: 'home-ch1',
        order: 1,
        title: {
          en: 'The Question',
          fr: 'La Question',
          es: 'La Pregunta',
        },
        description: {
          en: 'Everyone asks where you\'re from. But the answer is never simple.',
          fr: 'Tout le monde demande d\'où vous venez. Mais la réponse n\'est jamais simple.',
          es: 'Todos preguntan de dónde eres. Pero la respuesta nunca es simple.',
        },
        text: {
          en: 'Where are you from? It\'s the first question people ask. And I never know how to answer. Do they want to know where I was born? Iran. Do they want to know where I grew up? Germany. Dubai. Canada. Do they want to know where my parents are from? Tehran. Do they want to know where I live now? Toronto. Do they want to know where I feel at home? I don\'t know. Nowhere. Everywhere. It depends on the day. The question seems simple. But for people like me—third culture kids, perpetual migrants, professional wanderers—it\'s impossibly complex. Because home isn\'t a place. It\'s a feeling. And that feeling doesn\'t have a fixed address. So when people ask where I\'m from, I usually just pick the answer that\'s easiest for them to hear. Because the real answer—that I\'m from everywhere and nowhere—makes people uncomfortable.',
          fr: 'D\'où venez-vous? C\'est la première question que les gens posent. Et je ne sais jamais comment répondre. Veulent-ils savoir où je suis né? Iran. Veulent-ils savoir où j\'ai grandi? Allemagne. Dubaï. Canada. Veulent-ils savoir d\'où viennent mes parents? Téhéran. Veulent-ils savoir où je vis maintenant? Toronto. Veulent-ils savoir où je me sens chez moi? Je ne sais pas. Nulle part. Partout. Ça dépend du jour. La question semble simple. Mais pour les gens comme moi—enfants de la troisième culture, migrants perpétuels, vagabonds professionnels—c\'est incroyablement complexe. Parce que la maison n\'est pas un lieu. C\'est un sentiment. Et ce sentiment n\'a pas d\'adresse fixe. Alors quand les gens demandent d\'où je viens, je choisis généralement la réponse la plus facile à entendre pour eux.',
          es: '¿De dónde eres? Es la primera pregunta que la gente hace. Y nunca sé cómo responder. ¿Quieren saber dónde nací? Irán. ¿Quieren saber dónde crecí? Alemania. Dubái. Canadá. ¿Quieren saber de dónde son mis padres? Teherán. ¿Quieren saber dónde vivo ahora? Toronto. ¿Quieren saber dónde me siento en casa? No lo sé. En ningún lado. En todas partes. Depende del día. La pregunta parece simple. Pero para personas como yo—niños de tercera cultura, migrantes perpetuos, vagabundos profesionales—es imposiblemente compleja. Porque hogar no es un lugar. Es un sentimiento. Y ese sentimiento no tiene una dirección fija.',
        },
        media: {
          ambient: {
            url: '/media/ambient/cafe-conversation.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'home-ch2',
        order: 2,
        title: {
          en: 'Objects',
          fr: 'Objets',
          es: 'Objetos',
        },
        description: {
          en: 'The things we carry to make any place feel like home.',
          fr: 'Les choses que nous portons pour faire de n\'importe quel endroit une maison.',
          es: 'Las cosas que llevamos para hacer que cualquier lugar se sienta como hogar.',
        },
        text: {
          en: 'I move apartments every two years. Always have. Can\'t seem to settle. But no matter where I go, I bring the same objects. A blue ceramic bowl from my grandmother\'s kitchen in Lagos. A photograph of my parents on their wedding day. A wool blanket from a market in Ecuador. A set of tea glasses from Istanbul. These things don\'t match. They don\'t make sense together. But they make sense to me. Each one is a fragment of a place I\'ve lived. A person I\'ve been. A version of home I\'ve carried. When I unpack them in a new apartment, something shifts. The space becomes mine. Not because I own it. But because it holds pieces of my history. Home isn\'t where I live. Home is what I carry.',
          fr: 'Je déménage tous les deux ans. Toujours. Je ne peux pas sembler m\'installer. Mais peu importe où je vais, j\'apporte les mêmes objets. Un bol en céramique bleue de la cuisine de ma grand-mère à Lagos. Une photographie de mes parents le jour de leur mariage. Une couverture en laine d\'un marché en Équateur. Un ensemble de verres à thé d\'Istanbul. Ces choses ne correspondent pas. Elles n\'ont pas de sens ensemble. Mais elles ont un sens pour moi. Chacune est un fragment d\'un endroit où j\'ai vécu. Une personne que j\'ai été. Une version de la maison que j\'ai portée. Quand je les déballe dans un nouvel appartement, quelque chose change. L\'espace devient le mien.',
          es: 'Me mudo de apartamento cada dos años. Siempre lo he hecho. No puedo establecerme. Pero no importa a dónde vaya, traigo los mismos objetos. Un tazón de cerámica azul de la cocina de mi abuela en Lagos. Una fotografía de mis padres el día de su boda. Una manta de lana de un mercado en Ecuador. Un juego de vasos de té de Estambul. Estas cosas no combinan. No tienen sentido juntas. Pero tienen sentido para mí. Cada una es un fragmento de un lugar donde he vivido. Una persona que he sido. Una versión de hogar que he llevado.',
        },
        media: {
          ambient: {
            url: '/media/ambient/unpacking.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'home-ch3',
        order: 3,
        title: {
          en: 'Accent',
          fr: 'Accent',
          es: 'Acento',
        },
        description: {
          en: 'Your voice carries all the places you\'ve been.',
          fr: 'Votre voix porte tous les endroits où vous êtes allé.',
          es: 'Tu voz lleva todos los lugares donde has estado.',
        },
        text: {
          en: 'People can\'t place my accent. It\'s not quite British. Not quite Canadian. Not quite anything. It\'s a mix. English learned from Australian teachers in an international school in Singapore. Shaped by years in Vancouver. Influenced by friends from everywhere. Linguists call it a \"third culture accent.\" I call it proof that I don\'t belong anywhere. Or that I belong everywhere. Depending on my mood. My voice is a map of everywhere I\'ve been. Everyone who\'s taught me. Every language I\'ve tried to learn. My accent is homeless. Just like me.',
          fr: 'Les gens ne peuvent pas situer mon accent. Ce n\'est pas tout à fait britannique. Pas tout à fait canadien. Pas tout à fait quoi que ce soit. C\'est un mélange. Anglais appris d\'enseignants australiens dans une école internationale à Singapour. Façonné par des années à Vancouver. Influencé par des amis de partout. Les linguistes appellent ça un \"accent de troisième culture.\" Je l\'appelle la preuve que je n\'appartiens nulle part. Ou que j\'appartiens partout. Selon mon humeur. Ma voix est une carte de partout où je suis allé.',
          es: 'La gente no puede ubicar mi acento. No es del todo británico. No del todo canadiense. No del todo nada. Es una mezcla. Inglés aprendido de maestros australianos en una escuela internacional en Singapur. Moldeado por años en Vancouver. Influenciado por amigos de todas partes. Los lingüistas lo llaman un \"acento de tercera cultura.\" Yo lo llamo prueba de que no pertenezco a ningún lado. O que pertenezco a todas partes. Dependiendo de mi humor. Mi voz es un mapa de todos los lugares donde he estado.',
        },
        media: {
          ambient: {
            url: '/media/ambient/voice-recording.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'home-ch4',
        order: 4,
        title: {
          en: 'Rituals',
          fr: 'Rituels',
          es: 'Rituales',
        },
        description: {
          en: 'Creating home through repeated small acts.',
          fr: 'Créer une maison à travers de petits actes répétés.',
          es: 'Crear hogar a través de pequeños actos repetidos.',
        },
        text: {
          en: 'Every Sunday morning, I make my grandmother\'s recipe for shakshuka. Eggs poached in spiced tomato sauce. It doesn\'t matter that I\'m in a tiny Toronto apartment, not her kitchen in Tel Aviv. The smell is the same. The ritual is the same. And for those twenty minutes of cooking, I\'m home. When everything else is temporary—the apartment, the city, the job, the relationships—rituals become anchors. They\'re the fixed points in a life of constant motion. Home isn\'t where you return to. Home is what you recreate. Over and over. In every new place.',
          fr: 'Chaque dimanche matin, je fais la recette de ma grand-mère pour shakshuka. Œufs pochés dans une sauce tomate épicée. Peu importe que je sois dans un petit appartement de Toronto, pas sa cuisine à Tel Aviv. L\'odeur est la même. Le rituel est le même. Et pendant ces vingt minutes de cuisine, je suis à la maison. Quand tout le reste est temporaire—l\'appartement, la ville, le travail, les relations—les rituels deviennent des ancres. Ce sont les points fixes dans une vie de mouvement constant.',
          es: 'Cada domingo por la mañana, hago la receta de mi abuela para shakshuka. Huevos escalfados en salsa de tomate especiada. No importa que esté en un pequeño apartamento de Toronto, no en su cocina en Tel Aviv. El olor es el mismo. El ritual es el mismo. Y durante esos veinte minutos de cocinar, estoy en casa. Cuando todo lo demás es temporal—el apartamento, la ciudad, el trabajo, las relaciones—los rituales se convierten en anclas. Son los puntos fijos en una vida de movimiento constante.',
        },
        media: {
          ambient: {
            url: '/media/ambient/cooking.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'home-ch5',
        order: 5,
        title: {
          en: 'Finding Home in Movement',
          fr: 'Trouver Une Maison Dans Le Mouvement',
          es: 'Encontrar Hogar en el Movimiento',
        },
        description: {
          en: 'What if home isn\'t a destination but a way of being?',
          fr: 'Et si la maison n\'était pas une destination mais une façon d\'être?',
          es: '¿Y si hogar no es un destino sino una forma de ser?',
        },
        text: {
          en: 'I used to think something was wrong with me. Everyone else seemed to have a hometown. A place they\'re from. A place they return to. I had coordinates. Cities. Addresses that changed. But never a hometown. But I\'ve realized something. Home for me isn\'t a place I left. It\'s a muscle I\'ve developed. The ability to make anywhere feel like home. Quickly. Efficiently. Temporarily. Most people spend their whole lives in one place and still feel lost. I move constantly and keep finding myself. My home has no fixed address. But it has a fixed feeling. Curiosity. Openness. Adaptation. Resilience. I am home when I\'m in motion. Home isn\'t where I\'m from. Home is who I\'m becoming.',
          fr: 'Je pensais qu\'il y avait quelque chose qui n\'allait pas chez moi. Tout le monde semblait avoir une ville natale. Un endroit d\'où ils viennent. Un endroit où ils retournent. J\'avais des coordonnées. Des villes. Des adresses qui changeaient. Mais jamais une ville natale. Mais j\'ai réalisé quelque chose. La maison pour moi n\'est pas un endroit que j\'ai quitté. C\'est un muscle que j\'ai développé. La capacité de faire en sorte que n\'importe où se sente comme chez soi. Rapidement. Efficacement. Temporairement. La maison n\'est pas d\'où je viens. La maison est qui je deviens.',
          es: 'Solía pensar que algo andaba mal conmigo. Todos los demás parecían tener una ciudad natal. Un lugar de donde son. Un lugar al que regresan. Yo tenía coordenadas. Ciudades. Direcciones que cambiaban. Pero nunca una ciudad natal. Pero me he dado cuenta de algo. Hogar para mí no es un lugar que dejé. Es un músculo que he desarrollado. La capacidad de hacer que cualquier lugar se sienta como hogar. Rápidamente. Eficientemente. Temporalmente. Hogar no es de donde soy. Hogar es en quien me estoy convirtiendo.',
        },
        media: {
          ambient: {
            url: '/media/ambient/journey.mp3',
          },
        },
        estimatedDuration: 4,
      },
    ],
  },
  {
    id: 'the-first-generation',
    title: {
      en: 'The First Generation',
      fr: 'La Première Génération',
      es: 'La Primera Generación',
    },
    description: {
      en: 'Seven stories about the immigrants who came first, their sacrifices, their dreams, and the complex legacy they left for those who followed.',
      fr: 'Sept histoires sur les immigrants venus en premier, leurs sacrifices, leurs rêves, et l\'héritage complexe qu\'ils ont laissé à ceux qui ont suivi.',
      es: 'Siete historias sobre los inmigrantes que llegaron primero, sus sacrificios, sus sueños, y el legado complejo que dejaron para quienes siguieron.',
    },
    creator: {
      en: 'Intergenerational Voices',
      fr: 'Voix Intergénérationnelles',
      es: 'Voces Intergeneracionales',
    },
    coverImage: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&h=1200&fit=crop',
    releaseDate: 'Jan 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Migration & Diaspora', 'Family & Separation', 'Identity & Belonging'],
    totalDuration: '25 min',
    chapterCount: 7,
    featured: true,
    new: false,
    trending: true,
    visibility: 'public',
    chapters: [
      {
        id: 'first-gen-ch1',
        order: 1,
        title: {
          en: 'Arrival',
          fr: 'Arrivée',
          es: 'Llegada',
        },
        description: {
          en: 'The moment you step off the plane and realize there is no going back.',
          fr: 'Le moment où vous descendez de l\'avion et réalisez qu\'il n\'y a pas de retour en arrière.',
          es: 'El momento en que bajas del avión y te das cuenta de que no hay vuelta atrás.',
        },
        text: {
          en: 'January 1985. Toronto Pearson Airport. My mother steps off the plane from Beirut carrying two suitcases and my three-year-old sister. Everything she owns fits in those cases. Everything she loves is either in her arms or left behind. She is twenty-eight years old. She speaks three words of English: Hello. Thank you. Sorry. The airport is cold. Too cold. She has never felt cold like this. In Lebanon, winter means rain. Here, winter means something else entirely. She thinks about turning around. Getting back on a plane. Going home. But there is no home to go back to. The war took that. So she walks forward. Through customs. Through immigration. Into a new life. Into Canada. This moment will define everything that comes after.',
          fr: 'Janvier 1985. Aéroport Pearson de Toronto. Ma mère descend de l\'avion de Beyrouth portant deux valises et ma sœur de trois ans. Tout ce qu\'elle possède tient dans ces valises. Tout ce qu\'elle aime est soit dans ses bras soit laissé derrière. Elle a vingt-huit ans. Elle parle trois mots d\'anglais: Bonjour. Merci. Désolé. L\'aéroport est froid. Trop froid. Ce moment définira tout ce qui suit.',
          es: 'Enero de 1985. Aeropuerto Pearson de Toronto. Mi madre baja del avión de Beirut llevando dos maletas y a mi hermana de tres años. Todo lo que posee cabe en esas maletas. Todo lo que ama está en sus brazos o quedó atrás. Tiene veintiocho años. Habla tres palabras en inglés: Hola. Gracias. Lo siento. El aeropuerto está frío. Demasiado frío. Este momento definirá todo lo que viene después.',
        },
        media: {
          ambient: {
            url: '/media/ambient/airport-arrival.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'first-gen-ch2',
        order: 2,
        title: {
          en: 'First Winter',
          fr: 'Premier Hiver',
          es: 'Primer Invierno',
        },
        description: {
          en: 'Learning that cold is not just weather, it is isolation.',
          fr: 'Apprendre que le froid n\'est pas seulement la météo, c\'est l\'isolement.',
          es: 'Aprender que el frío no es solo clima, es aislamiento.',
        },
        text: {
          en: 'The first winter is the hardest. Not because of the snow. But because of what the cold does to people. Back home, neighbors talk on balconies. Children play in streets. Life happens outside. Here, everyone stays inside. Locked away. Separate. My mother stands at the window of our basement apartment and watches people hurry past. Heads down. Faces hidden in scarves. No one makes eye contact. The cold keeps people apart. She misses the warmth of Lebanon. Not the temperature. The warmth between people. She joins an ESL class. Meets other immigrant women. They are all learning the same thing. How to survive a Canadian winter. And how to stay warm when everything around you is frozen.',
          fr: 'Le premier hiver est le plus dur. Non pas à cause de la neige. Mais à cause de ce que le froid fait aux gens. Au pays, les voisins parlent sur les balcons. Ici, tout le monde reste à l\'intérieur. Le froid garde les gens séparés. Elle construit une communauté. Contre le froid.',
          es: 'El primer invierno es el más duro. No por la nieve. Sino por lo que el frío le hace a la gente. En casa, los vecinos hablan en los balcones. Aquí, todos se quedan adentro. El frío mantiene a la gente separada. Construye comunidad. Contra el frío.',
        },
        media: {
          ambient: {
            url: '/media/ambient/winter-wind.mp3',
          },
        },
        estimatedDuration: 3,
      },
      {
        id: 'first-gen-ch3',
        order: 3,
        title: {
          en: 'Survival Jobs',
          fr: 'Emplois de Survie',
          es: 'Trabajos de Supervivencia',
        },
        description: {
          en: 'When your PhD means nothing and your hands do everything.',
          fr: 'Quand votre doctorat ne signifie rien et vos mains font tout.',
          es: 'Cuando tu doctorado no significa nada y tus manos lo hacen todo.',
        },
        text: {
          en: 'My father was an engineer in Syria. Designed bridges. Taught at university. Had respect. In Canada, his degree is worthless. Foreign credentials, they call it. He applies for engineering jobs. Hundreds of applications. Three interviews. No offers. Canadian experience required. So he takes what he can get. Factory work. Night shifts. Standing for twelve hours. His hands, which once drafted blueprints, now pull levers. My mother cleans houses. She who was a teacher. Now scrubs toilets. Survival jobs, they call them. Jobs that keep you alive but kill something else. They tell themselves it is temporary. Just until. But for many, just until becomes forever.',
          fr: 'Mon père était ingénieur en Syrie. Au Canada, son diplôme ne vaut rien. Diplômes étrangers. Il postule pour des emplois d\'ingénieur. Aucune offre. Expérience canadienne requise. Alors il prend ce qu\'il peut obtenir. Travail d\'usine. Emplois de survie.',
          es: 'Mi padre era ingeniero en Siria. En Canadá, su título no vale nada. Credenciales extranjeras. Solicita trabajos de ingeniería. Ninguna oferta. Se requiere experiencia canadiense. Así que toma lo que puede conseguir. Trabajo de fábrica. Trabajos de supervivencia.',
        },
        media: {
          ambient: {
            url: '/media/ambient/factory-floor.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'first-gen-ch4',
        order: 4,
        title: {
          en: 'For the Children',
          fr: 'Pour les Enfants',
          es: 'Por los Niños',
        },
        description: {
          en: 'The mantra that justifies every sacrifice.',
          fr: 'Le mantra qui justifie chaque sacrifice.',
          es: 'El mantra que justifica cada sacrificio.',
        },
        text: {
          en: 'Everything is for the children. When they work two jobs. When they skip meals. When they endure racism. For the children. When they give up their careers. Their language. Their culture. For the children. I feel the weight of it. Every report card scrutinized. Every grade analyzed. The pressure is immense. You must succeed. Because if you don\'t, what was it all for? We carry the weight of their dreams. The burden of their choices. We are the return on their investment. We are the proof that leaving was worth it. And it is a gift. And it is a curse.',
          fr: 'Tout est pour les enfants. Quand ils travaillent deux emplois. Pour les enfants. Quand ils abandonnent leurs carrières. Pour les enfants. Je sens le poids. Nous sommes pour les enfants. Et c\'est un cadeau. Et c\'est une malédiction.',
          es: 'Todo es por los niños. Cuando trabajan dos empleos. Por los niños. Cuando renuncian a sus carreras. Por los niños. Siento el peso. Somos por los niños. Y es un regalo. Y es una maldición.',
        },
        media: {
          ambient: {
            url: '/media/ambient/family-dinner.mp3',
          },
        },
        estimatedDuration: 3,
      },
      {
        id: 'first-gen-ch5',
        order: 5,
        title: {
          en: 'What Was Lost',
          fr: 'Ce Qui a Été Perdu',
          es: 'Lo Que Se Perdió',
        },
        description: {
          en: 'The cost of immigration that nobody talks about.',
          fr: 'Le coût de l\'immigration dont personne ne parle.',
          es: 'El costo de la inmigración del que nadie habla.',
        },
        text: {
          en: 'There is a story about immigration that everyone tells. Hardship. Perseverance. Success. But there is another story. Quieter. About loss. My grandmother died in Lebanon while my mother was in Canada. My mother could not go back for the funeral. No money for tickets. No time off work. She learned about the death three days late. Through a crackling phone call. She mourned alone. My father missed everything. Birthdays. Weddings. Births. Deaths. Immigration is not just moving to a new place. It is leaving an old life behind. Permanently. Irrevocably. And no amount of success in Canada can bring it back.',
          fr: 'Il y a une histoire sur l\'immigration que tout le monde raconte. Mais il y a une autre histoire. Sur la perte. Ma grand-mère est morte au Liban. Ma mère ne pouvait pas retourner. L\'immigration c\'est laisser une ancienne vie derrière. Irrévocablement.',
          es: 'Hay una historia sobre inmigración que todos cuentan. Pero hay otra historia. Sobre pérdida. Mi abuela murió en el Líbano. Mi madre no pudo volver. La inmigración es dejar una vida antigua atrás. Irrevocablemente.',
        },
        media: {
          ambient: {
            url: '/media/ambient/distant-phone-call.mp3',
          },
        },
        estimatedDuration: 4,
      },
      {
        id: 'first-gen-ch6',
        order: 6,
        title: {
          en: 'Belonging and Not',
          fr: 'Appartenir et Ne Pas',
          es: 'Pertenecer y No',
        },
        description: {
          en: 'The permanent in-between of the immigrant experience.',
          fr: 'L\'entre-deux permanent de l\'expérience immigrante.',
          es: 'El intermedio permanente de la experiencia inmigrante.',
        },
        text: {
          en: 'My parents have lived in Canada for forty years. They are citizens. But they are not Canadian. Not really. They still have accents. They still feel foreign. But they are not Lebanese anymore either. When they visit, people can tell. Too Western. They exist in between. Belonging fully to neither place. The first generation. The ones who left but never fully arrived. They do not regret coming. But they grieve what was lost. Forever suspended between two worlds. The permanent immigrant.',
          fr: 'Mes parents vivent au Canada depuis quarante ans. Mais ils ne sont pas canadiens. Pas vraiment. Mais ils ne sont plus libanais non plus. Ils existent entre les deux. L\'immigrant permanent.',
          es: 'Mis padres han vivido en Canadá durante cuarenta años. Pero no son canadienses. No realmente. Pero tampoco son libaneses. Existen en el medio. El inmigrante permanente.',
        },
        media: {
          ambient: {
            url: '/media/ambient/quiet-reflection.mp3',
          },
        },
        estimatedDuration: 3,
      },
      {
        id: 'first-gen-ch7',
        order: 7,
        title: {
          en: 'What They Gave Us',
          fr: 'Ce Qu\'ils Nous Ont Donné',
          es: 'Lo Que Nos Dieron',
        },
        description: {
          en: 'A reckoning with inheritance.',
          fr: 'Un règlement de comptes avec l\'héritage.',
          es: 'Un ajuste de cuentas con la herencia.',
        },
        text: {
          en: 'What did the first generation give us? Opportunity. Education. Safety. A Canadian passport. They gave us everything they did not have. But they also gave us complexity. Dual identity. Cultural confusion. The pressure to succeed. The guilt of privilege. They gave us English. But we lost Arabic. They gave us freedom. But we lost community. This is not criticism. It is acknowledgment. That immigration is trade-offs. The first generation gave us options they never had. And the burden of choosing. That is their gift. Complex. Painful. Profound. And ours to carry forward.',
          fr: 'Qu\'est-ce que la première génération nous a donné? Opportunité. Ils nous ont tout donné ce qu\'ils n\'avaient pas. Mais ils nous ont aussi donné la complexité. La première génération nous a donné des options qu\'ils n\'ont jamais eues. Et le fardeau de choisir. C\'est leur cadeau.',
          es: '¿Qué nos dio la primera generación? Oportunidad. Nos dieron todo lo que no tenían. Pero también nos dieron complejidad. La primera generación nos dio opciones que nunca tuvieron. Y la carga de elegir. Ese es su regalo.',
        },
        media: {
          ambient: {
            url: '/media/ambient/generational-echo.mp3',
          },
        },
        estimatedDuration: 4,
      },
    ],
  },
  {
    id: 'black-atlantic-canada',
    title: {
      en: 'Black Atlantic Canada',
      fr: 'Canada Atlantique Noir',
      es: 'Canadá Atlántico Negro',
    },
    description: {
      en: 'Six stories exploring the Caribbean-Canadian diaspora, maritime migration, and what it means to be Black and Atlantic in Canada.',
      fr: 'Six histoires explorant la diaspora caribéenne-canadienne, la migration maritime, et ce que signifie être Noir et Atlantique au Canada.',
      es: 'Seis historias explorando la diáspora caribeña-canadiense, la migración marítima, y qué significa ser Negro y Atlántico en Canadá.',
    },
    creator: {
      en: 'Maritime Voices Collective',
      fr: 'Collectif Voix Maritimes',
      es: 'Colectivo Voces Marítimas',
    },
    coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=1200&fit=crop',
    releaseDate: 'Nov 2025',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Migration & Diaspora', 'Identity & Belonging', 'Black Canadian Experience'],
    totalDuration: '63 min',
    chapterCount: 6,
    featured: false,
    new: false,
    trending: false,
    visibility: 'public',
    chapters: blackAtlanticCanadaChapters,
  },
  {
    id: 'what-we-carry',
    title: {
      en: 'What We Carry',
      fr: 'Ce Que Nous Portons',
      es: 'Lo Que Llevamos',
    },
    description: {
      en: 'Five meditations on intergenerational trauma, inherited pain, and the work of healing across generations.',
      fr: 'Cinq méditations sur le traumatisme intergénérationnel, la douleur héritée, et le travail de guérison à travers les générations.',
      es: 'Cinco meditaciones sobre trauma intergeneracional, dolor heredado, y el trabajo de sanación a través de generaciones.',
    },
    creator: {
      en: 'Healing Voices Collective',
      fr: 'Collectif Voix de Guérison',
      es: 'Colectivo Voces de Sanación',
    },
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1200&fit=crop',
    releaseDate: 'Dec 2025',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Family & Separation', 'Identity & Belonging', 'Healing & Resilience'],
    totalDuration: '53 min',
    chapterCount: 5,
    featured: false,
    new: false,
    trending: false,
    visibility: 'public',
    chapters: whatWeCarryChapters,
  },
  {
    id: 'small-histories',
    title: {
      en: 'Small Histories',
      fr: 'Petites Histoires',
      es: 'Pequeñas Historias',
    },
    description: {
      en: 'Six archival vignettes preserving the everyday moments that official history forgets.',
      fr: 'Six vignettes d\'archives préservant les moments quotidiens que l\'histoire officielle oublie.',
      es: 'Seis viñetas de archivo preservando los momentos cotidianos que la historia oficial olvida.',
    },
    creator: {
      en: 'Archive Keepers',
      fr: 'Gardiens d\'Archives',
      es: 'Guardianes de Archivos',
    },
    coverImage: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=800&h=1200&fit=crop',
    releaseDate: 'Oct 2025',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Place & Memory', 'Family & Separation', 'Preservation & Loss'],
    totalDuration: '63 min',
    chapterCount: 6,
    featured: false,
    new: false,
    trending: false,
    visibility: 'public',
    chapters: smallHistoriesChapters,
  },
  {
    id: 'work-worth',
    title: {
      en: 'Work / Worth',
      fr: 'Travail / Valeur',
      es: 'Trabajo / Valor',
    },
    description: {
      en: 'Five stories examining labor, value, and what we are worth in systems that undervalue us.',
      fr: 'Cinq histoires examinant le travail, la valeur, et ce que nous valons dans des systèmes qui nous sous-évaluent.',
      es: 'Cinco historias examinando trabajo, valor, y lo que valemos en sistemas que nos subvaloran.',
    },
    creator: {
      en: 'Workers Collective',
      fr: 'Collectif des Travailleurs',
      es: 'Colectivo de Trabajadores',
    },
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=1200&fit=crop',
    releaseDate: 'Jan 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Labor & Economics', 'Justice & Rights', 'Identity & Belonging'],
    totalDuration: '52 min',
    chapterCount: 5,
    featured: false,
    new: true,
    trending: false,
    visibility: 'public',
    chapters: workWorthChapters,
  },
];

// ============================================
// BUILD CHAPTER REGISTRY (Independent Chapter Access)
// ============================================

/**
 * Build an independent chapter registry from all story worlds
 * Enables querying chapters without accessing through story.chapters
 */
function buildChapterRegistry(): Map<string, Chapter> {
  const registry = new Map<string, Chapter>();

  for (const story of STORY_WORLDS) {
    if (story.chapters && Array.isArray(story.chapters)) {
      for (const chapter of story.chapters) {
        registry.set(chapter.id, chapter);
      }
    }
  }

  return registry;
}

// Pre-built registry for fast lookups
export const CHAPTERS_REGISTRY = buildChapterRegistry();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get text in preferred language with fallback
 */
export function getLocalizedText(text: MultilingualText, preferredLang: Language): string {
  // Try preferred language
  if (text[preferredLang]) {
    return text[preferredLang];
  }
  
  // Fallback to English
  if (text.en) {
    console.warn(`Missing translation for language: ${preferredLang}, falling back to English`);
    return text.en;
  }
  
  // Last resort: return any available language
  const available = text.fr || text.es || '';
  console.error(`Missing English translation, using fallback`);
  return available;
}

/**
 * Get story world by ID. Falls back to creator-published stories
 * (userStoriesService, a separate localStorage-backed store) when the id
 * isn't in the static curated catalog — those are always prefixed
 * "user_", so the fallback check is cheap for the common case.
 */
export function getStoryWorldById(id: string): StoryWorld | undefined {
  const curated = STORY_WORLDS.find(story => story.id === id);
  if (curated) return curated;
  if (id.startsWith('user_')) {
    return getUserStoryWorldById(id);
  }
  return undefined;
}

/**
 * Get chapters for a specific story. Curated stories store chapters as
 * registry references (resolved via CHAPTERS_REGISTRY); creator-published
 * stories embed full Chapter objects directly, so they're returned as-is.
 */
export function getChaptersForStory(storyWorldId: string): Chapter[] {
  const story = getStoryWorldById(storyWorldId);
  if (!story) return [];

  if (storyWorldId.startsWith('user_')) {
    return [...story.chapters].sort((a, b) => a.order - b.order);
  }

  // Return chapters in order by looking them up from registry
  return story.chapters
    .map(ch => CHAPTERS_REGISTRY.get(ch.id))
    .filter((ch): ch is Chapter => ch !== undefined)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get chapter by ID directly from registry (independent query).
 * Curated catalog only — creator-published chapters aren't registered
 * here since they're embedded directly in their StoryWorld.
 */
export function getChapterByIdDirect(chapterId: string): Chapter | undefined {
  return CHAPTERS_REGISTRY.get(chapterId);
}

/**
 * Get chapter by ID from story and chapter ID (backward compatible)
 */
export function getChapterById(storyWorldId: string, chapterId: string): Chapter | undefined {
  if (storyWorldId.startsWith('user_')) {
    const story = getStoryWorldById(storyWorldId);
    return story?.chapters.find(ch => ch.id === chapterId);
  }

  // Use the independent registry for faster lookup
  const chapter = CHAPTERS_REGISTRY.get(chapterId);

  // Verify chapter belongs to the requested story
  if (chapter) {
    const story = getStoryWorldById(storyWorldId);
    if (story?.chapters.some(ch => ch.id === chapterId)) {
      return chapter;
    }
  }

  return undefined;
}

/**
 * Get all public stories
 */
export function getPublicStories(): StoryWorld[] {
  return STORY_WORLDS.filter(story => story.visibility === 'public');
}

/**
 * Get stories by language
 */
export function getStoriesByLanguage(lang: Language): StoryWorld[] {
  return STORY_WORLDS.filter(story => story.languagesAvailable.includes(lang));
}

/**
 * Get featured stories
 */
export function getFeaturedStories(): StoryWorld[] {
  return STORY_WORLDS.filter(story => story.featured && story.visibility === 'public');
}

/**
 * Get next chapter in story
 */
export function getNextChapter(storyWorldId: string, currentChapterId: string): Chapter | undefined {
  const chapters = getChaptersForStory(storyWorldId);
  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);

  if (currentIndex >= 0 && currentIndex < chapters.length - 1) {
    return chapters[currentIndex + 1];
  }

  return undefined;
}

/**
 * Get previous chapter in story
 */
export function getPreviousChapter(storyWorldId: string, currentChapterId: string): Chapter | undefined {
  const chapters = getChaptersForStory(storyWorldId);
  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);

  if (currentIndex > 0) {
    return chapters[currentIndex - 1];
  }

  return undefined;
}

/**
 * Get all chapters for a story with their full data
 */
export function getAllChaptersForStory(storyWorldId: string): Chapter[] {
  return getChaptersForStory(storyWorldId);
}

/**
 * Get stories by theme
 */
export function getStoriesByTheme(theme: string): StoryWorld[] {
  return STORY_WORLDS.filter(story => 
    story.culturalThemes.some(t => t.toLowerCase().includes(theme.toLowerCase()))
  );
}
