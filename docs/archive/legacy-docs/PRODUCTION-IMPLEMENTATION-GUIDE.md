# PRODUCTION IMPLEMENTATION GUIDE
**SEEN by CREOVA — Pre-Production Tasks**

**Date:** February 6, 2026  
**Status:** Implementation Ready  
**Purpose:** Step-by-step guide for completing pre-production requirements

---

## TASK 1: REPLACE FILM YOUTUBE PLACEHOLDER IDs ⚠️

### Current Status
- **5 films** have placeholder video IDs in `/src/app/data/filmsEmbedRegistry.ts`
- All films configured for in-app playback
- Playback rules enforced (no autoplay, no external redirect)

### Placeholder IDs to Replace

```typescript
// Current placeholders in filmsEmbedRegistry.ts
1. 'PLACEHOLDER_VIDEO_ID_1' → Threads Unseen (Layla Hammoud)
2. 'PLACEHOLDER_VIDEO_ID_2' → Saltwater Routes (Marcus Johnson)
3. 'PLACEHOLDER_VIDEO_ID_3' → Language Keepers (Tanya Tagaq)
4. 'PLACEHOLDER_VIDEO_ID_4' → Africville: Memory of a Community (NFB)
5. 'PLACEHOLDER_VIDEO_ID_5' → Komagata Maru (Ali Kazimi)
```

### Implementation Steps

**Step 1: Research Actual Films**

For each film, find actual YouTube videos that match the description:

**Film 1: Threads Unseen (or similar documentary on immigrant labor)**
- Search YouTube: "immigrant garment workers documentary Canada Toronto"
- Alternative searches: "basement sewing shops", "invisible labor documentary"
- Look for: 15-25 minute documentaries, embeddable, BIPOC-focused
- Example sources: NFB (National Film Board), independent filmmakers

**Film 2: Saltwater Routes (or similar on Caribbean-Canadian migration)**
- Search YouTube: "Caribbean Canadian migration documentary Atlantic"
- Alternative: "Black Atlantic Canada", "Caribbean diaspora documentary"
- Look for: 10-20 minute films, visual essay style
- Example sources: NFB, CBC Docs, independent creators

**Film 3: Language Keepers (Indigenous language revitalization)**
- Search YouTube: "Indigenous language revitalization Canada documentary"
- Alternative: "Cree language", "Inuktitut revitalization", "Mi'kmaq language"
- Look for: 20-35 minute documentaries
- **CRITICAL:** Must have Indigenous community permission
- Example sources: NFB, Indigenous media organizations

**Film 4: Africville (archival documentary)**
- Search YouTube: "Africville documentary Halifax"
- **KNOWN FILM:** NFB has actual Africville documentaries
- Look for: Official NFB uploads with embedding enabled
- Verify: NFB allows educational embedding

**Film 5: Komagata Maru (Ali Kazimi documentary)**
- Search YouTube: "Komagata Maru documentary Ali Kazimi"
- **KNOWN FILM:** Ali Kazimi's "Continuous Journey" (2004)
- Look for: Official uploads or rights-cleared versions
- Verify: Embedding permissions from creator

**Step 2: Verify Embedding Permissions**

For each video found:

```
1. Check embed settings:
   - Click Share → Embed
   - If embed code appears → Embedding allowed ✅
   - If "Video unavailable" → Embedding disabled ❌

2. Verify rights:
   - Read video description for usage terms
   - Check uploader (official channel vs. unauthorized)
   - Look for Creative Commons license or educational use permission

3. Contact creators (if needed):
   - Email creator/organization
   - Request educational embedding permission
   - Explain SEEN platform (non-commercial, cultural education)
   - Get written permission
```

**Step 3: Extract Video IDs**

From YouTube URL, extract video ID:

```
URL format: https://www.youtube.com/watch?v=VIDEO_ID_HERE
Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Video ID: dQw4w9WgXcQ
```

**Step 4: Update filmsEmbedRegistry.ts**

Open `/src/app/data/filmsEmbedRegistry.ts` and replace placeholders:

