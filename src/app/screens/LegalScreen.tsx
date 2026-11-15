import { Banner } from "../components/seen/primitives";
import { useAppNav } from "../navigation/AppNav";
import { useT } from "../i18n/useT";
import type { StringKey } from "../i18n/strings";
import { ScreenFrame } from "./ScreenFrame";

/** Terms & privacy. Describes what the app does today; clearly marked as a draft until reviewed by counsel. */
export function LegalScreen() {
  const nav = useAppNav();
  const t = useT();
  const Section = ({ title, keys, open }: { title: string; keys: StringKey[]; open?: boolean }) => (
    <details open={open} className="group rounded-seen-md border border-seen-border bg-seen-surface">
      <summary className="min-h-11 px-4 py-3 text-sm font-semibold text-white cursor-pointer list-none flex items-center justify-between">
        {title}
        <span aria-hidden className="text-white/55 transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <ul className="px-4 pb-4 space-y-3 list-disc list-inside text-sm leading-relaxed text-white/80">
        {keys.map(k => (
          <li key={k}>{t(k)}</li>
        ))}
      </ul>
    </details>
  );
  return (
    <ScreenFrame title={t("legal.title")} onBack={nav.back}>
      <Banner tone="warning" className="mb-5">{t("legal.draft")}</Banner>
      <div className="flex flex-col gap-3">
        <Section open title={t("legal.privacy")} keys={["legal.privacy.1", "legal.privacy.2", "legal.privacy.3", "legal.privacy.4"]} />
        <Section title={t("legal.terms")} keys={["legal.terms.1", "legal.terms.2", "legal.terms.3", "legal.terms.4", "legal.terms.5"]} />
      </div>
      <p className="text-xs text-seen-muted mt-4">{t("legal.terms.pending")}</p>
    </ScreenFrame>
  );
}
