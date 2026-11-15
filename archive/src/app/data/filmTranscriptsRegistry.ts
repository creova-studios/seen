/**
 * FILM TRANSCRIPTS REGISTRY
 * SEEN by CREOVA — Accessibility Transcripts for Embedded Films
 * 
 * Structured transcripts for screen reader accessibility
 * Generated via AI transcription + human review
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface TranscriptSegment {
  /** Timestamp in seconds from start */
  timestamp: number;
  
  /** Formatted timestamp (MM:SS or HH:MM:SS) */
  timeDisplay: string;
  
  /** Speaker name (if identifiable) */
  speaker?: string;
  
  /** Transcript text for this segment */
  text: string;
  
  /** Optional description of visual elements */
  visualDescription?: string;
}

export interface FilmTranscript {
  /** Film ID (matches curatedFilmsRegistry) */
  filmId: string;
  
  /** Transcript language */
  language: 'en' | 'fr' | 'es' | 'Punjabi';
  
  /** Full transcript segments with timestamps */
  segments: TranscriptSegment[];
  
  /** Full text (all segments combined, for search) */
  fullText: string;
  
  /** Transcript generation metadata */
  metadata: {
    transcriptionMethod: 'YouTube Auto-Captions' | 'Professional Service' | 'Manual Transcription' | 'AI + Human Review';
    reviewedBy?: string;
    reviewDate?: string;
    accuracy: 'Draft' | 'Reviewed' | 'Professional';
    notes?: string;
  };
  
  /** Accessibility features */
  accessibility: {
    screenReaderOptimized: boolean;
    includesVisualDescriptions: boolean;
    includesSoundDescriptions: boolean;
  };
}

// ============================================
// TRANSCRIPT 1: HIP-HOP EVOLUTION TORONTO
// ============================================

/**
 * TRANSCRIPT STATUS: PENDING REAL VIDEO TRANSCRIPTION
 * 
 * This is a FRAMEWORK showing the required structure.
 * To complete this transcript:
 * 
 * 1. Watch the video: https://www.youtube.com/watch?v=yXJcT1ByXb4
 * 2. Use YouTube's auto-captions as a starting point:
 *    - Click "..." → Show transcript
 *    - Copy auto-generated captions
 * 3. Review and correct for accuracy
 * 4. Add speaker names where identifiable
 * 5. Add visual descriptions for key moments
 * 6. Format timestamps every 30-60 seconds
 * 
 * ALTERNATIVE: Use Rev.com or similar professional service ($1.50/min)
 */

export const TRANSCRIPT_HIP_HOP_EVOLUTION: FilmTranscript = {
  filmId: 'nfb-hip-hop-evolution',
  language: 'en',
  segments: [
    {
      timestamp: 0,
      timeDisplay: '00:00',
      speaker: 'Narrator',
      text: '[PENDING TRANSCRIPTION] This transcript requires manual transcription from the actual YouTube video. See documentation in /docs/TRANSCRIPT-COMPLETION-GUIDE.md for detailed instructions.',
      visualDescription: '[Visual: Opening titles]',
    },
    // Additional segments to be added after real transcription
  ],
  fullText: '[PENDING TRANSCRIPTION] Visit /docs/TRANSCRIPT-COMPLETION-GUIDE.md for transcription instructions.',
  metadata: {
    transcriptionMethod: 'AI + Human Review',
    accuracy: 'Draft',
    notes: 'Awaiting real video transcription. Framework structure complete.',
  },
  accessibility: {
    screenReaderOptimized: true,
    includesVisualDescriptions: false, // Will be true after completion
    includesSoundDescriptions: false,
  },
};

// ============================================
// TRANSCRIPT 2: DEF POETS FRESH
// ============================================