```typescript
// BEFORE:
embedUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_1',
videoId: 'PLACEHOLDER_VIDEO_ID_1',

// AFTER (example):
embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
videoId: 'dQw4w9WgXcQ',
```

**Step 5: Test Embedding**

Test each video in SEEN app:
```
1. Load film in Explore
2. Click to play
3. Verify: Video plays in-app (not redirecting to YouTube)
4. Verify: No autoplay
5. Verify: Controls visible
6. Verify: No related videos at end
```

### Recommended Film Sources

**National Film Board of Canada (NFB)**
- Website: nfb.ca
- Many films available on YouTube with embedding enabled
- Educational use often permitted
- Search their channel: youtube.com/@nfb

**CBC Docs**
- YouTube channel: CBC Docs
- Documentary shorts often embeddable
- Canadian content focus

**Independent Filmmakers**
- Contact directly for permission
- Many willing to support educational platforms
- Offer credit and attribution

### Alternative Approach: Use NFB Films

If finding specific films is difficult, use actual NFB documentaries:

```typescript
// Example NFB films that likely exist and are embeddable:

Film 1: "Remember Africville" (NFB, 1991)
Film 2: "Project Grizzly" or other Black Canadian history docs
Film 3: Indigenous language docs from NFB Indigenous Cinema
Film 4: Asian Canadian history from NFB
Film 5: Migration stories from NFB
```

**To find NFB films:**
1. Visit nfb.ca
2. Search by topic (Black Canadian history, Indigenous, etc.)
3. Click "Watch on YouTube" if available
4. Verify embedding enabled
5. Use video ID

---

## TASK 2: UPLOAD MUSIC FILES TO HOSTING ⚠️

### Current Status
- **5 music items** reference placeholder paths in `/src/app/data/musicBIPOCCatalog.ts`
- All configured for in-app playback
- Album-based listening enforced

### Placeholder Paths to Replace

```typescript
// Current placeholders in musicBIPOCCatalog.ts
1. '/media/music/midnight-resonance-album.mp3' → 45 min album
2. '/media/music/black-sound-canada.mp3' → 60 min compilation
3. '/media/music/inuit-throat-songs.mp3' → 25 min experience
4. '/media/music/asian-diaspora-sounds.mp3' → 50 min compilation
5. '/media/music/creova-sampler-vol1.mp3' → 40 min compilation
```

### Implementation Steps

**Step 1: Acquire Actual Audio Files**

You have **three options**:

**Option A: Commission Original Music**
- Hire BIPOC composers/artists to create original albums
- Advantage: Full rights ownership
- Timeline: 2-6 months
- Cost: $5,000-$15,000 per album

**Option B: License Existing Music**
- Contact BIPOC artists/labels for licensing
- Advantage: Faster implementation
- Timeline: 2-4 weeks
- Cost: Licensing fees vary

**Option C: Use Creative Commons / Public Domain**
- Find CC-licensed BIPOC music
- Sources: Free Music Archive, ccMixter, Internet Archive
- Advantage: Lower cost
- Limitation: Limited selection

**Step 2: Prepare Audio Files**

Technical specifications for each file:

```
Format: MP3
Bitrate: 320 kbps (high quality)
Sample Rate: 48 kHz
Channels: Stereo
Normalization: -3dB peak
File naming: lowercase-with-hyphens.mp3

Example:
midnight-resonance-album.mp3
black-sound-canada.mp3
inuit-throat-songs.mp3
asian-diaspora-sounds.mp3
creova-sampler-vol1.mp3
```

**Step 3: Choose Hosting Solution**

**Option A: Supabase Storage (Recommended for SEEN)**

You already have Supabase configured. Use Supabase Storage:

```typescript
// Server-side code to upload files
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)

// Create bucket (run once)
await supabase.storage.createBucket('music-audio', {
  public: false, // Private bucket for security
  fileSizeLimit: 104857600 // 100MB limit per file
})

// Upload file
const { data, error } = await supabase.storage
  .from('music-audio')
  .upload('midnight-resonance-album.mp3', audioFile, {
    contentType: 'audio/mpeg'
  })

// Generate signed URL (expires in 1 hour, regenerate as needed)
const { data: signedUrl } = await supabase.storage
  .from('music-audio')
  .createSignedUrl('midnight-resonance-album.mp3', 3600)
```

