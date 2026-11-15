# CMF DEMO VALIDATION CHECKLIST
**SEEN by CREOVA — Production Demo Readiness**

**Purpose:** Ensure platform is safe for CMF demonstration  
**Audience:** CMF stakeholders, government reviewers, institutional partners  
**Date:** February 6, 2026  
**Status:** READY FOR VALIDATION

---

## 🎯 DEMO OBJECTIVES

### What CMF Wants to See:
1. **Multilingual Platform** — Seamless EN/FR/ES switching
2. **Cultural Content** — BIPOC, Indigenous, diaspora stories
3. **Educational Value** — Institutional partnerships, collections
4. **Accessibility** — Multiple consumption modes
5. **Privacy Compliance** — No individual user tracking
6. **Technical Excellence** — Stable, polished, professional

### What We Must Avoid:
- ❌ App crashes or errors
- ❌ Language switching failures
- ❌ Broken audio/media playback
- ❌ Blank screens or missing content
- ❌ Privacy concerns (visible user data)
- ❌ Unprofessional UI bugs

---

## 📋 PRE-DEMO VALIDATION (48 HOURS BEFORE)

### ✅ CRITICAL PATH TESTING

**Test 1: App Loading**
- [ ] App loads in < 2 seconds
- [ ] No console errors
- [ ] No blank screens
- [ ] SEEN logo visible
- [ ] Navigation bar present

**Test 2: For You Tab**
- [ ] Story cards load
- [ ] Story thumbnails display
- [ ] Tap opens Story World
- [ ] No broken images
- [ ] No placeholder content

**Test 3: Language Switching (CRITICAL)**
- [ ] English → French works instantly
- [ ] French → Spanish works instantly
- [ ] Spanish → English works instantly
- [ ] All UI text updates
- [ ] No app reload required
- [ ] No mixed language content

**Test 4: Story Flow**
- [ ] Story opens from card tap
- [ ] Chapter list loads
- [ ] Chapter 1 opens correctly
- [ ] Text content readable
- [ ] Audio plays (if available)
- [ ] Next chapter navigation works

**Test 5: Audio Playback**
- [ ] EN narration plays
- [ ] FR narration plays (if available)
- [ ] ES narration plays (if available)
- [ ] Play/pause works
- [ ] Audio quality acceptable
- [ ] No stuttering or glitches

**Test 6: Explore Tab**
- [ ] Stories load
- [ ] Films load
- [ ] Music loads
- [ ] Collections load
- [ ] Content type distinction clear
- [ ] Tap opens correct content

**Test 7: Library Tab**
- [ ] In-progress stories show
- [ ] Progress percentage accurate
- [ ] Resume works correctly
- [ ] Empty state shows if no stories
- [ ] No duplicate entries

**Test 8: Profile Tab**
- [ ] Language selector works
- [ ] Settings accessible
- [ ] About screen works
- [ ] Logout works (if demo account)
- [ ] No user PII visible

---

## 🌐 MULTILINGUAL VALIDATION (CMF REQUIREMENT)

### English (EN) Testing
- [ ] All UI text in English
- [ ] Story content in English
- [ ] Audio narration in English
- [ ] No French/Spanish leakage
- [ ] Grammar correct
- [ ] Terminology consistent

### French (FR) Testing
- [ ] All UI text in French
- [ ] Story content in French
- [ ] Audio narration in French (or fallback to EN)
- [ ] No English/Spanish leakage
- [ ] Grammar correct
- [ ] Québec French standard (not European)
- [ ] Accents render correctly (é, à, ô, etc.)

### Spanish (ES) Testing
- [ ] All UI text in Spanish
- [ ] Story content in Spanish
- [ ] Audio narration in Spanish (or fallback to EN)
- [ ] No English/French leakage
- [ ] Grammar correct
- [ ] Terminology consistent
- [ ] Accents render correctly (ñ, á, í, ó, ú)

### Language Switching Speed
- [ ] EN → FR: < 1 second
- [ ] FR → ES: < 1 second
- [ ] ES → EN: < 1 second
- [ ] No visual flicker
- [ ] No content reload
- [ ] Progress preserved

---

## 🎨 CULTURAL CONTENT VALIDATION

### Story Representation
- [ ] Black Canadian stories visible
- [ ] Indigenous stories visible
- [ ] Diaspora stories visible
- [ ] Content culturally appropriate
- [ ] No stereotypes or tokenism
- [ ] Creator attribution present

### Context Cards (If Enabled)
- [ ] Historical context accurate
- [ ] Institution verification visible
- [ ] Sources cited correctly
- [ ] No cultural appropriation
- [ ] Respectful language

