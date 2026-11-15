/**
 * FUTURE STORY WORLDS — SEASONS 2, 3, 4
 * SEEN by CREOVA — Extended Planning Inventory
 * 
 * 18 additional Story Worlds across three future seasons
 * Status: Planned (NOT published, NOT in Explore/For You)
 */

import type { MultilingualText } from './types';
import type { FutureStoryWorld, SeasonAssignment, CommunityFocus, ContentFormat } from './futureStoryWorldsInventory';

// ============================================
// SEASON 2: BLACK FUTURES & MEMORY (6 stories)
// ============================================

export const SEASON_2_BLACK_FUTURES: FutureStoryWorld[] = [
  {
    storyWorldId: 's2-black-canadian-renaissance',
    workingTitle: {
      en: 'Black Canadian Renaissance: 1960s–1980s',
      fr: 'Renaissance Canadienne Noire: 1960s–1980s',
      es: 'Renacimiento Canadiense Negro: 1960s–1980s',
    },
    culturalTheme: 'Black Cultural Production & Arts Movements',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 7,
    season: 'Season 2',
    targetAudience: ['Black Canadian communities', 'Arts educators', 'Cultural workers'],
    editorialIntent: {
      en: 'The 1960s-1980s saw an explosion of Black Canadian cultural production: theater, literature, film, music. This was not copying American movements — it was distinctly Canadian, responding to Canadian racism. From Black Theatre Canada to Congress of Black Women to hip-hop\'s emergence in Toronto and Halifax.',
      fr: 'Les années 1960-1980 ont vu une explosion de production culturelle noire canadienne: théâtre, littérature, cinéma, musique. Ce n\'était pas copier les mouvements américains — c\'était distinctement canadien, répondant au racisme canadien. Du Black Theatre Canada au Congrès des Femmes Noires à l\'émergence du hip-hop à Toronto et Halifax.',
      es: 'Los 1960s-1980s vieron explosión de producción cultural canadiense negra: teatro, literatura, cine, música. Esto no era copiar movimientos estadounidenses — era distintivamente canadiense, respondiendo a racismo canadiense. Desde Black Theatre Canada hasta Congreso de Mujeres Negras hasta emergencia de hip-hop en Toronto y Halifax.',
    },
    status: 'Planned',
    planningNotes: 'Feature Dionne Brand, Austin Clarke, Djanet Sears, Michie Mee, Maestro Fresh Wes. Cover Black Film Workshop, Black Theatre Canada.',
    potentialPartners: ['MOCA', 'Black Canadian Studies programs'],
  },
  {
    storyWorldId: 's2-black-canadian-women-organizing',
    workingTitle: {
      en: 'Black Women Leading: Organizing in Canada',
      fr: 'Femmes Noires à la Tête: Organisation au Canada',
      es: 'Mujeres Negras Liderando: Organizando en Canadá',
    },
    culturalTheme: 'Black Feminist Organizing & Leadership',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Black women', 'Feminist organizers', 'Historians'],
    editorialIntent: {
      en: 'Black women have always led. From Congress of Black Women to Black Women\'s Collective to contemporary organizing, Black women built movements while facing racism AND sexism. This story centers their leadership, not as support but as architects.',
      fr: 'Les femmes noires ont toujours dirigé. Du Congrès des Femmes Noires au Collectif des Femmes Noires à l\'organisation contemporaine, les femmes noires ont construit des mouvements tout en faisant face au racisme ET au sexisme. Cette histoire centre leur leadership, pas comme soutien mais comme architectes.',
      es: 'Mujeres negras siempre han liderado. Desde Congreso de Mujeres Negras hasta Colectivo de Mujeres Negras hasta organización contemporánea, mujeres negras construyeron movimientos enfrentando racismo Y sexismo. Esta historia centra su liderazgo, no como apoyo sino como arquitectas.',
    },
    status: 'Planned',
    planningNotes: 'Feature Kay Livingstone, Rosemary Brown, Jean Augustine, Zanana Akande. Cover intersectionality, Black feminist thought.',
    potentialPartners: ['Black Women\'s organizations', 'Feminist archives'],
  },
  {
    storyWorldId: 's2-nova-scotia-black-communities',
    workingTitle: {
      en: 'Nova Scotia\'s Black Communities: Then and Now',
      fr: 'Communautés Noires de Nouvelle-Écosse: Hier et Aujourd\'hui',
      es: 'Comunidades Negras de Nueva Escocia: Entonces y Ahora',
    },
    culturalTheme: 'Black Nova Scotian History & Resilience',
    communityFocus: 'Black Canadian',
    format: 'hybrid',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Black Nova Scotians', 'History educators', 'General public'],
    editorialIntent: {
      en: 'Nova Scotia is home to Canada\'s oldest Black communities — over 50 settlements. From Birchtown to North Preston to Africville, these communities survived slavery\'s aftermath, systemic racism, and ongoing displacement. This story documents their strength.',
      fr: 'La Nouvelle-Écosse abrite les plus anciennes communautés noires du Canada — plus de 50 colonies. De Birchtown à North Preston à Africville, ces communautés ont survécu aux conséquences de l\'esclavage, au racisme systémique, et au déplacement continu. Cette histoire documente leur force.',
      es: 'Nueva Escocia alberga comunidades negras más antiguas de Canadá — más de 50 asentamientos. De Birchtown a North Preston a Africville, estas comunidades sobrevivieron secuelas de esclavitud, racismo sistémico, y desplazamiento continuo. Esta historia documenta su fuerza.',
    },
    status: 'Planned',
    planningNotes: 'Feature contemporary voices from North Preston, East Preston, Cherry Brook. Cover environmental racism, land rights, community pride.',
    potentialPartners: ['Black Cultural Centre for Nova Scotia', 'Community leaders'],
  },
  {
    storyWorldId: 's2-black-music-archives',
    workingTitle: {
      en: 'Frequencies of Resistance: Black Music in Canada',
      fr: 'Fréquences de Résistance: Musique Noire au Canada',
      es: 'Frecuencias de Resistencia: Música Negra en Canadá',
    },
    culturalTheme: 'Black Music & Sonic Archives',
    communityFocus: 'Black Canadian',
    format: 'audio',
    estimatedChapters: 8,
    season: 'Season 2',
    targetAudience: ['Music fans', 'Black communities', 'Cultural historians'],
    editorialIntent: {
      en: 'Black Canadian music is not derivative of American sound — it is original. From Oscar Peterson\'s jazz to Michie Mee\'s hip-hop to Drake\'s global dominance, Black musicians built Canadian sound. This audio experience archives their frequencies.',
      fr: 'La musique noire canadienne n\'est pas dérivée du son américain — elle est originale. Du jazz d\'Oscar Peterson au hip-hop de Michie Mee à la domination mondiale de Drake, les musiciens noirs ont construit le son canadien. Cette expérience audio archive leurs fréquences.',
      es: 'Música negra canadiense no es derivada de sonido estadounidense — es original. Desde jazz de Oscar Peterson hasta hip-hop de Michie Mee hasta dominio global de Drake, músicos negros construyeron sonido canadiense. Esta experiencia de audio archiva sus frecuencias.',
    },
    status: 'Planned',
    planningNotes: 'Audio-driven story with music samples, interviews, archival recordings. Feature Oscar Peterson, Liberty Silver, Maestro Fresh Wes, Michie Mee, Jully Black, The Weeknd.',
    potentialPartners: ['Black Music Archive', 'Music historians'],
  },
  {
    storyWorldId: 's2-haitian-canadian-migration',
    workingTitle: {
      en: 'Haitian Canada: Migration and Memory',
      fr: 'Canada Haïtien: Migration et Mémoire',
      es: 'Canadá Haitiano: Migración y Memoria',
    },
    culturalTheme: 'Haitian Diaspora in Canada',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 2',
    targetAudience: ['Haitian-Canadian communities', 'Migration scholars', 'General public'],
    editorialIntent: {
      en: 'Haitian migration to Canada accelerated after Duvalier\'s dictatorship and the 2010 earthquake. This story explores Haitian-Canadian identity, language (Kreyòl, French, English), family separation, and community-building in Montreal, Toronto, and Ottawa.',
      fr: 'La migration haïtienne vers le Canada s\'est accélérée après la dictature de Duvalier et le tremblement de terre de 2010. Cette histoire explore l\'identité haïtienne-canadienne, la langue (Kreyòl, français, anglais), la séparation familiale, et la construction communautaire à Montréal, Toronto, et Ottawa.',
      es: 'Migración haitiana a Canadá se aceleró después de dictadura de Duvalier y terremoto de 2010. Esta historia explora identidad haitiana-canadiense, idioma (Kreyòl, francés, inglés), separación familiar, y construcción comunitaria en Montreal, Toronto, y Ottawa.',
    },
    status: 'Planned',
    planningNotes: 'Feature Haitian-Canadian voices. Cover language preservation, Vodou spirituality, community organizations, anti-Black racism within broader Canadian society.',
    potentialPartners: ['Haitian Community Centre (Montreal)', 'Maison d\'Haïti'],
  },
  {
    storyWorldId: 's2-black-lgbtq-canada',
    workingTitle: {
      en: 'Black & Queer in Canada: Double Consciousness',
      fr: 'Noir et Queer au Canada: Double Conscience',
      es: 'Negro y Queer en Canadá: Doble Conciencia',
    },
    culturalTheme: 'Black LGBTQ2S+ Experiences',
    communityFocus: 'LGBTQ2S+ BIPOC',
    format: 'hybrid',
    estimatedChapters: 5,
    season: 'Season 2',
    targetAudience: ['Black LGBTQ2S+ people', 'Queer communities', 'Youth'],
    editorialIntent: {
      en: 'Black queer people navigate racism in LGBTQ spaces AND homophobia in Black spaces. This story centers Black queer voices resisting erasure from both communities while building their own spaces of safety and celebration.',
      fr: 'Les personnes queer noires naviguent le racisme dans les espaces LGBTQ ET l\'homophobie dans les espaces noirs. Cette histoire centre les voix queer noires résistant à l\'effacement des deux communautés tout en construisant leurs propres espaces de sécurité et de célébration.',
      es: 'Personas queer negras navegan racismo en espacios LGBTQ Y homofobia en espacios negros. Esta historia centra voces queer negras resistiendo borrado de ambas comunidades mientras construyen sus propios espacios de seguridad y celebración.',
    },
    status: 'Planned',
    planningNotes: 'Feature ballroom culture (Toronto), Black Pride, Black Cap collective. Address intersectionality, chosen family, HIV/AIDS legacy.',
    potentialPartners: ['Black Cap', 'Blackness Yes!', 'Black queer organizers (with consent)'],
  },
];

