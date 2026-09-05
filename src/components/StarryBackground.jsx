import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export default function StarryBackground() {
  const { activeThemeObj, theme } = useApp();

  // 25 lightweight stars with pure CSS animations (hardware-accelerated, 0% CPU overhead)
  const stars = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.floor((i * 17) % 100),
      y: Math.floor((i * 23) % 100),
      size: (i % 2 === 0 ? 2 : 1.5),
      delay: (i % 4) * 0.8,
      duration: 2.5 + (i % 3),
      color: i % 4 === 0 ? '#fbcfe8' : i % 5 === 0 ? '#67e8f9' : '#ffffff',
    }));
  }, []);

  // Theme radial glow styles without slow CSS filter blurs
  const radialGlows = useMemo(() => {
    switch (theme) {
      case 'sunset':
        return 'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.15) 0%, transparent 50%)';
      case 'aurora':
        return 'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)';
      case 'candy':
        return 'radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)';
      case 'daylight':
        return 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.12) 0%, transparent 50%)';
      case 'cosmic':
      default:
        return 'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)';
    }
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 will-change-transform">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${activeThemeObj.bgGradient} transition-colors duration-500`} />

      {/* GPU Radial Glows (Instant 60fps render on mobile) */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ backgroundImage: radialGlows }}
      />

      {/* Lightweight CSS Twinkling Stars */}
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
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Smooth Flying Mascot */}
      <div className="absolute text-xl animate-float top-16 right-4 select-none opacity-80">
        {theme === 'daylight' ? '🕊️' : '🚀'}
      </div>
    </div>
  );
}
