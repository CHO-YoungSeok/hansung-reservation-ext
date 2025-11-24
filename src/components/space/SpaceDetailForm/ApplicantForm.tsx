import React from 'react';
import { ApplicantProfile } from './types';
import { InputField } from './InputField';
import './SpaceDetailForm.css';

interface ApplicantFormProps {
  applicant: ApplicantProfile;
  phone: string;
  email: string;
  phoneError?: string;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
}

export const ApplicantForm: React.FC<ApplicantFormProps> = ({
  applicant,
  phone,
  email,
  phoneError,
  onPhoneChange,
  onEmailChange,
}) => {
  return (
    <section className="space-reservation-form__section">
      <h3 className="space-reservation-form__section-title">
        기본 신청서
      </h3>
      <div className="space-reservation-form__fields-grid">
        <InputField
          label="신청자"
          required
          type="text"
          readOnly
          value={applicant.name}
          inputClassName="space-reservation-form__input--readonly"
        />
        <InputField
          label="학번(사번)"
          required
          type="text"
          readOnly
          value={applicant.studentId}
          inputClassName="space-reservation-form__input--readonly"
        />
        <InputField
          label="휴대전화번호"
          required
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          error={phoneError}
        />
        <InputField
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
    </section>
  );
};

