import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Globe, Sparkles, Navigation, Palette } from 'lucide-react';
import { useApp, AVATARS, CITIES_LIST, THEMES } from '../context/AppContext';

export default function SettingsModal() {
  const {
    explorerName,
    setExplorerName,
    avatar,
    setAvatar,
    theme,
    setTheme,
    language,
    setLanguage,
    city,
    setCity,
    detectLocation,
    geoStatus,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useApp();

  const isEn = language === 'en';
  const [tempName, setTempName] = useState(explorerName);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    if (tempName.trim()) {
      setExplorerName(tempName.trim());
    }
    setIsSettingsOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSettingsOpen(false)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window - Compact single-screen layout */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          className="relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl p-4 sm:p-5 bg-slate-900/95 border border-purple-500/35 shadow-2xl text-white flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/20 mb-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                {isEn ? 'Explorer Settings' : 'Kəşfiyyatçı Ayarları'}
              </h2>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Compact Body without scroll */}
          <div className="space-y-2.5">
            
            {/* 1. Explorer Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                  <User className="w-3 h-3 text-pink-400" />
                  <span>{isEn ? "Explorer Name" : 'Kəşfiyyatçının Adı'}</span>
                </label>
              </div>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Mehin"
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800/90 border border-purple-500/30 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-pink-500 text-xs transition"
              />
            </div>

            {/* 2. Choose Avatar - 4x2 grid with padding to prevent any clipping */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isEn ? 'Choose Avatar' : 'Avatar Seç'}</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 px-0.5">
                {AVATARS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar(item.id)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                      avatar === item.id
                        ? 'bg-purple-600/50 border-pink-400 shadow-md ring-1 ring-pink-400/50'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl leading-none mb-0.5">{item.emoji}</span>
                    <span className="text-[8.5px] font-bold text-slate-300 truncate w-full text-center">
                      {isEn ? item.label_en : item.label_az}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Themes Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-400" />
                <span>{isEn ? 'Color Theme' : 'Rəng Teması'}</span>
              </label>
              <div className="grid grid-cols-5 gap-1">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    title={isEn ? t.name_en : t.name_az}
                    className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition cursor-pointer text-center ${
                      theme === t.id
                        ? 'bg-purple-600/40 border-pink-400 shadow-sm ring-1 ring-pink-400/50'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/50 mb-0.5"
                      style={{ backgroundColor: t.colorHex }}
                    />
                    <span className="text-[8px] font-bold truncate w-full">
                      {t.id === 'cosmic' ? 'Cosmic' : t.id === 'sunset' ? 'Sunset' : t.id === 'aurora' ? 'Aurora' : t.id === 'candy' ? 'Candy' : 'Sunny'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Language Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>{isEn ? 'Language' : 'Dil'}</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-1.5 px-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    language === 'en'
                      ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span className="text-[11px]">English</span>
                </button>
                <button
                  onClick={() => setLanguage('az')}
                  className={`py-1.5 px-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    language === 'az'
                      ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇦🇿</span>
                  <span className="text-[11px]">Azərbaycan</span>
                </button>
              </div>
            </div>

            {/* 5. Location Selector: GPS + 5 Quick Cities (Baku, Seattle, New York, Paris, London) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{isEn ? 'Location (Sun, Moon & Weather)' : 'Məkan (Günəş, Ay və Hava)'}</span>
              </label>

              {/* GPS Button */}
              <button
                onClick={detectLocation}
                className="w-full mb-1.5 py-1 px-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-indigo-900/80 transition"
              >
                <Navigation className={`w-3 h-3 text-cyan-400 ${geoStatus === 'locating' ? 'animate-spin' : ''}`} />
                <span>
                  {geoStatus === 'locating'
                    ? (isEn ? 'Detecting GPS...' : 'GPS axtarılır...')
                    : (isEn ? '📍 Detect My Location (GPS)' : '📍 Dəqiq Məkanımı Tap (GPS)')}
                </span>
              </button>

              {/* Quick Cities Grid (Baku, Seattle, New York, Paris, London) */}
              <div className="grid grid-cols-5 gap-1">
                {CITIES_LIST.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCity(c)}
                    title={c.country}
                    className={`py-1 px-1 rounded-xl border text-[10px] font-bold transition cursor-pointer truncate text-center ${
                      city.name === c.name
                        ? 'bg-pink-600/50 border-pink-400 text-white ring-1 ring-pink-400/50'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {c.name === 'Seattle' ? 'Seattle' : c.name === 'New York' ? 'N.York' : isEn ? c.name : (c.name_az || c.name)}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Save Button */}
          <div className="pt-2 border-t border-purple-500/20 shrink-0 mt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              {isEn ? 'Save & Explore! 🚀' : 'Yadda Saxla və Kəşf Et! 🚀'}
            </motion.button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
