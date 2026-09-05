import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const CITIES_LIST = [
  { name: 'Baku', name_az: 'Bakı', country: 'Azerbaijan', lat: 40.4093, lng: 49.8671 },
  { name: 'London', name_az: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', name_az: 'Nyu-York', country: 'United States', lat: 40.7128, lng: -74.0060 },
  { name: 'Tokyo', name_az: 'Tokio', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Istanbul', name_az: 'İstanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Paris', name_az: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
];

export const AVATARS = [
  { id: 'astronaut', emoji: '🧑‍🚀', label_en: 'Space Cadet', label_az: 'Kosmonavt' },
  { id: 'starlight', emoji: '⭐', label_en: 'Star Princess', label_az: 'Ulduz Pərisi' },
  { id: 'rocket', emoji: '🚀', label_en: 'Comet Rider', label_az: 'Raket Pilotu' },
  { id: 'alien', emoji: '👽', label_en: 'Friendly Alien', label_az: 'Sevimli Yadplanetli' },
  { id: 'cat_explorer', emoji: '🐱‍🚀', label_en: 'Astro Kitty', label_az: 'Kosmik Pişik' },
];

export const THEMES = [
  {
    id: 'cosmic',
    name_en: 'Cosmic Night 🌌',
    name_az: 'Kosmik Gecə 🌌',
    bgGradient: 'from-slate-950 via-[#0a0720] to-[#050414]',
    scrollAccent: 'from-purple-900/50 via-slate-900/80 to-slate-950',
    cardBg: 'bg-slate-900/85 border-purple-500/30',
    colorHex: '#9333ea',
  },
  {
    id: 'sunset',
    name_en: 'Sunset Glow 🌇',
    name_az: 'Qızılı Qürub 🌇',
    bgGradient: 'from-[#1e0d2d] via-[#2d1124] to-[#12081f]',
    scrollAccent: 'from-amber-900/50 via-rose-900/60 to-purple-950',
    cardBg: 'bg-[#230f24]/90 border-amber-500/40',
    colorHex: '#f59e0b',
  },
  {
    id: 'aurora',
    name_en: 'Emerald Aurora 💚',
    name_az: 'Zümrüd Parıltısı 💚',
    bgGradient: 'from-[#031c18] via-[#052620] to-[#021310]',
    scrollAccent: 'from-emerald-950/60 via-teal-950/70 to-slate-950',
    cardBg: 'bg-[#04241d]/90 border-emerald-500/40',
    colorHex: '#10b981',
  },
  {
    id: 'candy',
    name_en: 'Star Candy 🦄',
    name_az: 'Ulduz Nağılı 🦄',
    bgGradient: 'from-[#1f0b24] via-[#280d2e] to-[#120616]',
    scrollAccent: 'from-pink-950/60 via-fuchsia-950/70 to-[#120616]',
    cardBg: 'bg-[#260e2c]/90 border-pink-500/40',
    colorHex: '#ec4899',
  },
  {
    id: 'daylight',
    name_en: 'Sunny Sky ☀️',
    name_az: 'Açıq Səma ☀️',
    bgGradient: 'from-[#08203e] via-[#103b68] to-[#05162a]',
    scrollAccent: 'from-sky-950/60 via-blue-950/70 to-slate-950',
    cardBg: 'bg-[#0a2747]/90 border-sky-400/40',
    colorHex: '#38bdf8',
  },
];

function safeGet(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSet(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch (e) {
    console.warn('localStorage error:', e);
  }
}

export function AppProvider({ children }) {
  // Explorer Name
  const [explorerName, setExplorerNameState] = useState(() => {
    return safeGet('cosmic_explorer_name', 'Mehin');
  });

  const setExplorerName = (newName) => {
    const trimmed = (newName || '').trim();
    if (trimmed) {
      setExplorerNameState(trimmed);
      safeSet('cosmic_explorer_name', trimmed);
    }
  };

  // Avatar
  const [avatar, setAvatarState] = useState(() => {
    return safeGet('cosmic_avatar', 'astronaut');
  });
  const setAvatar = (newAvatar) => {
    setAvatarState(newAvatar);
    safeSet('cosmic_avatar', newAvatar);
  };

  // Theme
  const [theme, setThemeState] = useState(() => {
    return safeGet('cosmic_theme', 'cosmic');
  });
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    safeSet('cosmic_theme', newTheme);
  };

  // Language
  const [language, setLanguageState] = useState(() => {
    return safeGet('cosmic_language', 'az'); // Default to Azerbaijani or toggle
  });
  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    safeSet('cosmic_language', newLang);
  };

  // City
  const [city, setCityState] = useState(() => {
    const saved = safeGet('cosmic_city', null);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return CITIES_LIST[0]; // Baku default
  });
  const setCity = (newCity) => {
    setCityState(newCity);
    safeSet('cosmic_city', JSON.stringify(newCity));
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [geoStatus, setGeoStatus] = useState('idle');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'az' : 'en');
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCity = {
          name: 'My Location',
          name_az: 'Mənim Məkanım',
          country: 'GPS 📍',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isAuto: true,
        };
        setCity(newCity);
        setGeoStatus('success');
      },
      (err) => {
        setGeoStatus('denied');
      },
      { timeout: 10000 }
    );
  };

  const activeAvatarObj = AVATARS.find(a => a.id === avatar) || AVATARS[0];
  const activeThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <AppContext.Provider
      value={{
        explorerName,
        setExplorerName,
        avatar,
        setAvatar,
        activeAvatarObj,
        theme,
        setTheme,
        activeThemeObj,
        language,
        setLanguage,
        toggleLanguage,
        city,
        setCity,
        detectLocation,
        geoStatus,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
