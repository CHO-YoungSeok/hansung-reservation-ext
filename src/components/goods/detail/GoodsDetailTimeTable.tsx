import React, { useState } from "react";
import "./GoodsDetail.css";

interface Props {
  data: any;
  selectedDate: string;
  useHours: number; // 예상사용시간
}

/**
 * 시간(HH:mm)과 예상 사용 시간을 기반으로 종료 시간을 계산하는 유틸리티 함수
 * @param date - 'YYYY-MM-DD' 형식의 날짜 문자열
 * @param time - 'HH:mm' 형식의 시작 시간 문자열
 * @param hours - 예상 사용 시간 (시간 단위)
 * @returns {Date} 계산된 종료 시간 Date 객체
 */
const getProjectedEndTime = (date: string, time: string, hours: number): Date => {
  const startTime = new Date(`${date} ${time}`);
  // Date 객체를 새로 생성하여 원본 객체가 변경되지 않도록 함
  const projectedEndTime = new Date(startTime.getTime());
  projectedEndTime.setHours(startTime.getHours() + hours);
  return projectedEndTime;
};

/**
 * 시간 슬롯 간격을 분 단위로 계산하는 유틸리티 함수
 * @param times - 시간 슬롯 배열 (예: ["17:00", "17:30", "18:00", ...])
 * @returns {number} 간격 (분 단위, 기본값: 60분)
 */
const getSlotIntervalMinutes = (times: string[]): number => {
  if (times.length < 2) return 60; // 기본값 1시간

  const time1 = new Date(`2000-01-01 ${times[0]}`);
  const time2 = new Date(`2000-01-01 ${times[1]}`);

  const diffMs = time2.getTime() - time1.getTime();
  return diffMs / (1000 * 60); // 밀리초 → 분으로 변환
};

