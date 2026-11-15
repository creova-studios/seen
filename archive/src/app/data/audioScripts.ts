/**
 * AUDIO NARRATION SCRIPTS — COMPLETE DATABASE
 * SEEN by CREOVA
 * 
 * All 58 chapters across 12 Story Worlds
 * Spoken-word scripts optimized for 2-4 minute audio delivery
 * Trilingual: EN/FR/ES with culturally authentic pacing
 * 
 * PRODUCTION NOTES:
 * - Follow global guidelines: /src/app/data/narrationGuidelines.ts
 * - Apply story-specific direction: /src/app/data/storyVoiceDirection.ts
 * - File naming: StoryWorld_Chapter_Language.wav
 */

export interface AudioScript {
  storyWorldId: string;
  chapterId: string;
  language: 'en' | 'fr' | 'es';
  narrationText: string;
  estimatedDuration: number; // seconds
}

// ============================================
// MIDNIGHT RESONANCE (Midnight Cities)
// Direction: Quiet observation, nighttime, reflective
// Energy: Low, steady
// ============================================

export const MIDNIGHT_RESONANCE_AUDIO: AudioScript[] = [
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch1',
    language: 'en',
    narrationText: `The snow falls heavy on Rue Saint-Denis.

Maya pulls her coat tighter. Saxophone case strapped across her back.

She's walked this street a thousand times. But tonight something feels different.

A bass line. Pulsing from somewhere below ground.

She stops. Listens. The sound is faint. Almost hidden beneath the traffic. Beneath the wind.

But it's there.

She follows it. Down a side street. Past the late-night depanneurs. Past the closed shops with their metal shutters.

And then she sees it.

An unmarked door. Black paint. No sign. Just a small red light above the frame.

The bass is louder here. Steady. Insistent.

Maya hesitates. Her hand on the door. Her breath visible in the cold.

She thinks about turning back. Going home. Playing it safe.

But the music pulls her forward.

She opens the door. And steps inside.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch1',
    language: 'fr',
    narrationText: `La neige tombe lourdement sur la rue Saint-Denis.

Maya resserre son manteau. Étui de saxophone sanglé dans le dos.

Elle a marché dans cette rue mille fois. Mais ce soir quelque chose est différent.

Une ligne de basse. Qui pulse quelque part sous terre.

Elle s'arrête. Écoute. Le son est faible. Presque caché sous le trafic. Sous le vent.

Mais il est là.

Elle le suit. Dans une rue latérale. Passé les dépanneurs de fin de soirée. Passé les boutiques fermées avec leurs volets métalliques.

Et puis elle le voit.

Une porte sans marque. Peinture noire. Pas d'enseigne. Juste une petite lumière rouge au-dessus du cadre.

La basse est plus forte ici. Constante. Insistante.

Maya hésite. Sa main sur la porte. Son souffle visible dans le froid.

Elle pense à faire demi-tour. Rentrer chez elle. Jouer la sécurité.

Mais la musique l'attire vers l'avant.

Elle ouvre la porte. Et entre.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch1',
    language: 'es',
    narrationText: `La nieve cae pesadamente sobre la Rue Saint-Denis.

Maya se ciñe el abrigo. Estuche del saxofón atado a la espalda.

Ha caminado por esta calle mil veces. Pero esta noche algo se siente diferente.

Una línea de bajo. Pulsando desde algún lugar bajo tierra.

Se detiene. Escucha. El sonido es débil. Casi oculto bajo el tráfico. Bajo el viento.

Pero está ahí.

Lo sigue. Por una calle lateral. Pasando los depanneurs de medianoche. Pasando las tiendas cerradas con sus persianas metálicas.

Y entonces lo ve.

Una puerta sin marcar. Pintura negra. Sin letrero. Solo una pequeña luz roja sobre el marco.

El bajo es más fuerte aquí. Constante. Insistente.

Maya duda. Su mano en la puerta. Su aliento visible en el frío.

Piensa en regresar. Ir a casa. Jugar a lo seguro.

Pero la música la atrae hacia adelante.

Abre la puerta. Y entra.`,
    estimatedDuration: 180,
  },

  // Chapter 2
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch2',
    language: 'en',
    narrationText: `The club is smaller than Maya imagined.

Red velvet walls. Absorbing every sound. Making the space feel alive. Breathing.

A drummer sits alone at the kit. Eyes closed. Listening to something only he can hear.

In the corner, a bassist tunes. Slow. Methodical. Each string adjusted with care.

And Maya. Saxophone in hand. Standing in the doorway.

She realizes. This is the audition she's been waiting for her entire life.

No one told her to come. No one invited her. But somehow... she knew.

The drummer opens his eyes. Looks at her. Nods.

The bassist stops tuning. Turns. Studies her for a moment.

"You play?" he asks.

Maya nods.

"Then play," he says.

No introduction. No small talk. Just music.

She lifts the saxophone. Places it to her lips. And waits.

The drummer counts off. Whispered. "One. Two."

And the room comes alive.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch2',
    language: 'fr',
    narrationText: `Le club est plus petit que Maya l'imaginait.

