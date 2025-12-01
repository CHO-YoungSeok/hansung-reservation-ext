import React from 'react';
import { SpaceListPage } from './SpaceListPage';
import { SpaceReservationPage } from './SpaceReservationPage';

export const SpaceRouter: React.FC = () => {
  // URL 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const spaceId = urlParams.get('spaceId');

  if (spaceId) {
    // spaceId 파라미터가 있으면 예약 상세 페이지 표시
    return <SpaceReservationPage />;
  }

  // spaceId 파라미터가 없으면 예약 리스트 페이지 표시
  return <SpaceListPage />;
};

