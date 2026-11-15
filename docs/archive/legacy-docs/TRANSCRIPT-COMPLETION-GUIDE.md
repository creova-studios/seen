# TRANSCRIPT COMPLETION GUIDE
**SEEN by CREOVA — Accessibility Transcript Generation**

**Date:** February 6, 2026  
**Status:** 3 Transcripts Pending Completion  
**Purpose:** Complete accessibility transcripts for embedded films

---

## CRITICAL LIMITATION

**AI CANNOT TRANSCRIBE VIDEOS DIRECTLY**

I (the AI assistant) cannot:
- ❌ Watch YouTube videos
- ❌ Access video audio
- ❌ Generate real transcripts from actual footage

**What I CAN do:**
- ✅ Create transcript data structures
- ✅ Provide transcription workflows
- ✅ Format transcript data for accessibility
- ✅ Integrate transcripts into film metadata

**What YOU must do:**
- ✅ Watch the actual videos
- ✅ Generate transcripts using tools (YouTube captions, Rev.com, etc.)
- ✅ Review transcripts for accuracy
- ✅ Provide transcript text to integrate into system

---

## FILMS REQUIRING TRANSCRIPTS

### Film 1: Hip-Hop Evolution: Toronto
- **Film ID:** `nfb-hip-hop-evolution`
- **Duration:** 12 minutes
- **Language:** English
- **YouTube URL:** https://www.youtube.com/watch?v=yXJcT1ByXb4
- **Content:** Documentary on Toronto hip-hop scene (Maestro Fresh Wes, Michie Mee)
- **Transcript File:** `/src/app/data/filmTranscriptsRegistry.ts` (TRANSCRIPT_HIP_HOP_EVOLUTION)

### Film 2: Def Poets Fresh
- **Film ID:** `nfb-fresh-to-def`
- **Duration:** 8 minutes
- **Language:** English/French
- **YouTube URL:** https://www.youtube.com/watch?v=u2nDXAEo3JY
- **Content:** BIPOC spoken word poets
- **Transcript File:** `/src/app/data/filmTranscriptsRegistry.ts` (TRANSCRIPT_DEF_POETS_FRESH)

### Film 3: Africville: A Spirit That Lives On
- **Film ID:** `africville-museum-doc`
- **Duration:** 10 minutes
- **Language:** English
- **YouTube URL:** https://www.youtube.com/watch?v=ErZH2K8VGEU
- **Content:** Africville Museum documentary
- **Transcript File:** `/src/app/data/filmTranscriptsRegistry.ts` (TRANSCRIPT_AFRICVILLE_MUSEUM)

---

## TRANSCRIPTION WORKFLOW

### STEP 1: Choose Transcription Method

**Option A: YouTube Auto-Captions (FREE, 60-70% accurate)**

Pros:
- ✅ Free
- ✅ Instant
- ✅ Good starting point

Cons:
- ❌ Requires manual review
- ❌ No speaker identification
- ❌ No visual descriptions

**How to use:**
1. Open YouTube video
2. Click "..." (More) below video
3. Click "Show transcript"
4. Copy auto-generated captions
5. Review and correct errors
6. Add speaker names manually
7. Add timestamps

**Option B: Professional Transcription Service (RECOMMENDED)**

**Rev.com** (Most popular)
- Cost: $1.50/minute ($12-18 for these films)
- Accuracy: 99%+
- Turnaround: 12 hours
- Includes timestamps and speaker ID
- Website: rev.com

**Trint.com**
- Cost: ~$15/hour of audio
- AI + human review
- Fast turnaround

**Otter.ai**
- Cost: Free tier available
- AI transcription
- Speaker identification

**Option C: Manual Transcription (FREE, time-intensive)**

1. Watch video
2. Type what you hear
3. Use video player to jump back/forward
4. Add timestamps every 30-60 seconds
5. Identify speakers
6. Note visual elements

**Recommended for SEEN:** Option B (Rev.com) for professional accuracy

---

## STEP 2: Generate Transcript

### Using Rev.com (Recommended)

