// src/utils/calendarEvents.ts
import { TimeSlot } from '../components/space/SpaceDetailForm/types';

export interface RawEvent {
  date: string;       // "2025-11-03"
  room: string;       // "세미나실(IB111)" 또는 "IB111" 또는 "그룹스터디실(4F)"
  timeRanges: string; // "13:00~17:00" 또는 "13:00~15:00,16:00~17:00"
  unavailable: boolean; // true = 그 시간대는 이미 예약/신청불가
}

function pad2(n: string | number) {
  const s = String(n);
  return s.length === 1 ? '0' + s : s;
}

/**
 * 이 확장은 "두 개의 예약 캘린더 페이지"에서만 동작한다고 가정한다.
 * - /onestop/8952/subview.do  (세미나실)
 * - /hsel/9611/subview.do     (그룹스터디실)
 */
function isSupportedCalendarPage(): boolean {
  if (typeof window === 'undefined') return true; // 테스트 환경 고려용
  const href = window.location.href;
  return (
    href.includes('/onestop/8952/subview.do') ||
    href.includes('/hsel/9611/subview.do')
  );
}

/**
 * 페이지 전체 텍스트에서 "2025년 11월" 같은 패턴만 뽑는다.
 * 두 페이지 모두 상단에
 *   "이전달 2025년 11월 다음달"
 * 이런 텍스트가 있으므로, 굳이 복잡한 selector는 안 쓴다.
 */
export function getYearMonthFromPage(doc: Document) {
  let yyyy = '0000';
  let mm = '00';

  if (!isSupportedCalendarPage()) {
    // 혹시 다른 페이지에서 잘못 호출되더라도 크래쉬는 안 나게
    const now = new Date();
    return {
      yyyy: String(now.getFullYear()),
      mm: pad2(now.getMonth() + 1),
    };
  }

  const text =
    (doc.body?.innerText ||
      doc.body?.textContent ||
      doc.documentElement?.innerText ||
      doc.documentElement?.textContent ||
      ''
    ).replace(/\s+/g, ' ');

  const m = text.match(/(\d{4})\s*년\s*(\d{1,2})\s*월/);
  if (m) {
    yyyy = m[1];
    mm = pad2(m[2]);
  } else {
    // 혹시라도 못 찾으면 오늘 날짜로
    const now = new Date();
    yyyy = String(now.getFullYear());
    mm = pad2(now.getMonth() + 1);
  }

  console.log('[calendar] getYearMonthFromPage 결과:', { yyyy, mm });
  return { yyyy, mm };
}

/**
 * 현재 페이지(한성대 예약 달력)에서 events 추출
 * - 대상 페이지는 세미나실/그룹스터디실 두 개뿐
 */
export function extractEventsFromDom(
  doc: Document = document,
): { events: RawEvent[]; yyyy: string; mm: string } {
  const { yyyy, mm } = getYearMonthFromPage(doc);
  const TDs = Array.from(doc.querySelectorAll<HTMLTableCellElement>('td'));
  const events: RawEvent[] = [];

  console.log('[calendar] extractEventsFromDom 시작:', { yyyy, mm });

  // 세미나실(IB111), IB101, 그룹스터디실(4F) 등
  const ROOM_NAME_RE =
    /(세미나실\(IB\d+\)|IB\d{3}|그룹스터디실\([^)]*\))/;

  // 1) 방이름 + 시간 + (선택)신청불가/예약가능 한 줄짜리 패턴
  //    예) "IB105 09:00~17:00 신청불가"
  //        "IB105 09:00~17:00 예약가능"
  const fullLineRe = new RegExp(
    ROOM_NAME_RE.source +
      String.raw`\s+` +
      String.raw`(\d{1,2}:\d{2}~\d{1,2}:\d{2}(?:\s*,\s*\d{1,2}:\d{2}~\d{1,2}:\d{2})*)` +
      String.raw`\s*(신청불가|예약가능)?`
  );

  // 2) "- 세미나실(IB111)" / "- IB103" / "- 그룹스터디실(4F)" 같은 줄
  const dashRoomRe = new RegExp(
    String.raw`^-\s*` + ROOM_NAME_RE.source + String.raw`$`
  );

  // 3) 시간만 있는 줄
  //    예) "13:00~16:00"
  //        "12:00~13:00,14:00~15:00"
  const timeOnlyRe =
    /^(\d{1,2}:\d{2}~\d{1,2}:\d{2}(?:\s*,\s*\d{1,2}:\d{2}~\d{1,2}:\d{2})*)$/;

  TDs.forEach((td) => {
    const lines = (td.innerText || '')
      .replace(/\r/g, '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!lines.length) return;

    // 맨 위에 있는 "4", "15" 같은 날짜 찾기
    const dayIdx = lines.findIndex((x) => /^\d{1,2}$/.test(x));
    if (dayIdx === -1) return;

    const day = pad2(lines[dayIdx]);  // "4" → "04"
    const rest = lines.slice(dayIdx + 1);

    let currentRoom: string | null = null;

    for (const line of rest) {
      console.log('[calendar][raw line]', { day, line });

      // 1) "IB105 09:00~17:00 신청불가" 형태
      const mFull = line.match(fullLineRe);
      if (mFull) {
        const room = mFull[1];
        const timeRanges = mFull[2].replace(/\s+/g, '');
        const statusText = (mFull[3] ?? '').trim(); // "신청불가" | "예약가능" | ""
        // "신청불가" → true, "예약가능" → false, 없으면 true라고 가정(이미 채워진 시간)
        const unavailable =
          statusText === '신청불가' || statusText === '' ? true : false;

        events.push({
          date: `${yyyy}-${mm}-${day}`,
          room,
          timeRanges,
          unavailable,
        });

        currentRoom = room;
        console.log('[calendar][matched-full]', {
          day,
          room,
          timeRanges,
          unavailable,
        });
        continue;
      }

      // 2) "- IB103" / "- 세미나실(IB111)" / "- 그룹스터디실(4F)" 형태
      const mRoom = line.match(dashRoomRe);
      if (mRoom) {
        currentRoom = mRoom[1];
        console.log('[calendar][room-line]', { day, room: currentRoom });
        continue;
      }

      // 3) 시간만 있는 줄 (현재 room에 붙이는 방식)
      const mTime = line.match(timeOnlyRe);
      if (mTime && currentRoom) {
        const timeRanges = mTime[1].replace(/\s+/g, '');
        // 세미나실/그룹스터디실 페이지 특성상, 시간 줄이 있다는 건
        // 그 시간은 이미 예약된(사용불가) 시간이라고 보고 전부 true 처리
        events.push({
          date: `${yyyy}-${mm}-${day}`,
          room: currentRoom,
          timeRanges,
          unavailable: true,
        });
        console.log('[calendar][matched-time-only]', {
          day,
          room: currentRoom,
          timeRanges,
        });
        continue;
      }

      // 그 외는 무시 (예: 안내문, "전체 세미나실(IB111) IB101 ..." 등)
      console.log('[calendar][no match]', { day, line, currentRoom });
    }
  });

  console.log('[calendar] extractEventsFromDom 완료:', {
    totalEvents: events.length,
    sample: events.slice(0, 10),
  });

  return { events, yyyy, mm };
}

