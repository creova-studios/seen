/**
 * COMMUNITY CONTRIBUTION SCHEMA
 * SEEN by CREOVA — Care-Based, Moderated Participation
 * 
 * Enables respectful community participation without social platform mechanics
 * No public profiles, no follower counts, no virality metrics
 */

import type { Language, MultilingualText } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ContributionType = 
  | 'written-reflection'   // Text-based response
  | 'audio-reflection'     // Short audio recording
  | 'contextual-image';    // Image with cultural context

export type ContributionStatus = 
  | 'draft'           // Contributor still editing
  | 'submitted'       // Submitted for moderation
  | 'pending'         // Under review
  | 'approved'        // Approved and visible
  | 'returned'        // Returned to contributor for revision
  | 'declined';       // Declined (not published)

export type ModerationDecision = 
  | 'approve'
  | 'return-for-revision'
  | 'decline';

export interface Contributor {
  id: string; // Anonymous ID, not tied to identity
  
  /** Display name (optional, can be "Anonymous") */
  displayName: string;
  
  /** Language preference */
  language: Language;
  
  /** Contribution count (for internal tracking only, not displayed) */
  contributionCount: number;
  
  /** Account created date */
  createdDate: string;
  
  /** No public profile, no followers, no social mechanics */
}

export interface Contribution {
  id: string;
  
  /** Contributor (anonymous ID) */
  contributorId: string;
  
  /** Chapter this contribution responds to */
  storyId: string;
  chapterId: string;
  
  /** Type of contribution */
  type: ContributionType;
  
  /** Language of contribution */
  language: Language;
  
  /** Content (varies by type) */
  content: {
    // For written reflections
    text?: string;
    
    // For audio reflections
    audioFilePath?: string;
    audioDuration?: number; // in seconds, max 3 minutes
    audioTranscript?: string; // Required for accessibility
    
    // For contextual images
    imageFilePath?: string;
    imageCaption?: string;
    imageCulturalContext?: string;
  };
  
  /** Submission metadata */
  submittedDate: string;
  
  /** Moderation */
  status: ContributionStatus;
  moderationHistory: ModerationRecord[];
  
  /** Visibility */
  approvedDate?: string;
  publishedDate?: string;
  
  /** Optional: Creator (story author) can view responses */
  creatorViewed: boolean;
  
  /** Optional: Display as featured community voice */
  featured: boolean;
}

export interface ModerationRecord {
  id: string;
  contributionId: string;
  
  /** Moderator (anonymous ID) */
  moderatorId: string;
  
  /** Decision */
  decision: ModerationDecision;
  
  /** Reason/feedback (if returned or declined) */
  feedback?: string;
  
  /** Cultural guidelines applied */
  guidelinesApplied: string[]; // e.g., ['respectful-language', 'no-hate-speech']
  
  /** Date of moderation */
  moderatedDate: string;
  
  /** Time spent reviewing (for workload tracking) */
  reviewDuration?: number; // in minutes
}

export interface ModerationGuidelines {
  category: string;
  criteria: {
    required: string[]; // Must meet all
    avoid: string[];    // Must not contain any
  };
  examples: {
    approved: string[];
    returned: string[];
    declined: string[];
  };
}

// ============================================
// CONTRIBUTION RULES
// ============================================

export const ContributionRules = {
  /** Text reflection limits */
  writtenReflection: {
    minLength: 50,     // characters
    maxLength: 1000,   // characters
    allowFormatting: false, // Plain text only
  },
  
  /** Audio reflection limits */
  audioReflection: {
    maxDuration: 180,  // 3 minutes
    requireTranscript: true,
    allowedFormats: ['mp3', 'wav', 'flac'],
  },
  
  /** Image upload limits */
  contextualImage: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['jpg', 'jpeg', 'png'],
    requireCaption: true,
    requireContext: true, // Must explain cultural relevance
  },
  
  /** Chapter-specific contributions */
  chapterSpecific: true, // Contributions tied to specific chapters
  
  /** No cross-posting */
  noCrossPosting: true, // Can't contribute same content to multiple chapters
  
  /** Rate limiting */
  rateLimit: {
    maxPerDay: 3,
    maxPerChapter: 1,
  },
};

// ============================================
// MODERATION GUIDELINES
// ============================================