1. **Create Account**
   - Go to rev.com
   - Sign up for account
   - Add payment method

2. **Upload Video**
   - Click "Order Transcription"
   - Paste YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID`
   - Rev will automatically pull video from YouTube

3. **Configure Order**
   - Select "Verbatim" (includes ums, ahs, false starts)
   - OR "Clean" (removes filler words) ← Recommended for SEEN
   - Add special instructions:
     ```
     Please identify speakers by name when visible/introduced.
     Include visual descriptions in brackets for key moments.
     Format timestamps every 30-60 seconds.
     ```

4. **Submit & Wait**
   - Turnaround: ~12 hours
   - Cost: ~$1.50/min
   - Total for 3 films: ~$45

5. **Download**
   - Download as TXT or SRT (SubRip) format
   - Review for accuracy

### Using YouTube Auto-Captions (Free Alternative)

1. **Open Video**
   - Go to YouTube URL
   - Example: https://www.youtube.com/watch?v=yXJcT1ByXb4

2. **Access Transcript**
   - Click "..." (More) below video
   - Click "Show transcript"
   - Toggle timestamps on

3. **Copy Text**
   - Select all transcript text
   - Copy to text editor

4. **Clean Up**
   - Remove timestamp formatting
   - Fix obvious errors (YouTube auto-captions have errors)
   - Add speaker names
   - Add visual descriptions

**Example YouTube Transcript (Before Cleanup):**
```
0:00 today we're going to talk about
0:05 hip hop in Toronto which started
0:10 in the early 1980s with maestro fresh west
```

**After Cleanup:**
```
[00:00] Narrator: Today we're going to talk about hip-hop in Toronto, which started in the early 1980s with Maestro Fresh Wes.

