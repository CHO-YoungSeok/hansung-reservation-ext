import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header style={{
      padding: '20px',
      borderBottom: '1px solid #ddd',
      marginBottom: '20px'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>{title}</h1>
    </header>
  );
};
