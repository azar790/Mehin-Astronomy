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
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-2">
      {/* Personalized Kid Tip Banner with larger font */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-3 p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-900/50 to-slate-900/90 backdrop-blur-md border border-purple-500/40 flex items-center gap-3 shadow-lg"
      >
        <span className="text-2xl sm:text-3xl animate-bounce shrink-0 select-none">🔭</span>
        <p className="text-sm sm:text-base font-bold text-purple-100 leading-snug">
          {kidTip}
        </p>
      </motion.div>

      {/* Grid: Sun & Moon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Sun Journey Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-500`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-amber-500/25 text-amber-300">
                <Sun className="w-5 h-5 animate-spin-slow" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                {isEn ? 'Sun Journey' : 'Günəşin Yolu'}
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
              {skyData.dayProgress}% {isEn ? 'Daylight' : 'Keçdi'}
            </span>
          </div>

          {/* Daylight Arc */}
          <div className="relative w-full h-22 flex items-end justify-center mb-2">
            <svg className="w-full h-full max-w-[240px]" viewBox="0 0 200 80">
              <path
                d="M 20,70 A 80,60 0 0,1 180,70"
                fill="none"
                stroke="rgba(251, 191, 36, 0.3)"
                strokeWidth="3.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 20,70 A 80,60 0 0,1 180,70"
                fill="none"
                stroke="url(#sunGradient)"
                strokeWidth="5"
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
              className="absolute text-2xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] select-none"
              style={{
                left: `${Math.min(88, Math.max(12, skyData.dayProgress))}%`,
                bottom: `${Math.sin((skyData.dayProgress / 100) * Math.PI) * 42 + 8}px`,
                transform: 'translate(-50%, 50%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              ☀️
            </motion.div>
          </div>

          {/* Sunrise and Sunset Times (Bigger, readable numbers) */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <Sunrise className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{isEn ? 'Sunrise' : 'Doğuş'}</p>
                <p className="text-sm font-black text-white">{skyData.sunriseTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <Sunset className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{isEn ? 'Sunset' : 'Qürub'}</p>
                <p className="text-sm font-black text-white">{skyData.sunsetTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Moon Radar Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-500`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-indigo-500/25 text-indigo-300">
                <Moon className="w-5 h-5" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                {isEn ? 'Moon Radar' : 'Ayın Radarı'}
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/40">
              {skyData.moon.fraction}% {isEn ? 'Bright' : 'İşıqlı'}
            </span>
          </div>

          {/* Moon Visual & Details */}
          <div className="flex items-center gap-3.5 my-2.5">
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(199, 210, 254, 0.4))',
                  'drop-shadow(0 0 20px rgba(199, 210, 254, 0.8))',
                  'drop-shadow(0 0 10px rgba(199, 210, 254, 0.4))',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-200 via-indigo-100 to-white flex items-center justify-center text-3xl shadow-inner border border-indigo-200/50 shrink-0 select-none"
            >
              <span>{skyData.moon.moonIcon}</span>
            </motion.div>

            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-black">
                {isEn ? 'Moon Tonight' : 'Bu Gecəki Ay'}
              </span>
              <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate">
                {isEn ? skyData.moon.phaseNameEn : skyData.moon.phaseNameAz}
              </h3>
              
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-indigo-200 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">
                  {skyData.moon.daysToFull === 0
                    ? (isEn ? 'Full Moon TONIGHT! 🌕' : 'Dolunay BU GECƏDİR! 🌕')
                    : (isEn
                        ? `Full Moon in ${skyData.moon.daysToFull} days`
                        : `Dolunaya ${skyData.moon.daysToFull} gün qaldı`)}
                </span>
              </div>
            </div>
          </div>

          {/* Stargazing Time */}
          <div className="mt-3 p-2.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
            <span className="font-medium">✨ {isEn ? 'Best stargazing:' : 'Ulduz izləmə:'}</span>
            <span className="font-black text-white">21:30 - 23:30</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
