import { motion } from "motion/react";
import { ArrowLeft, GraduationCap, Users, MapPin, Play, ExternalLink, Globe } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface FeaturedStory {
  id: string;
  title: string;
  creatorName: string;
  creatorRole: string;
  thumbnailUrl: string;
  duration: string;
  language: string;
}

interface BrockCollaborationScreenProps {
  onClose: () => void;
  onStoryClick: (storyId: string) => void;
  onViewAllStories: () => void;
  featuredStories: FeaturedStory[];
}

export function BrockCollaborationScreen({
  onClose,
  onStoryClick,
  onViewAllStories,
  featuredStories
}: BrockCollaborationScreenProps) {
  const { state } = useStoryState();

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      partnership: {
        en: "Partnership",
        fr: "Partenariat",
        es: "Asociación"
      },
      about: {
        en: "About This Collaboration",
        fr: "À Propos de Cette Collaboration",
        es: "Acerca de Esta Colaboración"
      },
      featuredStories: {
        en: "Featured Stories",
        fr: "Histoires en Vedette",
        es: "Historias Destacadas"
      },
      viewAll: {
        en: "View All Stories",
        fr: "Voir Toutes les Histoires",
        es: "Ver Todas las Historias"
      },
      mission: {
        en: "Brock University and SEEN collaborate to amplify student and faculty voices through interactive cultural storytelling. This partnership centers community consent, shared governance, and multilingual accessibility.",
        fr: "L'Université Brock et SEEN collaborent pour amplifier les voix des étudiants et du corps professoral grâce à la narration culturelle interactive. Ce partenariat privilégie le consentement communautaire, la gouvernance partagée et l'accessibilité multilingue.",
        es: "La Universidad Brock y SEEN colaboran para amplificar las voces de estudiantes y profesores a través de la narración cultural interactiva. Esta asociación se centra en el consentimiento comunitario, la gobernanza compartida y la accesibilidad multilingüe."
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto">
        {/* Hero section - Co-branded */}
        <div className="relative h-[45vh] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1680444873773-7c106c23ac52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYXJjaGl0ZWN0dXJlJTIwbW9kZXJufGVufDF8fHx8MTc3MDEzOTc2MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Brock University"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
          </motion.div>

          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center justify-between p-5 pt-8">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Co-branded logos */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Partnership badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-xs tracking-[0.3em] uppercase text-white/70">
                  {getText("partnership")}
                </span>
              </div>

              {/* Logos */}
              <div className="flex items-center gap-4">
                {/* Brock logo placeholder */}
                <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white/80" />
                </div>

                {/* Plus connector */}
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-white/40 text-sm">+</span>
                </div>

                {/* SEEN logo placeholder */}
                <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <span className="text-white/90 text-xs font-medium tracking-wider">SEEN</span>
                </div>
              </div>

              {/* Institution name */}
              <div>
                <h1 className="text-2xl tracking-tight text-white mb-1">
                  Brock University
                </h1>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span>St. Catharines, ON</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Mission statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-sm tracking-wider uppercase text-white/40">
              {getText("about")}
            </h2>
            <p className="text-base text-white/80 leading-relaxed">
              {getText("mission")}
            </p>
          </motion.div>

          {/* Key principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Users className="w-6 h-6 text-blue-300 mx-auto mb-2" />
              <span className="text-xs text-white/70 block">
                {state.language === 'en' ? 'Community' : state.language === 'fr' ? 'Communauté' : 'Comunidad'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Globe className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <span className="text-xs text-white/70 block">
                {state.language === 'en' ? 'Multilingual' : state.language === 'fr' ? 'Multilingue' : 'Multilingüe'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <GraduationCap className="w-6 h-6 text-green-300 mx-auto mb-2" />
              <span className="text-xs text-white/70 block">
                {state.language === 'en' ? 'Academic' : state.language === 'fr' ? 'Académique' : 'Académico'}
              </span>
            </div>
          </motion.div>

          {/* Featured stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm tracking-wider uppercase text-white/40">
                {getText("featuredStories")}
              </h2>
              <span className="text-xs text-white/30">
                {featuredStories.length}
              </span>
            </div>

            <div className="space-y-3">
              {featuredStories.slice(0, 3).map((story, index) => (
                <motion.button
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStoryClick(story.id)}
                  className="w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={story.thumbnailUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-3 h-3 text-black fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-white line-clamp-1 mb-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-white/60 mb-2">
                        {story.creatorName}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/50">
                          {story.creatorRole}
                        </span>
                        <span className="text-xs text-white/30 uppercase">
                          {story.language}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* View all button */}
            <button
              onClick={onViewAllStories}
              className="w-full py-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              {getText("viewAll")}
              <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Governance note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8 border-t border-white/5"
          >
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-sm text-blue-200 mb-2">
                    {state.language === 'en' 
                      ? 'Shared Governance'
                      : state.language === 'fr'
                      ? 'Gouvernance Partagée'
                      : 'Gobernanza Compartida'
                    }
                  </h3>
                  <p className="text-xs text-blue-100/70 leading-relaxed">
                    {state.language === 'en' 
                      ? 'All stories are created with informed consent. Contributors maintain ownership and control over their narratives. This partnership is built on mutual respect and cultural reciprocity.'
                      : state.language === 'fr'
                      ? 'Toutes les histoires sont créées avec un consentement éclairé. Les contributeurs conservent la propriété et le contrôle de leurs récits. Ce partenariat repose sur le respect mutuel et la réciprocité culturelle.'
                      : 'Todas las historias se crean con consentimiento informado. Los contribuyentes mantienen la propiedad y el control sobre sus narrativas. Esta asociación se basa en el respeto mutuo y la reciprocidad cultural.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact/Learn more */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <p className="text-xs text-white/40 mb-3">
              {state.language === 'en' 
                ? 'Interested in partnering with SEEN?'
                : state.language === 'fr'
                ? 'Intéressé par un partenariat avec SEEN ?'
                : '¿Interesado en asociarse con SEEN?'
              }
            </p>
            <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors">
              {state.language === 'en' ? 'Learn More' : state.language === 'fr' ? 'En Savoir Plus' : 'Saber Más'}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}