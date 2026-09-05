import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { explorerName, language } = useApp();
  const isEn = language === 'en';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 pt-3 pb-8 text-center">
      <div className="p-3.5 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-purple-500/10 flex items-center justify-between gap-2">
        
        <div className="flex items-center gap-1.5 text-xs text-purple-200/80">
          <span>{isEn ? 'Made with love for' : 'Ulduz Qəhrəmanı'}</span>
          <span className="font-bold text-amber-300">{explorerName}</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline animate-pulse" />
        </div>

        <button
          onClick={scrollToTop}
          className="text-xs px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 transition cursor-pointer flex items-center gap-1"
        >
          <span>🚀 {isEn ? 'Top' : 'Yuxarı'}</span>
        </button>

      </div>
    </footer>
  );
}
