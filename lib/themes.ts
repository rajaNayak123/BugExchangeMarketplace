/**
 * Custom Theme System
 *
 * This file defines multiple color schemes for our application.
 * Each theme has its own color palette that works well together.
 *
 * Why we use this approach:
 * - Provides users with multiple visual options
 * - Maintains consistent color relationships
 * - Easy to add new themes
 * - Type-safe theme definitions
 */

// Define the structure of a theme
export interface Theme {
  name: string; // Human-readable theme name
  value: string; // CSS class name for the theme
  description: string; // Description for accessibility
  colors: {
    primary: string; // Main brand color
    secondary: string; // Secondary accent color
    accent: string; // Highlight color
    background: string; // Main background
    foreground: string; // Main text color
  };
}

/**
 * Available Themes
 *
 * Each theme is designed with accessibility in mind:
 * - High contrast ratios for text readability
 * - Color combinations that work for colorblind users
 * - Consistent visual hierarchy
 */
export const themes: Theme[] = [
  {
    name: "Default",
    value: "default",
    description: "Clean and professional theme with neutral colors",
    colors: {
      primary: "oklch(0.205 0 0)", // Dark gray
      secondary: "oklch(0.97 0 0)", // Light gray
      accent: "oklch(0.708 0 0)", // Medium gray
      background: "oklch(1 0 0)", // White
      foreground: "oklch(0.145 0 0)", // Dark text
    },
  },
  {
    name: "Ocean",
    value: "ocean",
    description: "Calming blue theme inspired by the ocean",
    colors: {
      primary: "oklch(0.4 0.15 240)", // Deep blue
      secondary: "oklch(0.9 0.05 240)", // Light blue
      accent: "oklch(0.6 0.2 200)", // Bright blue
      background: "oklch(0.98 0.02 240)", // Very light blue
      foreground: "oklch(0.2 0.1 240)", // Dark blue text
    },
  },
  {
    name: "Forest",
    value: "forest",
    description: "Natural green theme inspired by forests",
    colors: {
      primary: "oklch(0.3 0.15 140)", // Deep green
      secondary: "oklch(0.9 0.05 140)", // Light green
      accent: "oklch(0.5 0.2 120)", // Bright green
      background: "oklch(0.98 0.02 140)", // Very light green
      foreground: "oklch(0.2 0.1 140)", // Dark green text
    },
  },
  {
    name: "Sunset",
    value: "sunset",
    description: "Warm orange and purple theme inspired by sunsets",
    colors: {
      primary: "oklch(0.4 0.2 20)", // Deep orange
      secondary: "oklch(0.9 0.05 20)", // Light orange
      accent: "oklch(0.6 0.25 300)", // Purple accent
      background: "oklch(0.98 0.02 20)", // Very light orange
      foreground: "oklch(0.2 0.1 20)", // Dark orange text
    },
  },
  {
    name: "Midnight",
    value: "midnight",
    description: "Dark theme with purple accents for night time use",
    colors: {
      primary: "oklch(0.7 0.2 280)", // Bright purple
      secondary: "oklch(0.2 0.05 280)", // Dark purple
      accent: "oklch(0.5 0.3 260)", // Medium purple
      background: "oklch(0.1 0.02 280)", // Very dark background
      foreground: "oklch(0.9 0.05 280)", // Light text
    },
  },
];

/**
 * Get theme by value
 *
 * Helper function to find a theme by its CSS class value
 * Used when applying themes to the document
 *
 * @param value - The theme value to search for
 * @returns The theme object or undefined if not found
 */
export function getThemeByValue(value: string): Theme | undefined {
  return themes.find((theme) => theme.value === value);
}

/**
 * Get default theme
 *
 * Returns the first theme in the array as the default
 * This is used when no theme preference is stored
 */
export function getDefaultTheme(): Theme {
  return themes[0];
}

/**
 * Theme validation
 *
 * Checks if a theme value is valid
 * Used to prevent invalid themes from being applied
 *
 * @param value - The theme value to validate
 * @returns True if the theme exists, false otherwise
 */
export function isValidTheme(value: string): boolean {
  return themes.some((theme) => theme.value === value);
}
