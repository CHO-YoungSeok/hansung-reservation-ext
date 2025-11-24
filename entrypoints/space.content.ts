//space.content.ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpaceRouter } from '~/src/pages/space/SpaceRouter';
import { extractPageData } from '~/src/utils/pageDataExtractor';
import { checkLoginStatus } from '~/src/components/common/authChecker';
import { setupSpaceAutoFill, autoSelectSpaceFromUrl } from '~/src/utils/spaceFormAutoFill';
import { extractEventsFromDom } from '~/src/utils/calendarEvents';



export default defineContentScript({
  matches: [
    'https://www.hansung.ac.kr/onestop/8952/subview.do*',
    'https://www.hansung.ac.kr/onestop/8952/*',
  ],
  main() {
    console.log('세미나실 예약 UI 개선 시작');
    const CALENDAR_EVENTS_KEY = 'SPACE_CALENDAR_EVENTS_V1';

    const cacheCalendarEvents = () => {
      try {
        const { events } = extractEventsFromDom();
        
    if (events.length > 0) {
      // ✅ 실제 달력 이벤트가 있는 페이지에서만 캐싱
      (window as any).__SPACE_CALENDAR_EVENTS__ = events;
      sessionStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(events));

      console.log('[calendar] 추출된 이벤트 개수:', events.length);
      console.log('[calendar] 첫 번째 이벤트:', events[0]);
    }else {
      // DOM에서 못 찾았을 때는 기존 값/저장값을 유지하는 쪽으로
      const stored = sessionStorage.getItem(CALENDAR_EVENTS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            (window as any).__SPACE_CALENDAR_EVENTS__ = parsed;
            console.warn('[calendar] DOM에서는 0개지만 저장된 이벤트를 복원:', parsed.length);
            return;
          }
        } catch {
          // JSON 파싱 실패하면 무시
        }
      }

      console.warn('[calendar] 달력 이벤트를 찾을 수 없음 (events.length = 0)');
      (window as any).__SPACE_CALENDAR_EVENTS__ = [];
    }
      } catch (e) {
        console.error('[calendar] 이벤트 추출 중 오류:', e);
        (window as any).__SPACE_CALENDAR_EVENTS__ = [];
      }
    };

    const renderCustomUI = () => {
      const contentArea =
        document.querySelector('#contents') ||
        document.querySelector('.contents') ||
        document.body;

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

    const initCustomUI = () => {
      const isLoggedIn = checkLoginStatus();
      console.log('로그인 상태:', isLoggedIn);

      if (!isLoggedIn) {
        console.log('로그인되지 않음 - 기존 페이지 유지');
        setupSpaceAutoFill();
        return;
      }

      const contentArea =
        document.querySelector('#contents') ||
        document.querySelector('.contents') ||
        document.body;

      if (!contentArea) return;

      const urlParams = new URLSearchParams(window.location.search);
      const spaceId = urlParams.get('spaceId');

      if (spaceId) {
        console.log(`[데이터 추출] URL에서 spaceId 발견: ${spaceId}, 공간 선택 후 데이터 추출`);

        // ✅ 1) URL 기반으로 공간 자동 선택
        autoSelectSpaceFromUrl().then(() => {
          // ✅ 2) 공간 선택 + 원본 JS가 달력 업데이트 한 뒤에
          //    달력 이벤트를 캐싱
          cacheCalendarEvents();

          // ✅ 3) 그 상태에서 페이지 데이터 추출
          extractPageData().then((pageData) => {
            (window as any).__EXTRACTED_PAGE_DATA__ = pageData;
            renderCustomUI();
          });
        });
      } else {
        // spaceId가 없으면 현재 달력 상태 기준으로 캐싱
        cacheCalendarEvents();

        extractPageData().then((pageData) => {
          (window as any).__EXTRACTED_PAGE_DATA__ = pageData;
          renderCustomUI();
        });
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});