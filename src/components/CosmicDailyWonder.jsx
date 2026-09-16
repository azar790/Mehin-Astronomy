import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shuffle, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

const COSMIC_FACTS = [
  {
    id: 'sun-size',
    emoji: '☀️',
    category_en: 'The Sun',
    category_az: 'Nəhəng Günəş',
    title_en: '1.3 Million Earths inside the Sun!',
    title_az: 'Günəşin içinə 1.3 milyon Yer sığar!',
    fact_en: 'The Sun is so gigantic that over 1,300,000 Earths could easily fit inside it! It keeps our entire solar system warm and cozy.',
    fact_az: 'Günəş o qədər nəhəngdir ki, onun içinə 1 milyon 300 min ədəd Yer kürəsi yerləşər! O, bütün planetləri işıqlandırır və qızdırır.',
  },
  {
    id: 'saturn-rings',
    emoji: '🪐',
    category_en: 'Saturn',
    category_az: 'Halqalı Saturn',
    title_en: "Saturn's Rings are Made of Ice!",
    title_az: 'Saturnun halqaları buzdan ibarətdir!',
    fact_en: "Saturn's beautiful rings are not solid! They are made of billions of glittering ice chunks, snowflakes, and space rocks sparkling in sunlight.",
    fact_az: 'Saturnun sehrli halqaları bərk deyil! Onlar milyardlarla parıldayan buz dənələri, qar və Günəş işığında par-par yanan daşlardan ibarətdir.',
  },
  {
    id: 'space-silent',
    emoji: '🤫',
    category_en: 'Deep Space',
    category_az: 'Dərin Kosmos',
    title_en: 'Space is Completely Silent!',
    title_az: 'Kosmosda tam və sehrli bir sükutdur!',
    fact_en: 'Because there is no air in space, sound waves cannot travel. Even giant explosions in space make zero noise — it is totally quiet!',
    fact_az: 'Kosmosda hava olmadığı üçün heç bir səs yayıla bilmir. Kosmosda nəhəng ulduzlar partlasa belə heç bir səs çıxmır — hər yer tam sükutdur.',
  },
  {
    id: 'moon-footsteps',
    emoji: '🐾',
    category_en: 'The Moon',
    category_az: 'Sirli Ay',
    title_en: 'Footprints on the Moon Last Forever!',
    title_az: 'Ayda ayaq izləri milyon illərlə qalacaq!',
    fact_en: 'There is no wind or rain on the Moon to wash them away! The astronaut footprints left in 1969 will stay there for millions of years.',
    fact_az: 'Ayda külək və yağış olmadığı üçün heç nə silinmir! 1969-cu ildə astronavtların Ay qumunda qoyduğu ayaq izləri milyon illər boyu orada qalacaq.',
  },
  {
    id: 'mars-red',
    emoji: '🔴',
    category_en: 'Mars',
    category_az: 'Qırmızı Mars',
    title_en: 'Mars is Red because of Rust!',
    title_az: 'Mars torpağındakı pas tozuna görə qırmızıdır!',
    fact_en: 'Mars is nicknamed the Red Planet because its rocks and dust are loaded with iron oxide — the very same rust you see on old metal toys!',
    fact_az: 'Mars ona görə al-qırmızı görünür ki, onun daş və torpağı dəmir pası tozu ilə örtülüdür — eynilə qədim metal oyuncaqların pası kimi!',
  },
  {
    id: 'iss-sunrises',
    emoji: '🛸',
    category_en: 'Space Station',
    category_az: 'Kosmik Stansiya',
    title_en: '16 Sunrises Every Single Day!',
    title_az: 'Hər gün 16 dəfə günəş çıxır və batır!',
    fact_en: 'The International Space Station zooms around Earth so fast (28,000 km/h) that astronauts see 16 sunrises and 16 sunsets every 24 hours!',
    fact_az: 'Kosmik Stansiya Yer ətrafında saatda 28 min km sürətlə uçur! Ona görə kosmonavtlar bir gündə 16 dəfə günəşin doğmasını və batmasını görürlər.',
  },
  {
    id: 'diamond-rain',
    emoji: '💎',
    category_en: 'Ice Giants',
    category_az: 'Buz Nəhəngləri',
    title_en: 'It Rains Real Diamonds on Neptune!',
    title_az: 'Neptun və Uranda almaz yağışları yağır!',
    fact_en: 'Extreme space pressure inside Neptune and Uranus squeezes carbon atoms so hard that it literally rains real sparkling diamonds!',
    fact_az: 'Neptun və Uran planetlərinin dərinliyində güclü təzyiq karbonu sıxır və göydən həqiqi parıldayan almaz daşları yağır!',
  },
  {
    id: 'venus-day',
    emoji: '🐢',
    category_en: 'Venus',
    category_az: 'Parlaq Venera',
    title_en: 'A Day on Venus is Longer than a Year!',
    title_az: 'Venerada bir gün bütöv bir ildən uzundur!',
    fact_en: 'Venus spins on its axis like a sleepy turtle! It takes 243 Earth days to rotate once, but only 225 Earth days to travel around the Sun.',
    fact_az: 'Venera öz oxu ətrafında yuxulu tısbağa kimi çox yavaş fırlanır. Ona görə onun bir günü bütöv bir ilindən daha uzun çəkir!',
  },
  {
    id: 'jupiter-moons',
    emoji: '🌕',
    category_en: 'Jupiter',
    category_az: 'Nəhəng Yupiter',
    title_en: 'Jupiter Has 95 Orbiting Moons!',
    title_az: 'Yupiterin ətrafında 95 ədəd ay fırlanır!',
    fact_en: 'Earth has just 1 Moon, but giant Jupiter has 95 known moons dancing around it! One of them, Europa, has a warm ocean under its ice.',
    fact_az: 'Yerin cəmi 1 Ayı var, amma nəhəng Yupiterin ətrafında düz 95 ədəd peyk-ay fırlanır! Onlardan biri olan Avropanın buzunun altında isti okean var.',
  },
  {
    id: 'olympus-mons',
    emoji: '🏔️',
    category_en: 'Volcanoes',
    category_az: 'Nəhəng Zirvələr',
    title_en: 'The Tallest Mountain in the Solar System!',
    title_az: 'Kainatın ən hündür dağı Marsdadır!',
    fact_en: 'Olympus Mons on Mars is 22 kilometers high — almost 3 times taller than Mount Everest on Earth! Its peak touches the edges of space.',
    fact_az: 'Marsdakı "Olimp" dağı 22 kilometr hündürlüyə malikdir — Yerdəki Everest dağından 3 dəfə hündürdür və zirvəsi kosmosa çatır!',
  },
  {
    id: 'sun-speed',
    emoji: '⚡',
    category_en: 'Speed of Light',
    category_az: 'İşığın Sürəti',
    title_en: 'Sunlight Takes 8 Minutes to Reach You!',
    title_az: 'Günəş işığı bizə 8 dəqiqə 20 saniyəyə çatır!',
    fact_en: 'Light travels superfast (300,000 km per second), yet space is so vast that the sunlight you feel on your cheeks began its journey 8 minutes ago!',
    fact_az: 'İşıq saniyədə 300 min kilometr sürətlə uçsa da, Günəş o qədər uzaqdadır ki, onun şüaları sənin yanağına 8 dəqiqə 20 saniyəyə çatır!',
  },
  {
    id: 'moon-jump',
    emoji: '🦘',
    category_en: 'Gravity',
    category_az: 'Cazibə Qüvvəsi',
    title_en: 'Jump 6 Times Higher on the Moon!',
    title_az: 'Ayda kenquru kimi 6 dəfə hündürə tullanarsan!',
    fact_en: 'Gravity on the Moon is 6 times weaker than on Earth! If you weigh 24 kg on Earth, on the Moon you would weigh only 4 kg!',
    fact_az: 'Ayda cazibə qüvvəsi 6 dəfə zəifdir! Yerdə 24 kiloqram çəkin varsa, Ayda cəmi 4 kiloqram olarsan və bir tullanışda ev boyda ucalarsan!',
  },
];

