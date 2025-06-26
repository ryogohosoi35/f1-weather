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
}

export interface WeatherCondition {
  code: number;
  description: string;
  emoji: string;
  icon: string;
}

export interface GPWeatherForecast {
  grandPrix: GrandPrix;
  weather: WeatherData[];
  lastUpdated: string; // ISO date string
}

export interface SearchFilters {
  year?: number;
  country?: string;
  searchTerm?: string;
} 