# Copy deck (DS2) — E1 note, guest-first sign-in states, offline and reminders

Source of truth in code: `src/app/i18n/strings.ts` (tested by `strings.test.ts`: every key in EN, FR and ES with matching placeholders). English is final for beta. FR and ES are drafts that need reviewed copy before real customers (tracked in the release checklist). A missing string falls back to English with a visible marker.

## E1 private note
| Key | EN | FR (draft) | ES (draft) |
|---|---|---|---|
| note.prompt | Something stay with you? Leave the creator a private note. | Quelque chose vous a marqué ? Laissez une note privée à la personne créatrice. | ¿Algo se quedó contigo? Deja una nota privada a la persona creadora. |
| note.title | Write a private note | Écrire une note privée | Escribe una nota privada |
| note.placeholder | What did this story bring up for you? | Qu'est-ce que cette histoire a fait naître en vous ? | ¿Qué despertó en ti esta historia? |
| note.counter | {n} / 500 | {n} / 500 | {n} / 500 |
| note.named | Include my name | Inclure mon nom | Incluir mi nombre |
| note.privacy | Only the creator can read this. It is never shown publicly. | Seule la personne créatrice peut la lire. Elle n'est jamais publique. | Solo la persona creadora puede leerla. Nunca es pública. |
| note.send | Send note | Envoyer la note | Enviar nota |
| note.sent | Note sent. | Note envoyée. | Nota enviada. |
| note.requiresAccount | Sign in to send a note. | Connectez-vous pour envoyer une note. | Inicia sesión para enviar una nota. |
| note.limit | You already sent a note on this story. Try again in an hour. | Vous avez déjà envoyé une note sur cette histoire. Réessayez dans une heure. | Ya enviaste una nota sobre esta historia. Inténtalo en una hora. |
| note.error | Couldn't send your note. Try again. | Impossible d'envoyer votre note. Réessayez. | No se pudo enviar tu nota. Inténtalo de nuevo. |
| inbox.title | Notes | Notes | Notas |
| inbox.empty | No notes yet. When someone writes to you, it appears here. | Aucune note pour l'instant. | Aún no hay notas. |
| inbox.anonymous | Someone who read your story | Une personne qui a lu votre histoire | Alguien que leyó tu historia |
| inbox.delete | Delete note | Supprimer la note | Eliminar nota |
| inbox.deleteConfirm | Delete this note? This can't be undone. | Supprimer cette note ? Action irréversible. | ¿Eliminar esta nota? No se puede deshacer. |
| inbox.error | Couldn't load your notes. | Impossible de charger vos notes. | No se pudieron cargar tus notas. |

## Sign-in states (G1, guest-first)
| State | EN message |
|---|---|
| requires account | Sign in to {action}. You'll come back to this story. |
| wrong credentials | That email or password doesn't match. Check and try again. |
| auth failed | We couldn't sign you in. Try again in a moment. |
| offline | You're offline. Connect to sign in. Reading saved stories still works. |
| session expired | Your session ended. Sign in again to continue. |
| rate limited | Too many attempts. Wait a minute and try again. |
| email taken | An account with this email exists. Sign in instead. |
| reset sent | If that email has an account, a reset link is on its way. |

## Guest mode and Create (DT1, DT2)

Source of truth is `src/app/i18n/strings.ts`; this table mirrors it. FR and ES are drafts for native review. The one-time creator intro does not mention first-story review yet: add that sentence (design decision 4A) when review ships.

