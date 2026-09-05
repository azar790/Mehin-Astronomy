import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Bell, Sparkles, BookOpen, Heart, Trophy, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * FirstGradeSchoolCountdown
 * Special motivational & congratulatory banner for Mehin starting 1st Grade on September 15!
 * Provides daily child-friendly tips for good school manners, love for books, and friendship.
 */
export default function FirstGradeSchoolCountdown() {
  const { explorerName, language, activeThemeObj } = useApp();
  const isEn = language === 'en';
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const schoolDate = new Date(currentYear, 8, 15); // Month 8 = September (0-indexed)
  
  // Calculate days left until 15 September
  const diffTime = schoolDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Kid-friendly tips for 1st grade success & motivation
  const schoolTips = [
    {
      icon: '🎒',
      title_az: 'Məktəbə Hazırlıq & Sevinc',
      title_en: 'Excitement for 1st Grade',
      text_az: 'Çantanı, rəngli qələmlərini və dəftərlərini axşamdan səliqə ilə yığ. Səliqəli kəşfiyyatçılar həmişə uğur qazanır!',
      text_en: 'Pack your schoolbag, bright pencils, and books neatly. Organized explorers always succeed!',
    },
    {
      icon: '🤝',
      title_az: 'Mehriban Dostluq & Təbəssüm',
      title_en: 'Friendship & Smiles',
      text_az: 'Sinif yoldaşlarına gülümsə və salam ver. Yeni dostlarla oynamaq və dərsləri öyrənmək çox əyləncəlidir!',
      text_en: 'Smile and say hello to your classmates! Making new friends makes learning so much fun.',
    },
    {
      icon: '👂',
      title_az: 'Müəllimə Diqqətlə Qulaq Asmaq',
      title_en: 'Listening to Teachers',
      text_az: 'Dərsdə müəllimin izah etdiklərini diqqətlə dinlə. Sual verməkdən heç vaxt çəkinmə — sual verən uşaqlar alim olurlar!',
      text_en: 'Listen closely when your teacher speaks. Never hesitate to ask curious questions!',
    },
    {
      icon: '⭐',
      title_az: 'Özünə İnam & Uğur',
      title_en: 'Confidence & Pride',
      text_az: 'Sən çox ağıllı və bacarıqlısan! Hər gün yeni hərflər və rəqəmlər öyrəndikcə biliklərin ulduzlar kimi parlayacaq!',
      text_en: 'You are so smart and capable! Every new letter and number you learn makes you shine like a star!',
    },
  ];

  // Only show leading up to September 15 (and on September 15 itself)
  const isRelevant = today.getMonth() === 8 && today.getDate() <= 16;
  if (!isRelevant || isDismissed) return null;

  const currentTip = schoolTips[currentTipIndex % schoolTips.length];

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % schoolTips.length);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#ec4899', '#a855f7', '#3b82f6', '#eab308', '#10b981'],
    });
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-1.5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-r from-pink-900/80 via-purple-900/85 to-indigo-950/90 border-2 border-pink-400/40 shadow-2xl backdrop-blur-xl text-white"
      >
        {/* Sparkle background accent */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />

        {/* Top bar: Badge & Dismiss */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/25 border border-pink-400/50 text-[11px] font-black text-pink-200 shadow-sm">
            <Bell className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>
              {daysLeft > 0
                ? (isEn ? `🔔 1st Grade starts in ${daysLeft} days!` : `🔔 1-ci Sinifə ${daysLeft} gün qaldı!`)
                : (isEn ? `🎉 Happy 1st Day of School, ${explorerName}!` : `🎉 İlk Dərs Günün Mübarək, ${explorerName}!`)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCelebrate}
              className="px-2 py-0.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-[10px] font-black text-white cursor-pointer shadow transition active:scale-95"
            >
              🎉 {isEn ? 'Cheer!' : 'Uğurlar!'}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Congratulations & Encouragement Title */}
        <div className="mb-2">
          <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
            <span>🎒</span>
            <span>
              {isEn
                ? `15 September — ${explorerName}'s Big Journey to 1st Grade!`
                : `15 Sentyabr — ${explorerName}-in 1-ci Sinifə İlk Qədəmləri!`}
            </span>
          </h3>
          <p className="text-[11px] font-medium text-pink-100/90 mt-0.5 leading-snug">
            {isEn
              ? `You are starting school! Here is your daily golden tip to be the smartest, happiest star in class:`
              : `Sən artıq məktəbli olursan! Sinifdə ən ağıllı, ən nümunəvi və mehriban şagird olmaq üçün günün qızıl məsləhəti:`}
          </p>
        </div>

        {/* Interactive Rotating Motivational Tip Box */}
        <div 
          onClick={handleNextTip}
          className="p-3 rounded-2xl bg-slate-900/80 border border-purple-400/30 flex items-start gap-2.5 cursor-pointer hover:bg-slate-900/95 transition shadow-md"
        >
          <span className="text-2xl shrink-0 select-none mt-0.5">{currentTip.icon}</span>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
              {isEn ? currentTip.title_en : currentTip.title_az}
            </span>
            <p className="text-xs font-bold text-slate-100 mt-0.5 leading-relaxed">
              {isEn ? currentTip.text_en : currentTip.text_az}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-300 shrink-0 self-center opacity-70" />
        </div>

        <p className="text-[9px] text-pink-200/80 font-semibold text-center mt-2 select-none">
          {isEn ? '👆 Tap tip box to see more school advice!' : '👆 Növbəti məsləhəti görmək üçün qutuya toxun!'}
        </p>
      </motion.div>
    </section>
  );
}
