import { useCallback } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { translate, type StringKey } from "./strings";

/** Translates a key into the viewer's language, falling back to English. */
export function useT() {
  const { state } = useStoryState();
  return useCallback((key: StringKey, vars?: Record<string, string>) => translate(key, state.language, vars), [state.language]);
}
