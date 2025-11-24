import React from 'react';
import { Card } from '../common/Card';

interface GoodsItemProps {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'reserved' | 'unavailable';
  imageUrl?: string;
  onSelect?: (id: string) => void;
}

export const GoodsItem: React.FC<GoodsItemProps> = ({ 
  id, 
  name, 
  category, 
  status, 
  imageUrl,
  onSelect 
}) => {
  return (
    <Card onClick={() => onSelect?.(id)}>
      <div className="goods-item">
        {imageUrl && <img src={imageUrl} alt={name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
        <h3>{name}</h3>
        <p>카테고리: {category}</p>
        <span className={`status status-${status}`}>
          {status === 'available' ? '예약가능' : status === 'reserved' ? '예약중' : '사용불가'}
        </span>
      </div>
    </Card>
  );
};
