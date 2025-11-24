/**
 * 기존 페이지에서 데이터를 추출하는 유틸리티
 */

export interface ExtractedPageData {
  managerName?: string;
  managerPhone?: string;
  applicantType?: string;
  guideItems?: string[];
  applicantName?: string;
  applicantStudentId?: string;
  applicantPhone?: string;
  applicantEmail?: string;
}

/**
 * 테이블 행에서 값을 추출하는 헬퍼 함수
 */
function extractValueFromTableRow(labelText: string): string | undefined {
  // 1. 모든 th 요소를 순회하며 labelText를 포함하는 th 찾기
  const allThs = Array.from(document.querySelectorAll('th'));
  const targetTh = allThs.find(th => {
    const text = th.textContent?.trim() || '';
    // "필수 입력 항목" 같은 마크업 제거
    const cleanText = text.replace(/필수\s*입력\s*항목/gi, '').trim();
    return cleanText.includes(labelText) || text.includes(labelText);
  });

  if (!targetTh) {
    console.log(`[데이터 추출] "${labelText}" 라벨을 찾을 수 없음`);
    return undefined;
  }

  // 2. 같은 행(tr)에서 td 찾기
  const row = targetTh.closest('tr');
  if (!row) {
    console.log(`[데이터 추출] "${labelText}" 행을 찾을 수 없음`);
    return undefined;
  }

  const td = row.querySelector('td');
  if (!td) {
    console.log(`[데이터 추출] "${labelText}" td를 찾을 수 없음`);
    return undefined;
  }

  // 3. td 내부의 input 요소 찾기
  const input = td.querySelector('input') as HTMLInputElement;
  if (input) {
    // input의 value 확인
    let value = input.value?.trim();
    if (value) {
      console.log(`[데이터 추출] "${labelText}" input value에서 발견: "${value}"`);
      return value;
    }
    
    // value가 없으면 input의 textContent 확인
    value = input.textContent?.trim();
    if (value) {
      console.log(`[데이터 추출] "${labelText}" input textContent에서 발견: "${value}"`);
      return value;
    }
  }

  // 4. input이 없거나 값이 없으면 td의 textContent 확인
  let value = td.textContent?.trim();
  if (value) {
    // input 요소의 텍스트는 제외하고 실제 값만 추출
    if (input) {
      const inputText = input.textContent?.trim() || '';
      value = value.replace(inputText, '').trim();
    }
    // 라벨 텍스트 제거
    value = value.replace(/필수\s*입력\s*항목/gi, '').trim();
    value = value.replace(labelText, '').trim();
    
    if (value) {
      console.log(`[데이터 추출] "${labelText}" td textContent에서 발견: "${value}"`);
      return value;
    }
  }

  console.log(`[데이터 추출] "${labelText}" 값을 찾을 수 없음`);
  return undefined;
}

/**
 * ID로 직접 요소를 찾아 값을 추출하는 헬퍼 함수
 * 값이 비어있을 경우 MutationObserver로 값이 채워질 때까지 대기
 */
function extractValueById(id: string, label: string, waitForValue: boolean = true): Promise<string | undefined> {
  return new Promise((resolve) => {
    const element = document.querySelector(`#${id}`) as HTMLInputElement;
    if (!element) {
      console.log(`[데이터 추출] ID "${id}" 요소를 찾을 수 없음`);
      resolve(undefined);
      return;
    }

    // 즉시 값 확인
    let value = element.value?.trim();
    if (value) {
      console.log(`[데이터 추출] "${label}" ID로 value에서 발견: "${value}"`);
      resolve(value);
      return;
    }

    // textContent 확인
    value = element.textContent?.trim();
    if (value) {
      console.log(`[데이터 추출] "${label}" ID로 textContent에서 발견: "${value}"`);
      resolve(value);
      return;
    }

    // 값이 없고 대기를 원하는 경우 MutationObserver로 감시
    if (waitForValue) {
      console.log(`[데이터 추출] "${label}" 값이 비어있음. 값이 채워질 때까지 대기...`);
      
      let timeoutId: number | undefined;
      let observer: MutationObserver | undefined;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (observer) observer.disconnect();
      };

      // 최대 3초 대기
      timeoutId = window.setTimeout(() => {
        cleanup();
        console.log(`[데이터 추출] "${label}" 대기 시간 초과`);
        resolve(undefined);
      }, 3000);

      // MutationObserver로 값 변경 감지
      observer = new MutationObserver(() => {
        const currentValue = (element as HTMLInputElement).value?.trim();
        if (currentValue) {
          cleanup();
          console.log(`[데이터 추출] "${label}" 값이 채워짐: "${currentValue}"`);
          resolve(currentValue);
        }
      });

      // element의 attributes와 childList 변경 감시
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['value'],
        childList: true,
        subtree: true,
      });

      // input 이벤트도 감지 (직접 입력 시)
      const inputHandler = () => {
        const currentValue = (element as HTMLInputElement).value?.trim();
        if (currentValue) {
          element.removeEventListener('input', inputHandler);
          cleanup();
          console.log(`[데이터 추출] "${label}" input 이벤트로 값 발견: "${currentValue}"`);
          resolve(currentValue);
        }
      };
      element.addEventListener('input', inputHandler);

      // change 이벤트도 감지
      const changeHandler = () => {
        const currentValue = (element as HTMLInputElement).value?.trim();
        if (currentValue) {
          element.removeEventListener('change', changeHandler);
          cleanup();
          console.log(`[데이터 추출] "${label}" change 이벤트로 값 발견: "${currentValue}"`);
          resolve(currentValue);
        }
      };
      element.addEventListener('change', changeHandler);
    } else {
      // 대기하지 않는 경우
      console.log(`[데이터 추출] "${label}" ID로 값을 찾을 수 없음`);
      resolve(undefined);
    }
  });
}

