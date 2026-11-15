/**
 * ENHANCED FEATURES — BACKEND LOGIC
 * SEEN by CREOVA
 * 
 * Server-side functions for non-visual feature extensions
 * All features optional, privacy-first, no UI modifications
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Import types (in production, these would be shared via package)
import type {
  EnhancedContextCard,
  UserReadingPreferences,
  ChapterConsumptionState,
  InstitutionalCollection,
  AggregateStoryMetrics,
  PlatformWideMetrics,
  CreatorNote,
  CommunityReflection,
  ModerationStatus,
  OfflineCulturalPack,
  ChapterNarrationTrack,
  ChapterVersion,
  StoryWorldHistory,
  ContentRights,
  SeasonalEditorialFraming,
  UserFeaturePreferences,
  CMFReport,
} from '/src/app/types/enhancedFeatures.ts';

// ============================================================================
// FEATURE SET A: ENHANCED CONTEXT CARDS
// ============================================================================

/**
 * Retrieves context card with progressive depth
 * Level 1: Basic explanation
 * Level 2: Expanded context
 * Level 3: Institution-verified annotation
 */
export async function getContextCard(
  cardId: string,
  level: 1 | 2 | 3 = 1,
): Promise<EnhancedContextCard | null> {
  const key = `context-card:${cardId}`;
  const card = await kv.get<EnhancedContextCard>(key);

  if (!card) return null;

  // Return only the requested level (progressive disclosure)
  if (level === 1) {
    return {
      ...card,
      expandedContext: undefined,
      institutionAnnotation: undefined,
    };
  } else if (level === 2) {
    return {
      ...card,
      institutionAnnotation: undefined,
    };
  }

  return card; // Level 3: full card
}

/**
 * Creates or updates context card
 */
export async function setContextCard(
  card: EnhancedContextCard,
): Promise<void> {
  const key = `context-card:${card.id}`;
  await kv.set(key, card);
  console.log(`[ContextCard] Saved: ${card.id}`);
}

/**
 * Gets all context cards for a story
 */
export async function getStoryContextCards(
  storyId: string,
): Promise<EnhancedContextCard[]> {
  const prefix = 'context-card:';
  const allCards = await kv.getByPrefix<EnhancedContextCard>(prefix);

  return allCards.filter((card) =>
    card.relatedStoryIds?.includes(storyId)
  );
}

// ============================================================================
// FEATURE SET B: GUIDED READING/LISTENING MODES
// ============================================================================

/**
 * Gets user reading preferences (localStorage or server)
 */
