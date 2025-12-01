import React from 'react';
import { Card } from '../../common/Card';
import './SpaceReservationForm.css';

interface ReservationGuideProps {
  items?: string[];
}

const DEFAULT_GUIDE_ITEMS = [
  '• 예약 신청 후 승인 절차를 거칩니다.',
  '• 예약 시간 30분 전까지 도착해 주세요.',
  '• 예약 취소는 예약일 하루 전까지 가능합니다.',
  '• 시설물 파손 시 배상책임이 있습니다.',
];

export const ReservationGuide: React.FC<ReservationGuideProps> = ({ 
  items = DEFAULT_GUIDE_ITEMS 
}) => {
  return (
    <Card className="space-reservation-form__sidebar-card">
      <h3 className="space-reservation-form__sidebar-title">
        신청안내
      </h3>
      <div className="space-reservation-form__guide">
        {items.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </Card>
  );
};