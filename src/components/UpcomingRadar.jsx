import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import eventsData from '../data/events.json';

export default function UpcomingRadar() {
  const { language, activeThemeObj } = useApp();
  const isEn = language === 'en';
  const [selectedFilter, setSelectedFilter] = useState('all');

  const today = new Date();

  // Calculate day difference for an event in current year
  const getEventDaysLeft = (eventMonth, eventDay) => {
    let eventDate = new Date(today.getFullYear(), eventMonth - 1, eventDay);
    // If date has passed this year, look at next year
    if (eventDate < today && Math.abs(eventDate - today) > 24 * 60 * 60 * 1000) {
      eventDate.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Strictly filter events within the NEXT 30 DAYS (Maximum 1 month)
  const upcomingEvents = eventsData
    .map(event => ({
      ...event,
      daysLeft: getEventDaysLeft(event.month, event.day),
    }))
    .filter(event => event.daysLeft >= 0 && event.daysLeft <= 30) // Maximum 1 month ahead
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .filter(event => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'cosmic') return event.category === 'cosmic';
      if (selectedFilter === 'festival') return event.category === 'festival';
      if (selectedFilter === 'culture') return event.category === 'culture' || event.category === 'family';
      return true;
    });

  const formatDaysBadge = (days) => {
    if (days === 0) return isEn ? '🎉 Today!' : '🎉 Bu gün!';
    if (days === 1) return isEn ? '⏳ Tomorrow!' : '⏳ Sabah!';
    return isEn ? `⏳ In ${days} days` : `⏳ ${days} gün qaldı`;
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-2">
      <div className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl transition-colors duration-500`}>
        
        {/* Header and Filter Pills */}
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-1.5">
                  <span>{isEn ? 'Wonder Radar (Next 30 Days)' : 'Möcüzə Radarı (Növbəti 1 Ay)'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h2>
                <p className="text-[11px] text-slate-400">
                  {isEn ? 'Upcoming wonders within the next 30 days' : 'Növbəti 30 gün ərzində baş verəcək hadisələr'}
                </p>
              </div>
            </div>
            
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 shrink-0">
              {upcomingEvents.length} {isEn ? 'events' : 'hadisə'}
            </span>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-semibold overflow-x-auto">
            {[
              { id: 'all', label_en: 'All', label_az: 'Hamısı' },
              { id: 'cosmic', label_en: '🚀 Space', label_az: '🚀 Kosmos' },
              { id: 'festival', label_en: '🎭 Festivals', label_az: '🎭 Festivallar' },
              { id: 'culture', label_en: '🌸 Family', label_az: '🌸 Ailə & Adət' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer shrink-0 ${
                  selectedFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isEn ? tab.label_en : tab.label_az}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Cards List (Mobile-Optimized) */}
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            {isEn ? 'No events in this category within the next 30 days! 🚀' : 'Növbəti 30 gün ərzində bu kateqoriyada hadisə yoxdur! 🚀'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top countdown pill & Country */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      event.daysLeft <= 3
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {formatDaysBadge(event.daysLeft)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">
                      {isEn ? event.country_en : event.country_az}
                    </span>
                  </div>

                  {/* Title and Emoji */}
                  <div className="flex items-start gap-2">
                    <span className="text-xl p-1 rounded-xl bg-slate-800/80 border border-slate-700/50 shrink-0">
                      {event.emoji}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                        {isEn ? event.title_en : event.title_az}
                      </h3>
                      <p className="text-[11px] text-slate-300/80 mt-0.5 line-clamp-2 leading-relaxed">
                        {isEn ? event.story_en : event.story_az}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini Mission Hint */}
                <div className="mt-2 pt-1.5 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-purple-300 font-medium">
                  <span className="shrink-0">🎯 {isEn ? 'Mission:' : 'Tapşırıq:'}</span>
                  <span className="text-slate-400 truncate max-w-[170px]">
                    {isEn ? event.mission_en.replace('Explorer Mission: ', '') : event.mission_az.replace('Kəşfiyyatçı Tapşırığı: ', '')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
