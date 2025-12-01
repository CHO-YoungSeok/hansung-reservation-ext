import React, { useState, useMemo } from 'react';
import { SpaceItem } from './SpaceItem';
import spaceListData from './data/spaceListData.json';
import { getReservationUrl } from '../../config/space';
import './SpaceList.css';

import type { TimeSlot } from './SpaceReservationForm/types';
import { buildTimeSlotsForRoom } from '../../utils/calendarEvents';
import { getTodayString } from '../../utils/dateUtils';


interface Space {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: 'available' | 'reserved' | 'unavailable';
  location?: string;
  description?: string;
  coverImageUrl?: string;
  managerContact?: string;
  operatingHours?: string;
  roomGroup?: string;
}

interface SpaceListProps {
  // 필요시 커스텀 핸들러를 받을 수 있도록 유지 (확장성)
  onSelectSpace?: (space: Space) => void;
}

export const SpaceList: React.FC<SpaceListProps> = ({ onSelectSpace }) => {
  const [spaces] = useState<Space[]>(spaceListData as Space[]);
  const today = getTodayString();


  // 방 id → TimeSlot[] 맵
  const timeSlotsById = useMemo<Record<string, TimeSlot[]>>(() => {
    const result: Record<string, TimeSlot[]> = {};
    spaces.forEach((space) => {
      // 화면에 보여지는 이름(세미나실(IB111), IB101 등) 기준으로 만든다
      result[space.id] = buildTimeSlotsForRoom(space.name, today);
    });
    return result;
  }, [spaces, today]);

  const handleSelectSpace = (id: string) => {
    const selected = spaces.find((space) => space.id === id);
    if (!selected) {
      console.warn('선택한 세미나실을 찾을 수 없습니다:', id);
      return;
    }

    if (onSelectSpace) {
      // 커스텀 핸들러가 있으면 사용
      onSelectSpace(selected);
    } else {
      // 기본 동작: enc 파라미터가 있는 URL로 이동
      const reservationUrl = getReservationUrl(selected.id);
      window.location.href = reservationUrl;
    }
  };

  return (
  <div className="space-list">
    <a href="https://www.hansung.ac.kr/onestop/8952/subview.do?enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZvbmVzdG9wJTJGMjElMkZhcnRjbFZpZXcuZG8lM0Y%3D" title="나의 신청내역">나의 신청내역</a>
    {spaces.map((item) => (
      <SpaceItem
        key={item.id}
        {...item}
        timeSlots={timeSlotsById[item.id]}
        onSelect={handleSelectSpace}
      />
    ))}
  </div>
);
};
