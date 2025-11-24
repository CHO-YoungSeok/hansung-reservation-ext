import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import mapImage from '@/assets/HSU_map.png';

interface Building {
  id: string;
  name: string;
  url: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
}

interface QuickLink {
  name: string;
  url: string;
  icon: string;
  category: string;
}

const buildings: Building[] = [
  {
    id: 'mirae',
    name: '미래관',
    url: 'https://www.hansung.ac.kr/onestop/8952/subview.do',
    position: { top: '40%', left: '70%' },
    size: { width: '120px', height: '100px' }
  },
  {
    id: 'naksan',
    name: '낙산관',
    url: 'https://www.hansung.ac.kr/onestop/8952/subview.do',
    position: { top: '75%', left: '92%' },
    size: { width: '120px', height: '100px' }
  },
  {
    id: 'gonghak',
    name: '공학관',
    url: 'https://hansung.ac.kr/cncschool/7309/subview.do',
    position: { top: '90%', left: '38%' },
    size: { width: '140px', height: '80px' }
  },
  {
    id: 'uchon',
    name: '우촌관',
    url: 'https://www.hansung.ac.kr/onestop/8952/subview.do',
    position: { top: '5%', left: '65%' },
    size: { width: '120px', height: '60px' }
  },
];

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
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const handleBuildingClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden',
    }}>
      {/* 좌측+중앙: 캠퍼스 맵 */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '36px',
          marginBottom: '30px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}>
          🏫 한성대학교 캠퍼스
        </h1>

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          height: '600px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}>

          {/* 캠퍼스 맵 이미지 */}
          <img
            src={mapImage}
            alt="한성대학교 캠퍼스 맵"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* 건물 클릭 영역 */}
          {buildings.map((building) => (
            <div
              key={building.id}
              onClick={() => handleBuildingClick(building.url)}
              onMouseEnter={() => setHoveredBuilding(building.id)}
              onMouseLeave={() => setHoveredBuilding(null)}
              style={{
                position: 'absolute',
                top: building.position.top,
                left: building.position.left,
                width: building.size.width,
                height: building.size.height,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: hoveredBuilding === building.id
                  ? 'rgba(102, 126, 234, 0.8)'
                  : 'rgba(255, 255, 255, 0.3)',
                border: '2px solid',
                borderColor: hoveredBuilding === building.id ? '#667eea' : 'rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div style={{
                color: hoveredBuilding === building.id ? 'white' : '#333',
                fontSize: '18px',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                transition: 'color 0.3s ease',
              }}>
                {building.name}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 우측: 바로가기 사이드바 */}
      <div style={{
        width: '320px',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
        padding: '30px 20px',
        overflowY: 'auto',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #667eea',
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
                background: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#333',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                border: '1px solid #f0f0f0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#f0f0f0';
              }}
            >
              <div style={{
                fontSize: '32px',
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
          {/* 안내 텍스트 */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '40%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            backdropFilter: 'blur(4px)',
          }}>
            💡 건물을 클릭하면 예약 페이지로 이동합니다
          </div>
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
