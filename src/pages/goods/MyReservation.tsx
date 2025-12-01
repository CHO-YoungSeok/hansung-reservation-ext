import React, { useEffect, useState } from "react";
import { Card } from "../../components/common/Card";
import type {
  GoodsReservation,
  StudyRoomReservation,
} from "../../../entrypoints/content-script/fetch/reservationHistory";
import { fetchAllReservations } from "../../../entrypoints/content-script/fetch/reservationHistory";

export const MyReservationsPage: React.FC = () => {
  const [goodsReservations, setGoodsReservations] = useState<
    GoodsReservation[]
  >([]);
  const [studyRoomReservations, setStudyRoomReservations] = useState<
    StudyRoomReservation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { goods, studyRoom } = await fetchAllReservations();

      // 신청일자 최신순으로 정렬
      const sortedGoods = goods.sort(
        (a, b) =>
          new Date(b.applicationDate).getTime() -
          new Date(a.applicationDate).getTime()
      );
      const sortedStudyRoom = studyRoom.sort(
        (a, b) =>
          new Date(b.applicationDate).getTime() -
          new Date(a.applicationDate).getTime()
      );

      setGoodsReservations(sortedGoods);
      setStudyRoomReservations(sortedStudyRoom);
    } catch (err) {
      console.error("예약 내역 로딩 실패:", err);
      setError("예약 내역을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인":
        return "#10b981";
      case "승인대기":
        return "#f59e0b";
      case "반려":
        return "#ef4444";
      case "취소":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "16px",
        }}
      >
        예약 내역을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#ef4444",
          fontSize: "16px",
        }}
      >
        {error}
      </div>
    );
  }

  if (goodsReservations.length === 0 && studyRoomReservations.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "16px",
        }}
      >
        신청 내역이 없습니다.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        paddingBottom: "80px",
      }}
    >
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937" }}>
        나의 신청내역
      </h2>

      {/* 기자재 예약 내역 */}
      {goodsReservations.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "16px",
              borderBottom: "2px solid #0066cc",
              paddingBottom: "8px",
            }}
          >
            기자재 예약 ({goodsReservations.length}건)
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "16px",
            }}
          >
            {goodsReservations.map((reservation) => (
              <Card key={reservation.id}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "8px",
                  }}
                >
                  {/* 헤더: 기자재명과 상태 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#1f2937",
                        flex: 1,
                      }}
                    >
                      {reservation.goodsName}
                    </h4>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: getStatusColor(reservation.status),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {reservation.status}
                    </span>
                  </div>

                  {/* 예약 정보 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        예약일:
                      </span>
                      <span>{reservation.reservationDate}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        시간:
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {reservation.timeRange}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        신청자:
                      </span>
                      <span>
                        {reservation.applicantName} ({reservation.studentId})
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        신청일:
                      </span>
                      <span>{reservation.applicationDate}</span>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  {(reservation.detailUrl ||
                    reservation.editUrl ||
                    reservation.cancelUrl) && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "8px",
                        paddingTop: "12px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      {reservation.detailUrl && (
                        <a
                          href={reservation.detailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            backgroundColor: "#0066cc",
                            color: "#fff",
                            textAlign: "center",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          상세보기
                        </a>
                      )}
                      {reservation.editUrl && (
                        <a
                          href={reservation.editUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            backgroundColor: "#10b981",
                            color: "#fff",
                            textAlign: "center",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          수정
                        </a>
                      )}
                      {reservation.cancelUrl && (
                        <a
                          href={reservation.cancelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            backgroundColor: "#ef4444",
                            color: "#fff",
                            textAlign: "center",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          취소
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 스터디룸 예약 내역 */}
      {studyRoomReservations.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "16px",
              borderBottom: "2px solid #10b981",
              paddingBottom: "8px",
            }}
          >
            스터디룸 예약 ({studyRoomReservations.length}건)
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "16px",
            }}
          >
            {studyRoomReservations.map((reservation) => (
              <Card key={reservation.id}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "8px",
                  }}
                >
                  {/* 헤더: 공간명과 상태 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#1f2937",
                        flex: 1,
                      }}
                    >
                      {reservation.roomName}
                    </h4>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: getStatusColor(reservation.status),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {reservation.status}
                    </span>
                  </div>

                  {/* 예약 정보 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        예약일:
                      </span>
                      <span>{reservation.reservationDate}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        시간:
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {reservation.timeSlots.join(", ")}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        신청자:
                      </span>
                      <span>
                        {reservation.applicantName} ({reservation.studentId})
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                        신청일:
                      </span>
                      <span>{reservation.applicationDate}</span>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  {(reservation.editUrl || reservation.cancelUrl) && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "8px",
                        paddingTop: "12px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      {reservation.editUrl && (
                        <a
                          href={reservation.editUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            backgroundColor: "#10b981",
                            color: "#fff",
                            textAlign: "center",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          수정
                        </a>
                      )}
                      {reservation.cancelUrl && (
                        <a
                          href={reservation.cancelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            backgroundColor: "#ef4444",
                            color: "#fff",
                            textAlign: "center",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          취소
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
