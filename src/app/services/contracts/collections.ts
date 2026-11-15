// ------------------------------------------------------------- Collections
export type CollectionKind = "thematic" | "institutional";

export interface Collection {
  id: string;
  kind: CollectionKind;
  title: string;
  description: string;
  curator: string;
  storyIds: string[];
  coverStoryId: string;
  orgId: string | null;
}

export interface CollectionsApi {
  list(kind?: CollectionKind): Promise<Collection[]>;
  get(id: string): Promise<Collection>;
  listSaved(): Promise<string[]>;
  setSaved(id: string, saved: boolean): Promise<void>;
}
