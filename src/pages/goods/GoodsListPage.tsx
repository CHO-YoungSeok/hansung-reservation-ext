import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { GoodsList } from '../../components/goods/GoodsList';

export const GoodsListPage: React.FC = () => {
  return (
    <Layout title="기자재 대여">
      <div className="goods-list-page">
        <div className="filter-section" style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="기자재 검색..." 
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
          />
          <select style={{ padding: '8px' }}>
            <option value="">전체 카테고리</option>
            <option value="computer">컴퓨터</option>
            <option value="camera">촬영장비</option>
            <option value="presentation">발표장비</option>
          </select>
        </div>
        <GoodsList />
      </div>
    </Layout>
  );
};
