export interface GoodsSpec {
  [key: string]: string;
}

export interface GoodsWarning {
  [key: string]: string;
}

export interface GoodsData {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'reserved' | 'unavailable';
  imageUrl?: string;
  description?: string;
  specs?: GoodsSpec;
  warnings?: GoodsWarning;
}

import { getWarningsByGoodsName } from './goodsWarnings';

// 한성대 기자재 예약 시스템의 실제 데이터를 가져오는 함수
export const fetchGoodsFromHansung = async (): Promise<GoodsData[]> => {
  try {
    // 실제 한성대 기자재 예약 페이지에서 데이터 스크래핑
    const response = await fetch('https://hansung.ac.kr/cncschool/7309/subview.do');
    const html = await response.text();
    
    // DOM 파싱
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const goods: GoodsData[] = [];
    
    // 기자재 목록 파싱 (실제 HTML 구조에 맞게 조정 필요)
    const items = doc.querySelectorAll('.goods-item, [data-goods], .item'); // 실제 선택자 사용
    
    items.forEach((item, index) => {
      const nameElement = item.querySelector('h3, .name, .title');
      const categoryElement = item.querySelector('.category, .cate');
      const imageElement = item.querySelector('img');
      const specElements = item.querySelectorAll('.spec, [data-spec]');

      if (nameElement) {
        const specs: GoodsSpec = {};
        specElements.forEach((spec) => {
          const key = spec.getAttribute('data-spec-key') || `spec${Object.keys(specs).length + 1}`;
          specs[key] = spec.textContent || '';
        });
        
        const name = nameElement.textContent || `기자재 ${index + 1}`;

        // 주의사항은 사전에서 가져오기
        const warnings = getWarningsByGoodsName(name);

        goods.push({
          id: `goods-${index}`,
          name,
          category: categoryElement?.textContent || '분류 없음',
          status: 'available',
          imageUrl: imageElement?.getAttribute('src') || undefined,
          specs: Object.keys(specs).length > 0 ? specs : undefined,
          warnings,
        });
      }
    });
    
    return goods;
  } catch (error) {
    console.error('Failed to fetch goods:', error);
    // 폴백: 기본 목록 반환
    return getDefaultGoods();
  }
};

// 기본 목록 (개발/테스트용)
export const getDefaultGoods = (): GoodsData[] => {
  return [
    {
      id: '1',
      name: '노트북',
      category: '컴퓨터',
      status: 'available',
      imageUrl: 'https://via.placeholder.com/200x150?text=노트북',
      description: '강의 및 과제용 고사양 노트북',
      specs: {
        '프로세서': 'Intel i7',
        'RAM': '16GB',
        'SSD': '512GB',
        'OS': 'Windows 11',
      },
      warnings: getWarningsByGoodsName('노트북'),
    },
    {
      id: '2',
      name: '4K 카메라',
      category: '촬영장비',
      status: 'reserved',
      imageUrl: 'https://via.placeholder.com/200x150?text=4K카메라',
      description: '영상 제작용 프로페셔널 4K 카메라',
      specs: {
        '해상도': '4K UHD',
        '프레임': '60fps',
        '센서': 'Full Frame',
        '무게': '1.2kg',
      },
      warnings: getWarningsByGoodsName('4K 카메라'),
    },
    {
      id: '3',
      name: 'Full HD 프로젝터',
      category: '발표장비',
      status: 'available',
      imageUrl: 'https://via.placeholder.com/200x150?text=프로젝터',
      description: '대규모 강의실용 고밝기 프로젝터',
      specs: {
        '밝기': '3000 루멘',
        '해상도': 'Full HD',
        '명암비': '3000:1',
        '무게': '2.8kg',
      },
      warnings: getWarningsByGoodsName('Full HD 프로젝터'),
    },
    {
      id: '4',
      name: '3D 프린터',
      category: '프린팅',
      status: 'available',
      imageUrl: 'https://via.placeholder.com/200x150?text=3D프린터',
      description: '고정밀 ABS/PLA 대응 3D 프린터',
      specs: {
        '타입': 'FDM',
        '프린팅 크기': '200x200x200mm',
        '노즐': '0.4mm',
        '온도': '최대 250℃',
      },
      warnings: getWarningsByGoodsName('3D 프린터'),
    },
  ];
};

// 예약 기자재 조회
export const getReservationGoods = async (): Promise<GoodsData[]> => {
  const goods = await fetchGoodsFromHansung();
  return goods.filter(item => item.status === 'reserved');
};
