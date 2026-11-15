import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, ServiceError } from "../services";
import { useStoryState } from "../contexts/StoryStateContext";
import { track } from "../observability";
import { useT } from "../i18n/useT";
import { localizeError, type StringKey } from "../i18n/strings";
import {
  MAX_DETAILS,
  REPORT_REASONS,
  type ReportReason,
} from "../data/reportService";
import type { ReportTarget } from "../services";
import { Button } from "./seen/primitives";
import { RadioGroup } from "./seen/forms";
import { Sheet } from "./seen/overlays";

interface ReportContentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: ReportTarget;
  targetId: string;
  targetTitle: string;
}

/**
 * Report a story or creator. Ends on a confirmation; the reported person is never told who reported.
 * The body mounts only while open, so each opening starts with a fresh form.
 */
export function ReportContentSheet(props: ReportContentSheetProps) {
  return props.open ? <ReportSheetBody {...props} /> : null;
}

function ReportSheetBody({ open, onOpenChange, targetType, targetId, targetTitle }: ReportContentSheetProps) {
  const t = useT();
  const lang = useStoryState().state.language;
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const close = (next: boolean) => onOpenChange(next);

  const submit = async () => {
    if (!reason) return;
    setBusy(true);
    setError(null);
    try {
      await api.reports.submit({ targetType, targetId, targetTitle, reason, details });
      track("report_submitted", { target: targetType, reason });
      setSent(true);
    } catch (e) {
      if (e instanceof ServiceError && e.code === "conflict") setError(localizeError(e.message, lang));
      else if (e instanceof ServiceError && e.code === "forbidden") setError(t("report.err.signin"));
      else {
        setError(t("report.err.generic"));
        toast.error(t("report.err.generic"));
      }
    } finally {
      setBusy(false);
    }
  };

  const noun: "story" | "profile" = targetType === "story" ? "story" : "profile";

  return (
    <Sheet
      open={open}
      onOpenChange={close}
      title={sent ? t("report.title.sent") : t(`report.title.${noun}`)}
      description={sent ? undefined : t("report.desc")}
      footer={
        sent ? (
          <Button fullWidth onClick={() => close(false)}>
            {t("report.done")}
          </Button>
        ) : (
          <Button fullWidth loading={busy} disabled={!reason || busy} onClick={submit}>
            {t("report.send")}
          </Button>
        )
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-3 py-4" role="status">
          <CheckCircle2 className="w-8 h-8 text-seen-success" aria-hidden />
          <p className="text-sm text-white/80 max-w-[30ch]">{t(`report.thanks.${noun}`)}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <RadioGroup<ReportReason>
            label={t("report.why")}
            value={reason as ReportReason}
            onChange={setReason}
            options={REPORT_REASONS.map(r => ({ value: r.value, label: t(`report.reason.${r.value}.label` as StringKey), description: t(`report.reason.${r.value}.desc` as StringKey) }))}
          />
          <div>
            <label htmlFor="report-details" className="block text-xs tracking-[0.14em] uppercase text-seen-muted mb-2">
              {t("report.detail")}
            </label>
            <textarea
              id="report-details"
              value={details}
              maxLength={MAX_DETAILS}
              onChange={e => setDetails(e.target.value)}
              rows={3}
              className="w-full rounded-seen-md border border-seen-border bg-seen-surface px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              placeholder={t("report.placeholder")}
            />
            <p className="text-xs text-seen-muted mt-1 text-right" aria-live="polite">
              {details.length}/{MAX_DETAILS}
            </p>
          </div>
          {error && (
            <p role="alert" className="text-sm text-seen-error">
              {error}
            </p>
          )}
        </div>
      )}
    </Sheet>
  );
}
