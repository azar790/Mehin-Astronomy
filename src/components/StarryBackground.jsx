import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function StarryBackground() {
  const { activeThemeObj, theme } = useApp();
  const { scrollYProgress } = useScroll();

  // Dynamically shift ambient glow color as user scrolls down!
  const scrollHueShift = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'rgba(147, 51, 234, 0.18)',  // Purple top
      'rgba(236, 72, 153, 0.22)',  // Pink mid
      'rgba(20, 184, 166, 0.25)',  // Emerald/Teal bottom
    ]
  );

  const scrollGlowOffset = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // 24 animated stars
  const stars = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.floor((i * 17) % 100),
      y: Math.floor((i * 23) % 100),
      size: (i % 2 === 0 ? 2.5 : 1.5),
      delay: (i % 4) * 0.7,
      duration: 2 + (i % 3),
      color: i % 4 === 0 ? '#fbcfe8' : i % 5 === 0 ? '#67e8f9' : '#ffffff',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 will-change-transform">
      {/* Base Theme Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${activeThemeObj.bgGradient} transition-colors duration-700`} />

      {/* Dynamic Scroll-Reactive Glow Layer (Shifts color as user scrolls down) */}
      <motion.div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${scrollHueShift.get()}, transparent 70%)`,
        }}
      />

      {/* Moving Ambient Nebula Aura */}
      <motion.div
        style={{ y: scrollGlowOffset }}
        className="absolute top-1/4 -right-10 w-72 h-72 rounded-full bg-pink-500/15 blur-[80px]"
      />
      <motion.div
        style={{ y: scrollGlowOffset }}
        className="absolute bottom-1/4 -left-10 w-72 h-72 rounded-full bg-indigo-500/15 blur-[80px]"
      />

      {/* Twinkling Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 6px ${s.color}`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Playful Floating Mascot that reacts to scroll */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, 200]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 45]),
        }}
        className="absolute text-2xl top-16 right-4 select-none opacity-85 filter drop-shadow-[0_0_8px_rgba(255,200,0,0.5)]"
      >
        {theme === 'daylight' ? '🕊️' : '🚀'}
      </motion.div>
    </div>
  );
}
