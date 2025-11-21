import React, { useState, useEffect } from 'react';
import { GoodsItem } from './GoodsItem';
import type { GoodsData } from '../../services/goodsApi';
import { getDefaultGoods } from '../../services/goodsApi';

export const GoodsList: React.FC = () => {
  const [goods, setGoods] = useState<GoodsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoods = async () => {
      try {
        setLoading(true);
        setError(null);

        // content script 환경에서는 직접 DOM에서 데이터 추출
        // fetchGoodsFromCurrentPage가 있으면 사용, 없으면 기본값 사용
        const { fetchGoodsFromCurrentPage } = await import(
          '../../../entrypoints/content-script/fetch/goodsList'
        ).catch(() => ({ fetchGoodsFromCurrentPage: null }));

        let data: GoodsData[] = [];

        if (fetchGoodsFromCurrentPage) {
          data = fetchGoodsFromCurrentPage();
          console.log('현재 페이지에서 추출한 기자재 정보:', data);
        }

        // 데이터가 없으면 기본값 사용
        setGoods(data.length > 0 ? data : getDefaultGoods());
      } catch (err) {
        console.error('Error loading goods:', err);
        setError('데이터를 불러올 수 없습니다. 기본 목록을 표시합니다.');
        setGoods(getDefaultGoods());
      } finally {
        setLoading(false);
      }
    };

    loadGoods();
  }, []);

  const handleSelectGoods = (id: string) => {
    console.log('Selected goods:', id);
    // TODO: 상세 페이지로 이동
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
        fontSize: '16px',
        color: '#6b7280',
      }}>
        기자재 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <>
      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}
      <div className="goods-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))',
        gap: '16px',
      }}>
        {goods.map(item => (
          <GoodsItem
            key={item.id}
            {...item}
            onSelect={handleSelectGoods}
          />
        ))}
      </div>
    </>
  );
};
