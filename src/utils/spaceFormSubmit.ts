/**
 * 원본 페이지의 폼에 데이터를 채우고 제출하는 유틸리티
 */

import { ReservationFormValues } from '../components/space/SpaceReservationForm/types';
import { ApplicantProfile } from '../components/space/SpaceReservationForm/types';
import { normalizeDateString } from './dateUtils';

export interface SpaceReservationPayload {
  spaceId: string;
  slotId: string; // 콤마로 구분된 시간 슬롯 ID들 (예: "09,10")
  values: ReservationFormValues;
  applicant: ApplicantProfile;
}

/**
 * 날짜 문자열을 원본 폼 형식으로 변환
 * 원본 폼의 datepicker가 사용하는 형식으로 변환
 * "2025-01-15" -> datepicker 형식 (YYYY-MM-DD)
 */
function formatDateForForm(dateString: string): string {
  return normalizeDateString(dateString);
}

/**
 * 시간 슬롯 ID를 checkbox 인덱스로 변환
 * "09" -> 0 (checkbox #r0)
 * "10" -> 1 (checkbox #r1)
 * "11" -> 2 (checkbox #r2)
 * ...
 * "20" -> 11 (checkbox #r11)
 */
function getCheckboxIndex(slotId: string): number {
  const hour = parseInt(slotId, 10);
  return hour - 9; // 09시는 0번 인덱스
}

/**
 * 원본 페이지의 폼 필드에 데이터를 채웁니다.
 */
/**
 * DOM에서 요소를 찾을 때까지 대기하는 헬퍼 함수
 */
function waitForElement(selector: string, timeout: number = 5000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    // 먼저 즉시 확인
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      resolve(element);
      return;
    }

    // 없으면 MutationObserver로 감시
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 타임아웃 설정
    setTimeout(() => {
      observer.disconnect();
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        resolve(element);
      } else {
        reject(new Error(`요소를 찾을 수 없습니다: ${selector}`));
      }
    }, timeout);
  });
}

