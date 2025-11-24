/**
 * 로그인 상태를 확인하는 공통 유틸리티
 * 다양한 페이지에서 재사용 가능하도록 독립적으로 작성
 */

export interface LoginCheckOptions {
  /**
   * 로그인된 상태를 나타내는 요소들의 selector
   * 이 요소들이 있으면 로그인된 것으로 간주
   */
  loggedInSelectors?: string[];
  
  /**
   * 로그인되지 않은 상태를 나타내는 요소들의 selector
   * 이 요소들이 있으면 로그인되지 않은 것으로 간주
   */
  loggedOutSelectors?: string[];
  
  /**
   * 로그인 폼을 나타내는 selector
   */
  loginFormSelectors?: string[];
}

/**
 * 기본 로그인 체크 옵션 (한성대 예약 시스템용)
 */
const DEFAULT_OPTIONS: LoginCheckOptions = {
  loggedInSelectors: [
    'form[name="actionForm"]',
    '#resveSpceSeq',
    '#resveDe',
    'input[name="resveTm"]',
    '#userNm',
    '#hakbun',
  ],
  loggedOutSelectors: [
    'input[name="userId"]',
    'input[name="userPwd"]',
    'input[type="password"]',
    '.login-form',
    '#loginForm',
  ],
  loginFormSelectors: [
    'input[name="userId"]',
    'input[type="password"]',
  ],
};

/**
 * 기존 페이지에서 로그인 상태를 확인합니다.
 * @param options 로그인 체크 옵션 (기본값 사용 시 생략 가능)
 * @returns 로그인되어 있으면 true, 아니면 false
 */
export function checkLoginStatus(options?: LoginCheckOptions): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // 1. 먼저 로그인된 상태를 나타내는 요소 확인 (예약 폼 등)
  if (opts.loggedInSelectors && opts.loggedInSelectors.length > 0) {
    const hasLoggedInIndicator = opts.loggedInSelectors.some(selector => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        // input 요소인 경우 value가 있는지 확인
        if (element instanceof HTMLInputElement) {
          const hasValue = element.value && element.value.trim().length > 0;
          if (hasValue) {
            console.log(`[로그인 체크] 로그인된 상태 요소 발견 (값 있음): ${selector} = "${element.value}"`);
            return true;
          }
        } else {
          // 일반 요소인 경우 존재만 확인
          console.log(`[로그인 체크] 로그인된 상태 요소 발견: ${selector}`);
          return true;
        }
      }
      return false;
    });
    
    if (hasLoggedInIndicator) {
      console.log('[로그인 체크] 결과: 로그인됨 (예약 폼 또는 사용자 정보 존재)');
      return true;
    }
  }
  
  // 2. 로그인 폼이 명확히 있는지 확인
  if (opts.loginFormSelectors && opts.loginFormSelectors.length > 0) {
    const hasLoginForm = opts.loginFormSelectors.some(selector => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[로그인 체크] 로그인 폼 요소 발견: ${selector}`);
        return true;
      }
      return false;
    });
    
    if (hasLoginForm) {
      // 로그인 폼이 있는데 예약 폼도 있는지 확인 (둘 다 있으면 로그인된 것으로 간주)
      const hasReservationForm = opts.loggedInSelectors?.some(selector => {
        return document.querySelector(selector) !== null;
      });
      
      if (hasReservationForm) {
        console.log('[로그인 체크] 결과: 로그인됨 (로그인 폼과 예약 폼 모두 존재)');
        return true;
      } else {
        console.log('[로그인 체크] 결과: 로그인 안됨 (로그인 폼만 존재)');
        return false;
      }
    }
  }
  
  // 3. 로그인되지 않은 상태를 나타내는 요소 확인
  if (opts.loggedOutSelectors && opts.loggedOutSelectors.length > 0) {
    const hasLoggedOutIndicator = opts.loggedOutSelectors.some(selector => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[로그인 체크] 로그인 안된 상태 요소 발견: ${selector}`);
        return true;
      }
      return false;
    });
    
    if (hasLoggedOutIndicator) {
      console.log('[로그인 체크] 결과: 로그인 안됨 (로그인 안된 상태 요소 존재)');
      return false;
    }
  }
  
  // 4. 기본적으로는 로그인되지 않은 것으로 간주 (안전한 선택)
  console.log('[로그인 체크] 결과: 로그인 안됨 (기본값)');
  return false;
}

