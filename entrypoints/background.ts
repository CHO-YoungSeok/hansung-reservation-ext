export default defineBackground(() => {
  console.log('한성대학교 예약 시스템 익스텐션 로드됨 (CORS 우회 지원)', { id: browser.runtime.id });

  // URL 리다이렉트 규칙 설정 (enc 파라미터 제거)
  browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1], // 기존 규칙 제거 (있다면)
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'redirect' as chrome.declarativeNetRequest.RuleActionType,
          redirect: {
            transform: {
              queryTransform: {
                removeParams: ['enc'], // enc 파라미터 제거
              },
            },
          },
        },
        condition: {
          urlFilter: 'hansung.ac.kr/cncschool/7309/subview.do*',
          resourceTypes: ['main_frame' as chrome.declarativeNetRequest.ResourceType],
        },
      },
    ],
  }).then(() => {
    console.log('✓ [Background] URL 리다이렉트 규칙 설정 완료');
  }).catch((error) => {
    console.error('❌ [Background] URL 리다이렉트 규칙 설정 실패:', error);
  });

  // CORS 우회를 위한 fetch 요청 처리
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'FETCH_HTML') {
      console.log('📡 [Background] Fetching:', message.url);

      fetch(message.url, {
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
        .then(response => {
          console.log('✓ [Background] Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then(html => {
          console.log('✓ [Background] HTML received, length:', html.length);
          sendResponse({ success: true, html });
        })
        .catch(error => {
          console.error('❌ [Background] Fetch error:', error);
          sendResponse({ success: false, error: error.message });
        });

      // Return true to indicate async response
      return true;
    }
  });
});
