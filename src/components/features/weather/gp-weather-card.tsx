import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherIcon } from '@/components/common/weather-icon';
import { GrandPrix, WeatherData } from '@/lib/types';
import { getWeatherCondition } from '@/lib/constants/weather';
import { formatGrandPrixDateRange } from '@/lib/utils/grandprix';
import { CalendarDays, MapPin, Thermometer, CloudRain, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

interface GPWeatherCardProps {
  grandPrix: GrandPrix;
  weather: WeatherData[];
  variant?: 'featured' | 'compact';
  className?: string;
}

export function GPWeatherCard({ 
  grandPrix, 
  weather, 
  variant = 'compact',
  className 
}: GPWeatherCardProps) {
  const raceDayWeather = weather.find(w => w.date === grandPrix.dateEnd) || weather[weather.length - 1] || weather[0];
  const isForecastAvailable = !!raceDayWeather;

  const condition = isForecastAvailable ? getWeatherCondition(raceDayWeather.weatherCode) : null;
  const isFeatured = variant === 'featured';

  const weekendWeather = isForecastAvailable ? [
    weather.find(w => format(parseISO(w.date), 'yyyy-MM-dd') === grandPrix.dateStart),
    weather.find(w => format(parseISO(w.date), 'yyyy-MM-dd') === format(new Date(grandPrix.dateStart).setDate(new Date(grandPrix.dateStart).getDate() + 1), 'yyyy-MM-dd')),
    weather.find(w => format(parseISO(w.date), 'yyyy-MM-dd') === grandPrix.dateEnd)
  ].filter(Boolean) as WeatherData[] : [];

  return (
    <Card className={cn(
      'relative overflow-hidden f1-card-shadow f1-card-hover border-0',
      isFeatured 
        ? 'ring-2 ring-red-500/20 bg-gradient-to-br from-white via-red-50/30 to-orange-50/20 dark:from-slate-900 dark:via-red-950/30 dark:to-orange-950/20' 
        : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm',
      className
    )}>
      {isFeatured && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 rounded-lg"></div>
      )}
      
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
        {isForecastAvailable && raceDayWeather && condition ? (
          <>
            <div className={cn(
              'flex items-center justify-between p-4 rounded-xl',
              isFeatured 
                ? 'bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-red-100 dark:border-red-900/30' 
                : 'bg-slate-50/70 dark:bg-slate-800/50'
            )}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <WeatherIcon 
                    weatherCode={raceDayWeather.weatherCode}
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
                        {raceDayWeather.temperature.min}°C / <span className="text-red-600">{raceDayWeather.temperature.max}°C</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CloudRain className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{raceDayWeather.precipitationProbability}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isFeatured && (
                <div className="text-right">
                  <div className="text-4xl font-bold f1-text-gradient">
                    {Math.round((raceDayWeather.temperature.min + raceDayWeather.temperature.max) / 2)}°C
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">決勝日 平均気温</div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-sm text-foreground">レースウィークエンド予報</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {weekendWeather.map((day, index) => {
                  if (!day) return null;
                  const date = parseISO(day.date);
                  
                  const dayNames = ['金曜日 (FP)', '土曜日 (予選)', '日曜日 (決勝)'];
                  const dayColors = ['text-blue-600', 'text-yellow-600', 'text-red-600'];
                  
                  return (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200 hover:scale-105",
                        index === 2 
                          ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200 dark:from-red-950/30 dark:to-orange-950/30 dark:border-red-800/30" 
                          : "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 dark:from-slate-800 dark:to-blue-950/30 dark:border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <WeatherIcon 
                          weatherCode={day.weatherCode}
                          size="md"
                          showEmoji
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-sm">
                              {format(date, 'M/d')} ({format(date, 'eee', { locale: ja })})
                            </div>
                            <div className={cn("text-xs font-bold", dayColors[index])}>
                              {day.temperature.max}°
                            </div>
                          </div>
                          <div className={cn("text-xs font-medium mb-1", dayColors[index])}>
                            {dayNames[index]}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {day.temperature.min}° - {day.temperature.max}°
                            </span>
                            <span className="text-blue-600 font-medium">
                              💧 {day.precipitationProbability}%
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
          <div className="flex flex-col items-center justify-center text-center p-4 min-h-[150px] rounded-xl bg-slate-50/70 dark:bg-slate-800/50">
            <Clock className="w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-foreground">天気予報は準備中です</h3>
            <p className="text-sm text-muted-foreground">レース日が近づくと更新されます。</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 