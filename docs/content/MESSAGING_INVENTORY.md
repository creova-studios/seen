# SEEN messaging inventory

Audit of user-facing copy against one goal: SEEN should feel like a storytelling platform, not another social network. Read-only audit; no source files were changed.

Scope: live web app (`src/`), the separate Expo app (`mobile/`, excluded from the web build by `tsconfig.json`), and `archive/` (unreachable, listed only so nobody revives it by accident). Line numbers are from the working tree on `main` at audit time.

Verdicts: KEEP / CHANGE / REMOVE. Job: F = functional, C = conversational, E = editorial. "Social?" = reads as generic social-media language.

## 1. Summary

**Headline: the live web app is already mostly clean. The brand-poetry problem now lives in `mobile/` and `archive/`.**

| Phrase / family | Live web `src/` | `mobile/` | `archive/` |
|---|---|---|---|
| "You are now SEEN" | 0 | 0 | 1 (`Onboarding.tsx:391`) |
| "You are entering SEEN" | 0 | 1 (`InvocationScreen.tsx:65`) | 1 (`Onboarding.tsx:111`) |
| "Be seen" / "Get seen" slogan | 0 (two in-story essay lines, see 3.3) | 0 | 0 |
| "How will you move through this space?" | 0 | 1 (`OnboardingScreen.tsx:32`) | 1 (string table) |
| "Enter Story" / "Unlock Story" | "Unlock story" x1 (paywall, fine) | "Enter Story" x1 | 2 (`StoryWorldEntryScreen.tsx:205,219`) |
| "Your presence, unfolding in real time." | 1 (`ForYouScreen.tsx:157`) | 1 (`HomeScreen.tsx:22`) | n/a |
| "Stories in motion" | 1 (`ForYouScreen.tsx:314`) | 0 | n/a |
| "Follow / Following / Followers" | 14 UI strings, 0 "Followers" counts | 0 | n/a |
| "For You" | 9 UI strings + route labels | 2 | n/a |
| "Experience" as CTA | 2 (`ForYouSections.tsx:47-48`) | 0 | n/a |
| "Trending" | 2 labels (`ForYouScreen.tsx:236`, icon) + `trending` data flag | 0 | n/a |
| "community / communities" | 17 UI strings | 1 ("shape communities") | n/a |
| "Join the conversation" | 0 | 0 | 0 |
| "engagement" / "frequency" | 1 (About, as a principle, fine) / 0 | 0 | data only |
| like / viral / feed (user-visible) | "viral loops" in About (anti-social, fine); "Your feed is being prepared" in dead code | 0 | n/a |

Counts of judged findings in live web: **54 rows** (KEEP 17, CHANGE 33, REMOVE 4).

**Top themes**

1. **Home is the one place that still sounds like a lifestyle app.** `ForYouScreen.tsx` has "Your presence, unfolding in real time.", "Stories in motion", "Welcome. Your space is forming.", "Trending Now", "Continue experiencing", and an "Experience" CTA. All are decorative or social-feed vocabulary doing a utility job.
2. **Social-graph words are used where a library word would do.** "Following" is a Library tab and a Profile row, "Creators to follow" is a stat label. SEEN's own privacy copy says it shows no follower or like counts, so the UI should not look like a follow graph.
3. **"Community" is overused as filler** (onboarding subtitle, profile CTA, "Community Voices", "Community" settings header). Only the legal sense (community guidelines) is functional.
4. **Empty states are generic CMS text** ("No completed content", "Content you finish will appear here", "We're constantly adding new stories, music, and films. Check back soon!"). Several are in dead code (`EmptyState.tsx:76-132` has no importers).
5. **The catalogue and topic vocabulary skew heavily to hardship and justice.** 11 of 12 stories are migration, identity, trauma, labour or erasure. The onboarding interest chips are generated from those themes, so a new user is asked to pick from "Family & Separation", "Preservation & Loss", "Social Justice". There is no joy, food, humour, music-as-pleasure, ordinary life or achievement vocabulary anywhere (section 5).
6. **Localisation gap.** Most of the strings above are hardcoded English with no FR/ES (`ForYouScreen`, `LibraryScreen`, `LibraryPanels`, `ProfileScreen`, `OnboardingOrientation`, `NavigationBar`, `ExploreScreen` except two empty states). Every CHANGE below that lands in a hardcoded file should move to `strings.ts` with EN/FR/ES per CLAUDE.md. FR/ES here are drafts for native review.

## 2. Findings by area

### 2.1 Onboarding

| # | Location | Current text | Job | Social? | Verdict | Replacement (EN / FR / ES) |
|---|---|---|---|---|---|---|
| O1 | `OnboardingOrientation.tsx:68` | "What brings you to SEEN?" | C | no | KEEP | Plain and answerable. |
| O2 | `OnboardingOrientation.tsx:69` | "Stories from communities, in your language. Choose all that apply." | C | mild ("communities") | CHANGE | "Stories from many voices, in your language. Choose all that apply." / "Des histoires de voix multiples, dans votre langue. Choisissez tout ce qui s'applique." / "Historias de muchas voces, en tu idioma. Elige todo lo que corresponda." |
| O3 | `OnboardingOrientation.tsx:16` | "Discover stories" / "Read, listen and watch" | F | no | KEEP | |
| O4 | `OnboardingOrientation.tsx:17` | "Learn" / "History, culture and craft" | F | no | CHANGE | Label "Learn" is vague. "Learn something" / "History, culture, food and craft" (adds ordinary life). |
| O5 | `OnboardingOrientation.tsx:18` | "Share my story" / "Publish your own work" | F | no | KEEP | |
| O6 | `OnboardingOrientation.tsx:19` | "Build an audience" / "Reach people who care" | F | yes (growth-speak) | CHANGE | "Find readers and listeners" / "Get your work in front of people who will enjoy it" |
| O7 | `OnboardingOrientation.tsx:20` | "Connect with creators" / "Follow and support voices" | F | yes ("Follow", "support voices") | CHANGE | "Back the creators you love" / "Get their new stories and support their work" |
| O8 | `OnboardingOrientation.tsx:99` | "What are you interested in?" | C | no | CHANGE | "What do you like to read, hear and watch?" (invites pleasure, not just issues). |
| O9 | `OnboardingOrientation.tsx:100` | "Optional. We use this to start your For You feed. Change it any time." | F | yes ("For You feed") | CHANGE | "Optional. We use this to pick what you see first. Change it any time." / "Facultatif. Nous l'utilisons pour choisir ce que vous voyez en premier. Modifiable à tout moment." / "Opcional. Lo usamos para elegir lo que ves primero. Puedes cambiarlo cuando quieras." |
| O10 | `OnboardingOrientation.tsx:123` | "Next: create your account" / "Skip: create your account" | F | no | KEEP | |
| O11 | `LanguageSelectionScreen.tsx:42` | "Choose your language" | F | no | KEEP | Needs FR/ES strings too (currently shown before language is known, so keep trilingual). |
| O12 | `OnboardingSystem.tsx:273-275` | "Create your account" / "Welcome back" / "Reset your password" | F/C | no | KEEP | |
| O13 | `OnboardingSystem.tsx:166` | "Opening SEEN…" (role=status) | F | no | KEEP | Loading status, must stay utility. Do not put the brand line here (see section 3). |
| O14 | `mobile/src/screens/OnboardingScreen.tsx:32` | "How will you move through this space?" (Creator / Viewer / Moderator) | F | no, but poetic doing utility | CHANGE | "What would you like to do?" with options "Share my work" / "Discover stories" / "Support creators". Drop "Moderator" from self-select (role is granted, not chosen). |
| O15 | `mobile/src/screens/OnboardingScreen.tsx:44` | "What brings you here?" | C | no | KEEP | |
| O16 | `mobile/src/screens/OnboardingScreen.tsx` (ROLES) | "I shape communities" (Moderator) | F | mild | CHANGE | Remove option, see O14. |
| O17 | `mobile/src/screens/InvocationScreen.tsx:65` | "You are entering SEEN." | E | no | CHANGE | Tagline on line 64 already carries the mood. Replace with nothing, or "Stories from many voices." The one brand moment is not this screen (section 3). |
| O18 | `mobile/src/screens/InvocationScreen.tsx:74` | a11y label "Enter SEEN" | F | no | KEEP | |