export const MODERATION_GUIDELINES: ModerationGuidelines[] = [
  {
    category: 'Respectful Language',
    criteria: {
      required: [
        'Uses respectful, non-harmful language',
        'Relates to the story/chapter content',
        'Shares personal reflection or cultural context',
      ],
      avoid: [
        'Hate speech or slurs',
        'Personal attacks',
        'Spam or promotional content',
        'Off-topic content',
      ],
    },
    examples: {
      approved: [
        '"This story reminds me of my grandmother\'s journey from Lebanon. The description of winter resonates deeply."',
        '"As a second-generation immigrant, the tension between two worlds is something I live daily."',
      ],
      returned: [
        '"I love this!" (Too brief, no reflection)',
        '"This is interesting." (Lacks personal connection or cultural insight)',
      ],
      declined: [
        '"This is stupid." (Disrespectful)',
        '"Check out my podcast!" (Promotional spam)',
      ],
    },
  },
  {
    category: 'Cultural Sensitivity',
    criteria: {
      required: [
        'Respects cultural communities represented',
        'Avoids stereotypes or generalizations',
        'Acknowledges complexity and nuance',
      ],
      avoid: [
        'Cultural appropriation',
        'Exoticization',
        'Tokenism',
        'Flattening of diverse experiences',
      ],
    },
    examples: {
      approved: [
        '"This captures the complexity of maintaining cultural identity while adapting to a new country."',
        '"The story honors the sacrifice without romanticizing the struggle."',
      ],
      returned: [
        '"All immigrants face the same challenges." (Overgeneralization, needs nuance)',
      ],
      declined: [
        '"Immigrants should just assimilate." (Harmful, dismissive)',
      ],
    },
  },
  {
    category: 'Personal Reflection',
    criteria: {
      required: [
        'Shares personal experience or insight',
        'Connects to story themes',
        'Adds value to community conversation',
      ],
      avoid: [
        'Generic comments',
        'Oversharing (TMI)',
        'Trauma dumping without context',
        'Demands for emotional labor',
      ],
    },
    examples: {
      approved: [
        '"My father also worked two jobs to send money home. This story validates that sacrifice."',
        '"The part about silence in families hit hard — I\'m still learning to name what was unspoken."',
      ],
      returned: [
        '"Nice story." (Not a reflection, too brief)',
        '"Here is my entire trauma history..." (Needs context and relevance)',
      ],
      declined: [
        '"You need to tell MY story next." (Demanding, not reflective)',
      ],
    },
  },
  {
    category: 'Accessibility',
    criteria: {
      required: [
        'Includes transcripts for audio',
        'Includes captions/context for images',
        'Uses clear, accessible language',
      ],
      avoid: [
        'Audio without transcript',
        'Images without description',
        'Inaccessible formatting',
      ],
    },
    examples: {
      approved: [
        'Audio reflection with full transcript provided',
        'Image with descriptive caption and cultural context',
      ],
      returned: [
        'Audio reflection without transcript (needs accessibility)',
        'Image with no caption (needs description)',
      ],
      declined: [
        'Refuses to provide accessibility features (violation)',
      ],
    },
  },
];

// ============================================
// MODERATION FLOW
// ============================================

export const ModerationFlow = {
  /**
   * Step 1: Contributor submits
   */
  submit(contribution: Contribution): void {
    contribution.status = 'submitted';
    contribution.submittedDate = new Date().toISOString();
  },

  /**
   * Step 2: Moderation queue assigns to moderator
   */
  assignToModerator(contributionId: string, moderatorId: string): void {
    const contribution = CONTRIBUTIONS.find(c => c.id === contributionId);
    if (contribution) {
      contribution.status = 'pending';
    }
  },

  /**
   * Step 3: Moderator reviews and makes decision
   */
  moderate(
    contributionId: string,
    moderatorId: string,
    decision: ModerationDecision,
    feedback?: string,
    guidelinesApplied: string[] = []
  ): void {
    const contribution = CONTRIBUTIONS.find(c => c.id === contributionId);
    if (!contribution) return;

    const record: ModerationRecord = {
      id: `moderation-${Date.now()}`,
      contributionId,
      moderatorId,
      decision,
      feedback,
      guidelinesApplied,
      moderatedDate: new Date().toISOString(),
    };

    contribution.moderationHistory.push(record);

    // Update contribution status
    switch (decision) {
      case 'approve':
        contribution.status = 'approved';
        contribution.approvedDate = new Date().toISOString();
        contribution.publishedDate = new Date().toISOString();
        break;
      case 'return-for-revision':
        contribution.status = 'returned';
        break;
      case 'decline':
        contribution.status = 'declined';
        break;
    }
  },

  /**
   * Step 4: If returned, contributor can revise and resubmit
   */
  resubmit(contributionId: string, revisedContent: Contribution['content']): void {
    const contribution = CONTRIBUTIONS.find(c => c.id === contributionId);
    if (contribution && contribution.status === 'returned') {
      contribution.content = revisedContent;
      contribution.status = 'submitted';
      contribution.submittedDate = new Date().toISOString();
    }
  },
};

// ============================================
// VISIBILITY RULES
// ============================================

