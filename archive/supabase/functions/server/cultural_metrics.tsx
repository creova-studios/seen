/**
 * CULTURAL IMPACT METRICS MODULE
 * 
 * Purpose: Track cultural impact for CMF (Canada Media Fund) grant compliance
 * Privacy: All metrics are anonymized and aggregated
 * Export: CSV/JSON compatible for grant reporting
 * 
 * Metrics tracked:
 * - Active Canadian creators
 * - Equity-deserving creator participation
 * - Hours of original Canadian content
 * - Story completion rates
 * - Community responses per story
 */

import * as kv from "./kv_store.tsx";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CreatorMetadata {
  userId: string;
  isCanadian: boolean;
  equityDeserving?: {
    indigenous?: boolean;
    racialized?: boolean;
    lgbtq2s?: boolean;
    disability?: boolean;
    women?: boolean;
    officialLanguageMinority?: boolean; // Anglophone in QC, Francophone outside QC
  };
  province?: string;
  registeredAt: string;
  lastActiveAt: string;
}

export interface ContentMetrics {
  contentId: string;
  authorId: string;
  isCanadianContent: boolean;
  language: 'en' | 'fr' | 'es';
  durationMinutes?: number; // For audio/video content
  chapterCount: number;
  createdAt: string;
  publishedAt?: string;
  completionRate?: number; // Percentage of users who completed the story
  totalViews: number;
  totalCompletions: number;
  averageEngagementTime: number; // In minutes
  communityResponses: number;
}

export interface CulturalImpactSnapshot {
  period: string; // ISO date or month identifier
  totalActiveCreators: number;
  canadianCreators: number;
  equityDeservingCreators: {
    indigenous: number;
    racialized: number;
    lgbtq2s: number;
    disability: number;
    women: number;
    officialLanguageMinority: number;
  };
  contentMetrics: {
    totalStoriesPublished: number;
    canadianContentHours: number;
    averageCompletionRate: number;
    totalCommunityResponses: number;
    bilingualContent: number; // EN/FR
    indigenousLanguageContent: number;
  };
  geographicDistribution: {
    [province: string]: number; // Creator count by province
  };
  generatedAt: string;
}

// ============================================================================
// CREATOR METADATA MANAGEMENT
// ============================================================================

/**
 * Register creator metadata (called during onboarding or profile completion)
 */
export async function registerCreatorMetadata(
  userId: string,
  metadata: Partial<CreatorMetadata>
): Promise<void> {
  const existing = await kv.get(`creator_metadata:${userId}`);
  
  const creatorMetadata: CreatorMetadata = {
    userId,
    isCanadian: metadata.isCanadian ?? false,
    equityDeserving: metadata.equityDeserving || {},
    province: metadata.province,
    registeredAt: existing?.registeredAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };
  
  await kv.set(`creator_metadata:${userId}`, creatorMetadata);
}

/**
 * Update last active timestamp for creator
 */
export async function updateCreatorActivity(userId: string): Promise<void> {
  const metadata = await kv.get(`creator_metadata:${userId}`);
  
  if (metadata) {
    metadata.lastActiveAt = new Date().toISOString();
    await kv.set(`creator_metadata:${userId}`, metadata);
  }
}

/**
 * Get equity-deserving creator count
 */
export async function getEquityDeservingCreatorCount(): Promise<{
  indigenous: number;
  racialized: number;
  lgbtq2s: number;
  disability: number;
  women: number;
  officialLanguageMinority: number;
}> {
  const allCreators = await kv.getByPrefix('creator_metadata:');
  
  const counts = {
    indigenous: 0,
    racialized: 0,
    lgbtq2s: 0,
    disability: 0,
    women: 0,
    officialLanguageMinority: 0,
  };
  
  for (const creator of allCreators) {
    if (creator.equityDeserving?.indigenous) counts.indigenous++;
    if (creator.equityDeserving?.racialized) counts.racialized++;
    if (creator.equityDeserving?.lgbtq2s) counts.lgbtq2s++;
    if (creator.equityDeserving?.disability) counts.disability++;
    if (creator.equityDeserving?.women) counts.women++;
    if (creator.equityDeserving?.officialLanguageMinority) counts.officialLanguageMinority++;
  }
  
  return counts;
}

// ============================================================================
// CONTENT METRICS TRACKING
// ============================================================================

/**
 * Initialize content metrics when content is published
 */