export default function CosmicDailyWonder() {
  const { language, activeThemeObj, explorerName } = useApp();
  const isEn = language === 'en';

  // Pick initial fact based on day of year
  const [factIndex, setFactIndex] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % COSMIC_FACTS.length;
  });

  const currentFact = COSMIC_FACTS[factIndex];

  const handleNextFact = () => {
    setFactIndex((prev) => (prev + 1) % COSMIC_FACTS.length);
  };

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 py-1.5">
      <div className={`p-4 sm:p-5 rounded-3xl ${activeThemeObj.cardBg} backdrop-blur-xl shadow-xl border border-purple-500/25 transition-colors duration-500`}>
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0 select-none">✨</span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1 truncate">
                <span>{isEn ? "Daily Cosmic Wonder" : 'Günün Kosmik Sirri'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              </h2>
              <p className="text-[11px] text-purple-200/80 font-medium truncate">
                {isEn ? `Mind-blowing facts for ${explorerName}` : `${explorerName} üçün heyrətamiz kosmik kəşf`}
              </p>
            </div>
          </div>

          {/* Shuffle Next Fact Button */}
          <button
            type="button"
            onClick={handleNextFact}
            title={isEn ? 'Show another wonder' : 'Başqa sirr göstər'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-bold transition cursor-pointer active:scale-95 shrink-0 shadow-sm"
          >
            <Shuffle className="w-3 h-3 text-pink-300" />
            <span className="hidden xs:inline">{isEn ? 'Next' : 'Digəri'}</span>
            <span className="xs:hidden">🎲</span>
          </button>
        </div>

        {/* Fact Card Content with Smooth Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFact.id}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 shadow-inner flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 flex items-center gap-1">
                <Compass className="w-2.5 h-2.5 text-pink-300" />
                <span>{isEn ? currentFact.category_en : currentFact.category_az}</span>
              </span>

              <span className="text-xs text-slate-400 font-semibold">
                #{factIndex + 1} / {COSMIC_FACTS.length}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-slate-800/90 border border-slate-700 shrink-0 select-none shadow-md">
                {currentFact.emoji}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-black text-amber-300 leading-snug">
                  {isEn ? currentFact.title_en : currentFact.title_az}
                </h3>
                <p className="text-xs text-purple-100 font-medium leading-relaxed mt-1">
                  {isEn ? currentFact.fact_en : currentFact.fact_az}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
