import { useState, useEffect, useCallback } from 'react';

// Default settings
const defaultSettings = {
  darkMode: true,
  notifications: {
    email: true,
    sms: true,
    push: true
  },
  language: 'ru',
  currency: 'KGS',
  showPricesWithTax: true
};

// Storage key
const SETTINGS_STORAGE_KEY = 'a1detailing_user_settings';

/**
 * Hook for managing user settings
 * Persists settings in localStorage
 */
export const useSettings = () => {
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Update specific setting
  const updateSetting = useCallback((key, value) => {
    setSettings(prevSettings => {
      // Handle nested settings
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return {
          ...prevSettings,
          [parent]: {
            ...prevSettings[parent],
            [child]: value
          }
        };
      }
      
      // Handle top-level settings
      return {
        ...prevSettings,
        [key]: value
      };
    });
  }, []);

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings
  };
};

export default useSettings;