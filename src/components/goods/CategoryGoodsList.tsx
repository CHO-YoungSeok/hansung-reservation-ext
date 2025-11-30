import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoodsItem } from './GoodsItem';
import { LoginPromptModal } from '../common/LoginPromptModal';
import type { GoodsData } from '../../services/goodsApi';

import { checkLoginFromServer, redirectToLogin } from '../../utils/authUtils';

interface CategoryGoodsListProps {
  lendGroupSeq: string;
}

export const CategoryGoodsList: React.FC<CategoryGoodsListProps> = ({ lendGroupSeq }) => {
  const navigate = useNavigate();

  const [goods, setGoods] = useState<GoodsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // 2) 로그인 OK → 카테고리 데이터 fetch
      try {
        const url = `https://hansung.ac.kr/lend/cncschool/1/${lendGroupSeq}/lendMhrmlList.do`;

        const res = await fetch(url);
        const html = await res.text();

        const { parseGoodsFromLendList } = await import(
          '../../../entrypoints/content-script/fetch/goodsList'
        );

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const list = parseGoodsFromLendList(doc.documentElement.outerHTML);
        setGoods(list);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러올 수 없습니다.");
        setGoods([]);
      }

      setLoading(false);
    };

    init();
  }, [lendGroupSeq]);

  const handleSelectGoods = (id: string) => {
    const g = goods.find(x => x.id === id);
    if (!g) return;

    navigate(`/detail/${g.lendGroupSeq}/${g.lendMhrmlSeq}`);
  };

  if (loading) return <div style={{ padding: 30 }}>불러오는 중...</div>;

  return (
    <>
      {error && (
        <div style={{
          padding: 12,
          background: "#fee2e2",
          borderRadius: 6,
          marginBottom: 12
        }}>
          {error}
        </div>
      )}

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

      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => redirectToLogin()}
        />
      )}
    </>
  );
};
