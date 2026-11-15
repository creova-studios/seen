/**
 * ACCESSIBILITY & INCLUSION MODULE
 * 
 * Purpose: Ensure content is accessible to all users
 * Features:
 * - Caption and transcript support for audio/video
 * - Screen reader compatibility metadata
 * - Language metadata (EN/FR/ES)
 * - Low-bandwidth delivery options
 * - Alternative text for media
 * - Accessibility compliance tracking
 * 
 * Standards: WCAG 2.1 Level AA compliance
 */

import * as kv from "./kv_store.tsx";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CaptionTrack {
  id: string;
  contentId: string;
  chapterIndex: number;
  language: 'en' | 'fr' | 'es';
  format: 'vtt' | 'srt' | 'json';
  captions: Caption[];
  createdBy: string; // User ID of who created captions
  createdAt: string;
  verified: boolean; // Has been verified for accuracy
  verifiedBy?: string;
}

export interface Caption {
  startTime: number; // In milliseconds
  endTime: number;
  text: string;
  speakerLabel?: string; // Optional speaker identification
}

export interface Transcript {
  id: string;
  contentId: string;
  chapterIndex: number;
  language: 'en' | 'fr' | 'es';
  fullText: string;
  timestampedSegments?: Array<{
    timestamp: number;
    text: string;
    speaker?: string;
  }>;
  createdBy: string;
  createdAt: string;
  verified: boolean;
  verifiedBy?: string;
}

export interface MediaAlternativeText {
  mediaId: string;
  contentId: string;
  altText: string;
  longDescription?: string; // Extended description for complex images
  language: 'en' | 'fr' | 'es';
  createdBy: string;
  createdAt: string;
}

export interface AccessibilityMetadata {
  contentId: string;
  hasCaptions: boolean;
  captionLanguages: string[];
  hasTranscripts: boolean;
  transcriptLanguages: string[];
  hasAltText: boolean;
  screenReaderOptimized: boolean;
  lowBandwidthAvailable: boolean;
  wcagCompliance: {
    levelA: boolean;
    levelAA: boolean;
    levelAAA: boolean;
  };
  lastAuditedAt?: string;
  auditedBy?: string;
  accessibilityNotes?: string;
}

export interface LowBandwidthVersion {
  id: string;
  contentId: string;
  chapterIndex: number;
  optimizationType: 'text_only' | 'low_res_images' | 'compressed_audio';
  compressedSize: number; // In bytes
  originalSize: number;
  compressionRatio: number;
  createdAt: string;
  url?: string; // CDN URL for low-bandwidth version
}

export interface ScreenReaderHints {
  contentId: string;
  navigationHints: string[];
  landmarkLabels: { [key: string]: string };
  skipLinks: string[];
  ariaDescriptions: { [elementId: string]: string };
  readingOrder: string[]; // Order of content blocks for screen readers
}

// ============================================================================
// CAPTION MANAGEMENT
// ============================================================================

/**
 * Add captions to content chapter
 */
