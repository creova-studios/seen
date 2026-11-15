import { motion } from "motion/react";
import { ArrowRight, Eye } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface BranchOption {
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
  perspectiveNote: {
    en: string;
    fr: string;
    es: string;
  };
}

interface SoftBranchingChoiceProps {
  mainPath: BranchOption;
  alternatePath: BranchOption;
  onChoose: (pathId: string) => void;
}

export function SoftBranchingChoice({
  mainPath,
  alternatePath,
  onChoose
}: SoftBranchingChoiceProps) {
  const { state } = useStoryState();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  const handleChoice = (pathId: string) => {
    setSelectedPath(pathId);
    
    // Intentional delay for reflection
    setTimeout(() => {
      onChoose(pathId);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* Ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      <div className="relative z-10 max-w-[428px] w-full px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-white/40" />
            <span className="text-xs tracking-[0.3em] uppercase text-white/40">
              {state.language === 'en' ? 'Perspective Shift' : state.language === 'fr' ? 'Changement de Perspective' : 'Cambio de Perspectiva'}
            </span>
          </div>
          <h2 className="text-2xl tracking-tight text-white leading-tight mb-3">
            {state.language === 'en' 
              ? 'Choose Your Lens'
              : state.language === 'fr'
              ? 'Choisissez Votre Regard'
              : 'Elige Tu Perspectiva'
            }
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            {state.language === 'en' 
              ? 'Explore an alternate perspective. Both paths converge back to the main narrative.'
              : state.language === 'fr'
              ? 'Explorez une perspective alternative. Les deux chemins convergent vers le récit principal.'
              : 'Explora una perspectiva alternativa. Ambos caminos convergen de nuevo a la narrativa principal.'
            }
          </p>
        </motion.div>

        {/* Path options */}
        <div className="space-y-4">
          {/* Main path */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => handleChoice(mainPath.id)}
            disabled={selectedPath !== null}
            className={`
              w-full text-left p-6 rounded-2xl transition-all duration-500 border backdrop-blur-sm
              ${selectedPath === mainPath.id
                ? 'border-white/40 bg-white/10 scale-[1.02]'
                : selectedPath
                ? 'border-white/10 bg-white/[0.02] opacity-30'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'
              }
            `}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs text-white/60">
                      {state.language === 'en' ? 'Main Path' : state.language === 'fr' ? 'Chemin Principal' : 'Camino Principal'}
                    </span>
                  </div>
                  <h3 className="text-xl tracking-tight text-white leading-tight mb-2">
                    {getText(mainPath.title)}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {getText(mainPath.description)}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/30 flex-shrink-0 ml-4 mt-1" />
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/40 italic">
                  {getText(mainPath.perspectiveNote)}
                </p>
              </div>
            </div>
          </motion.button>

          {/* Alternate path */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => handleChoice(alternatePath.id)}
            disabled={selectedPath !== null}
            className={`
              w-full text-left p-6 rounded-2xl transition-all duration-500 border backdrop-blur-sm
              ${selectedPath === alternatePath.id
                ? 'border-purple-400/40 bg-purple-500/10 scale-[1.02]'
                : selectedPath
                ? 'border-white/10 bg-white/[0.02] opacity-30'
                : 'border-purple-400/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400/30'
              }
            `}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs text-purple-200">
                      {state.language === 'en' ? 'Alternate View' : state.language === 'fr' ? 'Vue Alternative' : 'Vista Alternativa'}
                    </span>
                  </div>
                  <h3 className="text-xl tracking-tight text-white leading-tight mb-2">
                    {getText(alternatePath.title)}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {getText(alternatePath.description)}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-300/50 flex-shrink-0 ml-4 mt-1" />
              </div>

              <div className="pt-3 border-t border-purple-400/10">
                <p className="text-xs text-purple-200/60 italic">
                  {getText(alternatePath.perspectiveNote)}
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Guidance */}
        {!selectedPath && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8 text-xs text-white/30 leading-relaxed"
          >
            {state.language === 'en' 
              ? 'This is not a test. There are no wrong choices—only different ways of seeing.'
              : state.language === 'fr'
              ? 'Ce n\'est pas un test. Il n\'y a pas de mauvais choix—seulement différentes façons de voir.'
              : 'Esto no es una prueba. No hay elecciones incorrectas—solo diferentes formas de ver.'
            }
          </motion.p>
        )}

        {/* Processing state */}
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
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