export async function fillOriginalForm(
  payload: SpaceReservationPayload
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // 원본 폼이 있는지 먼저 확인
      let form = document.querySelector('form[name="actionForm"]') as HTMLFormElement;
      if (!form) {
        // 폼을 찾을 때까지 대기
        try {
          form = await waitForElement('form[name="actionForm"]', 5000) as HTMLFormElement;
        } catch (error) {
          reject(new Error('원본 폼을 찾을 수 없습니다.'));
          return;
        }
      }

      // 1. 예약일 설정 (#resveDe) - 필드를 찾을 때까지 대기
      // 먼저 폼 내부에서 찾고, 없으면 전체 문서에서 찾기
      let resveDeInput: HTMLInputElement | null = form.querySelector('#resveDe') as HTMLInputElement;
      if (!resveDeInput) {
        try {
          resveDeInput = await waitForElement('#resveDe', 5000) as HTMLInputElement;
        } catch (error) {
          reject(new Error('#resveDe 필드를 찾을 수 없습니다.'));
          return;
        }
      }

      const formattedDate = formatDateForForm(payload.values.reservationDate);
      if (resveDeInput.readOnly) {
        resveDeInput.removeAttribute('readonly');
      }
      resveDeInput.value = formattedDate;
      resveDeInput.dispatchEvent(new Event('input', { bubbles: true }));
      resveDeInput.dispatchEvent(new Event('change', { bubbles: true }));
      resveDeInput.dispatchEvent(new Event('blur', { bubbles: true }));

      // 2. 시간 슬롯 설정 (checkbox들: #r0, #r1, #r2, ... #r11)
      const slotIds = payload.slotId.split(',').filter(id => id.trim() !== '');
      
      if (slotIds.length === 0) {
        reject(new Error('선택된 시간 슬롯이 없습니다.'));
        return;
      }
      
      // 먼저 모든 checkbox를 해제
      for (let i = 0; i < 12; i++) {
        const checkbox = document.querySelector(`#r${i}`) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = false;
          checkbox.disabled = false;
          checkbox.removeAttribute('disabled');
        }
      }

      // 선택된 시간 슬롯들의 checkbox를 체크
      const checkedIndices: number[] = [];
      slotIds.forEach(slotId => {
        const index = getCheckboxIndex(slotId.trim());
        if (index >= 0 && index < 12) {
          const checkbox = document.querySelector(`#r${index}`) as HTMLInputElement;
          if (checkbox) {
            checkbox.disabled = false;
            checkbox.removeAttribute('disabled');
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('click', { bubbles: true }));
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            checkedIndices.push(index);
          }
        }
      });

      // resveTm hidden input에 체크된 체크박스들의 값을 설정
      // 원본 폼은 name="resveTm"인 체크박스들의 value를 수집함
      const resveTmInput = document.querySelector('#resveTm') as HTMLInputElement;
      if (resveTmInput) {
        // 체크된 체크박스들의 value 수집
        const checkedBoxes = document.querySelectorAll('input[name="resveTm"]:checked') as NodeListOf<HTMLInputElement>;
        const resveTmValues: string[] = [];
        
        checkedBoxes.forEach(cb => {
          // 체크박스의 value 속성 확인
          if (cb.value && cb.value !== 'on') {
            resveTmValues.push(cb.value);
          } else {
            // value가 없거나 "on"이면 체크박스의 id에서 인덱스 추출 (#r0 -> 0)
            const match = cb.id.match(/r(\d+)/);
            if (match) {
              resveTmValues.push(match[1]);
            }
          }
        });
        
        // resveTm hidden input에 값 설정
        if (resveTmValues.length > 0) {
          resveTmInput.value = resveTmValues.join(',');
          resveTmInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (checkedIndices.length > 0) {
          // 체크박스에 value가 없으면 인덱스 사용
          resveTmInput.value = checkedIndices.join(',');
          resveTmInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // 3. 전화번호 설정 (#telno) - 필수
      const telnoInput = document.querySelector('#telno') as HTMLInputElement;
      if (telnoInput) {
        telnoInput.value = payload.values.phone;
        telnoInput.dispatchEvent(new Event('input', { bubbles: true }));
        telnoInput.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        reject(new Error('#telno 필드를 찾을 수 없습니다.'));
        return;
      }

      // 4. 이메일 설정 (#email) - 선택사항
      const emailInput = document.querySelector('#email') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = payload.values.email || '';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 5. 전체 이용자 정보 설정 (addItem1)
      // addItem tbody 안에 동적으로 생성될 수 있음
      let addItem1Input = document.querySelector('#addItem1') as HTMLInputElement | HTMLTextAreaElement;
      if (!addItem1Input) {
        addItem1Input = document.querySelector('input[name="addItem1"], textarea[name="addItem1"]') as HTMLInputElement | HTMLTextAreaElement;
      }
      if (!addItem1Input) {
        // addItem tbody 안에서 찾기
        const addItemTbody = document.querySelector('#addItem');
        if (addItemTbody) {
          addItem1Input = addItemTbody.querySelector('input[name="addItem1"], textarea[name="addItem1"]') as HTMLInputElement | HTMLTextAreaElement;
        }
      }
      if (addItem1Input) {
        addItem1Input.value = payload.values.allUsers || '';
        addItem1Input.dispatchEvent(new Event('input', { bubbles: true }));
        addItem1Input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.error('[폼 제출] addItem1 필드를 찾을 수 없습니다.');
      }

      // 6. 총 인원 수 설정 (addItem2)
      let addItem2Input = document.querySelector('#addItem2') as HTMLInputElement;
      if (!addItem2Input) {
        addItem2Input = document.querySelector('input[name="addItem2"]') as HTMLInputElement;
      }
      if (!addItem2Input) {
        // addItem tbody 안에서 찾기
        const addItemTbody = document.querySelector('#addItem');
        if (addItemTbody) {
          addItem2Input = addItemTbody.querySelector('input[name="addItem2"]') as HTMLInputElement;
        }
      }
      if (addItem2Input) {
        addItem2Input.value = String(payload.values.totalUsers || 1);
        addItem2Input.dispatchEvent(new Event('input', { bubbles: true }));
        addItem2Input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.error('[폼 제출] addItem2 필드를 찾을 수 없습니다.');
      }

      // 7. 건물 선택 및 예약공간 선택 - spaceFormAutoFill의 함수 재사용
      // 이미 선택되어 있을 가능성이 높지만, 확인 후 필요시 선택
      const groupSelect = document.querySelector('#group') as HTMLSelectElement;
      const spaceSelect = document.querySelector('#resveSpceSeq') as HTMLSelectElement;
      
      if (groupSelect && spaceSelect) {
        // 건물이 선택되어 있고, 예약공간도 선택되어 있는지 확인
        if (!(groupSelect.value && spaceSelect.value === payload.spaceId)) {
          const { setSpaceSelection } = await import('./spaceFormAutoFill');
          
          // 건물이 선택되어 있지 않으면 건물 선택 후 공간 선택
          if (!groupSelect.value || groupSelect.value === '') {
            groupSelect.value = '37';
            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
            
            // 옵션이 로드될 때까지 대기
            await new Promise(resolve => {
              const checkInterval = setInterval(() => {
                if (spaceSelect.options.length > 1) {
                  clearInterval(checkInterval);
                  resolve(undefined);
                }
              }, 100);
              setTimeout(() => {
                clearInterval(checkInterval);
                resolve(undefined);
              }, 3000);
            });
          }
          
          await setSpaceSelection(payload.spaceId);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } else {
        reject(new Error('건물 또는 예약공간 select를 찾을 수 없습니다.'));
        return;
      }

      // 필수 필드 검증
      const validationErrors: string[] = [];
      
      if (!resveDeInput?.value || resveDeInput.value.trim() === '') {
        validationErrors.push('예약일자');
      }
      
      const checkedCount = slotIds.filter(slotId => {
        const index = getCheckboxIndex(slotId.trim());
        if (index >= 0 && index < 12) {
          const checkbox = document.querySelector(`#r${index}`) as HTMLInputElement;
          return checkbox?.checked || false;
        }
        return false;
      }).length;
      
      if (checkedCount === 0) {
        validationErrors.push('시간 슬롯');
      }
      
      if (!telnoInput?.value || telnoInput.value.trim() === '') {
        validationErrors.push('전화번호');
      }
      
      if (!spaceSelect?.value || spaceSelect.value.trim() === '') {
        validationErrors.push('예약공간');
      }
      
      if (validationErrors.length > 0) {
        console.error('[폼 제출] 필수 필드 누락:', validationErrors.join(', '));
        reject(new Error(`필수 필드 누락: ${validationErrors.join(', ')}`));
        return;
      }

      // 원본 JS가 처리할 시간을 주고 resolve
      setTimeout(() => {
        resolve();
      }, 500);

    } catch (error) {
      console.error('[폼 제출] 원본 폼 채우기 중 오류:', error);
      reject(error);
    }
  });
}