Murs de velours rouge. Absorbant chaque son. Rendant l'espace vivant. Respirant.

Un batteur est assis seul à la batterie. Yeux fermés. Écoutant quelque chose que lui seul peut entendre.

Dans le coin, un bassiste s'accorde. Lent. Méthodique. Chaque corde ajustée avec soin.

Et Maya. Saxophone à la main. Debout dans l'embrasure.

Elle réalise. C'est l'audition qu'elle attendait toute sa vie.

Personne ne lui a dit de venir. Personne ne l'a invitée. Mais d'une certaine façon... elle savait.

Le batteur ouvre les yeux. La regarde. Hoche la tête.

Le bassiste arrête de s'accorder. Se tourne. L'étudie un moment.

"Vous jouez?" demande-t-il.

Maya hoche la tête.

"Alors jouez," dit-il.

Pas d'introduction. Pas de bavardage. Juste la musique.

Elle lève le saxophone. Le place sur ses lèvres. Et attend.

Le batteur compte. Chuchoté. "Un. Deux."

Et la pièce s'anime.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch2',
    language: 'es',
    narrationText: `El club es más pequeño de lo que Maya imaginó.

Paredes de terciopelo rojo. Absorbiendo cada sonido. Haciendo que el espacio se sienta vivo. Respirando.

Un baterista se sienta solo en la batería. Ojos cerrados. Escuchando algo que solo él puede oír.

En la esquina, un bajista afina. Lento. Metódico. Cada cuerda ajustada con cuidado.

Y Maya. Saxofón en mano. Parada en la entrada.

Se da cuenta. Esta es la audición que ha estado esperando toda su vida.

Nadie le dijo que viniera. Nadie la invitó. Pero de alguna manera... lo sabía.

El baterista abre los ojos. La mira. Asiente.

El bajista deja de afinar. Se gira. La estudia por un momento.

"¿Tocas?" pregunta.

Maya asiente.

"Entonces toca," dice.

Sin introducción. Sin charla. Solo música.

Levanta el saxofón. Lo coloca en sus labios. Y espera.

El baterista cuenta. Susurrado. "Uno. Dos."

Y la sala cobra vida.`,
    estimatedDuration: 180,
  },

  // Chapter 3
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch3',
    language: 'en',
    narrationText: `No words are spoken.

The drummer counts off. Whispered. "One. Two."

And suddenly the room is alive.

Maya's saxophone weaves between Marcus's bass and Theo's drums.

They've never played together. But somehow. They've known each other forever.

This is jazz. This is conversation. Call and response. Question and answer.

Marcus lays down a line. Deep. Steady. The foundation.

Theo responds. Rhythm shifting. Playing with time. Pushing. Pulling.

And Maya. She floats above it all. Finding spaces between the beats. Filling them. Leaving them empty. Both at once.

They play for minutes. Or hours. Time stops meaning anything.

There's only this. The three of them. The music. The moment.

When the last note fades. The silence is deafening.

Maya opens her eyes. Didn't realize they were closed.

Marcus is smiling. Theo is already reaching for his phone. To record the next one.

From the shadows. The club owner nods.

"Thursday nights," he says. "You start Thursday nights."`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch3',
    language: 'fr',
    narrationText: `Aucun mot n'est prononcé.

Le batteur compte. Chuchoté. "Un. Deux."

Et soudain la pièce s'anime.

Le saxophone de Maya se tisse entre la basse de Marcus et la batterie de Theo.

Ils n'ont jamais joué ensemble. Mais d'une certaine façon. Ils se connaissent depuis toujours.

C'est le jazz. C'est la conversation. Appel et réponse. Question et réponse.

Marcus pose une ligne. Profonde. Stable. La fondation.

Theo répond. Rythme changeant. Jouant avec le temps. Poussant. Tirant.

Et Maya. Elle flotte au-dessus de tout. Trouvant des espaces entre les temps. Les remplissant. Les laissant vides. Les deux à la fois.

Ils jouent pendant des minutes. Ou des heures. Le temps cesse d'avoir un sens.

Il n'y a que ça. Les trois. La musique. Le moment.

Quand la dernière note s'estompe. Le silence est assourdissant.

Maya ouvre les yeux. Ne réalisait pas qu'ils étaient fermés.

Marcus sourit. Theo tend déjà la main vers son téléphone. Pour enregistrer le prochain.

Depuis les ombres. Le propriétaire du club hoche la tête.

"Jeudis soirs," dit-il. "Vous commencez jeudis soirs."`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch3',
    language: 'es',
    narrationText: `No se dicen palabras.

El baterista cuenta. Susurrado. "Uno. Dos."

Y de repente la sala cobra vida.

El saxofón de Maya se entrelaza entre el bajo de Marcus y la batería de Theo.

Nunca han tocado juntos. Pero de alguna manera. Se conocen desde siempre.

Esto es jazz. Esto es conversación. Llamada y respuesta. Pregunta y respuesta.

Marcus pone una línea. Profunda. Estable. La fundación.

Theo responde. Ritmo cambiando. Jugando con el tiempo. Empujando. Jalando.

Y Maya. Ella flota sobre todo. Encontrando espacios entre los tiempos. Llenándolos. Dejándolos vacíos. Ambos a la vez.

Tocan por minutos. O horas. El tiempo deja de significar algo.

Solo hay esto. Los tres. La música. El momento.

Cuando la última nota se desvanece. El silencio es ensordecedor.

Maya abre los ojos. No se dio cuenta de que estaban cerrados.

Marcus está sonriendo. Theo ya está alcanzando su teléfono. Para grabar el siguiente.

Desde las sombras. El dueño del club asiente.

"Jueves por la noche," dice. "Empiezan los jueves por la noche."`,
    estimatedDuration: 180,
  },

  // Chapter 4
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch4',
    language: 'en',
    narrationText: `When the last note fades. The silence feels sacred.

Maya stands still. Saxophone lowered. Breathing steadying.

Marcus is smiling. Not performing. Just genuinely... happy.

Theo is already opening his phone. "We need to record everything," he says. "Every session. This doesn't happen twice."

The club owner emerges from the shadows. Older. Weathered. Someone who's seen a thousand musicians come and go.

"Thursday nights," he says again. "Ten pm. You play until we close."

It's not a question. It's not an offer. It's just... what happens next.

Maya nods. Marcus nods. Theo is already scheduling it in his calendar.

They pack up slowly. No rush now. The pressure is gone. Replaced by something else.

Certainty.

Outside. The snow has stopped. The city is quiet. That deep quiet that only comes after midnight.

Maya walks home. Saxophone on her back. Footsteps crunching in fresh snow.

Thursday nights. She repeats it to herself. Thursday nights.

She doesn't know it yet. But everything just changed.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch4',
    language: 'fr',
    narrationText: `Quand la dernière note s'estompe. Le silence semble sacré.

