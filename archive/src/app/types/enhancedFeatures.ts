/**
 * ENHANCED FEATURES — TYPE DEFINITIONS
 * SEEN by CREOVA
 * 
 * Non-visual feature extensions for cultural storytelling platform
 * All features optional, data/logic-based, no UI modifications
 * 
 * Feature Sets:
 * A. Context Cards (Enhanced)
 * B. Guided Reading/Listening Modes
 * C. Institutional Collections & Syllabi
 * D. Cultural Impact Analytics
 * E. Creator Notes
 * F. Community Reflections (Care-Based)
 * G. Offline Cultural Packs
 * H. Multi-Narrator Support
 * I. Living Archives
 * J. Rights & Attribution
 * K. Seasonal Editorial Framing
 */

// ============================================================================
// FEATURE SET A: ENHANCED CONTEXT CARDS
// ============================================================================

export interface MultilingualText {
  en: string;
  fr: string;
  es: string;
}

export interface InstitutionSource {
  institutionName: string;
  verifiedBy: string;
  verificationDate: string; // ISO 8601
  institutionUrl?: string;
  contactEmail?: string;
}

export interface EnhancedContextCard {
  id: string;
  term: string; // The term being explained (e.g., "Africville", "Sleeping Car Porter")
  
  // Level 1: Short contextual explanation (existing)
  explanation: MultilingualText;
  
  // Level 2: Expanded cultural/historical context (NEW)
  expandedContext?: MultilingualText;
  
  // Level 3: Institution-verified annotation (NEW, optional)
  institutionAnnotation?: {
    text: MultilingualText;
    source: InstitutionSource;
  };
  
  // Metadata
  relatedStoryIds?: string[]; // Stories where this term appears
  relatedContextCardIds?: string[]; // Related terms
  createdAt: string;
  lastUpdated: string;
}

// ============================================================================
// FEATURE SET B: GUIDED READING/LISTENING MODES
// ============================================================================

export type ConsumptionMode = 'read-only' | 'listen-only' | 'read-and-listen';

export interface UserReadingPreferences {
  userId?: string; // Optional (anonymous users use localStorage)
  consumptionMode: ConsumptionMode;
  autoPlayNext: boolean; // Auto-advance to next chapter
  audioSpeed: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  preferredLanguage: 'en' | 'fr' | 'es';
  ambientAudioEnabled: boolean;
  narrationVolume: number; // 0-100
  ambientVolume: number; // 0-100
  lastUpdated: string;
}

export interface ChapterConsumptionState {
  chapterId: string;
  mode: ConsumptionMode;
  textPosition?: number; // Character offset for read-only mode
  audioPosition?: number; // Seconds elapsed for listen-only mode
  completed: boolean;
  lastAccessed: string;
}

// ============================================================================
// FEATURE SET C: INSTITUTIONAL COLLECTIONS & SYLLABI
// ============================================================================

export interface DiscussionPrompt {
  promptText: MultilingualText;
  intendedAudience: 'high-school' | 'undergraduate' | 'graduate' | 'general-public';
  estimatedTime?: string; // e.g., "15 minutes", "1 hour"
}

export interface InstitutionalCollection {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  
  // Curatorial framing
  editorialFraming?: MultilingualText;
  curatedBy: string; // Institution or curator name
  
  // Content
  contentIds: string[]; // Story World IDs or Film IDs
  suggestedOrder?: string[]; // Ordered subset of contentIds (optional)
  
  // Educational scaffolding
  discussionPrompts?: DiscussionPrompt[];
  estimatedCompletionTime?: string; // e.g., "3 hours", "1 week"
  
  // Metadata
  institutionId?: string;
  targetAudience?: string[];
  themes?: string[];
  language?: ('en' | 'fr' | 'es')[]; // Languages available
  createdAt: string;
  lastUpdated: string;
  isPublic: boolean; // If false, only accessible via direct link
}

// ============================================================================
// FEATURE SET D: CULTURAL IMPACT ANALYTICS (CMF-COMPLIANT)
// ============================================================================

/**
 * PRIVACY-FIRST ANALYTICS
 * All metrics are AGGREGATE ONLY
 * NO individual user tracking
 * NO attention surveillance
 * CMF grant reporting compliant
 */

export interface AggregateStoryMetrics {
  storyWorldId: string;
  season: number;
  
  // Engagement (aggregate counts)
  totalStarts: number; // Number of times story was started
  totalCompletions: number; // Number of times story was completed
  completionRate: number; // Percentage (calculated)
  
  // Language usage (aggregate)
  languageBreakdown: {
    en: number; // Percentage of sessions in English
    fr: number; // Percentage in French
    es: number; // Percentage in Spanish
  };
  
  // Audio engagement (aggregate duration)
  totalAudioMinutesListened: number;
  averageListenDuration: number; // In minutes
  
  // Institutional access
  institutionalAccessCount?: number; // If accessed via institution
  
  // Time period
  periodStart: string; // ISO 8601
  periodEnd: string;
  lastCalculated: string;
}

export interface PlatformWideMetrics {
  totalUsers: number; // Approximate (privacy-preserving)
  totalStoryCompletions: number;
  totalAudioHoursListened: number;
  
