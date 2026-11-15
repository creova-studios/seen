import { useEffect, useState } from "react";
import { PenLine, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useAppNav } from "../navigation/AppNav";
import { markCreatorIntroSeen } from "../guest/creatorIntro";
import { useT } from "../i18n/useT";
import { api } from "../services";
import { Button } from "../components/seen/primitives";
import { ScreenFrame } from "./ScreenFrame";

/**
 * "Become a creator" (Figma 407:2), shown once per account the first time a non-creator taps Create.
 * Also supports redeeming an artist invitation code to elevate a viewer account to creator.
 */
export function CreatorIntroScreen() {
  const t = useT();
  const nav = useAppNav();
  const { state, checkSession } = useAuth();
  const userId = state.user?.id;
  const [inviteCode, setInviteCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => markCreatorIntroSeen(userId), [userId]);

  const handleRedeemInvite = async () => {
    const trimmed = inviteCode.trim();
    if (!trimmed) return;
    setIsRedeeming(true);
    try {
      await api.intake.redeemInvitation(trimmed);
      await checkSession();
      toast.success("Artist invitation accepted. Your account is now a creator account.");
      nav.go("creator-publish", {}, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not redeem invitation code.");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <ScreenFrame title={t("creator.intro.eyebrow")} onBack={nav.back}>
      <section className="flex flex-col items-start gap-4 pt-4">
        <span aria-hidden className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <PenLine className="w-6 h-6 text-white" />
        </span>
        <h2 className="font-seen-display text-[30px] leading-[1.16] text-white">{t("creator.intro.title")}</h2>
        <p className="text-base text-seen-secondary leading-relaxed">{t("creator.intro.body")}</p>

        <div className="w-full rounded-seen-md border border-seen-border bg-seen-surface p-4 flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
            <Ticket className="w-4 h-4 text-white/60" aria-hidden />
            <span>Have an artist invite code?</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="Enter invitation code"
              aria-label="Artist invitation code"
              className="flex-1 min-h-11 px-3 rounded-lg bg-black/60 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
            />
            <Button
              variant="secondary"
              disabled={!inviteCode.trim() || isRedeeming}
              onClick={handleRedeemInvite}
            >
              Redeem invite
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 pt-2">
          <Button fullWidth onClick={() => nav.go("creator-publish", {}, { replace: true })}>
            {t("creator.intro.cta")}
          </Button>
          <button type="button" onClick={nav.back} className="min-h-11 text-sm text-white/60">
            {t("creator.intro.later")}
          </button>
        </div>
      </section>
    </ScreenFrame>
  );
}
