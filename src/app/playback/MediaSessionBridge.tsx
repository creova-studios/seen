import { useEffect } from "react";
import { usePlayback, type Track } from "./PlaybackProvider";

/**
 * Lock-screen and notification controls (Media Session). When narration plays, the phone shows the chapter title,
 * the story's creator and cover art on the lock screen and in the notification shade, with play, pause, back 15 s,
 * forward 15 s and a scrub bar. In a browser, the installed app and the Expo shell, the web view hands this to
 * the system; where Media Session does not exist this does nothing.
 *
 * Honest limits: it controls whatever is playing. Recorded narration (an audio file) keeps going with the screen
 * off once the shell has an audio session (see mobile/src/WebShell.tsx). The device's built-in voice (the fallback
 * today, since no recordings ship yet) is speech synthesis, which the system may pause when the app is in the background.
 */
const SKIP_SECONDS = 15;

export function mediaMetadata(track: Track, storyTitle?: string) {
  return {
    title: track.title,
    artist: track.artist ?? "SEEN",
    album: storyTitle ?? "SEEN by CREOVA",
    artwork: track.coverImage ? [{ src: track.coverImage, sizes: "512x512", type: "image/jpeg" }] : [],
  };
}

type Session = {
  metadata: unknown;
  playbackState: string;
  setActionHandler: (action: string, handler: ((d: { seekTime?: number }) => void) | null) => void;
  setPositionState?: (s?: { duration: number; position: number; playbackRate: number }) => void;
};

const sessionOf = (): Session | null => (typeof navigator !== "undefined" && "mediaSession" in navigator ? ((navigator as unknown as { mediaSession: Session }).mediaSession) : null);

export function MediaSessionBridge() {
  const pb = usePlayback();
  const { track, status, source, elapsed, duration, rate } = pb;

  // What is playing.
  useEffect(() => {
    const ms = sessionOf();
    if (!ms) return;
    const MM = (window as unknown as { MediaMetadata?: new (init: object) => unknown }).MediaMetadata;
    ms.metadata = track && MM ? new MM(mediaMetadata(track)) : null;
  }, [track]);

  // Whether it is playing.
  useEffect(() => {
    const ms = sessionOf();
    if (!ms) return;
    ms.playbackState = !track || status === "idle" || status === "unavailable" ? "none" : status === "playing" || status === "loading" ? "playing" : "paused";
  }, [track, status]);

  // The scrub bar: only for recordings, where the length is real (the device voice's is an estimate).
  useEffect(() => {
    const ms = sessionOf();
    if (!ms?.setPositionState) return;
    try {
      if (track && source === "recording" && Number.isFinite(duration) && duration > 0) {
        ms.setPositionState({ duration, position: Math.min(elapsed, duration), playbackRate: rate });
      } else ms.setPositionState();
    } catch {
      /* some platforms reject odd values; the controls still work */
    }
  }, [track, source, elapsed, duration, rate]);

  // The buttons.
  useEffect(() => {
    const ms = sessionOf();
    if (!ms) return;
    const set = (a: string, h: ((d: { seekTime?: number }) => void) | null) => {
      try {
        ms.setActionHandler(a, h);
      } catch {
        /* action not supported here */
      }
    };
    set("play", () => pb.play());
    set("pause", () => pb.pause());
    set("stop", () => pb.stop());
    set("seekbackward", () => pb.skip(-SKIP_SECONDS));
    set("seekforward", () => pb.skip(SKIP_SECONDS));
    set("seekto", d => {
      if (typeof d.seekTime === "number" && duration > 0) pb.seek(Math.min(1, Math.max(0, d.seekTime / duration)));
    });
    return () => ["play", "pause", "stop", "seekbackward", "seekforward", "seekto"].forEach(a => set(a, null));
  }, [pb.play, pb.pause, pb.stop, pb.skip, pb.seek, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
