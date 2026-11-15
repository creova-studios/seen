/**
 * NARRATION GUIDELINES
 * SEEN by CREOVA
 * 
 * Global voice direction for all audio narration scripts.
 * This is cultural narration — not advertising, not performance, not podcast.
 * 
 * TONE: Calm, grounded, reflective, emotionally restrained
 * DELIVERY: Gender-neutral, neutral accent, natural pacing
 * FEEL: "Someone telling you something important, quietly."
 */

export const NARRATION_GUIDELINES = {
  // ============================================
  // VOICE CHARACTERISTICS
  // ============================================
  voice: {
    gender: 'neutral preferred',
    accent: 'neutral (Canadian-friendly)',
    articulation: 'clear',
    warmth: 'warm but not sentimental',
    authority: 'confident without being authoritative',
  },

  // ============================================
  // TONE REQUIREMENTS
  // ============================================
  tone: {
    primary: ['calm', 'grounded', 'reflective', 'human'],
    restraint: 'emotionally restrained',
    avoid: ['dramatic', 'theatrical', 'performative'],
    description: 'Someone telling you something important, quietly.',
  },

  // ============================================
  // PACING & RHYTHM
  // ============================================
  pacing: {
    speed: 'slow to moderate',
    breathing: 'natural, allow space between thoughts',
    rhythm: 'meaning emerges through rhythm, not volume',
    rule: 'Do NOT rush',
  },

  // ============================================
  // TECHNICAL SPECIFICATIONS
  // ============================================
  technical: {
    format: 'WAV',
    sampleRate: ['44.1kHz', '48kHz'],
    channels: 'Mono',
    quality: 'Clean studio recording, no background noise',
    compression: 'No compression baked in',
    fileNaming: 'StoryWorld_Chapter_Language.wav',
    example: 'MidnightResonance_Chapter1_EN.wav',
  },

  // ============================================
  // CONTENT RULES
  // ============================================
  content: {
    fidelity: 'Read script exactly as provided',
    paraphrase: 'Do not paraphrase',
    emphasis: 'No added emphasis beyond natural speech',
    culturalNames: 'Pronounce carefully, flag if unsure',
    review: 'Flag pronunciation questions for review',
  },

  // ============================================
  // ACCESSIBILITY
  // ============================================
  accessibility: {
    intelligibility: 'Must remain clear at lower playback speeds',
    avoid: ['slurring', 'whispering', 'vocal fry'],
  },

  // ============================================
  // ANTI-PATTERNS
  // ============================================
  avoid: {
    tones: [
      'Radio announcer',
      'Podcast host',
      'Audiobook narrator (theatrical)',
      'Meditation app (too soft)',
      'NPR documentary (too formal)',
    ],
    techniques: [
      'Overacting',
      'Vocal fry',
      'Excessive emotion',
      'Performative pauses',
      'Character voices',
    ],
  },
} as const;

// ============================================
// PRONUNCIATION GUIDANCE
// ============================================

/**
 * Terms requiring pronunciation review before recording
 */
export const PRONUNCIATION_REVIEW_REQUIRED = {
  // Indigenous Language Story
  indigenous: [
    'Indigenous language names (to be provided)',
    'Elder names',
    'Community names',
  ],

  // Black Atlantic Story
  blackAtlantic: [
    'Africville',
    'Nollywood',
    'Caribbean place names',
    'African diaspora terms',
  ],

  // General Cultural Terms
  general: [
    'patois',
    'K-pop',
    'dashiki',
    'shalwar kameez',
    'nakama',
  ],
} as const;

// ============================================
// DURATION GUIDELINES
// ============================================

/**
 * Target durations for audio scripts
 */
export const DURATION_GUIDELINES = {
  short: {
    range: '2-3 minutes',
    wordCount: '300-450 words',
    use: 'Short reflections, vignettes',
  },
  standard: {
    range: '3-4 minutes',
    wordCount: '450-600 words',
    use: 'Standard chapters',
  },
  extended: {
    range: '4-6 minutes',
    wordCount: '600-900 words',
    use: 'Documentary content, deep narrative',
  },
} as const;

// ============================================
// QUALITY CHECKLIST
// ============================================

/**
 * Pre-production checklist for narration
 */
export const NARRATION_CHECKLIST = [
  'Script reviewed for pronunciation questions',
  'Cultural terms verified',
  'Natural breathing points identified',
  'No dramatic emphasis added',
  'Pacing marked (if needed)',
  'Technical specs confirmed (WAV, Mono, 44.1/48kHz)',
  'File naming convention applied',
  'Accessibility compliance (clear at slow speeds)',
] as const;

// ============================================
// REFERENCE EXAMPLES
// ============================================

/**
 * Example scripts that embody SEEN voice
 */
export const REFERENCE_EXAMPLES = {
  goodExample: `Power isn't always loud.

Sometimes it's a song. A K-pop track that makes teenagers in Montreal move exactly like teenagers in Seoul.

This is soft power.`,

  avoidExample: `POWER... [dramatic pause] ...isn't ALWAYS loud! [theatrical emphasis]

Sometimes... [whispered] ...it's a song...`,

  rationale:
    'Good example uses natural pacing and line breaks for breath. Avoid example adds performative drama that conflicts with SEEN voice.',
} as const;
