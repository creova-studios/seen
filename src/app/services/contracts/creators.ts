// ---------------------------------------------------------------- Creators
export interface Creator {
  id: string;            // stable slug, e.g. "kira-chen"
  name: string;
  bio: string;
  themes: string[];      // derived from the creator's published stories
  storyIds: string[];
  languages: string[];
  orgId: string | null;  // institutional/collective owner, null for individuals
}

export interface CreatorsApi {
  list(): Promise<Creator[]>;
  get(id: string): Promise<Creator>;
  listFollowing(): Promise<string[]>;
  setFollowing(id: string, following: boolean): Promise<void>;
}
