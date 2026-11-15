/** Regenerates api/_curated-previews.json from the story catalogue. Run: npm run gen:share */
import { writeFileSync } from "node:fs";
import { buildCuratedPreviews } from "./curatedPreviews";

writeFileSync(new URL("../api/_curated-previews.json", import.meta.url), JSON.stringify(buildCuratedPreviews(), null, 2) + "\n");
