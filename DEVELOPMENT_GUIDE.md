# 한성대학교 예약 시스템 UI/UX 개선 - 개발 가이드

## 🏗️ 프로젝트 구조

```
hansung-reservation-ext/
├── entrypoints/
│   ├── popup/                    # 익스텐션 팝업
│   │   ├── App.tsx              # 팝업 메인
│   │   ├── LinkArea.jsx         # 링크 버튼
│   │   └── index.html
│   │
│   └── content-script/          # 페이지 수정 스크립트
│       ├── goods/
│       │   └── modify-goods-ui.ts   # 기자재 대여 UI 주입
│       └── space/
│           └── modify-space-ui.ts   # 세미나실 예약 UI 주입
│
├── src/
│   ├── components/              # React 컴포넌트
│   │   ├── common/             # 공통 컴포넌트
│   │   │   ├── Card.tsx
│   │   │   └── Button.tsx
│   │   │
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   ├── Layout.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   ├── goods/              # 기자재 관련 컴포넌트
│   │   │   ├── GoodsItem.tsx
│   │   │   └── GoodsList.tsx
│   │   │
│   │   └── space/              # 세미나실 관련 컴포넌트
│   │       ├── SpaceItem.tsx
│   │       └── SpaceList.tsx
│   │
│   └── pages/                  # 페이지 컴포넌트
│       ├── goods/
│       │   ├── GoodsListPage.tsx      # 기자재 목록 페이지
│       │   └── GoodsDetailPage.tsx    # 기자재 상세 페이지
│       │
│       └── space/
│           ├── SpaceListPage.tsx      # 세미나실 목록 페이지
│           └── SpaceDetailPage.tsx    # 세미나실 상세 페이지
│
└── PROJECT_STRUCTURE.md         # 프로젝트 계층 구조 문서
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 모드 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## 📝 작업 분담 가이드

### 팀원 1: 기자재 대여 시스템 UI 개선
**작업 영역:**
- `src/pages/goods/GoodsListPage.tsx` - 기자재 목록 페이지 개선
- `src/pages/goods/GoodsDetailPage.tsx` - 기자재 상세 페이지 개선
- `src/components/goods/` - 기자재 관련 컴포넌트들

**주요 작업:**
- 기자재 카드 디자인 개선
- 검색/필터 기능 UI 구현
- 예약 폼 디자인

### 팀원 2: 세미나실 예약 시스템 UI 개선
**작업 영역:**
- `src/pages/space/SpaceListPage.tsx` - 세미나실 목록 페이지 개선
- `src/pages/space/SpaceDetailPage.tsx` - 세미나실 상세 페이지 개선
- `src/components/space/` - 세미나실 관련 컴포넌트들

**주요 작업:**
- 세미나실 카드 디자인 개선
- 날짜/시간 선택 UI 구현
- 예약 가능 시간표 시각화

### 팀원 3: 공통 컴포넌트 및 레이아웃
**작업 영역:**
- `src/components/common/` - 공통 컴포넌트들
- `src/components/layout/` - 레이아웃 컴포넌트들
- `src/styles/` - 전역 스타일

**주요 작업:**
- Button, Card 등 공통 컴포넌트 스타일링
- 전체 레이아웃 디자인 통일
- 반응형 디자인 적용

### 팀원 4: 팝업 UI 및 전체 통합
**작업 영역:**
- `entrypoints/popup/` - 익스텐션 팝업
- 전체 프로젝트 통합 및 테스트

**주요 작업:**
- 팝업 UI 개선
- 전체 디자인 일관성 검토
- 통합 테스트

## 🎨 디자인 가이드라인

### 현재 상태
- 기본적인 HTML 구조만 구현
- 인라인 스타일로 최소한의 레이아웃만 적용
- 실제 기능은 없고 UI 틀만 존재

### 개선 방향
1. **CSS 모듈 또는 스타일 컴포넌트 도입**
2. **일관된 디자인 시스템 적용**
3. **반응형 디자인**
4. **접근성 고려**

## 📌 주의사항

1. **Content Script 동작 방식**
   - `modify-goods-ui.ts`와 `modify-space-ui.ts`는 실제 한성대 페이지에 접속했을 때 실행됩니다
   - 기존 페이지 내용을 숨기고 우리의 React 컴포넌트를 주입합니다

2. **개발 시 확인 사항**
   - Chrome에서 익스텐션을 로드하여 실제 페이지에서 테스트
   - 개발자 도구 콘솔에서 에러 확인

3. **작업 순서**
   - 먼저 전체 틀(현재 완료) → 개별 페이지 UI 개선 → 통합 및 테스트

## 🔗 대상 URL
- **기자재 대여**: https://hansung.ac.kr/cncschool/7309/subview.do
- **세미나실 예약**: https://www.hansung.ac.kr/onestop/8952/

## 📦 다음 단계
1. 각자 담당 영역의 컴포넌트 스타일링
2. 실제 데이터 연동 (API 또는 DOM 파싱)
3. 상태 관리 구현
4. 예약 기능 구현
