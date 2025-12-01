/**
 * Toast Notification Utility
 * Shadow DOM 기반 토스트 알림 시스템
 * 호스트 페이지의 CSS와 완전히 격리됨
 */

interface ToastOptions {
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  duration?: number;
}

/**
 * 토스트 메시지를 화면에 표시합니다.
 * Shadow DOM을 사용하여 호스트 페이지의 스타일과 격리됩니다.
 *
 * @param options - 토스트 옵션
 */
export function showToast(options: ToastOptions): void {
  const { message, type = 'info', duration = 4000 } = options;

  // 토스트 컨테이너 생성 또는 재사용
  let container = document.getElementById('hansung-ext-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'hansung-ext-toast-container';
    document.body.appendChild(container);

    // Shadow DOM 생성
    const shadow = container.attachShadow({ mode: 'open' });

    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
      }

      .toast {
        background: white;
        color: #333;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 10px;
        min-width: 250px;
        max-width: 400px;
        pointer-events: auto;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .toast.error {
        border-left: 4px solid #ef4444;
      }

      .toast.success {
        border-left: 4px solid #10b981;
      }

      .toast.info {
        border-left: 4px solid #3b82f6;
      }

      .toast.warning {
        border-left: 4px solid #f59e0b;
      }

      .toast.hiding {
        animation: slideOut 0.3s ease-out forwards;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      .toast-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .toast-message {
        flex: 1;
        font-size: 14px;
        line-height: 1.5;
      }
    `;
    shadow.appendChild(style);
  }

  const shadow = container.shadowRoot!;

  // 토스트 요소 생성
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.textContent =
    type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';

  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(messageEl);
  shadow.appendChild(toast);

  console.log(`[Toast] 표시: [${type}] ${message}`);

  // 자동 제거
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      if (shadow.contains(toast)) {
        shadow.removeChild(toast);
      }

      // 컨테이너가 비어있으면 제거
      if (shadow.children.length <= 1) {
        // style만 남음
        if (container && container.parentNode) {
          document.body.removeChild(container);
        }
      }
    }, 300);
  }, duration);
}
