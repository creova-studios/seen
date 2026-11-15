# SEEN Onboarding Flow Audit Report
**Date:** February 5, 2026  
**Platform:** SEEN by CREOVA  
**Scope:** Mobile-first web application onboarding analysis

---

## Executive Summary

This audit analyzes the current onboarding flow for SEEN to identify missing features, best practice opportunities, and potential enhancements. The analysis preserves all existing UI/UX design elements while recommending subtle, polished improvements that enhance the user experience without adding clutter.

**Key Findings:**
- ✅ **Strong Foundation:** Comprehensive 2-layer onboarding system with authentication
- ⚠️ **Missing:** Language selection is not integrated into main viewer/creator onboarding
- ⚠️ **Opportunity:** Progress visualization, exit/return options, and skip functionality
- ✅ **Best Practice Met:** Role-based onboarding, accessibility-first design, emotional storytelling

---

## Current Onboarding Architecture

### **Layer 0: Invocation** (Emotional Entry)
**File:** `/src/app/components/OnboardingSystem.tsx` (Lines 202-327)

**Current Flow:**
1. Animated gradient background
2. SEEN branding reveal
3. Poetic tagline: "Where stories live, where culture breathes"
4. Primary invocation: "You are entering SEEN"
5. Single CTA button with motion effects

**Status:** ✅ Complete and polished

---

### **Layer 1: Orientation** (Role & Account Setup)
**File:** `/src/app/components/OnboardingSystem.tsx` (Lines 329-837)

**Current Steps:**

| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| **1. Role Selection** | Creator / Viewer / Moderator | ✅ Complete | Clean, minimal design |
| **2. Intent Setting** | Share work / Build portfolio / Explore / Connect | ✅ Complete | Multiple intent options |
| **3. Account Creation** | Email/password with sign-in fallback | ✅ Complete | Includes password recovery |
| **4. Presence Setup** | Emotional placeholder for user space | ✅ Complete | Poetic language |
| **5. Threshold** | Final confirmation: "You are now SEEN" | ✅ Complete | Cinematic entrance |

**OAuth Placeholder:** Social login UI exists but disabled (lines 726-760)

---

### **Creator-Specific Onboarding**
**File:** `/src/app/components/CreatorOnboardingFlow.tsx`

**Tutorial Steps:**
1. Welcome screen
2. Language preference
3. Tutorial: Story Builder
4. Tutorial: Context Cards
5. Tutorial: Accessibility features
6. First story prompt
7. Preview
8. Submit

**Status:** ✅ Separate creator flow exists with comprehensive tutorials

---

## Missing Features Analysis

### 🔴 **Critical: Language Selection Not Integrated**

**Current State:**
- Language selection screen exists (`LanguageSelectionScreen.tsx`)
- **NOT** integrated into main onboarding flow
- Language defaults to English in `StoryStateContext.tsx`
- User can only change language later in settings

**Impact:**
- Non-English speakers forced into English onboarding
- Violates bilingual mandate (EN/FR) and CMF grant compliance
- Poor UX for Quebec/French-speaking users

**Recommendation:**
**PRIORITY: HIGH**

Add language selection as **Step 0** before Role Selection:

```
Invocation Layer → [NEW] Language Selection → Role Selection → Intent → Account → Presence → Threshold
```

**Implementation Plan:**

1. **Insert Language Step in OnboardingSystem.tsx**
   - Add after Invocation Layer, before Role Selection
   - Use existing `LanguageSelectionScreen.tsx` component
   - Persist selection to `StoryStateContext`
   - Update all subsequent text to respect selected language

2. **Design Integration:**
   - Same minimal aesthetic as current steps
   - 3 options: English / Français / Español
   - Smooth fade transition
   - No visual disruption to flow

3. **Backend Requirements:**
   - Store language preference in user profile
   - Pass to `signUp()` function (already supports this parameter)
   - Sync with `StoryStateContext.language`

**Code Change Location:**
- `/src/app/components/OnboardingSystem.tsx` - Lines 154-195
- Add `language` step after invocation, before role

**Example Integration:**
```typescript
{currentLayer === "orientation" && (
  <>
    {currentStep === "language" && (
      <LanguageSelectionStep 
        key="language" 
        onSelect={handleLanguageSelect} 
      />
    )}
    {currentStep === "role" && ( ... )}
  </>
)}
```

---

### 🟡 **Recommended: Progress Indication**

**Current State:**
- **No progress indicators** throughout onboarding
- User doesn't know how many steps remain
- Can feel disorienting, especially for 5+ step flow

