import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getSkyData } from '../utils/astronomy';
import SunEarthMoonDiagram from './SunEarthMoonDiagram';

/**
 * SkyRadar Component
 * Seamlessly integrates the new clean Sun -> Earth -> Moon educational diagram
 * for a 7-year-old child (Mehin).
 */
export default function SkyRadar() {
  const { explorerName, language, city, activeAvatarObj } = useApp();
  const isEn = language === 'en';

  const skyData = useMemo(() => {
    return getSkyData(city.lat, city.lng);
  }, [city.lat, city.lng]);

  const isNight = skyData.skyState === 'night' || skyData.skyState === 'dusk';
  const isDay = !isNight;

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-1">
      <SunEarthMoonDiagram
        isDay={isDay}
        dayProgress={skyData.dayProgress}
        cityName={isEn ? city.name : (city.name_az || city.name)}
        explorerName={explorerName}
        avatarEmoji={activeAvatarObj.emoji}
        moon={skyData.moon}
        sunriseTime={skyData.sunriseTime}
        sunsetTime={skyData.sunsetTime}
        isEn={isEn}
      />
    </section>
  );
}
