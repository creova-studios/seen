import { toast } from "sonner";
import { track } from "../observability";
import { api, type SeenNotification } from "../services";
import { useResource } from "../hooks/useResource";
import { NotificationItem } from "../components/seen/cards";
import { ResourceView } from "../components/seen/ResourceView";
import { Button, StateTemplate } from "../components/seen/primitives";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "./ScreenFrame";

export function NotificationsScreen() {
  const nav = useAppNav();
  const resource = useResource(() => api.notifications.list());
  const unread = resource.data?.filter(n => !n.read).length ?? 0;

  const open = async (n: SeenNotification) => {
    if (!n.read) {
      resource.mutate(prev => (prev ?? []).map(x => (x.id === n.id ? { ...x, read: true } : x)));
      api.notifications.markRead(n.id).catch(() => undefined); // best effort; re-synced on next load
    }
    track("notification_opened", { type: n.type });
    const t = n.target;
    if (!t) return;
    if (t.screen === "story" && t.id) nav.openStory(t.id);
    else if (t.screen === "opportunity") nav.go("opportunity", { id: t.id });
    else if (t.screen === "creator") nav.go("creator-profile", { id: t.id });
    else if (t.screen === "collection") nav.go("collection-detail", { id: t.id });
    else if (t.screen === "moderation") nav.go("moderation-governance");
  };

  const markAll = async () => {
    try {
      await api.notifications.markAllRead();
      resource.mutate(prev => (prev ?? []).map(x => ({ ...x, read: true })));
      toast.success("All caught up");
    } catch {
      toast.error("Couldn't update notifications. Try again.");
    }
  };

  return (
    <ScreenFrame
      title="Notifications"
      onBack={nav.back}
      action={
        unread > 0 ? (
          <Button variant="ghost" size="sm" onClick={markAll}>
            Mark all read
          </Button>
        ) : undefined
      }
    >
      <ResourceView
        resource={resource}
        what="notifications"
        isEmpty={list => list.length === 0}
        empty={<StateTemplate kind="empty" title="You're all caught up" message="New stories from creators you follow and funding deadlines will show up here." />}
      >
        {list => (
          <ul className="space-y-3" aria-label="Notifications">
            {list.map(n => (
              <li key={n.id}>
                <NotificationItem notification={n} onOpen={open} />
              </li>
            ))}
          </ul>
        )}
      </ResourceView>
    </ScreenFrame>
  );
}