**Option B: AWS S3 / CloudFront CDN**
- More scalable for large traffic
- Requires AWS account setup
- Cost: ~$0.023 per GB stored + bandwidth

**Option C: Self-Hosted**
- Host on your own server
- Full control
- Requires server administration

**Step 4: Update musicBIPOCCatalog.ts**

After uploading files, update the paths:

**If using Supabase Storage:**
```typescript
// Update musicBIPOCCatalog.ts

// BEFORE:
audioUrl: '/media/music/midnight-resonance-album.mp3',

// AFTER (with Supabase signed URLs):
audioUrl: 'https://your-project.supabase.co/storage/v1/object/sign/music-audio/midnight-resonance-album.mp3?token=SIGNED_TOKEN',

// OR use server endpoint to generate fresh signed URLs:
audioUrl: '/api/music/midnight-resonance-album', // Server generates fresh signed URL
```

**If using external CDN:**
```typescript
audioUrl: 'https://cdn.yourproject.com/music/midnight-resonance-album.mp3',
```

**Step 5: Test Playback**

Test each audio file:
```
1. Load music item in Explore
2. Click to play
3. Verify: Audio plays in-app
4. Verify: No external redirect
5. Verify: Album plays in track order
6. Verify: No autoplay between albums
```

### Temporary Solution: Use Placeholder Audio

While acquiring real music, use temporary placeholder audio:

```typescript
// Use a short public domain audio file as placeholder
// Free Music Archive has CC0 tracks: freemusicarchive.org

// Or create silent audio files for testing:
// ffmpeg -f lavfi -i anullsrc=r=48000:cl=stereo -t 60 -q:a 9 placeholder.mp3
```

---

## TASK 3: FINALIZE NARRATOR CASTING (6 NARRATORS) ⚠️

### Current Status
- **6 narrator profiles defined** (2 English, 2 French, 2 Spanish)
- Voice profiles specified
- Contract requirements complete

### Narrator Profiles Needed

**English Narrator 1: Warm, Intimate, Reflective**
- Voice: Warm, intimate, emotional nuance
- Assigned: Family narratives, memory pieces
- Examples: What We Carry, Letters Never Sent
- Compensation: $500-$1,500 per story (est. 15-30 min audio)

**English Narrator 2: Urgent, Direct, Confrontational**
- Voice: Urgent, direct, controlled intensity
- Assigned: Political histories, resistance narratives
- Examples: Africville, Black Loyalists
- Compensation: $500-$1,500 per story

**French Narrator 1: Calme, Introspectif**
- Voice: Calme, réfléchi, nuances émotionnelles
- Assigned: Récits familiaux, mémoire
- Compensation: $500-$1,500 per story

**French Narrator 2: Dynamique, Engagé**
- Voice: Dynamique, direct, engagé
- Assigned: Histoires politiques, résistance
- Compensation: $500-$1,500 per story

**Spanish Narrator 1: Suave, Reflexivo**
- Voice: Suave, íntimo, matices emocionales
- Assigned: Narrativas familiares, memoria
- Compensation: $500-$1,500 per story

**Spanish Narrator 2: Apasionado, Directo**
- Voice: Apasionado, urgente, directo
- Assigned: Historias políticas, resistencia
- Compensation: $500-$1,500 per story

### Implementation Steps

**Step 1: Create Casting Call**

Post on:
- Voices.com
- Voice123.com
- Canadian voice actor agencies
- BIPOC artist networks
- Radio Canada (for French narrators)
- Latin American voice actor networks (for Spanish)

**Casting Call Template:**

