/** Builds the curated share-preview map from the story catalogue. */
import { STORY_WORLDS } from "../src/app/data/storyDatabase";

const LOCALES: Record<string, string> = { en: "en_CA", fr: "fr_CA", es: "es_ES" };
export function buildCuratedPreviews() {
  const out: Record<string, unknown> = {};
  for (const s of STORY_WORLDS.filter((w) => w.visibility === "public")) {
    out[s.id] = { title: s.title.en, description: s.description.en, image: s.coverImage, locale: LOCALES[s.languagesAvailable[0] ?? "en"] ?? "en_CA" };
  }
  return out;
}
