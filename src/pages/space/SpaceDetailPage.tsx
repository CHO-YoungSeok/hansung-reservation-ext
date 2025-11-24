import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';

export const SpaceDetailPage: React.FC = () => {
  return (
    <Layout title="세미나실 상세">
      <div className="space-detail-page">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="space-image" style={{ 
            width: '100%', 
            height: '300px', 
            backgroundColor: '#f0f0f0',
            marginBottom: '20px'
          }}>
            이미지 영역
          </div>
          
          <h2>세미나실 이름</h2>
          <p>수용 인원: 10명</p>
          <p>시설: 빔프로젝터, 화이트보드</p>
          <p>위치: 상상파크 3층</p>
          
          <div className="reservation-section" style={{ marginTop: '30px' }}>
            <h3>예약 정보</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>예약 날짜: </label>
              <input type="date" style={{ padding: '8px', marginLeft: '10px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>사용 시간: </label>
              <input type="time" style={{ padding: '8px', marginLeft: '10px' }} />
              <span> ~ </span>
              <input type="time" style={{ padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>사용 인원: </label>
              <input type="number" min="1" style={{ padding: '8px', marginLeft: '10px', width: '80px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>사용 목적: </label>
              <textarea style={{ padding: '8px', marginLeft: '10px', width: '100%', height: '80px' }}></textarea>
            </div>
            <Button variant="primary">예약하기</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
