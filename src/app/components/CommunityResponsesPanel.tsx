import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Mic, Image as ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface Response {
  id: string;
  type: "text" | "audio" | "image";
  content: string;
  authorName?: string;
  timestamp: string;
  language: string;
}

interface CommunityResponsesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  chapterTitle: string;
  responses: Response[];
  onSubmitResponse: () => void;
}

export function CommunityResponsesPanel({
  isOpen,
  onClose,
  chapterId,
  chapterTitle,
  responses,
  onSubmitResponse
}: CommunityResponsesPanelProps) {
  const { state } = useStoryState();
  const [filter, setFilter] = useState<"all" | "text" | "audio" | "image">("all");

  const filteredResponses = responses.filter(r => 
    filter === "all" ? true : r.type === filter
  );

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Reflections",
        fr: "Réflexions",
        es: "Reflexiones"
      },
      description: {
        en: "Reflections shared by other listeners",
        fr: "Réflexions partagées par d'autres auditeurs",
        es: "Reflexiones compartidas por otros oyentes"
      },
      addYours: {
        en: "Add a reflection",
        fr: "Ajouter une réflexion",
        es: "Añadir una reflexión"
      },
      noResponses: {
        en: "No reflections yet. Add the first one.",
        fr: "Aucune réflexion pour l'instant. Ajoutez la première.",
        es: "Aún no hay reflexiones. Añade la primera."
      },
      note: {
        en: "All responses are moderated to preserve the integrity of the narrative space.",
        fr: "Toutes les réponses sont modérées pour préserver l'intégrité de l'espace narratif.",
        es: "Todas las respuestas se moderan para preservar la integridad del espacio narrativo."
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
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

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-black border-t border-white/10 rounded-t-3xl overflow-hidden"
            style={{ maxHeight: "85vh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-white/55" />
                    <h2 className="text-base tracking-tight text-white">
                      {getText("title")}
                    </h2>
                  </div>
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

              <p className="text-sm text-white/55 leading-relaxed mb-4">
                {getText("description")}
              </p>

              {/* Filter tabs */}
              <div className="flex gap-2">
                {["all", "text", "audio", "image"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type as any)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all
                      ${filter === type 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'bg-white/5 text-white/55 border border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Responses list */}
            <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(85vh - 240px)" }}>
              {filteredResponses.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-white/55">
                    {getText("noResponses")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResponses.map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      {/* Response type indicator */}
                      <div className="flex items-center gap-2 mb-3">
                        {response.type === "audio" && (
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Mic className="w-3 h-3 text-purple-300" />
                          </div>
                        )}
                        {response.type === "image" && (
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <ImageIcon className="w-3 h-3 text-blue-300" />
                          </div>
                        )}
                        {response.type === "text" && (
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-green-300" />
                          </div>
                        )}
                        <span className="text-xs text-white/55 uppercase tracking-wider">
                          {response.type}
                        </span>
                      </div>

                      {/* Content */}
                      {response.type === "text" && (
                        <p className="text-sm text-white/80 leading-relaxed mb-3">
                          {response.content}
                        </p>
                      )}

                      {response.type === "audio" && (
                        <div className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-white/70">Audio response</span>
                          </div>
                        </div>
                      )}

                      {response.type === "image" && (
                        <div className="mb-3 rounded-lg overflow-hidden bg-white/5 aspect-video">
                          <div className="w-full h-full flex items-center justify-center text-white/55">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-white/55">
                        <span>{response.authorName || "Anonymous"}</span>
                        <span>{response.language.toUpperCase()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Add response button */}
            <div className="p-6 border-t border-white/5">
              <button
                onClick={onSubmitResponse}
                className="w-full py-4 rounded-full bg-white/10 border border-white/20 text-white text-sm tracking-wider uppercase hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {getText("addYours")}
              </button>

              {/* Moderation note */}
              <p className="text-xs text-white/55 text-center mt-4 leading-relaxed">
                {getText("note")}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
