import React, { useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function StarryBackground() {
  const { activeThemeObj, theme } = useApp();
  const { scrollYProgress } = useScroll();

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

  // High-visibility, Retina-friendly sparkling stars (3px to 7px with glowing halos)
  const stars = useMemo(() => {
    return [
      { id: 1, x: 8, y: 12, size: 5, color: '#fef08a', duration: 2.2, delay: 0 },
      { id: 2, x: 86, y: 15, size: 6, color: '#67e8f9', duration: 2.8, delay: 0.5 },
      { id: 3, x: 22, y: 28, size: 4, color: '#f472b6', duration: 3.1, delay: 1.2 },
      { id: 4, x: 78, y: 35, size: 5, color: '#ffffff', duration: 2.4, delay: 0.8 },
      { id: 5, x: 12, y: 48, size: 6, color: '#a78bfa', duration: 3.3, delay: 0.2 },
      { id: 6, x: 92, y: 55, size: 5, color: '#fef08a', duration: 2.6, delay: 1.5 },
      { id: 7, x: 18, y: 68, size: 4, color: '#67e8f9', duration: 2.9, delay: 0.9 },
      { id: 8, x: 82, y: 75, size: 6, color: '#f472b6', duration: 3.4, delay: 0.4 },
      { id: 9, x: 28, y: 88, size: 5, color: '#ffffff', duration: 2.5, delay: 1.1 },
      { id: 10, x: 72, y: 92, size: 5, color: '#a78bfa', duration: 3.0, delay: 0.7 },
      { id: 11, x: 48, y: 8, size: 4, color: '#fef08a', duration: 2.7, delay: 1.4 },
      { id: 12, x: 55, y: 42, size: 5, color: '#67e8f9', duration: 3.2, delay: 0.3 },
      { id: 13, x: 40, y: 62, size: 4, color: '#f472b6', duration: 2.3, delay: 1.6 },
      { id: 14, x: 62, y: 80, size: 5, color: '#ffffff', duration: 2.9, delay: 0.6 },
      { id: 15, x: 94, y: 24, size: 4, color: '#67e8f9', duration: 2.5, delay: 1.0 },
      { id: 16, x: 6, y: 82, size: 5, color: '#fef08a', duration: 3.1, delay: 0.5 },
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

      {/* Pulsing Cosmic Aurora Clouds (Vivid on mobile) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
          x: [0, 30, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-5%] left-[-15%] w-80 h-80 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-500/25 blur-2xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -30, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-[20%] right-[-15%] w-88 h-88 rounded-full bg-gradient-to-bl from-cyan-500/30 to-indigo-600/25 blur-2xl"
      />

      {/* Fast Shooting Star (Comet) that flies across the screen every 6 seconds! */}
      <motion.div
        className="absolute w-36 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-white rounded-full rotate-[-40deg] filter drop-shadow-[0_0_8px_#38bdf8]"
        initial={{ x: '110vw', y: '5vh', opacity: 0 }}
        animate={{
          x: ['100vw', '-20vw'],
          y: ['5vh', '70vh'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          repeatDelay: 5.5,
          ease: 'easeOut',
        }}
      />

      {/* Second Golden Shooting Star */}
      <motion.div
        className="absolute w-28 h-1 bg-gradient-to-r from-transparent via-amber-300 to-yellow-100 rounded-full rotate-[-30deg] filter drop-shadow-[0_0_6px_#f59e0b]"
        initial={{ x: '105vw', y: '35vh', opacity: 0 }}
        animate={{
          x: ['95vw', '-15vw'],
          y: ['35vh', '85vh'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 9,
          delay: 3,
          ease: 'easeOut',
        }}
      />

      {/* High-Visibility Sparkling Stars with Halos */}
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
            boxShadow: `0 0 ${s.size * 2.5}px ${s.color}, 0 0 ${s.size * 4}px ${s.color}`,
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

      {/* Sparkle Emojis floating gently in corners */}
      <motion.span
        animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-3 text-lg opacity-70 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
      >
        ✨
      </motion.span>

      <motion.span
        animate={{ y: [0, -18, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 right-3 text-lg opacity-70 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
      >
        ⭐
      </motion.span>

      <motion.span
        animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-32 left-4 text-lg opacity-70 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
      >
        ✨
      </motion.span>

      {/* Cute Floating Astronaut / Rocket that drifts across */}
      <motion.div
        className="absolute text-3xl filter drop-shadow-[0_0_12px_rgba(255,200,0,0.7)]"
        initial={{ x: '-15vw', y: '18vh' }}
        animate={{
          x: ['-15vw', '110vw'],
          y: ['18vh', '40vh'],
          rotate: [15, 30, 15],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {theme === 'daylight' ? '🕊️' : '🚀'}
      </motion.div>
    </div>
  );
}
