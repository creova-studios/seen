# Motion System Documentation
**SEEN by CREOVA — Cinematic Micro-Interactions**

---

## Philosophy

Motion in SEEN communicates **state change**, **confidence**, and **premium quality**. Every animation has a purpose—never decorative, always intentional.

### Core Principles

✅ **Slow, confident, cinematic** — No bounces or gimmicks  
✅ **Accessibility-first** — Respects `prefers-reduced-motion`  
✅ **Dark mode optimized** — Subtle glows, soft shadows  
✅ **State communication** — Motion shows transitions, not tricks  
✅ **Haptic feedback** — Light, intentional (mobile)

❌ **No social media patterns** — No likes, hearts, confetti  
❌ **No aggressive animations** — No shakes, bounces, flashes  
❌ **No motion-only info** — Critical info never relies on animation

---

## System Architecture

### Files Created

```
/src/app/utils/
└── motion.ts                      # Motion system core

/src/app/components/
├── BottomNavigation.tsx           # Tab interactions
├── ContentCard.tsx                # Card hover/tap (updated)
├── AudioPlayer.tsx                # Playback animations
├── CreatorConfirmations.tsx       # Toast & status badges
└── EmptyStateAnimated.tsx         # Empty state visuals
```

---

## Timing & Easing

### Duration Scale

```typescript
DURATION = {
  instant: 0,           // Accessibility fallback
  fast: 0.2s,          // Quick interactions (tap, hover)
  normal: 0.3s,        // Standard transitions
  slow: 0.5s,          // Reveals, fades
  slowest: 0.8s,       // Emphasis moments
  cinematic: 1.2s,     // Hero animations
}
```

### Easing Curves

```typescript
EASING = {
  entrance: [0.25, 0.1, 0.25, 1],     // Confident arrival
  exit: [0.4, 0, 0.6, 1],             // Gentle departure
  reveal: [0.65, 0, 0.35, 1],         // Slow cinematic reveal
  organic: [0.33, 1, 0.68, 1],        // Natural movement
  interaction: [0.4, 0, 0.2, 1],      // Responsive feel
  spring: [0.25, 0.46, 0.45, 0.94],   // Smooth spring (no bounce)
}
```

**Visual Reference:**
```
entrance:    ▁▃▅▇█  Confident, direct
exit:        █▇▅▃▁  Gentle, fading
reveal:      ▁▁▃▅█  Slow build-up
organic:     ▁▃▆█▇  Natural ease
interaction: ▃▆█▇▅  Quick response
spring:      ▁▃█▇█  Smooth settle
```

---

## Component Interactions

### 1. Bottom Tab Navigation

**File:** `BottomNavigation.tsx`

#### States
```
Inactive → opacity: 0.4, scale: 1
Active   → opacity: 1, scale: 1, glow
Hover    → opacity: 0.6
Tap      → opacity: 0.8, scale: 0.98
```

#### Behaviors
- **Active state**: Soft white glow (`drop-shadow`)
- **Tab switch**: Layout animation with spring physics
- **Creator badge**: Delayed entrance, staggered by index
- **Active indicator**: Animated line below icon

#### Code Example
```tsx
<motion.button
  variants={TAB_VARIANTS}
  animate={isActive ? "active" : "inactive"}
  whileHover="hover"
  whileTap="tap"
  transition={TRANSITIONS.interaction}
>
  <Icon strokeWidth={isActive ? 2 : 1.5} />
</motion.button>
```

#### Timing
- Tab switch: **200ms** (fast, responsive)
- Glow transition: **300ms** (smooth fade)
- Layout animation: Spring physics (no duration)

---

### 2. Content Cards

**File:** `ContentCard.tsx`

#### States
```
Initial  → opacity: 0, y: 20, scale: 0.98
Visible  → opacity: 1, y: 0, scale: 1
Hover    → y: -4, scale: 1.02, shadow expand
Tap      → scale: 0.98
```

#### Behaviors
- **Staggered entrance**: 50ms delay per card
- **Image zoom**: 1.05× scale on hover (1.2s duration)
- **Play button**: Fade in on hover, scale on interaction
- **Border glow**: Subtle white outline appears

#### Code Example
```tsx
<motion.button
  variants={CARD_VARIANTS}
  initial="initial"
  animate="visible"
  whileHover="hover"
  whileTap="tap"
  transition={{
    ...TRANSITIONS.reveal,
    delay: getStaggerDelay(index),
  }}
>
  <motion.img
    whileHover={{ scale: 1.05 }}
    transition={TRANSITIONS.cinematic}
  />
</motion.button>
```

#### Timing
- Entrance: **500ms** (cinematic reveal)
- Stagger: **50ms** per item
- Image zoom: **1200ms** (slow, premium)
- Hover: **200ms** (responsive)

---

### 3. Audio Player

**File:** `AudioPlayer.tsx`

#### Play/Pause States
```
Playing → opacity: 1, scale: 1, pulse ring
Paused  → opacity: 0.6, scale: 0.98, dim
```