export async function initializeContentMetrics(
  contentId: string,
  authorId: string,
  metadata: {
    isCanadianContent: boolean;
    language: 'en' | 'fr' | 'es';
    durationMinutes?: number;
    chapterCount: number;
  }
): Promise<void> {
  const metrics: ContentMetrics = {
    contentId,
    authorId,
    isCanadianContent: metadata.isCanadianContent,
    language: metadata.language,
    durationMinutes: metadata.durationMinutes,
    chapterCount: metadata.chapterCount,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    totalViews: 0,
    totalCompletions: 0,
    averageEngagementTime: 0,
    communityResponses: 0,
  };
  
  await kv.set(`content_metrics:${contentId}`, metrics);
}

/**
 * Track content view
 */
export async function trackContentView(
  contentId: string,
  userId: string,
  sessionId: string
): Promise<void> {
  const metrics = await kv.get(`content_metrics:${contentId}`);
  
  if (metrics) {
    metrics.totalViews++;
    await kv.set(`content_metrics:${contentId}`, metrics);
  }
  
  // Track individual view session (for completion rate calculation)
  await kv.set(`view_session:${sessionId}`, {
    contentId,
    userId,
    startedAt: new Date().toISOString(),
    currentChapter: 0,
    completed: false,
  });
}

/**
 * Track chapter progress
 */
export async function trackChapterProgress(
  sessionId: string,
  chapterIndex: number,
  totalChapters: number
): Promise<void> {
  const session = await kv.get(`view_session:${sessionId}`);
  
  if (session) {
    session.currentChapter = chapterIndex;
    session.lastProgressAt = new Date().toISOString();
    
    // Check if completed
    if (chapterIndex >= totalChapters - 1) {
      session.completed = true;
      session.completedAt = new Date().toISOString();
      
      // Update content metrics
      const metrics = await kv.get(`content_metrics:${session.contentId}`);
      if (metrics) {
        metrics.totalCompletions++;
        metrics.completionRate = (metrics.totalCompletions / metrics.totalViews) * 100;
        await kv.set(`content_metrics:${session.contentId}`, metrics);
      }
    }
    
    await kv.set(`view_session:${sessionId}`, session);
  }
}

/**
 * Track community response (comment, reaction, etc.)
 */
export async function trackCommunityResponse(contentId: string): Promise<void> {
  const metrics = await kv.get(`content_metrics:${contentId}`);
  
  if (metrics) {
    metrics.communityResponses++;
    await kv.set(`content_metrics:${contentId}`, metrics);
  }
}

/**
 * Update engagement time for content
 */
export async function updateEngagementTime(
  sessionId: string,
  timeSpentMinutes: number
): Promise<void> {
  const session = await kv.get(`view_session:${sessionId}`);
  
  if (session) {
    session.totalTimeMinutes = timeSpentMinutes;
    await kv.set(`view_session:${sessionId}`, session);
    
    // Update content metrics with new average
    const metrics = await kv.get(`content_metrics:${session.contentId}`);
    if (metrics) {
      const allSessions = await kv.getByPrefix(`view_session:`);
      const contentSessions = allSessions.filter(s => s.contentId === session.contentId);
      const totalTime = contentSessions.reduce((sum, s) => sum + (s.totalTimeMinutes || 0), 0);
      metrics.averageEngagementTime = contentSessions.length > 0 ? totalTime / contentSessions.length : 0;
      await kv.set(`content_metrics:${session.contentId}`, metrics);
    }
  }
}

// ============================================================================
// IMPACT SNAPSHOT GENERATION (FOR CMF REPORTING)
// ============================================================================

/**
 * Generate cultural impact snapshot for a given period
 * Used for CMF grant reporting
 */
