import { GrandPrix } from '@/lib/types';

// SportsEventで繰り返し利用するOffer定義
interface SportsEventOffer {
  '@type': 'Offer';
  url: string;
  price: number;
  priceCurrency: string;
  availability: string;
  validFrom?: string;
}

// SportsEventで繰り返し利用するPerformer定義
interface SportsEventPerformer {
  '@type': string;
  name: string;
}

// Schema.org の型定義
interface SportsEventSchema {
  '@context': string;
  '@type': string;
  '@id'?: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventStatus?: string;
  eventAttendanceMode?: string;
  image?: string | string[];
  performer?: SportsEventPerformer | SportsEventPerformer[];
  offers?: SportsEventOffer | SportsEventOffer[];
  location?: {
    '@type': string;
    name: string;
    address?: {
      '@type': string;
      addressLocality?: string;
      addressCountry?: string;
    };
    geo?: {
      '@type': string;
      latitude: number;
      longitude: number;
    };
  };
  organizer?: {
    '@type': string;
    name: string;
    url?: string;
  };
  sport?: string;
  competitionSeason?: string;
  additionalProperty?: Array<{
    '@type': string;
    name: string;
    value: string;
  }>;
  subEvent?: SportsEventSchema[];
}

const DEFAULT_EVENT_IMAGE_PATH = 'og-default.jpg';

// セッションごとの名称・説明・推定所要時間。Google向けに最小限の文脈を提供する。
const SESSION_METADATA: Partial<Record<keyof GrandPrix['sessions'], {
  label: string;
  description: string;
  durationMinutes: number;
}>> = {
  fp1: {
    label: 'フリー走行1',
    description: 'レース週末の初日に実施される公式プラクティスセッションです。',
    durationMinutes: 60
  },
  fp2: {
    label: 'フリー走行2',
    description: '週末2本目のプラクティスであり、ロングランとセットアップ確認を行います。',
    durationMinutes: 60
  },
  fp3: {
    label: 'フリー走行3',
    description: '予選前に最後の調整を行う60分間のプラクティスセッションです。',
    durationMinutes: 60
  },
  sprintQualifying: {
    label: 'スプリント予選',
    description: 'スプリントフォーマット採用時に決勝グリッドを決める短時間の予選セッションです。',
    durationMinutes: 45
  },
  sprint: {
    label: 'スプリント',
    description: '日曜決勝とは別に結果へポイントが付与される短距離レースです。',
    durationMinutes: 60
  },
  qualifying: {
    label: '予選',
    description: '決勝グリッドを決定するQ1からQ3までのノックアウト形式セッションです。',
    durationMinutes: 90
  },
  race: {
    label: '決勝',
    description: 'グランプリ週末のメインイベントである決勝レースです。',
    durationMinutes: 150
  }
};

// ISO8601文字列に概算の終了時刻を付与する。失敗時は開始時刻を返して破綻を避ける。
function calculateEndDate(start: string, durationMinutes: number): string {
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) {
    return start;
  }
  startDate.setMinutes(startDate.getMinutes() + durationMinutes);
  return startDate.toISOString();
}

