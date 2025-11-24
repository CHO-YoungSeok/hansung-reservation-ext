/**
 * 기자재 예약 페이지 content script helper
 */

import { fetchGoodsFromCurrentPage, fetchGoodsDetailFromCurrentPage } from './goodsList';

export { fetchGoodsFromCurrentPage, fetchGoodsDetailFromCurrentPage };

/**
 * 현재 페이지가 기자재 목록 페이지인지 확인
 */
export const isGoodsListPage = (): boolean => {
  return window.location.pathname.includes('7309/subview.do');
};

/**
 * 현재 페이지가 기자재 상세 페이지인지 확인
 */
export const isGoodsDetailPage = (): boolean => {
  return window.location.pathname.includes('view.do') || window.location.search.includes('viewNo=');
};
