# INTERACTION → INTENT → QUERY MAPPING
**SEEN by CREOVA — Complete Workflow Resolution**

**Date:** February 7, 2026  
**Purpose:** Ensure EVERY interaction resolves to its FULL and INTENDED workflow  
**Status:** ⚠️ VALIDATION IN PROGRESS

---

## INTERACTION ENUMERATION

### SCREEN 1: FOR YOU

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `forYou_curatedStoryCard_1` | Curated Story Card #1 | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `forYou_curatedStoryCard_2` | Curated Story Card #2 | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `forYou_curatedStoryCard_3` | Curated Story Card #3 | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `forYou_curatedStoryCard_4` | Curated Story Card #4 | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `forYou_curatedStoryCard_5` | Curated Story Card #5 | Navigate to Story World | Single story | ✅ Correct | ✅ |

**Data Source:** Curated algorithm (intent-based)  
**Scope:** `stories:curated:limit=5`  
**Validation:** ✅ Intentionally limited (personalized feed)

---

### SCREEN 2: EXPLORE

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `explore_seeAll_stories` | "See All" (Stories section) | View ALL published stories | `stories:published` | ⚠️ NEEDS VALIDATION | ⚠️ |
| `explore_seeAll_films` | "See All" (Films section) | View ALL films | `films:all` | ⚠️ NEEDS VALIDATION | ⚠️ |
| `explore_seeAll_music` | "See All" (Music section) | View ALL music items | `music:all` | ⚠️ NEEDS VALIDATION | ⚠️ |
| `explore_seeAll_collections` | "See All" (Collections) | View ALL collections | `collections:public` | ⚠️ NEEDS VALIDATION | ⚠️ |
| `explore_storyCard_featured_1` | Featured Story Card #1 | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `explore_storyCard_featured_2` | Featured Story Card #2 | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `explore_storyCard_featured_3` | Featured Story Card #3 | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `explore_filmCard_featured_1` | Featured Film Card #1 | Open embedded player | Single film | ✅ Correct | ✅ |
| `explore_filmCard_featured_2` | Featured Film Card #2 | Open embedded player | Single film | ✅ Correct | ✅ |
| `explore_musicCard_featured_1` | Featured Music Card #1 | Open in-app player | Single album | ✅ Correct | ✅ |
| `explore_musicCard_featured_2` | Featured Music Card #2 | Open in-app player | Single album | ✅ Correct | ✅ |
| `explore_collectionCard_1` | Collection Card #1 | View collection detail | Single collection | ✅ Correct | ✅ |

**Featured Data Sources:**  
- Stories: `stories:featured:limit=3`  
- Films: `films:featured:limit=2`  
- Music: `music:featured:limit=2`  
- Collections: `collections:featured:limit=1`

**⚠️ CRITICAL ISSUE DETECTED:**  
**"See All" buttons MUST NOT reuse featured queries!**

---

### SCREEN 3: LIBRARY

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `library_storyCard_inProgress_1` | In-Progress Story #1 | Resume from last chapter | Single story | ✅ Correct | ✅ |
| `library_storyCard_inProgress_2` | In-Progress Story #2 | Resume from last chapter | Single story | ✅ Correct | ✅ |
| `library_storyCard_completed_1` | Completed Story #1 | View story (restart option) | Single story | ✅ Correct | ✅ |
| `library_resumeButton_1` | "Resume" button | Resume playback | User progress | ✅ Correct | ✅ |
| `library_startFromBeginning_1` | "Start from Beginning" | Clear progress, restart | Clear progress | ✅ Correct | ✅ |

**Data Source:** User progress (localStorage + server)  
**Scope:** `user:progress:all`  
**Validation:** ✅ Correctly scoped to user data

---

### SCREEN 4: PROFILE

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `profile_languageSelect_EN` | Language: EN | Switch to English | Language state | ✅ Correct | ✅ |
| `profile_languageSelect_FR` | Language: FR | Switch to French | Language state | ✅ Correct | ✅ |
| `profile_languageSelect_ES` | Language: ES | Switch to Spanish | Language state | ✅ Correct | ✅ |
| `profile_consumptionMode_toggle` | Consumption mode toggle | Change read/listen mode | User preference | ✅ Correct | ✅ |
| `profile_audioSpeed_slider` | Audio speed slider | Adjust playback speed | User preference | ✅ Correct | ✅ |
| `profile_creatorDashboard_button` | "Creator Dashboard" | Open creator tools | Role-gated | ✅ Correct | ✅ |
| `profile_moderation_button` | "Moderation Queue" | Open moderation | Role-gated | ✅ Correct | ✅ |
| `profile_logout_button` | "Logout" | Log out user | Auth state | ✅ Correct | ✅ |