### 2.2 For You (home)

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| F1 | `ForYouScreen.tsx:155` / `strings.ts:264` `nav.forYou` | "For You" | F (nav + title) | yes (TikTok/Instagram term) | CHANGE | "Home" / "Accueil" / "Inicio". Keep route id `for-you`; label only. See P1-1 for test impact. |
| F2 | `ForYouScreen.tsx:157` and `mobile/src/screens/HomeScreen.tsx:22` | "Your presence, unfolding in real time." | E | yes (presence, real time) | REMOVE | Delete the subtitle, or "New and unfinished stories, picked for your language." Prefer delete: the title plus the hero already orient the user. |
| F3 | `ForYouScreen.tsx:141` | "Welcome. Your space is forming." (first visit) | C | mild | CHANGE | This is the recommended single brand moment: "You are now SEEN." (section 3). |
| F4 | `ForYouScreen.tsx:162,307-325` `PresenceIndicators` | counts labelled "Story in motion" / "Stories in motion" | F | yes ("presence", "in motion") | CHANGE | "Story" / "Stories" with count; or "{n} stories to read". / FR "{n} histoires à lire" / ES "{n} historias para leer". Rename component to `HomeShortcuts`, drop the "Presence" comments (`ForYouScreen.tsx:161`, `LibraryScreen.tsx:91`). |
| F5 | `ForYouScreen.tsx:315` | "Creators to follow" | F | yes | CHANGE | "Creators" or "Meet the creators". |
| F6 | `ForYouScreen.tsx:316` | "Collections to explore" | F | no | KEEP | |
| F7 | `ForYouSections.tsx:47-48` (aria at 47) | CTA "Experience"; aria-label "Experience {title}" | F | mild (CTA verb for media) | CHANGE | "Start reading" (matches `story.start`) when text/audio chapter, or "Open story". Aria "Open {title}". |
| F8 | `ForYouSections.tsx:36-ish` eyebrow | "Editor's feature · {type}" | E | no | KEEP | Good editorial voice. |
| F9 | `ForYouScreen.tsx:167-168` | "Continue experiencing" / "Pick up where you paused" | F | mild | CHANGE | "Keep reading" / "Pick up where you left off". (`done.close` already uses "Keep reading".) |
| F10 | `ForYouScreen.tsx:186` | "Based on your interests" | F | no | KEEP | |
| F11 | `ForYouScreen.tsx:204-205` | "Featured" / "Hand-picked for you" | F | mild (not true, picked by editors, not for the user) | CHANGE | subtitle "Picked by the SEEN team" / "Choisi par l'équipe SEEN" / "Elegido por el equipo de SEEN". |
| F12 | `ForYouScreen.tsx:236-237` | "Trending Now" / "Popular on SEEN" | F | yes (trending/popular, and not backed by real popularity data, `trending` is a hand-set flag at `storyDatabase.ts:143,503,955,1306`) | CHANGE | "Worth your time" / subtitle "Our current favourites". Or "Recently loved by readers" only if real data exists. Drop `TrendingUp` icon (`ForYouScreen.tsx:239`). |
| F13 | `ForYouScreen.tsx:267-268` | "New Releases" / "Fresh content" | F | mild ("content") | CHANGE | "New" / "Just added". |
| F14 | `ForYouScreen.tsx:89` (`ForYouSections.tsx`) | "Voices to discover" / "Creators to follow" | F | mild | CHANGE | "Voices to discover" KEEP; subtitle -> "Creators on SEEN". |
| F15 | `ForYouScreen.tsx:298` | "Content personalized for exploration / creators / contributors" | F | yes (algorithm talk) | REMOVE | Delete. It exposes an internal intent enum and says nothing useful. |
| F16 | `ForYouScreen.tsx:119-ish` | Empty: "No Stories Available" / "Check back soon for new content." (EN/FR/ES) | F | no | CHANGE | "Nothing here yet" / "New stories are added often. Try Explore in the meantime." Button "Explore". |

### 2.3 Explore

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| X1 | `ExploreScreen.tsx:120` | "Discover cultural stories and creators" | C | no | CHANGE | "Stories, creators and collections, by theme and language" / FR "Histoires, créateurs et collections, par thème et par langue" / ES "Historias, creadores y colecciones, por tema e idioma". ("Cultural" is a diversity-campaign tell.) |
| X2 | `ExploreScreen.tsx:145` | placeholder "Search stories, creators, topics..." | F | no | KEEP | |
| X3 | `ExploreScreen.tsx:79-81` | Empty: "No Content Available" / "Check back soon for new stories." | F | no | CHANGE | "Nothing to show yet" / "New stories are added often." Title-case "Content" -> sentence case. |
| X4 | `ExploreScreen.tsx:92` | action "For You" | F | yes | CHANGE | Follows F1: "Home". |
| X5 | `storyService.ts:109-129` | Category names: "Featured", "Music & Sound", "Migration Stories", "Indigenous Voices", "Documentary" | E | no | KEEP, extend | Good, but all heavy; see section 5 for additions. Add FR/ES for any new ones in the same ternary pattern. |
| X6 | `strings.ts:171,173` | "Browse by theme" / "Start typing, or pick a theme." | F | no | KEEP | |
| X7 | `strings.ts:258` `unavail.action` | "Explore stories" | F | no | KEEP | |

