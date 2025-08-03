import { WeatherData, HourlyWeatherData } from '@/lib/types';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

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
  hourly_units?: {
    time: string;
    temperature_2m: string;
    precipitation_probability?: string;
    weathercode: string;
  },
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability?: number[];
    weathercode: number[];
  }
}

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

function processWeatherData(data: OpenMeteoResponse): WeatherData[] {
    const dailyData: WeatherData[] = data.daily.time.map((date, index) => ({
        date,
        temperature: {
          min: Math.round(data.daily.temperature_2m_min[index]),
          max: Math.round(data.daily.temperature_2m_max[index])
        },
        precipitationProbability: data.daily.precipitation_probability_max?.[index] ?? 0,
        weatherCode: data.daily.weathercode[index],
        hourly: []
      }));
  
      if (data.hourly && data.hourly.time && data.hourly.time.length > 0) {
        data.hourly.time.forEach((time, index) => {
          const date = time.split('T')[0];
          const daily = dailyData.find(d => d.date === date);
          if (daily) {
            const hourlyWeather: HourlyWeatherData = {
              time,
              temperature: Math.round(data.hourly!.temperature_2m[index]),
              precipitationProbability: data.hourly!.precipitation_probability?.[index] ?? 0,
              weatherCode: data.hourly!.weathercode![index]
            };
            if (daily.hourly) {
              daily.hourly.push(hourlyWeather);
            } else {
              daily.hourly = [hourlyWeather];
            }
          }
        });
      }
      return dailyData;
}


export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherData[]> {
  const forecastLimitInDays = 15;
  const now = startOfDay(new Date());
  const raceStartDate = startOfDay(parseISO(startDate));

  if (differenceInDays(raceStartDate, now) > forecastLimitInDays) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      hourly: 'temperature_2m,precipitation_probability,weathercode',
      timezone: 'auto',
      start_date: startDate,
      end_date: endDate,
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenMeteoResponse = await response.json();
    return processWeatherData(data);

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
      hourly: 'temperature_2m,weathercode,precipitation_probability',
      timezone: 'auto'
    });

    const url = `${OPEN_METEO_BASE_URL}/archive?${params}`;
    const response = await fetch(url, {
      next: { revalidate: 86400 }
    });
    
    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Historical weather API error response:', errorBody);
        throw new Error(`Historical weather API error: ${response.status} - ${errorBody}`);
    }

    const data: OpenMeteoResponse = await response.json();
    return processWeatherData(data);

  } catch (error) {
    console.error('Failed to fetch historical weather:', error);
    throw error;
  }
}
