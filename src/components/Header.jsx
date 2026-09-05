import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sparkles, MapPin, Globe, X } from 'lucide-react';
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

  const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);
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
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAvatarZoomed(true);
            }}
            className="cursor-pointer relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 shadow-md shrink-0 border border-white/20 overflow-hidden select-none hover:ring-2 hover:ring-pink-400/50 transition-all"
            title={isEn ? "Tap to enlarge photo" : "Şəkli böyütmək üçün toxun"}
          >
            {activeAvatarObj.isCustom && activeAvatarObj.photoUrl ? (
              <img src={activeAvatarObj.photoUrl} alt="Explorer" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{activeAvatarObj.emoji}</span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </motion.button>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase tracking-wider font-black text-purple-300 truncate">
                {isEn ? 'Space Hero' : 'Ulduz Qəhrəmanı'}
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

      {/* Enlarged Avatar Lightbox Modal - Tapping anywhere closes it */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAvatarZoomed && (
            <div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setIsAvatarZoomed(false)}
            >
              {/* Fullscreen Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-md -z-10"
              />

              {/* Enlarged Avatar Card */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                className="relative flex flex-col items-center p-6 sm:p-7 rounded-3xl bg-slate-900/95 border-2 border-pink-500/50 shadow-2xl max-w-xs w-full text-center"
                onClick={() => setIsAvatarZoomed(false)}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsAvatarZoomed(false)}
                  className="absolute top-3.5 right-3.5 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Big Avatar Frame */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-2xl mb-4 overflow-hidden flex items-center justify-center ring-4 ring-pink-500/30">
                  {activeAvatarObj.isCustom && activeAvatarObj.photoUrl ? (
                    <img
                      src={activeAvatarObj.photoUrl}
                      alt={explorerName}
                      className="w-full h-full object-cover rounded-full select-none"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-850 flex items-center justify-center text-7xl sm:text-8xl select-none bg-slate-800">
                      {activeAvatarObj.emoji}
                    </div>
                  )}
                </div>

                {/* Role Badge & Name */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-300">
                    {isEn ? 'Space Hero' : 'Ulduz Qəhrəmanı'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {explorerName}
                </h2>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  {isEn ? 'Tap anywhere to close' : 'Bağlamaq üçün ekrana toxunun'}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
