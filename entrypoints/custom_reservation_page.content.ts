import React from 'react';
import ReactDOM from 'react-dom/client';
import NewTabPage from './hansungHomePage/main';

export default defineContentScript({
  matches: ['https://www.hansung.ac.kr/hansung/10561/subview.do*'],
  main() {
    console.log('커스텀 예약 페이지 UI 개선 시작');
    
    const initCustomUI = () => {
      const contentArea = document.querySelector('#contents') || document.querySelector('.contents') || document.body;
      
      if (contentArea) {
        contentArea.innerHTML = '';
        
        const root = document.createElement('div');
        root.id = 'hansung-reservation-custom-root';
        contentArea.appendChild(root);
        
        // Pass dummy userData for now, as it's typically provided by background scripts or context
        // In a real scenario, userData would be fetched or passed via message passing
        const userData = { isLoggedIn: false, userName: 'Guest' };

        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(NewTabPage, { userData }));
        
        console.log('커스텀 예약 페이지 커스텀 UI 렌더링 완료');
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});
