import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoodsItem } from './GoodsItem';
import { LoginPromptModal } from '../common/LoginPromptModal';
import type { GoodsData } from '../../services/goodsApi';
import { getDefaultGoods } from '../../services/goodsApi';
import { isUserLoggedIn, redirectToLogin } from '../../utils/authUtils';

export const GoodsList: React.FC<{ isOverview?: boolean }> = ({ isOverview = false }) => {
  const navigate = useNavigate();
  const [goods, setGoods] = useState<GoodsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const loadGoods = async () => {
      try {
        setLoading(true);
        setError(null);

        // content script 환경에서는 직접 페이지에서 데이터 추출
        // fetchGoodsFromCurrentPage는 async 함수이므로 await 필요
        try {
          const { fetchGoodsFromCurrentPage } = await import(
            '../../../entrypoints/content-script/fetch/goodsList'
          );

          console.log('📡 기자재 데이터 가져오는 중...');
          const data = await fetchGoodsFromCurrentPage();
          console.log('✅ 현재 페이지에서 추출한 기자재 정보:', data);

          // 데이터가 없으면 기본값 사용
          setGoods(data.length > 0 ? data : getDefaultGoods());
        } catch (importError) {
          console.warn('⚠️ fetch 모듈 import 실패, 기본값 사용:', importError);
          setGoods(getDefaultGoods());
        }
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
    // 로그인 체크
    if (!isUserLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }

    // 선택된 기자재 찾기
    const selectedGoods = goods.find(item => item.id === id);

    if (selectedGoods && selectedGoods.lendGroupSeq && selectedGoods.lendMhrmlSeq) {
      // 상세 페이지로 이동
      navigate(`/detail/${selectedGoods.lendGroupSeq}/${selectedGoods.lendMhrmlSeq}`);
    } else {
      console.warn('기자재 정보가 없습니다:', id, selectedGoods);
    }
  };

  const handleLogin = () => {
    redirectToLogin();
  };

  const handleCloseModal = () => {
    setShowLoginPrompt(false);
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

      {/* 기자재 리스트 */}
      <div
        className="goods-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(700px, 1fr))",
          gap: "20px",
        }}
      >
        {goods.map((g) => (
          <GoodsItem key={g.id} {...g} onSelect={handleSelectGoods} />
        ))}
      </div>

      {/* 로그인 프롬프트 모달 */}
      {showLoginPrompt && (
        <LoginPromptModal
          onClose={handleCloseModal}
          onLogin={handleLogin}
        />
      )}
    </>
  );
};
