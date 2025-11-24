import React, { useMemo } from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceReservationForm } from '../../components/space/SpaceDetailForm/SpaceDetailForm';
import spaceListData from '../../components/space/data/spaceListData.json';
import { getListUrl } from '../../config/space';
import type { ExtractedPageData } from '../../utils/pageDataExtractor';

interface SpaceData {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: string;
  location?: string;
  description?: string;
  coverImageUrl?: string;
  managerContact?: string;
  operatingHours?: string;
  roomGroup?: string;
}

export const SpaceDetailPage: React.FC = () => {
  // URL에서 spaceId 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const spaceId = urlParams.get('spaceId') || '1';
  const selectedSpace = (spaceListData as SpaceData[]).find((space) => space.id === spaceId) || (spaceListData as SpaceData[])[0];

  // 기존 페이지에서 추출한 데이터 가져오기
  const pageData = useMemo<ExtractedPageData>(() => {
    return (window as any).__EXTRACTED_PAGE_DATA__ || {};
  }, []);

  return (
    <SpaceReservationForm
        space={{
          id: selectedSpace.id,
          name: selectedSpace.name,
          location: selectedSpace.location || '위치 정보 없음',
          capacity: selectedSpace.capacity,
          facilities: selectedSpace.facilities,
          description: selectedSpace.description,
          coverImageUrl: selectedSpace.coverImageUrl,
          managerContact: selectedSpace.managerContact,
          operatingHours: selectedSpace.operatingHours,
          roomGroup: selectedSpace.roomGroup,
        }}
        pageData={pageData}
        onSubmit={(payload) => {
          console.log('예약 제출:', payload);
          alert(`예약이 제출되었습니다.\n세미나실: ${selectedSpace.name}\n시간: ${payload.slotId}`);
        }}
        onCancel={() => {
          console.log('예약 취소');
          window.location.href = getListUrl();
        }}
      />
  );
};
