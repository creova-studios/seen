import { useEffect } from "react";
import { PenLine } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAppNav } from "../navigation/AppNav";
import { markCreatorIntroSeen } from "../guest/creatorIntro";
import { useT } from "../i18n/useT";
import { Button } from "../components/seen/primitives";
import { ScreenFrame } from "./ScreenFrame";

/**
 * "Become a creator" (Figma 407:2), shown once per account the first time a non-creator taps Create.
 * It promises nothing the product does not do today. The first-story review wording (design decision 4A)
 * is added when that review ships, not before.
 */
export function CreatorIntroScreen() {
  const t = useT();
  const nav = useAppNav();
  const { state } = useAuth();
  const userId = state.user?.id;

  useEffect(() => markCreatorIntroSeen(userId), [userId]);

  return (
    <ScreenFrame title={t("creator.intro.eyebrow")} onBack={nav.back}>
      <section className="flex flex-col items-start gap-4 pt-4">
        <span aria-hidden className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <PenLine className="w-6 h-6 text-white" />
        </span>
        <h2 className="font-seen-display text-[30px] leading-[1.16] text-white">{t("creator.intro.title")}</h2>
        <p className="text-base text-seen-secondary leading-relaxed">{t("creator.intro.body")}</p>
        <div className="w-full flex flex-col gap-2 pt-4">
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
