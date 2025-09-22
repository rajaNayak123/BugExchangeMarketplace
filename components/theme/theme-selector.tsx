"use client";

import * as React from "react";
import { Check, Palette } from "lucide-react";
import { themes, type Theme } from "@/lib/themes";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
/**
 * ThemeSelector Component
 *
 * This component provides a visual way to select custom color themes.
 * It shows preview cards for each theme with their colors and names.
 *
 * Features:
 * - Visual theme previews with color swatches
 * - Theme descriptions for accessibility
 * - Smooth transitions between themes
 * - Keyboard navigation support
 * - Current theme indication
 */
export function ThemeSelector() {
  // Get current theme and setter function from theme provider
  const { theme, setTheme } = useTheme();

  // State to control dropdown open/close
  const [open, setOpen] = React.useState(false);

  // State to track the selected custom theme
  const [selectedCustomTheme, setSelectedCustomTheme] =
    React.useState<string>("default");

  // Initialize selected theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("bug-exchange-theme");
    if (savedTheme) {
      setSelectedCustomTheme(savedTheme);
    }
  }, []);

  /**
   * Handle theme selection
   *
   * This function is called when a user clicks on a theme option.
   * It applies the selected theme, stores the preference, and closes the dropdown.
   *
   * @param selectedTheme - The theme object that was selected
   */
  const handleThemeSelect = (selectedTheme: Theme) => {
    // Update local state
    setSelectedCustomTheme(selectedTheme.value);
    // Apply the theme by setting the data-theme attribute on the document
    document.documentElement.setAttribute("data-theme", selectedTheme.value);
    // Store the theme preference in localStorage
    localStorage.setItem("bug-exchange-theme", selectedTheme.value);
    // Close the dropdown after selection
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* 
        Dropdown trigger button
        Shows a palette icon to indicate theme selection
      */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Select color theme"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* 
        Dropdown menu content
        Contains all available theme options with previews
      */}
      <DropdownMenuContent align="end" className="w-64">
        {/* Menu header */}
        <DropdownMenuLabel className="text-center">
          Choose a Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* 
          Theme options list
          Each theme is displayed as a preview card
        */}
        {themes.map((themeOption) => (
          <div key={themeOption.value} className="p-2">
            <button
              onClick={() => handleThemeSelect(themeOption)}
              className={cn(
                // Base button styles
                "w-full text-left p-3 rounded-lg border-2 transition-all duration-200",
                "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary",
                // Selected theme styling
                selectedCustomTheme === themeOption.value
                  ? "border-primary bg-accent shadow-md"
                  : "border-border hover:border-primary/50"
              )}
              // Accessibility attributes
              aria-label={`Select ${themeOption.name} theme: ${themeOption.description}`}
              aria-pressed={selectedCustomTheme === themeOption.value}
            >
              {/* Theme name and checkmark */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{themeOption.name}</span>
                {/* 
                  Checkmark icon - only visible for selected theme
                  Provides visual feedback for current selection
                */}
                {selectedCustomTheme === themeOption.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>

              {/* 
                Color preview swatches
                Shows the main colors of each theme
                Helps users understand what the theme looks like
              */}
              <div className="flex gap-1 mb-2">
                {/* Primary color swatch */}
                <div
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: themeOption.colors.primary }}
                  aria-label="Primary color"
                />
                {/* Secondary color swatch */}
                <div
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: themeOption.colors.secondary }}
                  aria-label="Secondary color"
                />
                {/* Accent color swatch */}
                <div
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: themeOption.colors.accent }}
                  aria-label="Accent color"
                />
                {/* Background color swatch */}
                <div
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: themeOption.colors.background }}
                  aria-label="Background color"
                />
              </div>

              {/* 
                Theme description
                Provides context about the theme for screen readers
                and users who want to understand the theme better
              */}
              <p className="text-xs text-muted-foreground">
                {themeOption.description}
              </p>
            </button>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
