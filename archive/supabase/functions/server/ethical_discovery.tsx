/**
 * ETHICAL DISCOVERY & RECOMMENDATION LOGIC
 * 
 * Purpose: Content discovery that prioritizes cultural value over virality
 * Principles:
 * - No engagement exploitation
 * - Rotation of underrepresented content
 * - Editorial weighting for quality
 * - Cultural diversity promotion
 * - Anti-addiction design
 * 
 * Avoids:
 * - Engagement bait algorithms
 * - Filter bubbles
 * - Endless scrolling manipulation
 * - Attention hijacking
 */

import * as kv from "./kv_store.tsx";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DiscoveryWeights {
  culturalValue: number; // 0-1, based on equity-deserving creator, Canadian content, etc.
  editorialQuality: number; // 0-1, curator/moderator ratings
  communityEngagement: number; // 0-1, normalized completion rate & responses
  freshness: number; // 0-1, how recent the content is
  diversity: number; // 0-1, boost for underrepresented voices
  personalRelevance: number; // 0-1, user's language/interests (opt-in only)
}

export interface ContentScore {
  contentId: string;
  totalScore: number;
  weights: DiscoveryWeights;
  calculatedAt: string;
  boosts: string[]; // Reasons for boosting (e.g., "equity_deserving_creator", "underrepresented_region")
}

export interface EditorialCuration {
  contentId: string;
  curatedBy: string; // Moderator/admin user ID
  qualityScore: number; // 0-10 scale
  culturalSignificance: number; // 0-10 scale
  technicalExecution: number; // 0-10 scale
  notes?: string;
  featuredUntil?: string; // Optional feature expiry
  curatedAt: string;
}

export interface UserDiscoveryPreferences {
  userId: string;
  optInPersonalization: boolean; // Must be explicit opt-in
  preferredLanguages: string[];
  interestedTags?: string[];
  contentPacePreference: 'slow' | 'medium' | 'fast'; // Anti-addiction: limit recommendation frequency
  maxDailyRecommendations?: number; // Optional daily limit
  lastRecommendationAt?: string;
  updatedAt: string;
}

export interface DiscoverySession {
  sessionId: string;
  userId?: string;
  startedAt: string;
  contentShown: string[]; // Track what's been shown to avoid repetition
  diversityTracker: {
    languagesSeen: string[];
    creatorsSeen: string[];
    regionsSeen: string[];
  };
  recommendationCount: number;
}

// ============================================================================
// CULTURAL VALUE CALCULATION
// ============================================================================

/**
 * Calculate cultural value score for content
 */
export async function calculateCulturalValue(contentId: string): Promise<number> {
  const content = await kv.get(`content:${contentId}`);
  const ownership = await kv.get(`ip_ownership:${contentId}`);
  const creatorMetadata = await kv.get(`creator_metadata:${ownership?.creatorId}`);
  
  if (!content) return 0;
  
  let score = 0.5; // Base score
  
  // Boost for Canadian content
  if (content.isCanadianContent) {
    score += 0.15;
  }
  
  // Boost for equity-deserving creators
  if (creatorMetadata?.equityDeserving) {
    if (creatorMetadata.equityDeserving.indigenous) score += 0.15;
    if (creatorMetadata.equityDeserving.racialized) score += 0.10;
    if (creatorMetadata.equityDeserving.lgbtq2s) score += 0.05;
    if (creatorMetadata.equityDeserving.disability) score += 0.05;
    if (creatorMetadata.equityDeserving.women) score += 0.05;
    if (creatorMetadata.equityDeserving.officialLanguageMinority) score += 0.10;
  }
  
  // Boost for bilingual content (EN/FR)
  if (content.language === 'fr') {
    score += 0.10; // French content gets boost for cultural preservation
  }
  
  // Boost for underrepresented regions
  if (creatorMetadata?.province && isUnderrepresentedRegion(creatorMetadata.province)) {
    score += 0.10;
  }
  
  return Math.min(score, 1.0); // Cap at 1.0
}

function isUnderrepresentedRegion(province: string): boolean {
  // Regions with historically less media representation
  const underrepresented = ['NL', 'PE', 'NS', 'NB', 'MB', 'SK', 'YT', 'NT', 'NU'];
  return underrepresented.includes(province);
}

// ============================================================================
// EDITORIAL QUALITY SCORING
// ============================================================================