**Onboarding Best Practice:**
- ✅ Show subtle progress
- ✅ Set expectations
- ✅ Reduce abandonment

**Recommendation:**
**PRIORITY: MEDIUM**

Add **minimal, iconless progress indicators** that match SEEN's luxury editorial aesthetic.

**Design Options:**

**Option A: Minimal Dot Indicators (Recommended)**
```
●  ○  ○  ○  ○
```
- Fixed position: Bottom center
- Opacity: 30% inactive, 90% active
- Size: 6px dots, 12px spacing
- Color: white
- No animation, just presence

**Option B: Subtle Text Counter**
```
Step 2 of 5
```
- Top right corner
- Font: 10px, uppercase, tracking: 0.3em
- Opacity: 20%
- Ultra-minimal, barely visible

**Option C: Vertical Progress Bar (Side)**
```
|
█
|
|
|
```
- Left edge, 2px wide
- Height fills based on progress
- Opacity: 10%
- Silent, atmospheric

**Recommended:** Option A (Dots) - Most aligned with current design language

**Implementation:**
- Add to OnboardingSystem.tsx
- Calculate current step index
- Render below main content
- Fade in/out with step transitions

**Code Addition:**
```tsx
// Progress indicator (add to each orientation step)
<motion.div 
  className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.3 }}
  transition={{ delay: 1 }}
>
  {[0, 1, 2, 3, 4].map((i) => (
    <div
      key={i}
      className={`w-1.5 h-1.5 rounded-full transition-opacity duration-500 ${
        i === currentStepIndex ? 'bg-white opacity-90' : 'bg-white opacity-20'
      }`}
    />
  ))}
</motion.div>
```

---

### 🟡 **Recommended: Exit & Resume Options**

**Current State:**
- **No way to exit** onboarding once started
- **No skip option** for returning users
- If interrupted, must complete full flow

**Recommendation:**
**PRIORITY: MEDIUM**

Add subtle exit affordances:

1. **Escape Key Handler**
   - Press ESC to pause onboarding
   - Shows modal: "Resume later?" / "Continue"
   - Saves progress to localStorage (already implemented)
   - Returns to onboarding on next visit

2. **Subtle "Continue Later" Link**
   - Bottom of screen, 10px text, 20% opacity
   - Only appears after 10 seconds on a step
   - Reveals on hover
   - Non-intrusive, doesn't break flow

**Design:**
```
[Main content area]





                                                Continue later →
```

**Implementation:**
```tsx
// Add to each step component
const [showExit, setShowExit] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShowExit(true), 10000);
  return () => clearTimeout(timer);
}, []);

// At bottom of step render
{showExit && (
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.2 }}
    whileHover={{ opacity: 0.6 }}
    className="fixed bottom-4 right-6 text-[10px] tracking-wider uppercase text-white"
    onClick={handleSaveAndExit}
  >
    Continue later →
  </motion.button>
)}
```

**Backend:** Already supported via localStorage progress tracking

---

### 🟢 **Nice-to-Have: Onboarding Skip for Developers**

**Current State:**
- Developers must complete onboarding every time they clear localStorage
- Slows down testing and iteration

**Recommendation:**
**PRIORITY: LOW**

Add developer bypass (production-safe):

1. **URL Parameter:** `?skip_onboarding=true`
2. **Keyboard Shortcut:** `Cmd/Ctrl + Shift + O` (during invocation only)
3. **Sets default values:**
   - Role: Creator
   - Intent: Explore
   - Language: English
   - Marks onboarding complete

**Implementation:**
```tsx
// In App.tsx
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('skip_onboarding') === 'true' && process.env.NODE_ENV === 'development') {
    localStorage.setItem('onboarding_completed', 'true');
    // Set defaults...
  }
}, []);
```

**Safety:** Only works in development mode

---

## Additional Best Practices Review

### ✅ **Currently Implemented Best Practices:**

1. **Emotional Storytelling** ✅
   - Invocation layer sets tone
   - Poetic language throughout
   - Avoids transactional language

2. **Progressive Disclosure** ✅
   - Information revealed step-by-step
   - No overwhelming forms
   - Single question per screen

3. **Accessibility-First** ✅
   - Presence step mentions accessibility
   - Creator onboarding includes accessibility tutorial
   - WCAG 2.1 AA compliance noted

4. **Mobile-First Design** ✅
   - Max-width: 428px (iPhone 14 Pro Max)
   - Touch-friendly targets
   - Gesture-ready animations

