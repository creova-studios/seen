import { motion } from "motion/react";
import { ArrowLeft, Play, Calendar, MapPin, Headphones } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface AudioReflection {
  author: string;
  title: {
    en: string;
    fr: string;
    es: string;
  };
  audioSrc?: string;
  duration: string;
}

interface TrackContextScreenProps {
  trackTitle: string;
  artistName: string;
  albumName?: string;
  releaseDate?: string;
  recordingLocation?: string;
  coverImageUrl: string;
  culturalContext: {
    en: string;
    fr: string;
    es: string;
  };
  emotionalContext: {
    en: string;
    fr: string;
    es: string;
  };
  historicalContext?: {
    en: string;
    fr: string;
    es: string;
  };
  audioReflections?: AudioReflection[];
  contextImages?: string[];
  onClose: () => void;
  onPlayTrack?: () => void;
}

export function TrackContextScreen({
  trackTitle,
  artistName,
  albumName,
  releaseDate,
  recordingLocation,
  coverImageUrl,
  culturalContext,
  emotionalContext,
  historicalContext,
  audioReflections,
  contextImages,
  onClose,
  onPlayTrack
}: TrackContextScreenProps) {
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
        {/* Hero section with cover art */}
        <div className="relative h-[60vh] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={coverImageUrl}
              alt={trackTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
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

              <span className="text-xs tracking-[0.3em] uppercase text-white/60 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                {state.language === 'en' ? 'Track Context' : state.language === 'fr' ? 'Contexte de la Piste' : 'Contexto de la Pista'}
              </span>
            </div>
          </div>

          {/* Track info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {albumName && (
                <span className="text-xs tracking-wider uppercase text-white/50 mb-2 block">
                  {albumName}
                </span>
              )}
              <h1 className="text-3xl tracking-tight text-white mb-2 leading-tight">
                {trackTitle}
              </h1>
              <p className="text-base text-white/70 mb-4">
                {artistName}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 text-xs text-white/40">
                {releaseDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{releaseDate}</span>
                  </div>
                )}
                {recordingLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    <span>{recordingLocation}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content sections */}
        <div className="px-6 py-8 space-y-12">
          {/* Play track CTA */}
          {onPlayTrack && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlayTrack}
              className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" />
              {state.language === 'en' ? 'Listen Now' : state.language === 'fr' ? 'Écouter Maintenant' : 'Escuchar Ahora'}
            </motion.button>
          )}

          {/* Emotional context */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-sm tracking-wider uppercase text-white/40">
              {state.language === 'en' ? 'Emotional Context' : state.language === 'fr' ? 'Contexte Émotionnel' : 'Contexto Emocional'}
            </h2>
            <p className="text-base text-white/80 leading-relaxed">
              {getText(emotionalContext)}
            </p>
          </motion.section>

          {/* Cultural context */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <h2 className="text-sm tracking-wider uppercase text-white/40">
              {state.language === 'en' ? 'Cultural Context' : state.language === 'fr' ? 'Contexte Culturel' : 'Contexto Cultural'}
            </h2>
            <p className="text-base text-white/80 leading-relaxed">
              {getText(culturalContext)}
            </p>
          </motion.section>

          {/* Historical context */}
          {historicalContext && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-sm tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Historical Context' : state.language === 'fr' ? 'Contexte Historique' : 'Contexto Histórico'}
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                {getText(historicalContext)}
              </p>
            </motion.section>
          )}

          {/* Context images */}
          {contextImages && contextImages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <h2 className="text-sm tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Visual Archive' : state.language === 'fr' ? 'Archive Visuelle' : 'Archivo Visual'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {contextImages.map((img, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={`Context ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Audio reflections */}
          {audioReflections && audioReflections.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-4"
            >
              <h2 className="text-sm tracking-wider uppercase text-white/40 flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                {state.language === 'en' ? 'Audio Reflections' : state.language === 'fr' ? 'Réflexions Audio' : 'Reflexiones de Audio'}
              </h2>
              <div className="space-y-3">
                {audioReflections.map((reflection, index) => (
                  <button
                    key={index}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">
                        {getText(reflection.title)}
                      </span>
                      <Play className="w-4 h-4 text-white/50" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{reflection.author}</span>
                      <span>{reflection.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* Attribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-8 border-t border-white/5"
          >
            <p className="text-xs text-white/30 leading-relaxed">
              {state.language === 'en' 
                ? 'This contextual information is provided to deepen your understanding and appreciation of the work. All content respects creator intent and cultural sensitivity.'
                : state.language === 'fr'
                ? 'Ces informations contextuelles sont fournies pour approfondir votre compréhension et votre appréciation de l\'œuvre. Tout le contenu respecte l\'intention du créateur et la sensibilité culturelle.'
                : 'Esta información contextual se proporciona para profundizar su comprensión y apreciación de la obra. Todo el contenido respeta la intención del creador y la sensibilidad cultural.'
              }
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
