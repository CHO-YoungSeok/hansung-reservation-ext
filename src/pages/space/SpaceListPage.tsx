import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceList } from '../../components/space/SpaceList';

export const SpaceListPage: React.FC = () => {
  return (
    <Layout title="상상베이스 세미나실 예약">
      <div className="space-list-page">
        <div className="filter-section" style={{ marginBottom: '20px' }}>
          <input 
            type="date" 
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <select style={{ padding: '8px', marginRight: '10px' }}>
            <option value="">전체 시간</option>
            <option value="morning">오전</option>
            <option value="afternoon">오후</option>
            <option value="evening">저녁</option>
          </select>
          <input 
            type="number" 
            placeholder="최소 인원" 
            style={{ padding: '8px', width: '100px' }}
          />
        </div>
        <SpaceList />
      </div>
    </Layout>
  );
};
