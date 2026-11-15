import { useState } from "react";
import { track } from "../observability";
import { toast } from "sonner";
import { api } from "../services";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Badge, SectionTitle, SkeletonList } from "../components/seen/primitives";
import { SaveToggle } from "../components/seen/cards";
import { SeenImage } from "../components/seen/SeenImage";
import { StoryRow } from "../components/seen/StoryRow";
import { useAppNav } from "../navigation/AppNav";
import { useStoryState } from "../contexts/StoryStateContext";
import { getStoryWorldById } from "../data/storyDatabase";
import { ScreenFrame } from "./ScreenFrame";

export function CollectionDetailScreen({ collectionId }: { collectionId: string }) {
  const nav = useAppNav();
  const { state } = useStoryState();
  const [busy, setBusy] = useState(false);
  const resource = useResource(
    async () => {
      const [collection, saved] = await Promise.all([api.collections.get(collectionId), api.collections.listSaved()]);
      return { collection, saved: saved.includes(collectionId) };
    },
    [collectionId],
  );

  const toggleSave = async () => {
    if (!resource.data) return;
    const next = !resource.data.saved;
    setBusy(true);
    resource.mutate(prev => ({ ...prev!, saved: next }));
    try {
      await api.collections.setSaved(collectionId, next);
      if (next) track("collection_saved", { collectionId });
      toast.success(next ? "Collection saved to your library" : "Removed from your library");
    } catch {
      resource.mutate(prev => ({ ...prev!, saved: !next }));
      toast.error("Couldn't save the collection. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame title={resource.data?.collection.title ?? "Collection"} onBack={nav.back}>
      <ResourceView resource={resource} what="collection" skeleton={<SkeletonList count={4} label="Loading collection" />}>
        {({ collection, saved }) => {
          const cover = getStoryWorldById(collection.coverStoryId);
          return (
            <>
              <section className="relative -mx-gutter -mt-5 mb-6 aspect-[16/10] overflow-hidden">
                <SeenImage src={cover?.coverImage} alt="" decorative seed={collection.id} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <Badge tone="overImage">
                    {collection.kind === "institutional" ? "Institutional collection" : "Collection"}
                  </Badge>
                  <h2 className="text-3xl font-light tracking-tight mt-3">{collection.title}</h2>
                  <p className="text-xs tracking-[0.14em] uppercase text-white/55 mt-2">Curated by {collection.curator}</p>
                </div>
              </section>
              <p className="text-sm text-seen-secondary leading-relaxed mb-6">{collection.description}</p>
              <SaveToggle saved={saved} onToggle={toggleSave} label="Save collection" busy={busy} />
              <div className="mt-10">
                <SectionTitle title="Stories" subtitle={`${collection.storyIds.length} in this collection`} />
                <ul className="space-y-3">
                  {collection.storyIds.map(id => (
                    <li key={id}>
                      <StoryRow storyId={id} language={state.language} onOpen={nav.openStory} />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          );
        }}
      </ResourceView>
    </ScreenFrame>
  );
}
