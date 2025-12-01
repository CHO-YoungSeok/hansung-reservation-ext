import React from 'react';
import { TimeSlot } from './types';
import './SpaceReservationForm.css';

interface TimeSlotSelectionProps {
  timeSlots: TimeSlot[];
  selectedTimeSlots: string[];
  error?: string;
  onToggle: (slotId: string) => void;
}

export const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  timeSlots,
  selectedTimeSlots,
  error,
  onToggle,
}) => {
  const getSlotButtonClassName = (slot: TimeSlot): string => {
    let className = 'space-reservation-form__slot-button';
    if (slot.status === 'blocked') {
      className += ' space-reservation-form__slot-button--blocked';
    } else if (selectedTimeSlots.includes(slot.id)) {
      className += ' space-reservation-form__slot-button--selected';
    }
    return className;
  };

  // 선택된 시간대를 연속 범위로 합치기
  const formatSelectedTimes = (): string => {
    if (selectedTimeSlots.length === 0) return '';

    // 선택된 slot들을 ID 순서로 정렬
    const sortedSlots = selectedTimeSlots
      .map(id => timeSlots.find(s => s.id === id))
      .filter((slot): slot is TimeSlot => slot !== undefined)
      .sort((a, b) => parseInt(a.id) - parseInt(b.id));

    if (sortedSlots.length === 0) return '';

    // 연속된 시간대를 그룹화
    const ranges: string[] = [];
    let currentRangeStart = sortedSlots[0];
    let currentRangeEnd = sortedSlots[0];

    for (let i = 1; i < sortedSlots.length; i++) {
      const currentSlot = sortedSlots[i];
      const prevSlotId = parseInt(currentRangeEnd.id);
      const currentSlotId = parseInt(currentSlot.id);

      // 연속된 시간대인지 확인 (예: 10 다음에 11이 오면 연속)
      if (currentSlotId === prevSlotId + 1) {
        currentRangeEnd = currentSlot;
      } else {
        // 연속되지 않으면 현재 범위를 저장하고 새 범위 시작
        const startTime = currentRangeStart.label.split('-')[0];
        const endTime = currentRangeEnd.label.split('-')[1];
        ranges.push(`${startTime}~${endTime}`);
        currentRangeStart = currentSlot;
        currentRangeEnd = currentSlot;
      }
    }

    // 마지막 범위 추가
    const startTime = currentRangeStart.label.split('-')[0];
    const endTime = currentRangeEnd.label.split('-')[1];
    ranges.push(`${startTime}~${endTime}`);

    return ranges.join(', ');
  };

  return (
    <section className="space-reservation-form__section">
      <h3 className="space-reservation-form__section-title">
        <span role="img" aria-label="time">
          ⏰
        </span>
        신청시간 선택
      </h3>
      <p className="space-reservation-form__caution">
        선택하는 시간은 사용 시작 시간입니다. 예를 들어 1시간 단위로 신청시간 선택이 설정되어 있는 경우 9시를 선택하면 사용시간은 9시부터 10시까지입니다. 여러 시간대를 선택할 수 있습니다.
      </p>
      <div className="space-reservation-form__time-slots">
        {timeSlots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => onToggle(slot.id)}
            disabled={slot.status === 'blocked'}
            className={getSlotButtonClassName(slot)}
          >
            {slot.label}
          </button>
        ))}
      </div>
      {selectedTimeSlots.length > 0 && (
        <div className="space-reservation-form__selected-times">
          선택된 시간: {formatSelectedTimes()}
        </div>
      )}
      {error && (
        <div className="space-reservation-form__helper-text space-reservation-form__helper-text--error">
          {error}
        </div>
      )}
    </section>
  );
};

