'use server';

import { GPWeatherForecast, SearchFilters, GrandPrix, SessionWeather, HourlyWeatherData } from '@/lib/types';
import { getWeatherForecast, getHistoricalWeather } from '@/lib/utils/weather-api';
import { 
  getNextGrandPrix, 
  getUpcomingGrandPrix, 
  searchGrandPrix,
  getGrandPrixById
} from '@/lib/utils/grandprix';
import { isAfter, parseISO, differenceInMinutes } from 'date-fns';

function findClosestWeatherForSession(sessionTime: string, weatherData: import("@/lib/types").WeatherData[]): HourlyWeatherData | null {
  const sessionDate = parseISO(sessionTime);
  const relevantDailyWeather = weatherData.find(d => d.date === sessionTime.split('T')[0]);

  if (!relevantDailyWeather || !relevantDailyWeather.hourly) {
    return null;
  }

  let closestWeather: HourlyWeatherData | null = null;
  let smallestDiff = Infinity;

  for (const hourly of relevantDailyWeather.hourly) {
    const hourlyDate = parseISO(hourly.time);
    const diff = Math.abs(differenceInMinutes(sessionDate, hourlyDate));

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestWeather = hourly;
    }
  }

  return closestWeather;
}

async function fetchWeatherForGP(gp: GrandPrix): Promise<GPWeatherForecast> {
  const now = new Date();
  const raceDate = parseISO(gp.sessions.race);

  let weather;
  if (isAfter(raceDate, now)) {
    weather = await getWeatherForecast(
      gp.location.latitude,
      gp.location.longitude,
      gp.dateStart,
      gp.dateEnd
    );
  } else {
    weather = await getHistoricalWeather(
      gp.location.latitude,
      gp.location.longitude,
      gp.dateStart,
      gp.dateEnd
    );
  }

  const sessionWeather: SessionWeather[] = (Object.keys(gp.sessions) as Array<keyof GrandPrix['sessions']>)
    .map(sessionKey => {
      const sessionTime = gp.sessions[sessionKey];
      if(!sessionTime) return null;
      
      return {
        session: sessionKey,
        time: sessionTime,
        weather: findClosestWeatherForSession(sessionTime, weather)
      };
    })
    .filter((sw): sw is SessionWeather => sw !== null);

  return {
    grandPrix: gp,
    sessionWeather,
    lastUpdated: new Date().toISOString()
  };
}

export async function getNextRaceWeather(): Promise<GPWeatherForecast | null> {
  try {
    const nextGP = getNextGrandPrix();
    if (!nextGP) return null;
    return await fetchWeatherForGP(nextGP);
  } catch (error) {
    console.error('Failed to fetch next race weather:', error);
    return null;
  }
}

export async function getUpcomingRacesWeather(count: number = 5): Promise<GPWeatherForecast[]> {
  try {
    const upcomingGPs = getUpcomingGrandPrix(count);
    const weatherPromises = upcomingGPs.map(gp => fetchWeatherForGP(gp));
    return await Promise.all(weatherPromises);
  } catch (error) {
    console.error('Failed to fetch upcoming races weather:', error);
    return [];
  }
}

export async function getGrandPrixWeather(id: string): Promise<GPWeatherForecast | null> {
  try {
    const gp = getGrandPrixById(id);
    if (!gp) return null;
    return await fetchWeatherForGP(gp);
  } catch (error) {
    console.error(`Failed to fetch weather for GP ${id}:`, error);
    return null;
  }
}

export async function searchGrandPrixWeather(filters: SearchFilters): Promise<GPWeatherForecast[]> {
  try {
    const filteredGPs = searchGrandPrix(filters);
    const limitedGPs = filteredGPs.slice(0, 10);
    const weatherPromises = limitedGPs.map(gp => fetchWeatherForGP(gp));
    return await Promise.all(weatherPromises);
  } catch (error) {
    console.error('Failed to search grand prix weather:', error);
    return [];
  }
}
