import React from 'react';
import ReactDOM from 'react-dom/client';
import { HomePage } from '~/src/pages/home/HomePage';

export default defineContentScript({
  matches: ['https://www.hansung.ac.kr/*', 'https://hansung.ac.kr/*'],
  runAt: 'document_end',
  main() {
    console.log('한성대 홈페이지 개선 시작');
    
    // 메인 페이지에서만 실행 (특정 페이지는 제외)
    const currentPath = window.location.pathname;
    const excludePaths = ['/cncschool/7309/', '/onestop/8952/'];
    
    const shouldShowHomePage = excludePaths.every(path => !currentPath.includes(path));
    
    if (shouldShowHomePage && currentPath === '/') {
      const initHomePage = () => {
        // 기존 body 내용을 완전히 대체
        document.body.innerHTML = '';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        
        const root = document.createElement('div');
        root.id = 'hansung-home-root';
        document.body.appendChild(root);
        
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(HomePage));
        
        console.log('한성대 통합 포털 렌더링 완료');
      };
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHomePage);
      } else {
        initHomePage();
      }
    }
  },
});
