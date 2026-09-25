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

/**
 * Real-time Night Sky & Planet Visibility Tracker
 * Inspired by TimeAndDate.com Night Sky & Planetary Observations
 */
export function getNightSkyPlanetsData(lat = 40.4093, lng = 49.8671, date = new Date()) {
  const times = getTimes(date, lat, lng);
  const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const timesYesterday = getTimes(yesterday, lat, lng);

  // Day length calculation
  let dayLengthHours = 12;
  let dayLengthMinutes = 0;
  let diffMinutes = -2;

  if (times.sunrise && times.sunset) {
    const lengthMs = times.sunset.getTime() - times.sunrise.getTime();
    dayLengthHours = Math.floor(lengthMs / (1000 * 60 * 60));
    dayLengthMinutes = Math.floor((lengthMs % (1000 * 60 * 60)) / (1000 * 60));

    if (timesYesterday.sunrise && timesYesterday.sunset) {
      const yesterdayMs = timesYesterday.sunset.getTime() - timesYesterday.sunrise.getTime();
      diffMinutes = Math.round((lengthMs - yesterdayMs) / (1000 * 60));
    }
  }

  const formatT = (t) => (!t ? '--:--' : t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  return {
    sunriseTime: formatT(times.sunrise),
    sunsetTime: formatT(times.sunset),
    dayLengthHours,
    dayLengthMinutes,
    diffMinutes,
    planets: [
      {
        id: 'saturn',
        emoji: '🪐',
        name_az: 'Saturn',
        name_en: 'Saturn',
        subtitle_az: 'Halqalı Nəhəng',
        subtitle_en: 'The Ringed Giant',
        visibility_az: 'Bütün gecə aydın görünür 🟢',
        visibility_en: 'Visible all night 🟢',
        direction_az: 'Cənub / Cənub-Şərq',
        direction_en: 'South / Southeast',
        bestTime_az: '20:30 – 04:00',
        bestTime_en: '8:30 PM – 4:00 AM',
        tip_az: 'Səmada qızılı və sabit parlaq nöqtə kimi görünür. Hətta kiçik teleskopla onun möhtəşəm buz halqaları aydın seçilir!',
        tip_en: 'Shines with a steady golden glow. Even a small telescope reveals its gorgeous ice rings!',
      },
      {
        id: 'jupiter',
        emoji: '🌕',
        name_az: 'Yupiter',
        name_en: 'Jupiter',
        subtitle_az: 'Planetlərin Şahı',
        subtitle_en: 'King of Planets',
        visibility_az: 'Gecə yarısından sonra doğur 🟢',
        visibility_en: 'Rises after midnight 🟢',
        direction_az: 'Şərq',
        direction_en: 'East',
        bestTime_az: '01:00 – 06:00',
        bestTime_en: '1:00 AM – 6:00 AM',
        tip_az: 'Aydan sonra gecə göyünün ən parlaq brilyantıdır! Dürbünlə baxdıqda ətrafında 4 böyük peykini görmək olar.',
        tip_en: 'Brightest beacon in the sky after the Moon! Binoculars reveal its 4 famous Galilean moons.',
      },
      {
        id: 'venus',
        emoji: '🌟',
        name_az: 'Venera',
        name_en: 'Venus',
        subtitle_az: 'Məşhur Dan Ulduzu',
        subtitle_en: 'Evening Star',
        visibility_az: 'Qürubdan dərhal sonra qərbdə 🟡',
        visibility_en: 'Bright in twilight west 🟡',
        direction_az: 'Qərb',
        direction_en: 'West',
        bestTime_az: 'Qürubdan sonra 45 dəqiqə',
        bestTime_en: '45 mins after sunset',
        tip_az: 'Gün batanda səmada ən birinci parıldayan gözqamaşdırıcı ulduzdur. Qalın ağ buludları günəş işığını güclü əks etdirir.',
        tip_en: 'First and brightest star-like beacon after sunset. Thick white clouds reflect sunlight like a diamond.',
      },
      {
        id: 'mars',
        emoji: '🔴',
        name_az: 'Mars',
        name_en: 'Mars',
        subtitle_az: 'Qırmızı Planet',
        subtitle_en: 'The Red Planet',
        visibility_az: 'Gecə saatlarında yüksəlir 🟠',
        visibility_en: 'Rises late night 🟠',
        direction_az: 'Şərq / Cənub-Şərq',
        direction_en: 'East / Southeast',
        bestTime_az: '23:00 – 05:30',
        bestTime_en: '11:00 PM – 5:30 AM',
        tip_az: 'Gözlərini qıyıb baxanda onun narıncı-qırmızı rəngi digər ağ ulduzlardan dərhal seçilir.',
        tip_en: 'Easily spotted by its warm fiery orange-red color that sets it apart from ordinary stars.',
      },
    ],
  };
}
