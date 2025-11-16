import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="layout" style={{ minHeight: '100vh' }}>
      <Header title={title} />
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};
