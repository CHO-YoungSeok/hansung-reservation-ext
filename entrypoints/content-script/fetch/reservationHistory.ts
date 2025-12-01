/**
 * 예약 내역 조회 및 파싱 모듈
 * - 기자재 예약 내역: https://hansung.ac.kr/cncschool/7309/subview.do?enc=...lendArtclList.do
 * - 스터디룸 예약 내역: https://www.hansung.ac.kr/onestop/8952/subview.do?enc=...artclView.do
 */

export interface GoodsReservation {
  id: string;
  type: 'goods';
  goodsName: string;
  reservationDate: string;
  timeRange: string;
  applicantName: string;
  studentId: string;
  applicationDate: string;
  status: '승인대기' | '승인' | '반려' | '취소';
  detailUrl?: string;
  editUrl?: string;
  cancelUrl?: string;
}

export interface StudyRoomReservation {
  id: string;
  type: 'studyroom';
  roomName: string;
  reservationDate: string;
  timeSlots: string[];
  applicantName: string;
  studentId: string;
  applicationDate: string;
  status: '승인대기' | '승인' | '반려' | '취소';
  editUrl?: string;
  cancelUrl?: string;
}

export type Reservation = GoodsReservation | StudyRoomReservation;

/**
 * 기자재 예약 내역 HTML 파싱
 */
export const parseGoodsReservations = (html: string): GoodsReservation[] => {
  const reservations: GoodsReservation[] = [];

  try {
    console.log('🔍 [DEBUG] parseGoodsReservations 시작');
    console.log('🔍 [DEBUG] HTML 길이:', html.length);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // tbody 찾기 (모든 tbody 출력)
    const allTbodies = doc.querySelectorAll('tbody');
    console.log('🔍 [DEBUG] 전체 tbody 개수:', allTbodies.length);

    const tbody = doc.querySelector('tbody');
    if (!tbody) {
      console.error('❌ 기자재 예약 내역 tbody를 찾을 수 없습니다.');
      console.log('🔍 [DEBUG] HTML 일부:', html.substring(0, 500));
      return [];
    }

    console.log('✓ tbody 찾음');

    // 모든 행 가져오기
    const rows = Array.from(tbody.querySelectorAll('tr'));
    console.log(`🔍 [DEBUG] 기자재 예약 내역 ${rows.length}개 발견`);

    if (rows.length === 0) {
      console.warn('⚠️ tbody에 행이 없습니다.');
      console.log('🔍 [DEBUG] tbody HTML:', tbody.innerHTML.substring(0, 500));
    }

    rows.forEach((row, index) => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 7) {
          console.warn(`⚠️ 행 ${index + 1}: 셀 개수 부족 (${cells.length}개)`);
          return;
        }

        // 1. 번호
        const id = cells[0].textContent?.trim() || `${index + 1}`;

        // 2. 기자재명
        const goodsName = cells[1].textContent?.trim() || '기자재 정보 없음';

        // 3. 예약 날짜
        const reservationDate = cells[2].textContent?.trim() || '';

        // 4. 예약 시간 범위
        const timeRangeRaw = cells[3].innerHTML || '';
        // "2025-12-17 13:00<br>~2025-12-17 14:00" 형식을 처리
        const timeRange = timeRangeRaw
          .replace(/<br>/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // 5. 신청자 이름
        const applicantName = cells[4].textContent?.trim() || '';

        // 6. 학번
        const studentId = cells[5].textContent?.trim() || '';

        // 7. 상태
        const statusText = cells[6].textContent?.trim() || '';
        let status: '승인대기' | '승인' | '반려' | '취소' = '승인대기';
        if (statusText.includes('승인대기')) status = '승인대기';
        else if (statusText.includes('승인')) status = '승인';
        else if (statusText.includes('반려')) status = '반려';
        else if (statusText.includes('취소')) status = '취소';

        // 신청일자는 HTML에 없으므로 예약 날짜를 사용 (정렬용)
        const applicationDate = reservationDate;

        // 8. 버튼들 (상세보기, 수정, 취소)
        let detailUrl: string | undefined;
        let editUrl: string | undefined;
        let cancelUrl: string | undefined;

        if (cells.length > 7) {
          const buttonCell = cells[7];
          const links = buttonCell.querySelectorAll('a');

          links.forEach((link) => {
            const href = link.getAttribute('href');
            const title = link.getAttribute('title') || link.textContent?.trim() || '';

            if (href) {
              const fullUrl = href.startsWith('http')
                ? href
                : `https://hansung.ac.kr${href}`;

              if (title.includes('상세보기')) {
                detailUrl = fullUrl;
              } else if (title.includes('수정')) {
                editUrl = fullUrl;
              } else if (title.includes('취소')) {
                cancelUrl = fullUrl;
              }
            }
          });
        }

        reservations.push({
          id,
          type: 'goods',
          goodsName,
          reservationDate,
          timeRange,
          applicantName,
          studentId,
          applicationDate,
          status,
          detailUrl,
          editUrl,
          cancelUrl,
        });

        console.log(`  ✓ 기자재 예약 ${index + 1}: ${goodsName} (${status})`);
      } catch (error) {
        console.error(`❌ 기자재 예약 행 ${index + 1} 파싱 오류:`, error);
      }
    });

    console.log(`✅ 총 ${reservations.length}개의 기자재 예약 내역 추출 완료`);
  } catch (error) {
    console.error('❌ 기자재 예약 내역 HTML 파싱 중 오류:', error);
  }

  return reservations;
};

