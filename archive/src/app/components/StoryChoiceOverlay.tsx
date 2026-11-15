import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface Choice {
  id: string;
  title: {
    en: string;
    fr: string;
    es: string;
  };
  description: {
    en: string;
    fr: string;
    es: string;
  };
  consequence?: {
    en: string;
    fr: string;
    es: string;
  };
}

interface StoryChoiceOverlayProps {
  choices: Choice[];
  onChoose: (choiceId: string) => void;
  prompt?: {
    en: string;
    fr: string;
    es: string;
  };
}

export function StoryChoiceOverlay({ 
  choices, 
  onChoose,
  prompt
}: StoryChoiceOverlayProps) {
  const { state } = useStoryState();
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  const handleChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    
    // Intentional delay - make the choice feel meaningful
    setTimeout(() => {
      onChoose(choiceId);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center"
    >
      <div className="max-w-[428px] w-full px-8">
        {/* Prompt */}
        {prompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block">
              {state.language === 'en' ? 'Choose Your Path' : state.language === 'fr' ? 'Choisissez Votre Chemin' : 'Elige Tu Camino'}
            </span>
            <h2 className="text-2xl tracking-tight text-white leading-tight">
              {getText(prompt)}
            </h2>
          </motion.div>
        )}

        {/* Choices - ceremonial spacing */}
        <div className="space-y-6">
          {choices.map((choice, index) => {
            const isHovered = hoveredChoice === choice.id;
            const isSelected = selectedChoice === choice.id;

            return (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.15 }}
                onHoverStart={() => setHoveredChoice(choice.id)}
                onHoverEnd={() => setHoveredChoice(null)}
                onClick={() => handleChoice(choice.id)}
                disabled={selectedChoice !== null}
                className={`
                  w-full text-left p-6 rounded-2xl transition-all duration-500
                  border backdrop-blur-sm
                  ${isSelected 
                    ? 'border-white/40 bg-white/10 scale-[1.02]' 
                    : isHovered
                    ? 'border-white/30 bg-white/5 scale-[1.01]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                  }
                  ${selectedChoice && !isSelected ? 'opacity-30' : ''}
                `}
              >
                <div className="space-y-3">
                  {/* Choice title - emotional weight through typography */}
                  <h3 className="text-xl tracking-tight text-white leading-tight">
                    {getText(choice.title)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/60 leading-relaxed">
                    {getText(choice.description)}
                  </p>

                  {/* Consequence hint - subtle */}
                  {choice.consequence && (
                    <AnimatePresence>
                      {(isHovered || isSelected) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 mt-3 border-t border-white/10"
                        >
                          <p className="text-xs text-white/40 italic leading-relaxed">
                            {getText(choice.consequence)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-2 h-2 rounded-full bg-black"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Guidance text */}
        {!selectedChoice && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-12 text-xs text-white/30 leading-relaxed"
          >
            {state.language === 'en' 
              ? 'Take your time. Each choice shapes your journey.'
              : state.language === 'fr'
              ? 'Prenez votre temps. Chaque choix façonne votre voyage.'
              : 'Tómate tu tiempo. Cada elección da forma a tu viaje.'
            }
          </motion.p>
        )}

        {/* Processing state */}
        {selectedChoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-white/40 mx-auto"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
