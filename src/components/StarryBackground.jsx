import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Astronaut from './Astronaut';

// Three rotating cosmic spectacles:
// 0: Astronaut slowly floating across
// 1: Space Rocket cruising smoothly across the stars
// 2: Gentle Meteor Shower cascading gracefully
const COSMIC_EVENTS = ['astronaut', 'rocket', 'meteors'];

export default function StarryBackground() {
  const { activeThemeObj } = useApp();
  const { scrollYProgress } = useScroll();
  const [eventIndex, setEventIndex] = useState(0);

  // Rotate through cosmic events every 15 seconds in calm, slow turns!
  useEffect(() => {
    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % COSMIC_EVENTS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const currentEvent = COSMIC_EVENTS[eventIndex];

  // Vibrant color shift on scroll
  const scrollHue = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(circle at 50% 10%, rgba(168, 85, 247, 0.35) 0%, transparent 60%)',
      'radial-gradient(circle at 70% 50%, rgba(236, 72, 153, 0.35) 0%, transparent 60%)',
      'radial-gradient(circle at 30% 90%, rgba(6, 182, 212, 0.4) 0%, transparent 65%)',
    ]
  );

  // High-visibility twinkling background stars
  const stars = useMemo(() => {
    return [
      { id: 1, x: 8, y: 12, size: 5, color: '#fef08a', duration: 3.2, delay: 0 },
      { id: 2, x: 86, y: 15, size: 6, color: '#67e8f9', duration: 3.8, delay: 0.5 },
      { id: 3, x: 22, y: 28, size: 4, color: '#f472b6', duration: 4.1, delay: 1.2 },
      { id: 4, x: 78, y: 35, size: 5, color: '#ffffff', duration: 3.4, delay: 0.8 },
      { id: 5, x: 12, y: 48, size: 6, color: '#a78bfa', duration: 4.3, delay: 0.2 },
      { id: 6, x: 92, y: 55, size: 5, color: '#fef08a', duration: 3.6, delay: 1.5 },
      { id: 7, x: 18, y: 68, size: 4, color: '#67e8f9', duration: 3.9, delay: 0.9 },
      { id: 8, x: 82, y: 75, size: 6, color: '#f472b6', duration: 4.4, delay: 0.4 },
      { id: 9, x: 28, y: 88, size: 5, color: '#ffffff', duration: 3.5, delay: 1.1 },
      { id: 10, x: 72, y: 92, size: 5, color: '#a78bfa', duration: 4.0, delay: 0.7 },
      { id: 11, x: 48, y: 8, size: 4, color: '#fef08a', duration: 3.7, delay: 1.4 },
      { id: 12, x: 55, y: 42, size: 5, color: '#67e8f9', duration: 4.2, delay: 0.3 },
      { id: 13, x: 40, y: 62, size: 4, color: '#f472b6', duration: 3.3, delay: 1.6 },
      { id: 14, x: 62, y: 80, size: 5, color: '#ffffff', duration: 3.9, delay: 0.6 },
    ];
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Background Base */}
      <div className={`absolute inset-0 bg-gradient-to-b ${activeThemeObj.bgGradient} transition-colors duration-700`} />

      {/* Reactive Nebula Glow that shifts with scroll */}
      <motion.div
        className="absolute inset-0 transition-all duration-700"
        style={{ backgroundImage: scrollHue }}
      />

      {/* Pulsing Cosmic Aurora Clouds */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
          x: [0, 25, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-5%] left-[-15%] w-80 h-80 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-500/25 blur-2xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -25, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-[20%] right-[-15%] w-88 h-88 rounded-full bg-gradient-to-bl from-cyan-500/30 to-indigo-600/25 blur-2xl"
      />

      {/* Twinkling Background Stars */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 2.5}px ${s.color}`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.75, 1.4, 0.75],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ======================================================== */}
      {/* 🎭 NÖVBƏLİ VƏ ÇOX YAVAŞ KOSMİK ŞOU (SLOW & PEACEFUL) */}
      {/* ======================================================== */}
      <AnimatePresence mode="wait">
        
        {/* 1. NÖVBƏ: ASTRONAVT (ÇOX YAVAŞ SÜZÜR: 14 SANİYƏ) */}
        {currentEvent === 'astronaut' && (
          <motion.div
            key="astronaut-turn"
            initial={{ x: '-25vw', y: '30vh', opacity: 0, rotate: -15 }}
            animate={{
              x: '115vw',
              y: ['25vh', '15vh', '40vh', '20vh'],
              opacity: [0, 1, 1, 1, 0],
              rotate: [-15, 8, -6, 10, -15],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 14,
              ease: 'linear',
            }}
            className="absolute z-0 will-change-transform"
          >
            <Astronaut />
          </motion.div>
        )}

        {/* 2. NÖVBƏ: SƏLİQƏLİ SÜZƏN RAKET (YAVAŞ UÇUŞ: 11 SANİYƏ) */}
        {currentEvent === 'rocket' && (
          <motion.div
            key="rocket-turn"
            initial={{ x: '-20vw', y: '80vh', opacity: 0, scale: 0.85 }}
            animate={{
              x: '115vw',
              y: '-15vh',
              opacity: [0, 1, 1, 1, 0],
              scale: [0.85, 1.15, 1.15, 0.9],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 11,
              ease: 'linear',
            }}
            className="absolute z-0 flex items-center select-none filter drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]"
          >
            <div className="relative rotate-[42deg]">
              <span className="text-5xl sm:text-6xl inline-block">🚀</span>
              <motion.div
                animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-amber-400 via-rose-500 to-transparent rounded-full blur-[2px]"
              />
            </div>
          </motion.div>
        )}

        {/* 3. NÖVBƏ: GÖZƏL VƏ YAVAŞ METEOR YAĞIŞI (SLOW SHOOTING STARS: 4-5 SANİYƏ) */}
        {currentEvent === 'meteors' && (
          <motion.div
            key="meteors-turn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            {/* Meteor 1 (Cyan) */}
            <motion.div
              className="absolute w-48 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-white rounded-full rotate-[-38deg] filter drop-shadow-[0_0_10px_#38bdf8]"
              initial={{ x: '105vw', y: '5vh', opacity: 0 }}
              animate={{
                x: ['95vw', '-20vw'],
                y: ['5vh', '70vh'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 4.2, ease: 'linear', delay: 0.4 }}
            />

            {/* Meteor 2 (Golden) */}
            <motion.div
              className="absolute w-40 h-1.5 bg-gradient-to-r from-transparent via-amber-300 to-yellow-100 rounded-full rotate-[-35deg] filter drop-shadow-[0_0_10px_#fbbf24]"
              initial={{ x: '95vw', y: '25vh', opacity: 0 }}
              animate={{
                x: ['85vw', '-25vw'],
                y: ['25vh', '85vh'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 4.5, ease: 'linear', delay: 2.2 }}
            />

            {/* Meteor 3 (Neon Pink) */}
            <motion.div
              className="absolute w-52 h-1.5 bg-gradient-to-r from-transparent via-pink-400 to-white rounded-full rotate-[-40deg] filter drop-shadow-[0_0_12px_#ec4899]"
              initial={{ x: '110vw', y: '12vh', opacity: 0 }}
              animate={{
                x: ['100vw', '-15vw'],
                y: ['12vh', '80vh'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 4.0, ease: 'linear', delay: 4.5 }}
            />

            {/* Meteor 4 (White) */}
            <motion.div
              className="absolute w-44 h-1.5 bg-gradient-to-r from-transparent via-indigo-200 to-white rounded-full rotate-[-36deg] filter drop-shadow-[0_0_10px_#818cf8]"
              initial={{ x: '85vw', y: '40vh', opacity: 0 }}
              animate={{
                x: ['75vw', '-30vw'],
                y: ['40vh', '98vh'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 4.8, ease: 'linear', delay: 6.5 }}
            />

            {/* Soft Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.9, 0], y: [-3, 3] }}
              transition={{ duration: 4.5, delay: 0.8 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-950/60 border border-cyan-400/40 text-cyan-200 text-xs font-black shadow-lg whitespace-nowrap"
            >
              🌠 Meteor Yağışı ✨
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
