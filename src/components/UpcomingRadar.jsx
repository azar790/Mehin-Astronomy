import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import eventsData from '../data/events.json';

export default function UpcomingRadar() {
  const { language, activeThemeObj, explorerName } = useApp();
  const isEn = language === 'en';

  const today = new Date();

  // Calculate day difference for an event
  const getEventDaysLeft = (eventMonth, eventDay) => {
    let eventDate = new Date(today.getFullYear(), eventMonth - 1, eventDay);
    if (eventDate < today && Math.abs(eventDate - today) > 24 * 60 * 60 * 1000) {
      eventDate.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Strictly filter events within the NEXT 7 DAYS
  const upcomingEvents = eventsData
    .map(event => ({
      ...event,
      daysLeft: getEventDaysLeft(event.month, event.day),
    }))
    .filter(event => event.daysLeft >= 0 && event.daysLeft <= 7) // Strictly 7 days!
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const formatDaysBadge = (days) => {
    if (days === 0) return isEn ? '🎉 Today!' : '🎉 Bu gün!';
    if (days === 1) return isEn ? '⏳ Tomorrow!' : '⏳ Sabah!';
    return isEn ? `⏳ In ${days} days` : `⏳ ${days} gün qaldı`;
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-2">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`p-4 sm:p-6 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl transition-colors duration-500`}
      >
        {/* Title without tabs */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">📅</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-1.5">
                <span>{isEn ? 'Next 7 Days Radar' : 'Növbəti 7 Günün Radarı'}</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 font-medium">
                {isEn ? `Exciting wonders coming this week for ${explorerName}!` : `${explorerName} üçün bu həftə baş verəcək möcüzələr!`}
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
            {upcomingEvents.length} {isEn ? 'upcoming' : 'hadisə'}
          </span>
        </div>

        {/* All events in ONE continuous feed (No tabs, no paging!) */}
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-sm text-purple-200 font-medium">
            {isEn ? 'The cosmos is resting this week! Check back soon! 🚀' : 'Bu həftə göy üzü dincəlir! Tezliklə yeni hadisələr gələcək! 🚀'}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/70 hover:border-pink-500/50 transition-all shadow-md"
              >
                {/* Countdown & Country Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    event.daysLeft <= 2
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                      : 'bg-purple-500/30 text-purple-200 border border-purple-500/40'
                  }`}>
                    {formatDaysBadge(event.daysLeft)}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    📍 {isEn ? event.country_en : event.country_az}
                  </span>
                </div>

                {/* Event Heading with BIG EMOJI & BIG FONT */}
                <div className="flex items-start gap-3 my-1">
                  <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-slate-800/90 border border-slate-700 shrink-0 select-none">
                    {event.emoji}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                      {isEn ? event.title_en : event.title_az}
                    </h3>
                    {/* Readable, larger story text for 7-year-old */}
                    <p className="text-xs sm:text-sm text-purple-100/90 font-medium mt-1 leading-relaxed">
                      {isEn ? event.story_en : event.story_az}
                    </p>
                  </div>
                </div>

                {/* Clear, Fun Mission */}
                <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex items-center gap-2">
                  <span className="text-xs font-black text-amber-300 shrink-0">🎯 {isEn ? 'Mission:' : 'Tapşırıq:'}</span>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    {isEn ? event.mission_en.replace('Mission: ', '') : event.mission_az.replace('Tapşırıq: ', '')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </section>
  );
}
