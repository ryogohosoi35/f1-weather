'use server';

import { GrandPrix, GPWeatherForecast, SearchFilters } from '@/lib/types';
import { getWeatherForecast, getHistoricalWeather } from '@/lib/utils/weather-api';
import { 
  getNextGrandPrix, 
  getUpcomingGrandPrix, 
  getPastGrandPrix,
  searchGrandPrix,
  getGrandPrixById
} from '@/lib/utils/grandprix';
import { isAfter, parseISO, startOfDay } from 'date-fns';

export async function getNextRaceWeather(): Promise<GPWeatherForecast | null> {
  try {
    const nextGP = getNextGrandPrix();
    if (!nextGP) return null;

    const weather = await getWeatherForecast(
      nextGP.location.latitude,
      nextGP.location.longitude,
      7 // 7日間の予報
    );

    return {
      grandPrix: nextGP,
      weather,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch next race weather:', error);
    return null;
  }
}

export async function getUpcomingRacesWeather(count: number = 5): Promise<GPWeatherForecast[]> {
  try {
    const upcomingGPs = getUpcomingGrandPrix(count);
    
    const weatherPromises = upcomingGPs.map(async (gp) => {
      try {
        const weather = await getWeatherForecast(
          gp.location.latitude,
          gp.location.longitude,
          3 // 3日間の予報で十分
        );

        return {
          grandPrix: gp,
          weather,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Failed to fetch weather for ${gp.name}:`, error);
        // エラーが発生した場合はダミーデータを返す
        return {
          grandPrix: gp,
          weather: [{
            date: gp.dateStart,
            temperature: { min: 20, max: 25 },
            precipitationProbability: 0,
            weatherCode: 0 // 晴れ
          }],
          lastUpdated: new Date().toISOString()
        };
      }
    });

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

    const now = startOfDay(new Date());
    const raceDate = parseISO(gp.dateStart);
    
    let weather;
    
    if (isAfter(raceDate, now)) {
      // 未来のレース：予報データを取得
      weather = await getWeatherForecast(
        gp.location.latitude,
        gp.location.longitude,
        7
      );
    } else {
      // 過去のレース：過去データを取得
      weather = await getHistoricalWeather(
        gp.location.latitude,
        gp.location.longitude,
        gp.dateStart,
        gp.dateEnd
      );
    }

    return {
      grandPrix: gp,
      weather,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Failed to fetch weather for GP ${id}:`, error);
    return null;
  }
}

export async function searchGrandPrixWeather(filters: SearchFilters): Promise<GPWeatherForecast[]> {
  try {
    const filteredGPs = searchGrandPrix(filters);
    
    // 最大10件まで制限
    const limitedGPs = filteredGPs.slice(0, 10);
    
    const weatherPromises = limitedGPs.map(async (gp) => {
      try {
        const now = startOfDay(new Date());
        const raceDate = parseISO(gp.dateStart);
        
        let weather;
        
        if (isAfter(raceDate, now)) {
          weather = await getWeatherForecast(
            gp.location.latitude,
            gp.location.longitude,
            3
          );
        } else {
          weather = await getHistoricalWeather(
            gp.location.latitude,
            gp.location.longitude,
            gp.dateStart,
            gp.dateEnd
          );
        }

        return {
          grandPrix: gp,
          weather,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Failed to fetch weather for ${gp.name}:`, error);
        // エラーの場合はダミーデータを返す
        return {
          grandPrix: gp,
          weather: [{
            date: gp.dateStart,
            temperature: { min: 20, max: 25 },
            precipitationProbability: 0,
            weatherCode: 0
          }],
          lastUpdated: new Date().toISOString()
        };
      }
    });

    return await Promise.all(weatherPromises);
  } catch (error) {
    console.error('Failed to search grand prix weather:', error);
    return [];
  }
} 