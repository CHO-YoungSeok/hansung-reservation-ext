import { checkLoginStatus } from '../components/common/authChecker';

/**
 * 사용자 로그인 상태 확인
 * 한성대 웹사이트의 DOM 구조를 체크하여 로그인 여부를 판단
 * authChecker.ts의 checkLoginStatus 함수를 활용하여 더 정확하게 판단합니다.
 */
export const isUserLoggedIn = (): boolean => {
  return checkLoginStatus();
};

/**
 * 한성대 로그인 페이지 URL
 * @param returnUrl - 로그인 후 돌아올 URL. 지정하지 않으면 기본 로그인 페이지만 반환합니다.
 */
export const getLoginUrl = (returnUrl?: string): string => {
  const loginPage = 'https://hansung.ac.kr/hnuLogin/cncschool/loginView.do';
  
  if (returnUrl) {
    // return_url 파라미터에 현재 URL을 인코딩하여 추가
    return `${loginPage}?return_url=${encodeURIComponent(returnUrl)}`;
  }
  
  return loginPage;
};

/**
 * 로그인 페이지로 리다이렉트
 * 현재 페이지를 returnUrl로 사용하여, 로그인 후 원래 페이지로 돌아오도록 합니다.
 */
export const redirectToLogin = (): void => {
  window.location.href = getLoginUrl(window.location.href);
};

/**
 * 한성대 로그아웃 페이지 URL (추정)
 * 참고: 실제 로그아웃 프로세스는 다를 수 있습니다.
 */
export const getLogoutUrl = (): string => {
  return 'https://www.hansung.ac.kr/j_ace/ace/logout.do';
};

/**
 * 로그아웃 페이지로 리다이렉트
 */
export const redirectToLogout = (): void => {
  window.location.href = getLogoutUrl();
};

/**
 * 사용자 정보 인터페이스
 */
export interface UserInfo {
  isLoggedIn: boolean;
  userName: string;
  studentId: string;
}

/**
 * 현재 페이지에서 사용자 정보를 추출합니다.
 * 한성대 웹사이트의 DOM에서 학번과 이름을 가져옵니다.
 *
 * 다양한 방법을 시도하여 사용자 정보를 추출합니다:
 * 1. 숨겨진 input 필드에서 추출 (#hakbun, #userNm)
 * 2. 로그아웃 링크 근처 텍스트에서 추출 (가장 일반적)
 * 3. 헤더/로그인 영역의 사용자 정보에서 추출
 * 4. window 객체의 전역 변수에서 추출
 */
export const getUserInfo = (): UserInfo => {
  const isLoggedIn = isUserLoggedIn();

  if (!isLoggedIn) {
    return {
      isLoggedIn: false,
      userName: '손님',
      studentId: '',
    };
  }

  let studentId = '';
  let userName = '';

  // Method 1: 숨겨진 input 필드에서 추출 (예약 페이지 등에서 사용)
  const hakbunInput = document.querySelector('#hakbun') as HTMLInputElement;
  if (hakbunInput && hakbunInput.value) {
    studentId = hakbunInput.value.trim();
  }

  const userNmInput = document.querySelector('#userNm') as HTMLInputElement;
  if (userNmInput && userNmInput.value) {
    userName = userNmInput.value.trim();
  }

  // Method 2: 로그아웃 링크 근처에서 사용자 정보 추출 (홈페이지에서 가장 일반적)
  if (!studentId || !userName) {
    const links = document.querySelectorAll('a');
    for (const link of links) {
      const text = link.textContent?.trim() || '';
      const href = link.getAttribute('href') || '';

      // 로그아웃 링크 찾기
      if (text.includes('로그아웃') || href.includes('logout')) {
        // 부모 또는 형제 요소에서 사용자 정보 찾기
        let searchElement: Element | null = link.parentElement;

        // 부모 요소가 너무 큰 경우를 대비해 최대 3단계까지만 탐색
        for (let i = 0; i < 3 && searchElement; i++) {
          const elementText = searchElement.textContent?.trim() || '';

          // 이름 패턴: "XXX님" 형태 찾기
          if (!userName) {
            const nameMatch = elementText.match(/([가-힣]{2,4})님/);
            if (nameMatch) {
              userName = nameMatch[1];
              console.log(`[사용자 정보] 이름 발견: ${userName}`);
            }
          }

          // 학번 패턴: 7-10자리 숫자 (괄호 안에 있을 수도 있음)
          if (!studentId) {
            const studentIdMatch = elementText.match(/[\(]?(\d{7,10})[\)]?/);
            if (studentIdMatch) {
              studentId = studentIdMatch[1];
              console.log(`[사용자 정보] 학번 발견: ${studentId}`);
            }
          }

          // 둘 다 찾았으면 중단
          if (userName && studentId) break;

          searchElement = searchElement.parentElement;
        }

        // 로그아웃 링크 주변에서 찾았으면 중단
        if (userName && studentId) break;
      }
    }
  }

  // Method 3: 일반적인 헤더/로그인 영역 선택자 시도
  if (!userName || !studentId) {
    const commonSelectors = [
      '.login-info',
      '.user-info',
      '.login_area',
      '.member-info',
      '#login-area',
      '#user-info',
      '.top_login',
      '.header-user',
      '#header .user',
    ];

    for (const selector of commonSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent?.trim() || '';

        // 이름 찾기
        if (!userName) {
          const nameMatch = text.match(/([가-힣]{2,4})님/);
          if (nameMatch) {
            userName = nameMatch[1];
            console.log(`[사용자 정보] 선택자 ${selector}에서 이름 발견: ${userName}`);
          }
        }

        // 학번 찾기
        if (!studentId) {
          const studentIdMatch = text.match(/[\(]?(\d{7,10})[\)]?/);
          if (studentIdMatch) {
            studentId = studentIdMatch[1];
            console.log(`[사용자 정보] 선택자 ${selector}에서 학번 발견: ${studentId}`);
          }
        }

        if (userName && studentId) break;
      }
    }
  }

  // Method 4: window 객체에서 전역 변수 찾기 (일부 사이트에서 사용)
  if (!userName || !studentId) {
    try {
      const win = window as any;

      // 일반적인 전역 변수명들
      const globalVarNames = ['userInfo', 'g_user', 'sessionUser', 'user', 'loginUser'];

      for (const varName of globalVarNames) {
        if (win[varName]) {
          const userObj = win[varName];

          if (!userName && (userObj.name || userObj.userName || userObj.userNm)) {
            userName = userObj.name || userObj.userName || userObj.userNm;
            console.log(`[사용자 정보] window.${varName}에서 이름 발견: ${userName}`);
          }

          if (!studentId && (userObj.id || userObj.studentId || userObj.hakbun)) {
            studentId = userObj.id || userObj.studentId || userObj.hakbun;
            console.log(`[사용자 정보] window.${varName}에서 학번 발견: ${studentId}`);
          }

          if (userName && studentId) break;
        }
      }
    } catch (error) {
      console.warn('[사용자 정보] window 객체 탐색 중 오류:', error);
    }
  }

  console.log('[사용자 정보] 최종 추출 결과:', { userName, studentId, isLoggedIn });

  return {
    isLoggedIn: true,
    userName: userName || '학생',
    studentId: studentId,
  };
};
