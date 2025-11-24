import type { GoodsData } from '~/src/services/goodsApi';
import { getWarningsByGoodsName } from '~/src/services/goodsWarnings';
import { getDescriptionByGoodsName, getCategoryDefaultDescription } from '~/src/services/goodsDescription';

/**
 * HTML 문자열에서 기자재 정보 추출
 */
const parseGoodsFromHTML = (html: string): GoodsData[] => {
  const goods: GoodsData[] = [];

  try {
    // DOMParser로 HTML 파싱
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 테이블 찾기
    const table = doc.querySelector('table[data-namo-table-template]') || doc.querySelector('table');

    if (!table) {
      console.warn('⚠️ HTML에서 테이블을 찾을 수 없습니다.');
      return [];
    }

    console.log('✓ 테이블 발견');

    const tbody = table.querySelector('tbody');
    if (!tbody) {
      console.warn('⚠️ tbody를 찾을 수 없습니다.');
      return [];
    }

    // 모든 행 가져오기
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (rows.length === 0) {
      console.warn('⚠️ 테이블 행을 찾을 수 없습니다.');
      return [];
    }

    console.log(`✓ 총 ${rows.length}개의 행 발견 (헤더 포함)`);

    // 첫 번째 행은 헤더이므로 건너뛰기
    let cardIndex = 0; // 카드 고유 ID용 인덱스
    let currentGoodsName = ''; // 현재 기자재명 추적 (rowspan 처리용)

    rows.slice(1).forEach((row, rowIndex) => {
      try {
        const cells = row.querySelectorAll('td');

        if (cells.length === 0) {
          console.warn(`⚠️ 행 ${rowIndex + 1}: 셀이 없습니다`);
          return;
        }

        // 첫 번째 셀이 기자재명인지 확인
        // rowspan으로 인해 첫 번째 셀이 없을 수 있음
        const firstCellText = cells[0]?.textContent?.trim() || '';

        // 첫 번째 셀이 비어있지 않고 의미있는 텍스트가 있으면 새로운 기자재명
        const hasGoodsName = firstCellText.length > 0 &&
                             !firstCellText.match(/^\s*$/) &&
                             cells.length >= 5; // 기자재명 + 최소 1세트(4개)

        let startIndex = 0; // 데이터 시작 인덱스

        if (hasGoodsName) {
          // 새로운 기자재명 발견
          currentGoodsName = firstCellText;
          startIndex = 1; // cells[1]부터 데이터 시작
          console.log(`\n📦 새 기자재 발견: ${currentGoodsName}`);
        } else {
          // rowspan으로 기자재명이 생략됨 (이전 기자재명 계속 사용)
          startIndex = 0; // cells[0]부터 데이터 시작
          if (!currentGoodsName) {
            currentGoodsName = `기자재 ${rowIndex + 1}`;
          }
          console.log(`  ↳ ${currentGoodsName} 계속 (rowspan)`);
        }

        // 남은 셀로 세트 개수 계산
        const remainingCells = cells.length - startIndex;
        const setCount = Math.floor(remainingCells / 4);

        if (setCount === 0) {
          console.warn(`⚠️ 행 ${rowIndex + 1}: 유효한 세트가 없습니다 (${remainingCells}개 셀)`);
          return;
        }

        // 각 세트별로 카드 생성
        for (let i = 0; i < setCount; i++) {
          try {
            // 세트의 시작 인덱스
            const baseIdx = startIndex + (i * 4);

            // 세트가 완전한지 확인
            if (baseIdx + 3 >= cells.length) {
              console.warn(`⚠️ 세트 ${i + 1}: 불완전한 세트 (인덱스 ${baseIdx})`);
              break;
            }

            const imageCell = cells[baseIdx];      // 이미지
            const modelCell = cells[baseIdx + 1];  // 모델명
            const countCell = cells[baseIdx + 2];  // 대수
            const locationCell = cells[baseIdx + 3]; // 위치

            // 이미지 추출
            const imageElement = imageCell.querySelector('img');
            let imageUrl: string | undefined;

            if (imageElement) {
              const src = imageElement.getAttribute('src');
              if (src) {
                // 상대 경로를 절대 경로로 변환
                if (src.startsWith('http')) {
                  imageUrl = src;
                } else if (src.startsWith('/')) {
                  imageUrl = `https://hansung.ac.kr${src}`;
                } else {
                  imageUrl = `https://hansung.ac.kr/cncschool/7309/${src}`;
                }
              }
            }

            // 모델명
            const model = modelCell.textContent?.trim() || '모델 정보 없음';

            // 대수
            const count = countCell.textContent?.trim() || '1';

            // 위치
            const location = locationCell.textContent?.trim() || '위치 정보 없음';

            cardIndex++;

            // 카드에 표시할 이름: "기자재명 : 모델명"
            const displayName = `${currentGoodsName} : ${model}`;

            // specs 정보 구성
            const specs = {
              '모델명': model,
              '대수': count,
              '위치': location,
            };

            // description - 모델명으로 설명 조회
            const goodsDesc = getDescriptionByGoodsName(model);
            const description = goodsDesc || getCategoryDefaultDescription(currentGoodsName);

            // 주의사항 사전에서 가져오기 (기본 기자재 이름으로)
            const warnings = getWarningsByGoodsName(currentGoodsName);

            // 기본적으로 모든 기자재는 예약 가능으로 설정
            const status: 'available' | 'reserved' | 'unavailable' = 'available';

            goods.push({
              id: `goods-${cardIndex}`,
              name: displayName, // "기자재명 : 모델명" 형식
              category: currentGoodsName, // 원래 기자재명은 category에 보관
              status,
              imageUrl,
              description,
              specs,
              warnings,
            });

            console.log(`  ✓ 카드 ${cardIndex}: ${displayName} (${count}, ${location})`);
          } catch (setError) {
            console.error(`  ❌ 세트 ${i + 1} 파싱 오류:`, setError);
          }
        }
      } catch (error) {
        console.error(`❌ 행 ${rowIndex + 1} 파싱 오류:`, error);
      }
    });

    console.log(`✅ 총 ${goods.length}개의 기자재 정보 추출 완료`);
  } catch (error) {
    console.error('❌ HTML 파싱 중 오류:', error);
  }

  return goods;
};

