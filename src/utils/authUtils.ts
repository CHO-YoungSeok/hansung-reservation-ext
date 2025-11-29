/**
 * 사용자 로그인 상태 확인
 * 한성대 웹사이트의 DOM 구조를 체크하여 로그인 여부를 판단
 */
export const isUserLoggedIn = (): boolean => {
  // 방법 1: 로그인 버튼/로그아웃 버튼 존재 여부 확인
  const logoutButton = document.querySelector('a[href*="logout"]');
  if (logoutButton) {
    return true;
  }

  // 방법 2: 사용자 정보 영역 확인
  const userInfo = document.querySelector('.user-info, .member-info, [class*="login-user"]');
  if (userInfo) {
    return true;
  }

  // 방법 3: 로그인 링크가 있으면 로그인 안 됨
  const loginLink = document.querySelector('a[href*="login"]');
  if (loginLink && !logoutButton) {
    return false;
  }

  // 기본값: 로그인되지 않은 것으로 간주
  return false;
};

/**
 * 한성대 로그인 페이지 URL
 */
export const getLoginUrl = (): string => {
  return 'https://hansung.ac.kr/hnuLogin/cncschool/loginView.do';
};

/**
 * 로그인 페이지로 리다이렉트
 */
export const redirectToLogin = (): void => {
  window.location.href = getLoginUrl();
};
