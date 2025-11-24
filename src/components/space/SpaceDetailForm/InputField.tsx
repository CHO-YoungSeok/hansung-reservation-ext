import React from 'react';
import { FormField } from './FormField';
import './SpaceDetailForm.css';

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  required?: boolean;
  error?: string;
  inputClassName?: string;
  fieldClassName?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  required = false,
  error,
  inputClassName = '',
  fieldClassName = '',
  ...inputProps
}) => {
  const baseInputClassName = 'space-reservation-form__input';
  const errorClassName = error ? 'space-reservation-form__input--error' : '';
  const finalInputClassName = `${baseInputClassName} ${inputClassName} ${errorClassName}`.trim();

  return (
    <FormField label={label} required={required} error={error} className={fieldClassName}>
      <input
        {...inputProps}
        className={finalInputClassName}
      />
    </FormField>
  );
};

