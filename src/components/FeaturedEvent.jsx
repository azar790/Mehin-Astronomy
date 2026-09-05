import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle, PartyPopper } from 'lucide-react';
import { useApp } from '../context/AppContext';
import eventsData from '../data/events.json';

export default function FeaturedEvent() {
  const { explorerName, language, activeThemeObj } = useApp();
  const isEn = language === 'en';
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isMissionDone, setIsMissionDone] = useState(false);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let featured = eventsData.find(e => e.month === currentMonth && e.day === currentDay);
  if (!featured) {
    featured = eventsData.find(e => 
      e.month > currentMonth || (e.month === currentMonth && e.day >= currentDay)
    ) || eventsData[0];
  }

  const triggerConfetti = () => {
    setHasCelebrated(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#eab308', '#06b6d4', '#10b981'],
    });
    setTimeout(() => setHasCelebrated(false), 2500);
  };

  const toggleMission = () => {
    setIsMissionDone(prev => !prev);
    if (!isMissionDone) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={`p-5 sm:p-6 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-2xl transition-colors duration-500 relative overflow-hidden`}
      >
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEn ? "Today's Wonder" : 'Günün Möcüzəsi'}</span>
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs sm:text-sm font-black shadow-lg cursor-pointer shrink-0"
          >
            <PartyPopper className={`w-4 h-4 ${hasCelebrated ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Celebrate! 🎉' : 'Qeyd Et! 🎉'}</span>
          </motion.button>
        </div>

        {/* Title & Emoji (Big, Friendly Font for Kids) */}
        <div className="flex items-start gap-3.5 my-2">
          <motion.div
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shrink-0 border border-white/20 select-none"
          >
            {featured.emoji}
          </motion.div>

          <div className="flex-1">
            <div className="text-xs font-bold text-slate-300 mb-0.5">
              📍 {isEn ? featured.country_en : featured.country_az}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {isEn ? featured.title_en : featured.title_az}
            </h2>
            {/* Story text with large, clear font */}
            <p className="text-sm sm:text-base text-purple-100 font-medium leading-relaxed mt-1.5">
              {isEn ? featured.story_en : featured.story_az}
            </p>
          </div>
        </div>

        {/* Mission Box & Fun Fact */}
        <div className="space-y-3 mt-4 pt-3 border-t border-purple-500/20">
          
          {/* Mission Box */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isMissionDone
              ? 'bg-emerald-950/50 border-emerald-500/50 shadow-emerald-950/50'
              : 'bg-purple-950/40 border-purple-500/40'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <span>🎯</span>
                <span>{isEn ? `Mission for ${explorerName}` : `${explorerName} üçün Tapşırıq`}</span>
              </span>
              <button
                onClick={toggleMission}
                className={`text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
                  isMissionDone
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-purple-900/90 text-purple-200 hover:bg-purple-800 border border-purple-400/40'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isMissionDone ? (isEn ? 'Completed! 🌟' : 'Edildi! 🌟') : (isEn ? 'Mark Done' : 'Tamamla')}</span>
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              {isEn ? featured.mission_en : featured.mission_az}
            </p>
          </div>

          {/* Did You Know */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-700/80 flex items-start gap-2.5">
            <span className="text-xl shrink-0 select-none">💡</span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {isEn ? featured.fun_fact_en : featured.fun_fact_az}
            </p>
          </div>

        </div>

      </motion.div>
    </section>
  );
}
