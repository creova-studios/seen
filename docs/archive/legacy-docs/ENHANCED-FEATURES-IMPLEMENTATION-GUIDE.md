# ENHANCED FEATURES IMPLEMENTATION GUIDE
**SEEN by CREOVA — Non-Visual Feature Extensions**

**Purpose:** Complete guide for implementing 11 advanced feature sets without modifying UI/UX  
**Status:** All features designed, backend logic complete, ready for integration  
**Architecture:** Data/logic-based, optional, privacy-first, defaults OFF

---

## OVERVIEW

All features extend existing functionality through:
- **Data models** (TypeScript types)
- **Backend logic** (Supabase + KV store)
- **User preferences** (opt-in, defaults OFF)
- **NO UI changes** (uses existing components)

---

## FEATURE SET A: ENHANCED CONTEXT CARDS

### What It Does
Adds progressive depth to existing Context Card component:
- **Level 1:** Short explanation (existing)
- **Level 2:** Expanded cultural/historical context (NEW)
- **Level 3:** Institution-verified annotation (NEW, optional)

### How It Works
```typescript
// Get context card with progressive disclosure
const card = await getContextCard('africville', 2); // Level 2
// Returns card with explanation + expandedContext (but not institution annotation)
```

### Data Structure
```typescript
interface EnhancedContextCard {
  id: string;
  term: string; // "Africville", "Sleeping Car Porter", etc.
  explanation: { en, fr, es }; // Level 1
  expandedContext?: { en, fr, es }; // Level 2
  institutionAnnotation?: {
    text: { en, fr, es };
    source: InstitutionSource; // Level 3
  };
}
```

### Usage in Existing UI
- Use existing Context Card component
- Add click-to-expand or progressive reveal (no new affordance)
- Display Level 1 by default
- User clicks "Learn more" → Level 2
- User clicks "Institution source" → Level 3

### Example
**Term:** "Africville"

**Level 1 (Existing):**
> A Black community in Halifax, Nova Scotia, forcibly displaced in the 1960s.

**Level 2 (Expanded Context):**
> Africville was established in the 1840s by Black refugees and freedmen. Despite being one of Halifax's oldest communities, it was systematically denied services (water, sewage, roads) while being surrounded by industrial pollution. In the 1960s, the city demolished Africville under the guise of "urban renewal," displacing over 400 residents. The community fought for recognition for decades, receiving a formal apology in 2010.

**Level 3 (Institution-Verified):**
> [Verified by Dalhousie University African Diaspora Studies]  
> The displacement of Africville is recognized as environmental racism and a form of cultural genocide. The Africville Museum, established in 2012, preserves the history and honors the resilience of former residents and their descendants.

---

## FEATURE SET B: GUIDED READING/LISTENING MODES

### What It Does
Enables users to choose how they consume stories:
- **Read-only** (text only, no audio)
- **Listen-only** (audio only, minimal text)
- **Read + Listen** (default, both active)

### How It Works
```typescript
// User sets preference
await updateUserReadingPreferences(userId, {
  consumptionMode: 'listen-only',
  audioSpeed: 1.25,
  ambientAudioEnabled: false,
});

// App retrieves preference
const prefs = await getUserReadingPreferences(userId);
// Adjust playback and display accordingly
```

### Data Structure
```typescript
interface UserReadingPreferences {
  consumptionMode: 'read-only' | 'listen-only' | 'read-and-listen';
  autoPlayNext: boolean;
  audioSpeed: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  preferredLanguage: 'en' | 'fr' | 'es';
  ambientAudioEnabled: boolean;
  narrationVolume: number; // 0-100
  ambientVolume: number; // 0-100
}
```

### Resume Position Tracking
```typescript
// Save consumption state
await saveChapterConsumptionState(userId, {
  chapterId: 's2-renaissance-ch1',
  mode: 'listen-only',
  audioPosition: 123, // seconds
  completed: false,
});

// Retrieve on return
const state = await getChapterConsumptionState(userId, 's2-renaissance-ch1');
// Resume audio at 123 seconds
```

