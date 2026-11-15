# AUDIO UPLOAD & INTEGRATION GUIDE
**SEEN by CREOVA — FR/ES Narration Binding**

**Purpose:** Step-by-step instructions for uploading professional narration audio (FR/ES) and binding to story metadata  
**Prerequisite:** Professional FR/ES audio files delivered by voice actors  
**Timeline:** 1-2 weeks from audio delivery to live integration

---

## OVERVIEW

After professional narrators deliver FR/ES audio files, this guide outlines:
1. **File preparation** — Validate format, naming, quality
2. **Supabase upload** — Upload to private buckets
3. **Signed URL generation** — Create accessible URLs
4. **Metadata binding** — Link audio to story chapters
5. **QA validation** — Test playback across languages

---

## PHASE 1: FILE PREPARATION

### Step 1: Receive Audio from Narrators

**Expected Deliverables:**

**French (FR-CA) Narrator:**
- 70 WAV files (Season 2 + Season 3)
- 70 MP3 files (320kbps, normalized to -16 LUFS)
- File naming: `Season{X}_Story{Y}_Chapter{Z}_FR.wav`

**Spanish (ES-LA) Narrator:**
- 70 WAV files (Season 2 + Season 3)
- 70 MP3 files (320kbps, normalized to -16 LUFS)
- File naming: `Season{X}_Story{Y}_Chapter{Z}_ES.wav`

**Total Files:** 280 files (140 WAV + 140 MP3)

### Step 2: Validate File Naming

**Naming Convention:**
```
Season{Season}_Story{StoryNum}_Chapter{ChapterNum}_{LANG}.{ext}
```

**Examples:**
- ✅ `Season2_Story1_Chapter1_FR.wav`
- ✅ `Season2_Story1_Chapter1_ES.mp3`
- ❌ `S2_Story1_Ch1_FR.wav` (incorrect format)
- ❌ `Season2-Story1-Chapter1-FR.wav` (hyphens instead of underscores)

**Validation Script:**

```bash
# Check all files match naming convention
for file in *.wav *.mp3; do
  if [[ ! $file =~ ^Season[0-9]_Story[0-9]_Chapter[0-9]+_(FR|ES)\.(wav|mp3)$ ]]; then
    echo "❌ Invalid filename: $file"
  else
    echo "✅ Valid: $file"
  fi
done
```

### Step 3: Validate Audio Quality

**Technical Checks:**

1. **Format Validation:**
   ```bash
   # Check WAV format
   ffprobe Season2_Story1_Chapter1_FR.wav
   # Should show: 48kHz, mono, 24-bit (or 16-bit acceptable)
   
   # Check MP3 format
   ffprobe Season2_Story1_Chapter1_FR.mp3
   # Should show: 320kbps, mono, 44.1kHz or 48kHz
   ```

2. **Audio Levels:**
   ```bash
   # Check LUFS normalization
   ffmpeg -i Season2_Story1_Chapter1_FR.mp3 -af ebur128 -f null -
   # Integrated loudness should be around -16 LUFS
   ```

3. **Duration Check:**
   - Each chapter should be 2-4 minutes
   - Verify against original EN chapter duration (±10% acceptable)

4. **Quality Listen:**
   - No background noise
   - No clipping or distortion
   - Clean delivery, no mouth clicks

**If Issues Found:**
- Contact narrator for re-delivery
- Document issues in audio QA log
- Do NOT proceed with upload until resolved

---

## PHASE 2: SUPABASE UPLOAD

### Step 1: Create Storage Buckets (One-Time Setup)

**Run Once:**

```typescript
// In Supabase dashboard or via server function
import { createAudioBuckets } from '/supabase/functions/server/audioIntegration.ts';

const results = await createAudioBuckets();
console.log(results);
// Expected output:
// [
//   { bucket: 'creova-audio-narration', status: 'created' },
//   { bucket: 'creova-audio-ambient', status: 'created' }
// ]
```

**Bucket Configuration:**
- **Name:** `creova-audio-narration`
- **Privacy:** Private (signed URLs required)
- **File Size Limit:** 50MB per file
- **Allowed MIME Types:** `audio/wav`, `audio/mpeg`, `audio/mp3`

### Step 2: Upload Files (Batch Process)

