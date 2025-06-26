import { WeatherCondition } from '@/lib/types';

// Open-Meteo weather codes mapping
export const WEATHER_CONDITIONS: Record<number, WeatherCondition> = {
  0: {
    code: 0,
    description: '快晴',
    emoji: '☀️',
    icon: 'sun'
  },
  1: {
    code: 1,
    description: '概ね晴れ',
    emoji: '🌤️',
    icon: 'sun-cloud'
  },
  2: {
    code: 2,
    description: '部分的曇り',
    emoji: '⛅',
    icon: 'cloud-sun'
  },
  3: {
    code: 3,
    description: '曇り',
    emoji: '☁️',
    icon: 'cloud'
  },
  45: {
    code: 45,
    description: '霧',
    emoji: '🌫️',
    icon: 'cloud-fog'
  },
  48: {
    code: 48,
    description: '霧氷',
    emoji: '🌫️',
    icon: 'cloud-fog'
  },
  51: {
    code: 51,
    description: '軽い霧雨',
    emoji: '🌦️',
    icon: 'cloud-drizzle'
  },
  53: {
    code: 53,
    description: '霧雨',
    emoji: '🌦️',
    icon: 'cloud-drizzle'
  },
  55: {
    code: 55,
    description: '激しい霧雨',
    emoji: '🌧️',
    icon: 'cloud-rain'
  },
  61: {
    code: 61,
    description: '軽い雨',
    emoji: '🌦️',
    icon: 'cloud-rain'
  },
  63: {
    code: 63,
    description: '雨',
    emoji: '🌧️',
    icon: 'cloud-rain'
  },
  65: {
    code: 65,
    description: '激しい雨',
    emoji: '⛈️',
    icon: 'cloud-lightning'
  },
  71: {
    code: 71,
    description: '軽い雪',
    emoji: '🌨️',
    icon: 'cloud-snow'
  },
  73: {
    code: 73,
    description: '雪',
    emoji: '❄️',
    icon: 'cloud-snow'
  },
  75: {
    code: 75,
    description: '激しい雪',
    emoji: '❄️',
    icon: 'cloud-snow'
  },
  80: {
    code: 80,
    description: 'にわか雨',
    emoji: '🌦️',
    icon: 'cloud-rain'
  },
  81: {
    code: 81,
    description: '激しいにわか雨',
    emoji: '⛈️',
    icon: 'cloud-lightning'
  },
  82: {
    code: 82,
    description: '非常に激しいにわか雨',
    emoji: '⛈️',
    icon: 'cloud-lightning'
  },
  95: {
    code: 95,
    description: '雷雨',
    emoji: '⛈️',
    icon: 'cloud-lightning'
  },
  96: {
    code: 96,
    description: 'ひょうを伴う雷雨',
    emoji: '⛈️',
    icon: 'cloud-lightning'
  },
  99: {
    code: 99,
    description: '激しいひょうを伴う雷雨',
    emoji: '⛈️',
    icon: 'cloud-lightning'
  }
};

export const getWeatherCondition = (code: number): WeatherCondition => {
  return WEATHER_CONDITIONS[code] || {
    code,
    description: '不明',
    emoji: '❓',
    icon: 'help-circle'
  };
}; 