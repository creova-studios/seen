import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SeenImage } from "./seen/SeenImage";

/**
 * Rail card (Figma Story Card, Layout=Portrait) used in horizontal rows.
 * Fixed width + fixed image ratio + reserved 2-line title height keep every
 * card in a rail the same height, whatever the title length.
 */
interface StoryCardProps {
  id?: string;
  title: string;
  author: string;
  imageUrl?: string;
  readTime: string;
  typeLabel?: ReactNode;
  onSelect?: () => void;
  width?: "rail" | "full";
}

export function StoryCard({ id, title, author, imageUrl, readTime, typeLabel, onSelect, width = "rail" }: StoryCardProps) {
  return (
    <motion.button
      type="button"
      data-testid="story-card"
      onClick={onSelect}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`${width === "rail" ? "w-[220px]" : "w-full"} flex-shrink-0 text-left group flex flex-col`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-seen-lg border border-white/5">
        <SeenImage
          src={imageUrl}
          alt={title}
          seed={id ?? title}
          decorative
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {typeLabel && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-white backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-full border border-white/15">
            {typeLabel}
          </span>
        )}
      </div>
      <div className="pt-3 flex flex-col gap-1">
        <p className="text-[10px] tracking-[0.14em] uppercase text-white/55 truncate">{readTime}</p>
        <h4 className="text-base leading-snug text-white line-clamp-2 min-h-[2.75em]">{title}</h4>
        <p className="text-xs text-white/55 truncate">by {author}</p>
      </div>
    </motion.button>
  );
}
