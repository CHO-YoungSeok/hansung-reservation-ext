import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import { SpaceSummary } from './types';
import './SpaceDetailForm.css';

interface SpaceCardProps {
  space: SpaceSummary;
  applicantType?: string;
  managerName?: string;
  managerPhone?: string;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({ 
  space,
  applicantType = '재학생',
  managerName: extractedManagerName,
  managerPhone: extractedManagerPhone,
}) => {
  const facilityLabel = useMemo(() => {
    if (!space.facilities || space.facilities.length === 0) {
      return '등록된 시설 정보가 없습니다.';
    }
    return space.facilities.join(', ');
  }, [space.facilities]);

  const managerName = useMemo(() => {
    // 기존 페이지에서 추출한 정보를 우선 사용
    if (extractedManagerName) return extractedManagerName;
    
    // 없으면 space 정보에서 추출
    if (space.managerContact) {
      const parts = space.managerContact.split(' ');
      return parts.length > 1 ? parts[0] : '담당자';
    }
    return '담당자';
  }, [extractedManagerName, space.managerContact]);

  const managerPhone = useMemo(() => {
    // 기존 페이지에서 추출한 정보를 우선 사용
    if (extractedManagerPhone) return extractedManagerPhone;
    
    // 없으면 space 정보나 기본값 사용
    return space.managerContact || '00-000-0000';
  }, [extractedManagerPhone, space.managerContact]);

  return (
    <Card className="space-card">
      <div className="space-card__container">
        <div className="space-card__image-container">
          {space.coverImageUrl ? (
            <img
              src={space.coverImageUrl}
              alt={space.name}
              className="space-card__image"
            />
          ) : (
            <div className="space-card__placeholder">
              사진 등록 예정
            </div>
          )}
        </div>
        <div className="space-card__content">
          <h2 className="space-card__title">
            {space.name}
          </h2>
          <div className="space-card__info">
            <div className="space-card__info-item">
              <span className="space-card__info-label">시설</span>
              <span className="space-card__info-value">{facilityLabel}</span>
            </div>
            <div className="space-card__info-item">
              <span className="space-card__info-label">수용인원</span>
              <span className="space-card__info-value">최대 {space.capacity}명</span>
            </div>
            <div className="space-card__info-item">
              <span className="space-card__info-label">담당자</span>
              <span className="space-card__info-value">{managerName}</span>
            </div>
            <div className="space-card__info-item">
              <span className="space-card__info-label">연락처</span>
              <span className="space-card__info-value">{managerPhone}</span>
            </div>
            <div className="space-card__info-item">
              <span className="space-card__info-label">신청대상</span>
              <span className="space-card__info-value">{applicantType}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

