# CMF TECHNICAL APPENDIX — ENHANCED FEATURES
**SEEN by CREOVA — Canada Media Fund Grant Reporting**

**Project:** SEEN by CREOVA  
**Grant Program:** CMF Experimental Stream (Convergent)  
**Report Period:** 2026 Fiscal Year  
**Document Type:** Technical Appendix — Advanced Features

---

## EXECUTIVE SUMMARY

SEEN by CREOVA has implemented **11 advanced feature sets** that extend the platform's cultural storytelling capabilities while maintaining:
- **Bilingual compliance** (EN/FR minimum, ES additional)
- **Privacy-first architecture** (aggregate analytics only)
- **Cultural appropriateness** (moderated community engagement)
- **Educational scaffolding** (institutional collections, discussion prompts)
- **Accessibility** (offline packs, reading/listening modes)

All features are **non-visual, data/logic-based extensions** that enhance cultural impact without disrupting user experience.

---

## 1. MULTILINGUAL ACCESSIBILITY (CMF Requirement)

### Feature Set B: Guided Reading/Listening Modes

**Description:**  
Users can choose how they consume content:
- **Read-only** (text only, visual learners)
- **Listen-only** (audio only, auditory learners, accessibility)
- **Read + Listen** (default, multimodal learning)

**CMF Alignment:**
- **Accessibility:** Supports users with visual impairments (listen-only), hearing impairments (read-only), or learning differences (multimodal)
- **Language Learning:** Bilingual users can read in one language while listening in another (FR/EN, ES/EN)
- **Equitable Access:** No premium tiers—all modes available to all users

**Technical Implementation:**
- User preference stored (anonymous or authenticated)
- Consumption state tracked per chapter (resume position)
- Audio speed control (0.75x - 2.0x) for accessibility

**Metrics (Aggregate):**
- % of users preferring read-only mode
- % of users preferring listen-only mode
- Average audio speed (accessibility indicator)

---

## 2. INSTITUTIONAL PARTNERSHIPS (CMF Requirement)

### Feature Set C: Institutional Collections & Syllabi

**Description:**  
Curators (museums, universities, libraries) create thematic collections of stories with:
- Editorial framing (curator intro)
- Suggested reading order
- Discussion prompts (education-ready)

**CMF Alignment:**
- **Educational Impact:** Stories integrated into curricula (high school, undergraduate, graduate)
- **Institutional Reach:** Partnership with Canadian cultural institutions
- **Public Benefit:** Free access to curated collections (no paywalls)

**Example Collections:**
- "Black Canadian Labor History" (Stories 2, 4)
- "Indigenous Urban Resilience" (Story 3.2)
- "Diaspora & Belonging" (Story 3.1, 3.3)

**Technical Implementation:**
- Collections stored in KV database
- Public/private visibility settings
- No classroom management (LMS integration) — keeps platform open

**Metrics (Aggregate):**
- Number of institutional collections created
- Number of institutional users (approximate)
- Stories accessed via institutional collections

**Institutional Partners (Pilot):**
1. **Dalhousie University** (African Diaspora Studies)
2. **University of Toronto** (Black Canadian Studies)
3. **Winnipeg Art Gallery** (Indigenous Futures)

---

## 3. PRIVACY-FIRST ANALYTICS (CMF Compliance)

### Feature Set D: Cultural Impact Analytics

**Description:**  
Platform tracks **aggregate-only** usage data for CMF reporting:
- Story starts/completions
- Language usage (EN/FR/ES)
- Audio engagement (total minutes)
- Theme-level insights

**CMF Alignment:**
- **Accountability:** Demonstrates platform usage and impact
- **Multilingual Engagement:** Tracks FR/ES uptake
- **Cultural Reach:** Theme-level data shows diverse engagement

**What IS Tracked (Aggregate Only):**
- Total story starts (count)
- Total completions (count)
- Language breakdown (% sessions in FR/ES)
- Audio minutes listened (total)
- Institutional access (count)

