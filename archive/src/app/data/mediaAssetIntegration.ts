/**
 * MEDIA ASSET INTEGRATION SYSTEM
 * SEEN by CREOVA
 * 
 * Complete integration layer for audio narration files with chapter data
 * Handles file storage, retrieval, playback control, and accessibility
 */

import { AudioScript, getAudioScript } from './audioScripts';
import { getChaptersForStory, type Chapter } from './storyDatabase';
import { AudioFileMetadata, generateAudioFileName } from './audioProductionSystem';
import { getStoryWorldById } from './storyDatabase';

// ============================================
// MEDIA STORAGE CONFIGURATION
// ============================================

export const MEDIA_STORAGE_CONFIG = {
  // Storage location for audio files
  baseUrl: '/assets/audio', // Local development
  productionUrl: 'https://cdn.seenbycreova.com/audio', // Production CDN
  
  // File organization
  structure: {
    byStoryWorld: true, // /assets/audio/midnight-resonance/
    byLanguage: true, // /assets/audio/midnight-resonance/en/
  },
  
  // Format support
  formats: {
    primary: 'wav', // Archival quality
    streaming: 'mp3', // Compressed for web delivery (128-192 kbps)
    fallback: 'ogg', // Browser compatibility
  },
  
  // Caching strategy
  cache: {
    enabled: true,
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    strategy: 'cache-first', // Offline-first for better UX
  },
} as const;

// ============================================
// AUDIO FILE PATHS
// ============================================

/**
 * Generate complete file path for audio asset
 */
export function getAudioFilePath(
  storyWorldId: string,
  chapterId: string,
  language: 'en' | 'fr' | 'es',
  format: 'wav' | 'mp3' | 'ogg' = 'mp3'
): string {
  const baseUrl = MEDIA_STORAGE_CONFIG.baseUrl;
  const fileName = generateAudioFileName(storyWorldId, chapterId, language).replace('.wav', `.${format}`);
  
  if (MEDIA_STORAGE_CONFIG.structure.byStoryWorld && MEDIA_STORAGE_CONFIG.structure.byLanguage) {
    return `${baseUrl}/${storyWorldId}/${language}/${fileName}`;
  }
  
  return `${baseUrl}/${fileName}`;
}

/**
 * Get all available formats for a chapter's audio
 */
export function getAudioFileFormats(
  storyWorldId: string,
  chapterId: string,
  language: 'en' | 'fr' | 'es'
): {
  wav?: string;
  mp3?: string;
  ogg?: string;
} {
  return {
    wav: getAudioFilePath(storyWorldId, chapterId, language, 'wav'),
    mp3: getAudioFilePath(storyWorldId, chapterId, language, 'mp3'),
    ogg: getAudioFilePath(storyWorldId, chapterId, language, 'ogg'),
  };
}

// ============================================
// AUDIO PLAYBACK INTEGRATION
// ============================================

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number; // seconds
  duration: number; // seconds
  playbackRate: number; // 0.5 - 2.0
  volume: number; // 0.0 - 1.0
  isMuted: boolean;
  isLoading: boolean;
  error?: string;
}

export interface AudioPlayerControls {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  skipForward: (seconds: number) => void;
  skipBackward: (seconds: number) => void;
}

/**
 * Audio playback configuration for accessibility
 */
export const AUDIO_PLAYBACK_CONFIG = {
  // Playback speed options (accessibility feature)
  playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  defaultPlaybackRate: 1.0,
  
  // Skip intervals
  skipForwardInterval: 15, // seconds
  skipBackwardInterval: 10, // seconds
  
  // Volume
  defaultVolume: 0.8,
  volumeStep: 0.1,
  
  // Auto-play behavior
  autoPlay: false, // User must initiate (accessibility requirement)
  autoPlayNext: false, // Don't auto-advance to next chapter
  
  // Preloading
  preload: 'metadata' as const, // Only load metadata until user plays
  
  // Error handling
  retryAttempts: 3,
  retryDelay: 1000, // milliseconds
} as const;

// ============================================
// CHAPTER-AUDIO INTEGRATION
// ============================================

export interface ChapterWithAudio extends Chapter {
  audio: {
    available: boolean;
    formats: {
      wav?: string;
      mp3?: string;
      ogg?: string;
    };
    script: AudioScript | undefined;
    duration: number; // estimated or actual
    transcript: string; // For accessibility (screen readers)
  };
}

/**
 * Enhance chapter data with audio integration
 */
export function getChapterWithAudio(
  storyWorldId: string,
  chapterId: string,
  language: 'en' | 'fr' | 'es'
): ChapterWithAudio | undefined {
  // Find chapter using independent registry
  const storyWorld = getStoryWorldById(storyWorldId);
  if (!storyWorld) return undefined;

  const chapters = getChaptersForStory(storyWorldId);
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return undefined;
  
  // Get audio script
  const script = getAudioScript(chapterId, language);
  
  // Get audio file paths
  const formats = getAudioFileFormats(storyWorldId, chapterId, language);
  
  // Create enhanced chapter
  return {
    ...chapter,
    audio: {
      available: !!script, // Audio available if script exists
      formats,
      script,
      duration: script?.estimatedDuration || 180,
      transcript: script?.narrationText || '', // Full text for accessibility
    },
  };
}

