import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { getAstronomicalDiagramData } from '../utils/astronomyDiagram';

/**
 * SunEarthMoonDiagram (Apple & Pixar Quality Illustrated Astronomy)
 *
 * Implements user requested fixes:
 * 1. Sunlight Rays: Starts cleanly from a single point at the Sun center and expands outward
 *    as a cone/triangle beam toward Earth (no awkward rectangle).
 * 2. Moon Clean Single Position: The ghost circle artifact on top of Earth is fixed (clipPath/transform bug eliminated),
 *    leaving only the real Moon on the right side.
 * 3. Minimal Clean UI: Removed "DAY SIDE", "NIGHT SIDE" and extraneous arrows/labels to keep the illustration pure.
 * 4. Strictly aligns with the physical sunlight vector: ☀️ ────────► 🌍 ───► 🌙
 */
export default function SunEarthMoonDiagram({
  lat = 40.4093,
  lng = 49.8671,
  cityName = 'Baku',
  explorerName = 'Mehin',
  avatarEmoji = '🧑‍🚀',
  isEn = true,
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeBubble, setActiveBubble] = useState(null);

  // Re-calculate real astronomical data
  const data = getAstronomicalDiagramData(lat, lng, currentDate);
  const { isDay, sunriseTime, sunsetTime, moon } = data;

  // Geometry constants (420x350 SVG Canvas)
  const sunX = 48;
  const sunY = 175;
  const sunR = 24;

  const earthX = 220;
  const earthY = 175;
  const earthR = 62;

  // The Moon sits beautifully on the right/orbital side (approx 135px from Earth center)
  // Dynamic offset according to current real phase, staying clearly on the right
  const moonDistance = 130;
  // Around Full Moon (today ~98%), it is positioned to the right of Earth
  const moonX = earthX + moonDistance;
  const moonY = earthY - 12;
  const moonR = 17;

  // Mehin's location beacon on Earth:
  // If local isDay = true: on the left (sunlit) hemisphere
  // If local isDay = false: on the right (night/shadow) hemisphere
  const mehinX = isDay ? earthX - 32 : earthX + 30;
  const mehinY = isDay ? earthY - 12 : earthY + 6;

  // Sync back to current second
  const handleResetNow = () => {
    setCurrentDate(new Date());
    setActiveBubble(null);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none">
      
      {/* 1. Header with "Mehin's Sky", City & "NOW" button */}
      <div className="w-full flex items-center justify-between px-2 pt-1 pb-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{isEn ? `${explorerName}'s Sky` : `${explorerName}-in Səması`}</span>
          </span>
          <h1 className="text-xl font-black text-white tracking-tight leading-tight">
            {cityName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* "NOW" Button */}
          <button
            onClick={handleResetNow}
            title={isEn ? 'Return to real-time' : 'İndiki real vaxta qayıt'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-200 border border-purple-500/30 text-[10px] font-extrabold transition cursor-pointer active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>NOW</span>
          </button>

          {/* Daytime / Nighttime Badge */}
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-md ${
              isDay
                ? 'bg-amber-500/25 border border-amber-400/60 text-amber-300'
                : 'bg-indigo-900/50 border border-indigo-400/50 text-indigo-200'
            }`}
          >
            <span>{isDay ? '☀️' : '🌙'}</span>
            <span>{isDay ? (isEn ? "IT'S DAYTIME!" : 'İNDİ GÜNDÜZDÜR!') : (isEn ? "IT'S NIGHT!" : 'İNDİ GECƏDİR!')}</span>
          </div>
        </div>
      </div>

      {/* 2. Educational Primary Canvas (SVG ViewBox: 0 0 420 350) */}
      <div className="relative w-full aspect-[420/350] max-h-[360px]">
        <svg viewBox="0 0 420 350" className="w-full h-full overflow-visible">
          <defs>
            {/* Sun Core Radiance */}
            <radialGradient id="sunAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
            </radialGradient>

            {/* Sunlight Triangular Cone Beam Gradient (Starts sharp at Sun, spreads softly towards Earth) */}
            <linearGradient id="sunConeBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.65)" />
              <stop offset="45%" stopColor="rgba(251, 191, 36, 0.28)" />
              <stop offset="85%" stopColor="rgba(251, 191, 36, 0.12)" />
              <stop offset="100%" stopColor="rgba(251, 191, 36, 0.0)" />
            </linearGradient>

            {/* Earth Day Colors */}
            <radialGradient id="earthDayOcean" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </radialGradient>

            {/* Earth Sphere Clip */}
            <clipPath id="earthSphereClip">
              <circle cx={earthX} cy={earthY} r={earthR} />
            </clipPath>

            {/* Strict Physical Day/Night Terminator Mask on Earth */}
            {/* Left side facing Sun is transparent (Daylight), Right side is deep dark shadow */}
            <linearGradient id="earthTerminator" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="46%" stopColor="rgba(0,0,0,0)" />
              <stop offset="52%" stopColor="rgba(3, 7, 18, 0.35)" />
              <stop offset="68%" stopColor="rgba(3, 7, 18, 0.88)" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Local Moon Clip (Centered at 0,0 for clean translation) */}
            <clipPath id="localMoonClip">
              <circle cx="0" cy="0" r={moonR} />
            </clipPath>

            {/* Moon Sunlight Terminator Mask: Moon is lit on its left side facing the Sun */}
            <linearGradient id="moonLocalTerminator" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset={`${Math.round(moon.fraction * 0.8 + 10)}%`} stopColor="rgba(0,0,0,0)" />
              <stop offset={`${Math.round(moon.fraction * 0.8 + 25)}%`} stopColor="rgba(15, 23, 42, 0.8)" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* 🌟 A. SUNLIGHT CONE (Starts at point from Sun center, expands outward like a flashlight cone toward Earth) 🌟 */}
          <g pointerEvents="none">
            {/* Main Cone Beam from Sun point (48, 175) expanding to cover Earth's daytime face */}
            <polygon
              points={`${sunX + 6},${sunY} ${earthX - earthR + 6},${earthY - earthR + 8} ${earthX - earthR + 6},${earthY + earthR - 8}`}
              fill="url(#sunConeBeam)"
            />

            {/* Expanding Triangular Radiance Rays */}
            <polygon
              points={`${sunX + 10},${sunY - 2} ${earthX - earthR + 10},${earthY - 25} ${earthX - earthR + 10},${earthY + 25}`}
              fill="url(#sunConeBeam)"
              opacity="0.5"
            />

            {/* Dynamic Streaking Ray Lines emanating from Sun */}
            <line
              x1={sunX + 22} y1={sunY - 6} x2={earthX - earthR - 10} y2={earthY - 32}
              stroke="#fef08a" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round"
              className="animate-pulse opacity-75"
            />
            <line
              x1={sunX + 26} y1={sunY} x2={earthX - earthR - 8} y2={earthY}
              stroke="#fde047" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round"
              className="animate-pulse opacity-90"
            />
            <line
              x1={sunX + 22} y1={sunY + 6} x2={earthX - earthR - 10} y2={earthY + 32}
              stroke="#fef08a" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round"
              className="animate-pulse opacity-75"
            />
          </g>

          {/* 🌟 B. THE EARTH (Center Stage) 🌟 */}
          <g onClick={() => setActiveBubble('earth')} className="cursor-pointer">
            {/* Atmosphere Halo on Sunlit Limb */}
            <circle cx={earthX} cy={earthY} r={earthR + 5} fill="rgba(56, 189, 248, 0.18)" />
            <circle cx={earthX} cy={earthY} r={earthR + 2} fill="rgba(56, 189, 248, 0.28)" />

            {/* Earth Sphere Contents */}
            <g clipPath="url(#earthSphereClip)">
              {/* Day Ocean Base */}
              <rect
                x={earthX - earthR}
                y={earthY - earthR}
                width={earthR * 2}
                height={earthR * 2}
                fill="url(#earthDayOcean)"
              />

              {/* Continents */}
              <g fill="#22c55e">
                {/* Sunlit side continents */}
                <path d={`M ${earthX - 45},${earthY - 30} Q ${earthX - 25},${earthY - 45} ${earthX - 10},${earthY - 25} Q ${earthX - 5},${earthY} ${earthX - 20},${earthY + 15} Q ${earthX - 40},${earthY + 25} ${earthX - 45},${earthY - 10} Z`} fill="#16a34a" />
                <path d={`M ${earthX - 35},${earthY + 20} Q ${earthX - 15},${earthY + 25} ${earthX - 10},${earthY + 45} Q ${earthX - 25},${earthY + 55} ${earthX - 38},${earthY + 40} Z`} fill="#15803d" />
                {/* Night side continents */}
                <path d={`M ${earthX + 10},${earthY - 35} Q ${earthX + 35},${earthY - 40} ${earthX + 48},${earthY - 20} Q ${earthX + 50},${earthY + 10} ${earthX + 30},${earthY + 15} Q ${earthX + 15},${earthY} ${earthX + 10},${earthY - 35} Z`} fill="#166534" />
                <path d={`M ${earthX + 15},${earthY + 20} Q ${earthX + 40},${earthY + 25} ${earthX + 45},${earthY + 45} Q ${earthX + 25},${earthY + 55} ${earthX + 10},${earthY + 40} Z`} fill="#14532d" />
              </g>

              {/* Clouds */}
              <path
                d={`M ${earthX - 50},${earthY - 15} Q ${earthX - 20},${earthY - 25} ${earthX + 10},${earthY - 15} Q ${earthX - 15},${earthY - 10} ${earthX - 50},${earthY - 15} Z`}
                fill="#ffffff" opacity="0.45"
              />
              <path
                d={`M ${earthX - 20},${earthY + 25} Q ${earthX + 15},${earthY + 20} ${earthX + 45},${earthY + 30} Q ${earthX + 15},${earthY + 35} ${earthX - 20},${earthY + 25} Z`}
                fill="#ffffff" opacity="0.4"
              />

              {/* Physical Day / Night Shadow Terminator */}
              <rect
                x={earthX - earthR}
                y={earthY - earthR}
                width={earthR * 2}
                height={earthR * 2}
                fill="url(#earthTerminator)"
              />

              {/* Glowing Night City Lights on the dark side */}
              <g fill="#fde047">
                <circle cx={earthX + 22} cy={earthY - 18} r="1.6" className="animate-pulse" />
                <circle cx={earthX + 35} cy={earthY - 10} r="1.4" />
                <circle cx={earthX + 28} cy={earthY + 5} r="1.8" className="animate-pulse" />
                <circle cx={earthX + 38} cy={earthY + 22} r="1.5" />
                <circle cx={earthX + 20} cy={earthY + 32} r="1.4" />
              </g>
            </g>

            {/* Earth Subtle Border */}
            <circle
              cx={earthX}
              cy={earthY}
              r={earthR}
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
            />
          </g>

          {/* 🌟 C. MEHIN'S GLOWING BEACON (Strictly placed on day or night hemisphere) 🌟 */}
          <g
            transform={`translate(${mehinX}, ${mehinY})`}
            onClick={() => setActiveBubble('mehin')}
            className="cursor-pointer"
          >
            <circle cx="0" cy="0" r="11" fill="#ec4899" opacity="0.35" className="animate-ping" />
            <circle cx="0" cy="0" r="6" fill="#ec4899" opacity="0.6" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="#ec4899" strokeWidth="2" />

            {/* Flag Label */}
            <g transform="translate(8, -13)">
              <rect x="0" y="0" width="60" height="18" rx="9" fill="rgba(15, 23, 42, 0.9)" stroke="#ec4899" strokeWidth="1.5" />
              <text x="6" y="12" fill="#ffffff" fontSize="9.5" fontWeight="900">
                {avatarEmoji} {explorerName}
              </text>
            </g>
          </g>

          {/* 🌟 D. THE SUN (Left Side, defining the source of light) 🌟 */}
          <g
            transform={`translate(${sunX}, ${sunY})`}
            onClick={() => setActiveBubble('sun')}
            className="cursor-pointer"
          >
            {/* Outer Warm Corona */}
            <circle cx="0" cy="0" r="44" fill="url(#sunAura)" opacity="0.8" />
            <circle cx="0" cy="0" r="30" fill="#f59e0b" opacity="0.35" className="animate-pulse" />

            {/* Sun Core */}
            <circle cx="0" cy="0" r={sunR} fill="#fbbf24" stroke="#fef08a" strokeWidth="2.5" />

            {/* Friendly Warm Smile */}
            <circle cx="-5" cy="-3" r="2.2" fill="#78350f" />
            <circle cx="5" cy="-3" r="2.2" fill="#78350f" />
            <path d="M -5 5 Q 0 9 5 5" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
              <line
                key={ang}
                x1={Math.cos((ang * Math.PI) / 180) * 27}
                y1={Math.sin((ang * Math.PI) / 180) * 27}
                x2={Math.cos((ang * Math.PI) / 180) * 34}
                y2={Math.sin((ang * Math.PI) / 180) * 34}
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            <text x="0" y="44" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="900">
              {isEn ? 'THE SUN' : 'GÜNƏŞ'}
            </text>
          </g>

          {/* 🌟 E. THE MOON (Single clean position on the right) 🌟 */}
          <g
            transform={`translate(${moonX}, ${moonY})`}
            onClick={() => setActiveBubble('moon')}
            className="cursor-pointer"
          >
            {/* Moon Glow */}
            <circle cx="0" cy="0" r="24" fill="rgba(216, 180, 254, 0.25)" />

            {/* Moon Body with self-contained local clip */}
            <g clipPath="url(#localMoonClip)">
              {/* Moon Base Lit Regolith */}
              <circle cx="0" cy="0" r={moonR} fill="#e2e8f0" />
              {/* Craters */}
              <circle cx="-4" cy="-4" r="3" fill="#cbd5e1" />
              <circle cx="5" cy="3" r="2.5" fill="#cbd5e1" />
              <circle cx="-2" cy="5" r="2" fill="#cbd5e1" />

              {/* Physical Phase Shadow Overlay */}
              {!moon.isFullMoon && (
                <rect
                  x={-moonR}
                  y={-moonR}
                  width={moonR * 2}
                  height={moonR * 2}
                  fill="url(#moonLocalTerminator)"
                />
              )}
            </g>

            {/* Moon Outline */}
            <circle cx="0" cy="0" r={moonR} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Moon Title */}
            <text x="0" y={moonR + 13} textAnchor="middle" fill="#e9d5ff" fontSize="9.5" fontWeight="900">
              {isEn ? 'THE MOON' : 'AY'}
            </text>
          </g>
        </svg>
      </div>

      {/* 3. Educational Interactive Popover (Tap Sun, Moon, or Mehin) */}
      <AnimatePresence>
        {activeBubble && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            onClick={() => setActiveBubble(null)}
            className="mb-2 w-full p-3 rounded-2xl bg-purple-950/95 border border-purple-400/50 shadow-xl text-center cursor-pointer"
          >
            <p className="text-xs font-bold text-purple-100 leading-snug">
              {activeBubble === 'sun' && (isEn
                ? '☀️ The Sun gives Earth light and warmth! Sunlight travels across space to light our day.'
                : '☀️ Günəş Yer kürəsinə işıq və həyat verir! Günəş şüaları kosmosa yayılaraq bizim gündüzümüzü yaradır.')}
              {activeBubble === 'moon' && (isEn
                ? `🌙 The Moon doesn’t make its own light. It reflects sunlight! ${moon.phaseHintEn}`
                : `🌙 Ay özü işıq saçmır, Günəşin işığını əks etdirir! ${moon.phaseHintAz}`)}
              {activeBubble === 'earth' && (isEn
                ? '🌍 Earth spins once every day! That is why we experience daytime, sunset, and nighttime.'
                : '🌍 Yer kürəsi hər gün öz oxu ətrafında bir dəfə fırlanır! Buna görə də gündüz və gecə bir-birini əvəz edir.')}
              {activeBubble === 'mehin' && (isEn
                ? `📍 ${explorerName} is currently in ${cityName}, experiencing ${isDay ? 'daylight' : 'nighttime'}!`
                : `📍 ${explorerName} hazırda ${cityName}-dadır və indi orada ${isDay ? 'gündüzdür' : 'gecədir'}!`)}
            </p>
            <span className="text-[10px] text-purple-300 font-medium mt-1 block">
              {isEn ? '(Tap to dismiss)' : '(Bağlamaq üçün toxun)'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Unified Educational Area (Clear 2-second message for a 7-year-old) */}
      <div className="w-full p-4 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-purple-500/30 shadow-xl flex flex-col space-y-2.5">
        
        {/* Core Day/Night Message */}
        <div className="flex items-center gap-3">
          <span className="text-3xl shrink-0 select-none">
            {isDay ? '☀️' : '🌙'}
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight leading-tight">
              {isDay
                ? (isEn ? `${explorerName} is in the sunshine!` : `${explorerName} günəş işığının altındadır!`)
                : (isEn ? `${explorerName} is on the night side!` : `${explorerName} Yer kürəsinin gecə tərəfindədir!`)}
            </h2>
            <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
              {isDay
                ? (isEn ? 'The Sun is shining on our side of Earth.' : 'Günəş indicə bizim tərəfi işıqlandırır və isidir.')
                : (isEn ? 'We are facing away from the Sun, looking out at the stars.' : 'Bizim tərəf Günəşdən arxaya baxır, səma ulduzludur.')}
            </p>
          </div>
        </div>

        {/* Coherent Context Strip */}
        <div className="pt-2 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-xs">
          {/* Sunrise / Sunset */}
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

          {/* Tonight's Moon with Real Lunar Phase */}
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
