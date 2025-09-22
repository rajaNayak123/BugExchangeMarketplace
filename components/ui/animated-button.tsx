"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { hoverAnimation, tapAnimation, scaleIn } from "@/lib/animations";

/**
 * Animated Button Variants
 *
 * This defines the different visual styles for buttons.
 * Each variant has its own colors and appearance.
 *
 * Why we use class-variance-authority (cva):
 * - Type-safe variant definitions
 * - Easy to add new variants
 * - Consistent styling across components
 * - Better performance than conditional classes
 */
const animatedButtonVariants = cva(
  // Base styles that apply to all button variants
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Different visual styles
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Different sizes
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Default values
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * AnimatedButton Component Props
 *
 * Extends the base button props with animation-specific options.
 */
interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  // Animation options
  variants?: Variants; // Custom animation variants
  delay?: number; // Delay before animation starts
  duration?: number; // Animation duration
  disableHover?: boolean; // Disable hover animations
  disableTap?: boolean; // Disable tap animations
  loading?: boolean; // Show loading state
  loadingText?: string; // Text to show while loading
}

/**
 * AnimatedButton Component
 *
 * An enhanced button with smooth animations and visual feedback.
 *
 * Features:
 * - Smooth scale and color transitions
 * - Hover effects (scale up, shadow)
 * - Tap effects (scale down when pressed)
 * - Loading state with spinner
 * - Accessibility support
 * - Customizable animations
 *
 * @param variant - Visual style variant
 * @param size - Button size
 * @param variants - Custom animation variants
 * @param delay - Animation delay
 * @param duration - Animation duration
 * @param disableHover - Disable hover animations
 * @param disableTap - Disable tap animations
 * @param loading - Show loading state
 * @param loadingText - Text to show while loading
 * @param children - Button content
 * @param className - Additional CSS classes
 * @param ...props - Additional button props
 */
export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      className,
      variant,
      size,
      variants,
      delay = 0,
      duration = 0.3,
      disableHover = false,
      disableTap = false,
      loading = false,
      loadingText = "Loading...",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Create animation variants based on props
    const animationVariants = variants || scaleIn(0.9, delay, duration);

    return (
      <motion.button
        ref={ref}
        // Initial state - button starts slightly smaller
        initial="hidden"
        // Animate to visible state
        animate="visible"
        // Use custom variants or default scale in
        variants={animationVariants}
        // Hover effects - only if not disabled
        whileHover={
          !disabled && !disableHover && !loading
            ? hoverAnimation(1.05, "0 4px 12px rgba(0,0,0,0.15)")
            : undefined
        }
        // Tap effects - only if not disabled
        whileTap={
          !disabled && !disableTap && !loading ? tapAnimation(0.95) : undefined
        }
        // Disabled state
        disabled={disabled || loading}
        // Combine variant styles with custom className
        className={cn(animatedButtonVariants({ variant, size, className }))}
        // Accessibility attributes
        aria-disabled={disabled || loading}
        aria-busy={loading}
        // Pass through additional props (excluding conflicting ones)
        {...(props as any)}
      >
        {/* 
          Loading spinner - only visible when loading
          Uses a simple CSS animation for the spinner
        */}
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            // Fade in the spinner
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
        )}

        {/* 
          Button content
          Fades out when loading, fades in when not loading
        */}
        <motion.span
          animate={{ opacity: loading ? 0.7 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? loadingText : children}
        </motion.span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

/**
 * AnimatedIconButton Component
 *
 * A specialized button for icons only.
 * Has a circular design and icon-specific animations.
 */
interface AnimatedIconButtonProps
  extends Omit<AnimatedButtonProps, "size" | "children"> {
  icon: React.ReactNode; // Icon to display
  "aria-label": string; // Required for accessibility
}

export const AnimatedIconButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedIconButtonProps
>(({ icon, className, ...props }, ref) => {
  return (
    <AnimatedButton
      ref={ref}
      size="icon"
      className={cn("rounded-full", className)}
      {...props}
    >
      <motion.div
        // Icon rotation on hover
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
    </AnimatedButton>
  );
});

AnimatedIconButton.displayName = "AnimatedIconButton";

/**
 * AnimatedButtonGroup Component
 *
 * A group of buttons with staggered animations.
 * Each button animates in with a slight delay.
 */
interface AnimatedButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number; // Delay between each button
}

export const AnimatedButtonGroup = React.forwardRef<
  HTMLDivElement,
  AnimatedButtonGroupProps
>(({ children, className, staggerDelay = 0.1 }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("flex gap-2", className)}
      // Stagger children animations
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {/* 
        Wrap each child in a motion.div for staggered animation
        This creates a cascading effect where buttons appear one by one
      */}
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
});

AnimatedButtonGroup.displayName = "AnimatedButtonGroup";