// ============================================
// SEASON 3: DIASPORA, MIGRATION, BELONGING (6 stories)
// ============================================

export const SEASON_3_DIASPORA_MIGRATION: FutureStoryWorld[] = [
  {
    storyWorldId: 's3-somali-canadian-diaspora',
    workingTitle: {
      en: 'Somali Canada: Refuge and Resilience',
      fr: 'Canada Somalien: Refuge et Résilience',
      es: 'Canadá Somalí: Refugio y Resiliencia',
    },
    culturalTheme: 'Somali Diaspora & Refugee Experience',
    communityFocus: 'Black Canadian',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 3',
    targetAudience: ['Somali-Canadian communities', 'Refugee advocates', 'Youth'],
    editorialIntent: {
      en: 'Somali Canadians fled civil war seeking safety. Many found precarity instead: Islamophobia, anti-Black racism, family separation. Yet they built community. This story documents survival, resilience, and the meaning of home when you cannot return.',
      fr: 'Les Canadiens somaliens ont fui la guerre civile cherchant la sécurité. Beaucoup ont trouvé la précarité à la place: islamophobie, racisme anti-noir, séparation familiale. Pourtant, ils ont construit une communauté. Cette histoire documente la survie, la résilience, et le sens du foyer quand on ne peut pas retourner.',
      es: 'Canadienses somalíes huyeron de guerra civil buscando seguridad. Muchos encontraron precariedad en cambio: islamofobia, racismo anti-negro, separación familiar. Sin embargo, construyeron comunidad. Esta historia documenta supervivencia, resiliencia, y significado de hogar cuando no puedes regresar.',
    },
    status: 'Planned',
    planningNotes: 'Feature Somali-Canadian youth voices. Cover Toronto, Ottawa, Edmonton communities. Address Islamophobia, anti-Black racism, cultural preservation.',
    potentialPartners: ['Somali Centre for Family Services', 'Community organizations'],
  },
  {
    storyWorldId: 's3-filipino-canadian-migration',
    workingTitle: {
      en: 'Filipino Canada: Beyond the Caregiver Narrative',
      fr: 'Canada Philippin: Au-Delà du Récit de Soignant',
      es: 'Canadá Filipino: Más Allá de la Narrativa de Cuidador',
    },
    culturalTheme: 'Filipino Diaspora & Labor Migration',
    communityFocus: 'Asian Diaspora',
    format: 'story',
    estimatedChapters: 7,
    season: 'Season 3',
    targetAudience: ['Filipino-Canadian communities', 'Labor advocates', 'Migration scholars'],
    editorialIntent: {
      en: 'Canada reduced Filipino migrants to "caregivers" — temporary workers, family separation, delayed citizenship. This story refuses that reduction. Filipino Canadians are nurses, artists, organizers, community builders. They are not just labor.',
      fr: 'Le Canada a réduit les migrants philippins à des "soignants" — travailleurs temporaires, séparation familiale, citoyenneté retardée. Cette histoire refuse cette réduction. Les Canadiens philippins sont des infirmières, des artistes, des organisateurs, des bâtisseurs de communauté. Ils ne sont pas juste du travail.',
      es: 'Canadá redujo migrantes filipinos a "cuidadores" — trabajadores temporales, separación familiar, ciudadanía retrasada. Esta historia rechaza esa reducción. Canadienses filipinos son enfermeras, artistas, organizadores, constructores de comunidad. No son solo mano de obra.',
    },
    status: 'Planned',
    planningNotes: 'Feature Live-In Caregiver Program history, family separation stories, contemporary organizing. Celebrate Filipino arts, festivals (Mabuhay Toronto).',
    potentialPartners: ['Filipino Community Centres', 'Migrante Canada'],
  },
  {
    storyWorldId: 's3-vietnamese-canadian-refugees',
    workingTitle: {
      en: 'Boat People: Vietnamese Canadian Refugees',
      fr: 'Boat People: Réfugiés Canadiens Vietnamiens',
      es: 'Boat People: Refugiados Canadienses Vietnamitas',
    },
    culturalTheme: 'Vietnamese Refugee Experience in Canada',
    communityFocus: 'Asian Diaspora',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 3',
    targetAudience: ['Vietnamese-Canadian communities', 'Refugee advocates', 'Educators'],
    editorialIntent: {
      en: 'After the Vietnam War, over 60,000 Vietnamese refugees came to Canada. They were called "boat people" — survivors of sea crossings, refugee camps, trauma. This story honors their survival and documents how they built new homes while carrying memory.',
      fr: 'Après la guerre du Vietnam, plus de 60,000 réfugiés vietnamiens sont venus au Canada. Ils étaient appelés "boat people" — survivants de traversées maritimes, camps de réfugiés, traumatismes. Cette histoire honore leur survie et documente comment ils ont construit de nouveaux foyers tout en portant la mémoire.',
      es: 'Después de Guerra de Vietnam, más de 60,000 refugiados vietnamitas llegaron a Canadá. Fueron llamados "boat people" — sobrevivientes de travesías marítimas, campos de refugiados, trauma. Esta historia honra su supervivencia y documenta cómo construyeron nuevos hogares mientras llevaban memoria.',
    },
    status: 'Planned',
    planningNotes: 'Feature first-generation voices. Cover refugee camps, sponsorship programs, language barriers, intergenerational trauma, community building in Toronto, Calgary, Montreal.',
    potentialPartners: ['Vietnamese Association Toronto', 'Refugee advocacy groups'],
  },
  {
    storyWorldId: 's3-arab-canadian-identity',
    workingTitle: {
      en: 'Arab Canada: Between Whiteness and BIPOC',
      fr: 'Canada Arabe: Entre Blancheur et PANDC',
      es: 'Canadá Árabe: Entre Blancura y BIPOC',
    },
    culturalTheme: 'Arab Canadian Identity & Racialization',
    communityFocus: 'Asian Diaspora',
    format: 'hybrid',
    estimatedChapters: 5,
    season: 'Season 3',
    targetAudience: ['Arab-Canadian communities', 'Diaspora scholars', 'Youth'],
    editorialIntent: {
      en: 'Arab Canadians exist in racial limbo — not white, not always seen as BIPOC, always marked by Islamophobia and Orientalism. This story explores Arab-Canadian identity, anti-Arab racism, and the question: where do we belong?',
      fr: 'Les Canadiens arabes existent dans un vide racial — pas blancs, pas toujours vus comme PANDC, toujours marqués par l\'islamophobie et l\'orientalisme. Cette histoire explore l\'identité arabe-canadienne, le racisme anti-arabe, et la question: où appartenons-nous?',
      es: 'Canadienses árabes existen en limbo racial — no blancos, no siempre vistos como BIPOC, siempre marcados por islamofobia y orientalismo. Esta historia explora identidad canadiense árabe, racismo anti-árabe, y pregunta: ¿dónde pertenecemos?',
    },
    status: 'Planned',
    planningNotes: 'Feature Lebanese, Syrian, Palestinian, Egyptian, Iraqi voices. Cover post-9/11 surveillance, war on terror impact, cultural pride, youth identity negotiation.',
    potentialPartners: ['Arab Community Centre', 'Muslim organizations'],
  },
  {
    storyWorldId: 's3-latin-american-canada',
    workingTitle: {
      en: 'Latin American Canada: Refuge from US Empire',
      fr: 'Canada Latino-Américain: Refuge de l\'Empire US',
      es: 'Canadá Latinoamericano: Refugio del Imperio de EE.UU.',
    },
    culturalTheme: 'Latin American Migration & Political Refuge',
    communityFocus: 'Cross-Cultural Solidarity',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 3',
    targetAudience: ['Latin American communities', 'Political refugees', 'Solidarity activists'],
    editorialIntent: {
      en: 'Latin Americans fled to Canada escaping US-backed coups, wars, violence: Chile, El Salvador, Guatemala, Nicaragua, Colombia. Canada was refuge — but also complicit. This story documents migration, solidarity organizing, and building home in diaspora.',
      fr: 'Les Latino-Américains ont fui vers le Canada échappant aux coups d\'État soutenus par les États-Unis, guerres, violence: Chili, El Salvador, Guatemala, Nicaragua, Colombie. Le Canada était refuge — mais aussi complice. Cette histoire documente la migration, l\'organisation solidaire, et la construction de foyer en diaspora.',
      es: 'Latinoamericanos huyeron a Canadá escapando golpes respaldados por EE.UU., guerras, violencia: Chile, El Salvador, Guatemala, Nicaragua, Colombia. Canadá fue refugio — pero también cómplice. Esta historia documenta migración, organización solidaria, y construcción de hogar en diáspora.',
    },
    status: 'Planned',
    planningNotes: 'Feature Chilean, Salvadoran, Guatemalan refugee voices. Cover solidarity movements, cultural preservation, intergenerational memory of violence.',
    potentialPartners: ['Latin American solidarity organizations', 'Refugee advocates'],
  },
  {
    storyWorldId: 's3-mixed-diaspora-identity',
    workingTitle: {
      en: 'Mixed: Navigating Multiple Diasporas',
      fr: 'Mixte: Naviguer Plusieurs Diasporas',
      es: 'Mixto: Navegando Múltiples Diásporas',
    },
    culturalTheme: 'Mixed Heritage & Diaspora Identity',
    communityFocus: 'Cross-Cultural Solidarity',
    format: 'hybrid',
    estimatedChapters: 5,
    season: 'Season 3',
    targetAudience: ['Mixed-heritage youth', 'Diaspora communities', 'Educators'],
    editorialIntent: {
      en: 'Mixed-heritage people navigate multiple worlds — never fully claimed by one, questioned by all. This story centers voices of Black-Asian, Indigenous-Asian, Arab-Black, and other mixed identities refusing to choose.',
      fr: 'Les personnes d\'héritage mixte naviguent plusieurs mondes — jamais pleinement réclamées par un, questionnées par tous. Cette histoire centre les voix d\'identités mixtes Noir-Asiatique, Autochtone-Asiatique, Arabe-Noir, et autres refusant de choisir.',
      es: 'Personas de herencia mixta navegan múltiples mundos — nunca completamente reclamadas por uno, cuestionadas por todos. Esta historia centra voces de identidades mixtas Negro-Asiático, Indígena-Asiático, Árabe-Negro, y otras rechazando elegir.',
    },
    status: 'Planned',
    planningNotes: 'Feature mixed-heritage youth voices. Cover identity negotiation, cultural belonging, anti-Blackness in non-Black communities, solidarity building.',
    potentialPartners: ['Mixed-heritage community groups', 'Youth organizers'],
  },
];

