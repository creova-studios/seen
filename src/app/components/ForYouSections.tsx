/**
 * For You sections from Figma 316:2 (hero, rail cards, voices). Sizes are the Figma values; layout uses the
 * shared gutter token and flex/overflow rules instead of canvas coordinates.
 */
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { api, type Creator } from "../services";
import { useResource } from "../hooks/useResource";
import { useAppNav } from "../navigation/AppNav";
import { TRANSITIONS } from "../utils/motion";
import { Avatar, Button } from "./seen/primitives";
import { SeenImage } from "./seen/SeenImage";
import { SectionHeader } from "./SectionHeader";

export interface HeroItem {
  id: string;
  type: string;
  title: string;
  creator: string;
  duration: string;
  mediaSource: string;
}

/** Editorial hero: full-bleed 520px, one primary action. The button is the only tap target. */
/** About 55% of the screen above the tab bar, never taller than 520 px (Figma 316:2) nor shorter than its text needs, so the first rail peeks in on a short phone. */
export function FeaturedHero({ item, onExperience }: { item: HeroItem; onExperience: (id: string) => void }) {
  const meta = [item.creator, item.duration.replace(/\s*•\s*/g, " · ")].filter(Boolean).join(" · ");
  return (
    <motion.section
      aria-labelledby="hero-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITIONS.default}
      className="relative -mx-gutter h-[min(520px,calc((100dvh-var(--seen-nav-height))*0.55))] min-h-[300px] overflow-hidden bg-seen-canvas"
    >
      <SeenImage src={item.mediaSource} alt="" decorative seed={item.id} className="absolute inset-0 w-full h-full object-cover" />
      {/* Scrims keep text readable on any photo, light ones included: dark under the header, dark under the title block. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[150px] bg-gradient-to-b from-black/80 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[340px] bg-[linear-gradient(to_bottom,transparent_0%,color-mix(in_srgb,var(--color-seen-canvas)_92%,transparent)_35%,var(--color-seen-canvas)_65%)]" />
      <div className="absolute inset-x-0 bottom-0 px-gutter pb-5">
        <p className="font-seen-mono text-[11px] leading-[1.3] tracking-[0.8px] uppercase text-white">
          Editor&rsquo;s feature · {item.type}
        </p>
        <p id="hero-title" className="font-seen-display text-[34px] font-normal leading-[1.16] tracking-[-0.5px] text-white mt-2 max-w-[300px]">
          {item.title}
        </p>
        <p className="text-[13px] leading-[1.5] tracking-[0.1px] text-seen-secondary mt-3">{meta}</p>
        <Button shape="rounded" className="mt-4 w-40 bg-white text-seen-canvas hover:bg-white/90" icon={<Play className="w-3.5 h-3.5 fill-current" aria-hidden />} onClick={() => onExperience(item.id)} aria-label={`Start reading ${item.title}`}>
          Start reading
        </Button>
      </div>
    </motion.section>
  );
}

export interface RailItem {
  id: string;
  title: string;
  eyebrow: string;
  subtitle?: string;
  imageUrl?: string;
}

/** Rail card (Figma 316:16 / 316:28): fixed image box, mono eyebrow, 16px title, 12px caption. One tap target. */
export function RailCard({ item, w, h, onSelect }: { item: RailItem; w: number; h: number; onSelect: (id: string) => void }) {
  return (
    <button type="button" data-testid="rail-card" onClick={() => onSelect(item.id)} style={{ width: w }} className="flex-shrink-0 snap-start text-left flex flex-col gap-2 group">
      <div style={{ height: h }} className="relative w-full overflow-hidden rounded-seen-md border border-white/5">
        <SeenImage src={item.imageUrl} alt="" decorative seed={item.id} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[var(--seen-duration-slow)] group-hover:scale-[1.03]" />
      </div>
      <span className="font-seen-mono text-[11px] leading-[1.3] tracking-[0.8px] uppercase text-seen-muted truncate">{item.eyebrow}</span>
      <span className="text-base font-semibold leading-[1.35] text-white line-clamp-2">{item.title}</span>
      {item.subtitle && <span className="text-xs leading-[1.4] tracking-[0.02em] text-seen-secondary truncate -mt-1">{item.subtitle}</span>}
    </button>
  );
}

export function Rail({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-gutter px-gutter scroll-px-gutter">{children}</div>;
}

/** Creators to follow. Real creators from the catalogue; each is a single tap target into their profile. */
export function VoicesToDiscover() {
  const nav = useAppNav();
  const creators = useResource(() => api.creators.list(), []);
  const list = (creators.data ?? []).slice(0, 8);
  if (creators.status !== "ready" || list.length === 0) return null;
  return (
    <section className="mb-12">
      <SectionHeader title="Voices to discover" subtitle="Creators on SEEN" onViewAll={() => nav.go("explore", { tab: "creators" })} />
      <Rail>
        {list.map((c: Creator) => (
          <button key={c.id} type="button" data-testid="voice-card" onClick={() => nav.go("creator-profile", { id: c.id })} className="w-[120px] flex-shrink-0 snap-start flex flex-col items-center gap-2 text-center min-h-11">
            <Avatar name={c.name} size="xl" />
            <span className="text-[13px] font-medium leading-[1.2] tracking-[0.02em] text-white max-w-full truncate">{c.name}</span>
            <span className="text-xs leading-[1.4] tracking-[0.02em] text-seen-muted max-w-full truncate">{c.themes[0] ?? `${c.storyIds.length} stories`}</span>
          </button>
        ))}
      </Rail>
    </section>
  );
}
