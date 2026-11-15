# Creator Flow Documentation
**SEEN by CREOVA — Cultural Authorship Journey**

---

## Philosophy

This is **not "content creation"** — this is **cultural authorship**.

The Creator Flow is designed to:
- **Guide without overwhelming**
- **Respect cultural work**
- **Enable confidence**
- **Support non-linear creation**
- **Preserve meaning through context**

Every interaction prioritizes **calm, intentional decision-making** over speed or gamification.

---

## Flow Overview

### 5-Step Guided Process

```
1. Story Intent           → Cultural grounding
2. Story Structure        → Narrative shape
3. Media & Chapters       → Content building
4. Context & Accessibility → Meaning protection
5. Preview & Publish      → Final review
```

### Key Characteristics

✅ **Non-linear** — Exit and resume anytime  
✅ **Auto-save** — Progress saved continuously  
✅ **Gentle guidance** — No forced decisions  
✅ **Cultural respect** — Institutional language throughout  
✅ **Accessibility-first** — Built into workflow, not afterthought

---

## Step 1: Story Intent

### Purpose
Ground the story culturally, not algorithmically.

### File
`/src/app/components/creator-flow/StoryIntentStep.tsx`

### Inputs

#### 1. Story Title
- **Type:** Text input
- **Max length:** 100 characters
- **Validation:** Required
- **Microcopy:** "Give your story a meaningful title"

#### 2. Story Description
- **Type:** Textarea
- **Max length:** 500 characters
- **Validation:** Required
- **Microcopy:** "What is this story about? Who should experience it?"

#### 3. Cultural Themes
- **Type:** Multi-select tags
- **Options:**
  - Indigenous Knowledge
  - Migration & Diaspora
  - Language & Identity
  - Urban Culture
  - Heritage & Memory
  - Music & Sound
  - Visual Arts
  - Documentary & Film
  - Community Stories
  - Environmental
- **Validation:** At least 1 required
- **Behavior:** Animated tag selection with hover states

#### 4. Language(s)
- **Type:** Multi-select checkboxes
- **Options:** EN / FR / ES
- **Validation:** At least 1 required
- **Display:** Native language names shown

#### 5. Intended Audience
- **Type:** Text input (optional)
- **Label:** "Optional" badge displayed
- **Microcopy:** "Who is this story for?"

### Visual Design

```
┌──────────────────────────────┐
│ Step 1 of 5 · Story Intent   │
│ Cultural Grounding           │
│                              │
│ [Story Title Input]          │
│ [Description Textarea]       │
│                              │
│ Cultural Themes:             │
│ [Tag] [Tag] [Tag]...         │
│                              │
│ Language(s):                 │
│ ○ English                    │
│ ○ Français                   │
│ ○ Español                    │
│                              │
│ [Intended Audience - Opt]    │
│                              │
│ ℹ️ Helper text               │
└──────────────────────────────┘
│ Draft saved    [Next] →      │
└──────────────────────────────┘
```

### Microcopy

**Header:**
> "This helps us present your story with care and context."

**Helper Card:**
> "These details help us connect your story with the right audiences and institutional partners. You can refine them at any time."

### Auto-save Behavior
- Triggers **500ms** after last keystroke
- Visual indicator: "Draft saved" (bottom left)
- No loading spinners or progress bars

---

## Step 2: Story Structure

### Purpose
Define narrative shape without technical jargon.

### File
`/src/app/components/creator-flow/StoryStructureStep.tsx`

### Structure Options

#### 1. Linear
- **Description:** Single narrative path from beginning to end
- **Example:** Documentary, oral history, musical journey
- **Visual:** 4 circles connected by lines
- **Icon:** List

#### 2. Soft-Branching
- **Description:** Main narrative with optional side paths
- **Example:** Multi-perspective stories, cultural deep-dives
- **Visual:** Main path with one branch
- **Icon:** GitBranch

#### 3. Episodic
- **Description:** Self-contained chapters forming larger collection
- **Example:** Anthology, series, thematic collections
- **Visual:** 3 independent boxes
- **Icon:** Layers

### Estimated Chapters

- **Type:** Slider
- **Range:** 1-12 chapters
- **Default:** 3
- **Purpose:** Planning guide only
- **Note:** "This can change as your story develops"

### Visual Design

