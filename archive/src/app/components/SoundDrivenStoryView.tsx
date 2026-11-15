import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { ArrowLeft, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface SoundDrivenStoryViewProps {
  trackTitle: string;
  artistName: string;
  audioSrc?: string;
  visualUrl: string;
  onClose: () => void;
  onShowContext: () => void;
}

export function SoundDrivenStoryView({
  trackTitle,
  artistName,
  audioSrc,
  visualUrl,
  onClose,
  onShowContext
}: SoundDrivenStoryViewProps) {
  const { state, updateAudioState } = useStoryState();
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Gesture-based interaction
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -100], [1, 0.5]);
  const scale = useTransform(y, [0, -100], [1, 1.05]);
  
  const audio = useAudioPlayer({
    src: audioSrc,
    autoPlay: false,
    fadeDuration: 3000
  });

  // Sync audio state
  useEffect(() => {
    updateAudioState({
      isPlaying: audio.isPlaying,
      playbackPosition: audio.currentTime
    });
  }, [audio.isPlaying, audio.currentTime]);

  // Auto-hide controls
  useEffect(() => {
    if (!hasInteracted) return;
    
    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [controlsVisible, hasInteracted]);

  const handleInteraction = () => {
    setHasInteracted(true);
    setControlsVisible(true);
  };

  // Gesture: swipe down to pause/play
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 50) {
      if (audio.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  // Simulate audio-reactive visuals (in production, use Web Audio API frequency data)
  const [audioIntensity, setAudioIntensity] = useState(0);

  useEffect(() => {
    if (!audio.isPlaying) {
      setAudioIntensity(0);
      return;
    }

    const interval = setInterval(() => {
      // Simulate audio reactivity
      setAudioIntensity(Math.random() * 0.3 + 0.7);
    }, 100);

    return () => clearInterval(interval);
  }, [audio.isPlaying]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleInteraction}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      {/* Audio-reactive background */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{
            scale: audio.isPlaying ? [1, 1.02, 1] : 1,
            opacity: audio.isPlaying ? audioIntensity : 0.6
          }}
          transition={{
            duration: 2,
            repeat: audio.isPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
          className="w-full h-full"
        >
          <img
            src={visualUrl}
            alt={trackTitle}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        {/* Audio-reactive overlay gradient */}
        {audio.isPlaying && (
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20"
          />
        )}
      </motion.div>

      {/* Top controls */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-20"
          >
            <div className="max-w-[428px] mx-auto flex items-center justify-between p-5 pt-8">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={onShowContext}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Show track context"
              >
                <Info className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center gesture area - tap/swipe to control */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -100, bottom: 100 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        {/* Ambient audio indicator when playing */}
        {audio.isPlaying ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Animated waveform visualization */}
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: audio.isPlaying 
                      ? [20, Math.random() * 40 + 20, 20]
                      : 20
                  }}
                  transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-1 bg-white/60 rounded-full"
                  style={{ height: 20 }}
                />
              ))}
            </div>

            {/* Gesture hint */}
            {!hasInteracted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="text-xs text-white/40 tracking-wider uppercase"
              >
                {state.language === 'en' ? 'Swipe to pause' : state.language === 'fr' ? 'Glissez pour mettre en pause' : 'Desliza para pausar'}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Play gesture area */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={audio.play}
              className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"
              />
            </motion.div>

            {/* Gesture hint */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-xs text-white/40 tracking-wider uppercase"
            >
              {state.language === 'en' ? 'Tap to begin' : state.language === 'fr' ? 'Touchez pour commencer' : 'Toca para comenzar'}
            </motion.p>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom info - immersive typography */}
      <div className="absolute bottom-0 left-0 right-0 z-10 max-w-[428px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="p-8 pb-12"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">
            {state.language === 'en' ? 'Now Playing' : state.language === 'fr' ? 'En Cours de Lecture' : 'Reproduciendo Ahora'}
          </span>
          <h2 className="text-3xl tracking-tight text-white mb-2 leading-tight">
            {trackTitle}
          </h2>
          <p className="text-base text-white/60">
            {artistName}
          </p>
        </motion.div>
      </div>

      {/* Subtle progress indicator */}
      {audio.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 z-20">
          <motion.div
            className="h-full bg-white/20"
            style={{ width: `${(audio.currentTime / audio.duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      {/* Audio state indicator */}
      {audio.isFading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 z-30"
        >
          <p className="text-xs text-white/70">
            {audio.isPlaying ? 'Fading in...' : 'Fading out...'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