### Community Reflections (If Enabled)
- [ ] Moderation working
- [ ] No toxic content visible
- [ ] Anonymous submissions
- [ ] Care-based framing clear

---

## 🎓 EDUCATIONAL VALUE VALIDATION

### Institutional Collections
- [ ] Collections visible in Explore
- [ ] Curated by institutions
- [ ] Discussion prompts present
- [ ] Educational framing clear
- [ ] Suggested reading order works

### Creator Notes
- [ ] Show after story completion
- [ ] Attribution clear
- [ ] Research process transparent
- [ ] No commercial language

### Offline Packs (If Enabled)
- [ ] Download buttons work
- [ ] File size displayed
- [ ] Languages indicated
- [ ] No broken links

---

## ♿ ACCESSIBILITY VALIDATION

### Consumption Modes
- [ ] Read-only mode works
- [ ] Listen-only mode works
- [ ] Read + Listen mode works
- [ ] Mode switch instant
- [ ] No broken layouts

### Audio Controls
- [ ] Speed adjustment works (0.75x - 2.0x)
- [ ] Volume control works
- [ ] Ambient audio toggle works
- [ ] Resume position works

### Visual Accessibility
- [ ] Text readable (contrast)
- [ ] Font sizes appropriate
- [ ] No tiny tap targets
- [ ] High contrast mode (OS-level)

---

## 🔒 PRIVACY VALIDATION (CMF COMPLIANCE)

### Analytics (If Enabled)
- [ ] Aggregate-only metrics
- [ ] No individual user IDs visible
- [ ] Opt-in required
- [ ] CMF reporting available
- [ ] No third-party trackers

### Community Submissions
- [ ] Anonymous submissions
- [ ] One-way hash only
- [ ] No profile data exposed
- [ ] Moderation queue private

### User Data
- [ ] No PII in demo account
- [ ] No email addresses visible
- [ ] No IP addresses logged
- [ ] No session tracking visible

---

## 🎬 DEMO SCENARIO WALKTHROUGHS

### Scenario 1: New User Experience (5 minutes)
**Goal:** Show onboarding and first story

1. Open app → SEEN splash screen
2. Language selection → Choose English
3. For You tab → See curated stories
4. Tap Story card → Story World opens
5. Tap Chapter 1 → Chapter loads
6. Read/listen → Content engaging
7. Tap Next Chapter → Chapter 2 loads
8. Return to For You → Navigation works

**Pass Criteria:**
- ✅ Smooth flow (no errors)
- ✅ Content loads quickly
- ✅ Audio plays correctly
- ✅ Navigation intuitive

---

### Scenario 2: Multilingual Demonstration (3 minutes)
**Goal:** Prove trilingual capability

1. Open app in English
2. Navigate to Profile → Language settings
3. Switch to French → UI updates instantly
4. Open story → French narration plays
5. Switch to Spanish → UI updates instantly
6. Return to English → No issues

**Pass Criteria:**
- ✅ Instant switching (no reload)
- ✅ All text updates correctly
- ✅ Audio language syncs
- ✅ Progress preserved

---

### Scenario 3: Educational Partnership (4 minutes)
**Goal:** Show institutional collection

1. Navigate to Explore → Collections
2. Tap "Black Canadian Labor History" collection
3. See curatorial framing
4. See discussion prompts
5. Open Story 2.2 (Sleeping Car Porters)
6. Show context cards (Level 1 → 2 → 3)
7. Show institution verification
8. Return to collection

**Pass Criteria:**
- ✅ Collection well-curated
- ✅ Discussion prompts clear
- ✅ Context cards educational
- ✅ Institution attribution visible

---

### Scenario 4: Accessibility Features (3 minutes)
**Goal:** Show multiple consumption modes

1. Open chapter in Read + Listen mode
2. Play audio → Narration plays
3. Switch to Listen-only mode → Text minimized
4. Adjust audio speed → 1.5x works
5. Switch to Read-only mode → Audio hidden
6. Return to Read + Listen → Both visible

**Pass Criteria:**
- ✅ Mode switching instant
- ✅ No broken layouts
- ✅ Audio controls work
- ✅ Text remains readable

---

### Scenario 5: Cultural Impact (2 minutes)
**Goal:** Show community engagement

1. Navigate to Library → Completed stories
2. Show Creator Note → Attribution clear
3. Navigate to Profile → Show analytics (if admin)
4. Show aggregate metrics → No individual data
5. Show moderation queue → Care-based

