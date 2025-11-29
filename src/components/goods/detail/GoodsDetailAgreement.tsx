import React from "react";

interface Props {
  html: string;
}

export const GoodsDetailAgreement: React.FC<Props> = ({ html }) => {
  return (
    <section className="goods-section">
      <h3 className="section-title">정보 동의</h3>

      <div
        className="section-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
};
