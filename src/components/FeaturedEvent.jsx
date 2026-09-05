import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, PartyPopper } from 'lucide-react';
import { useApp } from '../context/AppContext';
import eventsData from '../data/events.json';

export default function FeaturedEvent() {
  const { explorerName, language, activeThemeObj } = useApp();
  const isEn = language === 'en';
  const [hasCelebrated, setHasCelebrated] = useState(false);

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

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 py-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-2xl transition-colors duration-500 relative overflow-hidden`}
      >
        {/* Top Badges (whitespace-nowrap ensures no ugly wrapping on iPhone) */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 shrink-0 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span>{isEn ? "Today's Wonder" : 'Günün Möcüzəsi'}</span>
          </span>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black shadow-md cursor-pointer shrink-0 whitespace-nowrap"
          >
            <PartyPopper className={`w-3.5 h-3.5 ${hasCelebrated ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Celebrate! 🎉' : 'Qeyd Et! 🎉'}</span>
          </motion.button>
        </div>

        {/* Title & Emoji */}
        <div className="flex items-start gap-3 my-1">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shrink-0 border border-white/20 select-none"
          >
            {featured.emoji}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-slate-300 mb-0.5 truncate">
              📍 {isEn ? featured.country_en : featured.country_az}
            </div>
            <h2 className="text-base sm:text-lg font-black text-white leading-snug">
              {isEn ? featured.title_en : featured.title_az}
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed mt-1">
              {isEn ? featured.story_en : featured.story_az}
            </p>
          </div>
        </div>

        {/* Did You Know Box (Clean, readable, no mission box) */}
        <div className="mt-3.5 pt-2.5 border-t border-purple-500/20">
          <div className="p-3 rounded-2xl bg-slate-900/75 border border-slate-800 flex items-start gap-2.5">
            <span className="text-lg shrink-0 select-none">💡</span>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-black text-pink-400 block">
                {isEn ? 'Did You Know?' : 'Bunu Bilirdinmi?'}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mt-0.5">
                {isEn ? featured.fun_fact_en : featured.fun_fact_az}
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
