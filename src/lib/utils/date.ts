export function getCurrentJstDate(): Date {
  const simulated = process.env.SIMULATED_DATE;  // 例: "2025-07-25T00:00:00+09:00"
  if (process.env.NODE_ENV === 'development' && simulated) {
    return new Date(simulated);
  }
  const now = new Date();
  const jstOffsetMin = 9 * 60;
  return new Date(now.getTime() + (jstOffsetMin + now.getTimezoneOffset()) * 60000);
} 