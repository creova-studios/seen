/**
 * NARRATION ASSET REGISTRY
 * SEEN by CREOVA — Voiceover Production Pipeline
 * 
 * Human, ethical, multilingual narration system
 * Tracks narration recordings, narrator assignments, and quality control
 */

import type { Language } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type NarrationStatus = 
  | 'unrecorded'      // Not yet recorded
  | 'scheduled'       // Recording session scheduled
  | 'in-progress'     // Currently being recorded
  | 'recorded'        // Recording complete, needs QA
  | 'qa-pending'      // Quality assurance in progress
  | 'qa-failed'       // Failed QA, needs re-record
  | 'approved'        // QA approved, ready for integration
  | 'integrated'      // Integrated into platform
  | 'published';      // Live and accessible to users

export interface Narrator {
  id: string;
  name: string;
  language: Language;
  
  /** Primary or alternate narrator */
  role: 'primary' | 'alternate';
  
  /** Voice profile characteristics */
  voiceProfile: {
    tone: string; // e.g., "Warm, contemplative"
    pace: string; // e.g., "Measured, unhurried"
    accent: string; // e.g., "Canadian English, slight Caribbean influence"
  };
  
  /** Contact and availability */
  contact: {
    email: string;
    phone?: string;
  };
  availability: string[]; // e.g., ["2026-02-15", "2026-02-22"]
  
  /** Compensation */
  hourlyRate: number;
  
  /** Stories assigned */
  storiesAssigned: string[]; // Story IDs
  
  /** Contract status */
  contractSigned: boolean;
  contractDate?: string;
  
  /** Production notes */
  notes?: string;
}

export interface NarrationRecording {
  id: string;
  
  /** Chapter this narration belongs to */
  storyId: string;
  chapterId: string;
  
  /** Language of narration */
  language: Language;
  
  /** Narrator who recorded this */
  narratorId: string;
  
  /** File path to narration audio */
  filePath: string;
  
  /** Duration in seconds */
  duration: number;
  
  /** Recording session metadata */
  recordingSession: {
    date: string;
    sessionNumber: number; // e.g., 1, 2 (if retake)
    location: string; // e.g., "Narrator home studio" or "Studio XYZ"
  };
  
  /** Quality control */
  qaStatus: NarrationStatus;
  qaChecks: {
    clarity: boolean; // Clear pronunciation
    pacing: boolean; // Appropriate speed
    neutrality: boolean; // Emotionally restrained
    technicalQuality: boolean; // No clipping, noise, artifacts
    culturalSensitivity: boolean; // Respectful interpretation
  };
  qaFeedback?: string;
  qaDate?: string;
  qaReviewer?: string;
  
  /** Retake information (if applicable) */
  isRetake: boolean;
  originalRecordingId?: string; // If this is a retake, reference to original
  retakeReason?: string;
  
  /** Integration status */
  integratedDate?: string;
  publishedDate?: string;
  
  /** Production notes */
  notes?: string;
}

// ============================================
// NARRATOR ROSTER
// ============================================

