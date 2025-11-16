# 한성대학교 예약 시스템 UI/UX 개선 프로젝트 - 페이지 계층 구조

## 1. 기자재 대여 시스템 (Goods Reservation)
**URL**: `https://hansung.ac.kr/cncschool/7309/subview.do`

### 페이지 구조
```
기자재 대여 메인
├── 기자재 목록 페이지 (GoodsListPage)
│   ├── 검색/필터 섹션
│   ├── 카테고리 필터
│   └── 기자재 카드 그리드
│
├── 기자재 상세 페이지 (GoodsDetailPage)
│   ├── 기자재 정보
│   ├── 예약 가능 날짜/시간
│   └── 예약 버튼
│
└── 예약 확인 페이지 (ReservationConfirmPage)
    ├── 예약 정보 확인
    └── 최종 제출
```

## 2. 상상베이스 세미나실 예약 (Space Reservation)
**URL**: `https://www.hansung.ac.kr/onestop/8952/*`

### 페이지 구조
```
세미나실 예약 메인
├── 공간 목록 페이지 (SpaceListPage)
│   ├── 날짜 선택
│   ├── 시간대 필터
│   └── 세미나실 카드 그리드
│
├── 공간 상세 페이지 (SpaceDetailPage)
│   ├── 세미나실 정보
│   ├── 시설 정보
│   ├── 예약 가능 시간표
│   └── 예약 버튼
│
└── 예약 확인 페이지 (ReservationConfirmPage)
    ├── 예약 정보 확인
    └── 최종 제출
```

## 3. 공통 컴포넌트
```
공통 컴포넌트
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
│
├── UI Components
│   ├── Card (카드 컴포넌트)
│   ├── Button (버튼)
│   ├── Input (입력 필드)
│   ├── DatePicker (날짜 선택)
│   ├── TimePicker (시간 선택)
│   └── Modal (모달)
│
└── Reservation Components
    ├── ReservationForm (예약 폼)
    ├── ReservationCalendar (예약 캘린더)
    └── ReservationStatus (예약 상태)
```

## 4. 팀 분담 제안
- **팀원 1**: 기자재 대여 시스템 UI 개선
- **팀원 2**: 세미나실 예약 시스템 UI 개선
- **팀원 3**: 공통 컴포넌트 및 레이아웃
- **팀원 4**: 팝업 UI 및 전체 통합