Maya reste immobile. Saxophone abaissé. Respiration se stabilisant.

Marcus sourit. Pas en performance. Juste sincèrement... heureux.

Theo ouvre déjà son téléphone. "Nous devons tout enregistrer," dit-il. "Chaque session. Ça n'arrive pas deux fois."

Le propriétaire du club émerge des ombres. Plus âgé. Marqué. Quelqu'un qui a vu mille musiciens aller et venir.

"Jeudis soirs," dit-il encore. "Dix heures. Vous jouez jusqu'à la fermeture."

Ce n'est pas une question. Ce n'est pas une offre. C'est juste... ce qui arrive ensuite.

Maya hoche la tête. Marcus hoche la tête. Theo le programme déjà dans son calendrier.

Ils rangent lentement. Pas de précipitation maintenant. La pression est partie. Remplacée par autre chose.

Certitude.

Dehors. La neige a cessé. La ville est calme. Ce calme profond qui ne vient qu'après minuit.

Maya rentre à pied. Saxophone sur le dos. Pas qui craquent dans la neige fraîche.

Jeudis soirs. Elle se le répète. Jeudis soirs.

Elle ne le sait pas encore. Mais tout vient de changer.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'midnight-resonance',
    chapterId: 'midnight-resonance-ch4',
    language: 'es',
    narrationText: `Cuando la última nota se desvanece. El silencio se siente sagrado.

Maya se queda quieta. Saxofón bajado. Respiración estabilizándose.

Marcus está sonriendo. No actuando. Solo genuinamente... feliz.

Theo ya está abriendo su teléfono. "Necesitamos grabar todo," dice. "Cada sesión. Esto no pasa dos veces."

El dueño del club emerge de las sombras. Mayor. Curtido. Alguien que ha visto mil músicos ir y venir.

"Jueves por la noche," dice de nuevo. "Diez pm. Tocan hasta que cerremos."

No es una pregunta. No es una oferta. Es solo... lo que sigue.

Maya asiente. Marcus asiente. Theo ya lo está agendando en su calendario.

Guardan lentamente. Sin prisa ahora. La presión se ha ido. Reemplazada por otra cosa.

Certeza.

Afuera. La nieve ha parado. La ciudad está tranquila. Esa tranquilidad profunda que solo viene después de medianoche.

Maya camina a casa. Saxofón en la espalda. Pasos crujiendo en nieve fresca.

Jueves por la noche. Se lo repite a sí misma. Jueves por la noche.

Aún no lo sabe. Pero todo acaba de cambiar.`,
    estimatedDuration: 180,
  },
];

