import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CategoryItem {
  id: string;
  name: string;
  lendGroupSeq?: number;
  type: 'summary' | 'lend' | 'list';
  path: string;
}

const categories: CategoryItem[] = [
  { id: 'summary', name: '개요', type: 'summary', path: '/' },
  { id: '3d-printer', name: '3D 프린터', lendGroupSeq: 2, type: 'lend', path: '/category/2' },
  { id: 'laser-cutter', name: '레이저 커팅기', lendGroupSeq: 4, type: 'lend', path: '/category/4' },
  { id: 'laptop', name: '노트북', lendGroupSeq: 3, type: 'lend', path: '/category/3' },
  { id: 'vr-ar', name: 'VR/AR/기타', lendGroupSeq: 1, type: 'lend', path: '/category/1' },
  { id: 'my-list', name: '나의 신청내역', type: 'list', path: '/my-list' },
];

interface CategoryMenuProps {
  currentCategory?: string;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({ currentCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (category: CategoryItem) => {
    navigate(category.path);
  };

  // 현재 경로를 기반으로 active 카테고리 결정
  const getActiveCategory = () => {
    if (currentCategory) return currentCategory;

    const path = location.pathname;
    const category = categories.find(cat => cat.path === path);
    return category?.id || 'summary';
  };

  const activeCategoryId = getActiveCategory();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0066cc 0%, #003da5 100%)',
      padding: '20px',
      marginBottom: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
      }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            style={{
              padding: '12px 24px',
              background: activeCategoryId === category.id
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: activeCategoryId === category.id
                ? '#0066cc'
                : 'white',
              fontSize: '15px',
              fontWeight: activeCategoryId === category.id ? 'bold' : '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: activeCategoryId === category.id
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (activeCategoryId !== category.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategoryId !== category.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
