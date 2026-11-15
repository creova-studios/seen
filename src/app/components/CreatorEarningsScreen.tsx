import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { MetricCard } from "./seen/primitives";
import { ArrowLeft, TrendingUp, Users, Wallet, ArrowDownToLine, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import {
  getCreatorEarningsSummary,
  getTransactionsForCreator,
  requestPayout,
  creatorIdFromName,
} from "../data/monetizationService";
import { formatCents } from "../data/monetizationTypes";

interface CreatorEarningsScreenProps {
  onClose: () => void;
}

export function CreatorEarningsScreen({ onClose }: CreatorEarningsScreenProps) {
  const { state } = useStoryState();
  const { state: authState } = useAuth();
  const lang = state.language;
  const t = (en: string, fr: string, es: string) => (lang === "en" ? en : lang === "fr" ? fr : es);

  const creatorId = authState.user ? creatorIdFromName(authState.user.name) : "creator_demo";
  const [refreshKey, setRefreshKey] = useState(0);
  const [payoutDone, setPayoutDone] = useState(false);

  const summary = useMemo(() => getCreatorEarningsSummary(creatorId), [creatorId, refreshKey]);
  const transactions = useMemo(() => getTransactionsForCreator(creatorId), [creatorId, refreshKey]);

  const chartData = useMemo(() => {
    // Last 6 months bucketed revenue (net of platform fee)
    const now = new Date();
    const months: { key: string; label: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString(lang === "en" ? "en-US" : lang, { month: "short" }),
        amount: 0,
      });
    }
    transactions.forEach(txn => {
      if (txn.status !== "succeeded") return;
      const d = new Date(txn.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find(m => m.key === key);
      if (bucket) bucket.amount += txn.creatorPayoutAmount / 100;
    });
    return months;
  }, [transactions, lang]);

  const handlePayout = () => {
    if (!authState.user || summary.availableBalance <= 0) return;
    requestPayout(creatorId, authState.user.name, summary.availableBalance);
    setRefreshKey(k => k + 1);
    setPayoutDone(true);
    setTimeout(() => setPayoutDone(false), 2500);
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
            <h2 className="text-base tracking-tight text-white">{t("Earnings", "Revenus", "Ganancias")}</h2>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Available balance + payout */}
          <section className="p-6 rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-400/20">
            <span className="text-xs tracking-[0.3em] uppercase text-green-300/70 mb-2 block">
              {t("Available Balance", "Solde Disponible", "Saldo Disponible")}
            </span>
            <div className="text-3xl text-white font-semibold mb-4">{formatCents(summary.availableBalance)}</div>
            <button
              onClick={handlePayout}
              disabled={summary.availableBalance <= 0}
              className="w-full py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {payoutDone ? <Check className="w-4 h-4" /> : <ArrowDownToLine className="w-4 h-4" />}
              {payoutDone
                ? t("Payout requested", "Retrait demandé", "Retiro solicitado")
                : t("Withdraw to bank", "Retirer vers la banque", "Retirar al banco")}
            </button>
          </section>

          {/* Stats grid */}
          <section className="grid grid-cols-2 min-[360px]:grid-cols-3 gap-3 auto-rows-fr">
            <MetricCard className="col-span-2 min-[360px]:col-span-1" label={t("Lifetime", "À vie", "De por vida")} value={formatCents(summary.totalNetEarnings)} />
            <MetricCard label={t("Subscribers", "Abonnés", "Suscriptores")} value={summary.activeSubscriberCount} />
            <MetricCard label={t("Sales", "Ventes", "Ventas")} value={summary.totalTransactionCount} />
          </section>

          {/* Revenue chart */}
          <section>
            <h3 className="text-sm tracking-wider uppercase text-white/55 mb-4">
              {t("Monthly Revenue", "Revenus Mensuels", "Ingresos Mensuales")}
            </h3>
            <div className="h-[200px] p-4 rounded-2xl bg-white/5 border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, t("Net revenue", "Revenu net", "Ingreso neto")]}
                  />
                  <Bar dataKey="amount" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Revenue breakdown */}
          <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-sm text-white/60 mb-1">{t("Lifetime Breakdown", "Répartition à Vie", "Desglose de Por Vida")}</h3>
            <Row label={t("Gross revenue", "Revenu brut", "Ingreso bruto")} value={formatCents(summary.totalGrossRevenue)} />
            <Row label={t("Platform fees paid", "Frais de plateforme", "Comisiones de plataforma")} value={`− ${formatCents(summary.totalPlatformFees)}`} muted />
            <Row label={t("Net earnings", "Revenus nets", "Ganancias netas")} value={formatCents(summary.totalNetEarnings)} strong />
            <Row label={t("Already paid out", "Déjà versé", "Ya pagado")} value={formatCents(summary.totalPaidOut)} muted />
          </section>

          {/* Transaction history */}
          <section>
            <h3 className="text-sm tracking-wider uppercase text-white/55 mb-4">
              {t("Transaction History", "Historique des Transactions", "Historial de Transacciones")}
            </h3>
            {transactions.length === 0 ? (
              <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-white/55">
                  {t("No transactions yet.", "Aucune transaction pour le moment.", "Aún no hay transacciones.")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 20).map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm text-white">{txn.userName}</p>
                      <p className="text-xs text-white/55">
                        {txn.type === "subscription" ? t("Subscription", "Abonnement", "Suscripción") : t("Purchase", "Achat", "Compra")}
                        {" · "}
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm text-green-300">+{formatCents(txn.creatorPayoutAmount)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/55">{label}</span>
      <span className={`text-sm ${strong ? "text-white font-semibold" : muted ? "text-white/55" : "text-white"}`}>{value}</span>
    </div>
  );
}
