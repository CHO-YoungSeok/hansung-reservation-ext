import React from 'react';
import { SpaceListPage } from './SpaceListPage';
import { SpaceReservationPage } from './SpaceReservationPage';

export const SpaceRouter: React.FC = () => {
  // URL 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const encParam = urlParams.get('enc');

  if (encParam) {
    // enc 파라미터가 있으면 SpaceReservationPage 표시
    return <SpaceReservationPage />;
  }

  // enc 파라미터가 없으면 SpaceListPage 표시
  return <SpaceListPage />;
};

