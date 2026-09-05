import { getTimes, getMoonIllumination } from 'suncalc';

/**
 * Get detailed celestial and solar data for given coordinates and date
 */
export function getSkyData(lat = 40.4093, lng = 49.8671, date = new Date()) {
  const times = getTimes(date, lat, lng);
  const moonIllum = getMoonIllumination(date);

  const now = date.getTime();
  const sunrise = times.sunrise ? times.sunrise.getTime() : null;
  const sunset = times.sunset ? times.sunset.getTime() : null;
  const goldenHour = times.goldenHour ? times.goldenHour.getTime() : null;
  const dusk = times.dusk ? times.dusk.getTime() : null;
  const dawn = times.dawn ? times.dawn.getTime() : null;

  // Determine current sky state
  let skyState = 'day'; // 'dawn', 'day', 'golden', 'dusk', 'night'
  if (dawn && now < dawn) {
    skyState = 'night';
  } else if (dawn && sunrise && now >= dawn && now < sunrise) {
    skyState = 'dawn';
  } else if (sunrise && goldenHour && now >= sunrise && now < goldenHour) {
    skyState = 'day';
  } else if (goldenHour && sunset && now >= goldenHour && now < sunset) {
    skyState = 'golden';
  } else if (sunset && dusk && now >= sunset && now < dusk) {
    skyState = 'dusk';
  } else {
    skyState = 'night';
  }

  // Calculate day progress percentage (0 to 100)
  let dayProgress = 0;
  if (sunrise && sunset) {
    if (now <= sunrise) {
      dayProgress = 0;
    } else if (now >= sunset) {
      dayProgress = 100;
    } else {
      dayProgress = Math.min(100, Math.max(0, Math.round(((now - sunrise) / (sunset - sunrise)) * 100)));
    }
  }

  // Format moon phase details
  const phase = moonIllum.phase; // 0 (new) to 1 (new)
  const fraction = Math.round(moonIllum.fraction * 100); // 0 to 100%

  let phaseNameEn = 'New Moon';
  let phaseNameAz = 'Təzə Ay';
  let moonIcon = '🌑';
  let isFullMoon = false;
  let isSuperBright = fraction >= 85;

  if (phase < 0.03 || phase > 0.97) {
    phaseNameEn = 'New Moon';
    phaseNameAz = 'Təzə Ay';
    moonIcon = '🌑';
  } else if (phase < 0.22) {
    phaseNameEn = 'Waxing Crescent';
    phaseNameAz = 'Böyüyən Hilal';
    moonIcon = '🌒';
  } else if (phase < 0.28) {
    phaseNameEn = 'First Quarter';
    phaseNameAz = 'İlk Dörddəbir';
    moonIcon = '🌓';
  } else if (phase < 0.47) {
    phaseNameEn = 'Waxing Gibbous';
    phaseNameAz = 'Böyüyən Qabarıq Ay';
    moonIcon = '🌔';
  } else if (phase < 0.53) {
    phaseNameEn = 'Full Moon';
    phaseNameAz = 'Bədirlənmiş Ay (Dolunay)';
    moonIcon = '🌕';
    isFullMoon = true;
  } else if (phase < 0.72) {
    phaseNameEn = 'Waning Gibbous';
    phaseNameAz = 'Kiçilən Qabarıq Ay';
    moonIcon = '🌖';
  } else if (phase < 0.78) {
    phaseNameEn = 'Last Quarter';
    phaseNameAz = 'Son Dörddəbir';
    moonIcon = '🌗';
  } else {
    phaseNameEn = 'Waning Crescent';
    phaseNameAz = 'Kiçilən Hilal';
    moonIcon = '🌘';
  }

  // Calculate days until next Full Moon (approx 29.53 day lunar cycle)
  let daysToFull = 0;
  if (phase <= 0.5) {
    daysToFull = Math.round((0.5 - phase) * 29.53);
  } else {
    daysToFull = Math.round((1.5 - phase) * 29.53);
  }

  const formatTime = (t) => {
    if (!t) return '--:--';
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    sunriseTime: formatTime(times.sunrise),
    sunsetTime: formatTime(times.sunset),
    solarNoonTime: formatTime(times.solarNoon),
    goldenHourTime: formatTime(times.goldenHour),
    rawSunrise: times.sunrise,
    rawSunset: times.sunset,
    dayProgress,
    skyState,
    moon: {
      phase,
      fraction,
      phaseNameEn,
      phaseNameAz,
      moonIcon,
      isFullMoon,
      isSuperBright,
      daysToFull: Math.max(0, daysToFull),
    },
  };
}

/**
 * Get personalized sky tip message for the explorer
 */
export function getKidSkyMessage(skyData, explorerName = 'Mehin', lang = 'en') {
  const isEn = lang === 'en';
  const { skyState, moon } = skyData;

  if (moon.isFullMoon) {
    return isEn
      ? `${explorerName}, look outside tonight! A magnificent giant Full Moon is shining bright just for you! 🌕✨`
      : `${explorerName}, bu gecə mütləq göyə bax! Nəhəng və parlaq Dolunay bu gecə sənin üçün parıldayır! 🌕✨`;
  }

  if (moon.daysToFull <= 3 && moon.daysToFull > 0) {
    return isEn
      ? `${explorerName}, get ready! In just ${moon.daysToFull} ${moon.daysToFull === 1 ? 'day' : 'days'}, we will have a dazzling Full Moon in the sky! 🔭`
      : `${explorerName}, hazırlaş! Cəmi ${moon.daysToFull} gündən sonra səmada parlaq Dolunay olacaq! Teleskopu hazırla! 🔭`;
  }

  switch (skyState) {
    case 'dawn':
      return isEn
        ? `Rise and shine, ${explorerName}! The Sun is waking up over the horizon! A brand new day of wonders begins! 🌅`
        : `Sabahın xeyir, ${explorerName}! Günəş üfüqdə indicə oyanır! Möcüzələrlə dolu yeni bir gün başlayır! 🌅`;
    case 'golden':
      return isEn
        ? `${explorerName}, look out the window right now! The magical Golden Hour is painting the clouds pink and gold! 🌇`
        : `${explorerName}, dərhal pəncərədən çölə bax! Sehrli qızıl saat buludları narıncı və çəhrayı rənglərə boyayır! 🌇`;
    case 'dusk':
      return isEn
        ? `The Sun has set, ${explorerName}! The first evening stars are starting to twinkle in the dark blue sky! ✨`
        : `Günəş batdı, ${explorerName}! İlk axşam ulduzları tünd mavi səmada bərq vurmağa başlayır! ✨`;
    case 'night':
      return isEn
        ? `${explorerName}, the cosmos is watching over you! Look how peaceful the moon (${moon.phaseNameEn}) shines tonight! 🌙`
        : `${explorerName}, kosmos bu gecə sənə bələdçilik edir! Gör bu gecə ay (${moon.phaseNameAz}) necə sakit parıldayır! 🌙`;
    case 'day':
    default:
      return isEn
        ? `The Sun is shining high and bright, Explorer ${explorerName}! Great hours ahead for outdoor play and learning! ☀️`
        : `Günəş parlaq və isti şölələr saçır, Kəşfiyyatçı ${explorerName}! Açıq havada oynamaq və kəşflər üçün əla vaxtdır! ☀️`;
  }
}
