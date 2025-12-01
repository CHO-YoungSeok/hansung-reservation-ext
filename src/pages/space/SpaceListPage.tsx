import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceList } from '../../components/space/SpaceList';

export const SpaceListPage: React.FC = () => {
  return (
    <Layout title="상상베이스 세미나실 예약">
      <div className="space-list-page">
        <div className="space-list-page__filters">
          {/* 나의 신청내역 버튼 */}
          <button
            type="button"
            className="space-list-page__my-reservations-button"
            onClick={() => {
              window.location.href =
                'https://www.hansung.ac.kr/onestop/8952/subview.do?enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZvbmVzdG9wJTJGMjElMkZhcnRjbFZpZXcuZG8lM0Y%3D';
            }}
          >
            나의 신청내역
          </button>
        </div>
        <SpaceList />
      </div>
    </Layout>
  );
};