```
┌──────────────────────────────┐
│ Step 2 of 5 · Story Structure│
│ Narrative Shape              │
│                              │
│ ┌──────────────────────────┐ │
│ │ ● Linear                 │ │
│ │ Classic storytelling     │ │
│ │ [Visual: O→O→O→O]       │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ ○ Soft-Branching        │ │
│ │ Main path + side paths  │ │
│ │ [Visual with branch]     │ │
│ └──────────────────────────┘ │
│                              │
│ Estimated Chapters:          │
│ ──●─────────────── 5         │
│ 1              12             │
└──────────────────────────────┘
│ ← Back         [Next] →      │
└──────────────────────────────┘
```

### Microcopy

**Header:**
> "How will your story unfold? You can adjust this later."

**Note:**
> "Structure is a guide, not a constraint. Your story can evolve organically as you create."

---

## Step 3: Media & Chapters

### Purpose
Build the story world with chapters and media.

### File
`/src/app/components/creator-flow/MediaChaptersStep.tsx`

### Chapter Interface

Each chapter includes:

#### 1. Chapter Metadata
- **Title** (required for 50% completion)
- **Description** (optional)
- **Estimated Duration** (1-60 minutes)

#### 2. Media Attachments
- **Narration** — Record or upload
- **Music** — Add soundtrack/ambient
- **Images** — Upload photos
- **Video** — Optional

#### 3. Completeness Indicator
- **0-49%** — Grey badge, circle outline
- **50-99%** — White badge, partial circle
- **100%** — Green badge, checkmark

### Chapter States

```
Collapsed:
┌────────────────────────────┐
│ ≡ ◐ 65%                    │
│   Chapter 1 • 5 min        │
│   "Montreal Jazz History"  │
└────────────────────────────┘

Expanded:
┌────────────────────────────┐
│ ≡ ◐ 65%                    │
│   Chapter 1 • Untitled     │
├────────────────────────────┤
│ Chapter Title:             │
│ [Input]                    │
│                            │
│ Description:               │
│ [Textarea]                 │
│                            │
│ Duration: [5] min          │
│                            │
│ Media:                     │
│ [🎤 Narration] [🎵 Music] │
│ [🖼️ Images]    [🎥 Video] │
│                            │
│ [Delete Chapter]           │
└────────────────────────────┘
```

### Interactions

- **Drag Handle** — Reorder chapters
- **Expand/Collapse** — Tap header
- **Add Chapter** — Dashed border button at bottom
- **Delete** — Only if more than 1 chapter exists

### Validation

To proceed to next step:
- At least **1 chapter** with **50%+ completion**
- Completion = title + one media element minimum

### Microcopy

**Header:**
> "Create chapters and attach media. Progress is saved automatically."

**Tip:**
> "Each chapter should have at least a title and one media element (narration, music, or images) to proceed. You can refine details later."

---

## Step 4: Context & Accessibility

### Purpose
Protect cultural meaning and ensure universal access.

### File
`/src/app/components/creator-flow/ContextAccessibilityStep.tsx`

### Context Cards

#### Card Types

1. **Cultural Context**
   - Icon: Globe
   - Purpose: Explain cultural significance, traditions, protocols
   - Example: "Understanding protocol for this ceremony"

2. **Historical Context**
   - Icon: BookOpen
   - Purpose: Provide historical background or timeline
   - Example: "Events leading to this migration"

3. **Institutional Context**
   - Icon: FileText
   - Purpose: Cite sources, archives, partnerships
   - Example: "Sourced from National Film Board archives"

#### Card Interface

```
┌────────────────────────────┐
│ 🌐 Cultural Context    ×   │
├────────────────────────────┤
│ Card Title:                │
│ [Input]                    │
│                            │
│ Content:                   │
│ [Textarea - 3 rows]        │
└────────────────────────────┘
```

### Accessibility Checklist

#### 1. Captions & Subtitles
- **Type:** Checkbox
- **Applies to:** Video and audio content
- **Icon:** Subtitles

#### 2. Full Transcripts
- **Type:** Checkbox
- **Applies to:** Text version of all audio
- **Icon:** FileText

### Language-Specific Notes

If story has multiple languages (EN/FR/ES):
- Show textarea for each language
- Optional translation notes
- Cultural context per language

### Confirmation

**Required checkbox to proceed:**

> "I confirm this story includes accessibility features"

**Helper text:**
> "Your story should be accessible to audiences with different needs. We'll help you add missing features before publishing."

### Microcopy

**Header:**
> "Add context to preserve cultural integrity and ensure your story is accessible."

---

## Step 5: Preview & Publish

