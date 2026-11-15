/**
 * Deterministic demo catalog.
 *
 * Creators and collections are DERIVED from the real story catalog
 * (storyDatabase.ts), so they can never drift from what readers can open.
 * Funding opportunities are real, researched listings: services/data/fundingListings.ts.
 */
import { STORY_WORLDS, type StoryWorld } from "../../data/storyDatabase";
import type { Collection, Creator, SeenNotification } from "../contracts";
import { slugify } from "../runtime";
import { FUNDING_LISTINGS } from "../data/fundingListings";
import { formatDeadline, opportunityStatus } from "../funding";

function publicStories(): StoryWorld[] {
  return STORY_WORLDS.filter(s => s.visibility === "public");
}

function topThemes(stories: StoryWorld[], n: number): string[] {
  const counts = new Map<string, number>();
  stories.flatMap(s => s.culturalThemes).forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([t]) => t);
}

export function buildCreators(): Creator[] {
  const byName = new Map<string, StoryWorld[]>();
  for (const s of publicStories()) {
    const name = s.creator.en;
    byName.set(name, [...(byName.get(name) ?? []), s]);
  }
  return [...byName.entries()]
    .map(([name, stories]) => {
      const themes = topThemes(stories, 3);
      const isCollective = /collective|voices|keepers|contributors/i.test(name);
      const count = stories.length;
      return {
        id: slugify(name),
        name,
        bio: `${isCollective ? "A collective" : "A storyteller"} working across ${themes
          .slice(0, 2)
          .join(" and ")
          .toLowerCase()}. ${count} ${count === 1 ? "story" : "stories"} on SEEN.`,
        themes,
        storyIds: stories.map(s => s.id),
        languages: [...new Set(stories.flatMap(s => s.languagesAvailable))],
        orgId: isCollective ? `org_${slugify(name)}` : null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildCollections(): Collection[] {
  const stories = publicStories();
  const themed: Collection[] = [];
  const themeMap = new Map<string, StoryWorld[]>();
  stories.forEach(s => s.culturalThemes.forEach(t => themeMap.set(t, [...(themeMap.get(t) ?? []), s])));
  for (const [theme, list] of [...themeMap.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) {
    if (list.length < 2) continue;
    themed.push({
      id: `theme-${slugify(theme)}`,
      kind: "thematic",
      title: theme,
      description: `${list.length} stories connected by ${theme.toLowerCase()}, gathered by the SEEN editorial team.`,
      curator: "SEEN Editorial",
      storyIds: list.map(s => s.id),
      coverStoryId: list[0].id,
      orgId: null,
    });
  }

  const partners = new Map<string, StoryWorld[]>();
  stories.forEach(s => {
    if (s.institutionalPartner) partners.set(s.institutionalPartner, [...(partners.get(s.institutionalPartner) ?? []), s]);
  });
  const institutional: Collection[] = [...partners.entries()].map(([partner, list]) => ({
    id: `inst-${slugify(partner)}`,
    kind: "institutional",
    title: `${partner} Selection`,
    description: `Stories presented with ${partner}.`,
    curator: partner,
    storyIds: list.map(s => s.id),
    coverStoryId: list[0].id,
    orgId: `org_${slugify(partner)}`,
  }));

  return [...institutional, ...themed];
}

export function seedNotifications(now: Date): SeenNotification[] {
  const ago = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();
  const newest = publicStories().find(s => s.new) ?? publicStories()[0];
  const funding = fundingNotification(now);
  return [
    ...(funding ? [{ ...funding, createdAt: ago(26) }] : []),
    {
      id: "n-welcome",
      type: "story",
      title: "Welcome to SEEN",
      body: "Save stories to your library, and follow creators to get their new stories.",
      createdAt: ago(1),
      read: false,
    },
    {
      id: `n-new-${newest.id}`,
      type: "story",
      title: "New story",
      body: `${newest.title.en} by ${newest.creator.en} is now on SEEN.`,
      createdAt: ago(5),
      read: false,
      target: { screen: "story", id: newest.id },
    },
  ];
}

/** Points at the real listing with the nearest open deadline, so the alert is never stale. */
function fundingNotification(now: Date): Omit<SeenNotification, "createdAt"> | null {
  const next = FUNDING_LISTINGS.filter(o => o.deadline && ["open", "closing-soon"].includes(opportunityStatus(o, now))).sort(
    (a, b) => a.deadline!.localeCompare(b.deadline!),
  )[0];
  if (!next) return null;
  const soon = opportunityStatus(next, now) === "closing-soon";
  return {
    id: `n-funding-${next.id}`,
    type: "funding",
    title: soon ? "Funding closing soon" : "Upcoming funding deadline",
    body: `${next.funder}: ${next.title}. ${formatDeadline(next.deadline!, now, next.deadlineTimeZone)}.`,
    read: false,
    target: { screen: "opportunity", id: next.id },
  };
}
