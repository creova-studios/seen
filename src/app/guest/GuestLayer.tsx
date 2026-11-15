import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useStoryState } from "../contexts/StoryStateContext";
import { AccountStep } from "../components/OnboardingSystem";
import { Sheet } from "../components/seen/overlays";
import { Button } from "../components/seen/primitives";
import { rememberReturn } from "../navigation/safeReturn";
import { useT } from "../i18n/useT";
import type { StringKey } from "../i18n/strings";
import { closeGuestAuth, dismissGuestPrompt, finishGuestAuth, openGuestAuth, useGuestStore, type GuestReason } from "./guestStore";

const COPY: Record<GuestReason, { title: StringKey; body: StringKey }> = {
  save: { title: "guest.save.title", body: "guest.save.body" },
  follow: { title: "guest.follow.title", body: "guest.follow.body" },
  library: { title: "guest.library.title", body: "guest.library.body" },
  profile: { title: "guest.profile.title", body: "guest.profile.body" },
  create: { title: "guest.create.title", body: "guest.create.body" },
  continue: { title: "guest.continue.title", body: "guest.continue.body" },
  page: { title: "guest.page.title", body: "guest.page.body" },
};

/**
 * The guest sign-in sheet (Figma 348:99) and the account form behind it. Mounted once in App. The headline
 * changes with what the person tapped; both account paths return them to the same screen and finish the action.
 */
export function GuestLayer() {
  const g = useGuestStore();
  const t = useT();
  const { state: auth, signUp, signIn } = useAuth();
  const { state: story } = useStoryState();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Account exists: close, leave guest mode and complete what they tapped.
  useEffect(() => {
    if (g.authOpen && auth.isAuthenticated) {
      try {
        localStorage.setItem("onboarding_completed", "true");
      } catch {
        /* storage unavailable: onboarding is skipped next time only if this write works */
      }
      finishGuestAuth();
    }
  }, [g.authOpen, auth.isAuthenticated]);

  useEffect(() => {
    if (!g.authOpen) setError(null);
  }, [g.authOpen]);

  const startAuth = (mode: "signup" | "signin") => {
    rememberReturn(window.location.hash); // a redirect-based sign-in (Google) brings them back here
    openGuestAuth(mode);
  };

  const submit = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const prompt = g.prompt;
  const subject = prompt?.subject ?? "";
  const copy = prompt ? COPY[prompt.reason] : COPY.page;

  return (
    <>
      <Sheet
        open={!!prompt}
        onOpenChange={open => !open && dismissGuestPrompt()}
        title={t(copy.title, { subject })}
        description={t(copy.body, { subject: subject || "this" })}
      >
        <div className="flex flex-col gap-2">
          <Button fullWidth onClick={() => startAuth("signup")}>
            {t("guest.cta.create")}
          </Button>
          <button type="button" onClick={() => startAuth("signin")} className="min-h-11 text-sm text-white/80 underline underline-offset-2">
            {t("guest.cta.signin")}
          </button>
          <button type="button" onClick={dismissGuestPrompt} className="min-h-11 text-sm text-white/60">
            {t("guest.cta.later")}
          </button>
        </div>
      </Sheet>

      {g.authOpen && (
        <div role="dialog" aria-modal="true" aria-label={t("guest.cta.create")} className="fixed inset-0 z-[70] bg-black overflow-y-auto">
          <div className="max-w-(--seen-content-max) mx-auto min-h-full flex flex-col pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-end px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <button type="button" onClick={closeGuestAuth} aria-label={t("guest.auth.close")} className="w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:bg-white/5">
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <AccountStep
                key={g.authMode}
                initialMode={g.authMode}
                isLoading={busy}
                error={error}
                onComplete={(email, password, name) =>
                  submit(() => signUp(email, password, name, "viewer", story.language, "explore"))
                }
                onSignIn={(email, password) => submit(() => signIn(email, password))}
                onRecover={async () => "Password reset isn't available yet. Contact support."}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