/**
 * Add editorial curation for content
 */
export async function curateContent(params: {
  contentId: string;
  curatorId: string;
  /** Role resolved by requireRole from server-controlled data (app_metadata / KV). */
  curatorRole?: string;
  qualityScore: number;
  culturalSignificance: number;
  technicalExecution: number;
  notes?: string;
  featuredUntil?: string;
}): Promise<EditorialCuration> {
  // Verify curator has moderator/admin role. Uses the role requireRole resolved from
  // server-controlled data (app_metadata), not the raw KV profile role, which may be a
  // pre-CRE-167 self-assigned value.
  if (!params.curatorRole || !['moderator', 'admin'].includes(params.curatorRole)) {
    throw new Error('Only moderators and admins can curate content');
  }
  
  const curation: EditorialCuration = {
    contentId: params.contentId,
    curatedBy: params.curatorId,
    qualityScore: Math.max(0, Math.min(10, params.qualityScore)),
    culturalSignificance: Math.max(0, Math.min(10, params.culturalSignificance)),
    technicalExecution: Math.max(0, Math.min(10, params.technicalExecution)),
    notes: params.notes,
    featuredUntil: params.featuredUntil,
    curatedAt: new Date().toISOString(),
  };
  
  await kv.set(`editorial_curation:${params.contentId}`, curation);
  
  return curation;
}

/**
 * Calculate editorial quality score (0-1)
 */
async function calculateEditorialQuality(contentId: string): Promise<number> {
  const curation = await kv.get(`editorial_curation:${contentId}`);
  
  if (!curation) return 0.5; // Neutral score if not curated
  
  // Weighted average of scores
  const avgScore = (
    (curation.qualityScore * 0.4) +
    (curation.culturalSignificance * 0.4) +
    (curation.technicalExecution * 0.2)
  ) / 10; // Normalize to 0-1
  
  return avgScore;
}

// ============================================================================
// COMMUNITY ENGAGEMENT (NON-EXPLOITATIVE)
// ============================================================================

/**
 * Calculate healthy engagement score
 * Focuses on completion and meaningful interaction, NOT time-on-site or infinite scroll
 */
async function calculateCommunityEngagement(contentId: string): Promise<number> {
  const metrics = await kv.get(`content_metrics:${contentId}`);
  
  if (!metrics || metrics.totalViews === 0) return 0.5;
  
  // Completion rate is primary metric (not views or time spent)
  const completionScore = (metrics.completionRate || 0) / 100;
  
  // Community responses per view (normalized)
  const responseRate = metrics.totalViews > 0 
    ? Math.min(metrics.communityResponses / metrics.totalViews, 1)
    : 0;
  
  // Weighted: 70% completion, 30% community response
  const score = (completionScore * 0.7) + (responseRate * 0.3);
  
  return score;
}

// ============================================================================
// DIVERSITY & ROTATION
// ============================================================================

/**
 * Calculate diversity boost based on session history
 */
function calculateDiversityBoost(
  content: any,
  creator: any,
  session: DiscoverySession
): number {
  let boost = 0;
  
  // Boost if language hasn't been seen in session
  if (!session.diversityTracker.languagesSeen.includes(content.language)) {
    boost += 0.2;
  }
  
  // Boost if creator hasn't been seen in session
  if (!session.diversityTracker.creatorsSeen.includes(content.authorId)) {
    boost += 0.15;
  }
  
  // Boost if region hasn't been seen
  if (creator?.province && !session.diversityTracker.regionsSeen.includes(creator.province)) {
    boost += 0.15;
  }
  
  return Math.min(boost, 0.5); // Cap boost
}

// ============================================================================
// FRESHNESS CALCULATION
// ============================================================================

/**
 * Calculate freshness score with decay over time
 */
function calculateFreshness(publishedAt: string): number {
  const published = new Date(publishedAt);
  const now = new Date();
  const ageInDays = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);
  
  // Decay curve: newer content gets higher score
  // 100% at 0 days, 75% at 7 days, 50% at 30 days, 25% at 90 days
  if (ageInDays <= 7) return 1.0;
  if (ageInDays <= 30) return 0.75;
  if (ageInDays <= 90) return 0.5;
  if (ageInDays <= 180) return 0.25;
  return 0.1; // Older content still has value
}