**Data Source:** User preferences (localStorage + server)  
**Validation:** ✅ Correctly scoped to user settings

---

### SCREEN 5: STORY WORLD

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `storyWorld_chapterCard_1` | Chapter 1 card | Open Chapter 1 | Single chapter | ✅ Correct | ✅ |
| `storyWorld_chapterCard_2` | Chapter 2 card | Open Chapter 2 | Single chapter | ✅ Correct | ✅ |
| `storyWorld_chapterCard_N` | Chapter N card | Open Chapter N | Single chapter | ✅ Correct | ✅ |
| `storyWorld_startReading_button` | "Start Reading/Listening" | Open first chapter | First chapter | ✅ Correct | ✅ |
| `storyWorld_resume_button` | "Resume" button | Resume from last position | User progress | ✅ Correct | ✅ |
| `storyWorld_back_button` | Back button | Return to previous screen | Navigation | ✅ Correct | ✅ |

**Data Source:** Story metadata + chapters  
**Scope:** `story:${storyWorldId}:chapters:all`  
**Validation:** ✅ Correctly loads all chapters for story

---

### SCREEN 6: CHAPTER

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `chapter_nextChapter_button` | "Next Chapter" | Navigate to next chapter | Next chapter | ✅ Correct | ✅ |
| `chapter_previousChapter_button` | "Previous Chapter" | Navigate to previous chapter | Previous chapter | ✅ Correct | ✅ |
| `chapter_playPause_button` | Play/Pause button | Control narration playback | Audio state | ✅ Correct | ✅ |
| `chapter_timeline_scrubber` | Audio timeline | Seek to position | Audio position | ✅ Correct | ✅ |
| `chapter_contextTerm_1` | Context term (underlined) | Open Context Card | Single context card | ✅ Correct | ✅ |
| `chapter_back_button` | Back button | Return to Story World | Navigation | ✅ Correct | ✅ |

**Data Source:** Chapter content + narration  
**Scope:** `chapter:${chapterId}:full`  
**Validation:** ✅ Correctly loads complete chapter

---

### SCREEN 7: CONTEXT CARD MODAL

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `contextCard_learnMore_button` | "Learn More" button | Expand to Level 2 | Context Level 2 | ✅ Correct | ✅ |
| `contextCard_institutionSource_button` | "Institution Source" | Expand to Level 3 | Context Level 3 | ✅ Correct | ✅ |
| `contextCard_close_button` | Close (X) button | Close modal | Modal state | ✅ Correct | ✅ |
| `contextCard_externalLink` | External institution link | Open in browser (confirm) | External URL | ✅ Correct | ✅ |

**Data Source:** Context card data  
**Scope:** `contextCard:${cardId}:level=${level}`  
**Validation:** ✅ Progressive disclosure works correctly

---

### SCREEN 8: COLLECTION DETAIL

| Interaction ID | Element | Expected Outcome | Content Scope | Current Query | Status |
|----------------|---------|------------------|---------------|---------------|--------|
| `collection_storyCard_1` | Story Card #1 (in collection) | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `collection_storyCard_2` | Story Card #2 (in collection) | Navigate to Story World | Single story | ✅ Correct | ✅ |
| `collection_discussionPrompt_expand_1` | Discussion Prompt #1 | Expand prompt | Single prompt | ✅ Correct | ✅ |
| `collection_back_button` | Back button | Return to Explore | Navigation | ✅ Correct | ✅ |

**Data Source:** Collection metadata + child stories  
**Scope:** `collection:${collectionId}:stories:all`  
**Validation:** ✅ Correctly expands collection into stories

---

## CRITICAL VALIDATION: "SEE ALL" WORKFLOWS

### ⚠️ ISSUE 1: Explore → See All Stories

**Current Behavior (SUSPECTED):**
```typescript
// BAD: May be reusing featured query
const stories = getStories({ limit: 3, featured: true });
```

**Required Behavior:**
```typescript
// GOOD: Unbounded query with pagination
const stories = getStories({ 
  filter: 'published',
  limit: undefined, // Or paginated (20 per page)
  featured: false 
});
```

**Expected Dataset:**
- **ALL 18 implemented stories** (Seasons 2, 3, 4 complete)
- **Paginated or scrollable** (not limited to 3-5)
- **Excludes planned stories** (Season 5-8)

**Validation Assertion:**
```typescript
ASSERT: allStoriesDataset.length >= 18
ASSERT: allStoriesDataset.length > featuredStoriesDataset.length
ASSERT: allStoriesDataset.every(story => story.status === 'published')
```

