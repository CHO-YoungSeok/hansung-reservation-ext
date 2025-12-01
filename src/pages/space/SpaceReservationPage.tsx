import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceReservationForm } from '../../components/space/SpaceReservationForm/SpaceReservationForm';
import spaceListData from '../../components/space/data/spaceListData.json';
import { getListUrl } from '../../config/space';
import { extractPageData, type ExtractedPageData } from '../../utils/pageDataExtractor';
import { buildTimeSlotsForRoom } from '../../utils/calendarEvents';
import { submitSpaceReservation } from '../../utils/spaceFormSubmit';
import type { ApplicantProfile, SpaceSummary } from '../../components/space/SpaceReservationForm/types';
import { getTodayString } from '../../utils/dateUtils';

/**
 * DOM에서 추출한 pageData로 selectedSpace 정보를 덮어쓰기
 */
function mergeSpaceWithPageData(
  selectedSpace: SpaceSummary,
  pageData: ExtractedPageData,
): SpaceSummary {
  // roomCapacity: "최대 8명" 같은 문자열이 들어있을 수 있음 → 숫자만 추출
  let capacity = selectedSpace.capacity;
  if (pageData.roomCapacity) {
    const m = pageData.roomCapacity.match(/\d+/);
    if (m) {
      const n = parseInt(m[0], 10);
      if (!Number.isNaN(n) && n > 0) {
        capacity = n;
      }
    }
  }

  const facilities =
    pageData.roomFacility
      ? [pageData.roomFacility]           // 문자열 하나면 배열로
      : selectedSpace.facilities;

  const location =
    pageData.roomLocation ||
    selectedSpace.location ||
    '위치 정보 없음';

  const operatingHours =
    pageData.roomOperatingHours ||
    selectedSpace.operatingHours;

  const managerContact =
    pageData.managerPhone ||
    selectedSpace.managerContact;

  return {
    ...selectedSpace,
    location,
    capacity,
    facilities,
    operatingHours,
    managerContact,
  };
}

export const SpaceReservationPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const spaceId = urlParams.get('spaceId') || '1';

  const selectedSpace =
    (spaceListData as SpaceSummary[]).find((space) => space.id === spaceId) ??
    (spaceListData as SpaceSummary[])[0];

  // ✅ pageData를 window 에서 한 번만 읽지 말고, state로 관리
  const [pageData, setPageData] = useState<ExtractedPageData>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await extractPageData();
        if (!cancelled) {
          setPageData(data);

          // 디버깅용: 실제로 뭐가 들어오는지 보고 싶으면 일단 켜두기
          // console.log('[SpaceReservationPage] pageData from DOM:', data);
        }
      } catch (e) {
        // 실패해도 전체 UI는 돌아가게
        // console.error('[SpaceReservationPage] extractPageData failed', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => getTodayString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 날짜나 공간이 변경될 때만 timeSlots 재계산
  const timeSlots = useMemo(
    () => buildTimeSlotsForRoom(selectedSpace.name, selectedDate),
    [selectedSpace.name, selectedDate],
  );

  // ✅ pageData가 바뀔 때마다 mergedSpace 재계산
  const mergedSpace = useMemo(
    () => mergeSpaceWithPageData(selectedSpace, pageData),
    [selectedSpace, pageData],
  );

  return (
    <Layout title="상상베이스 세미나실 예약">
      <SpaceReservationForm
        space={mergedSpace}
        timeSlots={timeSlots}
        pageData={pageData}
        onReservationDateChange={setSelectedDate}
        isSubmitting={isSubmitting}
        onSubmit={async (payload) => {
          setIsSubmitting(true);

          try {
            const applicant: ApplicantProfile = {
              name: pageData?.applicantName || '',
              studentId: pageData?.applicantStudentId || '',
              phone: payload.values.phone,
              email: payload.values.email || '',
            };

            const success = await submitSpaceReservation({
              spaceId: payload.spaceId,
              slotId: payload.slotId,
              values: payload.values,
              applicant,
            });

            if (success) {
              // ✅ 원본 폼 제출 후 예약 목록 페이지로 이동
              window.location.href = getListUrl();
            } else {
              throw new Error('예약 제출에 실패했습니다.');
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : '예약 제출 중 오류가 발생했습니다.';
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
