import { useEffect, useState } from "react";

/**
 * Image with a brand-consistent fallback.
 *
 * Story covers are remote URLs. When one fails (offline, blocked CDN, dead
 * link) the browser used to show a broken-image glyph with alt text spilling
 * over the card. This renders a deterministic dark gradient instead, seeded
 * from `seed` so the same story always gets the same placeholder.
 */
interface SeenImageProps {
  src?: string;
  alt: string;
  seed?: string;
  className?: string;
  /** Decorative images (alt text duplicated nearby) should pass true. */
  decorative?: boolean;
}

const PALETTES: [string, string][] = [
  ["#2a1f3d", "#0b0b0c"],
  ["#1f2d3d", "#0b0b0c"],
  ["#3d2a1f", "#0b0b0c"],
  ["#1f3d34", "#0b0b0c"],
  ["#3d1f2a", "#0b0b0c"],
  ["#2d2d33", "#0b0b0c"],
];

export function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function SeenImage({ src, alt, seed, className = "", decorative = false }: SeenImageProps) {
  const [failed, setFailed] = useState(!src);
  // A new src (for example after navigating between stories) gets a fresh try instead of staying on the fallback tile.
  useEffect(() => setFailed(!src), [src]);

  if (failed) {
    const [from, to] = PALETTES[hashSeed(seed ?? alt) % PALETTES.length];
    return (
      <div
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : alt}
        aria-hidden={decorative || undefined}
        data-testid="image-fallback"
        className={`flex items-end ${className}`}
        style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
