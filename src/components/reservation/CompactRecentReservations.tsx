import React, { useEffect, useState } from 'react';
import type { GoodsReservation, StudyRoomReservation } from '../../../entrypoints/content-script/fetch/reservationHistory';
import { fetchRecentReservations } from '../../../entrypoints/content-script/fetch/reservationHistory';

interface CompactRecentReservationsProps {
  limit?: number;
}

export const CompactRecentReservations: React.FC<CompactRecentReservationsProps> = ({ limit = 3 }) => {
  const [goodsReservations, setGoodsReservations] = useState<GoodsReservation[]>([]);
  const [studyRoomReservations, setStudyRoomReservations] = useState<StudyRoomReservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const { goods, studyRoom } = await fetchRecentReservations(limit);
        setGoodsReservations(goods);
        setStudyRoomReservations(studyRoom);
      } catch (err) {
        console.error('예약 내역 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [limit]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '승인':
        return '#10b981';
      case '승인대기':
        return '#f59e0b';
      case '반려':
        return '#ef4444';
      case '취소':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '승인':
        return '✓';
      case '승인대기':
        return '⏱';
      case '반려':
        return '✗';
      case '취소':
        return '⊘';
      default:
        return '○';
    }
  };

  const renderReservationItem = (
    reservation: GoodsReservation | StudyRoomReservation,
    isGoods: boolean
  ) => {
    const goodsRes = reservation as GoodsReservation;
    const studyRoomRes = reservation as StudyRoomReservation;

    return (
      <div
        key={`${isGoods ? 'goods' : 'studyroom'}-${reservation.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 14px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          gap: '12px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = isGoods ? '#0066cc' : '#10b981';
          e.currentTarget.style.boxShadow = `0 2px 8px ${isGoods ? '#0066cc' : '#10b981'}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e9ecef';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Icon */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: isGoods ? '#e7f0fa' : '#d1fae5',
          color: isGoods ? '#0066cc' : '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          flexShrink: 0,
        }}>
          {isGoods ? '💻' : '📍'}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {isGoods ? goodsRes.goodsName : studyRoomRes.roomName}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>{reservation.reservationDate}</span>
            <span style={{ color: '#ddd' }}>|</span>
            <span>
              {isGoods
                ? goodsRes.timeRange.split('~')[0].split(' ')[1]
                : studyRoomRes.timeSlots[0]
              }
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: getStatusColor(reservation.status),
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
        }}>
          <span>{getStatusIcon(reservation.status)}</span>
          <span>{reservation.status}</span>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '4px',
          flexShrink: 0,
        }}>
          {isGoods && goodsRes.detailUrl && (
            <a
              href={goodsRes.detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="상세보기"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#fff',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0066cc';
                e.currentTarget.style.borderColor = '#0066cc';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              👁
            </a>
          )}
          {(isGoods ? goodsRes.editUrl : studyRoomRes.editUrl) && (
            <a
              href={isGoods ? goodsRes.editUrl : studyRoomRes.editUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="수정"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#fff',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              ✎
            </a>
          )}
          {(isGoods ? goodsRes.cancelUrl : studyRoomRes.cancelUrl) && (
            <a
              href={isGoods ? goodsRes.cancelUrl : studyRoomRes.cancelUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="취소"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#fff',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              ✗
            </a>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
        예약 내역을 불러오는 중...
      </div>
    );
  }

  if (goodsReservations.length === 0 && studyRoomReservations.length === 0) {
    return (
      <div style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
        최근 예약 내역이 없습니다.
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Equipment Reservations */}
      {goodsReservations.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#0066cc',
            }}>
              💻 기자재 예약
            </div>
            <div style={{
              fontSize: '12px',
              color: '#999',
              fontWeight: '600',
            }}>
              {goodsReservations.length}건
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {goodsReservations.map(reservation =>
              renderReservationItem(reservation, true)
            )}
          </div>
        </div>
      )}

      {/* Horizontal Divider */}
      {goodsReservations.length > 0 && studyRoomReservations.length > 0 && (
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #ddd, transparent)',
          margin: '0',
        }} />
      )}

      {/* Study Room Reservations */}
      {studyRoomReservations.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#10b981',
            }}>
              📍 스터디룸 예약
            </div>
            <div style={{
              fontSize: '12px',
              color: '#999',
              fontWeight: '600',
            }}>
              {studyRoomReservations.length}건
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {studyRoomReservations.map(reservation =>
              renderReservationItem(reservation, false)
            )}
          </div>
        </div>
      )}

      {/* Show more link */}
      <div style={{
        marginTop: '8px',
        textAlign: 'center',
      }}>
        <a
          href="https://hansung.ac.kr/cncschool/7309/subview.do"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '13px',
            color: '#0066cc',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          전체 예약 내역 보기 →
        </a>
      </div>
    </div>
  );
};