**Option A: Upload via Supabase Dashboard (Manual)**

1. Navigate to Supabase Dashboard → Storage
2. Select `creova-audio-narration` bucket
3. Create folder structure:
   ```
   season2/
     s2-black-canadian-renaissance/
     s2-sleeping-car-porters/
     s2-black-womens-archive/
     s2-montreal-black-music/
     s2-africville-memory/
     s2-black-canadian-futures/
   season3/
     s3-diaspora-belonging/
     s3-indigenous-urban/
     [etc.]
   ```
4. Upload files to corresponding folders
5. Rename files to match convention: `{chapterId}_{lang}.mp3`
   - Example: `s2-renaissance-ch1_fr.mp3`

**Option B: Upload via Server Function (Automated)**

```typescript
// In server or admin script
import { batchUploadNarration } from '/supabase/functions/server/audioIntegration.ts';

// Example: Upload Season 2, Story 1 (French)
const files = [
  {
    chapterId: 's2-renaissance-ch1',
    language: 'fr',
    file: await Deno.readFile('./Season2_Story1_Chapter1_FR.mp3'),
  },
  {
    chapterId: 's2-renaissance-ch2',
    language: 'fr',
    file: await Deno.readFile('./Season2_Story1_Chapter2_FR.mp3'),
  },
  // ... repeat for all chapters
];

const results = await batchUploadNarration(2, 's2-black-canadian-renaissance', files);

console.log('Success:', results.success.length);
console.log('Failed:', results.failed.length);
```

**Upload Checklist:**
- [ ] All 35 Season 2 FR files uploaded
- [ ] All 35 Season 2 ES files uploaded
- [ ] All 35 Season 3 FR files uploaded (when ready)
- [ ] All 35 Season 3 ES files uploaded (when ready)

### Step 3: Generate Signed URLs

**For Each Uploaded File:**

```typescript
import { regenerateSignedUrl } from '/supabase/functions/server/audioIntegration.ts';

// Generate signed URL (expires in 1 year)
const signedUrl = await regenerateSignedUrl(
  'creova-audio-narration',
  'season2/s2-black-canadian-renaissance/s2-renaissance-ch1_fr.mp3',
  31536000, // 1 year in seconds
);

console.log('Signed URL:', signedUrl);
// Example output: https://[supabase-url]/storage/v1/object/sign/creova-audio-narration/season2/...?token=...
```

**Bulk URL Generation:**

```typescript
// Generate signed URLs for all Season 2, Story 1 files
const season = 2;
const storyId = 's2-black-canadian-renaissance';
const chapters = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'];
const languages = ['fr', 'es'];

const urls = [];

for (const chapter of chapters) {
  for (const lang of languages) {
    const filePath = `season${season}/${storyId}/${storyId}-${chapter}_${lang}.mp3`;
    const signedUrl = await regenerateSignedUrl('creova-audio-narration', filePath);
    
    urls.push({
      season,
      storyId,
      chapterId: `${storyId}-${chapter}`,
      language: lang,
      signedUrl,
    });
  }
}

console.log('Generated URLs:', urls.length);
```

---

## PHASE 3: METADATA BINDING

### Step 1: Register Audio in KV Store

**For Each Chapter:**

```typescript
import { updateAudioUrl } from '/supabase/functions/server/audioIntegration.ts';

// Register FR audio for Season 2, Story 1, Chapter 1
await updateAudioUrl(
  2, // season
  's2-black-canadian-renaissance', // storyId
  's2-renaissance-ch1', // chapterId
  'fr', // language
  'https://[supabase-url]/storage/v1/object/sign/...' // signedUrl
);

// Register ES audio for same chapter
await updateAudioUrl(
  2,
  's2-black-canadian-renaissance',
  's2-renaissance-ch1',
  'es',
  'https://[supabase-url]/storage/v1/object/sign/...'
);
```

**Bulk Registration:**

```typescript
// Register all URLs from previous step
for (const { season, storyId, chapterId, language, signedUrl } of urls) {
  await updateAudioUrl(season, storyId, chapterId, language, signedUrl);
  console.log(`✓ Registered ${chapterId} (${language})`);
}
```

### Step 2: Update Story Data Files

**Manually Update Story Exports:**

