import { useMemo } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { UserIntent, UserRole } from "../contexts/StoryStateContext";
import { availableInterests } from "../data/interests";
import { useT } from "../i18n/useT";

/**
 * The two choice screens of onboarding. Both are tap-only (no typing), expose their
 * state with aria-pressed plus a visible check mark, and keep the primary action
 * pinned to the bottom of the screen where a thumb reaches it.
 */

export type Purpose = "discover" | "learn" | "share" | "audience" | "connect";

const PURPOSES: { id: Purpose; label: string; hint: string }[] = [
  { id: "discover", label: "Discover stories", hint: "Read, listen and watch" },
  { id: "learn", label: "Learn", hint: "History, culture and craft" },
  { id: "share", label: "Share my story", hint: "Publish your own work" },
  { id: "audience", label: "Find readers and listeners", hint: "Get your work in front of people who will enjoy it" },
  { id: "connect", label: "Back the creators you love", hint: "Get their new stories and support their work" },
];

/** Maps the chosen purposes to the account fields the app already stores. */
export function roleAndIntentFor(purposes: Purpose[]): { role: UserRole; intent: UserIntent } {
  if (purposes.includes("share") || purposes.includes("audience")) return { role: "creator", intent: "create" };
  if (purposes.includes("connect")) return { role: "viewer", intent: "contribute" };
  return { role: "viewer", intent: "explore" };
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 px-gutter pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black via-black to-black/0">
      <div className="max-w-md mx-auto flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Choice({ label, hint, selected, onToggle }: { label: string; hint?: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`w-full min-h-14 px-4 py-3 rounded-seen-md border text-left flex items-center gap-3 transition-colors ${
        selected ? "border-white bg-white/10" : "border-seen-border bg-seen-surface hover:border-white/30"
      }`}
    >
      <span
        aria-hidden
        className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${selected ? "bg-white border-white text-black" : "border-white/40"}`}
      >
        {selected && <Check className="w-4 h-4" strokeWidth={3} />}
      </span>
      <span className="min-w-0">
        <span className="block text-base text-white">{label}</span>
        {hint && <span className="block text-sm text-seen-muted">{hint}</span>}
      </span>
    </button>
  );
}

export function PurposeStep({
  selected,
  onChange,
  onNext,
  onGuest,
}: {
  selected: Purpose[];
  onChange: (p: Purpose[]) => void;
  onNext: () => void;
  /** Lets someone look around first; they skip the account steps and land on For You (D2). */
  onGuest?: () => void;
}) {
  const t = useT();
  const toggle = (p: Purpose) => onChange(selected.includes(p) ? selected.filter(x => x !== p) : [...selected, p]);
  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col">
      <div className="flex-1 px-gutter pt-4 max-w-md w-full mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-white/70">SEEN by CREOVA</p>
        <h1 className="font-seen-display text-[30px] leading-[1.16] text-white mt-3">What brings you to SEEN?</h1>
        <p className="text-sm text-seen-secondary mt-2">Stories from many voices, in your language. Choose all that apply.</p>
        <div role="group" aria-label="What brings you to SEEN? Choose all that apply" className="mt-6 flex flex-col gap-3">
          {PURPOSES.map(p => (
            <Choice key={p.id} label={p.label} hint={p.hint} selected={selected.includes(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </div>
        <p className="text-sm text-seen-secondary mt-4 pb-4">{t("onboard.accountNote")}</p>
      </div>
      <Footer>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className="w-full min-h-12 rounded-full bg-white text-black text-sm font-semibold uppercase tracking-[0.12em] disabled:opacity-40"
        >
          Next: your interests
        </button>
        <button type="button" onClick={() => { onChange([]); onNext(); }} className="w-full min-h-11 text-sm text-white/80 underline underline-offset-2">
          Skip for now
        </button>
        {onGuest && (
          <button type="button" onClick={onGuest} className="w-full min-h-11 text-sm text-white/80 underline underline-offset-2">
            {t("guest.explore")}
          </button>
        )}
      </Footer>
    </motion.main>
  );
}

export function InterestsStep({ selected, onChange, onNext }: { selected: string[]; onChange: (i: string[]) => void; onNext: () => void }) {
  const options = useMemo(() => availableInterests().slice(0, 10), []);
  const toggle = (t: string) => onChange(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]);
  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col">
      <div className="flex-1 px-gutter pt-4 max-w-md w-full mx-auto">
        <h1 className="font-seen-display text-[30px] leading-[1.16] text-white">What do you like to read, hear and watch?</h1>
        <p className="text-sm text-seen-secondary mt-2">Optional. We use this to pick what you see first. Change it any time.</p>
        <div role="group" aria-label="Interests" className="mt-6 flex flex-wrap gap-2">
          {options.map(t => {
            const on = selected.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t)}
                className={`min-h-11 px-4 rounded-full border text-sm inline-flex items-center gap-2 transition-colors ${
                  on ? "border-white bg-white text-black" : "border-seen-border bg-seen-surface text-white/90 hover:border-white/30"
                }`}
              >
                {on && <Check className="w-4 h-4" strokeWidth={3} aria-hidden />}
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <Footer>
        <button type="button" onClick={onNext} className="w-full min-h-12 rounded-full bg-white text-black text-sm font-semibold uppercase tracking-[0.12em]">
          {selected.length > 0 ? "Next: create your account" : "Skip: create your account"}
        </button>
      </Footer>
    </motion.main>
  );
}
