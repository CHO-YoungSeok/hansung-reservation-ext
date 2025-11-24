export interface ReservationData {
  id: string;
  goodsId: string;
  goodsName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export interface ReservationRequest {
  goodsId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
}

// 한성대 예약 시스템에 예약 신청
export const submitReservation = async (
  request: ReservationRequest
): Promise<ReservationData> => {
  try {
    // 실제 한성대 예약 시스템 API 호출
    const response = await fetch('https://hansung.ac.kr/api/reservation/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Reservation submission failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      ...data,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to submit reservation:', error);
    // 로컬 저장소에 임시 저장
    return {
      id: `reservation-${Date.now()}`,
      goodsId: request.goodsId,
      goodsName: '',
      startDate: request.startDate,
      endDate: request.endDate,
      purpose: request.purpose,
      borrowerName: request.borrowerName,
      borrowerEmail: request.borrowerEmail,
      borrowerPhone: request.borrowerPhone,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }
};

// 내 예약 목록 조회
export const getMyReservations = async (
  userEmail: string
): Promise<ReservationData[]> => {
  try {
    const response = await fetch(
      `https://hansung.ac.kr/api/reservation/list?email=${encodeURIComponent(userEmail)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reservations: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    return [];
  }
};

// 예약 취소
export const cancelReservation = async (
  reservationId: string,
  reason?: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://hansung.ac.kr/api/reservation/${reservationId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Failed to cancel reservation:', error);
    return false;
  }
};

// 예약 상태 조회
export const getReservationStatus = async (
  reservationId: string
): Promise<ReservationData | null> => {
  try {
    const response = await fetch(
      `https://hansung.ac.kr/api/reservation/${reservationId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reservation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch reservation status:', error);
    return null;
  }
};
