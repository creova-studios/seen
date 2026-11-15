import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Music, Wind, Mic, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface AudioLayer {
  id: string;
  type: "music" | "ambient" | "narration";
  name: string;
  url: string;
  volume: number;
  fadeIn: number; // duration in ms
  fadeOut: number; // duration in ms
  loop: boolean;
  startTime?: number; // when to start in the chapter
}

interface AudioLayerControlProps {
  chapterId: string;
  layers: AudioLayer[];
  onUpdateLayers: (layers: AudioLayer[]) => void;
  autoHideControls?: boolean;
}

export function AudioLayerControl({
  chapterId,
  layers,
  onUpdateLayers,
  autoHideControls = true
}: AudioLayerControlProps) {
  const { state } = useStoryState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [playingLayers, setPlayingLayers] = useState<Set<string>>(new Set());
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      audioLayers: {
        en: "Audio Layers",
        fr: "Couches Audio",
        es: "Capas de Audio"
      },
      music: {
        en: "Background Music",
        fr: "Musique de Fond",
        es: "Música de Fondo"
      },
      ambient: {
        en: "Ambient Sounds",
        fr: "Sons Ambiants",
        es: "Sonidos Ambientales"
      },
      narration: {
        en: "Narration",
        fr: "Narration",
        es: "Narración"
      },
      volume: {
        en: "Volume",
        fr: "Volume",
        es: "Volumen"
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  // Auto-hide logic
  useEffect(() => {
    if (autoHideControls && !isExpanded) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [autoHideControls, isExpanded]);

  const handleInteraction = () => {
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (autoHideControls && !isExpanded) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  };

  const updateLayerVolume = (layerId: string, volume: number) => {
    onUpdateLayers(
      layers.map(layer => 
        layer.id === layerId ? { ...layer, volume } : layer
      )
    );

    // Update actual audio element volume
    const audioEl = audioRefs.current.get(layerId);
    if (audioEl) {
      audioEl.volume = volume;
    }
  };

  const toggleLayerMute = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    updateLayerVolume(layerId, layer.volume === 0 ? 0.7 : 0);
  };

  const togglePlayPause = (layerId: string) => {
    const audioEl = audioRefs.current.get(layerId);
    if (!audioEl) return;

    if (playingLayers.has(layerId)) {
      audioEl.pause();
      setPlayingLayers(prev => {
        const next = new Set(prev);
        next.delete(layerId);
        return next;
      });
    } else {
      audioEl.play();
      setPlayingLayers(prev => new Set(prev).add(layerId));
    }
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case "music":
        return <Music className="w-4 h-4" />;
      case "ambient":
        return <Wind className="w-4 h-4" />;
      case "narration":
        return <Mic className="w-4 h-4" />;
      default:
        return <Volume2 className="w-4 h-4" />;
    }
  };

  const getLayerColor = (type: string) => {
    switch (type) {
      case "music":
        return "purple";
      case "ambient":
        return "blue";
      case "narration":
        return "green";
      default:
        return "white";
    }
  };

  if (!isVisible && autoHideControls) {
    // Show minimal indicator
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setIsVisible(true);
          handleInteraction();
        }}
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all z-30"
      >
        <Volume2 className="w-5 h-5 text-white/70" />
      </motion.button>
    );
  }

  return (
    <>
      {/* Audio elements (hidden) */}
      {layers.map(layer => (
        <audio
          key={layer.id}
          ref={el => {
            if (el) audioRefs.current.set(layer.id, el);
          }}
          src={layer.url}
          loop={layer.loop}
          volume={layer.volume}
          preload="auto"
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
        className="fixed bottom-24 right-6 z-30"
      >
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Collapsed header */}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              handleInteraction();
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                {layers.slice(0, 3).map(layer => {
                  const color = getLayerColor(layer.type);
                  return (
                    <div
                      key={layer.id}
                      className={`w-6 h-6 rounded-full bg-${color}-500/20 border border-${color}-400/30 flex items-center justify-center`}
                    >
                      {getLayerIcon(layer.type)}
                    </div>
                  );
                })}
              </div>
              <div>
                <span className="text-xs text-white/70 block">
                  {getText("audioLayers")}
                </span>
                <span className="text-xs text-white/40">
                  {layers.filter(l => playingLayers.has(l.id)).length}/{layers.length} {state.language === 'en' ? 'playing' : state.language === 'fr' ? 'en cours' : 'reproduciendo'}
                </span>
              </div>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-white/40" />
            ) : (
              <ChevronUp className="w-4 h-4 text-white/40" />
            )}
          </button>

          {/* Expanded controls */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/5"
              >
                <div className="p-4 space-y-4" style={{ width: "320px" }}>
                  {layers.map((layer, index) => {
                    const color = getLayerColor(layer.type);
                    const isPlaying = playingLayers.has(layer.id);

                    return (
                      <motion.div
                        key={layer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        {/* Layer header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 border border-${color}-400/30 flex items-center justify-center text-${color}-300`}>
                              {getLayerIcon(layer.type)}
                            </div>
                            <div>
                              <h4 className="text-sm text-white">{layer.name}</h4>
                              <span className="text-xs text-white/40 capitalize">
                                {layer.type}
                              </span>
                            </div>
                          </div>

                          {/* Mute toggle */}
                          <button
                            onClick={() => toggleLayerMute(layer.id)}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            {layer.volume === 0 ? (
                              <VolumeX className="w-4 h-4 text-white/40" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-white/70" />
                            )}
                          </button>
                        </div>

                        {/* Volume slider */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">{getText("volume")}</span>
                            <span className="text-xs text-white/60">{Math.round(layer.volume * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={layer.volume}
                            onChange={(e) => updateLayerVolume(layer.id, parseFloat(e.target.value))}
                            className="w-full h-1 rounded-full appearance-none bg-white/10 cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, rgba(168, 85, 247, 0.5) 0%, rgba(168, 85, 247, 0.5) ${layer.volume * 100}%, rgba(255, 255, 255, 0.1) ${layer.volume * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                            }}
                          />
                        </div>

                        {/* Fade settings */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3">
                          <div className="text-xs text-white/30">
                            {state.language === 'en' ? 'Fade' : state.language === 'fr' ? 'Fondu' : 'Fundido'}: {layer.fadeIn / 1000}s / {layer.fadeOut / 1000}s
                          </div>
                          {layer.loop && (
                            <div className="text-xs text-white/30">
                              {state.language === 'en' ? 'Loop' : state.language === 'fr' ? 'Boucle' : 'Bucle'}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

// Hook to manage audio layer transitions between chapters
export function useAudioLayerTransition(
  fromLayers: AudioLayer[],
  toLayers: AudioLayer[],
  onTransitionComplete: () => void
) {
  useEffect(() => {
    const fadeOutDuration = Math.max(...fromLayers.map(l => l.fadeOut), 0);
    const fadeInDuration = Math.max(...toLayers.map(l => l.fadeIn), 0);

    // Fade out old layers
    fromLayers.forEach(layer => {
      // Implementation would use Web Audio API for smooth fades
    });

    // Wait for fade out, then fade in new layers
    const transitionTimeout = setTimeout(() => {
      toLayers.forEach(layer => {
        // Implementation would use Web Audio API for smooth fades
      });
      
      setTimeout(() => {
        onTransitionComplete();
      }, fadeInDuration);
    }, fadeOutDuration);

    return () => clearTimeout(transitionTimeout);
  }, [fromLayers, toLayers, onTransitionComplete]);
}
