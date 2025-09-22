/**
 * Animation Utilities
 *
 * This file contains reusable animation configurations for Framer Motion.
 * These animations provide smooth, consistent motion throughout the app.
 *
 * Why we use Framer Motion:
 * - Better performance than CSS animations
 * - More control over animation timing
 * - Built-in gesture support
 * - Better accessibility with reduced motion support
 */

import { Variants, Transition } from "framer-motion";

/**
 * Common Animation Durations
 *
 * These durations are used consistently across the app:
 * - Fast: Quick micro-interactions (100-200ms)
 * - Normal: Standard transitions (300-500ms)
 * - Slow: Complex animations (600-1000ms)
 */
export const durations = {
  fast: 0.2, // 200ms - for hover effects, button presses
  normal: 0.3, // 300ms - for most UI transitions
  slow: 0.5, // 500ms - for page transitions, complex animations
  slower: 0.8, // 800ms - for loading animations
} as const;

/**
 * Common Easing Functions
 *
 * Easing functions control how animations accelerate and decelerate:
 * - easeOut: Starts fast, ends slow (good for UI elements appearing)
 * - easeIn: Starts slow, ends fast (good for UI elements disappearing)
 * - easeInOut: Starts slow, speeds up, then slows down (smooth transitions)
 * - spring: Natural bouncing motion (good for playful interactions)
 */
