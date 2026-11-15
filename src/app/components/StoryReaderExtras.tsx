/**
 * Reader additions from Figma (Transcript, Captions, player states, Story Completion). Everything shown is real:
 * the transcript is the chapter text, captions follow the device voice only, completion uses real counts.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Captions, FileText, Play } from "lucide-react";
import { Banner, Button } from "./seen/primitives";
import { Sheet } from "./seen/overlays";
import { RailCard, Rail } from "./ForYouSections";
import { SectionHeader } from "./SectionHeader";
import { useT } from "../i18n/useT";
import { useAppNav } from "../navigation/AppNav";
import { searchByTheme } from "../data/searchService";
import { getLocalizedText, type Language, type StoryWorld } from "../data/storyDatabase";

/** Splits chapter text into readable paragraphs (blank lines, or every two sentences when it is one block). */
export function transcriptParagraphs(text: string): string[] {
  const blocks = text.split(/\n{2,}|\n/).map(b => b.trim()).filter(Boolean);
  if (blocks.length > 1) return blocks;
  const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) out.push(sentences.slice(i, i + 2).join(" "));
  return out.length ? out : [text];
}

export const sentencesOf = (text: string) => text.split(/(?<=[.!?…])\s+/).filter(Boolean);

/** Which sentence is being spoken, from playback progress (0 to 1). Timing is by position in the text, not per-word cues. */
export function sentenceIndexAt(count: number, progress: number): number {
  return count === 0 ? 0 : Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

/** The sentence being spoken, from the device voice's progress. */
export function currentSentence(text: string, progress: number): string {
  const sentences = sentencesOf(text);
  return sentences.length === 0 ? "" : sentences[sentenceIndexAt(sentences.length, progress)];
}

/**
 * The chapter text with the spoken sentence lit and kept in view while it plays (follow-along reading).
 * The reader can scroll away at any time: that pauses following until they tap "Follow along".
 * Nothing scrolls unless the content is playing, and reduced motion jumps instead of gliding.
 */
export function FollowAlongText({
  text,
  progress,
  playing,
  scroller,
  reducedMotion,
  chapterKey,
}: {
  text: string;
  progress: number;
  playing: boolean;
  scroller: React.RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  chapterKey: string;
}) {
  const t = useT();
  const sentences = sentencesOf(text);
  const index = sentenceIndexAt(sentences.length, progress);
  const lit = playing || progress > 0;
  const [paused, setPaused] = useState(false);
  const current = useRef<HTMLSpanElement | null>(null);

  useEffect(() => setPaused(false), [chapterKey]);

  // Touching or scrolling the text hands control to the reader.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const stop = () => setPaused(true);
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchmove", stop, { passive: true });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, [scroller]);

  const follow = () => {
    const box = scroller.current;
    const el = current.current;
    if (!box || !el) return;
    const b = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    box.scrollBy({ top: r.top - b.top - b.height * 0.35, behavior: reducedMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (playing && !paused) follow();
  }, [index, playing, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <p data-selectable className="text-base leading-relaxed">
        {sentences.map((s, i) => {
          const on = lit && i === index;
          return (
            <span
              key={i}
              ref={on ? current : undefined}
              data-current={on ? "true" : undefined}
              className={`transition-colors duration-[var(--seen-duration-fast)] ${on ? "text-white bg-white/10 rounded-sm box-decoration-clone px-0.5" : lit ? "text-white/55" : "text-white/70"}`}
            >
              {s}
              {i < sentences.length - 1 ? " " : ""}
            </span>
          );
        })}
      </p>
      {playing && paused && (
        <button
          type="button"
          onClick={() => {
            setPaused(false);
            follow();
          }}
          className="sticky bottom-2 self-center min-h-11 px-4 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-[0.12em] shadow-lg"
        >
          {t("reader.followAlong")}
        </button>
      )}
    </>
  );
}

export function TranscriptSheet({ open, onOpenChange, chapterTitle, text }: { open: boolean; onOpenChange: (o: boolean) => void; chapterTitle: string; text: string }) {
  const t = useT();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={t("reader.transcript")} description={chapterTitle} footer={<Button fullWidth variant="secondary" onClick={() => onOpenChange(false)}>{t("note.done")}</Button>}>
      <div className="space-y-4">
        {transcriptParagraphs(text).map((p, i) => (
          <p key={i} data-selectable className="text-[15px] leading-[1.6] text-white/85">{p}</p>
        ))}
        <p className="text-xs text-seen-muted pt-2">{t("reader.transcript.note")}</p>
      </div>
    </Sheet>
  );
}

/** Reader controls for transcript and captions, 44 px each. */
export function ReaderTools({ captionsOn, onToggleCaptions, onOpenTranscript }: { captionsOn: boolean; onToggleCaptions: () => void; onOpenTranscript: () => void }) {
  const t = useT();
  const cls = "min-h-11 px-3 rounded-full flex items-center gap-2 text-xs tracking-wider uppercase transition-colors duration-[var(--seen-duration-fast)]";
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-pressed={captionsOn} onClick={onToggleCaptions} className={`${cls} ${captionsOn ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>
        <Captions className="w-4 h-4" aria-hidden /> <span className="sr-only sm:not-sr-only">{t("reader.captions")}</span>
      </button>
      <button type="button" onClick={onOpenTranscript} className={`${cls} bg-white/10 text-white hover:bg-white/20`}>
        <FileText className="w-4 h-4" aria-hidden /> <span className="sr-only sm:not-sr-only">{t("reader.transcript")}</span>
      </button>
    </div>
  );
}

/** One line of caption while the device voice speaks; hidden for recordings (no timed cues exist). */
export function CaptionBar({ text, progress, show }: { text: string; progress: number; show: boolean }) {
  if (!show) return null;
  return (
    <div aria-hidden className="rounded-seen-md bg-black/70 border border-white/10 px-4 py-2 text-center text-[15px] leading-snug text-white">
      {currentSentence(text, progress)}
    </div>
  );
}

/** Buffering and failure states of the player, wired to the real playback status. */
export function PlayerAlert({ status, onRetry }: { status: string; onRetry: () => void }) {
  const t = useT();
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    if (status !== "loading") return;
    const id = setTimeout(() => setSlow(true), 1200);
    return () => clearTimeout(id);
  }, [status]);
  if (status === "unavailable") {
    return (
      <Banner tone="error" className="text-left">
        <p>{t("reader.failed")}</p>
        <button type="button" onClick={onRetry} className="mt-2 min-h-11 underline underline-offset-2">{t("reader.retry")}</button>
      </Banner>
    );
  }
  if (status === "loading" && slow) return <p role="status" className="text-xs text-seen-muted text-center">{t("reader.loading")}</p>;
  return null;
}

/** Full-screen end of story (Figma 329:16) with only real data: counts, related stories by shared theme. */
export function StoryCompletion({ story, language, minutes, chapterCount, onReflect, onKeepReading, onLibrary }: {
  story: StoryWorld;
  language: Language;
  minutes: number;
  chapterCount: number;
  onReflect: () => void;
  onKeepReading: () => void;
  onLibrary: () => void;
}) {
  const t = useT();
  const nav = useAppNav();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onKeepReading);
  closeRef.current = onKeepReading;
  // Hand-rolled modal: move focus in, close on Escape, keep Tab inside, and give focus back on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;
    node?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
      } else if (e.key === "Tab" && node) {
        const f = [...node.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])")].filter(x => !x.hasAttribute("disabled"));
        if (f.length === 0) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); opener?.focus?.(); };
  }, []);
  const title = getLocalizedText(story.title, language);
  const related = [...new Map(story.culturalThemes.flatMap(th => searchByTheme(th, language)).filter(i => i.id !== story.id).map(i => [i.id, i])).values()].slice(0, 4);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} ref={dialogRef} className="fixed inset-0 z-[55] bg-seen-canvas overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="done-title">
      <div className="max-w-(--seen-content-max) mx-auto px-gutter pt-header pb-clearance">
        <p className="font-seen-mono text-[11px] tracking-[0.8px] uppercase text-seen-muted">{t("done.eyebrow")}</p>
        <h2 id="done-title" className="font-seen-display text-[34px] leading-[1.16] tracking-[-0.5px] text-white mt-3">{t("done.title", { title })}</h2>
        <p className="text-[13px] text-seen-secondary mt-3">
          {getLocalizedText(story.creator, language)} · {t("done.meta", { n: String(chapterCount), m: String(minutes) })}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button shape="rounded" fullWidth icon={<Play className="w-3.5 h-3.5" aria-hidden />} onClick={onReflect}>{t("done.reflect")}</Button>
          <Button shape="rounded" fullWidth variant="secondary" onClick={onLibrary}>{t("done.library")}</Button>
          <Button shape="rounded" fullWidth variant="ghost" onClick={onKeepReading}>{t("done.close")}</Button>
        </div>
        {related.length > 0 && (
          <section className="mt-10" aria-label={t("done.related")}>
            <SectionHeader title={t("done.related")} />
            <Rail>
              {related.map(r => (
                <RailCard key={r.id} w={150} h={200} onSelect={id => nav.openStory(id)} item={{ id: r.id, title: r.title, eyebrow: r.type, imageUrl: r.mediaSource }} />
              ))}
            </Rail>
          </section>
        )}
      </div>
    </motion.div>
  );
}
