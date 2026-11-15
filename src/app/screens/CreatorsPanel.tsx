import { api } from "../services";
import { useResource } from "../hooks/useResource";
import { CreatorCard } from "../components/seen/cards";
import { ResourceView } from "../components/seen/ResourceView";
import { Skeleton, StateTemplate } from "../components/seen/primitives";
import { useAppNav } from "../navigation/AppNav";

/** Explore → Creators tab. */
export function CreatorsPanel() {
  const nav = useAppNav();
  const resource = useResource(() => Promise.all([api.creators.list(), api.creators.listFollowing()]));

  return (
    <ResourceView
      resource={resource}
      what="creators"
      isEmpty={([list]) => list.length === 0}
      empty={<StateTemplate kind="empty" title="No creators yet" message="Creators appear here as soon as they publish their first story." />}
      skeleton={
        <div className="grid grid-cols-2 gap-3" aria-busy>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} kind="block" className="h-40" />
          ))}
        </div>
      }
    >
      {([creators, following]) => (
        <ul className="grid grid-cols-2 min-[840px]:grid-cols-3 gap-3 auto-rows-fr" aria-label="Creators">
          {creators.map(c => (
            <li key={c.id}>
              <CreatorCard creator={c} following={following.includes(c.id)} onOpen={id => nav.go("creator-profile", { id })} />
            </li>
          ))}
        </ul>
      )}
    </ResourceView>
  );
}
