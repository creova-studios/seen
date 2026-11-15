import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Language } from './data';

/**
 * The native audio player.
 * - A recording (an http(s) audio file) plays through the system audio player, with lock-screen and notification
 *   controls, and keeps going with the screen off.
 * - With no recording, the phone's own voice reads the chapter (text-to-speech). Progress is estimated from the
 *   number of words, as on the website. The system may pause the device voice in the background.
 */
export interface Track {
  storyId: string;
  chapterId: string;
  title: string;
  artist: string;
  text: string;
  lang: Language;
  /** A recording: a bundled audio asset (number) or an http(s) address. */
  src?: string | number;
  coverImage?: string;
}
export type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'unavailable';

/** What happened when the audio session was set up, shown by the Sound check in Profile. */
export const audioSetup = { silent: 'not tried' as string, background: 'not tried' as string };

/**
 * Two separate calls on purpose: sound with the ringer switch on silent is the part that must not fail. Background
 * playback needs a development build and can be refused in Expo Go; that must not take the first part down with it.
 */
export async function configureAudio() {
  try {
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'doNotMix' });
    audioSetup.silent = 'ok';
  } catch (e) {
    audioSetup.silent = `failed: ${(e as Error)?.message ?? e}`;
  }
  try {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' });
    audioSetup.background = 'ok';
  } catch (e) {
    audioSetup.background = `not available here: ${(e as Error)?.message ?? e}`;
  }
}

const WORDS_PER_SECOND = 2.5;
const LANG_TAG: Record<Language, string> = { en: 'en-CA', fr: 'fr-CA', es: 'es-ES' };
export const RATES = [0.75, 1, 1.25, 1.5] as const;

interface PlayerApi {
  track: Track | null;
  status: Status;
  source: 'recording' | 'voice' | null;
  progress: number; // 0..1
  elapsed: number;
  duration: number;
  rate: number;
  load: (t: Track, autoplay?: boolean) => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  seek: (fraction: number) => void;
  skip: (seconds: number) => void;
  stop: () => void;
  setRate: (r: number) => void;
}

const Ctx = createContext<PlayerApi | null>(null);
export const usePlayer = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return v;
};