### 2.4 Library

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| L1 | `LibraryScreen.tsx:88` | "Your saved and in-progress content" | C | mild ("content") | CHANGE | "Stories you've saved or started" / FR "Les histoires enregistrées ou commencées" / ES "Historias que guardaste o empezaste". |
| L2 | `LibraryScreen.tsx:124` | "Story/Stories in progress" | F | no | KEEP | |
| L3 | `LibraryScreen.tsx:155` | "Journey/Journeys complete" | F | no, but off-vocabulary (everywhere else is "story") | CHANGE | "Story finished" / "Stories finished". |
| L4 | `LibraryScreen.tsx:191` | tab "Following" (count) | F | yes | CHANGE | "Creators" (count). Panel title stays. |
| L5 | `LibraryScreen.tsx:231-233` | "Nothing saved yet" / "Tap the bookmark while reading to keep a story here." / "Explore Stories" | F | no | KEEP | Best empty state in the app: tells you the exact action. Use it as the model. Title-case button -> "Explore stories". |
| L6 | `LibraryScreen.tsx:279-281` | "No stories in progress" / "Start exploring to see your in-progress content here." | F | mild | CHANGE | "Nothing in progress" / "Open a story and it will wait for you here." / FR "Ouvrez une histoire, elle vous attendra ici." / ES "Abre una historia y te esperará aquí." |
| L7 | `LibraryScreen.tsx:318-320` | "No completed content" / "Content you finish will appear here." / "Start Exploring" | F | yes (CMS tone) | CHANGE | "Nothing finished yet" / "Stories you finish are kept here." / button "Find a story". |
| L8 | `LibraryScreen.tsx:333` | "…The story itself stays on SEEN." | F | no | KEEP | |
| L9 | `LibraryPanels.tsx:49-50` | "You're not following anyone yet" / "Follow creators to hear when they publish." / "Find creators" | F | yes | CHANGE | "No creators yet" / "Follow a creator to get their new stories." / keep "Find creators". |
| L10 | `LibraryPanels.tsx:68` | pill "Following"; aria "Unfollow {name}" | F | yes | KEEP (button), see S1 | |
| L11 | `LibraryPanels.tsx:36` | "Couldn't unfollow {name}. Try again." | F | no | KEEP | |
| L12 | `LibraryPanels.tsx:94-96` | "No saved collections" / "Save a collection from Explore to keep it here." | F | no | KEEP | |
| L13 | `EmptyState.tsx:76-132` (6 exported variants) | "Your feed is being prepared", "We're constantly adding new stories, music, and films. Check back soon!", "Browse For You", "Save stories and music you want to revisit later." | F | yes ("feed", exclamation, "constantly adding") | REMOVE | Dead code: no importer of `LibraryEmptyInProgress`, `LibraryEmptySaved`, `LibraryEmptyCompleted`, `ForYouEmpty`, `ExploreEmpty`. Delete the five variants (keep the base `EmptyState`) so nobody wires the old copy back in. |

### 2.5 Story / player / reader

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| S1r | `strings.ts:262-263` | "Start reading" / "Unlock story" | F | no | KEEP `story.start`; CHANGE `story.unlock` to "Unlock to read" / "Débloquer pour lire" / "Desbloquear para leer" (says what you get; matches `ChapterIndexScreen.tsx:17` "Unlock the story to read"). |
| S2r | `FeaturedStoryPreview.tsx:228-229` | "Content note" / "This story includes: …" | F | no | KEEP | Good. Content warning list itself is hardship-only, see section 5. |
| S3r | `StoryChapterScreen.tsx:187-190` | toasts "Removed from Saved" / "Saved to your Library" | F | no | KEEP | |
| S4r | `StoryChapterScreen.tsx:204` | toast "Link copied" | F | no | KEEP | |
| S5r | `StoryChapterScreen.tsx:345` aria; `CommunityResponsesPanel.tsx:42` | "Community Responses" / "Community Voices" | F | mild | CHANGE | Title "Reflections" / FR "Réflexions" / ES "Reflexiones". Aria "Reflections". |
| S6r | `CommunityResponsesPanel.tsx:47` | "Reflections shared by other listeners" | F | no | KEEP | |
| S7r | `CommunityResponsesPanel.tsx:52` / `SubmitResponseModal.tsx:30` / `strings.ts:206` | "Share Your Reflection" | F | mild ("share") | CHANGE | "Add a reflection" / "Ajouter une réflexion" / "Añadir una reflexión". (Also fixes title case.) |
| S8r | `CommunityResponsesPanel.tsx:57` | "No reflections yet. Be the first to share." | F | mild | CHANGE | "No reflections yet. Add the first one." / "Aucune réflexion pour l'instant. Ajoutez la première." / "Aún no hay reflexiones. Añade la primera." |
| S9r | `CommunityResponsesPanel.tsx:62`; `SubmitResponseModal.tsx:60` | "…moderated to preserve the integrity of the narrative space." / "Respect the narrative space" | F | no, but abstract | CHANGE | "Every response is read by a moderator before it appears." / "Be kind to the story and the people in it." / FR "Chaque réponse est lue par une personne de la modération avant d'apparaître." / "Soyez bienveillant envers l'histoire et ses personnes." / ES "Cada respuesta la lee un moderador antes de publicarse." / "Sé amable con la historia y con quienes aparecen en ella." |
| S10r | `SubmitResponseModal.tsx:35` | "What did this chapter evoke for you? Share your thoughts, feelings, or interpretations..." | F | no | CHANGE | "What did this chapter bring up for you?" (matches `note.placeholder`). |
| S11r | `SubmitResponseModal.tsx:55` | "Share reflections, not reactions" | F | no (anti-social, good) | KEEP | |
| S12r | `BranchingChoiceOverlay.tsx:62-68,130` | "Your Choice Matters" / "Share Your Perspective" / "This choice will shape your journey" | C | mild | CHANGE | "Choose what happens next" / "This choice changes what you read next." |
| S13r | `strings.ts:204-209` | "You finished {title}", "Share a reflection", "More like this", "Keep reading" | C | no | KEEP | "Share a reflection" -> "Add a reflection" for consistency with S7r. |
| S14r | `mobile/src/screens/StoryDetailScreen.tsx:44` | "Enter Story" | F | no, ceremonial | CHANGE | "Start reading". |
| S15r | `archive/src/app/components/StoryWorldEntryScreen.tsx:205,219` | "Unlock Story" / "Enter Story" (ceremonial CTA) | F | no | KEEP in archive | Do not revive. |

### 2.6 Profile

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| P1r | `ProfileScreen.tsx:544` | "Your SEEN" | F | no | CHANGE | "Your things" is worse. "Your activity" / FR "Votre activité" / ES "Tu actividad". Also avoids using the brand as a noun slogan. |
| P2r | `ProfileScreen.tsx:546` | "Following" (count) | F | yes | CHANGE | "Creators" (count). |
| P3r | `ProfileScreen.tsx:196-197` | "Stories Completed" / "Minutes Listened" | F | no | CHANGE | Sentence case: "Stories finished" / "Minutes listened". |
| P4r | `ProfileScreen.tsx:365` | "Share Your Story" / "Have a story, sound, or vision to share? Create your first piece and join our community of storytellers." | C | yes (generic CTA, "join our community") | CHANGE | Title "Tell a story" / body "Got a story, a recipe, a song or a family memory worth keeping? Write or record your first piece." / FR "Une histoire, une recette, une chanson ou un souvenir de famille à garder ? Écrivez ou enregistrez votre première œuvre." / ES "¿Una historia, una receta, una canción o un recuerdo familiar que valga la pena guardar? Escribe o graba tu primera pieza." |
| P5r | `ProfileScreen.tsx:467` | section header "Community" (Your Contributions, Community Guidelines, About SEEN) | F | mild | CHANGE | "Help and guidelines" / "Aide et lignes directrices" / "Ayuda y normas". |
| P6r | `ProfileScreen.tsx:390-391` | "No activity yet" / "Start a story to see your progress here." | F | no | CHANGE | "Nothing here yet" / "Open a story and your reading shows up here." |
| P7r | `ProfileScreen.tsx:175` | "No bio yet." | F | no | KEEP | |
| P8r | `ProfileScreen.tsx:431-432` | "Intent: Create / Contribute / Explore" | F | no | KEEP, but hide: internal enum leaking into UI. |
| P9r | `strings.ts:133` | "SEEN does not show follower counts or like counts…" | F | anti-social, good | KEEP | Contradicts L4/P2r today; fixed once those become "Creators". |
| P10r | `strings.ts:137` | "From creators you follow." | F | no | KEEP | |
| P11r | `ProfilePreferencesScreen.tsx:27` | "…library and follows are stored on this device." | F | mild | CHANGE | "…library and the creators you follow…" (FR/ES at lines 43, 59 already use "abonnements"/"seguimientos"; make them "créateurs suivis"/"personas creadoras que sigues"). |

