import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, Volume2, VolumeX, Lock } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { getStoryWorldById, getLocalizedText } from "../data/storyDatabase";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { PaywallModal } from "./PaywallModal";
import { hasAccessToContent, creatorIdFromName } from "../data/monetizationService";
import { getContentPricing } from "../data/monetizationService";

interface StoryWorldEntryScreenProps {
  storyWorldId: string;
  onClose: () => void;
  onEnterStory: () => void;
}

export function StoryWorldEntryScreen({ 
  storyWorldId, 
  onClose, 
  onEnterStory 
}: StoryWorldEntryScreenProps) {
  const { state, setLanguage, getProgressForStory } = useStoryState();
  const { state: authState } = useAuth();
  const storyWorld = getStoryWorldById(storyWorldId);
  const progress = getProgressForStory(storyWorldId);
  const [showDetails, setShowDetails] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Ambient audio for story world
  const ambientAudio = useAudioPlayer({
    src: undefined, // Would be actual ambient audio URL
    autoPlay: false,
    fadeDuration: 3000
  });

  if (!storyWorld) return null;

  const hasProgress = !!progress;
  const creatorName = storyWorld.creator.en;
  const creatorId = creatorIdFromName(creatorName);
  const pricing = getContentPricing(storyWorld.id);
  const isLocked = pricing.accessTier !== "free" && !hasAccessToContent(storyWorld.id, authState.user?.id ?? null, creatorId);

  const handleEnterClick = () => {
    if (isLocked) {
      setPaywallOpen(true);
      return;
    }
    onEnterStory();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-black z-50"
    >
      {/* Background image with parallax effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={storyWorld.coverImage}
          alt={getLocalizedText(storyWorld.title, state.language)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
      </motion.div>

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-[428px] mx-auto flex items-center justify-between p-5 pt-8">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex gap-2">
            <LanguageSwitcher
              currentLanguage={state.language}
              onLanguageChange={setLanguage}
              availableLanguages={storyWorld.languagesAvailable}
            />
            
            {/* Ambient audio toggle */}
            <button
              onClick={ambientAudio.togglePlay}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label={ambientAudio.isPlaying ? "Mute ambient audio" : "Play ambient audio"}
            >
              {ambientAudio.isPlaying ? (
                <Volume2 className="w-4 h-4 text-white" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/50" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-[428px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="p-8 pb-12 space-y-8"
        >
          {/* Category */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/40">
              {storyWorld.culturalThemes?.[0] || 'Story'}
            </span>
          </motion.div>

          {/* Title - ceremonial */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-5xl tracking-tight text-white leading-[1.1]"
          >
            {getLocalizedText(storyWorld.title, state.language)}
          </motion.h1>

          {/* Description - poetic */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-lg text-white/70 leading-relaxed max-w-md"
          >
            {getLocalizedText(storyWorld.description, state.language)}
          </motion.p>

          {/* Themes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex flex-wrap gap-2"
          >
            {storyWorld.culturalThemes.map((theme, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60"
              >
                {theme}
              </span>
            ))}
          </motion.div>

          {/* Available languages indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-2"
          >
            <span className="text-xs text-white/30">Available in:</span>
            <div className="flex gap-1.5">
              {storyWorld.languagesAvailable.map((lang) => (
                <span
                  key={lang}
                  className={`text-xs uppercase tracking-wider ${
                    lang === state.language
                      ? 'text-white/60'
                      : 'text-white/20'
                  }`}
                >
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Enter Story CTA - ceremonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="pt-4 space-y-3"
          >
            <button
              onClick={handleEnterClick}
              className="w-full py-5 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-all flex items-center justify-center gap-3 group"
            >
              {isLocked ? (
                <>
                  <span>
                    {state.language === 'en' ? 'Unlock Story' : state.language === 'fr' ? 'Débloquer l\'Histoire' : 'Desbloquear Historia'}
                  </span>
                  <Lock className="w-4 h-4" />
                </>
              ) : hasProgress ? (
                <>
                  <span>
                    {state.language === 'en' ? 'Continue Your Journey' : state.language === 'fr' ? 'Continuez Votre Voyage' : 'Continúa Tu Viaje'}
                  </span>
                  <Play className="w-4 h-4 fill-black group-hover:translate-x-0.5 transition-transform" />
                </>
              ) : (
                <>
                  <span>
                    {state.language === 'en' ? 'Enter Story' : state.language === 'fr' ? 'Entrer dans l\'Histoire' : 'Entrar en la Historia'}
                  </span>
                  <Play className="w-4 h-4 fill-black group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            {/* Details toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 text-xs tracking-wider uppercase text-white/50 hover:text-white/80 transition-colors"
            >
              {showDetails 
                ? (state.language === 'en' ? 'Hide Details' : state.language === 'fr' ? 'Masquer les Détails' : 'Ocultar Detalles')
                : (state.language === 'en' ? 'Story Details' : state.language === 'fr' ? 'Détails de l\'Histoire' : 'Detalles de la Historia')
              }
            </button>
          </motion.div>

          {/* Expandable details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-white/10 space-y-4"
              >
                <div>
                  <span className="text-xs tracking-wider uppercase text-white/40 mb-2 block">
                    {state.language === 'en' ? 'About This Story' : state.language === 'fr' ? 'À Propos de Cette Histoire' : 'Sobre Esta Historia'}
                  </span>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {state.language === 'en' 
                      ? 'An immersive narrative experience combining sound, visual storytelling, and interactive elements. Designed to be experienced in one sitting or chapter by chapter.'
                      : state.language === 'fr'
                      ? 'Une expérience narrative immersive combinant son, narration visuelle et éléments interactifs. Conçue pour être vécue en une seule fois ou chapitre par chapitre.'
                      : 'Una experiencia narrativa inmersiva que combina sonido, narración visual y elementos interactivos. Diseñada para experimentarse de una vez o capítulo por capítulo.'
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Ambient audio indicator */}
      {ambientAudio.isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-400"
          />
          <span className="text-xs text-white/50">
            {state.language === 'en' ? 'Ambient audio playing' : state.language === 'fr' ? 'Audio ambiant en cours' : 'Audio ambiental reproduciéndose'}
          </span>
        </motion.div>
      )}

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onUnlocked={() => {
          setPaywallOpen(false);
          onEnterStory();
        }}
        contentId={storyWorld.id}
        contentTitle={getLocalizedText(storyWorld.title, state.language)}
        creatorName={creatorName}
      />
    </motion.div>
  );
}
