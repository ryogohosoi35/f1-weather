export interface GrandPrix {
  id: string;
  name: string;
  circuitName: string;
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  dateStart: string; // ISO date string
  dateEnd: string; // ISO date string
  round: number;
  season: number;
  sessions: {
    fp1: string;
    fp2?: string;
    fp3?: string;
    sprintQualifying?: string;
    qualifying: string;
    sprint?: string;
    race: string;
  };
}

export interface HourlyWeatherData {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface WeatherData {
  date: string; // ISO date string
  temperature: {
    min: number;
    max: number;
    current?: number;
  };
  precipitationProbability: number; // 0-100
  weatherCode: number; // Open-Meteo weather code
  windSpeed?: number;
  humidity?: number;
  hourly?: HourlyWeatherData[];
}

export interface WeatherCondition {
  code: number;
  description: string;
  emoji: string;
  icon: string;
}

export interface SessionWeather {
  session: keyof GrandPrix['sessions'];
  time: string;
  weather: HourlyWeatherData | null;
}

export interface GPWeatherForecast {
  grandPrix: GrandPrix;
  sessionWeather: SessionWeather[];
  lastUpdated: string; // ISO date string
}

export interface SearchFilters {
  year?: number;
  country?: string;
  searchTerm?: string;
}
