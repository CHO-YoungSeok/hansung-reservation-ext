import React from "react";
import "./GoodsDetail.css";

interface Props {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const GoodsDetailLayout: React.FC<Props> = ({ sidebar, children }) => {
  return (
    
    <div className="goods-detail-layout">
      <div className="goods-detail-grid">
        <aside className="goods-detail-sidebar">{sidebar}</aside>
        <main className="goods-detail-main">{children}</main>
      </div>
    </div>
  );
};
