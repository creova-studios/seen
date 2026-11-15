# Creator Mode Documentation
**SEEN by CREOVA — Professional Creator Interface**

---

## Overview

Creator Mode is a **role-based overlay system** that transforms the SEEN experience for users with the `creator`, `moderator`, or `admin` role. It maintains the core navigation structure while adding professional tools, insights, and opportunities.

### Design Philosophy

✅ **Professional, not social-media loud**  
✅ **Calm, intentional, tool-forward**  
✅ **Editorial dashboard aesthetic**  
✅ **No gamification or metrics obsession**  
✅ **Cinematic dark mode maintained**

---

## Architecture

### Role Detection
- Creator Mode is **automatically activated** based on user role
- No manual toggle required
- Viewer experience remains completely unchanged
- Seamless role-based UI adaptation

### Navigation Structure
**PRESERVED:** Bottom tab bar (For You, Explore, Library, Profile)  
**ADDED:** Creator-specific content and controls within each tab  
**MAINTAINED:** Dark cinematic aesthetic, iconless UI principles

---

## Tab-by-Tab Breakdown

### 1. FOR YOU (Creator Version)
**Component:** `ForYouScreenCreator.tsx`

#### Creator Additions:
```
┌─────────────────────────────────┐
│ Your Performance Card           │
│ • Views (with trend %)          │
│ • Completion rate               │
│ • Community responses           │
│ • Link to full dashboard        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ In Progress Drafts              │
│ • Horizontal strip              │
│ • Progress circles (%)          │
│ • Last edited timestamp         │
│ • Quick edit access             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Recommended Improvements        │
│ • Platform insights             │
│ • Accessibility tips            │
│ • Format trends                 │
└─────────────────────────────────┘

[Regular For You feed below]
```

#### Visual Differentiation:
- Creator badge on navigation icon (small white dot)
- Soft border cards (`border-white/10`)
- Data visualization with circles, not charts
- Muted colors (`text-white/40` for labels)

---

### 2. EXPLORE (Creator Version)
**Component:** `ExploreScreenCreator.tsx`

#### Creator Additions:
```
┌─────────────────────────────────┐
│ Open Calls & Themes             │
│ • Featured opportunities        │
│ • Organization details          │
│ • Deadlines                     │
│ • Thematic categories           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Trending Formats                │
│ • Music / Film / Story          │
│ • Growth percentages            │
│ • Format descriptions           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Institutional Opportunities     │
│ • Collections seeking           │
│   contributors                  │
│ • Museum partnerships           │
│ • Theme tags                    │
└─────────────────────────────────┘

[Regular Explore categories below]
```

#### Design Cues:
- **Grant bulletin feel** (not job board)
- Opportunity-oriented, not competitive
- Museum/cultural institution aesthetic
- No aggressive CTAs

---

### 3. LIBRARY (Creator Version)
**Component:** `LibraryScreenCreator.tsx`

#### Creator Workspace:
```
Tabs:
┌───────┬──────────┬──────────┬──────────┐
│DRAFTS │SCHEDULED │PUBLISHED │ARCHIVED  │
└───────┴──────────┴──────────┴──────────┘

Per-Item Controls:
┌─────────────────────────────────┐
│ Content Card                    │
│ • Progress indicator (drafts)   │
│ • Status badges                 │
│ • Metadata (views, edited)      │
│                                 │
│ ┌────┬────────┬─────────┬──────┐
│ │EDIT│PREVIEW │DUPLICATE│ARCHIVE│
│ └────┴────────┴─────────┴──────┘
└─────────────────────────────────┘
```

#### Status System:
- **Draft:** Grey badge, progress circle
- **Scheduled:** White badge, publish date
- **Under Review:** Yellow badge, review status
- **Published:** Green badge, view count
- **Archived:** Grey badge, archived date

#### Action Bar:
- Edit → Opens content editor
- Preview → Shows published view
- Duplicate → Creates copy
- Archive → Moves to archived tab

---

### 4. PROFILE (Creator Version)
**Component:** `ProfileScreenCreator.tsx`

#### Creator Identity:
```
┌─────────────────────────────────┐
│ Avatar with Creator Badge       │
│ • Award icon overlay            │
│ • Creator role pill             │
│                                 │
│ [CREATE NEW] Primary CTA        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Impact & Contribution Stats     │
│ • Hours Created                 │
│ • Cultural Contributions        │
│ • Community Impact              │
│ • Avg Completion Rate           │
└─────────────────────────────────┘
```