**What is NOT Tracked:**
- ❌ Individual user behavior
- ❌ Attention patterns (scroll, dwell time)
- ❌ Emotional reactions
- ❌ User identity or profiles
- ❌ Social graphs

**Privacy Safeguards:**
- No cookies beyond session management
- No third-party analytics (Google, Facebook, etc.)
- No cross-platform tracking
- Users can opt out of analytics entirely

**Technical Implementation:**
- Aggregate counters in KV store
- No personally identifiable information (PII)
- CMF report generated on-demand (admin only)

**CMF Report Format:**
```
Platform Metrics (Q1 2026):
- Total story completions: 12,450
- French engagement: 32% of sessions
- Spanish engagement: 18% of sessions
- Total audio hours: 3,200 hours
- Institutional users: ~450 (approximate)
- Themes engaged: Black Canadian History (45%), Indigenous Urbanism (28%), Diaspora (27%)
```

---

## 4. CULTURAL SENSITIVITY & MODERATION (CMF Requirement)

### Feature Set F: Community Reflections (Care-Based)

**Description:**  
Users submit reflections on stories (text or audio), which:
- Enter moderation queue (no unmoderated visibility)
- Are reviewed for cultural sensitivity, harm prevention
- Are approved or rejected (no public profiles, likes, or ranking)

**CMF Alignment:**
- **Community Engagement:** Users reflect on cultural content
- **Cultural Appropriateness:** Moderation prevents cultural appropriation, hate speech
- **Restorative Care:** No toxic social dynamics (no likes, no trolling)

**Moderation Categories:**
1. **Cultural Sensitivity:** Respectful representation of BIPOC communities
2. **Harm Prevention:** No hate speech, violence, harassment
3. **Accessibility & Language:** Inclusive, clear language
4. **Restorative Care:** Community-building, not divisive

**Why This Matters:**
- BIPOC storytelling platforms are often targets for harassment
- Unmoderated communities can perpetuate harm
- Care-based moderation centers dignity, not growth metrics

**Technical Implementation:**
- Anonymous submissions (one-way hash, not reversible)
- Moderation queue (admin-only access)
- Approved reflections visible (no public profiles)
- Creator sees responses privately (optional)

**Metrics (Aggregate):**
- Total reflections submitted
- Total reflections approved
- Moderation categories flagged (cultural sensitivity, harm prevention)

---

## 5. EQUITABLE ACCESS (CMF Requirement)

### Feature Set G: Offline Cultural Packs

**Description:**  
Downloadable bundles of stories (text + audio + context cards) for offline access:
- No internet required (equitable for rural/low-bandwidth users)
- Institution-enabled (libraries, schools can distribute)
- Free (no paywalls)

**CMF Alignment:**
- **Digital Inclusion:** Removes internet access barrier
- **Geographic Equity:** Serves rural and Northern communities
- **Institutional Distribution:** Libraries and schools can provide packs

**Example Packs:**
- **"Season 2: Black Canadian Histories"** (35 chapters, EN/FR/ES, 150MB)
- **"Indigenous Urban Resilience"** (6 chapters, EN/FR, 40MB)

**Technical Implementation:**
- Pre-generated zip files (text + MP3 audio)
- Supabase storage (public or institution-gated)
- Download tracking (aggregate only)

**Metrics (Aggregate):**
- Total packs downloaded
- Geographic distribution (if tracked via IP, aggregated)
- Institutional downloads vs. individual downloads

---

## 6. CONTENT LONGEVITY & PRESERVATION (CMF Value)

### Feature Set I: Living Archives

**Description:**  
Stories can grow over time:
- Append new chapters to existing stories
- Track version history (transparent changes)
- Preserve cultural memory as it evolves

**CMF Alignment:**
- **Cultural Preservation:** Stories are not static, they grow with community
- **Transparency:** Version history shows how narratives evolve
- **Long-Term Impact:** Platform designed for decades, not months

