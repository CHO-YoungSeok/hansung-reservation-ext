import React from 'react';

interface LoginPromptModalProps {
  onClose: () => void;
  onLogin: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ onClose, onLogin }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <div
          style={{
            fontSize: '48px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          🔒
        </div>

        {/* 제목 */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1d4ed8',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          로그인이 필요합니다
        </h2>

        {/* 메시지 */}
        <p
          style={{
            fontSize: '15px',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.6',
            marginBottom: '24px',
          }}
        >
          기자재 예약을 하시려면 먼저 로그인해주세요.
        </p>

        {/* 버튼 영역 */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#4b5563',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            취소
          </button>
          <button
            onClick={onLogin}
            style={{
              flex: 1,
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};
