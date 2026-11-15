import { ChevronDown, Pause, Play, RotateCcw, RotateCw, X, Mic, AudioLines } from "lucide-react";
import { useEffect } from "react";
import { formatTime, PLAYBACK_RATES, usePlayback } from "../../playback/PlaybackProvider";
import { IconButton } from "./primitives";
import { Sheet } from "./overlays";
import { SeenImage } from "./SeenImage";

/**
 * Figma "Media Player Bar" (363:67): Variant=Mini docks above the bottom nav
 * whenever something is loaded; tapping it opens Variant=Expanded (a sheet).
 */
export function MediaPlayerBar({ onOpenChapter, bottomOffset }: { onOpenChapter: (storyId: string, chapterId: string) => void; bottomOffset: boolean }) {
  const p = usePlayback();
  const active = !!p.track;
  // Reserve space at the bottom of every screen while the bar is docked (see seen-tokens.css).
  useEffect(() => {
    document.documentElement.dataset.player = active ? "on" : "off";
    return () => {
      document.documentElement.dataset.player = "off";
    };
  }, [active]);
  if (!p.track) return null;
  const { track } = p;
  const playing = p.status === "playing";
  const unavailable = p.status === "unavailable";

  return (
    <>
      <div
        data-testid="mini-player"
        className={`fixed left-0 right-0 z-40 px-3 ${bottomOffset ? "bottom-[76px]" : "bottom-3"} pointer-events-none`}
      >
        <div className="pointer-events-auto max-w-[412px] mx-auto rounded-seen-lg border border-seen-border bg-seen-elevated/95 backdrop-blur-xl shadow-[var(--seen-elevation-2)] overflow-hidden">
          <div className="h-0.5 bg-white/10" aria-hidden>
            <div className="h-full bg-white transition-[width]" style={{ width: `${p.progress * 100}%` }} />
          </div>
          <div className="flex items-center gap-3 pl-2 pr-1 py-2">
            <button
              type="button"
              onClick={() => p.setExpanded(true)}
              className="flex items-center gap-3 min-w-0 flex-1 text-left min-h-11"
              aria-label={`Open player: ${track.title}`}
            >
              <span className="relative w-10 h-10 rounded-seen-sm overflow-hidden flex-shrink-0">
                <SeenImage src={track.coverImage} alt="" decorative seed={track.storyId} className="absolute inset-0 w-full h-full object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-white truncate">{track.title}</span>
                <span className="block text-xs text-seen-muted truncate">
                  {unavailable ? "Narration not available" : p.source === "voice" ? "Device voice" : track.artist ?? "Narration"}
                </span>
              </span>
            </button>
            <IconButton label={playing ? "Pause" : "Play"} onClick={p.toggle} disabled={unavailable}>
              {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
            </IconButton>
            <IconButton label="Close player" variant="ghost" onClick={p.stop}>
              <X className="w-4 h-4 text-white/70" />
            </IconButton>
          </div>
        </div>
      </div>

      <Sheet open={p.expanded} onOpenChange={p.setExpanded} title="Now playing" description={track.artist}>
        <ExpandedPlayer onOpenChapter={() => { p.setExpanded(false); onOpenChapter(track.storyId, track.chapterId); }} />
      </Sheet>
    </>
  );
}

/** Variant=Expanded — also reused inside the chapter reader. */
export function ExpandedPlayer({ onOpenChapter, compact = false }: { onOpenChapter?: () => void; compact?: boolean }) {
  const p = usePlayback();
  if (!p.track) return null;
  const playing = p.status === "playing";
  const unavailable = p.status === "unavailable";
  return (
    <div data-testid="expanded-player">
      {!compact && (
        <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-seen-lg overflow-hidden">
          <SeenImage src={p.track.coverImage} alt="" decorative seed={p.track.storyId} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
      <div className={compact ? "" : "mt-5 text-center"}>
        <p className="text-base text-white font-medium">{p.track.title}</p>
        <p className="text-xs text-seen-muted mt-1 inline-flex items-center gap-1.5">
          {p.source === "voice" ? (
            <>
              <Mic className="w-3 h-3" aria-hidden /> Read aloud by your device's voice — recorded narration coming soon
            </>
          ) : p.source === "recording" ? (
            <>
              <AudioLines className="w-3 h-3" aria-hidden /> Recorded narration
            </>
          ) : unavailable ? (
            "Narration isn't available for this chapter on this device."
          ) : (
            "Loading…"
          )}
        </p>
      </div>

      <div className={compact ? "mt-2" : "mt-5"}>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(p.progress * 1000)}
          onChange={e => p.seek(Number(e.target.value) / 1000)}
          disabled={unavailable || !p.duration}
          aria-label="Playback position"
          aria-valuetext={`${formatTime(p.elapsed)} of ${formatTime(p.duration)}`}
          className="w-full accent-white h-11"
        />
        <div className="flex justify-between text-[11px] text-seen-muted tabular-nums -mt-2">
          <span>{formatTime(p.elapsed)}</span>
          <span>
            {p.source === "voice" ? "≈ " : ""}
            {formatTime(p.duration)}
          </span>
        </div>
      </div>

      <div className={`flex items-center justify-center ${compact ? "gap-4 mt-1" : "gap-6 mt-3"}`}>
        <IconButton label="Back 15 seconds" variant="ghost" onClick={() => p.skip(-15)} disabled={unavailable}>
          <RotateCcw className="w-5 h-5 text-white/80" />
        </IconButton>
        <button
          type="button"
          onClick={p.toggle}
          disabled={unavailable}
          aria-label={playing ? "Pause" : "Play"}
          className={`${compact ? "w-12 h-12" : "w-16 h-16"} rounded-full bg-white text-black flex items-center justify-center disabled:opacity-40`}
        >
          {playing ? <Pause className="w-6 h-6" aria-hidden /> : <Play className="w-6 h-6 ml-1" aria-hidden />}
        </button>
        <IconButton label="Forward 15 seconds" variant="ghost" onClick={() => p.skip(15)} disabled={unavailable}>
          <RotateCw className="w-5 h-5 text-white/80" />
        </IconButton>
      </div>
      {(
        <div className="flex justify-center mt-1">
          <button
            type="button"
            disabled={unavailable}
            onClick={() => p.setRate(PLAYBACK_RATES[(PLAYBACK_RATES.indexOf(p.rate as (typeof PLAYBACK_RATES)[number]) + 1) % PLAYBACK_RATES.length])}
            aria-label={`Playback speed ${p.rate}x. Change speed`}
            className="min-h-11 min-w-11 px-4 rounded-full border border-white/20 text-sm text-white/85 tabular-nums hover:bg-white/5 disabled:opacity-40"
          >
            {p.rate}×
          </button>
        </div>
      )}

      {onOpenChapter && (
        <button
          type="button"
          onClick={onOpenChapter}
          className="mt-6 w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-[11px] tracking-[0.14em] uppercase text-white/80 hover:bg-white/5"
        >
          <ChevronDown className="w-4 h-4 rotate-180" aria-hidden /> Open chapter text
        </button>
      )}
    </div>
  );
}
