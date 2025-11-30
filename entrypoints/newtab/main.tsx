import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

interface QuickLink {
  name: string;
  url: string;
  icon: string;
  category: string;
}

const quickLinks: QuickLink[] = [
  { name: 'e-class', url: 'https://learn.hansung.ac.kr/', icon: '📚', category: '학습' },
  { name: '상상베이스 예약', url: 'https://www.hansung.ac.kr/onestop/8952/subview.do', icon: '🏢', category: '예약' },
  { name: '기자재 대여', url: 'https://hansung.ac.kr/cncschool/7309/subview.do', icon: '🔧', category: '예약' },
  { name: '종합정보시스템', url: 'https://portal.hansung.ac.kr/', icon: '💻', category: '포털' },
  { name: '공지사항', url: 'https://www.hansung.ac.kr/hansung/1633/subview.do', icon: '📢', category: '정보' },
  { name: '도서관', url: 'https://lib.hansung.ac.kr/', icon: '📖', category: '학습' },
  { name: '학사일정', url: 'https://www.hansung.ac.kr/hansung/1640/subview.do', icon: '📅', category: '정보' },
];

function NewTab() {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#f0f2f5', // Lighter background
      overflowY: 'auto', // Enable scrolling for content
      alignItems: 'center', // Center content horizontally
      padding: '20px',
    }}>
      {/* Header section */}
      <div style={{
        width: '100%',
        maxWidth: '800px', // Max width for content
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: '20px 30px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/icon/48.png" alt="logo" style={{ width: '32px', height: '32px', marginRight: '10px' }} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>한성대학교 예약 시스템</div>
            <div style={{ fontSize: '13px', color: '#777' }}>Hansung University Reservation</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Notification icon */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px', color: '#667eea' }}>🔔</span>
            <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', backgroundColor: 'red', borderRadius: '50%' }}></span>
          </div>
          {/* My Page icon */}
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px', color: '#667eea', marginRight: '5px' }}>👤</span>
            <span style={{ fontSize: '15px', color: '#333', fontWeight: '500' }}>마이페이지</span>
          </div>
        </div>
      </div>

      {/* Two main cards */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
      }}>
        {/* Card 1: 스터디룸 예약 */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          padding: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          border: '1px solid #e0e0e0',
          transition: 'all 0.2s ease',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '30px', background: '#eef2ff', padding: '12px', borderRadius: '10px', color: '#4f46e5' }}>📍</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>스터디룸 예약</div>
            <div style={{ fontSize: '14px', color: '#777' }}>Study Room Reservation</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '24px', color: '#999' }}>›</div>
        </div>

        {/* Card 2: 기자재 대여 */}
        <div style={{
          flex: 1,
          background: '#667eea',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          border: '1px solid #667eea',
          color: 'white',
          transition: 'all 0.2s ease',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '30px', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '10px', color: 'white' }}>📦</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>기자재 대여</div>
            <div style={{ fontSize: '14px' }}>Equipment Borrowing</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '24px' }}>›</div>
        </div>
      </div>

      {/* Search and Date Picker */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: '20px 30px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '10px 15px',
        }}>
          <span style={{ marginRight: '10px', color: '#999' }}>🔍</span>
          <input
            type="text"
            placeholder="기자재 검색..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
            }}
          />
        </div>
        <button style={{
          background: '#4f46e5',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '18px' }}>📅</span> 날짜 선택
        </button>
      </div>

      {/* Available Equipment for Rent (Placeholder) */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: '20px 30px',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>대여 가능한 기자재</h2>
        {/* Placeholder for equipment items */}
        <div style={{ color: '#999', fontSize: '14px' }}>
          대여 가능한 기자재 목록이 여기에 표시됩니다.
        </div>
      </div>

      {/* My Reservations (Placeholder) */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: '20px 30px',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>나의 예약</h2>
        {/* Placeholder for reservation items */}
        <div style={{ color: '#999', fontSize: '14px' }}>
          나의 예약 내역이 여기에 표시됩니다.
        </div>
      </div>

      {/* Quick Links */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: '20px 30px',
        marginBottom: '20px',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px',
        }}>
          ⚡ 빠른 링크
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {quickLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                background: '#f8f8f8',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#333',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                border: '1px solid #eee',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.1)';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#eee';
              }}
            >
              <div style={{
                fontSize: '28px',
                marginRight: '15px',
              }}>
                {link.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}>
                  {link.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                }}>
                  {link.category}
                </div>
              </div>
              <div style={{
                fontSize: '18px',
                color: '#667eea',
              }}>
                →
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NewTab />
  </React.StrictMode>,
);
