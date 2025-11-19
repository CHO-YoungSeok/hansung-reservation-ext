import React, { useMemo } from 'react';
import { Card } from '../../common/Card';
import { SpaceSummary } from './types';
import './SpaceDetailForm.css';

interface ManagerInfoProps {
  space: SpaceSummary;
  applicantType?: string;
  managerName?: string;
  managerPhone?: string;
}

export const ManagerInfo: React.FC<ManagerInfoProps> = ({ 
  space, 
  applicantType = '재학생',
  managerName: extractedManagerName,
  managerPhone: extractedManagerPhone,
}) => {
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
    <Card className="space-reservation-form__sidebar-card">
      <h3 className="space-reservation-form__sidebar-title">
        담당자 정보
      </h3>
      <div className="space-reservation-form__sidebar-info">
        <div className="space-reservation-form__sidebar-info-item">
          <span className="space-reservation-form__sidebar-label">담당자</span>
          <span className="space-reservation-form__sidebar-value">{managerName}</span>
        </div>
        <div className="space-reservation-form__sidebar-info-item">
          <span className="space-reservation-form__sidebar-label">연락처</span>
          <span className="space-reservation-form__sidebar-value">{managerPhone}</span>
        </div>
        <div className="space-reservation-form__sidebar-info-item">
          <span className="space-reservation-form__sidebar-label">신청대상</span>
          <span className="space-reservation-form__sidebar-value">{applicantType}</span>
        </div>
      </div>
    </Card>
  );
};

