import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface GoodsDetailParams {
  lendGroupSeq: string;
  lendMhrmlSeq: string;
}

export const GoodsDetailPage: React.FC = () => {
  const { lendGroupSeq, lendMhrmlSeq } = useParams<{ lendGroupSeq: string; lendMhrmlSeq: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetail = async () => {
      if (!lendGroupSeq || !lendMhrmlSeq) {
        setError('잘못된 접근입니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = `https://hansung.ac.kr/lend/cncschool/1/${lendGroupSeq}/${lendMhrmlSeq}/lendMhrmlRegistView.do`;
        console.log(`📡 상세 페이지 로딩: ${url}`);

        const response = await fetch(url);
        const html = await response.text();

        // HTML에서 필요한 부분 추출
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // _fnctWrap 내용 추출 (실제 콘텐츠 영역)
        const fnctWrap = doc.querySelector('._fnctWrap');

        if (fnctWrap) {
          // 스타일 태그 추출
          const styles = Array.from(doc.querySelectorAll('link[rel="stylesheet"], style'))
            .map(el => el.outerHTML)
            .join('\n');

          // 스크립트 태그 추출 (jQuery 등 필요한 것들)
          const scripts = Array.from(doc.querySelectorAll('script'))
            .filter(script => {
              const src = script.getAttribute('src');
              return src && (src.includes('jquery') || src.includes('common'));
            })
            .map(el => el.outerHTML)
            .join('\n');

          const content = `
            ${styles}
            ${fnctWrap.outerHTML}
            ${scripts}
          `;

          setHtmlContent(content);
          console.log('✅ 상세 페이지 로딩 완료');
        } else {
          setError('페이지 내용을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error loading detail:', err);
        setError('페이지를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [lendGroupSeq, lendMhrmlSeq]);

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
        상세 정보를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div>
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
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          ← 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 뒤로가기 버튼 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate(-1)}
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      {/* 상세 페이지 내용 */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
