import { useState, useEffect, useRef } from 'react';

interface AudioPlayerOptions {
  src?: string;
  fadeDuration?: number;
  autoPlay?: boolean;
}

export function useAudioPlayer({ src, fadeDuration = 2000, autoPlay = false }: AudioPlayerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isFading, setIsFading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (src) {
      const audio = new Audio(src);
      audio.volume = volume;
      audioRef.current = audio;

      // Event listeners
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      if (autoPlay) {
        fadeIn();
      }

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [src]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Fade in audio
  const fadeIn = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsFading(true);
    audio.volume = 0;
    
    try {
      await audio.play();
      setIsPlaying(true);

      let currentVolume = 0;
      const targetVolume = volume;
      const steps = fadeDuration / 50;
      const volumeIncrement = targetVolume / steps;

      fadeIntervalRef.current = setInterval(() => {
        currentVolume += volumeIncrement;
        if (currentVolume >= targetVolume) {
          currentVolume = targetVolume;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
          setIsFading(false);
        }
        if (audio) {
          audio.volume = currentVolume;
        }
      }, 50);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsFading(false);
    }
  };

  // Fade out audio
  const fadeOut = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsFading(true);
    let currentVolume = audio.volume;
    const steps = fadeDuration / 50;
    const volumeDecrement = currentVolume / steps;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      currentVolume -= volumeDecrement;
      if (currentVolume <= 0) {
        currentVolume = 0;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        audio.pause();
        setIsPlaying(false);
        setIsFading(false);
        audio.volume = volume; // Reset to original volume
      }
      audio.volume = currentVolume;
    }, 50);
  };

  // Play/pause with fade
  const togglePlay = () => {
    if (isPlaying) {
      fadeOut();
    } else {
      fadeIn();
    }
  };

  const play = () => {
    if (!isPlaying) {
      fadeIn();
    }
  };

  const pause = () => {
    if (isPlaying) {
      fadeOut();
    }
  };

  // Seek to position
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isFading,
    togglePlay,
    play,
    pause,
    fadeIn,
    fadeOut,
    seek,
    setVolume,
  };
}
