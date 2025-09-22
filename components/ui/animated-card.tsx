"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeIn, hoverAnimation, tapAnimation } from "@/lib/animations";

/**
 * AnimatedCard Component
 *
 * This is an enhanced version of the regular Card component with smooth animations.
 * It provides visual feedback when users interact with it.
 *
 * Features:
 * - Fade in animation when first rendered
 * - Hover effects (scale up, shadow)
 * - Tap effects (scale down when pressed)
 * - Accessibility support (respects reduced motion preference)
 * - Customizable animation variants
 *
 * @param children - Content to display inside the card
 * @param className - Additional CSS classes
 * @param variants - Custom animation variants (optional)
 * @param delay - Delay before animation starts (in seconds)
 * @param duration - Animation duration (in seconds)
 * @param interactive - Whether the card should have hover/tap effects
 * @param onClick - Click handler function
 * @param ...props - Additional HTML div props
 */
interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  duration?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      children,
      className,
      variants,
      delay = 0,
      duration = 0.3,
      interactive = true,
      onClick,
      ...props
    },
    ref
  ) => {
    // Create animation variants based on props
    const animationVariants = variants || fadeIn(delay, duration);

    return (
      <motion.div
        ref={ref}
        // Initial state - element starts invisible
        initial="hidden"
        // Animate to visible state when component mounts
        animate="visible"
        // Use custom variants or default fade in
        variants={animationVariants}
        // Hover effects - only if interactive
        whileHover={interactive ? hoverAnimation() : undefined}
        // Tap effects - only if interactive and clickable
        whileTap={interactive && onClick ? tapAnimation() : undefined}
        // Click handler
        onClick={onClick}
        // Cursor pointer if clickable
        style={{ cursor: onClick ? "pointer" : "default" }}
        // Combine default card styles with custom className
        className={cn(
          // Base card styles
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          // Interactive styles
          interactive && "transition-colors hover:bg-accent/50",
          // Custom styles
          className
        )}
        // Pass through additional props (excluding conflicting ones)
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

// Set display name for better debugging
AnimatedCard.displayName = "AnimatedCard";

/**
 * AnimatedCardHeader Component
 *
 * Animated header section for the card.
 * Has a subtle slide-in animation from the top.
 */
interface AnimatedCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCardHeader = React.forwardRef<
  HTMLDivElement,
  AnimatedCardHeaderProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      // Slide in from top with slight delay
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
});

AnimatedCardHeader.displayName = "AnimatedCardHeader";

/**
 * AnimatedCardTitle Component
 *
 * Animated title for the card.
 * Fades in with a slight delay after the header.
 */
interface AnimatedCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  AnimatedCardTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.h3
      ref={ref}
      // Fade in with delay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.h3>
  );
});

AnimatedCardTitle.displayName = "AnimatedCardTitle";

/**
 * AnimatedCardDescription Component
 *
 * Animated description text for the card.
 * Fades in last to create a cascading effect.
 */
interface AnimatedCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  AnimatedCardDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.p
      ref={ref}
      // Fade in last
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className={cn("text-sm text-muted-foreground", className)}
      {...(props as any)}
    >
      {children}
    </motion.p>
  );
});

AnimatedCardDescription.displayName = "AnimatedCardDescription";

/**
 * AnimatedCardContent Component
 *
 * Animated content area for the card.
 * Slides in from the bottom with a delay.
 */
interface AnimatedCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCardContent = React.forwardRef<
  HTMLDivElement,
  AnimatedCardContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      // Slide in from bottom
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className={cn("p-6 pt-0", className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
});

AnimatedCardContent.displayName = "AnimatedCardContent";

/**
 * AnimatedCardFooter Component
 *
 * Animated footer section for the card.
 * Fades in last to complete the cascading animation.
 */
interface AnimatedCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCardFooter = React.forwardRef<
  HTMLDivElement,
  AnimatedCardFooterProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      // Fade in last
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className={cn("flex items-center p-6 pt-0", className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
});

AnimatedCardFooter.displayName = "AnimatedCardFooter";