**Example:**
- **Story 2.1: Black Canadian Renaissance**
  - Original: 6 chapters (2026)
  - Appended: Chapter 7 "The Archive Continues" (2027)
  - Version history: Chapter 1 updated with new historical context (2028)

**Technical Implementation:**
- Append-only chapter capability
- Version history per chapter
- Change log per story world

**Metrics (Aggregate):**
- Number of appended chapters
- Number of version updates
- Story world growth over time

---

## 7. CREATOR AUTONOMY & ATTRIBUTION (CMF Value)

### Feature Set E: Creator Notes (Post-Story)

**Description:**  
Creators add reflective notes after story completion:
- Context on creation process
- Acknowledgment of community sources
- No comment threads (protects creator autonomy)

**CMF Alignment:**
- **Creator-Centered:** Platform amplifies creator voice, not platform voice
- **Transparency:** Creators explain choices, methods, sources
- **Community Acknowledgment:** Honors knowledge keepers, interviewees

**Example:**
> "This story was shaped by interviews with activists who were there. Their voices are not just history—they are memory, resistance, and refusal. Thank you to the elders who shared, and to the youth who are carrying this forward."

**Technical Implementation:**
- Creator note linked to story world
- Appears after final chapter completion
- Text-only (no comments, reactions)

---

## 8. BILINGUAL & MULTILINGUAL ENGAGEMENT (CMF Requirement)

### Multilingual Support Across All Features

**English (EN):**
- 100% of content available
- Default language

**French (FR-CA):**
- 100% of content available (Season 2-4)
- Canadian French (Quebec-friendly)
- CMF minimum requirement satisfied

**Spanish (ES-LA):**
- 100% of content available (Season 2-4)
- Neutral Latin American Spanish
- Expands reach to Hispanic diaspora in Canada

**Technical Implementation:**
- All data structures support multilingual text (`{ en, fr, es }`)
- Language switching seamless (user preference)
- Context cards, creator notes, reflections, collections all multilingual

**Metrics (Aggregate):**
- % of sessions in FR
- % of sessions in ES
- Bilingual sessions (users switching languages)

---

## 9. EDUCATIONAL SCAFFOLDING (CMF Value)

### Feature Set C: Discussion Prompts

**Description:**  
Institutional collections include discussion prompts:
- Open-ended questions (no quizzes)
- Culturally grounded (not generic)
- Intended audience flagged (high school, undergraduate, etc.)

**Example Prompts:**
- **Story 2.2: Sleeping Car Porters**
  - "How did labor organizing create community power?"
  - "What role did the Brotherhood play in the civil rights movement?"
  - "How do we see labor organizing today in Black Canadian communities?"

**CMF Alignment:**
- **Educational Use:** Stories curriculum-ready
- **Critical Thinking:** Prompts encourage reflection, not rote learning
- **No Surveillance:** No quiz answers tracked, no grading

---

## 10. RIGHTS MANAGEMENT & SUSTAINABILITY (CMF Compliance)

### Feature Set J: Rights & Attribution (Backend Only)

**Description:**  
Content rights managed at backend level:
- Rights holder (creator, institution)
- License type (CMF-grant-compliant, educational-use-only, etc.)
- Usage scope (platform playback, institutional download, etc.)

**CMF Alignment:**
- **Creator Protection:** Rights clearly defined and enforced
- **Grant Compliance:** CMF funding acknowledged
- **Sustainability:** Platform can enforce usage restrictions (future revenue models)

**Technical Implementation:**
- Rights metadata per content item
- Admin-only access (no public exposure)
- Attribution requirements enforced

**Example:**
```
Content: Story 2.1 (Black Canadian Renaissance)
Rights Holder: CREOVA Collective
License: CMF-Grant-Compliant
Allowed Usage:
  - Platform playback: Yes
  - Institutional download: Yes
  - Educational use: Yes
  - Commercial use: No
Attribution: "Funded by Canada Media Fund"
```

