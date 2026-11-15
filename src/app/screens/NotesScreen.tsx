import { useState } from "react";
import { toast } from "sonner";
import { MessageSquareText, Trash2, UserX } from "lucide-react";
import { api, type Note } from "../services";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Button, StateTemplate } from "../components/seen/primitives";
import { ConfirmDialog } from "../components/seen/overlays";
import { useAppNav } from "../navigation/AppNav";
import { track } from "../observability";
import { useT } from "../i18n/useT";
import { ScreenFrame } from "./ScreenFrame";

/**
 * Creator inbox for private notes (E1). One-way: there is no reply, no public count,
 * and a reader is shown by name only if they chose to be.
 */
export function NotesScreen() {
  const nav = useAppNav();
  const t = useT();
  const notes = useResource(() => api.notes.received(), []);
  const [pending, setPending] = useState<Note | null>(null);
  const [blocking, setBlocking] = useState<Note | null>(null);

  const blockSender = async () => {
    const target = blocking;
    if (!target) return;
    setBlocking(null);
    try {
      await api.notes.blockSender(target.id);
      toast.success(t("inbox.blocked"));
    } catch {
      toast.error(t("inbox.err.block"));
    }
  };

  const remove = async () => {
    const target = pending;
    if (!target) return;
    setPending(null);
    const previous = notes.data;
    notes.mutate(list => (list ?? []).filter(n => n.id !== target.id));
    try {
      await api.notes.remove(target.id);
      track("note_deleted");
    } catch {
      notes.mutate(() => previous ?? []);
      toast.error(t("inbox.err.delete"));
    }
  };

  return (
    <ScreenFrame title={t("inbox.title")} onBack={nav.back}>
      <p className="text-sm text-seen-secondary mb-5">{t("inbox.intro")}</p>
      <ResourceView
        resource={notes}
        what="notes"
        isEmpty={d => d.length === 0}
        empty={
          <StateTemplate
            kind="empty"
            icon={<MessageSquareText className="w-5 h-5" aria-hidden />}
            title={t("inbox.emptyTitle")}
            message={t("inbox.emptyBody")}
          />
        }
      >
        {list => (
          <ul className="space-y-3">
            {list.map(n => (
              <li key={n.id} className="rounded-seen-md border border-seen-border bg-seen-surface p-4">
                <p className="text-xs tracking-[0.14em] uppercase text-seen-muted">{n.senderName ?? t("inbox.anonymous")}</p>
                <p className="text-sm text-white mt-2 whitespace-pre-wrap break-words">{n.body}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-seen-muted">{new Date(n.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setBlocking(n)} aria-label={t("inbox.blockConfirm")}>
                      <UserX className="w-4 h-4" aria-hidden /> {t("inbox.block")}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setPending(n)} aria-label={t("inbox.deleteConfirm")}>
                      <Trash2 className="w-4 h-4" aria-hidden /> {t("inbox.delete")}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ResourceView>
      <ConfirmDialog
        open={blocking !== null}
        onOpenChange={o => !o && setBlocking(null)}
        title={t("inbox.blockTitle")}
        description={t("inbox.blockBody")}
        confirmLabel={t("inbox.blockConfirm")}
        destructive
        onConfirm={blockSender}
      />
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={o => !o && setPending(null)}
        title={t("inbox.deleteTitle")}
        description={t("inbox.deleteBody")}
        confirmLabel={t("inbox.deleteConfirm")}
        destructive
        onConfirm={remove}
      />
    </ScreenFrame>
  );
}
