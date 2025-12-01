/**
 * 에러 메시지 페이지 핸들러
 * 로그인 실패 시 표시되는 에러 페이지를 감지하고,
 * 에러 메시지를 추출하여 sessionStorage에 저장한 후
 * 로그인 페이지로 리다이렉트합니다.
 */

/**
 * 에러 메시지를 URL 파라미터 또는 DOM에서 추출합니다.
 */
function extractErrorMessage(): string {
  // 1. URL 파라미터에서 추출
  const urlParams = new URLSearchParams(window.location.search);
  const messageParam = urlParams.get('message');
  if (messageParam) {
    const decoded = decodeURIComponent(messageParam);
    console.log('[Error Page] URL 파라미터에서 에러 메시지 추출:', decoded);
    return decoded;
  }

  // 2. DOM에서 추출 (페이지가 로드된 후)
  const selectors = ['.error-message', '.message', '#message', '.alert', 'p', 'div'];
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 200) {
        // 너무 짧거나 긴 텍스트 제외
        console.log('[Error Page] DOM에서 에러 메시지 추출:', text);
        return text;
      }
    }
  }

  // 3. 기본 메시지
  console.log('[Error Page] 에러 메시지 추출 실패, 기본 메시지 사용');
  return '로그인 정보가 올바르지 않습니다.';
}

export default defineContentScript({
  matches: ['https://www.hansung.ac.kr/message/message.do*'],
  runAt: 'document_start',
  main() {
    const currentUrl = window.location.href;
    const errorMessagePagePrefix =
      'https://www.hansung.ac.kr/message/message.do?siteId=hansung&message=';

    if (currentUrl.startsWith(errorMessagePagePrefix)) {
      console.log('[Error Page] 에러 페이지 감지, 처리 시작');

      // 1. 에러 메시지 추출
      const errorMessage = extractErrorMessage();

      // 2. 원래 의도한 페이지 URL 추적
      // sessionStorage에 저장된 값 우선, 없으면 referrer, 둘 다 없으면 홈페이지
      const intendedDest =
        sessionStorage.getItem('HANSUNG_EXT_INTENDED_DEST') ||
        document.referrer ||
        'https://www.hansung.ac.kr/hansung/index.do';

      console.log('[Error Page] 원래 의도한 페이지:', intendedDest);

      // 3. sessionStorage에 에러 데이터 저장
      const errorData = {
        errorMessage,
        timestamp: Date.now(),
        intendedDestination: intendedDest,
      };
      sessionStorage.setItem('HANSUNG_EXT_LOGIN_ERROR', JSON.stringify(errorData));
      console.log('[Error Page] 에러 데이터 저장 완료:', errorData);

      // 4. 로그인 페이지로 리다이렉트 (return_url = 원래 의도한 페이지)
      const loginUrl = `https://www.hansung.ac.kr/hnuLogin/onestop/loginView.do?return_url=${encodeURIComponent(
        intendedDest
      )}`;
      console.log('[Error Page] 로그인 페이지로 리다이렉트:', loginUrl);

      // replace()를 사용하여 히스토리에 에러 페이지를 남기지 않음
      window.location.replace(loginUrl);
    }
  },
});
