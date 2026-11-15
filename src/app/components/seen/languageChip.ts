/**
 * Language chip text for the card `typeLabel` slot (E2, DS1 slot budget).
 * Viewer's language first; at most two codes then "+N" so the chip never overflows
 * at 320 px; no languages field means no chip.
 */
export function languageChipText(languages: readonly string[] | undefined, viewer: string): string | null {
  if (!languages || languages.length === 0) return null;
  const codes = [...new Set(languages.map(l => l.toUpperCase()))];
  const v = viewer.toUpperCase();
  codes.sort((a, b) => (a === v ? -1 : b === v ? 1 : 0));
  if (codes.length === 1) return codes[0];
  if (codes.length === 2) return `${codes[0]} · ${codes[1]}`;
  return `${codes[0]} +${codes.length - 1}`;
}

/** The languages as "EN · FR · ES" in catalogue order (story page line). */
export function languageCodesLine(languages: readonly string[] | undefined): string | null {
  if (!languages || languages.length === 0) return null;
  return [...new Set(languages.map(l => l.toUpperCase()))].join(" · ");
}

/** Full names for assistive tech: "English and Français", "English, Français and Español". */
export function languageNamesList(names: readonly string[], and: string): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")}${and}${names[names.length - 1]}`;
}

/**
 * When a story has no text in the viewer's language, the app shows English, else the first language it has
 * (getLocalizedText). Returns that language so the page can say so, or null when nothing is substituted.
 */
export function substitutedLanguage(available: readonly string[] | undefined, wanted: string): string | null {
  if (!available || available.length === 0 || available.includes(wanted)) return null;
  return available.includes("en") ? "en" : available[0];
}