/**
 * fetch로 페이지 HTML을 직접 가져와서 파싱
 */
export const fetchGoodsFromCurrentPage = async (): Promise<GoodsData[]> => {
  console.log('🔍 기자재 정보 추출 시작...');

  try {
    // 방법 1: fetch로 HTML 직접 가져오기
    console.log('📡 페이지 HTML 가져오는 중...');
    const response = await fetch(window.location.href);
    const html = await response.text();
    console.log('✓ HTML 수신 완료');

    // URL에 따라 적절한 파싱 함수 선택
    const currentUrl = window.location.pathname;
    console.log(`📍 현재 URL: ${currentUrl}`);

    if (currentUrl.includes('lendMhrmlList.do')) {
      // 카테고리별 기자재 목록 페이지 (새 구조)
      console.log('→ lendMhrmlList.do 구조로 파싱');
      return parseGoodsFromLendList(html);
    } else if (currentUrl.includes('subview.do') || currentUrl.includes('lendSummary.do')) {
      // 개요 페이지 (테이블 구조)
      console.log('→ 테이블 구조로 파싱');
      return parseGoodsFromHTML(html);
    } else {
      // 기본값: 테이블 구조 시도
      console.log('→ 기본 테이블 구조로 파싱');
      return parseGoodsFromHTML(html);
    }
  } catch (error) {
    console.error('❌ fetch 실패, DOM에서 직접 시도:', error);

    // 방법 2: 현재 DOM에서 직접 시도 (폴백)
    const currentUrl = window.location.pathname;

    if (currentUrl.includes('lendMhrmlList.do')) {
      return parseGoodsFromLendList(document.documentElement.outerHTML);
    } else {
      return parseGoodsFromHTML(document.documentElement.outerHTML);
    }
  }
};

