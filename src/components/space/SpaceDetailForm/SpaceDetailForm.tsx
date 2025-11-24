import React, { useState, useEffect } from 'react';
import { Button } from '../../common/Button';
import { SpaceSummary, ApplicantProfile, TimeSlot, ReservationFormValues } from './types';
import { SpaceCard } from './SpaceCard';
import { ReservationGuide } from './ReservationGuide';
import { ReservationDateSection } from './ReservationDateSection';
import { TimeSlotSelection } from './TimeSlotSelection';
import { ApplicantForm } from './ApplicantForm';
import { AllUsersInfo } from './AllUsersInfo';
import type { ExtractedPageData } from '../../../utils/pageDataExtractor';
import './SpaceDetailForm.css';

export interface SpaceReservationFormProps {
  space: SpaceSummary;
  timeSlots?: TimeSlot[];
  applicant?: ApplicantProfile;
  initialSelectedSlotId?: string;
  isSubmitting?: boolean;
  pageData?: ExtractedPageData;
  onSubmit?: (payload: {
    spaceId: string;
    slotId: string;
    values: ReservationFormValues;
  }) => void;
  onCancel?: () => void;

    // 부모가 날짜 변경을 알 수 있게 하는 콜백
  onReservationDateChange?: (date: string) => void;
}

// 시간대는 09:00부터 20:00까지 1시간 단위 (버튼 형태, 다중 선택 가능)
const DEFAULT_SLOTS: TimeSlot[] = [
  { id: '09', label: '09:00-10:00', status: 'available' },
  { id: '10', label: '10:00-11:00', status: 'available' },
  { id: '11', label: '11:00-12:00', status: 'available' },
  { id: '12', label: '12:00-13:00', status: 'available' },
  { id: '13', label: '13:00-14:00', status: 'available' },
  { id: '14', label: '14:00-15:00', status: 'available' },
  { id: '15', label: '15:00-16:00', status: 'available' },
  { id: '16', label: '16:00-17:00', status: 'available' },
  { id: '17', label: '17:00-18:00', status: 'available' },
  { id: '18', label: '18:00-19:00', status: 'available' },
  { id: '19', label: '19:00-20:00', status: 'available' },
  { id: '20', label: '20:00-21:00', status: 'available' },
];

const INITIAL_VALUES: ReservationFormValues = {
  buildingGroup: '',
  spaceId: '',
  reservationDate: '',
  phone: '',
  email: '',
  selectedTimeSlots: [],
  allUsers: '',
  totalUsers: 1
};