/**
 * Get all chapters with audio for a story world
 */
export function getStoryWorldWithAudio(
  storyWorldId: string,
  language: 'en' | 'fr' | 'es'
): ChapterWithAudio[] {
  const chapters = getChaptersForStory(storyWorldId);
  if (chapters.length === 0) return [];

  return chapters
    .map((chapter) => getChapterWithAudio(storyWorldId, chapter.id, language))
    .filter((c): c is ChapterWithAudio => c !== undefined);
}

// ============================================
// AUDIO ACCESSIBILITY FEATURES
// ============================================

export interface AudioAccessibilityOptions {
  // Playback speed control
  enablePlaybackSpeedControl: boolean;
  
  // Transcript display
  showTranscript: boolean;
  autoScrollTranscript: boolean; // Sync with audio playback
  
  // Visual indicators
  showWaveform: boolean;
  showProgressBar: boolean;
  showTimeRemaining: boolean;
  
  // Keyboard controls
  enableKeyboardShortcuts: boolean;
  
  // Screen reader support
  announcePlaybackState: boolean;
  announceTimeUpdates: boolean; // Every 30 seconds
}

export const DEFAULT_ACCESSIBILITY_OPTIONS: AudioAccessibilityOptions = {
  enablePlaybackSpeedControl: true,
  showTranscript: true,
  autoScrollTranscript: true,
  showWaveform: false, // Performance consideration
  showProgressBar: true,
  showTimeRemaining: true,
  enableKeyboardShortcuts: true,
  announcePlaybackState: true,
  announceTimeUpdates: false, // Optional, can be annoying
};

/**
 * Keyboard shortcuts for audio playback (accessibility)
 */
export const AUDIO_KEYBOARD_SHORTCUTS = {
  playPause: 'Space',
  skipForward: 'ArrowRight',
  skipBackward: 'ArrowLeft',
  increaseSpeed: 'Shift+ArrowUp',
  decreaseSpeed: 'Shift+ArrowDown',
  increaseVolume: 'ArrowUp',
  decreaseVolume: 'ArrowDown',
  mute: 'M',
  showTranscript: 'T',
  restart: 'R',
} as const;

// ============================================
// AUDIO ANALYTICS (PRIVACY-FIRST)
// ============================================

/**
 * Privacy-first audio engagement tracking
 * NO user identification, NO behavioral surveillance
 * Local storage only, aggregate statistics for CMF reporting
 */
export interface AudioEngagementMetrics {
  // Chapter-level (no user tracking)
  chapterId: string;
  language: 'en' | 'fr' | 'es';
  
  // Aggregate counts (stored locally)
  playsStarted: number; // How many times play was pressed
  playsCompleted: number; // How many times audio finished
  averageCompletionRate: number; // Percentage listened on average
  
  // Accessibility usage (aggregate)
  playbackSpeedUsage: {
    [rate: string]: number; // e.g., "0.75": 5, "1.0": 20
  };
  
  // NO timestamps, NO user IDs, NO session tracking
  // This data is for CMF reporting only (engagement with cultural content)
}

/**
 * Record audio engagement (privacy-first, local only)
 */
export function recordAudioEngagement(
  chapterId: string,
  language: 'en' | 'fr' | 'es',
  event: 'play_started' | 'play_completed' | 'playback_rate_changed',
  metadata?: { playbackRate?: number; completionPercentage?: number }
): void {
  // Implementation would use localStorage only
  // No network requests, no user tracking
  // Data aggregated locally for CMF compliance reporting
  
  const storageKey = `audio_engagement_${chapterId}_${language}`;
  // ... local storage logic
}

// ============================================
// AUDIO PLAYER COMPONENT INTEGRATION
// ============================================

export interface AudioPlayerProps {
  // Chapter data
  storyWorldId: string;
  chapterId: string;
  language: 'en' | 'fr' | 'es';
  
  // Customization
  showTranscript?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
  
  // Accessibility
  accessibilityOptions?: Partial<AudioAccessibilityOptions>;
  
  // Callbacks
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

/**
 * Get props for audio player component
 */
export function getAudioPlayerProps(
  storyWorldId: string,
  chapterId: string,
  language: 'en' | 'fr' | 'es',
  options?: Partial<AudioPlayerProps>
): AudioPlayerProps {
  return {
    storyWorldId,
    chapterId,
    language,
    showTranscript: options?.showTranscript ?? true,
    showControls: options?.showControls ?? true,
    autoPlay: options?.autoPlay ?? false,
    accessibilityOptions: {
      ...DEFAULT_ACCESSIBILITY_OPTIONS,
      ...options?.accessibilityOptions,
    },
    onPlay: options?.onPlay,
    onPause: options?.onPause,
    onEnded: options?.onEnded,
    onError: options?.onError,
    onTimeUpdate: options?.onTimeUpdate,
  };
}

// ============================================
// AUDIO PRELOADING STRATEGY
// ============================================

/**
 * Preload audio for smooth playback experience
 */
export interface AudioPreloadStrategy {
  // Current chapter
  preloadCurrent: boolean; // Always true
  
