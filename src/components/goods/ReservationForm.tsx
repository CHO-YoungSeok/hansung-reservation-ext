import React, { useState } from 'react';
import type { ReservationRequest } from '../../services/reservationApi';
import { submitReservation } from '../../services/reservationApi';

interface ReservationFormProps {
  goodsId: string;
  goodsName: string;
  onSuccess?: (reservationId: string) => void;
  onCancel?: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  goodsId,
  goodsName,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    purpose: '',
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.purpose ||
      !formData.borrowerName ||
      !formData.borrowerEmail ||
      !formData.borrowerPhone
    ) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('종료일이 시작일보다 늦어야 합니다.');
      return;
    }

    try {
      setLoading(true);
      const request: ReservationRequest = {
        goodsId,
        ...formData,
      };

      const result = await submitReservation(request);
      setSuccess(true);
      onSuccess?.(result.id);
      // 2초 후 자동 닫기
      setTimeout(() => {
        onCancel?.();
      }, 2000);
    } catch (err) {
      setError('예약 신청에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#f0fdf4',
        borderRadius: '8px',
        border: '1px solid #86efac',
      }}>
        <div style={{
          fontSize: '24px',
          marginBottom: '8px',
        }}>
          ✓
        </div>
        <h3 style={{
          margin: '0 0 8px 0',
          color: '#166534',
        }}>
          예약이 완료되었습니다!
        </h3>
        <p style={{
          margin: '0 0 16px 0',
          color: '#15803d',
          fontSize: '14px',
        }}>
          예약 승인 여부는 이메일로 알려드립니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          color: '#1f2937',
        }}>
          {goodsName} 예약하기
        </h3>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#374151',
          }}>
            시작일 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#374151',
          }}>
            종료일 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#374151',
        }}>
          사용 목적 <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="기자재를 어떤 목적으로 사용하실 건가요?"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minHeight: '80px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#374151',
          }}>
            이름 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            name="borrowerName"
            value={formData.borrowerName}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#374151',
          }}>
            연락처 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="tel"
            name="borrowerPhone"
            value={formData.borrowerPhone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#374151',
        }}>
          이메일 <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="email"
          name="borrowerEmail"
          value={formData.borrowerEmail}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
          required
        />
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
      }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            color: '#374151',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          disabled={loading}
        >
          취소
        </button>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.6 : 1,
          }}
          disabled={loading}
        >
          {loading ? '예약 중...' : '예약 신청'}
        </button>
      </div>
    </form>
  );
};
