import { motion } from "motion/react";
import { GitBranch } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getLocalizedText, type MultilingualText } from "../data/storyDatabase";

export interface BranchChoice {
  questionText: MultilingualText;
  options: Array<{
    id: string;
    text: MultilingualText;
    nextChapterId?: string;
    tag?: string;
  }>;
  impactsOutcome?: boolean;
}

interface BranchingChoiceOverlayProps {
  branchChoice: BranchChoice;
  onChoose: (optionId: string, nextChapterId?: string) => void;
}

export function BranchingChoiceOverlay({
  branchChoice,
  onChoose
}: BranchingChoiceOverlayProps) {
  const { state } = useStoryState();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getText = (text: { en: string; fr: string; es: string }) => {
    return getLocalizedText(text, state.language);
  };

  const handleChoice = (optionId: string, nextChapterId?: string) => {
    setSelectedOption(optionId);
    
    // Brief delay for visual feedback
    setTimeout(() => {
      onChoose(optionId, nextChapterId);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <div className="relative z-10 max-w-(--seen-content-max) w-full px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-white/55" />
            <span className="text-xs tracking-[0.3em] uppercase text-white/55">
              {branchChoice.impactsOutcome ? (
                state.language === 'en' ? 'Your Choice Matters' : 
                state.language === 'fr' ? 'Votre Choix Compte' : 
                'Tu Elección Importa'
              ) : (
                state.language === 'en' ? 'Share Your Perspective' : 
                state.language === 'fr' ? 'Partagez Votre Perspective' : 
                'Comparte Tu Perspectiva'
              )}
            </span>
          </div>
          <h2 className="text-2xl tracking-tight text-white leading-tight">
            {getText(branchChoice.questionText)}
          </h2>
        </motion.div>

        {/* Options */}
        <div className="space-y-3">
          {branchChoice.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleChoice(option.id, option.nextChapterId)}
              disabled={selectedOption !== null}
              className={`
                w-full p-5 rounded-2xl border transition-all
                ${selectedOption === option.id 
                  ? 'bg-white/20 border-white/40 scale-[0.98]' 
                  : selectedOption === null
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]'
                  : 'bg-white/5 border-white/5 opacity-50'}
              `}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-left">
                  <p className="text-base text-white leading-snug">
                    {getText(option.text)}
                  </p>
                  {option.tag && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-white/10 text-white/70">
                      {option.tag}
                    </span>
                  )}
                </div>
                {selectedOption === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Impact note */}
        {branchChoice.impactsOutcome && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-white/55 mt-6"
          >
            {state.language === 'en' 
              ? 'This choice will shape your journey' 
              : state.language === 'fr'
              ? 'Ce choix façonnera votre voyage'
              : 'Esta elección dará forma a tu viaje'}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
