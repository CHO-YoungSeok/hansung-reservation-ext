import React, { useState } from 'react';
import './HomePage.css';

interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

interface Building {
  id: string;
  name: string;
  url: string;
  position: { top: string; left: string };
}

const defaultShortcuts: Shortcut[] = [
  { id: '1', name: 'e-class', url: 'https://learn.hansung.ac.kr/', icon: '📚' },
  { id: '2', name: '공지사항', url: 'https://www.hansung.ac.kr/hansung/1633/subview.do', icon: '📢' },
  { id: '3', name: '종합정보시스템', url: 'https://portal.hansung.ac.kr/', icon: '💻' },
];

const buildings: Building[] = [
  { id: 'sangsang', name: '상상관', url: 'https://www.hansung.ac.kr/onestop/8952/subview.do', position: { top: '40%', left: '30%' } },
  { id: 'gonghak', name: '공학관', url: 'https://hansung.ac.kr/cncschool/7309/subview.do', position: { top: '60%', left: '50%' } },
  { id: 'library', name: '도서관', url: 'https://lib.hansung.ac.kr/', position: { top: '35%', left: '60%' } },
  { id: 'student', name: '학생회관', url: 'https://www.hansung.ac.kr/', position: { top: '55%', left: '25%' } },
];

export const HomePage: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(defaultShortcuts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ name: '', url: '', icon: '🔗' });

  const handleAddShortcut = () => {
    if (newShortcut.name && newShortcut.url) {
      const shortcut: Shortcut = {
        id: Date.now().toString(),
        ...newShortcut,
      };
      setShortcuts([...shortcuts, shortcut]);
      setNewShortcut({ name: '', url: '', icon: '🔗' });
      setShowAddModal(false);
    }
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(s => s.id !== id));
  };

  const handleNavigate = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>🏫 한성대학교 통합 포털</h1>
        <p>원하는 건물이나 서비스를 선택하세요</p>
      </header>

      <div className="home-content">
        {/* 지도 영역 */}
        <div className="map-section">
          <h2>캠퍼스 맵</h2>
          <div className="campus-map">
            <div className="map-background">
              <svg width="100%" height="100%" viewBox="0 0 800 600">
                {/* 간단한 캠퍼스 배경 */}
                <rect x="50" y="50" width="700" height="500" fill="#e8f5e9" stroke="#4caf50" strokeWidth="2" rx="10" />
                
                {/* 도로 */}
                <line x1="50" y1="300" x2="750" y2="300" stroke="#9e9e9e" strokeWidth="20" />
                <line x1="400" y1="50" x2="400" y2="550" stroke="#9e9e9e" strokeWidth="20" />
                
                {/* 건물 표시 */}
                {buildings.map(building => {
                  const x = parseFloat(building.position.left) * 8;
                  const y = parseFloat(building.position.top) * 6;
                  return (
                    <g key={building.id}>
                      <rect 
                        x={x} 
                        y={y} 
                        width="80" 
                        height="60" 
                        fill="#2196f3" 
                        stroke="#1976d2" 
                        strokeWidth="2"
                        rx="5"
                        className="building-rect"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleNavigate(building.url)}
                      />
                      <text 
                        x={x + 40} 
                        y={y + 35} 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="12"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                      >
                        {building.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 건물 리스트 (모바일용) */}
            <div className="building-list-mobile">
              <h3>건물 목록</h3>
              {buildings.map(building => (
                <button 
                  key={building.id}
                  className="building-button"
                  onClick={() => handleNavigate(building.url)}
                >
                  🏢 {building.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 바로가기 리스트 */}
        <div className="shortcuts-section">
          <div className="shortcuts-header">
            <h2>빠른 링크</h2>
            <button 
              className="add-button"
              onClick={() => setShowAddModal(true)}
            >
              ➕ 추가하기
            </button>
          </div>

          <div className="shortcuts-list">
            {shortcuts.map(shortcut => (
              <div key={shortcut.id} className="shortcut-item">
                <button 
                  className="shortcut-button"
                  onClick={() => handleNavigate(shortcut.url)}
                >
                  <span className="shortcut-icon">{shortcut.icon}</span>
                  <span className="shortcut-name">{shortcut.name}</span>
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteShortcut(shortcut.id)}
                  title="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 추가 모달 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>새 바로가기 추가</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={newShortcut.name}
                  onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
                  placeholder="예: 학사공지"
                />
              </div>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  value={newShortcut.url}
                  onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>아이콘 (이모지)</label>
                <input
                  type="text"
                  value={newShortcut.icon}
                  onChange={(e) => setNewShortcut({ ...newShortcut, icon: e.target.value })}
                  placeholder="🔗"
                  maxLength={2}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                  취소
                </button>
                <button className="confirm-button" onClick={handleAddShortcut}>
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
