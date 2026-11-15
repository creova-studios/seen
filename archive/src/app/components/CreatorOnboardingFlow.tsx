import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronRight, Play, Plus, Globe, Eye } from "lucide-react";
import { useState } from "react";

/**
 * CREATOR ONBOARDING FLOW
 * Guided, empowering, grant-safe introduction to story creation
 */

export type OnboardingStep = 
  | "welcome"
  | "language"
  | "intent"
  | "tutorial_builder"
  | "tutorial_context"
  | "tutorial_accessibility"
  | "first_story"
  | "preview"
  | "submit";

interface CreatorOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function CreatorOnboardingFlow({ onComplete, onSkip }: CreatorOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [language, setLanguage] = useState<"en" | "fr" | "es">("en");
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      welcome_title: {
        en: "Welcome, Creator",
        fr: "Bienvenue, Créateur",
        es: "Bienvenido, Creador"
      },
      welcome_subtitle: {
        en: "Let's build your first interactive story",
        fr: "Créons votre première histoire interactive",
        es: "Creemos tu primera historia interactiva"
      },
      start: {
        en: "Start Tutorial",
        fr: "Commencer le Tutoriel",
        es: "Iniciar Tutorial"
      },
      skip: {
        en: "Skip for now",
        fr: "Passer pour l'instant",
        es: "Omitir por ahora"
      }
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep language={language} onNext={() => setCurrentStep("language")} onSkip={onSkip} />;
      
      case "language":
        return <LanguageStep language={language} onChange={setLanguage} onNext={() => setCurrentStep("tutorial_builder")} />;
      
      case "tutorial_builder":
        return <TutorialBuilderStep language={language} onNext={() => setCurrentStep("tutorial_context")} />;
      
      case "tutorial_context":
        return <TutorialContextStep language={language} onNext={() => setCurrentStep("tutorial_accessibility")} />;
      
      case "tutorial_accessibility":
        return <TutorialAccessibilityStep language={language} onNext={() => {
          setHasCompletedTutorial(true);
          setCurrentStep("first_story");
        }} />;
      
      case "first_story":
        return <FirstStoryPromptStep language={language} onNext={() => setCurrentStep("preview")} />;
      
      case "preview":
        return <PreviewStep language={language} onNext={() => setCurrentStep("submit")} />;
      
      case "submit":
        return <SubmitStep language={language} onComplete={onComplete} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-auto">
      <div className="min-h-full max-w-[428px] mx-auto">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * STEP 1: Welcome
 */
function WelcomeStep({ language, onNext, onSkip }: { language: string; onNext: () => void; onSkip: () => void }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-8"
      >
        <Plus className="w-12 h-12 text-white/80" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl tracking-tight text-white mb-3"
      >
        {language === 'en' ? 'Welcome, Creator' : language === 'fr' ? 'Bienvenue, Créateur' : 'Bienvenido, Creador'}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-base text-white/60 mb-12 max-w-[300px] leading-relaxed"
      >
        {language === 'en' 
          ? "Let's build your first interactive story. We'll guide you through the tools, step by step."
          : language === 'fr'
          ? "Créons votre première histoire interactive. Nous vous guiderons à travers les outils, étape par étape."
          : "Creemos tu primera historia interactiva. Te guiaremos a través de las herramientas, paso a paso."
        }
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-4 rounded-full bg-white text-black flex items-center justify-center gap-3 hover:bg-white/90 transition-all mb-4"
      >
        <span className="text-base font-medium">
          {language === 'en' ? 'Start Tutorial' : language === 'fr' ? 'Commencer le Tutoriel' : 'Iniciar Tutorial'}
        </span>
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={onSkip}
        className="text-sm text-white/40 hover:text-white/60 transition-colors"
      >
        {language === 'en' ? 'Skip for now' : language === 'fr' ? 'Passer pour l\'instant' : 'Omitir por ahora'}
      </motion.button>
    </motion.div>
  );
}

/**
 * STEP 2: Language Preference
 */