/**
 * DOM이 준비될 때까지 대기 후 추출 (동기 버전)
 */
export const fetchGoodsFromCurrentPageSync = (): GoodsData[] => {
  console.log('🔍 기자재 정보 추출 시작 (동기)...');

  // 현재 DOM에서 직접 추출
  return parseGoodsFromHTML(document.documentElement.outerHTML);
};

/**
 * 테이블이 로드될 때까지 대기하는 헬퍼 함수
 */
export const waitForTable = (timeout = 5000): Promise<Element | null> => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkTable = () => {
      const table = document.querySelector('table[data-namo-table-template]') || document.querySelector('table');

      if (table) {
        console.log('✓ 테이블 발견 (DOM)');
        resolve(table);
        return;
      }

      if (Date.now() - startTime > timeout) {
        console.warn('⚠️ 테이블 로드 타임아웃');
        resolve(null);
        return;
      }

      setTimeout(checkTable, 100);
    };

    checkTable();
  });
};

/**
 * lendMhrmlList.do 페이지에서 기자재 목록 추출
 * 구조: <div class="wrap-form wrap_list"> 내부에 여러 <div> 아이템
 */
export const parseGoodsFromLendList = (html: string): GoodsData[] => {
  const goods: GoodsData[] = [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // wrap-form wrap_list 찾기
    const wrapList = doc.querySelector('.wrap-form.wrap_list') || doc.querySelector('.wrap_list');

    if (!wrapList) {
      console.warn('⚠️ HTML에서 wrap_list를 찾을 수 없습니다.');
      return [];
    }

    console.log('✓ wrap_list 발견');

    // 각 기자재 아이템 찾기
    const items = wrapList.querySelectorAll(':scope > div');

    if (items.length === 0) {
      console.warn('⚠️ 기자재 아이템을 찾을 수 없습니다.');
      return [];
    }

    console.log(`✓ 총 ${items.length}개의 기자재 발견`);

    items.forEach((item, index) => {
      try {
        const link = item.querySelector('a');
        if (!link) return;

        // 이미지 추출
        const imgElement = link.querySelector('img');
        let imageUrl: string | undefined;
        let imageAlt = '';

        if (imgElement) {
          const src = imgElement.getAttribute('src');
          if (src) {
            if (src.startsWith('http')) {
              imageUrl = src;
            } else if (src.startsWith('/')) {
              imageUrl = `https://hansung.ac.kr${src}`;
            }
          }
          imageAlt = imgElement.getAttribute('alt') || '';
        }

        // 제목 추출
        const titleElement = link.querySelector('.title');
        const name = titleElement?.textContent?.trim() || '기자재';

        // 상태 정보 추출 (대수 / 대여가능)
        const statusElement = link.querySelector('.status');
        const statusText = statusElement?.textContent?.trim() || '';

        // 상태 텍스트 파싱
        // 예: "6 대 / 대여가능 : 6" 또는 "/ 대여가능 : 0"
        const totalMatch = statusText.match(/(\d+)\s*대/);
        const availableMatch = statusText.match(/대여가능\s*:\s*(\d+)/);

        const totalCount = totalMatch ? totalMatch[1] : '0';
        const availableCount = availableMatch ? availableMatch[1] : '0';

        // 대여 가능 여부 결정
        let status: 'available' | 'reserved' | 'unavailable' = 'unavailable';
        if (parseInt(availableCount) > 0) {
          status = 'available';
        } else if (parseInt(totalCount) > 0) {
          status = 'reserved';
        }

        // onclick 속성에서 정보 추출
        const onclickAttr = link.getAttribute('onclick');
        let category = '기타';
        let lendGroupSeq: string | undefined = undefined;
        let lendMhrmlSeq: string | undefined = undefined;

        if (onclickAttr) {
          // lendMhrmlRegistView('cncschool', '1', '2', '73')
          const matches = onclickAttr.match(/lendMhrmlRegistView\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\)/);
          if (matches) {
            lendGroupSeq = matches[3]; // '2', '4', '3', '1'
            lendMhrmlSeq = matches[4]; // '73', '41', etc.

            // lendGroupSeq로 카테고리 결정
            const categoryMap: Record<string, string> = {
              '2': '3D 프린터',
              '4': '레이저 커팅기',
              '3': '노트북',
              '1': 'VR/AR/기타',
            };
            category = categoryMap[lendGroupSeq] || '기타';
          }
        }

        // specs 정보 구성
        const specs = {
          '총 대수': totalCount,
          '대여가능': availableCount,
        };

        // description - 기자재별 상세 설명만 표시
        const goodsDesc = getDescriptionByGoodsName(name);
        const description = goodsDesc || getCategoryDefaultDescription(category);

        // 주의사항 사전에서 가져오기
        const warnings = getWarningsByGoodsName(category);

        goods.push({
          id: `goods-lend-${index + 1}`,
          name,
          category,
          status,
          imageUrl,
          description,
          specs,
          warnings,
          lendGroupSeq,
          lendMhrmlSeq,
        });

        console.log(`  ✓ 기자재 ${index + 1}: ${name} (${status})`);
      } catch (error) {
        console.error(`❌ 아이템 ${index + 1} 파싱 오류:`, error);
      }
    });

    console.log(`✅ 총 ${goods.length}개의 기자재 정보 추출 완료`);
  } catch (error) {
    console.error('❌ HTML 파싱 중 오류:', error);
  }

  return goods;
};

