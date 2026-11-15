import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Mic, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface SubmitResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  chapterTitle: string;
  onSubmit: (type: "text" | "audio" | "image", content: string, isAnonymous: boolean) => void;
}

export function SubmitResponseModal({
  isOpen,
  onClose,
  chapterId,
  chapterTitle,
  onSubmit
}: SubmitResponseModalProps) {
  const { state } = useStoryState();
  const [responseType, setResponseType] = useState<"text" | "audio" | "image">("text");
  const [textContent, setTextContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Add a reflection",
        fr: "Ajouter une réflexion",
        es: "Añadir una reflexión"
      },
      placeholder: {
        en: "What did this chapter evoke for you? Share your thoughts, feelings, or interpretations...",
        fr: "Qu'est-ce que ce chapitre a évoqué pour vous ? Partagez vos pensées, sentiments ou interprétations...",
        es: "¿Qué evocó este capítulo para ti? Comparte tus pensamientos, sentimientos o interpretaciones..."
      },
      anonymous: {
        en: "Submit anonymously",
        fr: "Soumettre anonymement",
        es: "Enviar anónimamente"
      },
      submit: {
        en: "Submit Reflection",
        fr: "Soumettre la Réflexion",
        es: "Enviar Reflexión"
      },
      guidelines: {
        en: "Guidelines",
        fr: "Directives",
        es: "Directrices"
      },
      guideline1: {
        en: "Share reflections, not reactions",
        fr: "Partagez des réflexions, pas des réactions",
        es: "Comparte reflexiones, no reacciones"
      },
      guideline2: {
        en: "Respect the narrative space",
        fr: "Respectez l'espace narratif",
        es: "Respeta el espacio narrativo"
      },
      guideline3: {
        en: "All submissions are moderated",
        fr: "Toutes les soumissions sont modérées",
        es: "Todos los envíos están moderados"
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  const handleSubmit = () => {
    if (!textContent.trim()) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(responseType, textContent, isAnonymous);
      setTextContent("");
      setIsSubmitting(false);
      onClose();
    }, 1000);
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-(--seen-content-max) z-50"
          >
            <div className="bg-black border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex-1">
                  <h2 className="text-lg tracking-tight text-white mb-1">
                    {getText("title")}
                  </h2>
                  <p className="text-xs text-white/55">
                    {chapterTitle}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Response type selector */}
                <div>
                  <label className="text-xs tracking-wider uppercase text-white/55 mb-3 block">
                    {state.language === 'en' ? 'Response Type' : state.language === 'fr' ? 'Type de Réponse' : 'Tipo de Respuesta'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setResponseType("text")}
                      className={`
                        flex-1 p-4 rounded-xl transition-all border
                        ${responseType === "text" 
                          ? 'bg-white/10 border-white/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <MessageCircle className="w-5 h-5 text-white/70 mb-2 mx-auto" />
                      <span className="text-xs text-white/70 block">Text</span>
                    </button>
                    <button
                      onClick={() => setResponseType("audio")}
                      className={`
                        flex-1 p-4 rounded-xl transition-all border
                        ${responseType === "audio" 
                          ? 'bg-white/10 border-white/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <Mic className="w-5 h-5 text-white/70 mb-2 mx-auto" />
                      <span className="text-xs text-white/70 block">Audio</span>
                    </button>
                    <button
                      onClick={() => setResponseType("image")}
                      className={`
                        flex-1 p-4 rounded-xl transition-all border
                        ${responseType === "image" 
                          ? 'bg-white/10 border-white/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <ImageIcon className="w-5 h-5 text-white/70 mb-2 mx-auto" />
                      <span className="text-xs text-white/70 block">Image</span>
                    </button>
                  </div>
                </div>

                {/* Text input */}
                {responseType === "text" && (
                  <div>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder={getText("placeholder")}
                      className="w-full h-40 p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm leading-relaxed placeholder:text-white/55 focus:bg-white/10 focus:border-white/20 outline-none resize-none"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-white/55">
                        {textContent.length}/500
                      </span>
                    </div>
                  </div>
                )}

                {/* Audio/Image placeholders */}
                {responseType === "audio" && (
                  <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Mic className="w-8 h-8 text-white/55 mx-auto mb-3" />
                    <p className="text-sm text-white/55">
                      {state.language === 'en' ? 'Audio recording coming soon' : state.language === 'fr' ? 'Enregistrement audio à venir' : 'Grabación de audio próximamente'}
                    </p>
                  </div>
                )}

                {responseType === "image" && (
                  <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                    <ImageIcon className="w-8 h-8 text-white/55 mx-auto mb-3" />
                    <p className="text-sm text-white/55">
                      {state.language === 'en' ? 'Image upload coming soon' : state.language === 'fr' ? 'Téléchargement d\'image à venir' : 'Carga de imagen próximamente'}
                    </p>
                  </div>
                )}

                {/* Anonymous toggle */}
                <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-white focus:ring-white/20"
                  />
                  <span className="text-sm text-white/70">
                    {getText("anonymous")}
                  </span>
                </label>

                {/* Guidelines */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-blue-300" />
                    <span className="text-xs tracking-wider uppercase text-blue-300">
                      {getText("guidelines")}
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-blue-200/70">
                    <li>• {getText("guideline1")}</li>
                    <li>• {getText("guideline2")}</li>
                    <li>• {getText("guideline3")}</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={handleSubmit}
                  disabled={!textContent.trim() || isSubmitting}
                  className={`
                    w-full py-4 rounded-full text-sm tracking-wider uppercase transition-all
                    ${!textContent.trim() || isSubmitting
                      ? 'bg-white/5 text-white/55 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-white/90'
                    }
                  `}
                >
                  {isSubmitting 
                    ? (state.language === 'en' ? 'Submitting...' : state.language === 'fr' ? 'Soumission...' : 'Enviando...')
                    : getText("submit")
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
