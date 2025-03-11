import React, { createContext, useState, useEffect, useContext } from 'react';

// Theme options
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
};

// Create context
export const ThemeContext = createContext();

// Storage key for theme preference
const THEME_STORAGE_KEY = 'a1detailing_theme_preference';

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to system preference
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme || THEMES.DARK; // Default to dark theme for this app
  });
  
  // Track the actual theme applied (accounting for system preference)
  const [appliedTheme, setAppliedTheme] = useState(theme === THEMES.SYSTEM ? 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT) : 
    theme
  );
  
  // Update theme in localStorage when it changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Apply theme to document
    if (theme === THEMES.DARK || (theme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setAppliedTheme(THEMES.DARK);
    } else {
      document.documentElement.classList.remove('dark');
      setAppliedTheme(THEMES.LIGHT);
    }
  }, [theme]);
  
  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === THEMES.SYSTEM) {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
          setAppliedTheme(THEMES.DARK);
        } else {
          document.documentElement.classList.remove('dark');
          setAppliedTheme(THEMES.LIGHT);
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Check if the current theme is dark (either explicitly or via system preference)
  const isDarkMode = appliedTheme === THEMES.DARK;
  
  // Function to update theme
  const changeTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, appliedTheme, isDarkMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;