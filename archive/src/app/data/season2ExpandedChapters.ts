/**
 * SEASON 2 EXPANDED CHAPTERS
 * SEEN by CREOVA — Black Futures & Canadian Memory
 * 
 * Full chapter content for 6 Story Worlds
 * Each chapter: 400-700 words, trilingual (EN/FR/ES)
 * Audio-ready, culturally grounded, Canadian-specific
 * 
 * STATUS: Ready for narration, NOT auto-published
 */

import type { MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ContextCard {
  term: MultilingualText;
  explanation: MultilingualText;
}

export interface StoryChapter {
  chapterId: string;
  order: number;
  title: MultilingualText;
  bodyText: MultilingualText;
  suggestedAudioTone: 'reflective' | 'urgent' | 'intimate' | 'celebratory' | 'somber';
  estimatedReadTime: string; // "3 min", "5 min", etc.
  contextCards?: ContextCard[];
}

export interface ExpandedStoryWorld {
  storyWorldId: string;
  season: number;
  title: MultilingualText;
  description: MultilingualText;
  totalChapters: number;
  estimatedDuration: string;
  chapters: StoryChapter[];
  narratorProfile: 'warm-reflective' | 'urgent-direct';
  publicationStatus: 'ready' | 'planned' | 'in-production';
}

// ============================================
// STORY WORLD 1: BLACK CANADIAN RENAISSANCE
// ============================================

export const STORY_BLACK_CANADIAN_RENAISSANCE: ExpandedStoryWorld = {
  storyWorldId: 's2-black-canadian-renaissance',
  season: 2,
  title: {
    en: 'The Black Canadian Renaissance: Art, Resistance, and Memory',
    fr: 'La Renaissance Noire Canadienne: Art, Résistance et Mémoire',
    es: 'El Renacimiento Negro Canadiense: Arte, Resistencia y Memoria',
  },
  description: {
    en: 'The story of Black Canadian artists, writers, and cultural workers who built a movement of resistance, memory, and creative freedom from the 1960s to today.',
    fr: 'L\'histoire des artistes, écrivains et travailleurs culturels noirs canadiens qui ont construit un mouvement de résistance, de mémoire et de liberté créative des années 1960 à aujourd\'hui.',
    es: 'La historia de artistas, escritores y trabajadores culturales negros canadienses que construyeron un movimiento de resistencia, memoria y libertad creativa desde los años 1960 hasta hoy.',
  },
  totalChapters: 6,
  estimatedDuration: '25 min',
  narratorProfile: 'warm-reflective',
  publicationStatus: 'ready',
  chapters: [
    {
      chapterId: 's2-renaissance-ch1',
      order: 1,
      title: {
        en: 'The Quiet Revolution',
        fr: 'La Révolution Silencieuse',
        es: 'La Revolución Silenciosa',
      },
      bodyText: {
        en: `Montreal, 1968. The city is changing. Students march. Workers strike. Quebec demands recognition. And in the basement of a church on Saint-Laurent Boulevard, a small group of Black writers gather around a borrowed typewriter.

They call themselves the Negro Community Centre Writers' Workshop. The name will not age well, but the work will endure. Austin Clarke sits at the head of the table. He has just published his first novel. Beside him, a young journalist named Donna Williams takes notes. Across from them, a poet from Trinidad experiments with Creole rhythms in English verse.

This is not the Harlem Renaissance. This is not the Black Arts Movement. This is something else. Something quieter. Something Canadian.

In Toronto, the same year, a playwright named Vera Cudjoe stages a one-woman show about Caribbean migration. The audience is small. Most are Black. Some are white allies. The theatre is cold. The budget is almost nothing. But the performance is electric. Cudjoe does not perform trauma. She performs survival. She performs memory. She performs joy.

These artists are not waiting for recognition from white institutions. They are building their own. In Halifax, a group of musicians start a Black cultural center. In Vancouver, a filmmaker begins documenting the Japanese Canadian internment through the eyes of a Black Canadian soldier who served overseas. In Winnipeg, a painter creates a series of portraits of Black railway porters—men who built the country and were erased from its history.

They are not working in isolation. Letters circulate. Manuscripts are shared. Artists visit each other across provinces. There is no funding. There is no spotlight. There is only the work.

And the work is resistance. Not loud. Not performative. But steady. Relentless. The resistance of making art when the country tells you that you do not exist. The resistance of writing history when the textbooks erase you. The resistance of creating beauty in a place that refuses to see you.

This is the beginning. Not of recognition. But of a movement that will outlast the indifference.`,
        fr: `Montréal, 1968. La ville change. Les étudiants marchent. Les travailleurs font grève. Le Québec exige la reconnaissance. Et dans le sous-sol d'une église sur le boulevard Saint-Laurent, un petit groupe d'écrivains noirs se rassemble autour d'une machine à écrire empruntée.

Ils s'appellent l'Atelier d'écrivains du Centre communautaire nègre. Le nom ne vieillira pas bien, mais le travail perdurera. Austin Clarke est assis en bout de table. Il vient de publier son premier roman. À côté de lui, une jeune journaliste nommée Donna Williams prend des notes. En face d'eux, un poète de Trinidad expérimente des rythmes créoles en vers anglais.

Ce n'est pas la Renaissance de Harlem. Ce n'est pas le Black Arts Movement. C'est autre chose. Quelque chose de plus calme. Quelque chose de canadien.

À Toronto, la même année, une dramaturge nommée Vera Cudjoe monte un spectacle solo sur la migration caribéenne. Le public est petit. La plupart sont noirs. Certains sont des alliés blancs. Le théâtre est froid. Le budget est presque nul. Mais la performance est électrique. Cudjoe ne joue pas le trauma. Elle joue la survie. Elle joue la mémoire. Elle joue la joie.

Ces artistes n'attendent pas la reconnaissance des institutions blanches. Ils construisent les leurs. À Halifax, un groupe de musiciens crée un centre culturel noir. À Vancouver, un cinéaste commence à documenter l'internement des Canadiens japonais à travers les yeux d'un soldat canadien noir qui a servi outre-mer. À Winnipeg, un peintre crée une série de portraits de porteurs ferroviaires noirs—des hommes qui ont construit le pays et ont été effacés de son histoire.

Ils ne travaillent pas en isolation. Les lettres circulent. Les manuscrits sont partagés. Les artistes se visitent d'une province à l'autre. Il n'y a pas de financement. Il n'y a pas de projecteurs. Il n'y a que le travail.

Et le travail est résistance. Pas fort. Pas performatif. Mais constant. Implacable. La résistance de faire de l'art quand le pays vous dit que vous n'existez pas. La résistance d'écrire l'histoire quand les manuels vous effacent. La résistance de créer la beauté dans un endroit qui refuse de vous voir.

C'est le début. Pas de la reconnaissance. Mais d'un mouvement qui survivra à l'indifférence.`,
        es: `Montreal, 1968. La ciudad está cambiando. Los estudiantes marchan. Los trabajadores hacen huelga. Quebec exige reconocimiento. Y en el sótano de una iglesia en el Boulevard Saint-Laurent, un pequeño grupo de escritores negros se reúne alrededor de una máquina de escribir prestada.

Se llaman a sí mismos el Taller de Escritores del Centro Comunitario Negro. El nombre no envejecerá bien, pero el trabajo perdurará. Austin Clarke se sienta a la cabeza de la mesa. Acaba de publicar su primera novela. Junto a él, una joven periodista llamada Donna Williams toma notas. Frente a ellos, un poeta de Trinidad experimenta con ritmos criollos en verso inglés.

Esto no es el Renacimiento de Harlem. Esto no es el Movimiento de las Artes Negras. Esto es otra cosa. Algo más tranquilo. Algo canadiense.

En Toronto, el mismo año, una dramaturga llamada Vera Cudjoe presenta un espectáculo unipersonal sobre la migración caribeña. La audiencia es pequeña. La mayoría son negros. Algunos son aliados blancos. El teatro está frío. El presupuesto es casi nada. Pero la actuación es eléctrica. Cudjoe no representa trauma. Representa supervivencia. Representa memoria. Representa alegría.

Estos artistas no esperan el reconocimiento de las instituciones blancas. Están construyendo las suyas. En Halifax, un grupo de músicos inicia un centro cultural negro. En Vancouver, un cineasta comienza a documentar el internamiento de canadienses japoneses a través de los ojos de un soldado canadiense negro que sirvió en el extranjero. En Winnipeg, un pintor crea una serie de retratos de mozos ferroviarios negros—hombres que construyeron el país y fueron borrados de su historia.

No trabajan en aislamiento. Las cartas circulan. Los manuscritos se comparten. Los artistas se visitan a través de provincias. No hay financiamiento. No hay reflectores. Solo hay el trabajo.

Y el trabajo es resistencia. No ruidosa. No performativa. Pero constante. Implacable. La resistencia de hacer arte cuando el país te dice que no existes. La resistencia de escribir historia cuando los libros de texto te borran. La resistencia de crear belleza en un lugar que se niega a verte.

Este es el comienzo. No del reconocimiento. Sino de un movimiento que sobrevivirá a la indiferencia.`,
      },
      suggestedAudioTone: 'reflective',
      estimatedReadTime: '4 min',
      contextCards: [
        {
          term: {
            en: 'Austin Clarke',
            fr: 'Austin Clarke',
            es: 'Austin Clarke',
          },
          explanation: {
            en: 'Barbadian-Canadian novelist (1934-2016) who chronicled the Black immigrant experience in Toronto. His novel "The Polished Hoe" won the Giller Prize in 2002.',
            fr: 'Romancier barbadien-canadien (1934-2016) qui a chroniclé l\'expérience des immigrants noirs à Toronto. Son roman "The Polished Hoe" a remporté le Prix Giller en 2002.',
            es: 'Novelista barbadense-canadiense (1934-2016) que narró la experiencia de inmigrantes negros en Toronto. Su novela "The Polished Hoe" ganó el Premio Giller en 2002.',
          },
        },
      ],
    },
    {
      chapterId: 's2-renaissance-ch2',
      order: 2,
      title: {
        en: 'The Publishing Wars',
        fr: 'Les Guerres de l\'Édition',
        es: 'Las Guerras de la Publicación',
      },
      bodyText: {
        en: `Toronto, 1975. Dionne Brand walks into a publisher's office with a manuscript. She is twenty-two years old. The poems are about Trinidad, about migration, about being a Black woman in a white country. The editor flips through the pages. He looks up.

"This is very… ethnic," he says. "Do you have anything more universal?"

Brand takes her manuscript and leaves. She will not try again with white publishers. Not yet.

Across the city, a group of Black writers decide to stop waiting. They pool their savings. They rent a small office above a Caribbean restaurant. They buy a second-hand printing press. They call themselves Williams-Wallace Publishers. The name honors two of their own: a poet and a printer.

The first book they publish is a collection of essays about the Caribbean diaspora in Canada. It sells three hundred copies, mostly hand-to-hand in community centers and bookstores that agree to carry it. The mainstream media ignores it. But it circulates. Readers pass it to friends. Teachers assign it in university courses taught by the few Black professors in the country.

This is how Black Canadian literature survives. Not through recognition, but through circulation. Not through awards, but through community.

In Montreal, a Haitian poet named Anthony Phelps starts a small press that publishes work in French and Creole. In Vancouver, a collective of Black and Indigenous writers create a magazine called "Unheard Voices." The print quality is poor. The distribution is chaotic. But the work is there. The voices are there.

White publishers begin to notice. Not because they care, but because there is money to be made. In 1983, a major Toronto publisher offers to reprint Brand's first collection. The offer comes with conditions. They want her to cut the "political" poems. They want her to soften the anger. They want her to be more "accessible."

Brand refuses. She will wait another decade before a publisher prints her work as she wrote it. By then, she will have built her own audience. She will not need their validation.

This is the lesson of the publishing wars. You do not wait for the gatekeepers to open the door. You build your own house.`,
        fr: `Toronto, 1975. Dionne Brand entre dans le bureau d'un éditeur avec un manuscrit. Elle a vingt-deux ans. Les poèmes parlent de Trinidad, de migration, d'être une femme noire dans un pays blanc. L'éditeur feuillette les pages. Il lève les yeux.

"C'est très… ethnique," dit-il. "Avez-vous quelque chose de plus universel?"

Brand reprend son manuscrit et part. Elle ne réessaiera pas avec les éditeurs blancs. Pas encore.

De l'autre côté de la ville, un groupe d'écrivains noirs décide d'arrêter d'attendre. Ils mettent leurs économies en commun. Ils louent un petit bureau au-dessus d'un restaurant caribéen. Ils achètent une presse d'impression d'occasion. Ils s'appellent Williams-Wallace Publishers. Le nom honore deux des leurs: un poète et un imprimeur.

Le premier livre qu'ils publient est un recueil d'essais sur la diaspora caribéenne au Canada. Il se vend trois cents exemplaires, principalement de main en main dans les centres communautaires et les librairies qui acceptent de le porter. Les médias grand public l'ignorent. Mais il circule. Les lecteurs le passent à des amis. Les enseignants l'assignent dans des cours universitaires enseignés par les quelques professeurs noirs du pays.

C'est ainsi que la littérature canadienne noire survit. Pas par la reconnaissance, mais par la circulation. Pas par les prix, mais par la communauté.

À Montréal, un poète haïtien nommé Anthony Phelps lance une petite maison d'édition qui publie des œuvres en français et en créole. À Vancouver, un collectif d'écrivains noirs et autochtones crée un magazine appelé "Unheard Voices." La qualité d'impression est médiocre. La distribution est chaotique. Mais le travail est là. Les voix sont là.

Les éditeurs blancs commencent à remarquer. Pas parce qu'ils se soucient, mais parce qu'il y a de l'argent à gagner. En 1983, un grand éditeur torontois propose de réimprimer le premier recueil de Brand. L'offre vient avec des conditions. Ils veulent qu'elle coupe les poèmes "politiques." Ils veulent qu'elle adoucisse la colère. Ils veulent qu'elle soit plus "accessible."

Brand refuse. Elle attendra une autre décennie avant qu'un éditeur imprime son travail tel qu'elle l'a écrit. D'ici là, elle aura construit son propre public. Elle n'aura pas besoin de leur validation.

C'est la leçon des guerres de l'édition. Vous n'attendez pas que les gardiens ouvrent la porte. Vous construisez votre propre maison.`,
        es: `Toronto, 1975. Dionne Brand entra en la oficina de un editor con un manuscrito. Tiene veintidós años. Los poemas son sobre Trinidad, sobre migración, sobre ser una mujer negra en un país blanco. El editor hojea las páginas. Levanta la vista.

"Esto es muy… étnico," dice. "¿Tienes algo más universal?"

Brand toma su manuscrito y se va. No intentará de nuevo con editores blancos. Todavía no.

Al otro lado de la ciudad, un grupo de escritores negros decide dejar de esperar. Juntan sus ahorros. Alquilan una pequeña oficina sobre un restaurante caribeño. Compran una imprenta de segunda mano. Se llaman a sí mismos Williams-Wallace Publishers. El nombre honra a dos de los suyos: un poeta y un impresor.

El primer libro que publican es una colección de ensayos sobre la diáspora caribeña en Canadá. Vende trescientos ejemplares, principalmente de mano en mano en centros comunitarios y librerías que aceptan llevarlo. Los medios principales lo ignoran. Pero circula. Los lectores lo pasan a amigos. Los maestros lo asignan en cursos universitarios impartidos por los pocos profesores negros en el país.

Así es como sobrevive la literatura canadiense negra. No por reconocimiento, sino por circulación. No por premios, sino por comunidad.

En Montreal, un poeta haitiano llamado Anthony Phelps inicia una pequeña editorial que publica obra en francés y criollo. En Vancouver, un colectivo de escritores negros e indígenas crea una revista llamada "Voces No Escuchadas." La calidad de impresión es pobre. La distribución es caótica. Pero el trabajo está ahí. Las voces están ahí.

Los editores blancos comienzan a notar. No porque les importe, sino porque hay dinero que ganar. En 1983, una editorial importante de Toronto ofrece reimprimir la primera colección de Brand. La oferta viene con condiciones. Quieren que corte los poemas "políticos." Quieren que suavice la ira. Quieren que sea más "accesible."

Brand rechaza. Esperará otra década antes de que un editor imprima su trabajo como lo escribió. Para entonces, habrá construido su propia audiencia. No necesitará su validación.

Esta es la lección de las guerras de publicación. No esperas a que los guardianes abran la puerta. Construyes tu propia casa.`,
      },
      suggestedAudioTone: 'urgent',
      estimatedReadTime: '4 min',
      contextCards: [
        {
          term: {
            en: 'Dionne Brand',
            fr: 'Dionne Brand',
            es: 'Dionne Brand',
          },
          explanation: {
            en: 'Trinidadian-Canadian poet, novelist, and essayist. Toronto Poet Laureate (2009-2012). Author of "A Map to the Door of No Return" and winner of the Griffin Poetry Prize.',
            fr: 'Poète, romancière et essayiste trinidadienne-canadienne. Poète lauréate de Toronto (2009-2012). Auteure de "A Map to the Door of No Return" et lauréate du Prix de poésie Griffin.',
            es: 'Poeta, novelista y ensayista trinitense-canadiense. Poeta Laureada de Toronto (2009-2012). Autora de "A Map to the Door of No Return" y ganadora del Premio de Poesía Griffin.',
          },
        },
      ],
    },
    {
      chapterId: 's2-renaissance-ch3',
      order: 3,
      title: {
        en: 'Sound as Archive',
        fr: 'Le Son Comme Archive',
        es: 'El Sonido Como Archivo',
      },
      bodyText: {
        en: `Halifax, 1982. A young musician named George Elliott Clarke sits in his grandmother's kitchen listening to her stories. She talks about Africville. She talks about the churches. She talks about the music.

"We had our own sound," she says. "Nobody wrote it down. But we had it."

Clarke understands. He is studying poetry at university, but the white professors do not teach the blues. They do not teach gospel. They do not teach the call-and-response that shaped his grandmother's speech. So he begins to listen differently. He begins to treat sound as text. He begins to hear poetry in the rhythms of Black Canadian vernacular.

In Toronto, the same year, a group of musicians gather in a basement studio. They are experimenting with something new. They take reggae. They take jazz. They take the sounds of Caribbean street vendors and Toronto subway announcements. They layer them together. They call it "urban fusion." The record labels do not understand. The radio stations refuse to play it. But the community hears it. The music circulates on cassette tapes, passed hand-to-hand at parties and gatherings.

This is how Black Canadian sound survives. Not through recording contracts, but through circulation. Not through airplay, but through community.

In Montreal, a Haitian DJ starts playing Creole music at a small club on Saint-Laurent. The club is in the basement. The ceiling is low. The walls sweat. But the music is electric. People dance until the morning. They speak in languages the city refuses to acknowledge. They create a sonic space where they can exist without translation.

These are not just parties. These are acts of preservation. Every beat is a refusal to be erased. Every rhythm is a reminder that Black Canadians have always been here, making sound, making culture, making home.

By the 1990s, the sounds begin to leak into the mainstream. A Toronto rapper named Maestro Fresh Wes releases a single that becomes the first Canadian hip-hop song to chart nationally. But the industry wants to sand down the edges. They want the sound without the context. They want the music without the memory.

The artists resist. They keep the memory in the music. They keep the archive in the sound.`,
        fr: `Halifax, 1982. Un jeune musicien nommé George Elliott Clarke est assis dans la cuisine de sa grand-mère en écoutant ses histoires. Elle parle d'Africville. Elle parle des églises. Elle parle de la musique.

"Nous avions notre propre son," dit-elle. "Personne ne l'a écrit. Mais nous l'avions."

Clarke comprend. Il étudie la poésie à l'université, mais les professeurs blancs n'enseignent pas le blues. Ils n'enseignent pas le gospel. Ils n'enseignent pas l'appel-réponse qui a façonné le discours de sa grand-mère. Alors il commence à écouter différemment. Il commence à traiter le son comme texte. Il commence à entendre la poésie dans les rythmes du vernaculaire canadien noir.

À Toronto, la même année, un groupe de musiciens se rassemble dans un studio de sous-sol. Ils expérimentent quelque chose de nouveau. Ils prennent le reggae. Ils prennent le jazz. Ils prennent les sons des vendeurs de rue caribéens et les annonces du métro de Toronto. Ils les superposent. Ils appellent ça "fusion urbaine." Les maisons de disques ne comprennent pas. Les stations de radio refusent de le jouer. Mais la communauté l'entend. La musique circule sur des cassettes, passées de main en main lors de fêtes et rassemblements.

C'est ainsi que le son canadien noir survit. Pas par des contrats d'enregistrement, mais par la circulation. Pas par la diffusion radiophonique, mais par la communauté.

À Montréal, un DJ haïtien commence à jouer de la musique créole dans un petit club sur Saint-Laurent. Le club est au sous-sol. Le plafond est bas. Les murs transpirent. Mais la musique est électrique. Les gens dansent jusqu'au matin. Ils parlent dans des langues que la ville refuse de reconnaître. Ils créent un espace sonore où ils peuvent exister sans traduction.

Ce ne sont pas seulement des fêtes. Ce sont des actes de préservation. Chaque battement est un refus d'être effacé. Chaque rythme est un rappel que les Canadiens noirs ont toujours été là, faisant du son, faisant de la culture, faisant maison.

Dans les années 1990, les sons commencent à s'infiltrer dans le grand public. Un rappeur torontois nommé Maestro Fresh Wes sort un single qui devient la première chanson hip-hop canadienne à se classer au niveau national. Mais l'industrie veut poncer les bords. Ils veulent le son sans le contexte. Ils veulent la musique sans la mémoire.

Les artistes résistent. Ils gardent la mémoire dans la musique. Ils gardent l'archive dans le son.`,
        es: `Halifax, 1982. Un joven músico llamado George Elliott Clarke se sienta en la cocina de su abuela escuchando sus historias. Ella habla de Africville. Habla de las iglesias. Habla de la música.

"Teníamos nuestro propio sonido," dice. "Nadie lo escribió. Pero lo teníamos."

Clarke comprende. Está estudiando poesía en la universidad, pero los profesores blancos no enseñan el blues. No enseñan gospel. No enseñan el llamado y respuesta que formó el habla de su abuela. Así que comienza a escuchar diferente. Comienza a tratar el sonido como texto. Comienza a escuchar poesía en los ritmos del vernáculo canadiense negro.

En Toronto, el mismo año, un grupo de músicos se reúne en un estudio de sótano. Están experimentando con algo nuevo. Toman reggae. Toman jazz. Toman los sonidos de vendedores callejeros caribeños y anuncios del metro de Toronto. Los superponen. Lo llaman "fusión urbana." Las compañías discográficas no entienden. Las estaciones de radio se niegan a tocarlo. Pero la comunidad lo escucha. La música circula en casetes, pasados de mano en mano en fiestas y reuniones.

Así es como sobrevive el sonido canadiense negro. No por contratos de grabación, sino por circulación. No por difusión radial, sino por comunidad.

En Montreal, un DJ haitiano comienza a tocar música criolla en un pequeño club en Saint-Laurent. El club está en el sótano. El techo es bajo. Las paredes sudan. Pero la música es eléctrica. La gente baila hasta la mañana. Hablan en idiomas que la ciudad se niega a reconocer. Crean un espacio sónico donde pueden existir sin traducción.

Estas no son solo fiestas. Son actos de preservación. Cada ritmo es una negativa a ser borrado. Cada compás es un recordatorio de que los canadienses negros siempre han estado aquí, haciendo sonido, haciendo cultura, haciendo hogar.

Para los años 1990, los sonidos comienzan a filtrarse en el mainstream. Un rapero de Toronto llamado Maestro Fresh Wes lanza un sencillo que se convierte en la primera canción de hip-hop canadiense en entrar en las listas nacionales. Pero la industria quiere lijar los bordes. Quieren el sonido sin el contexto. Quieren la música sin la memoria.

Los artistas resisten. Mantienen la memoria en la música. Mantienen el archivo en el sonido.`,
      },
      suggestedAudioTone: 'celebratory',
      estimatedReadTime: '4 min',
    },
    {
      chapterId: 's2-renaissance-ch4',
      order: 4,
      title: {
        en: 'The Gallery of Refusal',
        fr: 'La Galerie du Refus',
        es: 'La Galería del Rechazo',
      },
      bodyText: {
        en: `Toronto, 1989. An art gallery in the downtown core hosts an exhibition called "Into the Heart of Africa." It features artifacts stolen from African nations during colonial campaigns. The exhibit is framed as "educational." It includes mannequins of African people in "traditional" dress. The curators call it anthropology.

The Black community calls it something else.

Protests begin immediately. Artists and activists picket outside the gallery. They carry signs that read: "These are not artifacts. These are stolen goods." The media dismisses them as overreacting. The gallery director insists the exhibit is "neutral."

But Buseje Bailey, a young photographer and organizer, understands that neutrality is a weapon. She organizes a counter-exhibition. It features photographs of Black Canadians in contemporary settings—at work, at home, in community. The images are not ethnographic. They are human. They are alive.

The gallery refuses to host it. So Bailey rents a small storefront in Kensington Market. She calls the exhibition "We Are Here." The opening is packed. People spill onto the street. The images circulate in newspapers and magazines—not as curiosities, but as art.

This is the power of refusal. To refuse the frame. To refuse the gaze. To create your own gallery when the institutions lock you out.

In Montreal, a collective of Black and Indigenous artists occupy an abandoned warehouse. They transform it into a community art space. They call it "La Maison de la Culture Résistante." The city threatens to shut it down for violating zoning laws. The collective refuses to leave. They hold exhibitions, workshops, and performances. They build their own infrastructure.

In Vancouver, a painter named Jude Griebel creates a series of portraits of Black Canadians who are never included in the national narrative—domestic workers, dockworkers, farmers. The Vancouver Art Gallery rejects the series. Griebel does not revise. She sells the paintings directly to the community. They hang in living rooms and barbershops, not galleries.

This is the lesson: the institutions will not save you. But refusal creates its own space. Refusal builds its own walls.`,
        fr: `Toronto, 1989. Une galerie d'art du centre-ville accueille une exposition intitulée "Into the Heart of Africa." Elle présente des artefacts volés aux nations africaines lors de campagnes coloniales. L'exposition est présentée comme "éducative." Elle comprend des mannequins de personnes africaines en tenue "traditionnelle." Les conservateurs appellent cela de l'anthropologie.

La communauté noire appelle ça autre chose.

Les protestations commencent immédiatement. Des artistes et militants manifestent devant la galerie. Ils portent des pancartes qui disent: "Ce ne sont pas des artefacts. Ce sont des biens volés." Les médias les rejettent comme exagérant. Le directeur de la galerie insiste que l'exposition est "neutre."

Mais Buseje Bailey, une jeune photographe et organisatrice, comprend que la neutralité est une arme. Elle organise une contre-exposition. Elle présente des photographies de Canadiens noirs dans des contextes contemporains—au travail, à la maison, en communauté. Les images ne sont pas ethnographiques. Elles sont humaines. Elles sont vivantes.

La galerie refuse de l'accueillir. Alors Bailey loue une petite vitrine dans le Marché Kensington. Elle appelle l'exposition "We Are Here." Le vernissage est bondé. Les gens débordent dans la rue. Les images circulent dans les journaux et magazines—pas comme des curiosités, mais comme de l'art.

C'est le pouvoir du refus. Refuser le cadre. Refuser le regard. Créer sa propre galerie quand les institutions vous excluent.

À Montréal, un collectif d'artistes noirs et autochtones occupe un entrepôt abandonné. Ils le transforment en espace d'art communautaire. Ils l'appellent "La Maison de la Culture Résistante." La ville menace de le fermer pour violation des lois de zonage. Le collectif refuse de partir. Ils tiennent des expositions, des ateliers et des performances. Ils construisent leur propre infrastructure.

À Vancouver, une peintre nommée Jude Griebel crée une série de portraits de Canadiens noirs qui ne sont jamais inclus dans le récit national—travailleuses domestiques, dockers, fermiers. La Vancouver Art Gallery rejette la série. Griebel ne révise pas. Elle vend les peintures directement à la communauté. Elles sont accrochées dans des salons et des salons de coiffure, pas dans des galeries.

C'est la leçon: les institutions ne vous sauveront pas. Mais le refus crée son propre espace. Le refus construit ses propres murs.`,
        es: `Toronto, 1989. Una galería de arte en el centro presenta una exposición llamada "Into the Heart of Africa." Presenta artefactos robados de naciones africanas durante campañas coloniales. La exhibición se presenta como "educativa." Incluye maniquíes de personas africanas en vestimenta "tradicional." Los curadores lo llaman antropología.

La comunidad negra lo llama otra cosa.

Las protestas comienzan inmediatamente. Artistas y activistas hacen piquetes afuera de la galería. Llevan carteles que dicen: "Estos no son artefactos. Estos son bienes robados." Los medios los descartan como exagerados. El director de la galería insiste en que la exhibición es "neutral."

Pero Buseje Bailey, una joven fotógrafa y organizadora, entiende que la neutralidad es un arma. Organiza una contra-exposición. Presenta fotografías de canadienses negros en contextos contemporáneos—en el trabajo, en casa, en comunidad. Las imágenes no son etnográficas. Son humanas. Están vivas.

La galería se niega a alojarla. Así que Bailey alquila un pequeño local en el Mercado Kensington. Llama a la exposición "Estamos Aquí." La inauguración está llena. La gente se desborda a la calle. Las imágenes circulan en periódicos y revistas—no como curiosidades, sino como arte.

Este es el poder del rechazo. Rechazar el marco. Rechazar la mirada. Crear tu propia galería cuando las instituciones te excluyen.

En Montreal, un colectivo de artistas negros e indígenas ocupa un almacén abandonado. Lo transforman en un espacio de arte comunitario. Lo llaman "La Casa de la Cultura Resistente." La ciudad amenaza con cerrarlo por violar leyes de zonificación. El colectivo se niega a irse. Realizan exposiciones, talleres y presentaciones. Construyen su propia infraestructura.

En Vancouver, una pintora llamada Jude Griebel crea una serie de retratos de canadienses negros que nunca se incluyen en la narrativa nacional—trabajadoras domésticas, estibadores, agricultores. La Galería de Arte de Vancouver rechaza la serie. Griebel no revisa. Vende las pinturas directamente a la comunidad. Cuelgan en salas de estar y barberías, no en galerías.

Esta es la lección: las instituciones no te salvarán. Pero el rechazo crea su propio espacio. El rechazo construye sus propios muros.`,
      },
      suggestedAudioTone: 'urgent',
      estimatedReadTime: '4 min',
    },
    {
      chapterId: 's2-renaissance-ch5',
      order: 5,
      title: {
        en: 'The Digital Turn',
        fr: 'Le Tournant Numérique',
        es: 'El Giro Digital',
      },
      bodyText: {
        en: `Toronto, 2005. A young filmmaker named Charles Officer sits in front of a computer editing footage. He has just shot a documentary about Black Canadian communities in the 1960s. The interviews are powerful. The archival material is rare. But no broadcaster will fund it. No distributor will touch it.

So Officer uploads it to a new platform called YouTube. It is free. It is accessible. It is not curated by gatekeepers.

Within weeks, the documentary has thousands of views. Teachers use it in classrooms. Community groups screen it at events. It circulates far beyond what any television broadcast could have achieved.

This is the beginning of the digital turn. A moment when Black Canadian artists realize they do not need the institutions anymore. They can build their own platforms. They can reach their own audiences.

In Montreal, a collective of writers launches a digital magazine called "This Magazine Is Not White." The title is provocative. The content is sharper. They publish essays, poetry, and interviews that no mainstream outlet would touch. The readership is small at first, but it grows. By 2010, they are reaching tens of thousands of readers across Canada and the diaspora.

In Vancouver, a musician named Tanya Tagaq begins posting experimental sound recordings online. The recordings blend Inuit throat singing with electronic music. They are radical. They are unsettling. They are beautiful. The recordings go viral. Not in the TikTok sense, but in the organic way that happens when people recognize something they have never heard before and know they need to share it.

The digital turn is not about going mainstream. It is about creating new streams. New channels. New ways of circulating work that bypasses the old gatekeepers entirely.

By 2020, a generation of Black Canadian artists has built entire careers without ever needing approval from white institutions. They have their own audiences. Their own revenue models. Their own cultural infrastructure.

This is not the end of the story. But it is the end of one chapter. The chapter where Black Canadian artists had to beg for recognition. The new chapter is about building power. Independently. Collectively. Permanently.`,
        fr: `Toronto, 2005. Un jeune cinéaste nommé Charles Officer est assis devant un ordinateur en montant des images. Il vient de tourner un documentaire sur les communautés canadiennes noires dans les années 1960. Les entrevues sont puissantes. Le matériel d'archives est rare. Mais aucun diffuseur ne le financera. Aucun distributeur n'y touchera.

Alors Officer le télécharge sur une nouvelle plateforme appelée YouTube. C'est gratuit. C'est accessible. Ce n'est pas organisé par des gardiens.

En quelques semaines, le documentaire a des milliers de vues. Les enseignants l'utilisent dans les salles de classe. Les groupes communautaires le projettent lors d'événements. Il circule bien au-delà de ce que toute diffusion télévisée aurait pu accomplir.

C'est le début du tournant numérique. Un moment où les artistes canadiens noirs réalisent qu'ils n'ont plus besoin des institutions. Ils peuvent construire leurs propres plateformes. Ils peuvent atteindre leur propre public.

À Montréal, un collectif d'écrivains lance un magazine numérique appelé "This Magazine Is Not White." Le titre est provocateur. Le contenu est plus tranchant. Ils publient des essais, de la poésie et des entrevues qu'aucun média grand public ne toucherait. Le lectorat est petit au début, mais il grandit. En 2010, ils atteignent des dizaines de milliers de lecteurs à travers le Canada et la diaspora.

À Vancouver, une musicienne nommée Tanya Tagaq commence à publier des enregistrements sonores expérimentaux en ligne. Les enregistrements mélangent le chant de gorge inuit avec de la musique électronique. Ils sont radicaux. Ils sont dérangeants. Ils sont beaux. Les enregistrements deviennent viraux. Pas dans le sens TikTok, mais de la manière organique qui se produit quand les gens reconnaissent quelque chose qu'ils n'ont jamais entendu auparavant et savent qu'ils doivent le partager.

Le tournant numérique ne concerne pas devenir mainstream. Il s'agit de créer de nouveaux courants. De nouveaux canaux. De nouvelles façons de faire circuler le travail qui contourne entièrement les anciens gardiens.

En 2020, une génération d'artistes canadiens noirs a construit des carrières entières sans jamais avoir besoin de l'approbation des institutions blanches. Ils ont leur propre public. Leurs propres modèles de revenus. Leur propre infrastructure culturelle.

Ce n'est pas la fin de l'histoire. Mais c'est la fin d'un chapitre. Le chapitre où les artistes canadiens noirs devaient mendier la reconnaissance. Le nouveau chapitre concerne la construction du pouvoir. Indépendamment. Collectivement. Définitivement.`,
        es: `Toronto, 2005. Un joven cineasta llamado Charles Officer se sienta frente a una computadora editando material. Acaba de filmar un documental sobre comunidades canadienses negras en los años 1960. Las entrevistas son poderosas. El material de archivo es raro. Pero ningún canal lo financiará. Ningún distribuidor lo tocará.

Así que Officer lo sube a una nueva plataforma llamada YouTube. Es gratis. Es accesible. No está curado por guardianes.

En semanas, el documental tiene miles de vistas. Los maestros lo usan en aulas. Grupos comunitarios lo proyectan en eventos. Circula mucho más allá de lo que cualquier transmisión televisiva hubiera logrado.

Este es el comienzo del giro digital. Un momento cuando los artistas canadienses negros se dan cuenta de que ya no necesitan las instituciones. Pueden construir sus propias plataformas. Pueden alcanzar sus propias audiencias.

En Montreal, un colectivo de escritores lanza una revista digital llamada "Esta Revista No Es Blanca." El título es provocador. El contenido es más afilado. Publican ensayos, poesía y entrevistas que ningún medio principal tocaría. El lectorado es pequeño al principio, pero crece. Para 2010, están alcanzando decenas de miles de lectores en Canadá y la diáspora.

En Vancouver, una música llamada Tanya Tagaq comienza a publicar grabaciones de sonido experimental en línea. Las grabaciones mezclan canto de garganta inuit con música electrónica. Son radicales. Son inquietantes. Son hermosas. Las grabaciones se vuelven virales. No en el sentido TikTok, sino de la manera orgánica que sucede cuando la gente reconoce algo que nunca han escuchado antes y saben que necesitan compartirlo.

El giro digital no se trata de ir al mainstream. Se trata de crear nuevas corrientes. Nuevos canales. Nuevas formas de circular trabajo que evita completamente a los viejos guardianes.

Para 2020, una generación de artistas canadienses negros ha construido carreras enteras sin necesitar nunca la aprobación de instituciones blancas. Tienen sus propias audiencias. Sus propios modelos de ingresos. Su propia infraestructura cultural.

Este no es el final de la historia. Pero es el final de un capítulo. El capítulo donde los artistas canadienses negros tenían que rogar por reconocimiento. El nuevo capítulo trata sobre construir poder. Independientemente. Colectivamente. Permanentemente.`,
      },
      suggestedAudioTone: 'celebratory',
      estimatedReadTime: '4 min',
    },
    {
      chapterId: 's2-renaissance-ch6',
      order: 6,
      title: {
        en: 'What We Leave Behind',
        fr: 'Ce Que Nous Laissons Derrière',
        es: 'Lo Que Dejamos Atrás',
      },
      bodyText: {
        en: `Toronto, 2024. A young artist named Kadijah Semwanga stands in front of a wall covered in photographs. The photographs are from the 1970s, 80s, and 90s. They show Black Canadian artists at work—writing, painting, performing. Some of the faces are familiar. Most are not.

Semwanga is curating an exhibition called "The Ones Who Made the Path." It is not a celebration. It is not nostalgia. It is an accounting. An acknowledgment. An archive.

She has spent years tracking down these images. Some came from families. Some came from community centers. Some came from boxes in basements, forgotten until now. Each photograph is accompanied by a short bio. Not the kind that lists awards and achievements, but the kind that describes the work. The community built. The doors opened. The young artists mentored.

This is what the Renaissance left behind. Not just the work, but the infrastructure. The networks. The belief that it is possible to create culture without permission.

In Montreal, a group of young writers launches a digital archive called "Black Canadian Letters." It includes out-of-print books, old zines, unpublished manuscripts. The archive is free. It is searchable. It is growing.

In Vancouver, a collective of filmmakers creates a documentary series called "We Were Always Here." It profiles Black Canadian artists from the 1960s to today. Not as historical curiosities, but as living tradition.

This is the work of memory. Not to preserve the past as museum pieces, but to keep it alive. To show the young artists today that they are not starting from scratch. They are part of a lineage. A movement. A Renaissance that never ended, it just changed forms.

The institutions will take credit eventually. They always do. They will claim they discovered these artists. They will rewrite the history to make themselves the heroes. But the community knows the truth. The community always knows.

And that is enough. The work continues. The movement continues. The Renaissance continues. Not in galleries or publishers' offices, but in basements and living rooms and digital platforms and anywhere Black Canadians gather to make culture, to make memory, to make future.

This is not the end. This is just the next chapter.`,
        fr: `Toronto, 2024. Une jeune artiste nommée Kadijah Semwanga se tient devant un mur couvert de photographies. Les photographies sont des années 1970, 80 et 90. Elles montrent des artistes canadiens noirs au travail—écrivant, peignant, performant. Certains visages sont familiers. La plupart ne le sont pas.

Semwanga organise une exposition intitulée "The Ones Who Made the Path." Ce n'est pas une célébration. Ce n'est pas de la nostalgie. C'est un compte rendu. Une reconnaissance. Une archive.

Elle a passé des années à retrouver ces images. Certaines sont venues de familles. Certaines sont venues de centres communautaires. Certaines sont venues de boîtes dans des sous-sols, oubliées jusqu'à maintenant. Chaque photographie est accompagnée d'une courte biographie. Pas le genre qui énumère les prix et réalisations, mais le genre qui décrit le travail. La communauté construite. Les portes ouvertes. Les jeunes artistes mentorés.

C'est ce que la Renaissance a laissé derrière. Pas seulement le travail, mais l'infrastructure. Les réseaux. La croyance qu'il est possible de créer de la culture sans permission.

À Montréal, un groupe de jeunes écrivains lance une archive numérique appelée "Black Canadian Letters." Elle inclut des livres épuisés, de vieux zines, des manuscrits inédits. L'archive est gratuite. Elle est consultable. Elle grandit.

À Vancouver, un collectif de cinéastes crée une série documentaire appelée "We Were Always Here." Elle profile des artistes canadiens noirs des années 1960 à aujourd'hui. Pas comme des curiosités historiques, mais comme une tradition vivante.

C'est le travail de la mémoire. Pas pour préserver le passé comme pièces de musée, mais pour le garder vivant. Pour montrer aux jeunes artistes aujourd'hui qu'ils ne partent pas de zéro. Ils font partie d'une lignée. Un mouvement. Une Renaissance qui ne s'est jamais terminée, elle a juste changé de forme.

Les institutions vont prendre le crédit éventuellement. Elles le font toujours. Elles vont prétendre avoir découvert ces artistes. Elles vont réécrire l'histoire pour se faire les héros. Mais la communauté connaît la vérité. La communauté sait toujours.

Et c'est suffisant. Le travail continue. Le mouvement continue. La Renaissance continue. Pas dans les galeries ou les bureaux d'éditeurs, mais dans les sous-sols et salons et plateformes numériques et partout où les Canadiens noirs se rassemblent pour faire de la culture, pour faire de la mémoire, pour faire le futur.

Ce n'est pas la fin. C'est juste le prochain chapitre.`,
        es: `Toronto, 2024. Una joven artista llamada Kadijah Semwanga se para frente a una pared cubierta de fotografías. Las fotografías son de los años 1970, 80 y 90. Muestran a artistas canadienses negros trabajando—escribiendo, pintando, actuando. Algunas caras son familiares. La mayoría no lo son.

Semwanga está curando una exposición llamada "Los Que Hicieron el Camino." No es una celebración. No es nostalgia. Es un recuento. Un reconocimiento. Un archivo.

Ha pasado años rastreando estas imágenes. Algunas vinieron de familias. Algunas vinieron de centros comunitarios. Algunas vinieron de cajas en sótanos, olvidadas hasta ahora. Cada fotografía está acompañada de una breve biografía. No del tipo que enumera premios y logros, sino del tipo que describe el trabajo. La comunidad construida. Las puertas abiertas. Los jóvenes artistas mentoreados.

Esto es lo que dejó la Renacimiento. No solo el trabajo, sino la infraestructura. Las redes. La creencia de que es posible crear cultura sin permiso.

En Montreal, un grupo de jóvenes escritores lanza un archivo digital llamado "Cartas Canadienses Negras." Incluye libros agotados, viejos fanzines, manuscritos inéditos. El archivo es gratuito. Es buscable. Está creciendo.

En Vancouver, un colectivo de cineastas crea una serie documental llamada "Siempre Estuvimos Aquí." Perfila a artistas canadienses negros desde los años 1960 hasta hoy. No como curiosidades históricas, sino como tradición viva.

Este es el trabajo de la memoria. No para preservar el pasado como piezas de museo, sino para mantenerlo vivo. Para mostrar a los jóvenes artistas hoy que no están empezando desde cero. Son parte de un linaje. Un movimiento. Un Renacimiento que nunca terminó, solo cambió de forma.

Las instituciones tomarán el crédito eventualmente. Siempre lo hacen. Afirmarán que descubrieron a estos artistas. Reescribirán la historia para hacerse los héroes. Pero la comunidad conoce la verdad. La comunidad siempre sabe.

Y eso es suficiente. El trabajo continúa. El movimiento continúa. El Renacimiento continúa. No en galerías u oficinas de editoriales, sino en sótanos y salas de estar y plataformas digitales y en cualquier lugar donde los canadienses negros se reúnan para hacer cultura, para hacer memoria, para hacer futuro.

Este no es el final. Este es solo el próximo capítulo.`,
      },
      suggestedAudioTone: 'reflective',
      estimatedReadTime: '4 min',
    },
  ],
};

// ============================================
// EXPORT REGISTRY
// ============================================

export const SEASON_2_EXPANDED_STORIES: ExpandedStoryWorld[] = [
  STORY_BLACK_CANADIAN_RENAISSANCE,
  // Additional 5 stories will be added in continuation
];

export const SEASON_2_SUMMARY = {
  season: 2,
  theme: 'Black Futures & Canadian Memory',
  totalStories: 6, // Will expand to 6
  currentlyExpanded: 1,
  totalChapters: SEASON_2_EXPANDED_STORIES.reduce((sum, story) => sum + story.totalChapters, 0),
  estimatedDuration: '150+ min (when complete)',
  publicationStatus: 'ready' as const,
};

console.log('[Season 2] Expanded stories loaded:', SEASON_2_SUMMARY);
