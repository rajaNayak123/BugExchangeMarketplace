"use client";

import * as React from "react";
import { useHydration } from "@/lib/use-hydration";

/**
 * ClientThemeWrapper Component
 *
 * This component ensures that theme-related components only render on the client-side
 * to prevent hydration mismatches. It provides a consistent fallback during SSR.
 *
 * Why we need this:
 * - Theme components access localStorage and browser APIs
 * - Server doesn't know the user's theme preference
 * - This causes hydration mismatches between server and client HTML
 * - This wrapper ensures consistent rendering during SSR
 */
interface ClientThemeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientThemeWrapper({
  children,
  fallback = (
    <div className="flex items-center space-x-1 border-l border-gray-200 pl-4">
      <div className="h-9 w-9 rounded-md border border-gray-200 bg-gray-100 animate-pulse" />
      <div className="h-9 w-9 rounded-md border border-gray-200 bg-gray-100 animate-pulse" />
    </div>
  ),
}: ClientThemeWrapperProps) {
  const mounted = useHydration();

  // Show fallback during SSR and initial render
  if (!mounted) {
    return <>{fallback}</>;
  }

  // Render actual theme components after hydration
  return <>{children}</>;
}