### Purpose
Final confidence check before release.

### File
`/src/app/components/creator-flow/PreviewPublishStep.tsx`

### Story Summary

Display at top:
- Story title
- Chapter count
- Languages (EN/FR/ES badges)

### Preview Modes

#### 1. Viewer Preview
- See story as audience sees it
- All interactions functional

#### 2. Language Preview
- Switch between language versions
- Check translations

#### 3. Accessibility Preview
- Screen reader simulation
- Caption/transcript view

**Note:** Interactive preview is placeholder in current implementation

### Visibility Settings

#### 1. Public
- **Icon:** Globe
- **Description:** Visible to all SEEN audiences
- **Outcome:** Appears in Explore within 24h

#### 2. Institutional Collection
- **Icon:** Building2
- **Description:** Shared with partnered institutions
- **Requires:** Select collection dropdown
- **Options:**
  - NFB Indigenous Voices
  - Canadian Museum - Franco Heritage
  - Toronto Public Library - Multicultural

#### 3. Private
- **Icon:** Lock
- **Description:** Only you can see this (draft/testing)
- **Outcome:** Stays in Library, no public visibility

### Confirmations Required

#### 1. Rights & IP Ownership

> "I confirm I have the rights to publish this content. **I retain full ownership** of my work, and grant SEEN a non-exclusive license to present it."

**Emphasis:** Creator retains ownership

#### 2. Community Guidelines

> "I agree to SEEN's community guidelines regarding respectful cultural representation and ethical storytelling practices."

### Publish Flow

```
[Publish Story] button
         ↓
Confirmation Dialog:
┌────────────────────────────┐
│ ✓ Your story is ready      │
│   to be shared             │
│                            │
│ "Story Title"              │
│                            │
│ [Visibility description]   │
│                            │
│ [Review Again] [Confirm]   │
└────────────────────────────┘
         ↓
Post-Publish Success Screen
```

### Microcopy

**Header:**
> "Preview your story and confirm publishing details."

**Confirmation Dialog:**
> "Your story is ready to be shared."

---

## Post-Publish Flow

### File
`/src/app/components/creator-flow/PostPublishSuccess.tsx`

### Success State

#### Visual
- Large green checkmark with pulse animation
- "Story Published" heading
- Story title displayed

#### Actions (by visibility)

**Public:**
- View Your Story (primary CTA)
- Share Story
- View Analytics
- Go to Library

**Institutional:**
- View Your Story
- View Analytics
- Go to Library

**Private:**
- View Your Story
- Go to Library

### What Happens Next

#### Public Stories
- Story appears in Explore within 24 hours
- Community responses moderated automatically
- Weekly performance insights sent

#### Institutional Stories
- Partners review within 5-7 days
- Notification of collection placements

#### Private Stories
- Remains in private library
- Can change visibility anytime

---

## Auto-Save System

### Behavior

- **Trigger:** 300-500ms after last input change
- **Indicator:** "Draft saved" text (bottom left)
- **Storage:** Local draft state (frontend)
- **Frequency:** Every field change

### Implementation

```typescript
const handleAutoSave = () => {
  onSaveDraft({
    // Current step data
  });
};

// Debounced save
setTimeout(handleAutoSave, 500);
```

### Resume Capability

When user returns:
1. Detect existing draft
2. Load step where they left off
3. Pre-populate all fields
4. Allow continuation or restart

---

## Progress Tracking

### Non-Gamified Approach

❌ **Avoid:**
- Percentage complete
- Progress bars
- Achievement badges
- Time pressure
- "Almost done!" messaging

✅ **Use:**
- "Step X of 5"
- Simple step indicators
- "Draft saved" confirmation
- Calm, neutral language

### Step Indicator

```
Step 1 of 5 · Story Intent
```

**No visual progress bar** — just text

---

## Validation & Error Handling

### Validation Strategy

**Gentle, not blocking:**
- Show what's needed, not what's wrong
- Use helper text, not error messages
- Disable "Next" until ready
- Never show red error states

### Required Fields

#### Step 1
- Title (non-empty)
- Description (non-empty)
- At least 1 cultural theme
- At least 1 language

#### Step 2
- Structure type selected (default: linear)

#### Step 3
- At least 1 chapter with 50%+ completion

#### Step 4
- Accessibility confirmation checked

#### Step 5
- Rights confirmation checked
- Guidelines confirmation checked
- Collection selected (if institutional)

### Button States

