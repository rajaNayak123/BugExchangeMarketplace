"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * ThemeProvider Component
 *
 * This component wraps our entire application to provide theme functionality.
 * It uses next-themes library to handle:
 * - Light/Dark mode switching
 * - System preference detection
 * - Theme persistence in localStorage
 * - SSR (Server-Side Rendering) compatibility
 *
 * @param children - All child components that need theme access
 * @param props - Additional props from next-themes
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      // Enable system theme detection - automatically detects user's OS preference
      enableSystem={true}
      // Default theme when no preference is set
      defaultTheme="system"
      // Disable transitions during theme change to prevent flash
      disableTransitionOnChange={false}
      // Store theme preference in localStorage
      storageKey="bug-exchange-theme"
      // Additional props passed from parent
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * Custom hook to use theme context
 * This hook provides easy access to theme functions throughout the app
 *
 * Usage:
 * const { theme, setTheme, resolvedTheme } = useTheme();
 */
export { useTheme } from "next-themes";
