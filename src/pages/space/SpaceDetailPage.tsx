// src/pages/space/SpaceDetailPage.tsx
import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceReservationForm } from '../../components/space/SpaceDetailForm/SpaceDetailForm';
import spaceListData from '../../components/space/data/spaceListData.json';
import { getListUrl } from '../../config/space';
import type { ExtractedPageData } from '../../utils/pageDataExtractor';
import { buildTimeSlotsForRoom } from '../../utils/calendarEvents';


export const SpaceDetailPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const spaceId = urlParams.get('spaceId') || '1';

  const selectedSpace = (spaceListData as any[]).find((space) => space.id === spaceId)
    || (spaceListData as any[])[0];

  const pageData = useMemo<ExtractedPageData>(() => {
    return (window as any).__EXTRACTED_PAGE_DATA__ || {};
  }, []);

  // 🔥 여기서 오늘 날짜 기준으로 달력 데이터에서 슬롯을 뽑아온다
  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;  // "2025-11-21" 이런 형태
  }, []);

const [selectedDate, setSelectedDate] = useState(() => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;  // "2025-11-21"
});

  // const timeSlots = useMemo(() => {
  //   // selectedSpace.name 또는 roomGroup 등 실제 달력에 쓰이는 방 이름으로 맞춰주기
  //   return buildTimeSlotsForRoom(selectedSpace.name, selectedDate);
  // }, [selectedSpace.name, selectedDate]);

   // 🔍 디버깅용 로그: 날짜 바뀔 때마다 찍어보기
  useEffect(() => {
    console.log('[detail] selectedDate 변경:', selectedDate);
  }, [selectedDate]);

  // ✅ 매 렌더마다 현재 selectedDate 기준으로 항상 새로 계산
  const timeSlots = buildTimeSlotsForRoom(selectedSpace.name, selectedDate);
  // 필요하면 여기서도 로그
  console.log(
    '[detail] timeSlots 계산:',
    selectedSpace.name,
    selectedDate,
    'blocked 개수 =',
    timeSlots.filter((s) => s.status === 'blocked').length,
  );


  return (
    <Layout title="상상베이스 세미나실 예약">
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
        timeSlots={timeSlots}       
        pageData={pageData}
        onReservationDateChange={setSelectedDate}
        onSubmit={(payload) => {
          console.log('예약 제출:', payload);
          alert(`예약이 제출되었습니다.\n세미나실: ${selectedSpace.name}\n시간: ${payload.slotId}`);
        }}
        onCancel={() => {
          window.location.href = getListUrl();
        }}
      />
    </Layout>
  );
};
