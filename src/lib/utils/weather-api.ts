import { WeatherData } from '@/lib/types';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { getCurrentJstDate } from '@/lib/utils/date';

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weathercode: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_probability_max: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

interface OpenMeteoHistoricalResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weathercode: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherData[]> {
  // Open-Meteo forecast API is limited to about 16 days
  const forecastLimitInDays = 15;
  const now = startOfDay(getCurrentJstDate());
  const raceStartDate = startOfDay(parseISO(startDate));

  if (differenceInDays(raceStartDate, now) > forecastLimitInDays) {
    // If the race is too far in the future, return empty array
    // as forecast is not available yet.
    return [];
  }

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      start_date: startDate,
      end_date: endDate,
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`, {
      next: { revalidate: 3600 } // 1時間キャッシュ
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenMeteoResponse = await response.json();

    return data.daily.time.map((date, index) => ({
      date,
      temperature: {
        min: Math.round(data.daily.temperature_2m_min[index]),
        max: Math.round(data.daily.temperature_2m_max[index])
      },
      precipitationProbability: data.daily.precipitation_probability_max[index] || 0,
      weatherCode: data.daily.weathercode[index]
    }));
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error);
    throw error;
  }
}

export async function getHistoricalWeather(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherData[]> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      start_date: startDate,
      end_date: endDate,
      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      timezone: 'auto'
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}/historical?${params}`, {
      next: { revalidate: 86400 } // 24時間キャッシュ（過去データは変更されない）
    });

    if (!response.ok) {
      throw new Error(`Historical weather API error: ${response.status}`);
    }

    const data: OpenMeteoHistoricalResponse = await response.json();

    return data.daily.time.map((date, index) => ({
      date,
      temperature: {
        min: Math.round(data.daily.temperature_2m_min[index]),
        max: Math.round(data.daily.temperature_2m_max[index])
      },
      precipitationProbability: 0, // 過去データには降水確率がない
      weatherCode: data.daily.weathercode[index]
    }));
  } catch (error) {
    console.error('Failed to fetch historical weather:', error);
    throw error;
  }
} 