export const easings = {
  easeOut: [0.25, 0.46, 0.45, 0.94],
  easeIn: [0.55, 0.06, 0.68, 0.19],
  easeInOut: [0.42, 0, 0.58, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
} as const;

/**
 * Fade In Animation
 *
 * Simple fade in effect for elements appearing on screen.
 * Used for: Cards, modals, tooltips, notifications
 *
 * @param delay - Delay before animation starts (in seconds)
 * @param duration - How long the animation takes (in seconds)
 */
export const fadeIn = (
  delay = 0,
  duration: number = durations.normal
): Variants => ({
  hidden: {
    opacity: 0, // Start completely transparent
  },
  visible: {
    opacity: 1, // End fully visible
    transition: {
      delay, // Wait before starting
      duration, // How long to animate
      ease: easings.easeOut,
    },
  },
});

/**
 * Slide In From Bottom Animation
 *
 * Elements slide up from below the viewport.
 * Used for: Modals, bottom sheets, mobile menus
 *
 * @param distance - How far to slide from (in pixels)
 * @param delay - Delay before animation starts
 * @param duration - Animation duration
 */
export const slideInFromBottom = (
  distance = 50,
  delay = 0,
  duration: number = durations.normal
): Variants => ({
  hidden: {
    opacity: 0, // Start transparent
    y: distance, // Start below final position
  },
  visible: {
    opacity: 1, // End visible
    y: 0, // End at final position
    transition: {
      delay,
      duration,
      ease: easings.easeOut,
    },
  },
});

/**
 * Slide In From Right Animation
 *
 * Elements slide in from the right side.
 * Used for: Sidebars, slide-out panels, notifications
 *
 * @param distance - How far to slide from (in pixels)
 * @param delay - Delay before animation starts
 * @param duration - Animation duration
 */
export const slideInFromRight = (
  distance = 50,
  delay = 0,
  duration: number = durations.normal
): Variants => ({
  hidden: {
    opacity: 0, // Start transparent
    x: distance, // Start to the right
  },
  visible: {
    opacity: 1, // End visible
    x: 0, // End at final position
    transition: {
      delay,
      duration,
      ease: easings.easeOut,
    },
  },
});

/**
 * Scale In Animation
 *
 * Elements grow from a smaller size to full size.
 * Used for: Buttons, cards, icons, loading states
 *
 * @param initialScale - Starting scale (0.8 = 80% of final size)
 * @param delay - Delay before animation starts
 * @param duration - Animation duration
 */
export const scaleIn = (
  initialScale = 0.8,
  delay = 0,
  duration: number = durations.normal
): Variants => ({
  hidden: {
    opacity: 0, // Start transparent
    scale: initialScale, // Start smaller
  },
  visible: {
    opacity: 1, // End visible
    scale: 1, // End at full size
    transition: {
      delay,
      duration,
      ease: easings.easeOut,
    },
  },
});

/**
 * Stagger Animation
 *
 * Animates multiple children with a delay between each.
 * Used for: Lists, grids, form fields appearing in sequence
 *
 * @param staggerDelay - Delay between each child (in seconds)
 * @param childDelay - Delay for individual children
 */
export const staggerContainer = (
  staggerDelay = 0.1,
  childDelay = 0
): Variants => ({
  hidden: {
    opacity: 0, // Container starts transparent
  },
  visible: {
    opacity: 1, // Container becomes visible
    transition: {
      // Stagger children - each child starts after the previous one
      staggerChildren: staggerDelay,
      delayChildren: childDelay,
    },
  },
});

/**
 * Stagger Child Animation
 *
 * Individual child animation for use with staggerContainer.
 * Each child fades in and slides up slightly.
 */
export const staggerChild: Variants = {
  hidden: {
    opacity: 0, // Start transparent
    y: 20, // Start slightly below
  },
  visible: {
    opacity: 1, // End visible
    y: 0, // End at final position
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
};

/**
 * Hover Animation
 *
 * Subtle scale and shadow effect on hover.
 * Used for: Buttons, cards, interactive elements
 *
 * @param scale - How much to scale on hover (1.05 = 5% larger)
 * @param shadow - Shadow intensity on hover
 */
export const hoverAnimation = (
  scale = 1.05,
  shadow = "0 10px 25px rgba(0,0,0,0.1)"
) => ({
  scale, // Scale up on hover
  boxShadow: shadow, // Add shadow on hover
  transition: {
    duration: durations.fast, // Quick transition
    ease: easings.easeOut,
  },
});

/**
 * Tap Animation
 *
 * Quick scale down effect when pressed.
 * Used for: Buttons, clickable elements
 *
 * @param scale - How much to scale down (0.95 = 5% smaller)
 */
export const tapAnimation = (scale = 0.95) => ({
  scale, // Scale down when pressed
  transition: {
    duration: 0.1, // Very quick transition
    ease: easings.easeIn,
  },
});

/**
 * Loading Spinner Animation
 *
 * Continuous rotation for loading states.
 * Used for: Loading spinners, progress indicators
 *
 * @param duration - How long one rotation takes (in seconds)
 */
export const loadingSpinner = (duration = 1): Variants => ({
  animate: {
    rotate: 360, // Full rotation
    transition: {
      duration, // How long one rotation takes
      repeat: Infinity, // Repeat forever
      ease: "linear", // Constant speed
    },
  },
});

/**
 * Page Transition Animation
 *
 * Smooth transition between pages.
 * Used for: Route changes, page navigation
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0, // Start transparent
    y: 20, // Start slightly below
  },
  in: {
    opacity: 1, // End visible
    y: 0, // End at final position
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
  out: {
    opacity: 0, // Fade out
    y: -20, // Move up slightly
    transition: {
      duration: durations.fast,
      ease: easings.easeIn,
    },
  },
};

/**
 * Accessibility: Reduced Motion Support
 *
 * Checks if user prefers reduced motion.
 * If true, animations should be disabled or simplified.
 */
export const prefersReducedMotion = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return false;

  // Check user's motion preference
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get Animation Variants with Reduced Motion Support
 *
 * Returns simplified animations if user prefers reduced motion.
 * This ensures accessibility compliance.
 *
 * @param variants - The animation variants to use
 * @param reducedMotionVariants - Simplified variants for reduced motion
 */
export const getAccessibleVariants = <T extends Variants>(
  variants: T,
  reducedMotionVariants?: Partial<T>
): T => {
  // If user prefers reduced motion, use simplified animations
  if (prefersReducedMotion()) {
    return (
      (reducedMotionVariants as T) ||
      ({
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      } as unknown as T)
    );
  }

  // Otherwise, use full animations
  return variants;
};
