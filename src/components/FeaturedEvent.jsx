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

  // Look for exact match or nearest upcoming
  let featured = eventsData.find(e => e.month === currentMonth && e.day === currentDay);
  if (!featured) {
    featured = eventsData.find(e => 
      e.month > currentMonth || (e.month === currentMonth && e.day >= currentDay)
    ) || eventsData[0];
  }

  const triggerConfetti = () => {
    setHasCelebrated(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#eab308', '#06b6d4', '#10b981'],
    });
    setTimeout(() => setHasCelebrated(false), 2500);
  };

  const toggleMission = () => {
    setIsMissionDone(prev => !prev);
    if (!isMissionDone) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-1">
      <div className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl transition-colors duration-500 relative overflow-hidden`}>
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isEn ? "Today's Wonder" : 'Günün Möcüzəsi'}</span>
            </span>
            <span className="text-[10px] font-bold text-slate-300 truncate">
              📍 {isEn ? featured.country_en : featured.country_az}
            </span>
          </div>

          {/* Celebrate Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md cursor-pointer shrink-0"
          >
            <PartyPopper className={`w-3.5 h-3.5 ${hasCelebrated ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Celebrate! 🎉' : 'Qeyd Et! 🎉'}</span>
          </motion.button>
        </div>

        {/* Title & Emoji */}
        <div className="flex items-start gap-3 my-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-md shrink-0 border border-white/20">
            {featured.emoji}
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              {isEn ? featured.title_en : featured.title_az}
            </h2>
            <p className="text-xs text-purple-100/90 leading-relaxed mt-1">
              {isEn ? featured.story_en : featured.story_az}
            </p>
          </div>
        </div>

        {/* Mission & Did you know */}
        <div className="space-y-2 mt-3 pt-3 border-t border-purple-500/20">
          
          {/* Mission */}
          <div className={`p-3 rounded-2xl border transition-all ${
            isMissionDone
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : 'bg-purple-950/40 border-purple-500/30'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <span>🎯</span>
                <span>{isEn ? `Mission for ${explorerName}` : `${explorerName} üçün Tapşırıq`}</span>
              </span>
              <button
                onClick={toggleMission}
                className={`text-[10px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                  isMissionDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-purple-900 text-purple-200 border border-purple-400/30'
                }`}
              >
                <CheckCircle className="w-3 h-3" />
                <span>{isMissionDone ? (isEn ? 'Done! 🌟' : 'Edildi! 🌟') : (isEn ? 'Mark Done' : 'Tamamla')}</span>
              </button>
            </div>
            <p className="text-xs font-semibold text-white leading-snug">
              {isEn ? featured.mission_en : featured.mission_az}
            </p>
          </div>

          {/* Did You Know */}
          <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
            <span className="text-sm shrink-0">💡</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isEn ? featured.fun_fact_en : featured.fun_fact_az}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