  // Theme-level insights
  themeEngagement: Array<{
    theme: string; // e.g., "Black Canadian History", "Diaspora", "Indigenous Urbanism"
    totalEngagements: number;
    completionRate: number;
  }>;
  
  // Language distribution
  languageUsage: {
    en: number; // Percentage
    fr: number;
    es: number;
  };
  
  // CMF reporting period
  reportingPeriod: {
    start: string;
    end: string;
  };
  
  generatedAt: string;
}

// ============================================================================
// FEATURE SET E: CREATOR NOTES (POST-STORY)
// ============================================================================

export interface CreatorNote {
  id: string;
  storyWorldId: string;
  
  // Creator reflection (appears after story completion)
  noteText: MultilingualText;
  
  // Optional additional context
  creatorName?: string;
  creatorBio?: MultilingualText;
  
  // Metadata
  createdAt: string;
  lastUpdated: string;
  isPublished: boolean; // If false, not shown to users
}

// ============================================================================
// FEATURE SET F: COMMUNITY REFLECTIONS (CARE-BASED)
// ============================================================================

export type ReflectionFormat = 'text' | 'audio';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface CommunityReflection {
  id: string;
  chapterId: string;
  storyWorldId: string;
  
  // Reflection content
  format: ReflectionFormat;
  reflectionText?: string; // For text reflections
  audioUrl?: string; // For audio reflections (stored in Supabase)
  
  // Prompted reflection (optional)
  promptId?: string; // If responding to a specific prompt
  
  // Anonymized submitter info (NO identifying data)
  submitterHash: string; // One-way hash, not reversible
  submitterLanguage: 'en' | 'fr' | 'es';
  
  // Moderation
  moderationStatus: ModerationStatus;
  moderatedBy?: string; // Admin/moderator ID
  moderatedAt?: string;
  moderationNotes?: string; // Internal notes
  
  // Care-based moderation categories
  moderationFlags?: {
    culturalSensitivity: boolean;
    harmPrevention: boolean;
    accessibilityLanguage: boolean;
    restorativeCare: boolean;
  };
  
  // Visibility (NO public profiles, likes, or ranking)
  isVisible: boolean; // Only visible if approved
  visibleToCreatorOnly: boolean; // Creator sees privately, not public
  
  // Metadata
  createdAt: string;
  lastUpdated: string;
}

export interface ReflectionPrompt {
  id: string;
  chapterId: string;
  promptText: MultilingualText;
  
  // Optional context
  promptType: 'open-ended' | 'cultural-connection' | 'personal-reflection' | 'community-dialogue';
  
  createdAt: string;
  isActive: boolean;
}

// ============================================================================
// FEATURE SET G: OFFLINE CULTURAL PACKS
// ============================================================================

export interface OfflineCulturalPack {
  id: string;
  packName: MultilingualText;
  description: MultilingualText;
  
  // Content included
  storyWorldIds: string[];
  includeNarrationAudio: boolean;
  includeContextCards: boolean;
  includeFilms: boolean; // If downloadable
  
  // Language selection
  languages: ('en' | 'fr' | 'es')[];
  
  // Size and storage
  estimatedSizeMB: number;
  storageLimit?: number; // Max MB user can download
  
  // Access control
  institutionEnabledOnly: boolean; // Only available to institutional users
  requiresAuth: boolean;
  
  // Download metadata
  expirationDate?: string; // ISO 8601 (for institution-licensed content)
  downloadUrl?: string; // Pre-generated zip file
  
  createdAt: string;
  lastUpdated: string;
}

export interface UserDownload {
  userId?: string; // Optional (anonymous allowed)
  packId: string;
  downloadedAt: string;
  deviceType?: 'web' | 'ios' | 'android';
  expiresAt?: string; // For DRM or time-limited access
}

// ============================================================================
// FEATURE SET H: MULTI-NARRATOR SUPPORT
// ============================================================================

export interface NarratorProfile {
  id: string;
  narratorName: string;
  narratorBio?: MultilingualText;
  voiceDescription?: MultilingualText; // e.g., "Warm, reflective", "Urgent, direct"
  
  // Narrator metadata
  language: 'en' | 'fr' | 'es';
  gender?: string; // Optional
  ageRange?: string; // e.g., "30-45"
  
  // Attribution
  creditName: string; // How to credit in platform
  portfolioUrl?: string;
}

export interface ChapterNarrationTrack {
  chapterId: string;
  narratorId: string;
  language: 'en' | 'fr' | 'es';
  
  // Audio file
  audioUrl: string; // Signed URL from Supabase
  duration: number; // Seconds
  
  // Technical metadata
  format: 'mp3' | 'wav';
  bitrate?: string; // e.g., "320kbps"
  lufsNormalization?: number; // e.g., -16
  
  // Selection
  isDefault: boolean; // Default narrator for this language
  
  createdAt: string;
}

// ============================================================================
// FEATURE SET I: LIVING ARCHIVES (FUTURE-SAFE)
// ============================================================================

export interface ChapterVersion {
  versionId: string;
  chapterId: string;
  versionNumber: number; // e.g., 1, 2, 3
  