/**
 * 스터디룸 예약 내역 HTML 파싱
 */
export const parseStudyRoomReservations = (html: string): StudyRoomReservation[] => {
  const reservations: StudyRoomReservation[] = [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // tbody 찾기
    const tbody = doc.querySelector('tbody');
    if (!tbody) {
      console.warn('⚠️ 스터디룸 예약 내역 tbody를 찾을 수 없습니다.');
      return [];
    }

    // 모든 행 가져오기 (첫 번째 행은 헤더)
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // 헤더 행 제거
    const dataRows = rows.filter(row => {
      const firstCell = row.querySelector('th');
      return !firstCell; // th가 없는 행만 선택 (데이터 행)
    });

    console.log(`✓ 스터디룸 예약 내역 ${dataRows.length}개 발견`);

    dataRows.forEach((row, index) => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 8) {
          console.warn(`⚠️ 행 ${index + 1}: 셀 개수 부족 (${cells.length}개)`);
          return;
        }

        // 1. 번호
        const id = cells[0].textContent?.trim() || `${index + 1}`;

        // 2. 공간명
        const roomLink = cells[1].querySelector('a');
        const roomName = roomLink?.textContent?.trim() || cells[1].textContent?.trim() || '스터디룸';

        // 수정 URL 추출
        let editUrl: string | undefined;
        if (roomLink) {
          const href = roomLink.getAttribute('href');
          if (href) {
            editUrl = href.startsWith('http')
              ? href
              : `https://www.hansung.ac.kr${href}`;
          }
        }

        // 3. 예약 날짜
        const reservationDate = cells[2].textContent?.trim() || '';

        // 4. 예약 시간 (쉼표로 구분된 시간대)
        const timeSlotsText = cells[3].textContent?.trim() || '';
        const timeSlots = timeSlotsText
          .split(',')
          .map(slot => slot.trim())
          .filter(slot => slot.length > 0);

        // 5. 신청자 이름
        const applicantName = cells[4].textContent?.trim() || '';

        // 6. 학번
        const studentId = cells[5].textContent?.trim() || '';

        // 7. 신청 일자
        const applicationDate = cells[6].textContent?.trim() || '';

        // 8. 상태
        const statusText = cells[7].textContent?.trim() || '';
        let status: '승인대기' | '승인' | '반려' | '취소' = '승인대기';
        if (statusText.includes('승인대기')) status = '승인대기';
        else if (statusText.includes('승인')) status = '승인';
        else if (statusText.includes('반려')) status = '반려';
        else if (statusText.includes('취소')) status = '취소';

        // 9. 취소 버튼
        let cancelUrl: string | undefined;
        if (cells.length > 8) {
          const cancelLink = cells[8].querySelector('a');
          if (cancelLink) {
            const href = cancelLink.getAttribute('href');
            if (href) {
              cancelUrl = href.startsWith('http')
                ? href
                : `https://www.hansung.ac.kr${href}`;
            }
          }
        }

        reservations.push({
          id,
          type: 'studyroom',
          roomName,
          reservationDate,
          timeSlots,
          applicantName,
          studentId,
          applicationDate,
          status,
          editUrl,
          cancelUrl,
        });

        console.log(`  ✓ 스터디룸 예약 ${index + 1}: ${roomName} (${status})`);
      } catch (error) {
        console.error(`❌ 스터디룸 예약 행 ${index + 1} 파싱 오류:`, error);
      }
    });

    console.log(`✅ 총 ${reservations.length}개의 스터디룸 예약 내역 추출 완료`);
  } catch (error) {
    console.error('❌ 스터디룸 예약 내역 HTML 파싱 중 오류:', error);
  }

  return reservations;
};

