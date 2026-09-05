import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Sparkles, MapPin, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSkyData, getKidSkyMessage } from '../utils/astronomy';

export default function SkyRadar() {
  const { explorerName, language, city, activeThemeObj, activeAvatarObj } = useApp();
  const isEn = language === 'en';

  const skyData = useMemo(() => {
    return getSkyData(city.lat, city.lng);
  }, [city.lat, city.lng]);

  const kidTip = getKidSkyMessage(skyData, explorerName, language);

  const isNight = skyData.skyState === 'night' || skyData.skyState === 'dusk';
  const isDay = !isNight;

  // Sun orbit angle based on dayProgress (0 to 100%)
  // At sunrise (dayProgress = 0%): angle ~ 180 deg (left horizon)
  // At solar noon (dayProgress = 50%): angle ~ 270 deg (directly above Earth)
  // At sunset (dayProgress = 100%): angle ~ 360/0 deg (right horizon)
  // At night: smoothly tucked beneath Earth
  const sunAngleRad = isDay 
    ? Math.PI + (skyData.dayProgress / 100) * Math.PI 
    : (skyData.dayProgress >= 100 ? 0 : Math.PI);

  // Radius of the orbit from center of the 260x200 canvas
  const orbitRx = 115;
  const orbitRy = 75;
  const centerX = 130;
  const centerY = 100;

  // Calculate Sun position on the ellipse
  const sunX = isDay 
    ? centerX + orbitRx * Math.cos(sunAngleRad) 
    : centerX + orbitRx * 0.95;
  const sunY = isDay 
    ? centerY + orbitRy * Math.sin(sunAngleRad) 
    : centerY + orbitRy * 0.8;

  // Moon is positioned on the night/opposite side of Earth
  const moonX = isDay 
    ? centerX - orbitRx * 0.85 
    : centerX - orbitRx * 0.75;
  const moonY = isDay 
    ? centerY + orbitRy * 0.75 
    : centerY - orbitRy * 0.85;

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

      {/* Main Interactive Cosmic Globe Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl border relative overflow-hidden transition-colors duration-500`}
      >
        {/* Header with Title & Current Location Badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{isEn ? 'Earth & Celestial Radar' : 'Yer Kürəsi və Səma Radarı'}</span>
              </h2>
              <p className="text-[10px] text-slate-300 font-medium">
                {isEn ? 'Live Sun & Moon position relative to Earth' : 'Günəş və Ayın Yer kürəsinə görə canlı vəziyyəti'}
              </p>
            </div>
          </div>

          {/* Current Sky Condition Pill */}
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-black border flex items-center gap-1 shadow-sm shrink-0 ${
            isDay 
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' 
              : 'bg-indigo-600/30 text-indigo-200 border-indigo-400/40'
          }`}>
            <span>{isDay ? '☀️' : '🌙'}</span>
            <span>{isDay ? (isEn ? 'Daytime' : 'Gündüz') : (isEn ? 'Nighttime' : 'Gecə')}</span>
          </div>
        </div>

        {/* 🌟 Center Stage: Beautiful 2.5D Earth with Day/Night Lighting & Orbiting Sun/Moon 🌟 */}
        <div className="relative w-full h-[195px] flex items-center justify-center my-1 select-none">
          <svg className="w-full h-full max-w-[320px]" viewBox="0 0 260 200">
            <defs>
              {/* Day Ocean Gradient */}
              <radialGradient id="dayOcean" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#0284c7" />
                <stop offset="85%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#075985" />
              </radialGradient>

              {/* Night Ocean Gradient */}
              <radialGradient id="nightOcean" cx="60%" cy="60%" r="65%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="90%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              {/* Sun Glow Filter */}
              <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Atmosphere Halo Glow */}
              <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
                <stop offset="78%" stopColor="transparent" />
                <stop offset="88%" stopColor={isDay ? "rgba(56, 189, 248, 0.4)" : "rgba(147, 51, 234, 0.3)"} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Mask for Day/Night Shadow over Earth */}
              <clipPath id="earthClip">
                <circle cx={centerX} cy={centerY} r="54" />
              </clipPath>

              {/* Day/Night terminator shadow */}
              <linearGradient 
                id="dayNightShade" 
                x1={isDay ? "0%" : "100%"} 
                y1="0%" 
                x2={isDay ? "100%" : "0%"} 
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="45%" stopColor="rgba(3, 7, 18, 0.15)" />
                <stop offset="65%" stopColor="rgba(3, 7, 18, 0.75)" />
                <stop offset="100%" stopColor="rgba(2, 6, 23, 0.95)" />
              </linearGradient>
            </defs>

            {/* Orbit Dash Ring */}
            <ellipse
              cx={centerX}
              cy={centerY}
              rx={orbitRx}
              ry={orbitRy}
              fill="none"
              stroke={isDay ? "rgba(251, 191, 36, 0.22)" : "rgba(167, 139, 250, 0.22)"}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Earth Outer Atmosphere Halo */}
            <circle cx={centerX} cy={centerY} r="60" fill="url(#atmosphereGlow)" />

            {/* Earth Sphere Base (Clipped) */}
            <g clipPath="url(#earthClip)">
              {/* Ocean Base */}
              <rect
                x={centerX - 56}
                y={centerY - 56}
                width="112"
                height="112"
                fill={isDay ? "url(#dayOcean)" : "url(#nightOcean)"}
              />

              {/* Stylized Continents (Eurasia, Africa, Americas) */}
              <g className="transition-all duration-1000">
                {/* Africa & Europe */}
                <path
                  d="M 120,70 Q 135,68 142,75 Q 145,85 138,95 Q 132,105 130,120 Q 124,128 118,122 Q 112,110 114,92 Q 116,78 120,70 Z"
                  fill={isDay ? "#22c55e" : "#14532d"}
                  opacity={isDay ? 0.9 : 0.6}
                />
                {/* Asia */}
                <path
                  d="M 135,70 Q 155,62 165,74 Q 170,88 158,96 Q 148,100 140,88 Z"
                  fill={isDay ? "#16a34a" : "#0f3e23"}
                  opacity={isDay ? 0.9 : 0.6}
                />
                {/* Americas Silhouette on left side */}
                <path
                  d="M 90,75 Q 102,78 100,90 Q 94,102 96,115 Q 92,125 86,118 Q 84,98 90,75 Z"
                  fill={isDay ? "#4ade80" : "#166534"}
                  opacity={isDay ? 0.85 : 0.5}
                />

                {/* Night City Lights (Only visible when it's dark!) */}
                {isNight && (
                  <g className="animate-pulse">
                    <circle cx="132" cy="78" r="1.5" fill="#fef08a" filter="drop-shadow(0 0 2px #fde047)" />
                    <circle cx="140" cy="82" r="1.2" fill="#fde047" />
                    <circle cx="126" cy="85" r="1.5" fill="#facc15" />
                    <circle cx="135" cy="98" r="1.3" fill="#fef08a" />
                    <circle cx="120" cy="115" r="1.2" fill="#fde047" />
                    <circle cx="152" cy="78" r="1.5" fill="#facc15" />
                  </g>
                )}
              </g>

              {/* Day / Night Terminator Shadow */}
              <rect
                x={centerX - 56}
                y={centerY - 56}
                width="112"
                height="112"
                fill="url(#dayNightShade)"
              />

              {/* 3D Sphere Spherical Glare/Reflection */}
              <radialGradient id="sphereLight" cx="35%" cy="30%" r="50%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                <stop offset="60%" stopColor="rgba(255, 255, 255, 0)" />
              </radialGradient>
              <circle cx={centerX} cy={centerY} r="54" fill="url(#sphereLight)" />
            </g>

            {/* Earth Surface Border Ring */}
            <circle
              cx={centerX}
              cy={centerY}
              r="54"
              fill="none"
              stroke={isDay ? "rgba(56, 189, 248, 0.4)" : "rgba(147, 51, 234, 0.35)"}
              strokeWidth="1.5"
            />

            {/* 📍 Mehin's Explorer Location Pin on Earth */}
            <g transform={`translate(${centerX + 4}, ${centerY - 18})`} className="cursor-pointer">
              {/* Pulsing radar wave */}
              <circle cx="0" cy="0" r="8" className="animate-ping" fill={isDay ? "#f59e0b" : "#a855f7"} opacity="0.4" />
              {/* Pin Base Dot */}
              <circle cx="0" cy="0" r="4.5" fill={isDay ? "#ef4444" : "#ec4899"} stroke="#ffffff" strokeWidth="1.5" />
            </g>

            {/* ☀️ Live Orbiting Sun */}
            <g
              transform={`translate(${sunX}, ${sunY})`}
              className="cursor-pointer"
              filter="url(#sunGlow)"
            >
              {/* Outer Pulsing Corona */}
              <circle cx="0" cy="0" r="16" fill="rgba(251, 191, 36, 0.25)" className="animate-pulse" />
              {/* Sun Core */}
              <circle cx="0" cy="0" r="11" fill="url(#sunBallGrad)" stroke="#fef08a" strokeWidth="1.5" />
              {/* Tiny Face / Radiance */}
              <circle cx="-3" cy="-2" r="1" fill="#78350f" />
              <circle cx="3" cy="-2" r="1" fill="#78350f" />
              <path d="M -3 3 Q 0 5 3 3" stroke="#78350f" strokeWidth="0.8" fill="none" />
              
              <defs>
                <radialGradient id="sunBallGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </radialGradient>
              </defs>
            </g>

            {/* 🌙 Live Orbiting Moon (Rendered in Actual Phase) */}
            <g transform={`translate(${moonX}, ${moonY})`} className="cursor-pointer">
              {/* Moon Glow */}
              <circle cx="0" cy="0" r="14" fill={isNight ? "rgba(192, 132, 252, 0.25)" : "rgba(255, 255, 255, 0.1)"} />
              {/* Moon Body */}
              <circle cx="0" cy="0" r="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              {/* Moon Craters */}
              <circle cx="-2" cy="-2" r="2" fill="#94a3b8" opacity="0.6" />
              <circle cx="3" cy="2" r="1.5" fill="#94a3b8" opacity="0.6" />
              <circle cx="-1" cy="4" r="1" fill="#94a3b8" opacity="0.5" />
              {/* Moon Phase Shadow Overlay */}
              {!skyData.moon.isFullMoon && (
                <path
                  d="M 0,-9 A 9,9 0 0,0 0,9 A 6,9 0 0,1 0,-9"
                  fill="#1e293b"
                  opacity="0.85"
                />
              )}
            </g>
          </svg>

          {/* Floating Explorer Tag Label */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-purple-500/40 shadow-lg text-[10px] font-black text-white whitespace-nowrap">
            <span>{activeAvatarObj.emoji}</span>
            <span className="text-pink-300 font-bold">{explorerName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-200">{isEn ? city.name : (city.name_az || city.name)}</span>
          </div>
        </div>

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
