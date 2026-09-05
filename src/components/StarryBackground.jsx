import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function StarryBackground() {
  const { activeThemeObj, theme } = useApp();

  // Generate deterministic stars with random twinkle delays
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.floor((i * 17) % 100),
      y: Math.floor((i * 23) % 100),
      size: (i % 3) + 1.2,
      delay: (i % 5) * 0.7,
      duration: 2 + (i % 4),
      color: i % 5 === 0 ? '#fbcfe8' : i % 7 === 0 ? '#67e8f9' : '#ffffff',
    }));
  }, []);

  // Theme-specific glow colors
  const glowConfig = useMemo(() => {
    switch (theme) {
      case 'sunset':
        return {
          glow1: 'bg-amber-600/25',
          glow2: 'bg-rose-600/20',
          glow3: 'bg-purple-900/25',
        };
      case 'aurora':
        return {
          glow1: 'bg-emerald-600/25',
          glow2: 'bg-teal-500/20',
          glow3: 'bg-cyan-800/25',
        };
      case 'candy':
        return {
          glow1: 'bg-pink-600/25',
          glow2: 'bg-fuchsia-600/25',
          glow3: 'bg-indigo-700/20',
        };
      case 'daylight':
        return {
          glow1: 'bg-sky-500/25',
          glow2: 'bg-cyan-400/20',
          glow3: 'bg-amber-400/20',
        };
      case 'cosmic':
      default:
        return {
          glow1: 'bg-purple-900/25',
          glow2: 'bg-indigo-600/20',
          glow3: 'bg-cyan-900/20',
        };
    }
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Theme Gradient Layers */}
      <div className={`absolute inset-0 bg-gradient-to-b ${activeThemeObj.bgGradient} transition-colors duration-700`} />
      
      {/* Nebula Ambient Glows */}
      <div className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full ${glowConfig.glow1} blur-[100px]`} />
      <div className={`absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] max-w-[350px] max-h-[350px] rounded-full ${glowConfig.glow2} blur-[110px]`} />
      <div className={`absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full ${glowConfig.glow3} blur-[120px]`} />

      {/* Twinkling Stars */}
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
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
          animate={{
            opacity: [0.15, 0.95, 0.15],
            scale: [0.8, 1.25, 0.8],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating Space Mascot */}
      <motion.div
        className="absolute text-xl sm:text-2xl filter drop-shadow-[0_0_12px_rgba(255,200,0,0.6)]"
        initial={{ x: '-15vw', y: '12vh' }}
        animate={{
          x: ['-15vw', '115vw'],
          y: ['12vh', '28vh'],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'linear',
          delay: 1,
        }}
      >
        {theme === 'daylight' ? '🕊️' : '🚀'}
      </motion.div>
    </div>
  );
}
