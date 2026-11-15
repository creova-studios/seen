import { motion, AnimatePresence } from "motion/react";
import { X, User, MessageCircle, Globe } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface LyricsSection {
  timestamp: number;
  lyrics: {
    en: string;
    fr: string;
    es: string;
  };
  context?: {
    en: string;
    fr: string;
    es: string;
  };
}

interface LyricsContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
  artistName: string;
  lyricsSections: LyricsSection[];
  creatorCommentary?: {
    en: string;
    fr: string;
    es: string;
  };
  culturalContext?: {
    en: string;
    fr: string;
    es: string;
  };
}

export function LyricsContextPanel({
  isOpen,
  onClose,
  trackTitle,
  artistName,
  lyricsSections,
  creatorCommentary,
  culturalContext
}: LyricsContextPanelProps) {
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel - slides up like liner notes */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-black border-t border-white/10 rounded-t-3xl overflow-hidden"
            style={{ maxHeight: "85vh" }}
          >
            {/* Handle indicator */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5">
              <div className="flex-1 pr-4">
                <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2 block">
                  {state.language === 'en' ? 'Liner Notes' : state.language === 'fr' ? 'Notes de Pochette' : 'Notas del Álbum'}
                </span>
                <h2 className="text-xl tracking-tight text-white mb-1">
                  {trackTitle}
                </h2>
                <p className="text-sm text-white/50">
                  {artistName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 pb-8" style={{ maxHeight: "calc(85vh - 120px)" }}>
              {/* Lyrics sections */}
              <div className="py-6 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-4 h-4 text-white/40" />
                    <h3 className="text-sm tracking-wider uppercase text-white/40">
                      {state.language === 'en' ? 'Lyrics' : state.language === 'fr' ? 'Paroles' : 'Letras'}
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    {lyricsSections.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <p className="text-base text-white leading-relaxed whitespace-pre-line">
                          {getText(section.lyrics)}
                        </p>
                        
                        {section.context && (
                          <p className="text-sm text-white/50 italic pl-4 border-l-2 border-white/10">
                            {getText(section.context)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator commentary */}
                {creatorCommentary && (
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-white/40" />
                      <h3 className="text-sm tracking-wider uppercase text-white/40">
                        {state.language === 'en' ? 'Creator Commentary' : state.language === 'fr' ? 'Commentaire du Créateur' : 'Comentario del Creador'}
                      </h3>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/70 leading-relaxed italic">
                        "{getText(creatorCommentary)}"
                      </p>
                      <p className="text-xs text-white/40 mt-3">
                        — {artistName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cultural context */}
                {culturalContext && (
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-4 h-4 text-white/40" />
                      <h3 className="text-sm tracking-wider uppercase text-white/40">
                        {state.language === 'en' ? 'Cultural Context' : state.language === 'fr' ? 'Contexte Culturel' : 'Contexto Cultural'}
                      </h3>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {getText(culturalContext)}
                    </p>
                  </div>
                )}

                {/* Accessibility note */}
                <div className="pt-6 border-t border-white/5">
                  <p className="text-xs text-white/30 leading-relaxed">
                    {state.language === 'en' 
                      ? 'These liner notes provide cultural and creative context for this work. Translations preserve meaning while respecting original intent.'
                      : state.language === 'fr'
                      ? 'Ces notes de pochette fournissent un contexte culturel et créatif pour cette œuvre. Les traductions préservent le sens tout en respectant l\'intention originale.'
                      : 'Estas notas del álbum proporcionan contexto cultural y creativo para esta obra. Las traducciones preservan el significado respetando la intención original.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