const isPlayable = (s?: string | number) => typeof s === 'number' || (typeof s === 'string' && /^https?:\/\//.test(s));

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<Track | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [source, setSource] = useState<'recording' | 'voice' | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRateState] = useState(1);

  const audio = useRef<AudioPlayer | null>(null);
  const trackRef = useRef<Track | null>(null);
  const statusRef = useRef<Status>('idle');
  const elapsedRef = useRef(0);
  const durationRef = useRef(0);
  const rateRef = useRef(1);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const sourceRef = useRef<'recording' | 'voice' | null>(null);

  const set = useCallback((s: Status) => {
    statusRef.current = s;
    setStatus(s);
  }, []);
  const setTime = useCallback((e: number, d?: number) => {
    elapsedRef.current = e;
    setElapsed(e);
    if (d !== undefined) {
      durationRef.current = d;
      setDuration(d);
    }
  }, []);

  useEffect(() => {
    configureAudio();
  }, []);

  const clearTick = () => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
  };

  const teardown = useCallback(() => {
    clearTick();
    Speech.stop();
    if (audio.current) {
      try {
        audio.current.pause();
        audio.current.clearLockScreenControls?.();
        audio.current.remove();
      } catch {
        /* already released */
      }
      audio.current = null;
    }
  }, []);

  // ---- device voice
  const speakFrom = useCallback(
    (startSeconds: number) => {
      const t = trackRef.current;
      if (!t) return;
      Speech.stop();
      const words = t.text.split(/\s+/);
      const startWord = Math.min(words.length - 1, Math.floor(startSeconds * WORDS_PER_SECOND));
      const rest = words.slice(Math.max(0, startWord)).join(' ');
      setTime(startSeconds);
      set('playing');
      Speech.speak(rest, {
        language: LANG_TAG[t.lang],
        rate: rateRef.current,
        onDone: () => {
          clearTick();
          setTime(durationRef.current);
          set('ended');
        },
        onError: () => {
          clearTick();
          set('unavailable');
        },
      });
      clearTick();
      tick.current = setInterval(() => {
        if (statusRef.current !== 'playing') return;
        setTime(Math.min(durationRef.current, elapsedRef.current + 0.25 * rateRef.current));
      }, 250);
    },
    [set, setTime],
  );

  const load = useCallback(
    (t: Track, autoplay = false) => {
      teardown();
      trackRef.current = t;
      setTrack(t);
      const words = t.text.split(/\s+/).length;
      if (isPlayable(t.src)) {
        sourceRef.current = 'recording';
        setSource('recording');
        set('loading');
        setTime(0, 0);
        try {
          const p = createAudioPlayer(typeof t.src === 'number' ? t.src : { uri: t.src as string });
          audio.current = p;
          p.setActiveForLockScreen(true, { title: t.title, artist: t.artist, albumTitle: 'SEEN by CREOVA', artworkUrl: t.coverImage });
          p.addListener('playbackStatusUpdate', s => {
            if (audio.current !== p) return;
            setTime(s.currentTime ?? 0, s.duration && s.duration > 0 ? s.duration : durationRef.current);
            if (s.didJustFinish) set('ended');
            else if (s.isLoaded) set(s.playing ? 'playing' : statusRef.current === 'ended' ? 'ended' : 'paused');
          });
          p.setPlaybackRate?.(rateRef.current);
          if (autoplay) p.play();
        } catch {
          set('unavailable');
        }
      } else {
        sourceRef.current = 'voice';
        setSource('voice');
        setTime(0, Math.max(1, words / WORDS_PER_SECOND));
        set('paused');
        if (autoplay) speakFrom(0);
      }
    },
    [set, setTime, speakFrom, teardown],
  );

  const play = useCallback(() => {
    if (!trackRef.current) return;
    if (sourceRef.current === 'recording') {
      if (statusRef.current === 'ended') audio.current?.seekTo(0);
      audio.current?.play();
    } else speakFrom(statusRef.current === 'ended' ? 0 : elapsedRef.current);
  }, [speakFrom]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    if (sourceRef.current === 'recording') audio.current?.pause();
    else {
      Speech.stop();
      clearTick();
      set('paused');
    }
  }, [set]);

  const toggle = useCallback(() => (statusRef.current === 'playing' ? pause() : play()), [pause, play]);

  const seek = useCallback(
    (fraction: number) => {
      const target = Math.max(0, Math.min(1, fraction)) * durationRef.current;
      if (sourceRef.current === 'recording') audio.current?.seekTo(target);
      else if (statusRef.current === 'playing') speakFrom(target);
      else setTime(target);
    },
    [setTime, speakFrom],
  );

  const skip = useCallback((seconds: number) => seek((elapsedRef.current + seconds) / Math.max(1, durationRef.current)), [seek]);

  const stop = useCallback(() => {
    teardown();
    trackRef.current = null;
    sourceRef.current = null;
    setTrack(null);
    setSource(null);
    setTime(0, 0);
    set('idle');
  }, [set, setTime, teardown]);

  const setRate = useCallback(
    (r: number) => {
      rateRef.current = r;
      setRateState(r);
      audio.current?.setPlaybackRate?.(r);
      if (sourceRef.current === 'voice' && statusRef.current === 'playing') speakFrom(elapsedRef.current);
    },
    [speakFrom],
  );

  useEffect(() => teardown, [teardown]);

  const value = useMemo<PlayerApi>(
    () => ({ track, status, source, progress: duration > 0 ? Math.min(1, elapsed / duration) : 0, elapsed, duration, rate, load, toggle, play, pause, seek, skip, stop, setRate }),
    [track, status, source, elapsed, duration, rate, load, toggle, play, pause, seek, skip, stop, setRate],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const formatTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};