### Usage in Existing UI
- Use existing audio player + text components
- Mode determined by user preference state
- No toggle UI (set in profile/settings)
- Persists across sessions

---

## FEATURE SET C: INSTITUTIONAL COLLECTIONS & SYLLABI

### What It Does
Enables curators to create thematic groupings of stories for educational use:
- Themed collections (e.g., "Black Canadian Labor History")
- Suggested reading order
- Optional discussion prompts

### How It Works
```typescript
// Create collection
await createInstitutionalCollection({
  id: 'collection-black-labor-history',
  title: {
    en: 'Black Canadian Labor History',
    fr: 'Histoire du travail noir canadien',
    es: 'Historia del trabajo negro canadiense',
  },
  description: {
    en: 'Stories of Black workers organizing for dignity and justice.',
    // ...
  },
  contentIds: ['s2-sleeping-car-porters', 's2-black-canadian-renaissance'],
  suggestedOrder: ['s2-sleeping-car-porters', 's2-black-canadian-renaissance'],
  discussionPrompts: [
    {
      promptText: {
        en: 'How did labor organizing create community power?',
        // ...
      },
      intendedAudience: 'undergraduate',
    },
  ],
  isPublic: true,
});

// List collections in Explore
const collections = await listPublicCollections();
```

### Data Structure
```typescript
interface InstitutionalCollection {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  editorialFraming?: MultilingualText; // Curator intro
  curatedBy: string; // Institution name
  contentIds: string[]; // Story/film IDs
  suggestedOrder?: string[];
  discussionPrompts?: DiscussionPrompt[];
  institutionId?: string;
  isPublic: boolean;
}
```

### Usage in Existing UI
- Collections surface in Explore section only
- No classroom UI, no quizzes, no grading
- Text-based discussion prompts (optional)
- No social threads

---

## FEATURE SET D: CULTURAL IMPACT ANALYTICS (CMF-COMPLIANT)

### What It Does
Tracks **aggregate-only** usage data for CMF reporting:
- Story starts/completions
- Language usage
- Audio engagement
- Theme-level insights

**NO individual tracking, NO surveillance**

### How It Works
```typescript
// Record events (aggregate only)
await recordStoryStart('s2-black-canadian-renaissance');
await recordStoryCompletion('s2-black-canadian-renaissance');
await recordAudioListening('s2-black-canadian-renaissance', 15); // 15 minutes
await recordLanguageUsage('fr');

// Generate CMF report
const report = await generateCMFReport(
  '2026-01-01',
  '2026-12-31',
  'admin-user-id',
);
// Report contains ONLY aggregate metrics
```

### Data Collected (Aggregate Only)
```typescript
interface AggregateStoryMetrics {
  storyWorldId: string;
  totalStarts: number; // Total count, no individual users
  totalCompletions: number;
  completionRate: number; // Percentage
  languageBreakdown: {
    en: number; // Percentage of sessions
    fr: number;
    es: number;
  };
  totalAudioMinutesListened: number; // Total across all users
  averageListenDuration: number;
}
```

### What Is NOT Collected
- ❌ Individual user behavior
- ❌ Attention patterns
- ❌ Emotional inference
- ❌ Cross-platform identity
- ❌ Social graphs
- ❌ Browsing history

### CMF Report Format
```typescript
interface CMFReport {
  reportPeriod: { start, end };
  platformMetrics: PlatformWideMetrics;
  storyMetrics: AggregateStoryMetrics[];
  multilingualEngagement: {
    totalBilingualSessions: number;
    frenchEngagement: number; // %
    spanishEngagement: number; // %
  };
  institutionalUsers: number; // Approximate
  institutionalCollections: number;
  themesDiversity: string[];
}
```

---

## FEATURE SET E: CREATOR NOTES (POST-STORY)

### What It Does
Allows creators to add reflective notes that appear after story completion:
- Text-only
- Optional
- No comments, no reactions