export const SpaceReservationForm: React.FC<SpaceReservationFormProps> = ({
  space,
  timeSlots = DEFAULT_SLOTS,
  applicant: propApplicant,
  initialSelectedSlotId,
  isSubmitting = false,
  pageData,
  onSubmit,
  onCancel,
  onReservationDateChange,
}) => {
  // pageData에서 추출한 정보를 우선 사용, 없으면 기본값 사용
  const applicant: ApplicantProfile = {
    name: pageData?.applicantName || propApplicant?.name || '김학생',
    studentId: pageData?.applicantStudentId || propApplicant?.studentId || '2024001234',
    phone: pageData?.applicantPhone || propApplicant?.phone || '010-1234-5678',
    email: pageData?.applicantEmail || propApplicant?.email || 'student@university.ac.kr',
  };
  // 오늘 날짜를 기본값으로 설정
  const today = new Date().toISOString().split('T')[0];
  
  const [values, setValues] = useState<ReservationFormValues>({
    ...INITIAL_VALUES,
    spaceId: space.id,
    buildingGroup: space.roomGroup || '상상베이스',
    reservationDate: today,
    phone: pageData?.applicantPhone || propApplicant?.phone || applicant.phone,
    email: pageData?.applicantEmail || propApplicant?.email || applicant.email,
  });
  
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(() => {
    if (initialSelectedSlotId) return [initialSelectedSlotId];
    const preSelected = timeSlots.find((slot) => slot.status === 'selected');
    return preSelected ? [preSelected.id] : [];
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // pageData가 업데이트되면 폼 필드 자동 채우기
  useEffect(() => {
    if (pageData) {
      setValues((prev) => ({
        ...prev,
        phone: pageData.applicantPhone || prev.phone,
        email: pageData.applicantEmail || prev.email,
      }));
    }
  }, [pageData?.applicantPhone, pageData?.applicantEmail]);

const handleReservationDateChange = (date: string) => {
  // 폼 내부 값 업데이트
  handleInputChange('reservationDate', date);

  // 선택된 시간 초기화 (날짜 바뀌면 이전 선택은 무효)
  setSelectedTimeSlots([]);

  // 부모(SpaceDetailPage)에 알려서 selectedDate 상태 업데이트
  if (onReservationDateChange) {
    onReservationDateChange(date);
  }
};


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!values.spaceId) {
      newErrors.spaceId = '예약공간을 선택해 주세요.';
    }
    if (!values.reservationDate) {
      newErrors.reservationDate = '예약일자를 선택해 주세요.';
    }
    if (selectedTimeSlots.length === 0) {
      newErrors.timeSlots = '신청시간을 선택해 주세요.';
    }
    if (!values.phone) {
      newErrors.phone = '휴대전화번호를 입력해 주세요.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit?.({
      spaceId: values.spaceId,
      slotId: selectedTimeSlots.join(','),
      values,
    });
  };

  const handleTimeSlotToggle = (slotId: string) => {
    const slot = timeSlots.find((s) => s.id === slotId);
    if (!slot || slot.status === 'blocked') return;
    
    setSelectedTimeSlots((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleInputChange = (field: keyof ReservationFormValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <main className="space-reservation-form">
      <div className="space-reservation-form__grid">
        <div className="space-reservation-form__sidebar">
          <SpaceCard 
            space={space}
            applicantType={pageData?.applicantType}
            managerName={pageData?.managerName}
            managerPhone={pageData?.managerPhone}
          />
          <ReservationGuide items={pageData?.guideItems} />
        </div>

        <div className="space-reservation-form__content">
          <form onSubmit={handleSubmit} className="space-reservation-form__form">
            <div className="space-reservation-form__sections">
              <ReservationDateSection
                value={values.reservationDate}
                minDate={today}
                error={errors.reservationDate}
                onChange={handleReservationDateChange}
              />

              <TimeSlotSelection
                timeSlots={timeSlots}
                selectedTimeSlots={selectedTimeSlots}
                error={errors.timeSlots}
                onToggle={handleTimeSlotToggle}
              />

              <ApplicantForm
                applicant={applicant}
                phone={values.phone}
                email={values.email}
                phoneError={errors.phone}
                onPhoneChange={(phone) => handleInputChange('phone', phone)}
                onEmailChange={(email) => handleInputChange('email', email)}
              />

              <AllUsersInfo
                allUsers={values.allUsers}
                totalUsers={values.totalUsers}
                capacity={space.capacity}
                error={errors.allUsers}
                onAllUsersChange={(allUsers) => handleInputChange('allUsers', allUsers)}
                onTotalUsersChange={(totalUsers) => handleInputChange('totalUsers', totalUsers)}
              />

              {/* 제출 버튼 */}
              <section className="space-reservation-form__section">
                <div className="space-reservation-form__submit-container">
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedTimeSlots.length === 0}
                    className="space-reservation-form__submit-button btn btn-primary"
                  >
                    <span className="space-reservation-form__button-text">
                      {isSubmitting ? '신청 처리 중...' : '신청하기'}
                    </span>
                  </button>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
      {onCancel && (
        <div className="space-reservation-form__cancel">
          <Button variant="secondary" onClick={onCancel}>
            이전 화면으로 돌아가기
          </Button>
        </div>
      )}
    </main>
  );
};

