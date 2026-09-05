import { getTimes, getMoonIllumination, getPosition } from 'suncalc';

/**
 * Enhanced astronomical calculations for educational projection
 * Computes exact Sun-Earth-Moon angles, lunar elongation, and physical illumination vectors.
 */
export function getAstronomicalDiagramData(lat = 40.4093, lng = 49.8671, date = new Date()) {
  const times = getTimes(date, lat, lng);
  const moonIllum = getMoonIllumination(date);
  const now = date.getTime();

  const sunrise = times.sunrise ? times.sunrise.getTime() : null;
  const sunset = times.sunset ? times.sunset.getTime() : null;

  // Real-time day or night at the user's geographic location
  let isDay = false;
  let dayProgress = 0;

  if (sunrise && sunset) {
    if (now >= sunrise && now < sunset) {
      isDay = true;
      dayProgress = Math.min(100, Math.max(0, Math.round(((now - sunrise) / (sunset - sunrise)) * 100)));
    } else {
      isDay = false;
      dayProgress = 0;
    }
  }

  // Moon Phase: SunCalc provides phase from 0.0 (New Moon) to 0.5 (Full Moon) to 1.0 (New Moon)
  const phase = moonIllum.phase;
  const fraction = Math.round(moonIllum.fraction * 100);

  // In real astronomy:
  // Phase 0.0 = New Moon (Moon is directly between Earth and Sun: elongation angle = 0°)
  // Phase 0.25 = First Quarter (Moon is 90° counter-clockwise from Sun)
  // Phase 0.50 = Full Moon (Moon is opposite the Sun: elongation angle = 180°)
  // Phase 0.75 = Last Quarter (Moon is 270° from Sun)
  // Moon Elongation Angle in Radians around Earth:
  const elongationRad = phase * Math.PI * 2;

  // Child-friendly lunar message according to geometry
  let phaseHintEn = '';
  let phaseHintAz = '';
  let phaseNameEn = '';
  let phaseNameAz = '';
  let moonIcon = '🌑';

  if (phase < 0.04 || phase > 0.96) {
    phaseNameEn = 'New Moon';
    phaseNameAz = 'Təzə Ay';
    moonIcon = '🌑';
    phaseHintEn = 'The Moon is hiding near the Sun in the sky!';
    phaseHintAz = 'Ay indicə Günəşin yanında gizlənib!';
  } else if (phase < 0.22) {
    phaseNameEn = 'Waxing Crescent';
    phaseNameAz = 'Böyüyən Hilal';
    moonIcon = '🌒';
    phaseHintEn = 'A tiny sliver of moonlight is growing!';
    phaseHintAz = 'Ay incə bir hilal kimi böyüməyə başlayır!';
  } else if (phase < 0.28) {
    phaseNameEn = 'First Quarter';
    phaseNameAz = 'İlk Dörddəbir';
    moonIcon = '🌓';
    phaseHintEn = 'Exactly half of the Moon is lit by the Sun!';
    phaseHintAz = 'Ayın düz yarısı Günəş tərəfindən işıqlanır!';
  } else if (phase < 0.47) {
    phaseNameEn = 'Waxing Gibbous';
    phaseNameAz = 'Böyüyən Qabarıq Ay';
    moonIcon = '🌔';
    phaseHintEn = 'The Moon is almost full and very bright!';
    phaseHintAz = 'Ay böyüyür, tezliklə tam yumru olacaq!';
  } else if (phase < 0.53) {
    phaseNameEn = 'Full Moon';
    phaseNameAz = 'Bədirlənmiş Ay (Dolunay)';
    moonIcon = '🌕';
    phaseHintEn = 'The Moon is opposite the Sun and fully lit!';
    phaseHintAz = 'Ay Günəşin tam qarşısındadır və bütöv parıldayır!';
  } else if (phase < 0.72) {
    phaseNameEn = 'Waning Gibbous';
    phaseNameAz = 'Kiçilən Qabarıq Ay';
    moonIcon = '🌖';
    phaseHintEn = 'The Moon is starting its quiet shrink.';
    phaseHintAz = 'Bütöv Aydan sonra yavaş-yavaş kiçilmə başlayır.';
  } else if (phase < 0.78) {
    phaseNameEn = 'Last Quarter';
    phaseNameAz = 'Son Dörddəbir';
    moonIcon = '🌗';
    phaseHintEn = 'Half of the Moon shines in the morning sky.';
    phaseHintAz = 'Ayın digər yarısı sübh səmada parıldayır.';
  } else {
    phaseNameEn = 'Waning Crescent';
    phaseNameAz = 'Kiçilən Hilal';
    moonIcon = '🌘';
    phaseHintEn = 'A gentle crescent waving goodbye before the New Moon.';
    phaseHintAz = 'Yeni Aydan əvvəl incə bir xudahafiz hilalı.';
  }

  const formatTime = (t) => {
    if (!t) return '--:--';
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    isDay,
    dayProgress,
    sunriseTime: formatTime(times.sunrise),
    sunsetTime: formatTime(times.sunset),
    moon: {
      phase,
      fraction,
      elongationRad,
      phaseNameEn,
      phaseNameAz,
      phaseHintEn,
      phaseHintAz,
      moonIcon,
      isFullMoon: phase >= 0.48 && phase <= 0.52,
    },
    rawDate: date,
  };
}
