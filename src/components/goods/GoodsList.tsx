import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoodsItem } from './GoodsItem';
import { LoginPromptModal } from '../common/LoginPromptModal';
import type { GoodsData } from '../../services/goodsApi';
import { getDefaultGoods } from '../../services/goodsApi';

import { checkLoginFromServer, redirectToLogin } from '../../utils/authUtils';

export const GoodsList: React.FC = () => {
  const navigate = useNavigate();

  const [goods, setGoods] = useState<GoodsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // 1) 로그인 체크
      const loggedIn = await checkLoginFromServer();
      if (!loggedIn) {
        setShowLoginPrompt(true);
        setLoading(false);
        return;
      }

      // 2) 로그인 O → 기자재 데이터 로드
      try {
        const { fetchGoodsFromCurrentPage } = await import(
          '../../../entrypoints/content-script/fetch/goodsList'
        );

        const data = await fetchGoodsFromCurrentPage();
        setGoods(data.length > 0 ? data : getDefaultGoods());
      } catch (err) {
        console.error(err);
        setError("데이터를 불러올 수 없습니다.");
        setGoods(getDefaultGoods());
      }

      setLoading(false);
    };

    init();
  }, []);

  const handleSelectGoods = (id: string) => {
    const selected = goods.find(g => g.id === id);
    if (!selected) return;

    navigate(`/detail/${selected.lendGroupSeq}/${selected.lendMhrmlSeq}`);
  };

  const handleLogin = () => redirectToLogin();

  if (loading)
    return (
      <div style={{ padding: 30 }}>기자재 목록을 불러오는 중...</div>
    );

  return (
    <>
      {/* 에러 메시지 */}
      {error && (
        <div style={{
          padding: "12px",
          backgroundColor: "#fee2e2",
          borderRadius: "6px",
          marginBottom: "12px"
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

      {/* 로그인 모달 */}
      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
};
