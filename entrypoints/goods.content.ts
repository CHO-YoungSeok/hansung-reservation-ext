import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoodsListPage } from '~/src/pages/goods/GoodsListPage';

export default defineContentScript({
  matches: ['https://hansung.ac.kr/cncschool/7309/subview.do*'],
  main() {
    console.log('기자재 대여 UI 개선 시작');
    
    const initCustomUI = () => {
      const contentArea = document.querySelector('#contents') || document.querySelector('.contents') || document.body;
      
      if (contentArea) {
        contentArea.innerHTML = '';
        
        const root = document.createElement('div');
        root.id = 'hansung-reservation-root';
        contentArea.appendChild(root);
        
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(GoodsListPage));
        
        console.log('기자재 대여 커스텀 UI 렌더링 완료');
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});
