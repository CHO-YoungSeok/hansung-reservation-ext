import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoodsItem } from './GoodsItem';
import type { GoodsData } from '../../services/goodsApi';

interface CategoryGoodsListProps {
  lendGroupSeq: string;
}

export const CategoryGoodsList: React.FC<CategoryGoodsListProps> = ({ lendGroupSeq }) => {
  const navigate = useNavigate();
  const [goods, setGoods] = useState<GoodsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoods = async () => {
      try {
        setLoading(true);
        setError(null);

        // 카테고리별 URL 생성
        const url = `https://hansung.ac.kr/lend/cncschool/1/${lendGroupSeq}/lendMhrmlList.do`;

        console.log(`📡 카테고리 ${lendGroupSeq} 데이터 가져오는 중...`);

        // HTML 가져오기
        const response = await fetch(url);
        const html = await response.text();

        // 동적 import로 파싱 함수 가져오기
        const { parseGoodsFromLendList } = await import(
          '../../../entrypoints/content-script/fetch/goodsList'
        );

        // HTML 파싱
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const data = parseGoodsFromLendList(doc.documentElement.outerHTML);

        console.log(`✅ 카테고리 ${lendGroupSeq} 데이터 로드 완료:`, data.length, '개');

        setGoods(data);
      } catch (err) {
        console.error('Error loading category goods:', err);
        setError('데이터를 불러올 수 없습니다.');
        setGoods([]);
      } finally {
        setLoading(false);
      }
    };

    loadGoods();
  }, [lendGroupSeq]);

  const handleSelectGoods = (id: string) => {
    // 선택된 기자재 찾기
    const selectedGoods = goods.find(item => item.id === id);

    if (selectedGoods && selectedGoods.lendGroupSeq && selectedGoods.lendMhrmlSeq) {
      // 상세 페이지로 이동
      navigate(`/detail/${selectedGoods.lendGroupSeq}/${selectedGoods.lendMhrmlSeq}`);
    } else {
      console.warn('기자재 정보가 없습니다:', id);
    }
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

  if (error) {
    return (
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
    );
  }

  if (goods.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
        fontSize: '16px',
        color: '#6b7280',
      }}>
        등록된 기자재가 없습니다.
      </div>
    );
  }

  return (
    <div className="goods-list" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(700px, 1fr))',
      gap: '20px',
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
