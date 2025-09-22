"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Custom Icons Component
 *
 * This file contains custom SVG icons specific to our bug exchange marketplace.
 * These icons are designed to be consistent with our app's visual style.
 *
 * Why we create custom icons:
 * - Consistent visual style across the app
 * - Better performance than icon libraries
 * - Full control over design and animations
 * - Smaller bundle size
 * - Better accessibility support
 */

/**
 * Icon Props Interface
 *
 * Common props for all custom icons.
 * These props ensure consistency and accessibility.
 */
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string; // Icon size (width and height)
  className?: string; // Additional CSS classes
  "aria-label"?: string; // Accessibility label
  "aria-hidden"?: boolean; // Hide from screen readers
}

/**
 * Bug Icon
 *
 * Represents a bug report or issue.
 * Used in: Bug lists, bug creation, bug status indicators
 */
export function BugIcon({
  size = 24,
  className,
  "aria-label": ariaLabel = "Bug",
  "aria-hidden": ariaHidden = false,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    >
      {/* Bug body - main oval shape */}
      <ellipse
        cx="12"
        cy="14"
        rx="8"
        ry="6"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Bug head - smaller circle */}
      <circle
        cx="12"
        cy="10"
        r="3"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Bug antennae - two curved lines */}
      <path
        d="M9 8L7 6M15 8L17 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Bug legs - six lines extending from body */}
      <path
        d="M6 14L4 16M8 16L6 18M16 14L18 16M14 16L16 18M10 18L10 20M14 18L14 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Solution Icon
 *
 * Represents a solution or fix for a bug.
 * Used in: Solution submissions, solution status, fix indicators
 */
export function SolutionIcon({
  size = 24,
  className,
  "aria-label": ariaLabel = "Solution",
  "aria-hidden": ariaHidden = false,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    >
      {/* Code block background */}
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Code lines */}
      <path
        d="M7 8H17M7 12H13M7 16H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Checkmark overlay */}
      <path
        d="M16 8L18 10L20 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Bounty Icon
 *
 * Represents a monetary reward or bounty.
 * Used in: Bug bounties, payment indicators, reward displays
 */
export function BountyIcon({
  size = 24,
  className,
  "aria-label": ariaLabel = "Bounty",
  "aria-hidden": ariaHidden = false,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    >
      {/* Coin body */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Dollar sign */}
      <path
        d="M12 6V18M9 9H12M9 15H12M15 9H12M15 15H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Sparkle effects */}
      <path
        d="M6 6L7 7M17 6L18 7M6 17L7 18M17 17L18 18"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Status Icon
 *
 * Represents the status of a bug or solution.
 * Used in: Status indicators, progress tracking, state displays
 */
export function StatusIcon({
  size = 24,
  className,
  status = "pending",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = false,
  ...props
}: IconProps & {
  status?: "pending" | "in-progress" | "completed" | "rejected";
}) {
  // Get status-specific colors and labels
  const statusConfig = {
    pending: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-500",
      label: "Pending",
    },
    "in-progress": {
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      label: "In Progress",
    },
    completed: {
      color: "text-green-500",
      bgColor: "bg-green-500",
      label: "Completed",
    },
    rejected: {
      color: "text-red-500",
      bgColor: "bg-red-500",
      label: "Rejected",
    },
  };

  const config = statusConfig[status];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
      aria-label={ariaLabel || config.label}
      aria-hidden={ariaHidden}
      {...props}
    >
      {/* Status circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
        className={config.color}
      />

      {/* Status-specific icon */}
      {status === "pending" && (
        <path
          d="M12 8V12L15 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={config.color}
        />
      )}

      {status === "in-progress" && (
        <path
          d="M12 6L12 12L16 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={config.color}
        />
      )}

      {status === "completed" && (
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={config.color}
        />
      )}

      {status === "rejected" && (
        <path
          d="M15 9L9 15M9 9L15 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={config.color}
        />
      )}
    </svg>
  );
}

/**
 * Priority Icon
 *
 * Represents the priority level of a bug.
 * Used in: Priority indicators, bug filtering, urgency displays
 */
export function PriorityIcon({
  size = 24,
  className,
  priority = "medium",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = false,
  ...props
}: IconProps & { priority?: "low" | "medium" | "high" | "critical" }) {
  // Get priority-specific colors and labels
  const priorityConfig = {
    low: {
      color: "text-green-500",
      label: "Low Priority",
      height: 4,
    },
    medium: {
      color: "text-yellow-500",
      label: "Medium Priority",
      height: 8,
    },
    high: {
      color: "text-orange-500",
      label: "High Priority",
      height: 12,
    },
    critical: {
      color: "text-red-500",
      label: "Critical Priority",
      height: 16,
    },
  };

  const config = priorityConfig[priority];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
      aria-label={ariaLabel || config.label}
      aria-hidden={ariaHidden}
      {...props}
    >
      {/* Priority bar */}
      <rect
        x="6"
        y={12 - config.height / 2}
        width="12"
        height={config.height}
        rx="2"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        className={config.color}
      />

      {/* Base line */}
      <line
        x1="6"
        y1="12"
        x2="18"
        y2="12"
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground"
      />
    </svg>
  );
}

/**
 * Category Icon
 *
 * Represents different bug categories.
 * Used in: Category filters, bug classification, type indicators
 */
export function CategoryIcon({
  size = 24,
  className,
  category = "general",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = false,
  ...props
}: IconProps & {
  category?: "general" | "ui" | "performance" | "security" | "feature";
}) {
  // Get category-specific icons and labels
  const categoryConfig = {
    general: {
      label: "General",
      icon: (
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    ui: {
      label: "UI/UX",
      icon: (
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ),
    },
    performance: {
      label: "Performance",
      icon: (
        <path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    security: {
      label: "Security",
      icon: (
        <path
          d="M12 22S8 18 8 12V6L12 4L16 6V12C16 18 12 22 12 22Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    feature: {
      label: "Feature Request",
      icon: (
        <path
          d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
  };

  const config = categoryConfig[category];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
      aria-label={ariaLabel || config.label}
      aria-hidden={ariaHidden}
      {...props}
    >
      {/* Category-specific icon */}
      {config.icon}
    </svg>
  );
}

/**
 * Animated Icon Wrapper
 *
 * Wraps any icon with animation capabilities.
 * Provides consistent animation behavior across all icons.
 */
interface AnimatedIconProps extends IconProps {
  children: React.ReactNode;
  animation?: "bounce" | "pulse" | "spin" | "wiggle" | "none";
  duration?: number;
}

export function AnimatedIcon({
  children,
  animation = "none",
  duration = 0.5,
  ...props
}: AnimatedIconProps) {
  const animationVariants: Record<string, any> = {
    bounce: {
      animate: {
        y: [0, -4, 0],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    },
    pulse: {
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    },
    spin: {
      animate: {
        rotate: 360,
        transition: {
          duration,
          repeat: Infinity,
          ease: "linear",
        },
      },
    },
    wiggle: {
      animate: {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    },
    none: {},
  };

  if (animation === "none") {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        display: "inline-block",
        animation: animationVariants[animation].animate,
      }}
      {...(props as any)}
    >
      {children}
    </div>
  );
}
