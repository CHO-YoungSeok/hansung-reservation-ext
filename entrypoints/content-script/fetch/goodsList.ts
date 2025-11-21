import type { GoodsData } from '~/src/services/goodsApi';
import { getWarningsByGoodsName } from '~/src/services/goodsWarnings';

/**
 * 현재 페이지의 DOM에서 기자재 정보를 실시간으로 추출
 */
export const fetchGoodsFromCurrentPage = (): GoodsData[] => {
  const goods: GoodsData[] = [];

  try {
    console.log('페이지에서 기자재 정보 추출 시작...');

    // 다양한 선택자를 시도하여 기자재 목록 찾기
    const possibleSelectors = [
      '.goods-item',
      '.item',
      '[data-goods]',
      '.board-list-item',
      '.list-item',
      'tbody tr',
      '.product-item',
    ];

    let items: NodeListOf<Element> | null = null;

    for (const selector of possibleSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        items = elements;
        console.log(`기자재 항목 발견: ${selector} (${elements.length}개)`);
        break;
      }
    }

    if (!items || items.length === 0) {
      console.warn('기자재 항목을 찾을 수 없습니다.');
      return [];
    }

    // 각 항목에서 정보 추출
    items.forEach((item, index) => {
      try {
        // 이름 추출
        const nameElement = item.querySelector('h3, .name, .title, .goods-name, td:first-child, .subject a, a[href*="view"]');
        const name = nameElement?.textContent?.trim() || `기자재 ${index + 1}`;

        // 카테고리 추출
        const categoryElement = item.querySelector('.category, .cate, .type, td:nth-child(2)');
        const category = categoryElement?.textContent?.trim() || '기타';

        // 이미지 추출
        const imageElement = item.querySelector('img');
        let imageUrl: string | undefined;

        if (imageElement) {
          const src = imageElement.getAttribute('src');
          if (src) {
            imageUrl = src.startsWith('http') ? src : new URL(src, window.location.href).href;
          }
        }

        // 상태 추출
        const statusElement = item.querySelector('.status, .state, [data-status], td:last-child');
        const statusText = statusElement?.textContent?.trim().toLowerCase() || '';

        let status: 'available' | 'reserved' | 'unavailable' = 'available';
        if (statusText.includes('예약') || statusText.includes('reserved')) {
          status = 'reserved';
        } else if (statusText.includes('불가') || statusText.includes('unavailable')) {
          status = 'unavailable';
        }

        // 설명 추출
        const descElement = item.querySelector('.description, .desc, .content, p');
        const description = descElement?.textContent?.trim();

        // 주의사항 사전에서 가져오기
        const warnings = getWarningsByGoodsName(name);

        goods.push({
          id: `goods-${index + 1}`,
          name,
          category,
          status,
          imageUrl,
          description,
          warnings,
        });

        console.log(`기자재 추출 완료: ${name}`);
      } catch (error) {
        console.error(`항목 ${index} 파싱 오류:`, error);
      }
    });

    console.log(`총 ${goods.length}개의 기자재 정보 추출 완료`);
  } catch (error) {
    console.error('기자재 정보 추출 중 오류:', error);
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
