/**
 * 로그인 상태를 확인하는 공통 유틸리티
 * 다양한 페이지에서 재사용 가능하도록 독립적으로 작성
 */

export interface LoginCheckOptions {
  /**
   * 로그인된 상태를 나타내는 요소들의 selector
   * 이 요소들이 있으면 로그인된 것으로 간주
   * input 요소인 경우 value가 비어있지 않아야 함
   */
  loggedInSelectors?: string[];

  /**
   * 로그인되지 않은 상태를 나타내는 요소들의 selector
   * 이 요소들이 있으면 로그인되지 않은 것으로 간주 (주로 로그인 폼 필드)
   */
  loggedOutSelectors?: string[];
}

/**
 * 기본 로그인 체크 옵션 (한성대 예약 시스템용)
 * 한성대 웹사이트의 DOM 구조를 기반으로 합니다.
 */
const DEFAULT_OPTIONS: LoginCheckOptions = {
  loggedInSelectors: [
    // 예약 시스템 페이지에서 사용자의 학번이나 이름이 미리 채워져 있는 경우
    '#userNm[value]', // 사용자 이름 필드 (value 속성 존재 확인)
    '#hakbun[value]', // 학번 필드 (value 속성 존재 확인)
    // 예약 폼 자체의 주요 요소들이 존재하는 경우
    '#resveSpceSeq', // 예약 공간 번호 (일반적으로 로그인 후 활성화)
    '#resveDe',      // 예약 날짜 (로그인 후 활성화)
    'input[name="resveTm"]', // 예약 시간 (로그인 후 활성화)
  ],
  loggedOutSelectors: [
    // 로그인 폼의 주요 입력 필드 (로그아웃 상태에서만 나타남)
    'input[name="userId"]',
    'input[name="userPwd"]',
    'input[type="password"]', // 비밀번호 입력 필드
  ],
};

/**
 * 기존 페이지에서 로그인 상태를 확인합니다.
 * 더 정확한 확인을 위해 다음 우선순위를 따릅니다.
 * 1. "로그아웃" 텍스트를 가진 링크 존재 여부 (가장 확실한 로그인 상태 지표)
 * 2. "로그인" 텍스트를 가진 링크 존재 여부 (로그아웃 상태 지표)
 * 3. `loggedInSelectors`에 해당하는 요소들의 존재 및 유효성 (input의 경우 value 유무)
 * 4. `loggedOutSelectors`에 해당하는 요소들의 존재 여부 (로그인 폼 필드)
 * 5. 위 조건에 해당하지 않으면 기본적으로 로그인되지 않은 것으로 간주 (안전한 선택)
 *
 * @param options 로그인 체크 옵션 (기본값 사용 시 생략 가능)
 * @returns 로그인되어 있으면 true, 아니면 false
 */
export function checkLoginStatus(options?: LoginCheckOptions): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 1. 가장 확실한 로그인 지표: "로그아웃" 텍스트를 가진 링크 존재 여부
  //    한성대 웹사이트에서는 로그인 시 "로그아웃" 링크가 표시됩니다.
  //    예: <a href="/hnuLogin/cncschool/hnuLogout.do">로그아웃</a>
  const links = document.querySelectorAll('a');
  for (const link of links) {
    const text = link.textContent?.trim() || '';
    const href = link.getAttribute('href') || '';

    // "로그아웃" 텍스트가 있거나 hnuLogout.do가 포함된 링크가 있으면 로그인 상태
    if (text.includes('로그아웃') || href.includes('hnuLogout.do')) {
      console.log('[로그인 체크] 결과: 로그인됨 (로그아웃 링크 발견)', { text, href });
      return true;
    }
  }

  // 2. "로그인" 텍스트를 가진 링크가 있는지 확인
  //    한성대 웹사이트에서는 로그아웃 시 "로그인" 링크가 표시됩니다.
  for (const link of links) {
    const text = link.textContent?.trim() || '';
    const href = link.getAttribute('href') || '';

    // "로그인" 텍스트가 있거나 loginView.do가 포함된 링크가 있으면 로그아웃 상태
    if (text === '로그인' || href.includes('loginView.do')) {
      console.log('[로그인 체크] 결과: 로그인 안됨 (로그인 링크 발견)', { text, href });
      return false;
    }
  }

  // 3. 로그인된 상태를 나타내는 요소 확인 (예약 폼 필드, 사용자 정보 등)
  //    input 요소인 경우 value가 채워져 있는지 확인하여 더 정확하게 판단합니다.
  if (opts.loggedInSelectors && opts.loggedInSelectors.length > 0) {
    const hasLoggedInIndicator = opts.loggedInSelectors.some(selector => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        // input 요소인 경우 value가 있는지 확인 (사용자 정보가 미리 채워진 경우)
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          if (element.value && element.value.trim().length > 0) {
            console.log(`[로그인 체크] 로그인된 상태 요소 발견 (값 있음): ${selector} = "${element.value}"`);
            return true;
          }
        } else {
          // 일반 요소인 경우 존재만 확인하거나, 텍스트 내용의 유효성을 추가로 검사할 수 있음
          // 현재는 존재만으로 판단
          console.log(`[로그인 체크] 로그인된 상태 요소 발견: ${selector}`);
          return true;
        }
      }
      return false;
    });

    if (hasLoggedInIndicator) {
      console.log('[로그인 체크] 결과: 로그인됨 (예약 폼 요소 또는 사용자 정보 존재)');
      return true;
    }
  }

  // 4. 로그인되지 않은 상태를 나타내는 요소 확인 (로그인 폼 필드)
  //    로그인 폼 필드가 존재하면, 사용자가 로그인 페이지에 있거나 로그인 폼이 노출된 상태로 간주합니다.
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
      console.log('[로그인 체크] 결과: 로그인 안됨 (로그인 폼 필드 존재)');
      return false;
    }
  }

  // 5. 위 조건에 해당하지 않으면 기본적으로 로그인되지 않은 것으로 간주 (안전한 선택)
  console.log('[로그인 체크] 결과: 로그인 안됨 (기본값 또는 모호한 상태)');
  return false;
}
