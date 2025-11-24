export default defineBackground(() => {
  console.log('한성대학교 예약 시스템 익스텐션 로드됨', { id: browser.runtime.id });

  // declarativeNetRequest 규칙 설정
  // lendSummary.do 요청을 subview.do로 리다이렉트
  const rules = [
    {
      id: 1,
      priority: 1,
      action: {
        type: 'redirect' as chrome.declarativeNetRequest.RuleActionType,
        redirect: {
          url: 'https://hansung.ac.kr/cncschool/7309/subview.do?enc=Zm5jdDF8QEB8JTJGbGVuZCUyRmNuY3NjaG9vbCUyRjElMkZsZW5kU3VtbWFyeS5kbyUzRmtpbmQlM0RzdW1tYXJ5JTI2',
        },
      },
      condition: {
        urlFilter: 'https://hansung.ac.kr/lend/cncschool/1/lendSummary.do*',
        resourceTypes: ['main_frame' as chrome.declarativeNetRequest.ResourceType],
      },
    },
  ];

  // 규칙 업데이트
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((rule) => rule.id),
    addRules: rules,
  }).then(() => {
    console.log('✅ URL 리다이렉트 규칙 설정 완료');
  }).catch((error) => {
    console.error('❌ URL 리다이렉트 규칙 설정 실패:', error);
  });
});
