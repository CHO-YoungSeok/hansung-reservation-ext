import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const isSpaceCard = className.includes('space-card');

  const baseStyle: React.CSSProperties = isSpaceCard
    ? {
        /* 스터디실 카드인 경우: 바깥 래퍼는 레이아웃만 담당 */
        border: 'none',
        borderRadius: 0,
        padding: 0,
        cursor: onClick ? 'pointer' : 'default',
      }
    : {
        /* 나머지 일반 카드 기본 스타일 */
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
      };

  return (
    <div className={`card ${className}`} onClick={onClick} style={baseStyle}>
      {children}
    </div>
  );
};
