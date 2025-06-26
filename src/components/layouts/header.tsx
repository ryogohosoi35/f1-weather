import { CloudSun, Flag } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/95">
      <div className="absolute inset-x-0 top-0 h-1 f1-gradient"></div>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Flag className="h-7 w-7 text-red-600" />
            <CloudSun className="h-4 w-4 text-blue-500 absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight f1-text-gradient">
              F1天気予報
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">
              Formula 1 Weather Forecast
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs font-medium text-red-600 dark:text-red-400">
            LIVE FORECAST
          </div>
          <div className="text-xs text-muted-foreground">
            Powered by Open-Meteo
          </div>
        </div>
      </div>
    </header>
  );
} 