import React from 'react';
import { Calendar } from './Calendar';
import { getNextWeekSaturday } from '../../../utils/dateUtils';
import './SpaceReservationForm.css';

interface ReservationDateSectionProps {
  value: string;
  minDate: string;
  error?: string;
  onChange: (date: string) => void;
}

export const ReservationDateSection: React.FC<ReservationDateSectionProps> = ({
  value,
  minDate,
  error,
  onChange,
}) => {
  // 다음 주차 토요일까지 선택 가능
  const maxDate = getNextWeekSaturday();

  return (
    <section className="space-reservation-form__section">
      <h3 className="space-reservation-form__section-title">
        예약일자 <span className="space-reservation-form__required">*</span>
      </h3>
      {error && (
        <div className="space-reservation-form__error" style={{ marginBottom: '8px' }}>
          {error}
        </div>
      )}
      <Calendar value={value} minDate={minDate} maxDate={maxDate} onChange={onChange} />
    </section>
  );
};

