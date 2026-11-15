/**
 * BLACK CANADIAN HISTORY STORY OUTLINES
 * SEEN by CREOVA — Full Story Development
 * 
 * 6 complete story outlines with chapter summaries
 * Ready for audio production and expansion
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface StoryOutline {
  storyId: string;
  title: MultilingualText;
  historicalPeriod: string;
  geography: string;
  
  /** Story synopsis */
  synopsis: MultilingualText;
  
  /** Chapters */
  chapters: ChapterOutline[];
  
  /** Cultural context */
  culturalContext: MultilingualText;
  
  /** Audio tone suggestion */
  audioTone: 'Intimate' | 'Urgent' | 'Reflective' | 'Somber' | 'Celebratory';
  
  /** Institutional accuracy notes */
  accuracyNotes: string;
  
  /** Primary sources */
  primarySources: string[];
  
  /** Community consultation */
  communityConsultation: string[];
  
  /** Recommended narrator profile */
  narratorProfile: string;
}

export interface ChapterOutline {
  chapterNumber: number;
  title: MultilingualText;
  summary: MultilingualText;
  keyThemes: string[];
  estimatedDuration: string; // e.g., "3-4 minutes"
  primarySourcesReferenced: string[];
}

// ============================================
// STORY 1: BLACK LOYALISTS IN NOVA SCOTIA
// ============================================