export const NARRATORS: Narrator[] = [
  // English (EN) Narrators
  {
    id: 'en-primary-001',
    name: 'To Be Assigned',
    language: 'en',
    role: 'primary',
    voiceProfile: {
      tone: 'Warm, contemplative, grounded',
      pace: 'Measured, allows for reflection',
      accent: 'Canadian English (neutral, accessible)',
    },
    contact: {
      email: 'tbd@example.com',
    },
    availability: [],
    hourlyRate: 400,
    storiesAssigned: [],
    contractSigned: false,
    notes: 'Awaiting casting completion',
  },
  {
    id: 'en-alternate-001',
    name: 'To Be Assigned',
    language: 'en',
    role: 'alternate',
    voiceProfile: {
      tone: 'Calm, intimate, clear',
      pace: 'Unhurried, contemplative',
      accent: 'Canadian English',
    },
    contact: {
      email: 'tbd@example.com',
    },
    availability: [],
    hourlyRate: 350,
    storiesAssigned: [],
    contractSigned: false,
    notes: 'Backup narrator for scheduling conflicts',
  },

  // French (FR) Narrators
  {
    id: 'fr-primary-001',
    name: 'À Déterminer',
    language: 'fr',
    role: 'primary',
    voiceProfile: {
      tone: 'Chaleureux, contemplatif, ancré',
      pace: 'Mesuré, permet la réflexion',
      accent: 'Français canadien (neutre, accessible)',
    },
    contact: {
      email: 'tbd@example.com',
    },
    availability: [],
    hourlyRate: 400,
    storiesAssigned: [],
    contractSigned: false,
    notes: 'En attente de la fin du casting',
  },
  {
    id: 'fr-alternate-001',
    name: 'À Déterminer',
    language: 'fr',
    role: 'alternate',
    voiceProfile: {
      tone: 'Calme, intime, clair',
      pace: 'Sans hâte, contemplatif',
      accent: 'Français canadien',
    },
    contact: {
      email: 'tbd@example.com',
    },
    availability: [],
    hourlyRate: 350,
    storiesAssigned: [],
    contractSigned: false,
    notes: 'Narrateur de secours pour conflits d\'horaire',
  },

  // Spanish (ES) Narrators
  {
    id: 'es-primary-001',
    name: 'Por Determinar',
    language: 'es',
    role: 'primary',
    voiceProfile: {
      tone: 'Cálido, contemplativo, fundamentado',
      pace: 'Medido, permite reflexión',
      accent: 'Español (neutro, accesible)',
    },
    contact: {
      email: 'tbd@example.com',
    },
    availability: [],
    hourlyRate: 400,
    storiesAssigned: [],
    contractSigned: false,
    notes: 'Esperando finalización de casting',
  },
  {
    id: 'es-alternate-001',
    name: 'Por Determinar',
    language: 'es',
    role: 'alternate',
    voiceProfile: {
      tone: 'Calmo, íntimo, claro',
      pace: 'Sin prisa, contemplativo',
      accent: 'Español',
    },
    contact: {
      email: 'tbd@example.com',
    },
    availability: [],
    hourlyRate: 350,
    storiesAssigned: [],
    contractSigned: false,
    notes: 'Narrador de respaldo para conflictos de agenda',
  },
];

// ============================================
// NARRATION RECORDINGS
// ============================================

/**
 * Placeholder for narration recordings
 * This will be populated as recordings are completed
 */
export const NARRATION_RECORDINGS: NarrationRecording[] = [
  // Example entry (to be replaced with actual recordings)
  // {
  //   id: 'narration-001',
  //   storyId: 'midnight-resonance',
  //   chapterId: 'midnight-ch1',
  //   language: 'en',
  //   narratorId: 'en-primary-001',
  //   filePath: '/media/narration/en/midnight-resonance/ch1.mp3',
  //   duration: 240,
  //   recordingSession: {
  //     date: '2026-03-15',
  //     sessionNumber: 1,
  //     location: 'Narrator home studio',
  //   },
  //   qaStatus: 'approved',
  //   qaChecks: {
  //     clarity: true,
  //     pacing: true,
  //     neutrality: true,
  //     technicalQuality: true,
  //     culturalSensitivity: true,
  //   },
  //   qaDate: '2026-03-16',
  //   qaReviewer: 'Audio Producer',
  //   isRetake: false,
  //   integratedDate: '2026-03-17',
  //   notes: 'Excellent first take, no retakes needed',
  // },
];

// ============================================
// PRODUCTION PIPELINE
// ============================================