### How It Works
```typescript
// Create creator note
await setCreatorNote({
  id: 'note-s2-renaissance',
  storyWorldId: 's2-black-canadian-renaissance',
  noteText: {
    en: 'This story was shaped by interviews with activists who were there. Their voices are not just history—they are memory, resistance, and refusal.',
    // ...
  },
  creatorName: 'CREOVA Collective',
  isPublished: true,
});

// Retrieve after story completion
const note = await getCreatorNote('s2-black-canadian-renaissance');
// Display in existing text component
```

### Data Structure
```typescript
interface CreatorNote {
  id: string;
  storyWorldId: string;
  noteText: MultilingualText;
  creatorName?: string;
  creatorBio?: MultilingualText;
  isPublished: boolean;
}
```

### Usage in Existing UI
- Appears after last chapter completion
- Text-only (use existing typography)
- No social features (no comments, likes, shares)

---

## FEATURE SET F: COMMUNITY REFLECTIONS (CARE-BASED)

### What It Does
Enables moderated, non-social participation:
- Users submit text or audio reflections
- All submissions enter moderation queue
- Approved reflections visible (no profiles, no ranking)
- Creator sees responses privately

### How It Works
```typescript
// User submits reflection
await submitCommunityReflection({
  chapterId: 's2-renaissance-ch1',
  storyWorldId: 's2-black-canadian-renaissance',
  format: 'text',
  reflectionText: 'This resonated with my family's story...',
  submitterHash: hashFunction(anonymousId), // One-way hash
  submitterLanguage: 'en',
  promptId: 'prompt-cultural-connection',
});

// Moderator reviews
const pending = await getPendingReflections();
// Moderator approves or rejects

await moderateReflection(
  'reflection-xyz',
  'approved',
  'moderator-id',
  'Culturally sensitive, approved for visibility',
);

// Retrieve approved reflections
const reflections = await getChapterReflections('s2-renaissance-ch1');
// Display in existing text component (no profiles, no ranking)
```

### Moderation Categories
- **Cultural sensitivity** — Respectful representation
- **Harm prevention** — No hate speech, violence, harassment
- **Accessibility & language** — Inclusive, clear
- **Restorative care** — Community-building, not divisive

### Data Structure
```typescript
interface CommunityReflection {
  id: string;
  chapterId: string;
  format: 'text' | 'audio';
  reflectionText?: string;
  audioUrl?: string;
  submitterHash: string; // Anonymous, one-way hash
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderatedBy?: string;
  isVisible: boolean; // Only if approved
  visibleToCreatorOnly: boolean; // Private to creator
}
```

### What Is NOT Included
- ❌ Public profiles
- ❌ Likes, follows, or ranking
- ❌ Unmoderated visibility
- ❌ Social dynamics

---

## FEATURE SET G: OFFLINE CULTURAL PACKS

### What It Does
Enables downloadable bundles for offline access:
- Story text
- Narration audio
- Context cards
- Institution-enabled if flagged

### How It Works
```typescript
// Create offline pack
await createOfflinePack({
  id: 'pack-season2',
  packName: {
    en: 'Season 2: Black Canadian Histories',
    // ...
  },
  storyWorldIds: ['s2-black-canadian-renaissance', 's2-sleeping-car-porters'],
  includeNarrationAudio: true,
  includeContextCards: true,
  languages: ['en', 'fr'],
  estimatedSizeMB: 150,
  institutionEnabledOnly: false, // Public pack
});

// List packs
const packs = await listOfflinePacks();
// User downloads via existing download permissions
```

### Data Structure
```typescript
interface OfflineCulturalPack {
  id: string;
  packName: MultilingualText;
  description: MultilingualText;
  storyWorldIds: string[];
  includeNarrationAudio: boolean;
  includeContextCards: boolean;
  languages: ('en' | 'fr' | 'es')[];
  estimatedSizeMB: number;
  storageLimit?: number; // Max MB
  institutionEnabledOnly: boolean;
  downloadUrl?: string; // Pre-generated zip
}
```

### Usage in Existing UI
- No UI changes
- Use existing download permissions
- Explicit storage limits
- Institution-enabled if flagged

---

