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
    cardBg: 'bg-slate-900/80 border-purple-500/30',
    primary: 'purple',
    accent: 'from-purple-600 to-pink-500',
    colorHex: '#9333ea',
  },
  {
    id: 'sunset',
    name_en: 'Sunset Glow 🌇',
    name_az: 'Qızılı Qürub 🌇',
    bgGradient: 'from-[#1e0d2d] via-[#2d1124] to-[#12081f]',
    cardBg: 'bg-amber-950/40 border-amber-500/30',
    primary: 'amber',
    accent: 'from-amber-500 via-rose-500 to-purple-600',
    colorHex: '#f59e0b',
  },
  {
    id: 'aurora',
    name_en: 'Emerald Aurora 💚',
    name_az: 'Zümrüd Parıltısı 💚',
    bgGradient: 'from-[#031c18] via-[#052620] to-[#021310]',
    cardBg: 'bg-emerald-950/40 border-emerald-500/30',
    primary: 'emerald',
    accent: 'from-emerald-500 to-teal-400',
    colorHex: '#10b981',
  },
  {
    id: 'candy',
    name_en: 'Star Candy 🦄',
    name_az: 'Ulduz Nağılı 🦄',
    bgGradient: 'from-[#1f0b24] via-[#280d2e] to-[#120616]',
    cardBg: 'bg-pink-950/40 border-pink-500/30',
    primary: 'pink',
    accent: 'from-pink-500 via-fuchsia-500 to-indigo-500',
    colorHex: '#ec4899',
  },
  {
    id: 'daylight',
    name_en: 'Sunny Sky ☀️',
    name_az: 'Açıq Səma ☀️',
    bgGradient: 'from-[#0b2545] via-[#134074] to-[#081c36]',
    cardBg: 'bg-sky-950/50 border-sky-400/30',
    primary: 'sky',
    accent: 'from-sky-400 via-cyan-400 to-amber-300',
    colorHex: '#38bdf8',
  },
];

export function AppProvider({ children }) {
  // Explorer Name (Default Lilia or Mehin)
  const [explorerName, setExplorerName] = useState(() => {
    return localStorage.getItem('cosmic_explorer_name') || 'Lilia';
  });

  // Avatar
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('cosmic_avatar') || 'astronaut';
  });

  // Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cosmic_theme') || 'cosmic';
  });

  // Language: 'en' | 'az'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('cosmic_language') || 'en';
  });

  // Selected City / Coordinates
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem('cosmic_city');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return CITIES_LIST[0]; // Baku default
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [geoStatus, setGeoStatus] = useState('idle');

  // Persist settings
  useEffect(() => {
    localStorage.setItem('cosmic_explorer_name', explorerName);
  }, [explorerName]);

  useEffect(() => {
    localStorage.setItem('cosmic_avatar', avatar);
  }, [avatar]);

  useEffect(() => {
    localStorage.setItem('cosmic_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cosmic_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cosmic_city', JSON.stringify(city));
  }, [city]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'az' : 'en'));
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
        console.warn('Geolocation denied or failed, using city fallback:', err.message);
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
