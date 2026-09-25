import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Moon, Compass, ExternalLink, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getNightSkyPlanetsData } from '../utils/astronomyDiagram';

export default function NightSkyPlanets() {
  const { city, language, activeThemeObj, explorerName } = useApp();
  const isEn = language === 'en';

  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const skyData = getNightSkyPlanetsData(city.lat, city.lng, new Date());
  const { sunriseTime, sunsetTime, dayLengthHours, dayLengthMinutes, diffMinutes, planets } = skyData;

  const diffText = diffMinutes < 0
    ? (isEn ? `${Math.abs(diffMinutes)}m shorter than yesterday 🍂` : `Dünəndən ${Math.abs(diffMinutes)} dəq qısa 🍂`)
    : (isEn ? `${diffMinutes}m longer than yesterday 🌱` : `Dünəndən ${diffMinutes} dəq uzun 🌱`);

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 py-1.5">
      <div className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl border border-cyan-500/25 transition-colors duration-500`}>
        
        {/* Header & Source Attribution to TimeAndDate.com */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0 select-none">🪐</span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5 truncate">
                <span>{isEn ? "Tonight's Sky & Planets" : 'Bu Gecə Səma & Planetlər'}</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              </h2>
              <p className="text-[11px] text-cyan-200/80 font-medium truncate">
                {isEn ? `Planets visible from ${city.name}` : `${city.name_az || city.name} səmasında görünən planetlər`}
              </p>
            </div>
          </div>

          {/* TimeAndDate.com Badge with Live Link */}
          <a
            href="https://www.timeanddate.com/astronomy/"
            target="_blank"
            rel="noopener noreferrer"
            title={isEn ? "Open TimeAndDate Astronomy" : "TimeAndDate.com Astronomiya Mərkəzi"}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-400/40 text-[10px] font-black text-cyan-200 transition cursor-pointer shrink-0 shadow-sm"
          >
            <span>TimeAndDate</span>
            <ExternalLink className="w-2.5 h-2.5 text-cyan-300" />
          </a>
        </div>

        {/* Daylight Duration & Sun Times (Classic TimeAndDate Feature) */}
        <div className="p-2.5 rounded-2xl bg-slate-900/85 border border-slate-700/80 mb-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-300 font-bold">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{sunriseTime}</span>
            </div>
            <div className="flex items-center gap-1 text-rose-300 font-bold">
              <Moon className="w-3.5 h-3.5 text-rose-400" />
              <span>{sunsetTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
            <span>⏳ {isEn ? 'Daylight:' : 'Gündüz:'}</span>
            <span className="text-white font-black">{dayLengthHours}h {dayLengthMinutes}m</span>
            <span className="text-purple-300 text-[10px] font-medium">({diffText})</span>
          </div>
        </div>

        {/* Visible Planets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {planets.map((planet) => (
            <motion.button
              key={planet.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPlanet(planet)}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400/50 transition flex flex-col items-center text-center cursor-pointer group shadow-sm"
            >
              <span className="text-3xl my-1 group-hover:scale-110 transition-transform select-none">
                {planet.emoji}
              </span>

              <h4 className="text-xs font-black text-white leading-tight">
                {isEn ? planet.name_en : planet.name_az}
              </h4>

              <span className="text-[10px] font-bold text-cyan-300 mt-0.5 truncate w-full">
                {isEn ? planet.subtitle_en : planet.subtitle_az}
              </span>

              <span className="mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-400/25 truncate max-w-full">
                {isEn ? planet.visibility_en : planet.visibility_az}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Footnote / Link to Interactive Sky Map */}
        <div className="mt-3 pt-2 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-purple-200/80">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-cyan-300" />
            <span>{isEn ? "Tap any planet for viewing tips!" : "Baxış üçün planetə toxunun"}</span>
          </span>
          <a
            href="https://www.timeanddate.com/astronomy/night/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 hover:text-cyan-100 font-bold underline flex items-center gap-0.5"
          >
            <span>{isEn ? 'Interactive Map' : 'Canlı Səma Xəritəsi'}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Selected Planet Educational Popover */}
        <AnimatePresence>
          {selectedPlanet && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="mt-3 p-3.5 rounded-2xl bg-indigo-950/95 border-2 border-cyan-400/50 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-3 right-3 p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-3xl select-none">{selectedPlanet.emoji}</span>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {isEn ? selectedPlanet.name_en : selectedPlanet.name_az} — {isEn ? selectedPlanet.subtitle_en : selectedPlanet.subtitle_az}
                  </h3>
                  <span className="text-[10px] font-bold text-cyan-300">
                    {isEn ? selectedPlanet.visibility_en : selectedPlanet.visibility_az}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold my-2 text-slate-300">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-400 block mb-0.5">🧭 {isEn ? 'Direction:' : 'İstiqamət:'}</span>
                  <span className="text-white font-extrabold">{isEn ? selectedPlanet.direction_en : selectedPlanet.direction_az}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-400 block mb-0.5">⏰ {isEn ? 'Best Viewing Time:' : 'Ən Yaxşı Vaxt:'}</span>
                  <span className="text-white font-extrabold">{isEn ? selectedPlanet.bestTime_en : selectedPlanet.bestTime_az}</span>
                </div>
              </div>

              <p className="text-xs text-purple-100 font-medium leading-relaxed mt-2 bg-purple-900/40 p-2.5 rounded-xl border border-purple-500/25">
                💡 <strong className="text-amber-300">{isEn ? `${explorerName}'s Observation Tip:` : `${explorerName} üçün Baxış İpucu:`}</strong>{' '}
                {isEn ? selectedPlanet.tip_en : selectedPlanet.tip_az}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
