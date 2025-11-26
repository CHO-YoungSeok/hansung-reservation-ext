/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식의 문자열로 반환
 */
export function getTodayString(): string {
  return formatDateToString(new Date());
}

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 정규화 (시간 부분 제거)
 */
export function normalizeDateString(dateString: string): string {
  return dateString.split('T')[0];
}

/**
 * 다음 주차 토요일 날짜를 반환
 * 오늘부터 다음 주의 토요일까지 선택 가능
 */
export function getNextWeekSaturday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (일요일) ~ 6 (토요일)
  
  // 다음 주 토요일까지의 일수 계산
  // 오늘이 토요일이면 7일 후, 아니면 다음 주 토요일까지
  const daysUntilNextSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek + 7);
  
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilNextSaturday);
  
  return formatDateToString(nextSaturday);
}

