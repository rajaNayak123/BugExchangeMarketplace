"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeIn, staggerContainer, staggerChild } from "@/lib/animations";

/**
 * Empty States Illustrations
 *
 * This file contains illustrations for empty states throughout the app.
 * Empty states are shown when there's no content to display.
 *
 * Why we use illustrations:
 * - Better user experience than plain text
 * - Helps users understand what's missing
 * - Makes the app feel more polished
 * - Provides visual feedback
 */

/**
 * EmptyBugsList Component
 *
 * Shown when there are no bugs to display.
 * Encourages users to create their first bug report.
 */
interface EmptyBugsListProps {
  className?: string;
  onCreateBug?: () => void;
}

export function EmptyBugsList({ className, onCreateBug }: EmptyBugsListProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      animate="visible"
    >
      {/* 
        Bug illustration - simple SVG drawing
        Uses motion.path for smooth drawing animation
      */}
      <motion.div className="mb-6" variants={staggerChild}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground"
        >
          {/* Bug body */}
          <motion.path
            d="M60 20C45 20 30 30 30 50C30 70 45 80 60 80C75 80 90 70 90 50C90 30 75 20 60 20Z"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Bug head */}
          <motion.circle
            cx="60"
            cy="45"
            r="8"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          {/* Bug antennae */}
          <motion.path
            d="M52 40L48 35M68 40L72 35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />

          {/* Bug legs */}
          <motion.path
            d="M45 60L40 65M50 65L45 70M70 60L75 65M65 65L70 70"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-xl font-semibold text-foreground mb-2"
        variants={staggerChild}
      >
        No bugs found
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-muted-foreground text-center mb-6 max-w-md"
        variants={staggerChild}
      >
        Looks like there are no bugs to display right now. Create your first bug
        report to get started!
      </motion.p>

      {/* Action button */}
      {onCreateBug && (
        <motion.button
          onClick={onCreateBug}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          variants={staggerChild}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Bug Report
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * EmptySubmissionsList Component
 *
 * Shown when there are no submissions for a bug.
 * Encourages users to submit their solutions.
 */
interface EmptySubmissionsListProps {
  className?: string;
  onSubmitSolution?: () => void;
}

export function EmptySubmissionsList({
  className,
  onSubmitSolution,
}: EmptySubmissionsListProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      animate="visible"
    >
      {/* Code illustration */}
      <motion.div className="mb-6" variants={staggerChild}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground"
        >
          {/* Code block background */}
          <motion.rect
            x="20"
            y="30"
            width="80"
            height="60"
            rx="8"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          {/* Code lines */}
          <motion.path
            d="M30 50H70M30 60H50M30 70H60"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Cursor */}
          <motion.rect
            x="60"
            y="65"
            width="2"
            height="10"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 1 }}
          />
        </svg>
      </motion.div>

      <motion.h3
        className="text-xl font-semibold text-foreground mb-2"
        variants={staggerChild}
      >
        No solutions yet
      </motion.h3>

      <motion.p
        className="text-muted-foreground text-center mb-6 max-w-md"
        variants={staggerChild}
      >
        This bug doesn't have any solutions yet. Be the first to submit your
        solution and earn the bounty!
      </motion.p>

      {onSubmitSolution && (
        <motion.button
          onClick={onSubmitSolution}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          variants={staggerChild}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit Solution
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * EmptySearchResults Component
 *
 * Shown when search returns no results.
 * Suggests alternative search terms or actions.
 */
interface EmptySearchResultsProps {
  className?: string;
  searchTerm?: string;
  onClearSearch?: () => void;
}

export function EmptySearchResults({
  className,
  searchTerm,
  onClearSearch,
}: EmptySearchResultsProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      animate="visible"
    >
      {/* Search illustration */}
      <motion.div className="mb-6" variants={staggerChild}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground"
        >
          {/* Magnifying glass */}
          <motion.circle
            cx="45"
            cy="45"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          {/* Search handle */}
          <motion.path
            d="M65 65L85 85"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />

          {/* Question mark */}
          <motion.text
            x="60"
            y="60"
            textAnchor="middle"
            fontSize="24"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            ?
          </motion.text>
        </svg>
      </motion.div>

      <motion.h3
        className="text-xl font-semibold text-foreground mb-2"
        variants={staggerChild}
      >
        No results found
      </motion.h3>

      <motion.p
        className="text-muted-foreground text-center mb-6 max-w-md"
        variants={staggerChild}
      >
        {searchTerm ? (
          <>
            No bugs found for "<span className="font-medium">{searchTerm}</span>
            ". Try different keywords or check your spelling.
          </>
        ) : (
          "No bugs match your search criteria. Try adjusting your filters."
        )}
      </motion.p>

      {onClearSearch && (
        <motion.button
          onClick={onClearSearch}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          variants={staggerChild}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Search
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * EmptyNotificationsList Component
 *
 * Shown when there are no notifications.
 * Encourages users to stay engaged.
 */
interface EmptyNotificationsListProps {
  className?: string;
}

export function EmptyNotificationsList({
  className,
}: EmptyNotificationsListProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      animate="visible"
    >
      {/* Bell illustration */}
      <motion.div className="mb-6" variants={staggerChild}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground"
        >
          {/* Bell body */}
          <motion.path
            d="M60 20C45 20 35 30 35 45V55C35 65 40 75 60 75C80 75 85 65 85 55V45C85 30 75 20 60 20Z"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Bell clapper */}
          <motion.circle
            cx="60"
            cy="50"
            r="3"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />

          {/* Bell handle */}
          <motion.rect
            x="55"
            y="15"
            width="10"
            height="8"
            rx="2"
            fill="currentColor"
            fillOpacity="0.2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          />
        </svg>
      </motion.div>

      <motion.h3
        className="text-xl font-semibold text-foreground mb-2"
        variants={staggerChild}
      >
        All caught up!
      </motion.h3>

      <motion.p
        className="text-muted-foreground text-center mb-6 max-w-md"
        variants={staggerChild}
      >
        You don't have any notifications right now. New notifications will
        appear here when you receive them.
      </motion.p>
    </motion.div>
  );
}

/**
 * LoadingIllustration Component
 *
 * Shown during loading states.
 * Provides visual feedback that something is happening.
 */
interface LoadingIllustrationProps {
  className?: string;
  message?: string;
}

export function LoadingIllustration({
  className,
  message = "Loading...",
}: LoadingIllustrationProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.1, 0.2)}
    >
      {/* Animated loading spinner */}
      <motion.div className="mb-6" variants={staggerChild}>
        <motion.div
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.p
        className="text-muted-foreground text-center"
        variants={staggerChild}
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
