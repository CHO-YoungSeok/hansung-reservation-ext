import React from 'react';
import { InputField } from './InputField';
import './SpaceReservationForm.css';

interface AllUsersInfoProps {
  allUsers: string;
  totalUsers: number;
  capacity: number;
  error?: {
    allUsers?: string;
    totalUsers?: string;
  };
  onAllUsersChange: (value: string) => void;
  onTotalUsersChange?: (value: number) => void;
}

export const AllUsersInfo: React.FC<AllUsersInfoProps> = ({
  allUsers,
  totalUsers,
  capacity,
  error,
  onAllUsersChange,
  onTotalUsersChange,
}) => {
  return (
    <section className="space-reservation-form__section">
      <h3 className="space-reservation-form__section-title">
        이용자 정보
      </h3>
      <div className="space-reservation-form__fields-grid">
        <InputField
          label="총 인원 수"
          required
          type="number"
          value={totalUsers}
          min={1}
          max={capacity}
          onChange={(e) => { onTotalUsersChange?.(parseInt(e.target.value, 10) || 1)}}
          error={error?.totalUsers}
        />
        <InputField
          label="전체 이용자 학번/이름"
          required
          type="text"
          value={allUsers}
          onChange={(e) => onAllUsersChange(e.target.value)}
          error={error?.allUsers}
        />
      </div>
    </section>
  );
};

