/**
 * MOTION SYSTEM
 * SEEN by CREOVA
 * 
 * Premium, cinematic motion with accessibility-first approach.
 * All animations respect user's reduced motion preferences.
 */

import { MotionProps, Transition, Variants } from "motion/react";

// ============================================
// ACCESSIBILITY
// ============================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  // In-app setting (Settings → Reduce motion) or the OS preference.
  if (document.documentElement.dataset.motion === 'reduced') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation props respecting reduced motion
 */
export const getMotionProps = (props: MotionProps): MotionProps => {
  if (prefersReducedMotion()) {
    return {
      initial: false,
      animate: props.animate,
      exit: undefined,
      transition: { duration: 0 },
    };
  }
  return props;
};

// ============================================
// EASING CURVES
// ============================================

export const EASING = {
  // Smooth, confident entrance
  entrance: [0.25, 0.1, 0.25, 1],
  
  // Gentle, natural exit
  exit: [0.4, 0, 0.6, 1],
  
  // Cinematic, slow reveal
  reveal: [0.65, 0, 0.35, 1],
  
  // Soft, organic movement
  organic: [0.33, 1, 0.68, 1],
  
  // Confident interaction response
  interaction: [0.4, 0, 0.2, 1],
  
  // Smooth spring (no bounce)
  spring: [0.25, 0.46, 0.45, 0.94],
} as const;

// ============================================
// DURATION (in seconds)
// ============================================

export const DURATION = {
  instant: 0,
  fast: 0.15,   // feedback: buttons, icons, hover
  normal: 0.25, // cards, tabs, content
  slow: 0.4,    // sheets, drawers, page-level
  slowest: 0.8,
  cinematic: 1.2,
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const TRANSITIONS: Record<string, Transition> = {
  // Fast, confident interaction
  interaction: {
    duration: DURATION.fast,
    ease: EASING.interaction,
  },
  
  // Standard UI transition
  default: {
    duration: DURATION.normal,
    ease: EASING.entrance,
  },
  
  // Slow, cinematic reveal
  reveal: {
    duration: DURATION.slow,
    ease: EASING.reveal,
  },
  
  // Smooth organic movement
  organic: {
    duration: DURATION.normal,
    ease: EASING.organic,
  },
  
  // Gentle fade
  fade: {
    duration: DURATION.normal,
    ease: EASING.exit,
  },
  
  // Cinematic entrance
  cinematic: {
    duration: DURATION.cinematic,
    ease: EASING.reveal,
  },
  
  // Spring without bounce
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
};

// ============================================
// VARIANT PRESETS
// ============================================

export const VARIANTS = {
  // Fade in from invisible
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,
  
  // Fade in with upward movement
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  } as Variants,
  
  // Fade in with downward movement
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  } as Variants,
  
  // Scale up gently
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  } as Variants,
  
  // Slide from right
  slideFromRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  } as Variants,
  
  // Slide from left
  slideFromLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  } as Variants,
  
  // Stagger container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  } as Variants,
  
  // Stagger item (child)
  staggerItem: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  } as Variants,
};

// ============================================
// INTERACTION STATES
// ============================================

export const HOVER_SCALE = {
  subtle: 1.02,
  normal: 1.05,
  prominent: 1.08,
} as const;

export const PRESS_SCALE = {
  subtle: 0.99,
  normal: 0.98,
  prominent: 0.96,
} as const;

export const GLOW_INTENSITY = {
  subtle: "0_0_8px_rgba(255,255,255,0.3)",
  normal: "0_0_12px_rgba(255,255,255,0.5)",
  prominent: "0_0_20px_rgba(255,255,255,0.7)",
} as const;

// ============================================
// COMPONENT-SPECIFIC VARIANTS
// ============================================

/**
 * Bottom Tab Navigation
 */
export const TAB_VARIANTS = {
  inactive: {
    opacity: 0.4,
    scale: 1,
    filter: "brightness(1)",
  },
  active: {
    opacity: 1,
    scale: 1,
    filter: "brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.5))",
  },
  hover: {
    opacity: 0.6,
    scale: 1,
    filter: "brightness(1.1)",
  },
  tap: {
    opacity: 0.8,
    scale: 0.98,
  },
} as const;

/**
 * Content Cards
 */
export const CARD_VARIANTS = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  // Feedback is fast and independent of the entrance transition (and its stagger delay).
  hover: {
    y: -2,
    boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
    transition: { duration: DURATION.fast, ease: EASING.interaction, delay: 0 },
  },
  tap: {
    scale: 0.99,
    transition: { duration: DURATION.fast, ease: EASING.interaction, delay: 0 },
  },
} as const;

/**
 * Creator Draft Progress
 */
export const PROGRESS_VARIANTS = {
  initial: { pathLength: 0, opacity: 0 },
  animate: (progress: number) => ({
    pathLength: progress / 100,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, ease: EASING.reveal },
      opacity: { duration: 0.3 },
    },
  }),
} as const;

/**
 * Status Badge Transitions
 */
export const STATUS_BADGE_VARIANTS = {
  draft: {
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.4)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  review: {
    backgroundColor: "rgba(234,179,8,0.1)",
    color: "rgba(234,179,8,0.8)",
    borderColor: "rgba(234,179,8,0.2)",
  },
  published: {
    backgroundColor: "rgba(34,197,94,0.1)",
    color: "rgba(34,197,94,0.8)",
    borderColor: "rgba(34,197,94,0.2)",
  },
} as const;

/**
 * Empty State
 */
export const EMPTY_STATE_VARIANTS = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: EASING.reveal,
    },
  },
} as const;

/**
 * Confirmation Pulse
 */
export const CONFIRMATION_PULSE = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 0.6,
    ease: EASING.organic,
  },
};

// ============================================
// AUDIO / PLAYBACK
// ============================================

export const AUDIO_VARIANTS = {
  playing: {
    opacity: 1,
    scale: 1,
  },
  paused: {
    opacity: 0.6,
    scale: 0.98,
  },
} as const;

export const WAVEFORM_VARIANTS: Variants = {
  idle: {
    scaleY: 1,
  },
  playing: {
    scaleY: [1, 1.2, 0.8, 1.1, 0.9, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get stagger delay for index
 */
export const getStaggerDelay = (index: number, baseDelay = 0.05): number => {
  return index * baseDelay;
};

/**
 * Create safe motion props that respect reduced motion
 */
export const createMotionProps = (
  initial: any,
  animate: any,
  transition?: Transition,
  exit?: any
): MotionProps => {
  if (prefersReducedMotion()) {
    return {
      initial: false,
      animate: animate,
      transition: { duration: 0 },
    };
  }
  
  return {
    initial,
    animate,
    exit: exit || initial,
    transition: transition || TRANSITIONS.default,
  };
};

/**
 * Haptic feedback helper (mobile only)
 */
export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30;
    navigator.vibrate(duration);
  }
};
