import React, { useState } from "react";
import "./GoodsDetail.css";

interface Props {
  data: any;
  selectedDate: string;
  useHours: number; // 예상사용시간
}

export const GoodsDetailTimeTable: React.FC<Props> = ({
  data,
  selectedDate,
  useHours,
}) => {
  const [selected, setSelected] = useState<{
    item: string;
    times: string[];
  }>({ item: "", times: [] });

  if (!data) return <div>시간표 불러오는 중...</div>;

  const times: string[] = data.lendTm.split(",");
  const items = data.lendPrdlstList;
  const used = data.lendArtclList;

  /** 이미 예약되었는지 체크 */
  function isDisabled(itemSeq: number, date: string, time: string) {
    const now = new Date();
    const current = new Date(`${date} ${time}`);
    if (current <= now) return true;

    for (const a of used) {
      if (a.lendPrdlstSeq !== itemSeq) continue;

      const start = new Date(`${a.lendBgnde} ${a.lendBgnTm}`);
      const end = new Date(`${a.lendEndde} ${a.lendEndTm}`);

      if (current >= start && current < end) return true;
    }
    return false;
  }

  /** 🔥 시간 선택 시 자동 확장 */
  const handleSelect = (item: any, startTime: string) => {
    const idx = times.indexOf(startTime);
    if (idx === -1) return;

    const result: string[] = [];

    for (let i = 0; i < useHours; i++) {
      const t = times[idx + i];
      if (!t) break;
      result.push(t);
    }

    setSelected({ item: item.prdlstNm, times: result });
  };

  return (
    <section className="goods-section">
      <h3 className="section-title">예약 가능 시간</h3>

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
                const disabled = isDisabled(item.lendPrdlstSeq, selectedDate, t);
                const isSelected =
                  selected.item === item.prdlstNm &&
                  selected.times.includes(t);

                return (
                  <td key={t}>
                    <button
                      disabled={disabled}
                      className={
                        disabled
                          ? "slot-btn blocked"
                          : isSelected
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
    </section>
  );
};
