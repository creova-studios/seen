import { motion, AnimatePresence } from "motion/react";
import { Info, X } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface ContextCardProps {
  isOpen: boolean;
  onClose: () => void;
  term: string;
  definition: {
    en: string;
    fr: string;
    es: string;
  };
  culturalContext?: {
    en: string;
    fr: string;
    es: string;
  };
  pronunciation?: string;
  creatorNote?: {
    en: string;
    fr: string;
    es: string;
  };
}

export function ContextCard({
  isOpen,
  onClose,
  term,
  definition,
  culturalContext,
  pronunciation,
  creatorNote
}: ContextCardProps) {
  const { state } = useStoryState();

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Card - appears like a footnote */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[380px] z-50"
          >
            <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between p-5 pb-4 border-b border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-300" />
                    <span className="text-xs tracking-wider uppercase text-blue-200">
                      {state.language === 'en' ? 'Context' : state.language === 'fr' ? 'Contexte' : 'Contexto'}
                    </span>
                  </div>
                  <h3 className="text-lg tracking-tight text-white">
                    {term}
                  </h3>
                  {pronunciation && (
                    <p className="text-xs text-white/40 mt-1">
                      /{pronunciation}/
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Definition */}
                <div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {getText(definition)}
                  </p>
                </div>

                {/* Cultural context */}
                {culturalContext && (
                  <div className="pt-4 border-t border-white/10">
                    <span className="text-xs tracking-wider uppercase text-white/40 mb-2 block">
                      {state.language === 'en' ? 'Cultural Significance' : state.language === 'fr' ? 'Signification Culturelle' : 'Significado Cultural'}
                    </span>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {getText(culturalContext)}
                    </p>
                  </div>
                )}

                {/* Creator note */}
                {creatorNote && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-white/60 leading-relaxed italic">
                        "{getText(creatorNote)}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Language indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-white/30">
                    {state.language === 'en' ? 'Showing:' : state.language === 'fr' ? 'Affichage :' : 'Mostrando:'}
                  </span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    {state.language}
                  </span>
                </div>
              </div>

              {/* Footer note */}
              <div className="px-5 py-3 bg-white/5 border-t border-white/10">
                <p className="text-xs text-white/30 text-center leading-relaxed">
                  {state.language === 'en' 
                    ? 'Creator-written context • Tap outside to close'
                    : state.language === 'fr'
                    ? 'Contexte écrit par le créateur • Touchez à l\'extérieur pour fermer'
                    : 'Contexto escrito por el creador • Toca afuera para cerrar'
                  }
                </p>
              </div>
            </div>

            {/* Subtle pointer to term location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-2 left-8 w-4 h-4 bg-black/95 border-l border-t border-white/20 transform rotate-45"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Inline context trigger component
interface ContextTriggerProps {
  term: string;
  children: React.ReactNode;
  onClick: () => void;
}

export function ContextTrigger({ term, children, onClick }: ContextTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center gap-1 border-b border-dotted border-white/30 hover:border-white/50 transition-colors group"
      aria-label={`Learn more about ${term}`}
    >
      <span className="text-white/90 group-hover:text-white transition-colors">
        {children}
      </span>
      <Info className="w-3 h-3 text-white/40 group-hover:text-white/60 transition-colors" />
    </button>
  );
}
