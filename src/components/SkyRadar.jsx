import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Compass, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSkyData, getKidSkyMessage } from '../utils/astronomy';
import { EarthGlobe3D } from './EarthGlobe3D';

export default function SkyRadar() {
  const { explorerName, language, city, activeThemeObj, activeAvatarObj } = useApp();
  const isEn = language === 'en';

  const skyData = useMemo(() => {
    return getSkyData(city.lat, city.lng);
  }, [city.lat, city.lng]);

  const kidTip = getKidSkyMessage(skyData, explorerName, language);
  const isNight = skyData.skyState === 'night' || skyData.skyState === 'dusk';
  const isDay = !isNight;

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-1.5">
      {/* Personalized Kid Tip Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-2.5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-900/50 to-slate-900/90 backdrop-blur-md border border-purple-500/40 flex items-center gap-2.5 shadow-lg"
      >
        <span className="text-2xl animate-bounce shrink-0 select-none">🌍</span>
        <p className="text-xs sm:text-sm font-bold text-purple-100 leading-snug">
          {kidTip}
        </p>
      </motion.div>

      {/* Main 3D Earth Globe Card */}
      <motion.div
        className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl border relative overflow-hidden transition-colors duration-500`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{isEn ? '3D Cosmic Earth & Sky Radar' : 'Canlı 3D Yer Kürəsi və Səma'}</span>
              </h2>
              <p className="text-[10px] text-slate-300 font-medium">
                {isEn ? 'Real-time Day & Night lighting across our planet' : 'Planetimizdə canlı Gündüz və Gecə işıqlanması'}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-black border flex items-center gap-1 shadow-sm shrink-0 ${
            isDay 
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' 
              : 'bg-indigo-600/30 text-indigo-200 border-indigo-400/40'
          }`}>
            <span>{isDay ? '☀️' : '🌙'}</span>
            <span>{isDay ? (isEn ? 'Daytime' : 'Gündüzdür') : (isEn ? 'Nighttime' : 'Gecədir')}</span>
          </div>
        </div>

        {/* 🌟 Photorealistic 3D Globe with Touch Rotation & Real Lighting 🌟 */}
        <EarthGlobe3D
          lat={city.lat}
          lng={city.lng}
          isDay={isDay}
          dayProgress={skyData.dayProgress}
          cityName={isEn ? city.name : (city.name_az || city.name)}
          explorerName={explorerName}
          avatarEmoji={activeAvatarObj.emoji}
        />

        {/* 2 Clear, Kid-Friendly Information Cards (Sun & Moon) */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-purple-500/20">
          
          {/* Sun Times Card */}
          <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-amber-500/25 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                <span>☀️</span>
                <span>{isEn ? 'Sun Cycle' : 'Günəş Dövrü'}</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                {skyData.dayProgress}%
              </span>
            </div>
            
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-200">
              <span className="flex items-center gap-1">
                <Sunrise className="w-3 h-3 text-amber-400" />
                <span>{skyData.sunriseTime}</span>
              </span>
              <span className="flex items-center gap-1">
                <Sunset className="w-3 h-3 text-rose-400" />
                <span>{skyData.sunsetTime}</span>
              </span>
            </div>
          </div>

          {/* Moon Phase Card */}
          <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-indigo-500/25 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-purple-300 flex items-center gap-1">
                <span>{skyData.moon.moonIcon}</span>
                <span className="truncate max-w-[85px]">{isEn ? skyData.moon.phaseNameEn : skyData.moon.phaseNameAz}</span>
              </span>
              <span className="text-[9px] font-bold text-indigo-300">
                {skyData.moon.fraction}%
              </span>
            </div>

            <div className="text-[10px] font-bold text-slate-300 truncate">
              {skyData.moon.daysToFull === 0
                ? (isEn ? '🌕 Full Moon tonight!' : '🌕 Bu gecə Dolunay!')
                : (isEn ? `🌕 Next Full Moon: ${skyData.moon.daysToFull}d` : `🌕 Dolunaya: ${skyData.moon.daysToFull} gün`)}
            </div>
          </div>

        </div>

      </motion.div>
    </section>
  );
}
