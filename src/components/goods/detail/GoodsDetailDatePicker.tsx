import React, { useState, useEffect } from "react";
import { Calendar } from "../../common/Calendar";
import { getTodayString, addDays } from "../../../../utils/dateUtils";

interface Props {
  todayInput: HTMLInputElement | null;
}

export const GoodsDetailDatePicker: React.FC<Props> = ({ todayInput }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return todayInput?.value ?? getTodayString();
  });

  const minDate = getTodayString();
  const maxDate = addDays(minDate, 90); // 오늘부터 90일까지 예약 가능

  // todayInput 값이 변경될 때 selectedDate 업데이트
  useEffect(() => {
    if (todayInput?.value) {
      setSelectedDate(todayInput.value);
    }
  }, [todayInput?.value]);

  // 날짜 변경 시 todayInput에도 반영
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (todayInput) {
      todayInput.value = date;
      // change 이벤트 발생시켜서 원본 폼에도 반영
      const event = new Event('change', { bubbles: true });
      todayInput.dispatchEvent(event);
    }
  };

  return (
    <section className="goods-section">
      <h3 className="section-title">예약 날짜 선택</h3>
      <Calendar
        value={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleDateChange}
      />
    </section>
  );
};
