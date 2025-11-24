import React, { useState } from 'react';
import { GoodsItem } from './GoodsItem';

export const GoodsList: React.FC = () => {
  const [goods] = useState([
    { id: '1', name: '노트북', category: '컴퓨터', status: 'available' as const },
    { id: '2', name: '카메라', category: '촬영장비', status: 'reserved' as const },
    { id: '3', name: '프로젝터', category: '발표장비', status: 'available' as const },
  ]);

  const handleSelectGoods = (id: string) => {
    console.log('Selected goods:', id);
    // TODO: 상세 페이지로 이동
  };

  return (
    <div className="goods-list" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px' 
    }}>
      {goods.map(item => (
        <GoodsItem 
          key={item.id}
          {...item}
          onSelect={handleSelectGoods}
        />
      ))}
    </div>
  );
};
