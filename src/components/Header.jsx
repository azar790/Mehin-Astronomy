import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles, MapPin, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const {
    explorerName,
    activeAvatarObj,
    activeThemeObj,
    language,
    toggleLanguage,
    city,
    setIsSettingsOpen,
  } = useApp();

  const isEn = language === 'en';

  const today = new Date();
  const formattedDate = today.toLocaleDateString(isEn ? 'en-US' : 'az-AZ', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="relative z-10 w-full px-3 sm:px-4 pt-3 pb-1">
      <div className={`flex items-center justify-between gap-2 p-3 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-lg transition-colors duration-500`}>
        
        {/* Explorer Avatar & Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="cursor-pointer relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-2xl shadow-md shrink-0 border border-white/20 select-none"
          >
            <span>{activeAvatarObj.emoji}</span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </motion.button>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase tracking-wider font-black text-purple-300 truncate">
                {isEn ? 'Explorer' : 'Kəşfiyyatçı'}
              </span>
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white truncate leading-tight">
              {explorerName}
            </h1>
            <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5 truncate font-medium">
              <span className="whitespace-nowrap">{formattedDate}</span>
              <span>•</span>
              <span className="text-pink-300 flex items-center gap-0.5 truncate whitespace-nowrap">
                <MapPin className="w-2.5 h-2.5 shrink-0 text-pink-400" />
                {isEn ? city.name : (city.name_az || city.name)}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls: Language & Settings */}
        <div className="flex items-center gap-1.5 shrink-0">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs font-black shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-3 h-3 text-pink-400 shrink-0" />
            <span>{isEn ? 'EN' : 'AZ'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white transition shadow-sm cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4 text-purple-300" />
          </motion.button>
        </div>

      </div>
    </header>
  );
}
