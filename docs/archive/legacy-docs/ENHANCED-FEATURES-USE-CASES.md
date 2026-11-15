# ENHANCED FEATURES — USE CASES & INTEGRATION EXAMPLES
**SEEN by CREOVA — Real-World Application Scenarios**

**Purpose:** Detailed use cases showing how each feature integrates into user workflows  
**Audience:** Developers, educators, institutional partners

---

## TABLE OF CONTENTS

1. [Enhanced Context Cards — Progressive Learning](#use-case-1)
2. [Guided Reading/Listening — Accessibility](#use-case-2)
3. [Institutional Collections — Curriculum Integration](#use-case-3)
4. [Cultural Impact Analytics — CMF Reporting](#use-case-4)
5. [Creator Notes — Transparency & Attribution](#use-case-5)
6. [Community Reflections — Care-Based Engagement](#use-case-6)
7. [Offline Cultural Packs — Rural Access](#use-case-7)
8. [Multi-Narrator Support — Voice Preferences](#use-case-8)
9. [Living Archives — Story Evolution](#use-case-9)
10. [Seasonal Editorial Framing — Curatorial Voice](#use-case-10)

---

<a name="use-case-1"></a>
## USE CASE 1: ENHANCED CONTEXT CARDS — PROGRESSIVE LEARNING

### Scenario
**User:** Maya, a 16-year-old high school student in Toronto  
**Context:** Reading Story 2.5 (Africville) for a history class assignment  
**Goal:** Understand what Africville was and why it matters

### User Journey

**Step 1: Initial Encounter**
- Maya reads: *"Africville was forcibly displaced in the 1960s."*
- She clicks on "Africville" (existing Context Card component)

**Step 2: Level 1 — Short Explanation**
```
Africville
A Black community in Halifax, Nova Scotia, forcibly displaced in the 1960s.
```
- Maya understands the basics
- She wants to know more → clicks "Learn More"

**Step 3: Level 2 — Expanded Context**
```
Africville was established in the 1840s by Black refugees and freedmen. Despite being one of 
Halifax's oldest communities, it was systematically denied services (water, sewage, roads) 
while being surrounded by industrial pollution. In the 1960s, the city demolished Africville 
under the guise of "urban renewal," displacing over 400 residents. The community fought for 
recognition for decades, receiving a formal apology in 2010.
```
- Maya now understands the historical depth
- She sees "Verified by Institution" badge → clicks

**Step 4: Level 3 — Institution-Verified Annotation**
```
[Verified by Dalhousie University African Diaspora Studies]
The displacement of Africville is recognized as environmental racism and a form of cultural 
genocide. The Africville Museum, established in 2012, preserves the history and honors the 
resilience of former residents and their descendants.

Contact: african.diaspora@dal.ca
Learn more: https://www.dal.ca/faculty/arts/african-diaspora.html
```
- Maya cites the Dalhousie source in her essay
- She visits the museum website for further research

### Technical Implementation

```tsx
import { useContextCard } from '../hooks/useEnhancedFeatures';

function ContextCardDisplay({ cardId }: { cardId: string }) {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const { card, loading } = useContextCard(cardId, level);

  if (loading || !card) return null;

  return (
    <div className="context-card">
      <h3>{card.term}</h3>
      
      {/* Level 1: Always shown */}
      <p>{card.explanation.en}</p>
      
      {/* Level 2: Show if level >= 2 */}
      {level >= 2 && card.expandedContext && (
        <div className="expanded-context">
          <p>{card.expandedContext.en}</p>
        </div>
      )}
      
      {/* Level 3: Show if level === 3 */}
      {level === 3 && card.institutionAnnotation && (
        <div className="institution-annotation">
          <span className="verified-badge">
            Verified by {card.institutionAnnotation.source.institutionName}
          </span>
          <p>{card.institutionAnnotation.text.en}</p>
          <a href={card.institutionAnnotation.source.institutionUrl}>
            Learn more
          </a>
        </div>
      )}
      
      {/* Progressive disclosure controls */}
      {level < 3 && (
        <button onClick={() => setLevel((level + 1) as 1 | 2 | 3)}>
          Learn More
        </button>
      )}
    </div>
  );
}
```

### Impact
- **Educational:** Students access authoritative sources
- **Trust:** Institution verification builds credibility
- **Depth:** Progressive learning (not overwhelming)

---

<a name="use-case-2"></a>
## USE CASE 2: GUIDED READING/LISTENING — ACCESSIBILITY

### Scenario
**User:** James, a 42-year-old truck driver with low vision  
**Context:** Listening to stories during long drives  
**Goal:** Consume content audio-only (no reading)

### User Journey

**Step 1: Set Preference**
- James opens Settings (existing UI)
- Selects "Consumption Mode: Listen-Only"
- Preference saved to server (if authenticated) or localStorage (if anonymous)

**Step 2: Chapter Playback**
- James navigates to Story 2.2 (Sleeping Car Porters)
- App detects `consumptionMode: 'listen-only'`
- **Text is minimized** (chapter title only, no full body text)
- **Audio player is prominent** (large controls, auto-focus)

**Step 3: Resume Position**
- James pauses at 2:15 into Chapter 3
- App saves `audioPosition: 135` (seconds)
- Next day, James returns → audio resumes at 2:15

**Step 4: Speed Control**
- James listens at 1.25x speed (preference)
- Ambient audio disabled (preference)

### Technical Implementation

```tsx
import { useReadingPreferences, useChapterConsumption } from '../hooks/useEnhancedFeatures';

function ChapterPlayer({ chapterId, userId }: { chapterId: string; userId?: string }) {
  const { preferences } = useReadingPreferences(userId);
  const { state, saveState } = useChapterConsumption(userId, chapterId);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Resume from saved position
    if (state?.audioPosition && audioRef.current) {
      audioRef.current.currentTime = state.audioPosition;
    }
  }, [state]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    // Save position every 5 seconds
    const currentTime = audioRef.current.currentTime;
    if (Math.floor(currentTime) % 5 === 0) {
      saveState({ audioPosition: currentTime });
    }
  };

  const mode = preferences?.consumptionMode || 'read-and-listen';

  return (
    <div className="chapter-player">
      {/* Text: shown only if read-only or read-and-listen */}
      {mode !== 'listen-only' && (
        <div className="chapter-text">
          {/* Full chapter text */}
        </div>
      )}

      {/* Audio: shown only if listen-only or read-and-listen */}
      {mode !== 'read-only' && (
        <audio
          ref={audioRef}
          src={chapterAudioUrl}
          controls
          autoPlay={mode === 'listen-only'} // Auto-play in listen-only mode
          playbackRate={preferences?.audioSpeed || 1.0}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => saveState({ completed: true })}
        />
      )}
    </div>
  );
}
```

### Impact
- **Accessibility:** Supports users with visual impairments
- **Convenience:** Resume from where you left off
- **Flexibility:** Users choose how to consume content

---

<a name="use-case-3"></a>
## USE CASE 3: INSTITUTIONAL COLLECTIONS — CURRICULUM INTEGRATION

### Scenario
**User:** Dr. Sarah Chen, Black Canadian Studies professor at University of Toronto  
**Context:** Teaching a course on Black Canadian labor history  
**Goal:** Create a curated collection of stories for students

### Workflow

**Step 1: Create Collection (Admin Interface)**
```tsx
Collection: "Black Canadian Labor History"
Description: "Stories of Black workers organizing for dignity, fair wages, and justice."
Curated By: "Dr. Sarah Chen, University of Toronto"

Stories:
1. Story 2.2: Sleeping Car Porters
2. Story 2.1: Black Canadian Renaissance

Suggested Order: 2.2 → 2.1

Discussion Prompts:
1. "How did labor organizing create community power beyond the workplace?"
   Audience: Undergraduate
   Time: 20 minutes

2. "What role did the Brotherhood of Sleeping Car Porters play in the broader civil rights movement?"
   Audience: Undergraduate
   Time: 15 minutes
```

**Step 2: Students Access Collection**
- Students navigate to Explore → Collections
- Click "Black Canadian Labor History"
- See editorial framing from Dr. Chen
- Follow suggested reading order

**Step 3: Discussion**
- After reading, students see discussion prompts
- In-class discussion (no platform UI for discussion threads)
- Students submit reflections via Community Reflections (moderated)

### Technical Implementation

```tsx
import { useCollection } from '../hooks/useEnhancedFeatures';

function CollectionView({ collectionId }: { collectionId: string }) {
  const { collection, loading } = useCollection(collectionId);

  if (loading || !collection) return <div>Loading...</div>;

  return (
    <div className="collection-view">
      <header>
        <h1>{collection.title.en}</h1>
        <p className="curator">Curated by {collection.curatedBy}</p>
      </header>

      {/* Editorial Framing */}
      {collection.editorialFraming && (
        <div className="editorial-framing">
          <p>{collection.editorialFraming.en}</p>
        </div>
      )}

      {/* Stories (in suggested order) */}
      <div className="collection-stories">
        <h2>Stories in This Collection</h2>
        {(collection.suggestedOrder || collection.contentIds).map((storyId, index) => (
          <StoryCard key={storyId} storyId={storyId} order={index + 1} />
        ))}
      </div>

      {/* Discussion Prompts */}
      {collection.discussionPrompts && (
        <div className="discussion-prompts">
          <h2>Discussion Prompts</h2>
          {collection.discussionPrompts.map((prompt, index) => (
            <div key={index} className="prompt">
              <p>{prompt.promptText.en}</p>
              <span className="prompt-meta">
                {prompt.intendedAudience} · {prompt.estimatedTime}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Impact
- **Educational:** Curriculum-ready collections
- **Authority:** Professor curates, adds context
- **Scaffolding:** Discussion prompts guide learning

---

<a name="use-case-4"></a>
## USE CASE 4: CULTURAL IMPACT ANALYTICS — CMF REPORTING

### Scenario
**User:** CREOVA Admin preparing annual CMF grant report  
**Context:** Need to demonstrate platform impact and multilingual engagement  
**Goal:** Generate aggregate-only metrics

### Workflow

**Step 1: Generate CMF Report (Admin Dashboard)**
```tsx
Report Period: 2026-01-01 to 2026-12-31
Generated By: admin-user-id

Platform Metrics:
- Total Story Completions: 12,450
- Total Audio Hours: 3,200 hours
- French Engagement: 32% of sessions
- Spanish Engagement: 18% of sessions
- Institutional Users: ~450 (approximate)
- Institutional Collections: 15

Theme-Level Engagement:
- Black Canadian History: 45% (5,602 engagements, 67% completion)
- Indigenous Urbanism: 28% (3,486 engagements, 72% completion)
- Diaspora & Belonging: 27% (3,362 engagements, 65% completion)

Multilingual Engagement:
- Bilingual Sessions: 1,240 (users switching languages)
- FR/EN Sessions: 890
- ES/EN Sessions: 350
```

**Step 2: Export for CMF**
- Click "Export CMF Report (PDF)"
- Submit to Canada Media Fund

### Technical Implementation

```tsx
import { useStoryAnalytics } from '../hooks/useEnhancedFeatures';

function StoryAnalyticsWrapper({ storyWorldId, optIn }: { storyWorldId: string; optIn: boolean }) {
  const { recordStart, recordCompletion, recordAudioListening } = useStoryAnalytics(storyWorldId, optIn);
  
  useEffect(() => {
    // Record start when component mounts
    recordStart();
  }, [recordStart]);

  const handleChapterComplete = (chapterNumber: number, totalChapters: number) => {
    if (chapterNumber === totalChapters) {
      // Last chapter completed → record story completion
      recordCompletion();
    }
  };

  const handleAudioEnd = (durationSeconds: number) => {
    const durationMinutes = durationSeconds / 60;
    recordAudioListening(durationMinutes);
  };

  // No UI changes, analytics happen in background
  return null;
}
```

### Privacy Safeguards

**What IS Tracked:**
- ✅ Total story starts (count)
- ✅ Total completions (count)
- ✅ Language usage (percentage)
- ✅ Audio minutes (total)

**What is NOT Tracked:**
- ❌ Individual user IDs
- ❌ Session duration per user
- ❌ Scroll patterns
- ❌ Attention metrics

### Impact
- **Accountability:** Demonstrates CMF-funded impact
- **Privacy:** No individual surveillance
- **Multilingual:** Tracks FR/ES engagement

---

<a name="use-case-5"></a>
## USE CASE 5: CREATOR NOTES — TRANSPARENCY & ATTRIBUTION

### Scenario
**User:** Aisha, completing Story 2.2 (Sleeping Car Porters)  
**Context:** Just finished the last chapter  
**Goal:** Understand how the story was created

### User Journey

**Step 1: Story Completion**
- Aisha finishes Chapter 6 (last chapter)
- App detects completion

**Step 2: Creator Note Appears**
```
Creator Note from CREOVA Collective:

This story was shaped by archival research at Library and Archives Canada, interviews 
with descendants of Sleeping Car Porters, and consultation with the Canadian Museum 
for Human Rights. The voices of porters who organized, resisted, and built community 
are not just history—they are a blueprint for labor organizing today. Thank you to 
the families who shared their stories and trusted us to carry them forward.
```

**Step 3: Reflection**
- Aisha appreciates the transparency
- She understands the story is community-sourced
- No comment thread (avoids toxic dynamics)

### Technical Implementation

```tsx
import { useCreatorNote } from '../hooks/useEnhancedFeatures';

function StoryCompletion({ storyWorldId, completed }: { storyWorldId: string; completed: boolean }) {
  const { note, loading } = useCreatorNote(storyWorldId, completed);

  if (!completed || loading || !note) return null;

  return (
    <div className="creator-note">
      <h3>A Note from the Creators</h3>
      <p>{note.noteText.en}</p>
      
      {note.creatorBio && (
        <div className="creator-bio">
          <strong>{note.creatorName}</strong>
          <p>{note.creatorBio.en}</p>
        </div>
      )}
      
      {/* No comment thread, no reactions */}
    </div>
  );
}
```

### Impact
- **Transparency:** Shows research process
- **Attribution:** Credits knowledge keepers
- **Trust:** No hidden sources

---

<a name="use-case-6"></a>
## USE CASE 6: COMMUNITY REFLECTIONS — CARE-BASED ENGAGEMENT

### Scenario
**User:** Marcus, reading Story 3.1 (Diaspora Belonging)  
**Context:** Resonates with his family's immigration story  
**Goal:** Share his reflection without toxic social dynamics

### User Journey

**Step 1: Read Prompt**
```
Reflection Prompt:
What does "home" mean to you when you have roots in multiple places?
```

**Step 2: Submit Reflection (Anonymous)**
```tsx
Marcus writes:
"My parents came from Jamaica in the 1980s. I was born in Toronto. When people ask 
where I'm from, I say Toronto, but they always ask 'where are you really from?' Like 
Toronto isn't enough. Like being Canadian and Jamaican at the same time is impossible. 
But home for me is both. It's patties and snow. It's reggae and hockey. I don't have 
to choose."
```

**Step 3: Moderation**
- Reflection enters moderation queue
- Moderator reviews for cultural sensitivity, harm prevention
- Approved ✅

**Step 4: Visibility**
- Reflection becomes visible to other users
- **NO profile** (anonymous)
- **NO likes, comments, or reactions**
- Just the reflection itself

**Step 5: Creator Sees (Private)**
- CREOVA creator sees Marcus's reflection (along with others)
- Used to inform future stories
- Marcus's identity remains anonymous

### Technical Implementation

```tsx
import { useChapterReflections } from '../hooks/useEnhancedFeatures';

function CommunityReflectionsView({ chapterId, enabled }: { chapterId: string; enabled: boolean }) {
  const { reflections, loading, submitReflection } = useChapterReflections(chapterId, enabled);
  const [reflectionText, setReflectionText] = useState('');

  const handleSubmit = async () => {
    const result = await submitReflection(reflectionText, 'text');
    if (result.success) {
      alert('Reflection submitted for moderation. Thank you for sharing!');
      setReflectionText('');
    }
  };

  if (!enabled) return null;

  return (
    <div className="community-reflections">
      <h3>Community Reflections</h3>
      
      {/* Approved reflections */}
      <div className="reflections-list">
        {reflections.map((reflection) => (
          <div key={reflection.id} className="reflection-card">
            <p>{reflection.reflectionText}</p>
            <span className="reflection-meta">{reflection.submitterLanguage}</span>
            {/* NO profile, NO likes, NO comments */}
          </div>
        ))}
      </div>

      {/* Submit new reflection */}
      <div className="submit-reflection">
        <h4>Share Your Reflection</h4>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="What does this story mean to you?"
          rows={4}
        />
        <button onClick={handleSubmit}>Submit (Anonymous)</button>
        <p className="moderation-notice">
          Your reflection will be reviewed for cultural sensitivity before being published.
        </p>
      </div>
    </div>
  );
}
```

### Impact
- **Community:** Users connect through reflections
- **Care:** Moderation prevents harm
- **No Toxicity:** No likes, no ranking, no profiles

---

<a name="use-case-7"></a>
## USE CASE 7: OFFLINE CULTURAL PACKS — RURAL ACCESS

### Scenario
**User:** Elaine, a librarian in a rural Saskatchewan community library  
**Context:** Limited internet bandwidth in the library  
**Goal:** Download stories for offline access

### Workflow

**Step 1: Browse Offline Packs**
- Elaine navigates to Offline Packs (in existing UI)
- Sees available packs:
  - "Season 2: Black Canadian Histories (Complete)" — 450MB
  - "Diaspora & Belonging Collection" — 250MB

**Step 2: Download Pack**
- Elaine downloads "Season 2" pack
- Zip file contains:
  - 35 chapter text files (EN/FR/ES)
  - 105 MP3 narration files (35 × 3 languages)
  - 20 context card files (JSON)

**Step 3: Offline Access**
- Elaine unzips pack on library computer
- Community members access stories without internet
- Audio files play from local storage

### Technical Implementation

```tsx
import { useOfflinePacks } from '../hooks/useEnhancedFeatures';

function OfflinePacksView({ isInstitutionUser }: { isInstitutionUser: boolean }) {
  const { packs, loading } = useOfflinePacks(isInstitutionUser);

  const handleDownload = (packId: string) => {
    // Trigger download from Supabase storage
    const pack = packs.find(p => p.id === packId);
    if (pack?.downloadUrl) {
      window.location.href = pack.downloadUrl;
    }
  };

  if (loading) return <div>Loading offline packs...</div>;

  return (
    <div className="offline-packs">
      <h2>Offline Cultural Packs</h2>
      <p>Download stories for offline access. No internet required after download.</p>

      <div className="packs-list">
        {packs.map((pack) => (
          <div key={pack.id} className="pack-card">
            <h3>{pack.packName.en}</h3>
            <p>{pack.description.en}</p>
            <div className="pack-meta">
              <span>{pack.storyWorldIds.length} stories</span>
              <span>{pack.estimatedSizeMB} MB</span>
              <span>Languages: {pack.languages.join(', ').toUpperCase()}</span>
            </div>
            <button onClick={() => handleDownload(pack.id)}>
              Download Pack
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Impact
- **Equity:** Removes internet access barrier
- **Rural:** Serves Northern and rural communities
- **Institutional:** Libraries distribute to patrons

---

## SUMMARY OF ALL USE CASES

| Feature | User | Scenario | Impact |
|---------|------|----------|--------|
| **A. Context Cards** | Student | Learning history | Authoritative sources, progressive depth |
| **B. Reading Modes** | Truck driver | Audio-only during drives | Accessibility, resume position |
| **C. Collections** | Professor | Curriculum integration | Educational scaffolding |
| **D. Analytics** | Admin | CMF reporting | Privacy-first impact metrics |
| **E. Creator Notes** | Reader | Post-story transparency | Attribution, research process |
| **F. Reflections** | Community member | Sharing response | Care-based, no toxicity |
| **G. Offline Packs** | Librarian | Rural access | Equity, offline capability |
| **H. Multi-Narrator** | User with hearing preferences | Voice selection | Accessibility |
| **I. Living Archives** | Creator | Story evolution | Long-term growth |
| **K. Seasonal Framing** | User | Season entry | Curatorial voice |

---

**END USE CASES DOCUMENTATION**

All features integrate seamlessly with existing UI components while extending platform capabilities for education, accessibility, and cultural impact.
