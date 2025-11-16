import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpaceListPage } from '~/src/pages/space/SpaceListPage';

export default defineContentScript({
  matches: ['https://www.hansung.ac.kr/onestop/8952/*'],
  main() {
    console.log('세미나실 예약 UI 개선 시작');
    
    const initCustomUI = () => {
      const contentArea = document.querySelector('#contents') || document.querySelector('.contents') || document.body;
      
      if (contentArea) {
        contentArea.innerHTML = '';
        
        const root = document.createElement('div');
        root.id = 'hansung-reservation-root';
        contentArea.appendChild(root);
        
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(SpaceListPage));
        
        console.log('세미나실 예약 커스텀 UI 렌더링 완료');
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});
