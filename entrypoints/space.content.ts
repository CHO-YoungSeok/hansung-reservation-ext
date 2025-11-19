import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpaceRouter } from '~/src/pages/space/SpaceRouter';
import { extractPageData } from '~/src/utils/pageDataExtractor';
import { checkLoginStatus } from '~/src/components/common/authChecker';
import { setupSpaceAutoFill, autoSelectSpaceFromUrl } from '~/src/utils/spaceFormAutoFill';

export default defineContentScript({
  matches: [
    'https://www.hansung.ac.kr/onestop/8952/subview.do*',
    'https://www.hansung.ac.kr/onestop/8952/*',
  ],
  main() {
    console.log('세미나실 예약 UI 개선 시작');
    
    const initCustomUI = () => {
      // 로그인 상태 확인
      const isLoggedIn = checkLoginStatus();
      console.log('로그인 상태:', isLoggedIn);
      
      if (!isLoggedIn) {
        console.log('로그인되지 않음 - 기존 페이지 유지');
        // 로그인되지 않았으면 기존 페이지를 그대로 유지
        // 공간 선택 자동 채우기 설정
        setupSpaceAutoFill();
        return;
      }
      
      const contentArea = document.querySelector('#contents') || document.querySelector('.contents') || document.body;
      
      if (contentArea) {
        // URL에 spaceId가 있으면 먼저 공간을 선택하여 정보를 채운 후 데이터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const spaceId = urlParams.get('spaceId');
        
        if (spaceId) {
          console.log(`[데이터 추출] URL에서 spaceId 발견: ${spaceId}, 공간 선택 후 데이터 추출`);
          // 공간 선택 후 데이터가 채워질 때까지 대기
          autoSelectSpaceFromUrl().then(() => {
            // 공간 정보가 채워진 후 데이터 추출
            extractPageData().then((pageData) => {
              console.log('추출된 페이지 데이터:', pageData);
              
              // 전역 변수로 저장하여 React 컴포넌트에서 접근 가능하게 함
              (window as any).__EXTRACTED_PAGE_DATA__ = pageData;
              
              // 데이터 추출 후 UI 렌더링
              renderCustomUI();
            });
          });
        } else {
          // spaceId가 없으면 바로 데이터 추출
          extractPageData().then((pageData) => {
            console.log('추출된 페이지 데이터:', pageData);
            
            // 전역 변수로 저장하여 React 컴포넌트에서 접근 가능하게 함
            (window as any).__EXTRACTED_PAGE_DATA__ = pageData;
            
            // 데이터 추출 후 UI 렌더링
            renderCustomUI();
          });
        }
        
        return; // extractPageData가 완료될 때까지 기다림
      }
    };
    
    const renderCustomUI = () => {
      const contentArea = document.querySelector('#contents') || document.querySelector('.contents') || document.body;
      
      if (contentArea) {
        
        contentArea.innerHTML = '';
        
        const root = document.createElement('div');
        root.id = 'hansung-reservation-root';
        contentArea.appendChild(root);
        
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(SpaceRouter));
        
        console.log('세미나실 예약 UI 렌더링 완료');
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});
