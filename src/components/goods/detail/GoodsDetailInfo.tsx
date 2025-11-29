import React from "react";
import "./GoodsDetail.css";

interface Props {
  title: string;
  summaryHTML: string; // 신청대상, 대여장소 등 테이블
     // 신청안내
}

export const GoodsDetailInfo: React.FC<Props> = ({
  title,
  summaryHTML,
  
}) => {
  return (
    <div className="goods-info-card">

      <h2 className="goods-info-title">{title}</h2>

      {/* 기본정보(신청대상, 대여장소 등) */}
      <div
        className="goods-info-table"
        dangerouslySetInnerHTML={{ __html: summaryHTML }}
      />

      {/* 신청안내 */}
      
    </div>
  );
};
