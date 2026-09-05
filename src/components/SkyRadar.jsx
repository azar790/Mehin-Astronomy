import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getSkyData } from '../utils/astronomy';
import { AppleEarthScene } from './EarthGlobe3D';

/**
 * Redesigned Celestial Viewport:
 * Apple Astronomy / Pixar Educational aesthetic.
 * Clean, cinematic, zero dashboard clutter. Earth is the undisputed hero.
 */
export default function SkyRadar() {
  const { explorerName, language, city, activeAvatarObj } = useApp();
  const isEn = language === 'en';

  const skyData = useMemo(() => {
    return getSkyData(city.lat, city.lng);
  }, [city.lat, city.lng]);

  const isNight = skyData.skyState === 'night' || skyData.skyState === 'dusk';
  const isDay = !isNight;

  // Primary 2-second sentence for Mehin
  const educationalLead = isDay
    ? (isEn
      ? `The Sun is shining on ${explorerName}’s side of Earth.`
      : `Günəş indicə ${explorerName}-in olduğu tərəfə parlaq şüalar saçır.`)
    : (isEn
      ? `${explorerName} is on the peaceful night side of Earth.`
      : `${explorerName} indi Yer kürəsinin sakit gecə tərəfindədir.`);

  const educationalDetail = isDay
    ? (isEn
      ? `Sunrise was at ${skyData.sunriseTime}, and sunset will be at ${skyData.sunsetTime}.`
      : `Günəş səhər ${skyData.sunriseTime}-da doğub, ${skyData.sunsetTime}-da batacaq.`)
    : (isEn
      ? `The Moon is currently ${skyData.moon.phaseNameEn.toLowerCase()} in the sky.`
      : `Səmada hazırda ${skyData.moon.phaseNameAz.toLowerCase()} parıldayır.`);

  return (
    <section className="relative z-10 w-full max-w-lg mx-auto px-4 py-2">
      {/* 1. Minimal Header: Spacious & Calm */}
      <header className="flex items-baseline justify-between mb-1 px-1">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-purple-300/80">
            {isEn ? 'Earth & Sky' : 'Yer Kürəsi və Səma'}
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {isEn ? city.name : (city.name_az || city.name)}
          </h2>
        </div>

        {/* Quiet status tag */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isDay ? '#fbbf24' : '#818cf8',
              boxShadow: isDay ? '0 0 8px #f59e0b' : '0 0 8px #6366f1',
            }}
          />
          <span>{isDay ? (isEn ? 'Day' : 'Gündüz') : (isEn ? 'Night' : 'Gecə')}</span>
        </div>
      </header>

      {/* 2. Hero 3D Earth floating in space (No enclosing cards or borders) */}
      <div className="relative w-full overflow-hidden">
        <AppleEarthScene
          lat={city.lat}
          lng={city.lng}
          isDay={isDay}
          dayProgress={skyData.dayProgress}
          cityName={isEn ? city.name : (city.name_az || city.name)}
          explorerName={explorerName}
          avatarEmoji={activeAvatarObj.emoji}
        />
      </div>

      {/* 3. Refined Educational Panel (Single calm, unified card) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-1 p-4 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl"
      >
        {/* The child-friendly immediate sentence */}
        <p className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">
          {educationalLead}
        </p>
        <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
          {educationalDetail}
        </p>

        {/* Clean Contextual Strip */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">☀️</span>
            <span>{skyData.sunriseTime} – {skyData.sunsetTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-indigo-300">{skyData.moon.moonIcon}</span>
            <span>{isEn ? skyData.moon.phaseNameEn : skyData.moon.phaseNameAz}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
