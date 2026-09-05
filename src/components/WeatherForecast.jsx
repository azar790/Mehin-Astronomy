import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Thermometer, Sparkles, X, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWeatherInfo, getWindDescription } from '../utils/weather';

export default function WeatherForecast() {
  const { city, language, activeThemeObj } = useApp();
  const isEn = language === 'en';

  const [weatherData, setWeatherData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.daily) {
          setWeatherData(data);
        }
      } catch (err) {
        console.warn('Weather fetch failed:', err);
      }
    }

    fetchWeather();
    return () => { isMounted = false; };
  }, [city.lat, city.lng]);

  const currentTemp = weatherData?.current?.temperature_2m ?? 24;
  const currentCode = weatherData?.current?.weather_code ?? 0;
  const currentWind = weatherData?.current?.wind_speed_10m ?? 12;
  const currentInfo = getWeatherInfo(currentCode, isEn);

  // Exactly 5 DAYS to fit 100% inside mobile screen without horizontal scroll!
  const dailyDays = (weatherData?.daily?.time || [
    '2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08', '2026-09-09'
  ]).slice(0, 5);

  const dailyCodes = (weatherData?.daily?.weather_code || [0, 1, 2, 61, 0]).slice(0, 5);
  const dailyMax = (weatherData?.daily?.temperature_2m_max || [28, 27, 26, 24, 25]).slice(0, 5);
  const dailyMin = (weatherData?.daily?.temperature_2m_min || [19, 18, 17, 16, 17]).slice(0, 5);
  const dailyRain = (weatherData?.daily?.precipitation_probability_max || [0, 10, 20, 70, 10]).slice(0, 5);
  const dailyWind = (weatherData?.daily?.wind_speed_10m_max || [14, 18, 22, 28, 16]).slice(0, 5);

  const formatDayName = (dateStr, index) => {
    if (index === 0) return isEn ? 'Today' : 'Bu gün';
    const d = new Date(dateStr);
    return d.toLocaleDateString(isEn ? 'en-US' : 'az-AZ', { weekday: 'short' });
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 py-1.5">
      <div className={`p-3.5 sm:p-4 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-lg transition-colors duration-500`}>
        
        {/* Header & City */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-purple-500/20">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base shrink-0">🌤️</span>
            <h2 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
              {isEn ? '5-Day Weather Forecast' : '5 Günlük Hava Proqnozu'}
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 shrink-0 whitespace-nowrap">
            📍 {isEn ? city.name : (city.name_az || city.name)}
          </span>
        </div>

        {/* Compact Summary for Today */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 mb-2.5 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl sm:text-3xl shrink-0 select-none animate-pulse">
              {currentInfo.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {Math.round(currentTemp)}°C
                </span>
                <span className="text-xs font-bold text-purple-300 truncate">
                  {currentInfo.name}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Wind & Rain badges */}
          <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold">
            <span className="px-2 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 flex items-center gap-1 whitespace-nowrap">
              <Wind className="w-3 h-3 text-cyan-400" />
              <span>{Math.round(currentWind)} km/s</span>
            </span>
            <span className="px-2 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 flex items-center gap-1 whitespace-nowrap">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span>{dailyRain[0]}%</span>
            </span>
          </div>
        </div>

        {/* 5-DAY CAPSULES: GRID OF 5 (FITS 100% INSIDE MOBILE SCREEN, ZERO HORIZONTAL SCROLL!) */}
        <div className="grid grid-cols-5 gap-1.5 w-full">
          {dailyDays.map((dStr, idx) => {
            const info = getWeatherInfo(dailyCodes[idx], isEn);
            const isToday = idx === 0;
            return (
              <motion.button
                key={dStr}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedDay({
                  dateStr: dStr,
                  dayName: formatDayName(dStr, idx),
                  info,
                  max: Math.round(dailyMax[idx]),
                  min: Math.round(dailyMin[idx]),
                  rain: dailyRain[idx],
                  wind: Math.round(dailyWind[idx]),
                  windInfo: getWindDescription(dailyWind[idx], isEn),
                  isToday,
                })}
                className={`flex flex-col items-center justify-between py-2 px-1 rounded-2xl border transition-all cursor-pointer text-center w-full ${
                  isToday
                    ? 'bg-purple-600/35 border-purple-400 shadow-md ring-1 ring-purple-400/40'
                    : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Day name */}
                <span className={`text-[10px] font-black uppercase tracking-tight truncate w-full ${
                  isToday ? 'text-amber-300' : 'text-slate-400'
                }`}>
                  {formatDayName(dStr, idx)}
                </span>

                {/* Weather emoji */}
                <span className="text-lg my-0.5 select-none">
                  {info.icon}
                </span>

                {/* High / Low Temp */}
                <div className="text-[11px] font-black text-white leading-tight">
                  {Math.round(dailyMax[idx])}°
                </div>
                <div className="text-[9px] font-bold text-slate-400">
                  {Math.round(dailyMin[idx])}°
                </div>

                {/* Rain or Wind tag */}
                {dailyRain[idx] > 0 ? (
                  <span className="mt-1 text-[8px] font-black px-1 py-0.2 rounded-full bg-blue-500/25 text-cyan-200 border border-blue-400/30 whitespace-nowrap">
                    💧{dailyRain[idx]}%
                  </span>
                ) : (
                  <span className="mt-1 text-[8px] font-semibold text-slate-500 whitespace-nowrap">
                    💨{Math.round(dailyWind[idx])}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Interactive Detail Modal when any day is tapped */}
        <AnimatePresence>
          {selectedDay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDay(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                className="relative z-10 w-full max-w-sm rounded-3xl p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl text-white"
              >
                <button
                  onClick={() => setSelectedDay(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl select-none">{selectedDay.info.icon}</span>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {selectedDay.dayName} ({selectedDay.dateStr})
                    </h3>
                    <p className="text-xs text-purple-300 font-bold">
                      {selectedDay.info.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      <span>{isEn ? 'Temperature' : 'Temperatur'}</span>
                    </span>
                    <p className="text-sm font-black text-white mt-1">
                      {selectedDay.max}°C / {selectedDay.min}°C
                    </p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-400" />
                      <span>{isEn ? 'Rain / Snow' : 'Yağış / Qar'}</span>
                    </span>
                    <p className="text-sm font-black text-cyan-300 mt-1">
                      {selectedDay.rain}% {isEn ? 'chance' : 'ehtimal'}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-indigo-300 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isEn ? 'Wind Speed' : 'Küləyin Sürəti'}</span>
                    </span>
                    <span className="font-black text-white">
                      {selectedDay.wind} km/s
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 font-semibold">
                    {selectedDay.windInfo.label} — {selectedDay.windInfo.tip}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-[11px] text-purple-200 font-medium flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{selectedDay.info.tip}</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