```typescript
// Example: /src/app/data/season2ExpandedChapters.ts
export const STORY_BLACK_CANADIAN_RENAISSANCE: ExpandedStoryWorld = {
  storyWorldId: 's2-black-canadian-renaissance',
  chapters: [
    {
      chapterId: 's2-renaissance-ch1',
      audioUrl: {
        en: null, // To be added when EN narration recorded
        fr: 'https://[supabase-url]/storage/v1/object/sign/season2/s2-black-canadian-renaissance/s2-renaissance-ch1_fr.mp3?token=...',
        es: 'https://[supabase-url]/storage/v1/object/sign/season2/s2-black-canadian-renaissance/s2-renaissance-ch1_es.mp3?token=...',
      },
      // ... rest of chapter data
    },
  ],
};
```

**Automated Update via Script:**

```typescript
// Generate TypeScript code to update story files
const storyUpdates = urls.map(({ chapterId, language, signedUrl }) => {
  return `audioUrl.${language} = '${signedUrl}';`;
});

console.log(storyUpdates.join('\n'));
// Copy output and paste into story data files
```

---

## PHASE 4: VALIDATION & QA

### Step 1: Validate Audio Registry

```typescript
import { validateAudioIntegration } from '/supabase/functions/server/audioIntegration.ts';

// Validate Season 2, Story 1
const report = await validateAudioIntegration(
  2, // season
  's2-black-canadian-renaissance', // storyId
  ['s2-renaissance-ch1', 's2-renaissance-ch2', 's2-renaissance-ch3', 's2-renaissance-ch4', 's2-renaissance-ch5', 's2-renaissance-ch6'], // chapterIds
  ['fr', 'es'], // languages to validate
);

console.log('Validation Report:');
console.log('Total expected:', report.total); // 6 chapters × 2 languages = 12
console.log('Validated:', report.validated);
console.log('Missing:', report.missing);
console.log('Errors:', report.errors);
```

**Expected Output (Success):**
```
Validation Report:
Total expected: 12
Validated: 12
Missing: []
Errors: []
```

### Step 2: Test Audio Playback in App

**Manual QA Checklist:**

**Language Switching:**
- [ ] Switch app language to FR → audio plays in French
- [ ] Switch app language to ES → audio plays in Spanish
- [ ] Switch app language to EN → fallback to EN audio (if available) or text-only

**Audio Player:**
- [ ] Audio loads without errors
- [ ] Play/pause controls work
- [ ] Resume position persists across sessions
- [ ] Progress bar shows correct duration
- [ ] Audio quality is clear (no distortion, noise)

**Cross-Device Testing:**
- [ ] Test on Chrome (desktop)
- [ ] Test on Firefox (desktop)
- [ ] Test on Safari (desktop)
- [ ] Test on iOS Safari (mobile)
- [ ] Test on Android Chrome (mobile)

**Edge Cases:**
- [ ] Test with slow internet (3G simulation)
- [ ] Test audio playback while navigating between chapters
- [ ] Test audio playback with ambient audio (if enabled)
- [ ] Test signed URL expiration (should regenerate automatically)

### Step 3: Community Beta Testing

**Recruit Beta Testers:**
- 3-5 native FR speakers (preferably Franco-Canadian)
- 3-5 native ES speakers (diverse Latin American backgrounds)

**Beta Test Objectives:**
1. **Language Quality:**
   - Does narration sound natural?
   - Are there pronunciation errors?
   - Is pacing appropriate?

2. **Cultural Accuracy:**
   - Do translations preserve meaning?
   - Are culturally sensitive terms handled appropriately?
   - Does narration respect story tone?

3. **Technical Quality:**
   - Audio quality acceptable?
   - Playback smooth and reliable?
   - Any bugs or errors?

**Beta Feedback Form:**
- Story/chapter tested
- Audio quality rating (1-5)
- Narration quality rating (1-5)
- Translation accuracy rating (1-5)
- Issues encountered
- Suggestions for improvement

---

## PHASE 5: LAUNCH PREPARATION

### Step 1: Final QA Sign-Off

