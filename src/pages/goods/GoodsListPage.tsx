import React from 'react';
import { MemoryRouter as Router, Routes, Route, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { GoodsList } from '../../components/goods/GoodsList';
import { CategoryMenu } from '../../components/goods/CategoryMenu';
import { CategoryGoodsList } from '../../components/goods/CategoryGoodsList';
import { GoodsDetailPage } from './GoodsDetailPage';
import { MyReservationsPage } from "./MyReservation";

// 카테고리별 기자재 목록 페이지
const CategoryPage: React.FC = () => {
  const { lendGroupSeq } = useParams<{ lendGroupSeq: string }>();
  return <CategoryGoodsList lendGroupSeq={lendGroupSeq || '1'} />;
};

// 나의 신청내역 페이지 (임시)
/*const MyListPage: React.FC = () => {
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
};*/

// 라우터 컨텐츠
const GoodsRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname.includes('/detail');

  return (
    <Layout title="">
      <div className="goods-list-page" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
      }}>
        {/* 카테고리 메뉴 - 모든 페이지에서 공통으로 표시 */}
        <CategoryMenu />

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

        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '24px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'background-color 0.2s',
              textAlign: 'center',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          >
            ← 목록으로 돌아가기
          </button>
        )}

        {/* 라우터 기반 콘텐츠 - 하단만 변경됨 */}
        <Routes>
          <Route path="/" element={<GoodsList />} />
          <Route path="/category/:lendGroupSeq" element={<CategoryPage />} />
          <Route path="/detail/:lendGroupSeq/:lendMhrmlSeq" element={<GoodsDetailPage />} />
          <Route path="/my-list" element={<MyReservationsPage />} />
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