```
VOICE NARRATOR WANTED: Cultural Storytelling Platform

SEEN by CREOVA seeks voice narrators for cultural storytelling platform.

PROJECT: Audio narration for Canadian history and cultural stories
LANGUAGES: English (2 narrators), French (2 narrators), Spanish (2 narrators)
COMPENSATION: $500-$1,500 per story (15-30 min audio)
RIGHTS: Platform-wide usage, perpetual license

NARRATOR 1 (English): Warm, intimate, reflective tone
NARRATOR 2 (English): Urgent, direct, confrontational tone

REQUIREMENTS:
- Professional voice acting experience
- Home studio setup (broadcast quality)
- Canadian narrator preferred (CMF requirement)
- BIPOC narrators strongly encouraged
- Portfolio/demo reel required

TO APPLY:
Submit demo reel with:
1. Warm, reflective reading (2 min sample)
2. Urgent, direct reading (2 min sample)
3. Rates and availability

Email: casting@creova.ca (example)
Deadline: [30 days from posting]
```

**Step 2: Audition Script**

Use this audition script (from Black Loyalists story):

```
REFLECTIVE TONE (for Narrator 1):

"1783. The ship sails north. Away from slavery. Toward what Thomas Peters 
hopes will be home. But the Canada he arrives in is not the Canada he was 
promised. Birchtown, Nova Scotia. This is supposed to be freedom. But it 
looks like survival."

URGENT TONE (for Narrator 2):

"The city claims Africville is a slum. Unlivable. A blight on Halifax. But 
it was the city that made it that way. The city that refused services. The 
city that dumped waste. The city that neglected infrastructure. Now, the 
city wants the land."
```

**Step 3: Review Auditions**

Evaluation criteria:
- ✅ Voice quality (clarity, tone, emotion)
- ✅ Pacing (not too fast, not too slow)
- ✅ Emotional range (can convey nuance)
- ✅ Technical quality (no background noise, good recording)
- ✅ Cultural appropriateness (respectful, dignified)

**Step 4: Negotiate Contracts**

**Contract Terms:**

```
NARRATOR AGREEMENT

1. SCOPE OF WORK
   - Narrate stories for SEEN by CREOVA platform
   - Duration: 15-30 minutes per story
   - Number of stories: [To be determined per assignment]

2. COMPENSATION
   - Rate: $[negotiated rate] per story
   - Payment: Net 30 days upon delivery

3. USAGE RIGHTS
   - Platform-wide usage (SEEN by CREOVA)
   - Perpetual license
   - Multilingual version rights (for translations)
   - Re-recording provisions (for edits/updates at no additional cost)

4. DELIVERABLES
   - Format: WAV (48kHz, 24-bit, stereo)
   - Delivery: Via secure file transfer
   - Timeline: [Agreed schedule]

5. CREDIT
   - Narrator credited in story metadata
   - Bio available in credits section
   - Option for anonymity if requested

6. ACCESSIBILITY
   - Clear pronunciation for screen reader compatibility
   - Consistent volume levels
   - Pauses at logical breaks

7. REVISIONS
   - Up to 2 rounds of revisions included
   - Additional revisions: $[rate] per hour

8. EXCLUSIVITY
   - No exclusivity required
   - Narrator may work on other projects

SIGNATURES:
Narrator: _________________ Date: _______
CREOVA: __________________ Date: _______
```

**Step 5: Recording & Delivery**

**Recording Specifications:**
```
Format: WAV (master), MP3 320kbps (delivery)
Sample Rate: 48kHz
Bit Depth: 24-bit
Channels: Stereo
Normalization: -3dB peak
Noise Floor: <-60dB
Room Tone: 5 seconds at beginning and end
```

**Delivery:**
- Via WeTransfer, Dropbox, or secure FTP
- Include: Raw audio + processed audio
- Naming: `story-id_narrator-name_chapter-number.wav`

---

## TASK 4: COMMISSION AMBIENT AUDIO COMPOSERS ⚠️

### Current Status
- **5 soundscape categories** defined
- Complete briefs ready
- Technical specifications provided

### Soundscape Categories

**1. Urban Night** (3-5 min loop)
**2. Interior Memory Spaces** (2-4 min loop)
**3. Nature / Land** (4-5 min loop)
**4. Transit & Movement** (3-4 min loop)
**5. Abstract Cultural Texture** (2-5 min, can be non-looping)

### Implementation Steps

**Step 1: Find Composers**