## FEATURE SET H: MULTI-NARRATOR SUPPORT

### What It Does
Allows multiple narration tracks per chapter (different voices, same language):
- Alternative narrator voices
- User selects preferred narrator
- Optional feature (defaults to primary narrator)

### How It Works
```typescript
// Add alternative narration track
await addNarrationTrack({
  chapterId: 's2-renaissance-ch1',
  narratorId: 'narrator-alt-1',
  language: 'en',
  audioUrl: 'https://[supabase]/alternative-narrator.mp3',
  duration: 240,
  isDefault: false, // Not default narrator
});

// Retrieve available narrators
const tracks = await getChapterNarrationTracks('s2-renaissance-ch1', 'en');
// User selects preferred track
```

### Data Structure
```typescript
interface NarratorProfile {
  id: string;
  narratorName: string;
  voiceDescription?: MultilingualText; // "Warm, reflective"
  language: 'en' | 'fr' | 'es';
}

interface ChapterNarrationTrack {
  chapterId: string;
  narratorId: string;
  language: 'en' | 'fr' | 'es';
  audioUrl: string;
  duration: number;
  isDefault: boolean; // Default narrator
}
```

### Usage in Existing UI
- Use existing audio player
- No default switching (user must opt-in)
- Optional selection only

---

## FEATURE SET I: LIVING ARCHIVES (FUTURE-SAFE)

### What It Does
Prepares stories for long-term growth:
- Append-only chapter capability
- Version history tracking
- Publication dates per chapter

### How It Works
```typescript
// Add new chapter to existing story (append-only)
await addChapterVersion({
  versionId: 'version-xyz',
  chapterId: 's2-renaissance-ch7', // NEW chapter
  versionNumber: 1,
  title: { en: 'The Archive Continues', ... },
  bodyText: { en: '...', ... },
  isAppendedChapter: true, // Marked as appended
  publishedAt: '2027-06-01T00:00:00Z',
});

// Get version history
const versions = await getChapterVersions('s2-renaissance-ch1');
// View changes over time
```

### Data Structure
```typescript
interface ChapterVersion {
  versionId: string;
  chapterId: string;
  versionNumber: number; // 1, 2, 3...
  title: MultilingualText;
  bodyText: MultilingualText;
  changeDescription?: string; // "Added historical context"
  changedBy: string;
  publishedAt: string;
  isAppendedChapter: boolean; // New chapter added
}

interface StoryWorldHistory {
  storyWorldId: string;
  currentVersion: number;
  originalChapterCount: number;
  currentChapterCount: number;
  appendedChapterIds: string[];
  changeLog: Array<{
    timestamp: string;
    changeType: 'chapter-added' | 'chapter-updated' | 'translation-added';
    description: string;
  }>;
}
```

### Usage in Existing UI
- No timeline UI
- No notifications
- Changes logged, not surfaced publicly

---

## FEATURE SET J: RIGHTS & ATTRIBUTION (BACKEND ONLY)

### What It Does
Protects creators and institutions (admin only):
- Rights metadata per content item
- Usage scope
- License duration
- Attribution requirements

### How It Works
```typescript
// Set content rights (admin only)
await setContentRights({
  contentId: 's2-black-canadian-renaissance',
  contentType: 'story',
  rightsHolder: 'CREOVA Collective',
  licenseType: 'CMF-grant-compliant',
  licenseStartDate: '2026-01-01',
  allowedUsage: {
    platformPlayback: true,
    institutionalDownload: true,
    educationalUse: true,
    commercialUse: false,
  },
  attributionText: {
    en: 'Story by CREOVA Collective, funded by Canada Media Fund',
    // ...
  },
  cmfFunded: true,
});

// Retrieve rights (admin/backend only)
const rights = await getContentRights('s2-black-canadian-renaissance');
// Enforce usage restrictions
```

