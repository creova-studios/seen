import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Users, DollarSign, Shield, Settings, TrendingUp, Ban, CheckCircle } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { listAllUsers, updateUserRole, setUserSuspended, getPlatformUserStats } from "../data/adminService";
import { getPlatformRevenueStats, getPlatformConfig, updatePlatformConfig } from "../data/monetizationService";
import { formatCents } from "../data/monetizationTypes";
import { STORY_WORLDS } from "../data/storyDatabase";
import type { UserRole } from "../contexts/StoryStateContext";

interface AdminDashboardScreenProps {
  onClose: () => void;
}

type Tab = "overview" | "users" | "revenue" | "settings";

export function AdminDashboardScreen({ onClose }: AdminDashboardScreenProps) {
  const { state } = useStoryState();
  const lang = state.language;
  const t = (en: string, fr: string, es: string) => (lang === "en" ? en : lang === "fr" ? fr : es);
  const [tab, setTab] = useState<Tab>("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const userStats = useMemo(() => getPlatformUserStats(), [refreshKey]);
  const users = useMemo(() => listAllUsers(), [refreshKey]);
  const revenueStats = useMemo(() => getPlatformRevenueStats(), [refreshKey]);
  const config = useMemo(() => getPlatformConfig(), [refreshKey]);

  const [feeInput, setFeeInput] = useState(String(config.platformFeePercent));
  const [saved, setSaved] = useState(false);

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
    setRefreshKey(k => k + 1);
  };

  const handleToggleSuspend = (userId: string, currentlySuspended: boolean) => {
    setUserSuspended(userId, !currentlySuspended);
    setRefreshKey(k => k + 1);
  };

  const handleSaveFee = () => {
    const pct = Math.max(0, Math.min(100, parseFloat(feeInput || "0")));
    updatePlatformConfig({ platformFeePercent: pct });
    setRefreshKey(k => k + 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            <h2 className="text-base tracking-tight text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              {t("Admin Dashboard", "Tableau de Bord Admin", "Panel de Administración")}
            </h2>
            <div className="w-10" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-5 pb-1">
            {([
              ["overview", t("Overview", "Aperçu", "Resumen")],
              ["users", t("Users", "Utilisateurs", "Usuarios")],
              ["revenue", t("Revenue", "Revenus", "Ingresos")],
              ["settings", t("Settings", "Réglages", "Ajustes")],
            ] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 min-h-11 py-2.5 text-xs transition-all ${
                  tab === key ? "text-white border-b-2 border-blue-400" : "text-white/55 hover:text-white/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-6">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<Users className="w-4 h-4 text-blue-300" />} value={String(userStats.totalUsers)} label={t("Total Users", "Utilisateurs", "Usuarios Totales")} />
                <StatCard icon={<DollarSign className="w-4 h-4 text-green-300" />} value={formatCents(revenueStats.totalGrossRevenue)} label={t("Gross Revenue", "Revenu Brut", "Ingreso Bruto")} />
                <StatCard icon={<TrendingUp className="w-4 h-4 text-purple-300" />} value={formatCents(revenueStats.totalPlatformRevenue)} label={t("Platform Revenue", "Revenu Plateforme", "Ingreso Plataforma")} />
                <StatCard icon={<Shield className="w-4 h-4 text-amber-300" />} value={String(revenueStats.activeSubscriptions)} label={t("Active Subs", "Abonnements Actifs", "Suscripciones Activas")} />
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-sm text-white/60 mb-2">{t("Content Library", "Bibliothèque de Contenu", "Biblioteca de Contenido")}</h3>
                <Row label={t("Total stories", "Histoires totales", "Historias totales")} value={String(STORY_WORLDS.length)} />
                <Row label={t("Creators", "Créateurs", "Creadores")} value={String(userStats.creators)} />
                <Row label={t("Moderators", "Modérateurs", "Moderadores")} value={String(userStats.moderators)} />
                <Row label={t("Suspended accounts", "Comptes suspendus", "Cuentas suspendidas")} value={String(userStats.suspended)} />
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-3">
              {users.length === 0 ? (
                <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-sm text-white/55">{t("No users have signed up yet.", "Aucun utilisateur inscrit.", "Aún no hay usuarios registrados.")}</p>
                </div>
              ) : (
                users.map(u => (
                  <div key={u.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-white">{u.name}</p>
                        <p className="text-xs text-white/55">{u.email}</p>
                      </div>
                      {u.status === "suspended" ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">{t("Suspended", "Suspendu", "Suspendido")}</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">{t("Active", "Actif", "Activo")}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white/30"
                      >
                        <option value="viewer" className="bg-black">{t("Viewer", "Spectateur", "Espectador")}</option>
                        <option value="creator" className="bg-black">{t("Creator", "Créateur", "Creador")}</option>
                        <option value="moderator" className="bg-black">{t("Moderator", "Modérateur", "Moderador")}</option>
                        <option value="admin" className="bg-black">{t("Admin", "Admin", "Admin")}</option>
                      </select>
                      <button
                        onClick={() => handleToggleSuspend(u.id, u.status === "suspended")}
                        className={`px-3 min-h-11 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                          u.status === "suspended"
                            ? "bg-green-500/10 border border-green-400/20 text-green-300 hover:bg-green-500/20"
                            : "bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20"
                        }`}
                      >
                        {u.status === "suspended" ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        {u.status === "suspended" ? t("Restore", "Restaurer", "Restaurar") : t("Suspend", "Suspendre", "Suspender")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "revenue" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 space-y-2">
                <Row label={t("Gross revenue (all-time)", "Revenu brut (total)", "Ingreso bruto (total)")} value={formatCents(revenueStats.totalGrossRevenue)} />
                <Row label={t("CREOVA platform revenue", "Revenu plateforme CREOVA", "Ingreso de plataforma CREOVA")} value={formatCents(revenueStats.totalPlatformRevenue)} strong />
                <Row label={t("Creator payouts owed", "Versements créateurs dus", "Pagos a creadores adeudados")} value={formatCents(revenueStats.totalCreatorPayouts)} />
                <Row label={t("Total transactions", "Transactions totales", "Transacciones totales")} value={String(revenueStats.totalTransactions)} />
                <Row label={t("Current platform fee", "Frais de plateforme actuels", "Comisión de plataforma actual")} value={`${revenueStats.platformFeePercent}%`} />
              </div>
              <p className="text-xs text-white/55 leading-relaxed px-1">
                {t(
                  "Every subscription and purchase automatically splits between the creator and CREOVA at the configured platform fee rate.",
                  "Chaque abonnement et achat se répartit automatiquement entre le créateur et CREOVA selon le taux de frais de plateforme configuré.",
                  "Cada suscripción y compra se divide automáticamente entre el creador y CREOVA según la tasa de comisión de plataforma configurada."
                )}
              </p>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm text-white mb-1 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-white/55" />
                  {t("Platform Fee", "Frais de Plateforme", "Comisión de Plataforma")}
                </h3>
                <p className="text-xs text-white/55 mb-4">
                  {t(
                    "Percentage CREOVA retains from every creator transaction.",
                    "Pourcentage que CREOVA retient de chaque transaction créateur.",
                    "Porcentaje que CREOVA retiene de cada transacción de creador."
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={feeInput}
                      onChange={e => setFeeInput(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55">%</span>
                  </div>
                  <button
                    onClick={handleSaveFee}
                    className="px-5 py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                  >
                    {saved ? t("Saved", "Enregistré", "Guardado") : t("Save", "Enregistrer", "Guardar")}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm text-white mb-1">{t("CREOVA Platform Subscription", "Abonnement Plateforme CREOVA", "Suscripción de Plataforma CREOVA")}</h3>
                <p className="text-xs text-white/55 mb-3">
                  {t("Monthly price for the platform-wide subscription tier.", "Prix mensuel du palier d'abonnement de la plateforme.", "Precio mensual del nivel de suscripción de la plataforma.")}
                </p>
                <p className="text-lg text-white font-semibold">{formatCents(config.platformSubscriptionPriceMonthly)}/{t("mo", "mois", "mes")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: JSX.Element; value: string; label: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="mb-2">{icon}</div>
      <div className="text-lg text-white font-semibold truncate">{value}</div>
      <div className="text-[11px] text-white/55 mt-0.5">{label}</div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/55">{label}</span>
      <span className={`text-sm ${strong ? "text-white font-semibold" : "text-white/80"}`}>{value}</span>
    </div>
  );
}