[Visual: Archival footage of Toronto in the 1980s]
```

---

## STEP 3: Format Transcript for SEEN

### Required Format

Transcripts must be formatted as TypeScript objects in `/src/app/data/filmTranscriptsRegistry.ts`.

### Template

```typescript
export const TRANSCRIPT_[FILM_NAME]: FilmTranscript = {
  filmId: 'film-id-here',
  language: 'en',
  segments: [
    {
      timestamp: 0,  // Seconds from start
      timeDisplay: '00:00',
      speaker: 'Narrator',  // Or 'Interviewee 1', 'Host', etc.
      text: 'Opening narration text here.',
      visualDescription: '[Visual: Archival photos of Africville]',
    },
    {
      timestamp: 30,
      timeDisplay: '00:30',
      speaker: 'Narrator',
      text: 'Continuation of narration...',
    },
    {
      timestamp: 60,
      timeDisplay: '01:00',
      speaker: 'Interview Subject',
      text: 'Quote from interview subject.',
      visualDescription: '[Visual: Close-up of speaker]',
    },
    // ... more segments
  ],
  fullText: 'Complete transcript text with all segments combined for searchability.',
  metadata: {
    transcriptionMethod: 'Professional Service',  // or 'YouTube Auto-Captions', 'Manual Transcription'
    reviewedBy: 'Your Name',
    reviewDate: '2026-02-06',
    accuracy: 'Professional',  // or 'Reviewed', 'Draft'
    notes: 'Generated via Rev.com, human-reviewed for accuracy.',
  },
  accessibility: {
    screenReaderOptimized: true,
    includesVisualDescriptions: true,
    includesSoundDescriptions: true,
  },
};
```

### Example: Complete Transcript Segment

```typescript
{
  timestamp: 120,
  timeDisplay: '02:00',
  speaker: 'Maestro Fresh Wes',
  text: 'Hip-hop in Canada was very different from the States. We had our own sound, our own style. Toronto had a unique vibe.',
  visualDescription: '[Visual: Maestro Fresh Wes in interview, wearing vintage hip-hop attire]',
}
```

---

## STEP 4: Add Visual & Sound Descriptions

### Visual Descriptions

Include visual descriptions for:
- ✅ Scene changes
- ✅ Important on-screen text
- ✅ Speaker identification
- ✅ Archival footage or photos
- ✅ Key moments (protests, ceremonies, performances)

**Format:** `[Visual: Description here]`

**Examples:**
```
[Visual: Archival photo of Africville, 1960s]
[Visual: Map showing Underground Railroad routes into Canada]
[Visual: Performance footage of spoken word poet on stage]
[Visual: On-screen text: "1946 - Viola Desmond refuses to leave whites-only section"]
```

### Sound Descriptions

Include sound descriptions for:
- ✅ Music (if not spoken about)
- ✅ Ambient sounds
- ✅ Sound effects

**Format:** `[Sound: Description here]`

**Examples:**
```
[Sound: Jazz music plays softly in background]
[Sound: Archival news broadcast audio]
[Sound: Drumming and chanting]
```

---

## STEP 5: Integrate Into Film Registry

### Update filmTranscriptsRegistry.ts

Open `/src/app/data/filmTranscriptsRegistry.ts` and replace the placeholder segments with your completed transcript.

**Before (Placeholder):**
```typescript
export const TRANSCRIPT_HIP_HOP_EVOLUTION: FilmTranscript = {
  filmId: 'nfb-hip-hop-evolution',
  language: 'en',
  segments: [
    {
      timestamp: 0,
      timeDisplay: '00:00',
      text: '[PENDING TRANSCRIPTION]',
    },
  ],
  fullText: '[PENDING TRANSCRIPTION]',
  // ...
};
```

**After (Completed):**
```typescript
export const TRANSCRIPT_HIP_HOP_EVOLUTION: FilmTranscript = {
  filmId: 'nfb-hip-hop-evolution',
  language: 'en',
  segments: [
    {
      timestamp: 0,
      timeDisplay: '00:00',
      speaker: 'Narrator',
      text: 'Toronto in the 1980s was a city transformed by sound.',
      visualDescription: '[Visual: Archival footage of Toronto skyline, 1980s]',
    },
    {
      timestamp: 15,
      timeDisplay: '00:15',
      speaker: 'Narrator',
      text: 'Hip-hop had arrived, and Canadian artists were ready to make their mark.',
    },
    {
      timestamp: 30,
      timeDisplay: '00:30',
      speaker: 'Maestro Fresh Wes',
      text: 'We knew we had something special. The energy in Toronto was electric.',
      visualDescription: '[Visual: Maestro Fresh Wes in interview]',
    },
    // ... continue for all 12 minutes
  ],
  fullText: 'Toronto in the 1980s was a city transformed by sound. Hip-hop had arrived, and Canadian artists were ready to make their mark. We knew we had something special. The energy in Toronto was electric. ...',
  metadata: {
    transcriptionMethod: 'Professional Service',
    reviewedBy: 'Content Team',
    reviewDate: '2026-02-06',
    accuracy: 'Professional',
    notes: 'Transcribed via Rev.com, reviewed for cultural accuracy.',
  },
  accessibility: {
    screenReaderOptimized: true,
    includesVisualDescriptions: true,
    includesSoundDescriptions: true,
  },
};
```

### Update Completion Status

After completing transcripts, update the status object:

```typescript
export const TRANSCRIPT_COMPLETION_STATUS = {
  total: 3,
  completed: 3,  // Update this
  pending: 0,    // Update this
  accuracy: {
    draft: 0,
    reviewed: 0,
    professional: 3,  // Update this
  },
};
```

---

## STEP 6: Update Film Registry Metadata

Open `/src/app/data/curatedFilmsRegistry.ts` and update the `hasTranscript` field:

**Before:**
```typescript
{
  filmId: 'nfb-hip-hop-evolution',
  // ... other fields
  hasTranscript: false,  // Currently false
}
```

**After:**
```typescript
{
  filmId: 'nfb-hip-hop-evolution',
  // ... other fields
  hasTranscript: true,  // Updated to true
}
```

Do this for all 3 films:
- `nfb-hip-hop-evolution`
- `nfb-fresh-to-def`
- `africville-museum-doc`

---

## STEP 7: Test Accessibility

### Screen Reader Testing

1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate to film in SEEN app
3. Access transcript (via accessibility menu or transcript button)
4. Verify screen reader reads transcript segments correctly
5. Verify timestamps are announced
6. Verify speaker names are announced

### Search Testing

```typescript
// Test transcript search
const results = searchTranscript('nfb-hip-hop-evolution', 'Maestro Fresh Wes');
console.log(results);
// Should return all segments mentioning Maestro Fresh Wes
```

---

## ACCESSIBILITY STANDARDS

### WCAG 2.1 AA Requirements

**1.2.2 Captions (Prerecorded)** - Level A
- ✅ All films must have captions/transcripts

**1.2.3 Audio Description or Media Alternative (Prerecorded)** - Level A
- ✅ Transcripts serve as media alternative
- ✅ Visual descriptions included

**1.2.8 Media Alternative (Prerecorded)** - Level AAA (optional)
- ✅ Full transcripts exceed Level A requirements

### Best Practices

**Speaker Identification:**
```
✅ Good: "Narrator: Text here"
❌ Bad: "Text here" (no speaker)
```

**Visual Descriptions:**
```
✅ Good: "[Visual: Archival photo of Africville, showing waterfront community]"
❌ Bad: "[Photo]"
```

**Timestamps:**
```
✅ Good: Every 30-60 seconds
❌ Bad: Only at scene changes (too infrequent)
```

**Text Formatting:**
```
✅ Good: "Hip-hop in Toronto was different."
❌ Bad: "hip hop in toronto was different" (no capitalization)
```

---

## TRANSCRIPT DELIVERY TIMELINE

### Immediate (Today)
- ✅ Transcript data structure created
- ✅ Framework integrated into film registry
- ✅ Helper functions operational
- ⚠️ Placeholder transcripts marked as "PENDING"

### Within 24 Hours (Recommended)
- Order transcriptions from Rev.com (~$45 total)
- Upload 3 YouTube URLs to Rev
- Wait for professional transcripts (~12 hours)

### Within 48 Hours
- Receive transcripts from Rev.com
- Review for accuracy
- Add visual/sound descriptions
- Format as TypeScript objects
- Update filmTranscriptsRegistry.ts
- Update film metadata (hasTranscript: true)
- Test accessibility

### Completion Checklist
- [ ] Order transcripts from Rev.com (or chosen service)
- [ ] Review received transcripts for accuracy
- [ ] Add visual descriptions for key moments
- [ ] Add sound descriptions where needed
- [ ] Format as TypeScript segments
- [ ] Update TRANSCRIPT_HIP_HOP_EVOLUTION
- [ ] Update TRANSCRIPT_DEF_POETS_FRESH
- [ ] Update TRANSCRIPT_AFRICVILLE_MUSEUM
- [ ] Update hasTranscript fields in curatedFilmsRegistry.ts
- [ ] Update TRANSCRIPT_COMPLETION_STATUS
- [ ] Test with screen reader
- [ ] Test search functionality
- [ ] Generate completion report for CMF

---

## BUDGET

**Professional Transcription (Recommended):**
- Film 1 (12 min): $18
- Film 2 (8 min): $12
- Film 3 (10 min): $15
- **Total: $45**

**Alternative (Free):**
- YouTube auto-captions (free)
- Manual review (10-15 hours of work)
- **Total: $0** (but significant time investment)

**Recommendation:** Spend $45 for professional transcripts via Rev.com to ensure:
- ✅ 99%+ accuracy
- ✅ Fast turnaround (12 hours)
- ✅ Speaker identification
- ✅ Clean formatting
- ✅ CMF-compliant accessibility

---

## CMF REPORTING

### Accessibility Coverage Report

**Before Transcript Completion:**
```
Total Films: 20
With Subtitles: 20/20 (100%)
With Transcripts: 17/20 (85%)
```

**After Transcript Completion:**
```
Total Films: 20
With Subtitles: 20/20 (100%)
With Transcripts: 20/20 (100%) ✅
```

### Compliance Statement

```
SEEN by CREOVA meets WCAG 2.1 AA accessibility standards:

