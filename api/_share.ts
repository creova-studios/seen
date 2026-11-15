/**
 * Share-preview rendering for `/s/<story id>` (E4, ADR-004).
 * Crawlers ignore URL fragments, so previews need a real path. Pure functions
 * so they are unit-testable; the Vercel handler in share-preview.ts wires them up.
 */
export interface SharePreview {
  id: string;
  title: string;
  description: string;
  image: string | null;
  locale: "en_CA" | "fr_CA" | "es_ES";
}

const ID_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;
export const isValidStoryId = (id: unknown): id is string => typeof id === "string" && ID_PATTERN.test(id);

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const safeImage = (u: string | null) => (u && /^https:\/\//i.test(u) ? u : null);

const LOCALES: Record<string, SharePreview["locale"]> = { en: "en_CA", fr: "fr_CA", es: "es_ES" };
export const localeFor = (languages: string[] | undefined) => LOCALES[(languages ?? [])[0] ?? "en"] ?? "en_CA";

export function renderPreviewHtml(p: SharePreview, origin: string): string {
  const title = escapeHtml(clip(p.title, 90));
  const description = escapeHtml(clip(p.description, 200));
  const image = safeImage(p.image);
  const target = `${origin}/#/story/${encodeURIComponent(p.id)}`;
  const canonical = `${origin}/s/${encodeURIComponent(p.id)}`;
  return `<!doctype html>
<html lang="${p.locale.slice(0, 2)}"><head><meta charset="utf-8">
<title>${title} · SEEN</title>
<meta name="description" content="${description}">
<meta property="og:type" content="article"><meta property="og:site_name" content="SEEN">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}">
<meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:locale" content="${p.locale}">
${image ? `<meta property="og:image" content="${escapeHtml(image)}"><meta name="twitter:card" content="summary_large_image">` : `<meta name="twitter:card" content="summary">`}
<meta http-equiv="refresh" content="0;url=${escapeHtml(target)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
</head><body><p><a href="${escapeHtml(target)}">${title}</a></p></body></html>`;
}

export const NOT_FOUND_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Story not found · SEEN</title><meta name="robots" content="noindex"></head><body><p>This story is not available.</p></body></html>`;

export interface ShareDeps {
  curated: Record<string, Omit<SharePreview, "id">>;
  /** Reads only the public_stories view (RLS-safe). Returns null when not public. */
  fetchPublic: (id: string) => Promise<Omit<SharePreview, "id"> | null>;
}

export async function buildShareResponse(id: unknown, origin: string, deps: ShareDeps) {
  const found = (): { status: number; html: string; cache: string } => ({ status: 404, html: NOT_FOUND_HTML, cache: "public, s-maxage=60" });
  if (!isValidStoryId(id)) return found();
  const entry = deps.curated[id] ?? (id.startsWith("db_") ? await deps.fetchPublic(id).catch(() => null) : null);
  if (!entry) return found();
  return {
    status: 200,
    html: renderPreviewHtml({ id, ...entry }, origin),
    cache: "public, s-maxage=300, stale-while-revalidate=3600",
  };
}
