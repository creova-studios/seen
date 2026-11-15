import { motion } from "motion/react";
import { useState } from "react";
import { Globe, ChevronRight, Info } from "lucide-react";
import { TRANSITIONS, VARIANTS, prefersReducedMotion } from "../../utils/motion";

interface StoryIntentStepProps {
  onNext: (data: StoryIntentData) => void;
  onSaveDraft: (data: Partial<StoryIntentData>) => void;
  initialData?: Partial<StoryIntentData>;
  /** Optional link under the draft indicator (the publish flow passes "Your stories" for creators). */
  footerLink?: { label: string; onClick: () => void };
}

export interface StoryIntentData {
  title: string;
  description: string;
  culturalThemes: string[];
  languages: Array<'en' | 'fr' | 'es'>;
  intendedAudience: string;
}

const CULTURAL_THEMES = [
  "Indigenous Knowledge",
  "Migration & Diaspora",
  "Language & Identity",
  "Urban Culture",
  "Heritage & Memory",
  "Music & Sound",
  "Visual Arts",
  "Documentary & Film",
  "Community Stories",
  "Environmental",
];

const AUDIENCES = ["Youth", "Educators", "Families", "Community members", "Researchers", "General public"];

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'es', label: 'Spanish', native: 'Español' },
] as const;

