import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Banner, Button } from "../components/seen/primitives";
import { TextField } from "../components/seen/forms";
import { useAppNav } from "../navigation/AppNav";
import { useT } from "../i18n/useT";
import { ScreenFrame } from "./ScreenFrame";

export const MAX_NAME = 80;
export const MAX_BIO = 280;

/** Edit the display name and bio. Role, email and id are never editable here. */
export function EditProfileScreen() {
  const nav = useAppNav();
  const t = useT();
  const { state, updateProfile } = useAuth();
  const user = state.user;
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameOk = name.trim().length > 0 && name.trim().length <= MAX_NAME;
  const changed = name.trim() !== (user?.name ?? "") || bio.trim() !== (user?.bio ?? "");

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      toast.success(t("edit.saved"));
      nav.back();
    } catch {
      setError(t("edit.err"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame title={t("edit.title")} onBack={nav.back}>
      {!user ? (
        <Banner tone="info">{t("edit.signin")}</Banner>
      ) : (
        <form
          className="flex flex-col gap-5"
          onSubmit={e => {
            e.preventDefault();
            if (nameOk && changed && !busy) void submit();
          }}
        >
          <TextField label={t("edit.name")} value={name} maxLength={MAX_NAME} autoComplete="name" onChange={e => setName(e.target.value)} error={name.length > 0 && !nameOk ? t("edit.name.err") : undefined} />
          <div>
            <label htmlFor="edit-bio" className="block text-[13px] font-medium text-white/80 mb-2">{t("edit.bio")}</label>
            <textarea
              id="edit-bio"
              value={bio}
              maxLength={MAX_BIO}
              rows={4}
              onChange={e => setBio(e.target.value)}
              aria-describedby="edit-bio-hint"
              className="w-full rounded-seen-md border border-seen-border bg-seen-surface px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
            />
            <p id="edit-bio-hint" className="text-xs text-seen-muted mt-1 flex justify-between gap-3">
              <span>{t("edit.bio.hint")}</span>
              <span aria-live="polite">{bio.length}/{MAX_BIO}</span>
            </p>
          </div>
          {error && <Banner tone="error">{error}</Banner>}
          <Button type="submit" fullWidth loading={busy} disabled={!nameOk || !changed}>{t("edit.save")}</Button>
          <Button type="button" variant="ghost" fullWidth onClick={nav.back}>{t("edit.cancel")}</Button>
        </form>
      )}
    </ScreenFrame>
  );
}