#### Creator Tools Section:
- **Creator Dashboard:** Analytics & insights
- **Rights & Licensing:** IP management, attribution
- **Content Guidelines:** Standards & best practices

#### Settings (Enhanced):
- Language (EN / FR / ES)
- Accessibility options
- Privacy & data controls
- CMF Grant Resources (institutional support)

---

## Visual Design System

### Creator Badge
```tsx
// Small white dot on navigation icons
<div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white border border-black" />
```

### Status Badges
```tsx
// Draft
className="text-white/40 bg-white/5"

// Under Review
className="text-yellow-500/80 bg-yellow-500/10"

// Published
className="text-green-500/80 bg-green-500/10"

// Archived
className="text-white/30 bg-white/5"
```

### Progress Circles
```tsx
// SVG-based circular progress
<svg className="w-12 h-12 -rotate-90">
  <circle r="18" stroke="white/10" /> // Background
  <circle r="18" stroke="white/60" strokeDashoffset={...} /> // Progress
</svg>
```

### Card Styling
```tsx
// Creator cards
className="border border-white/10 bg-white/[0.02] rounded-lg 
           hover:border-white/20 hover:bg-white/[0.04]"
```

---

## Data Queries

### Creator Performance
```typescript
getCreatorPerformanceData()
// Returns: views, viewsTrend, completion, responses
```

### Creator Drafts
```typescript
getCreatorDrafts()
// Returns: drafts with progress, lastEdited
```

### Open Calls
```typescript
getCreatorOpenCalls(language)
// Returns: opportunities filtered by language
```

### Trending Formats
```typescript
getTrendingFormats()
// Returns: format trends with growth %
```

### Institutional Opportunities
```typescript
getInstitutionalOpportunities(language)
// Returns: collections seeking contributors
```

---

## Implementation Guide

### 1. Role-Based Rendering
```tsx
// In main app component
const { state } = useAuth();
const isCreator = state.user?.role === 'creator' || 
                  state.user?.role === 'moderator' || 
                  state.user?.role === 'admin';

return (
  <>
    {isCreator ? (
      <ForYouScreenCreator {...props} />
    ) : (
      <ForYouScreen {...props} />
    )}
  </>
);
```

### 2. Navigation Badge
```tsx
// Show creator badge on all tabs when in creator mode
{isCreator && (
  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white border border-black" />
)}
```

### 3. Data Fetching
```tsx
// Use creator-specific queries
import { 
  getCreatorPerformanceData,
  getCreatorDrafts,
  getCreatorOpenCalls 
} from '../data/queries';

const performance = getCreatorPerformanceData();
const drafts = getCreatorDrafts();
const calls = getCreatorOpenCalls(activeLanguage);
```

---

## Key Principles

### ✅ DO:
- Maintain cinematic dark aesthetic
- Use subtle borders and backgrounds
- Show impact metrics (hours, contributions)
- Provide professional tools and insights
- Keep navigation structure intact
- Use role-based rendering

### ❌ DON'T:
- Add bright colors or gamification
- Use social media patterns (likes, followers)
- Introduce disruptive popups
- Change core navigation
- Create separate creator app
- Make metrics competitive

---

## Accessibility

All creator mode features maintain:
- **WCAG AA** color contrast
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Reduced motion** respect
- **Focus indicators** on all interactive elements

---

## Performance

Creator mode components:
- Use **Motion** for smooth animations
- Implement **lazy loading** for content lists
- Cache **performance data** locally
- Optimize **image loading** with placeholders

---

## Future Enhancements

### Phase 2:
- Real-time collaboration tools
- Version history for drafts
- Advanced analytics dashboard
- Export tools (PDF, JSON)

### Phase 3:
- AI-assisted content improvements
- Automated accessibility checks
- Multi-language draft sync
- Team collaboration features

---

## Files Created

```
/src/app/components/
├── ForYouScreenCreator.tsx      # Creator For You screen
├── ExploreScreenCreator.tsx     # Creator Explore screen
├── LibraryScreenCreator.tsx     # Creator Library workspace
└── ProfileScreenCreator.tsx     # Creator Profile & tools

/src/app/data/
└── queries.ts                   # Creator data queries added

/CREATOR_MODE_DOCUMENTATION.md   # This file
```

---

## Support & Resources

- **CMF Grant Compliance:** Built-in grant resource links
- **Rights Management:** IP and attribution tools
- **Content Guidelines:** Integrated best practices
- **Creator Community:** Feedback and support channels

---

**SEEN by CREOVA**  
*Empowering cultural storytellers with professional tools and institutional partnerships*
