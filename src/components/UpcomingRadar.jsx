import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import eventsData from '../data/events.json';

export default function UpcomingRadar() {
  const { language, activeThemeObj, explorerName } = useApp();
  const isEn = language === 'en';

  const today = new Date();

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
    .filter(event => event.daysLeft >= 0 && event.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const formatDaysBadge = (days) => {
    if (days === 0) return isEn ? '🎉 Today!' : '🎉 Bu gün!';
    if (days === 1) return isEn ? '⏳ Tomorrow!' : '⏳ Sabah!';
    return isEn ? `⏳ In ${days} days` : `⏳ ${days} gün qaldı`;
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 py-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl transition-colors duration-500`}
      >
        {/* Responsive Header: iPhone-friendly without text breaking */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0 select-none">📅</span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1 truncate">
                <span>{isEn ? 'Next 7 Days' : 'Növbəti 7 Gün'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              </h2>
              <p className="text-[11px] text-purple-200/80 font-medium truncate">
                {isEn ? `This week for ${explorerName}` : `${explorerName} üçün bu həftə`}
              </p>
            </div>
          </div>

          {/* Badge with whitespace-nowrap so numbers and words NEVER stack awkwardly */}
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/40 shrink-0 whitespace-nowrap">
            {upcomingEvents.length} {isEn ? 'wonders' : 'hadisə'}
          </span>
        </div>

        {/* All events in ONE clean list (No missions, clean text & big emoji) */}
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-xs sm:text-sm text-purple-200 font-medium">
            {isEn ? 'The cosmos is quiet this week! Check back soon! 🚀' : 'Bu həftə göy üzü dincəlir! Tezliklə yeni hadisələr gələcək! 🚀'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/70 hover:border-pink-500/50 transition-all shadow-sm"
              >
                {/* Top Badge & Location */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                    event.daysLeft <= 2
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                      : 'bg-purple-500/30 text-purple-200 border border-purple-500/40'
                  }`}>
                    {formatDaysBadge(event.daysLeft)}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 truncate">
                    📍 {isEn ? event.country_en : event.country_az}
                  </span>
                </div>

                {/* Event Heading & Story */}
                <div className="flex items-start gap-2.5">
                  <span className="text-3xl p-1.5 rounded-xl bg-slate-800/90 border border-slate-700 shrink-0 select-none">
                    {event.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                      {isEn ? event.title_en : event.title_az}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-100/90 font-medium mt-1 leading-relaxed">
                      {isEn ? event.story_en : event.story_az}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </section>
  );
}