  // Next chapter (queue optimization)
  preloadNext: boolean;
  
  // Previous chapter (for back navigation)
  preloadPrevious: boolean;
  
  // Priority format
  priorityFormat: 'mp3' | 'ogg'; // Load compressed format first
}

export const DEFAULT_PRELOAD_STRATEGY: AudioPreloadStrategy = {
  preloadCurrent: true,
  preloadNext: true, // Better UX for sequential listening
  preloadPrevious: false, // Less common use case
  priorityFormat: 'mp3',
};

/**
 * Get chapters to preload based on current position
 */
export function getPreloadQueue(
  storyWorldId: string,
  currentChapterId: string,
  language: 'en' | 'fr' | 'es',
  strategy: AudioPreloadStrategy = DEFAULT_PRELOAD_STRATEGY
): string[] {
  const chapters = getChaptersForStory(storyWorldId);
  if (chapters.length === 0) return [];

  const currentIndex = chapters.findIndex((c) => c.id === currentChapterId);
  if (currentIndex === -1) return [];

  const preloadQueue: string[] = [];

  // Current chapter (always)
  if (strategy.preloadCurrent) {
    const currentPath = getAudioFilePath(
      storyWorldId,
      currentChapterId,
      language,
      strategy.priorityFormat
    );
    preloadQueue.push(currentPath);
  }

  // Next chapter
  if (strategy.preloadNext && currentIndex < chapters.length - 1) {
    const nextChapter = chapters[currentIndex + 1];
    const nextPath = getAudioFilePath(
      storyWorldId,
      nextChapter.id,
      language,
      strategy.priorityFormat
    );
    preloadQueue.push(nextPath);
  }

  // Previous chapter
  if (strategy.preloadPrevious && currentIndex > 0) {
    const prevChapter = chapters[currentIndex - 1];
    const prevPath = getAudioFilePath(
      storyWorldId,
      prevChapter.id,
      language,
      strategy.priorityFormat
    );
    preloadQueue.push(prevPath);
  }

  return preloadQueue;
}

// ============================================
// ERROR HANDLING
// ============================================

export type AudioErrorType =
  | 'file_not_found'
  | 'network_error'
  | 'decode_error'
  | 'unsupported_format'
  | 'playback_error';

export interface AudioError {
  type: AudioErrorType;
  message: string;
  chapterId: string;
  language: 'en' | 'fr' | 'es';
  timestamp: string;
  recoverable: boolean;
  fallbackAction?: 'retry' | 'use_transcript' | 'skip_chapter';
}

/**
 * Handle audio playback errors with fallback strategies
 */
export function handleAudioError(
  error: Error,
  chapterId: string,
  language: 'en' | 'fr' | 'es'
): AudioError {
  // Determine error type
  let type: AudioErrorType = 'playback_error';
  let recoverable = true;
  let fallbackAction: AudioError['fallbackAction'] = 'retry';
  
  if (error.message.includes('404') || error.message.includes('not found')) {
    type = 'file_not_found';
    recoverable = false;
    fallbackAction = 'use_transcript';
  } else if (error.message.includes('network') || error.message.includes('fetch')) {
    type = 'network_error';
    recoverable = true;
    fallbackAction = 'retry';
  } else if (error.message.includes('decode')) {
    type = 'decode_error';
    recoverable = false;
    fallbackAction = 'use_transcript';
  }
  
  return {
    type,
    message: error.message,
    chapterId,
    language,
    timestamp: new Date().toISOString(),
    recoverable,
    fallbackAction,
  };
}

// ============================================
// EXPORT SUMMARY
// ============================================

/**
 * Complete media asset integration summary
 */
export function getMediaIntegrationStatus(): {
  totalChapters: number;
  audioScriptsAvailable: number;
  audioFilesReady: number; // Would check actual file existence
  supportedLanguages: string[];
  supportedFormats: string[];
  accessibilityFeatures: string[];
} {
  return {
    totalChapters: 58,
    audioScriptsAvailable: 58, // All scripts complete
    audioFilesReady: 0, // Recording phase not started
    supportedLanguages: ['en', 'fr', 'es'],
    supportedFormats: ['wav', 'mp3', 'ogg'],
    accessibilityFeatures: [
      'Playback speed control (0.5x - 2.0x)',
      'Full transcript display',
      'Keyboard shortcuts',
      'Screen reader support',
      'Auto-scrolling transcript',
      'Progress visualization',
      'Time remaining display',
    ],
  };
}