### 2.7 Creator

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| C1 | `CreatorProfileScreen.tsx:71` | button "Follow" / "Following"; toasts at `:40` "Following {name}" / "Unfollowed {name}" | F | yes, but this is the one place the verb earns its keep | KEEP (button) | See S1 in section 4. Optional P2: "Get updates" / "Getting updates". |
| C2 | `CreatorProfileScreen.tsx:76,84` | "Themes" / "Stories" + "{n} published" | F | no | KEEP | |
| C3 | `catalog.ts:38-41` (creator bio generator) | "A storyteller working across migration and diaspora and … 3 stories on SEEN." | E | no | CHANGE | Auto-bio reads like a template. "{n} stories on SEEN, mostly about {theme}." Or drop the generated bio and show nothing until a real one exists. |
| C4 | `CreatorsPanel.tsx:18` | "No creators yet" / "Creators appear here as soon as they publish their first story." | F | no | KEEP | |
| C5 | `creator-flow/StoryIntentStep.tsx:119` | "Cultural Grounding" | F | no, abstract | CHANGE | "About your story" / "À propos de votre histoire" / "Sobre tu historia". Step eyebrow "Story Intent" -> "The basics". |
| C6 | `StoryIntentStep.tsx:166` | "What is this story about? Who should experience it?" | F | mild | CHANGE | "What is this story about? Who is it for?" |
| C7 | `StoryIntentStep.tsx:33` | audiences: "Youth, Educators, Families, Community members, Researchers, General public" | F | mild | CHANGE | "Young people, Teachers, Families, Neighbours and friends, Researchers, Anyone" |
| C8 | `creator-flow/ContextAccessibilityStep.tsx:175` | "Protect Meaning & Access" | F | no, abstract | CHANGE | "Context and access" |
| C9 | `creator-flow/StoryStructureStep.tsx:140-141` | "Narrative Shape" / "How will your story unfold?" | F | no, abstract | CHANGE | "Story structure" / "How is your story told? You can change this later." |
| C10 | `creator-flow/PostPublishSuccess.tsx:27,115` | "…visible to all SEEN audiences." / "Share Story" | F | mild ("audiences") | CHANGE | "Your story is live and anyone on SEEN can read it." / "Copy link". Same for `PreviewPublishStep.tsx:37,338`. |
| C11 | `PostPublishSuccess.tsx:129`; `ProfileScreen.tsx:291-293` | "View Analytics" / "Manage your stories and view analytics" | F | yes (analytics-speak) | CHANGE | "See who's reading" only if real data exists; otherwise REMOVE the button (no dead buttons rule). |
| C12 | `CreatorMonetizationScreen.tsx:36,100` | tier default "Inner Circle"; "Fans subscribe monthly for exclusive access…" | F | yes ("fans", "exclusive", "inner circle") | CHANGE | Default tier name "Supporter"; body "Readers support you monthly and get your subscriber-only stories." |
| C13 | `PaywallModal.tsx:103-104` | "Premium Content" / "Subscriber Exclusive" | F | mild | CHANGE | "Paid story" / "For subscribers" (FR "Histoire payante" / "Pour les abonnés", ES "Historia de pago" / "Para suscriptores"). |

### 2.8 Funding

Funding is the best-written area (plain, cites funder, "The funder decides"). No change except two stray items.

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| U1 | `FundingScreen.tsx:47-49` | "Open now" / "Coming up" / "My tracker" | F | no | KEEP | |
| U2 | `OpportunityDetailScreen.tsx:215` | toast "Marked as applied — good luck!" | C | no | KEEP | Warm, short. |
| U3 | `OpportunityDetailScreen.tsx:193` | "SEEN doesn't receive funder decisions…" | F | no | KEEP | |
| U4 | `strings.ts:244` | "A checklist you tick yourself. It isn't a score…" | F | no | KEEP | |
| U5 | `fundingListings.ts:269` | "…a close fit for SEEN's audio-led stories." | E | no | KEEP | |

### 2.9 Notifications, errors, empty states (cross-cutting)

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| N1 | `catalog.ts:97-98` | "Welcome to SEEN" / "Save stories to your library and follow creators to hear when they publish." | C | mild | CHANGE | Title "Welcome to SEEN" KEEP. Body "Save stories to your library, and follow creators to get their new stories." |
| N2 | `catalog.ts:106-107` | "New story world" / "{title} by {creator} is now available." | C | mild ("story world") | CHANGE | "New story" / "{title} by {creator} is now on SEEN." |
| N3 | `NotificationsScreen.tsx:57` | "You're all caught up" / "New stories from creators you follow and funding deadlines will show up here." | F | no | KEEP | |
| N4 | `NotificationsScreen.tsx:35` | toast "All caught up" | F | no | KEEP | |
| N5 | `ResourceView.tsx:33,43,48-58` | "You're offline…", "Couldn't refresh…", "This is on our side, not yours." | F | no | KEEP | Clear, blame-free. |
| N6 | `CollectionsPanel.tsx:32` | "No collections here yet" / "Institutional collections will appear here once SEEN has confirmed partners." | F | no | KEEP | Correctly avoids naming partners. |
| N7 | `strings.ts:52` | "When someone writes to you, it appears here." | F | no | KEEP | |
| N8 | `strings.ts:235,237` | "Stories you publish appear here." / "Start a story and your progress is saved on this device." | F | no | KEEP | |
| N9 | `ErrorBoundary.tsx:22,24` | "Back to For You" / "Go back to For You to keep going." | F | yes (follows F1) | CHANGE | "Back to Home" / "Go back to Home to keep going." |
| N10 | `strings.ts:276-277` | "Be respectful and thoughtful." | F | no | KEEP | Short, not preachy. |
| N11 | `DemoModeNotice.tsx:17` + `strings.ts:9-15` | "Demo mode: data stays on this device…" | F | no | KEEP | |

### 2.10 Navigation and brand lines

| # | Location | Current text | Job | Social? | Verdict | Replacement |
|---|---|---|---|---|---|---|
| V1 | `strings.ts:264-267` | tabs "For You / Explore / Library / Profile" | F | "For You" yes | CHANGE (first tab only) | "Home / Explore / Library / Profile"; FR "Accueil / Explorer / Bibliothèque / Profil"; ES "Inicio / Explorar / Biblioteca / Perfil". |
| V2 | `NavigationBar.tsx:23-24` | "SEEN" / "by CREOVA" | E | no | KEEP | |
| V3 | `AboutScreen.tsx:19` | "SEEN is a cultural operating system for interactive storytelling. We blend music, film, fashion, and community voices into immersive experiences that center emotion over metrics, consent over extraction, and narrative depth over viral loops." | E | corporate-manifesto tone | CHANGE | "SEEN is a home for stories told in English, French and Spanish, by the people who lived them. Read them, listen to them, and support the people who make them." / FR "SEEN est un lieu pour des histoires racontées en français, en anglais et en espagnol, par celles et ceux qui les ont vécues. Lisez-les, écoutez-les et soutenez les personnes qui les créent." / ES "SEEN es un lugar para historias contadas en español, inglés y francés por quienes las vivieron. Léelas, escúchalas y apoya a quienes las crean." |
| V4 | `AboutScreen.tsx:33` (+ FR `:37`, `:241-243`) | "Stories are not content. Audiences are not users. Engagement is not a number." | E | anti-social, but slogan-y | KEEP | A good principle line; use once on About only. "engagement" is correct here: it is the thing being refused. |
| V5 | `AboutScreen.tsx:47` | "…for cultural workers who refuse to compromise narrative integrity for algorithmic favor." | E | corporate/activist | CHANGE | "CREOVA is the studio behind SEEN. We build tools so storytellers keep control of their work." |
| V6 | `AboutScreen.tsx:64` etc. | "We never sell user data, never surveil behavior, and never optimize for addiction." | F | no | KEEP | Concrete promise. |
| V7 | `mobile/src/screens/InvocationScreen.tsx:63` | tagline "Where stories live, where culture breathes" | E | no, poetic | CHANGE | "Stories from many voices, in your language." |

