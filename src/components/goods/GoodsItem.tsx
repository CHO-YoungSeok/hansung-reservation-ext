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
  onSelect 
}) => {
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
    <Card onClick={() => onSelect?.(id)}>
      <div style={{
        display: 'flex',
        gap: '16px',
        padding: '12px',
      }}>
        {/* 좌측: 이미지 */}
        <div style={{
          flex: '0 0 160px',
          minHeight: '160px',
        }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Crect fill=%22%23ddd%22 width=%22160%22 height=%22160%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '160px',
              backgroundColor: '#e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '12px',
            }}>
              이미지 없음
            </div>
          )}
        </div>

        {/* 우측: 정보 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {/* 제품명과 상태 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1f2937',
              flex: 1,
            }}>
              {name}
            </h3>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: getStatusColor(status),
              whiteSpace: 'nowrap',
            }}>
              {getStatusText(status)}
            </span>
          </div>

          {/* 카테고리 */}
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
          }}>
            <strong>분류:</strong> {category}
          </div>

          {/* 설명 */}
          {description && (
            <div style={{
              fontSize: '13px',
              color: '#4b5563',
              lineHeight: '1.4',
            }}>
              {description}
            </div>
          )}

          {/* 스팩 */}
          {specs && Object.keys(specs).length > 0 && (
            <div style={{
              fontSize: '12px',
              color: '#374151',
            }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>스팩:</strong>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
                fontSize: '12px',
              }}>
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 4px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '3px',
                  }}>
                    <span style={{ fontWeight: 'bold', marginRight: '4px' }}>{key}:</span>
                    <span style={{ color: '#6b7280' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 주의사항 */}
          {warnings && Object.keys(warnings).length > 0 && (
            <div style={{
              fontSize: '12px',
              color: '#dc2626',
              borderTop: '1px solid #fee2e2',
              paddingTop: '8px',
              marginTop: '4px',
            }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>⚠️ 주의사항:</strong>
              <ul style={{
                margin: 0,
                paddingLeft: '16px',
              }}>
                {Object.entries(warnings).map(([key, value]) => (
                  <li key={key} style={{
                    margin: '2px 0',
                    lineHeight: '1.3',
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
