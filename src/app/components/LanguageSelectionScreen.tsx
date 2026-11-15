import { motion } from "motion/react";
import { useState } from "react";
import { Language } from "../contexts/StoryStateContext";

interface LanguageSelectionScreenProps {
  onSelectLanguage: (lang: Language) => void;
}

const LANGUAGES = [
  {
    code: 'en' as Language,
    name: 'English',
    nativeName: 'English'
  },
  {
    code: 'fr' as Language,
    name: 'French',
    nativeName: 'Français'
  },
  {
    code: 'es' as Language,
    name: 'Spanish',
    nativeName: 'Español'
  }
];

export function LanguageSelectionScreen({ onSelectLanguage }: LanguageSelectionScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6"
    >
      <motion.h2 
        className="text-xl leading-relaxed text-white/80 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        Choose your language
      </motion.h2>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {LANGUAGES.map((lang, index) => (
          <LanguageButton
            key={lang.code}
            nativeName={lang.nativeName}
            name={lang.name}
            onClick={() => onSelectLanguage(lang.code)}
            delay={1.0 + index * 0.1}
          />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="text-xs text-white/55 mt-12"
      >
        You can change this anytime in settings
      </motion.p>
    </motion.div>
  );
}

function LanguageButton({ 
  nativeName, 
  name, 
  onClick, 
  delay 
}: { 
  nativeName: string; 
  name: string; 
  onClick: () => void; 
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-5 text-left border-b border-white/10 hover:border-white/30 transition-all duration-500 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ x: 8 }}
    >
      <div className="text-base text-white/90 mb-1 group-hover:text-white transition-colors duration-500">
        {nativeName}
      </div>
      <div className="text-sm text-white/55 group-hover:text-white/60 transition-colors duration-500">
        {name}
      </div>
    </motion.button>
  );
}