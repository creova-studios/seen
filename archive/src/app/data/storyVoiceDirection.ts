/**
 * STORY-SPECIFIC VOICE DIRECTION
 * SEEN by CREOVA
 * 
 * Creative cues for each Story World to maintain consistency
 * while honoring each story's unique emotional intent.
 * 
 * USE WITH: /src/app/data/narrationGuidelines.ts (global direction)
 */

export interface StoryVoiceDirection {
  storyWorldId: string;
  storyName: string;
  emotionalRegister: string;
  energy: string;
  mood: string;
  direction: string;
  additionalNotes?: string;
}

// ============================================
// STORY-SPECIFIC VOICE DIRECTIONS
// ============================================

export const STORY_VOICE_DIRECTIONS: StoryVoiceDirection[] = [
  {
    storyWorldId: 'midnight-resonance',
    storyName: 'Midnight Cities',
    emotionalRegister: 'Quiet observation',
    energy: 'Low, steady',
    mood: 'Nighttime, reflective',
    direction: 'You are walking through the city after midnight, noticing what others pass by.',
    additionalNotes: 'Jazz/music context requires musical sensitivity. Avoid over-poeticizing.',
  },

  {
    storyWorldId: 'soft-power',
    storyName: 'Soft Power',
    emotionalRegister: 'Thoughtful, composed',
    energy: 'Measured',
    mood: 'Analytical but human',
    direction: 'You are explaining something important without trying to convince anyone.',
    additionalNotes: 'Cultural influence themes. Balance educational content with emotional truth.',
  },

  {
    storyWorldId: 'letters-never-sent',
    storyName: 'Letters Never Sent',
    emotionalRegister: 'Intimate',
    energy: 'Gentle',
    mood: 'Private, restrained',
    direction: 'You are reading words meant for someone who may never hear them.',
    additionalNotes: 'Epistolary format. Warmth without sentimentality. Conversational, not performed.',
  },

  {
    storyWorldId: 'the-first-generation',
    storyName: 'The First Generation',
    emotionalRegister: 'Earnest',
    energy: 'Moderate',
    mood: 'Weight carried quietly',
    direction: 'You are remembering moments that shaped you before you understood them.',
    additionalNotes: 'Immigration pressure themes. Honor sacrifice without dramatizing.',
  },

  {
    storyWorldId: 'black-atlantic-canada',
    storyName: 'Black Atlantic (Canada)',
    emotionalRegister: 'Grounded, respectful',
    energy: 'Steady',
    mood: 'Historical continuity',
    direction: 'You are carrying history forward, not lecturing about it.',
    additionalNotes: 'Caribbean/African names require pronunciation accuracy. Gravitas without drama.',
  },

  {
    storyWorldId: 'work-worth',
    storyName: 'Work / Worth',
    emotionalRegister: 'Direct',
    energy: 'Controlled',
    mood: 'Honest',
    direction: 'You are stating truths without asking for sympathy.',
    additionalNotes: 'Sharp, concise chapters. Avoid softening the edge. Directness is the message.',
  },

  {
    storyWorldId: 'home-no-fixed-address',
    storyName: 'Home Is a Practice',
    emotionalRegister: 'Gentle curiosity',
    energy: 'Soft',
    mood: 'Searching',
    direction: 'You are thinking aloud, not arriving at answers.',
    additionalNotes: 'Reflective exploration of belonging. Questions without urgent answers.',
  },

  {
    storyWorldId: 'small-histories',
    storyName: 'Archive of the Ordinary',
    emotionalRegister: 'Attentive',
    energy: 'Minimal',
    mood: 'Observational',
    direction: 'You are honoring moments others might overlook.',
    additionalNotes: 'Vignette structure. Each moment deserves quiet attention.',
  },

  {
    storyWorldId: 'what-we-carry',
    storyName: 'What We Inherit',
    emotionalRegister: 'Reflective',
    energy: 'Slow',
    mood: 'Intergenerational',
    direction: 'You are speaking across time, not to an audience.',
    additionalNotes: 'Intergenerational trauma/memory. Allow space for silence and weight.',
  },

  {
    storyWorldId: 'seen-unseen',
    storyName: 'Seen / Unseen',
    emotionalRegister: 'Clear, intentional',
    energy: 'Focused',
    mood: 'Minimalist',
    direction: 'Every word matters. Nothing is rushed.',
    additionalNotes: 'Onboarding priority. Accessibility-first. Precision over poetry.',
  },
];

// ============================================
// ADDITIONAL STORY WORLDS (NEED DIRECTION)
// ============================================

/**
 * Story Worlds in database that need voice direction assignment
 */
