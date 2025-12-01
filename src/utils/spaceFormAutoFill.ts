/**
 * 기존 페이지의 원래 폼에서 공간 선택 시 정보를 자동으로 채우는 유틸리티
 */

interface SpaceData {
  id: string;
  name: string;
  roomGroup?: string;
  groupId?: string; // group select의 value (예: "37")
}

// spaceListData에서 공간 정보를 가져오기 위한 임시 import
// 실제로는 동적으로 로드하거나 전역 변수로 관리
const SPACE_GROUP_ID = '37'; // "상상베이스"의 group ID

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

/**
 * group select를 먼저 선택하여 resveSpceSeq 옵션을 로드합니다.
 */
function selectGroup(groupId: string = SPACE_GROUP_ID): Promise<void> {
  return new Promise(async (resolve) => {
    // group select를 찾을 때까지 대기
    let groupSelect: HTMLSelectElement;
    try {
      groupSelect = await waitForElement('#group', 5000) as HTMLSelectElement;
    } catch (error) {
      resolve(); // 찾지 못해도 에러 없이 진행
      return;
    }

    // 이미 선택되어 있고 옵션도 로드되어 있으면 바로 resolve
    if (groupSelect.value === groupId) {
      const resveSpceSeqSelect = document.querySelector('#resveSpceSeq') as HTMLSelectElement;
      if (resveSpceSeqSelect && resveSpceSeqSelect.options.length > 1) {
        resolve();
        return;
      }
    }

    // group select에 value 설정
    groupSelect.value = groupId;
    
    // change 이벤트 발생시켜서 jf_selectGroup이 실행되도록
    const changeEvent = new Event('change', { bubbles: true });
    groupSelect.dispatchEvent(changeEvent);
    
    let timeoutId: number | undefined;
    let checkIntervalId: number | undefined;
    let isResolved = false;
    
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (checkIntervalId) clearInterval(checkIntervalId);
    };
    
    // resveSpceSeq 옵션이 로드될 때까지 대기
    const checkOptionsLoaded = () => {
      if (isResolved) return;
      
      const resveSpceSeqSelect = document.querySelector('#resveSpceSeq') as HTMLSelectElement;
      if (resveSpceSeqSelect && resveSpceSeqSelect.options.length > 1) {
        isResolved = true;
        cleanup();
        resolve();
      }
    };
    
    // 주기적으로 체크 (100ms마다)
    checkIntervalId = window.setInterval(checkOptionsLoaded, 100);
    
    // 최대 3초 대기
    timeoutId = window.setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve();
      }
    }, 3000);
  });
}

/**
 * 공간 ID로 resveSpceSeq select에 value를 설정하고 change 이벤트를 발생시켜서
 * 기존 JavaScript가 자동으로 정보를 채우도록 합니다.
 * @param spaceId 공간 ID (resveSpceSeq 값)
 */
export async function setSpaceSelection(spaceId: string): Promise<void> {
  // resveSpceSeq select를 찾을 때까지 대기
  let resveSpceSeqSelect: HTMLSelectElement;
  try {
    resveSpceSeqSelect = await waitForElement('#resveSpceSeq', 5000) as HTMLSelectElement;
  } catch (error) {
    return; // 찾지 못하면 종료
  }

  // select에 value 설정
  resveSpceSeqSelect.value = spaceId;
  
  // change 이벤트 발생시켜서 기존 JavaScript가 실행되도록
  const changeEvent = new Event('change', { bubbles: true });
  resveSpceSeqSelect.dispatchEvent(changeEvent);
}

/**
 * URL에서 spaceId를 가져와서 select에 자동으로 설정합니다.
 * group select를 먼저 선택한 후 resveSpceSeq를 선택합니다.
 * @returns Promise - 공간 선택이 완료되고 정보가 채워질 때까지 대기
 */
