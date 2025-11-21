import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { GoodsList } from '../../components/goods/GoodsList';
import { CategoryMenu } from '../../components/goods/CategoryMenu';
import { CategoryGoodsList } from '../../components/goods/CategoryGoodsList';
import { GoodsDetailPage } from '../../components/goods/GoodsDetailPage';

// 카테고리별 기자재 목록 페이지
const CategoryPage: React.FC = () => {
  const { lendGroupSeq } = useParams<{ lendGroupSeq: string }>();
  return <CategoryGoodsList lendGroupSeq={lendGroupSeq || '1'} />;
};

// 나의 신청내역 페이지 (임시)
const MyListPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      fontSize: '16px',
      color: '#6b7280',
    }}>
      나의 신청내역 페이지입니다.
    </div>
  );
};

// 라우터 컨텐츠
const GoodsRoutes: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <Layout title="">
      <div className="goods-list-page" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
      }}>
        {/* 카테고리 메뉴 - 모든 페이지에서 공통으로 표시 */}
        <CategoryMenu />

        {/* 검색 & 필터 섹션 */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 기자재명 또는 모델명으로 검색..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0066cc';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            />
          </div>
          <button
            onClick={() => setSearchText('')}
            style={{
              padding: '12px 24px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#4b5563',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
            }}
          >
            초기화
          </button>
        </div>

        {/* 안내 정보 */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            fontSize: '24px',
          }}>
            💡
          </div>
          <div style={{
            flex: 1,
            fontSize: '14px',
            color: '#1e40af',
            lineHeight: '1.6',
          }}>
            <strong>이용 안내:</strong> 기자재를 클릭하여 상세 정보를 확인하고 예약할 수 있습니다.
            대여 전 주의사항을 반드시 확인해주세요.
          </div>
        </div>

        {/* 라우터 기반 콘텐츠 - 하단만 변경됨 */}
        <Routes>
          <Route path="/" element={<GoodsList />} />
          <Route path="/category/:lendGroupSeq" element={<CategoryPage />} />
          <Route path="/detail/:lendGroupSeq/:lendMhrmlSeq" element={<GoodsDetailPage />} />
          <Route path="/my-list" element={<MyListPage />} />
        </Routes>
      </div>
    </Layout>
  );
};

// 메인 컴포넌트 - Router로 감싸기
export const GoodsListPage: React.FC = () => {
  // 현재 URL을 기반으로 초기 경로 설정
  const getInitialRoute = () => {
    const currentUrl = window.location.pathname;

    if (currentUrl.includes('lendMhrmlList.do')) {
      // URL에서 lendGroupSeq 추출
      const match = currentUrl.match(/\/(\d+)\/lendMhrmlList\.do/);
      if (match) {
        return `/category/${match[1]}`;
      }
    }

    // 기본값: 개요 페이지
    return '/';
  };

  return (
    <Router initialEntries={[getInitialRoute()]} initialIndex={0}>
      <GoodsRoutes />
    </Router>
  );
};
