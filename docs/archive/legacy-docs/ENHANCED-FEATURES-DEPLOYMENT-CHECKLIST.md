# ENHANCED FEATURES — DEPLOYMENT CHECKLIST
**SEEN by CREOVA — Production Readiness Guide**

**Purpose:** Step-by-step checklist for deploying all 11 enhanced features  
**Timeline:** 12 weeks (Phases 1-6)  
**Status:** Ready for Phase 1

---

## PRE-DEPLOYMENT CHECKLIST

### Prerequisites ✅
- [x] All type definitions complete (`/src/app/types/enhancedFeatures.ts`)
- [x] All backend logic complete (`/supabase/functions/server/enhancedFeatures.ts`)
- [x] All frontend hooks complete (`/src/app/hooks/useEnhancedFeatures.ts`)
- [x] All admin UI complete (`/src/app/admin/AdminEnhancedFeatures.tsx`)
- [x] Sample data prepared (`/src/app/data/sampleEnhancedFeaturesData.ts`)
- [x] Documentation complete (implementation guide, validation report, CMF appendix, use cases)

### Environment Setup
- [ ] Supabase project configured
- [ ] KV store initialized
- [ ] Service role key configured (`SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Anon key configured (`SUPABASE_ANON_KEY`)
- [ ] Storage buckets created (`creova-audio-narration`, `creova-audio-ambient`)

---

## PHASE 1: DATA MIGRATION (WEEK 1-2)

### Week 1: Context Cards & Collections

**Day 1-2: Context Cards**
- [ ] Import sample context cards data
  ```bash
  npm run migrate:context-cards
  ```
- [ ] Verify KV store keys created:
  - `context-card:context-africville`
  - `context-card:context-sleeping-car-porter`
  - `context-card:context-underground-railroad`
- [ ] Test retrieval:
  ```bash
  curl ${API_BASE}/context-card/context-africville?level=1
  ```
- [ ] Validate multilingual support (EN/FR/ES)

**Day 3-4: Institutional Collections**
- [ ] Import sample collections:
  ```bash
  npm run migrate:collections
  ```
- [ ] Verify collections created:
  - `collection-black-labor-history`
  - `collection-diaspora-belonging`
  - `collection-indigenous-futures`
- [ ] Test collection retrieval
- [ ] Validate discussion prompts

**Day 5: Creator Notes**
- [ ] Import creator notes:
  ```bash
  npm run migrate:creator-notes
  ```
- [ ] Verify notes linked to stories:
  - `note-s2-sleeping-car-porters`
  - `note-s3-diaspora-belonging`

### Week 2: Seasonal Framing & Rights

**Day 6-7: Seasonal Editorial Framing**
- [ ] Import seasonal framing:
  ```bash
  npm run migrate:seasonal-framing
  ```
- [ ] Verify framing for Seasons 2-4
- [ ] Test display-once logic

**Day 8-9: Content Rights**
- [ ] Import content rights metadata (admin only):
  ```bash
  npm run migrate:content-rights
  ```
- [ ] Verify rights for all stories
- [ ] Test usage restrictions

**Day 10: Offline Packs**
- [ ] Create offline pack bundles:
  ```bash
  npm run generate:offline-packs
  ```
- [ ] Upload to Supabase storage
- [ ] Generate signed URLs
- [ ] Verify pack metadata

---

## PHASE 2: BACKEND INTEGRATION (WEEK 3-4)

### Week 3: Server Routes

**API Routes to Implement:**

1. **Context Cards**
   - [ ] `GET /context-card/:id` — Fetch context card
   - [ ] `GET /context-cards/story/:storyId` — Fetch all cards for story
   - [ ] `POST /admin/context-card` — Create/update card (admin only)

2. **Reading Preferences**
   - [ ] `GET /reading-preferences/:userId` — Fetch preferences
   - [ ] `PUT /reading-preferences/:userId` — Update preferences
   - [ ] `POST /consumption-state/:userId` — Save chapter state

3. **Collections**
   - [ ] `GET /collections/public` — List public collections
   - [ ] `GET /collections/:id` — Fetch collection
   - [ ] `POST /admin/collections` — Create collection (admin only)

4. **Analytics**
   - [ ] `POST /analytics/story-start` — Record story start
   - [ ] `POST /analytics/story-completion` — Record completion
   - [ ] `POST /analytics/audio-listening` — Record audio duration
   - [ ] `GET /admin/cmf-report` — Generate CMF report (admin only)

5. **Creator Notes**
   - [ ] `GET /creator-note/:storyWorldId` — Fetch creator note

6. **Community Reflections**
   - [ ] `POST /reflections/submit` — Submit reflection
   - [ ] `GET /reflections/chapter/:chapterId` — Fetch approved reflections
   - [ ] `GET /admin/reflections/pending` — Fetch pending (admin only)
   - [ ] `POST /admin/reflections/:id/moderate` — Moderate reflection (admin only)

7. **Offline Packs**
   - [ ] `GET /offline-packs` — List packs

8. **Multi-Narrator**
   - [ ] `GET /narration-tracks/:chapterId/:language` — Fetch tracks

9. **Seasonal Framing**
   - [ ] `GET /seasonal-framing/:season` — Fetch framing

10. **Feature Preferences**
    - [ ] `GET /feature-preferences/:userId` — Fetch preferences
    - [ ] `PUT /feature-preferences/:userId` — Update preferences

### Week 4: Testing & Validation

**Backend Tests:**
- [ ] Unit tests for all backend functions
- [ ] Integration tests for API routes
- [ ] Load testing (100 concurrent users)
- [ ] Privacy validation (no PII leakage)

**Performance Benchmarks:**
- [ ] Context card retrieval: < 50ms
- [ ] Collection listing: < 100ms
- [ ] Analytics recording: < 200ms
- [ ] Reflection submission: < 300ms

---

## PHASE 3: FRONTEND INTEGRATION (WEEK 5-6)

### Week 5: Component Integration

**Existing Components to Connect:**

1. **Context Card Component**
   ```tsx
   import { useContextCard } from '../hooks/useEnhancedFeatures';
   
   // Add progressive depth (Level 1 → 2 → 3)
   // Use existing Context Card UI, add "Learn More" button
   ```

2. **Audio Player**
   ```tsx
   import { useReadingPreferences, useChapterConsumption } from '../hooks/useEnhancedFeatures';
   
   // Add consumption mode support
   // Add resume position tracking
   // Add speed control
   ```

3. **Explore Section**
   ```tsx
   import { usePublicCollections } from '../hooks/useEnhancedFeatures';
   
   // Add institutional collections tab
   // Use existing card layout
   ```

4. **Story Completion Screen**
   ```tsx
   import { useCreatorNote } from '../hooks/useEnhancedFeatures';
   
   // Show creator note after last chapter
   // Use existing typography
   ```

5. **Chapter Footer**
   ```tsx
   import { useChapterReflections } from '../hooks/useEnhancedFeatures';
   
   // Show approved reflections
   // Add submission form (text-only)
   ```

### Week 6: User Settings

**Settings Screen Updates:**
- [ ] Add "Consumption Mode" toggle (read-only, listen-only, read+listen)
- [ ] Add "Audio Speed" slider (0.75x - 2.0x)
- [ ] Add "Enable Enhanced Context Cards" toggle
- [ ] Add "Show Creator Notes" toggle
- [ ] Add "Enable Community Reflections" toggle
- [ ] Add "Analytics Opt-In" toggle

**NO NEW SCREENS** — All settings use existing Settings UI

---

## PHASE 4: MODERATION SETUP (WEEK 7-8)

### Week 7: Moderator Training

**Hire/Assign Moderators:**
- [ ] 2-3 moderators (part-time or full-time)
- [ ] Cultural sensitivity training
- [ ] Platform training (moderation dashboard)

**Moderation Guidelines:**
- [ ] Create moderation rubric
  - Cultural sensitivity (respect for BIPOC communities)
  - Harm prevention (no hate speech, harassment)
  - Accessibility (inclusive language)
  - Restorative care (community-building, not divisive)
- [ ] Create escalation process (flagged content)
- [ ] Define response times (24-48 hours for moderation)

### Week 8: Pilot Community Reflections

**Soft Launch:**
- [ ] Enable Community Reflections for 1 story (pilot)
- [ ] Invite 20-30 beta testers
- [ ] Monitor submissions
- [ ] Test moderation workflow
- [ ] Collect feedback

**Success Metrics:**
- [ ] 80%+ approval rate (well-moderated)
- [ ] No toxic content published
- [ ] Positive user feedback

---

## PHASE 5: INSTITUTIONAL ROLLOUT (WEEK 9-10)

### Week 9: Partner Onboarding

**Institutional Partners (Pilot):**
1. **Dalhousie University (African Diaspora Studies)**
   - [ ] Onboard contact person
   - [ ] Create "Black Canadian History" collection
   - [ ] Verify context cards (institution annotation)
   - [ ] Test offline pack download

2. **University of Toronto (Black Canadian Studies)**
   - [ ] Create "Labor Organizing" collection
   - [ ] Add discussion prompts
   - [ ] Test collection in course

3. **Winnipeg Art Gallery (Inuit Art Centre)**
   - [ ] Create "Indigenous Futures" collection
   - [ ] Add curatorial framing
   - [ ] Test with students

### Week 10: Educator Training

**Webinar for Educators:**
- [ ] How to use institutional collections
- [ ] How to assign stories to students
- [ ] How to use discussion prompts
- [ ] How to download offline packs

**Materials:**
- [ ] Educator guide (PDF)
- [ ] Video tutorial (10 min)
- [ ] FAQ document

---

## PHASE 6: LAUNCH & MONITORING (WEEK 11-12)

### Week 11: Soft Launch

**Enable Features (Opt-In):**
- [ ] Enhanced Context Cards → ON (all users)
- [ ] Creator Notes → ON (all users)
- [ ] Seasonal Editorial Framing → ON (all users)
- [ ] Institutional Collections → ON (all users)
- [ ] Community Reflections → OFF (opt-in only)
- [ ] Offline Packs → ON (all users)
- [ ] Multi-Narrator → OFF (when tracks available)
- [ ] Analytics → OFF (opt-in only)

**Monitoring:**
- [ ] Set up error tracking (Sentry or similar)
- [ ] Set up performance monitoring (Supabase dashboard)
- [ ] Set up analytics opt-in tracking (aggregate only)

### Week 12: Full Launch

**Public Announcement:**
- [ ] Blog post announcing enhanced features
- [ ] Social media campaign
- [ ] Email to users (opt-in for new features)

**CMF Reporting:**
- [ ] Generate first CMF report (baseline)
- [ ] Share with stakeholders

**Feedback Collection:**
- [ ] User survey (Google Forms or Typeform)
- [ ] Educator feedback sessions
- [ ] Moderator debriefs

---

## POST-LAUNCH: MAINTENANCE & ITERATION

### Monthly Tasks

**Moderation Queue:**
- [ ] Review pending reflections (daily)
- [ ] Update moderation guidelines (monthly)

**Context Cards:**
- [ ] Add new context cards as stories added
- [ ] Update institution annotations (quarterly)

**Collections:**
- [ ] Add new collections (2-3 per month)
- [ ] Update existing collections (as stories added)

**Analytics:**
- [ ] Generate CMF report (quarterly)
- [ ] Share with team (monthly)

**Offline Packs:**
- [ ] Regenerate packs (when stories updated)
- [ ] Renew signed URLs (annually)

### Feature Expansion

**3 Months:**
- [ ] Add multi-narrator tracks (when narrators available)
- [ ] Expand community reflections to more stories
- [ ] Add more institutional partners

**6 Months:**
- [ ] Generate first annual CMF report
- [ ] Review analytics opt-in rates
- [ ] Scale moderation team if needed

**12 Months:**
- [ ] Evaluate feature adoption
- [ ] Iterate based on user feedback
- [ ] Expand to Season 5

---

## VALIDATION CHECKLIST (FINAL)

### UI/UX Compliance ✅
- [ ] ZERO new screens created
- [ ] ZERO new tabs created
- [ ] ZERO typography changes
- [ ] ZERO spacing changes
- [ ] ZERO layout modifications
- [ ] Uses existing components ONLY

### Privacy Compliance ✅
- [ ] Analytics: Aggregate-only (NO individual tracking)
- [ ] Community Reflections: Anonymous (one-way hash)
- [ ] NO cookies beyond session management
- [ ] NO third-party analytics
- [ ] User opt-out available

### CMF Compliance ✅
- [ ] Multilingual support (EN/FR/ES)
- [ ] Cultural appropriateness (moderated)
- [ ] Educational scaffolding (collections, prompts)
- [ ] Equitable access (offline packs)
- [ ] CMF reporting enabled

### Performance ✅
- [ ] Page load time < 2 seconds
- [ ] API response time < 200ms
- [ ] Audio streaming optimized
- [ ] Offline packs < 500MB each

---

## ROLLBACK PLAN

**If Issues Arise:**

1. **Disable Feature:**
   ```tsx
   // Admin Dashboard → Feature Toggles → Disable problematic feature
   ```

2. **Rollback Database:**
   ```bash
   npm run rollback:kv-store
   ```

3. **Notify Users:**
   - Email to affected users
   - Status page update

4. **Debug & Fix:**
   - Review error logs
   - Fix backend logic
   - Test thoroughly
   - Re-enable feature

---

## SUCCESS CRITERIA

### Week 12 (Launch)
- [ ] All features deployed
- [ ] ZERO critical bugs
- [ ] 90%+ uptime
- [ ] 500+ users engaged with new features

### Month 3
- [ ] 1,000+ context card views
- [ ] 100+ community reflections submitted
- [ ] 10+ institutional collections created
- [ ] 80%+ user satisfaction

### Month 6
- [ ] CMF report generated (full data)
- [ ] 5,000+ story completions with analytics opt-in
- [ ] 30%+ French engagement
- [ ] 15%+ Spanish engagement

---

## TEAM ASSIGNMENTS

| Role | Responsible For | Contact |
|------|-----------------|---------|
| **Backend Developer** | API routes, KV store, analytics | backend@creova.ca |
| **Frontend Developer** | Component integration, hooks | frontend@creova.ca |
| **Admin/Content Manager** | Context cards, collections | content@creova.ca |
| **Moderators (2-3)** | Community reflections | moderation@creova.ca |
| **DevOps** | Deployment, monitoring | devops@creova.ca |
| **QA Lead** | Testing, validation | qa@creova.ca |
| **Project Manager** | Timeline, coordination | pm@creova.ca |

---

## FINAL SIGN-OFF

**Before Launch:**
- [ ] Technical lead sign-off (all systems operational)
- [ ] Content lead sign-off (sample data populated)
- [ ] Privacy lead sign-off (no PII leakage)
- [ ] CMF liaison sign-off (grant compliance)
- [ ] Executive sign-off (budget, timeline approved)

---

**END DEPLOYMENT CHECKLIST**

**Status:** Ready for Phase 1 (Data Migration)  
**Next Action:** Begin Week 1 — Context Cards & Collections  
**Timeline:** 12 weeks to full launch
