import { SeenImage } from "./seen/SeenImage";
import { motion, AnimatePresence } from "motion/react";
import { Info, X, ExternalLink } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getLocalizedText, type MultilingualText, type ContextCard as StoredContextCard } from "../data/storyDatabase";

export interface ContextCard extends StoredContextCard {
  imageUrl?: string;
  externalLink?: string;
  relatedTags?: string[];
}

interface ContextCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextCard: ContextCard;
}

export function ContextCardModal({
  isOpen,
  onClose,
  contextCard
}: ContextCardModalProps) {
  const { state } = useStoryState();

  const getText = (text: MultilingualText) => {
    return getLocalizedText(text, state.language);
  };

  const getTypeLabel = () => {
    const labels: Record<string, Record<string, string>> = {
      artist: { en: 'Artist', fr: 'Artiste', es: 'Artista' },
      cultural: { en: 'Cultural Context', fr: 'Contexte Culturel', es: 'Contexto Cultural' },
      historical: { en: 'Historical Context', fr: 'Contexte Historique', es: 'Contexto Histórico' },
      technical: { en: 'Technical Note', fr: 'Note Technique', es: 'Nota Técnica' },
      location: { en: 'Location', fr: 'Lieu', es: 'Ubicación' }
    };
    return labels[contextCard.type]?.[state.language] || contextCard.type;
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[420px] z-50"
          >
            <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* Image if available */}
              {contextCard.imageUrl && (
                <div className="relative w-full h-48 overflow-hidden">
                  <SeenImage src={contextCard.imageUrl} alt={getText(contextCard.title)} seed={contextCard.id} decorative className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between p-5 pb-4 border-b border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-300" />
                    <span className="text-xs tracking-wider uppercase text-blue-200">
                      {getTypeLabel()}
                    </span>
                  </div>
                  <h3 className="text-xl tracking-tight text-white">
                    {getText(contextCard.title)}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-sm leading-relaxed text-white/80">
                  {getText(contextCard.content)}
                </p>

                {/* External Link */}
                {contextCard.externalLink && (
                  <a
                    href={contextCard.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <span>
                      {state.language === 'en' ? 'Learn More' : 
                       state.language === 'fr' ? 'En Savoir Plus' : 
                       'Aprender Más'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Tags */}
                {(contextCard.relatedTags?.length ?? 0) > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {contextCard.relatedTags!.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
