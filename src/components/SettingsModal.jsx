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

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-md rounded-3xl p-5 sm:p-6 bg-slate-900 border border-purple-500/30 shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {isEn ? 'Explorer Settings' : 'Kəşfiyyatçı Ayarları'}
              </h2>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto space-y-4 pr-1 flex-1">
            
            {/* Explorer Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>{isEn ? "Explorer Name" : 'Kəşfiyyatçının Adı'}</span>
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Mehin"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-purple-500/30 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm transition"
              />
              <p className="text-[10px] text-slate-400 mt-1.5">
                {isEn ? 'All cosmic wonders and sky tips will address you by this name!' : 'Bütün kosmik xəbərlər və səma tövsiyələri sənə bu adla müraciət edəcək!'}
              </p>

            </div>

            {/* Themes Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Color Theme' : 'Rəng Teması'}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                      theme === t.id
                        ? 'bg-purple-600/50 border-pink-400 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/40"
                      style={{ backgroundColor: t.colorHex }}
                    />
                    <span className="truncate text-[11px]">
                      {isEn ? t.name_en : t.name_az}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isEn ? 'Choose Avatar' : 'Avatar Seç'}</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {AVATARS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar(item.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer ${
                      avatar === item.id
                        ? 'bg-purple-600/40 border-pink-500 shadow-md scale-105'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl mb-0.5">{item.emoji}</span>
                    <span className="text-[9px] font-bold text-slate-300 truncate w-full text-center">
                      {isEn ? item.label_en : item.label_az}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isEn ? 'Language' : 'Dil'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    language === 'en'
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
                <button
                  onClick={() => setLanguage('az')}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    language === 'az'
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇦🇿</span>
                  <span>Azərbaycan</span>
                </button>
              </div>
            </div>

            {/* Location Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{isEn ? 'Sky Location (Sun & Moon Times)' : 'Məkan (Günəş və Ay vaxtı)'}</span>
              </label>

              {/* GPS Button */}
              <button
                onClick={detectLocation}
                className="w-full mb-2 py-1.5 px-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-indigo-900/80"
              >
                <Navigation className={`w-3.5 h-3.5 text-cyan-400 ${geoStatus === 'locating' ? 'animate-spin' : ''}`} />
                <span>
                  {geoStatus === 'locating'
                    ? (isEn ? 'Detecting GPS...' : 'GPS axtarılır...')
                    : (isEn ? '📍 Detect My Location (GPS)' : '📍 Dəqiq Məkanımı Tap (GPS)')}
                </span>
              </button>

              {/* Quick Cities */}
              <div className="grid grid-cols-3 gap-1.5">
                {CITIES_LIST.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCity(c)}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition cursor-pointer truncate ${
                      city.name === c.name
                        ? 'bg-pink-600/40 border-pink-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {isEn ? c.name : (c.name_az || c.name)}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Save Button */}
          <div className="pt-3 border-t border-purple-500/20 shrink-0 mt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-purple-600/40 cursor-pointer"
            >
              {isEn ? 'Save & Explore! 🚀' : 'Yadda Saxla və Kəşf Et! 🚀'}
            </motion.button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