## 3. "You are now SEEN" locations and recommendation

### 3.1 Where it exists

| Where | File:line | Text | Reachable? |
|---|---|---|---|
| Archive onboarding, final screen | `archive/src/app/components/Onboarding.tsx:391` | "You are now SEEN." (h1, then an enter button) | No (archive, not built) |
| Archive onboarding, opening screen | `archive/src/app/components/Onboarding.tsx:111` | "You are entering SEEN" | No |
| Archive Spanish table | `archive/src/app/data/spanishTranslations.ts:26` | 'You are entering SEEN.' -> 'Estás entrando a VISTO.' | No |
| Expo app, first screen | `mobile/src/screens/InvocationScreen.tsx:65,74` | "You are entering SEEN." + a11y "Enter SEEN" | Yes (mobile build only) |
| Live web app | none | The phrase is gone from `src/`. The post-signup state is now `OnboardingSystem.tsx:166` "Opening SEEN…" and the first-visit panel `ForYouScreen.tsx:141` "Welcome. Your space is forming." | n/a |

So the phrase currently appears **zero times in the web app** and **once ("entering") in the Expo app**. The archive pairing (entering at the start, now SEEN at the end) shows the intended arc: that is the only reason to keep it.

### 3.2 Recommendation: exactly one place

**Use it once, at `ForYouScreen.tsx:141` (first-visit panel, shown only when `isFirstVisit`), replacing "Welcome. Your space is forming."**

Why this spot and not the others:

- It appears right after account creation, once, on the user's first real screen, so it lands as a deliberate moment rather than as wallpaper.
- It is not a loading screen or a form step, so it never delays or blocks a task (O13 `Opening SEEN…` stays a plain status for screen readers and slow networks).
- It sits above real content (the hero story), so the next action is visible beneath it.
- It is already conditional on `isFirstVisit` and animated, so no new state is needed.

Proposed treatment (two lines, second line is the utility):

| Lang | Line 1 (brand moment) | Line 2 (utility) |
|---|---|---|
| EN | "You are now SEEN." | "Start with the featured story, or find your theme in Explore." |
| FR | "Vous êtes maintenant SEEN." | "Commencez par l'histoire à la une, ou trouvez votre thème dans Explorer." |
| ES | "Ahora eres SEEN." | "Empieza con la historia destacada, o encuentra tu tema en Explorar." |

