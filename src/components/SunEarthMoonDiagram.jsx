import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SunEarthMoonDiagram
 * Premium Illustrated Children's Astronomy Diagram (Apple/Pixar educational book style).
 * Shows the fundamental relationship: ☀️ SUN (left) → 🌍 EARTH (center) → 🌙 MOON (orbiting).
 * A 7-year-old child looks at it for 2 seconds and immediately understands:
 * 1. The Sun warms and lights the left side of Earth.
 * 2. The right side is facing away, in shadow (Night).
 * 3. A glowing pin shows where Mehin is right now.
 * 4. The Moon sits on its orbital path displaying today's real lunar phase.
 */
export default function SunEarthMoonDiagram({
  isDay = true,
  dayProgress = 50,
  cityName = 'Baku',
  explorerName = 'Mehin',
  avatarEmoji = '🧑‍🚀',
  moon = {
    phase: 0.5,
    fraction: 98,
    phaseNameEn: 'Full Moon',
    phaseNameAz: 'Dolunay',
    moonIcon: '🌕',
    isFullMoon: true,
  },
  sunriseTime = '06:18',
  sunsetTime = '19:24',
  isEn = true,
}) {
  const [activeNote, setActiveNote] = useState(null);

  // Calculate Mehin's beacon position on Earth:
  // If it's DAY: Mehin is on the sunlit side (left hemisphere)
  // If it's NIGHT: Mehin is on the dark side (right hemisphere)
  const markerX = isDay ? 150 : 250;
  const markerY = isDay ? 180 : 190;

  // Moon position along its elliptical orbit:
  // The Moon angle depends on the moon phase (0 to 1)
  // 0 (New Moon) = near the Sun
  // 0.5 (Full Moon) = behind Earth, fully reflecting sunlight
  const moonAngle = (moon.phase || 0.5) * Math.PI * 2;
  // Elliptical orbit centered at Earth (cx=200, cy=190)
  const orbitRx = 125;
  const orbitRy = 85;
  const moonX = 200 + orbitRx * Math.cos(moonAngle - Math.PI / 2);
  const moonY = 190 + orbitRy * Math.sin(moonAngle - Math.PI / 2);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none">
      
      {/* 1. Header: "Mehin's Sky" */}
      <div className="w-full flex items-center justify-between px-2 pt-1 pb-1">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300/90">
            {isEn ? `${explorerName}'s Sky` : `${explorerName}-in Səması`}
          </span>
          <h1 className="text-xl font-black text-white tracking-tight">
            {cityName}
          </h1>
        </div>

        {/* Live Badge: ☀️ DAYTIME or 🌙 NIGHT */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-md ${
            isDay
              ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300'
              : 'bg-indigo-900/40 border border-indigo-400/40 text-indigo-200'
          }`}
        >
          <span>{isDay ? '☀️' : '🌙'}</span>
          <span>{isDay ? (isEn ? "IT'S DAYTIME!" : 'İNDİ GÜNDÜZDÜR!') : (isEn ? "IT'S NIGHT!" : 'İNDİ GECƏDİR!')}</span>
        </div>
      </div>

      {/* 2. Primary Illustrated Science Diagram (SVG Canvas: 400x380) */}
      <div className="relative w-full aspect-[400/360] max-h-[370px]">
        <svg
          viewBox="0 0 400 360"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Sun Core Radial Glow */}
            <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
            </radialGradient>

            {/* Sunlight Rays Flowing Left to Right */}
            <linearGradient id="rayFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(253, 224, 71, 0.45)" />
              <stop offset="60%" stopColor="rgba(251, 191, 36, 0.18)" />
              <stop offset="100%" stopColor="rgba(251, 191, 36, 0.0)" />
            </linearGradient>

            {/* Earth Day Side Gradient */}
            <radialGradient id="earthDayGrad" cx="30%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="40%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>

            {/* Earth Night Side Gradient */}
            <radialGradient id="earthNightGrad" cx="70%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Earth Sphere Clip Path */}
            <clipPath id="earthSphereClip">
              <circle cx="200" cy="190" r="68" />
            </clipPath>

            {/* Night Shadow Mask on Earth */}
            <linearGradient id="terminatorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="45%" stopColor="rgba(0,0,0,0)" />
              <stop offset="52%" stopColor="rgba(2, 6, 23, 0.55)" />
              <stop offset="75%" stopColor="rgba(2, 6, 23, 0.94)" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* 🌟 A. SUNLIGHT RAYS (Streaming warmly toward Earth) 🌟 */}
          <g opacity="0.9">
            {/* Beam 1 */}
            <polygon points="50,110 200,130 200,165 50,130" fill="url(#rayFlowGrad)" />
            {/* Beam 2 (Main Center) */}
            <polygon points="50,135 200,165 200,215 50,175" fill="url(#rayFlowGrad)" />
            {/* Beam 3 */}
            <polygon points="50,180 200,215 200,250 50,200" fill="url(#rayFlowGrad)" />

            {/* Animated Dashed Golden Photons */}
            <line
              x1="55" y1="140" x2="135" y2="175"
              stroke="#fef08a" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round"
              className="animate-pulse opacity-70"
            />
            <line
              x1="55" y1="165" x2="135" y2="190"
              stroke="#fde047" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round"
              className="animate-pulse opacity-80"
            />
            <line
              x1="55" y1="190" x2="135" y2="205"
              stroke="#fef08a" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round"
              className="animate-pulse opacity-60"
            />
          </g>

          {/* 🌟 B. MOON'S ELEGANT ORBIT PATH 🌟 */}
          <ellipse
            cx="200"
            cy="190"
            rx={orbitRx}
            ry={orbitRy}
            fill="none"
            stroke="rgba(192, 132, 252, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />

          {/* 🌟 C. THE EARTH (Center Stage, 136px diameter) 🌟 */}
          <g>
            {/* Atmosphere Blue Soft Rim */}
            <circle cx="200" cy="190" r="74" fill="rgba(56, 189, 248, 0.12)" />
            <circle cx="200" cy="190" r="70" fill="rgba(56, 189, 248, 0.22)" />

            {/* Earth Body (Clipped to Sphere) */}
            <g clipPath="url(#earthSphereClip)">
              {/* Ocean Base */}
              <rect x="130" y="120" width="140" height="140" fill="url(#earthDayGrad)" />

              {/* Continents (Vibrant Green & Natural Terrain) */}
              <g fill="#22c55e" opacity="0.95">
                {/* Left/Sunlit side continents */}
                <path d="M 155,150 Q 170,140 180,155 Q 185,175 175,190 Q 165,200 155,185 Z" fill="#16a34a" />
                <path d="M 160,200 Q 175,210 180,230 Q 170,245 158,235 Q 150,220 160,200 Z" fill="#15803d" />
                {/* Right side continents */}
                <path d="M 210,145 Q 235,135 245,150 Q 250,170 235,180 Q 220,185 210,165 Z" fill="#166534" />
                <path d="M 220,195 Q 240,205 245,225 Q 230,240 215,230 Z" fill="#14532d" />
              </g>

              {/* White Swirling Clouds */}
              <path
                d="M 145,160 Q 170,155 190,165 Q 175,170 150,168 Z"
                fill="#ffffff" opacity="0.45"
              />
              <path
                d="M 180,210 Q 210,205 235,215 Q 215,220 185,218 Z"
                fill="#ffffff" opacity="0.4"
              />

              {/* 🌙 The Night Terminator Shadow (Dramatically dark on right side) */}
              <rect x="130" y="120" width="140" height="140" fill="url(#terminatorGrad)" />

              {/* Night City Lights (Warm golden specks on the dark side) */}
              <g fill="#fde047">
                <circle cx="225" cy="165" r="1.8" className="animate-pulse" />
                <circle cx="235" cy="175" r="1.5" />
                <circle cx="228" cy="190" r="2.0" className="animate-pulse" />
                <circle cx="240" cy="210" r="1.6" />
                <circle cx="220" cy="220" r="1.4" />
              </g>
            </g>

            {/* Earth Crisp Outer Border */}
            <circle
              cx="200"
              cy="190"
              r="68"
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
            />
          </g>

          {/* 🌟 D. MEHIN'S GLOWING LOCATION BEACON 📍 🌟 */}
          <g
            transform={`translate(${markerX}, ${markerY})`}
            onClick={() => setActiveNote('mehin')}
            className="cursor-pointer"
          >
            {/* Pulsing Beacon Wave */}
            <circle cx="0" cy="0" r="12" fill="#ec4899" opacity="0.35" className="animate-ping" />
            <circle cx="0" cy="0" r="7" fill="#ec4899" opacity="0.6" />
            {/* Core Pin Dot */}
            <circle cx="0" cy="0" r="4.5" fill="#ffffff" stroke="#ec4899" strokeWidth="2" />

            {/* Cute Pin Label Flag */}
            <g transform="translate(8, -14)">
              <rect x="0" y="0" width="62" height="18" rx="9" fill="rgba(15, 23, 42, 0.9)" stroke="#ec4899" strokeWidth="1.5" />
              <text x="7" y="12" fill="#ffffff" fontSize="9.5" fontWeight="900">
                {avatarEmoji} {explorerName}
              </text>
            </g>
          </g>

          {/* 🌟 E. THE SUN (Left Side, warm glowing source of life) 🌟 */}
          <g
            transform="translate(45, 155)"
            onClick={() => setActiveNote('sun')}
            className="cursor-pointer"
          >
            {/* Sun Corona Outer Aura */}
            <circle cx="0" cy="0" r="46" fill="url(#sunGlowGrad)" opacity="0.75" />
            <circle cx="0" cy="0" r="32" fill="#f59e0b" opacity="0.4" className="animate-pulse" />

            {/* Sun Solid Core */}
            <circle cx="0" cy="0" r="24" fill="#fbbf24" stroke="#fef08a" strokeWidth="2.5" />

            {/* Friendly Warm Sun Face */}
            <circle cx="-6" cy="-3" r="2.2" fill="#78350f" />
            <circle cx="6" cy="-3" r="2.2" fill="#78350f" />
            <path d="M -6 5 Q 0 10 6 5" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Little Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1={Math.cos((angle * Math.PI) / 180) * 27}
                y1={Math.sin((angle * Math.PI) / 180) * 27}
                x2={Math.cos((angle * Math.PI) / 180) * 35}
                y2={Math.sin((angle * Math.PI) / 180) * 35}
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Text label below Sun */}
            <text x="0" y="44" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="900">
              {isEn ? 'THE SUN' : 'GÜNƏŞ'}
            </text>
          </g>

          {/* 🌟 F. THE MOON (Orbiting body showing actual current phase) 🌟 */}
          <g
            transform={`translate(${moonX}, ${moonY})`}
            onClick={() => setActiveNote('moon')}
            className="cursor-pointer"
          >
            {/* Moon Glow */}
            <circle cx="0" cy="0" r="22" fill="rgba(216, 180, 254, 0.25)" />

            {/* Moon Base Disc */}
            <circle cx="0" cy="0" r="16" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Lunar Craters */}
            <circle cx="-4" cy="-4" r="3.2" fill="#cbd5e1" />
            <circle cx="5" cy="3" r="2.5" fill="#cbd5e1" />
            <circle cx="-2" cy="6" r="2" fill="#cbd5e1" />

            {/* Moon Phase Shadow (Dark overlay if not full moon) */}
            {!moon.isFullMoon && (
              <path
                d="M 0,-16 A 16,16 0 0,0 0,16 A 10,16 0 0,1 0,-16"
                fill="#1e293b"
                opacity="0.82"
              />
            )}

            {/* Moon Label */}
            <text x="0" y="28" textAnchor="middle" fill="#e9d5ff" fontSize="9.5" fontWeight="800">
              {isEn ? 'THE MOON' : 'AY'}
            </text>
          </g>

          {/* 🌟 G. EXPLANATORY ARROWS & LABELS 🌟 */}
          {/* Day Side Tag */}
          <text x="145" y="105" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="800">
            {isEn ? '☀️ DAY SIDE' : '☀️ GÜNDÜZ TƏRƏFİ'}
          </text>
          <path d="M 145,110 L 155,125" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />

          {/* Night Side Tag */}
          <text x="255" y="105" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="800">
            {isEn ? '🌙 NIGHT SIDE' : '🌙 GECƏ TƏRƏFİ'}
          </text>
          <path d="M 255,110 L 245,125" stroke="#c4b5fd" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 3. Interactive Popover (Tap Sun, Moon, or Mehin for simple wisdom) */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            onClick={() => setActiveNote(null)}
            className="mb-2 w-full p-2.5 rounded-2xl bg-purple-950/90 border border-purple-400/50 shadow-xl text-center cursor-pointer"
          >
            <p className="text-xs font-bold text-purple-100">
              {activeNote === 'sun' && (isEn
                ? '☀️ The Sun stays in place and shines light on one half of Earth.'
                : '☀️ Günəş öz yerində qalır və Yer kürəsinin bir tərəfini işıqlandırır.')}
              {activeNote === 'moon' && (isEn
                ? `🌙 The Moon orbits Earth! Today it is in the ${moon.phaseNameEn} phase.`
                : `🌙 Ay Yer kürəsinin ətrafında fırlanır! Bu gün ${moon.phaseNameAz} fazasındadır.`)}
              {activeNote === 'mehin' && (isEn
                ? `📍 ${explorerName} is currently right here in ${cityName}!`
                : `📍 ${explorerName} hazırda bax tam burada, ${cityName}-dadır!`)}
            </p>
            <span className="text-[10px] text-purple-300 font-medium mt-0.5 block">
              {isEn ? '(Tap to close)' : '(Bağlamaq üçün toxun)'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Bottom Educational Area (ONE unified, beautiful card for a 7-year-old) */}
      <div className="w-full p-4 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 shadow-xl flex flex-col space-y-2.5">
        
        {/* Core 2-Second Concept: Clear Big Message */}
        <div className="flex items-center gap-3">
          <span className="text-3xl shrink-0 select-none">
            {isDay ? '☀️' : '🌙'}
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight leading-tight">
              {isDay
                ? (isEn ? `${explorerName} is on the sunny side of Earth!` : `${explorerName} Yer kürəsinin günəşli tərəfindədir!`)
                : (isEn ? `${explorerName} is on the quiet night side of Earth!` : `${explorerName} Yer kürəsinin sakit gecə tərəfindədir!`)}
            </h2>
            <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
              {isDay
                ? (isEn ? 'The Sun is shining on our side right now.' : 'Günəş indicə bizim tərəfə baxır və bizi isidir.')
                : (isEn ? 'Our side is turned away from the Sun, under the stars.' : 'Bizim tərəf Günəşdən arxaya çevrilib, ulduzlar parıldayır.')}
            </p>
          </div>
        </div>

        {/* Clean Contextual Data Strip (Sunrise, Sunset, Moon Phase) */}
        <div className="pt-2 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-xs">
          {/* Sun Times */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800/60 border border-amber-500/20">
            <span className="text-base">🌅</span>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold text-amber-300 block leading-tight">
                {isEn ? 'Sunrise & Sunset' : 'Çıxış və Batış'}
              </span>
              <span className="font-extrabold text-slate-200 text-[11px] truncate block">
                {sunriseTime} – {sunsetTime}
              </span>
            </div>
          </div>

          {/* Today's Moon */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800/60 border border-purple-500/20">
            <span className="text-base">{moon.moonIcon}</span>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold text-purple-300 block leading-tight">
                {isEn ? "Tonight's Moon" : 'Bu Gecənin Ayı'}
              </span>
              <span className="font-extrabold text-slate-200 text-[11px] truncate block">
                {isEn ? moon.phaseNameEn : moon.phaseNameAz}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