export async function addCaptions(params: {
  contentId: string;
  chapterIndex: number;
  language: 'en' | 'fr' | 'es';
  format: 'vtt' | 'srt' | 'json';
  captions: Caption[];
  createdBy: string;
}): Promise<CaptionTrack> {
  const captionId = `caption_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const captionTrack: CaptionTrack = {
    id: captionId,
    contentId: params.contentId,
    chapterIndex: params.chapterIndex,
    language: params.language,
    format: params.format,
    captions: params.captions,
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
    verified: false,
  };
  
  await kv.set(`caption:${params.contentId}:${params.chapterIndex}:${params.language}`, captionTrack);
  
  // Update accessibility metadata
  await updateAccessibilityMetadata(params.contentId);
  
  return captionTrack;
}

/**
 * Verify captions for accuracy
 */
export async function verifyCaptions(
  contentId: string,
  chapterIndex: number,
  language: string,
  verifierId: string
): Promise<void> {
  const caption = await kv.get(`caption:${contentId}:${chapterIndex}:${language}`);
  
  if (caption) {
    caption.verified = true;
    caption.verifiedBy = verifierId;
    await kv.set(`caption:${contentId}:${chapterIndex}:${language}`, caption);
  }
}

/**
 * Get captions for content chapter
 */
export async function getCaptions(
  contentId: string,
  chapterIndex: number,
  language: string
): Promise<CaptionTrack | null> {
  return await kv.get(`caption:${contentId}:${chapterIndex}:${language}`);
}

/**
 * Convert captions to VTT format
 */
export function captionsToVTT(captions: Caption[]): string {
  let vtt = 'WEBVTT\n\n';
  
  captions.forEach((caption, index) => {
    const start = formatTimestamp(caption.startTime);
    const end = formatTimestamp(caption.endTime);
    
    vtt += `${index + 1}\n`;
    vtt += `${start} --> ${end}\n`;
    if (caption.speakerLabel) {
      vtt += `<v ${caption.speakerLabel}>${caption.text}\n\n`;
    } else {
      vtt += `${caption.text}\n\n`;
    }
  });
  
  return vtt;
}

function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function pad(num: number, size: number = 2): string {
  return String(num).padStart(size, '0');
}

// ============================================================================
// TRANSCRIPT MANAGEMENT
// ============================================================================

/**
 * Add transcript to content chapter
 */
export async function addTranscript(params: {
  contentId: string;
  chapterIndex: number;
  language: 'en' | 'fr' | 'es';
  fullText: string;
  timestampedSegments?: Array<{
    timestamp: number;
    text: string;
    speaker?: string;
  }>;
  createdBy: string;
}): Promise<Transcript> {
  const transcriptId = `transcript_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const transcript: Transcript = {
    id: transcriptId,
    contentId: params.contentId,
    chapterIndex: params.chapterIndex,
    language: params.language,
    fullText: params.fullText,
    timestampedSegments: params.timestampedSegments,
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
    verified: false,
  };
  
  await kv.set(`transcript:${params.contentId}:${params.chapterIndex}:${params.language}`, transcript);
  
  // Update accessibility metadata
  await updateAccessibilityMetadata(params.contentId);
  
  return transcript;
}

/**
 * Get transcript for content chapter
 */
export async function getTranscript(
  contentId: string,
  chapterIndex: number,
  language: string
): Promise<Transcript | null> {
  return await kv.get(`transcript:${contentId}:${chapterIndex}:${language}`);
}

/**
 * Auto-generate transcript from captions
 */
export async function generateTranscriptFromCaptions(
  contentId: string,
  chapterIndex: number,
  language: string,
  userId: string
): Promise<Transcript> {
  const captions = await getCaptions(contentId, chapterIndex, language);
  
  if (!captions) {
    throw new Error('No captions found to generate transcript');
  }
  
  const fullText = captions.captions.map(c => c.text).join(' ');
  
  const timestampedSegments = captions.captions.map(c => ({
    timestamp: c.startTime,
    text: c.text,
    speaker: c.speakerLabel,
  }));
  
  return await addTranscript({
    contentId,
    chapterIndex,
    language,
    fullText,
    timestampedSegments,
    createdBy: userId,
  });
}

// ============================================================================
// ALTERNATIVE TEXT MANAGEMENT
// ============================================================================

/**
 * Add alternative text for media
 */
export async function addMediaAltText(params: {
  mediaId: string;
  contentId: string;
  altText: string;
  longDescription?: string;
  language: 'en' | 'fr' | 'es';
  createdBy: string;
}): Promise<MediaAlternativeText> {
  const altTextRecord: MediaAlternativeText = {
    mediaId: params.mediaId,
    contentId: params.contentId,
    altText: params.altText,
    longDescription: params.longDescription,
    language: params.language,
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
  };
  
  await kv.set(`alt_text:${params.mediaId}:${params.language}`, altTextRecord);
  
  // Update accessibility metadata
  await updateAccessibilityMetadata(params.contentId);
  
  return altTextRecord;
}

