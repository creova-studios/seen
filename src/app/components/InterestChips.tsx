import { useMemo } from "react";
import { Check } from "lucide-react";
import { availableInterests, storiesForInterests } from "../data/interests";
import type { Language } from "../data/storyDatabase";
import { useT } from "../i18n/useT";

/**
 * The one interest filter (PR-5): a sideways-scrolling row of topic chips on For You. The topics chosen at
 * sign-up start selected; a guest, who skips that step, sees the most common topics. Only topics that have a
 * public story are offered. Selecting nothing shows no topic rail and changes nothing else on the page.
 */
export function InterestChips({ selected, onChange, language }: { selected: string[]; onChange: (next: string[]) => void; language: Language }) {
  const t = useT();
  const options = useMemo(() => {
    const popular = availableInterests().filter(topic => storiesForInterests([topic], language).length > 0).slice(0, 10);
    // A chosen topic always stays in the row, even if it is no longer among the most common.
    return [...selected.filter(s => !popular.includes(s)), ...popular];
  }, [language, selected.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  if (options.length === 0) return null;
  const toggle = (topic: string) => onChange(selected.includes(topic) ? selected.filter(x => x !== topic) : [...selected, topic]);
  return (
    <div role="group" aria-label={t("foryou.topics")} className="flex gap-2 overflow-x-auto scrollbar-hide -mx-gutter px-gutter scroll-px-gutter pb-1">
      {options.map(topic => {
        const on = selected.includes(topic);
        return (
          <button
            key={topic}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(topic)}
            className={`min-h-11 px-4 rounded-full border text-sm whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 transition-colors ${
              on ? "border-white bg-white text-black" : "border-seen-border bg-seen-surface text-white/90 hover:border-white/30"
            }`}
          >
            {on && <Check className="w-4 h-4" strokeWidth={3} aria-hidden />}
            {topic}
          </button>
        );
      })}
    </div>
  );
}
