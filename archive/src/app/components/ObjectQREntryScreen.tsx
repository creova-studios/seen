import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Calendar, User, Play, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface ObjectStory {
  id: string;
  title: {
    en: string;
    fr: string;
    es: string;
  };
  creatorName: string;
  objectName: string;
  objectType: string; // "Fashion", "Art", "Artifact"
  location?: string;
  year?: string;
  imageUrl: string;
  preview: {
    en: string;
    fr: string;
    es: string;
  };
  duration?: string;
}

interface ObjectQREntryScreenProps {
  isOpen: boolean;
  onClose: () => void;
  objectStory: ObjectStory;
  onPlayStory: () => void;
}

export function ObjectQREntryScreen({
  isOpen,
  onClose,
  objectStory,
  onPlayStory
}: ObjectQREntryScreenProps) {
  const { state } = useStoryState();
  const [isRevealing, setIsRevealing] = useState(true);

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  // Auto-dismiss revealing animation
  useState(() => {
    if (isOpen) {
      setTimeout(() => setIsRevealing(false), 2000);
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 overflow-hidden"
        >
          {/* Background image */}
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={objectStory.imageUrl}
              alt={objectStory.objectName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
          </motion.div>

          {/* Revealing animation overlay */}
          <AnimatePresence>
            {isRevealing && (
              <motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-black z-10 origin-top"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-full border-t-2 border-white/60"
                      />
                    </div>
                    <p className="text-sm text-white/50">
                      {state.language === 'en' 
                        ? 'Revealing story...'
                        : state.language === 'fr'
                        ? 'Révélation de l\'histoire...'
                        : 'Revelando historia...'
                      }
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={onClose}
            className="absolute top-8 right-6 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="p-6 pb-8 max-w-[428px] mx-auto w-full"
            >
              {/* Object metadata */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="mb-6 space-y-2"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-xs tracking-wider uppercase text-white/90">
                    {objectStory.objectType}
                  </span>
                </div>

                <h1 className="text-2xl tracking-tight text-white leading-tight mb-3">
                  {objectStory.objectName}
                </h1>

                {/* Metadata tags */}
                <div className="flex flex-wrap gap-3 text-sm text-white/60">
                  {objectStory.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{objectStory.location}</span>
                    </div>
                  )}
                  {objectStory.year && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{objectStory.year}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{objectStory.creatorName}</span>
                  </div>
                </div>
              </motion.div>

              {/* Story preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="mb-6"
              >
                <h2 className="text-lg tracking-tight text-white mb-3">
                  {getText(objectStory.title)}
                </h2>
                <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                  {getText(objectStory.preview)}
                </p>
              </motion.div>

              {/* Play button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPlayStory}
                className="w-full py-4 rounded-full bg-white text-black flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-2xl"
              >
                <Play className="w-5 h-5 fill-black" />
                <span className="text-base font-medium">
                  {state.language === 'en' 
                    ? 'Experience Story'
                    : state.language === 'fr'
                    ? 'Vivre l\'Histoire'
                    : 'Experimentar Historia'
                  }
                </span>
                {objectStory.duration && (
                  <span className="text-sm text-black/60">
                    {objectStory.duration}
                  </span>
                )}
              </motion.button>

              {/* Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="text-center text-xs text-white/30 mt-4"
              >
                {state.language === 'en' 
                  ? 'Each object holds a story. Scan more to discover.'
                  : state.language === 'fr'
                  ? 'Chaque objet détient une histoire. Scannez-en d\'autres pour découvrir.'
                  : 'Cada objeto tiene una historia. Escanea más para descubrir.'
                }
              </motion.p>
            </motion.div>
          </div>

          {/* Ambient particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  y: -100,
                }}
                transition={{
                  duration: 8,
                  delay: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  bottom: 0
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
