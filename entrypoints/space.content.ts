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
    const CALENDAR_EVENTS_KEY = 'SPACE_CALENDAR_EVENTS_V1';

    const cacheCalendarEvents = () => {
      try {
        const { events } = extractEventsFromDom();
        
    if (events.length > 0) {
      (window as any).__SPACE_CALENDAR_EVENTS__ = events;
      sessionStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(events));
    }else {
      const stored = sessionStorage.getItem(CALENDAR_EVENTS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            (window as any).__SPACE_CALENDAR_EVENTS__ = parsed;
            return;
          }
        } catch {
          // JSON 파싱 실패하면 무시
        }
      }

      (window as any).__SPACE_CALENDAR_EVENTS__ = [];
    }
      } catch (e) {
        (window as any).__SPACE_CALENDAR_EVENTS__ = [];
      }
    };

    const renderCustomUI = () => {
      const contentArea =
        document.querySelector('#contents') || 
        document.querySelector('.contents') ||
        document.body;

      if (contentArea) {
        // 원본 폼을 숨겨서 유지 (제출 시 필요)
        const originalForm = contentArea.querySelector('form[name="actionForm"]');
        if (originalForm) {
          (originalForm as HTMLElement).style.display = 'none';
          (originalForm as HTMLElement).setAttribute('data-original-form', 'true');
        }

        // 원본 폼이 있는 부모 요소도 숨기기 (전체 폼 영역)
        const formWrapper = contentArea.querySelector('._fnctWrap');
        if (formWrapper) {
          (formWrapper as HTMLElement).style.display = 'none';
          (formWrapper as HTMLElement).setAttribute('data-original-form-wrapper', 'true');
        }

        // 기존 내용을 숨기고 React 컴포넌트만 표시
        const existingContent = Array.from(contentArea.children).filter(
          (child) => !(child as HTMLElement).hasAttribute('data-original-form-wrapper')
        );
        existingContent.forEach((child) => {
          if ((child as HTMLElement).id !== 'hansung-reservation-root') {
            (child as HTMLElement).style.display = 'none';
          }
        });

        // React 컴포넌트를 위한 루트 생성
        let root = document.querySelector('#hansung-reservation-root') as HTMLElement;
        if (!root) {
          root = document.createElement('div');
          root.id = 'hansung-reservation-root';
          contentArea.appendChild(root);
        }

        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(SpaceRouter));
      }
    };

    const initCustomUI = () => {
      const isLoggedIn = checkLoginStatus();

      if (!isLoggedIn) {
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
        autoSelectSpaceFromUrl().then(() => {
          cacheCalendarEvents();
          extractPageData().then((pageData) => {
            (window as any).__EXTRACTED_PAGE_DATA__ = pageData;
            renderCustomUI();
          });
        });
      } else {
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