function LanguageStep({ language, onChange, onNext }: { language: string; onChange: (lang: "en" | "fr" | "es") => void; onNext: () => void }) {
  const languages = [
    { code: "en" as const, name: "English", flag: "🇬🇧" },
    { code: "fr" as const, name: "Français", flag: "🇫🇷" },
    { code: "es" as const, name: "Español", flag: "🇪🇸" }
  ];

  return (
    <motion.div
      key="language"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <div className="w-full max-w-[350px]">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-white/40" />
          <h2 className="text-xl tracking-tight text-white">
            {language === 'en' ? 'Your Language' : language === 'fr' ? 'Votre Langue' : 'Tu Idioma'}
          </h2>
        </div>

        <p className="text-sm text-white/60 mb-8">
          {language === 'en' 
            ? 'Choose your preferred interface language. You can create stories in multiple languages.'
            : language === 'fr'
            ? 'Choisissez votre langue d\'interface préférée. Vous pouvez créer des histoires en plusieurs langues.'
            : 'Elige tu idioma de interfaz preferido. Puedes crear historias en múltiples idiomas.'
          }
        </p>

        <div className="space-y-3 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onChange(lang.code)}
              className={`
                w-full p-4 rounded-xl text-left transition-all border
                ${language === lang.code
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-base text-white">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <Check className="w-5 h-5 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-white text-black hover:bg-white/90 transition-all"
        >
          <span className="text-base font-medium">
            {language === 'en' ? 'Continue' : language === 'fr' ? 'Continuer' : 'Continuar'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}

/**
 * STEP 3: Tutorial - Story Builder
 */
function TutorialBuilderStep({ language, onNext }: { language: string; onNext: () => void }) {
  return (
    <motion.div
      key="tutorial-builder"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-6 pt-20"
    >
      <div className="max-w-[350px] mx-auto">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-purple-300" />
          </div>
          <h2 className="text-2xl tracking-tight text-white mb-3">
            {language === 'en' ? 'Drag & Drop Nodes' : language === 'fr' ? 'Glisser-Déposer des Nœuds' : 'Arrastrar y Soltar Nodos'}
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            {language === 'en' 
              ? 'Create your story by adding nodes. Each node is a chapter. Connect them to build the narrative flow.'
              : language === 'fr'
              ? 'Créez votre histoire en ajoutant des nœuds. Chaque nœud est un chapitre. Connectez-les pour construire le flux narratif.'
              : 'Crea tu historia agregando nodos. Cada nodo es un capítulo. Conéctalos para construir el flujo narrativo.'
            }
          </p>
        </div>

        {/* Visual demo */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
          <div className="relative space-y-4">
            <div className="w-32 h-20 rounded-lg bg-white/10 border border-white/20 p-3">
              <div className="text-xs text-white/60">Chapter 1</div>
            </div>
            <div className="w-32 h-20 rounded-lg bg-white/10 border border-white/20 p-3 ml-12">
              <div className="text-xs text-white/60">Chapter 2</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all"
          >
            {language === 'en' ? 'Next' : language === 'fr' ? 'Suivant' : 'Siguiente'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * STEP 4: Tutorial - Context Cards
 */
function TutorialContextStep({ language, onNext }: { language: string; onNext: () => void }) {
  return (
    <motion.div
      key="tutorial-context"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-6 pt-20"
    >
      <div className="max-w-[350px] mx-auto">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-blue-300" />
          </div>
          <h2 className="text-2xl tracking-tight text-white mb-3">
            {language === 'en' ? 'Cultural Context Cards' : language === 'fr' ? 'Cartes de Contexte Culturel' : 'Tarjetas de Contexto Cultural'}
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            {language === 'en' 
              ? 'Add context cards to explain cultural terms, historical references, or language nuances. Your audience will appreciate the depth.'
              : language === 'fr'
              ? 'Ajoutez des cartes de contexte pour expliquer les termes culturels, les références historiques ou les nuances linguistiques. Votre public appréciera la profondeur.'
              : 'Agrega tarjetas de contexto para explicar términos culturales, referencias históricas o matices lingüísticos. Tu audiencia apreciará la profundidad.'
            }
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all"
          >
            {language === 'en' ? 'Next' : language === 'fr' ? 'Suivant' : 'Siguiente'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * STEP 5: Tutorial - Accessibility
 */
function TutorialAccessibilityStep({ language, onNext }: { language: string; onNext: () => void }) {
  return (
    <motion.div
      key="tutorial-accessibility"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-6 pt-20"
    >
      <div className="max-w-[350px] mx-auto">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-green-300" />
          </div>
          <h2 className="text-2xl tracking-tight text-white mb-3">
            {language === 'en' ? 'Accessibility Matters' : language === 'fr' ? 'L\'Accessibilité Compte' : 'La Accesibilidad Importa'}
          </h2>
          <p className="text-base text-white/70 leading-relaxed mb-6">
            {language === 'en' 
              ? 'Always add captions to audio and video. Provide alt text for images. Your stories should be accessible to everyone.'
              : language === 'fr'
              ? 'Ajoutez toujours des sous-titres à l\'audio et à la vidéo. Fournissez un texte alternatif pour les images. Vos histoires doivent être accessibles à tous.'
              : 'Siempre agrega subtítulos al audio y video. Proporciona texto alternativo para imágenes. Tus historias deben ser accesibles para todos.'
            }
          </p>

          <div className="p-4 rounded-xl bg-green-500/10 border border-green-400/20">
            <p className="text-xs text-green-200/70">
              ♿ {language === 'en' 
                ? 'SEEN follows WCAG 2.1 AA standards. Your stories inherit these accessibility features.'
                : language === 'fr'
                ? 'SEEN suit les normes WCAG 2.1 AA. Vos histoires héritent de ces fonctionnalités d\'accessibilité.'
                : 'SEEN sigue los estándares WCAG 2.1 AA. Tus historias heredan estas características de accesibilidad.'
              }
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all"
        >
          {language === 'en' ? 'Start Creating' : language === 'fr' ? 'Commencer à Créer' : 'Empezar a Crear'}
        </button>
      </div>
    </motion.div>
  );
}

/**
 * STEP 6: First Story Prompt
 */
function FirstStoryPromptStep({ language, onNext }: { language: string; onNext: () => void }) {
  return (
    <motion.div
      key="first-story"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen p-6 flex items-center justify-center"
    >
      <div className="max-w-[350px]">
        <h2 className="text-2xl tracking-tight text-white mb-6 text-center">
          {language === 'en' ? 'Your First Story' : language === 'fr' ? 'Votre Première Histoire' : 'Tu Primera Historia'}
        </h2>

        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder={language === 'en' ? 'Story title...' : language === 'fr' ? 'Titre de l\'histoire...' : 'Título de la historia...'}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <textarea
            placeholder={language === 'en' ? 'What\'s your story about?' : language === 'fr' ? 'De quoi parle votre histoire?' : '¿De qué trata tu historia?'}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
          />
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-white text-black hover:bg-white/90 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-black" />
          <span className="text-base font-medium">
            {language === 'en' ? 'Create Story' : language === 'fr' ? 'Créer l\'Histoire' : 'Crear Historia'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}

/**
 * STEP 7: Preview
 */
function PreviewStep({ language, onNext }: { language: string; onNext: () => void }) {
  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-6 flex items-center justify-center"
    >
      <div className="max-w-[350px] text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto mb-6">
          <Play className="w-10 h-10 text-blue-300" />
        </div>

        <h2 className="text-2xl tracking-tight text-white mb-3">
          {language === 'en' ? 'Preview Your Story' : language === 'fr' ? 'Prévisualisez Votre Histoire' : 'Previsualiza Tu Historia'}
        </h2>

        <p className="text-base text-white/60 mb-8">
          {language === 'en' 
            ? 'See how your story looks to the audience before publishing.'
            : language === 'fr'
            ? 'Voyez à quoi ressemble votre histoire pour le public avant de publier.'
            : 'Ve cómo se ve tu historia para la audiencia antes de publicar.'
          }
        </p>

        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-white text-black hover:bg-white/90 transition-all"
        >
          {language === 'en' ? 'Submit for Review' : language === 'fr' ? 'Soumettre pour Révision' : 'Enviar para Revisión'}
        </button>
      </div>
    </motion.div>
  );
}

/**
 * STEP 8: Submit
 */
function SubmitStep({ language, onComplete }: { language: string; onComplete: () => void }) {
  return (
    <motion.div
      key="submit"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen p-6 flex items-center justify-center"
    >
      <div className="max-w-[350px] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-8"
        >
          <Check className="w-12 h-12 text-green-300" />
        </motion.div>

        <h2 className="text-2xl tracking-tight text-white mb-3">
          {language === 'en' ? 'Story Created!' : language === 'fr' ? 'Histoire Créée!' : '¡Historia Creada!'}
        </h2>

        <p className="text-base text-white/60 mb-8">
          {language === 'en' 
            ? 'Your story is now ready. You can continue editing or submit it to a collection.'
            : language === 'fr'
            ? 'Votre histoire est maintenant prête. Vous pouvez continuer à l\'éditer ou la soumettre à une collection.'
            : 'Tu historia está lista. Puedes seguir editando o enviarla a una colección.'
          }
        </p>

        <button
          onClick={onComplete}
          className="w-full py-4 rounded-full bg-white text-black hover:bg-white/90 transition-all"
        >
          {language === 'en' ? 'Go to Dashboard' : language === 'fr' ? 'Aller au Tableau de Bord' : 'Ir al Panel'}
        </button>
      </div>
    </motion.div>
  );
}