export function StoryIntentStep({ 
  onNext, 
  onSaveDraft,
  initialData,
  footerLink,
}: StoryIntentStepProps) {
  const reducedMotion = prefersReducedMotion();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedThemes, setSelectedThemes] = useState<string[]>(initialData?.culturalThemes || []);
  const [selectedLanguages, setSelectedLanguages] = useState<Array<'en' | 'fr' | 'es'>>(
    initialData?.languages || ['en']
  );
  const [intendedAudience, setIntendedAudience] = useState(initialData?.intendedAudience || '');

  const audienceTokens = intendedAudience.split(',').map(a => a.trim()).filter(Boolean);
  const toggleAudience = (a: string) => {
    const next = audienceTokens.includes(a) ? audienceTokens.filter(t => t !== a) : [...audienceTokens, a];
    setIntendedAudience(next.join(', '));
    setTimeout(handleAutoSave, 500);
  };

  // Auto-save on changes
  const handleAutoSave = () => {
    onSaveDraft({
      title,
      description,
      culturalThemes: selectedThemes,
      languages: selectedLanguages,
      intendedAudience,
    });
  };

  const toggleTheme = (theme: string) => {
    const updated = selectedThemes.includes(theme)
      ? selectedThemes.filter(t => t !== theme)
      : [...selectedThemes, theme];
    setSelectedThemes(updated);
    setTimeout(handleAutoSave, 300);
  };

  const toggleLanguage = (lang: 'en' | 'fr' | 'es') => {
    const updated = selectedLanguages.includes(lang)
      ? selectedLanguages.filter(l => l !== lang)
      : [...selectedLanguages, lang];
    setSelectedLanguages(updated);
    setTimeout(handleAutoSave, 300);
  };

  const canProceed = title.trim() && description.trim() && selectedThemes.length > 0 && selectedLanguages.length > 0;

  const handleNext = () => {
    if (canProceed) {
      onNext({
        title: title.trim(),
        description: description.trim(),
        culturalThemes: selectedThemes,
        languages: selectedLanguages,
        intendedAudience: intendedAudience.trim(),
      });
    }
  };

  return (
    <div className="min-h-dvh bg-black text-white pb-32">
      {/* Header */}
      <motion.div
        variants={!reducedMotion ? VARIANTS.fadeInDown : undefined}
        initial="initial"
        animate="animate"
        transition={TRANSITIONS.reveal}
        className="px-5 pt-8 pb-6 border-b border-white/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs tracking-widest uppercase text-white/55">Step 1 of 5</span>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-xs tracking-widest uppercase text-white/60">Story Intent</span>
        </div>
        <h1 className="text-2xl font-light tracking-wide mb-2">Cultural Grounding</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          This helps us present your story with care and context.
        </p>
      </motion.div>

      {/* Form Content */}
      <div className="px-5 py-6 space-y-8">
        {/* Title */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.organic, delay: 0.1 }}
        >
          <label className="block mb-3">
            <span className="text-sm tracking-wide text-white/80 mb-2 block">Story Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTimeout(handleAutoSave, 500);
              }}
              placeholder="Give your story a meaningful title"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              maxLength={100}
            />
            <span className="text-xs text-white/55 mt-1.5 block">{title.length}/100</span>
          </label>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.organic, delay: 0.2 }}
        >
          <label className="block mb-3">
            <span className="text-sm tracking-wide text-white/80 mb-2 block">Story Description</span>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setTimeout(handleAutoSave, 500);
              }}
              placeholder="What is this story about? Who should experience it?"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all resize-none"
              rows={4}
              maxLength={500}
            />
            <span className="text-xs text-white/55 mt-1.5 block">{description.length}/500</span>
          </label>
        </motion.div>

        {/* Cultural Themes */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.organic, delay: 0.3 }}
        >
          <div className="mb-3">
            <span className="text-sm tracking-wide text-white/80 mb-2 block">Cultural Themes</span>
            <p className="text-xs text-white/55 leading-relaxed">
              Select themes that best represent your story. Choose as many as relevant.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CULTURAL_THEMES.map((theme, index) => {
              const isSelected = selectedThemes.includes(theme);
              
              return (
                <motion.button
                  key={theme}
                  type="button"
                  onClick={() => toggleTheme(theme)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...TRANSITIONS.organic, delay: 0.4 + (index * 0.03) }}
                  whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
                  whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
                  className={`px-3 min-h-11 text-xs tracking-wide rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? 'bg-white/10 text-white border-white/30'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {theme}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Languages */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.organic, delay: 0.4 }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            <span className="text-sm tracking-wide text-white/80">Story Language(s)</span>
          </div>
          
          <div className="space-y-2">
            {LANGUAGES.map((lang, index) => {
              const isSelected = selectedLanguages.includes(lang.code);
              
              return (
                <motion.button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...TRANSITIONS.organic, delay: 0.5 + (index * 0.05) }}
                  whileHover={!reducedMotion ? { x: 4 } : undefined}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? 'bg-white/10 border-white/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-white bg-white' : 'border-white/30'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-black"
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-white">{lang.label}</div>
                      <div className="text-xs text-white/55">{lang.native}</div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Intended Audience (Optional) */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.organic, delay: 0.5 }}
        >
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span id="audience-label" className="text-sm tracking-wide text-white/80">Who is this story for?</span>
              <span className="text-xs tracking-wider uppercase text-white/55 bg-white/5 px-2 py-0.5 rounded">
                Optional
              </span>
            </div>
            <div role="group" aria-labelledby="audience-label" className="flex flex-wrap gap-2 mb-3">
              {AUDIENCES.map(a => {
                const on = audienceTokens.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAudience(a)}
                    className={`px-3 min-h-11 text-xs tracking-wide rounded-lg border transition-colors ${
                      on ? 'bg-white/10 text-white border-white/30' : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
            <label className="block">
              <span className="sr-only">Other audiences, separated by commas</span>
              <input
                type="text"
                value={intendedAudience}
                onChange={(e) => {
                  setIntendedAudience(e.target.value);
                  setTimeout(handleAutoSave, 500);
                }}
                placeholder="Pick above, or add your own (comma separated)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              />
            </label>
          </div>
        </motion.div>

        {/* Helper Card */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.organic, delay: 0.6 }}
          className="p-4 bg-white/5 border border-white/10 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-white/60 leading-relaxed">
                These details help us connect your story with the right audiences and institutional partners. 
                You can refine them at any time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-5">
        <div className="max-w-(--seen-content-max) mx-auto flex items-center justify-between">
          {/* Auto-save indicator */}
          <div className="flex flex-col items-start">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-white/55"
            >
              Draft saved
            </motion.span>
            {footerLink && (
              <button type="button" onClick={footerLink.onClick} className="min-h-11 text-xs text-white/80 underline underline-offset-2">
                {footerLink.label}
              </button>
            )}
          </div>

          {/* Next button */}
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            whileHover={!reducedMotion && canProceed ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion && canProceed ? { scale: 0.98 } : undefined}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm tracking-wide font-medium transition-all duration-300 ${
              canProceed
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/10 text-white/55 cursor-not-allowed'
            }`}
          >
            <span>Next: Structure</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