1.2.2 Captions (Prerecorded) - Level A: ✅ COMPLIANT
  - All 20 films have captions (via YouTube)
  
1.2.3 Audio Description or Media Alternative - Level A: ✅ COMPLIANT
  - All 20 films have full text transcripts
  - Transcripts include visual descriptions
  - Transcripts are screen reader accessible

1.2.8 Media Alternative (Prerecorded) - Level AAA: ✅ EXCEEDS
  - Comprehensive transcripts with timestamps
  - Speaker identification
  - Visual and sound descriptions
```

---

## EXAMPLE: Complete Transcript

### Africville: A Spirit That Lives On (Sample)

```typescript
export const TRANSCRIPT_AFRICVILLE_MUSEUM: FilmTranscript = {
  filmId: 'africville-museum-doc',
  language: 'en',
  segments: [
    {
      timestamp: 0,
      timeDisplay: '00:00',
      speaker: 'Narrator',
      text: 'On the shores of the Bedford Basin in Halifax, Nova Scotia, there once stood a vibrant community known as Africville.',
      visualDescription: '[Visual: Aerial view of Bedford Basin, present day]',
    },
    {
      timestamp: 10,
      timeDisplay: '00:10',
      speaker: 'Narrator',
      text: 'Founded in the 1840s by Black refugees and freedmen, Africville was home to hundreds of families for over a century.',
      visualDescription: '[Visual: Historical photos of Africville homes and residents, black and white]',
    },
    {
      timestamp: 25,
      timeDisplay: '00:25',
      speaker: 'Former Resident',
      text: 'It was a community. We looked after each other. Everyone knew everyone. It was home.',
      visualDescription: '[Visual: Interview with elderly Black woman, sitting in home]',
    },
    {
      timestamp: 40,
      timeDisplay: '00:40',
      speaker: 'Narrator',
      text: 'But in the 1960s, the City of Halifax declared Africville a slum and began demolition.',
      visualDescription: '[Visual: Archival footage of bulldozers demolishing homes]',
      sound: '[Sound: Heavy machinery, demolition sounds]',
    },
    {
      timestamp: 55,
      timeDisplay: '00:55',
      speaker: 'Former Resident',
      text: 'They came with garbage trucks to move us out. Garbage trucks. Like we were trash.',
      visualDescription: '[Visual: Close-up of speaker, emotion visible]',
    },
    // ... continue for full 10 minutes
  ],
  fullText: 'On the shores of the Bedford Basin in Halifax, Nova Scotia, there once stood a vibrant community known as Africville. Founded in the 1840s by Black refugees and freedmen, Africville was home to hundreds of families for over a century. It was a community. We looked after each other...',
  metadata: {
    transcriptionMethod: 'Professional Service',
    reviewedBy: 'SEEN Content Team',
    reviewDate: '2026-02-06',
    accuracy: 'Professional',
    notes: 'Transcribed via Rev.com. Reviewed for cultural sensitivity and historical accuracy.',
  },
  accessibility: {
    screenReaderOptimized: true,
    includesVisualDescriptions: true,
    includesSoundDescriptions: true,
  },
};
```

---

## CONCLUSION

**What's Ready NOW:**
- ✅ Transcript data structure
- ✅ Integration framework
- ✅ Helper functions (search, retrieve, format)
- ✅ Accessibility infrastructure

**What YOU Must Do:**
1. Watch 3 YouTube videos (or use transcription service)
2. Generate transcripts via Rev.com ($45) or YouTube captions (free)
3. Format transcripts using provided template
4. Update filmTranscriptsRegistry.ts with real transcript data
5. Update curatedFilmsRegistry.ts (hasTranscript: true)
6. Test accessibility

**Timeline:** 24-48 hours to complete all 3 transcripts

**Cost:** $45 (professional) or $0 (manual)

**Result:** 100% accessibility coverage, CMF-compliant

---

**END TRANSCRIPT COMPLETION GUIDE**

**Status:** Framework Complete, Awaiting Real Transcription  
**Next Step:** Order transcriptions from Rev.com or begin manual transcription
