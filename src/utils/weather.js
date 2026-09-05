/**
 * Kid-friendly WMO Weather Codes interpreter
 */
export function getWeatherInfo(code = 0, isEn = false) {
  if (code === 0) {
    return {
      icon: '☀️',
      name: isEn ? 'Sunny & Clear' : 'Açıq və Günəşli',
      tip: isEn ? 'Clear skies! Perfect for stargazing!' : 'Aydın səma! Ulduzlara baxmaq üçün əladır!',
      isRain: false,
      isSnow: false,
    };
  }
  if (code === 1 || code === 2) {
    return {
      icon: '🌤️',
      name: isEn ? 'Partly Sunny' : 'Az Buludlu',
      tip: isEn ? 'Friendly fluffy clouds in the sky.' : 'Səmada şirin bəyaz buludlar var.',
      isRain: false,
      isSnow: false,
    };
  }
  if (code === 3) {
    return {
      icon: '☁️',
      name: isEn ? 'Cloudy Sky' : 'Buludlu Səma',
      tip: isEn ? 'Cozy cloud blanket covering the sky.' : 'Buludlar göy üzünü yorğan kimi örtüb.',
      isRain: false,
      isSnow: false,
    };
  }
  if (code === 45 || code === 48) {
    return {
      icon: '🌫️',
      name: isEn ? 'Misty & Foggy' : 'Dumanlı Hava',
      tip: isEn ? 'Like walking inside a cloud!' : 'Sanki buludun içində gəzirik!',
      isRain: false,
      isSnow: false,
    };
  }
  if (code >= 51 && code <= 55) {
    return {
      icon: '🌦️',
      name: isEn ? 'Gentle Drizzle' : 'Xırda Yağış',
      tip: isEn ? 'Tiny water droplets falling!' : 'Göydən xırda su damcıları süzülür!',
      isRain: true,
      isSnow: false,
    };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      icon: '🌧️',
      name: isEn ? 'Rainy Day' : 'Yağışlı Hava',
      tip: isEn ? 'Time for your colorful umbrella! ☔' : 'Rəngli çətirini götürməyin vaxtıdır! ☔',
      isRain: true,
      isSnow: false,
    };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      icon: '❄️',
      name: isEn ? 'Snowy Wonder!' : 'Möcüzəli Qar!',
      tip: isEn ? 'Catch snowflakes on your mittens! ⛄' : 'Qar adamı düzəltmək vaxtıdır! ⛄',
      isRain: false,
      isSnow: true,
    };
  }
  if (code >= 95) {
    return {
      icon: '⛈️',
      name: isEn ? 'Thunderstorm' : 'Şimşək və Tufan',
      tip: isEn ? 'Listen to the deep thunder roar!' : 'Şimşəyin səsini evdən dinlə!',
      isRain: true,
      isSnow: false,
    };
  }
  return {
    icon: '🌤️',
    name: isEn ? 'Pleasant Sky' : 'Mülayim Səma',
    tip: isEn ? 'Nice day for outdoor discovery!' : 'Kəşflər üçün gözəl bir gün!',
    isRain: false,
    isSnow: false,
  };
}

/**
 * Interpret wind speed for 7-year-old explorer
 */
export function getWindDescription(speed = 10, isEn = false) {
  if (speed < 12) {
    return {
      label: isEn ? 'Gentle Breeze 🍃' : 'Mehriban Meh 🍃',
      tip: isEn ? 'Leaves are whispering softly.' : 'Yarpaqlar sakitcə pıçıldayır.',
    };
  }
  if (speed <= 25) {
    return {
      label: isEn ? 'Playful Wind 🪁' : 'Uçurtma Küləyi 🪁',
      tip: isEn ? 'Great wind for flying kites!' : 'Uçurtma uçurtmaq üçün əla küləkdir!',
    };
  }
  return {
    label: isEn ? 'Breezy & Strong 💨' : 'Sürətli Külək 💨',
    tip: isEn ? 'Hold on to your hat!' : 'Papağını bərk tut!',
  };
}
