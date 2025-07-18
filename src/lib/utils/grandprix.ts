import { GrandPrix, SearchFilters } from '@/lib/types';
import { GRANDPRIX_2024 } from '@/data/grandprix-2024';
import { GRANDPRIX_2025 } from '@/data/grandprix-2025';
import { isAfter, isBefore, parseISO, startOfDay } from 'date-fns';

const ALL_GRAND_PRIX = [...GRANDPRIX_2024, ...GRANDPRIX_2025];

// --- 日付シミュレーション ---
// ユーザーの要求に応じて現在日付を2025/06/26に設定
const SIMULATED_DATE = '2025-06-26T12:00:00+09:00'; 
// -------------------------

function getJstNow(): Date {
  // シミュレーション日付が設定されている場合はそれを使用
  if (process.env.NODE_ENV === 'development' && SIMULATED_DATE) {
    return new Date(SIMULATED_DATE);
  }
  const now = new Date();
  const jstOffset = 9 * 60; // JSTはUTC+9時間
  return new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60000);
}

export function getAllGrandPrix(): GrandPrix[] {
  return ALL_GRAND_PRIX;
}

export function getNextGrandPrix(): GrandPrix | null {
  const now = startOfDay(getJstNow());
  
  const upcoming = ALL_GRAND_PRIX
    .filter(gp => isAfter(parseISO(gp.dateStart), now) || isAfter(parseISO(gp.dateEnd), now))
    .sort((a, b) => parseISO(a.dateStart).getTime() - parseISO(b.dateStart).getTime());
  
  return upcoming[0] || null;
}

export function getUpcomingGrandPrix(count: number = 5): GrandPrix[] {
  const now = startOfDay(getJstNow());
  
  return ALL_GRAND_PRIX
    .filter(gp => isAfter(parseISO(gp.dateStart), now) || isAfter(parseISO(gp.dateEnd), now))
    .sort((a, b) => parseISO(a.dateStart).getTime() - parseISO(b.dateStart).getTime())
    .slice(1, count + 1); // 次回以降のレースを取得するためslice(1, ...)に変更
}

export function getPastGrandPrix(): GrandPrix[] {
  const now = startOfDay(getJstNow());
  
  return ALL_GRAND_PRIX
    .filter(gp => isBefore(parseISO(gp.dateEnd), now))
    .sort((a, b) => parseISO(b.dateStart).getTime() - parseISO(a.dateStart).getTime());
}

export function getGrandPrixById(id: string): GrandPrix | null {
  return ALL_GRAND_PRIX.find(gp => gp.id === id) || null;
}

export function searchGrandPrix(filters: SearchFilters): GrandPrix[] {
  let results = ALL_GRAND_PRIX;

  if (filters.year) {
    results = results.filter(gp => gp.season === filters.year);
  }

  if (filters.country) {
    results = results.filter(gp => 
      gp.location.country.toLowerCase().includes(filters.country!.toLowerCase())
    );
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    results = results.filter(gp => 
      gp.name.toLowerCase().includes(term) ||
      gp.circuitName.toLowerCase().includes(term) ||
      gp.location.country.toLowerCase().includes(term) ||
      gp.location.city.toLowerCase().includes(term)
    );
  }

  return results.sort((a, b) => parseISO(a.dateStart).getTime() - parseISO(b.dateStart).getTime());
}

export function getAvailableYears(): number[] {
  const years = Array.from(new Set(ALL_GRAND_PRIX.map(gp => gp.season)));
  return years.sort((a, b) => b - a);
}

export function getAvailableCountries(): string[] {
  const countries = Array.from(new Set(ALL_GRAND_PRIX.map(gp => gp.location.country)));
  return countries.sort();
}

export function formatGrandPrixDateRange(gp: GrandPrix): string {
  const startDate = parseISO(gp.dateStart);
  const endDate = parseISO(gp.dateEnd);
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric'
  };

  const yearFormatOptions: Intl.DateTimeFormatOptions = {
    ...formatOptions,
    year: 'numeric'
  };

  const startStr = startDate.toLocaleDateString('ja-JP', formatOptions);
  const endStr = endDate.toLocaleDateString('ja-JP', yearFormatOptions);

  return `${startStr} - ${endStr}`;
} 