---

### ⚠️ ISSUE 2: Explore → See All Films

**Current Behavior (SUSPECTED):**
```typescript
// BAD: May be reusing featured query
const films = getFilms({ limit: 2, featured: true });
```

**Required Behavior:**
```typescript
// GOOD: All films
const films = getFilms({ 
  limit: undefined,
  featured: false 
});
```

**Expected Dataset:**
- **ALL implemented films** (no limit)
- **Not just featured 2**

**Validation Assertion:**
```typescript
ASSERT: allFilmsDataset.length > featuredFilmsDataset.length
ASSERT: allFilmsDataset.every(film => film.contentType === 'film')
```

---

### ⚠️ ISSUE 3: Explore → See All Music

**Current Behavior (SUSPECTED):**
```typescript
// BAD: May be reusing featured query
const music = getMusic({ limit: 2, featured: true });
```

**Required Behavior:**
```typescript
// GOOD: All music items
const music = getMusic({ 
  limit: undefined,
  featured: false 
});
```

**Expected Dataset:**
- **ALL music items** (CREOVA Music albums, soundscapes)
- **Not just featured 2**

**Validation Assertion:**
```typescript
ASSERT: allMusicDataset.length > featuredMusicDataset.length
ASSERT: allMusicDataset.every(item => item.contentType === 'music')
```

---

### ⚠️ ISSUE 4: Explore → See All Collections

**Current Behavior (SUSPECTED):**
```typescript
// BAD: May be limited
const collections = getCollections({ limit: 1, featured: true });
```

**Required Behavior:**
```typescript
// GOOD: All public collections
const collections = getCollections({ 
  filter: 'public',
  limit: undefined 
});
```

**Expected Dataset:**
- **ALL public collections** (institutional + curated)
- **Not just featured 1**

**Validation Assertion:**
```typescript
ASSERT: allCollectionsDataset.length > featuredCollectionsDataset.length
ASSERT: allCollectionsDataset.every(c => c.isPublic === true)
```

---

## STORY VISIBILITY VALIDATION

### All 18 Implemented Stories (MUST BE QUERYABLE)

**Season 2 (6 stories × 6 chapters = 36 chapters):**
1. ✅ `s2-black-canadian-renaissance`
2. ✅ `s2-sleeping-car-porters`
3. ✅ `s2-black-womens-archive`
4. ✅ `s2-montreal-black-music`
5. ✅ `s2-africville-memory`
6. ✅ `s2-black-canadian-futures`

**Season 3 (6 stories × 6 chapters = 36 chapters):**
7. ✅ `s3-diaspora-belonging`
8. ✅ `s3-intergenerational-translation`
9. ✅ `s3-mixed-identity-navigation`
10. ✅ `s3-indigenous-urban`
11. ✅ `s3-queer-2slgbtqia-futures`
12. ✅ `s3-disability-access-justice`

**Season 4 (6 stories × 1 chapter each = 6 chapters):**
13. ✅ `s4-cultural-futurism`
14. ✅ `s4-intergenerational-knowledge`
15. ✅ `s4-linguistic-sovereignty`
16. ✅ `s4-land-reciprocity`
17. ✅ `s4-movement-building`
18. ✅ `s4-creative-resistance`

**Total Published:** 18 stories, 78 chapters

**Validation:**
```typescript
const allStories = getStories({ filter: 'published' });
ASSERT: allStories.length === 18
ASSERT: allStories.map(s => s.id).includes('s2-black-canadian-renaissance')
ASSERT: allStories.map(s => s.id).includes('s4-creative-resistance')
ASSERT: !allStories.some(s => s.status === 'planned')
```

---

## CONTENT TYPE ISOLATION VALIDATION

### Rule: NO Cross-Content Reuse

**Stories Section:**
```typescript
ASSERT: storiesDataset.every(item => item.contentType === 'story')
ASSERT: !storiesDataset.some(item => item.contentType === 'film')
ASSERT: !storiesDataset.some(item => item.contentType === 'music')
```

**Films Section:**
```typescript
ASSERT: filmsDataset.every(item => item.contentType === 'film')
ASSERT: !filmsDataset.some(item => item.contentType === 'story')
```

**Music Section:**
```typescript
ASSERT: musicDataset.every(item => item.contentType === 'music')
ASSERT: !musicDataset.some(item => item.contentType === 'story')
```

**Collections Expansion:**
```typescript
const collection = getCollection('collection-id');
const childStories = collection.contentIds.map(id => getStoryById(id));
ASSERT: childStories.every(story => story.contentType === 'story')
```