5. **Authentication Security** ✅
   - JWT-based sessions
   - Password recovery flow
   - Role stored server-side

6. **CMF Grant Compliance** ✅
   - No tracking mentioned
   - Privacy-first language
   - Local storage for preferences

7. **Save/Resume Capability** ✅
   - Progress saved to localStorage
   - Step tracking implemented
   - Can resume from last step

---

### 🔵 **Opportunities for Enhancement (Optional)**

#### 1. **Welcome Back Flow**

**Scenario:** User signs out and signs back in

**Current:** Shows full onboarding again  
**Opportunity:** Detect returning users, show simplified "Welcome back" screen

**Implementation:**
```tsx
// Check if user has previous session
const hasSignedInBefore = localStorage.getItem('has_signed_in_before');

if (authState.isAuthenticated && hasSignedInBefore) {
  return <WelcomeBackScreen userName={authState.user.name} />;
}
```

**Design:** Single screen, skip straight to For You feed after 2 seconds

---

#### 2. **Contextual Tooltips (Post-Onboarding)**

**Opportunity:** First-time feature discovery in main app

**Approach:**
- **Not during onboarding** (to avoid clutter)
- Triggered on first interaction with complex features
- Appears once, never again
- Example: First time user opens story chapter → subtle "Swipe for context cards" hint

**Storage:**
```tsx
localStorage.setItem('tooltip_context_cards_shown', 'true');
```

---

#### 3. **Multilingual Onboarding Copy**

**Current:** All onboarding text hardcoded in components  
**Opportunity:** Extract to translation files for easier maintenance

**Implementation:**
```tsx
// Create /src/app/data/onboardingTranslations.ts
export const onboardingText = {
  invocation_tagline: {
    en: "Where stories live, where culture breathes",
    fr: "Où vivent les histoires, où respire la culture",
    es: "Donde viven las historias, donde respira la cultura"
  },
  // ... more translations
};
```

**Benefit:** Easier for translators, consistency across platform

---

#### 4. **Personalized Threshold Message**

**Current:** Generic "You are now SEEN"  
**Opportunity:** Personalize based on role

**Examples:**
- Creator: "Your voice is now SEEN"
- Viewer: "Your journey begins now"
- Moderator: "Your community awaits"

**Implementation:**
```tsx
const thresholdMessage = {
  creator: { en: "Your voice is now SEEN", fr: "...", es: "..." },
  viewer: { en: "Your journey begins now", fr: "...", es: "..." },
  moderator: { en: "Your community awaits", fr: "...", es: "..." }
};

return (
  <h1>{thresholdMessage[selectedRole][language]}</h1>
);
```

---

## Technical Implementation Notes

### Files Requiring Updates

| File | Change | Priority | Estimated Effort |
|------|--------|----------|------------------|
| `/src/app/components/OnboardingSystem.tsx` | Add language selection step | HIGH | 2 hours |
| `/src/app/components/OnboardingSystem.tsx` | Add progress indicators | MEDIUM | 1 hour |
| `/src/app/components/OnboardingSystem.tsx` | Add exit/resume options | MEDIUM | 1.5 hours |
| `/src/app/App.tsx` | Add skip parameter for devs | LOW | 30 mins |
| `/src/app/data/onboardingTranslations.ts` | Create translation file (new) | OPTIONAL | 3 hours |

**Total Critical Path:** 2 hours (language selection only)  
**Total Recommended:** 4.5 hours (all medium priority items)  
**Total Optional:** 7.5 hours (all enhancements)

---

### Backend Requirements

✅ **No new backend changes required** - All features use existing:
- Authentication system
- User profile storage
- Role management
- localStorage for progress tracking

---

### Testing Checklist

After implementing recommendations:

- [ ] Language selection persists across sessions
- [ ] Progress indicators update correctly on each step
- [ ] Exit link saves progress to localStorage
- [ ] Resume functionality returns to correct step
- [ ] All text displays correctly in EN/FR/ES
- [ ] Keyboard accessibility maintained
- [ ] Screen reader compatibility verified
- [ ] Mobile viewport tested (320px - 428px)
- [ ] Animations remain smooth on slower devices
- [ ] Skip parameter only works in development mode

---

## Design Mockups (Conceptual)

### Language Selection Integration

```
┌─────────────────────────────────────┐
│                                     │
│             SEEN                    │
│           by CREOVA                 │
│                                     │
│   Choose your language              │
│                                     │
│   ┌───────────────────────────┐    │
│   │     English               │    │
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │     Français              │    │
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │     Español               │    │
│   └───────────────────────────┘    │
│                                     │
│                                     │
│   ●  ○  ○  ○  ○  ○                 │
└─────────────────────────────────────┘
```