// ============================================
// SOFT POWER (continued from Ch3)
// Direction: Thoughtful, composed, analytical but human
// Energy: Measured
// ============================================

export const SOFT_POWER_AUDIO_CONTINUED: AudioScript[] = [
  // Chapter 3
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch3',
    language: 'en',
    narrationText: `A hijab in a corporate office.

Locs in a courtroom.

A sari at city hall.

Gold teeth. Henna. Dashikis. Shalwar kameez.

Each is a choice.

And each choice says. I will not disappear.

Style is soft power because it's visible. You can't ignore it.

It walks into rooms that try to exclude it. It sits at tables that weren't set for it.

It photographs well. It trends. It influences.

When enough people wear their culture visibly... the normal shifts.

What was once ethnic becomes cool. What was once unprofessional becomes diverse.

But this isn't about acceptance.

It's about refusal.

The refusal to assimilate completely. To erase yourself for comfort. To pretend you came from nowhere.

Style says. I came from somewhere.

And I'm still there. Even here.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch3',
    language: 'fr',
    narrationText: `Un hijab dans un bureau corporatif.

Des locs dans une salle d'audience.

Un sari à l'hôtel de ville.

Dents en or. Henné. Dashikis. Shalwar kameez.

Chacun est un choix.

Et chaque choix dit. Je ne disparaîtrai pas.

Le style est pouvoir doux parce qu'il est visible. On ne peut pas l'ignorer.

Il entre dans des pièces qui tentent de l'exclure. Il s'assoit à des tables qui n'ont pas été mises pour lui.

Il se photographie bien. Il devient tendance. Il influence.

Quand assez de gens portent leur culture visiblement... le normal change.

Ce qui était autrefois ethnique devient cool. Ce qui était autrefois non professionnel devient diversifié.

Mais ce n'est pas à propos d'acceptation.

C'est à propos de refus.

Le refus de s'assimiler complètement. De s'effacer pour le confort. De prétendre venir de nulle part.

Le style dit. Je viens de quelque part.

Et j'y suis encore. Même ici.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch3',
    language: 'es',
    narrationText: `Un hiyab en una oficina corporativa.

Rastas en una sala de tribunal.

Un sari en el ayuntamiento.

Dientes de oro. Henna. Dashikis. Shalwar kameez.

Cada uno es una elección.

Y cada elección dice. No desapareceré.

El estilo es poder suave porque es visible. No puedes ignorarlo.

Entra en habitaciones que intentan excluirlo. Se sienta en mesas que no fueron puestas para él.

Se fotografía bien. Se vuelve tendencia. Influye.

Cuando suficientes personas visten su cultura visiblemente... lo normal cambia.

Lo que antes era étnico se vuelve genial. Lo que antes era no profesional se vuelve diverso.

Pero esto no es sobre aceptación.

Es sobre negación.

La negación a asimilarse completamente. A borrarte para comodidad. A pretender que vienes de ningún lugar.

El estilo dice. Vengo de algún lugar.

Y todavía estoy ahí. Incluso aquí.`,
    estimatedDuration: 180,
  },

  // Continuing with remaining Soft Power chapters...
  // Chapter 4
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch4',
    language: 'en',
    narrationText: `Reggae from Jamaica becomes global resistance music.

Hip-hop from the Bronx becomes the sound of youth worldwide.

K-pop from Seoul becomes a multi-billion dollar cultural export.

Music is soft power's most efficient vehicle.

It doesn't need translation. A beat is a beat. A hook is a hook.

And once it's in your head... it carries everything with it. Language. Attitude. Worldview.

Immigrant kids grow up bilingual in music.

We know our parents' songs. And the radio's songs.

We switch between them. Like code-switching between languages.

And sometimes. We blend them.

Punjabi over trap beats. Arabic over reggaeton. Mandarin over R&B.

These fusions are soft power in action.

They say. We're not choosing. We're both.

We're making something new. That holds the old.

Music remembers. What borders try to separate.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch4',
    language: 'fr',
    narrationText: `Le reggae de la Jamaïque devient musique de résistance globale.

