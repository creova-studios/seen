import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Captions } from "lucide-react";
import {
  AUDIO_VARIANTS,
  WAVEFORM_VARIANTS,
  TRANSITIONS,
  triggerHaptic,
  prefersReducedMotion
} from "../utils/motion";

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number; // 0-1
  onVolumeChange: (volume: number) => void;
  currentTime: number; // seconds
  duration: number; // seconds
  onSeek: (time: number) => void;
  showCaptions: boolean;
  onToggleCaptions: () => void;
  title?: string;
  artist?: string;
}

export function AudioPlayer({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  currentTime,
  duration,
  onSeek,
  showCaptions,
  onToggleCaptions,
  title,
  artist,
}: AudioPlayerProps) {
  const reducedMotion = prefersReducedMotion();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = () => {
    triggerHaptic('medium');
    onTogglePlay();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <motion.div
      variants={!reducedMotion ? AUDIO_VARIANTS : undefined}
      animate={isPlaying ? "playing" : "paused"}
      transition={TRANSITIONS.organic}
      className="fixed bottom-24 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-5 z-40"
    >
      <div className="max-w-[428px] mx-auto">
        {/* Track Info */}
        {(title || artist) && (
          <motion.div
            className="mb-4"
            animate={{ opacity: isPlaying ? 1 : 0.7 }}
            transition={TRANSITIONS.fade}
          >
            {title && <h3 className="text-sm font-light tracking-wide text-white mb-1 truncate">{title}</h3>}
            {artist && <p className="text-xs text-white/55 truncate">{artist}</p>}
          </motion.div>
        )}

        {/* Waveform / Progress Bar */}
        <div className="relative mb-4">
          <div
            onClick={handleSeek}
            className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
          >
            <motion.div
              className="h-full bg-white rounded-full relative"
              animate={{ width: `${progress}%` }}
              transition={TRANSITIONS.organic}
            >
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{
                  boxShadow: isPlaying
                    ? "0 0 8px rgba(255,255,255,0.6)"
                    : "0 0 4px rgba(255,255,255,0.3)",
                }}
                transition={TRANSITIONS.fade}
              />
            </motion.div>
          </div>

          {/* Waveform Visualization (decorative) */}
          {isPlaying && !reducedMotion && (
            <div className="absolute -top-2 left-0 right-0 flex items-center justify-center gap-0.5 pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={WAVEFORM_VARIANTS}
                  initial="idle"
                  animate="playing"
                  transition={{
                    delay: i * 0.03,
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-0.5 h-2 bg-white/20 rounded-full"
                  style={{ height: `${4 + Math.random() * 8}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Time */}
        <div className="flex justify-between text-xs text-white/55 mb-6">
          <span>{formatSeconds(currentTime)}</span>
          <span>{formatSeconds(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          {/* Captions toggle */}
          <motion.button
            type="button"
            onClick={onToggleCaptions}
            whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            transition={TRANSITIONS.interaction}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              showCaptions ? "text-white" : "text-white/55 hover:text-white/70"
            }`}
            aria-label={showCaptions ? "Hide captions" : "Show captions"}
            aria-pressed={showCaptions}
          >
            <Captions className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            type="button"
            onClick={handlePlayPause}
            whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            transition={TRANSITIONS.interaction}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center relative overflow-hidden"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying && !reducedMotion && (
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                animate={{ scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}

            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={TRANSITIONS.interaction}
                >
                  <Pause className="w-6 h-6 text-black fill-black" strokeWidth={0} />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={TRANSITIONS.interaction}
                >
                  <Play className="w-6 h-6 text-black fill-black ml-1" strokeWidth={0} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Volume */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <motion.button
              type="button"
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
              whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
              transition={TRANSITIONS.interaction}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label={volume > 0 ? "Mute" : "Unmute"}
            >
              {volume > 0 ? <Volume2 className="w-5 h-5" strokeWidth={1.5} /> : <VolumeX className="w-5 h-5" strokeWidth={1.5} />}
            </motion.button>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/95 border border-white/10 rounded-full p-3 backdrop-blur-xl"
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={e => onVolumeChange(parseFloat(e.target.value))}
                    className="w-20 accent-white"
                    style={{ writingMode: "vertical-lr" as const, direction: "rtl", height: 80 }}
                    aria-label="Volume"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chapter Crossfade Indicator */}
        <AnimatePresence>
          {isPlaying && progress > 95 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={TRANSITIONS.organic}
              className="mt-4 text-center"
            >
              <span className="text-xs text-white/55">Next chapter starting...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function formatSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
