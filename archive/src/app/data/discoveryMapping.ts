/**
 * DISCOVERY SURFACE MAPPING
 * SEEN by CREOVA
 * 
 * Maps Story Worlds to discovery surfaces (For You / Explore)
 * without modifying UI/UX.
 * 
 * RULES:
 * - For You: Emotionally immersive, high completion likelihood
 * - Explore: Thematic depth, educational, institutional relevance
 * - A story may appear in both surfaces
 * - Library visibility is user-driven
 * - Profile NEVER shows story content
 */

export type DiscoverySurface = 'for-you' | 'explore';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface DiscoveryMapping {
  storyWorldId: string;
  surfaces: DiscoverySurface[];
  priorityLevel: PriorityLevel;
  rationale: string;
  onboardingPriority?: boolean;
}

// ============================================
// DISCOVERY SURFACE MAPPINGS
// ============================================

export const DISCOVERY_MAPPINGS: DiscoveryMapping[] = [
  // ============================================
  // HIGH PRIORITY — FOR YOU
  // ============================================
  
  {
    storyWorldId: 'seen-unseen',
    surfaces: ['for-you'],
    priorityLevel: 'high',
    onboardingPriority: true,
    rationale: 'Minimalist, accessible, emotionally immediate. Ideal first-time user experience. 4 chapters, 15min duration perfect for mobile-first engagement. Introduces SEEN\'s mission (visibility/erasure) without heavy context requirements.',
  },

  {
    storyWorldId: 'midnight-resonance',
    surfaces: ['for-you'],
    priorityLevel: 'high',
    rationale: 'Cinematic narrative structure with audio/music integration showcases platform\'s multimedia capabilities. Strong emotional arc, urban cultural themes, approachable 45min duration. High completion likelihood for music/culture enthusiasts.',
  },

  {
    storyWorldId: 'soft-power',
    surfaces: ['for-you'],
    priorityLevel: 'high',
    rationale: 'Contemporary, relevant themes (cultural influence, identity) with clear narrative pacing. 18min duration ideal for mobile consumption. Resonates with diaspora youth navigating cultural identity in Canada.',
  },

  {
    storyWorldId: 'letters-never-sent',
    surfaces: ['for-you'],
    priorityLevel: 'high',
    rationale: 'Intimate, emotionally resonant format (letters) creates strong viewer connection. Migration/family silence themes have universal appeal. 20min duration supports single-session completion.',
  },

  {
    storyWorldId: 'home-no-fixed-address',
    surfaces: ['for-you'],
    priorityLevel: 'medium',
    rationale: 'Reflective exploration of belonging with broad diaspora appeal. 20min duration, accessible themes. Strong For You candidate for users interested in migration/identity narratives.',
  },

  // ============================================
  // HIGH PRIORITY — EXPLORE
  // ============================================

  {
    storyWorldId: 'voices-of-migration',
    surfaces: ['explore'],
    priorityLevel: 'high',
    rationale: 'Institutional partnership (Canadian Museum of Immigration) provides educational/archival value. Documentary format, oral history methodology. 60min duration indicates thematic depth suitable for Explore\'s reflective engagement model.',
  },

  {
    storyWorldId: 'indigenous-languages',
    surfaces: ['explore'],
    priorityLevel: 'high',
    rationale: 'Critical Indigenous knowledge content with National Film Board partnership. Educational focus on language revitalization. 52min duration, historical context cards. Essential for institutional/educational users.',
  },

  {
    storyWorldId: 'black-atlantic-canada',
    surfaces: ['explore'],
    priorityLevel: 'high',
    rationale: 'Comprehensive exploration of Black Canadian diaspora with historical depth. 30min duration, 6 chapters with context cards. Scholarly approach to Black Atlantic theory makes it ideal for Explore\'s thematic discovery.',
  },

  {
    storyWorldId: 'what-we-carry',
    surfaces: ['explore'],
    priorityLevel: 'high',
    rationale: 'Intergenerational trauma/memory content requires reflective engagement. 22min duration with thematic complexity. Context cards on cultural patterns support educational use. Strong fit for users seeking deeper cultural analysis.',
  },

  {
    storyWorldId: 'small-histories',
    surfaces: ['explore'],
    priorityLevel: 'medium',
    rationale: 'Archival/memory focus with vignette structure. 18min duration composed of 6 short chapters allows modular engagement. Everyday life themes provide gentle entry to historical preservation concepts.',
  },

  // ============================================
  // BOTH SURFACES
  // ============================================

  {
    storyWorldId: 'the-first-generation',
    surfaces: ['for-you', 'explore'],
    priorityLevel: 'high',
    rationale: 'BOTH: Strong emotional narrative (For You) + educational depth on immigration experience (Explore). 25min duration, 7 chapters provide both immersive journey and thematic exploration. Context cards support institutional use while personal narrative drives For You appeal.',
  },

  {
    storyWorldId: 'work-worth',
    surfaces: ['for-you', 'explore'],
    priorityLevel: 'medium',
    rationale: 'BOTH: Sharp, accessible reflections (For You) + labor justice themes (Explore). 15min duration makes it mobile-friendly while addressing systemic issues of invisible labor. Relevant to working-class diaspora audiences across both surfaces.',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all Story Worlds for a specific surface
 */
export function getStoriesForSurface(surface: DiscoverySurface): DiscoveryMapping[] {
  return DISCOVERY_MAPPINGS.filter((mapping) =>
    mapping.surfaces.includes(surface)
  );
}

/**
 * Get onboarding-priority stories (For You surface)
 */
export function getOnboardingStories(): DiscoveryMapping[] {
  return DISCOVERY_MAPPINGS.filter((mapping) => mapping.onboardingPriority === true);
}

/**
 * Get high-priority stories for a surface
 */
export function getHighPriorityStories(surface: DiscoverySurface): DiscoveryMapping[] {
  return DISCOVERY_MAPPINGS.filter(
    (mapping) =>
      mapping.surfaces.includes(surface) && mapping.priorityLevel === 'high'
  );
}

/**
 * Get discovery surfaces for a specific Story World
 */
export function getStorySurfaces(storyWorldId: string): DiscoverySurface[] {
  const mapping = DISCOVERY_MAPPINGS.find((m) => m.storyWorldId === storyWorldId);
  return mapping?.surfaces || [];
}

/**
 * Check if a Story World should appear in For You
 */
export function isForYouStory(storyWorldId: string): boolean {
  const mapping = DISCOVERY_MAPPINGS.find((m) => m.storyWorldId === storyWorldId);
  return mapping?.surfaces.includes('for-you') || false;
}

/**
 * Check if a Story World should appear in Explore
 */
export function isExploreStory(storyWorldId: string): boolean {
  const mapping = DISCOVERY_MAPPINGS.find((m) => m.storyWorldId === storyWorldId);
  return mapping?.surfaces.includes('explore') || false;
}

// ============================================
// DISTRIBUTION VALIDATION
// ============================================

/**
 * Validate discovery mapping meets requirements
 */
export function validateDiscoveryDistribution(): {
  valid: boolean;
  errors: string[];
  summary: {
    totalStories: number;
    forYouCount: number;
    exploreCount: number;
    bothCount: number;
    onboardingCount: number;
  };
} {
  const errors: string[] = [];
  
  const forYouStories = DISCOVERY_MAPPINGS.filter((m) =>
    m.surfaces.includes('for-you')
  );
  const exploreStories = DISCOVERY_MAPPINGS.filter((m) =>
    m.surfaces.includes('explore')
  );
  const bothStories = DISCOVERY_MAPPINGS.filter(
    (m) => m.surfaces.includes('for-you') && m.surfaces.includes('explore')
  );
  const onboardingStories = DISCOVERY_MAPPINGS.filter((m) => m.onboardingPriority);

  // Requirement checks
  if (forYouStories.length < 4) {
    errors.push(`For You requires at least 4 stories (found: ${forYouStories.length})`);
  }

  if (exploreStories.length < 6) {
    errors.push(`Explore requires at least 6 stories (found: ${exploreStories.length})`);
  }

  if (bothStories.length < 2) {
    errors.push(
      `At least 2 stories must appear in both surfaces (found: ${bothStories.length})`
    );
  }

  if (onboardingStories.length === 0) {
    errors.push('At least one story must be marked for onboarding priority');
  }

  const seenUnseenMapping = DISCOVERY_MAPPINGS.find(
    (m) => m.storyWorldId === 'seen-unseen'
  );
  if (!seenUnseenMapping?.onboardingPriority) {
    errors.push('"Seen / Unseen" must be prioritized for onboarding');
  }

  return {
    valid: errors.length === 0,
    errors,
    summary: {
      totalStories: DISCOVERY_MAPPINGS.length,
      forYouCount: forYouStories.length,
      exploreCount: exploreStories.length,
      bothCount: bothStories.length,
      onboardingCount: onboardingStories.length,
    },
  };
}
