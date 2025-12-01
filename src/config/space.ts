/**
 * 세미나실 예약 관련 설정
 * 환경 변수에서 URL을 가져옵니다.
 */

const BASE_8952 = 'https://www.hansung.ac.kr/onestop/8952/subview.do';
const ENC_8952  = 'enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZvbmVzdG9wJTJGMjElMkZhcnRjbFJlZ2lzdFZpZXcuZG8lM0Y%3D';

const BASE_9611 = 'https://www.hansung.ac.kr/hsel/9611/subview.do';
const ENC_9611  = 'enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZoc2VsJTJGMjQlMkZhcnRjbFJlZ2lzdFZpZXcuZG8lM0Y%3D';

function getCurrentConfig() {
  const href = window.location.href;

  if (href.includes('/hsel/9611/')) {
    return { baseUrl: BASE_9611, encParam: ENC_9611 };
  }
  // 기본은 상상베이스(8952)
  return { baseUrl: BASE_8952, encParam: ENC_8952 };
}

/**
 * 예약 페이지 URL 생성
 * @param spaceId 세미나실 ID
 * @returns 예약 페이지 URL
 */
export const getReservationUrl = (spaceId: string): string => {
  const { baseUrl, encParam } = getCurrentConfig();
  return `${baseUrl}?${encParam}&spaceId=${spaceId}`;
};

export const getListUrl = (): string => {
  const { baseUrl } = getCurrentConfig();
  return baseUrl;
};
