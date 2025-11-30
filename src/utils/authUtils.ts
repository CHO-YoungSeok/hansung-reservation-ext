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