/**
 * 원본 페이지의 submit 버튼을 찾아서 클릭합니다.
 */
export function submitOriginalForm(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const form = document.querySelector('form[name="actionForm"]') as HTMLFormElement;
      if (!form) {
        reject(new Error('Form not found'));
        return;
      }

      // 폼의 모든 필드 값 수집
      const formData = new FormData(form);
      const formValues: Record<string, string> = {};
      formData.forEach((value, key) => {
        formValues[key] = value.toString();
      });

      // input 필드들도 직접 확인
      const allInputs = form.querySelectorAll('input, select, textarea');
      allInputs.forEach((input) => {
        const element = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const name = element.name || element.id;
        if (name) {
          if (element.type === 'checkbox') {
            formValues[name] = (element as HTMLInputElement).checked ? 'checked' : 'unchecked';
          } else {
            formValues[name] = element.value || '';
          }
        }
      });

      console.log('[폼 제출] 제출되는 폼 데이터:', formValues);

      let submitButton = document.querySelector('input[type="submit"]') as HTMLInputElement;
      
      if (!submitButton) {
        submitButton = document.querySelector('#submitBtn') as HTMLInputElement;
      }

      if (!submitButton) {
        submitButton = document.querySelector('.submit-btn') as HTMLInputElement;
      }

      if (!submitButton) {
        form.submit();
        resolve(true);
        return;
      }

      if (submitButton.disabled) {
        reject(new Error('Submit button is disabled'));
        return;
      }

      submitButton.click();
      setTimeout(() => {
        resolve(true);
      }, 500);
    } catch (error) {
      console.error('[폼 제출] 오류:', error);
      reject(error);
    }
  });
}

/**
 * 원본 폼에 데이터를 채우고 제출하는 전체 프로세스
 */
export async function submitSpaceReservation(
  payload: SpaceReservationPayload
): Promise<boolean> {
  try {
    // 1. 원본 폼에 데이터 채우기
    await fillOriginalForm(payload);

    // 2. 약간의 지연 (필드 변경이 완전히 반영되도록)
    await new Promise(resolve => setTimeout(resolve, 200));

    // 3. submit 버튼 클릭
    const success = await submitOriginalForm();
    
    return success;
  } catch (error) {
    console.error('[폼 제출] 예약 제출 실패:', error);
    throw error;
  }
}

