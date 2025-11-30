// injected/space-calendar-back.js
// 원본 페이지 컨텍스트에서 실행되는 스크립트
// 이전달 버튼을 클릭하여 원본 페이지 상태 복원

(function() {
  try {
    let prevButton = null;
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const text = link.textContent || '';
      if ((href.includes('prev') || href.includes('이전') || text.includes('이전달')) && 
          !text.includes('다음')) {
        prevButton = link;
        break;
      }
    }
    
    if (!prevButton) {
      const allElements = document.querySelectorAll('a, button, span, div');
      for (const el of allElements) {
        const text = el.textContent || '';
        if (text.includes('이전달') && !text.includes('다음달')) {
          const style = window.getComputedStyle(el);
          if (style.cursor === 'pointer' || el.tagName === 'A' || el.tagName === 'BUTTON') {
            prevButton = el;
            break;
          }
        }
      }
    }
    
    if (prevButton) {
      // jQuery가 있으면 jQuery 이벤트도 트리거
      if (typeof jQuery !== 'undefined' && jQuery(prevButton).length) {
        jQuery(prevButton).trigger('click');
      } else {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        if (prevButton.onclick) {
          prevButton.onclick(clickEvent);
        } else {
          prevButton.dispatchEvent(clickEvent);
        }
      }
    }
  } catch (e) {
    console.warn('이전달 버튼 클릭 실패:', e);
  }
})();