// ============================================
// SEASON 4: YOUTH, CULTURE, TOMORROW (6 stories)
// ============================================

export const SEASON_4_YOUTH_CULTURE_TOMORROW: FutureStoryWorld[] = [
  {
    storyWorldId: 's4-bipoc-climate-justice',
    workingTitle: {
      en: 'Climate Justice is Racial Justice',
      fr: 'Justice Climatique est Justice Raciale',
      es: 'Justicia Climática es Justicia Racial',
    },
    culturalTheme: 'BIPOC Youth Climate Organizing',
    communityFocus: 'Youth & Intergenerational',
    format: 'hybrid',
    estimatedChapters: 6,
    season: 'Season 4',
    targetAudience: ['Climate activists', 'BIPOC youth', 'Educators'],
    editorialIntent: {
      en: 'Climate change is not race-neutral. BIPOC communities face environmental racism, displacement, and disproportionate harm. BIPOC youth are leading climate justice movements — not as symbols, but as strategists. This story centers their organizing.',
      fr: 'Le changement climatique n\'est pas neutre sur le plan racial. Les communautés PANDC font face au racisme environnemental, au déplacement, et à des dommages disproportionnés. La jeunesse PANDC mène les mouvements de justice climatique — pas comme symboles, mais comme stratèges. Cette histoire centre leur organisation.',
      es: 'Cambio climático no es neutral en raza. Comunidades BIPOC enfrentan racismo ambiental, desplazamiento, y daño desproporcionado. Juventud BIPOC lidera movimientos de justicia climática — no como símbolos, sino como estrategas. Esta historia centra su organización.',
    },
    status: 'Planned',
    planningNotes: 'Feature Fridays for Future chapters, Indigenous climate activism, environmental racism campaigns. Cover intersections of climate, race, class.',
    potentialPartners: ['Climate Justice Toronto', 'Indigenous Climate Action'],
  },
  {
    storyWorldId: 's4-digital-sovereignty',
    workingTitle: {
      en: 'Digital Futures: BIPOC Tech Sovereignty',
      fr: 'Avenirs Numériques: Souveraineté Technologique PANDC',
      es: 'Futuros Digitales: Soberanía Tecnológica BIPOC',
    },
    culturalTheme: 'Technology, Surveillance, Digital Rights',
    communityFocus: 'Youth & Intergenerational',
    format: 'story',
    estimatedChapters: 5,
    season: 'Season 4',
    targetAudience: ['Tech workers', 'Digital rights advocates', 'BIPOC youth'],
    editorialIntent: {
      en: 'Big Tech surveils BIPOC communities, amplifies hate, and extracts data. But BIPOC technologists are building alternatives: privacy-first platforms, community-owned networks, digital sovereignty. This story imagines liberatory tech futures.',
      fr: 'Les Big Tech surveillent les communautés PANDC, amplifient la haine, et extraient des données. Mais les technologues PANDC construisent des alternatives: plateformes axées sur la confidentialité, réseaux communautaires, souveraineté numérique. Cette histoire imagine des avenirs technologiques libérateurs.',
      es: 'Grandes Tecnológicas vigilan comunidades BIPOC, amplifican odio, y extraen datos. Pero tecnólogos BIPOC están construyendo alternativas: plataformas centradas en privacidad, redes comunitarias, soberanía digital. Esta historia imagina futuros tecnológicos liberadores.',
    },
    status: 'Planned',
    planningNotes: 'Feature BIPOC tech workers, digital rights organizers, community networks. Cover surveillance capitalism, algorithmic bias, tech justice.',
    potentialPartners: ['Citizen Lab', 'Digital rights organizations'],
  },
  {
    storyWorldId: 's4-afrofuturism-canada',
    workingTitle: {
      en: 'Afrofuturism North: Black Canadian Sci-Fi',
      fr: 'Afrofuturisme du Nord: Science-Fiction Canadienne Noire',
      es: 'Afrofuturismo Norte: Ciencia Ficción Canadiense Negra',
    },
    culturalTheme: 'Afrofuturism & Speculative Fiction',
    communityFocus: 'Black Canadian',
    format: 'hybrid',
    estimatedChapters: 7,
    season: 'Season 4',
    targetAudience: ['Black youth', 'Sci-fi fans', 'Cultural creatives'],
    editorialIntent: {
      en: 'Afrofuturism imagines Black futures beyond survival. Black Canadian artists, writers, musicians create speculative worlds where Blackness thrives. This story explores Afrofuturism as resistance, imagination, and world-building.',
      fr: 'L\'afrofuturisme imagine des avenirs noirs au-delà de la survie. Les artistes, écrivains, musiciens noirs canadiens créent des mondes spéculatifs où la noirceur prospère. Cette histoire explore l\'afrofuturisme comme résistance, imagination, et construction de monde.',
      es: 'Afrofuturismo imagina futuros negros más allá de supervivencia. Artistas, escritores, músicos negros canadienses crean mundos especulativos donde negritud prospera. Esta historia explora afrofuturismo como resistencia, imaginación, y construcción de mundos.',
    },
    status: 'Planned',
    planningNotes: 'Feature Black Canadian sci-fi writers (Nalo Hopkinson), musicians, visual artists. Cover Afrofuturism as methodology, not genre.',
    potentialPartners: ['Black speculative fiction communities', 'Arts organizations'],
  },
  {
    storyWorldId: 's4-indigenous-futurities',
    workingTitle: {
      en: 'Indigenous Futurities: Beyond Survival',
      fr: 'Futurités Autochtones: Au-Delà de la Survie',
      es: 'Futuridades Indígenas: Más Allá de Supervivencia',
    },
    culturalTheme: 'Indigenous Futurism & Sovereignty',
    communityFocus: 'Indigenous',
    format: 'hybrid',
    estimatedChapters: 6,
    season: 'Season 4',
    targetAudience: ['Indigenous youth', 'Futurist thinkers', 'Educators'],
    editorialIntent: {
      en: 'Indigenous futurism imagines Indigenous worlds not defined by colonization. It is land return, language revival, technological sovereignty, and cultural resurgence. This story centers Indigenous youth building futures on their own terms.',
      fr: 'Le futurisme autochtone imagine des mondes autochtones non définis par la colonisation. C\'est le retour de la terre, la revitalisation linguistique, la souveraineté technologique, et la résurgence culturelle. Cette histoire centre la jeunesse autochtone construisant des avenirs selon leurs propres termes.',
      es: 'Futurismo indígena imagina mundos indígenas no definidos por colonización. Es retorno de tierra, revitalización de idioma, soberanía tecnológica, y resurgimiento cultural. Esta historia centra juventud indígena construyendo futuros en sus propios términos.',
    },
    status: 'Planned',
    planningNotes: 'Feature Indigenous futurist artists, technologists, organizers. Cover Indigenous sci-fi, digital sovereignty, land-based futures.',
    potentialPartners: ['Indigenous youth organizations', 'Futurist collectives'],
  },
  {
    storyWorldId: 's4-abolition-futures',
    workingTitle: {
      en: 'Abolition: Imagining Safety Without Police',
      fr: 'Abolition: Imaginer la Sécurité Sans Police',
      es: 'Abolición: Imaginando Seguridad Sin Policía',
    },
    culturalTheme: 'Abolitionist Organizing & Transformative Justice',
    communityFocus: 'Cross-Cultural Solidarity',
    format: 'story',
    estimatedChapters: 6,
    season: 'Season 4',
    targetAudience: ['Abolitionists', 'Community organizers', 'Youth'],
    editorialIntent: {
      en: 'Abolition is not absence — it is presence of care, accountability, community safety beyond police and prisons. BIPOC organizers are building abolitionist futures now: community care networks, transformative justice, mutual aid. This story documents their vision.',
      fr: 'L\'abolition n\'est pas l\'absence — c\'est la présence de soins, responsabilité, sécurité communautaire au-delà de la police et des prisons. Les organisateurs PANDC construisent des avenirs abolitionnistes maintenant: réseaux de soins communautaires, justice transformatrice, aide mutuelle. Cette histoire documente leur vision.',
      es: 'Abolición no es ausencia — es presencia de cuidado, responsabilidad, seguridad comunitaria más allá de policía y prisiones. Organizadores BIPOC están construyendo futuros abolicionistas ahora: redes de cuidado comunitario, justicia transformativa, ayuda mutua. Esta historia documenta su visión.',
    },
    status: 'Planned',
    planningNotes: 'Feature abolition organizers (with consent). Cover defund movements, community accountability, transformative justice models, mutual aid.',
    potentialPartners: ['Abolition organizations', 'Transformative justice practitioners'],
  },
  {
    storyWorldId: 's4-cultural-workers-futures',
    workingTitle: {
      en: 'Cultural Workers: Building Tomorrow\'s Archives',
      fr: 'Travailleurs Culturels: Construire les Archives de Demain',
      es: 'Trabajadores Culturales: Construyendo Archivos del Mañana',
    },
    culturalTheme: 'Cultural Production & Archiving',
    communityFocus: 'Cross-Cultural Solidarity',
    format: 'hybrid',
    estimatedChapters: 5,
    season: 'Season 4',
    targetAudience: ['Artists', 'Cultural workers', 'Archivists', 'Youth'],
    editorialIntent: {
      en: 'BIPOC cultural workers — artists, writers, filmmakers, musicians, archivists — are building tomorrow\'s cultural memory. They refuse erasure by creating, documenting, and preserving. This story honors their labor and vision.',
      fr: 'Les travailleurs culturels PANDC — artistes, écrivains, cinéastes, musiciens, archivistes — construisent la mémoire culturelle de demain. Ils refusent l\'effacement en créant, documentant, et préservant. Cette histoire honore leur travail et leur vision.',
      es: 'Trabajadores culturales BIPOC — artistas, escritores, cineastas, músicos, archivistas — están construyendo memoria cultural del mañana. Rechazan borrado creando, documentando, y preservando. Esta historia honra su trabajo y visión.',
    },
    status: 'Planned',
    planningNotes: 'Feature BIPOC artists, zine makers, community archivists, cultural organizers. Cover cultural production as resistance, archiving as survival.',
    potentialPartners: ['Arts collectives', 'Community archives', 'Cultural workers'],
  },
];

