import React, { useState, useEffect } from "react";
import { Calendar } from "../../common/Calendar";
import { getTodayString, addDays } from "../../../../utils/dateUtils";

interface Props {
  todayInput: HTMLInputElement | null;
  selectedDate: string;             // 🔥 추가
  onDateChange: (date: string) => void;
}

export const GoodsDetailDatePicker: React.FC<Props> = ({
  todayInput,
  selectedDate,
  onDateChange,
}) => {
  const [internalDate, setInternalDate] = useState<string>(() => {
    return selectedDate || todayInput?.value || getTodayString();
  });

  const minDate = getTodayString();
  const maxDate = addDays(minDate, 90);

  /** 🔥 부모 selectedDate 변화 시 내부 날짜도 반영 */
  useEffect(() => {
    if (selectedDate) setInternalDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date: string) => {
    setInternalDate(date);

    if (todayInput) {
      todayInput.value = date;
      todayInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    onDateChange(date); // 부모에게 전달
  };

  return (
    <section className="goods-section">
      <h3 className="section-title">예약 날짜 선택</h3>
      <Calendar
        value={internalDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleDateChange}
      />
    </section>
  );
};