export const STORIES_NEEDING_DIRECTION = [
  {
    storyWorldId: 'voices-of-migration',
    storyName: 'Voices of Migration',
    suggestedDirection: {
      emotionalRegister: 'Documentary realism',
      energy: 'Moderate',
      mood: 'Oral history',
      direction: 'You are witnessing testimony, not performing it.',
      additionalNotes: 'Institutional partnership. Balance archival tone with human warmth.',
    },
  },
  {
    storyWorldId: 'indigenous-languages',
    storyName: 'Words That Remember',
    suggestedDirection: {
      emotionalRegister: 'Respectful, careful',
      energy: 'Deliberate',
      mood: 'Cultural preservation',
      direction: 'You are handling something precious that was almost lost.',
      additionalNotes: 'CRITICAL: Indigenous language pronunciation requires review. NFB partnership.',
    },
  },
] as const;

// ============================================
// MULTILINGUAL RECORDING REQUIREMENTS
// ============================================

export const MULTILINGUAL_RECORDING_RULES = {
  critical: [
    'Each language recording must feel native',
    'DO NOT mimic English cadence in French or Spanish',
    'DO NOT translate tone literally',
  ],

  requirements: [
    'Adjust rhythm to language norms',
    'Preserve emotional intent',
    'Maintain calm pacing across all languages',
  ],

  narratorFlexibility: {
    allowed: 'Different narrators per language if needed',
    priority: 'Keep tone consistency, not voice matching',
    rationale: 'Cultural authenticity > voice uniformity',
  },
} as const;

// ============================================
// QUALITY CONTROL CHECKLIST
// ============================================

export const POST_RECORDING_CHECKLIST = [
  // Technical Quality
  '✓ No clipping',
  '✓ No room echo',
  '✓ Clean studio sound',
  
  // Performance Quality
  '✓ No dramatic emphasis',
  '✓ Consistent pacing',
  '✓ Emotion restrained and intentional',
  
  // Content Accuracy
  '✓ Correct file naming (StoryWorld_Chapter_Language.wav)',
  '✓ Language matches script',
  '✓ Cultural terms pronounced accurately',
  
  // Story-Specific
  '✓ Emotional register matches story direction',
  '✓ Energy level appropriate to story',
  '✓ Direction embodied (not performed)',
] as const;

// ============================================
// CMF PRODUCTION STANDARDS COMPLIANCE
// ============================================

export const CMF_COMPLIANCE_MARKERS = {
  professionalProduction: [
    'Studio-quality recording',
    'Consistent technical specs across all episodes',
    'No amateur recording artifacts',
  ],

  accessibilityAwareness: [
    'Clear articulation at all playback speeds',
    'No reliance on vocal performance tricks',
    'Intelligible to non-native speakers',
  ],

  culturalRespect: [
    'Pronunciation review for cultural terms',
    'Language-specific rhythm adjustments',
    'No appropriation of cultural vocal styles',
  ],

  institutionalReadiness: [
    'Scalable production workflow',
    'Documented quality standards',
    'Archival-quality audio files',
  ],

  contentIntegrity: [
    'Audio designed as content, not decoration',
    'Narration serves story, not brand',
    'Educational value maintained in delivery',
  ],
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get voice direction for a specific Story World
 */
export function getStoryVoiceDirection(storyWorldId: string): StoryVoiceDirection | undefined {
  return STORY_VOICE_DIRECTIONS.find((d) => d.storyWorldId === storyWorldId);
}

/**
 * Get all low-energy stories (for narrator casting)
 */
export function getLowEnergyStories(): StoryVoiceDirection[] {
  const lowEnergyKeywords = ['low', 'minimal', 'soft', 'slow', 'gentle'];
  return STORY_VOICE_DIRECTIONS.filter((d) =>
    lowEnergyKeywords.some((keyword) => d.energy.toLowerCase().includes(keyword))
  );
}

/**
 * Get all intimate/reflective stories (for narrator casting)
 */
export function getIntimateStories(): StoryVoiceDirection[] {
  const intimateKeywords = ['intimate', 'reflective', 'private', 'gentle', 'searching'];
  return STORY_VOICE_DIRECTIONS.filter((d) =>
    intimateKeywords.some((keyword) =>
      d.emotionalRegister.toLowerCase().includes(keyword) ||
      d.mood.toLowerCase().includes(keyword)
    )
  );
}

/**
 * Validate that a Story World has voice direction assigned
 */
export function hasVoiceDirection(storyWorldId: string): boolean {
  return STORY_VOICE_DIRECTIONS.some((d) => d.storyWorldId === storyWorldId);
}

/**
 * Get stories grouped by energy level for production planning
 */
export function getStoriesByEnergyLevel(): {
  low: StoryVoiceDirection[];
  moderate: StoryVoiceDirection[];
} {
  return {
    low: STORY_VOICE_DIRECTIONS.filter((d) =>
      ['low', 'minimal', 'soft', 'gentle', 'slow'].some((keyword) =>
        d.energy.toLowerCase().includes(keyword)
      )
    ),
    moderate: STORY_VOICE_DIRECTIONS.filter((d) =>
      ['moderate', 'measured', 'controlled', 'steady', 'focused'].some((keyword) =>
        d.energy.toLowerCase().includes(keyword)
      )
    ),
  };
}