export async function getUserReadingPreferences(
  userId?: string,
): Promise<UserReadingPreferences> {
  if (!userId) {
    // Anonymous user: return defaults
    return {
      consumptionMode: 'read-and-listen',
      autoPlayNext: false,
      audioSpeed: 1.0,
      preferredLanguage: 'en',
      ambientAudioEnabled: true,
      narrationVolume: 100,
      ambientVolume: 40,
      lastUpdated: new Date().toISOString(),
    };
  }

  const key = `user-preferences:${userId}`;
  const prefs = await kv.get<UserReadingPreferences>(key);

  return prefs || {
    userId,
    consumptionMode: 'read-and-listen',
    autoPlayNext: false,
    audioSpeed: 1.0,
    preferredLanguage: 'en',
    ambientAudioEnabled: true,
    narrationVolume: 100,
    ambientVolume: 40,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Updates user reading preferences
 */
export async function updateUserReadingPreferences(
  userId: string,
  preferences: Partial<UserReadingPreferences>,
): Promise<UserReadingPreferences> {
  const current = await getUserReadingPreferences(userId);
  const updated: UserReadingPreferences = {
    ...current,
    ...preferences,
    userId,
    lastUpdated: new Date().toISOString(),
  };

  const key = `user-preferences:${userId}`;
  await kv.set(key, updated);

  console.log(`[Preferences] Updated for user: ${userId}`);
  return updated;
}

/**
 * Saves chapter consumption state (resume position)
 */
export async function saveChapterConsumptionState(
  userId: string | undefined,
  state: ChapterConsumptionState,
): Promise<void> {
  if (!userId) {
    // Anonymous user: store in localStorage (client-side)
    console.log('[ConsumptionState] Anonymous user, skipping server save');
    return;
  }

  const key = `consumption-state:${userId}:${state.chapterId}`;
  await kv.set(key, state);

  console.log(
    `[ConsumptionState] Saved for ${state.chapterId}, mode: ${state.mode}`,
  );
}

/**
 * Retrieves chapter consumption state
 */
export async function getChapterConsumptionState(
  userId: string,
  chapterId: string,
): Promise<ChapterConsumptionState | null> {
  const key = `consumption-state:${userId}:${chapterId}`;
  return await kv.get<ChapterConsumptionState>(key);
}

// ============================================================================
// FEATURE SET C: INSTITUTIONAL COLLECTIONS & SYLLABI
// ============================================================================

/**
 * Creates institutional collection
 */
export async function createInstitutionalCollection(
  collection: InstitutionalCollection,
): Promise<void> {
  const key = `collection:${collection.id}`;
  await kv.set(key, collection);
  console.log(`[Collection] Created: ${collection.id}`);
}

/**
 * Gets institutional collection by ID
 */
export async function getInstitutionalCollection(
  collectionId: string,
): Promise<InstitutionalCollection | null> {
  const key = `collection:${collectionId}`;
  return await kv.get<InstitutionalCollection>(key);
}

/**
 * Lists all public collections (for Explore section)
 */
export async function listPublicCollections(): Promise<
  InstitutionalCollection[]
> {
  const prefix = 'collection:';
  const allCollections = await kv.getByPrefix<InstitutionalCollection>(prefix);

  return allCollections.filter((c) => c.isPublic);
}

/**
 * Gets collections by institution
 */
export async function getInstitutionCollections(
  institutionId: string,
): Promise<InstitutionalCollection[]> {
  const prefix = 'collection:';
  const allCollections = await kv.getByPrefix<InstitutionalCollection>(prefix);

  return allCollections.filter((c) => c.institutionId === institutionId);
}

// ============================================================================
// FEATURE SET D: CULTURAL IMPACT ANALYTICS (CMF-COMPLIANT)
// ============================================================================

/**
 * Records story start (aggregate only, no user tracking)
 */
export async function recordStoryStart(storyWorldId: string): Promise<void> {
  const key = `analytics:story-starts:${storyWorldId}`;
  const current = (await kv.get<number>(key)) || 0;
  await kv.set(key, current + 1);
}

/**
 * Records story completion (aggregate only)
 */
export async function recordStoryCompletion(
  storyWorldId: string,
): Promise<void> {
  const key = `analytics:story-completions:${storyWorldId}`;
  const current = (await kv.get<number>(key)) || 0;
  await kv.set(key, current + 1);
}

/**
 * Records audio listening duration (aggregate only)
 */
export async function recordAudioListening(
  storyWorldId: string,
  durationMinutes: number,
): Promise<void> {
  const key = `analytics:audio-minutes:${storyWorldId}`;
  const current = (await kv.get<number>(key)) || 0;
  await kv.set(key, current + durationMinutes);
}

/**
 * Records language usage (aggregate only)
 */
export async function recordLanguageUsage(
  language: 'en' | 'fr' | 'es',
): Promise<void> {
  const key = `analytics:language-usage:${language}`;
  const current = (await kv.get<number>(key)) || 0;
  await kv.set(key, current + 1);
}

/**
 * Generates aggregate story metrics (CMF-compliant)
 */
export async function generateStoryMetrics(
  storyWorldId: string,
  season: number,
  periodStart: string,
  periodEnd: string,
): Promise<AggregateStoryMetrics> {
  const starts = (await kv.get<number>(
    `analytics:story-starts:${storyWorldId}`,
  )) || 0;
  const completions = (await kv.get<number>(
    `analytics:story-completions:${storyWorldId}`,
  )) || 0;
  const audioMinutes = (await kv.get<number>(
    `analytics:audio-minutes:${storyWorldId}`,
  )) || 0;

  const completionRate = starts > 0 ? (completions / starts) * 100 : 0;
  const averageListenDuration = completions > 0
    ? audioMinutes / completions
    : 0;

  // Language breakdown (simplified - would need session tracking)
  const totalLanguageUsage = (await kv.get<number>(
    'analytics:language-usage:en',
  ) || 0) +
    (await kv.get<number>('analytics:language-usage:fr') || 0) +
    (await kv.get<number>('analytics:language-usage:es') || 0);

  const languageBreakdown = {
    en: totalLanguageUsage > 0
      ? ((await kv.get<number>('analytics:language-usage:en') || 0) /
        totalLanguageUsage) * 100
      : 0,
    fr: totalLanguageUsage > 0
      ? ((await kv.get<number>('analytics:language-usage:fr') || 0) /
        totalLanguageUsage) * 100
      : 0,
    es: totalLanguageUsage > 0
      ? ((await kv.get<number>('analytics:language-usage:es') || 0) /
        totalLanguageUsage) * 100
      : 0,
  };

  return {
    storyWorldId,
    season,
    totalStarts: starts,
    totalCompletions: completions,
    completionRate,
    languageBreakdown,
    totalAudioMinutesListened: audioMinutes,
    averageListenDuration,
    periodStart,
    periodEnd,
    lastCalculated: new Date().toISOString(),
  };
}

/**
 * Generates platform-wide metrics (CMF report)
 */
export async function generatePlatformMetrics(
  periodStart: string,
  periodEnd: string,
): Promise<PlatformWideMetrics> {
  // This is a simplified version - production would aggregate across all stories
  const totalStoryCompletions = 0; // Sum all story completions
  const totalAudioMinutes = 0; // Sum all audio minutes

  const totalLanguageUsage = (await kv.get<number>(
    'analytics:language-usage:en',
  ) || 0) +
    (await kv.get<number>('analytics:language-usage:fr') || 0) +
    (await kv.get<number>('analytics:language-usage:es') || 0);

  return {
    totalUsers: 0, // Approximate (privacy-preserving, not tracked)
    totalStoryCompletions,
    totalAudioHoursListened: totalAudioMinutes / 60,
    themeEngagement: [], // Would aggregate by theme
    languageUsage: {
      en: totalLanguageUsage > 0
        ? ((await kv.get<number>('analytics:language-usage:en') || 0) /
          totalLanguageUsage) * 100
        : 0,
      fr: totalLanguageUsage > 0
        ? ((await kv.get<number>('analytics:language-usage:fr') || 0) /
          totalLanguageUsage) * 100
        : 0,
      es: totalLanguageUsage > 0
        ? ((await kv.get<number>('analytics:language-usage:es') || 0) /
          totalLanguageUsage) * 100
        : 0,
    },
    reportingPeriod: {
      start: periodStart,
      end: periodEnd,
    },
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// FEATURE SET E: CREATOR NOTES (POST-STORY)
// ============================================================================

/**
 * Creates or updates creator note
 */
export async function setCreatorNote(note: CreatorNote): Promise<void> {
  const key = `creator-note:${note.storyWorldId}`;
  await kv.set(key, note);
  console.log(`[CreatorNote] Saved for story: ${note.storyWorldId}`);
}

/**
 * Gets creator note for story
 */
export async function getCreatorNote(
  storyWorldId: string,
): Promise<CreatorNote | null> {
  const key = `creator-note:${storyWorldId}`;
  return await kv.get<CreatorNote>(key);
}

// ============================================================================
// FEATURE SET F: COMMUNITY REFLECTIONS (CARE-BASED)
// ============================================================================

/**
 * Submits community reflection (enters moderation queue)
 */
export async function submitCommunityReflection(
  reflection: Omit<
    CommunityReflection,
    'id' | 'moderationStatus' | 'isVisible' | 'createdAt' | 'lastUpdated'
  >,
): Promise<CommunityReflection> {
  const id = `reflection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newReflection: CommunityReflection = {
    ...reflection,
    id,
    moderationStatus: 'pending',
    isVisible: false, // Not visible until approved
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };

  const key = `reflection:${id}`;
  await kv.set(key, newReflection);

  console.log(`[Reflection] Submitted: ${id}, awaiting moderation`);
  return newReflection;
}

/**
 * Moderates community reflection
 */
export async function moderateReflection(
  reflectionId: string,
  status: ModerationStatus,
  moderatorId: string,
  notes?: string,
): Promise<CommunityReflection | null> {
  const key = `reflection:${reflectionId}`;
  const reflection = await kv.get<CommunityReflection>(key);

  if (!reflection) {
    console.error(`[Moderation] Reflection not found: ${reflectionId}`);
    return null;
  }

  const updated: CommunityReflection = {
    ...reflection,
    moderationStatus: status,
    moderatedBy: moderatorId,
    moderatedAt: new Date().toISOString(),
    moderationNotes: notes,
    isVisible: status === 'approved', // Only approved reflections are visible
    lastUpdated: new Date().toISOString(),
  };

  await kv.set(key, updated);

  console.log(
    `[Moderation] Reflection ${reflectionId} set to: ${status} by ${moderatorId}`,
  );
  return updated;
}

/**
 * Gets approved reflections for a chapter
 */
export async function getChapterReflections(
  chapterId: string,
): Promise<CommunityReflection[]> {
  const prefix = 'reflection:';
  const allReflections = await kv.getByPrefix<CommunityReflection>(prefix);

  return allReflections.filter(
    (r) => r.chapterId === chapterId && r.isVisible,
  );
}

/**
 * Gets pending reflections for moderation
 */
export async function getPendingReflections(): Promise<CommunityReflection[]> {
  const prefix = 'reflection:';
  const allReflections = await kv.getByPrefix<CommunityReflection>(prefix);

  return allReflections.filter((r) => r.moderationStatus === 'pending');
}

// ============================================================================
// FEATURE SET G: OFFLINE CULTURAL PACKS
// ============================================================================

/**
 * Creates offline cultural pack
 */
export async function createOfflinePack(
  pack: OfflineCulturalPack,
): Promise<void> {
  const key = `offline-pack:${pack.id}`;
  await kv.set(key, pack);
  console.log(`[OfflinePack] Created: ${pack.id}`);
}

/**
 * Gets offline pack
 */
export async function getOfflinePack(
  packId: string,
): Promise<OfflineCulturalPack | null> {
  const key = `offline-pack:${packId}`;
  return await kv.get<OfflineCulturalPack>(key);
}

/**
 * Lists available offline packs
 */
export async function listOfflinePacks(
  isInstitutionUser: boolean = false,
): Promise<OfflineCulturalPack[]> {
  const prefix = 'offline-pack:';
  const allPacks = await kv.getByPrefix<OfflineCulturalPack>(prefix);

  if (!isInstitutionUser) {
    // Filter out institution-only packs
    return allPacks.filter((p) => !p.institutionEnabledOnly);
  }

  return allPacks;
}

// ============================================================================
// FEATURE SET H: MULTI-NARRATOR SUPPORT
// ============================================================================

/**
 * Gets narration tracks for a chapter
 */
export async function getChapterNarrationTracks(
  chapterId: string,
  language: 'en' | 'fr' | 'es',
): Promise<ChapterNarrationTrack[]> {
  const key = `narration-tracks:${chapterId}:${language}`;
  const tracks = await kv.get<ChapterNarrationTrack[]>(key);
  return tracks || [];
}

/**
 * Adds narration track
 */
export async function addNarrationTrack(
  track: ChapterNarrationTrack,
): Promise<void> {
  const key = `narration-tracks:${track.chapterId}:${track.language}`;
  const existing = await kv.get<ChapterNarrationTrack[]>(key) || [];

  existing.push(track);
  await kv.set(key, existing);

  console.log(
    `[NarrationTrack] Added for ${track.chapterId}, narrator: ${track.narratorId}`,
  );
}

// ============================================================================
// FEATURE SET I: LIVING ARCHIVES
// ============================================================================

/**
 * Adds chapter version (append-only)
 */
export async function addChapterVersion(
  version: ChapterVersion,
): Promise<void> {
  const key = `chapter-version:${version.chapterId}:v${version.versionNumber}`;
  await kv.set(key, version);

  // Update story history
  await updateStoryHistory(version.chapterId, version);

  console.log(
    `[ChapterVersion] Saved: ${version.chapterId} v${version.versionNumber}`,
  );
}

/**
 * Gets chapter version history
 */
export async function getChapterVersions(
  chapterId: string,
): Promise<ChapterVersion[]> {
  const prefix = `chapter-version:${chapterId}:`;
  return await kv.getByPrefix<ChapterVersion>(prefix);
}

/**
 * Updates story world history (internal function)
 */
async function updateStoryHistory(
  chapterId: string,
  version: ChapterVersion,
): Promise<void> {
  // Extract storyWorldId from chapterId (assumes format: s{season}-{storyId}-ch{num})
  const storyWorldId = chapterId.substring(0, chapterId.lastIndexOf('-'));

  const key = `story-history:${storyWorldId}`;
  let history = await kv.get<StoryWorldHistory>(key);

  if (!history) {
    history = {
      storyWorldId,
      currentVersion: 1,
      totalVersions: 1,
      originalChapterCount: 1,
      currentChapterCount: 1,
      appendedChapterIds: [],
      firstPublishedAt: version.publishedAt,
      lastUpdatedAt: version.publishedAt,
      changeLog: [],
    };
  }

  history.currentVersion = version.versionNumber;
  history.totalVersions++;
  history.lastUpdatedAt = version.publishedAt;

  if (version.isAppendedChapter) {
    history.appendedChapterIds.push(chapterId);
    history.currentChapterCount++;
  }

  history.changeLog.push({
    timestamp: version.publishedAt,
    changeType: version.isAppendedChapter ? 'chapter-added' : 'chapter-updated',
    description: version.changeDescription || 'No description',
    affectedChapterIds: [chapterId],
  });

  await kv.set(key, history);
}

// ============================================================================
// FEATURE SET J: RIGHTS & ATTRIBUTION
// ============================================================================

/**
 * Sets content rights (admin only)
 */
export async function setContentRights(rights: ContentRights): Promise<void> {
  const key = `content-rights:${rights.contentId}`;
  await kv.set(key, rights);
  console.log(`[ContentRights] Saved for: ${rights.contentId}`);
}

/**
 * Gets content rights
 */
export async function getContentRights(
  contentId: string,
): Promise<ContentRights | null> {
  const key = `content-rights:${contentId}`;
  return await kv.get<ContentRights>(key);
}

// ============================================================================
// FEATURE SET K: SEASONAL EDITORIAL FRAMING
// ============================================================================

/**
 * Sets seasonal editorial framing
 */
export async function setSeasonalFraming(
  framing: SeasonalEditorialFraming,
): Promise<void> {
  const key = `seasonal-framing:season-${framing.season}`;
  await kv.set(key, framing);
  console.log(`[SeasonalFraming] Saved for Season ${framing.season}`);
}

/**
 * Gets seasonal editorial framing
 */
export async function getSeasonalFraming(
  season: number,
): Promise<SeasonalEditorialFraming | null> {
  const key = `seasonal-framing:season-${season}`;
  return await kv.get<SeasonalEditorialFraming>(key);
}

// ============================================================================
// USER FEATURE PREFERENCES
// ============================================================================

/**
 * Gets user feature preferences
 */
export async function getUserFeaturePreferences(
  userId?: string,
): Promise<UserFeaturePreferences> {
  if (!userId) {
    // Anonymous user: return defaults (all features OFF)
    return {
      enhancedContextCardsEnabled: false,
      creatorNotesEnabled: false,
      communityReflectionsVisible: false,
      offlinePacksEnabled: false,
      multiNarratorSelectionEnabled: false,
      seasonalEditorialFramingEnabled: false,
      readingPreferences: await getUserReadingPreferences(),
      analyticsOptIn: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  const key = `feature-preferences:${userId}`;
  const prefs = await kv.get<UserFeaturePreferences>(key);

  if (!prefs) {
    // User has not set preferences yet, return defaults
    return {
      userId,
      enhancedContextCardsEnabled: false,
      creatorNotesEnabled: false,
      communityReflectionsVisible: false,
      offlinePacksEnabled: false,
      multiNarratorSelectionEnabled: false,
      seasonalEditorialFramingEnabled: false,
      readingPreferences: await getUserReadingPreferences(userId),
      analyticsOptIn: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  return prefs;
}

/**
 * Updates user feature preferences
 */
export async function updateUserFeaturePreferences(
  userId: string,
  preferences: Partial<UserFeaturePreferences>,
): Promise<UserFeaturePreferences> {
  const current = await getUserFeaturePreferences(userId);
  const updated: UserFeaturePreferences = {
    ...current,
    ...preferences,
    userId,
    lastUpdated: new Date().toISOString(),
  };

  const key = `feature-preferences:${userId}`;
  await kv.set(key, updated);

  console.log(`[FeaturePreferences] Updated for user: ${userId}`);
  return updated;
}

// ============================================================================
// CMF REPORTING
// ============================================================================

/**
 * Generates CMF report (admin only)
 */
export async function generateCMFReport(
  periodStart: string,
  periodEnd: string,
  generatedBy: string,
): Promise<CMFReport> {
  const platformMetrics = await generatePlatformMetrics(periodStart, periodEnd);

  // This is a simplified version - production would aggregate all story metrics
  const storyMetrics: AggregateStoryMetrics[] = [];

  return {
    reportPeriod: {
      start: periodStart,
      end: periodEnd,
    },
    platformMetrics,
    storyMetrics,
    multilingualEngagement: {
      totalBilingualSessions: 0, // Would need session tracking
      frenchEngagement: platformMetrics.languageUsage.fr,
      spanishEngagement: platformMetrics.languageUsage.es,
    },
    institutionalUsers: 0, // Approximate
    institutionalCollections: (await listPublicCollections()).length,
    themesDiversity: [], // Would aggregate themes
    generatedAt: new Date().toISOString(),
    generatedBy,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Context Cards
  getContextCard,
  setContextCard,
  getStoryContextCards,

  // Reading/Listening Modes
  getUserReadingPreferences,
  updateUserReadingPreferences,
  saveChapterConsumptionState,
  getChapterConsumptionState,

  // Institutional Collections
  createInstitutionalCollection,
  getInstitutionalCollection,
  listPublicCollections,
  getInstitutionCollections,

  // Analytics
  recordStoryStart,
  recordStoryCompletion,
  recordAudioListening,
  recordLanguageUsage,
  generateStoryMetrics,
  generatePlatformMetrics,

  // Creator Notes
  setCreatorNote,
  getCreatorNote,

  // Community Reflections
  submitCommunityReflection,
  moderateReflection,
  getChapterReflections,
  getPendingReflections,

  // Offline Packs
  createOfflinePack,
  getOfflinePack,
  listOfflinePacks,

  // Multi-Narrator
  getChapterNarrationTracks,
  addNarrationTrack,

  // Living Archives
  addChapterVersion,
  getChapterVersions,

  // Rights & Attribution
  setContentRights,
  getContentRights,

  // Seasonal Framing
  setSeasonalFraming,
  getSeasonalFraming,

  // User Preferences
  getUserFeaturePreferences,
  updateUserFeaturePreferences,

  // CMF Reporting
  generateCMFReport,
};