export const VisibilityRules = {
  /**
   * Only approved contributions are visible to public
   */
  isVisible(contribution: Contribution): boolean {
    return contribution.status === 'approved';
  },

  /**
   * Creator (story author) can view responses to their story
   */
  canCreatorView(contribution: Contribution, creatorId: string): boolean {
    // Would check if creator owns the story
    // For now, returns true if approved
    return contribution.status === 'approved';
  },

  /**
   * Contributor can see status of their own contributions
   */
  contributorCanSee(contribution: Contribution, contributorId: string): boolean {
    return contribution.contributorId === contributorId;
  },

  /**
   * Get status message for contributor
   */
  getStatusMessage(contribution: Contribution): MultilingualText {
    switch (contribution.status) {
      case 'draft':
        return {
          en: 'Draft — not yet submitted',
          fr: 'Brouillon — pas encore soumis',
          es: 'Borrador — aún no enviado',
        };
      case 'submitted':
      case 'pending':
        return {
          en: 'Under review — we\'ll notify you when moderation is complete',
          fr: 'En révision — nous vous informerons lorsque la modération sera terminée',
          es: 'En revisión — te notificaremos cuando se complete la moderación',
        };
      case 'approved':
        return {
          en: 'Approved and published — thank you for contributing',
          fr: 'Approuvé et publié — merci de votre contribution',
          es: 'Aprobado y publicado — gracias por contribuir',
        };
      case 'returned':
        return {
          en: 'Returned for revision — please see moderator feedback',
          fr: 'Retourné pour révision — veuillez consulter les commentaires du modérateur',
          es: 'Devuelto para revisión — consulta los comentarios del moderador',
        };
      case 'declined':
        return {
          en: 'Not approved — does not meet community guidelines',
          fr: 'Non approuvé — ne respecte pas les directives communautaires',
          es: 'No aprobado — no cumple con las pautas de la comunidad',
        };
      default:
        return {
          en: 'Status unknown',
          fr: 'Statut inconnu',
          es: 'Estado desconocido',
        };
    }
  },
};

// ============================================
// DATA STORAGE
// ============================================

/**
 * In-memory storage (would be database in production)
 */
export const CONTRIBUTIONS: Contribution[] = [];
export const CONTRIBUTORS: Contributor[] = [];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get contributions by chapter (approved only)
 */
export function getContributionsByChapter(
  storyId: string,
  chapterId: string
): Contribution[] {
  return CONTRIBUTIONS.filter(
    c => c.storyId === storyId && 
         c.chapterId === chapterId && 
         c.status === 'approved'
  );
}

/**
 * Get contributions by contributor (all statuses)
 */
export function getContributionsByContributor(contributorId: string): Contribution[] {
  return CONTRIBUTIONS.filter(c => c.contributorId === contributorId);
}

/**
 * Get contributions pending moderation
 */
export function getPendingContributions(): Contribution[] {
  return CONTRIBUTIONS.filter(c => c.status === 'pending' || c.status === 'submitted');
}

/**
 * Get featured contributions (for homepage or discovery)
 */
export function getFeaturedContributions(): Contribution[] {
  return CONTRIBUTIONS.filter(c => c.featured && c.status === 'approved');
}

/**
 * Generate moderation report
 */
export function generateModerationReport(): {
  total: number;
  byStatus: Record<ContributionStatus, number>;
  byType: Record<ContributionType, number>;
  averageReviewTime: number;
  approvalRate: number;
} {
  const total = CONTRIBUTIONS.length;
  
  const byStatus: Record<ContributionStatus, number> = {
    'draft': 0,
    'submitted': 0,
    'pending': 0,
    'approved': 0,
    'returned': 0,
    'declined': 0,
  };
  
  const byType: Record<ContributionType, number> = {
    'written-reflection': 0,
    'audio-reflection': 0,
    'contextual-image': 0,
  };
  
  let totalReviewTime = 0;
  let reviewCount = 0;
  let approvedCount = 0;
  
  CONTRIBUTIONS.forEach(c => {
    byStatus[c.status]++;
    byType[c.type]++;
    
    if (c.status === 'approved') approvedCount++;
    
    c.moderationHistory.forEach(m => {
      if (m.reviewDuration) {
        totalReviewTime += m.reviewDuration;
        reviewCount++;
      }
    });
  });
  
  return {
    total,
    byStatus,
    byType,
    averageReviewTime: reviewCount > 0 ? totalReviewTime / reviewCount : 0,
    approvalRate: total > 0 ? (approvedCount / total) * 100 : 0,
  };
}

// ============================================
// AUDIT TRAIL
// ============================================

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  contributionId?: string;
  contributorId?: string;
  moderatorId?: string;
  details: Record<string, any>;
}

export const AUDIT_LOGS: AuditLog[] = [];

/**
 * Log moderation action for transparency
 */
export function logModerationAction(
  action: string,
  contributionId: string,
  moderatorId: string,
  details: Record<string, any> = {}
): void {
  const log: AuditLog = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    contributionId,
    moderatorId,
    details,
  };
  AUDIT_LOGS.push(log);
}

/**
 * Get audit trail for a contribution
 */
export function getContributionAuditTrail(contributionId: string): AuditLog[] {
  return AUDIT_LOGS.filter(log => log.contributionId === contributionId);
}