// ============================================
// COMBINED EXTENDED INVENTORY
// ============================================

export const EXTENDED_FUTURE_STORY_WORLDS: FutureStoryWorld[] = [
  ...SEASON_2_BLACK_FUTURES,
  ...SEASON_3_DIASPORA_MIGRATION,
  ...SEASON_4_YOUTH_CULTURE_TOMORROW,
];

// ============================================
// SUMMARY STATISTICS
// ============================================

export const EXTENDED_INVENTORY_SUMMARY = {
  totalNewStories: EXTENDED_FUTURE_STORY_WORLDS.length,
  
  bySeason: {
    'Season 2': SEASON_2_BLACK_FUTURES.length,
    'Season 3': SEASON_3_DIASPORA_MIGRATION.length,
    'Season 4': SEASON_4_YOUTH_CULTURE_TOMORROW.length,
  },
  
  byFocus: {
    'Black Canadian': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Black Canadian').length,
    'Indigenous': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Indigenous').length,
    'Asian Diaspora': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Asian Diaspora').length,
    'Cross-Cultural Solidarity': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Cross-Cultural Solidarity').length,
    'LGBTQ2S+ BIPOC': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'LGBTQ2S+ BIPOC').length,
    'Youth & Intergenerational': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Youth & Intergenerational').length,
  },
  
  byFormat: {
    'story': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.format === 'story').length,
    'audio': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.format === 'audio').length,
    'hybrid': EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.format === 'hybrid').length,
  },
  
  totalEstimatedChapters: EXTENDED_FUTURE_STORY_WORLDS.reduce((sum, s) => sum + s.estimatedChapters, 0),
};

// ============================================
// VALIDATION
// ============================================

export const EXTENDED_VALIDATION_REPORT = {
  totalPlannedStories: EXTENDED_FUTURE_STORY_WORLDS.length,
  
  blackCanadianCount: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Black Canadian').length,
  indigenousCount: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Indigenous').length,
  asianDiasporaCount: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Asian Diaspora').length,
  solidarityCount: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Cross-Cultural Solidarity').length,
  
  meetsRequirements: {
    blackCanadian: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Black Canadian').length >= 8,
    indigenous: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Indigenous').length >= 4,
    asianDiaspora: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Asian Diaspora').length >= 4,
    solidarity: EXTENDED_FUTURE_STORY_WORLDS.filter(s => s.communityFocus === 'Cross-Cultural Solidarity').length >= 2,
  },
};

console.log('[Future Seasons] Extended inventory loaded:', EXTENDED_INVENTORY_SUMMARY);
console.log('[Future Seasons] Requirements validation:', EXTENDED_VALIDATION_REPORT);