/**
 * 캐시 + DOM 파싱해서 RawEvent[] 얻기
 */
const CALENDAR_EVENTS_KEY = 'SPACE_CALENDAR_EVENTS_V1';

export function getEventsFromWindowOrDom(
  doc: Document = document,
): RawEvent[] {
  const win = window as any;

  // 1) 같은 탭 내에서 이미 파싱한 적 있으면 재사용
  if (Array.isArray(win.__SPACE_CALENDAR_EVENTS__)) {
    return win.__SPACE_CALENDAR_EVENTS__ as RawEvent[];
  }

  // 2) sessionStorage 캐시 사용
  try {
    const stored = sessionStorage.getItem(CALENDAR_EVENTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        win.__SPACE_CALENDAR_EVENTS__ = parsed;
        console.log('[calendar] sessionStorage에서 이벤트 복원:', parsed.length);
        return parsed as RawEvent[];
      }
    }
  } catch (e) {
    console.warn('[calendar] sessionStorage 파싱 오류:', e);
  }

  // 3) DOM에서 직접 추출
  const { events } = extractEventsFromDom(doc);
  win.__SPACE_CALENDAR_EVENTS__ = events;

  try {
    sessionStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('[calendar] sessionStorage 저장 오류:', e);
  }

  console.log('[calendar] DOM에서 직접 이벤트 추출:', events.length);
  return events;
}

/**
 * 한 방(roomName) + 특정 날짜(dateStr)에 대해 09~21시 슬롯을 만들어서
 * unavailable=true인 구간을 blocked로 표시한 TimeSlot[]을 만든다.
 *
 * ex) dateStr = "2025-11-03"
 * - roomName 은 "IB104" 또는 "그룹스터디실(4F)" 같은 값으로 올 것이라고 가정
 */
export function buildTimeSlotsForRoom(
  roomName: string,
  dateStr: string,
): TimeSlot[] {
  const events = getEventsFromWindowOrDom();

  console.log('[timeSlots] roomName=', roomName, 'dateStr=', dateStr);
  console.log('[timeSlots] events.length=', events.length);
  console.log('[timeSlots] sample events=', events.slice(0, 5));

  // 기본 09~21시 한 시간 단위 슬롯
  const baseSlots: TimeSlot[] = [];
  for (let h = 9; h < 21; h++) {
    const id = pad2(h);
    baseSlots.push({
      id,
      label: `${pad2(h)}:00-${pad2(h + 1)}:00`,
      status: 'available',
    });
  }

  // 해당 방 + 날짜에 해당하는 unavailable=true 이벤트만 필터링
  const blockedEvents = events.filter(
    (ev) =>
      ev.date === dateStr &&
      ev.unavailable &&
      // "세미나실(IB111)" 과 "IB111" / "IB104" 같이 매칭되도록 includes 사용
      ev.room.includes(roomName),
  );

  console.log('[timeSlots] blockedEvents.length=', blockedEvents.length);
  console.log('[timeSlots] blockedEvents sample=', blockedEvents.slice(0, 5));

  // 각 이벤트의 timeRanges를 파싱해서 해당 범위의 슬롯을 blocked로 변경
  blockedEvents.forEach((ev) => {
    const ranges = ev.timeRanges.split(','); // "13:00~15:00,16:00~17:00"
    ranges.forEach((range) => {
      const [start, end] = range.split('~'); // "13:00", "15:00"
      const startHour = parseInt(start.split(':')[0], 10);
      const endHour = parseInt(end.split(':')[0], 10);

      for (let h = startHour; h < endHour; h++) {
        const targetId = pad2(h);
        const slot = baseSlots.find((s) => s.id === targetId);
        if (slot) {
          slot.status = 'blocked';
        }
      }
    });
  });

  return baseSlots;
}
