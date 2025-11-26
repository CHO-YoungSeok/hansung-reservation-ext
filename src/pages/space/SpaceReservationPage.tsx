import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceReservationForm } from '../../components/space/SpaceReservationForm/SpaceReservationForm';
import spaceListData from '../../components/space/data/spaceListData.json';
import { getListUrl } from '../../config/space';
import type { ExtractedPageData } from '../../utils/pageDataExtractor';
import { buildTimeSlotsForRoom } from '../../utils/calendarEvents';
import { submitSpaceReservation } from '../../utils/spaceFormSubmit';
import type { ApplicantProfile } from '../../components/space/SpaceReservationForm/types';
import { getTodayString } from '../../utils/dateUtils';

export const SpaceReservationPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const spaceId = urlParams.get('spaceId') || '1';

  const selectedSpace = (spaceListData as any[]).find((space) => space.id === spaceId)
    || (spaceListData as any[])[0];

  const pageData = useMemo<ExtractedPageData>(() => {
    return (window as any).__EXTRACTED_PAGE_DATA__ || {};
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => getTodayString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 날짜나 공간이 변경될 때만 timeSlots 재계산
  const timeSlots = useMemo(() => {
    return buildTimeSlotsForRoom(selectedSpace.name, selectedDate);
  }, [selectedSpace.name, selectedDate]);


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
        isSubmitting={isSubmitting}
        onSubmit={async (payload) => {
          setIsSubmitting(true);

          try {
            // 신청자 정보 구성
            const applicant: ApplicantProfile = {
              name: pageData?.applicantName || '',
              studentId: pageData?.applicantStudentId || '',
              phone: payload.values.phone,
              email: payload.values.email || '',
            };

            // 원본 폼에 데이터 채우고 제출
            const success = await submitSpaceReservation({
              spaceId: payload.spaceId,
              slotId: payload.slotId,
              values: payload.values,
              applicant,
            });

            if (success) {
              // 예약 성공 후 리스트 페이지로 이동
              window.location.href = getListUrl();
            } else {
              throw new Error('예약 제출에 실패했습니다.');
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '예약 제출 중 오류가 발생했습니다.';
            alert(`예약 제출 실패: ${errorMessage}`);
          } finally {
            setIsSubmitting(false);
          }
        }}
        onCancel={() => {
          window.location.href = getListUrl();
        }}
      />
    </Layout>
  );
};
