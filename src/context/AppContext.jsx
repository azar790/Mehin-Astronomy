import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const CITIES_LIST = [
  { name: 'Baku', name_az: 'Bakı', country: 'Azerbaijan', lat: 40.4093, lng: 49.8671 },
  { name: 'Seattle', name_az: 'Seattle (ABŞ)', country: 'United States', lat: 47.6062, lng: -122.3321 },
  { name: 'New York', name_az: 'Nyu-York', country: 'United States', lat: 40.7128, lng: -74.0060 },
  { name: 'Paris', name_az: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'London', name_az: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
];

export const AVATARS = [
  { id: 'astronaut', emoji: '🧑‍🚀', label_en: 'Space Cadet', label_az: 'Kosmonavt' },
  { id: 'starlight', emoji: '⭐', label_en: 'Star Princess', label_az: 'Ulduz Pərisi' },
  { id: 'unicorn', emoji: '🦄', label_en: 'Cosmic Unicorn', label_az: 'Kosmik Təkbuynuz' },
  { id: 'rocket', emoji: '🚀', label_en: 'Comet Rider', label_az: 'Raket Pilotu' },
  { id: 'alien', emoji: '👽', label_en: 'Friendly Alien', label_az: 'Yadplanetli' },
  { id: 'cat_explorer', emoji: '🐱‍🚀', label_en: 'Astro Kitty', label_az: 'Kosmik Pişik' },
  { id: 'dragon', emoji: '🐲', label_en: 'Galaxy Dragon', label_az: 'Qalaktika Əjdahası' },
  { id: 'superhero', emoji: '🦸‍♀️', label_en: 'Star Hero', label_az: 'Ulduz Qəhrəmanı' },
];

export const THEMES = [
  {
    id: 'cosmic',
    name_en: 'Cosmic Night 🌌',
    name_az: 'Kosmik Gecə 🌌',
    bgGradient: 'from-slate-950 via-[#0c0828] to-[#060416]',
    cardBg: 'bg-slate-900/75 border-purple-500/35 shadow-purple-950/40',
    colorHex: '#9333ea',
  },
  {
    id: 'sunset',
    name_en: 'Sunset Glow 🌇',
    name_az: 'Qızılı Qürub 🌇',
    bgGradient: 'from-[#240e32] via-[#2f1025] to-[#150922]',
    cardBg: 'bg-[#250d27]/75 border-amber-500/40 shadow-amber-950/40',
    colorHex: '#f59e0b',
  },
  {
    id: 'aurora',
    name_en: 'Emerald Aurora 💚',
    name_az: 'Zümrüd Parıltısı 💚',
    bgGradient: 'from-[#04201c] via-[#062c25] to-[#021612]',
    cardBg: 'bg-[#052820]/75 border-emerald-500/40 shadow-emerald-950/40',
    colorHex: '#10b981',
  },
  {
    id: 'candy',
    name_en: 'Star Candy 🦄',
    name_az: 'Ulduz Nağılı 🦄',
    bgGradient: 'from-[#260d2d] via-[#330f3b] to-[#16061a]',
    cardBg: 'bg-[#280c2f]/75 border-pink-500/40 shadow-pink-950/40',
    colorHex: '#ec4899',
  },
  {
    id: 'daylight',
    name_en: 'Sunny Sky ☀️',
    name_az: 'Açıq Səma ☀️',
    bgGradient: 'from-[#0a284e] via-[#12467d] to-[#061c36]',
    cardBg: 'bg-[#0d3159]/75 border-sky-400/40 shadow-sky-950/40',
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
  // Explorer Name (Default: Mehin)
  const [explorerName, setExplorerNameState] = useState(() => {
    let saved = safeGet('cosmic_explorer_name', 'Mehin');
    if (!saved || saved === 'Lilia') {
      saved = 'Mehin';
      safeSet('cosmic_explorer_name', 'Mehin');
    }
    return saved;
  });


  const setExplorerName = (newName) => {
    const trimmed = (newName || '').trim();
    if (trimmed) {
      setExplorerNameState(trimmed);
      safeSet('cosmic_explorer_name', trimmed);
    }
  };

  // Avatar (supports built-in IDs and 'custom_photo')
  const [avatar, setAvatarState] = useState(() => {
    return safeGet('cosmic_avatar', 'astronaut');
  });
  const [customPhoto, setCustomPhotoState] = useState(() => {
    return safeGet('cosmic_custom_photo', null);
  });

  const setAvatar = (newAvatar) => {
    setAvatarState(newAvatar);
    safeSet('cosmic_avatar', newAvatar);
  };

  const setCustomPhoto = (photoBase64) => {
    setCustomPhotoState(photoBase64);
    if (photoBase64) {
      safeSet('cosmic_custom_photo', photoBase64);
      setAvatar('custom_photo');
    } else {
      try { localStorage.removeItem('cosmic_custom_photo'); } catch (e) {}
    }
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
    return safeGet('cosmic_language', 'az');
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
    return CITIES_LIST[0];
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

  const activeAvatarObj = avatar === 'custom_photo' && customPhoto
    ? { id: 'custom_photo', emoji: '📸', isCustom: true, photoUrl: customPhoto, label_en: 'My Photo', label_az: 'Mənim Şəklim' }
    : (AVATARS.find(a => a.id === avatar) || AVATARS[0]);

  const activeThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <AppContext.Provider
      value={{
        explorerName,
        setExplorerName,
        avatar,
        setAvatar,
        customPhoto,
        setCustomPhoto,
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
