import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';

export const GoodsDetailPage: React.FC = () => {
  return (
    <Layout title="기자재 상세">
      <div className="goods-detail-page">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="goods-image" style={{ 
            width: '100%', 
            height: '300px', 
            backgroundColor: '#f0f0f0',
            marginBottom: '20px'
          }}>
            이미지 영역
          </div>
          
          <h2>기자재 이름</h2>
          <p>카테고리: 컴퓨터</p>
          <p>상태: 예약가능</p>
          
          <div className="reservation-section" style={{ marginTop: '30px' }}>
            <h3>예약 정보</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>대여 날짜: </label>
              <input type="date" style={{ padding: '8px', marginLeft: '10px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>대여 시간: </label>
              <input type="time" style={{ padding: '8px', marginLeft: '10px' }} />
              <span> ~ </span>
              <input type="time" style={{ padding: '8px' }} />
            </div>
            <Button variant="primary">예약하기</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
