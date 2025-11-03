import { Suspense } from 'react';
import { GPWeatherCard } from '@/components/features/weather/gp-weather-card';
import { getNextRaceWeather, getUpcomingRacesWeather } from '@/lib/actions/weather';
import { LoadingCard } from '@/components/common/loading-card';
import { Calendar, TrendingUp } from 'lucide-react';
import { createSportsEventSchema } from '@/lib/utils/schema';

async function NextRaceSection() {
  const nextRaceWeather = await getNextRaceWeather();
  
  if (!nextRaceWeather) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-xl font-semibold text-muted-foreground">
          現在、開催予定のGPはありません
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <GPWeatherCard
        grandPrix={nextRaceWeather.grandPrix}
        sessionWeather={nextRaceWeather.sessionWeather}
        variant="featured"
        className="shadow-2xl"
      />
    </div>
  );
}

async function UpcomingRacesSection() {
  const upcomingRacesWeather = await getUpcomingRacesWeather(3);
  
  if (upcomingRacesWeather.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          今後の予定されているレースはありません
        </p>
      </div>
    );
  }

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
        {upcomingRacesWeather.map((raceWeather) => (
          <GPWeatherCard
            key={raceWeather.grandPrix.id}
            grandPrix={raceWeather.grandPrix}
            sessionWeather={raceWeather.sessionWeather}
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

export default async function Home() {
  // SportsEventスキーマ用のデータ取得
  const nextRaceWeather = await getNextRaceWeather();
  const upcomingRacesWeather = await getUpcomingRacesWeather(5);

  // 構造化データの生成
  const structuredDataArray = [];

  if (nextRaceWeather) {
    const raceSession = nextRaceWeather.sessionWeather?.find(s => s.session === 'race');
    const weatherInfo = raceSession?.weather;
    structuredDataArray.push(
      createSportsEventSchema(
        nextRaceWeather.grandPrix,
        weatherInfo ? {
          temperature: weatherInfo.temperature,
          precipitationProbability: weatherInfo.precipitationProbability
        } : undefined
      )
    );
  }

  upcomingRacesWeather.forEach(race => {
    const raceSession = race.sessionWeather?.find(s => s.session === 'race');
    const weatherInfo = raceSession?.weather;
    structuredDataArray.push(
      createSportsEventSchema(
        race.grandPrix,
        weatherInfo ? {
          temperature: weatherInfo.temperature,
          precipitationProbability: weatherInfo.precipitationProbability
        } : undefined
      )
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50/50 dark:to-slate-900/50">
      {/* 構造化データの埋め込み */}
      {structuredDataArray.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataArray.length === 1 ? structuredDataArray[0] : structuredDataArray)
          }}
        />
      )}

      <main className="container mx-auto px-4 py-0 md:py-12 space-y-16">
        {/* メインページタイトル - SEO最適化（視覚的には非表示） */}
        <section>
          <h1 className="sr-only">
            F1天気予報
          </h1>
          <p className="sr-only">
            次戦レースから今後のグランプリまで、F1全開催サーキットの正確な天気予報をリアルタイムでお届けします。
          </p>
        </section>

        {/* Next Race Section - H2で階層化（SEO用・視覚的には非表示） */}
        <section>
          <h2 className="sr-only">次戦レース</h2>
          <Suspense fallback={<LoadingSection title="次戦レース情報を読み込み中..." />}>
            <NextRaceSection />
          </Suspense>
        </section>

        {/* Upcoming Races Section - 既存のH2と統合 */}
        <Suspense fallback={<LoadingSection title="今後のレース情報を読み込み中..." />}>
          <UpcomingRacesSection />
        </Suspense>
      </main>
    </div>
  );
}