### Progress Indicator Placement

```
┌─────────────────────────────────────┐
│                                     │
│  How will you move through          │
│  this space?                        │
│                                     │
│  Creator                            │
│  I make work                        │
│  ─────────────────────              │
│                                     │
│  Viewer                             │
│  I explore culture                  │
│  ─────────────────────              │
│                                     │
│  Moderator                          │
│  I shape communities                │
│  ─────────────────────              │
│                                     │
│                                     │
│   ○  ●  ○  ○  ○  ○                 │
└─────────────────────────────────────┘
```

---

## Risk Assessment

### Low Risk ✅
- Language selection integration (uses existing component)
- Progress indicators (purely visual)
- Exit/resume options (already tracked in localStorage)

### Medium Risk ⚠️
- Translation file refactor (potential breaking changes if not careful)
- Personalized messaging (requires role state management)

### No Risk 🟢
- Developer skip feature (development-only)
- Welcome back flow (additive only)
- Contextual tooltips (post-onboarding)

---

## Accessibility Compliance

All recommendations maintain WCAG 2.1 AA standards:

✅ **Language Selection:** Keyboard navigable, screen reader friendly  
✅ **Progress Indicators:** Pure visual, doesn't convey critical info  
✅ **Exit Options:** Keyboard accessible (ESC key)  
✅ **Tooltips:** Optional, don't block functionality  

**Screen Reader Announcements (if added):**
```tsx
<div role="status" aria-live="polite" className="sr-only">
  Step 2 of 6: Role selection
</div>
```

---

## CMF Grant Compliance

✅ **All recommendations maintain grant compliance:**

1. **No Behavioral Tracking:** Progress indicators are local only
2. **Privacy-First:** Language saved locally, not tracked server-side
3. **No Surveillance:** Exit tracking stays in localStorage
4. **User Control:** Exit options enhance user autonomy

**Note:** Language preference IS stored server-side (in user profile), but this is essential functionality, not surveillance.

---

## Conclusion & Action Items

### Immediate Actions (High Priority)
1. ✅ **Integrate language selection** as first orientation step
2. ✅ Test language persistence across sign-out/sign-in
3. ✅ Update translations for all onboarding steps

### Short-Term Actions (Medium Priority)
4. Add minimal progress indicators (dot style)
5. Implement exit/resume functionality
6. Add keyboard shortcuts for power users

### Long-Term Enhancements (Optional)
7. Create centralized translation file system
8. Implement welcome back flow for returning users
9. Add contextual tooltips for first-time feature discovery

---

## Appendix: Related Files

### Core Onboarding Files
- `/src/app/components/OnboardingSystem.tsx` - Main onboarding orchestrator
- `/src/app/components/Onboarding.tsx` - Legacy onboarding (still in use?)
- `/src/app/components/OnboardingPurpose.tsx` - Purpose explanation screen
- `/src/app/components/OnboardingIntent.tsx` - Intent selection
- `/src/app/components/OnboardingAccessibility.tsx` - Accessibility preferences
- `/src/app/components/CreatorOnboardingFlow.tsx` - Creator-specific tutorial
- `/src/app/components/LanguageSelectionScreen.tsx` - Language picker (standalone)
- `/src/app/components/SplashScreen.tsx` - Initial splash (if used)

### Context & State Management
- `/src/app/contexts/StoryStateContext.tsx` - Global state including language
- `/src/app/contexts/AuthContext.tsx` - Authentication state
- `/src/app/App.tsx` - Main app orchestration

### Translation Resources
- Language-specific text scattered across components
- No centralized translation file (opportunity for improvement)

---

**Report Prepared By:** AI Architecture Analysis  
**For:** SEEN by CREOVA Development Team  
**Next Review:** After language selection integration complete

---

## Visual Design Preservation Commitment

All recommendations in this report are designed to:
- ✅ Maintain current typography (Inter font family)
- ✅ Preserve color palette (black bg, white text, subtle opacity variations)
- ✅ Keep animation timing and easing curves
- ✅ Respect 428px max-width mobile-first layout
- ✅ Honor iconless design system philosophy
- ✅ Continue cinematic, luxury editorial aesthetic
- ✅ Maintain motion/react animation library usage
- ✅ Preserve spacing, padding, and rhythm established

**No visual breaking changes recommended.**  
**All enhancements are subtle, polished, and additive.**
