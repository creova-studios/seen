import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Checkbox } from "../components/seen/forms";
import { LinearProgress } from "../components/seen/display";
import { listStoriesForCreator } from "../data/userStoriesService";
import { useAppNav } from "../navigation/AppNav";
import { useT } from "../i18n/useT";
import type { StringKey } from "../i18n/strings";
import { ScreenFrame } from "./ScreenFrame";

const KEY = "seen.v1.fundingReadiness";
const ITEMS: { id: string; label: StringKey }[] = [
  { id: "portfolio", label: "fr.portfolio" },
  { id: "history", label: "fr.history" },
  { id: "budget", label: "fr.budget" },
  { id: "statement", label: "fr.statement" },
  { id: "contact", label: "fr.contact" },
];

function load(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** A self-ticked checklist. No score, no verdict: only the published-work row is derived from real data. */
export function FundingReadinessScreen() {
  const nav = useAppNav();
  const t = useT();
  const { state } = useAuth();
  const [done, setDone] = useState<string[]>(load);
  const published = state.user ? listStoriesForCreator(state.user.id).length : 0;

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter(d => d !== id) : [...done, id];
    setDone(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: state still works for this session */
    }
  };

  const total = ITEMS.length + 1;
  const count = done.length + (published > 0 ? 1 : 0);

  return (
    <ScreenFrame title={t("fr.title")} onBack={nav.back}>
      <p className="text-sm text-seen-secondary mb-5">{t("fr.intro")}</p>
      <div className="mb-2 text-sm text-white">{t("fr.count", { done: String(count), total: String(total) })}</div>
      <div className="mb-5">
        <LinearProgress value={count} max={total} label={t("fr.title")} tone="funding" />
      </div>
      <ul className="space-y-2">
        <li className="px-4 py-3 rounded-seen-md border border-seen-border bg-seen-surface">
          <p className="text-sm text-white">{t("fr.published")}</p>
          <p className="text-xs text-seen-muted mt-0.5">{published > 0 ? t("fr.published.yes", { n: String(published) }) : t("fr.published.no")}</p>
        </li>
        {ITEMS.map(i => (
          <li key={i.id} className="px-4 rounded-seen-md border border-seen-border bg-seen-surface">
            <Checkbox checked={done.includes(i.id)} onChange={() => toggle(i.id)} label={t(i.label)} />
          </li>
        ))}
      </ul>
      <p className="text-xs text-seen-muted mt-4">{t("fr.device")}</p>
    </ScreenFrame>
  );
}
