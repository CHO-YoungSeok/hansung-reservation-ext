import React, { useState } from 'react';
import './style.css';
import { LoginPromptModal } from '../../src/components/common/LoginPromptModal';
import { redirectToLogin, redirectToLogout } from '../../src/utils/authUtils';
import { CompactRecentReservations } from '../../src/components/reservation/CompactRecentReservations';

interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  isDefault: boolean;
}

interface UserData {
  isLoggedIn: boolean;
  userName: string;
  studentId: string;
}

const defaultQuickLinks: QuickLink[] = [
  { id: crypto.randomUUID(), name: 'e-class', url: 'https://learn.hansung.ac.kr/', icon: '📚', category: '학습', isDefault: true },
  { id: crypto.randomUUID(), name: '종합정보시스템', url: 'https://info.hansung.ac.kr/jsp_21/index.jsp', icon: '💻', category: '포털', isDefault: true },
  { id: crypto.randomUUID(), name: '스마트자기관리시스템', url: 'https://hsportal.hansung.ac.kr/ko/program/all', icon: '🧠', category: '역량', isDefault: true },
  { id: crypto.randomUUID(), name: '공지사항', url: 'https://www.hansung.ac.kr/hansung/8385/subview.do', icon: '📢', category: '정보', isDefault: true },
  { id: crypto.randomUUID(), name: '컴퓨터공학부 공지사항', url: 'https://hansung.ac.kr/CSE/10766/subview.do', icon: '📰', category: '전공', isDefault: true },
  { id: crypto.randomUUID(), name: '학술정보관', url: 'https://hsel.hansung.ac.kr/main_main.mir', icon: '📖', category: '학습', isDefault: true },
  { id: crypto.randomUUID(), name: '학사일정', url: 'https://www.hansung.ac.kr/eduinfo/3808/subview.do', icon: '📅', category: '정보', isDefault: true },
];