**Checklist:**
- [ ] All 70 FR audio files uploaded and validated
- [ ] All 70 ES audio files uploaded and validated
- [ ] Audio registry complete in KV store
- [ ] Story metadata updated with signed URLs
- [ ] Playback tested across devices
- [ ] Community beta feedback reviewed
- [ ] Any critical issues resolved

### Step 2: Monitoring & Analytics

**Track:**
- Audio playback completion rates (per language)
- Language switching frequency
- Audio load times (performance)
- Error rates (failed loads, signed URL issues)

**Alerts:**
- Set up monitoring for signed URL expiration (before 1-year mark)
- Alert on high error rates (>5% failed loads)
- Monitor Supabase storage usage

### Step 3: Signed URL Maintenance

**Signed URLs expire after 1 year.**

**Renewal Process (Run 1 month before expiration):**

```typescript
// Bulk regenerate signed URLs for all audio
import { regenerateSignedUrl } from '/supabase/functions/server/audioIntegration.ts';

const allFiles = [
  'season2/s2-black-canadian-renaissance/s2-renaissance-ch1_fr.mp3',
  'season2/s2-black-canadian-renaissance/s2-renaissance-ch1_es.mp3',
  // ... all 140 files
];

for (const filePath of allFiles) {
  const newUrl = await regenerateSignedUrl('creova-audio-narration', filePath);
  
  // Update KV store with new URL
  // (extract season, storyId, chapterId, language from filePath)
  // await updateAudioUrl(season, storyId, chapterId, language, newUrl);
  
  console.log(`✓ Renewed: ${filePath}`);
}
```

**Schedule:** Set calendar reminder for 11 months after initial upload

---

## TROUBLESHOOTING

### Issue: Upload Fails (403 Forbidden)

**Cause:** Service role key not configured or bucket permissions incorrect

**Solution:**
```typescript
// Verify environment variable
console.log('SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'Set' : 'Missing');

// Check bucket permissions in Supabase dashboard
// Ensure bucket is private and Service Role has write access
```

### Issue: Signed URL Returns 404

**Cause:** File path incorrect or file not uploaded

**Solution:**
```typescript
// List files in bucket to verify path
const { data } = await supabase.storage.from('creova-audio-narration').list('season2/s2-black-canadian-renaissance');
console.log('Files:', data);

// Verify exact file path matches uploaded file
```

### Issue: Audio Does Not Play in App

**Cause:** CORS issue or signed URL expired

**Solution:**
1. Check Supabase CORS settings (allow app domain)
2. Verify signed URL not expired (check expiration timestamp)
3. Regenerate signed URL if needed
4. Test URL directly in browser (should download/play audio)

### Issue: Wrong Audio Plays After Language Switch

**Cause:** Language selection not properly bound to audio URL

**Solution:**
```typescript
// Verify language-specific URLs are correct
const registry = await getAudioRegistry(2, 's2-black-canadian-renaissance', 's2-renaissance-ch1');
console.log('Audio URLs:', registry?.audioUrls);
// Should show:
// { en: null, fr: '...', es: '...' }
```

---

## COMPLETION CHECKLIST

**Season 2 FR/ES Audio Integration:**
- [ ] 35 FR audio files uploaded (Season 2)
- [ ] 35 ES audio files uploaded (Season 2)
- [ ] 70 signed URLs generated
- [ ] Audio registry updated (KV store)
- [ ] Story metadata updated (TypeScript files)
- [ ] Validation report: 100% validated
- [ ] QA testing: All tests passed
- [ ] Community beta testing: Feedback reviewed
- [ ] Launch-ready

**Season 3 FR/ES Audio Integration (After Translation Complete):**
- [ ] 35 FR audio files uploaded (Season 3)
- [ ] 35 ES audio files uploaded (Season 3)
- [ ] Same process as Season 2

---

## CONTACT & SUPPORT

**Technical Issues:**
- Supabase storage errors → [DevOps team]
- Audio playback bugs → [Frontend developer]

**Content Issues:**
- Audio quality problems → Contact narrator for re-recording
- Translation errors → Contact translator for revision

**Timeline:**
- Expected completion: 1-2 weeks from audio delivery

---

**END AUDIO UPLOAD & INTEGRATION GUIDE**

**Status:** Framework ready, awaiting professional FR/ES audio delivery  
**Next Action:** Receive audio from narrators, begin Phase 1 validation