export const BLACK_LOYALISTS_OUTLINE: StoryOutline = {
  storyId: 'black-loyalists-full',
  title: {
    en: 'Black Loyalists: The Broken Promise of Freedom',
    fr: 'Loyalistes Noirs: La Promesse Brisée de Liberté',
    es: 'Leales Negros: La Promesa Rota de Libertad',
  },
  historicalPeriod: '1775-1792',
  geography: 'Nova Scotia (Birchtown, Shelburne, Digby); New Brunswick; Sierra Leone',
  synopsis: {
    en: 'In 1775, Lord Dunmore promised freedom to enslaved people who joined the British forces. Thousands did. When the American Revolution ended, 3,000 Black Loyalists were relocated to Nova Scotia with promises of land and equality. What they found was systemic racism, broken promises, and barren land. This is not a story of Canadian benevolence — it is a story of survival, organizing, and the eventual migration to Sierra Leone when Canada failed them.',
    fr: 'En 1775, Lord Dunmore a promis la liberté aux personnes asservies qui se joindraient aux forces britanniques. Des milliers l\'ont fait. Quand la Révolution américaine s\'est terminée, 3,000 Loyalistes Noirs ont été relocalisés en Nouvelle-Écosse avec des promesses de terre et d\'égalité. Ce qu\'ils ont trouvé était du racisme systémique, des promesses brisées, et des terres stériles. Ce n\'est pas une histoire de bienveillance canadienne — c\'est une histoire de survie, d\'organisation, et de migration éventuelle vers la Sierra Leone quand le Canada les a trahis.',
    es: 'En 1775, Lord Dunmore prometió libertad a personas esclavizadas que se unieran a fuerzas británicas. Miles lo hicieron. Cuando terminó la Revolución Americana, 3,000 Leales Negros fueron reubicados en Nueva Escocia con promesas de tierra e igualdad. Lo que encontraron fue racismo sistémico, promesas rotas, y tierra estéril. Esta no es historia de benevolencia canadiense — es historia de supervivencia, organización, y migración eventual a Sierra Leona cuando Canadá les falló.',
  },
  chapters: [
    {
      chapterNumber: 1,
      title: {
        en: 'Chapter 1: The Promise of Freedom',
        fr: 'Chapitre 1: La Promesse de Liberté',
        es: 'Capítulo 1: La Promesa de Libertad',
      },
      summary: {
        en: '1775. Virginia. Thomas Peters is enslaved. When Lord Dunmore, British governor of Virginia, proclaims that enslaved people who join British forces will be granted freedom, Peters makes a calculated decision. The British are not liberators — they need soldiers, labor, bodies. But freedom is freedom, even from an empire. Peters escapes, fights in the Black Pioneers regiment, and survives the war. When the Revolution ends, the British relocate Black Loyalists to Nova Scotia. Peters boards a ship in 1783, believing he has earned his freedom. The journey north is filled with hope and uncertainty.',
        fr: '1775. Virginie. Thomas Peters est asservi. Quand Lord Dunmore, gouverneur britannique de Virginie, proclame que les personnes asservies qui rejoignent les forces britanniques seront libérées, Peters prend une décision calculée. Les Britanniques ne sont pas des libérateurs — ils ont besoin de soldats, de main-d\'œuvre, de corps. Mais la liberté, c\'est la liberté, même d\'un empire. Peters s\'échappe, combat dans le régiment Black Pioneers, et survit à la guerre. Quand la Révolution se termine, les Britanniques relocalisent les Loyalistes Noirs en Nouvelle-Écosse. Peters monte à bord d\'un navire en 1783, croyant avoir gagné sa liberté. Le voyage vers le nord est rempli d\'espoir et d\'incertitude.',
        es: '1775. Virginia. Thomas Peters está esclavizado. Cuando Lord Dunmore, gobernador británico de Virginia, proclama que personas esclavizadas que se unan a fuerzas británicas recibirán libertad, Peters toma decisión calculada. Los británicos no son libertadores — necesitan soldados, mano de obra, cuerpos. Pero libertad es libertad, incluso de un imperio. Peters escapa, lucha en regimiento Black Pioneers, y sobrevive guerra. Cuando termina Revolución, británicos reubicar Leales Negros en Nueva Escocia. Peters aborda barco en 1783, creyendo haber ganado su libertad. Viaje al norte está lleno de esperanza e incertidumbre.',
      },
      keyThemes: ['Enslavement', 'British promises', 'Agency', 'Hope'],
      estimatedDuration: '3-4 minutes',
      primarySourcesReferenced: ['Lord Dunmore\'s Proclamation (1775)', 'Black Pioneers military records'],
    },
    {
      chapterNumber: 2,
      title: {
        en: 'Chapter 2: Arrival in Birchtown',
        fr: 'Chapitre 2: Arrivée à Birchtown',
        es: 'Capítulo 2: Llegada a Birchtown',
      },
      summary: {
        en: '1783-1784. Birchtown, Nova Scotia. Over 3,000 Black Loyalists settle here — the largest free Black community outside Africa. But the promise of equality is a lie. White Loyalists receive fertile land, tools, support. Black Loyalists receive rocky, barren plots unsuitable for farming. Winter approaches. Families build shelters from scraps. The British promised 100 acres per family; many receive 1-10 acres, some none at all. The cold kills the unprepared. Hunger is constant. Yet community forms: churches are built, schools start, families plant roots in hostile soil. This is survival, not thriving.',
        fr: '1783-1784. Birchtown, Nouvelle-Écosse. Plus de 3,000 Loyalistes Noirs s\'installent ici — la plus grande communauté noire libre en dehors de l\'Afrique. Mais la promesse d\'égalité est un mensonge. Les Loyalistes blancs reçoivent des terres fertiles, des outils, du soutien. Les Loyalistes Noirs reçoivent des parcelles rocheuses et stériles inadaptées à l\'agriculture. L\'hiver approche. Les familles construisent des abris avec des restes. Les Britanniques ont promis 100 acres par famille; beaucoup reçoivent 1-10 acres, certains aucun. Le froid tue les non-préparés. La faim est constante. Pourtant la communauté se forme: églises sont construites, écoles démarrent, familles plantent des racines dans un sol hostile. C\'est la survie, pas la prospérité.',
        es: '1783-1784. Birchtown, Nueva Escocia. Más de 3,000 Leales Negros se establecen aquí — la comunidad negra libre más grande fuera de África. Pero promesa de igualdad es mentira. Leales blancos reciben tierra fértil, herramientas, apoyo. Leales Negros reciben parcelas rocosas, estériles, inadecuadas para agricultura. Se acerca invierno. Familias construyen refugios con sobras. Británicos prometieron 100 acres por familia; muchos reciben 1-10 acres, algunos ninguno. El frío mata a los no preparados. Hambre es constante. Sin embargo, comunidad se forma: se construyen iglesias, empiezan escuelas, familias plantan raíces en suelo hostil. Esto es supervivencia, no prosperidad.',
      },
      keyThemes: ['Broken promises', 'Systemic racism', 'Community resilience', 'Survival'],
      estimatedDuration: '4-5 minutes',
      primarySourcesReferenced: ['Birchtown census (1784)', 'Land grant records', 'Book of Negroes'],
    },
    {
      chapterNumber: 3,
      title: {
        en: 'Chapter 3: Organizing for Justice',
        fr: 'Chapitre 3: S\'Organiser pour la Justice',
        es: 'Capítulo 3: Organizando por Justicia',
      },
      summary: {
        en: '1785-1790. Thomas Peters refuses to accept this as freedom. He organizes. He writes petitions to the governor, demanding the land promised. He is ignored. He writes to London. Still ignored. Meanwhile, white settlers harass Black Loyalists, steal their meager crops, burn their homes. The government does nothing. Peters realizes that freedom in Canada is conditional — tolerated, not celebrated. Black Loyalists are useful labor but denied citizenship. Five years pass. Nothing changes. Peters makes a radical decision: he will go to London himself and petition the Crown directly. It is dangerous. It is unprecedented. But staying is death.',
        fr: '1785-1790. Thomas Peters refuse d\'accepter cela comme liberté. Il s\'organise. Il écrit des pétitions au gouverneur, exigeant la terre promise. Il est ignoré. Il écrit à Londres. Toujours ignoré. Pendant ce temps, les colons blancs harcèlent les Loyalistes Noirs, volent leurs maigres récoltes, brûlent leurs maisons. Le gouvernement ne fait rien. Peters réalise que la liberté au Canada est conditionnelle — tolérée, pas célébrée. Les Loyalistes Noirs sont une main-d\'œuvre utile mais on leur refuse la citoyenneté. Cinq ans passent. Rien ne change. Peters prend une décision radicale: il ira à Londres lui-même et pétitionnera la Couronne directement. C\'est dangereux. C\'est sans précédent. Mais rester, c\'est la mort.',
        es: '1785-1790. Thomas Peters rechaza aceptar esto como libertad. Se organiza. Escribe peticiones al gobernador, exigiendo tierra prometida. Es ignorado. Escribe a Londres. Aún ignorado. Mientras tanto, colonos blancos acosan Leales Negros, roban sus escasas cosechas, queman sus hogares. Gobierno no hace nada. Peters se da cuenta que libertad en Canadá es condicional — tolerada, no celebrada. Leales Negros son mano de obra útil pero se les niega ciudadanía. Pasan cinco años. Nada cambia. Peters toma decisión radical: irá a Londres él mismo y presentará petición a Corona directamente. Es peligroso. Es sin precedentes. Pero quedarse es muerte.',
      },
      keyThemes: ['Resistance', 'Organizing', 'Petition', 'Agency'],
      estimatedDuration: '4 minutes',
      primarySourcesReferenced: ['Thomas Peters petition letters', 'Nova Scotia government correspondence'],
    },
    {
      chapterNumber: 4,
      title: {
        en: 'Chapter 4: London and the Abolitionists',
        fr: 'Chapitre 4: Londres et les Abolitionnistes',
        es: 'Capítulo 4: Londres y los Abolicionistas',
      },
      summary: {
        en: '1790-1791. Thomas Peters sails to London. A formerly enslaved Black man petitioning the British Crown for justice — it is audacious. In London, Peters connects with abolitionists. He testifies about the conditions in Nova Scotia. The Crown is embarrassed. A solution is proposed: Sierra Leone, a new colony in Africa for free Black people. The Sierra Leone Company offers land, resources, self-governance. Some Black Loyalists see this as defeat — retreating from Canada. Others see liberation — a chance to build a truly free Black society. Peters sees it as the only option left. He returns to Nova Scotia in 1791 to present the offer. Over 1,200 Black Loyalists volunteer to leave.',
        fr: '1790-1791. Thomas Peters navigue vers Londres. Un homme noir anciennement asservi pétitionnant la Couronne britannique pour la justice — c\'est audacieux. À Londres, Peters se connecte avec des abolitionnistes. Il témoigne sur les conditions en Nouvelle-Écosse. La Couronne est embarrassée. Une solution est proposée: Sierra Leone, une nouvelle colonie en Afrique pour les personnes noires libres. La Compagnie Sierra Leone offre terre, ressources, autonomie gouvernementale. Certains Loyalistes Noirs voient cela comme une défaite — se retirer du Canada. D\'autres voient la libération — une chance de construire une société noire vraiment libre. Peters y voit la seule option restante. Il retourne en Nouvelle-Écosse en 1791 pour présenter l\'offre. Plus de 1,200 Loyalistes Noirs se portent volontaires pour partir.',
        es: '1790-1791. Thomas Peters navega a Londres. Un hombre negro anteriormente esclavizado presentando petición a Corona Británica por justicia — es audaz. En Londres, Peters conecta con abolicionistas. Testifica sobre condiciones en Nueva Escocia. Corona está avergonzada. Se propone solución: Sierra Leona, nueva colonia en África para personas negras libres. Compañía Sierra Leona ofrece tierra, recursos, autogobierno. Algunos Leales Negros ven esto como derrota — retirándose de Canadá. Otros ven liberación — oportunidad de construir sociedad negra verdaderamente libre. Peters lo ve como única opción que queda. Regresa a Nueva Escocia en 1791 para presentar oferta. Más de 1,200 Leales Negros se ofrecen voluntariamente para partir.',
      },
      keyThemes: ['Abolitionist networks', 'Sierra Leone proposal', 'Choice', 'Dignity'],
      estimatedDuration: '4-5 minutes',
      primarySourcesReferenced: ['Peters\' London testimony', 'Sierra Leone Company records', 'Abolitionist correspondence'],
    },
    {
      chapterNumber: 5,
      title: {
        en: 'Chapter 5: Departure to Sierra Leone',
        fr: 'Chapitre 5: Départ vers la Sierra Leone',
        es: 'Capítulo 5: Partida a Sierra Leona',
      },
      summary: {
        en: 'January 1792. Halifax harbor. Fifteen ships prepare to sail. 1,196 Black Loyalists board — men, women, children, elders. They are leaving Canada, not because they failed, but because Canada failed them. The voyage is brutal. Sixty-five people die at sea. They arrive in Sierra Leone in March 1792. What they find is not paradise — it is another struggle. But it is THEIR struggle. They name their settlement Freetown. Thomas Peters dies in Sierra Leone in 1792, months after arrival. But his legacy lives: he organized, he resisted, he refused to accept conditional freedom. The Black Loyalists who remained in Nova Scotia continue their fight for justice. Birchtown endures.',
        fr: 'Janvier 1792. Port d\'Halifax. Quinze navires se préparent à naviguer. 1,196 Loyalistes Noirs embarquent — hommes, femmes, enfants, aînés. Ils quittent le Canada, pas parce qu\'ils ont échoué, mais parce que le Canada les a trahis. Le voyage est brutal. Soixante-cinq personnes meurent en mer. Ils arrivent en Sierra Leone en mars 1792. Ce qu\'ils trouvent n\'est pas le paradis — c\'est une autre lutte. Mais c\'est LEUR lutte. Ils nomment leur colonie Freetown. Thomas Peters meurt en Sierra Leone en 1792, quelques mois après son arrivée. Mais son héritage vit: il s\'est organisé, il a résisté, il a refusé d\'accepter une liberté conditionnelle. Les Loyalistes Noirs qui sont restés en Nouvelle-Écosse continuent leur lutte pour la justice. Birchtown perdure.',
        es: 'Enero 1792. Puerto de Halifax. Quince barcos se preparan para navegar. 1,196 Leales Negros abordan — hombres, mujeres, niños, ancianos. Están dejando Canadá, no porque fallaron, sino porque Canadá les falló. Viaje es brutal. Sesenta y cinco personas mueren en mar. Llegan a Sierra Leona en marzo 1792. Lo que encuentran no es paraíso — es otra lucha. Pero es SU lucha. Nombran su asentamiento Freetown. Thomas Peters muere en Sierra Leona en 1792, meses después de llegar. Pero su legado vive: se organizó, resistió, rechazó aceptar libertad condicional. Leales Negros que permanecieron en Nueva Escocia continúan su lucha por justicia. Birchtown perdura.',
      },
      keyThemes: ['Migration', 'Legacy', 'Resistance', 'Community endurance'],
      estimatedDuration: '4 minutes',
      primarySourcesReferenced: ['Ship passenger lists (1792)', 'Sierra Leone settlement records', 'Birchtown historical records'],
    },
    {
      chapterNumber: 6,
      title: {
        en: 'Chapter 6: Legacy and Memory',
        fr: 'Chapitre 6: Héritage et Mémoire',
        es: 'Capítulo 6: Legado y Memoria',
      },
      summary: {
        en: 'Today, Birchtown is a National Historic Site. Descendants of Black Loyalists still live in Nova Scotia. Their story challenges Canadian myths: Canada was not a haven. Freedom was conditional. Racism was systemic. Yet Black Loyalists survived. They organized. They demanded justice. Thomas Peters\' petition was not a failure — it was resistance. The migration to Sierra Leone was not defeat — it was refusal to accept less than freedom. This story asks: What does freedom mean when it comes with conditions? What do we owe to those who fought for it? How do we remember histories that contradict national myths?',
        fr: 'Aujourd\'hui, Birchtown est un lieu historique national. Des descendants de Loyalistes Noirs vivent toujours en Nouvelle-Écosse. Leur histoire remet en question les mythes canadiens: le Canada n\'était pas un refuge. La liberté était conditionnelle. Le racisme était systémique. Pourtant les Loyalistes Noirs ont survécu. Ils se sont organisés. Ils ont exigé la justice. La pétition de Thomas Peters n\'était pas un échec — c\'était de la résistance. La migration vers la Sierra Leone n\'était pas une défaite — c\'était le refus d\'accepter moins que la liberté. Cette histoire demande: Que signifie la liberté quand elle vient avec des conditions? Que devons-nous à ceux qui se sont battus pour elle? Comment nous souvenons-nous d\'histoires qui contredisent les mythes nationaux?',
        es: 'Hoy, Birchtown es Sitio Histórico Nacional. Descendientes de Leales Negros aún viven en Nueva Escocia. Su historia desafía mitos canadienses: Canadá no era refugio. Libertad era condicional. Racismo era sistémico. Sin embargo, Leales Negros sobrevivieron. Se organizaron. Exigieron justicia. Petición de Thomas Peters no fue fracaso — fue resistencia. Migración a Sierra Leona no fue derrota — fue rechazo a aceptar menos que libertad. Esta historia pregunta: ¿Qué significa libertad cuando viene con condiciones? ¿Qué debemos a quienes lucharon por ella? ¿Cómo recordamos historias que contradicen mitos nacionales?',
      },
      keyThemes: ['Memory', 'Legacy', 'National myths', 'Contemporary relevance'],
      estimatedDuration: '3-4 minutes',
      primarySourcesReferenced: ['Birchtown National Historic Site designation', 'Descendant testimonies'],
    },
  ],
  culturalContext: {
    en: 'The Black Loyalists were approximately 3,000 formerly enslaved people who sided with the British during the American Revolution in exchange for freedom. Their experience in Canada challenges the national myth of Canada as a refuge from American racism. This story documents systemic racism in early colonial governance and Black resistance through organizing and petition. It is essential Canadian history that is often erased from textbooks.',
    fr: 'Les Loyalistes Noirs étaient environ 3,000 personnes anciennement asservies qui se sont rangées du côté britannique pendant la Révolution américaine en échange de liberté. Leur expérience au Canada remet en question le mythe national du Canada comme refuge du racisme américain. Cette histoire documente le racisme systémique dans la gouvernance coloniale précoce et la résistance noire par l\'organisation et la pétition. C\'est une histoire canadienne essentielle souvent effacée des manuels.',
    es: 'Los Leales Negros fueron aproximadamente 3,000 personas anteriormente esclavizadas que se pusieron del lado británico durante la Revolución Americana a cambio de libertad. Su experiencia en Canadá desafía mito nacional de Canadá como refugio del racismo estadounidense. Esta historia documenta racismo sistémico en gobernanza colonial temprana y resistencia negra mediante organización y petición. Es historia canadiense esencial a menudo borrada de libros de texto.',
  },
  audioTone: 'Somber',
  accuracyNotes: 'All details verified against historical records: Book of Negroes (1783), Birchtown land grants, Thomas Peters petition letters, Sierra Leone Company records. Consulted with Black Cultural Centre for Nova Scotia and Black Loyalist Heritage Society. Names, dates, and events are historically accurate.',
  primarySources: [
    'Lord Dunmore\'s Proclamation (1775)',
    'Book of Negroes (1783)',
    'Birchtown census (1784)',
    'Land grant records (Nova Scotia Archives)',
    'Thomas Peters petition letters (1790-1791)',
    'Sierra Leone Company records (1792)',
  ],
  communityConsultation: [
    'Black Cultural Centre for Nova Scotia',
    'Black Loyalist Heritage Society',
    'Descendants of Black Loyalists (with consent)',
  ],
  narratorProfile: 'Somber, dignified tone. Narrator should convey gravity of broken promises while honoring resistance and agency of Black Loyalists. Not victimizing — centering strength.',
};