export const GoodsDetailTimeTable: React.FC<Props> = ({
  data,
  selectedDate,
  useHours,
}) => {
  const [selected, setSelected] = useState<{
    item: string;
    times: string[];
  }>({ item: "", times: [] });

  // 깜빡임 효과를 위한 state (item-time 조합으로 식별)
  const [flashingSlots, setFlashingSlots] = useState<Set<string>>(new Set());

  // 예상사용시간 변경 시 선택 초기화
  React.useEffect(() => {
    console.log("예상사용시간이 변경되어 선택을 초기화합니다:", useHours);
    setSelected({ item: "", times: [] });
  }, [useHours]);

  if (!data) return <div>시간표 불러오는 중...</div>;

  const times: string[] = data.lendTm.split(",");
  const items = data.lendPrdlstList;
  const used = data.lendArtclList;

  // 슬롯 간격 감지 (30분 또는 60분)
  const slotIntervalMinutes = getSlotIntervalMinutes(times);
  console.log(`[슬롯 간격] ${slotIntervalMinutes}분 간격 감지됨`);

  // 마감 시간 계산 (마지막 시간 슬롯 + 1시간 고정)
  const closingTime: Date | null = (() => {
    if (times.length === 0) return null;
    const lastSlotTime = times[times.length - 1];
    // 마지막 시간 슬롯에 1시간을 더해 마감 시간으로 설정 (슬롯 간격과 무관)
    const closing = getProjectedEndTime(selectedDate, lastSlotTime, 1);
    console.log(`[마감 시간] ${closing.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`);
    return closing;
  })();

  /** 깜빡임 효과 트리거 (여러 슬롯을 동시에 깜빡임) */
  function triggerFlash(item: any, timesToFlash: string[]) {
    const newFlashingSlots = new Set<string>();
    timesToFlash.forEach(t => {
      newFlashingSlots.add(`${item.prdlstNm}-${t}`);
    });

    setFlashingSlots(newFlashingSlots);

    // 900ms 후 깜빡임 종료
    setTimeout(() => {
      setFlashingSlots(new Set());
    }, 900);
  }

  /** 마감 시간 초과 여부 체크 (클릭 시 깜빡임 효과용) */
  function isOverClosingTime(date: string, time: string): boolean {
    if (useHours <= 0 || !closingTime) return false;
    const projectedEndTime = getProjectedEndTime(date, time, useHours);
    return projectedEndTime > closingTime;
  }

  /** 이미 예약되었거나 과거 시간인지 체크 (실제 비활성화용) */
  function isReserved(itemSeq: number, date: string, time: string): boolean {
    const now = new Date();
    const current = new Date(`${date} ${time}`);

    // 1. 과거 시간 체크
    if (current <= now) return true;

    // 2. 기존의 중복 예약 체크
    for (const a of used) {
      if (a.lendPrdlstSeq !== itemSeq) continue;

      const start = new Date(`${a.lendBgnde} ${a.lendBgnTm}`);
      const end = new Date(`${a.lendEndde} ${a.lendEndTm}`);

      if (current >= start && current < end) return true;
    }
    return false;
  }

  /** 통합 비활성화 체크 (handleSelect에서 사용) */
  function isDisabled(itemSeq: number, date: string, time: string): boolean {
    return isReserved(itemSeq, date, time) || isOverClosingTime(date, time);
  }

  /** 🔥 시간 선택 시 자동 확장 */
  const handleSelect = (item: any, startTime: string) => {
    console.log("=== handleSelect 호출 ===");
    console.log("아이템:", item.prdlstNm);
    console.log("클릭한 시간:", startTime);
    console.log("예상사용시간:", useHours);

    // 이미 선택된 상태에서 같은 시작 시간을 클릭하면 선택 취소
    if (selected.item === item.prdlstNm && selected.times.length > 0 && selected.times[0] === startTime) {
      console.log("이미 선택된 시간 - 선택 취소");
      setSelected({ item: "", times: [] });
      return;
    }

    const idx = times.indexOf(startTime);
    if (idx === -1) {
      console.log("시간 슬롯을 찾을 수 없음");
      return;
    }

    // 슬롯 간격 계산 및 필요한 슬롯 개수 산출
    const slotIntervalMinutes = getSlotIntervalMinutes(times);
    const requiredSlots = Math.ceil((useHours * 60) / slotIntervalMinutes);
    console.log(`[필요 슬롯] ${useHours}시간 = ${requiredSlots}개 슬롯 (${slotIntervalMinutes}분 간격)`);

    // 선택하려는 모든 시간 슬롯 계산 (깜빡임 효과용)
    const attemptedSlots: string[] = [];
    for (let i = 0; i < requiredSlots; i++) {
      const t = times[idx + i];
      if (t) attemptedSlots.push(t);
    }

    // 1. 이미 예약된 슬롯이면 깜빡임 효과 표시
    if (isReserved(item.lendPrdlstSeq, selectedDate, startTime)) {
      console.log("이미 예약된 슬롯 - 깜빡임 효과 표시");
      triggerFlash(item, attemptedSlots);
      return;
    }

    // 2. 마감 시간 초과 슬롯이면 깜빡임 효과 표시
    if (isOverClosingTime(selectedDate, startTime)) {
      console.log("마감 시간 초과 - 깜빡임 효과 표시");
      triggerFlash(item, attemptedSlots);
      return;
    }

    // 3. 정상 선택: 자동 확장
    console.log("정상 선택 - 자동 확장 시작");
    const result: string[] = [];

    for (let i = 0; i < requiredSlots; i++) {
      const t = times[idx + i];
      console.log(`[${i}] 검사 중: ${t}`);

      if (!t) {
        console.log(`  -> 시간 슬롯 없음 (배열 범위 초과)`);
        break;
      }

      // 자동 확장 시에는 예약 여부만 체크 (마감 시간은 시작 시간에서 이미 체크함)
      if (isReserved(item.lendPrdlstSeq, selectedDate, t)) {
        console.log(`  -> 예약된 슬롯 발견 - 깜빡임 효과 표시`);
        // 선택할 수 없는 경우 지금까지 시도한 슬롯들을 깜빡임
        triggerFlash(item, attemptedSlots.slice(0, i + 1));
        return;
      }

      result.push(t);
      console.log(`  -> ${t} 추가됨`);
    }

    console.log("최종 선택된 시간들:", result);

    // 선택 시작 시간이 비활성화 상태이면 선택 취소
    if (result.length === 0 && useHours > 0) {
      console.log("선택된 시간이 없음 - 깜빡임 효과 표시");
      triggerFlash(item, attemptedSlots);
      return;
    }

    setSelected({ item: item.prdlstNm, times: result });
    console.log("선택 완료!");
  };

  return (
    <section className="goods-section">
      <h3 className="section-title">예약 가능 시간</h3>

      {/* 가로 스크롤 컨테이너 */}
      <div className="goods-timetable-scroll">
        <table className="goods-time-button-table">
          <thead>
            <tr>
              <th>품목</th>
              {times.map((t) => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.prdlstNm}>
                <td>{item.prdlstNm}</td>

                {times.map((t) => {
                  const reserved = isReserved(item.lendPrdlstSeq, selectedDate, t);
                  const slotKey = `${item.prdlstNm}-${t}`;
                  const isFlashing = flashingSlots.has(slotKey);
                  const isSelectedSlot =
                    selected.item === item.prdlstNm &&
                    selected.times.includes(t);

                  return (
                    <td key={t}>
                      <button
                        disabled={reserved}
                        className={
                          isFlashing
                            ? "slot-btn flashing"
                            : reserved
                            ? "slot-btn blocked"
                            : isSelectedSlot
                            ? "slot-btn selected"
                            : "slot-btn available"
                        }
                        onClick={() => handleSelect(item, t)}
                      >
                        {t}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
