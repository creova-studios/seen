import { motion, AnimatePresence } from "motion/react";
import { Globe, Check } from "lucide-react";
import { useState } from "react";
import { Language } from "../contexts/StoryStateContext";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  availableLanguages?: Language[];
}

const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'Français',
  es: 'Español'
};

export function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange,
  availableLanguages = ['en', 'fr', 'es']
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-white/70" />
      </button>

      {/* Language menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 overflow-hidden z-50 shadow-2xl"
            >
              <div className="p-2">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`
                      w-full px-4 py-3 rounded-lg text-left transition-colors
                      flex items-center justify-between
                      ${lang === currentLanguage 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-sm">
                      {LANGUAGE_NAMES[lang]}
                    </span>
                    {lang === currentLanguage && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>

              {/* Note about availability */}
              <div className="px-4 py-3 border-t border-white/5">
                <p className="text-xs text-white/55 leading-relaxed">
                  Content adapts to your language. Original language shown when translation unavailable.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
