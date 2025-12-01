import React from 'react';
//import { Card } from '../common/Card';
import{SpaceCard} from "./SpaceReservationForm/SpaceCard";``
import type { SpaceSummary,TimeSlot  } from './SpaceReservationForm/types';
interface SpaceItemProps extends SpaceSummary{
  status: 'available' | 'reserved' | 'unavailable';
  timeSlots?: TimeSlot[];   
  onSelect?:(id: string) => void;
}
// interface SpaceItemProps {
//   id: string;
//   name: string;
//   capacity: number;
//   facilities: string[];
//   status: 'available' | 'reserved' | 'unavailable';
//   imageUrl?: string;
//   onSelect?: (id: string) => void;
// }

export const SpaceItem: React.FC<SpaceItemProps> = ({ 
  id, 
  name, 
  capacity,
  facilities,
  status, 
  //imageUrl,
   location,
  description,
  coverImageUrl,
  managerContact,
  operatingHours,
  roomGroup,
  timeSlots,  
  onSelect 
}) => {
  const statusLabel = 
  status ==='available'
    ? '예약가능'
    :status ==='reserved'
    ? '예약중'
    : '사용불가';

    const handleClick = () => {
    onSelect?.(id);
};
return (
    // SpaceCard 바깥에 클릭 영역을 씌워줌
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <SpaceCard
       variant="list"               // ✅ 목록 카드임을 표시
        space={{
          id,
          name,
          capacity,
          facilities,
          location,
          description,
          coverImageUrl,
          managerContact,
          operatingHours,
          roomGroup,
        }}
        applicantType={statusLabel}
        managerPhone={managerContact}
        timeSlots={timeSlots}   // ← 추가
      />
    </div>
  
      );
  
  // return (
  //   <Card onClick={() => onSelect?.(id)}>
  //     <div className="space-item">
  //       {imageUrl && <img src={imageUrl} alt={name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
  //       <h3>{name}</h3>
  //       <p>수용 인원: {capacity}명</p>
  //       <p>시설: {facilities.join(', ')}</p>
  //       <span className={`status status-${status}`}>
  //         {status === 'available' ? '예약가능' : status === 'reserved' ? '예약중' : '사용불가'}
  //       </span>
  //     </div>
  //   </Card>
  // );
};
