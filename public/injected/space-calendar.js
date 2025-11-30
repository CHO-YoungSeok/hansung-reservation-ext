// injected/space-calendar.js
// 원본 페이지 컨텍스트에서 실행되는 스크립트
// 다음달 버튼을 클릭하여 다음달 정보를 수집

(function() {
  try {
    // 다음달 버튼 찾기
    let nextButton = null;
    
    // 방법 1: href에 "next" 또는 "다음"이 포함된 링크
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const text = link.textContent || '';
      if ((href.includes('next') || href.includes('다음') || text.includes('다음달')) && 
          !text.includes('이전')) {
        nextButton = link;
        break;
      }
    }
    
    // 방법 2: 버튼이나 클릭 가능한 요소에서 "다음달" 텍스트 찾기
    if (!nextButton) {
      const allElements = document.querySelectorAll('a, button, span, div');
      for (const el of allElements) {
        const text = el.textContent || '';
        if (text.includes('다음달') && !text.includes('이전달')) {
          const style = window.getComputedStyle(el);
          if (style.cursor === 'pointer' || el.tagName === 'A' || el.tagName === 'BUTTON') {
            nextButton = el;
            break;
          }
        }
      }
    }
    
    if (nextButton) {
      // jQuery가 있으면 jQuery 이벤트도 트리거
      if (typeof jQuery !== 'undefined' && jQuery(nextButton).length) {
        jQuery(nextButton).trigger('click');
      } else {
        // 원본 페이지 컨텍스트에서 클릭 이벤트 발생
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        // 실제 클릭 실행
        if (nextButton.onclick) {
          nextButton.onclick(clickEvent);
        } else if (nextButton.href && !nextButton.href.startsWith('javascript:')) {
          // href가 있고 javascript:가 아니면 직접 이동
          window.location.href = nextButton.href;
          return; // 페이지 이동하므로 여기서 종료
        } else {
          nextButton.dispatchEvent(clickEvent);
        }
      }
      
      // DOM 업데이트 대기 후 content script에 알림
      setTimeout(function() {
        window.dispatchEvent(new CustomEvent('__NEXT_MONTH_LOADED__'));
      }, 2000);
    } else {
      // 버튼을 찾지 못한 경우에도 이벤트 발생 (타임아웃 방지)
      window.dispatchEvent(new CustomEvent('__NEXT_MONTH_LOADED__'));
    }
  } catch (e) {
    console.warn('다음달 버튼 클릭 실패:', e);
    // 오류 발생 시에도 이벤트 발생
    window.dispatchEvent(new CustomEvent('__NEXT_MONTH_LOADED__'));
  }
})();