Le hip-hop du Bronx devient le son de la jeunesse mondiale.

La K-pop de Séoul devient une exportation culturelle de plusieurs milliards de dollars.

La musique est le véhicule le plus efficace du pouvoir doux.

Elle n'a pas besoin de traduction. Un rythme est un rythme. Un refrain est un refrain.

Et une fois qu'il est dans votre tête... il transporte tout avec lui. Langue. Attitude. Vision du monde.

Les enfants immigrants grandissent bilingues en musique.

Nous connaissons les chansons de nos parents. Et les chansons de la radio.

Nous basculons entre elles. Comme changer de code entre les langues.

Et parfois. Nous les fusionnons.

Punjabi sur des beats trap. Arabe sur du reggaeton. Mandarin sur du R&B.

Ces fusions sont le pouvoir doux en action.

Elles disent. Nous ne choisissons pas. Nous sommes les deux.

Nous créons quelque chose de nouveau. Qui tient l'ancien.

La musique se souvient. De ce que les frontières tentent de séparer.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch4',
    language: 'es',
    narrationText: `El reggae de Jamaica se convierte en música de resistencia global.

El hip-hop del Bronx se convierte en el sonido de la juventud mundial.

El K-pop de Seúl se convierte en una exportación cultural multimillonaria.

La música es el vehículo más eficiente del poder suave.

No necesita traducción. Un ritmo es un ritmo. Un gancho es un gancho.

Y una vez que está en tu cabeza... lleva todo consigo. Idioma. Actitud. Visión del mundo.

Los niños inmigrantes crecemos bilingües en música.

Conocemos las canciones de nuestros padres. Y las canciones de la radio.

Cambiamos entre ellas. Como cambiar de código entre idiomas.

Y a veces. Las fusionamos.

Punjabi sobre beats de trap. Árabe sobre reggaeton. Mandarín sobre R&B.

Estas fusiones son poder suave en acción.

Dicen. No estamos eligiendo. Somos ambos.

Estamos creando algo nuevo. Que sostiene lo viejo.

La música recuerda. Lo que las fronteras intentan separar.`,
    estimatedDuration: 180,
  },

  // Chapter 5
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch5',
    language: 'en',
    narrationText: `You don't need a platform to have soft power.

You just need to be seen.

A brown girl in a physics class.

A Black man in a boardroom.

A Muslim woman in parliament.

A trans person on television.

An Indigenous artist at a gallery opening.

Each presence is political.

Not because they're making speeches. Just because they're there.

Representation is soft power.

When a kid sees someone who looks like them doing something they were told they couldn't do... possibilities shift.

When enough exceptions exist. They stop being exceptions.

This is why visibility matters.

Not performative diversity. Real presence. Real voice. Real power.

You change what people think is possible. Just by being impossible to ignore.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch5',
    language: 'fr',
    narrationText: `Vous n'avez pas besoin d'une plateforme pour avoir le pouvoir doux.

