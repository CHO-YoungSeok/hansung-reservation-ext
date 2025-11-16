import React, { useState } from 'react';
import { SpaceItem } from './SpaceItem';

export const SpaceList: React.FC = () => {
  const [spaces] = useState([
    { id: '1', name: '세미나실 A', capacity: 10, facilities: ['빔프로젝터', '화이트보드'], status: 'available' as const },
    { id: '2', name: '세미나실 B', capacity: 20, facilities: ['빔프로젝터', '모니터'], status: 'reserved' as const },
    { id: '3', name: '세미나실 C', capacity: 15, facilities: ['화이트보드'], status: 'available' as const },
  ]);

  const handleSelectSpace = (id: string) => {
    console.log('Selected space:', id);
    // TODO: 상세 페이지로 이동
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