### Data Structure
```typescript
interface ContentRights {
  contentId: string;
  rightsHolder: string;
  licenseType: 'CREOVA-exclusive' | 'non-exclusive-limited' | 'educational-use-only' | 'CMF-grant-compliant';
  licenseStartDate: string;
  licenseEndDate?: string; // Null = perpetual
  allowedUsage: {
    platformPlayback: boolean;
    institutionalDownload: boolean;
    educationalUse: boolean;
    commercialUse: boolean;
  };
  attributionText: MultilingualText;
  cmfFunded: boolean;
}
```

### Usage
- **Backend only** — No UI exposure
- Admin-only access
- Enforces usage restrictions

---

## FEATURE SET K: SEASONAL EDITORIAL FRAMING

### What It Does
Adds curatorial authority at season level:
- Editorial intro per season
- Short framing text
- Appears once on season entry

### How It Works
```typescript
// Set seasonal framing
await setSeasonalFraming({
  season: 2,
  introText: {
    en: 'Season 2 explores Black Canadian histories often erased from official narratives. These are stories of resistance, refusal, and community-building.',
    // ...
  },
  curatedBy: 'CREOVA Collective',
  seasonTheme: {
    en: 'Resistance & Refusal',
    // ...
  },
  displayOnce: true, // Show only on first entry
  dismissible: true, // User can close
});

// Retrieve on season entry
const framing = await getSeasonalFraming(2);
// Display in existing text component
```

### Data Structure
```typescript
interface SeasonalEditorialFraming {
  season: number;
  introText: MultilingualText;
  curatedBy?: string;
  seasonTheme?: MultilingualText;
  displayOnce: boolean; // Show only once
  dismissible: boolean; // User can close
}
```

### Usage in Existing UI
- Text-only
- No banners, no animations
- Appears once per season entry

---

## USER PREFERENCES & OPT-IN

**All features default to OFF**

Users must explicitly opt-in via preferences:

```typescript
interface UserFeaturePreferences {
  userId?: string;
  enhancedContextCardsEnabled: boolean; // Default: false
  creatorNotesEnabled: boolean; // Default: false
  communityReflectionsVisible: boolean; // Default: false
  offlinePacksEnabled: boolean; // Default: false
  multiNarratorSelectionEnabled: boolean; // Default: false
  seasonalEditorialFramingEnabled: boolean; // Default: false
  readingPreferences: UserReadingPreferences; // Default: read-and-listen
  analyticsOptIn: boolean; // Default: false
}
```

---

## VALIDATION CHECKLIST

### UI/UX Compliance ✅
- [x] No new screens, tabs, or navigation
- [x] No new buttons or affordances
- [x] No typography, spacing, or styling changes
- [x] Uses existing components only

### Feature Architecture ✅
- [x] All features data/logic-based
- [x] All features optional (defaults OFF)
- [x] All features non-disruptive

### Privacy & Ethics ✅
- [x] No individual user tracking
- [x] Analytics aggregate-only
- [x] Community reflections moderated
- [x] No social dynamics (likes, follows, ranking)

### CMF Compliance ✅
- [x] Multilingual (EN/FR/ES)
- [x] Culturally appropriate
- [x] Educational scaffolding
- [x] Aggregate reporting

---

## NEXT STEPS

### Phase 1: Data Migration
1. Create KV store keys for all feature data
2. Populate initial context cards (Level 2 + 3)
3. Create institutional collections
4. Set seasonal editorial framing

### Phase 2: Backend Integration
1. Integrate enhanced features module into server
2. Test all API endpoints
3. Validate privacy compliance

### Phase 3: Frontend Integration
1. Connect existing components to new data sources
2. Implement user preference toggles
3. Test consumption modes
4. QA across devices

### Phase 4: Community & Institutional Rollout
1. Train moderators for community reflections
2. Onboard institutional partners (collections)
3. Launch offline packs
4. Enable multi-narrator selection

### Phase 5: CMF Reporting
1. Generate first CMF report
2. Validate analytics aggregation
3. Share with stakeholders

---

**END ENHANCED FEATURES IMPLEMENTATION GUIDE**

**Status:** All features designed, backend logic complete, ready for integration  
**UI Impact:** ZERO (uses existing components)  
**Next Action:** Phase 1 data migration
