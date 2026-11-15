import { Flag } from "lucide-react";
import { useT } from "../i18n/useT";
import type { StringKey } from "../i18n/strings";
import type { Report } from "../services";
import { Badge, Button, StateTemplate } from "./seen/primitives";

interface ReportsPanelProps {
  reports: Report[];
  onResolve: (id: string, status: "action_taken" | "dismissed") => void;
}


/** Moderator view of reports on stories and creator profiles. Reporter identity is not shown. */
export function ReportsPanel({ reports, onResolve }: ReportsPanelProps) {
  const t = useT();
  if (reports.length === 0) {
    return (
      <div className="px-5 pt-6">
        <StateTemplate
          kind="empty"
          icon={<Flag className="w-5 h-5" aria-hidden />}
          title={t("reports.empty.title")}
          message={t("reports.empty.body")}
        />
      </div>
    );
  }
  return (
    <ul className="px-5 pt-5 space-y-3">
      {reports.map(r => (
        <li key={r.id} className="rounded-seen-md border border-seen-border bg-seen-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.14em] uppercase text-seen-muted">{t(`reports.target.${r.targetType}` as StringKey)}</p>
              <p className="text-sm text-white mt-1 truncate">{r.targetTitle}</p>
            </div>
            <Badge tone={r.status === "open" ? "gold" : "surface"}>{t(`reports.status.${r.status}` as StringKey)}</Badge>
          </div>
          <p className="text-sm text-white/80 mt-3">{t(`report.reason.${r.reason}.label` as StringKey)}</p>
          {r.details && <p className="text-sm text-seen-secondary mt-1 break-words">{r.details}</p>}
          <p className="text-xs text-seen-muted mt-2">{new Date(r.createdAt).toLocaleString()}</p>
          {r.status === "open" && (
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="secondary" onClick={() => onResolve(r.id, "dismissed")}>
                {t("reports.dismiss")}
              </Button>
              <Button size="sm" onClick={() => onResolve(r.id, "action_taken")}>
                {t("reports.action")}
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
