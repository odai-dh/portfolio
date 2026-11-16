'use client';

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const THEME_EVENT = 'themechange';

// The class on <html> is the single source of truth; React only reads it. A small inline script
// in layout.tsx sets it before the first paint, from the visitor's saved choice.
function readTheme(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The server always renders dark; the client swaps to the real value right after hydration.
  // The tree keeps the same shape either way: an earlier version returned a different wrapper
  // before and after mount, which made React discard and rebuild the whole page on every load.
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark' as Theme);

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // storage blocked: the choice just won't survive a reload
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
