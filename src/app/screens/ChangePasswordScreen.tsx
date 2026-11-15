import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Banner, Button } from "../components/seen/primitives";
import { PasswordField } from "../components/seen/forms";
import { useAppNav } from "../navigation/AppNav";
import { useT } from "../i18n/useT";
import { passwordProblems } from "./ResetPasswordScreen";
import { ScreenFrame } from "./ScreenFrame";

/** Change the password while signed in: the current password must be correct first. */
export function ChangePasswordScreen() {
  const nav = useAppNav();
  const t = useT();
  const { state, changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const problems = passwordProblems(next);
  const mismatch = confirm.length > 0 && confirm !== next;
  const canSubmit = !!state.user && current.length > 0 && problems.length === 0 && confirm === next && !busy;

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await changePassword(current, next);
      toast.success(t("pw.done"));
      nav.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("pw.err"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame title={t("pw.title")} onBack={nav.back}>
      <form
        className="flex flex-col gap-4"
        onSubmit={e => {
          e.preventDefault();
          if (canSubmit) void submit();
        }}
      >
        <PasswordField label={t("pw.current")} autoComplete="current-password" value={current} onChange={e => setCurrent(e.target.value)} />
        <PasswordField label={t("pw.new")} autoComplete="new-password" value={next} onChange={e => setNext(e.target.value)} />
        <p className="text-xs text-seen-muted" aria-live="polite">
          {problems.length === 0 ? t("pw.ok") : `Needs ${problems.join(", ")}.`}
        </p>
        <PasswordField label={t("pw.confirm")} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} error={mismatch ? t("pw.mismatch") : undefined} />
        {error && <Banner tone="error">{error}</Banner>}
        <Button type="submit" fullWidth loading={busy} disabled={!canSubmit}>{t("pw.update")}</Button>
      </form>
    </ScreenFrame>
  );
}
