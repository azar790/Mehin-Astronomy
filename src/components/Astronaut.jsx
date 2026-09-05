import React from 'react';
import { motion } from 'framer-motion';

export default function Astronaut({ className = '' }) {
  return (
    <div className={`relative inline-block ${className} select-none pointer-events-none`}>
      <svg
        viewBox="0 0 120 150"
        className="w-16 h-20 sm:w-20 sm:h-24 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Oxygen Backpack */}
        <rect x="25" y="45" width="70" height="55" rx="14" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
        <rect x="35" y="38" width="18" height="10" rx="4" fill="#94a3b8" />
        <rect x="67" y="38" width="18" height="10" rx="4" fill="#94a3b8" />
        
        {/* Thruster glow on backpack */}
        <circle cx="44" cy="102" r="4" fill="#38bdf8" className="animate-pulse" />
        <circle cx="76" cy="102" r="4" fill="#38bdf8" className="animate-pulse" />

        {/* Left Arm & Glove (Waving gently) */}
        <motion.g
          animate={{ rotate: [-8, 14, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '28px', originY: '60px' }}
        >
          {/* Arm Sleeve */}
          <path
            d="M 32 62 C 18 68, 12 78, 10 90"
            stroke="#f8fafc"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 32 62 C 18 68, 12 78, 10 90"
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
          />
          {/* Glove */}
          <ellipse cx="9" cy="94" rx="7" ry="8" fill="#a855f7" stroke="#f8fafc" strokeWidth="2" />
        </motion.g>

        {/* Right Arm & Glove */}
        <motion.g
          animate={{ rotate: [10, -12, 10] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '88px', originY: '60px' }}
        >
          {/* Arm Sleeve */}
          <path
            d="M 88 62 C 102 68, 108 78, 110 90"
            stroke="#f8fafc"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 88 62 C 102 68, 108 78, 110 90"
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
          />
          {/* Glove */}
          <ellipse cx="111" cy="94" rx="7" ry="8" fill="#a855f7" stroke="#f8fafc" strokeWidth="2" />
        </motion.g>

        {/* Left Leg & Space Boot */}
        <motion.g
          animate={{ rotate: [6, -8, 6], y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '45px', originY: '100px' }}
        >
          <path
            d="M 45 96 L 38 122"
            stroke="#f8fafc"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Left Boot */}
          <path
            d="M 30 125 C 30 120, 46 120, 48 125 L 50 134 C 50 137, 26 137, 26 134 Z"
            fill="#a855f7"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
        </motion.g>

        {/* Right Leg & Space Boot */}
        <motion.g
          animate={{ rotate: [-6, 10, -6], y: [0, 3, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ originX: '75px', originY: '100px' }}
        >
          <path
            d="M 75 96 L 82 122"
            stroke="#f8fafc"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Right Boot */}
          <path
            d="M 72 125 C 72 120, 88 120, 90 125 L 94 134 C 94 137, 70 137, 70 134 Z"
            fill="#a855f7"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
        </motion.g>

        {/* Spacesuit Body Torso */}
        <rect x="34" y="52" width="52" height="48" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
        
        {/* Chest Mission Patch */}
        <rect x="46" y="62" width="28" height="18" rx="5" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="53" cy="71" r="3" fill="#f43f5e" />
        <circle cx="61" cy="71" r="3" fill="#38bdf8" />
        <circle cx="67" cy="71" r="2.5" fill="#facc15" />

        {/* Big Rounded Helmet */}
        <circle cx="60" cy="34" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
        
        {/* Helmet Visor (Glowing Cyan/Gold Mirror) */}
        <ellipse cx="60" cy="35" rx="18" ry="14" fill="url(#visorGrad)" stroke="#38bdf8" strokeWidth="2" />
        
        {/* Visor Glare / Specular Reflection */}
        <ellipse cx="54" cy="30" rx="7" ry="4" fill="#ffffff" opacity="0.8" />

        {/* Gradients */}
        <defs>
          <linearGradient id="visorGrad" x1="40" y1="20" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