// ============================================================================
// PERSONALIZATION (OPT-IN ONLY)
// ============================================================================

/**
 * Calculate personal relevance score (only if user opted in)
 */
async function calculatePersonalRelevance(
  contentId: string,
  userId?: string
): Promise<number> {
  if (!userId) return 0.5; // Neutral for anonymous users
  
  const preferences = await kv.get(`discovery_preferences:${userId}`);
  
  if (!preferences || !preferences.optInPersonalization) {
    return 0.5; // Neutral if not opted in
  }
  
  const content = await kv.get(`content:${contentId}`);
  let score = 0.5;
  
  // Language match
  if (preferences.preferredLanguages?.includes(content.language)) {
    score += 0.25;
  }
  
  // Tag/interest match
  if (preferences.interestedTags && content.tags) {
    const matchingTags = content.tags.filter(tag => 
      preferences.interestedTags.includes(tag)
    ).length;
    score += Math.min(matchingTags * 0.1, 0.25);
  }
  
  return Math.min(score, 1.0);
}

// ============================================================================
// COMPOSITE SCORING ALGORITHM
// ============================================================================

/**
 * Calculate final discovery score for content
 */
export async function calculateDiscoveryScore(
  contentId: string,
  session: DiscoverySession,
  userId?: string
): Promise<ContentScore> {
  const content = await kv.get(`content:${contentId}`);
  const ownership = await kv.get(`ip_ownership:${contentId}`);
  const creator = await kv.get(`creator_metadata:${ownership?.creatorId}`);
  
  // Calculate individual weights
  const culturalValue = await calculateCulturalValue(contentId);
  const editorialQuality = await calculateEditorialQuality(contentId);
  const communityEngagement = await calculateCommunityEngagement(contentId);
  const freshness = calculateFreshness(content.publishedAt || content.createdAt);
  const diversity = calculateDiversityBoost(content, creator, session);
  const personalRelevance = await calculatePersonalRelevance(contentId, userId);
  
  const weights: DiscoveryWeights = {
    culturalValue,
    editorialQuality,
    communityEngagement,
    freshness,
    diversity,
    personalRelevance,
  };
  
  // Weighted formula: prioritize cultural value and editorial quality
  const totalScore = (
    (culturalValue * 0.30) +        // 30% cultural value
    (editorialQuality * 0.25) +     // 25% editorial quality
    (communityEngagement * 0.15) +  // 15% healthy engagement
    (freshness * 0.10) +            // 10% freshness
    (diversity * 0.15) +            // 15% diversity
    (personalRelevance * 0.05)      // 5% personalization (minimal)
  );
  
  // Track boost reasons
  const boosts: string[] = [];
  if (culturalValue > 0.7) boosts.push('high_cultural_value');
  if (content.isCanadianContent) boosts.push('canadian_content');
  if (creator?.equityDeserving?.indigenous) boosts.push('indigenous_creator');
  if (diversity > 0.3) boosts.push('diverse_perspective');
  if (editorialQuality > 0.8) boosts.push('editorial_featured');
  
  const score: ContentScore = {
    contentId,
    totalScore,
    weights,
    calculatedAt: new Date().toISOString(),
    boosts,
  };
  
  return score;
}

// ============================================================================
// DISCOVERY SESSION MANAGEMENT
// ============================================================================

/**
 * Start a discovery session
 */
export async function startDiscoverySession(userId?: string): Promise<DiscoverySession> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const session: DiscoverySession = {
    sessionId,
    userId,
    startedAt: new Date().toISOString(),
    contentShown: [],
    diversityTracker: {
      languagesSeen: [],
      creatorsSeen: [],
      regionsSeen: [],
    },
    recommendationCount: 0,
  };
  
  await kv.set(`discovery_session:${sessionId}`, session);
  
  return session;
}

/**
 * Get personalized content recommendations
 */
