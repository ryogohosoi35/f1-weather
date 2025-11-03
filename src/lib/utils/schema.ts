import { GrandPrix } from '@/lib/types';

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

  const schema: SportsEventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${siteUrl}#${grandPrix.id}`,
    "name": grandPrix.name,
    "description": `${grandPrix.name} - ${grandPrix.circuitName}で開催されるFormula 1レース`,
    "startDate": grandPrix.dateStart,
    "endDate": grandPrix.dateEnd,
    "eventStatus": "https://schema.org/EventScheduled",
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

    if (grandPrix.sessions.fp1) {
      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${grandPrix.name} - フリー走行1`,
        "startDate": grandPrix.sessions.fp1
      });
    }

    if (grandPrix.sessions.fp2) {
      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${grandPrix.name} - フリー走行2`,
        "startDate": grandPrix.sessions.fp2
      });
    }

    if (grandPrix.sessions.fp3) {
      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${grandPrix.name} - フリー走行3`,
        "startDate": grandPrix.sessions.fp3
      });
    }

    if (grandPrix.sessions.sprintQualifying) {
      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${grandPrix.name} - スプリント予選`,
        "startDate": grandPrix.sessions.sprintQualifying
      });
    }

    if (grandPrix.sessions.sprint) {
      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${grandPrix.name} - スプリント`,
        "startDate": grandPrix.sessions.sprint
      });
    }

    if (grandPrix.sessions.qualifying) {
      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${grandPrix.name} - 予選`,
        "startDate": grandPrix.sessions.qualifying
      });
    }

    if (grandPrix.sessions.race) {
      subEvents.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${grandPrix.name} - 決勝`,
        "startDate": grandPrix.sessions.race
      });
    }

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

  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "@id": `${siteUrl}#f1-2025-season`,
    "name": "Formula 1 2025年シーズン",
    "description": "2025年のFormula 1世界選手権の全レース",
    "startDate": races[0]?.dateStart || "2025-03-14",
    "endDate": races[races.length - 1]?.dateEnd || "2025-12-07",
    "organizer": {
      "@type": "Organization",
      "name": "Formula 1",
      "url": "https://www.formula1.com"
    },
    "subEvent": races.map(race => createSportsEventSchema(race, undefined, siteUrl))
  };
}