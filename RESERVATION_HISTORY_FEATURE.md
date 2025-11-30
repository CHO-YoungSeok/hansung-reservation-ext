# 예약 내역 조회 기능

## 개요

이 기능은 한성대학교 기자재 및 스터디룸 예약 내역을 가져와서 사용자에게 보여주는 기능입니다.

## 구현된 기능

### 1. 데이터 파싱 및 API (`entrypoints/content-script/fetch/reservationHistory.ts`)

#### 기자재 예약 내역
- **URL**: `https://hansung.ac.kr/cncschool/7309/subview.do?enc=...lendArtclList.do`
- **파싱 데이터**:
  - 번호, 기자재명, 예약 날짜, 예약 시간, 신청자명, 학번, 상태
  - 상세보기/수정/취소 URL

#### 스터디룸 예약 내역
- **URL**: `https://www.hansung.ac.kr/onestop/8952/subview.do?enc=...artclView.do`
- **파싱 데이터**:
  - 번호, 공간명, 예약 날짜, 예약 시간대 목록, 신청자명, 학번, 신청일자, 상태
  - 수정/취소 URL

#### 제공 함수
```typescript
// 기자재 예약 내역 가져오기
fetchGoodsReservations(): Promise<GoodsReservation[]>

// 스터디룸 예약 내역 가져오기
fetchStudyRoomReservations(): Promise<StudyRoomReservation[]>

// 모든 예약 내역 가져오기
fetchAllReservations(): Promise<{goods, studyRoom}>

// 최근 N개 예약 내역 가져오기 (기본 3개)
fetchRecentReservations(limit?: number): Promise<{goods, studyRoom}>
```

### 2. UI 컴포넌트

#### 전체 뷰 컴포넌트 (`src/components/reservation/RecentReservations.tsx`)

최근 예약 내역을 카드 형식으로 보여주는 React 컴포넌트입니다.

**기능**:
- 기자재 예약 내역과 스터디룸 예약 내역을 각각 표시
- 각 예약마다 상태 표시 (승인, 승인대기, 반려, 취소)
- 상세보기/수정/취소 링크 제공 (새 탭에서 열림)
- 로딩 상태 및 에러 처리
- 반응형 그리드 레이아웃

**사용법**:
```tsx
import { RecentReservations } from '../../components/reservation/RecentReservations';

// 기본 사용 (최근 3개씩 표시)
<RecentReservations />

// 개수 지정
<RecentReservations limit={5} />
```

#### 컴팩트 뷰 컴포넌트 (`src/components/reservation/CompactRecentReservations.tsx`)

홈페이지용 간결한 예약 내역 표시 컴포넌트입니다.

**기능**:
- 기자재 예약과 스터디룸 예약을 **각각 별도로 표시**
- 각 섹션에 제목과 예약 건수 표시 (💻 기자재 예약 3건, 📍 스터디룸 예약 3건)
- 한 줄 레이아웃으로 간결하게 표시
- 아이콘으로 기자재/스터디룸 구분 (💻/📍)
- 상태 뱃지와 아이콘 표시 (✓ 승인, ⏱ 승인대기, ✗ 반려, ⊘ 취소)
- 상세보기/수정/취소 버튼 제공
- "전체 예약 내역 보기" 링크 포함

**사용법**:
```tsx
import { CompactRecentReservations } from '../../components/reservation/CompactRecentReservations';

// 기본 사용 (기자재 3개, 스터디룸 3개 표시)
<CompactRecentReservations />

// 개수 지정 (기자재 5개, 스터디룸 5개 표시)
<CompactRecentReservations limit={5} />
```

### 3. 페이지 통합

- **기자재 페이지**: `src/pages/goods/GoodsListPage.tsx`의 "나의 신청내역" 탭에 `RecentReservations` 컴포넌트 통합
- **홈페이지**: `entrypoints/hansungHomePage/main.tsx`의 "최근 예약" 섹션에 `CompactRecentReservations` 컴포넌트 통합 (기자재 3개, 스터디룸 3개 표시)

## 사용 방법

### 홈페이지에서 확인
1. 한성대학교 홈페이지를 열면 "최근 예약" 섹션이 자동으로 표시됨
2. 두 개의 섹션으로 구분되어 표시:
   - **💻 기자재 예약**: 최신 3개 표시
   - **📍 스터디룸 예약**: 최신 3개 표시
3. 각 예약 항목에서:
   - 아이콘과 이름으로 예약 대상 확인
   - 예약 날짜 및 시간 표시
   - 상태 뱃지로 승인 여부 확인 (✓ 승인, ⏱ 승인대기, ✗ 반려, ⊘ 취소)
   - 👁 버튼: 상세보기 (기자재만)
   - ✎ 버튼: 수정
   - ✗ 버튼: 취소
4. "전체 예약 내역 보기 →" 링크를 클릭하면 전체 예약 페이지로 이동

### 기자재 예약 페이지에서 확인
1. 기자재 예약 페이지에서 상단 메뉴의 **"나의 신청내역"** 버튼 클릭
2. 최근 기자재 예약 3건과 스터디룸 예약 3건이 각각 카드 형식으로 표시됨
3. 각 예약 카드에서:
   - **상세보기**: 예약 상세 정보 확인 (기자재만)
   - **수정**: 예약 정보 수정
   - **취소**: 예약 취소

## 데이터 구조

### GoodsReservation
```typescript
{
  id: string;
  type: 'goods';
  goodsName: string;
  reservationDate: string;
  timeRange: string;
  applicantName: string;
  studentId: string;
  status: '승인대기' | '승인' | '반려' | '취소';
  detailUrl?: string;
  editUrl?: string;
  cancelUrl?: string;
}
```

### StudyRoomReservation
```typescript
{
  id: string;
  type: 'studyroom';
  roomName: string;
  reservationDate: string;
  timeSlots: string[];
  applicantName: string;
  studentId: string;
  applicationDate: string;
  status: '승인대기' | '승인' | '반려' | '취소';
  editUrl?: string;
  cancelUrl?: string;
}
```

## 스타일링

- 기자재 예약: 파란색 테마 (#0066cc)
- 스터디룸 예약: 초록색 테마 (#10b981)
- 상태별 색상:
  - 승인: 초록색 (#10b981)
  - 승인대기: 주황색 (#f59e0b)
  - 반려: 빨간색 (#ef4444)
  - 취소: 회색 (#6b7280)

## 주의사항

- 예약 내역을 가져오려면 한성대학교 포털에 로그인되어 있어야 합니다.
- `credentials: 'include'` 옵션으로 쿠키를 포함하여 요청합니다.
- HTML 파싱에 의존하므로, 한성대 웹사이트 구조가 변경되면 파싱 로직 업데이트가 필요할 수 있습니다.

## 향후 개선 사항

- [ ] 캐싱 기능 추가 (중복 요청 방지)
- [ ] 페이지네이션 추가 (더 많은 예약 내역 보기)
- [ ] 필터링 기능 (날짜, 상태별)
- [ ] 정렬 기능 (날짜순, 상태순)
- [ ] 새로고침 버튼 추가
- [ ] 예약 취소/수정 기능을 팝업으로 직접 처리
