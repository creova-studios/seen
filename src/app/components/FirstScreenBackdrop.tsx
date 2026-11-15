import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getPublicStories } from "../data/storyDatabase";
import { SeenImage } from "./seen/SeenImage";

/**
 * What SEEN is about, shown not told (PR-6): the covers of real stories in the catalogue drift behind the
 * protected entry screen, slowly crossfading with a gentle zoom, with a quiet sound-wave along the bottom.
 * Decoration only: hidden from assistive tech, never clickable, and the screen's content and order are untouched.
 *
 * Kind to the phone and the person: only the first image loads up front (the rest follow after the screen is
 * up); reduced motion and data saver get that single still image; a scrim keeps the text at 4.5:1 or better
 * even over a pure white photo (checked in e2e/first-screen-contrast.spec.ts). Offline falls back to a gradient.
 */
const SLIDES = getPublicStories()
  .filter(s => s.coverImage)
  .slice(0, 6)
  .map(s => ({ id: s.id, src: s.coverImage }));
const HOLD_MS = 6500;
const BARS = Array.from({ length: 32 }, (_, i) => ({ i, base: 0.25 + 0.55 * Math.abs(Math.sin(i * 1.7)) }));

const saveDataOn = () => !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

export function FirstScreenBackdrop({ reduce }: { reduce: boolean }) {
  const still = reduce || saveDataOn();
  const [mounted, setMounted] = useState(1); // images in the DOM: one first, the rest once the screen is up
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (still || SLIDES.length < 2) return;
    const more = setTimeout(() => setMounted(SLIDES.length), 2000);
    const next = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), HOLD_MS);
    return () => {
      clearTimeout(more);
      clearInterval(next);
    };
  }, [still]);

  return (
    <div aria-hidden data-testid="first-screen-backdrop" className="fixed inset-0 overflow-hidden pointer-events-none bg-black">
      {SLIDES.slice(0, still ? 1 : mounted).map((s, i) => (
        <div
          key={s.id}
          data-slide={i === index ? "active" : undefined}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <div className={`absolute inset-0 ${i === index && !still ? "seen-kenburns" : ""}`}>
            <SeenImage src={s.src} alt="" decorative seed={s.id} className="w-full h-full object-cover" />
          </div>
        </div>
      ))}
      {/* Scrim: dark behind the words (middle of the screen) so small text stays readable over any photo, light at the top and bottom so the image reads. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.40)_12%,rgba(0,0,0,0.72)_26%,rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.38)_90%,rgba(0,0,0,0.5)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-center gap-[3px] px-6 opacity-[0.10]">
        {BARS.map(b => (
          <motion.span
            key={b.i}
            style={{ height: "100%", originY: 1 }}
            initial={{ scaleY: b.base }}
            animate={still ? { scaleY: b.base } : { scaleY: [b.base, Math.min(1, b.base + 0.35), Math.max(0.12, b.base - 0.2), b.base] }}
            transition={still ? { duration: 0 } : { duration: 4 + (b.i % 5), repeat: Infinity, ease: "easeInOut", delay: (b.i % 8) * 0.25 }}
            className="w-[3px] rounded-full bg-white"
          />
        ))}
      </div>
    </div>
  );
}
