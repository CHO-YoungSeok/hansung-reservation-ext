import React from 'react';
import { InputField } from './InputField';
import './SpaceDetailForm.css';

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
  return (
    <section className="space-reservation-form__section">
      <h3 className="space-reservation-form__section-title">
        예약일자 <span className="space-reservation-form__required">*</span>
      </h3>
      <InputField
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        error={error}
        inputClassName="space-reservation-form__input--date"
      />
    </section>
  );
};

