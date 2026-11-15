/**
 * SEASON 2 EXPANDED CHAPTERS - PART 2
 * Story World 2: The Sleeping Car Porters
 * 
 * Canadian Pacific Railway porters' history
 * Labor organizing, dignity, and resistance
 * 6 chapters, trilingual, audio-ready
 */

import type { ExpandedStoryWorld, StoryChapter, ContextCard } from './season2ExpandedChapters';

// ============================================
// STORY WORLD 2: SLEEPING CAR PORTERS
// ============================================

export const STORY_SLEEPING_CAR_PORTERS: ExpandedStoryWorld = {
  storyWorldId: 's2-sleeping-car-porters',
  season: 2,
  title: {
    en: 'The Sleeping Car Porters: Labor, Dignity, and the Rails',
    fr: 'Les Porteurs de Wagons-Lits: Travail, Dignité et les Rails',
    es: 'Los Mozos de Coches Cama: Trabajo, Dignidad y los Rieles',
  },
  description: {
    en: 'The story of Black men who built Canadian railways, served white passengers, and organized one of the country\'s most powerful labor movements.',
    fr: 'L\'histoire des hommes noirs qui ont construit les chemins de fer canadiens, servi les passagers blancs et organisé l\'un des mouvements ouvriers les plus puissants du pays.',
    es: 'La historia de hombres negros que construyeron ferrocarriles canadienses, sirvieron a pasajeros blancos y organizaron uno de los movimientos laborales más poderosos del país.',
  },
  totalChapters: 6,
  estimatedDuration: '28 min',
  narratorProfile: 'urgent-direct',
  publicationStatus: 'ready',
  chapters: [
    {
      chapterId: 's2-porters-ch1',
      order: 1,
      title: {
        en: 'The Job Nobody Wanted',
        fr: 'Le Travail Que Personne ne Voulait',
        es: 'El Trabajo Que Nadie Quería',
      },
      bodyText: {
        en: `Winnipeg, 1919. A white manager at Canadian Pacific Railway stands in front of a room full of Black men. He does not look at them directly. He speaks to the wall behind them.

"The job is simple," he says. "You make the beds. You shine the shoes. You serve the meals. You keep the passengers happy. You do not complain. You do not sit. You do not sleep. You smile."

The men listen. They know this is the only job available to them. Black men in Canada cannot work in banks. They cannot work in offices. They cannot work in factories where white men work. But they can work on the trains. They can carry luggage. They can bow.

The pay is thirty dollars a month. But most of that will be eaten by expenses—uniforms, shoe polish, food on routes where they are not allowed to eat in the dining car. The real money comes from tips. White passengers decide how much a Black porter is worth. Sometimes it is fifty cents. Sometimes it is nothing.

The hours are brutal. A porter might work twenty hours straight, then sleep four hours in a cramped berth, then work another twenty. There are no days off. No sick leave. If you miss a shift, you lose your job. And the railway makes sure there are ten men waiting to replace you.

But the men take the job. Not because it is good. But because it is the only door that is open.

Stanley Grizzle is seventeen years old when he starts working as a porter. His father was a porter. His uncle was a porter. In the Black community, being a porter means something. It means steady work. It means seeing the country. It means wearing a uniform—even if that uniform marks you as a servant.

The railway calls them "George." Every porter, no matter his name, is called "George." It is a joke. A cruel joke. George Pullman invented the sleeping car. So every Black man who serves in a sleeping car becomes "George." The passengers think it is funny. The porters do not laugh.

But they learn. They learn how to move invisibly through the train cars. They learn how to smile when a passenger snaps their fingers. They learn how to bite their tongues when a drunk man calls them a slur. They learn that survival is a performance.

And quietly, in the corners of the train cars and in the boarding houses where they sleep between shifts, they begin to talk. About the wages. About the hours. About the indignity. About what it would take to change it.

This is not a story about gratitude. This is a story about refusal.`,
        fr: `Winnipeg, 1919. Un directeur blanc du Canadien Pacifique se tient devant une salle pleine d'hommes noirs. Il ne les regarde pas directement. Il parle au mur derrière eux.

"Le travail est simple," dit-il. "Vous faites les lits. Vous cirez les chaussures. Vous servez les repas. Vous gardez les passagers heureux. Vous ne vous plaignez pas. Vous ne vous asseyez pas. Vous ne dormez pas. Vous souriez."

Les hommes écoutent. Ils savent que c'est le seul travail disponible pour eux. Les hommes noirs au Canada ne peuvent pas travailler dans les banques. Ils ne peuvent pas travailler dans les bureaux. Ils ne peuvent pas travailler dans les usines où travaillent les hommes blancs. Mais ils peuvent travailler dans les trains. Ils peuvent porter des bagages. Ils peuvent s'incliner.

Le salaire est de trente dollars par mois. Mais la plupart sera mangé par les dépenses—uniformes, cirage, nourriture sur les routes où ils ne sont pas autorisés à manger dans le wagon-restaurant. L'argent réel vient des pourboires. Les passagers blancs décident combien vaut un porteur noir. Parfois c'est cinquante cents. Parfois c'est rien.

Les heures sont brutales. Un porteur peut travailler vingt heures d'affilée, puis dormir quatre heures dans une couchette exiguë, puis travailler encore vingt heures. Il n'y a pas de jours de congé. Pas de congé maladie. Si vous manquez un quart, vous perdez votre emploi. Et la compagnie s'assure qu'il y a dix hommes qui attendent pour vous remplacer.

Mais les hommes prennent le travail. Pas parce que c'est bon. Mais parce que c'est la seule porte qui est ouverte.

Stanley Grizzle a dix-sept ans quand il commence à travailler comme porteur. Son père était porteur. Son oncle était porteur. Dans la communauté noire, être porteur signifie quelque chose. Cela signifie un travail stable. Cela signifie voir le pays. Cela signifie porter un uniforme—même si cet uniforme vous marque comme serviteur.

La compagnie les appelle "George." Chaque porteur, peu importe son nom, est appelé "George." C'est une blague. Une blague cruelle. George Pullman a inventé le wagon-lit. Alors chaque homme noir qui sert dans un wagon-lit devient "George." Les passagers pensent que c'est drôle. Les porteurs ne rient pas.

Mais ils apprennent. Ils apprennent à se déplacer invisiblement à travers les wagons. Ils apprennent à sourire quand un passager claque des doigts. Ils apprennent à se mordre la langue quand un homme ivre les insulte. Ils apprennent que la survie est une performance.

Et tranquillement, dans les coins des wagons et dans les pensions où ils dorment entre les quarts, ils commencent à parler. Des salaires. Des heures. De l'indignité. De ce qu'il faudrait pour changer cela.

Ce n'est pas une histoire de gratitude. C'est une histoire de refus.`,
        es: `Winnipeg, 1919. Un gerente blanco de Canadian Pacific Railway se para frente a una sala llena de hombres negros. No los mira directamente. Habla a la pared detrás de ellos.

"El trabajo es simple," dice. "Hacen las camas. Lustran los zapatos. Sirven las comidas. Mantienen a los pasajeros felices. No se quejan. No se sientan. No duermen. Sonríen."

Los hombres escuchan. Saben que este es el único trabajo disponible para ellos. Los hombres negros en Canadá no pueden trabajar en bancos. No pueden trabajar en oficinas. No pueden trabajar en fábricas donde trabajan hombres blancos. Pero pueden trabajar en los trenes. Pueden cargar equipaje. Pueden inclinarse.

El pago es treinta dólares al mes. Pero la mayoría será consumido por gastos—uniformes, betún, comida en rutas donde no se les permite comer en el vagón comedor. El dinero real viene de propinas. Los pasajeros blancos deciden cuánto vale un mozo negro. A veces es cincuenta centavos. A veces es nada.

Las horas son brutales. Un mozo puede trabajar veinte horas seguidas, luego dormir cuatro horas en una litera estrecha, luego trabajar otras veinte. No hay días libres. No hay licencia por enfermedad. Si pierdes un turno, pierdes tu trabajo. Y el ferrocarril se asegura de que haya diez hombres esperando para reemplazarte.

Pero los hombres toman el trabajo. No porque sea bueno. Sino porque es la única puerta que está abierta.

Stanley Grizzle tiene diecisiete años cuando comienza a trabajar como mozo. Su padre fue mozo. Su tío fue mozo. En la comunidad negra, ser mozo significa algo. Significa trabajo estable. Significa ver el país. Significa usar uniforme—aunque ese uniforme te marque como sirviente.

El ferrocarril los llama "George." Cada mozo, sin importar su nombre, es llamado "George." Es una broma. Una broma cruel. George Pullman inventó el coche cama. Así que cada hombre negro que sirve en un coche cama se convierte en "George." Los pasajeros piensan que es gracioso. Los mozos no se ríen.

Pero aprenden. Aprenden a moverse invisiblemente por los vagones. Aprenden a sonreír cuando un pasajero chasquea los dedos. Aprenden a morderse la lengua cuando un hombre borracho los insulta. Aprenden que la supervivencia es una actuación.

Y calladamente, en las esquinas de los vagones y en las pensiones donde duermen entre turnos, comienzan a hablar. Sobre los salarios. Sobre las horas. Sobre la indignidad. Sobre lo que se necesitaría para cambiar esto.

Esta no es una historia de gratitud. Esta es una historia de rechazo.`,
      },
      suggestedAudioTone: 'somber',
      estimatedReadTime: '5 min',
      contextCards: [
        {
          term: {
            en: 'Stanley Grizzle',
            fr: 'Stanley Grizzle',
            es: 'Stanley Grizzle',
          },
          explanation: {
            en: 'Canadian labor activist (1918-2016) who worked as a sleeping car porter and became vice-president of the Brotherhood of Sleeping Car Porters. Later appointed to the Canadian Immigration and Refugee Board.',
            fr: 'Activiste syndical canadien (1918-2016) qui a travaillé comme porteur de wagon-lit et est devenu vice-président de la Fraternité des porteurs de wagons-lits. Plus tard nommé à la Commission de l\'immigration et du statut de réfugié du Canada.',
            es: 'Activista laboral canadiense (1918-2016) que trabajó como mozo de coche cama y se convirtió en vicepresidente de la Hermandad de Mozos de Coches Cama. Más tarde nombrado a la Junta de Inmigración y Refugiados de Canadá.',
          },
        },
      ],
    },
    {
      chapterId: 's2-porters-ch2',
      order: 2,
      title: {
        en: 'The Brotherhood',
        fr: 'La Fraternité',
        es: 'La Hermandad',
      },
      bodyText: {
        en: `Toronto, 1939. In a small meeting room above a barbershop on Bathurst Street, fifteen Black porters sit in a circle. They have just finished their shifts. They are exhausted. But they are here because they have decided that exhaustion is not sustainable forever.

Stanley Grizzle stands at the front of the room. He is twenty-one years old. He has been a porter for four years. He has learned that the railway will not change unless it is forced to.

"The Brotherhood of Sleeping Car Porters exists in the United States," he says. "They have organized. They have negotiated. They have won contracts. We can do the same here."

The men listen. Some are skeptical. The railway has fired men for less. The railway has spies. The railway has made it clear that union organizing will not be tolerated.

But Grizzle is persistent. He passes around a pamphlet from the American union. It lists the victories: higher wages, limited hours, grievance procedures. It is not freedom. But it is better than what they have now.

One by one, the men sign their names. They agree to meet again. They agree to recruit more porters. They agree to keep it quiet—at least for now.

The organizing is slow. The railway watches everything. Porters who talk too much about unions find themselves reassigned to the worst routes. Porters who complain find their hours cut. The message is clear: shut up and work, or lose your job.

But the porters are patient. They meet in barbershops. They meet in churches. They meet in boarding houses. They pass pamphlets hidden in newspapers. They build trust one conversation at a time.

By 1945, hundreds of porters have joined the Brotherhood. The railway can no longer ignore them. The porters demand a meeting. The railway refuses. The porters threaten to strike. The railway laughs.

But the porters do not blink. They know the railway cannot run without them. They know the white passengers will not make their own beds. They know the entire operation depends on Black labor.

So they strike. Not for long. Just long enough to prove a point. The trains sit empty. The passengers complain. The railway panics.

Within weeks, the railway agrees to negotiate. The porters do not win everything. But they win something. Higher wages. Limited hours. The right to file grievances. The right to be called by their actual names.

This is not the end of the fight. But it is the beginning of power.`,
        fr: `Toronto, 1939. Dans une petite salle de réunion au-dessus d'un salon de coiffure sur la rue Bathurst, quinze porteurs noirs sont assis en cercle. Ils viennent de terminer leurs quarts. Ils sont épuisés. Mais ils sont là parce qu'ils ont décidé que l'épuisement n'est pas durable pour toujours.

Stanley Grizzle se tient à l'avant de la salle. Il a vingt et un ans. Il est porteur depuis quatre ans. Il a appris que la compagnie ne changera pas à moins d'être forcée.

"La Fraternité des porteurs de wagons-lits existe aux États-Unis," dit-il. "Ils se sont organisés. Ils ont négocié. Ils ont gagné des contrats. Nous pouvons faire de même ici."

Les hommes écoutent. Certains sont sceptiques. La compagnie a renvoyé des hommes pour moins. La compagnie a des espions. La compagnie a clairement indiqué que l'organisation syndicale ne sera pas tolérée.

Mais Grizzle est persistant. Il fait circuler un pamphlet du syndicat américain. Il liste les victoires: salaires plus élevés, heures limitées, procédures de grief. Ce n'est pas la liberté. Mais c'est mieux que ce qu'ils ont maintenant.

Un par un, les hommes signent leurs noms. Ils acceptent de se rencontrer à nouveau. Ils acceptent de recruter plus de porteurs. Ils acceptent de garder cela discret—au moins pour l'instant.

L'organisation est lente. La compagnie surveille tout. Les porteurs qui parlent trop des syndicats se retrouvent réaffectés aux pires routes. Les porteurs qui se plaignent voient leurs heures coupées. Le message est clair: taisez-vous et travaillez, ou perdez votre emploi.

Mais les porteurs sont patients. Ils se rencontrent dans les salons de coiffure. Ils se rencontrent dans les églises. Ils se rencontrent dans les pensions. Ils passent des pamphlets cachés dans les journaux. Ils construisent la confiance une conversation à la fois.

En 1945, des centaines de porteurs ont rejoint la Fraternité. La compagnie ne peut plus les ignorer. Les porteurs exigent une réunion. La compagnie refuse. Les porteurs menacent de faire grève. La compagnie rit.

Mais les porteurs ne cillent pas. Ils savent que la compagnie ne peut pas fonctionner sans eux. Ils savent que les passagers blancs ne feront pas leurs propres lits. Ils savent que toute l'opération dépend du travail noir.

Alors ils font grève. Pas longtemps. Juste assez longtemps pour prouver un point. Les trains restent vides. Les passagers se plaignent. La compagnie panique.

En quelques semaines, la compagnie accepte de négocier. Les porteurs ne gagnent pas tout. Mais ils gagnent quelque chose. Salaires plus élevés. Heures limitées. Le droit de déposer des griefs. Le droit d'être appelés par leurs vrais noms.

Ce n'est pas la fin du combat. Mais c'est le début du pouvoir.`,
        es: `Toronto, 1939. En una pequeña sala de reuniones sobre una barbería en la calle Bathurst, quince mozos negros se sientan en círculo. Acaban de terminar sus turnos. Están exhaustos. Pero están aquí porque han decidido que el agotamiento no es sostenible para siempre.

Stanley Grizzle se para al frente de la sala. Tiene veintiún años. Ha sido mozo durante cuatro años. Ha aprendido que el ferrocarril no cambiará a menos que sea obligado.

"La Hermandad de Mozos de Coches Cama existe en Estados Unidos," dice. "Se han organizado. Han negociado. Han ganado contratos. Podemos hacer lo mismo aquí."

Los hombres escuchan. Algunos son escépticos. El ferrocarril ha despedido hombres por menos. El ferrocarril tiene espías. El ferrocarril ha dejado claro que la organización sindical no será tolerada.

Pero Grizzle es persistente. Pasa un panfleto del sindicato estadounidense. Lista las victorias: salarios más altos, horas limitadas, procedimientos de quejas. No es libertad. Pero es mejor que lo que tienen ahora.

Uno por uno, los hombres firman sus nombres. Aceptan reunirse de nuevo. Aceptan reclutar más mozos. Aceptan mantenerlo en silencio—al menos por ahora.

La organización es lenta. El ferrocarril observa todo. Los mozos que hablan demasiado sobre sindicatos se encuentran reasignados a las peores rutas. Los mozos que se quejan ven sus horas reducidas. El mensaje es claro: cállense y trabajen, o pierdan su trabajo.

Pero los mozos son pacientes. Se reúnen en barberías. Se reúnen en iglesias. Se reúnen en pensiones. Pasan panfletos escondidos en periódicos. Construyen confianza una conversación a la vez.

Para 1945, cientos de mozos se han unido a la Hermandad. El ferrocarril ya no puede ignorarlos. Los mozos exigen una reunión. El ferrocarril se niega. Los mozos amenazan con hacer huelga. El ferrocarril se ríe.

Pero los mozos no pestañean. Saben que el ferrocarril no puede funcionar sin ellos. Saben que los pasajeros blancos no harán sus propias camas. Saben que toda la operación depende del trabajo negro.

Así que hacen huelga. No por mucho tiempo. Solo lo suficiente para probar un punto. Los trenes se quedan vacíos. Los pasajeros se quejan. El ferrocarril entra en pánico.

En semanas, el ferrocarril acepta negociar. Los mozos no ganan todo. Pero ganan algo. Salarios más altos. Horas limitadas. El derecho a presentar quejas. El derecho a ser llamados por sus nombres reales.

Este no es el final de la lucha. Pero es el comienzo del poder.`,
      },
      suggestedAudioTone: 'urgent',
      estimatedReadTime: '5 min',
    },
    {
      chapterId: 's2-porters-ch3',
      order: 3,
      title: {
        en: 'What They Carried',
        fr: 'Ce Qu\'ils Portaient',
        es: 'Lo Que Llevaban',
      },
      bodyText: {
        en: `The porters carried more than luggage.

They carried newspapers from Toronto to Vancouver, passing them hand-to-hand to Black communities who would otherwise never see them. They carried letters between families separated by provinces and borders. They carried messages about jobs, about housing, about which cities were safer and which cities were hostile.

They carried information about organizing. A porter traveling from Montreal to Halifax might stop in every city along the way, delivering updates about strikes, about negotiations, about which companies were hiring and which companies were firing union members.

They carried hope.

But they also carried the weight of performance. Every interaction with a white passenger was a calculation. Smile too much, and you are mocked. Smile too little, and you are punished. Speak up, and you are fired. Stay silent, and you are erased.

The porters developed a code. A way of speaking that sounded deferential but carried meaning. A way of moving that appeared subservient but maintained dignity. A way of surviving that did not require surrender.

In the sleeping car, late at night, when the passengers were asleep, the porters would sit together in the narrow service corridors. They would share stories. They would share strategies. They would share the names of passengers who tipped well and the names of passengers who should be avoided.

This was not just gossip. This was survival knowledge. This was the archive of Black labor—passed orally, never written down, but remembered.

Some passengers noticed. The observant ones. The ones who saw that the porter who made their bed in the morning was the same porter who cleaned their shoes at night and served their breakfast the next day. The ones who realized that the porters never slept, never rested, never stopped moving.

A few of these passengers tipped generously. A few of these passengers wrote letters to the railway, demanding better treatment. A few of these passengers became allies.

But most did not notice. Most saw the porters as part of the scenery. As fixtures of the train, no more human than the seats or the windows.

And the porters carried that too. The weight of being invisible. The weight of being essential and ignored at the same time. The weight of building a country that refused to see them as citizens.

But they also carried pride. Pride in the work. Pride in the uniform. Pride in the knowledge that they were holding their families together, holding their communities together, holding the entire railway system together.

And they carried the certainty that one day, the work would be recognized. That one day, the names would be remembered. That one day, the history would be told.

This is that day.`,
        fr: `Les porteurs portaient plus que des bagages.

Ils portaient des journaux de Toronto à Vancouver, les passant de main en main aux communautés noires qui autrement ne les verraient jamais. Ils portaient des lettres entre les familles séparées par les provinces et les frontières. Ils portaient des messages sur les emplois, sur le logement, sur quelles villes étaient plus sûres et quelles villes étaient hostiles.

Ils portaient des informations sur l'organisation. Un porteur voyageant de Montréal à Halifax pouvait s'arrêter dans chaque ville en cours de route, livrant des mises à jour sur les grèves, sur les négociations, sur quelles entreprises embauchaient et quelles entreprises licenciaient les membres syndicaux.

Ils portaient l'espoir.

Mais ils portaient aussi le poids de la performance. Chaque interaction avec un passager blanc était un calcul. Souriez trop, et vous êtes moqué. Souriez trop peu, et vous êtes puni. Parlez, et vous êtes renvoyé. Restez silencieux, et vous êtes effacé.

Les porteurs ont développé un code. Une façon de parler qui sonnait déférente mais portait du sens. Une façon de bouger qui semblait servile mais maintenait la dignité. Une façon de survivre qui ne nécessitait pas de reddition.

Dans le wagon-lit, tard la nuit, quand les passagers dormaient, les porteurs s'asseyaient ensemble dans les couloirs de service étroits. Ils partageaient des histoires. Ils partageaient des stratégies. Ils partageaient les noms des passagers qui donnaient de bons pourboires et les noms des passagers à éviter.

Ce n'était pas seulement des ragots. C'était de la connaissance de survie. C'était l'archive du travail noir—transmise oralement, jamais écrite, mais mémorisée.

Certains passagers ont remarqué. Les observateurs. Ceux qui ont vu que le porteur qui faisait leur lit le matin était le même porteur qui nettoyait leurs chaussures la nuit et servait leur petit-déjeuner le lendemain. Ceux qui ont réalisé que les porteurs ne dormaient jamais, ne se reposaient jamais, ne cessaient jamais de bouger.

Quelques-uns de ces passagers donnaient généreusement. Quelques-uns de ces passagers écrivaient des lettres à la compagnie, exigeant un meilleur traitement. Quelques-uns de ces passagers sont devenus des alliés.

Mais la plupart ne remarquaient pas. La plupart voyaient les porteurs comme faisant partie du décor. Comme des éléments du train, pas plus humains que les sièges ou les fenêtres.

Et les porteurs portaient cela aussi. Le poids d'être invisibles. Le poids d'être essentiels et ignorés en même temps. Le poids de construire un pays qui refusait de les voir comme citoyens.

Mais ils portaient aussi la fierté. Fierté dans le travail. Fierté dans l'uniforme. Fierté dans la connaissance qu'ils maintenaient leurs familles ensemble, maintenaient leurs communautés ensemble, maintenaient tout le système ferroviaire ensemble.

Et ils portaient la certitude qu'un jour, le travail serait reconnu. Qu'un jour, les noms seraient rappelés. Qu'un jour, l'histoire serait racontée.

C'est ce jour.`,
        es: `Los mozos llevaban más que equipaje.

Llevaban periódicos de Toronto a Vancouver, pasándolos de mano en mano a comunidades negras que de otro modo nunca los verían. Llevaban cartas entre familias separadas por provincias y fronteras. Llevaban mensajes sobre trabajos, sobre vivienda, sobre qué ciudades eran más seguras y cuáles ciudades eran hostiles.

Llevaban información sobre organización. Un mozo viajando de Montreal a Halifax podía detenerse en cada ciudad en el camino, entregando actualizaciones sobre huelgas, sobre negociaciones, sobre qué compañías contrataban y cuáles compañías despedían miembros sindicales.

Llevaban esperanza.

Pero también llevaban el peso de la actuación. Cada interacción con un pasajero blanco era un cálculo. Sonríe demasiado, y eres burlado. Sonríe muy poco, y eres castigado. Habla, y eres despedido. Mantente en silencio, y eres borrado.

Los mozos desarrollaron un código. Una forma de hablar que sonaba deferente pero llevaba significado. Una forma de moverse que parecía servil pero mantenía dignidad. Una forma de sobrevivir que no requería rendirse.

En el coche cama, tarde en la noche, cuando los pasajeros estaban dormidos, los mozos se sentaban juntos en los estrechos corredores de servicio. Compartían historias. Compartían estrategias. Compartían los nombres de pasajeros que daban buenas propinas y los nombres de pasajeros que debían evitarse.

Esto no era solo chisme. Esto era conocimiento de supervivencia. Esto era el archivo del trabajo negro—pasado oralmente, nunca escrito, pero recordado.

Algunos pasajeros notaron. Los observadores. Los que vieron que el mozo que hacía su cama en la mañana era el mismo mozo que limpiaba sus zapatos en la noche y servía su desayuno al día siguiente. Los que se dieron cuenta de que los mozos nunca dormían, nunca descansaban, nunca dejaban de moverse.

Algunos de estos pasajeros daban propinas generosas. Algunos de estos pasajeros escribían cartas al ferrocarril, exigiendo mejor trato. Algunos de estos pasajeros se volvieron aliados.

Pero la mayoría no notó. La mayoría veía a los mozos como parte del paisaje. Como accesorios del tren, no más humanos que los asientos o las ventanas.

Y los mozos llevaban eso también. El peso de ser invisibles. El peso de ser esenciales e ignorados al mismo tiempo. El peso de construir un país que se negaba a verlos como ciudadanos.

Pero también llevaban orgullo. Orgullo en el trabajo. Orgullo en el uniforme. Orgullo en el conocimiento de que estaban manteniendo a sus familias juntas, manteniendo a sus comunidades juntas, manteniendo todo el sistema ferroviario junto.

Y llevaban la certeza de que un día, el trabajo sería reconocido. Que un día, los nombres serían recordados. Que un día, la historia sería contada.

Este es ese día.`,
      },
      suggestedAudioTone: 'reflective',
      estimatedReadTime: '5 min',
    },
    {
      chapterId: 's2-porters-ch4',
      order: 4,
      title: {
        en: 'The Women Who Waited',
        fr: 'Les Femmes Qui Attendaient',
        es: 'Las Mujeres Que Esperaban',
      },
      bodyText: {
        en: `They do not appear in the photographs. They do not appear in the union records. But they were there.

The wives of the porters. The mothers. The daughters. The women who held families together while the men were on the rails.

In Montreal, in the neighborhood of Little Burgundy, women gathered in kitchens and church basements. They shared strategies for stretching a porter's salary across weeks of absence. They shared recipes that could feed a family on thirty dollars a month. They shared the names of landlords who would wait for rent and the names of landlords who would not.

These were not social gatherings. These were survival networks.

When a porter was injured on the job, it was the women who organized. They collected money. They visited hospitals. They negotiated with the railway for compensation. They did this without recognition, without payment, without thanks.

When the porters organized the Brotherhood, it was the women who hosted the meetings. They cooked the meals. They watched the children. They kept watch for railway spies. They did this knowing that if the union failed, their families would suffer.

And when the strike came, it was the women who held the line. They organized pickets. They distributed leaflets. They stood outside railway offices demanding justice. They did this while also working—as domestic workers, as seamstresses, as laundry workers—because the strike meant no income and bills do not wait.

The railway thought the porters would break. The railway thought hunger would force them back to work. But the railway did not account for the women. The women who found ways to feed families without money. The women who negotiated with shopkeepers for credit. The women who refused to let their men surrender.

One woman, whose name does not appear in any record, stood outside a railway office in Toronto for six hours. She held a sign that read: "My husband built this railway. Pay him a living wage." When a manager told her to go home, she did not move. When the police threatened to arrest her, she said, "Arrest me. But you will have to arrest every woman here." There were fifty women standing behind her.

The railway did not arrest them.

After the strike, the porters won their contracts. They won higher wages. They won limited hours. But the victory was not theirs alone. It belonged to the women who made it possible.

And yet, the history books do not name them. The union records do not list them. The photographs show men in uniforms, not women in kitchens. The archive is incomplete.

But the women knew. The communities knew. The families knew. And that knowledge was passed down—not in documents, but in stories. In the memory of who held the family together. In the memory of who made the strike possible. In the memory of who fought and was never credited.

This is that credit. This is that acknowledgment. This is that history.`,
        fr: `Elles n'apparaissent pas dans les photographies. Elles n'apparaissent pas dans les registres syndicaux. Mais elles étaient là.

Les épouses des porteurs. Les mères. Les filles. Les femmes qui ont tenu les familles ensemble pendant que les hommes étaient sur les rails.

À Montréal, dans le quartier de la Petite-Bourgogne, les femmes se rassemblaient dans les cuisines et les sous-sols d'église. Elles partageaient des stratégies pour étirer le salaire d'un porteur sur des semaines d'absence. Elles partageaient des recettes qui pouvaient nourrir une famille avec trente dollars par mois. Elles partageaient les noms des propriétaires qui attendraient le loyer et les noms des propriétaires qui ne le feraient pas.

Ce n'étaient pas des rassemblements sociaux. C'étaient des réseaux de survie.

Quand un porteur était blessé au travail, c'étaient les femmes qui organisaient. Elles collectaient de l'argent. Elles visitaient les hôpitaux. Elles négociaient avec la compagnie pour une compensation. Elles faisaient cela sans reconnaissance, sans paiement, sans remerciements.

Quand les porteurs ont organisé la Fraternité, c'étaient les femmes qui accueillaient les réunions. Elles cuisinaient les repas. Elles surveillaient les enfants. Elles guettaient les espions de la compagnie. Elles faisaient cela en sachant que si le syndicat échouait, leurs familles souffriraient.

Et quand la grève est venue, c'étaient les femmes qui ont tenu la ligne. Elles ont organisé des piquets. Elles ont distribué des tracts. Elles se sont tenues devant les bureaux ferroviaires exigeant la justice. Elles ont fait cela tout en travaillant aussi—comme travailleuses domestiques, comme couturières, comme blanchisseuses—parce que la grève signifiait aucun revenu et les factures n'attendent pas.

La compagnie pensait que les porteurs cracheraient. La compagnie pensait que la faim les forcerait à retourner au travail. Mais la compagnie n'a pas compté sur les femmes. Les femmes qui ont trouvé des moyens de nourrir les familles sans argent. Les femmes qui ont négocié avec les commerçants pour du crédit. Les femmes qui ont refusé de laisser leurs hommes se rendre.

Une femme, dont le nom n'apparaît dans aucun registre, s'est tenue devant un bureau ferroviaire à Toronto pendant six heures. Elle tenait une pancarte qui disait: "Mon mari a construit ce chemin de fer. Payez-lui un salaire viable." Quand un directeur lui a dit de rentrer chez elle, elle n'a pas bougé. Quand la police a menacé de l'arrêter, elle a dit: "Arrêtez-moi. Mais vous devrez arrêter chaque femme ici." Il y avait cinquante femmes debout derrière elle.

La compagnie ne les a pas arrêtées.

Après la grève, les porteurs ont gagné leurs contrats. Ils ont gagné des salaires plus élevés. Ils ont gagné des heures limitées. Mais la victoire n'était pas la leur seule. Elle appartenait aux femmes qui l'ont rendue possible.

Et pourtant, les livres d'histoire ne les nomment pas. Les registres syndicaux ne les listent pas. Les photographies montrent des hommes en uniformes, pas des femmes dans les cuisines. L'archive est incomplète.

Mais les femmes savaient. Les communautés savaient. Les familles savaient. Et cette connaissance a été transmise—pas dans des documents, mais dans des histoires. Dans la mémoire de qui a tenu la famille ensemble. Dans la mémoire de qui a rendu la grève possible. Dans la mémoire de qui a combattu et n'a jamais été créditée.

C'est ce crédit. C'est cette reconnaissance. C'est cette histoire.`,
        es: `No aparecen en las fotografías. No aparecen en los registros sindicales. Pero estaban ahí.

Las esposas de los mozos. Las madres. Las hijas. Las mujeres que mantuvieron a las familias juntas mientras los hombres estaban en los rieles.

En Montreal, en el vecindario de Little Burgundy, las mujeres se reunían en cocinas y sótanos de iglesias. Compartían estrategias para estirar el salario de un mozo a través de semanas de ausencia. Compartían recetas que podían alimentar a una familia con treinta dólares al mes. Compartían los nombres de propietarios que esperarían por el alquiler y los nombres de propietarios que no lo harían.

Estas no eran reuniones sociales. Estas eran redes de supervivencia.

Cuando un mozo era herido en el trabajo, eran las mujeres las que organizaban. Recolectaban dinero. Visitaban hospitales. Negociaban con el ferrocarril por compensación. Hacían esto sin reconocimiento, sin pago, sin agradecimiento.

Cuando los mozos organizaron la Hermandad, eran las mujeres las que hospedaban las reuniones. Cocinaban las comidas. Cuidaban a los niños. Vigilaban espías del ferrocarril. Hacían esto sabiendo que si el sindicato fallaba, sus familias sufrirían.

Y cuando llegó la huelga, eran las mujeres las que sostenían la línea. Organizaban piquetes. Distribuían panfletos. Se paraban afuera de oficinas ferroviarias exigiendo justicia. Hacían esto mientras también trabajaban—como trabajadoras domésticas, como costureras, como lavanderas—porque la huelga significaba sin ingresos y las cuentas no esperan.

El ferrocarril pensó que los mozos se romperían. El ferrocarril pensó que el hambre los forzaría a volver al trabajo. Pero el ferrocarril no contó con las mujeres. Las mujeres que encontraron formas de alimentar familias sin dinero. Las mujeres que negociaron con comerciantes por crédito. Las mujeres que se negaron a dejar que sus hombres se rindieran.

Una mujer, cuyo nombre no aparece en ningún registro, se paró afuera de una oficina ferroviaria en Toronto por seis horas. Sostenía un cartel que decía: "Mi esposo construyó este ferrocarril. Páguenle un salario digno." Cuando un gerente le dijo que se fuera a casa, no se movió. Cuando la policía amenazó con arrestarla, dijo: "Arrésteme. Pero tendrán que arrestar a cada mujer aquí." Había cincuenta mujeres paradas detrás de ella.

El ferrocarril no las arrestó.

Después de la huelga, los mozos ganaron sus contratos. Ganaron salarios más altos. Ganaron horas limitadas. Pero la victoria no fue solo de ellos. Pertenecía a las mujeres que la hicieron posible.

Y sin embargo, los libros de historia no las nombran. Los registros sindicales no las listan. Las fotografías muestran hombres en uniformes, no mujeres en cocinas. El archivo está incompleto.

Pero las mujeres sabían. Las comunidades sabían. Las familias sabían. Y ese conocimiento fue transmitido—no en documentos, sino en historias. En la memoria de quién mantuvo a la familia junta. En la memoria de quién hizo posible la huelga. En la memoria de quién luchó y nunca fue acreditada.

Este es ese crédito. Este es ese reconocimiento. Esta es esa historia.`,
      },
      suggestedAudioTone: 'reflective',
      estimatedReadTime: '5 min',
    },
    {
      chapterId: 's2-porters-ch5',
      order: 5,
      title: {
        en: 'The Last Generation',
        fr: 'La Dernière Génération',
        es: 'La Última Generación',
      },
      bodyText: {
        en: `By the 1970s, the sleeping cars were disappearing. Air travel was cheaper. Highways were faster. The trains that once connected the country were being replaced by planes and cars.

The porters knew it was ending. They could feel it in the empty cars. They could see it in the reduced schedules. They could hear it in the railway's plans to "modernize"—which meant automation, which meant fewer workers, which meant the end of an era.

Some porters retired. Some found other work. But many stayed until the very end. Not because the job was good. But because it was theirs. Because they had fought for it. Because leaving felt like surrender.

Stanley Grizzle worked as a porter until 1970. He was fifty-two years old. He had spent thirty-five years making beds, shining shoes, serving meals, smiling at passengers who did not know his name. When he retired, the railway threw him a party. They gave him a plaque. They called him a "valued employee."

Grizzle did not feel valued. He felt exhausted. But he also felt proud. Proud of what the porters had built. Proud of the union they had organized. Proud of the next generation who would not have to fight the same battles.

But the history was already disappearing. The sleeping cars were scrapped. The boarding houses were demolished. The barbershops closed. The physical evidence of the porters' work was being erased as quickly as it had been built.

And the stories? The stories were fading too. The younger generation did not know about the porters. They did not know about the Brotherhood. They did not know about the strikes, the organizing, the women who held the line. The history was becoming invisible.

A few people tried to preserve it. A few historians interviewed the last porters. A few museums collected uniforms and photographs. A few documentaries were made. But the mainstream narrative of Canada did not include the porters. The nation-building story was about politicians and business leaders and pioneers. It was not about Black men who made beds on trains.

Grizzle spent his retirement trying to change that. He gave talks at schools. He wrote letters to newspapers. He demanded that the history be taught. He demanded that the names be remembered. He demanded recognition.

In 1991, the Canadian government awarded Grizzle the Order of Canada. The citation praised his "contributions to labor organizing and civil rights." It did not mention that he had to fight for decades to receive it. It did not mention that most Canadians still did not know his name.

Grizzle died in 2016 at the age of ninety-seven. By then, the sleeping cars were gone. The porters were gone. But the legacy remained.

In Black communities across Canada, the porters are remembered. Not as servants. Not as "Georges." But as organizers. As fighters. As men who built power where there was none. As men who carried more than luggage.

This is their story. This is their history. This is their legacy.`,
        fr: `Dans les années 1970, les wagons-lits disparaissaient. Le transport aérien était moins cher. Les autoroutes étaient plus rapides. Les trains qui connectaient autrefois le pays étaient remplacés par des avions et des voitures.

Les porteurs savaient que c'était la fin. Ils le sentaient dans les wagons vides. Ils le voyaient dans les horaires réduits. Ils l'entendaient dans les plans de la compagnie pour "moderniser"—ce qui signifiait automation, ce qui signifiait moins de travailleurs, ce qui signifiait la fin d'une ère.

Certains porteurs ont pris leur retraite. Certains ont trouvé d'autre travail. Mais beaucoup sont restés jusqu'à la toute fin. Pas parce que le travail était bon. Mais parce qu'il était à eux. Parce qu'ils s'étaient battus pour lui. Parce que partir ressemblait à une reddition.

Stanley Grizzle a travaillé comme porteur jusqu'en 1970. Il avait cinquante-deux ans. Il avait passé trente-cinq ans à faire des lits, cirer des chaussures, servir des repas, sourire aux passagers qui ne connaissaient pas son nom. Quand il a pris sa retraite, la compagnie lui a organisé une fête. Ils lui ont donné une plaque. Ils l'ont appelé un "employé valorisé."

Grizzle ne se sentait pas valorisé. Il se sentait épuisé. Mais il se sentait aussi fier. Fier de ce que les porteurs avaient construit. Fier du syndicat qu'ils avaient organisé. Fier de la prochaine génération qui n'aurait pas à mener les mêmes batailles.

Mais l'histoire disparaissait déjà. Les wagons-lits étaient mis au rebut. Les pensions étaient démolies. Les salons de coiffure fermaient. La preuve physique du travail des porteurs était effacée aussi rapidement qu'elle avait été construite.

Et les histoires? Les histoires s'estompaient aussi. La jeune génération ne savait pas sur les porteurs. Ils ne savaient pas sur la Fraternité. Ils ne savaient pas sur les grèves, l'organisation, les femmes qui ont tenu la ligne. L'histoire devenait invisible.

Quelques personnes ont essayé de la préserver. Quelques historiens ont interviewé les derniers porteurs. Quelques musées ont collecté des uniformes et des photographies. Quelques documentaires ont été réalisés. Mais le récit dominant du Canada n'incluait pas les porteurs. L'histoire de la construction de la nation concernait les politiciens et les chefs d'entreprise et les pionniers. Elle ne concernait pas les hommes noirs qui faisaient des lits dans les trains.

Grizzle a passé sa retraite à essayer de changer cela. Il a donné des conférences dans les écoles. Il a écrit des lettres aux journaux. Il a exigé que l'histoire soit enseignée. Il a exigé que les noms soient rappelés. Il a exigé la reconnaissance.

En 1991, le gouvernement canadien a décerné à Grizzle l'Ordre du Canada. La citation a salué ses "contributions à l'organisation syndicale et aux droits civils." Elle n'a pas mentionné qu'il a dû se battre pendant des décennies pour le recevoir. Elle n'a pas mentionné que la plupart des Canadiens ne connaissaient toujours pas son nom.

Grizzle est décédé en 2016 à l'âge de quatre-vingt-dix-sept ans. À ce moment-là, les wagons-lits avaient disparu. Les porteurs avaient disparu. Mais l'héritage demeurait.

Dans les communautés noires à travers le Canada, les porteurs sont rappelés. Pas comme serviteurs. Pas comme "Georges." Mais comme organisateurs. Comme combattants. Comme des hommes qui ont construit le pouvoir là où il n'y en avait pas. Comme des hommes qui portaient plus que des bagages.

C'est leur histoire. C'est leur histoire. C'est leur héritage.`,
        es: `Para los años 1970, los coches cama estaban desapareciendo. El transporte aéreo era más barato. Las autopistas eran más rápidas. Los trenes que una vez conectaron el país estaban siendo reemplazados por aviones y autos.

Los mozos sabían que estaba terminando. Podían sentirlo en los vagones vacíos. Podían verlo en los horarios reducidos. Podían escucharlo en los planes del ferrocarril para "modernizar"—lo que significaba automatización, lo que significaba menos trabajadores, lo que significaba el final de una era.

Algunos mozos se jubilaron. Algunos encontraron otro trabajo. Pero muchos se quedaron hasta el final. No porque el trabajo fuera bueno. Sino porque era suyo. Porque habían luchado por él. Porque irse se sentía como rendirse.

Stanley Grizzle trabajó como mozo hasta 1970. Tenía cincuenta y dos años. Había pasado treinta y cinco años haciendo camas, lustrando zapatos, sirviendo comidas, sonriendo a pasajeros que no conocían su nombre. Cuando se jubiló, el ferrocarril le organizó una fiesta. Le dieron una placa. Lo llamaron un "empleado valioso."

Grizzle no se sentía valorado. Se sentía exhausto. Pero también se sentía orgulloso. Orgulloso de lo que los mozos habían construido. Orgulloso del sindicato que habían organizado. Orgulloso de la próxima generación que no tendría que pelear las mismas batallas.

Pero la historia ya estaba desapareciendo. Los coches cama fueron desguazados. Las pensiones fueron demolidas. Las barberías cerraron. La evidencia física del trabajo de los mozos estaba siendo borrada tan rápido como había sido construida.

¿Y las historias? Las historias también se estaban desvaneciendo. La generación más joven no sabía sobre los mozos. No sabían sobre la Hermandad. No sabían sobre las huelgas, la organización, las mujeres que sostuvieron la línea. La historia se estaba volviendo invisible.

Algunas personas intentaron preservarla. Algunos historiadores entrevistaron a los últimos mozos. Algunos museos colectaron uniformes y fotografías. Se hicieron algunos documentales. Pero la narrativa principal de Canadá no incluía a los mozos. La historia de construcción de la nación era sobre políticos y líderes empresariales y pioneros. No era sobre hombres negros que hacían camas en trenes.

Grizzle pasó su jubilación tratando de cambiar eso. Dio charlas en escuelas. Escribió cartas a periódicos. Exigió que la historia fuera enseñada. Exigió que los nombres fueran recordados. Exigió reconocimiento.

En 1991, el gobierno canadiense otorgó a Grizzle la Orden de Canadá. La citación elogió sus "contribuciones a la organización laboral y derechos civiles." No mencionó que tuvo que luchar durante décadas para recibirla. No mencionó que la mayoría de los canadienses todavía no conocían su nombre.

Grizzle murió en 2016 a la edad de noventa y siete años. Para entonces, los coches cama habían desaparecido. Los mozos habían desaparecido. Pero el legado permanecía.

En comunidades negras a través de Canadá, los mozos son recordados. No como sirvientes. No como "Georges." Sino como organizadores. Como luchadores. Como hombres que construyeron poder donde no había ninguno. Como hombres que llevaban más que equipaje.

Esta es su historia. Esta es su historia. Este es su legado.`,
      },
      suggestedAudioTone: 'reflective',
      estimatedReadTime: '5 min',
    },
    {
      chapterId: 's2-porters-ch6',
      order: 6,
      title: {
        en: 'What Remains',
        fr: 'Ce Qui Reste',
        es: 'Lo Que Queda',
      },
      bodyText: {
        en: `In Toronto, there is a plaque on Union Station. It is small. Easy to miss. It reads: "In honor of the sleeping car porters who served Canadian railways."

That is all. No names. No dates. No story. Just an acknowledgment that they existed.

But in the Black Canadian community, the story is remembered differently. Not on plaques, but in family histories. Not in museums, but in living rooms. Not in textbooks, but in the stories grandparents tell their grandchildren.

"Your great-grandfather was a porter," they say. "He worked on the trains. He organized the union. He fought for dignity."

And the children ask: "What was it like?"

And the grandparents pause. Because how do you explain what it was like to be essential and invisible at the same time? How do you explain what it was like to build a country that refused to see you as a citizen? How do you explain what it was like to carry the weight of survival on your back every single day?

You tell the stories. You tell the truth. You tell the history that the textbooks leave out.

This is what remains: the memory. The knowledge that Black Canadians were not just passengers on the train of history. They were the ones who made the trains run.

This is what remains: the pride. The knowledge that the porters organized. That they fought. That they won. Not everything. But something.

This is what remains: the labor. The understanding that every right, every dignity, every bit of recognition was earned. Not given. Fought for. Organized for. Sacrificed for.

And this is what remains: the refusal. The refusal to be erased. The refusal to be forgotten. The refusal to let the history disappear into silence.

The sleeping cars are gone. The porters are gone. But the story is not gone. It is here. In these words. In this memory. In this archive.

And it is passed on. Generation to generation. Community to community. Name to name.

Stanley Grizzle. The women who held the line. The organizers. The strikers. The men who carried more than luggage. The men who built a movement.

This is their story. This is our story. This is Canadian history.

Not the version taught in schools. But the version that must be told.`,
        fr: `À Toronto, il y a une plaque à Union Station. Elle est petite. Facile à manquer. Elle dit: "En l'honneur des porteurs de wagons-lits qui ont servi les chemins de fer canadiens."

C'est tout. Pas de noms. Pas de dates. Pas d'histoire. Juste une reconnaissance qu'ils ont existé.

Mais dans la communauté canadienne noire, l'histoire est rappelée différemment. Pas sur des plaques, mais dans les histoires familiales. Pas dans les musées, mais dans les salons. Pas dans les manuels, mais dans les histoires que les grands-parents racontent à leurs petits-enfants.

"Votre arrière-grand-père était porteur," disent-ils. "Il travaillait sur les trains. Il a organisé le syndicat. Il s'est battu pour la dignité."

Et les enfants demandent: "C'était comment?"

Et les grands-parents marquent une pause. Parce que comment expliquez-vous ce que c'était d'être essentiel et invisible en même temps? Comment expliquez-vous ce que c'était de construire un pays qui refusait de vous voir comme citoyen? Comment expliquez-vous ce que c'était de porter le poids de la survie sur votre dos chaque jour?

Vous racontez les histoires. Vous dites la vérité. Vous racontez l'histoire que les manuels omettent.

C'est ce qui reste: la mémoire. La connaissance que les Canadiens noirs n'étaient pas seulement des passagers sur le train de l'histoire. Ils étaient ceux qui faisaient fonctionner les trains.

C'est ce qui reste: la fierté. La connaissance que les porteurs se sont organisés. Qu'ils se sont battus. Qu'ils ont gagné. Pas tout. Mais quelque chose.

C'est ce qui reste: le travail. La compréhension que chaque droit, chaque dignité, chaque reconnaissance a été gagné. Pas donné. Combattu pour. Organisé pour. Sacrifié pour.

Et c'est ce qui reste: le refus. Le refus d'être effacé. Le refus d'être oublié. Le refus de laisser l'histoire disparaître dans le silence.

Les wagons-lits ont disparu. Les porteurs ont disparu. Mais l'histoire n'a pas disparu. Elle est ici. Dans ces mots. Dans cette mémoire. Dans cette archive.

Et elle est transmise. Génération à génération. Communauté à communauté. Nom à nom.

Stanley Grizzle. Les femmes qui ont tenu la ligne. Les organisateurs. Les grévistes. Les hommes qui portaient plus que des bagages. Les hommes qui ont construit un mouvement.

C'est leur histoire. C'est notre histoire. C'est l'histoire canadienne.

Pas la version enseignée dans les écoles. Mais la version qui doit être racontée.`,
        es: `En Toronto, hay una placa en Union Station. Es pequeña. Fácil de pasar por alto. Dice: "En honor a los mozos de coches cama que sirvieron a los ferrocarriles canadienses."

Eso es todo. Sin nombres. Sin fechas. Sin historia. Solo un reconocimiento de que existieron.

Pero en la comunidad canadiense negra, la historia se recuerda diferente. No en placas, sino en historias familiares. No en museos, sino en salas de estar. No en libros de texto, sino en las historias que los abuelos cuentan a sus nietos.

"Tu bisabuelo fue mozo," dicen. "Trabajó en los trenes. Organizó el sindicato. Luchó por dignidad."

Y los niños preguntan: "¿Cómo era?"

Y los abuelos hacen una pausa. Porque ¿cómo explicas lo que era ser esencial e invisible al mismo tiempo? ¿Cómo explicas lo que era construir un país que se negaba a verte como ciudadano? ¿Cómo explicas lo que era llevar el peso de la supervivencia en tu espalda cada día?

Cuentas las historias. Dices la verdad. Cuentas la historia que los libros de texto dejan fuera.

Esto es lo que queda: la memoria. El conocimiento de que los canadienses negros no eran solo pasajeros en el tren de la historia. Eran los que hacían funcionar los trenes.

Esto es lo que queda: el orgullo. El conocimiento de que los mozos se organizaron. Que lucharon. Que ganaron. No todo. Pero algo.

Esto es lo que queda: el trabajo. La comprensión de que cada derecho, cada dignidad, cada reconocimiento fue ganado. No dado. Luchado por. Organizado por. Sacrificado por.

Y esto es lo que queda: el rechazo. El rechazo a ser borrado. El rechazo a ser olvidado. El rechazo a dejar que la historia desaparezca en silencio.

Los coches cama se han ido. Los mozos se han ido. Pero la historia no se ha ido. Está aquí. En estas palabras. En esta memoria. En este archivo.

Y se transmite. Generación a generación. Comunidad a comunidad. Nombre a nombre.

Stanley Grizzle. Las mujeres que sostuvieron la línea. Los organizadores. Los huelguistas. Los hombres que llevaban más que equipaje. Los hombres que construyeron un movimiento.

Esta es su historia. Esta es nuestra historia. Esta es la historia canadiense.

No la versión enseñada en las escuelas. Sino la versión que debe ser contada.`,
      },
      suggestedAudioTone: 'reflective',
      estimatedReadTime: '4 min',
    },
  ],
};

// Add to registry
export const SEASON_2_EXPANDED_STORIES_CONTINUED = [
  STORY_SLEEPING_CAR_PORTERS,
];

console.log('[Season 2] Story 2 (Porters) complete: 6 chapters, 28 min audio');
