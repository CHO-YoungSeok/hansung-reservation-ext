import React from 'react';
import { SpaceListPage } from './SpaceListPage';
import { SpaceDetailPage } from './SpaceDetailPage';

export const SpaceRouter: React.FC = () => {
  // URL 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const encParam = urlParams.get('enc');

  if (encParam) {
    // enc 파라미터가 있으면 SpaceDetailPage 표시
    return <SpaceDetailPage />;
  }

  // enc 파라미터가 없으면 SpaceListPage 표시
  return <SpaceListPage />;
};

