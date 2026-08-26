/*
  context/ThemeContext.jsx — Global Dark Mode State

  CONCEPT — React Context:
  Context lets you share state (like the current theme) across the entire
  component tree WITHOUT passing props down manually at every level.

  Instead of: App → Navbar → Button (theme prop passed each time)
  With context: any component can call useTheme() and get the theme.

  CONCEPT — localStorage:
  localStorage is a browser API that saves small amounts of data on the
  user's computer. Unlike component state, it survives page reloads.
  We use it so the user's dark/light preference is remembered.
*/

import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context object — this is what components will subscribe to
const ThemeContext = createContext();

// 2. ThemeProvider wraps the app and provides the theme value to all children
export function ThemeProvider({ children }) {
  // Read saved preference from localStorage on first load.
  // If nothing is saved yet, default to 'light'.
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('blog-cms-theme') || 'light';
  });

  // Whenever theme changes:
  // - Apply the data-theme attribute to <html> so CSS variables switch
  // - Save the new preference to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('blog-cms-theme', theme);
  }, [theme]);

  // Toggle between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook — a clean way for any component to access the theme
//    Usage: const { theme, toggleTheme } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}
