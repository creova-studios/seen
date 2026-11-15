/**
 * BLACK CANADIAN HISTORY STORY WORLDS
 * SEEN by CREOVA — Publishable Content
 * 
 * These stories ARE eligible to surface in Explore and For You
 * Culturally grounded, Canadian-specific narratives
 */

import type { StoryWorld, Chapter, ContextCard, MultilingualText } from './types';

// ============================================
// STORY 1: BLACK LOYALISTS
// ============================================

const BLACK_LOYALISTS_STORY: StoryWorld = {
  id: 'black-loyalists',
  title: {
    en: 'Black Loyalists: Promised Freedom',
    fr: 'Loyalistes Noirs: Liberté Promise',
    es: 'Leales Negros: Libertad Prometida',
  },
  shortDescription: {
    en: 'The untold story of Black Loyalists who fled to Canada seeking freedom, only to face broken promises.',
    fr: 'L\'histoire méconnue des Loyalistes Noirs qui ont fui vers le Canada cherchant la liberté, pour faire face à des promesses brisées.',
    es: 'La historia no contada de Leales Negros que huyeron a Canadá buscando libertad, solo para enfrentar promesas rotas.',
  },
  longDescription: {
    en: '1783. The American Revolution ends. Thousands of enslaved Black people who fought for the British are promised freedom and land in Canada. They arrive in Nova Scotia to find harsh conditions, broken promises, and systemic racism. This is not a story of Canadian benevolence — it is a story of survival against betrayal.',
    fr: '1783. La Révolution américaine se termine. Des milliers de personnes noires asservies qui ont combattu pour les Britanniques se voient promettre la liberté et des terres au Canada. Ils arrivent en Nouvelle-Écosse pour trouver des conditions difficiles, des promesses brisées, et du racisme systémique. Ce n\'est pas une histoire de bienveillance canadienne — c\'est une histoire de survie contre la trahison.',
    es: '1783. La Revolución Americana termina. Miles de personas negras esclavizadas que lucharon por los británicos reciben promesas de libertad y tierra en Canadá. Llegan a Nueva Escocia para encontrar condiciones duras, promesas rotas, y racismo sistémico. Esta no es una historia de benevolencia canadiense — es una historia de supervivencia contra traición.',
  },
  coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=1200&fit=crop',
  culturalThemes: ['Black Canadian History', 'Migration & Diaspora', 'Systemic Racism', 'Resistance & Survival'],
  language: 'en',
  estimatedDuration: '18 min',
  createdDate: 'Feb 2026',
  featured: true,
  new: true,
  trending: false,
  chapters: [
    {
      id: 'black-loyalists-ch1',
      title: {
        en: 'Chapter 1: The Promise',
        fr: 'Chapitre 1: La Promesse',
        es: 'Capítulo 1: La Promesa',
      },
      text: {
        en: `1775. Virginia. An enslaved man named Thomas Peters hears the proclamation.

Lord Dunmore, the British governor, has made an offer: Any enslaved person who escapes and joins the British forces will be granted freedom.

Freedom. The word itself is dangerous to speak aloud.

Thomas Peters is not naive. He knows the British are not liberators. They are desperate. They need soldiers. They need labor. They need bodies.

But freedom is freedom. Even if it comes from an empire.

He escapes. He fights. He survives the war.

And when the war ends, the British keep their word — partially. They will grant freedom. They will relocate Black Loyalists to Nova Scotia, Canada.

Land. Opportunity. A new life.

Thomas Peters boards a ship in 1783. He is forty years old. He has fought for his freedom. Now he will claim it.

The ship sails north. Away from slavery. Toward what he hopes will be home.

But the Canada he arrives in is not the Canada he was promised.`,
        fr: `1775. Virginie. Un homme asservi nommé Thomas Peters entend la proclamation.

Lord Dunmore, le gouverneur britannique, a fait une offre: Toute personne asservie qui s'échappe et rejoint les forces britanniques se verra accorder la liberté.

Liberté. Le mot lui-même est dangereux à prononcer à voix haute.

Thomas Peters n'est pas naïf. Il sait que les Britanniques ne sont pas des libérateurs. Ils sont désespérés. Ils ont besoin de soldats. Ils ont besoin de main-d'œuvre. Ils ont besoin de corps.

Mais la liberté, c'est la liberté. Même si elle vient d'un empire.

Il s'échappe. Il combat. Il survit à la guerre.

Et quand la guerre se termine, les Britanniques tiennent parole — partiellement. Ils accorderont la liberté. Ils relocaliseront les Loyalistes Noirs en Nouvelle-Écosse, Canada.

Terre. Opportunité. Une nouvelle vie.

Thomas Peters monte à bord d'un navire en 1783. Il a quarante ans. Il s'est battu pour sa liberté. Maintenant, il va la réclamer.

Le navire navigue vers le nord. Loin de l'esclavage. Vers ce qu'il espère être chez lui.

Mais le Canada dans lequel il arrive n'est pas le Canada qui lui a été promis.`,
        es: `1775. Virginia. Un hombre esclavizado llamado Thomas Peters escucha la proclamación.

Lord Dunmore, el gobernador británico, ha hecho una oferta: Cualquier persona esclavizada que escape y se una a las fuerzas británicas recibirá libertad.

Libertad. La palabra misma es peligrosa de pronunciar en voz alta.

Thomas Peters no es ingenuo. Sabe que los británicos no son libertadores. Están desesperados. Necesitan soldados. Necesitan mano de obra. Necesitan cuerpos.

Pero libertad es libertad. Incluso si viene de un imperio.

Escapa. Lucha. Sobrevive la guerra.

Y cuando la guerra termina, los británicos cumplen su palabra — parcialmente. Otorgarán libertad. Reubicarán a Leales Negros en Nueva Escocia, Canadá.

Tierra. Oportunidad. Una nueva vida.

Thomas Peters aborda un barco en 1783. Tiene cuarenta años. Ha luchado por su libertad. Ahora la reclamará.

El barco navega hacia el norte. Lejos de la esclavitud. Hacia lo que espera será hogar.

Pero el Canadá al que llega no es el Canadá que le prometieron.`,
      },
      duration: 180,
    },
    {
      id: 'black-loyalists-ch2',
      title: {
        en: 'Chapter 2: Birchtown',
        fr: 'Chapitre 2: Birchtown',
        es: 'Capítulo 2: Birchtown',
      },
      text: {
        en: `Birchtown, Nova Scotia. 1784.

This is supposed to be freedom. But it looks like survival.

Over 3,000 Black Loyalists settle here. It is the largest free Black settlement outside of Africa. That should mean something. Pride. Hope. Community.

But the land they are given is rocky. Infertile. Impossible to farm.

White Loyalists get better land. Bigger plots. Tools. Support.

Black Loyalists get scraps.

Thomas Peters receives his allotment: barren land, no resources, and a winter approaching that will kill anyone unprepared.

The British promised equality. But here, Black freedom is conditional. It exists at the margins. It is tolerated, not celebrated.

Thomas Peters begins to organize. He writes letters. He petitions the government. He demands what was promised: real land, real support, real freedom.

The government ignores him.

So he keeps writing. He keeps organizing. He refuses to accept that this is all freedom can be.

Birchtown becomes a place of resilience. Churches are built. Schools are started. Families put down roots in hostile soil.

But survival is not the same as thriving. And Thomas Peters knows it.`,
        fr: `Birchtown, Nouvelle-Écosse. 1784.

C'est censé être la liberté. Mais ça ressemble à la survie.

Plus de 3,000 Loyalistes Noirs s'installent ici. C'est la plus grande colonie noire libre en dehors de l'Afrique. Cela devrait signifier quelque chose. Fierté. Espoir. Communauté.

Mais la terre qu'on leur donne est rocheuse. Infertile. Impossible à cultiver.

Les Loyalistes blancs obtiennent de meilleures terres. Des parcelles plus grandes. Des outils. Du soutien.

Les Loyalistes Noirs reçoivent des restes.

Thomas Peters reçoit son allocation: terre stérile, aucune ressource, et un hiver approchant qui tuera quiconque n'est pas préparé.

Les Britanniques ont promis l'égalité. Mais ici, la liberté noire est conditionnelle. Elle existe en marge. Elle est tolérée, non célébrée.

Thomas Peters commence à s'organiser. Il écrit des lettres. Il pétitionne le gouvernement. Il exige ce qui a été promis: vraie terre, vrai soutien, vraie liberté.

Le gouvernement l'ignore.

Alors il continue d'écrire. Il continue de s'organiser. Il refuse d'accepter que c'est tout ce que la liberté peut être.

Birchtown devient un lieu de résilience. Des églises sont construites. Des écoles sont démarrées. Les familles s'enracinent dans un sol hostile.

Mais survivre n'est pas la même chose que prospérer. Et Thomas Peters le sait.`,
        es: `Birchtown, Nueva Escocia. 1784.

Se supone que esto es libertad. Pero parece supervivencia.

Más de 3,000 Leales Negros se establecen aquí. Es el asentamiento negro libre más grande fuera de África. Eso debería significar algo. Orgullo. Esperanza. Comunidad.

Pero la tierra que reciben es rocosa. Infértil. Imposible de cultivar.

Leales blancos reciben mejor tierra. Parcelas más grandes. Herramientas. Apoyo.

Leales Negros reciben sobras.

Thomas Peters recibe su asignación: tierra estéril, sin recursos, y un invierno acercándose que matará a cualquiera que no esté preparado.

Los británicos prometieron igualdad. Pero aquí, libertad negra es condicional. Existe en los márgenes. Es tolerada, no celebrada.

Thomas Peters comienza a organizar. Escribe cartas. Presenta peticiones al gobierno. Exige lo prometido: tierra real, apoyo real, libertad real.

El gobierno lo ignora.

Así que sigue escribiendo. Sigue organizando. Se niega a aceptar que esto es todo lo que puede ser la libertad.

Birchtown se convierte en lugar de resiliencia. Se construyen iglesias. Se inician escuelas. Familias echan raíces en suelo hostil.

Pero sobrevivir no es lo mismo que prosperar. Y Thomas Peters lo sabe.`,
      },
      duration: 200,
    },
    {
      id: 'black-loyalists-ch3',
      title: {
        en: 'Chapter 3: Petition for Justice',
        fr: 'Chapitre 3: Pétition pour la Justice',
        es: 'Capítulo 3: Petición por Justicia',
      },
      text: {
        en: `1790. Thomas Peters has had enough.

Six years of broken promises. Six years of watching his community struggle on barren land. Six years of writing letters that go unanswered.

He decides to go directly to the source.

He sails to London. He will petition the British Crown himself.

It is a radical act. A formerly enslaved Black man demanding accountability from an empire.

In London, he meets abolitionists. He presents his case. He speaks for Birchtown. For every Black Loyalist who was promised freedom and given survival.

His petition is clear: Give us the land you promised. Give us the resources. Or let us leave.

The Crown listens. Not because they care. But because they are embarrassed.

A solution is offered: relocation to Sierra Leone. A new colony in Africa for free Black people.

Some see this as defeat. A retreat from Canada.

Others see it as liberation. A chance to build a truly free Black society.

Thomas Peters sees it as the only option left.

In 1792, over 1,200 Black Loyalists board ships bound for Sierra Leone.

They leave Canada behind. Not because they failed. But because Canada failed them.`,
        fr: `1790. Thomas Peters en a assez.

Six ans de promesses brisées. Six ans à regarder sa communauté lutter sur des terres stériles. Six ans à écrire des lettres qui restent sans réponse.

Il décide d'aller directement à la source.

Il navigue vers Londres. Il va pétitionner la Couronne britannique lui-même.

C'est un acte radical. Un homme noir anciennement asservi exigeant la responsabilité d'un empire.

À Londres, il rencontre des abolitionnistes. Il présente son cas. Il parle pour Birchtown. Pour chaque Loyaliste Noir à qui on a promis la liberté et donné la survie.

Sa pétition est claire: Donnez-nous la terre que vous avez promise. Donnez-nous les ressources. Ou laissez-nous partir.

La Couronne écoute. Pas parce qu'elle se soucie. Mais parce qu'elle est embarrassée.

Une solution est offerte: relocalisation en Sierra Leone. Une nouvelle colonie en Afrique pour les personnes noires libres.

Certains y voient une défaite. Un retrait du Canada.

D'autres y voient une libération. Une chance de construire une société vraiment libre de Noirs.

Thomas Peters y voit la seule option restante.

En 1792, plus de 1,200 Loyalistes Noirs montent à bord de navires à destination de la Sierra Leone.

Ils laissent le Canada derrière eux. Pas parce qu'ils ont échoué. Mais parce que le Canada les a trahis.`,
        es: `1790. Thomas Peters ha tenido suficiente.

Seis años de promesas rotas. Seis años viendo su comunidad luchar en tierra estéril. Seis años escribiendo cartas sin respuesta.

Decide ir directamente a la fuente.

Navega a Londres. Presentará petición a la Corona Británica él mismo.

Es un acto radical. Un hombre negro anteriormente esclavizado exigiendo responsabilidad de un imperio.

En Londres, conoce abolicionistas. Presenta su caso. Habla por Birchtown. Por cada Leal Negro a quien prometieron libertad y dieron supervivencia.

Su petición es clara: Dennos la tierra que prometieron. Dennos los recursos. O déjennos ir.

La Corona escucha. No porque les importe. Sino porque están avergonzados.

Se ofrece una solución: reubicación a Sierra Leona. Una nueva colonia en África para personas negras libres.

Algunos lo ven como derrota. Un retiro de Canadá.

Otros lo ven como liberación. Una oportunidad de construir sociedad verdaderamente libre de Negros.

Thomas Peters lo ve como la única opción que queda.

En 1792, más de 1,200 Leales Negros abordan barcos con destino a Sierra Leona.

Dejan Canadá atrás. No porque fallaron. Sino porque Canadá les falló.`,
      },
      duration: 220,
    },
  ],
  contextCards: [
    {
      id: 'black-loyalists-context-1',
      title: {
        en: 'Who Were the Black Loyalists?',
        fr: 'Qui Étaient les Loyalistes Noirs?',
        es: '¿Quiénes Eran los Leales Negros?',
      },
      content: {
        en: 'Black Loyalists were approximately 3,000 formerly enslaved people who sided with the British during the American Revolution in exchange for promised freedom. After the war, they were relocated to Nova Scotia and New Brunswick. They faced systemic racism, poor land, and broken promises from the British Crown.',
        fr: 'Les Loyalistes Noirs étaient environ 3,000 personnes anciennement asservies qui se sont rangées du côté britannique pendant la Révolution américaine en échange de la liberté promise. Après la guerre, ils ont été relocalisés en Nouvelle-Écosse et au Nouveau-Brunswick. Ils ont fait face au racisme systémique, à de mauvaises terres, et à des promesses brisées de la Couronne britannique.',
        es: 'Los Leales Negros fueron aproximadamente 3,000 personas anteriormente esclavizadas que se pusieron del lado británico durante la Revolución Americana a cambio de libertad prometida. Después de la guerra, fueron reubicados en Nueva Escocia y New Brunswick. Enfrentaron racismo sistémico, tierra pobre, y promesas rotas de la Corona Británica.',
      },
      type: 'historical',
    },
    {
      id: 'black-loyalists-context-2',
      title: {
        en: 'Birchtown: Largest Free Black Settlement',
        fr: 'Birchtown: Plus Grande Colonie Noire Libre',
        es: 'Birchtown: Mayor Asentamiento Negro Libre',
      },
      content: {
        en: 'Birchtown, Nova Scotia (1783) became the largest free Black settlement outside of Africa, with over 3,000 residents. Despite its size, residents received poor land and minimal support. Many left for Sierra Leone in 1792. Today, Birchtown is a historic site honoring Black Loyalist heritage.',
        fr: 'Birchtown, Nouvelle-Écosse (1783) est devenue la plus grande colonie noire libre en dehors de l\'Afrique, avec plus de 3,000 résidents. Malgré sa taille, les résidents ont reçu de mauvaises terres et un soutien minimal. Beaucoup sont partis pour la Sierra Leone en 1792. Aujourd\'hui, Birchtown est un site historique honorant l\'héritage des Loyalistes Noirs.',
        es: 'Birchtown, Nueva Escocia (1783) se convirtió en el asentamiento negro libre más grande fuera de África, con más de 3,000 residentes. A pesar de su tamaño, residentes recibieron tierra pobre y apoyo mínimo. Muchos partieron a Sierra Leona en 1792. Hoy, Birchtown es sitio histórico honrando herencia de Leales Negros.',
      },
      type: 'place',
    },
  ],
};

