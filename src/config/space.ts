/**
 * 세미나실 예약 관련 설정
 * 환경 변수에서 URL을 가져옵니다.
 */

export const SPACE_CONFIG = {
  reservationBaseUrl: ((import.meta.env as any).VITE_RESERVATION_BASE_URL as string) || 'https://www.hansung.ac.kr/onestop/8952/subview.do',
  reservationEncParam: ((import.meta.env as any).VITE_RESERVATION_ENC_PARAM as string) || 'enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZvbmVzdG9wJTJGMjElMkZhcnRjbFJlZ2lzdFZpZXcuZG8lM0Y%3D',
} as const;

/**
 * 예약 페이지 URL 생성
 * @param spaceId 세미나실 ID
 * @returns 예약 페이지 URL
 */
export const getReservationUrl = (spaceId: string): string => {
  return `${SPACE_CONFIG.reservationBaseUrl}?${SPACE_CONFIG.reservationEncParam}&spaceId=${spaceId}`;
};

/**
 * 목록 페이지 URL
 */
export const getListUrl = (): string => {
  return SPACE_CONFIG.reservationBaseUrl;
};