/**
 * 특정 기자재의 상세 정보를 현재 페이지에서 추출
 */
export const fetchGoodsDetailFromCurrentPage = (): GoodsData | null => {
  try {
    console.log('기자재 상세 정보 추출 시작...');

    // 제목/이름 추출
    const titleElement = document.querySelector('h1, h2, .title, .subject, .goods-name');
    const name = titleElement?.textContent?.trim() || '기자재';

    // 이미지 추출
    const imageElement = document.querySelector('.detail-image img, .view-image img, img[src*="goods"], img[src*="product"]');
    let imageUrl: string | undefined;

    if (imageElement) {
      const src = imageElement.getAttribute('src');
      if (src) {
        imageUrl = src.startsWith('http') ? src : new URL(src, window.location.href).href;
      }
    }

    // 카테고리 추출
    const categoryElement = document.querySelector('.category, .cate, .type');
    const category = categoryElement?.textContent?.trim() || '기타';

    // 설명 추출
    const descElement = document.querySelector('.description, .content, .view-content, .detail-content');
    const description = descElement?.textContent?.trim();

    // 상태 추출
    const statusElement = document.querySelector('.status, .state, [data-status]');
    const statusText = statusElement?.textContent?.trim().toLowerCase() || '';

    let status: 'available' | 'reserved' | 'unavailable' = 'available';
    if (statusText.includes('예약') || statusText.includes('reserved')) {
      status = 'reserved';
    } else if (statusText.includes('불가') || statusText.includes('unavailable')) {
      status = 'unavailable';
    }

    // 주의사항 사전에서 가져오기
    const warnings = getWarningsByGoodsName(name);

    const goodsDetail: GoodsData = {
      id: 'goods-detail',
      name,
      category,
      status,
      imageUrl,
      description,
      warnings,
    };

    console.log('기자재 상세 정보 추출 완료:', goodsDetail);
    return goodsDetail;
  } catch (error) {
    console.error('기자재 상세 정보 추출 중 오류:', error);
    return null;
  }
};
