import React from 'react';
import { Card } from '../common/Card';

interface SpaceItemProps {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: 'available' | 'reserved' | 'unavailable';
  imageUrl?: string;
  onSelect?: (id: string) => void;
}

export const SpaceItem: React.FC<SpaceItemProps> = ({ 
  id, 
  name, 
  capacity,
  facilities,
  status, 
  imageUrl,
  onSelect 
}) => {
  return (
    <Card onClick={() => onSelect?.(id)}>
      <div className="space-item">
        {imageUrl && <img src={imageUrl} alt={name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
        <h3>{name}</h3>
        <p>수용 인원: {capacity}명</p>
        <p>시설: {facilities.join(', ')}</p>
        <span className={`status status-${status}`}>
          {status === 'available' ? '예약가능' : status === 'reserved' ? '예약중' : '사용불가'}
        </span>
      </div>
    </Card>
  );
};
