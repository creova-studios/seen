import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, FileText, KeyRound, Download, LogOut, ShieldCheck, Trash2, UserX } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services";
import { track } from "../observability";
import { useT } from "../i18n/useT";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Button, SectionTitle, StateTemplate } from "../components/seen/primitives";
import { Toggle } from "../components/seen/forms";
import { ConfirmDialog } from "../components/seen/overlays";
import { ListItem } from "../components/seen/display";
import {
  buildAccountExport,
  deleteLocalAccount,
  loadNotificationPrefs,
  type NotificationPrefs,
} from "../data/accountData";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "./ScreenFrame";

/**
 * Account and privacy: what SEEN keeps, notification choices, blocked accounts,
 * export, sign out and delete. Added on top of Settings; nothing there changes.
 */
export function AccountPrivacyScreen() {
  const nav = useAppNav();
  const t = useT();
  const { state: auth, signOut } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadNotificationPrefs);
  const [confirm, setConfirm] = useState<"signout" | "delete" | null>(null);
  const user = auth.user;
  const blocked = useResource(() => api.blocks.list(), []);

  const unblock = async (id: string) => {
    const previous = blocked.data ?? [];
    blocked.mutate(list => (list ?? []).filter(x => x !== id));
    try {
      await api.blocks.unblock(id);
      toast.success(t("account.blocked.done"));
    } catch {
      blocked.mutate(() => previous);
      toast.error(t("account.blocked.err"));
    }
  };

  useEffect(() => {
    let live = true;
    api.preferences.get().then(p => live && setPrefs(p)).catch(() => {});
    return () => { live = false; };
  }, []);

  const setPref = async (key: keyof NotificationPrefs, value: boolean) => {
    const previous = prefs;
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      await api.preferences.set(next);
    } catch {
      setPrefs(previous);
      toast.error(t("account.notif.err"));
    }
  };

  const exportData = () => {
    try {
      const file = buildAccountExport(user);
      const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "seen-my-data.json";
      a.click();
      URL.revokeObjectURL(url);
      track("account_data_exported");
      toast.success(t("account.data.downloaded"));
    } catch {
      toast.error(t("account.data.err"));
    }
  };

  const doSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch {
      toast.error(t("account.signout.err"));
    }
  };

  const doDelete = async () => {
    if (!user) return;
    try {
      track("account_deleted");
      deleteLocalAccount(user.id);
      await signOut();
      window.location.reload();
    } catch {
      toast.error(t("account.delete.err"));
    }
  };

  return (
    <ScreenFrame title={t("account.title")} onBack={nav.back}>
      <section className="mb-10">
        <SectionTitle title={t("account.privacy.title")} />
        <div className="flex gap-3 rounded-seen-md border border-seen-border bg-seen-surface p-4">
          <ShieldCheck className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-xs text-seen-secondary leading-relaxed">
            {t("account.privacy.body")}
          </p>
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle title={t("account.notif.title")} subtitle={t("account.notif.sub")} />
        <div className="rounded-seen-md border border-seen-border bg-seen-surface px-4 divide-y divide-white/5">
          <div className="py-2">
            <Toggle checked={prefs.newStories} onChange={v => setPref("newStories", v)} label={t("account.notif.stories")} description={t("account.notif.stories.d")} />
          </div>
          <div className="py-2">
            <Toggle checked={prefs.fundingDeadlines} onChange={v => setPref("fundingDeadlines", v)} label={t("account.notif.funding")} description={t("account.notif.funding.d")} />
          </div>
          <div className="py-2">
            <Toggle checked={prefs.replies} onChange={v => setPref("replies", v)} label={t("account.notif.replies")} description={t("account.notif.replies.d")} />
          </div>
        </div>
        <p className="flex items-center gap-2 text-xs text-seen-muted mt-2">
          <Bell className="w-3.5 h-3.5" aria-hidden /> {t("account.notif.note")}
        </p>
      </section>

      <section className="mb-10">
        <SectionTitle title={t("account.blocked.title")} />
        <ResourceView
          resource={blocked}
          what="blocked accounts"
          isEmpty={d => d.length === 0}
          empty={
            <StateTemplate
              kind="empty"
              icon={<UserX className="w-5 h-5" aria-hidden />}
              title={t("account.blocked.empty")}
              message={t("account.blocked.emptyBody")}
            />
          }
        >
          {ids => (
            <ul className="space-y-2">
              {ids.map((id, i) => (
                <li key={id} className="flex items-center justify-between gap-3 rounded-seen-md border border-seen-border bg-seen-surface p-3 pl-4">
                  <span className="text-sm text-white">{t("account.blocked.reader", { n: String(i + 1) })}</span>
                  <Button size="sm" variant="secondary" onClick={() => unblock(id)}>{t("account.blocked.unblock")}</Button>
                </li>
              ))}
            </ul>
          )}
        </ResourceView>
      </section>

      <section className="mb-10">
        <SectionTitle title={t("account.security")} />
        <div className="flex flex-col gap-3">
          <ListItem icon={<KeyRound className="w-5 h-5" />} label={t("account.changePw")} description={t("account.changePw.d")} onClick={() => nav.go("change-password")} />
          <ListItem icon={<FileText className="w-5 h-5" />} label={t("account.legal")} description={t("account.legal.d")} onClick={() => nav.go("legal")} />
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle title={t("account.data.title")} />
        <div className="flex flex-col gap-3">
          <ListItem icon={<Download className="w-5 h-5" />} label={t("account.data.download")} description={t("account.data.downloadBody")} onClick={exportData} />
          <ListItem icon={<LogOut className="w-5 h-5" />} label={t("account.signout")} onClick={() => setConfirm("signout")} />
          <Button variant="destructive" icon={<Trash2 className="w-4 h-4" aria-hidden />} onClick={() => setConfirm("delete")} disabled={!user} className="w-full">
            {t("account.delete")}
          </Button>
          {!user && <p className="text-xs text-seen-muted">{t("account.signinToManage")}</p>}
        </div>
      </section>

      <ConfirmDialog
        open={confirm === "signout"}
        onOpenChange={o => !o && setConfirm(null)}
        title={t("account.signout.title")}
        description={t("account.signout.body")}
        confirmLabel={t("account.signout")}
        destructive={false}
        onConfirm={doSignOut}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        onOpenChange={o => !o && setConfirm(null)}
        title={t("account.delete.title")}
        description={t("account.delete.body")}
        confirmLabel={t("account.delete.confirm")}
        onConfirm={doDelete}
      />
    </ScreenFrame>
  );
}
