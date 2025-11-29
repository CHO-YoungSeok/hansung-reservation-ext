import React from "react";

interface Props {
  todayInput: HTMLInputElement | null;
}

export const GoodsDetailDatePicker: React.FC<Props> = ({ todayInput }) => {
  return (
    <section className="goods-section">
      <h3 className="section-title">예약 날짜 선택</h3>

      <input
        type="date"
        className="date-input"
        defaultValue={todayInput?.value ?? ""}
      />
    </section>
  );
};
