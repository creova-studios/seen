import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Unlock, Users, Sparkles, DollarSign, Check } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { STORY_WORLDS, getLocalizedText } from "../data/storyDatabase";
import {
  getContentPricing,
  setContentPricing,
  getCreatorPlan,
  setCreatorPlan,
  creatorIdFromName,
} from "../data/monetizationService";
import type { AccessTier } from "../data/monetizationTypes";
import { formatCents } from "../data/monetizationTypes";

interface CreatorMonetizationScreenProps {
  onClose: () => void;
}

const TIER_OPTIONS: { value: AccessTier; icon: JSX.Element; label: Record<string, string> }[] = [
  { value: "free", icon: <Unlock className="w-4 h-4" />, label: { en: "Free", fr: "Gratuit", es: "Gratis" } },
  { value: "subscriber-only", icon: <Users className="w-4 h-4" />, label: { en: "Subscriber-only", fr: "Abonnés seulement", es: "Solo suscriptores" } },
  { value: "one-time-purchase", icon: <DollarSign className="w-4 h-4" />, label: { en: "One-time purchase", fr: "Achat unique", es: "Compra única" } },
  { value: "premium-tier", icon: <Sparkles className="w-4 h-4" />, label: { en: "Premium tier", fr: "Palier premium", es: "Nivel premium" } },
];

export function CreatorMonetizationScreen({ onClose }: CreatorMonetizationScreenProps) {
  const { state } = useStoryState();
  const { state: authState } = useAuth();
  const lang = state.language;
  const t = (en: string, fr: string, es: string) => (lang === "en" ? en : lang === "fr" ? fr : es);

  const creatorId = authState.user ? creatorIdFromName(authState.user.name) : "creator_demo";
  const [plan, setPlanState] = useState(() => getCreatorPlan(creatorId));
  const [tierName, setTierName] = useState(plan?.tierName ?? "Inner Circle");
  const [priceMonthly, setPriceMonthly] = useState(((plan?.priceMonthly ?? 499) / 100).toFixed(2));
  const [benefitsText, setBenefitsText] = useState(
    plan?.benefits.join("\n") ?? "Early access to new chapters\nBehind-the-scenes commentary\nMonthly live Q&A"
  );
  const [saved, setSaved] = useState(false);

  const [pricingVersion, setPricingVersion] = useState(0); // force re-read after updates
  const forceRefresh = () => setPricingVersion(v => v + 1);

  const handleSavePlan = () => {
    const cents = Math.round(parseFloat(priceMonthly || "0") * 100);
    const benefits = benefitsText.split("\n").map(b => b.trim()).filter(Boolean);
    const updated = setCreatorPlan(creatorId, tierName, cents, "", benefits);
    setPlanState(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSetTier = (contentId: string, tier: AccessTier) => {
    const existing = getContentPricing(contentId);
    const price = tier === "one-time-purchase" ? (existing.oneTimePrice ?? 299) : undefined;
    setContentPricing(contentId, tier, price);
    forceRefresh();
  };

  const handleSetOneTimePrice = (contentId: string, dollars: string) => {
    const cents = Math.round(parseFloat(dollars || "0") * 100);
    setContentPricing(contentId, "one-time-purchase", cents);
    forceRefresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-y-auto"
    >
      <div className="min-h-full max-w-(--seen-content-max) mx-auto pb-24">
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label={t("Back", "Retour", "Atrás")}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base tracking-tight text-white">
              {t("Monetization", "Monétisation", "Monetización")}
            </h2>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-6 py-6 space-y-10">
          {/* Subscription plan configuration */}
          <section>
            <span className="text-xs tracking-[0.3em] uppercase text-white/55 mb-3 block">
              {t("Your Subscription Tier", "Votre Palier d'Abonnement", "Tu Nivel de Suscripción")}
            </span>
            <p className="text-sm text-white/55 mb-5 leading-relaxed">
              {t(
                "Fans subscribe monthly for exclusive access to your subscriber-only content.",
                "Les fans s'abonnent mensuellement pour un accès exclusif à votre contenu réservé aux abonnés.",
                "Los fans se suscriben mensualmente para acceder de forma exclusiva a tu contenido solo para suscriptores."
              )}
            </p>

            <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <label className="text-xs text-white/55 mb-1.5 block">{t("Tier name", "Nom du palier", "Nombre del nivel")}</label>
                <input
                  type="text"
                  value={tierName}
                  onChange={e => setTierName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/55 mb-1.5 block">{t("Monthly price (USD)", "Prix mensuel (USD)", "Precio mensual (USD)")}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/55">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceMonthly}
                    onChange={e => setPriceMonthly(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/55 mb-1.5 block">
                  {t("Benefits (one per line)", "Avantages (un par ligne)", "Beneficios (uno por línea)")}
                </label>
                <textarea
                  value={benefitsText}
                  onChange={e => setBenefitsText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>
              <button
                onClick={handleSavePlan}
                className="w-full py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                {saved ? <Check className="w-4 h-4" /> : null}
                {saved ? t("Saved", "Enregistré", "Guardado") : t("Save Tier", "Enregistrer", "Guardar Nivel")}
              </button>
            </div>
          </section>

          {/* Revenue split info */}
          <section className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20">
            <h3 className="text-sm text-green-300 mb-2">{t("Revenue Share", "Partage des Revenus", "Reparto de Ingresos")}</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {t(
                "You keep 85% of every subscription and purchase. CREOVA retains a 15% platform fee to cover hosting, payments, and discovery.",
                "Vous conservez 85 % de chaque abonnement et achat. CREOVA retient des frais de plateforme de 15 % pour couvrir l'hébergement, les paiements et la découverte.",
                "Te quedas con el 85% de cada suscripción y compra. CREOVA retiene una comisión de plataforma del 15% para cubrir alojamiento, pagos y descubrimiento."
              )}
            </p>
          </section>

          {/* Content pricing table */}
          <section>
            <span className="text-xs tracking-[0.3em] uppercase text-white/55 mb-3 block">
              {t("Content Pricing", "Tarification du Contenu", "Precios de Contenido")}
            </span>
            <p className="text-sm text-white/55 mb-5 leading-relaxed">
              {t(
                "Set the access tier for each story. Demo mode lets you configure pricing across the catalog.",
                "Définissez le palier d'accès pour chaque histoire. Le mode démo vous permet de configurer les prix pour tout le catalogue.",
                "Establece el nivel de acceso para cada historia. El modo demo te permite configurar precios en todo el catálogo."
              )}
            </p>

            <div className="space-y-3">
              {STORY_WORLDS.slice(0, 12).map(story => {
                const pricing = getContentPricing(story.id);
                return (
                  <div key={story.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm text-white truncate pr-2">{getLocalizedText(story.title, lang)}</h4>
                      {pricing.accessTier !== "free" && <Lock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {TIER_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleSetTier(story.id, opt.value)}
                          className={`flex items-center gap-1.5 px-2.5 min-h-11 rounded-lg text-xs transition-colors ${
                            pricing.accessTier === opt.value
                              ? "bg-white text-black"
                              : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {opt.icon}
                          <span className="truncate">{opt.label[lang]}</span>
                        </button>
                      ))}
                    </div>
                    {pricing.accessTier === "one-time-purchase" && (
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/55 text-sm">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={((pricing.oneTimePrice ?? 299) / 100).toFixed(2)}
                          onBlur={e => handleSetOneTimePrice(story.id, e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
