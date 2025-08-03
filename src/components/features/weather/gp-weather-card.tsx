"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherIcon } from '@/components/common/weather-icon';
import { GrandPrix, SessionWeather } from '@/lib/types';
import { getWeatherCondition } from '@/lib/constants/weather';
import { formatGrandPrixDateRange } from '@/lib/utils/grandprix';
import { CalendarDays, MapPin, Thermometer, CloudRain, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useEffect, useState } from 'react';

interface GPWeatherCardProps {
  grandPrix: GrandPrix;
  sessionWeather: SessionWeather[];
  variant?: 'featured' | 'compact';
  className?: string;
}

const sessionDisplayInfo: Record<keyof GrandPrix['sessions'], { name: string; color: string; shortName: string; }> = {
  fp1: { name: 'フリー走行1', color: 'text-sky-600', shortName: 'FP1' },
  fp2: { name: 'フリー走行2', color: 'text-sky-600', shortName: 'FP2' },
  fp3: { name: 'フリー走行3', color: 'text-sky-600', shortName: 'FP3' },
  sprintQualifying: { name: 'スプリント予選', color: 'text-purple-600', shortName: 'SQ' },
  sprint: { name: 'スプリント', color: 'text-pink-600', shortName: 'Sprint' },
  qualifying: { name: '予選', color: 'text-yellow-600', shortName: 'Q' },
  race: { name: '決勝', color: 'text-red-600', shortName: 'Race' },
};

export function GPWeatherCard({ 
  grandPrix, 
  sessionWeather, 
  variant = 'compact',
  className 
}: GPWeatherCardProps) {
  const [timeZone, setTimeZone] = useState('UTC');

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);
  const raceSession = sessionWeather.find(s => s.session === 'race');
  const isForecastAvailable = !!raceSession && !!raceSession.weather;
  const condition = isForecastAvailable ? getWeatherCondition(raceSession.weather!.weatherCode) : null;
  const isFeatured = variant === 'featured';

  const orderedSessions = [
    'fp1', 'fp2', 'fp3', 'sprintQualifying', 'sprint', 'qualifying', 'race'
  ];

  const availableSessions = orderedSessions
    .map(sessionKey => sessionWeather.find(s => s.session === sessionKey))
    .filter((s): s is SessionWeather => !!s);

  return (
    <Card className={cn(
      'relative overflow-hidden f1-card-shadow f1-card-hover border-border',
      isFeatured 
        ? 'ring-2 ring-red-500/50 bg-red-50 dark:bg-red-950/20'
        : 'bg-card/80 backdrop-blur-sm',
      className
    )}>
      <CardHeader className={cn(
        'relative pb-3',
        isFeatured ? 'pb-4' : ''
      )}>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {isFeatured && (
                <Trophy className="h-5 w-5 text-yellow-500" />
              )}
              <CardTitle className={cn(
                'font-bold text-foreground leading-tight',
                isFeatured ? 'text-2xl md:text-3xl f1-text-gradient' : 'text-lg'
              )}>
                {grandPrix.name}
              </CardTitle>
            </div>
            <p className={cn(
              'text-muted-foreground font-medium',
              isFeatured ? 'text-base' : 'text-sm'
            )}>
              {grandPrix.circuitName}
            </p>
          </div>
          {isFeatured && (
            <Badge variant="secondary" className="ml-2 whitespace-nowrap bg-red-600 text-white hover:bg-red-700 font-semibold">
              NEXT RACE
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-red-500" />
            <span className="font-medium">{formatGrandPrixDateRange(grandPrix)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{grandPrix.location.city}, {grandPrix.location.country}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {isForecastAvailable && raceSession.weather && condition ? (
          <>
            <div className={cn(
              'flex items-center justify-between p-4 rounded-xl',
              isFeatured 
                ? 'bg-background/50 border border-border' 
                : 'bg-background/30'
            )}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <WeatherIcon 
                    weatherCode={raceSession.weather.weatherCode}
                    size={isFeatured ? 'xl' : 'lg'}
                    showEmoji={isFeatured}
                  />
                </div>
                <div>
                  <p className={cn(
                    'font-bold text-foreground',
                    isFeatured ? 'text-xl mb-1' : 'text-base'
                  )}>
                    {condition.description}
                    <span className="text-red-600 ml-2 font-semibold">(決勝)</span>
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">
                        {raceSession.weather.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CloudRain className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{raceSession.weather.precipitationProbability}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isFeatured && (
                <div className="text-right">
                  <div className="text-4xl font-bold f1-text-gradient">
                    {raceSession.weather.temperature}°C
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">決勝セッション気温</div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-sm text-foreground">セッション別予報</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableSessions.map((session) => {
                  if (!session.weather) return null;
                  const date = parseISO(session.time);
                  const info = sessionDisplayInfo[session.session];
                  const formattedTime = timeZone === 'Asia/Tokyo' 
                    ? formatInTimeZone(date, 'Asia/Tokyo', 'HH:mm')
                    : format(date, 'HH:mm');

                  return (
                    <div 
                      key={session.session}
                      className={cn(
                        "p-3 rounded-xl border transition-all duration-200 hover:scale-105",
                        session.session === 'race' 
                          ? "bg-red-100/70 border-red-200 dark:bg-red-950/20 dark:border-red-800/30" 
                          : "bg-background/50 border-border"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <WeatherIcon 
                          weatherCode={session.weather.weatherCode}
                          size="sm"
                        />
                        <div className="flex-1">
                          <div className='flex justify-between items-baseline'>
                            <div className={cn("font-semibold text-xs", info.color)}>
                              {info.name}
                            </div>
                            <div className='text-xs text-muted-foreground font-medium'>
                              {formattedTime}
                              {timeZone === 'Asia/Tokyo' && <span className="text-[10px] ml-1">JST</span>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-muted-foreground font-bold text-lg">
                              {session.weather.temperature}°C
                            </span>
                            <span className="text-blue-600 font-medium">
                              💧 {session.weather.precipitationProbability}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 min-h-[150px] rounded-xl bg-background/50">
            <Clock className="w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-foreground">天気予報は準備中です</h3>
            <p className="text-sm text-muted-foreground">レース日が近づくと更新されます。</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
