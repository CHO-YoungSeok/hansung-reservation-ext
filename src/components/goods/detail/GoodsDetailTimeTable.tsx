import React, { useEffect, useState } from "react";
import "./GoodsDetail.css";

interface Props {
  html: string;
}

export const GoodsDetailTimeTable: React.FC<Props> = ({ html }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [header, setHeader] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ item: string; time: string }[]>([]);

  useEffect(() => {
    if (!html) return;

    const doc = new DOMParser().parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) return;

    // --- 헤더 파싱 ---
    const ths = Array.from(table.querySelectorAll("th")).map((th) =>
      th.textContent?.replace(/\s+/g, "").trim() ?? ""
    );
    setHeader(ths);

    // --- 데이터 파싱 ---
    const rows: string[][] = [];
    const trs = Array.from(table.querySelectorAll("tr")).slice(1);

    trs.forEach((tr) => {
      const row = Array.from(tr.querySelectorAll("td")).map((td) =>
        td.textContent?.replace(/\s+/g, "").trim() ?? ""
      );
      rows.push(row);
    });

    setGrid(rows);
  }, [html]);

  const toggle = (item: string, time: string, disabled: boolean) => {
    if (disabled) return;

    setSelected((prev) => {
      const exists = prev.some((s) => s.item === item && s.time === time);
      if (exists) return prev.filter((s) => !(s.item === item && s.time === time));
      return [...prev, { item, time }];
    });
  };

  return (
    <section className="goods-section">

      <h3 className="section-title">예약 가능 시간</h3>

      {/* 🟦 Legend */}
      <div className="time-legend">
        <span className="legend-item">
          <span className="legend-box available"></span> 신청 가능
        </span>
        <span className="legend-item">
          <span className="legend-box blocked"></span> 신청 불가
        </span>
        <span className="legend-item">
          <span className="legend-box selected"></span> 선택됨
        </span>
      </div>

      <div className="goods-time-area">
        <div className="goods-timetable-scroll">

          <table className="goods-time-button-table">

            <thead>
              <tr>
                {header.map((h, idx) => (
                  <th key={idx}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {grid.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => {
                    const isHeader = cIdx === 0;
                    const isBlocked = cell === "0";
                    const isSelected = selected.some(
                      (s) => s.item === row[0] && s.time === header[cIdx]
                    );

                    if (isHeader) {
                      return (
                        <td key={cIdx} className="goods-item-label">
                          {cell}
                        </td>
                      );
                    }

                    return (
                      <td key={cIdx}>
                        <button
                          className={
                            isBlocked
                              ? "slot-btn blocked"
                              : isSelected
                              ? "slot-btn selected"
                              : "slot-btn available"
                          }
                          disabled={isBlocked}
                          onClick={() => toggle(row[0], header[cIdx], isBlocked)}
                        >
                          {header[cIdx]}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </section>
  );
};