/**
 * 기존 페이지의 DOM에서 데이터를 추출합니다.
 * contentArea를 비우기 전에 호출해야 합니다.
 * 비동기로 값을 기다리므로 Promise를 반환합니다.
 */
export async function extractPageData(): Promise<ExtractedPageData> {
  const data: ExtractedPageData = {};

  console.log('[데이터 추출] 시작');

  // 담당자 정보 추출 - 여러 방법 시도
  // 방법 1: ID로 직접 찾기 (값이 채워질 때까지 대기)
  data.managerName = await extractValueById('mngr', '담당자', true);
  
  // 방법 2: 테이블에서 "담당자" 라벨로 찾기
  if (!data.managerName) {
    data.managerName = extractValueFromTableRow('담당자');
  }
  
  // 연락처 정보 추출
  // 방법 1: ID로 직접 찾기 (값이 채워질 때까지 대기)
  data.managerPhone = await extractValueById('mngrTelno', '연락처', true);
  
  // 방법 2: 테이블에서 "연락처" 라벨로 찾기
  if (!data.managerPhone) {
    data.managerPhone = extractValueFromTableRow('연락처');
  }

  // 신청대상 추출
  // 방법 1: ID로 직접 찾기 (값이 채워질 때까지 대기)
  data.applicantType = await extractValueById('identityCode', '신청대상', true);
  
  // 방법 2: 테이블에서 "신청대상" 라벨로 찾기
  if (!data.applicantType) {
    data.applicantType = extractValueFromTableRow('신청대상');
  }

  // 신청자 이름 추출 (#userNm)
  data.applicantName = await extractValueById('userNm', '신청자', false);
  
  // 학번 추출 (#hakbun)
  data.applicantStudentId = await extractValueById('hakbun', '학번', false);

  // 휴대전화번호 추출 (#telno)
  data.applicantPhone = await extractValueById('telno', '휴대전화번호', false);

  // 이메일 추출 (#email)
  data.applicantEmail = await extractValueById('email', '이메일', false);
  
  // 빈 문자열이면 undefined로 변환
  if (data.managerName === '') data.managerName = undefined;
  if (data.managerPhone === '') data.managerPhone = undefined;
  if (data.applicantType === '') data.applicantType = undefined;
  if (data.applicantName === '') data.applicantName = undefined;
  if (data.applicantStudentId === '') data.applicantStudentId = undefined;
  if (data.applicantPhone === '') data.applicantPhone = undefined;
  if (data.applicantEmail === '') data.applicantEmail = undefined;
  
  // 디버깅을 위한 로그
  console.log('[데이터 추출] 최종 결과:', {
    managerName: data.managerName,
    managerPhone: data.managerPhone,
    applicantType: data.applicantType,
    applicantName: data.applicantName,
    applicantStudentId: data.applicantStudentId,
    applicantPhone: data.applicantPhone,
    applicantEmail: data.applicantEmail,
  });

  // 신청안내 추출
  const guideDiv = document.querySelector('#guide');
  if (guideDiv) {
    const guideItems: string[] = [];
    // guide div 내부의 텍스트나 리스트 항목들을 추출
    const paragraphs = guideDiv.querySelectorAll('p');
    const listItems = guideDiv.querySelectorAll('li');
    
    if (paragraphs.length > 0) {
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text) guideItems.push(text);
      });
    } else if (listItems.length > 0) {
      listItems.forEach(li => {
        const text = li.textContent?.trim();
        if (text) guideItems.push(text);
      });
    } else {
      // 직접 텍스트가 있는 경우
      const text = guideDiv.textContent?.trim();
      if (text) {
        // 줄바꿈이나 특정 구분자로 분리
        guideItems.push(...text.split(/\n|•/).filter(item => item.trim()).map(item => item.trim()));
      }
    }
    
    if (guideItems.length > 0) {
      data.guideItems = guideItems;
    }
  }

  return data;
}