
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoodsListPage } from '~/src/pages/goods/GoodsListPage';

export default defineContentScript({
  matches: ['https://hansung.ac.kr/cncschool/7309/subview.do*'],
  async main() {
    console.log('기자재 대여 UI 개선 시작');

    const initCustomUI = async () => {
      const contentArea = document.querySelector('#contents') || document.querySelector('.contents') || document.body;

      if (contentArea) {
        // STEP 1: Extract data BEFORE clearing DOM
        const { parseGoodsFromHTML } = await import('~/entrypoints/content-script/fetch/goodsList');
        const extractedGoods = parseGoodsFromHTML(document.documentElement.outerHTML);
        console.log('[Goods Content] Extracted', extractedGoods.length, 'items');

        // STEP 2: NOW clear DOM (safe - we have the data)
        contentArea.innerHTML = '';

        const root = document.createElement('div');
        root.id = 'hansung-reservation-root';
        contentArea.appendChild(root);

        // STEP 3: Render React with extracted data as props
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(GoodsListPage, { initialGoods: extractedGoods }));

        console.log('기자재 대여 커스텀 UI 렌더링 완료');
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      await initCustomUI();
    }
  },
});