  // Content snapshot
  title: MultilingualText;
  bodyText: MultilingualText;
  audioUrl?: {
    en?: string;
    fr?: string;
    es?: string;
  };
  
  // Change metadata
  changeDescription?: string; // e.g., "Added historical context", "Corrected translation"
  changedBy: string; // Admin or creator ID
  publishedAt: string; // ISO 8601
  
  // Append-only capability
  isAppendedChapter: boolean; // If new chapter added to existing story
  previousVersionId?: string; // For tracking history
}

export interface StoryWorldHistory {
  storyWorldId: string;
  
  // Version tracking
  currentVersion: number;
  totalVersions: number;
  
  // Chapter append history
  originalChapterCount: number;
  currentChapterCount: number;
  appendedChapterIds: string[]; // Chapters added after initial publication
  
  // Publication timeline
  firstPublishedAt: string;
  lastUpdatedAt: string;
  
  // Change log (append-only)
  changeLog: Array<{
    timestamp: string;
    changeType: 'chapter-added' | 'chapter-updated' | 'translation-added' | 'audio-added';
    description: string;
    affectedChapterIds: string[];
  }>;
}

// ============================================================================
// FEATURE SET J: RIGHTS & ATTRIBUTION (BACKEND ONLY)
// ============================================================================

export type LicenseType = 
  | 'CREOVA-exclusive' 
  | 'non-exclusive-limited' 
  | 'educational-use-only' 
  | 'CMF-grant-compliant';

export interface ContentRights {
  contentId: string; // Story World ID, Film ID, Music ID
  contentType: 'story' | 'film' | 'music';
  
  // Rights holder
  rightsHolder: string; // Creator name or organization
  rightsHolderContact?: string;
  
  // License terms
  licenseType: LicenseType;
  licenseStartDate: string; // ISO 8601
  licenseEndDate?: string; // ISO 8601 (null = perpetual)
  
  // Usage scope
  allowedUsage: {
    platformPlayback: boolean;
    institutionalDownload: boolean;
    educationalUse: boolean;
    commercialUse: boolean;
    archivalPreservation: boolean;
  };
  
  // Attribution requirements
  attributionText: MultilingualText;
  attributionRequired: boolean;
  
  // Restrictions
  geographicRestrictions?: string[]; // ISO country codes (empty = worldwide)
  ageRestrictions?: string; // e.g., "13+", "18+"
  
  // CMF compliance
  cmfFunded: boolean;
  cmfReportingRequired: boolean;
  
  // Metadata
  createdAt: string;
  lastReviewedAt: string;
}

// ============================================================================
// FEATURE SET K: SEASONAL EDITORIAL FRAMING
// ============================================================================

export interface SeasonalEditorialFraming {
  season: number;
  
  // Curatorial introduction
  introText: MultilingualText;
  
  // Optional curator attribution
  curatedBy?: string;
  curatorBio?: MultilingualText;
  
  // Thematic framing
  seasonTheme?: MultilingualText;
  historicalContext?: MultilingualText;
  
  // Display rules
  displayOnce: boolean; // Show only on first entry to season
  dismissible: boolean; // User can close and not see again
  
  // Metadata
  publishedAt: string;
  lastUpdated: string;
}

// ============================================================================
// USER PREFERENCES (CONSOLIDATED)
// ============================================================================

export interface UserFeaturePreferences {
  userId?: string; // Optional for anonymous users
  
  // Feature opt-ins (all default to OFF)
  enhancedContextCardsEnabled: boolean;
  creatorNotesEnabled: boolean;
  communityReflectionsVisible: boolean;
  offlinePacksEnabled: boolean;
  multiNarratorSelectionEnabled: boolean;
  seasonalEditorialFramingEnabled: boolean;
  
  // Reading/listening preferences (Feature Set B)
  readingPreferences: UserReadingPreferences;
  
  // Privacy preferences
  analyticsOptIn: boolean; // Opt-in for aggregate analytics
  
  lastUpdated: string;
}

// ============================================================================
// ADMIN/MODERATION INTERFACES
// ============================================================================

export interface ModerationQueue {
  pendingReflections: CommunityReflection[];
  flaggedReflections: CommunityReflection[];
  totalPending: number;
  totalFlagged: number;
  lastUpdated: string;
}

export interface CMFReport {
  reportPeriod: {
    start: string;
    end: string;
  };
  
  // Platform metrics
  platformMetrics: PlatformWideMetrics;
  
  // Story-level metrics
  storyMetrics: AggregateStoryMetrics[];
  
  // Language diversity
  multilingualEngagement: {
    totalBilingualSessions: number; // Sessions where user switched languages
    frenchEngagement: number; // % of sessions with FR content
    spanishEngagement: number; // % of sessions with ES content
  };
  
  // Institutional reach
  institutionalUsers: number; // Approximate
  institutionalCollections: number;
  
  // Cultural impact indicators
  themesDiversity: string[]; // Themes engaged with
  geographicReach?: string[]; // Country codes (if tracked)
  
  generatedAt: string;
  generatedBy: string; // Admin ID
}
