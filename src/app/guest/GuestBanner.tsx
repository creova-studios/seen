import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useT } from "../i18n/useT";
import { dismissGuestBanner, hasChosenGuest, openGuestPrompt, useGuestStore } from "./guestStore";

/** Slim "Exploring as a guest" notice (Figma 10:444). Hidden once signed in; dismissible for the session. */
export function GuestBanner() {
  const t = useT();
  const { state } = useAuth();
  const { bannerDismissed } = useGuestStore();
  if (state.isAuthenticated || state.isLoading || bannerDismissed || !hasChosenGuest()) return null;
  return (
    <div role="note" className="mb-4 flex items-center gap-1 rounded-seen-md border border-seen-border bg-seen-surface pl-4 pr-1 text-xs text-white/70">
      <p className="py-2 min-w-0 flex-1">{t("guest.banner")}</p>
      <button
        type="button"
        onClick={() => openGuestPrompt({ reason: "library" })}
        className="min-h-11 px-2 flex-shrink-0 uppercase tracking-[0.12em] font-semibold text-white"
      >
        {t("guest.banner.cta")}
      </button>
      <button type="button" onClick={dismissGuestBanner} aria-label={t("guest.banner.dismiss")} className="w-11 h-11 flex items-center justify-center flex-shrink-0 text-white/60 hover:text-white">
        <X className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}