// サイトURLをスキーマ用途に正規化し、末尾にスラッシュを必ず残す。
function normalizeSiteUrl(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * Formula 1 レースのSportsEventスキーマを生成する
 *
 * @param grandPrix - レース情報
 * @param weather - 天気情報（オプショナル）
 * @param baseUrl - サイトのベースURL（オプショナル、デフォルトは環境変数またはf1weathers.com）
 * @returns SportsEvent構造化データ
 */
export function createSportsEventSchema(
  grandPrix: GrandPrix,
  weather?: {
    temperature?: number;
    precipitationProbability?: number;
    conditions?: string;
  },
  baseUrl?: string
): SportsEventSchema {
  // ベースURLの決定：引数 > 環境変数 > デフォルト値
  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://f1weathers.com';
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const imageUrl = `${normalizedSiteUrl}${DEFAULT_EVENT_IMAGE_PATH}`;
  const eventAnchorUrl = `${normalizedSiteUrl}#${grandPrix.id}`;

  const performer: SportsEventPerformer = {
    "@type": "SportsOrganization",
    "name": "Formula 1 Teams"
  };

  const baseOffer: SportsEventOffer = {
    "@type": "Offer",
    "url": `${normalizedSiteUrl}?race=${grandPrix.id}`,
    "price": 0,
    "priceCurrency": "JPY",
    "availability": "https://schema.org/InStock",
    "validFrom": grandPrix.dateStart
  };

  const schema: SportsEventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": eventAnchorUrl,
    "name": grandPrix.name,
    "description": `${grandPrix.name} - ${grandPrix.circuitName}で開催されるFormula 1レース`,
    "startDate": grandPrix.dateStart,
    "endDate": grandPrix.dateEnd,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": imageUrl,
    "performer": performer,
    "offers": baseOffer,
    "location": {
      "@type": "Place",
      "name": grandPrix.circuitName,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": grandPrix.location.city,
        "addressCountry": grandPrix.location.country
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": grandPrix.location.latitude,
        "longitude": grandPrix.location.longitude
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "Formula 1",
      "url": "https://www.formula1.com"
    },
    "sport": "Formula 1 Racing",
    "competitionSeason": grandPrix.season.toString()
  };

  // 天気情報がある場合は追加プロパティとして含める
  if (weather) {
    schema.additionalProperty = [];

    if (weather.temperature !== undefined) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "気温",
        "value": `${weather.temperature}°C`
      });
    }

    if (weather.precipitationProbability !== undefined) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "降水確率",
        "value": `${weather.precipitationProbability}%`
      });
    }

    if (weather.conditions) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "天気状況",
        "value": weather.conditions
      });
    }
  }

  // セッション情報を追加
  if (grandPrix.sessions) {
    const subEvents: SportsEventSchema[] = [];

    (Object.entries(grandPrix.sessions) as Array<[keyof GrandPrix['sessions'], string | undefined]>).forEach(([sessionKey, start]) => {
      if (!start) {
        return;
      }
      const metadata = SESSION_METADATA[sessionKey];
      const label = metadata?.label ?? sessionKey;
      const description = metadata?.description ?? `${grandPrix.name} の ${label} セッションです。`;
      const duration = metadata?.durationMinutes ?? 60;

      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "@id": `${eventAnchorUrl}-${sessionKey}`,
        "name": `${grandPrix.name} - ${label}`,
        "description": description,
        "startDate": start,
        "endDate": calculateEndDate(start, duration),
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "image": imageUrl,
        "performer": performer,
        "offers": {
          ...baseOffer,
          "validFrom": start
        },
        "location": schema.location,
        "organizer": schema.organizer
      });
    });

    if (subEvents.length > 0) {
      schema.subEvent = subEvents;
    }
  }

  return schema;
}

/**
 * 複数のレースのSportsEventスキーマをまとめて生成する
 *
 * @param races - レース情報の配列
 * @param baseUrl - サイトのベースURL（オプショナル、デフォルトは環境変数またはf1weathers.com）
 * @returns EventSeriesとSportsEventの構造化データ
 */
export function createEventSeriesSchema(races: GrandPrix[], baseUrl?: string) {
  // ベースURLの決定：引数 > 環境変数 > デフォルト値
  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://f1weathers.com';
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "@id": `${normalizedSiteUrl}#f1-2025-season`,
    "name": "Formula 1 2025年シーズン",
    "description": "2025年のFormula 1世界選手権の全レース",
    "startDate": races[0]?.dateStart || "2025-03-14",
    "endDate": races[races.length - 1]?.dateEnd || "2025-12-07",
    "organizer": {
      "@type": "Organization",
      "name": "Formula 1",
      "url": "https://www.formula1.com"
    },
    "subEvent": races.map(race => createSportsEventSchema(race, undefined, normalizedSiteUrl))
  };
}
