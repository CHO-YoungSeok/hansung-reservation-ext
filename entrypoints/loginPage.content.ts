export default defineContentScript({
  matches: ['https://www.hansung.ac.kr/hnuLogin/onestop/loginView.do*'],
  runAt: 'document_idle',
  async main() {
    console.log('[Login Page] 로그인 페이지 초기화 시작');

    // 1. 에러 메시지 확인 및 토스트 표시
    const errorDataStr = sessionStorage.getItem('HANSUNG_EXT_LOGIN_ERROR');
    if (errorDataStr) {
      try {
        const errorData = JSON.parse(errorDataStr);
        console.log('[Login Page] 로그인 에러 데이터 발견:', errorData);

        // 토스트 메시지 표시
        const { showToast } = await import('~/src/utils/toastNotification');
        showToast({
          message: errorData.errorMessage,
          type: 'error',
          duration: 5000,
        });

        // 표시 후 즉시 삭제 (중복 방지)
        sessionStorage.removeItem('HANSUNG_EXT_LOGIN_ERROR');
        console.log('[Login Page] 에러 메시지 표시 완료, sessionStorage에서 삭제');
      } catch (error) {
        console.error('[Login Page] 에러 데이터 파싱 실패:', error);
      }
    }

    // 2. return_url 검증 및 수정
    console.log('[Login Page] return_url 검사 시작');

    const errorMessagePagePrefix = 'https://www.hansung.ac.kr/message/message.do?siteId=hansung&message=';
    const homepageUrl = 'https://www.hansung.ac.kr/hansung/index.do';

    // URL 파라미터에서 return_url 확인
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return_url');

    if (returnUrl && returnUrl.startsWith(errorMessagePagePrefix)) {
      console.log('[Login Page] 에러 페이지로 가는 return_url 감지:', returnUrl);
      console.log('[Login Page] return_url을 홈페이지로 변경합니다.');

      // URL 파라미터 수정
      urlParams.set('return_url', homepageUrl);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

      // 페이지 URL을 교체 (히스토리에 남기지 않음)
      window.history.replaceState({}, '', newUrl);
    }

    // 3. 로그인 폼의 hidden field 확인 및 수정
    const checkAndFixForm = () => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (!form) {
        console.log('[Login Page] 폼을 찾을 수 없습니다.');
        return;
      }

      // return_url 또는 returnUrl 등의 이름을 가진 hidden input 찾기
      const possibleNames = ['return_url', 'returnUrl', 'returnURL', 'redirect_url', 'redirectUrl'];

      for (const name of possibleNames) {
        const input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;

        if (input && input.value && input.value.startsWith(errorMessagePagePrefix)) {
          console.log(`[Login Page] 폼의 ${name} 필드에서 에러 페이지 URL 발견:`, input.value);
          input.value = homepageUrl;
          console.log(`[Login Page] ${name} 필드를 홈페이지로 변경했습니다.`);
        }
      }
    };

    // DOM이 완전히 로드된 후 폼 확인
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndFixForm);
    } else {
      checkAndFixForm();
    }

    // 4. 폼 제출 직전에도 한 번 더 확인 (방어적 코드)
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const possibleNames = ['return_url', 'returnUrl', 'returnURL', 'redirect_url', 'redirectUrl'];

      for (const name of possibleNames) {
        const input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;

        if (input && input.value && input.value.startsWith(errorMessagePagePrefix)) {
          console.log(`[Login Page] 폼 제출 직전 ${name} 필드 재확인 및 수정`);
          input.value = homepageUrl;
        }
      }
    });

    console.log('[Login Page] 초기화 완료');
  },
});
