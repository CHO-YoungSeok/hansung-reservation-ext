import React from 'react';
import { Card } from '../common/Card';
import type { GoodsSpec, GoodsWarning } from '../../services/goodsApi';

interface GoodsItemProps {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'reserved' | 'unavailable';
  imageUrl?: string;
  description?: string;
  specs?: GoodsSpec;
  warnings?: GoodsWarning;
  onSelect?: (id: string) => void;
  isOverview?: boolean;
}

export const GoodsItem: React.FC<GoodsItemProps> = ({
  id,
  name,
  category,
  status,
  imageUrl,
  description,
  specs,
  warnings,
  onSelect,
  isOverview = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'reserved':
        return '#0066cc';
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
    <Card onClick={onSelect ? () => onSelect(id) : undefined}>
      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '16px',
        minHeight: '200px',
      }}>
        {/* 좌측: 이미지 (1/3) */}
        <div style={{
          flex: '0 0 33.333%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '250px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '14px',
            }}>
              이미지 없음
            </div>
          )}
        </div>

        {/* 우측: 정보 (2/3) */}
        <div style={{
          flex: '0 0 66.666%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {/* 제품명과 상태 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              flex: 1,
              lineHeight: '1.4',
            }}>
              {name}
            </h3>
            {/* 개요 페이지에서는 상태 표시 숨김 */}
            {!isOverview && (
              <span style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: getStatusColor(status),
                whiteSpace: 'nowrap',
              }}>
                {getStatusText(status)}
              </span>
            )}
          </div>

          {/* 카테고리 */}
          <div style={{
            fontSize: '15px',
            color: '#6b7280',
          }}>
            <strong>분류:</strong> {category}
          </div>

          {/* 설명 */}
          {description && (
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              lineHeight: '1.6',
            }}>
              {description}
            </div>
          )}

          {/* 스팩 */}
          {specs && Object.keys(specs).length > 0 && (
            <div style={{
              fontSize: '14px',
              color: '#374151',
            }}>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '15px' }}>스팩:</strong>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '14px',
              }}>
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                  }}>
                    <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{key}:</span>
                    <span style={{ color: '#6b7280' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 주의사항 */}
          {warnings && Object.keys(warnings).length > 0 && (
            <div style={{
              fontSize: '14px',
              color: '#dc2626',
              borderTop: '1px solid #fee2e2',
              paddingTop: '12px',
              marginTop: '8px',
            }}>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '15px' }}>⚠️ 주의사항:</strong>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
              }}>
                {Object.entries(warnings).map(([key, value]) => (
                  <li key={key} style={{
                    margin: '4px 0',
                    lineHeight: '1.5',
                  }}>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
