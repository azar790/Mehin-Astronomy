import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Moon, Sun, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSkyData, getKidSkyMessage } from '../utils/astronomy';

export default function SkyRadar() {
  const { explorerName, language, city, activeThemeObj } = useApp();
  const isEn = language === 'en';

  const skyData = useMemo(() => {
    return getSkyData(city.lat, city.lng);
  }, [city.lat, city.lng]);

  const kidTip = getKidSkyMessage(skyData, explorerName, language);

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-1">
      {/* Personalized Kid Tip Banner */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-900/40 to-slate-900/80 backdrop-blur-md border border-purple-500/30 flex items-center gap-2.5 shadow-md"
      >
        <span className="text-xl sm:text-2xl animate-bounce shrink-0">🔭</span>
        <p className="text-xs sm:text-sm font-medium text-purple-100 leading-snug">
          {kidTip}
        </p>
      </motion.div>

      {/* Grid: Sun & Moon stacked or 2-col on tablets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Sun Journey Card */}
        <div className={`p-4 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-500`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
                <Sun className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {isEn ? 'Sun Journey' : 'Günəşin Yolu'}
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/30">
              {skyData.dayProgress}% {isEn ? 'Daylight' : 'Keçdi'}
            </span>
          </div>

          {/* Daylight Arc */}
          <div className="relative w-full h-20 flex items-end justify-center mb-2">
            <svg className="w-full h-full max-w-[240px]" viewBox="0 0 200 80">
              <path
                d="M 20,70 A 80,60 0 0,1 180,70"
                fill="none"
                stroke="rgba(251, 191, 36, 0.25)"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
              <path
                d="M 20,70 A 80,60 0 0,1 180,70"
                fill="none"
                stroke="url(#sunGradient)"
                strokeWidth="4"
                strokeDasharray="260"
                strokeDashoffset={260 - (skyData.dayProgress / 100) * 260}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Sun Indicator */}
            <motion.div
              className="absolute text-xl filter drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
              style={{
                left: `${Math.min(88, Math.max(12, skyData.dayProgress))}%`,
                bottom: `${Math.sin((skyData.dayProgress / 100) * Math.PI) * 40 + 8}px`,
                transform: 'translate(-50%, 50%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              ☀️
            </motion.div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-400">{isEn ? 'Sunrise' : 'Doğuş'}</p>
                <p className="text-xs font-bold text-white">{skyData.sunriseTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Sunset className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-400">{isEn ? 'Sunset' : 'Qürub'}</p>
                <p className="text-xs font-bold text-white">{skyData.sunsetTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Moon Radar Card */}
        <div className={`p-4 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-500`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300">
                <Moon className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {isEn ? 'Moon Radar' : 'Ayın Radarı'}
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-400/30">
              {skyData.moon.fraction}% {isEn ? 'Bright' : 'İşıqlı'}
            </span>
          </div>

          {/* Moon Visual & Details */}
          <div className="flex items-center gap-3 my-2">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(199, 210, 254, 0.4))',
                  'drop-shadow(0 0 18px rgba(199, 210, 254, 0.7))',
                  'drop-shadow(0 0 10px rgba(199, 210, 254, 0.4))',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-200 via-indigo-100 to-white flex items-center justify-center text-2xl shadow-inner border border-indigo-200/40 shrink-0 select-none"
            >
              <span>{skyData.moon.moonIcon}</span>
            </motion.div>

            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">
                {isEn ? 'Tonight' : 'Bu Gecə'}
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                {isEn ? skyData.moon.phaseNameEn : skyData.moon.phaseNameAz}
              </h3>
              
              <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-200/90 font-medium">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <span className="truncate">
                  {skyData.moon.daysToFull === 0
                    ? (isEn ? 'Full Moon TONIGHT! 🌕' : 'Dolunay BU GECƏDİR! 🌕')
                    : (isEn
                        ? `Full Moon in ${skyData.moon.daysToFull}d`
                        : `Dolunaya ${skyData.moon.daysToFull} gün`)}
                </span>
              </div>
            </div>
          </div>

          {/* Stargazing Hint */}
          <div className="mt-2.5 p-2 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-between text-[11px] text-indigo-200">
            <span>✨ {isEn ? 'Best stargazing:' : 'Ulduz izləmə:'}</span>
            <span className="font-bold text-white">21:30 - 23:30</span>
          </div>
        </div>

      </div>
    </section>
  );
}