/**
 * 기자재 예약 내역 페이지에서 데이터 가져오기
 */
export const fetchGoodsReservations = async (): Promise<GoodsReservation[]> => {
  try {
    console.log('📡 [기자재 예약] 가져오는 중...');

    // CORS 우회를 위해 background script를 통해 fetch
    const url = 'https://hansung.ac.kr/cncschool/7309/subview.do?enc=Zm5jdDF8QEB8JTJGbGVuZCUyRmNuY3NjaG9vbCUyRjElMkZsZW5kQXJ0Y2xMaXN0LmRvJTNGa2luZCUzRGxpc3QlMjY%3D';

    console.log('🔍 [DEBUG] 기자재 URL:', url);

    const response = await browser.runtime.sendMessage({
      type: 'FETCH_HTML',
      url: url,
    });

    if (!response.success) {
      throw new Error(response.error || 'Fetch failed');
    }

    console.log('🔍 [DEBUG] 기자재 HTML 받음, 길이:', response.html.length);

    const result = parseGoodsReservations(response.html);
    console.log('✅ [기자재 예약] 파싱 완료, 결과 개수:', result.length);

    return result;
  } catch (error) {
    console.error('❌ 기자재 예약 내역 fetch 실패:', error);
    return [];
  }
};

/**
 * 스터디룸 예약 내역 페이지에서 데이터 가져오기
 */
export const fetchStudyRoomReservations = async (): Promise<StudyRoomReservation[]> => {
  try {
    console.log('📡 [스터디룸 예약] 가져오는 중...');

    // CORS 우회를 위해 background script를 통해 fetch
    const url = 'https://www.hansung.ac.kr/onestop/8952/subview.do?enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZvbmVzdG9wJTJGMjElMkZhcnRjbFZpZXcuZG8lM0Y%3D';

    console.log('🔍 [DEBUG] 스터디룸 URL:', url);

    const response = await browser.runtime.sendMessage({
      type: 'FETCH_HTML',
      url: url,
    });

    if (!response.success) {
      throw new Error(response.error || 'Fetch failed');
    }

    console.log('🔍 [DEBUG] 스터디룸 HTML 받음, 길이:', response.html.length);

    const result = parseStudyRoomReservations(response.html);
    console.log('✅ [스터디룸 예약] 파싱 완료, 결과 개수:', result.length);

    return result;
  } catch (error) {
    console.error('❌ 스터디룸 예약 내역 fetch 실패:', error);
    return [];
  }
};

/**
 * 모든 예약 내역 가져오기 (기자재 + 스터디룸)
 */
export const fetchAllReservations = async (): Promise<{
  goods: GoodsReservation[];
  studyRoom: StudyRoomReservation[];
}> => {
  try {
    console.log('📡 모든 예약 내역 가져오는 중...');

    const [goods, studyRoom] = await Promise.all([
      fetchGoodsReservations(),
      fetchStudyRoomReservations(),
    ]);

    return { goods, studyRoom };
  } catch (error) {
    console.error('❌ 예약 내역 전체 fetch 실패:', error);
    return { goods: [], studyRoom: [] };
  }
};

/**
 * 최근 예약 내역 가져오기 (각각 최대 N개)
 */
export const fetchRecentReservations = async (
  limit: number = 3
): Promise<{
  goods: GoodsReservation[];
  studyRoom: StudyRoomReservation[];
}> => {
  try {
    const { goods, studyRoom } = await fetchAllReservations();

    // 신청일자 최신순으로 정렬
    const sortedGoods = goods.sort(
      (a, b) =>
        new Date(b.applicationDate).getTime() -
        new Date(a.applicationDate).getTime(),
    );
    const sortedStudyRoom = studyRoom.sort(
      (a, b) =>
        new Date(b.applicationDate).getTime() -
        new Date(a.applicationDate).getTime(),
    );

    return {
      goods: sortedGoods.slice(0, limit),
      studyRoom: sortedStudyRoom.slice(0, limit),
    };
  } catch (error) {
    console.error('❌ 최근 예약 내역 조회 실패:', error);
    return { goods: [], studyRoom: [] };
  }
};
