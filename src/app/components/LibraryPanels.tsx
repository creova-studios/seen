/** Library tabs from Figma 331:90 (Following) and 330:176 (Collections), built on the real creator and collection services. */
import { toast } from "sonner";
import { Folder, Users } from "lucide-react";
import { api, type Collection, type Creator } from "../services";
import { useResource } from "../hooks/useResource";
import { useAppNav } from "../navigation/AppNav";
import { ResourceView } from "./seen/ResourceView";
import { Avatar, Button, StateTemplate } from "./seen/primitives";
import { track } from "../observability";

export function useLibraryCounts() {
  return useResource(async () => {
    const [following, saved] = await Promise.all([api.creators.listFollowing(), api.collections.listSaved()]);
    return { following: following.length, collections: saved.length };
  }, []);
}

/** Creators you follow. One tap target opens the profile; the pill unfollows with an optimistic update and rollback. */
export function FollowingPanel({ onChanged }: { onChanged: () => void }) {
  const nav = useAppNav();
  const res = useResource(async () => {
    const [ids, all] = await Promise.all([api.creators.listFollowing(), api.creators.list()]);
    return all.filter(c => ids.includes(c.id));
  }, []);

  const unfollow = async (c: Creator) => {
    const previous = res.data ?? [];
    res.mutate(list => (list ?? []).filter(x => x.id !== c.id));
    try {
      await api.creators.setFollowing(c.id, false);
      track("creator_unfollowed", { creatorId: c.id });
      toast.success(`Unfollowed ${c.name}`);
      onChanged();
    } catch {
      res.mutate(() => previous);
      toast.error(`Couldn't unfollow ${c.name}. Try again.`);
    }
  };

  return (
    <ResourceView
      resource={res}
      what="following"
      isEmpty={d => d.length === 0}
      empty={
        <StateTemplate
          kind="empty"
          icon={<Users className="w-5 h-5" aria-hidden />}
          title="No creators yet"
          message="Follow a creator to get their new stories."
          actionLabel="Find creators"
          onAction={() => nav.go("explore", { tab: "creators" })}
        />
      }
    >
      {list => (
        <ul className="space-y-3">
          {list.map(c => (
            <li key={c.id} className="flex items-center gap-3 rounded-seen-md border border-seen-border bg-seen-surface p-2 pr-3">
              <button type="button" onClick={() => nav.go("creator-profile", { id: c.id })} className="flex items-center gap-3 flex-1 min-w-0 min-h-11 text-left" aria-label={`Open ${c.name}`}>
                <Avatar name={c.name} size="md" />
                <span className="min-w-0">
                  <span className="block text-base font-semibold leading-[1.35] text-white truncate">{c.name}</span>
                  <span className="block text-xs text-seen-muted truncate">{c.themes[0] ?? `${c.storyIds.length} ${c.storyIds.length === 1 ? "story" : "stories"}`}</span>
                </span>
              </button>
              <Button size="sm" variant="secondary" aria-label={`Unfollow ${c.name}`} onClick={() => unfollow(c)}>
                Following
              </Button>
            </li>
          ))}
        </ul>
      )}
    </ResourceView>
  );
}

/** Collections you saved. Creating personal collections is not offered because no create API exists. */
export function SavedCollectionsPanel() {
  const nav = useAppNav();
  const res = useResource(async () => {
    const [ids, all] = await Promise.all([api.collections.listSaved(), api.collections.list()]);
    return all.filter(c => ids.includes(c.id));
  }, []);
  return (
    <ResourceView
      resource={res}
      what="collections"
      isEmpty={d => d.length === 0}
      empty={
        <StateTemplate
          kind="empty"
          icon={<Folder className="w-5 h-5" aria-hidden />}
          title="No saved collections"
          message="Save a collection from Explore to keep it here."
          actionLabel="Browse collections"
          onAction={() => nav.go("explore", { tab: "collections" })}
        />
      }
    >
      {list => (
        <ul className="space-y-3">
          {list.map((c: Collection) => (
            <li key={c.id}>
              <button type="button" onClick={() => nav.go("collection-detail", { id: c.id })} className="w-full min-h-[72px] flex items-center gap-3 rounded-seen-md border border-seen-border bg-seen-surface p-3 text-left hover:border-white/25 transition-colors">
                <span className="w-11 h-11 rounded-seen-sm bg-seen-elevated border border-seen-border flex items-center justify-center flex-shrink-0">
                  <Folder className="w-5 h-5 text-white/70" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold leading-[1.35] text-white truncate">{c.title}</span>
                  <span className="block text-xs text-seen-muted truncate">
                    {c.storyIds.length} {c.storyIds.length === 1 ? "story" : "stories"} · {c.kind === "institutional" ? "Institutional" : `by ${c.curator}`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </ResourceView>
  );
}