---

## EMPTY STATE VALIDATION

### Rule: Empty MUST Look Intentional

**If Stories Dataset is Empty:**
```typescript
if (storiesDataset.length === 0) {
  // GOOD: Show existing empty state UI
  return <EmptyState message="No stories available yet" />;
  
  // BAD: Silently fall back to CREOVA Music
  // return <MusicSection />;
}
```

**If Library is Empty:**
```typescript
if (userProgress.length === 0) {
  // GOOD: Show "No stories started yet"
  return <EmptyState message="You haven't started any stories yet" />;
  
  // BAD: Show random story
  // return <StoryCard story={randomStory} />;
}
```

---

## WORKFLOW CONTINUITY RULES

### After ANY Interaction:

1. **Back Navigation:**
   ```typescript
   // GOOD: Returns to logical previous state
   onBack={() => navigateToTab('explore')}
   
   // BAD: Resets entire app
   // onBack={() => window.location.reload()}
   ```

2. **Language State:**
   ```typescript
   // GOOD: Preserved across navigation
   const { currentLanguage } = useNavigation();
   // Language persists when navigating Story → Chapter → Story
   
   // BAD: Resets to EN
   // setLanguage('en') // on every navigation
   ```

3. **Audio State:**
   ```typescript
   // GOOD: Preserved unless explicitly stopped
   // User navigates Story → Chapter 2 → Chapter 3
   // Audio state (speed, volume) preserved
   
   // BAD: Resets audio preferences
   // audioSpeed = 1.0 // on every chapter change
   ```

4. **Scroll Position:**
   ```typescript
   // GOOD: Preserved in long lists
   // User scrolls to Story 15 in Explore
   // Taps Story 15 → Backs out
   // Scroll position at Story 15 (preserved)
   
   // BAD: Resets to top
   // scrollTo(0) // on every back navigation
   ```

---

## AUTOMATED ASSERTIONS

### Test Suite: "See All" Button Validation

```typescript
describe('Explore → See All Stories', () => {
  test('Returns MORE stories than featured section', () => {
    const featuredStories = getStories({ limit: 3, featured: true });
    const allStories = getStories({ filter: 'published' });
    
    expect(allStories.length).toBeGreaterThan(featuredStories.length);
    expect(allStories.length).toBeGreaterThanOrEqual(18); // All implemented stories
  });
  
  test('Dataset type matches button label (Stories only)', () => {
    const allStories = getStories({ filter: 'published' });
    
    expect(allStories.every(item => item.contentType === 'story')).toBe(true);
    expect(allStories.some(item => item.contentType === 'film')).toBe(false);
  });
  
  test('No duplicate IDs', () => {
    const allStories = getStories({ filter: 'published' });
    const ids = allStories.map(s => s.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(ids.length);
  });
  
  test('No placeholder items', () => {
    const allStories = getStories({ filter: 'published' });
    
    expect(allStories.every(s => s.status === 'published')).toBe(true);
    expect(allStories.some(s => s.title.includes('Placeholder'))).toBe(false);
  });
});
```

---

## RESOLUTION STATUS

| Interaction Type | Total Count | Validated | Issues Found | Status |
|------------------|-------------|-----------|--------------|--------|
| Story Cards | 30+ | ✅ | 0 | ✅ PASS |
| "See All" Buttons | 4 | ⚠️ | 4 | ⚠️ NEEDS FIX |
| Navigation Buttons | 15+ | ✅ | 0 | ✅ PASS |
| Audio Controls | 10+ | ✅ | 0 | ✅ PASS |
| Context Cards | 5 | ✅ | 0 | ✅ PASS |
| Language Selectors | 3 | ✅ | 0 | ✅ PASS |
| Role-Gated Buttons | 3 | ✅ | 0 | ✅ PASS |

**Overall Status:** ⚠️ 4 CRITICAL ISSUES DETECTED

---

## NEXT ACTIONS REQUIRED

1. ✅ **Enumerate all interactions** (COMPLETE)
2. ✅ **Define intent for each** (COMPLETE)
3. ⚠️ **Fix "See All" button queries** (IN PROGRESS)
4. ⚠️ **Validate story visibility (all 18)** (NEEDS VERIFICATION)
5. ✅ **Verify content type isolation** (VALIDATED)
6. ✅ **Validate empty states** (VALIDATED)
7. ⚠️ **Create automated test suite** (NEEDS IMPLEMENTATION)

---

**END INTERACTION INTENT MAPPING**

**Status:** ⚠️ CRITICAL ISSUES IDENTIFIED — RESOLUTION IN PROGRESS
