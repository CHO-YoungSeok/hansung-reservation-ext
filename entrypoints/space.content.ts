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
    'resve/onestop/21/artclRegistView.do?layout=unknown',
    
  ],
  main() {
    const CALENDAR_EVENTS_KEY = 'SPACE_CALENDAR_EVENTS_V1';

    const cacheCalendarEvents = async () => {
      try {
        // 현재 달 이벤트 추출
        const { events: currentEvents } = extractEventsFromDom();
        
        // 기존 캐시된 이벤트 가져오기
        let cachedEvents: any[] = [];
        try {
          const stored = sessionStorage.getItem(CALENDAR_EVENTS_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              cachedEvents = parsed;
            }
          }
        } catch {
          // JSON 파싱 실패하면 무시
        }

        // 현재 달 이벤트와 캐시된 이벤트 병합 (중복 제거)
        const eventMap = new Map<string, any>();
        
        // 캐시된 이벤트 먼저 추가
        cachedEvents.forEach(ev => {
          const key = `${ev.date}-${ev.room}-${ev.timeRanges}`;
          eventMap.set(key, ev);
        });
        
        // 현재 달 이벤트 추가 (같은 키가 있으면 덮어쓰기)
        currentEvents.forEach(ev => {
          const key = `${ev.date}-${ev.room}-${ev.timeRanges}`;
          eventMap.set(key, ev);
        });

        // 방법: 페이지에 <script> 태그를 주입하여 원본 페이지 컨텍스트에서 실행
        // 이렇게 하면 CSP 제약을 우회하고 원본 JavaScript 함수에 접근 가능
        try {
          // 외부 JS 파일을 로드하여 다음달 버튼 클릭
          const script = document.createElement('script');
          const chromeRuntime = (globalThis as any).chrome?.runtime;
          if (chromeRuntime) {
            script.src = chromeRuntime.getURL('injected/space-calendar.js');
          } else {
            console.warn('chrome.runtime을 찾을 수 없습니다.');
            return;
          }
          (document.head || document.documentElement).appendChild(script);
          script.onload = () => script.remove();
          
          // 다음달 로드 완료 이벤트 리스너
          const handleNextMonthLoaded = async () => {
            try {
              // DOM이 업데이트되었으므로 다음달 이벤트 추출
              await new Promise(resolve => setTimeout(resolve, 500)); // 추가 대기
              const { events: nextMonthEvents } = extractEventsFromDom();
              
              // 다음달 이벤트 병합
              nextMonthEvents.forEach(ev => {
                const key = `${ev.date}-${ev.room}-${ev.timeRanges}`;
                eventMap.set(key, ev);
              });
              
              // 캐시 업데이트
              const updatedEvents = Array.from(eventMap.values());
              (window as any).__SPACE_CALENDAR_EVENTS__ = updatedEvents;
              try {
                sessionStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(updatedEvents));
              } catch (e) {
                // sessionStorage 저장 실패 무시
              }
              
              // 이전달로 돌아가기 (원본 페이지 상태 복원)
              const backScript = document.createElement('script');
              const chromeRuntime = (globalThis as any).chrome?.runtime || (window as any).chrome?.runtime;
              if (chromeRuntime) {
                backScript.src = chromeRuntime.getURL('injected/space-calendar-back.js');
                (document.head || document.documentElement).appendChild(backScript);
                backScript.onload = () => backScript.remove();
              }
              
              // 이벤트 리스너 제거
              window.removeEventListener('__NEXT_MONTH_LOADED__', handleNextMonthLoaded);
            } catch (e) {
              console.warn('다음달 정보 추출 실패:', e);
            }
          };
          
          // 이벤트 리스너 등록
          window.addEventListener('__NEXT_MONTH_LOADED__', handleNextMonthLoaded);
          
          // 타임아웃 설정 (10초 후 리스너 제거)
          setTimeout(() => {
            window.removeEventListener('__NEXT_MONTH_LOADED__', handleNextMonthLoaded);
          }, 10000);
        } catch (e) {
          console.warn('스크립트 주입 실패:', e);
        }
        
        // 추가: 사용자가 수동으로 다음달로 이동할 때도 정보 수집
        try {
          const { yyyy: currentYyyy, mm: currentMm } = extractEventsFromDom();
          let lastMonthKey = `${currentYyyy}-${currentMm}`;
          
          const observer = new MutationObserver(async () => {
            try {
              const { events: newEvents, yyyy: currentYyyy, mm: currentMm } = extractEventsFromDom();
              const currentMonthKey = `${currentYyyy}-${currentMm}`;
              
              if (currentMonthKey && currentMonthKey !== lastMonthKey && newEvents.length > 0) {
                lastMonthKey = currentMonthKey;
                
                let existingEvents: any[] = [];
                try {
                  const stored = sessionStorage.getItem(CALENDAR_EVENTS_KEY);
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                      existingEvents = parsed;
                    }
                  }
                } catch {}
                
                const localEventMap = new Map<string, any>();
                existingEvents.forEach(ev => {
                  const key = `${ev.date}-${ev.room}-${ev.timeRanges}`;
                  localEventMap.set(key, ev);
                });
                
                newEvents.forEach(ev => {
                  const key = `${ev.date}-${ev.room}-${ev.timeRanges}`;
                  localEventMap.set(key, ev);
                });
                
                const updatedEvents = Array.from(localEventMap.values());
                (window as any).__SPACE_CALENDAR_EVENTS__ = updatedEvents;
                try {
                  sessionStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(updatedEvents));
                } catch (e) {}
              }
            } catch (e) {}
          });
          
          const calendarArea = document.querySelector('table, .calendar, #calendar') || document.body;
          observer.observe(calendarArea, {
            childList: true,
            subtree: true,
            characterData: true
          });
          
          setTimeout(() => {
            observer.disconnect();
          }, 60000); // 1분간 감시
        } catch (e) {
          // MutationObserver 설정 실패 무시
          console.warn('MutationObserver 설정 실패:', e);
        }

        const mergedEvents = Array.from(eventMap.values());
        
        if (mergedEvents.length > 0) {
          (window as any).__SPACE_CALENDAR_EVENTS__ = mergedEvents;
          sessionStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(mergedEvents));
        } else {
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

      // "나의 신청내역" 전용 페이지에서는 커스텀 UI를 렌더링하지 않는다.
      // (상세 예약 폼이 아니라 예약 내역 확인 페이지이기 때문)
      const currentUrl = window.location.href;
      const myReservationUrl =
        'https://www.hansung.ac.kr/onestop/8952/subview.do?enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZvbmVzdG9wJTJGMjElMkZhcnRjbFZpZXcuZG8lM0Y%3D';
      if (currentUrl === myReservationUrl) {
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
        autoSelectSpaceFromUrl().then(async () => {
          await cacheCalendarEvents();
          extractPageData().then((pageData) => {
            (window as any).__EXTRACTED_PAGE_DATA__ = pageData;
            renderCustomUI();
          });
        });
      } else {
        (async () => {
          await cacheCalendarEvents();
          extractPageData().then((pageData) => {
            (window as any).__EXTRACTED_PAGE_DATA__ = pageData;
            renderCustomUI();
          });
        })();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});