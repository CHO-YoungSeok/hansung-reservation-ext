import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceList } from '../../components/space/SpaceList';

export const SpaceListPage: React.FC = () => {
  return (
    <Layout title="상상베이스 세미나실 예약">
      <div className="space-list-page">
        <div className="filter-section" style={{ marginBottom: '20px' }}>          
        </div>
        <SpaceList />
      </div>
    </Layout>
  );
};
