/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 정규화
 * @param dateStr - 날짜 문자열 (다양한 형식 허용)
 * @returns YYYY-MM-DD 형식의 문자열
 */
export const normalizeDateString = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayString = (): string => {
  const today = new Date();
  return normalizeDateString(today.toISOString());
};

/**
 * 특정 일수를 더한 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return normalizeDateString(date.toISOString());
};
