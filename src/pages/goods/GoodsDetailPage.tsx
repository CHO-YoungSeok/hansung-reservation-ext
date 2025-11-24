import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import type { GoodsData } from '../../services/goodsApi';
import { getDefaultGoods } from '../../services/goodsApi';
import { ReservationForm } from '../../components/goods/ReservationForm';

export const GoodsDetailPage: React.FC = () => {
  // 실제로는 라우터 파라미터에서 goodsId를 받아서 해당 기자재 정보를 조회
  const goods: GoodsData | null = getDefaultGoods()[0] || null;
  const [showReservationForm, setShowReservationForm] = useState(false);

  if (!goods) {
    return (
      <Layout title="기자재 상세">
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          기자재 정보를 찾을 수 없습니다.
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'reserved':
        return '#f59e0b';
      case 'unavailable':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '예약가능';
      case 'reserved':
        return '예약중';
      case 'unavailable':
        return '사용불가';
      default:
        return status;
    }
  };

  return (
    <Layout title="기자재 상세">
      <div className="goods-detail-page">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '32px',
            marginBottom: '32px',
          }}>
            {/* 좌측: 이미지 */}
            <div>
              {goods.imageUrl ? (
                <img
                  src={goods.imageUrl}
                  alt={goods.name}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}>
                  이미지 없음
                </div>
              )}
            </div>

            {/* 우측: 정보 */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
                gap: '16px',
              }}>
                <div>
                  <h1 style={{
                    margin: 0,
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}>
                    {goods.name}
                  </h1>
                  <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '14px',
                    color: '#6b7280',
                  }}>
                    분류: {goods.category}
                  </p>
                </div>
                <span style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff',
                  backgroundColor: getStatusColor(goods.status),
                  whiteSpace: 'nowrap',
                }}>
                  {getStatusText(goods.status)}
                </span>
              </div>

              {goods.description && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  color: '#374151',
                  lineHeight: '1.6',
                }}>
                  {goods.description}
                </div>
              )}

              {/* 스팩 */}
              {goods.specs && Object.keys(goods.specs).length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}>
                    스펙
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}>
                    {Object.entries(goods.specs).map(([key, value]) => (
                      <div key={key} style={{
                        padding: '12px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        borderLeft: '4px solid #3b82f6',
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '4px',
                        }}>
                          {key}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#1f2937',
                        }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 주의사항 */}
              {goods.warnings && Object.keys(goods.warnings).length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    ⚠️ 주의사항
                  </h3>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: '#374151',
                    lineHeight: '1.8',
                  }}>
                    {Object.entries(goods.warnings).map(([key, value]) => (
                      <li key={key} style={{ marginBottom: '8px' }}>
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 예약 버튼 */}
              <button
                onClick={() => setShowReservationForm(true)}
                disabled={goods.status !== 'available'}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: goods.status === 'available' ? '#3b82f6' : '#d1d5db',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: goods.status === 'available' ? 'pointer' : 'not-allowed',
                  opacity: goods.status === 'available' ? 1 : 0.6,
                }}
              >
                {goods.status === 'available' ? '예약하기' : '현재 예약이 불가능합니다'}
              </button>
            </div>
          </div>

          {/* 예약 폼 모달 */}
          {showReservationForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}>
                <ReservationForm
                  goodsId={goods.id}
                  goodsName={goods.name}
                  onCancel={() => setShowReservationForm(false)}
                  onSuccess={(id) => {
                    console.log('Reservation created:', id);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