export const ProductionPipeline = {
  /**
   * Phase 1: Narrator Assignment
   * Assign a narrator to a story/chapter
   */
  assignNarrator(storyId: string, narratorId: string): void {
    const narrator = NARRATORS.find(n => n.id === narratorId);
    if (narrator && !narrator.storiesAssigned.includes(storyId)) {
      narrator.storiesAssigned.push(storyId);
    }
  },

  /**
   * Phase 2: Schedule Recording
   * Create placeholder narration record with 'scheduled' status
   */
  scheduleRecording(
    storyId: string,
    chapterId: string,
    language: Language,
    narratorId: string,
    sessionDate: string
  ): string {
    const recordingId = `narration-${Date.now()}`;
    const newRecording: NarrationRecording = {
      id: recordingId,
      storyId,
      chapterId,
      language,
      narratorId,
      filePath: '', // To be filled after recording
      duration: 0,
      recordingSession: {
        date: sessionDate,
        sessionNumber: 1,
        location: 'TBD',
      },
      qaStatus: 'scheduled',
      qaChecks: {
        clarity: false,
        pacing: false,
        neutrality: false,
        technicalQuality: false,
        culturalSensitivity: false,
      },
      isRetake: false,
    };
    NARRATION_RECORDINGS.push(newRecording);
    return recordingId;
  },

  /**
   * Phase 3: Record Narration
   * Update recording with file path and duration after recording complete
   */
  recordNarration(
    recordingId: string,
    filePath: string,
    duration: number,
    location: string
  ): void {
    const recording = NARRATION_RECORDINGS.find(r => r.id === recordingId);
    if (recording) {
      recording.filePath = filePath;
      recording.duration = duration;
      recording.recordingSession.location = location;
      recording.qaStatus = 'recorded';
    }
  },

  /**
   * Phase 4: Quality Check
   * Conduct QA and update status
   */
  conductQA(
    recordingId: string,
    qaChecks: NarrationRecording['qaChecks'],
    reviewer: string,
    feedback?: string
  ): void {
    const recording = NARRATION_RECORDINGS.find(r => r.id === recordingId);
    if (recording) {
      recording.qaChecks = qaChecks;
      recording.qaDate = new Date().toISOString().split('T')[0];
      recording.qaReviewer = reviewer;
      recording.qaFeedback = feedback;
      
      // Determine if QA passed
      const allChecksPassed = Object.values(qaChecks).every(check => check === true);
      recording.qaStatus = allChecksPassed ? 'approved' : 'qa-failed';
    }
  },

  /**
   * Phase 5: Integration
   * Mark narration as integrated into platform
   */
  integrateNarration(recordingId: string): void {
    const recording = NARRATION_RECORDINGS.find(r => r.id === recordingId);
    if (recording && recording.qaStatus === 'approved') {
      recording.qaStatus = 'integrated';
      recording.integratedDate = new Date().toISOString().split('T')[0];
    }
  },

  /**
   * Publish narration (make live)
   */
  publishNarration(recordingId: string): void {
    const recording = NARRATION_RECORDINGS.find(r => r.id === recordingId);
    if (recording && recording.qaStatus === 'integrated') {
      recording.qaStatus = 'published';
      recording.publishedDate = new Date().toISOString().split('T')[0];
    }
  },

  /**
   * Schedule retake if QA fails
   */
  scheduleRetake(
    originalRecordingId: string,
    retakeReason: string,
    sessionDate: string
  ): string {
    const original = NARRATION_RECORDINGS.find(r => r.id === originalRecordingId);
    if (!original) return '';

    const retakeId = `narration-retake-${Date.now()}`;
    const retake: NarrationRecording = {
      ...original,
      id: retakeId,
      recordingSession: {
        date: sessionDate,
        sessionNumber: original.recordingSession.sessionNumber + 1,
        location: original.recordingSession.location,
      },
      qaStatus: 'scheduled',
      qaChecks: {
        clarity: false,
        pacing: false,
        neutrality: false,
        technicalQuality: false,
        culturalSensitivity: false,
      },
      isRetake: true,
      originalRecordingId: originalRecordingId,
      retakeReason,
      filePath: '',
      duration: 0,
    };
    NARRATION_RECORDINGS.push(retake);
    return retakeId;
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get narration recording by chapter
 */
export function getNarrationByChapter(
  storyId: string,
  chapterId: string,
  language: Language
): NarrationRecording | undefined {
  return NARRATION_RECORDINGS.find(
    r => r.storyId === storyId && 
         r.chapterId === chapterId && 
         r.language === language &&
         r.qaStatus === 'published'
  );
}

/**
 * Get all narrations for a story
 */
export function getNarrationsByStory(
  storyId: string,
  language: Language
): NarrationRecording[] {
  return NARRATION_RECORDINGS.filter(
    r => r.storyId === storyId && 
         r.language === language &&
         r.qaStatus === 'published'
  );
}

/**
 * Get narrations by narrator
 */
export function getNarrationsByNarrator(narratorId: string): NarrationRecording[] {
  return NARRATION_RECORDINGS.filter(r => r.narratorId === narratorId);
}

/**
 * Get narrations by status
 */
export function getNarrationsByStatus(status: NarrationStatus): NarrationRecording[] {
  return NARRATION_RECORDINGS.filter(r => r.qaStatus === status);
}

/**
 * Get narrator by ID
 */
export function getNarratorById(narratorId: string): Narrator | undefined {
  return NARRATORS.find(n => n.id === narratorId);
}

/**
 * Get primary narrator for language
 */
export function getPrimaryNarrator(language: Language): Narrator | undefined {
  return NARRATORS.find(n => n.language === language && n.role === 'primary');
}

/**
 * Get alternate narrator for language
 */
export function getAlternateNarrator(language: Language): Narrator | undefined {
  return NARRATORS.find(n => n.language === language && n.role === 'alternate');
}

/**
 * Calculate total recording hours by narrator
 */
export function getTotalRecordingHours(narratorId: string): number {
  const recordings = getNarrationsByNarrator(narratorId);
  const totalSeconds = recordings.reduce((sum, r) => sum + r.duration, 0);
  return totalSeconds / 3600; // Convert to hours
}

/**
 * Calculate total production cost by narrator
 */
export function getTotalProductionCost(narratorId: string): number {
  const narrator = getNarratorById(narratorId);
  if (!narrator) return 0;
  
  const hours = getTotalRecordingHours(narratorId);
  return hours * narrator.hourlyRate;
}

/**
 * Generate completion report
 */
export function generateCompletionReport(): {
  total: number;
  byStatus: Record<NarrationStatus, number>;
  byLanguage: Record<Language, number>;
  published: number;
  percentComplete: number;
} {
  const total = NARRATION_RECORDINGS.length;
  const published = NARRATION_RECORDINGS.filter(r => r.qaStatus === 'published').length;
  
  const byStatus: Record<NarrationStatus, number> = {
    'unrecorded': 0,
    'scheduled': 0,
    'in-progress': 0,
    'recorded': 0,
    'qa-pending': 0,
    'qa-failed': 0,
    'approved': 0,
    'integrated': 0,
    'published': 0,
  };
  
  const byLanguage: Record<Language, number> = {
    'en': 0,
    'fr': 0,
    'es': 0,
  };
  
  NARRATION_RECORDINGS.forEach(r => {
    byStatus[r.qaStatus]++;
    byLanguage[r.language]++;
  });
  
  return {
    total,
    byStatus,
    byLanguage,
    published,
    percentComplete: total > 0 ? (published / total) * 100 : 0,
  };
}

// ============================================
// FALLBACK HANDLING
// ============================================

/**
 * Check if narration exists for a chapter
 * If missing, log and return false (chapter remains text-accessible)
 */
export function hasNarration(
  storyId: string,
  chapterId: string,
  language: Language
): boolean {
  const narration = getNarrationByChapter(storyId, chapterId, language);
  
  if (!narration) {
    console.warn(`Missing narration: ${storyId}/${chapterId}/${language}`);
    return false;
  }
  
  return true;
}

/**
 * Get missing narrations report
 */
export function getMissingNarrations(): Array<{
  storyId: string;
  chapterId: string;
  language: Language;
}> {
  // This would cross-reference with storyDatabase.ts to find all chapters
  // For now, returns empty array (to be implemented with actual story data)
  return [];
}

// ============================================
// AUDIO PLAYBACK INTEGRATION
// ============================================

export const NarrationPlayback = {
  /**
   * Get narration URL for playback
   */
  getNarrationUrl(
    storyId: string,
    chapterId: string,
    language: Language
  ): string | null {
    const narration = getNarrationByChapter(storyId, chapterId, language);
    return narration ? narration.filePath : null;
  },

  /**
   * Resume playback from last position
   * (Position stored in local storage via audioPlayerState)
   */
  getResumePosition(chapterId: string): number {
    const key = `narration-position-${chapterId}`;
    const stored = localStorage.getItem(key);
    return stored ? parseFloat(stored) : 0;
  },

  /**
   * Save playback position
   */
  savePosition(chapterId: string, position: number): void {
    const key = `narration-position-${chapterId}`;
    localStorage.setItem(key, position.toString());
  },

  /**
   * Clear saved position (when chapter completes)
   */
  clearPosition(chapterId: string): void {
    const key = `narration-position-${chapterId}`;
    localStorage.removeItem(key);
  },
};
