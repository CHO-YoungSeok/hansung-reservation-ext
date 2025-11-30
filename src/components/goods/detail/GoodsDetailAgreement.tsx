import React from "react";

interface Props {
  html: string;
}

export const GoodsDetailAgreement: React.FC<Props> = ({ html }) => {
  return (
    <section className="goods-section">
      

      <div
        className="section-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
};