---

## 11. PLATFORM ACCESSIBILITY FEATURES (CMF Value)

### Feature Set H: Multi-Narrator Support

**Description:**  
Stories can have multiple narration tracks (same language, different voices):
- Users select preferred narrator
- Accessible to users with voice preferences (gender, accent, tone)

**CMF Alignment:**
- **Accessibility:** Users with auditory processing preferences can choose narrator
- **Representation:** Multiple voices ensure diverse representation
- **Quality:** Allows for different narration styles (reflective vs. urgent)

**Example:**
- **Story 2.1: Black Canadian Renaissance**
  - Narrator 1 (EN): Warm, reflective voice (default)
  - Narrator 2 (EN): Urgent, direct voice (alternative)

---

## CMF REPORTING METRICS (AGGREGATE ONLY)

### Platform-Wide Metrics (Q1-Q4 2026)

**Engagement:**
- Total story completions: [Aggregate count]
- Total audio hours: [Aggregate count]
- Average completion rate: [Percentage]

**Multilingual:**
- French sessions: [Percentage]
- Spanish sessions: [Percentage]
- Bilingual sessions: [Count]

**Institutional:**
- Institutional users: [Approximate count]
- Institutional collections: [Count]
- Offline packs downloaded: [Count]

**Community:**
- Reflections submitted: [Count]
- Reflections approved: [Count]
- Community engagement rate: [Percentage]

**Cultural Impact:**
- Themes engaged: [List with percentages]
- Stories completed (by theme): [Breakdown]

---

## PRIVACY STATEMENT (CMF COMPLIANCE)

SEEN by CREOVA adheres to the following privacy principles:

1. **No Individual Tracking:** Platform tracks aggregate usage only, no individual user behavior
2. **No Surveillance:** No attention patterns, scroll tracking, or emotional inference
3. **User Control:** Users can opt out of analytics entirely
4. **No Third-Party Sharing:** Data not shared with third parties (no Google Analytics, Facebook, etc.)
5. **Anonymity:** Community reflections are anonymous (one-way hash, not reversible)
6. **Transparency:** Users informed of data collection (aggregate only) and can review CMF reports

---

## SUSTAINABILITY PLAN (CMF Requirement)

### Revenue Model (Post-Grant)
- Institutional partnerships (libraries, museums, schools)
- Offline pack licensing (institutions pay nominal fee for distribution rights)
- Creator-support model (users support creators directly, platform takes no cut)

### Technical Sustainability
- Open-source backend (reduce vendor lock-in)
- Archive-ready data formats (JSON, plain text, MP3)
- Decentralized storage (future: IPFS for preservation)

### Cultural Sustainability
- Community governance (future: creator council)
- Moderation collective (paid moderators from community)
- Living archives (stories grow with community)

---

## CONCLUSION

SEEN by CREOVA has implemented **11 advanced feature sets** that:
- ✅ Enhance cultural storytelling (context cards, creator notes, living archives)
- ✅ Support multilingual engagement (EN/FR/ES across all features)
- ✅ Enable institutional partnerships (collections, offline packs)
- ✅ Protect privacy (aggregate analytics only, no surveillance)
- ✅ Foster community (moderated reflections, care-based engagement)
- ✅ Ensure accessibility (reading/listening modes, offline access)

All features are **non-visual, data/logic-based extensions** that preserve the platform's locked UI/UX while expanding cultural impact.

**CMF Compliance:** ✅ FULL COMPLIANCE  
**Privacy:** ✅ PRIVACY-FIRST  
**Accessibility:** ✅ MULTIPLE MODALITIES  
**Multilingual:** ✅ EN/FR/ES COMPLETE

---

**END CMF TECHNICAL APPENDIX**

**Date:** February 6, 2026  
**Prepared By:** CREOVA Technical Team  
**Grant Program:** CMF Experimental Stream (Convergent)  
**Report Type:** Technical Appendix — Advanced Features
