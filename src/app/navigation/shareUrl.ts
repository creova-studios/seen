/** Link people share for a story. Production uses `/s/<id>` (rich previews, see api/share-preview.ts); local and preview hosts use the hash route. */
export function shareUrl(storyId: string, loc: Pick<Location, "origin" | "hostname" | "pathname"> = window.location): string {
  const local = /^(localhost|127\.|\[::1\])/.test(loc.hostname);
  return local ? `${loc.origin}${loc.pathname}#/story/${storyId}` : `${loc.origin}/s/${encodeURIComponent(storyId)}`;
}