export function autoSelectSpaceFromUrl(): Promise<void> {
  return new Promise((resolve) => {
    const urlParams = new URLSearchParams(window.location.search);
    const spaceId = urlParams.get('spaceId');
    
    if (!spaceId) {
      resolve();
      return;
    }

    // 1. 먼저 group select 선택
    selectGroup().then(() => {
      // 2. group 선택 후 resveSpceSeq 옵션이 로드되면 spaceId 설정
      const trySetSpace = () => {
        const resveSpceSeqSelect = document.querySelector('#resveSpceSeq') as HTMLSelectElement;
        if (resveSpceSeqSelect && resveSpceSeqSelect.options.length > 1) {
          // 옵션 중에 spaceId가 있는지 확인
          const optionExists = Array.from(resveSpceSeqSelect.options).some(
            option => option.value === spaceId
          );
          
          if (optionExists) {
            // 이미 선택되어 있으면 바로 완료
            if (resveSpceSeqSelect.value === spaceId) {
              const mngrInput = document.querySelector('#mngr') as HTMLInputElement;
              const mngrTelnoInput = document.querySelector('#mngrTelno') as HTMLInputElement;
              const identityCodeInput = document.querySelector('#identityCode') as HTMLInputElement;
              
              // 이미 정보가 채워져 있으면 바로 완료
              if (mngrInput?.value || mngrTelnoInput?.value || identityCodeInput?.value) {
                resolve();
                return;
              }
            }
            
            setSpaceSelection(spaceId);
            
            let timeoutId: number | undefined;
            let checkIntervalId: number | undefined;
            let isResolved = false;
            
            const cleanup = () => {
              if (timeoutId) clearTimeout(timeoutId);
              if (checkIntervalId) clearInterval(checkIntervalId);
            };
            
            // 공간 선택 후 정보가 채워질 때까지 대기
            const checkInfoFilled = () => {
              if (isResolved) return;
              
              const mngrInput = document.querySelector('#mngr') as HTMLInputElement;
              const mngrTelnoInput = document.querySelector('#mngrTelno') as HTMLInputElement;
              const identityCodeInput = document.querySelector('#identityCode') as HTMLInputElement;
              
              // 하나라도 값이 있으면 정보가 채워진 것으로 간주
              if (mngrInput?.value || mngrTelnoInput?.value || identityCodeInput?.value) {
                isResolved = true;
                cleanup();
                resolve();
              }
            };
            
            // 주기적으로 체크 (100ms마다)
            checkIntervalId = window.setInterval(checkInfoFilled, 100);
            
            // 최대 3초 대기
            timeoutId = window.setTimeout(() => {
              if (!isResolved) {
                isResolved = true;
                cleanup();
                resolve();
              }
            }, 3000);
          } else {
            resolve();
          }
        } else {
          // 아직 옵션이 로드되지 않았으면 다시 시도
          setTimeout(trySetSpace, 100);
        }
      };
      
      trySetSpace();
    });
  });
}

let isAutoFilling = false; // 중복 실행 방지 플래그
let autoFillObserver: MutationObserver | null = null; // Observer 참조 저장

/**
 * 기존 페이지의 원래 폼에서 공간 선택 자동 채우기를 설정합니다.
 */
export function setupSpaceAutoFill(): void {
  // 기존 observer가 있으면 제거
  if (autoFillObserver) {
    autoFillObserver.disconnect();
    autoFillObserver = null;
  }
  
  // URL에서 spaceId가 있으면 자동으로 선택
  autoSelectSpaceFromUrl();
  
  // MutationObserver로 select 옵션이 동적으로 추가되는 것을 감지
  const resveSpceSeqSelect = document.querySelector('#resveSpceSeq') as HTMLSelectElement;
  if (resveSpceSeqSelect) {
    autoFillObserver = new MutationObserver(() => {
      // 중복 실행 방지
      if (isAutoFilling) return;
      
      // 옵션이 추가되면 URL의 spaceId를 다시 확인
      const urlParams = new URLSearchParams(window.location.search);
      const spaceId = urlParams.get('spaceId');
      
      if (spaceId && resveSpceSeqSelect.options.length > 1) {
        const optionExists = Array.from(resveSpceSeqSelect.options).some(
          option => option.value === spaceId
        );
        
        // 이미 선택되어 있고 정보도 채워져 있으면 실행하지 않음
        if (optionExists && resveSpceSeqSelect.value === spaceId) {
          const mngrInput = document.querySelector('#mngr') as HTMLInputElement;
          const mngrTelnoInput = document.querySelector('#mngrTelno') as HTMLInputElement;
          const identityCodeInput = document.querySelector('#identityCode') as HTMLInputElement;
          
          if (mngrInput?.value || mngrTelnoInput?.value || identityCodeInput?.value) {
            return; // 이미 완료된 상태
          }
        }
        
        if (optionExists && resveSpceSeqSelect.value !== spaceId) {
          isAutoFilling = true;
          setSpaceSelection(spaceId).then(() => {
            setTimeout(() => { isAutoFilling = false; }, 1000);
          });
        }
      }
    });
    
    autoFillObserver.observe(resveSpceSeqSelect, {
      childList: true,
      subtree: true,
    });
  }
}