/**
 * Get alternative text for media
 */
export async function getMediaAltText(
  mediaId: string,
  language: string
): Promise<MediaAlternativeText | null> {
  return await kv.get(`alt_text:${mediaId}:${language}`);
}

// ============================================================================
// LOW-BANDWIDTH OPTIMIZATION
// ============================================================================

/**
 * Create low-bandwidth version of content
 */
export async function createLowBandwidthVersion(params: {
  contentId: string;
  chapterIndex: number;
  optimizationType: 'text_only' | 'low_res_images' | 'compressed_audio';
  compressedSize: number;
  originalSize: number;
  url?: string;
}): Promise<LowBandwidthVersion> {
  const versionId = `low_bandwidth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const lowBandwidthVersion: LowBandwidthVersion = {
    id: versionId,
    contentId: params.contentId,
    chapterIndex: params.chapterIndex,
    optimizationType: params.optimizationType,
    compressedSize: params.compressedSize,
    originalSize: params.originalSize,
    compressionRatio: params.compressedSize / params.originalSize,
    createdAt: new Date().toISOString(),
    url: params.url,
  };
  
  await kv.set(`low_bandwidth:${params.contentId}:${params.chapterIndex}`, lowBandwidthVersion);
  
  // Update accessibility metadata
  await updateAccessibilityMetadata(params.contentId);
  
  return lowBandwidthVersion;
}

/**
 * Get low-bandwidth version
 */
export async function getLowBandwidthVersion(
  contentId: string,
  chapterIndex: number
): Promise<LowBandwidthVersion | null> {
  return await kv.get(`low_bandwidth:${contentId}:${chapterIndex}`);
}

// ============================================================================
// SCREEN READER OPTIMIZATION
// ============================================================================

/**
 * Set screen reader hints for content
 */
export async function setScreenReaderHints(params: {
  contentId: string;
  navigationHints: string[];
  landmarkLabels?: { [key: string]: string };
  skipLinks?: string[];
  ariaDescriptions?: { [elementId: string]: string };
  readingOrder: string[];
}): Promise<ScreenReaderHints> {
  const hints: ScreenReaderHints = {
    contentId: params.contentId,
    navigationHints: params.navigationHints,
    landmarkLabels: params.landmarkLabels || {},
    skipLinks: params.skipLinks || [],
    ariaDescriptions: params.ariaDescriptions || {},
    readingOrder: params.readingOrder,
  };
  
  await kv.set(`screen_reader_hints:${params.contentId}`, hints);
  
  // Update accessibility metadata
  await updateAccessibilityMetadata(params.contentId);
  
  return hints;
}

/**
 * Get screen reader hints
 */
export async function getScreenReaderHints(contentId: string): Promise<ScreenReaderHints | null> {
  return await kv.get(`screen_reader_hints:${contentId}`);
}

// ============================================================================
// ACCESSIBILITY METADATA & COMPLIANCE
// ============================================================================

/**
 * Update accessibility metadata for content
 */
async function updateAccessibilityMetadata(contentId: string): Promise<void> {
  const content = await kv.get(`content:${contentId}`);
  if (!content) return;
  
  // Check for captions
  const allCaptions = await kv.getByPrefix(`caption:${contentId}:`);
  const hasCaptions = allCaptions.length > 0;
  const captionLanguages = [...new Set(allCaptions.map(c => c.language))];
  
  // Check for transcripts
  const allTranscripts = await kv.getByPrefix(`transcript:${contentId}:`);
  const hasTranscripts = allTranscripts.length > 0;
  const transcriptLanguages = [...new Set(allTranscripts.map(t => t.language))];
  
  // Check for alt text
  const allAltText = await kv.getByPrefix(`alt_text:`);
  const contentAltText = allAltText.filter(a => a.contentId === contentId);
  const hasAltText = contentAltText.length > 0;
  
  // Check for low-bandwidth versions
  const lowBandwidth = await kv.getByPrefix(`low_bandwidth:${contentId}:`);
  const lowBandwidthAvailable = lowBandwidth.length > 0;
  
  // Check for screen reader hints
  const screenReaderHints = await kv.get(`screen_reader_hints:${contentId}`);
  const screenReaderOptimized = !!screenReaderHints;
  
  // Determine WCAG compliance
  const wcagCompliance = {
    levelA: hasAltText, // Basic requirement: alt text for images
    levelAA: hasAltText && (hasCaptions || hasTranscripts), // Captions/transcripts for audio/video
    levelAAA: hasAltText && hasCaptions && hasTranscripts && screenReaderOptimized,
  };
  
  const metadata: AccessibilityMetadata = {
    contentId,
    hasCaptions,
    captionLanguages,
    hasTranscripts,
    transcriptLanguages,
    hasAltText,
    screenReaderOptimized,
    lowBandwidthAvailable,
    wcagCompliance,
  };
  
  await kv.set(`accessibility_metadata:${contentId}`, metadata);
}

/**
 * Get accessibility metadata
 */
export async function getAccessibilityMetadata(contentId: string): Promise<AccessibilityMetadata | null> {
  return await kv.get(`accessibility_metadata:${contentId}`);
}

/**
 * Audit content for accessibility compliance
 */
export async function auditAccessibility(
  contentId: string,
  auditorId: string,
  notes?: string
): Promise<AccessibilityMetadata> {
  await updateAccessibilityMetadata(contentId);
  
  const metadata = await kv.get(`accessibility_metadata:${contentId}`);
  
  if (metadata) {
    metadata.lastAuditedAt = new Date().toISOString();
    metadata.auditedBy = auditorId;
    metadata.accessibilityNotes = notes;
    
    await kv.set(`accessibility_metadata:${contentId}`, metadata);
  }
  
  return metadata;
}

/**
 * Get accessibility compliance report
 */
export async function getAccessibilityComplianceReport(): Promise<{
  totalContent: number;
  levelACompliant: number;
  levelAACompliant: number;
  levelAAACompliant: number;
  withCaptions: number;
  withTranscripts: number;
  withAltText: number;
  screenReaderOptimized: number;
  complianceRate: {
    levelA: number;
    levelAA: number;
    levelAAA: number;
  };
}> {
  const allContent = await kv.getByPrefix('content:');
  const publishedContent = allContent.filter(c => c.status === 'published');
  
  let levelACompliant = 0;
  let levelAACompliant = 0;
  let levelAAACompliant = 0;
  let withCaptions = 0;
  let withTranscripts = 0;
  let withAltText = 0;
  let screenReaderOptimized = 0;
  
  for (const content of publishedContent) {
    const metadata = await getAccessibilityMetadata(content.id);
    
    if (!metadata) continue;
    
    if (metadata.wcagCompliance.levelA) levelACompliant++;
    if (metadata.wcagCompliance.levelAA) levelAACompliant++;
    if (metadata.wcagCompliance.levelAAA) levelAAACompliant++;
    if (metadata.hasCaptions) withCaptions++;
    if (metadata.hasTranscripts) withTranscripts++;
    if (metadata.hasAltText) withAltText++;
    if (metadata.screenReaderOptimized) screenReaderOptimized++;
  }
  
  const total = publishedContent.length;
  
  return {
    totalContent: total,
    levelACompliant,
    levelAACompliant,
    levelAAACompliant,
    withCaptions,
    withTranscripts,
    withAltText,
    screenReaderOptimized,
    complianceRate: {
      levelA: total > 0 ? (levelACompliant / total) * 100 : 0,
      levelAA: total > 0 ? (levelAACompliant / total) * 100 : 0,
      levelAAA: total > 0 ? (levelAAACompliant / total) * 100 : 0,
    },
  };
}