Post on:
- SoundCloud (search: "ambient", "soundscape", "field recording")
- Freesound.org (find composers, contact directly)
- BIPOC composer networks
- Canadian music schools (composition departments)
- SOCAN (Society of Composers, Authors and Music Publishers of Canada)

**Composer Call Template:**

```
AMBIENT SOUNDSCAPE COMPOSERS WANTED

SEEN by CREOVA seeks composers for ambient soundscape creation.

PROJECT: 5 ambient soundscapes for cultural storytelling platform
CATEGORIES: Urban Night, Interior Spaces, Nature/Land, Transit, Abstract Texture
COMPENSATION: $300-$800 per soundscape (2-5 min each)
RIGHTS: Platform-wide usage, perpetual license

REQUIREMENTS:
- Experience with ambient/soundscape composition
- Field recording experience (preferred)
- Home studio setup
- Portfolio/demo reel required
- BIPOC composers encouraged to apply

DELIVERABLES:
- 5 soundscapes (2-5 minutes each)
- Format: WAV (48kHz, 24-bit, stereo)
- Seamless loops (where specified)

TO APPLY:
Submit portfolio with ambient/soundscape examples
Email: audio@creova.ca (example)
Deadline: [30 days from posting]
```

**Step 2: Provide Detailed Briefs**

**Brief Example: Urban Night**

```
SOUNDSCAPE BRIEF: Urban Night

DURATION: 3-5 minutes (seamless loop)
EMOTIONAL INTENT: Contemplative, solitary, urban memory

SOUND ELEMENTS:
- Distant traffic (low rumble, occasional car passing)
- Footsteps (occasional, not constant)
- Street ambience (very subtle city hum)
- Occasional urban sounds (distant siren, dog bark, door close)
- Silence/space (important — not overly dense)

REFERENCE TRACKS:
- Brian Eno "Music for Airports"
- Nils Frahm "Late Night Tales"
- Field recording artists: Chris Watson, Jana Winderen

TECHNICAL:
- Must loop seamlessly (fade in/out edges for crossfade)
- Mix level: -15dB to -18dB (will sit under narration)
- Stereo field: Wide but not distracting
- EQ: Roll off below 80Hz (avoid conflict with voice)

USAGE:
- Urban migration stories (Caribbean Migration, Midnight Resonance)
- Night work narratives (Porters story)
- City life memories

DELIVERY:
- WAV (48kHz, 24-bit, stereo)
- Filename: urban-night-loop.wav
```

**Step 3: Review Submissions**