Vous avez juste besoin d'être vu.

Une fille brune dans un cours de physique.

Un homme noir dans une salle de conseil.

Une femme musulmane au parlement.

Une personne trans à la télévision.

Un artiste autochtone à une ouverture de galerie.

Chaque présence est politique.

Pas parce qu'ils font des discours. Juste parce qu'ils sont là.

La représentation est pouvoir doux.

Quand un enfant voit quelqu'un qui lui ressemble faire quelque chose qu'on lui a dit qu'il ne pourrait pas faire... les possibilités changent.

Quand assez d'exceptions existent. Elles cessent d'être des exceptions.

C'est pourquoi la visibilité compte.

Pas de la diversité performative. Une présence réelle. Une voix réelle. Un pouvoir réel.

Vous changez ce que les gens pensent possible. Juste en étant impossible à ignorer.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch5',
    language: 'es',
    narrationText: `No necesitas una plataforma para tener poder suave.

Solo necesitas ser visto.

Una chica morena en una clase de física.

Un hombre negro en una sala de juntas.

Una mujer musulmana en el parlamento.

Una persona trans en televisión.

Un artista indígena en una inauguración de galería.

Cada presencia es política.

No porque estén dando discursos. Solo porque están ahí.

La representación es poder suave.

Cuando un niño ve a alguien que se parece a él haciendo algo que le dijeron que no podía hacer... las posibilidades cambian.

Cuando existen suficientes excepciones. Dejan de ser excepciones.

Por esto importa la visibilidad.

No diversidad performativa. Presencia real. Voz real. Poder real.

Cambias lo que la gente piensa que es posible. Solo siendo imposible de ignorar.`,
    estimatedDuration: 180,
  },

  // Chapter 6
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch6',
    language: 'en',
    narrationText: `Soft power isn't about becoming powerful in their terms.

It's about changing the terms.

It's about making them see us. Really see us.

Not as threats. Not as guests. Not as problems to solve.

But as people who belong here. Because we're here.

Culture is how we do this.

Through our food in their grocery stores. Our words in their dictionaries. Our music in their playlists. Our faces in their media. Our stories in their conversations.

We move quietly. But completely.

We don't ask for space. We create it.

We don't wait for permission. We exist. And let existence speak.

This is soft power. This is influence.

This is how culture moves where politics cannot.

And this is how we change the world.

Not by conquering it. But by making it impossible for them to imagine it without us.

We are seen.

And we are not going anywhere.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch6',
    language: 'fr',
    narrationText: `Le pouvoir doux n'est pas devenir puissant selon leurs termes.

