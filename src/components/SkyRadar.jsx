import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Sparkles, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSkyData, getKidSkyMessage } from '../utils/astronomy';
import { EarthGlobe3D } from './EarthGlobe3D';

/**
 * Premium Mobile "Our Sky & Earth" Experience
 * Inspiring Apple Weather & Pixar grade child-friendly educational celestial radar.
 */
export default function SkyRadar() {
  const { explorerName, language, city, activeThemeObj, activeAvatarObj } = useApp();
  const isEn = language === 'en';

  const skyData = useMemo(() => {
    return getSkyData(city.lat, city.lng);
  }, [city.lat, city.lng]);

  const kidTip = getKidSkyMessage(skyData, explorerName, language);
  const isNight = skyData.skyState === 'night' || skyData.skyState === 'dusk';
  const isDay = !isNight;

  // Single friendly, 2-second understandable sentence for Mehin
  const primaryStatusSentence = isDay
    ? (isEn
      ? `☀️ The Sun is shining right now on ${explorerName}'s side of Earth!`
      : `☀️ Günəş indicə ${explorerName}-in olduğu tərəfə parlaq şüalar saçır!`)
    : (isEn
      ? `🌙 ${explorerName} is now on the peaceful night side of Earth, under the starlight.`
      : `🌙 ${explorerName} indi Yer kürəsinin gecə və sakit tərəfindədir, ulduzlar parıldayır.`);

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 py-1.5">
      {/* Container Card with Apple-Style Depth & Subtle Border */}
      <div className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-2xl shadow-2xl border border-white/10 flex flex-col space-y-3 relative overflow-hidden transition-all duration-500`}>
        
        {/* Top Header: Minimal, Clean, Elegant */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌌</span>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                {isEn ? 'Our Planet & Sky' : 'Planetimiz və Səma'}
              </h2>
              <p className="text-[10px] font-semibold text-slate-400">
                {isEn ? 'Real-time window into space' : 'Kosmosa açılan canlı pəncərə'}
              </p>
            </div>
          </div>

          {/* Live Atmospheric Tag */}
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 shadow-sm ${
            isDay
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
              : 'bg-indigo-600/30 text-indigo-200 border-indigo-400/40'
          }`}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: isDay ? '#fbbf24' : '#818cf8' }} />
            <span>{isDay ? (isEn ? 'Daylight' : 'Gündüz') : (isEn ? 'Night' : 'Gecə')}</span>
          </div>
        </div>

        {/* 🌟 Central Hero: The 3D Earth, Sun & Moon Living Space Scene 🌟 */}
        <div className="w-full relative">
          <EarthGlobe3D
            lat={city.lat}
            lng={city.lng}
            isDay={isDay}
            dayProgress={skyData.dayProgress}
            cityName={isEn ? city.name : (city.name_az || city.name)}
            explorerName={explorerName}
            avatarEmoji={activeAvatarObj.emoji}
            moonPhaseFraction={skyData.moon.fraction / 100}
            isEn={isEn}
          />
        </div>

        {/* Child-Friendly Primary Status Banner (Understandable in 2 seconds) */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-center shadow-md"
        >
          <p className="text-xs sm:text-sm font-black text-purple-100 tracking-wide">
            {primaryStatusSentence}
          </p>
        </motion.div>

        {/* Contextual Secondary Info Strip: Clear, Spaced, Uncluttered */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          
          {/* Sun Cycle Info */}
          <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                <span>☀️</span>
                <span>{isEn ? 'Sunlight' : 'Günəş'}</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {skyData.dayProgress}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-200">
              <span className="flex items-center gap-1">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                <span>{skyData.sunriseTime}</span>
              </span>
              <span className="flex items-center gap-1">
                <Sunset className="w-3.5 h-3.5 text-rose-400" />
                <span>{skyData.sunsetTime}</span>
              </span>
            </div>
          </div>

          {/* Moon Info */}
          <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-purple-300 flex items-center gap-1">
                <span>{skyData.moon.moonIcon}</span>
                <span className="truncate max-w-[85px]">{isEn ? skyData.moon.phaseNameEn : skyData.moon.phaseNameAz}</span>
              </span>
              <span className="text-[10px] font-bold text-indigo-300">
                {skyData.moon.fraction}%
              </span>
            </div>
            <div className="text-[10px] font-bold text-slate-300 truncate">
              {skyData.moon.daysToFull === 0
                ? (isEn ? '🌕 Full Moon tonight!' : '🌕 Bu gecə Dolunay!')
                : (isEn ? `🌕 Full Moon: in ${skyData.moon.daysToFull}d` : `🌕 Dolunaya: ${skyData.moon.daysToFull} gün`)}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