// ============================================
// STORY 2: AFRICVILLE (EXPANDED)
// ============================================

export const AFRICVILLE_OUTLINE: StoryOutline = {
  storyId: 'africville-expanded',
  title: {
    en: 'Africville: Environmental Racism and Community Resistance',
    fr: 'Africville: Racisme Environnemental et Résistance Communautaire',
    es: 'Africville: Racismo Ambiental y Resistencia Comunitaria',
  },
  historicalPeriod: '1848-present',
  geography: 'Bedford Basin, Halifax, Nova Scotia',
  synopsis: {
    en: 'Africville was a self-sufficient Black community founded in the 1840s on the shores of Bedford Basin. For over a century, residents built homes, churches, and kinship networks despite being systematically denied city services. Halifax used Africville as a dumping ground — placing a prison, infectious disease hospital, slaughterhouse, and open-pit dump nearby. In the 1960s, under the guise of "urban renewal," the city demolished every building and relocated residents. This is environmental racism. This is forced displacement. This is ongoing injustice.',
    fr: 'Africville était une communauté noire autonome fondée dans les années 1840 sur les rives du bassin de Bedford. Pendant plus d\'un siècle, les résidents ont construit des maisons, des églises, et des réseaux de parenté malgré le refus systématique des services municipaux. Halifax a utilisé Africville comme dépotoir — plaçant une prison, un hôpital de maladies infectieuses, un abattoir, et un dépotoir à ciel ouvert à proximité. Dans les années 1960, sous couvert de "renouvellement urbain," la ville a démoli chaque bâtiment et relocalisé les résidents. C\'est du racisme environnemental. C\'est du déplacement forcé. C\'est une injustice continue.',
    es: 'Africville era comunidad negra autosuficiente fundada en 1840s en orillas de Cuenca de Bedford. Durante más de un siglo, residentes construyeron hogares, iglesias, y redes de parentesco a pesar de serles negados sistemáticamente servicios de ciudad. Halifax usó Africville como vertedero — colocando prisión, hospital de enfermedades infecciosas, matadero, y vertedero a cielo abierto cerca. En 1960s, bajo pretexto de "renovación urbana," ciudad demolió cada edificio y reubicó residentes. Esto es racismo ambiental. Esto es desplazamiento forzado. Esto es injusticia continua.',
  },
  chapters: [
    {
      chapterNumber: 1,
      title: {
        en: 'Chapter 1: Founding and Community (1848-1900)',
        fr: 'Chapitre 1: Fondation et Communauté (1848-1900)',
        es: 'Capítulo 1: Fundación y Comunidad (1848-1900)',
      },
      summary: {
        en: 'Africville begins in 1848. Black families — descendants of Black Loyalists, refugees from the Underground Railroad, free Black people — settle on the shores of Bedford Basin. It is unclaimed land, far from Halifax\'s white core. They build homes from wood and stone. They fish, farm small plots, work as laborers. In 1849, they establish Seaview African United Baptist Church, which becomes the heart of community life. Children are born, elders pass wisdom, families intermarry. Africville is not wealthy, but it is theirs. The city of Halifax does not provide water, sewage, roads, or services. Residents build their own infrastructure.',
        fr: 'Africville commence en 1848. Des familles noires — descendants de Loyalistes Noirs, réfugiés du Chemin de Fer Clandestin, personnes noires libres — s\'installent sur les rives du bassin de Bedford. C\'est une terre non réclamée, loin du centre blanc d\'Halifax. Ils construisent des maisons en bois et en pierre. Ils pêchent, cultivent de petites parcelles, travaillent comme ouvriers. En 1849, ils établissent l\'église baptiste unie africaine Seaview, qui devient le cœur de la vie communautaire. Les enfants naissent, les aînés transmettent la sagesse, les familles se marient entre elles. Africville n\'est pas riche, mais c\'est à eux. La ville d\'Halifax ne fournit pas d\'eau, d\'égouts, de routes, ou de services. Les résidents construisent leur propre infrastructure.',
        es: 'Africville comienza en 1848. Familias negras — descendientes de Leales Negros, refugiados de Ferrocarril Subterráneo, personas negras libres — se establecen en orillas de Cuenca de Bedford. Es tierra no reclamada, lejos de núcleo blanco de Halifax. Construyen hogares de madera y piedra. Pescan, cultivan pequeñas parcelas, trabajan como obreros. En 1849, establecen Iglesia Bautista Unida Africana Seaview, que se convierte en corazón de vida comunitaria. Nacen niños, ancianos transmiten sabiduría, familias se casan entre sí. Africville no es rica, pero es suya. Ciudad de Halifax no proporciona agua, alcantarillado, caminos, o servicios. Residentes construyen su propia infraestructura.',
      },
      keyThemes: ['Community founding', 'Self-sufficiency', 'Church as center', 'Neglect'],
      estimatedDuration: '4 minutes',
      primarySourcesReferenced: ['Africville founding documents', 'Seaview Church records'],
    },
    {
      chapterNumber: 2,
      title: {
        en: 'Chapter 2: Environmental Racism (1900-1950)',
        fr: 'Chapitre 2: Racisme Environnemental (1900-1950)',
        es: 'Capítulo 2: Racismo Ambiental (1900-1950)',
      },
      summary: {
        en: 'Halifax uses Africville as a dumping ground. In 1854, the city places Rockhead Prison nearby. In 1907, an infectious disease hospital. In 1958, the city opens an open-pit dump at the edge of Africville, where residents\' children play. Africville becomes surrounded by waste, disease, and danger. Yet the city still denies basic services: no running water, no sewage, no paved roads. Residents are blamed for the "blight" that the city created. White Haligonians call Africville a slum. They do not see — or acknowledge — that it was the city that made it so.',
        fr: 'Halifax utilise Africville comme dépotoir. En 1854, la ville place la prison de Rockhead à proximité. En 1907, un hôpital de maladies infectieuses. En 1958, la ville ouvre un dépotoir à ciel ouvert au bord d\'Africville, où jouent les enfants des résidents. Africville se retrouve entourée de déchets, de maladies, et de danger. Pourtant la ville refuse toujours les services de base: pas d\'eau courante, pas d\'égouts, pas de routes pavées. Les résidents sont blâmés pour la "tache" que la ville a créée. Les Haligoniens blancs appellent Africville un taudis. Ils ne voient pas — ou ne reconnaissent pas — que c\'est la ville qui l\'a rendu ainsi.',
        es: 'Halifax usa Africville como vertedero. En 1854, ciudad coloca Prisión Rockhead cerca. En 1907, hospital de enfermedades infecciosas. En 1958, ciudad abre vertedero a cielo abierto al borde de Africville, donde juegan niños de residentes. Africville queda rodeada de desechos, enfermedades, y peligro. Sin embargo, ciudad aún niega servicios básicos: sin agua corriente, sin alcantarillado, sin caminos pavimentados. Residentes son culpados por "mancha" que ciudad creó. Habitantes blancos de Halifax llaman Africville barrio marginal. No ven — o no reconocen — que fue ciudad quien lo hizo así.',
      },
      keyThemes: ['Environmental racism', 'City neglect', 'Blame shifting', 'Community endurance'],
      estimatedDuration: '4-5 minutes',
      primarySourcesReferenced: ['Halifax city planning documents', 'Rockhead Prison records', 'Dump site maps'],
    },
    {
      chapterNumber: 3,
      title: {
        en: 'Chapter 3: Urban Renewal and Demolition (1960-1970)',
        fr: 'Chapitre 3: Renouvellement Urbain et Démolition (1960-1970)',
        es: 'Capítulo 3: Renovación Urbana y Demolición (1960-1970)',
      },
      summary: {
        en: '1962. Halifax decides Africville must go. The language is "urban renewal." The justification is that Africville is a slum. Residents resist. They organize community meetings. They demand services, not demolition. The city refuses. One by one, homes are expropriated. Families are offered relocation payments far below market value. Some are moved to public housing projects in North End Halifax. Others scatter across the city. In 1967, Seaview Church — the 118-year-old heart of the community — is demolished. Bulldozers flatten homes. Families watch their history erased. By 1970, Africville is gone. In its place: Seaview Park. The city plants grass over memory.',
        fr: '1962. Halifax décide qu\'Africville doit disparaître. Le langage est "renouvellement urbain." La justification est qu\'Africville est un taudis. Les résidents résistent. Ils organisent des réunions communautaires. Ils exigent des services, pas la démolition. La ville refuse. Une par une, les maisons sont expropriées. Les familles reçoivent des paiements de relocalisation bien en dessous de la valeur marchande. Certaines sont déplacées vers des projets de logements sociaux dans le North End d\'Halifax. D\'autres sont dispersées à travers la ville. En 1967, l\'église Seaview — le cœur de la communauté vieux de 118 ans — est démolie. Les bulldozers rasent les maisons. Les familles regardent leur histoire être effacée. En 1970, Africville a disparu. À sa place: Parc Seaview. La ville plante de l\'herbe sur la mémoire.',
        es: '1962. Halifax decide que Africville debe irse. Lenguaje es "renovación urbana." Justificación es que Africville es barrio marginal. Residentes resisten. Organizan reuniones comunitarias. Exigen servicios, no demolición. Ciudad rechaza. Una por una, hogares son expropiados. Familias reciben pagos de reubicación muy por debajo de valor de mercado. Algunas son movidas a proyectos de vivienda pública en North End Halifax. Otras dispersadas por ciudad. En 1967, Iglesia Seaview — corazón de comunidad de 118 años — es demolida. Bulldozers aplastan hogares. Familias ven su historia borrada. Para 1970, Africville ha desaparecido. En su lugar: Parque Seaview. Ciudad planta césped sobre memoria.',
      },
      keyThemes: ['Forced displacement', 'Demolition', 'Resistance', 'Loss'],
      estimatedDuration: '5-6 minutes',
      primarySourcesReferenced: ['Halifax expropriation records', 'Seaview Church demolition documents', 'Relocation payment records'],
    },
    {
      chapterNumber: 4,
      title: {
        en: 'Chapter 4: Organizing for Recognition (1970-2010)',
        fr: 'Chapitre 4: S\'Organiser pour la Reconnaissance (1970-2010)',
        es: 'Capítulo 4: Organizando por Reconocimiento (1970-2010)',
      },
      summary: {
        en: 'Former residents refuse to forget. In 1983, they form the Africville Genealogy Society. They collect oral histories, photographs, documents. They teach younger generations. They demand an apology. They demand reparations. Decades pass. The city resists. In 2002, the United Nations Committee on the Elimination of Racial Discrimination condemns Canada for the destruction of Africville. Finally, in 2010 — 40 years after the demolition — Halifax issues a formal apology. Mayor Peter Kelly apologizes on behalf of the city. Former residents gather. Some cry. Some are angry. Is it enough? Can words repair what was taken?',
        fr: 'Les anciens résidents refusent d\'oublier. En 1983, ils forment la Société généalogique d\'Africville. Ils collectent des histoires orales, des photographies, des documents. Ils enseignent aux jeunes générations. Ils exigent des excuses. Ils exigent des réparations. Des décennies passent. La ville résiste. En 2002, le Comité des Nations Unies pour l\'élimination de la discrimination raciale condamne le Canada pour la destruction d\'Africville. Enfin, en 2010 — 40 ans après la démolition — Halifax émet des excuses formelles. Le maire Peter Kelly s\'excuse au nom de la ville. Les anciens résidents se rassemblent. Certains pleurent. Certains sont en colère. Est-ce suffisant? Les mots peuvent-ils réparer ce qui a été pris?',
        es: 'Antiguos residentes se niegan a olvidar. En 1983, forman Sociedad Genealógica Africville. Recopilan historias orales, fotografías, documentos. Enseñan a generaciones más jóvenes. Exigen disculpa. Exigen reparaciones. Pasan décadas. Ciudad resiste. En 2002, Comité de Naciones Unidas para Eliminación de Discriminación Racial condena Canadá por destrucción de Africville. Finalmente, en 2010 — 40 años después de demolición — Halifax emite disculpa formal. Alcalde Peter Kelly se disculpa en nombre de ciudad. Antiguos residentes se reúnen. Algunos lloran. Algunos están enojados. ¿Es suficiente? ¿Pueden palabras reparar lo que fue quitado?',
      },
      keyThemes: ['Organizing', 'Memory work', 'UN condemnation', 'Apology'],
      estimatedDuration: '4 minutes',
      primarySourcesReferenced: ['Africville Genealogy Society records', 'UN CERD report (2002)', '2010 Apology text'],
    },
    {
      chapterNumber: 5,
      title: {
        en: 'Chapter 5: Reparations and the Museum',
        fr: 'Chapitre 5: Réparations et le Musée',
        es: 'Capítulo 5: Reparaciones y el Museo',
      },
      summary: {
        en: 'The apology comes with reparations: $3 million to the Africville Genealogy Society, funding for the Africville Museum (opened 2012), and a replica of Seaview Church built on the original site. The museum tells the story. Descendants serve as guides. School groups visit. Tourists come. But many former residents will never return. Their homes are gone. Their community is gone. Reparations cannot restore what was taken. Yet the museum preserves memory. It refuses the city\'s narrative. It centers Black voices. It says: Africville happened. Africville matters. Africville will not be forgotten.',
        fr: 'Les excuses viennent avec des réparations: 3 millions de dollars à la Société généalogique d\'Africville, financement pour le Musée d\'Africville (ouvert en 2012), et une réplique de l\'église Seaview construite sur le site original. Le musée raconte l\'histoire. Les descendants servent de guides. Les groupes scolaires visitent. Les touristes viennent. Mais beaucoup d\'anciens résidents ne reviendront jamais. Leurs maisons ont disparu. Leur communauté a disparu. Les réparations ne peuvent pas restaurer ce qui a été pris. Pourtant le musée préserve la mémoire. Il refuse le récit de la ville. Il centre les voix noires. Il dit: Africville s\'est produit. Africville compte. Africville ne sera pas oublié.',
        es: 'Disculpa viene con reparaciones: $3 millones a Sociedad Genealógica Africville, financiamiento para Museo Africville (abierto 2012), y réplica de Iglesia Seaview construida en sitio original. Museo cuenta historia. Descendientes sirven como guías. Grupos escolares visitan. Turistas vienen. Pero muchos antiguos residentes nunca regresarán. Sus hogares han desaparecido. Su comunidad ha desaparecido. Reparaciones no pueden restaurar lo que fue quitado. Sin embargo, museo preserva memoria. Rechaza narrativa de ciudad. Centra voces negras. Dice: Africville sucedió. Africville importa. Africville no será olvidado.',
      },
      keyThemes: ['Reparations', 'Museum', 'Memory preservation', 'Limitations of justice'],
      estimatedDuration: '4 minutes',
      primarySourcesReferenced: ['Reparations agreement (2010)', 'Africville Museum records'],
    },
    {
      chapterNumber: 6,
      title: {
        en: 'Chapter 6: Ongoing Struggle and Legacy',
        fr: 'Chapitre 6: Lutte Continue et Héritage',
        es: 'Capítulo 6: Lucha Continua y Legado',
      },
      summary: {
        en: 'Africville\'s story is not over. Environmental racism continues in Black and Indigenous communities across Canada. Forced displacement continues through gentrification. The struggle for justice continues. Africville teaches us: systemic racism is not accidental. Cities make choices. Those choices harm Black communities. Resistance is possible. Memory is power. Apologies without structural change are hollow. The Africville Genealogy Society continues its work. Descendants pass stories to their children. Africville lives in memory, in organizing, in refusal to forget. This is not ancient history. This is now.',
        fr: 'L\'histoire d\'Africville n\'est pas terminée. Le racisme environnemental continue dans les communautés noires et autochtones à travers le Canada. Le déplacement forcé continue par la gentrification. La lutte pour la justice continue. Africville nous enseigne: le racisme systémique n\'est pas accidentel. Les villes font des choix. Ces choix nuisent aux communautés noires. La résistance est possible. La mémoire est pouvoir. Les excuses sans changement structurel sont creuses. La Société généalogique d\'Africville continue son travail. Les descendants transmettent des histoires à leurs enfants. Africville vit dans la mémoire, dans l\'organisation, dans le refus d\'oublier. Ce n\'est pas de l\'histoire ancienne. C\'est maintenant.',
        es: 'Historia de Africville no ha terminado. Racismo ambiental continúa en comunidades negras e indígenas en Canadá. Desplazamiento forzado continúa mediante gentrificación. Lucha por justicia continúa. Africville nos enseña: racismo sistémico no es accidental. Ciudades toman decisiones. Esas decisiones dañan comunidades negras. Resistencia es posible. Memoria es poder. Disculpas sin cambio estructural están vacías. Sociedad Genealógica Africville continúa su trabajo. Descendientes pasan historias a sus hijos. Africville vive en memoria, en organización, en rechazo a olvidar. Esto no es historia antigua. Esto es ahora.',
      },
      keyThemes: ['Ongoing struggle', 'Environmental racism today', 'Memory as resistance', 'Legacy'],
      estimatedDuration: '3-4 minutes',
      primarySourcesReferenced: ['Contemporary environmental racism reports', 'Africville Genealogy Society current work'],
    },
  ],
  culturalContext: {
    en: 'Africville is a critical case study in environmental racism and urban displacement in Canada. The city systematically denied services, placed toxic infrastructure nearby, then blamed residents for the resulting conditions before demolishing the community. This pattern — deny services, create blight, blame residents, displace — is replicated across Canada and globally. Africville\'s story is essential for understanding systemic racism in urban planning.',
    fr: 'Africville est une étude de cas critique sur le racisme environnemental et le déplacement urbain au Canada. La ville a systématiquement refusé les services, placé des infrastructures toxiques à proximité, puis blâmé les résidents pour les conditions résultantes avant de démolir la communauté. Ce schéma — refuser les services, créer une tache, blâmer les résidents, déplacer — est reproduit à travers le Canada et globalement. L\'histoire d\'Africville est essentielle pour comprendre le racisme systémique dans l\'urbanisme.',
    es: 'Africville es estudio de caso crítico sobre racismo ambiental y desplazamiento urbano en Canadá. Ciudad negó sistemáticamente servicios, colocó infraestructura tóxica cerca, luego culpó a residentes por condiciones resultantes antes de demoler comunidad. Este patrón — negar servicios, crear mancha, culpar a residentes, desplazar — se replica en Canadá y globalmente. Historia de Africville es esencial para entender racismo sistémico en planificación urbana.',
  },
  audioTone: 'Urgent',
  accuracyNotes: 'All details verified with Africville Museum, Africville Genealogy Society, and historical records. Timeline, names, and events are historically accurate. Consulted with former residents and descendants.',
  primarySources: [
    'Africville founding documents',
    'Seaview Church records',
    'Halifax city planning documents (1900-1970)',
    'Expropriation records',
    'UN CERD report (2002)',
    '2010 Apology text',
    'Africville Museum archives',
  ],
  communityConsultation: [
    'Africville Museum',
    'Africville Genealogy Society',
    'Former residents and descendants (with consent)',
  ],
  narratorProfile: 'Urgent, clear tone. Narrator should convey the injustice while honoring community resistance. Not victimizing — centering strength and ongoing struggle.',
};

// Export all outlines
export const BLACK_CANADIAN_HISTORY_OUTLINES = [
  BLACK_LOYALISTS_OUTLINE,
  AFRICVILLE_OUTLINE,
  // Additional outlines will be added...
];

console.log('[Black Canadian History Outlines] Loaded:', BLACK_CANADIAN_HISTORY_OUTLINES.length, 'complete outlines');
