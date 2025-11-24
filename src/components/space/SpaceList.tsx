import React, { useState } from 'react';
import { SpaceItem } from './SpaceItem';
import spaceListData from './data/spaceListData.json';
import { getReservationUrl } from '../../config/space';

interface Space {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: 'available' | 'reserved' | 'unavailable';
  location?: string;
  description?: string;
  coverImageUrl?: string;
  managerContact?: string;
  operatingHours?: string;
  roomGroup?: string;
}

interface SpaceListProps {
  // 필요시 커스텀 핸들러를 받을 수 있도록 유지 (확장성)
  onSelectSpace?: (space: Space) => void;
}

export const SpaceList: React.FC<SpaceListProps> = ({ onSelectSpace }) => {
  const [spaces] = useState<Space[]>(spaceListData as Space[]);

  const handleSelectSpace = (id: string) => {
    const selected = spaces.find((space) => space.id === id);
    if (!selected) {
      console.warn('선택한 세미나실을 찾을 수 없습니다:', id);
      return;
    }

    if (onSelectSpace) {
      // 커스텀 핸들러가 있으면 사용
      onSelectSpace(selected);
    } else {
      // 기본 동작: enc 파라미터가 있는 URL로 이동
      const reservationUrl = getReservationUrl(selected.id);
      window.location.href = reservationUrl;
    }
  };

  return (
    <div className="space-list" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px' 
    }}>
      {spaces.map(item => (
        <SpaceItem 
          key={item.id}
          {...item}
          onSelect={handleSelectSpace}
        />
      ))}
    </div>
  );
};
