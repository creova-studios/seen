import { track } from "../observability";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Banner, Button } from "../components/seen/primitives";
import { PasswordField } from "../components/seen/forms";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "./ScreenFrame";

/** Rules shown next to the field, matching sign-up. */
export function passwordProblems(password: string): string[] {
  const missing: string[] = [];
  if (password.length < 8) missing.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) missing.push("an uppercase letter");
  if (!/[a-z]/.test(password)) missing.push("a lowercase letter");
  if (!/[0-9]/.test(password)) missing.push("a number");
  return missing;
}

/** Opened from the reset link (#/reset-password/<token>). Works while signed out. */
export function ResetPasswordScreen({ token }: { token: string }) {
  const nav = useAppNav();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const problems = passwordProblems(password);
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = problems.length === 0 && confirm === password && !busy;
  const linkProblem = error?.includes("reset link");

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await resetPassword(token, password);
      track("password_reset_completed");
      toast.success("Password updated. Sign in with your new password.");
      nav.go("onboarding");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update your password. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame title="Set a new password" onBack={() => nav.go("onboarding")}>
      <form
        className="flex flex-col gap-4"
        onSubmit={e => {
          e.preventDefault();
          if (canSubmit) void submit();
        }}
      >
        <PasswordField label="New password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
        <p id="reset-rules" className="text-xs text-seen-muted" aria-live="polite">
          {problems.length === 0 ? "Meets the password rules." : `Needs ${problems.join(", ")}.`}
        </p>
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          error={mismatch ? "Passwords don't match." : undefined}
        />
        {error && <Banner tone="error">{error}</Banner>}
        <Button type="submit" fullWidth loading={busy} disabled={!canSubmit}>
          Update password
        </Button>
        {linkProblem && (
          <Button type="button" variant="secondary" fullWidth onClick={() => nav.go("onboarding")}>
            Request a new link
          </Button>
        )}
      </form>
    </ScreenFrame>
  );
}
