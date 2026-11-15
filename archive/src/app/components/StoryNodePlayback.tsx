import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, Pause, Subtitles } from "lucide-react";
import { useState, useEffect } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface StoryNodePlaybackProps {
  nodeId: string;
  mediaType: "video" | "audio" | "visual";
  mediaUrl?: string;
  title: string;
  content?: string;
  imageUrl: string;
  audioSrc?: string;
  onClose: () => void;
  onComplete?: () => void;
}

export function StoryNodePlayback({
  nodeId,
  mediaType,
  mediaUrl,
  title,
  content,
  imageUrl,
  audioSrc,
  onClose,
  onComplete
}: StoryNodePlaybackProps) {
  const { state, updateAudioState } = useStoryState();
  const [showCaptions, setShowCaptions] = useState(state.accessibilityPreferences.captionsEnabled);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const audio = useAudioPlayer({
    src: audioSrc,
    autoPlay: false
  });

  // Auto-hide controls after 3 seconds without interaction
  useEffect(() => {
    if (!hasInteracted) return;
    
    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [controlsVisible, hasInteracted]);

  // Show controls on any interaction
  const handleInteraction = () => {
    setHasInteracted(true);
    setControlsVisible(true);
  };

  // Mark as complete when audio/video ends
  useEffect(() => {
    if (audio.currentTime > 0 && audio.currentTime >= audio.duration - 0.5) {
      if (onComplete) {
        onComplete();
      }
    }
  }, [audio.currentTime, audio.duration]);

  // Sync audio state
  useEffect(() => {
    updateAudioState({
      isPlaying: audio.isPlaying,
      playbackPosition: audio.currentTime
    });
  }, [audio.isPlaying, audio.currentTime]);

  // Calculate progress percentage
  const progress = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      className="fixed inset-0 bg-black z-50 overflow-hidden cursor-default"
    >
      {/* Background media */}
      <div className="absolute inset-0">
        {mediaType === "visual" && (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </>
        )}
        
        {mediaType === "video" && (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop={false}
              playsInline
            />
          </div>
        )}

        {mediaType === "audio" && (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover blur-xl scale-110"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
      </div>

      {/* Top controls - fade when inactive */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          >
            <div className="max-w-[428px] mx-auto flex items-center justify-between p-5 pt-8 pointer-events-auto">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`
                  w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors
                  ${showCaptions 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-black/40 border-white/10 hover:bg-black/60'
                  }
                `}
                aria-label="Toggle captions"
              >
                <Subtitles className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play/pause - only shows when paused or on interaction */}
      <AnimatePresence>
        {(!audio.isPlaying || (controlsVisible && hasInteracted)) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          >
            <button
              onClick={audio.togglePlay}
              className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-black/80 hover:scale-110 transition-all pointer-events-auto"
              aria-label={audio.isPlaying ? "Pause" : "Play"}
            >
              {audio.isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content overlay - immersive typography */}
      {content && (
        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-[428px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="p-8 pb-32"
          >
            <h2 className="text-2xl tracking-tight text-white mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              {content}
            </p>
          </motion.div>
        </div>
      )}

      {/* Captions */}
      <AnimatePresence>
        {showCaptions && audio.isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-0 right-0 z-10 max-w-[428px] mx-auto px-8"
          >
            <div className="p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10">
              <p className="text-sm text-white text-center leading-relaxed">
                [Ambient soundscape: gentle reverb, distant voices, urban textures]
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle progress indicator - bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-20">
        <motion.div
          className="h-full bg-white/30"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Playing indicator */}
      {audio.isPlaying && !controlsVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 z-20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-white"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
