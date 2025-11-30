import React from 'react';
import ReactDOM from 'react-dom/client';
import NewTabPage from './hansungHomePage/main';
import { getUserInfo } from '../src/utils/authUtils';

export default defineContentScript({
  matches: [
    'https://www.hansung.ac.kr/hansung/index.do*',
    'https://www.hansung.ac.kr/sites/hansung/index.do*'
  ],
  main() {
    console.log('한성대 홈페이지 사이드 패널 시작');

    const initCustomUI = () => {
      // Create floating toggle button
      const toggleButton = createToggleButton();
      document.body.appendChild(toggleButton);

      // Create side panel container
      const sidePanel = createSidePanel();
      document.body.appendChild(sidePanel);

      // Render React component inside side panel
      const panelContent = sidePanel.querySelector('#panel-content');
      if (panelContent) {
        const reactRoot = ReactDOM.createRoot(panelContent);
        const userData = getUserInfo();
        console.log('사용자 정보:', userData);
        reactRoot.render(React.createElement(NewTabPage, { userData }));
      }

      // Set up toggle functionality
      setupToggleHandlers(toggleButton, sidePanel);

      console.log('한성대 홈페이지 사이드 패널 렌더링 완료');
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});

/**
 * Create floating toggle button
 */
function createToggleButton(): HTMLElement {
  const button = document.createElement('button');
  button.id = 'hansung-panel-toggle';
  button.setAttribute('aria-label', '한성대 예약 시스템 패널 열기');
  button.innerHTML = '📋';

  // Apply inline styles
  Object.assign(button.style, {
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#005bac',
    color: 'white',
    fontSize: '24px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 91, 172, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: '9998',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.background = '#004a8c';
    button.style.transform = 'translateY(-50%) scale(1.1)';
    button.style.boxShadow = '0 6px 16px rgba(0, 91, 172, 0.4)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.background = '#005bac';
    button.style.transform = 'translateY(-50%) scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(0, 91, 172, 0.3)';
  });

  return button;
}

/**
 * Create side panel container
 */
function createSidePanel(): HTMLElement {
  const panel = document.createElement('div');
  panel.id = 'hansung-side-panel';
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', '한성대 예약 시스템');

  // Apply inline styles
  Object.assign(panel.style, {
    position: 'fixed',
    top: '0',
    right: '-500px', // Initially hidden off-screen
    width: '500px',
    height: '100vh',
    background: 'white',
    boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
    transition: 'right 0.3s ease',
    zIndex: '9999',
    overflowY: 'auto',
    overflowX: 'hidden',
  });

  // Create panel header
  const header = document.createElement('div');
  header.id = 'panel-header';
  Object.assign(header.style, {
    padding: '24px 20px',
    borderBottom: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #005bac 0%, #0071d4 100%)',
    position: 'sticky',
    top: '0',
    zIndex: '10',
    boxShadow: '0 4px 12px rgba(0, 91, 172, 0.15)',
  });

  // Header title container
  const titleContainer = document.createElement('div');
  Object.assign(titleContainer.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  });

  // Icon
  const icon = document.createElement('div');
  icon.innerHTML = '📋';
  Object.assign(icon.style, {
    fontSize: '28px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  });

  // Header title
  const title = document.createElement('h3');
  title.textContent = '한성대 예약 시스템';
  Object.assign(title.style, {
    margin: '0',
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  });

  titleContainer.appendChild(icon);
  titleContainer.appendChild(title);

  // Close button
  const closeButton = document.createElement('button');
  closeButton.id = 'close-button';
  closeButton.innerHTML = '✕';
  closeButton.setAttribute('aria-label', '패널 닫기');
  Object.assign(closeButton.style, {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    fontSize: '20px',
    color: '#ffffff',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontWeight: 'bold',
  });

  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
    closeButton.style.transform = 'scale(1.05)';
  });

  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
    closeButton.style.transform = 'scale(1)';
  });

  header.appendChild(titleContainer);
  header.appendChild(closeButton);

  // Create content container
  const content = document.createElement('div');
  content.id = 'panel-content';
  Object.assign(content.style, {
    height: 'calc(100vh - 76px)', // Full height minus header (24px*2 + 28px icon height)
    overflowY: 'auto',
  });

  panel.appendChild(header);
  panel.appendChild(content);

  return panel;
}

/**
 * Set up toggle functionality
 */
function setupToggleHandlers(toggleButton: HTMLElement, sidePanel: HTMLElement): void {
  let isOpen = false;

  const openPanel = () => {
    sidePanel.style.right = '0';
    toggleButton.style.right = '520px'; // Move button with panel (500px + 20px gap)
    toggleButton.innerHTML = '◀'; // Change icon to indicate close action
    toggleButton.setAttribute('aria-label', '한성대 예약 시스템 패널 닫기');
    isOpen = true;
  };

  const closePanel = () => {
    sidePanel.style.right = '-500px';
    toggleButton.style.right = '20px';
    toggleButton.innerHTML = '📋'; // Change back to original icon
    toggleButton.setAttribute('aria-label', '한성대 예약 시스템 패널 열기');
    isOpen = false;
  };

  // Toggle button click handler
  toggleButton.addEventListener('click', () => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  // Close button click handler
  const closeButton = sidePanel.querySelector('#close-button');
  closeButton?.addEventListener('click', closePanel);

  // ESC key to close panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closePanel();
    }
  });
}
