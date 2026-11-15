import { SeenImage } from "./seen/SeenImage";
import { motion, useReducedMotion } from "motion/react";
import { useT } from "../i18n/useT";

interface OnboardingPurposeProps {
  onNext: () => void;
}

/**
 * The manifesto screen right after the S.E.E.N entry button: "This is not social media".
 * PROTECTED (owner decision): never remove or merge it. An e2e test guards it.
 */
export function OnboardingPurpose({ onNext }: OnboardingPurposeProps) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.6 }}
      // Scrolls vertically so Continue stays reachable at large text on short screens.
      className="fixed inset-0 bg-black overflow-y-auto overflow-x-hidden"
    >
      {/* Full-bleed immersive image */}
      <div className="fixed inset-0">
        <SeenImage src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1080&h=1600&fit=crop" alt="Open books on a table" seed="seen-purpose" decorative className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-full flex flex-col justify-between p-8 pt-16 pb-12 max-w-(--seen-content-max) mx-auto">
        {/* Top: Logo */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/55">
              SEEN
            </p>
          </div>
        </div>

        {/* Center: Main content */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.3, duration: reduce ? 0 : 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl leading-tight tracking-tight text-white max-w-[320px]">
            {t("onboard.notSocial1")}
            <br />
            {t("onboard.notSocial2")}
          </h1>
          <p className="text-base leading-relaxed text-white/80 max-w-[300px]">
            {t("onboard.manifesto")}
          </p>
          <p className="text-sm leading-relaxed text-white/75 max-w-[300px]">
            {t("onboard.noMetrics")}
          </p>
        </motion.div>

        {/* Bottom: CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full py-4 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors"
        >
          <span className="text-sm tracking-wider uppercase">
            {t("onboard.continue")}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}