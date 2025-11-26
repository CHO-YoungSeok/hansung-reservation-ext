import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string; // 선택사항으로 변경 (하위 호환성을 위해 유지)
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout" style={{ minHeight: '100vh' }}>
      <main style={{ padding: '0' }}>
        {children}
      </main>
    </div>
  );
};