// ============================================
// STORY 2: AFRICVILLE
// ============================================

const AFRICVILLE_STORY: StoryWorld = {
  id: 'africville-destroyed',
  title: {
    en: 'Africville: A Community Destroyed',
    fr: 'Africville: Une Communauté Détruite',
    es: 'Africville: Una Comunidad Destruida',
  },
  shortDescription: {
    en: 'The destruction of Africville, a thriving Black community in Halifax, through environmental racism and forced displacement.',
    fr: 'La destruction d\'Africville, une communauté noire prospère à Halifax, à travers le racisme environnemental et le déplacement forcé.',
    es: 'La destrucción de Africville, una próspera comunidad negra en Halifax, a través de racismo ambiental y desplazamiento forzado.',
  },
  longDescription: {
    en: 'Africville was a self-sufficient Black community in Halifax, Nova Scotia, founded in the 1840s. For over a century, residents built homes, churches, and a tight-knit community despite being denied basic services by the city. In the 1960s, Halifax demolished Africville under the guise of "urban renewal," relocating residents and erasing their neighborhood. This is environmental racism. This is cultural genocide. This is Africville.',
    fr: 'Africville était une communauté noire autonome à Halifax, Nouvelle-Écosse, fondée dans les années 1840. Pendant plus d\'un siècle, les résidents ont construit des maisons, des églises, et une communauté soudée malgré le refus de services de base par la ville. Dans les années 1960, Halifax a démoli Africville sous couvert de "renouvellement urbain," relocalisant les résidents et effaçant leur quartier. C\'est du racisme environnemental. C\'est du génocide culturel. C\'est Africville.',
    es: 'Africville era una comunidad negra autosuficiente en Halifax, Nueva Escocia, fundada en los 1840s. Durante más de un siglo, residentes construyeron hogares, iglesias, y una comunidad unida a pesar de serles negados servicios básicos por la ciudad. En los 1960s, Halifax demolió Africville bajo pretexto de "renovación urbana," reubicando residentes y borrando su vecindario. Esto es racismo ambiental. Esto es genocidio cultural. Esto es Africville.',
  },
  coverImage: 'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=800&h=1200&fit=crop',
  culturalThemes: ['Black Canadian History', 'Environmental Racism', 'Community Resistance', 'Forced Displacement'],
  language: 'en',
  estimatedDuration: '15 min',
  createdDate: 'Feb 2026',
  featured: true,
  new: true,
  trending: false,
  chapters: [
    {
      id: 'africville-ch1',
      title: {
        en: 'Chapter 1: The Settlement',
        fr: 'Chapitre 1: La Colonie',
        es: 'Capítulo 1: El Asentamiento',
      },
      text: {
        en: `1848. Bedford Basin, Halifax.

A community begins.

Black families settle on the shores of Bedford Basin. Some are descendants of Black Loyalists. Others are refugees from the United States, fleeing slavery through the Underground Railroad.

They name it Africville.

It is theirs. Not granted by the city. Not sanctioned by the government. Claimed through necessity and survival.

They build homes. They fish. They farm. They establish a church — Seaview African United Baptist Church, the heart of the community.

For over a century, Africville thrives. Not in spite of neglect, but through resilience.

The city of Halifax refuses to provide services. No water. No sewage. No paved roads. No garbage collection.

Instead, Halifax uses Africville as a dumping ground.

They build a prison nearby. An infectious disease hospital. A slaughterhouse. A dump.

Africville becomes surrounded by the city's waste.

But the community endures. Children grow up. Families pass down homes. The church bell rings every Sunday.

Africville is not perfect. But it is home.

And home is worth fighting for.`,
        fr: `1848. Bassin de Bedford, Halifax.

Une communauté commence.

Des familles noires s'installent sur les rives du Bassin de Bedford. Certaines sont des descendants de Loyalistes Noirs. D'autres sont des réfugiés des États-Unis, fuyant l'esclavage par le Chemin de Fer Clandestin.

Ils l'appellent Africville.

C'est à eux. Pas accordé par la ville. Pas sanctionné par le gouvernement. Réclamé par nécessité et survie.

Ils construisent des maisons. Ils pêchent. Ils cultivent. Ils établissent une église — Seaview African United Baptist Church, le cœur de la communauté.

Pendant plus d'un siècle, Africville prospère. Pas malgré la négligence, mais à travers la résilience.

La ville d'Halifax refuse de fournir des services. Pas d'eau. Pas d'égouts. Pas de routes pavées. Pas de collecte d'ordures.

Au lieu de cela, Halifax utilise Africville comme dépotoir.

Ils construisent une prison à proximité. Un hôpital de maladies infectieuses. Un abattoir. Un dépotoir.

Africville se retrouve entourée par les déchets de la ville.

Mais la communauté perdure. Les enfants grandissent. Les familles transmettent les maisons. La cloche de l'église sonne chaque dimanche.

Africville n'est pas parfaite. Mais c'est chez soi.

Et chez soi vaut la peine de se battre.`,
        es: `1848. Cuenca de Bedford, Halifax.

Una comunidad comienza.

Familias negras se establecen en las orillas de la Cuenca de Bedford. Algunas son descendientes de Leales Negros. Otras son refugiados de Estados Unidos, huyendo de la esclavitud a través del Ferrocarril Subterráneo.

La llaman Africville.

Es suya. No otorgada por la ciudad. No sancionada por el gobierno. Reclamada por necesidad y supervivencia.

Construyen hogares. Pescan. Cultivan. Establecen una iglesia — Seaview African United Baptist Church, el corazón de la comunidad.

Durante más de un siglo, Africville prospera. No a pesar del abandono, sino a través de la resiliencia.

La ciudad de Halifax se niega a proporcionar servicios. Sin agua. Sin alcantarillado. Sin caminos pavimentados. Sin recolección de basura.

En cambio, Halifax usa Africville como vertedero.

Construyen una prisión cerca. Un hospital de enfermedades infecciosas. Un matadero. Un vertedero.

Africville queda rodeada por desechos de la ciudad.

Pero la comunidad perdura. Niños crecen. Familias pasan hogares de generación en generación. La campana de la iglesia suena cada domingo.

Africville no es perfecta. Pero es hogar.

Y el hogar vale la pena luchar por él.`,
      },
      duration: 180,
    },
    {
      id: 'africville-ch2',
      title: {
        en: 'Chapter 2: Urban Renewal',
        fr: 'Chapitre 2: Renouvellement Urbain',
        es: 'Capítulo 2: Renovación Urbana',
      },
      text: {
        en: `1964. The City of Halifax makes a decision.

Africville must go.

They call it "urban renewal." They call it "relocation." They call it progress.

The residents call it what it is: destruction.

The city claims Africville is a slum. Unlivable. A blight on Halifax.

But it was the city that made it that way. The city that refused services. The city that dumped waste. The city that neglected infrastructure.

Now, the city wants the land.

Residents resist. They organize. They demand to stay. They demand services, not demolition.

The city does not listen.

One by one, homes are seized. Families are given relocation payments — far below market value. Some are moved to public housing projects. Others are scattered across the city.

The church, Seaview African United Baptist, is demolished in 1967.

Bulldozers arrive. Homes are flattened. A community of over 400 people is erased.

By 1970, Africville is gone.

Where homes once stood, there is now a park.

The city plants grass over the memory.

But memory does not die. And the fight for justice is not over.`,
        fr: `1964. La Ville d'Halifax prend une décision.

Africville doit disparaître.

Ils appellent ça "renouvellement urbain." Ils appellent ça "relocalisation." Ils appellent ça progrès.

Les résidents appellent ça ce que c'est: destruction.

La ville prétend qu'Africville est un taudis. Invivable. Une tache sur Halifax.

Mais c'est la ville qui l'a rendue ainsi. La ville qui a refusé les services. La ville qui a déversé des déchets. La ville qui a négligé l'infrastructure.

Maintenant, la ville veut le terrain.

Les résidents résistent. Ils s'organisent. Ils exigent de rester. Ils exigent des services, pas la démolition.

La ville n'écoute pas.

Une par une, les maisons sont saisies. Les familles reçoivent des paiements de relocalisation — bien en dessous de la valeur marchande. Certaines sont déplacées vers des projets de logements sociaux. D'autres sont dispersées à travers la ville.

L'église, Seaview African United Baptist, est démolie en 1967.

Les bulldozers arrivent. Les maisons sont rasées. Une communauté de plus de 400 personnes est effacée.

En 1970, Africville a disparu.

Là où se trouvaient des maisons, il y a maintenant un parc.

La ville plante de l'herbe sur la mémoire.

Mais la mémoire ne meurt pas. Et la lutte pour la justice n'est pas terminée.`,
        es: `1964. La Ciudad de Halifax toma una decisión.

Africville debe irse.

Lo llaman "renovación urbana." Lo llaman "reubicación." Lo llaman progreso.

Residentes lo llaman lo que es: destrucción.

La ciudad afirma que Africville es un barrio marginal. Inhabitable. Una mancha en Halifax.

Pero fue la ciudad quien lo hizo así. La ciudad que negó servicios. La ciudad que vertió desechos. La ciudad que descuidó infraestructura.

Ahora, la ciudad quiere el terreno.

Residentes resisten. Se organizan. Exigen quedarse. Exigen servicios, no demolición.

La ciudad no escucha.

Una por una, hogares son confiscados. Familias reciben pagos de reubicación — muy por debajo del valor de mercado. Algunas son movidas a proyectos de vivienda pública. Otras dispersadas por la ciudad.

La iglesia, Seaview African United Baptist, es demolida en 1967.

Llegan bulldozers. Hogares son aplastados. Una comunidad de más de 400 personas es borrada.

Para 1970, Africville ha desaparecido.

Donde alguna vez estuvieron hogares, ahora hay un parque.

La ciudad planta césped sobre la memoria.

Pero la memoria no muere. Y la lucha por justicia no ha terminado.`,
      },
      duration: 200,
    },
    {
      id: 'africville-ch3',
      title: {
        en: 'Chapter 3: Apology and Reparations',
        fr: 'Chapitre 3: Excuses et Réparations',
        es: 'Capítulo 3: Disculpa y Reparaciones',
      },
      text: {
        en: `2010. Forty years after the demolition.

The City of Halifax issues an apology.

"We are sorry."

Is it enough? Can words repair what was taken?

Former residents gather. Some are in their seventies and eighties now. They remember Africville. They remember home.

The apology is formal. Public. Political.

But apologies do not rebuild homes. Apologies do not undo trauma.

The city agrees to reparations. Compensation for displaced families. Funding for the Africville Museum, built on the site where the church once stood.

The museum opens. It tells the story. It preserves memory.

But many former residents will never return. Their community is gone. Their homes are ghosts.

The Africville Genealogy Society continues to fight. For full reparations. For acknowledgment. For justice.

Because this is not ancient history. This is living memory.

There are children today who grew up hearing stories of Africville from their grandparents. Stories of a place that should still exist.

Africville was not lost. Africville was taken.

And that truth must be remembered.`,
        fr: `2010. Quarante ans après la démolition.

La Ville d'Halifax présente des excuses.

"Nous sommes désolés."

Est-ce suffisant? Les mots peuvent-ils réparer ce qui a été pris?

Les anciens résidents se rassemblent. Certains ont maintenant dans la soixantaine-dix et quatre-vingts ans. Ils se souviennent d'Africville. Ils se souviennent de chez eux.

Les excuses sont formelles. Publiques. Politiques.

Mais les excuses ne reconstruisent pas les maisons. Les excuses n'annulent pas le traumatisme.

La ville accepte les réparations. Compensation pour les familles déplacées. Financement pour le Musée Africville, construit sur le site où se trouvait autrefois l'église.

Le musée ouvre. Il raconte l'histoire. Il préserve la mémoire.

Mais de nombreux anciens résidents ne reviendront jamais. Leur communauté a disparu. Leurs maisons sont des fantômes.

La Société de Généalogie Africville continue de se battre. Pour des réparations complètes. Pour la reconnaissance. Pour la justice.

Parce que ce n'est pas de l'histoire ancienne. C'est de la mémoire vivante.

Il y a des enfants aujourd'hui qui ont grandi en entendant des histoires d'Africville de leurs grands-parents. Des histoires d'un lieu qui devrait encore exister.

Africville n'a pas été perdue. Africville a été prise.

Et cette vérité doit être rappelée.`,
        es: `2010. Cuarenta años después de la demolición.

La Ciudad de Halifax emite una disculpa.

"Lo sentimos."

¿Es suficiente? ¿Pueden palabras reparar lo que fue tomado?

Antiguos residentes se reúnen. Algunos tienen ahora setenta y ochenta años. Recuerdan Africville. Recuerdan hogar.

La disculpa es formal. Pública. Política.

Pero disculpas no reconstruyen hogares. Disculpas no deshacen trauma.

La ciudad acepta reparaciones. Compensación para familias desplazadas. Financiamiento para Museo Africville, construido en el sitio donde alguna vez estuvo la iglesia.

El museo abre. Cuenta la historia. Preserva memoria.

Pero muchos antiguos residentes nunca regresarán. Su comunidad se ha ido. Sus hogares son fantasmas.

La Sociedad Genealógica Africville continúa luchando. Por reparaciones completas. Por reconocimiento. Por justicia.

Porque esto no es historia antigua. Esto es memoria viva.

Hay niños hoy que crecieron escuchando historias de Africville de sus abuelos. Historias de un lugar que debería seguir existiendo.

Africville no se perdió. Africville fue tomada.

Y esa verdad debe ser recordada.`,
      },
      duration: 180,
    },
  ],
  contextCards: [
    {
      id: 'africville-context-1',
      title: {
        en: 'Environmental Racism',
        fr: 'Racisme Environnemental',
        es: 'Racismo Ambiental',
      },
      content: {
        en: 'Environmental racism is the disproportionate exposure of racialized communities to environmental hazards. Africville faced this: no city services, surrounded by dumps, prisons, and slaughterhouses. This pattern continues today in many Canadian communities.',
        fr: 'Le racisme environnemental est l\'exposition disproportionnée des communautés racialisées aux dangers environnementaux. Africville a fait face à cela: aucun service municipal, entourée de dépotoirs, prisons, et abattoirs. Ce modèle continue aujourd\'hui dans de nombreuses communautés canadiennes.',
        es: 'Racismo ambiental es la exposición desproporcionada de comunidades racializadas a peligros ambientales. Africville enfrentó esto: sin servicios municipales, rodeada de vertederos, prisiones, y mataderos. Este patrón continúa hoy en muchas comunidades canadienses.',
      },
      type: 'cultural',
    },
  ],
};

// ============================================
// COMBINED EXPORT
// ============================================

export const BLACK_CANADIAN_HISTORY_STORIES: StoryWorld[] = [
  BLACK_LOYALISTS_STORY,
  AFRICVILLE_STORY,
];

// Note: Additional stories (Underground Railroad, Caribbean Migration, Black Porters)
// would follow the same structure. For brevity, showing 2 complete examples.
// The system can accommodate 5-7 full stories as needed.
