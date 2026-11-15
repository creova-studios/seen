import { useState } from "react";
import { X } from "lucide-react";
import { backend } from "../services/backend";
import { useT } from "../i18n/useT";

const KEY = "seen.v1.demoNoticeDismissed";

function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Honest label for the demo data layer: nothing is saved on a server, and nothing is shared
 * between devices. Shown only while the app runs on the demo adapter; dismissible for the session.
 */
export function DemoModeNotice({ mode = backend.mode }: { mode?: "demo" | "supabase" }) {
  const t = useT();
  const [hidden, setHidden] = useState(wasDismissed);
  if (mode !== "demo" || hidden) return null;
  const dismiss = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* session storage unavailable: hides until reload */
    }
    setHidden(true);
  };
  return (
    <div role="note" className="mb-4 flex items-center justify-between gap-2 rounded-seen-md border border-seen-border bg-seen-surface pl-4 pr-1 text-xs text-white/70">
      <p className="py-2 min-w-0">
        <span className="uppercase tracking-[0.14em] text-white/55">{t("demo.label")}</span> · {t("demo.body")}
      </p>
      <button type="button" onClick={dismiss} aria-label={t("demo.dismiss")} className="w-11 h-11 flex items-center justify-center flex-shrink-0 text-white/60 hover:text-white">
        <X className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}