Evaluation criteria:
- ✅ Emotional appropriateness (matches brief intent)
- ✅ Technical quality (clean recordings, proper levels)
- ✅ Seamless looping (no audible seams)
- ✅ Mix compatibility (won't compete with narration)
- ✅ Cultural sensitivity (respectful representation)

**Step 4: Commission Agreement**

**Contract Terms:**

```
COMPOSER AGREEMENT

1. SCOPE OF WORK
   - Create 5 ambient soundscapes per briefs
   - Duration: 2-5 minutes each
   - Seamless loops (where specified)

2. COMPENSATION
   - Rate: $[negotiated rate] per soundscape
   - Total: $[total for 5 soundscapes]
   - Payment: 50% upfront, 50% upon delivery

3. USAGE RIGHTS
   - Platform-wide usage (SEEN by CREOVA)
   - Perpetual, non-exclusive license
   - Composer retains copyright
   - SEEN has right to use, modify, and distribute

4. DELIVERABLES
   - Format: WAV (48kHz, 24-bit, stereo)
   - Delivery: [Date]
   - Includes: Master files + documentation

5. REVISIONS
   - Up to 2 rounds of revisions included
   - Additional revisions: $[rate] per hour

6. CREDIT
   - Composer credited in app
   - Bio available in credits

SIGNATURES:
Composer: _________________ Date: _______
CREOVA: __________________ Date: _______
```

**Step 5: Integration**

After receiving files:

```typescript
// Store in Supabase Storage
await supabase.storage
  .from('ambient-audio')
  .upload('urban-night-loop.wav', audioFile)

// Update Story World with ambient audio assignment
{
  storyId: 'midnight-resonance',
  ambientAudio: {
    filename: 'urban-night-loop.wav',
    category: 'Urban Night',
    mixLevel: -18, // dB
    fadeInDuration: 2000, // ms
    fadeOutDuration: 3000, // ms
  }
}
```

---

## PRODUCTION TIMELINE

**Week 1-2: Film Sourcing**
- Research NFB and other film sources
- Contact creators for permissions
- Extract video IDs
- Update filmsEmbedRegistry.ts
- Test embedding

**Week 2-4: Narrator Casting**
- Post casting calls
- Review auditions (allow 2 weeks for submissions)
- Select 6 narrators
- Negotiate contracts

**Week 3-5: Music Licensing/Commission**
- Contact BIPOC artists for licensing
- OR commission original music
- Acquire audio files
- Set up hosting (Supabase Storage)
- Update musicBIPOCCatalog.ts

**Week 4-8: Ambient Audio Commission**
- Post composer calls
- Review submissions (allow 2 weeks)
- Select composer
- Provide briefs
- Review drafts (2 weeks)
- Final delivery
- Integration

**Week 8-10: Testing & QA**
- Test all film embeds
- Test all music playback
- Test ambient audio integration
- Full accessibility testing
- User acceptance testing

**Week 10-12: Production Launch**
- Final deployment
- Monitor for issues
- Gather user feedback
- Iterate as needed

---

## BUDGET ESTIMATE

**Films:** $0 (using embeddable YouTube) to $5,000 (licensing fees)
**Music:** $5,000-$15,000 (licensing) or $15,000-$50,000 (original commissions)
**Narrators:** $3,000-$9,000 (6 narrators × $500-$1,500 per story × ~1 story each for testing)
**Ambient Audio:** $1,500-$4,000 (5 soundscapes × $300-$800 each)
**Hosting:** $50-$200/month (Supabase Storage or CDN)

**Total Estimated Budget:** $9,550 - $78,200
**Recommended Budget:** $20,000-$30,000 (mid-range quality)

---

## RESOURCES & CONTACTS

**Film Sources:**
- National Film Board: nfb.ca
- CBC Docs: cbc.ca/documentaries
- YouTube Creator Outreach: youtube.com/creators

**Music Licensing:**
- Free Music Archive: freemusicarchive.org
- Creative Commons: search.creativecommons.org
- BIPOC Artist Networks: [research needed]

**Voice Casting:**
- Voices.com
- Voice123.com
- Canadian Voice Actor Networks

**Composer Networks:**
- SoundCloud: soundcloud.com
- Freesound: freesound.org
- SOCAN: socan.com

**Hosting:**
- Supabase Storage: supabase.com/storage (already set up)
- AWS S3: aws.amazon.com/s3
- Cloudflare R2: cloudflare.com/products/r2

---

## ALTERNATIVE: PHASED APPROACH

If budget is limited, implement in phases:

**Phase 1 (Essential): Films Only**
- Replace 2-3 film placeholder IDs with free embeddable content
- Budget: $0-$1,000
- Timeline: 1-2 weeks

**Phase 2 (Core): Films + Music**
- All 5 films + 2-3 music items (Creative Commons)
- Budget: $2,000-$5,000
- Timeline: 4-6 weeks

**Phase 3 (Full): All Content**
- All films, music, narrators, ambient audio
- Budget: $20,000-$30,000
- Timeline: 10-12 weeks

---

## CONCLUSION

These pre-production tasks require **real-world resources**:
- Film creator permissions
- Music licensing or commission
- Professional narrator hiring
- Composer contracts
- Audio hosting infrastructure

**This guide provides all specifications needed to complete these tasks.**

Use this document to:
1. Brief your production team
2. Approach contractors (narrators, composers)
3. Negotiate with content creators
4. Set up technical infrastructure
5. Manage production timeline and budget

**Once real resources are acquired, update the TypeScript files with actual URLs, paths, and metadata as specified in this guide.**

---

**END PRODUCTION IMPLEMENTATION GUIDE**

**Status:** Ready for Real-World Implementation  
**Next Step:** Acquire real-world resources and update files accordingly
