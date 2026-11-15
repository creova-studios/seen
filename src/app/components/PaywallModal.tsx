import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Sparkles, Users } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { CheckoutModal } from "./CheckoutModal";
import {
  getContentPricing,
  getCreatorPlan,
  grantOneTimePurchase,
  grantCreatorSubscription,
  creatorIdFromName,
} from "../data/monetizationService";
import { formatCents } from "../data/monetizationTypes";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
  contentId: string;
  contentTitle: string;
  creatorName: string;
}

export function PaywallModal({ isOpen, onClose, onUnlocked, contentId, contentTitle, creatorName }: PaywallModalProps) {
  const { state } = useStoryState();
  const { state: authState } = useAuth();
  const lang = state.language;
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const t = (en: string, fr: string, es: string) => (lang === "en" ? en : lang === "fr" ? fr : es);

  const pricing = getContentPricing(contentId);
  const creatorId = creatorIdFromName(creatorName);
  const plan = getCreatorPlan(creatorId);

  const isOneTime = pricing.accessTier === "one-time-purchase";
  const price = isOneTime ? (pricing.oneTimePrice ?? 499) : (plan?.priceMonthly ?? 499);

  const handleUnlock = (last4: string) => {
    if (!authState.user) return;

    if (isOneTime) {
      grantOneTimePurchase(
        authState.user.id,
        authState.user.name,
        contentId,
        contentTitle,
        creatorId,
        creatorName,
        price,
        last4
      );
    } else {
      grantCreatorSubscription(
        authState.user.id,
        authState.user.name,
        creatorId,
        creatorName,
        plan?.tierName ?? "Supporter",
        price,
        last4
      );
    }
    setCheckoutOpen(false);
    onUnlocked();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !checkoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
            >
              <div className="w-full max-w-[380px] pointer-events-auto p-7 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-xl text-center">
                <button
                  onClick={onClose}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center"
                  style={{ transform: "translate(50%, -50%)" }}
                  aria-label={t("Close", "Fermer", "Cerrar")}
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>

                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-6 h-6 text-amber-300" />
                </div>

                <h3 className="text-lg text-white mb-2">
                  {isOneTime
                    ? t("Premium Content", "Contenu Premium", "Contenido Premium")
                    : t("Subscriber Exclusive", "Exclusif Abonnés", "Exclusivo para Suscriptores")}
                </h3>
                <p className="text-sm text-white/55 mb-6 leading-relaxed">
                  {isOneTime
                    ? t(
                        `Unlock "${contentTitle}" with a one-time purchase.`,
                        `Débloquez « ${contentTitle} » avec un achat unique.`,
                        `Desbloquea "${contentTitle}" con una compra única.`
                      )
                    : t(
                        `Subscribe to ${creatorName} to access this and all their exclusive content.`,
                        `Abonnez-vous à ${creatorName} pour accéder à ceci et à tout son contenu exclusif.`,
                        `Suscríbete a ${creatorName} para acceder a esto y a todo su contenido exclusivo.`
                      )}
                </p>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {isOneTime ? (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    ) : (
                      <Users className="w-4 h-4 text-amber-300" />
                    )}
                    <span className="text-2xl text-white font-semibold">{formatCents(price)}</span>
                    {!isOneTime && <span className="text-sm text-white/55">/{t("mo", "mois", "mes")}</span>}
                  </div>
                  {!isOneTime && plan?.benefits && plan.benefits.length > 0 && (
                    <ul className="text-xs text-white/55 mt-3 space-y-1 text-left">
                      {plan.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-300 mt-0.5">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={() => setCheckoutOpen(true)}
                  disabled={!authState.user}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-40"
                >
                  {isOneTime
                    ? t("Buy Now", "Acheter", "Comprar Ahora")
                    : t("Subscribe", "S'abonner", "Suscribirse")}
                </button>
                {!authState.user && (
                  <p className="text-xs text-white/55 mt-3">
                    {t("Sign in to purchase content.", "Connectez-vous pour acheter.", "Inicia sesión para comprar.")}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={isOneTime ? contentTitle : `${creatorName} — ${plan?.tierName ?? "Supporter"}`}
        description={
          isOneTime
            ? t("One-time purchase", "Achat unique", "Compra única")
            : t("Monthly subscription", "Abonnement mensuel", "Suscripción mensual")
        }
        amount={price}
        onSuccess={handleUnlock}
      />
    </>
  );
}