**Pass Criteria:**
- ✅ Creator attribution visible
- ✅ Privacy preserved
- ✅ Community care evident

---

## 🚨 FAILURE SCENARIOS & RESPONSES

### If App Crashes During Demo

**Immediate Response:**
1. Apologize professionally
2. Reload app (< 5 seconds)
3. Continue from last known state
4. Acknowledge issue calmly

**Follow-Up:**
- Log crash details
- Email CMF within 24 hours
- Provide fix timeline

---

### If Language Switching Fails

**Immediate Response:**
1. Acknowledge issue
2. Manually reload app
3. Show it works on second try
4. Emphasize it's a known edge case

**Follow-Up:**
- Critical bug - fix immediately
- Re-test before next demo

---

### If Audio Doesn't Play

**Immediate Response:**
1. Check device volume
2. Show text-only mode as fallback
3. Emphasize accessibility
4. Continue with visual content

**Follow-Up:**
- Test audio pre-demo
- Have backup device ready

---

### If Content Missing/Broken

**Immediate Response:**
1. Navigate to different story
2. Show alternative content
3. Acknowledge issue
4. Continue demo

**Follow-Up:**
- Fix broken content immediately
- Pre-load all demo content

---

## ✅ FINAL PRE-DEMO CHECKLIST (2 HOURS BEFORE)

### Device Preparation
- [ ] Device fully charged (100%)
- [ ] WiFi connected (strong signal)
- [ ] Bluetooth off (no interference)
- [ ] Notifications silenced
- [ ] Screen brightness 80%
- [ ] Clear browser cache
- [ ] Close other apps

### Account Preparation
- [ ] Demo account ready
- [ ] Onboarding completed
- [ ] No PII in account
- [ ] Language set to English (start)
- [ ] Library has sample progress
- [ ] No test data visible

### Content Verification
- [ ] All demo stories load
- [ ] All thumbnails visible
- [ ] All audio files accessible
- [ ] All context cards present
- [ ] All collections curated

### Test Run
- [ ] Run 5-minute smoke test
- [ ] Test language switching (EN/FR/ES)
- [ ] Test audio playback
- [ ] Test story navigation
- [ ] Test explore content
- [ ] No errors in console

### Backup Plan
- [ ] Backup device charged
- [ ] Backup account ready
- [ ] Recorded demo video (if needed)
- [ ] Presentation slides ready

---

## 📊 POST-DEMO VALIDATION

### Immediate Post-Demo (30 minutes)
- [ ] Log any issues encountered
- [ ] Note stakeholder questions
- [ ] Document feature requests
- [ ] Collect feedback

### 24-Hour Follow-Up
- [ ] Email thank you to CMF
- [ ] Share demo recording (if available)
- [ ] Send analytics summary
- [ ] Address any concerns raised

### 1-Week Follow-Up
- [ ] Fix critical issues found
- [ ] Update test suite
- [ ] Prepare for next demo
- [ ] Update CMF report

---

## 🎯 DEMO SUCCESS CRITERIA

### Technical Success
- ✅ Zero crashes
- ✅ Zero critical bugs visible
- ✅ Language switching works 100%
- ✅ Audio plays correctly
- ✅ Navigation smooth

### Content Success
- ✅ Stories engaging
- ✅ Cultural representation clear
- ✅ Educational value evident
- ✅ Attribution proper

### Stakeholder Success
- ✅ CMF impressed
- ✅ Questions answered
- ✅ Feedback positive
- ✅ Next steps clear

---

## 📞 DEMO DAY CONTACTS

**Technical Issues:**
- **DevOps Lead:** devops@creova.ca (on standby)
- **QA Lead:** qa@creova.ca (monitoring)

**Content Issues:**
- **Content Manager:** content@creova.ca

**Demo Presenter:**
- **Project Lead:** [Name]
- **Backup Presenter:** [Name]

**CMF Liaison:**
- **Grant Manager:** grants@creova.ca

---

## 🎉 FINAL VALIDATION SIGN-OFF

**Before Demo, Confirm:**

**Technical Lead:** _________________________  
**QA Lead:** _________________________  
**Content Manager:** _________________________  
**Project Manager:** _________________________  

**Demo Cleared:** ☐ YES  ☐ NO

**If NO, reason:** _________________________

**Fix Deadline:** _________________________

---

**END CMF DEMO VALIDATION CHECKLIST**

**Status:** Ready for validation  
**Next Action:** Execute 48-hour pre-demo checklist  
**Timeline:** Validate 48 hours before each CMF demo