export async function getRecommendations(
  sessionId: string,
  userId?: string,
  limit: number = 10
): Promise<ContentScore[]> {
  const session = await kv.get(`discovery_session:${sessionId}`);
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Check daily limit (anti-addiction)
  if (userId) {
    const preferences = await kv.get(`discovery_preferences:${userId}`);
    if (preferences?.maxDailyRecommendations) {
      const today = new Date().toISOString().split('T')[0];
      const lastRec = preferences.lastRecommendationAt?.split('T')[0];
      
      if (today === lastRec && session.recommendationCount >= preferences.maxDailyRecommendations) {
        return []; // Respect user's daily limit
      }
    }
  }
  
  // Get all published content
  const allContent = await kv.getByPrefix('content:');
  const publishedContent = allContent.filter(c => 
    c.status === 'published' && 
    !session.contentShown.includes(c.id)
  );
  
  // Calculate scores for all content
  const scoredContent: ContentScore[] = [];
  
  for (const content of publishedContent) {
    const score = await calculateDiscoveryScore(content.id, session, userId);
    scoredContent.push(score);
  }
  
  // Sort by total score (descending)
  scoredContent.sort((a, b) => b.totalScore - a.totalScore);
  
  // Take top N recommendations
  const recommendations = scoredContent.slice(0, limit);
  
  // Update session
  for (const rec of recommendations) {
    session.contentShown.push(rec.contentId);
    
    const content = await kv.get(`content:${rec.contentId}`);
    const ownership = await kv.get(`ip_ownership:${rec.contentId}`);
    const creator = await kv.get(`creator_metadata:${ownership?.creatorId}`);
    
    if (!session.diversityTracker.languagesSeen.includes(content.language)) {
      session.diversityTracker.languagesSeen.push(content.language);
    }
    if (!session.diversityTracker.creatorsSeen.includes(content.authorId)) {
      session.diversityTracker.creatorsSeen.push(content.authorId);
    }
    if (creator?.province && !session.diversityTracker.regionsSeen.includes(creator.province)) {
      session.diversityTracker.regionsSeen.push(creator.province);
    }
  }
  
  session.recommendationCount += recommendations.length;
  await kv.set(`discovery_session:${sessionId}`, session);
  
  // Update user's last recommendation timestamp
  if (userId) {
    const preferences = await kv.get(`discovery_preferences:${userId}`);
    if (preferences) {
      preferences.lastRecommendationAt = new Date().toISOString();
      await kv.set(`discovery_preferences:${userId}`, preferences);
    }
  }
  
  return recommendations;
}

// ============================================================================
// USER PREFERENCE MANAGEMENT
// ============================================================================

/**
 * Set user discovery preferences (opt-in only)
 */
export async function setDiscoveryPreferences(
  userId: string,
  preferences: Partial<UserDiscoveryPreferences>
): Promise<UserDiscoveryPreferences> {
  const existing = await kv.get(`discovery_preferences:${userId}`);
  
  const userPreferences: UserDiscoveryPreferences = {
    userId,
    optInPersonalization: preferences.optInPersonalization ?? false,
    preferredLanguages: preferences.preferredLanguages || ['en'],
    interestedTags: preferences.interestedTags,
    contentPacePreference: preferences.contentPacePreference || 'medium',
    maxDailyRecommendations: preferences.maxDailyRecommendations,
    lastRecommendationAt: existing?.lastRecommendationAt,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`discovery_preferences:${userId}`, userPreferences);
  
  return userPreferences;
}

/**
 * Get featured content (editorially curated)
 */
export async function getFeaturedContent(language?: string): Promise<ContentScore[]> {
  const allCurations = await kv.getByPrefix('editorial_curation:');
  
  // Filter by active features and language
  const now = new Date();
  const activeCurations = allCurations.filter(c => {
    if (c.featuredUntil) {
      const expiryDate = new Date(c.featuredUntil);
      if (expiryDate < now) return false;
    }
    return true;
  });
  
  // Get content and calculate scores
  const scores: ContentScore[] = [];
  
  for (const curation of activeCurations) {
    const content = await kv.get(`content:${curation.contentId}`);
    
    if (!content || content.status !== 'published') continue;
    if (language && content.language !== language) continue;
    
    // Create a minimal session for scoring
    const tempSession: DiscoverySession = {
      sessionId: 'featured',
      startedAt: new Date().toISOString(),
      contentShown: [],
      diversityTracker: { languagesSeen: [], creatorsSeen: [], regionsSeen: [] },
      recommendationCount: 0,
    };
    
    const score = await calculateDiscoveryScore(curation.contentId, tempSession);
    scores.push(score);
  }
  
  // Sort by editorial quality primarily
  scores.sort((a, b) => b.weights.editorialQuality - a.weights.editorialQuality);
  
  return scores;
}
