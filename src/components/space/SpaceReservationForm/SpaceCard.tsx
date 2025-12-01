import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import { SpaceSummary, TimeSlot } from './types';
import './SpaceReservationForm.css';

interface SpaceCardProps {
  space: SpaceSummary;
  applicantType?: string;
  managerName?: string;
  managerPhone?: string;
  timeSlots?: TimeSlot[];
  /**
   * detail: 예약 상세 페이지(왼쪽 사이드바 카드)
   * list  : 스터디룸 목록 카드
   */
  variant?: 'detail' | 'list';
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  applicantType = '재학생',
  managerName: extractedManagerName,
  managerPhone: extractedManagerPhone,
  timeSlots,
  variant = 'detail',
}) => {
  const facilityLabel = useMemo(() => {
    if (!space.facilities || space.facilities.length === 0) {
      return '등록된 시설 정보가 없습니다.';
    }
    return space.facilities.join(', ');
  }, [space.facilities]);

  const managerName = useMemo(() => {
    if (extractedManagerName) return extractedManagerName;

    if (space.managerContact) {
      const parts = space.managerContact.split(' ');
      return parts.length > 1 ? parts[0] : '담당자';
    }
    return '담당자';
  }, [extractedManagerName, space.managerContact]);

  const managerPhone = useMemo(() => {
    if (extractedManagerPhone) return extractedManagerPhone;
    return space.managerContact || '00-000-0000';
  }, [extractedManagerPhone, space.managerContact]);

  const hasTimeSlots = Array.isArray(timeSlots) && timeSlots.length > 0;

  const cardClassName =
    variant === 'list'
      ? 'space-card space-card--list'
      : 'space-card space-card--detail';

  const statusText = applicantType || '예약 가능';
  let statusKind: 'available' | 'reserved' | 'unavailable' = 'available';
  if (statusText.includes('중')) statusKind = 'reserved';
  if (statusText.includes('불가') || statusText.includes('완료')) {
    statusKind = 'unavailable';
  }

  const getSlotButtonClassName = (slot: TimeSlot): string => {
    let className = 'space-reservation-form__slot-button';
    if (slot.status === 'blocked') {
      className += ' space-reservation-form__slot-button--blocked';
    } else if (slot.status === 'selected') {
      className += ' space-reservation-form__slot-button--selected';
    }
    return className;
  };

  return (
    <Card className={cardClassName}>
      <div className="space-card__container">
        {/* 왼쪽: 사진 */}
        <div className="space-card__image-container">
          {space.coverImageUrl ? (
            <img
              src={space.coverImageUrl}
              alt={space.name}
              className="space-card__image"
            />
          ) : (
            <div className="space-card__placeholder">사진 등록 예정</div>
          )}
        </div>

        {/* 오른쪽: 정보 + 시간대 */}
        <div className="space-card__content">
          {/* 제목 + 상태 배지 */}
          <div className="space-card__header-row">
            <h2 className="space-card__title">{space.name}</h2>
            {variant === 'list' && (
              <span
                className={`space-card__status-badge space-card__status-badge--${statusKind}`}
              >
                {statusText}
              </span>
            )}
          </div>

          {/* 스터디룸 정보 (좌/우 2열) */}
          <div className="space-card__info-grid">
            <div className="space-card__info-column">
              <div className="space-card__info-item">
                <span className="space-card__info-label">시설</span>
                <span className="space-card__info-value">{facilityLabel}</span>
              </div>
              <div className="space-card__info-item">
                <span className="space-card__info-label">수용인원</span>
                <span className="space-card__info-value">
                  최대 {space.capacity}명
                </span>
              </div>
              {space.location && (
                <div className="space-card__info-item">
                  <span className="space-card__info-label">위치</span>
                  <span className="space-card__info-value">
                    {space.location}
                  </span>
                </div>
              )}
            </div>

            <div className="space-card__info-column">
              {space.operatingHours && (
                <div className="space-card__info-item">
                  <span className="space-card__info-label">운영시간</span>
                  <span className="space-card__info-value">
                    {space.operatingHours}
                  </span>
                </div>
              )}
              <div className="space-card__info-item">
                <span className="space-card__info-label">담당자</span>
                <span className="space-card__info-value">{managerName}</span>
              </div>
              <div className="space-card__info-item">
                <span className="space-card__info-label">연락처</span>
                <span className="space-card__info-value">{managerPhone}</span>
              </div>
              {variant === 'detail' && (
                <div className="space-card__info-item">
                  <span className="space-card__info-label">신청대상</span>
                  <span className="space-card__info-value">{applicantType}</span>
                </div>
              )}
            </div>
          </div>

          {/* 시간대별 예약 현황 */}
          {hasTimeSlots && (
            <div className="space-card__time-section">
              <h3 className="space-card__time-title">시간대별 예약 현황</h3>
              <div className="space-reservation-form__time-slots">
                {timeSlots!.map((slot) => (
                  <div
                    key={slot.id}
                    className={getSlotButtonClassName(slot)}
                  >
                    {slot.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 목록 카드 전용: 범례 + 예약 버튼 */}
          {variant === 'list' && (
            <div className="space-card__bottom">
              <div className="space-reservation-form__legend">
                <div className="space-reservation-form__legend-item">
                  <span className="space-reservation-form__legend-indicator space-reservation-form__legend-indicator--available" />
                  <span>예약 가능</span>
                </div>
                <div className="space-reservation-form__legend-item">
                  <span className="space-reservation-form__legend-indicator space-reservation-form__legend-indicator--blocked" />
                  <span>예약 완료</span>
                </div>
              </div>
              <button type="button" className="space-card__reserve-button">
                이 호수 예약하기
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