export async function generateCulturalImpactSnapshot(
  periodStart?: Date,
  periodEnd?: Date
): Promise<CulturalImpactSnapshot> {
  const end = periodEnd || new Date();
  const start = periodStart || new Date(end.getFullYear(), end.getMonth(), 1); // Default to current month
  
  // Get all creator metadata
  const allCreators = await kv.getByPrefix('creator_metadata:');
  
  // Filter active creators in period
  const activeCreators = allCreators.filter(c => {
    const lastActive = new Date(c.lastActiveAt);
    return lastActive >= start && lastActive <= end;
  });
  
  // Count Canadian creators
  const canadianCreators = activeCreators.filter(c => c.isCanadian).length;
  
  // Count equity-deserving creators
  const equityDeservingCounts = await getEquityDeservingCreatorCount();
  
  // Get all content metrics
  const allContentMetrics = await kv.getByPrefix('content_metrics:');
  
  // Filter content published in period
  const periodContent = allContentMetrics.filter(c => {
    if (!c.publishedAt) return false;
    const published = new Date(c.publishedAt);
    return published >= start && published <= end;
  });
  
  // Calculate Canadian content hours
  const canadianContentHours = periodContent
    .filter(c => c.isCanadianContent)
    .reduce((sum, c) => sum + (c.durationMinutes || 0), 0) / 60;
  
  // Calculate average completion rate
  const completionRates = periodContent.map(c => c.completionRate || 0);
  const averageCompletionRate = completionRates.length > 0
    ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
    : 0;
  
  // Count total community responses
  const totalCommunityResponses = periodContent.reduce((sum, c) => sum + c.communityResponses, 0);
  
  // Count bilingual content (EN/FR)
  const bilingualContent = periodContent.filter(c => c.language === 'en' || c.language === 'fr').length;
  
  // Geographic distribution
  const geographicDistribution: { [province: string]: number } = {};
  for (const creator of activeCreators) {
    if (creator.province) {
      geographicDistribution[creator.province] = (geographicDistribution[creator.province] || 0) + 1;
    }
  }
  
  const snapshot: CulturalImpactSnapshot = {
    period: `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
    totalActiveCreators: activeCreators.length,
    canadianCreators,
    equityDeservingCreators: equityDeservingCounts,
    contentMetrics: {
      totalStoriesPublished: periodContent.length,
      canadianContentHours,
      averageCompletionRate,
      totalCommunityResponses,
      bilingualContent,
      indigenousLanguageContent: 0, // TODO: Track indigenous language content
    },
    geographicDistribution,
    generatedAt: new Date().toISOString(),
  };
  
  // Store snapshot for historical tracking
  const snapshotKey = `impact_snapshot:${start.getTime()}_${end.getTime()}`;
  await kv.set(snapshotKey, snapshot);
  
  return snapshot;
}

/**
 * Export cultural impact data to CSV format for CMF reporting
 */
export function exportToCSV(snapshot: CulturalImpactSnapshot): string {
  const lines: string[] = [];
  
  // Header
  lines.push('CMF Cultural Impact Report');
  lines.push(`Period,${snapshot.period}`);
  lines.push(`Generated,${snapshot.generatedAt}`);
  lines.push('');
  
  // Creator metrics
  lines.push('CREATOR METRICS');
  lines.push('Metric,Count');
  lines.push(`Total Active Creators,${snapshot.totalActiveCreators}`);
  lines.push(`Canadian Creators,${snapshot.canadianCreators}`);
  lines.push(`Indigenous Creators,${snapshot.equityDeservingCreators.indigenous}`);
  lines.push(`Racialized Creators,${snapshot.equityDeservingCreators.racialized}`);
  lines.push(`LGBTQ2S+ Creators,${snapshot.equityDeservingCreators.lgbtq2s}`);
  lines.push(`Creators with Disabilities,${snapshot.equityDeservingCreators.disability}`);
  lines.push(`Women Creators,${snapshot.equityDeservingCreators.women}`);
  lines.push(`Official Language Minority Creators,${snapshot.equityDeservingCreators.officialLanguageMinority}`);
  lines.push('');
  
  // Content metrics
  lines.push('CONTENT METRICS');
  lines.push('Metric,Value');
  lines.push(`Total Stories Published,${snapshot.contentMetrics.totalStoriesPublished}`);
  lines.push(`Canadian Content Hours,${snapshot.contentMetrics.canadianContentHours.toFixed(2)}`);
  lines.push(`Average Completion Rate,%${snapshot.contentMetrics.averageCompletionRate.toFixed(2)}`);
  lines.push(`Total Community Responses,${snapshot.contentMetrics.totalCommunityResponses}`);
  lines.push(`Bilingual Content (EN/FR),${snapshot.contentMetrics.bilingualContent}`);
  lines.push('');
  
  // Geographic distribution
  lines.push('GEOGRAPHIC DISTRIBUTION');
  lines.push('Province,Creator Count');
  for (const [province, count] of Object.entries(snapshot.geographicDistribution)) {
    lines.push(`${province},${count}`);
  }
  
  return lines.join('\n');
}

/**
 * Export cultural impact data to JSON format
 */
export function exportToJSON(snapshot: CulturalImpactSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}
