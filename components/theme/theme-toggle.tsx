"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
/**
 * ThemeToggle Component
 *
 * This component provides a dropdown menu to switch between different theme modes:
 * - Light mode: Bright theme with light backgrounds
 * - Dark mode: Dark theme with dark backgrounds
 * - System mode: Automatically follows user's OS preference
 *
 * Features:
 * - Smooth icon transitions using Framer Motion
 * - Keyboard navigation support
 * - Accessible labels for screen readers
 * - Visual feedback on hover and focus
 */
export function ThemeToggle() {
  // Get theme functions from our theme provider
  const { setTheme, theme } = useTheme();

  // State to control dropdown open/close
  const [open, setOpen] = React.useState(false);

  // Handle theme change and close dropdown
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* 
        Dropdown trigger button - shows current theme icon
        The button changes its icon based on the current theme
      */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          // Accessibility: Screen readers will announce this as "Toggle theme"
          aria-label="Toggle theme"
          // Add hover and focus effects
          className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-primary"
        >
          {/* 
            Conditional rendering of icons based on current theme
            - Sun icon for light mode
            - Moon icon for dark mode  
            - Monitor icon for system mode
          */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {/* 
            System icon - only visible when theme is 'system'
            We use absolute positioning to overlay the sun/moon icons
          */}
          {theme === "system" && (
            <Monitor className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          {/* 
            Screen reader only text - provides context for screen readers
            This text is visually hidden but accessible to assistive technology
          */}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* 
        Dropdown menu content - appears when button is clicked
        Contains three theme options with icons and labels
      */}
      <DropdownMenuContent align="end">
        {/* Light theme option */}
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          // Add visual feedback when this option is selected
          className={theme === "light" ? "bg-accent" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>

        {/* Dark theme option */}
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={theme === "dark" ? "bg-accent" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>

        {/* System theme option - follows OS preference */}
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className={theme === "system" ? "bg-accent" : ""}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