export const TRANSCRIPT_DEF_POETS_FRESH: FilmTranscript = {
  filmId: 'nfb-fresh-to-def',
  language: 'en',
  segments: [
    {
      timestamp: 0,
      timeDisplay: '00:00',
      speaker: 'Host',
      text: '[PENDING TRANSCRIPTION] This transcript requires manual transcription from the actual YouTube video. See documentation in /docs/TRANSCRIPT-COMPLETION-GUIDE.md for detailed instructions.',
      visualDescription: '[Visual: Spoken word performance]',
    },
    // Additional segments to be added after real transcription
  ],
  fullText: '[PENDING TRANSCRIPTION] Visit /docs/TRANSCRIPT-COMPLETION-GUIDE.md for transcription instructions.',
  metadata: {
    transcriptionMethod: 'AI + Human Review',
    accuracy: 'Draft',
    notes: 'Awaiting real video transcription. Framework structure complete. Multiple poets may require speaker identification.',
  },
  accessibility: {
    screenReaderOptimized: true,
    includesVisualDescriptions: false, // Will be true after completion
    includesSoundDescriptions: false,
  },
};

// ============================================
// TRANSCRIPT 3: AFRICVILLE MUSEUM DOC
// ============================================

export const TRANSCRIPT_AFRICVILLE_MUSEUM: FilmTranscript = {
  filmId: 'africville-museum-doc',
  language: 'en',
  segments: [
    {
      timestamp: 0,
      timeDisplay: '00:00',
      speaker: 'Narrator',
      text: '[PENDING TRANSCRIPTION] This transcript requires manual transcription from the actual YouTube video. See documentation in /docs/TRANSCRIPT-COMPLETION-GUIDE.md for detailed instructions.',
      visualDescription: '[Visual: Africville Museum exterior]',
    },
    // Additional segments to be added after real transcription
  ],
  fullText: '[PENDING TRANSCRIPTION] Visit /docs/TRANSCRIPT-COMPLETION-GUIDE.md for transcription instructions.',
  metadata: {
    transcriptionMethod: 'AI + Human Review',
    accuracy: 'Draft',
    notes: 'Awaiting real video transcription. Framework structure complete.',
  },
  accessibility: {
    screenReaderOptimized: true,
    includesVisualDescriptions: false, // Will be true after completion
    includesSoundDescriptions: false,
  },
};

// ============================================
// REGISTRY
// ============================================

export const FILM_TRANSCRIPTS_REGISTRY: FilmTranscript[] = [
  TRANSCRIPT_HIP_HOP_EVOLUTION,
  TRANSCRIPT_DEF_POETS_FRESH,
  TRANSCRIPT_AFRICVILLE_MUSEUM,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTranscriptByFilmId(filmId: string): FilmTranscript | undefined {
  return FILM_TRANSCRIPTS_REGISTRY.find(t => t.filmId === filmId);
}

export function isTranscriptComplete(filmId: string): boolean {
  const transcript = getTranscriptByFilmId(filmId);
  if (!transcript) return false;
  
  // Check if transcript has more than just the pending placeholder
  return transcript.segments.length > 1 && 
         transcript.metadata.accuracy !== 'Draft';
}

export function getTranscriptFullText(filmId: string): string {
  const transcript = getTranscriptByFilmId(filmId);
  return transcript?.fullText || '';
}

export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function searchTranscript(filmId: string, query: string): TranscriptSegment[] {
  const transcript = getTranscriptByFilmId(filmId);
  if (!transcript) return [];
  
  const lowerQuery = query.toLowerCase();
  return transcript.segments.filter(segment =>
    segment.text.toLowerCase().includes(lowerQuery) ||
    segment.speaker?.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// COMPLETION STATUS
// ============================================

export const TRANSCRIPT_COMPLETION_STATUS = {
  total: 3,
  completed: 0, // Will be updated as transcripts are completed
  pending: 3,
  accuracy: {
    draft: 3,
    reviewed: 0,
    professional: 0,
  },
};

console.log('[Film Transcripts] Registry loaded:', TRANSCRIPT_COMPLETION_STATUS);