#### Behaviors
- **Play button**: Icon crossfade (pause ↔ play)
- **Pulse ring**: Expanding circle when playing
- **Waveform**: 40 bars animated with random delays
- **Progress bar**: Smooth width transition + glow
- **Chapter transition**: "Next chapter..." fade in at 95%

#### Code Example
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <AnimatePresence mode="wait">
    {isPlaying ? (
      <motion.div
        key="pause"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <Pause />
      </motion.div>
    ) : (
      <motion.div key="play">
        <Play />
      </motion.div>
    )}
  </AnimatePresence>
</motion.button>
```

#### Timing
- Play/pause transition: **200ms** (instant response)
- Pulse ring: **2s** loop
- Waveform bars: **800-1200ms** random
- Progress bar: **300ms** smooth

---

### 4. Creator Confirmations

**File:** `CreatorConfirmations.tsx`

#### Toast Types
```
Saved      → White badge, subtle pulse
Published  → Green badge, delayed confirmation
Processing → Blue badge, rotating spinner
Error      → Red badge (only when blocking)
```

#### Behaviors
- **Entrance**: Fade + slide from top
- **Confirmation pulse**: Scale 1 → 1.05 → 1 over 600ms
- **Status badge morph**: Color transition on state change
- **Spinner**: Continuous rotation (2s loop)

#### Code Example
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ 
    opacity: 1, 
    y: 0,
    ...CONFIRMATION_PULSE // Adds gentle pulse
  }}
  exit={{ opacity: 0, y: -20 }}
>
  <StatusBadge status="published">
    Published
  </StatusBadge>
</motion.div>
```

#### Timing
- Toast entrance: **300ms** (organic ease)
- Confirmation pulse: **600ms** (one-time)
- Status morph: **500ms** (smooth color shift)
- Auto-dismiss: **3000ms** (3 seconds)

---

### 5. Empty States

**File:** `EmptyStateAnimated.tsx`

#### Behaviors
- **Icon glow**: Pulsing halo (3s loop)
- **Content stagger**: Title → message → button
- **Floating particles**: 3 dots with random paths
- **Gentle entrance**: Scale up from 0.95

#### Code Example
```tsx
<motion.div
  variants={EMPTY_STATE_VARIANTS}
  initial="initial"
  animate="animate"
>
  {/* Pulsing glow */}
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.1, 0.3],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
    }}
    className="bg-white/10 blur-xl"
  />
  
  <Icon className="text-white/40" />
  <h3>{title}</h3>
  <p>{message}</p>
  <button>{actionLabel}</button>
</motion.div>
```

#### Timing
- Entrance: **800ms** (slow reveal)
- Glow pulse: **3s** loop
- Particles: **4-7s** random
- Stagger delay: **100ms** per element

---

## Accessibility Implementation

### Reduced Motion Detection

```typescript
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
```

### Safe Motion Props

```typescript
export const createMotionProps = (
  initial: any,
  animate: any,
  transition?: Transition
): MotionProps => {
  if (prefersReducedMotion()) {
    return {
      initial: false,
      animate: animate, // Final state only
      transition: { duration: 0 }, // Instant
    };
  }
  
  return { initial, animate, transition };
};
```

### Usage Pattern

```tsx
const reducedMotion = prefersReducedMotion();

<motion.div
  variants={!reducedMotion ? CARD_VARIANTS : undefined}
  whileHover={!reducedMotion ? "hover" : undefined}
  transition={TRANSITIONS.reveal}
/>
```

**Result:**
- Users with `prefers-reduced-motion: reduce` see instant state changes
- No animations, but final states are preserved
- UI remains functional without motion

---

## Haptic Feedback (Mobile)

### Implementation

```typescript
export const triggerHaptic = (
  style: 'light' | 'medium' | 'heavy' = 'light'
) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const duration = style === 'light' ? 10 
                   : style === 'medium' ? 20 
                   : 30;
    navigator.vibrate(duration);
  }
};
```

### Usage Guidelines

| Action | Haptic Style | Duration |
|--------|--------------|----------|
| Tab switch | Light | 10ms |
| Card tap | Light | 10ms |
| Play/Pause | Medium | 20ms |
| Publish | Heavy | 30ms |
| Error | Heavy | 30ms |

**Pattern:**
```tsx
const handleTap = () => {
  triggerHaptic('light');
  onAction();
};
```

---

## Stagger Animations

### Helper Function

```typescript
export const getStaggerDelay = (
  index: number, 
  baseDelay = 0.05
): number => {
  return index * baseDelay;
};
```

### Container/Item Pattern

```tsx
<motion.div
  variants={VARIANTS.staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      variants={VARIANTS.staggerItem}
      transition={{
        delay: getStaggerDelay(index),
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Result:**
- First item: 0ms delay
- Second item: 50ms delay
- Third item: 100ms delay
- Creates top-to-bottom reveal

---

## Variant Presets

### Available Variants

```typescript
VARIANTS = {
  fadeIn,           // Simple opacity fade
  fadeInUp,         // Fade + move up
  fadeInDown,       // Fade + move down
  scaleIn,          // Fade + scale
  slideFromRight,   // Horizontal slide
  slideFromLeft,    // Horizontal slide
  staggerContainer, // Parent for stagger
  staggerItem,      // Child in stagger
}
```

### Usage

```tsx
import { VARIANTS, TRANSITIONS } from '../utils/motion';

