import { motion } from "motion/react";
import { ArrowLeft, GraduationCap, Users, Play } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface CollectionStory {
  id: string;
  title: string;
  creatorName: string;
  creatorRole: string;
  thumbnailUrl: string;
  duration: string;
  language: string;
  category: string;
}

interface InstitutionalCollectionScreenProps {
  onClose: () => void;
  institutionName: string;
  institutionLogo?: string;
  description: {
    en: string;
    fr: string;
    es: string;
  };
  curatorNote: {
    en: string;
    fr: string;
    es: string;
  };
  stories: CollectionStory[];
  onStoryClick: (storyId: string) => void;
}

export function InstitutionalCollectionScreen({
  onClose,
  institutionName,
  institutionLogo,
  description,
  curatorNote,
  stories,
  onStoryClick
}: InstitutionalCollectionScreenProps) {
  const { state } = useStoryState();

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto">
        {/* Hero section */}
        <div className="relative h-[40vh] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1680444873773-7c106c23ac52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYXJjaGl0ZWN0dXJlJTIwbW9kZXJufGVufDF8fHx8MTc3MDEzOTc2MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt={institutionName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
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

          {/* Institution header */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {institutionLogo ? (
                  <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
                    <img src={institutionLogo} alt={institutionName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white/70" />
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-xs tracking-[0.3em] uppercase text-white/40 block mb-1">
                    {state.language === 'en' ? 'Curated Collection' : state.language === 'fr' ? 'Collection Curée' : 'Colección Curada'}
                  </span>
                  <h1 className="text-xl tracking-tight text-white">
                    {institutionName}
                  </h1>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-base text-white/80 leading-relaxed">
              {getText(description)}
            </p>
          </motion.div>

          {/* Curator note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-5 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-white/40" />
              <span className="text-xs tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Curator\'s Note' : state.language === 'fr' ? 'Note du Curateur' : 'Nota del Curador'}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed italic">
              "{getText(curatorNote)}"
            </p>
          </motion.div>

          {/* Stories grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Featured Stories' : state.language === 'fr' ? 'Histoires en Vedette' : 'Historias Destacadas'}
              </h2>
              <span className="text-xs text-white/30">
                {stories.length} {state.language === 'en' ? 'stories' : state.language === 'fr' ? 'histoires' : 'historias'}
              </span>
            </div>

            <div className="space-y-4">
              {stories.map((story, index) => (
                <motion.button
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStoryClick(story.id)}
                  className="w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={story.thumbnailUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm">
                        <span className="text-xs text-white">
                          {story.duration}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/60">
                          {story.category}
                        </span>
                        <span className="text-xs text-white/30 uppercase">
                          {story.language}
                        </span>
                      </div>
                      <h3 className="text-base text-white line-clamp-2">
                        {story.title}
                      </h3>
                      <div className="space-y-0.5">
                        <p className="text-sm text-white/70">
                          {story.creatorName}
                        </p>
                        <p className="text-xs text-white/40">
                          {story.creatorRole}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Partnership note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-8 border-t border-white/5"
          >
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-blue-300" />
                <span className="text-xs tracking-wider uppercase text-blue-200">
                  {state.language === 'en' ? 'Partnership' : state.language === 'fr' ? 'Partenariat' : 'Asociación'}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                {state.language === 'en' 
                  ? 'This collection is curated in partnership with educational and cultural institutions. All stories are created by students, faculty, and community members with shared governance and consent.'
                  : state.language === 'fr'
                  ? 'Cette collection est organisée en partenariat avec des institutions éducatives et culturelles. Toutes les histoires sont créées par des étudiants, des professeurs et des membres de la communauté avec une gouvernance partagée et un consentement.'
                  : 'Esta colección está curada en asociación con instituciones educativas y culturales. Todas las historias son creadas por estudiantes, profesores y miembros de la comunidad con gobernanza compartida y consentimiento.'
                }
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
