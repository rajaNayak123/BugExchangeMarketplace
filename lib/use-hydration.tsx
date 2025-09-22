/**
 * Hydration Hook
 *
 * This hook helps prevent hydration mismatches by ensuring components
 * only render client-side specific content after hydration is complete.
 *
 * Why we need this:
 * - Server-side rendering doesn't have access to browser APIs
 * - Theme preferences, localStorage, etc. are only available on the client
 * - This causes mismatches between server and client HTML
 * - React throws hydration errors when HTML doesn't match
 *
 * Usage:
 * const mounted = useHydration();
 * if (!mounted) return <SSRFallback />;
 * return <ClientOnlyContent />;
 */

import { useState, useEffect } from "react";
import * as React from "react";

/**
 * Custom hook to detect when component has hydrated
 *
 * Returns false during SSR and initial render, true after hydration
 *
 * @returns boolean indicating if component is mounted on client
 */
export function useHydration(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after component mounts on client
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Higher-order component for hydration-safe rendering
 *
 * Wraps a component to prevent hydration mismatches by only
 * rendering the component after hydration is complete.
 *
 * @param Component - Component to render after hydration
 * @param Fallback - Component to render during SSR/initial render
 * @returns Wrapped component that handles hydration safely
 */
export function withHydration<T extends object>(
  Component: React.ComponentType<T>,
  Fallback?: React.ComponentType<T>
) {
  return function HydrationWrapper(props: T) {
    const mounted = useHydration();

    if (!mounted) {
      return Fallback ? React.createElement(Fallback, props) : null;
    }

    return React.createElement(Component, props);
  };
}

/**
 * Hook for safe access to browser APIs
 *
 * Returns null during SSR, actual value after hydration
 *
 * @param getValue - Function that returns the browser API value
 * @returns The value or null if not hydrated
 */
export function useBrowserValue<T>(getValue: () => T): T | null {
  const mounted = useHydration();

  if (!mounted) {
    return null;
  }

  return getValue();
}

/**
 * Hook for safe localStorage access
 *
 * Returns null during SSR, actual value after hydration
 *
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The stored value or default value
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const mounted = useHydration();

  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (!mounted) return;

    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, mounted]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);

    if (!mounted) return;

    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}

/**
 * Hook for safe sessionStorage access
 *
 * Returns null during SSR, actual value after hydration
 *
 * @param key - sessionStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The stored value or default value
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const mounted = useHydration();

  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (!mounted) return;

    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
    }
  }, [key, mounted]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);

    if (!mounted) return;

    try {
      sessionStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`Error writing to sessionStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}