C'est changer les termes.

C'est les faire nous voir. Vraiment nous voir.

Non pas comme menaces. Non pas comme invités. Non pas comme problèmes à résoudre.

Mais comme des personnes qui appartiennent ici. Parce que nous sommes ici.

La culture est comment nous faisons cela.

Par notre nourriture dans leurs épiceries. Nos mots dans leurs dictionnaires. Notre musique dans leurs listes de lecture. Nos visages dans leurs médias. Nos histoires dans leurs conversations.

Nous bougeons tranquillement. Mais complètement.

Nous ne demandons pas d'espace. Nous le créons.

Nous n'attendons pas la permission. Nous existons. Et laissons l'existence parler.

C'est le pouvoir doux. C'est l'influence.

C'est comment la culture bouge où la politique ne peut pas.

Et c'est comment nous changeons le monde.

Non pas en le conquérant. Mais en rendant impossible pour eux de l'imaginer sans nous.

Nous sommes vus.

Et nous n'allons nulle part.`,
    estimatedDuration: 180,
  },
  {
    storyWorldId: 'soft-power',
    chapterId: 'soft-power-ch6',
    language: 'es',
    narrationText: `El poder suave no se trata de volverse poderoso en sus términos.

Se trata de cambiar los términos.

Se trata de hacerlos vernos. Realmente vernos.

No como amenazas. No como invitados. No como problemas a resolver.

Sino como personas que pertenecen aquí. Porque estamos aquí.

La cultura es cómo hacemos esto.

A través de nuestra comida en sus tiendas. Nuestras palabras en sus diccionarios. Nuestra música en sus listas. Nuestros rostros en sus medios. Nuestras historias en sus conversaciones.

Nos movemos silenciosamente. Pero completamente.

No pedimos espacio. Lo creamos.

No esperamos permiso. Existimos. Y dejamos que la existencia hable.

Esto es poder suave. Esto es influencia.

Así es como la cultura se mueve donde la política no puede.

Y así es como cambiamos el mundo.

No conquistándolo. Sino haciendo imposible que lo imaginen sin nosotros.

Somos vistos.

Y no vamos a ninguna parte.`,
    estimatedDuration: 180,
  },
];

// Export combined arrays
export const ALL_AUDIO_SCRIPTS: AudioScript[] = [
  ...MIDNIGHT_RESONANCE_AUDIO,
  ...SOFT_POWER_AUDIO_CONTINUED,
  // More will be added in continuation...
];

/**
 * Helper function to get audio script by chapter ID and language
 */
export function getAudioScript(
  chapterId: string,
  language: 'en' | 'fr' | 'es'
): AudioScript | undefined {
  return ALL_AUDIO_SCRIPTS.find(
    (script) => script.chapterId === chapterId && script.language === language
  );
}

/**
 * Helper function to get all audio scripts for a story world
 */
export function getStoryWorldAudioScripts(
  storyWorldId: string,
  language: 'en' | 'fr' | 'es'
): AudioScript[] {
  return ALL_AUDIO_SCRIPTS.filter(
    (script) => script.storyWorldId === storyWorldId && script.language === language
  );
}

/**
 * Get total audio duration for a story world (all chapters)
 */
export function getStoryWorldTotalDuration(
  storyWorldId: string,
  language: 'en' | 'fr' | 'es'
): number {
  const scripts = getStoryWorldAudioScripts(storyWorldId, language);
  return scripts.reduce((total, script) => total + script.estimatedDuration, 0);
}