<motion.div
  variants={VARIANTS.fadeInUp}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={TRANSITIONS.reveal}
/>
```

---

## Developer Guidelines

### 1. Always Check Reduced Motion

```tsx
// ✅ Good
const reducedMotion = prefersReducedMotion();
<motion.div
  whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
/>

// ❌ Bad
<motion.div whileHover={{ scale: 1.05 }} />
```

### 2. Use Preset Transitions

```tsx
// ✅ Good
<motion.div transition={TRANSITIONS.reveal} />

// ❌ Bad
<motion.div transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }} />
```

### 3. Haptics for Interactions

```tsx
// ✅ Good
const handlePress = () => {
  triggerHaptic('light');
  onAction();
};

// ❌ Bad
const handlePress = () => {
  onAction(); // No haptic feedback
};
```

### 4. Stagger with getStaggerDelay

```tsx
// ✅ Good
{items.map((item, index) => (
  <motion.div
    key={item.id}
    transition={{
      delay: getStaggerDelay(index),
    }}
  />
))}

// ❌ Bad
{items.map((item, index) => (
  <motion.div
    key={item.id}
    transition={{
      delay: index * 0.1, // Hardcoded
    }}
  />
))}
```

---

## Performance Best Practices

### 1. Use Transform & Opacity

```tsx
// ✅ Good (GPU-accelerated)
<motion.div
  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
/>

// ❌ Bad (triggers layout)
<motion.div
  animate={{ width: '100%', height: '100%' }}
/>
```

### 2. Layout Animations with layoutId

```tsx
// ✅ Good (smooth shared element)
<motion.div layoutId="activeTab" />

// ❌ Bad (abrupt transition)
{isActive && <div className="indicator" />}
```

### 3. AnimatePresence for Exits

```tsx
// ✅ Good
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>

// ❌ Bad (no exit animation)
{isVisible && <motion.div />}
```

---

## Motion Tokens

### Scale Values

```typescript
HOVER_SCALE = {
  subtle: 1.02,    // Cards, buttons
  normal: 1.05,    // Play buttons
  prominent: 1.08, // Hero CTAs
}

PRESS_SCALE = {
  subtle: 0.99,    // Minimal feedback
  normal: 0.98,    // Standard tap
  prominent: 0.96, // Emphasized action
}
```

### Glow Intensity

```typescript
GLOW_INTENSITY = {
  subtle: "0_0_8px_rgba(255,255,255,0.3)",
  normal: "0_0_12px_rgba(255,255,255,0.5)",
  prominent: "0_0_20px_rgba(255,255,255,0.7)",
}
```

### Usage

```tsx
<motion.div
  whileHover={{
    scale: HOVER_SCALE.normal,
    filter: `drop-shadow(${GLOW_INTENSITY.normal})`,
  }}
  whileTap={{
    scale: PRESS_SCALE.normal,
  }}
/>
```

---

## Testing Motion

### Manual Tests

1. **Hover states**: Verify smooth transitions on all interactive elements
2. **Tap/click feedback**: Check scale and timing feel responsive
3. **Reduced motion**: Toggle system setting, verify instant states
4. **Stagger timing**: Ensure delays feel natural, not mechanical
5. **Empty states**: Confirm particles and glows loop smoothly

### Accessibility Audit

- [ ] All animations respect `prefers-reduced-motion`
- [ ] Critical information never relies on motion alone
- [ ] Focus indicators remain visible during animations
- [ ] Animations don't trigger vestibular issues (no spinning, shaking)
- [ ] Haptic feedback is optional enhancement, not required

---

## Quick Reference

| Component | Duration | Easing | Behavior |
|-----------|----------|--------|----------|
| Tab Switch | 200ms | interaction | Scale + glow |
| Card Hover | 500ms | reveal | Lift + shadow |
| Card Entrance | 500ms + stagger | reveal | Fade + slide up |
| Play/Pause | 200ms | interaction | Icon crossfade |
| Audio Progress | 300ms | organic | Smooth width |
| Toast | 300ms | organic | Fade + slide |
| Empty State | 800ms | reveal | Scale + fade |
| Status Badge | 500ms | ease | Color morph |

---

## Future Enhancements

### Phase 2
- [ ] Page transition animations
- [ ] Scroll-linked parallax
- [ ] Loading skeleton screens
- [ ] Gesture-driven navigation

### Phase 3
- [ ] Advanced audio visualizations
- [ ] Creator onboarding flow animations
- [ ] Content preview modal transitions
- [ ] Multi-step form progress

---

**SEEN by CREOVA**  
*Motion that communicates, never distracts*
