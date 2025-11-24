import type { GoodsWarning } from './goodsApi';

/**
 * 기자재별 주의사항 사전
 * 기자재 이름을 키로, 주의사항 객체를 값으로 저장
 */
export const GOODS_WARNINGS_DICT: Record<string, GoodsWarning> = {
  '노트북': {
    '주의사항1': '대여 기간은 최대 7일입니다.',
    '주의사항2': '손상 시 수리비가 청구됩니다.',
    '주의사항3': '배터리를 완전히 방전시키지 마세요.',
  },
  '4K 카메라': {
    '주의사항1': '전문 교육이 필수입니다.',
    '주의사항2': '렌즈 손상에 주의하세요.',
    '주의사항3': '습기와 충격에 주의하세요.',
  },
  'Full HD 프로젝터': {
    '주의사항1': '렌즈 클리닝 후 반납해주세요.',
    '주의사항2': '과열 방지를 위해 20분 휴식이 필요합니다.',
    '주의사항3': '전원을 갑자기 끄지 마세요.',
  },
  '프로젝터': {
    '주의사항1': '렌즈 클리닝 후 반납해주세요.',
    '주의사항2': '과열 방지를 위해 20분 휴식이 필요합니다.',
    '주의사항3': '전원을 갑자기 끄지 마세요.',
  },
  '3D 프린터': {
    '주의사항1': '안전 교육이 필수입니다.',
    '주의사항2': '뜨거운 부분을 만지지 마세요.',
    '주의사항3': '환기가 잘 되는 곳에서 사용하세요.',
  },
  '카메라': {
    '주의사항1': '렌즈 손상에 주의하세요.',
    '주의사항2': '습기와 충격에 주의하세요.',
    '주의사항3': '메모리 카드를 포맷하지 마세요.',
  },
  '마이크': {
    '주의사항1': '큰 소리로 테스트하지 마세요.',
    '주의사항2': '물기에 주의하세요.',
    '주의사항3': '케이블을 무리하게 당기지 마세요.',
  },
  '삼각대': {
    '주의사항1': '무거운 장비 사용 시 안정성을 확인하세요.',
    '주의사항2': '다리를 완전히 펴서 사용하세요.',
  },
  '조명': {
    '주의사항1': '화상에 주의하세요.',
    '주의사항2': '장시간 사용 시 과열에 주의하세요.',
    '주의사항3': '전원 케이블을 정리하세요.',
  },
  '태블릿': {
    '주의사항1': '충격과 낙하에 주의하세요.',
    '주의사항2': '배터리를 완전히 방전시키지 마세요.',
    '주의사항3': '대여 기간은 최대 3일입니다.',
  },
  '빔프로젝터': {
    '주의사항1': '렌즈 클리닝 후 반납해주세요.',
    '주의사항2': '과열 방지를 위해 20분 휴식이 필요합니다.',
    '주의사항3': '전원을 갑자기 끄지 마세요.',
  },
};

/**
 * 기자재 이름으로 주의사항 조회
 * @param goodsName 기자재 이름
 * @returns 주의사항 객체 또는 undefined
 */
export const getWarningsByGoodsName = (goodsName: string): GoodsWarning | undefined => {
  // 정확한 이름 매칭
  if (GOODS_WARNINGS_DICT[goodsName]) {
    return GOODS_WARNINGS_DICT[goodsName];
  }

  // 부분 매칭 (예: "Sony 4K 카메라" -> "4K 카메라")
  for (const [key, value] of Object.entries(GOODS_WARNINGS_DICT)) {
    if (goodsName.includes(key) || key.includes(goodsName)) {
      return value;
    }
  }

  return undefined;
};

/**
 * 주의사항 여부 확인
 * @param goodsName 기자재 이름
 * @returns 주의사항 존재 여부
 */
export const hasWarnings = (goodsName: string): boolean => {
  return getWarningsByGoodsName(goodsName) !== undefined;
};