Notes: keep "SEEN" untranslated in FR/ES as a brand word (the archive's `VISTO` was inconsistent with the rest of the product). The wordplay does not translate, so FR/ES need a native review; the fallback is to drop line 1 in FR/ES and keep line 2. Put the strings in `strings.ts` as `welcome.brand` and `welcome.next`.

**Do not repeat it elsewhere.** Remove or replace: `mobile/.../InvocationScreen.tsx:65` ("entering"), and do not copy `archive/.../Onboarding.tsx:111,391` back. Do not use "SEEN" as a verb in buttons, toasts, notification titles or empty states ("Get seen", "Be seen"). `ProfileScreen.tsx:544` "Your SEEN" should also change (P1r) so the brand is not used as a noun slogan beside the one deliberate line.

### 3.3 Incidental "seen" in story text (leave alone)

`storyDatabase.ts:762` and `:1113` are story essays that use "seen" as theme ("The work is not just to be seen"). That is editorial content by the creator, not product copy. Also the story title "Seen / Unseen" (`storyDatabase.ts:632`). KEEP. Note only that if the one-time brand line ships, "Seen / Unseen" is a fine, intentional echo.

## 4. Social-media-style language found

| # | Term | Where (file:line) | Real data behind it? | Verdict |
|---|---|---|---|---|
| S1 | **Follow / Following** | Button: `CreatorProfileScreen.tsx:71`, toast `:40`; pill `LibraryPanels.tsx:68`; tab `LibraryScreen.tsx:191`; profile row `ProfileScreen.tsx:546`; empty `LibraryPanels.tsx:49-50`; `ForYouScreen.tsx:315`; `ForYouSections.tsx:89`; `OnboardingOrientation.tsx:20`; `catalog.ts:98`; `NotificationsScreen.tsx:57`; `strings.ts:137` | Yes, `api.creators.setFollowing` (local storage) | Keep **one** verb on the creator profile button (functional, announced to AT, covered by tests `screens.test.tsx:70-72`, `figma-components.test.tsx:155`). Change the **nouns**: tab and profile row become "Creators"; stat label becomes "Creators". No follower counts exist and none should be added. |
| S2 | **Followers** | none in UI. `ProfileScreen.tsx:114` comment confirms no follow graph; `strings.ts:133` says no follower counts | n/a | KEEP that stance. |
| S3 | **For You** | `strings.ts:264`; `ForYouScreen.tsx:155`; `ExploreScreen.tsx:92`; `ErrorBoundary.tsx:22,24`; `OnboardingOrientation.tsx:100`; dead `EmptyState.tsx:94,130`; `mobile/src/components/TabBar.tsx:14`, `HomeScreen.tsx:21` | The feed is catalogue order filtered by language/interests, not a personalised algorithm | CHANGE to "Home" (F1, V1). Honest label for what it does. |
| S4 | **Trending / Popular** | `ForYouScreen.tsx:236-237,239,70`; `trending` flag in `storyDatabase.ts:143,503,955,1306` and `data/types.ts:51` | No: hand-set boolean, no usage data | CHANGE (F12). Claiming "Trending" or "Popular on SEEN" without data breaks the demo-honesty rule. |
| S5 | **Feed** | `OnboardingOrientation.tsx:100`; dead `EmptyState.tsx:116`; internal names `getForYouFeed` | n/a | CHANGE copy; internal identifiers can stay. |
| S6 | **Share / Share Story** | `PostPublishSuccess.tsx:115`; `StoryChapterScreen.tsx:319` (aria "Share"); `FeaturedStoryPreview.tsx:137`; `strings.ts:206` | Share = native share sheet / copy link | KEEP aria "Share" (platform term). CHANGE button text to "Copy link". |
| S7 | **Like / like counts** | none in UI; only `strings.ts:133` negation and `done.related` "More like this" | n/a | KEEP. "More like this" is editorial, not a like. |
| S8 | **Viral** | `AboutScreen.tsx:19,23,27` ("viral loops") | n/a | KEEP, it is a refusal. Shorter manifesto proposed in V3. |
| S9 | **Presence** | `ForYouScreen.tsx:157,161-162,307`; `LibraryScreen.tsx:91` (comments) | n/a | REMOVE user-visible instance (F2), rename component and comments (F4). |
| S10 | **Engagement** | `AboutScreen.tsx:33,241` only | n/a | KEEP (as the thing being refused). |
| S11 | **Frequency** | no user-visible copy in live or mobile. `archive/` data only (`ambientAudioCatalog.ts`, `ChapterInsightsPanel.tsx:13,75`) | n/a | None to change. Keep archive out of the build. |
| S12 | **Experience as CTA / experiencing** | `ForYouSections.tsx:47-48`; `ForYouScreen.tsx:165,167-168`; `CreatorProfile` none; `StoryIntentStep.tsx:166` ("Who should experience it?") | n/a | CHANGE (F7, F9, C6). |
| S13 | **Enter / Enter Story** | `mobile/.../StoryDetailScreen.tsx:44`; `archive/...StoryWorldEntryScreen.tsx:191,205,219`; internal `handleEnterStory`, `onEnterStory` | n/a | CHANGE mobile (S14r); internal identifiers can stay. |
| S14 | **Join the conversation** | none anywhere | n/a | Nothing to change. Closest cousins: "join our community of storytellers" (`ProfileScreen.tsx:365`, P4r) and "Community Voices" (S5r). |
| S15 | **Community** (filler uses) | `OnboardingOrientation.tsx:69`; `ProfileScreen.tsx:365,467`; `CommunityResponsesPanel.tsx:42`; `PostPublishSuccess.tsx:170`; `StoryIntentStep.tsx:29,33`; `catalog.ts` none; `mobile/.../OnboardingScreen` ROLES | n/a | CHANGE as listed. KEEP functional "community guidelines" (`strings.ts:275,286`, `PreviewPublishStep.tsx:303-305`) but consider "house rules" / "guidelines" only. |
| S16 | **Growth-speak** | "Build an audience" `OnboardingOrientation.tsx:19`; "Reach people who care"; "View Analytics" `PostPublishSuccess.tsx:129`; "Fans", "Inner Circle" `CreatorMonetizationScreen.tsx:36,100` | n/a | CHANGE (O6, C11, C12). |

## 4a. Generic corporate / diversity-campaign, trauma-only and preachy tone

| # | Location | Text | Issue | Proposal |
|---|---|---|---|---|
| T1 | `AboutScreen.tsx:19` | "cultural operating system… immersive experiences… consent over extraction" | Manifesto jargon, reads as pitch deck | V3 |
| T2 | `AboutScreen.tsx:47` | "cultural workers who refuse to compromise narrative integrity for algorithmic favor" | Activist/corporate | V5 |
| T3 | `ExploreScreen.tsx:120` | "Discover cultural stories" | "Cultural" as a catch-all label | X1 |
| T4 | `ProfileScreen.tsx:365` | "join our community of storytellers" | Generic platform CTA | P4r |
| T5 | `CommunityResponsesPanel.tsx:62`, `SubmitResponseModal.tsx:60` | "integrity of the narrative space" | Abstract and a little preachy | S9r |
| T6 | `ContextAccessibilityStep.tsx:43-49` | Content-warning options are only: Violence, Racism or discrimination, Grief or loss, Strong language, Difficult historical events | Frames every story as potentially harmful; no "Sexual content", "Substance use", "Flashing images/loud audio" (practical ones) | Add: "Sexual content", "Substance use", "Loud or sudden audio", "Flashing visuals". Keep existing. Functional, not tonal. |
| T7 | `storyDatabase.ts` (all 12 descriptions, e.g. :294, :487, :637, :783, :938, :1134, :1289, :1494, :1523, :1552, :1581) | "documenting the journeys…", "meditations on visibility and erasure", "intergenerational trauma, inherited pain", "systems that undervalue us" | 11 of 12 are hardship/justice frames. "Small Histories" (:1552) and "Midnight Resonance" (:125) are the only ordinary-life or pleasure entries | See section 5. |
| T8 | `generateMissingChapters.ts` and `storyDatabase.ts:762,1113` | essays ("Visibility without power is surveillance…") | Editorial voice of the stories, fine as story content; flag only so it is never lifted into UI copy | KEEP. |

## 5. Topic and category vocabulary gaps

**Evidence.** The 12 public stories tag themselves with these `culturalThemes` (frequency across the catalogue): Migration & Diaspora (6), Identity & Belonging (6), Family & Separation (4), Urban Culture (2), Place & Memory (2), Heritage & Memory (2), Community Stories (2), then single uses of Visibility & Representation, Social Justice, Preservation & Loss, Music & Sound, Language & Power, Language & Identity, Labor & Economics, Justice & Rights, Indigenous Knowledge, Healing & Resilience, Documentary & Film, Black Canadian Experience. `data/interests.ts:7-12` builds the onboarding chips from this list (top 10, most common first), so a first-time user's first screen after choosing a purpose is **Migration & Diaspora, Identity & Belonging, Family & Separation, Urban Culture, Place & Memory, Heritage & Memory, Community Stories, Visibility & Representation, Social Justice, Preservation & Loss**. The creator tag list (`StoryIntentStep.tsx:21-30`) is similarly heavy: Indigenous Knowledge, Migration & Diaspora, Language & Identity, Urban Culture, Heritage & Memory, Music & Sound, Visual Arts, Documentary & Film, Community Stories, Environmental. Explore categories (`storyService.ts:109-129`): Featured, Music & Sound, Migration Stories, Indigenous Voices, Documentary.

**Absent anywhere (themes, categories, empty states, copy):** joy, celebration, memory-as-pleasure, food and cooking, music as party/everyday listening, family as warmth (only "Family & Separation"), humour, ordinary life, neighbourhood and daily routines, sport, fashion/style, faith and ritual as comfort, love and friendship, achievement and craft mastery, elders' wisdom as pleasure, travel as delight.

**Proposed additions** (data change in `storyDatabase.ts` tags where a real story fits; chip/category changes are copy only and safe to add now, empty ones are auto-hidden by `getExploreCategories` and by `availableInterests` which only lists tags that exist):

| Add to | Label (EN / FR / ES) | Why |
|---|---|---|
| Creator themes `StoryIntentStep.tsx:21-30` | "Food & Home" / "Cuisine et foyer" / "Comida y hogar" | Food and family warmth |
| | "Joy & Celebration" / "Joie et fêtes" / "Alegría y celebración" | Positive register |
| | "Humour" / "Humour" / "Humor" | Missing entirely |
| | "Everyday Life" / "Vie quotidienne" / "Vida cotidiana" | Ordinary life; fits "Small Histories" |
| | "Craft & Achievement" / "Savoir-faire et réussites" / "Oficio y logros" | Achievement |
| | "Family & Elders" / "Famille et aînés" / "Familia y mayores" | Family as warmth, not only separation |
| | "Faith & Ritual" / "Foi et rituels" / "Fe y rituales" | Daily practice |
| | "Sport & Play" / "Sport et jeu" / "Deporte y juego" | Everyday joy |
| Explore categories `storyService.ts:109-129` | "Everyday Life", "Food & Family", "Made with Joy" (only when stories carry these tags) | Counterweight to Migration / Indigenous / Documentary rows |
| Content warnings `ContextAccessibilityStep.tsx:43-49` | see T6 | Practical, not tonal |
| Onboarding purpose `OnboardingOrientation.tsx:17` | "Learn something" hint "History, culture, food and craft" | O4 |
| Empty states, search hint `strings.ts:173` | "Start typing, or pick a theme." -> "Start typing, or try a theme like music, food or family." | Surfaces joy topics at the point of choice |
| Welcome / About | Mention "stories, recipes, songs and memories" once (P4r) | Sets the range for creators |

**Content gap, not just copy:** with 12 stories, relabeling alone will not change the feel. Flag for editorial: commission or tag at least 2-3 stories in food, music-as-celebration, humour or everyday achievement so the new chips are not empty. Until then, do not add empty themes to `availableInterests()` (it already hides tags with no stories).

## 6. Prioritised change list

Conventions: P0 = clear win, safe, small, no test or data impact beyond string text. P1 = clear win but touches tests, i18n move or several files. P2 = nice-to-have, content or product decision needed. "->" shows old -> new. FR/ES go in `strings.ts` when the string is moved there (new key shown); hardcoded EN files get EN-only edits in P0 so nothing breaks, with the i18n move in P1-9.

### P0 (apply mechanically)

| ID | File:line | Old text | New text |
|---|---|---|---|
| P0-1 | `src/app/components/ForYouScreen.tsx:156-158` | `Your presence, unfolding in real time.` | delete the whole `<p>` (lines 156-158); keep the `PageTitle` |
| P0-2 | `src/app/components/ForYouScreen.tsx:141` | `Welcome. Your space is forming.` | `You are now SEEN.` and add a second `<p className="text-sm text-white/70 mt-2">Start with the featured story, or find your theme in Explore.</p>` (the single brand moment, see section 3) |
| P0-3 | `src/app/components/ForYouScreen.tsx:314` | `"Story in motion" : "Stories in motion"` | `"Story" : "Stories"` |
| P0-4 | `src/app/components/ForYouScreen.tsx:315` | `Creators to follow` | `Creators` |
| P0-5 | `src/app/components/ForYouSections.tsx:89` | `subtitle="Creators to follow"` | `subtitle="Creators on SEEN"` |
| P0-6 | `src/app/components/ForYouScreen.tsx:296-299` | `Content personalized for {userIntent === ...}` | delete the whole block (comment at :291, `motion.div` :292-299) |
| P0-7 | `src/app/components/ForYouScreen.tsx:236-237` | `title="Trending Now"` / `subtitle="Popular on SEEN"` | `title="Worth your time"` / `subtitle="Our current favourites"`; remove `icon={<TrendingUp .../>}` at :239 |
| P0-8 | `src/app/components/ForYouScreen.tsx:205` | `Hand-picked for you` | `Picked by the SEEN team` |
| P0-9 | `src/app/components/ForYouScreen.tsx:267-268` | `title="New Releases"` / `subtitle="Fresh content"` | `title="New"` / `subtitle="Just added"` |
| P0-10 | `src/app/components/ForYouScreen.tsx:167-168` | `Continue experiencing` / `Pick up where you paused` (also aria-label at :167) | `Keep reading` / `Pick up where you left off` |
| P0-11 | `src/app/components/ForYouSections.tsx:47-48` | aria `Experience ${item.title}` / label `Experience` | aria `Open ${item.title}` / label `Start reading` |
| P0-12 | `src/app/components/LibraryScreen.tsx:155` | `'Journey' : 'Journeys'} complete` | `'Story' : 'Stories'} finished` |
| P0-13 | `src/app/components/LibraryScreen.tsx:191` | `Following` | `Creators` |
| P0-14 | `src/app/components/ProfileScreen.tsx:546` | `label="Following"` | `label="Creators"` |
| P0-15 | `src/app/components/ProfileScreen.tsx:544` | `Your SEEN` | `Your activity` |
| P0-16 | `src/app/components/ProfileScreen.tsx:365` | `Have a story, sound, or vision to share? Create your first piece and join our community of storytellers.` | `Got a story, a recipe, a song or a family memory worth keeping? Write or record your first piece.` |
| P0-17 | `src/app/components/ProfileScreen.tsx:363` | `Share Your Story` | `Tell a story` |
| P0-18 | `src/app/components/ProfileScreen.tsx:467` | `Community` | `Help and guidelines` |
| P0-19 | `src/app/components/OnboardingOrientation.tsx:69` | `Stories from communities, in your language.` | `Stories from many voices, in your language.` |
| P0-20 | `src/app/components/OnboardingOrientation.tsx:100` | `We use this to start your For You feed.` | `We use this to pick what you see first.` |
| P0-21 | `src/app/components/OnboardingOrientation.tsx:99` | `What are you interested in?` | `What do you like to read, hear and watch?` |
| P0-22 | `src/app/components/OnboardingOrientation.tsx:19-20` | `"Build an audience", hint "Reach people who care"` / `"Connect with creators", hint "Follow and support voices"` | `"Find readers and listeners", hint "Get your work in front of people who will enjoy it"` / `"Back the creators you love", hint "Get their new stories and support their work"` |
| P0-23 | `src/app/components/ExploreScreen.tsx:120` | `Discover cultural stories and creators` | `Stories, creators and collections, by theme and language` |
| P0-24 | `src/app/components/LibraryScreen.tsx:88` | `Your saved and in-progress content` | `Stories you've saved or started` |
| P0-25 | `src/app/components/LibraryScreen.tsx:279-281` | `No stories in progress` / `Start exploring to see your in-progress content here.` | `Nothing in progress` / `Open a story and it will wait for you here.` |
| P0-26 | `src/app/components/LibraryScreen.tsx:318-320` | `No completed content` / `Content you finish will appear here.` / `Start Exploring` | `Nothing finished yet` / `Stories you finish are kept here.` / `Find a story` |
| P0-27 | `src/app/components/LibraryScreen.tsx:233,281` | `Explore Stories` | `Explore stories` |
| P0-28 | `src/app/components/LibraryPanels.tsx:49-50` | `You're not following anyone yet` / `Follow creators to hear when they publish.` | `No creators yet` / `Follow a creator to get their new stories.` |
| P0-29 | `src/app/components/EmptyState.tsx:76-132` | five unused variants (`LibraryEmptyInProgress` … `ExploreEmpty`) | delete lines 76-132; keep base `EmptyState` (no importers, verified) |
| P0-30 | `src/app/services/demo/catalog.ts:98` | `Save stories to your library and follow creators to hear when they publish.` | `Save stories to your library, and follow creators to get their new stories.` |
| P0-31 | `src/app/services/demo/catalog.ts:106-107` | `title: "New story world"` / `is now available.` | `title: "New story"` / `is now on SEEN.` |
| P0-32 | `src/app/components/CommunityResponsesPanel.tsx:42,57` | `Community Voices` / `No reflections yet. Be the first to share.` | `Reflections` / `No reflections yet. Add the first one.` (FR `Réflexions` / `Aucune réflexion pour l'instant. Ajoutez la première.`; ES `Reflexiones` / `Aún no hay reflexiones. Añade la primera.` at the matching `fr:`/`es:` lines 43-44, 58-59) |
| P0-33 | `src/app/components/CommunityResponsesPanel.tsx:52` and `SubmitResponseModal.tsx:30` | `Share Your Reflection` (FR `Partagez Votre Réflexion`, ES `Comparte Tu Reflexión`) | `Add a reflection` / `Ajouter une réflexion` / `Añadir una reflexión` |
| P0-34 | `src/app/i18n/strings.ts:206` | `en: "Share a reflection", fr: "Partager une réflexion", es: "Compartir una reflexión"` | `en: "Add a reflection", fr: "Ajouter une réflexion", es: "Añadir una reflexión"` |
| P0-35 | `src/app/i18n/strings.ts:263` | `Unlock story` / `Débloquer l'histoire` / `Desbloquear historia` | `Unlock to read` / `Débloquer pour lire` / `Desbloquear para leer` (check `e2e` and tests for the old label first; grep found none in `e2e/`) |
| P0-36 | `src/app/components/ProfileScreen.tsx:196-197` | `Stories Completed` / `Minutes Listened` | `Stories finished` / `Minutes listened` |
| P0-37 | `src/app/components/ErrorBoundary.tsx:22,24` | `Back to For You` / `Go back to For You to keep going.` | `Back to Home` / `Go back to Home to keep going.` (do together with P1-1; update `errorBoundary.test.tsx` expectation) |
| P0-38 | `mobile/src/screens/InvocationScreen.tsx:65` | `You are entering SEEN.` | `Stories from many voices, in your language.` (or delete line) |
| P0-39 | `mobile/src/screens/HomeScreen.tsx:22` | `Your presence, unfolding in real time.` | delete the subtitle |
| P0-40 | `mobile/src/screens/StoryDetailScreen.tsx:44` | `Enter Story` | `Start reading` |
| P0-41 | `mobile/src/screens/OnboardingScreen.tsx:32` | `How will you move through this space?` | `What would you like to do?` |

Note on P0-37: the label is shared by tests, so it is P0 only if done with P1-1. If doing P0 alone, skip P0-37.

### P1 (touches tests, i18n, or several files)

| ID | File:line | Change |
|---|---|---|
| P1-1 | `src/app/i18n/strings.ts:264`; `ForYouScreen.tsx:155`; `ExploreScreen.tsx:92`; `ErrorBoundary.tsx:22,24` | "For You" -> "Home" (FR "Accueil", ES "Inicio"). Keep route id. Update tests/e2e: `src/app/__tests__/errorBoundary.test.tsx`, `e2e/for-you-alignment.spec.ts`, `e2e/core-journeys.spec.ts`, `e2e/audit/manual-a11y.spec.ts` (12 "For You" matches in total), and `docs/product/MASTER_FEATURE_MATRIX.md` / screen matrix text if it names the label. |
| P1-2 | `ForYouScreen.tsx`, `LibraryScreen.tsx`, `LibraryPanels.tsx`, `ProfileScreen.tsx`, `OnboardingOrientation.tsx`, `ExploreScreen.tsx` | Move every changed string above into `strings.ts` with EN/FR/ES (CLAUDE.md rule). Suggested keys: `home.welcome.brand`, `home.welcome.next`, `home.keepReading`, `home.favourites`, `lib.creators`, `profile.tellStory`, `onboarding.interests.title`. |
| P1-3 | `src/app/components/ForYouScreen.tsx:162,307-325` + comments `:161`, `LibraryScreen.tsx:91` | Rename `PresenceIndicators` -> `HomeShortcuts`; drop "Presence" comments. No behaviour change. |
| P1-4 | `src/app/components/ForYouScreen.tsx:70-71,236-250` | Stop labelling the hand-set `trending` flag as popularity. Either drop the section or rename the data flag to `editorsPick` in `data/types.ts:51`, `storyDatabase.ts:143,503,955,1306`, `storyService.ts:51`, `searchService.ts:111,160`. |
| P1-5 | `src/app/components/ForYouScreen.tsx:119-135` and `ExploreScreen.tsx:79-81` | Empty states: "Nothing here yet" / "New stories are added often. Try Explore in the meantime." (FR "Rien ici pour l'instant" / "De nouvelles histoires arrivent souvent. Essayez Explorer en attendant."; ES "Aún no hay nada aquí" / "Se añaden historias con frecuencia. Prueba Explorar mientras tanto."). |
| P1-6 | `src/app/components/ProfileScreen.tsx:291-293`; `creator-flow/PostPublishSuccess.tsx:129` | Remove "View Analytics" / "view analytics" unless wired to real data (no-dead-buttons rule). Check `e2e` before removing. |
| P1-7 | `creator-flow/PostPublishSuccess.tsx:27,115`; `PreviewPublishStep.tsx:37,338` | "…visible to all SEEN audiences" -> "…anyone on SEEN can read it"; "Share Story" -> "Copy link". |
| P1-8 | `CreatorMonetizationScreen.tsx:36,100-102`; `PaywallModal.tsx:103-104` | Tier default "Supporter"; "Fans subscribe…" -> "Readers support you monthly and get your subscriber-only stories."; "Premium Content"/"Subscriber Exclusive" -> "Paid story"/"For subscribers" (FR/ES in V-table). |
| P1-9 | `creator-flow/StoryIntentStep.tsx:119,166,33`; `ContextAccessibilityStep.tsx:175`; `StoryStructureStep.tsx:140-141` | C5-C9 headings and audience list. |
| P1-10 | `AboutScreen.tsx:19-27,47-55` | V3 and V5 manifesto rewrites in EN/FR/ES (also fixes an ES typo "métrics" -> "métricas" at the ES body, line 27). |
| P1-11 | `BranchingChoiceOverlay.tsx:62-68,130-133` | "Your Choice Matters" / "Share Your Perspective" / "This choice will shape your journey" -> "Choose what happens next" / (drop second line) / "This choice changes what you read next." (FR "Choisissez la suite" / "Ce choix change ce que vous lirez ensuite."; ES "Elige qué pasa después" / "Esta elección cambia lo que leerás después."). |
| P1-12 | `catalog.ts:38-41` | Replace generated bio with "{n} stories on SEEN, mostly about {theme}." or render nothing until a real bio exists. |
| P1-13 | `ProfilePreferencesScreen.tsx:27,43,59` | "follows" -> "the creators you follow" (FR "créateurs suivis", ES "personas creadoras que sigues"). |
| P1-14 | `mobile/src/screens/OnboardingScreen.tsx` ROLES | Remove self-selected "Moderator / I shape communities". |

### P2 (needs a product or editorial decision)

| ID | Where | Proposal |
|---|---|---|
| P2-1 | `CreatorProfileScreen.tsx:71`; `LibraryPanels.tsx:68`; `strings.ts:137` | Replace the "Follow / Following" verb with "Get updates / Getting updates" if the team wants the social verb gone entirely (touches `screens.test.tsx:70-72`, `figma-components.test.tsx:155`, aria labels). Recommendation: keep "Follow" unless research says users misread it. |
| P2-2 | `StoryIntentStep.tsx:21-30`; `storyService.ts:109-129`; `ContextAccessibilityStep.tsx:43-49` | Add the vocabulary in section 5 and the practical content-warning options (T6). |
| P2-3 | `storyDatabase.ts` | Editorial: add or tag 2-3 stories for food, music-as-celebration, humour, everyday achievement so new chips are not empty. Rewrite catalogue blurbs to lead with the story, not the issue (e.g. :294 "documenting the journeys of five families" -> "Five families tell how they built a life in Canada, in their own words."). |
| P2-4 | `strings.ts:171,173` | Hint "Start typing, or try a theme like music, food or family." once those themes exist. |
| P2-5 | `OnboardingSystem.tsx:42` / `LanguageSelectionScreen.tsx` | Remove duplicate string; localise "Choose your language" in all three languages together (shown before language is known). |
| P2-6 | `archive/` | Add a one-line `archive/README` note: "Do not copy copy from here. Contains retired brand lines ('You are entering SEEN', 'Enter Story')." No source edit needed for audit. |
| P2-7 | `mobile/` | Decide whether the Expo app still ships. If yes, apply O14-O18, F2, S14r, V7 in the same pass so the two clients do not diverge. If no, mark it archived in `docs/operations/REPOSITORY_MAP.md`. |
