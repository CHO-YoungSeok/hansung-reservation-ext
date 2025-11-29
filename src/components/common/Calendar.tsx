import React, { useState } from 'react';
import { normalizeDateString } from '../../../utils/dateUtils';
import './SpaceReservationForm.css';

interface CalendarProps {
  value: string; // YYYY-MM-DD 형식
  minDate: string; // YYYY-MM-DD 형식
  maxDate?: string; // YYYY-MM-DD 형식 (선택사항)
  onChange: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ value, minDate, maxDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = value ? new Date(value) : new Date();
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수
  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // minDate와 maxDate를 YYYY-MM-DD 형식으로 정규화 (시간 부분 제거)
  const normalizedMinDate = normalizeDateString(minDate);
  const normalizedMaxDate = maxDate ? normalizeDateString(maxDate) : null;
  const selectedDate = value ? new Date(value) : null;

  // 현재 월의 첫 번째 날과 마지막 날
  const firstDay = new Date(currentMonth.year, currentMonth.month, 1);
  const lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    const dateStr = formatDate(currentMonth.year, currentMonth.month, day);
    
    // minDate와 maxDate 체크 (날짜 문자열로 비교)
    if (dateStr >= normalizedMinDate && (!normalizedMaxDate || dateStr <= normalizedMaxDate)) {
      onChange(dateStr);
    }
  };

  // 날짜가 선택 가능한지 확인
  const isDateAvailable = (day: number): boolean => {
    const dateStr = formatDate(currentMonth.year, currentMonth.month, day);
    // minDate와 maxDate 범위 내인지 확인
    return dateStr >= normalizedMinDate && (!normalizedMaxDate || dateStr <= normalizedMaxDate);
  };

  // 날짜가 선택된 날짜인지 확인
  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === currentMonth.year &&
      selectedDate.getMonth() === currentMonth.month &&
      selectedDate.getDate() === day
    );
  };

  // 오늘 날짜인지 확인
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getFullYear() === currentMonth.year &&
      today.getMonth() === currentMonth.month &&
      today.getDate() === day
    );
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 빈 칸 생성 (첫 번째 날 전까지)
  const emptyCells = Array.from({ length: startingDayOfWeek }, (_, i) => (
    <div key={`empty-${i}`} className="calendar__day calendar__day--empty"></div>
  ));

  // 날짜 셀 생성
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const available = isDateAvailable(day);
    const selected = isSelected(day);
    const today = isToday(day);

    return (
      <div
        key={day}
        className={`calendar__day ${
          !available
            ? 'calendar__day--disabled'
            : selected
            ? 'calendar__day--selected'
            : today
            ? 'calendar__day--today'
            : 'calendar__day--available'
        }`}
        onClick={() => available && handleDateClick(day)}
      >
        {day}
      </div>
    );
  });

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button
          type="button"
          className="calendar__nav-button"
          onClick={goToPreviousMonth}
          aria-label="이전 달"
        >
          ‹
        </button>
        <div className="calendar__month-year">
          {currentMonth.year}년 {monthNames[currentMonth.month]}
        </div>
        <button
          type="button"
          className="calendar__nav-button"
          onClick={goToNextMonth}
          aria-label="다음 달"
        >
          ›
        </button>
      </div>
      <div className="calendar__weekdays">
        {dayNames.map(day => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar__days">
        {emptyCells}
        {dayCells}
      </div>
    </div>
  );
};

