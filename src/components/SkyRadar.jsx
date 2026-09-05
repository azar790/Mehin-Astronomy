import React from 'react';
import { useApp } from '../context/AppContext';
import SunEarthMoonDiagram from './SunEarthMoonDiagram';

/**
 * SkyRadar Component
 * Renders the scientifically accurate, child-friendly Sun -> Earth -> Moon educational diagram.
 */
export default function SkyRadar() {
  const { explorerName, language, city, activeAvatarObj } = useApp();
  const isEn = language === 'en';

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-3.5 sm:px-4 py-1">
      <SunEarthMoonDiagram
        lat={city.lat}
        lng={city.lng}
        cityName={isEn ? city.name : (city.name_az || city.name)}
        explorerName={explorerName}
        avatarEmoji={activeAvatarObj.emoji}
        isEn={isEn}
      />
    </section>
  );
}