const NewTab: React.FC<{ userData: UserData }> = ({ userData }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('hansungQuickLinks');
    return saved ? JSON.parse(saved) : defaultQuickLinks;
  });

  // Save to localStorage whenever links change
  React.useEffect(() => {
    localStorage.setItem('hansungQuickLinks', JSON.stringify(quickLinks));
  }, [quickLinks]);

  const handleAddLink = () => {
    setEditingLink(null);
    setShowLinkModal(true);
  };

  const handleEditLink = (link: QuickLink) => {
    setEditingLink(link);
    setShowLinkModal(true);
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('이 링크를 삭제하시겠습니까?')) {
      setQuickLinks(links => links.filter(link => link.id !== id));
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newLinks = [...quickLinks];
    [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    setQuickLinks(newLinks);
  };

  const handleMoveDown = (index: number) => {
    if (index === quickLinks.length - 1) return;
    const newLinks = [...quickLinks];
    [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    setQuickLinks(newLinks);
  };

  const handleSaveLink = (link: Omit<QuickLink, 'id' | 'isDefault'>) => {
    if (editingLink) {
      // Update existing link
      setQuickLinks(links => links.map(l =>
        l.id === editingLink.id ? { ...link, id: editingLink.id, isDefault: editingLink.isDefault } : l
      ));
    } else {
      // Add new link
      setQuickLinks(links => [...links, { ...link, id: crypto.randomUUID(), isDefault: false }]);
    }
    setShowLinkModal(false);
    setEditingLink(null);
  };

  const handleCardClick = (url: string) => {
    window.location.href = url;
  };

  const handleLoginClick = () => {
    if (!userData.isLoggedIn) {
      setShowLoginModal(true);
    }
    // If logged in, do nothing, as logout is a separate button
  };

  // Define color palette
  const theme = {
    primaryBlue: '#005bac',
    lightBlueBackground: '#f0f5ff',
    cardBlue: '#e7f0fa',
    accentBlue: '#1a73e8',
    darkerBlueHover: '#004a8c',
  };

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: theme.lightBlueBackground, // Themed background
        alignItems: 'center',
        padding: '0 10px 20px 10px', // Reduced horizontal padding for narrower panel
      }}>
        {/* Two main cards */}
        <div style={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
          marginBottom: '15px',
        }}>
          {/* Card 1: 스터디룸 예약 */}
          <div
            onClick={() => handleCardClick('https://www.hansung.ac.kr/onestop/8952/subview.do')}
            style={{
              flex: 1,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              border: '1px solid #eee',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 16px ${theme.accentBlue}20`;
              e.currentTarget.style.borderColor = theme.accentBlue;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#eee';
            }}
          >
            <div style={{ fontSize: '30px', background: theme.cardBlue, padding: '12px', borderRadius: '10px', color: theme.primaryBlue }}>📍</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>스터디룸 예약</div>
              <div style={{ fontSize: '14px', color: '#777' }}>Study Room Reservation</div>
            </div>
            <div style={{ fontSize: '24px', color: '#999' }}>›</div>
          </div>

          {/* Card 2: 기자재 예약 */}
          <div
            onClick={() => handleCardClick('https://hansung.ac.kr/cncschool/7309/subview.do')}
            style={{
              flex: 1,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              border: '1px solid #eee',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 16px ${theme.accentBlue}20`;
              e.currentTarget.style.borderColor = theme.accentBlue;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#eee';
            }}
          >
            <div style={{ fontSize: '30px', background: theme.cardBlue, padding: '12px', borderRadius: '10px', color: theme.primaryBlue }}>💻</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>기자재 예약</div>
              <div style={{ fontSize: '14px', color: '#777' }}>Equipment Reservation</div>
            </div>
            <div style={{ fontSize: '24px', color: '#999' }}>›</div>
          </div>
        </div>

        {/* My Recent Reservations */}
        <div style={{
          width: '100%',
          maxWidth: '100%',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          padding: '15px 20px',
          marginBottom: '15px',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>최근 예약</h2>
          {userData.isLoggedIn ? (
            <CompactRecentReservations limit={3} />
          ) : (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                로그인이 필요합니다
              </div>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '20px' }}>
                예약 내역을 확인하려면 로그인해주세요
              </div>
              <button
                onClick={redirectToLogin}
                style={{
                  padding: '10px 24px',
                  background: theme.accentBlue,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.darkerBlueHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.accentBlue;
                }}
              >
                로그인하기
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{
          width: '100%',
          maxWidth: '100%',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          padding: '15px 20px',
          marginBottom: '15px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              margin: 0,
            }}>
              ⚡ 빠른 링크
            </h2>
            <button
              onClick={handleAddLink}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: theme.accentBlue,
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.darkerBlueHover;
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.accentBlue;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              +
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {quickLinks.map((link, index) => (
              <div
                key={link.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f8f8f8',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  border: '1px solid #eee',
                  gap: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accentBlue}20`;
                  e.currentTarget.style.borderColor = theme.accentBlue;
                  const controls = e.currentTarget.querySelector('.link-controls') as HTMLElement;
                  if (controls) controls.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#eee';
                  const controls = e.currentTarget.querySelector('.link-controls') as HTMLElement;
                  if (controls) controls.style.opacity = '0';
                }}
              >
                <div style={{ fontSize: '28px' }}>
                  {link.icon}
                </div>
                <a
                  href={link.url}
                  style={{
                    flex: 1,
                    textDecoration: 'none',
                    color: '#333',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {link.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {link.category}
                  </div>
                </a>
                <div
                  className="link-controls"
                  style={{
                    display: 'flex',
                    gap: '4px',
                    opacity: '0',
                    transition: 'opacity 0.2s ease',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      border: 'none',
                      background: index === 0 ? '#e0e0e0' : '#fff',
                      color: index === 0 ? '#999' : '#666',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (index !== 0) e.currentTarget.style.background = theme.lightBlueBackground;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index === 0 ? '#e0e0e0' : '#fff';
                    }}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === quickLinks.length - 1}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      border: 'none',
                      background: index === quickLinks.length - 1 ? '#e0e0e0' : '#fff',
                      color: index === quickLinks.length - 1 ? '#999' : '#666',
                      cursor: index === quickLinks.length - 1 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (index !== quickLinks.length - 1) e.currentTarget.style.background = theme.lightBlueBackground;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index === quickLinks.length - 1 ? '#e0e0e0' : '#fff';
                    }}
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleEditLink(link)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#fff',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.lightBlueBackground;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#fff',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee';
                      e.currentTarget.style.color = '#c00';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.color = '#666';
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginPromptModal
          onClose={() => setShowLoginModal(false)}
          onLogin={redirectToLogin}
        />
      )}
      {showLinkModal && (
        <LinkEditModal
          link={editingLink}
          onClose={() => {
            setShowLinkModal(false);
            setEditingLink(null);
          }}
          onSave={handleSaveLink}
        />
      )}
    </>
  );
};

// Link Edit Modal Component
interface LinkEditModalProps {
  link: QuickLink | null;
  onClose: () => void;
  onSave: (link: Omit<QuickLink, 'id' | 'isDefault'>) => void;
}

const LinkEditModal: React.FC<LinkEditModalProps> = ({ link, onClose, onSave }) => {
  const [name, setName] = useState(link?.name || '');
  const [url, setUrl] = useState(link?.url || '');
  const [icon, setIcon] = useState(link?.icon || '📎');
  const [category, setCategory] = useState(link?.category || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      alert('이름과 URL을 입력해주세요.');
      return;
    }
    onSave({ name, url, icon, category });
  };

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
        zIndex: 10000,
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
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1d4ed8',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          {link ? '링크 수정' : '링크 추가'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
              이름 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: Google"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1a73e8'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
              URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1a73e8'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
              아이콘 (이모지)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="📎"
              maxLength={2}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '24px',
                textAlign: 'center',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1a73e8'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
              카테고리
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="예: 학습, 포털, 정보"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1a73e8'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
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
              type="submit"
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
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTab;