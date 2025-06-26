import { Suspense } from 'react';
import { GPWeatherCard } from '@/components/features/weather/gp-weather-card';
import { getWeatherForecast } from '@/lib/utils/weather-api';
import { getNextGrandPrix, getUpcomingGrandPrix } from '@/lib/utils/grandprix';
import { LoadingCard } from '@/components/common/loading-card';
import { Zap, Calendar, TrendingUp, Heart, ExternalLink, Twitter } from 'lucide-react';

async function NextRaceSection() {
  const nextGP = getNextGrandPrix();
  
  if (!nextGP) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          現在、開催予定のGPはありません
        </h2>
      </div>
    );
  }

  const weather = await getWeatherForecast(
    nextGP.location.latitude,
    nextGP.location.longitude,
    nextGP.dateStart,
    nextGP.dateEnd
  );

  return (
    <section>
      <div className="max-w-4xl mx-auto">
        <GPWeatherCard 
          grandPrix={nextGP} 
          weather={weather} 
          variant="featured"
          className="shadow-2xl"
        />
      </div>
    </section>
  );
}

async function UpcomingRacesSection() {
  const upcomingGPs = getUpcomingGrandPrix(3);
  
  if (upcomingGPs.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          今後の予定されているレースはありません
        </p>
      </div>
    );
  }

  const weatherPromises = upcomingGPs.map(gp =>
    getWeatherForecast(
      gp.location.latitude,
      gp.location.longitude,
      gp.dateStart,
      gp.dateEnd
    )
  );
  
  const weatherResults = await Promise.all(weatherPromises);

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-1 h-6 bg-red-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-foreground">
            今後のレース予定
          </h2>
          <div className="w-1 h-6 bg-red-500 rounded-full"></div>
        </div>
        <p className="text-muted-foreground">
          レースカレンダーと各開催地の天気予報をチェック
        </p>
      </div>

      <div className="grid gap-8">
        {upcomingGPs.map((gp, index) => (
          <GPWeatherCard
            key={gp.id}
            grandPrix={gp}
            weather={weatherResults[index]}
            variant="compact"
            className="f1-card-hover"
          />
        ))}
      </div>
    </section>
  );
}

function LoadingSection({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <div className="w-12 h-1 bg-red-500 mx-auto rounded-full"></div>
      </div>
      <LoadingCard />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50/50 dark:to-slate-900/50">
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Next Race Section */}
        <Suspense fallback={<LoadingSection title="次戦レース情報を読み込み中..." />}>
          <NextRaceSection />
        </Suspense>

        {/* Upcoming Races Section */}
        <Suspense fallback={<LoadingSection title="今後のレース情報を読み込み中..." />}>
          <UpcomingRacesSection />
        </Suspense>
      </main>
    </div>
  );
}
