import { motion } from "motion/react";
import { ArrowLeft, Eye, Ear, Volume2, Zap, Type, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface AccessibilityControlsScreenProps {
  onClose: () => void;
}

export function AccessibilityControlsScreen({
  onClose
}: AccessibilityControlsScreenProps) {
  const { state } = useStoryState();
  const [settings, setSettings] = useState({
    highContrast: false,
    increasedTextSize: false,
    captionsAlways: true,
    reducedMotion: false,
    audioDescriptions: false,
    darkMode: true
  });

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Accessibility",
        fr: "Accessibilité",
        es: "Accesibilidad"
      },
      visual: {
        en: "Visual",
        fr: "Visuel",
        es: "Visual"
      },
      audio: {
        en: "Audio & Captions",
        fr: "Audio et Sous-titres",
        es: "Audio y Subtítulos"
      },
      motion: {
        en: "Motion & Interaction",
        fr: "Mouvement et Interaction",
        es: "Movimiento e Interacción"
      },
      highContrast: {
        en: "High Contrast Mode",
        fr: "Mode Contraste Élevé",
        es: "Modo de Alto Contraste"
      },
      textSize: {
        en: "Increased Text Size",
        fr: "Taille de Texte Augmentée",
        es: "Tamaño de Texto Aumentado"
      },
      captions: {
        en: "Always Show Captions",
        fr: "Toujours Afficher les Sous-titres",
        es: "Mostrar Siempre Subtítulos"
      },
      reducedMotion: {
        en: "Reduce Motion",
        fr: "Réduire le Mouvement",
        es: "Reducir Movimiento"
      },
      audioDesc: {
        en: "Audio Descriptions",
        fr: "Descriptions Audio",
        es: "Descripciones de Audio"
      },
      darkMode: {
        en: "Dark Mode",
        fr: "Mode Sombre",
        es: "Modo Oscuro"
      },
      note: {
        en: "SEEN is designed with WCAG 2.1 AA standards. All controls are keyboard accessible and screen reader compatible.",
        fr: "SEEN est conçu selon les normes WCAG 2.1 AA. Tous les contrôles sont accessibles au clavier et compatibles avec les lecteurs d'écran.",
        es: "SEEN está diseñado con estándares WCAG 2.1 AA. Todos los controles son accesibles mediante teclado y compatibles con lectores de pantalla."
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base tracking-tight text-white">
              {getText("title")}
            </h2>
            <div className="w-10" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Visual section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {getText("visual")}
              </h3>
            </div>

            <div className="space-y-3">
              {/* High Contrast */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`
                    w-10 h-10 rounded-lg border flex items-center justify-center
                    ${settings.highContrast 
                      ? 'bg-white border-white' 
                      : 'bg-white/10 border-white/20'
                    }
                  `}>
                    <Eye className={`w-5 h-5 ${settings.highContrast ? 'text-black' : 'text-white/70'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-white mb-0.5">
                      {getText("highContrast")}
                    </h4>
                    <p className="text-xs text-white/40">
                      {state.language === 'en' 
                        ? 'Increases contrast for better visibility'
                        : state.language === 'fr'
                        ? 'Augmente le contraste pour une meilleure visibilité'
                        : 'Aumenta el contraste para una mejor visibilidad'
                      }
                    </p>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={() => updateSetting('highContrast')}
                    className="sr-only"
                  />
                  <div className={`
                    w-12 h-7 rounded-full transition-all
                    ${settings.highContrast ? 'bg-white' : 'bg-white/20'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full bg-black mt-1 transition-all
                      ${settings.highContrast ? 'ml-6' : 'ml-1'}
                    `} />
                  </div>
                </div>
              </label>

              {/* Text Size */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`
                    w-10 h-10 rounded-lg border flex items-center justify-center
                    ${settings.increasedTextSize 
                      ? 'bg-blue-500/20 border-blue-400/30' 
                      : 'bg-white/10 border-white/20'
                    }
                  `}>
                    <Type className={`w-5 h-5 ${settings.increasedTextSize ? 'text-blue-300' : 'text-white/70'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-white mb-0.5">
                      {getText("textSize")}
                    </h4>
                    <p className="text-xs text-white/40">
                      {state.language === 'en' 
                        ? 'Makes all text 20% larger'
                        : state.language === 'fr'
                        ? 'Rend tout le texte 20% plus grand'
                        : 'Hace que todo el texto sea un 20% más grande'
                      }
                    </p>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.increasedTextSize}
                    onChange={() => updateSetting('increasedTextSize')}
                    className="sr-only"
                  />
                  <div className={`
                    w-12 h-7 rounded-full transition-all
                    ${settings.increasedTextSize ? 'bg-blue-400' : 'bg-white/20'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full bg-white mt-1 transition-all
                      ${settings.increasedTextSize ? 'ml-6' : 'ml-1'}
                    `} />
                  </div>
                </div>
              </label>

              {/* Dark Mode */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`
                    w-10 h-10 rounded-lg border flex items-center justify-center
                    ${settings.darkMode 
                      ? 'bg-purple-500/20 border-purple-400/30' 
                      : 'bg-white/10 border-white/20'
                    }
                  `}>
                    {settings.darkMode ? (
                      <Moon className="w-5 h-5 text-purple-300" />
                    ) : (
                      <Sun className="w-5 h-5 text-white/70" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-white mb-0.5">
                      {getText("darkMode")}
                    </h4>
                    <p className="text-xs text-white/40">
                      {state.language === 'en' 
                        ? 'Recommended for eye comfort'
                        : state.language === 'fr'
                        ? 'Recommandé pour le confort des yeux'
                        : 'Recomendado para comodidad ocular'
                      }
                    </p>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => updateSetting('darkMode')}
                    className="sr-only"
                  />
                  <div className={`
                    w-12 h-7 rounded-full transition-all
                    ${settings.darkMode ? 'bg-purple-400' : 'bg-white/20'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full bg-white mt-1 transition-all
                      ${settings.darkMode ? 'ml-6' : 'ml-1'}
                    `} />
                  </div>
                </div>
              </label>
            </div>
          </motion.section>

          {/* Audio & Captions section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Ear className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {getText("audio")}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Captions */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`
                    w-10 h-10 rounded-lg border flex items-center justify-center
                    ${settings.captionsAlways 
                      ? 'bg-green-500/20 border-green-400/30' 
                      : 'bg-white/10 border-white/20'
                    }
                  `}>
                    <Type className={`w-5 h-5 ${settings.captionsAlways ? 'text-green-300' : 'text-white/70'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-white mb-0.5">
                      {getText("captions")}
                    </h4>
                    <p className="text-xs text-white/40">
                      {state.language === 'en' 
                        ? 'Display captions for all audio'
                        : state.language === 'fr'
                        ? 'Afficher les sous-titres pour tout l\'audio'
                        : 'Mostrar subtítulos para todo el audio'
                      }
                    </p>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.captionsAlways}
                    onChange={() => updateSetting('captionsAlways')}
                    className="sr-only"
                  />
                  <div className={`
                    w-12 h-7 rounded-full transition-all
                    ${settings.captionsAlways ? 'bg-green-400' : 'bg-white/20'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full bg-white mt-1 transition-all
                      ${settings.captionsAlways ? 'ml-6' : 'ml-1'}
                    `} />
                  </div>
                </div>
              </label>

              {/* Audio Descriptions */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`
                    w-10 h-10 rounded-lg border flex items-center justify-center
                    ${settings.audioDescriptions 
                      ? 'bg-green-500/20 border-green-400/30' 
                      : 'bg-white/10 border-white/20'
                    }
                  `}>
                    <Volume2 className={`w-5 h-5 ${settings.audioDescriptions ? 'text-green-300' : 'text-white/70'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-white mb-0.5">
                      {getText("audioDesc")}
                    </h4>
                    <p className="text-xs text-white/40">
                      {state.language === 'en' 
                        ? 'Narration of visual elements'
                        : state.language === 'fr'
                        ? 'Narration des éléments visuels'
                        : 'Narración de elementos visuales'
                      }
                    </p>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.audioDescriptions}
                    onChange={() => updateSetting('audioDescriptions')}
                    className="sr-only"
                  />
                  <div className={`
                    w-12 h-7 rounded-full transition-all
                    ${settings.audioDescriptions ? 'bg-green-400' : 'bg-white/20'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full bg-white mt-1 transition-all
                      ${settings.audioDescriptions ? 'ml-6' : 'ml-1'}
                    `} />
                  </div>
                </div>
              </label>
            </div>
          </motion.section>

          {/* Motion & Interaction section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {getText("motion")}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Reduced Motion */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`
                    w-10 h-10 rounded-lg border flex items-center justify-center
                    ${settings.reducedMotion 
                      ? 'bg-amber-500/20 border-amber-400/30' 
                      : 'bg-white/10 border-white/20'
                    }
                  `}>
                    <Zap className={`w-5 h-5 ${settings.reducedMotion ? 'text-amber-300' : 'text-white/70'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-white mb-0.5">
                      {getText("reducedMotion")}
                    </h4>
                    <p className="text-xs text-white/40">
                      {state.language === 'en' 
                        ? 'Minimizes animations and transitions'
                        : state.language === 'fr'
                        ? 'Minimise les animations et transitions'
                        : 'Minimiza animaciones y transiciones'
                      }
                    </p>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={() => updateSetting('reducedMotion')}
                    className="sr-only"
                  />
                  <div className={`
                    w-12 h-7 rounded-full transition-all
                    ${settings.reducedMotion ? 'bg-amber-400' : 'bg-white/20'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full bg-white mt-1 transition-all
                      ${settings.reducedMotion ? 'ml-6' : 'ml-1'}
                    `} />
                  </div>
                </div>
              </label>
            </div>
          </motion.section>

          {/* WCAG note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 border-t border-white/5"
          >
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-blue-300" />
                <span className="text-xs tracking-wider uppercase text-blue-200">
                  WCAG 2.1 AA
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {getText("note")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}