| Key | EN | FR | ES |
|---|---|---|---|
| nav.create | Create | Créer | Crear |
| nav.locked | {tab}, sign in required | {tab}, connexion requise | {tab}, requiere iniciar sesión |
| guest.explore | Explore without an account | Explorer sans compte | Explorar sin cuenta |
| guest.banner | Exploring as a guest. Sign up to save stories and pick up where you left off. | Vous explorez en tant qu'invité. Créez un compte pour enregistrer des histoires et reprendre votre lecture. | Estás explorando como invitado. Crea una cuenta para guardar historias y retomar tu lectura. |
| guest.banner.cta | Sign up | Créer un compte | Crear cuenta |
| guest.banner.dismiss | Dismiss guest notice | Fermer l'avis d'invité | Cerrar el aviso de invitado |
| guest.save.title | Keep this story | Gardez cette histoire | Guarda esta historia |
| guest.save.body | Create a free account to save {subject} and find it again in your Library. | Créez un compte gratuit pour enregistrer {subject} et la retrouver dans votre bibliothèque. | Crea una cuenta gratuita para guardar {subject} y encontrarla de nuevo en tu biblioteca. |
| guest.follow.title | Follow {subject} | Suivre {subject} | Seguir a {subject} |
| guest.follow.body | Create a free account to follow {subject} and hear when they share something new. | Créez un compte gratuit pour suivre {subject} et savoir quand cette personne partage du nouveau. | Crea una cuenta gratuita para seguir a {subject} y enterarte cuando comparta algo nuevo. |
| guest.library.title | Your Library is waiting | Votre bibliothèque vous attend | Tu biblioteca te espera |
| guest.library.body | Create a free account to save stories and come back to them any time. | Créez un compte gratuit pour enregistrer des histoires et y revenir quand vous voulez. | Crea una cuenta gratuita para guardar historias y volver a ellas cuando quieras. |
| guest.profile.title | Make SEEN yours | Faites de SEEN votre espace | Haz SEEN tuyo |
| guest.profile.body | Create a free account to set up your profile, language and reading preferences. | Créez un compte gratuit pour configurer votre profil, votre langue et vos préférences de lecture. | Crea una cuenta gratuita para configurar tu perfil, idioma y preferencias de lectura. |
| guest.create.title | Tell a story on SEEN | Racontez une histoire sur SEEN | Cuenta una historia en SEEN |
| guest.create.body | Create a free account to start a story of your own. | Créez un compte gratuit pour commencer votre propre histoire. | Crea una cuenta gratuita para empezar tu propia historia. |
| guest.continue.title | Keep reading | Continuez votre lecture | Sigue leyendo |
| guest.continue.body | Create a free account to read the rest of {subject}. | Créez un compte gratuit pour lire la suite de {subject}. | Crea una cuenta gratuita para leer el resto de {subject}. |
| guest.page.title | Sign in to see this | Connectez-vous pour voir ceci | Inicia sesión para ver esto |
| guest.page.body | This part of SEEN is for people with an account. It only takes a minute. | Cette partie de SEEN est réservée aux personnes avec un compte. Cela ne prend qu'une minute. | Esta parte de SEEN es para quienes tienen una cuenta. Solo toma un minuto. |
| guest.cta.create | Create free account | Créer un compte gratuit | Crear cuenta gratuita |
| guest.cta.signin | I already have an account. Sign in | J'ai déjà un compte. Me connecter | Ya tengo una cuenta. Iniciar sesión |
| guest.cta.later | Not now, keep browsing | Pas maintenant, continuer à explorer | Ahora no, seguir explorando |
| guest.auth.close | Close | Fermer | Cerrar |
| creator.intro.eyebrow | Become a creator | Devenir créateur ou créatrice | Conviértete en creador o creadora |
| creator.intro.title | Tell a story on SEEN | Racontez une histoire sur SEEN | Cuenta una historia en SEEN |
| creator.intro.body | Share a story, a voice or a piece of your culture with readers who came to listen. You can write it, or add your own recording. | Partagez une histoire, une voix ou un morceau de votre culture avec des lecteurs venus écouter. Vous pouvez l'écrire ou y ajouter votre propre enregistrement. | Comparte una historia, una voz o un pedazo de tu cultura con lectores que vinieron a escuchar. Puedes escribirla o añadir tu propia grabación. |
| creator.intro.cta | Start a story | Commencer une histoire | Empezar una historia |
| creator.intro.later | Not now | Pas maintenant | Ahora no |

## Offline (E6) and reminders (E5)
| Key | EN |
|---|---|
| offline.save | Save for offline |
| offline.saved | Saved offline |
| offline.limit | You can keep 20 stories offline. Remove one to add another. |
| offline.expired | Reconnect to refresh this story. |
| offline.gone | No longer available offline. |
| offline.full | Your device is full. Free some space and try again. |
| reminder.toggle | Remind me before deadlines |
| reminder.item | {funder} closes in {days} days. |
