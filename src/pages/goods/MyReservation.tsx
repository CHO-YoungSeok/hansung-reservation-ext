import React, { useEffect, useState } from "react";

interface ReservationItem {
  id: string;
  prdlstName: string;
  applyDate: string;
  startDate: string;
  endDate: string;
  name: string;
  studentId: string;
  status: string;
  detailUrl: string;
}

export const MyReservationsPage: React.FC = () => {
  const [list, setList] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    try {
      setLoading(true);

      const url =
        "https://hansung.ac.kr/lend/cncschool/1/lendArtclList.do";

      const res = await fetch(url, { credentials: "include" });
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      const rows = Array.from(
        doc.querySelectorAll("form[name='actionForm'] table tbody tr")
      );

      const parsed: ReservationItem[] = rows.map((tr) => {
        const tds = tr.querySelectorAll("td");

        const number = tds[0]?.textContent?.trim() ?? "-";
        const prdlstName = tds[1]?.textContent?.trim() ?? "";
        const applyDate = tds[2]?.textContent?.trim() ?? "";

        const timeHTML = tds[3]?.innerHTML ?? "";
        const [start, end] = timeHTML
          .split("<br>")
          .map((v) => v.replace(/<[^>]+>/g, "").trim());

        const name = tds[4]?.textContent?.trim() ?? "";
        const studentId = tds[5]?.textContent?.trim() ?? "";
        const status = tds[6]?.textContent?.trim() ?? "";

        const detailA = tds[7]?.querySelector("a");
        const detailUrl = detailA
          ? "https://hansung.ac.kr" + detailA.getAttribute("href")
          : "#";

        return {
          id: number,
          prdlstName,
          applyDate,
          startDate: start,
          endDate: end,
          name,
          studentId,
          status,
          detailUrl,
        };
      });

      setList(parsed);
    } catch (err) {
      console.error("예약 내역 로딩 실패:", err);
    }

    setLoading(false);
  };

  if (loading)
    return <div style={{ padding: 40 }}>불러오는 중...</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingBottom: "80px"
      }}
    >
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>나의 신청내역</h2>

      {list.length === 0 && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            borderRadius: "12px",
            background: "#f8fafc",
            color: "#64748b"
          }}
        >
          신청 내역이 없습니다.
        </div>
      )}

      {list.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "20px",
            borderRadius: "14px",
            background: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700 }}>
            {item.prdlstName}
          </div>

          <div style={{ marginTop: "12px", fontSize: "14px" }}>
            <b>신청일자:</b> {item.applyDate}
          </div>

          <div style={{ marginTop: "6px", fontSize: "14px" }}>
            <b>예약시간:</b> {item.startDate} ~ {item.endDate}
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: item.status.includes("승인")
                ? "#2563eb"
                : item.status.includes("취소")
                ? "#dc2626"
                : "#475569"
            }}
          >
            {item.status}
          </div>

          <a
            href={item.detailUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              marginTop: "16px",
              padding: "12px",
              background: "#3b82f6",
              color: "white",
              borderRadius: "10px",
              textAlign: "center",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            상세보기
          </a>
        </div>
      ))}
    </div>
  );
};
