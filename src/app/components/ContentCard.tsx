import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { CARD_VARIANTS, TRANSITIONS, getStaggerDelay, triggerHaptic, prefersReducedMotion } from "../utils/motion";
import { SeenImage } from "./seen/SeenImage";

/**
 * Feature card (Figma Story Card, Layout=Landscape/Portrait).
 *
 * Layout contract (fixes the card-alignment defects found in the audit):
 * - one tap target: the card itself is the button; callers must NOT wrap it
 *   in another clickable element or overlay their own badges on top of it
 * - top-left slot = content type, top-right slot = status (progress, saved…)
 * - title clamps to 2 lines, subtitle to 2 lines, byline to 1 line
 * - fixed aspect ratio so cards in a list/grid line up at any text length
 */
interface ContentCardProps {
  id: string;
  title: string;
  /** Byline, e.g. creator name. */
  creator?: string;
  /** Short description under the title. */
  subtitle?: string;
  duration?: string;
  imageUrl?: string;
  /** Top-left label (content type). */
  typeLabel?: ReactNode;
  /** Top-right status badge. */
  badge?: ReactNode;
  index?: number;
  aspect?: "portrait" | "landscape";
  onSelect: (id: string) => void;
}

export function ContentCard({
  id,
  title,
  creator,
  subtitle,
  duration,
  imageUrl,
  typeLabel,
  badge,
  index = 0,
  aspect = "portrait",
  onSelect,
}: ContentCardProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.button
      type="button"
      data-testid="content-card"
      onClick={() => {
        triggerHaptic("light");
        onSelect(id);
      }}
      variants={!reducedMotion ? CARD_VARIANTS : undefined}
      initial="initial"
      animate="visible"
      whileHover={!reducedMotion ? "hover" : undefined}
      whileTap={!reducedMotion ? "tap" : undefined}
      transition={{ ...TRANSITIONS.default, delay: Math.min(getStaggerDelay(index), 0.2) }}
      className={`relative w-full ${aspect === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]"} overflow-hidden rounded-seen-lg group cursor-pointer text-left border border-white/5`}
    >
      <div className="absolute inset-0">
        <SeenImage
          src={imageUrl}
          alt={title}
          seed={id}
          decorative
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/10" />
      </div>

      <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
        {typeLabel ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-white backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-full border border-white/15">
            {typeLabel}
          </span>
        ) : (
          <span />
        )}
        {badge &&
          (typeof badge === "string" ? (
            <span className="text-[10px] tracking-[0.14em] uppercase text-white backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-full border border-white/20">
              {badge}
            </span>
          ) : (
            <span className="rounded-full backdrop-blur-md bg-black/50 p-0.5">{badge}</span>
          ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col gap-1.5">
        {creator && <p className="text-[10px] tracking-[0.18em] uppercase text-white/75 truncate">{creator}</p>}
        <h3 className="text-xl font-light tracking-tight text-white leading-tight line-clamp-2">{title}</h3>
        {subtitle && <p className="text-xs text-white/75 leading-relaxed line-clamp-2">{subtitle}</p>}
        <div className="flex items-center justify-between mt-1 min-h-8">
          {duration ? <span className="text-xs text-white/75">{duration}</span> : <span />}
          <span
            aria-hidden
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
          >
            <Play className="w-3.5 h-3.5 text-black fill-black ml-0.5" strokeWidth={0} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
