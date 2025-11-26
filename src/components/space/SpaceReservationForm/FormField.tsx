import React from 'react';
import './SpaceReservationForm.css';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`space-reservation-form__field ${className}`}>
      {label && (
        <label className="space-reservation-form__label">
          {label}
          {required && <span className="space-reservation-form__required">*</span>}
        </label>
      )}
      {children}
      {error && (
        <div className="space-reservation-form__helper-text space-reservation-form__helper-text--error">
          {error}
        </div>
      )}
    </div>
  );
};