```tsx
// Disabled state
className={`${
  canProceed
    ? 'bg-white text-black hover:bg-white/90'
    : 'bg-white/10 text-white/40 cursor-not-allowed'
}`}
```

---

## Accessibility

### Screen Reader Support

All form elements include:
- Proper `<label>` associations
- Descriptive `placeholder` text
- ARIA labels where needed
- Semantic HTML (`<button>`, `<input>`, etc.)

### Keyboard Navigation

- Tab order follows visual flow
- Enter key submits forms
- Escape key closes modals
- Arrow keys navigate options

### Motion Respect

All animations respect `prefers-reduced-motion`:
```tsx
const reducedMotion = prefersReducedMotion();

<motion.div
  variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
/>
```

### Color Contrast

- All text meets WCAG AA standards
- Interactive elements have visible focus states
- Status indicators use icons + text

---

## Microcopy Principles

### Tone

**Care-centered, not transactional:**
- "This helps us present your story with care"
- "Protect meaning and access"
- "Your story is ready to be shared"

**Supportive, not pushy:**
- "You can adjust this later"
- "Optional" badges for non-required fields
- "Take your time" implied throughout

**Institutional, not casual:**
- "Cultural authorship" not "content creation"
- "Story" not "post"
- "Publish" not "share"

### Examples

✅ **Good:**
> "This helps us present your story with care and context."

❌ **Avoid:**
> "Fill this out so we can show your content!"

✅ **Good:**
> "Structure is a guide, not a constraint."

❌ **Avoid:**
> "Don't worry, you can change this!"

---

## Developer Integration

### Component Structure

```
/src/app/components/creator-flow/
├── StoryIntentStep.tsx
├── StoryStructureStep.tsx
├── MediaChaptersStep.tsx
├── ContextAccessibilityStep.tsx
├── PreviewPublishStep.tsx
└── PostPublishSuccess.tsx
```

### Data Flow

Each step exports:
- **Props interface** with `onNext`, `onBack`, `onSaveDraft`
- **Data interface** for step output
- **Initial data** prop for resume capability

Example:
```typescript
interface StoryIntentStepProps {
  onNext: (data: StoryIntentData) => void;
  onSaveDraft: (data: Partial<StoryIntentData>) => void;
  initialData?: Partial<StoryIntentData>;
}

export interface StoryIntentData {
  title: string;
  description: string;
  culturalThemes: string[];
  languages: Array<'en' | 'fr' | 'es'>;
  intendedAudience: string;
}
```

### State Management

Recommended pattern:
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [storyData, setStoryData] = useState({
  intent: {},
  structure: {},
  chapters: {},
  context: {},
  publish: {},
});

const handleSaveDraft = async (stepData: any) => {
  // Save to local storage or API
  localStorage.setItem('story-draft', JSON.stringify(storyData));
};
```

---

## Design Tokens

### Colors

```css
--bg-primary: #000000;
--border-subtle: rgba(255, 255, 255, 0.1);
--border-active: rgba(255, 255, 255, 0.3);
--text-primary: rgba(255, 255, 255, 1);
--text-secondary: rgba(255, 255, 255, 0.6);
--text-tertiary: rgba(255, 255, 255, 0.4);
```

### Typography

```css
--heading: font-light tracking-wide;
--body: text-sm leading-relaxed;
--label: text-xs tracking-wider uppercase;
```

### Spacing

```css
--section-gap: 2rem (py-8);
--element-gap: 1rem (space-y-4);
--input-padding: 0.75rem 1rem (px-4 py-3);
```

---

## Testing Checklist

### Functional
- [ ] All steps save to draft
- [ ] Back button preserves data
- [ ] Can exit and resume
- [ ] Validation prevents invalid submission
- [ ] Post-publish actions work

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] Reduced motion respected

### Content
- [ ] Microcopy is supportive
- [ ] No gamification language
- [ ] Cultural terms respected
- [ ] Helper text appears
- [ ] Error states are gentle

---

## Future Enhancements

### Phase 2
- [ ] Rich text editor for descriptions
- [ ] Audio recording inline
- [ ] Image cropping/editing
- [ ] Collaborative editing
- [ ] Version history

### Phase 3
- [ ] AI-assisted accessibility checks
- [ ] Auto-generated captions
- [ ] Translation suggestions
- [ ] Cultural sensitivity scanning
- [ ] Smart chapter suggestions

---

**SEEN by CREOVA**  
*Empowering cultural storytellers with respect and care*
